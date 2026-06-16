// DSTS Layer 2 API — Digital Legacy
// GET /api/legacy?owner_id=&type=&privacy=public
// POST /api/legacy — Upload metadata

export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const { searchParams } = new URL(context.request.url);
    const owner_id = searchParams.get('owner_id');
    const type = searchParams.get('type');
    const privacy = searchParams.get('privacy') || 'public';
    let sql = 'SELECT id, slug, creator_id, story_type, title, summary, subject_name, subject_origin, archive_status, preservation_level, view_count, created_at FROM legacy_stories WHERE archive_status = ?';
    const params = [privacy === 'public' ? 'active' : privacy];
    if (owner_id) { sql += ' AND creator_id = ?'; params.push(owner_id); }
    if (type) { sql += ' AND story_type = ?'; params.push(type); }
    sql += ' ORDER BY created_at DESC LIMIT 100';
    const { results } = await db.prepare(sql).bind(...params).all();
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ ok: true, data: results || [] }), {
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
    const { owner_user_id, item_type, title, description, r2_object_key, privacy_level } = body;
    if (!owner_user_id || !item_type || !title) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    const result = await db.prepare(
      'INSERT INTO legacy_items (owner_user_id, item_type, title, description, r2_object_key, privacy_level) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(owner_user_id, item_type, title, description || '', r2_object_key || '', privacy_level || 'public').run();
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ ok: true, id: result.meta.last_row_id }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Credentials': 'true' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
