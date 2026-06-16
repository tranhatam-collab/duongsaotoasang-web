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

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ ok: false, error: 'DB not bound' }), { status: 500 });

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400 });
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
