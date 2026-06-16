// DSTS Auth — Get Current User
// GET /api/auth/me

import { hashSessionToken } from '../../_lib/auth.js';

export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  
  try {
    const sessionToken = context.request.headers.get('Cookie')?.match(/dsts_session=([^;]+)/)?.[1];
    
    if (!sessionToken) {
      return new Response(JSON.stringify({ ok: false, error: 'No session' }), { status: 401 });
    }
    
    const sessionTokenHash = await hashSessionToken(sessionToken);
    
    // Fetch session with user data
    const session = await db.prepare(
      `SELECT s.user_id, s.expires_at, s.revoked_at, u.id, u.email, u.display_name, u.role 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_token_hash = ?`
    ).bind(sessionTokenHash).first();
    
    if (!session) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid session' }), { status: 401 });
    }
    
    // Check if session is revoked or expired
    if (session.revoked_at || new Date(session.expires_at) < new Date()) {
      return new Response(JSON.stringify({ ok: false, error: 'Session expired' }), { status: 401 });
    }
    
    // Update last_accessed_at
    await db.prepare(
      'UPDATE sessions SET last_accessed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(session.id).run();
    
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ 
      ok: true, 
      user: {
        id: session.id,
        email: session.email,
        display_name: session.display_name,
        role: session.role
      }
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Credentials': 'true' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to get user' }), { status: 500 });
  }
}
