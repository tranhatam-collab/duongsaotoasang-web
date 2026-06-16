// DSTS Layer 1 API — Verified Identity
// GET /api/verify/:id — Public profile
// POST /api/verify/apply — Apply for verification

export async function onRequestGet(context) {
  const { id } = context.params;
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const row = await db.prepare(
      'SELECT id, entity_type, entity_slug, display_name, trust_score, badge_type, status, verified_at, evidence_pack_json FROM verified_entities WHERE entity_slug = ? AND status = "verified"'
    ).bind(id).first();
    if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ ok: true, data: row }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Credentials': 'true' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const body = await context.request.json();
    const { entity_id, entity_type, display_name, evidence_pack_json } = body;
    if (!entity_id || !entity_type || !display_name) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    const result = await db.prepare(
      'INSERT INTO verified_entities (id, entity_type, entity_id, display_name, evidence_pack_json, status) VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, "pending")'
    ).bind(entity_type, entity_id, display_name, evidence_pack_json || '{}').run();
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ ok: true, id: result.meta.last_row_id }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Credentials': 'true' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
