/**
 * functions/api/trust-iai-verify.js
 * DSTS Layer 5 — trust.iai.one Integration
 * POST /api/trust-iai/verify — submit verification request to trust.iai.one
 * GET  /api/trust-iai/status/:id — check verification status
 *
 * NOTE: Uses TRUST_IAI_ONE_API_KEY secret from Cloudflare (set via wrangler).
 * Falls back to local verification if key not set.
 */

const TRUST_IAI_BASE = "https://trust.iai.one/api/v1";

async function getSessionUser(db, request) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/dsts_session=([^;]+)/);
  if (!m) return null;
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(m[1]))), b => b.toString(16).padStart(2,"0")).join("");
  return db.prepare("SELECT u.id, u.totp_enabled, u.totp_secret FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.session_token_hash=? AND s.revoked_at IS NULL AND s.expires_at>datetime('now')").bind(hash).first();
}

async function hotp(secret, counter) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of cleaned) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  const key = await crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const counterBuf = new ArrayBuffer(8);
  new DataView(counterBuf).setUint32(4, counter, false);
  const sig = await crypto.subtle.sign("HMAC", key, new Uint8Array(counterBuf));
  const hash = new Uint8Array(sig);
  const offset = hash[hash.length - 1] & 0x0f;
  const bin = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);
  return String(bin % 10 ** 6).padStart(6, "0");
}

async function verifyTotp(secret, code, window = 1) {
  if (!secret || !code || code.length !== 6) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) if (await hotp(secret, counter + i) === code) return true;
  return false;
}

async function check2FAGate(db, user, code) {
  if (!user || user.totp_enabled !== 1) return { ok: true };
  const sec = await db.prepare("SELECT require_2fa_for_trust FROM user_security_settings WHERE user_id=?").bind(user.id).first();
  if (!sec || sec.require_2fa_for_trust !== 1) return { ok: true };
  if (!code) return { ok: false, error: "2FA_REQUIRED", message: "Mã xác thực 2 bước là bắt buộc." };
  const v = await verifyTotp(user.totp_secret, code);
  if (!v) return { ok: false, error: "INVALID_2FA_CODE", message: "Mã xác thực không đúng." };
  return { ok: true };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ ok: false, error: 'DB not bound' }), { status: 500 });

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400 });
  }

  const user = await getSessionUser(db, request);
  if (user) {
    const gate = await check2FAGate(db, user, body.totp_code);
    if (!gate.ok) return new Response(JSON.stringify(gate), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const { entity_type, entity_id, evidence_urls } = body || {};
  if (!entity_type || !entity_id) {
    return new Response(JSON.stringify({ ok: false, error: 'entity_type and entity_id required' }), { status: 400 });
  }

  // If no trust.iai.one API key, use local fallback
  if (!env.TRUST_IAI_ONE_API_KEY) {
    console.warn("[trust-iai] No TRUST_IAI_ONE_API_KEY — using local verification fallback");

    // Create local trust verification record
    const id = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO trust_verifications (id, entity_type, entity_id, status, evidence_urls_json, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', ?, datetime('now'), datetime('now'))
    `).bind(id, entity_type, entity_id, JSON.stringify(evidence_urls || [])).run();

    return new Response(JSON.stringify({
      ok: true,
      mode: 'local_fallback',
      verification_id: id,
      status: 'pending',
      message: 'Submitted to local queue. trust.iai.one integration pending founder API key.'
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Real trust.iai.one API call
  try {
    const res = await fetch(`${TRUST_IAI_BASE}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.TRUST_IAI_ONE_API_KEY}`
      },
      body: JSON.stringify({ entity_type, entity_id, evidence_urls })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, error: data.message || `trust.iai.one ${res.status}` }), { status: 502 });
    }

    // Store reference
    await db.prepare(`
      INSERT INTO trust_verifications (id, entity_type, entity_id, status, trust_iai_ref, evidence_urls_json, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', ?, ?, datetime('now'), datetime('now'))
    `).bind(crypto.randomUUID(), entity_type, entity_id, data.verification_id, JSON.stringify(evidence_urls || [])).run();

    return new Response(JSON.stringify({ ok: true, trust_iai: data }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 502 });
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ ok: false, error: 'DB not bound' }), { status: 500 });

  let verificationId = context.params?.id;
  if (Array.isArray(verificationId)) verificationId = verificationId.join('/');
  verificationId = verificationId || new URL(context.request.url).searchParams.get('id');
  if (!verificationId) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });

  try {
    const record = await db.prepare('SELECT * FROM trust_verifications WHERE id = ?').bind(verificationId).first();
    if (!record) return new Response(JSON.stringify({ ok: false, error: 'Not found' }), { status: 404 });

    // If has trust_iai_ref and API key, check external status
    if (record.trust_iai_ref && env.TRUST_IAI_ONE_API_KEY) {
      try {
        const res = await fetch(`${TRUST_IAI_BASE}/verify/${record.trust_iai_ref}`, {
          headers: { 'Authorization': `Bearer ${env.TRUST_IAI_ONE_API_KEY}` }
        });
        const ext = await res.json().catch(() => ({}));
        return new Response(JSON.stringify({ ok: true, local: record, trust_iai: ext }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        // Return local only if external fails
      }
    }

    return new Response(JSON.stringify({ ok: true, local: record }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}
