/**
 * functions/_lib/csrf.js
 * CSRF protection helpers — double-submit token pattern.
 *
 * Flow:
 *   1. On login/register, generate csrf_token and store in sessions table.
 *   2. Return csrf_token in auth response body (frontend stores in memory/meta tag).
 *   3. Frontend sends X-CSRF-Token header on all mutating requests (POST/PATCH/DELETE).
 *   4. validateCsrf() checks header token against session's stored token.
 *
 * Security:
 *   - Token is per-session, rotated on new login.
 *   - Token is cryptographically random (crypto.randomUUID()).
 *   - Only required for authenticated mutating requests (unauthenticated public
 *     endpoints like register/login/contact are protected by rate limiting + reCAPTCHA).
 */

import { err } from "./api-helpers.js";

/**
 * Generate a new CSRF token.
 * @returns {string}
 */
export function generateCsrfToken() {
  return crypto.randomUUID() + "-" + crypto.randomUUID();
}

/**
 * Store CSRF token on a session.
 * @param {D1Database} db
 * @param {string} sessionTokenHash - SHA-256 hash of the session token
 * @param {string} csrfToken
 */
export async function saveCsrfToken(db, sessionTokenHash, csrfToken) {
  await db
    .prepare("UPDATE sessions SET csrf_token = ? WHERE session_token_hash = ?")
    .bind(csrfToken, sessionTokenHash)
    .run();
}

/**
 * Validate CSRF token from request header against the session's stored token.
 * Call this at the top of every mutating endpoint that requires authentication.
 *
 * @param {D1Database} db
 * @param {Request} request
 * @returns {Promise<{ok: true} | {ok: false, response: Response}>}
 */
export async function validateCsrf(db, request) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/__Host-dsts_session=([^;]+)/) || cookie.match(/dsts_session=([^;]+)/);
  if (!match) return { ok: true }; // No session = not authenticated, let auth check handle it

  const token = match[1];
  const tokenHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))),
    (b) => b.toString(16).padStart(2, "0")
  ).join("");

  const headerToken = request.headers.get("X-CSRF-Token") || request.headers.get("x-csrf-token");

  // If session exists but no CSRF header → block
  if (!headerToken) {
    const session = await db
      .prepare("SELECT csrf_token FROM sessions WHERE session_token_hash = ? AND revoked_at IS NULL AND expires_at > datetime('now')")
      .bind(tokenHash)
      .first();
    if (session && session.csrf_token) {
      return {
        ok: false,
        response: err("CSRF_TOKEN_MISSING", "Thiếu CSRF token. Vui lòng tải lại trang.", 403),
      };
    }
    return { ok: true }; // Session without CSRF token (legacy) — allow for now
  }

  // Validate header token against stored token
  const session = await db
    .prepare("SELECT csrf_token FROM sessions WHERE session_token_hash = ? AND revoked_at IS NULL AND expires_at > datetime('now')")
    .bind(tokenHash)
    .first();

  if (!session || !session.csrf_token) return { ok: true }; // No session or legacy — allow

  if (session.csrf_token !== headerToken) {
    return {
      ok: false,
      response: err("CSRF_TOKEN_INVALID", "CSRF token không hợp lệ. Vui lòng tải lại trang.", 403),
    };
  }

  return { ok: true };
}
