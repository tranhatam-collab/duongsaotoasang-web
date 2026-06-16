/**
 * functions/_lib/rate-limit.js
 * Rate limiting middleware for API endpoints
 */

/**
 * Check if rate limit is exceeded for a given identifier (IP, email, etc.)
 * Returns { allowed: true } if under limit, { allowed: false, retryAfter: seconds } if exceeded
 */
export async function checkRateLimit(db, identifier, maxAttempts = 5, windowMinutes = 15) {
  if (!db) {
    // If DB not bound, allow all requests (dev mode)
    return { allowed: true };
  }
  
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  
  const result = await db.prepare(
    'SELECT COUNT(*) as count FROM auth_attempts WHERE identifier = ? AND attempted_at > ?'
  ).bind(identifier, windowStart).first();
  
  const count = result?.count || 0;
  
  if (count >= maxAttempts) {
    // Calculate retry after (when oldest attempt expires)
    const oldestAttempt = await db.prepare(
      'SELECT attempted_at FROM auth_attempts WHERE identifier = ? AND attempted_at > ? ORDER BY attempted_at ASC LIMIT 1'
    ).bind(identifier, windowStart).first();
    
    let retryAfter = 0;
    if (oldestAttempt) {
      const oldestTime = new Date(oldestAttempt.attempted_at).getTime();
      const windowEnd = new Date(Date.now() + windowMinutes * 60 * 1000).getTime();
      retryAfter = Math.max(0, Math.ceil((windowEnd - Date.now()) / 1000));
    }
    
    return { allowed: false, retryAfter };
  }
  
  return { allowed: true };
}

/**
 * Log rate limit violation
 */
export async function logRateLimitViolation(db, identifier, ip, userAgent) {
  if (!db) return;
  
  await db.prepare(
    'INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
  ).bind(
    crypto.randomUUID(),
    identifier,
    'rate_limit',
    0,
    ip || 'unknown',
    userAgent || 'unknown'
  ).run();
}
