// DSTS Auth — Login
// POST /api/auth/login

import { verifyPassword, generateSessionToken, hashSessionToken } from '../../_lib/auth.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  
  try {
    const body = await context.request.json();
    const { email, password } = body;
    
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });
    }
    
    // Fetch user with password hash metadata
    const row = await db.prepare(
      'SELECT id, email, password_hash, password_salt, password_iterations, password_algorithm, display_name, role FROM users WHERE email = ?'
    ).bind(normalizedEmail).first();
    
    if (!row) {
      // Log failed attempt
      await db.prepare(
        'INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(
        crypto.randomUUID(),
        normalizedEmail,
        'login',
        0,
        context.request.headers.get('CF-Connecting-IP') || 'unknown',
        context.request.headers.get('User-Agent') || 'unknown'
      ).run();
      
      // Generic error message
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    
    // Verify password using PBKDF2
    const isValid = await verifyPassword(password, row.password_hash, row.password_salt, row.password_iterations || 100000);
    
    if (!isValid) {
      // Log failed attempt
      await db.prepare(
        'INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(
        crypto.randomUUID(),
        normalizedEmail,
        'login',
        0,
        context.request.headers.get('CF-Connecting-IP') || 'unknown',
        context.request.headers.get('User-Agent') || 'unknown'
      ).run();
      
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    
    // Generate opaque session token
    const sessionToken = await generateSessionToken();
    const sessionTokenHash = await hashSessionToken(sessionToken);
    
    // Create session (expires in 30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare(
      'INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)'
    ).bind(crypto.randomUUID(), row.id, sessionTokenHash, context.request.headers.get('CF-Connecting-IP') || 'unknown', expiresAt).run();
    
    // Log successful attempt
    await db.prepare(
      'INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(
      crypto.randomUUID(),
      normalizedEmail,
      'login',
      1,
      context.request.headers.get('CF-Connecting-IP') || 'unknown',
      context.request.headers.get('User-Agent') || 'unknown'
    ).run();
    
    return new Response(JSON.stringify({ 
      ok: true, 
      user: { 
        id: row.id, 
        display_name: row.display_name, 
        role: row.role 
      } 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Set-Cookie': `dsts_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
  }
}
