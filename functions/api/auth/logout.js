// DSTS Auth — Logout
// POST /api/auth/logout

import { hashSessionToken } from '../../_lib/auth.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  
  try {
    const sessionToken = context.request.headers.get('Cookie')?.match(/dsts_session=([^;]+)/)?.[1];
    
    if (!sessionToken) {
      const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
      return new Response(JSON.stringify({ ok: true, message: 'No session to revoke' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Credentials': 'true' }
      });
    }
    
    const sessionTokenHash = await hashSessionToken(sessionToken);
    
    // Revoke session
    await db.prepare(
      'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE session_token_hash = ?'
    ).bind(sessionTokenHash).run();
    
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ ok: true, message: 'Logged out' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': 'dsts_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
      }
    });
  } catch (e) {
    console.error('[auth/logout] Error:', e?.message, e?.stack);
    return new Response(JSON.stringify({ error: 'Logout failed' }), { status: 500 });
  }
}
