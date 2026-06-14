// DSTS Auth — Login
// POST /api/auth/login

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const body = await context.request.json();
    const { email, password } = body;
    if (!email || !password) return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });
    const row = await db.prepare('SELECT id, display_name, role FROM users WHERE email = ? AND password_hash = ?').bind(email, password).first();
    if (!row) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    // Set session cookie (simplified — production should use JWT or signed cookie)
    return new Response(JSON.stringify({ ok: true, user: { id: row.id, display_name: row.display_name, role: row.role } }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Set-Cookie': `dsts_session=${row.id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
