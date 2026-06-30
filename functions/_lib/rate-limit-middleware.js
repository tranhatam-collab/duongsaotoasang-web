/**
 * functions/_lib/rate-limit-middleware.js
 * Generic rate limit middleware for public API endpoints.
 * Uses auth_attempts table with a sliding window per IP.
 *
 * Usage:
 *   import { rateLimitPublic } from "../_lib/rate-limit-middleware.js";
 *   const rl = await rateLimitPublic(context, "donate_create", 10, 60);
 *   if (rl.limited) return rl.response;
 */

import { err } from "./api-helpers.js";

/**
 * Rate limit a public API request by IP.
 * @param {Object} context - Cloudflare Pages Function context
 * @param {string} action - e.g. "donate_create", "register", "contact"
 * @param {number} max - max requests in window (default 10)
 * @param {number} windowMinutes - window in minutes (default 60)
 * @returns {Promise<{ limited: boolean, response?: Response }>}
 */
export async function rateLimitPublic(context, action, max = 10, windowMinutes = 60) {
  const { env, request } = context;
  const db = env.DB;
  if (!db) return { limited: false };

  const ip = request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";

  const identifier = `${action}:${ip}`;
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const result = await db.prepare(
    "SELECT COUNT(*) as count FROM auth_attempts WHERE identifier = ? AND attempted_at > ?"
  ).bind(identifier, windowStart).first();

  const count = result?.count || 0;

  if (count >= max) {
    // Calculate retry-after
    const oldest = await db.prepare(
      "SELECT attempted_at FROM auth_attempts WHERE identifier = ? AND attempted_at > ? ORDER BY attempted_at ASC LIMIT 1"
    ).bind(identifier, windowStart).first();

    let retryAfter = windowMinutes * 60;
    if (oldest) {
      retryAfter = Math.max(1, Math.ceil((new Date(oldest.attempted_at).getTime() + windowMinutes * 60 * 1000 - Date.now()) / 1000));
    }

    return {
      limited: true,
      response: err("RATE_LIMITED", `Quá nhiều yêu cầu. Vui lòng thử lại sau ${Math.ceil(retryAfter / 60)} phút.`, 429, { retryAfter }),
    };
  }

  // Log this attempt
  await db.prepare(
    "INSERT INTO auth_attempts (id, identifier, attempt_type, success, ip_address, user_agent, attempted_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(crypto.randomUUID(), identifier, action, 0, ip, request.headers.get("User-Agent") || "unknown").run();

  return { limited: false };
}
