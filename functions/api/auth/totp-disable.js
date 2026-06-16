/**
 * TOTP Disable — Turn off 2FA (requires password confirmation)
 * POST /api/auth/totp-disable
 * Body: { password }
 */

import { verifyPassword } from "../../_lib/auth.js";

function requireAuth(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/dsts_session=([^;]+)/);
  return match ? match[1] : null;
}

async function getUserFromSession(db, sessionToken) {
  if (!sessionToken) return null;
  const tokenHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sessionToken))),
    b => b.toString(16).padStart(2, "0")
  ).join("");
  return db.prepare(
    "SELECT u.id, u.email, u.display_name, u.password_hash, u.password_salt, u.password_iterations, u.totp_enabled, u.totp_secret FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.session_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > datetime('now')"
  ).bind(tokenHash).first();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  const sessionToken = requireAuth(request, env);
  const user = await getUserFromSession(db, sessionToken);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  let body = {};
  try { body = await request.json(); } catch {}

  const password = body.password || "";
  if (!password) {
    return new Response(JSON.stringify({ error: "Password required" }), { status: 400 });
  }

  const valid = await verifyPassword(password, user.password_hash, user.password_salt, user.password_iterations || 100000);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 403 });
  }

  await db.prepare(
    "UPDATE users SET totp_enabled = 0, totp_secret = NULL, totp_verified_at = NULL WHERE id = ?"
  ).bind(user.id).run();

  return new Response(JSON.stringify({ ok: true, totp_enabled: false }));
}
