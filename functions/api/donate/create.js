/**
 * functions/api/donate/create.js
 * POST /api/donate/create — create donation intent, return checkout_url from pay.iai.one
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

// Inline 2FA helpers — Cloudflare Pages Functions ESM import from _lib/ can fail
async function getSessionUser(db, request) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/dsts_session=([^;]+)/);
  if (!m) return null;
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(m[1]))), b => b.toString(16).padStart(2,"0")).join("");
  return db.prepare("SELECT u.id, u.totp_enabled, u.totp_secret FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.session_token_hash=? AND s.revoked_at IS NULL AND s.expires_at>datetime('now')").bind(hash).first();
}
async function totpVerify(secret, code, win = 1) {
  if (!secret || !code || code.length !== 6) return false;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of cleaned) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  const key = await crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let w = -win; w <= win; w++) {
    const cb = new ArrayBuffer(8);
    new DataView(cb).setUint32(0, 0, false);
    new DataView(cb).setUint32(4, counter + w, false);
    const sig = await crypto.subtle.sign("HMAC", key, new Uint8Array(cb));
    const h = new Uint8Array(sig);
    const off = h[h.length - 1] & 0x0f;
    const bin = ((h[off] & 0x7f) << 24) | ((h[off + 1] & 0xff) << 16) | ((h[off + 2] & 0xff) << 8) | (h[off + 3] & 0xff);
    if (String(bin % 10 ** 6).padStart(6, "0") === code) return true;
  }
  return false;
}
async function check2FAGate(db, user, code) {
  if (!user || user.totp_enabled !== 1) return { ok: true };
  const sec = await db.prepare("SELECT require_2fa_for_payment FROM user_security_settings WHERE user_id=?").bind(user.id).first();
  if (!sec || sec.require_2fa_for_payment !== 1) return { ok: true };
  if (!code) return { ok: false, error: "2FA_REQUIRED", message: "Mã xác thực 2 bước là bắt buộc." };
  if (!await totpVerify(user.totp_secret, code)) return { ok: false, error: "INVALID_2FA_CODE", message: "Mã xác thực không đúng." };
  return { ok: true };
}

export const onRequestPost = async ({ request, env }) => {
  if (!env.PAY_IAI_ONE_API_KEY) {
    return errorJson("PAYMENT_NOT_CONFIGURED", "Donation payments not yet activated.", 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson("INVALID_JSON", "Request body must be valid JSON.");
  }

  // 2FA gate for authenticated users with payment 2FA enabled
  if (env.DB) {
    const sessionUser = await getSessionUser(env.DB, request);
    if (sessionUser) {
      const gate = await check2FAGate(env.DB, sessionUser, body.totp_code);
      if (!gate.ok) return errorJson(gate.error, gate.message, 403);
    }
  }

  const amountVnd = parseInt(body.amount_vnd || body.amount || 0, 10);
  if (!amountVnd || amountVnd < 5000) {
    return errorJson("INVALID_AMOUNT", "Minimum donation is 5,000 VND.");
  }
  if (amountVnd > 100_000_000) {
    return errorJson("INVALID_AMOUNT", "Maximum donation is 100,000,000 VND.");
  }

  const idempotencyKey =
    (request.headers.get("idempotency-key") ||
      request.headers.get("x-idempotency-key") ||
      "").trim() || `auto_${randomId()}`;

  // Replay guard
  if (env.DB) {
    const existing = await env.DB.prepare(
      "SELECT id, checkout_url, status FROM donations WHERE idempotency_key = ?"
    ).bind(idempotencyKey).first();
    if (existing) {
      return json({ ok: true, replayed: true, id: existing.id, status: existing.status, checkout_url: existing.checkout_url });
    }
  }

  const donationId = randomId("don");
  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");
  const tenantCode = String(env.PAY_IAI_ONE_TENANT_CODE || "dsts").trim();
  const siteCode = String(env.PAY_IAI_ONE_SITE_CODE || "duongsaotoasang").trim();
  const provider = String(env.PAY_IAI_ONE_PROVIDER || "payos").trim();
  const callbackBase = String(env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com").replace(/\/+$/, "");

  // Payload schema per pay.iai.one Internal Contract v2026-04-15
  // Reference: docs/PAY_IAI_ONE_INTEGRATION_GROUND_TRUTH_2026-05-15.md
  const callPayload = {
    tenant_code: tenantCode,
    site_code: siteCode,
    provider,
    internal_order_id: donationId,   // pay.iai.one field name (was order_id)
    amount: amountVnd,
    currency: "VND",
    billing_cycle: "one_time",       // required by pay.iai.one contract
    description: body.message
      ? `Ủng hộ DSTS: ${String(body.message).slice(0, 100)}`
      : "Ủng hộ Đường Sao Tỏa Sáng",
    email: body.donor_email || body.email || null,    // was buyer_email
    full_name: body.donor_name || body.name || null,  // was buyer_name
    callback_url: `${callbackBase}/api/donate/webhook`,
    success_url: body.return_url || `${callbackBase}/donate/success.html`,
    cancel_url: `${callbackBase}/donate?status=cancel`,
    metadata: { lane: "b", source: "dsts-donate" },
  };

  let providerRef = null;
  let checkoutUrl = null;

  try {
    // Endpoint: internal contract per pay.iai.one routes
    // (/api/v1/checkout/session is vetuonglai-specific; generic tenants use /internal/checkout-session)
    const resp = await fetch(`${baseUrl}/internal/checkout-session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
        "x-idempotency-key": idempotencyKey,  // was: idempotency-key
      },
      body: JSON.stringify(callPayload),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = data?.message || data?.error || `pay.iai.one responded ${resp.status}`;
      return errorJson("GATEWAY_ERROR", msg, 502);
    }

    checkoutUrl = data.checkout_url || data.checkoutUrl || data.payment_link || data.url || null;
    providerRef = data.order_id || data.provider_ref || data.id || null;
  } catch {
    return errorJson("GATEWAY_UNREACHABLE", "Payment gateway unreachable.", 502);
  }

  if (env.DB) {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO donations
        (id, idempotency_key, amount_vnd, donor_email, donor_name, message,
         provider, provider_ref, checkout_url, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now', '+30 minutes'))
    `).bind(
      donationId, idempotencyKey, amountVnd,
      body.donor_email || body.email || null,
      body.donor_name || body.name || null,
      body.message || null,
      provider, providerRef, checkoutUrl
    ).run();
  }

  return json({ ok: true, id: donationId, checkout_url: checkoutUrl, status: "pending" });
};
