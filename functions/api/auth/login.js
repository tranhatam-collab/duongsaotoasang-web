// DSTS Auth — Login
// POST /api/auth/login

import { verifyPassword, generateSessionToken, hashSessionToken } from '../../_lib/auth.js';
import { checkRateLimit, logRateLimitViolation } from '../../_lib/rate-limit.js';
import { generateCsrfToken, saveCsrfToken } from '../../_lib/csrf.js';

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
    
    // Fetch user with password hash metadata and 2FA status
    const row = await db.prepare(
      'SELECT id, email, password_hash, password_salt, password_iterations, password_algorithm, display_name, role, totp_enabled, status, email_verified_at FROM users WHERE email = ?'
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
    
    // Rate limiting check
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitCheck = await checkRateLimit(db, normalizedEmail, 5, 15);
    if (!rateLimitCheck.allowed) {
      await logRateLimitViolation(db, normalizedEmail, ip, context.request.headers.get('User-Agent') || 'unknown');
      return new Response(JSON.stringify({ 
        error: 'Too many attempts', 
        retryAfter: rateLimitCheck.retryAfter 
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateLimitCheck.retryAfter) }
      });
    }
    
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

    // Block login if email not verified
    if (row.status === 'pending_email_verification' || !row.email_verified_at) {
      return new Response(JSON.stringify({
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư của bạn.'
      }), { status: 403 });
    }

    // Check if 2FA is required
    const requires2FA = row.totp_enabled === 1;
    
    if (requires2FA) {
      // Issue a temporary 2FA challenge token (10 min)
      const tempToken = await generateSessionToken();
      const tempHash = await hashSessionToken(tempToken);
      const tempExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await db.prepare(
        'INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)'
      ).bind(crypto.randomUUID(), row.id, tempHash, context.request.headers.get('CF-Connecting-IP') || 'unknown', tempExpires).run();
      
      const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
      return new Response(JSON.stringify({
        ok: true,
        requires_2fa: true,
        temp_token: tempToken,
        user: { id: row.id, display_name: row.display_name }
      }), {
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Credentials': 'true',
          'Set-Cookie': `__Host-dsts_2fa=${tempToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`
        }
      });
    }
    
    // Generate opaque session token
    const sessionToken = await generateSessionToken();
    const sessionTokenHash = await hashSessionToken(sessionToken);
    
    // Session fixation: Revoke old sessions for this user
    await db.prepare(
      'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL'
    ).bind(row.id).run();
    
    // Create session (expires in 30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare(
      'INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)'
    ).bind(crypto.randomUUID(), row.id, sessionTokenHash, context.request.headers.get('CF-Connecting-IP') || 'unknown', expiresAt).run();

    // Generate CSRF token for this session
    const csrfToken = generateCsrfToken();
    await saveCsrfToken(db, sessionTokenHash, csrfToken);

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

    const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
    return new Response(JSON.stringify({
      ok: true,
      csrf_token: csrfToken,
      user: {
        id: row.id,
        display_name: row.display_name,
        role: row.role
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': `__Host-dsts_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
      }
    });
  } catch (e) {
    console.error('[auth/login] Error:', e?.message, e?.stack);
    return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
  }
}
