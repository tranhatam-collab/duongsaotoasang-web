// DSTS Auth — Logout
// POST /api/auth/logout

import { hashSessionToken } from '../../_lib/auth.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  
  try {
    const sessionToken = context.request.headers.get('Cookie')?.match(/dsts_session=([^;]+)/)?.[1];
    
    if (!sessionToken) {
      return new Response(JSON.stringify({ ok: true, message: 'No session to revoke' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    const sessionTokenHash = await hashSessionToken(sessionToken);
    
    // Revoke session
    await db.prepare(
      'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE session_token_hash = ?'
    ).bind(sessionTokenHash).run();
    
    return new Response(JSON.stringify({ ok: true, message: 'Logged out' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Set-Cookie': 'dsts_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Logout failed' }), { status: 500 });
  }
}
