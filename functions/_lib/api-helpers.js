/**
 * functions/_lib/api-helpers.js
 * Shared helpers for all Cloudflare Functions API endpoints.
 * Pattern extracted from functions/api/donate/create.js + webhook.js
 */

// ── Response helpers ──────────────────────────────────────────────────────────

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export const ok = (data = {}, status = 200) =>
  json({ ok: true, ...data }, status);

export const err = (code, message, status = 400, extra = {}) =>
  json({ ok: false, error: code, message, ...extra }, status);

// ── Random ID ─────────────────────────────────────────────────────────────────

export function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

// ── JSON body parser with size limit ─────────────────────────────────────────

/**
 * Parse request body as JSON with a max byte limit.
 * Throws with structured error response on failure.
 */
export async function parseBody(request, maxBytes = 8192) {
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > maxBytes) {
    throw err("REQUEST_TOO_LARGE", `Request body exceeds ${maxBytes} bytes.`, 413);
  }
  try {
    return await request.json();
  } catch {
    throw err("INVALID_JSON", "Request body must be valid JSON.");
  }
}

// ── Idempotency guard ─────────────────────────────────────────────────────────

/**
 * Extract or generate idempotency key from request headers.
 */
export function getIdempotencyKey(request) {
  return (
    (request.headers.get("idempotency-key") ||
      request.headers.get("x-idempotency-key") ||
      "").trim() || `auto_${randomId()}`
  );
}

/**
 * Check D1 for an existing row with the given idempotency key.
 * Returns the existing row (truthy) or null.
 *
 * @param {D1Database} db
 * @param {string} table - table name to query
 * @param {string} key   - idempotency_key value
 * @param {string} cols  - columns to SELECT (default "id, status")
 */
export async function checkIdempotency(db, table, key, cols = "id, status") {
  if (!db || !key) return null;
  return db
    .prepare(`SELECT ${cols} FROM ${table} WHERE idempotency_key = ? LIMIT 1`)
    .bind(key)
    .first();
}

// ── Rate limiting via KV ──────────────────────────────────────────────────────

/**
 * Check and increment a sliding-window rate limit stored in Cloudflare KV.
 *
 * @param {KVNamespace} kv
 * @param {string} ip         - client IP
 * @param {string} action     - e.g. "sponsor_inquiry", "event_register"
 * @param {number} max        - max requests allowed in the window
 * @param {number} windowSecs - window size in seconds
 * @returns {{ limited: boolean, remaining: number, resetAt: number }}
 */
export async function checkRateLimit(kv, ip, action, max = 5, windowSecs = 900) {
  if (!kv) return { limited: false, remaining: max, resetAt: 0 };

  const key = `rl:${action}:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + windowSecs;

  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;

  if (count >= max) {
    return { limited: true, remaining: 0, resetAt };
  }

  await kv.put(key, String(count + 1), { expirationTtl: windowSecs });
  return { limited: false, remaining: max - count - 1, resetAt };
}

// ── Cloudflare Turnstile verification ────────────────────────────────────────

/**
 * Verify a Cloudflare Turnstile token.
 * Returns true if valid, false otherwise.
 * Silently passes if TURNSTILE_SECRET_KEY not set (dev mode).
 */
export async function verifyTurnstile(env, token, ip = "") {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // dev / test bypass

  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// ── D1 safe query wrapper ─────────────────────────────────────────────────────

/**
 * Run a D1 prepared statement and return results.
 * Throws with 503 response on DB error.
 *
 * @param {D1Database} db
 * @param {string} sql
 * @param {Array} params
 * @param {"run"|"first"|"all"} mode
 */
export async function d1Query(db, sql, params = [], mode = "run") {
  try {
    const stmt = db.prepare(sql).bind(...params);
    if (mode === "first") return stmt.first();
    if (mode === "all") return (await stmt.all()).results;
    return stmt.run();
  } catch (e) {
    console.error("[d1Query error]", e?.message, { sql, params });
    throw err("DATABASE_ERROR", "A database error occurred.", 503);
  }
}

// ── Client IP ─────────────────────────────────────────────────────────────────

export function getClientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// ── CORS helper ───────────────────────────────────────────────────────────────

/**
 * Add CORS headers. Call this on all responses for public endpoints.
 * For admin endpoints, Cloudflare Access handles auth so CORS can be restrictive.
 * 
 * SECURITY: Use specific origin instead of wildcard to prevent session token theft
 */
export function addCors(response, env) {
  const allowedOrigin = env.PAY_IAI_ONE_CALLBACK_BASE || env.PAY_IAI_ONE_SITE_CODE 
    ? `https://${env.PAY_IAI_ONE_SITE_CODE}.pay.iai.one` 
    : "https://duongsaotoasang.com";
  
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key, Authorization");
  return new Response(response.body, { status: response.status, headers });
}

// ── HMAC verify (reused from webhook.js) ─────────────────────────────────────

export async function verifyHmac(secret, payload, signature) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  let sigBytes;
  try {
    sigBytes = Uint8Array.from(signature.match(/.{2}/g).map((b) => parseInt(b, 16)));
  } catch {
    return false;
  }
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
}
