// DSTS Auth — Registration
// POST /api/auth/register

import { hashPassword, generateSessionToken, hashSessionToken } from '../../_lib/auth.js';
import { generateCsrfToken, saveCsrfToken } from '../../_lib/csrf.js';
import { createVerificationToken, sendVerificationEmail } from '../../_lib/email-verification.js';
import { rateLimitPublic } from '../../_lib/rate-limit-middleware.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });

  // Rate limit: 5 registrations/hour per IP
  const rl = await rateLimitPublic(context, 'register', 5, 60);
  if (rl.limited) return rl.response;
  
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
      // Log failed attempt
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
    
    // Use db.batch() for atomic transaction (D1 does not support BEGIN/COMMIT via SQL)
    let userId, sessionToken, csrfToken;
    try {
      // Insert user with hashed password — status active but email_verified_at NULL until verified
      const result = await db.prepare(
        'INSERT INTO users (email, password_hash, password_salt, password_iterations, password_algorithm, display_name, role, status, password_updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(normalizedEmail, hash, salt, iterations, 'PBKDF2-SHA-256', display_name, role, 'active').run();

      // Generate session token
      sessionToken = await generateSessionToken();
      const sessionTokenHash = await hashSessionToken(sessionToken);
      userId = result.meta.last_row_id;

      // Create session (expires in 30 days)
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const sessionId = crypto.randomUUID();
      csrfToken = generateCsrfToken();

      // Batch insert session + CSRF token atomically
      await db.batch([
        db.prepare(
          'INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at, csrf_token) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)'
        ).bind(sessionId, userId, sessionTokenHash, context.request.headers.get('CF-Connecting-IP') || 'unknown', expiresAt, csrfToken),
      ]);
    } catch (e) {
      console.error('[auth/register] Transaction failed:', e);
      return new Response(JSON.stringify({ error: 'Registration failed: ' + (e?.message || 'unknown') }), { status: 500 });
    }

    // Send verification email (outside transaction — non-blocking on failure)
    try {
      const verifToken = await createVerificationToken(db, userId);
      await sendVerificationEmail(context.env, { email: normalizedEmail, display_name, token: verifToken });
    } catch (e) {
      console.error('[auth/register] Failed to send verification email:', e?.message);
      // Non-fatal — user can request resend
    }
    
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
    return new Response(JSON.stringify({
      ok: true,
      user_id: userId,
      csrf_token: csrfToken,
      email_verification_required: true,
      message: 'Vui lòng kiểm tra email để xác thực tài khoản.'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': `__Host-dsts_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
      }
    });
  } catch (e) {
    console.error('[auth/register] Error:', e?.message, e?.stack);
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
  }
}
