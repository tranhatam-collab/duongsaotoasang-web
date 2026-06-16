/**
 * Password Reset — Verify token + Update password
 * POST /api/auth/reset-verify
 *
 * Body: { token, new_password }
 */

import { hashPassword } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const token = (body.token || "").trim();
  const newPassword = body.new_password || "";

  if (!token || token.length !== 64) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
  }
  if (!newPassword || newPassword.length < 8) {
    return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400 });
  }

  // Hash token to compare
  const tokenHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))),
    b => b.toString(16).padStart(2, "0")
  ).join("");

  const row = await db.prepare(
    "SELECT id, user_id, token_hash, expires_at, used_at FROM password_reset_tokens WHERE token_hash = ?"
  ).bind(tokenHash).first();

  if (!row) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
  }
  if (row.used_at) {
    return new Response(JSON.stringify({ error: "Token already used" }), { status: 400 });
  }
  if (new Date(row.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: "Token expired" }), { status: 400 });
  }

  // Hash new password
  const { hash, salt, iterations } = await hashPassword(newPassword);

  await db.prepare(
    "UPDATE users SET password_hash = ?, password_salt = ?, password_iterations = ?, password_algorithm = 'PBKDF2-SHA-256', password_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(hash, salt, iterations, row.user_id).run();

  // Mark token as used
  await db.prepare(
    "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(row.id).run();

  // Revoke all existing sessions for this user
  await db.prepare(
    "UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL"
  ).bind(row.user_id).run();

  return new Response(JSON.stringify({ ok: true, message: "Password updated. Please log in again." }));
}
