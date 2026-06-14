// DSTS Auth — Registration
// POST /api/auth/register

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const body = await context.request.json();
    const { email, password, display_name, role } = body;
    if (!email || !password || !display_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    // Check existing
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 });
    // Insert user (password should be hashed in production — this is skeleton)
    const result = await db.prepare(
      'INSERT INTO users (email, password_hash, display_name, role, status, created_at) VALUES (?, ?, ?, ?, "active", CURRENT_TIMESTAMP)'
    ).bind(email, password, display_name, role || 'member').run();
    return new Response(JSON.stringify({ ok: true, user_id: result.meta.last_row_id }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
