// DSTS Auth — Registration
// POST /api/auth/register

import { hashPassword, generateSessionToken, hashSessionToken } from '../../_lib/auth.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  
  try {
    const body = await context.request.json();
    const { email, password, display_name } = body;
    
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail || !password || !display_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
    }
    
    // Validate password strength
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters with uppercase and number' }), { status: 400 });
    }
    
    // Validate display_name
    if (display_name.length > 100 || display_name.length < 2) {
      return new Response(JSON.stringify({ error: 'Display name must be 2-100 characters' }), { status: 400 });
    }
    
    // Check existing
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(normalizedEmail).first();
    if (existing) {
      // Log auth attempt
      await db.prepare(
        'INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(
        crypto.randomUUID(),
        normalizedEmail,
        'register',
        0,
        context.request.headers.get('CF-Connecting-IP') || 'unknown',
        context.request.headers.get('User-Agent') || 'unknown'
      ).run();
      
      return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 });
    }
    
    // Hash password with PBKDF2-SHA-256
    const { hash, salt, iterations } = await hashPassword(password);
    
    // Force role = 'member' (ignore client role for security)
    const role = 'member';
    
    // Insert user with hashed password
    const result = await db.prepare(
      'INSERT INTO users (email, password_hash, password_salt, password_iterations, password_algorithm, display_name, role, status, password_updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
    ).bind(normalizedEmail, hash, salt, iterations, 'PBKDF2-SHA-256', display_name, role, 'active').run();
    
    // Generate session token
    const sessionToken = await generateSessionToken();
    const sessionTokenHash = await hashSessionToken(sessionToken);
    const userId = result.meta.last_row_id;
    
    // Create session (expires in 30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare(
      'INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)'
    ).bind(crypto.randomUUID(), userId, sessionTokenHash, context.request.headers.get('CF-Connecting-IP') || 'unknown', expiresAt).run();
    
    // Log successful auth attempt
    await db.prepare(
      'INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(
      crypto.randomUUID(),
      normalizedEmail,
      'register',
      1,
      context.request.headers.get('CF-Connecting-IP') || 'unknown',
      context.request.headers.get('User-Agent') || 'unknown'
    ).run();
    
    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': `dsts_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
  }
}
