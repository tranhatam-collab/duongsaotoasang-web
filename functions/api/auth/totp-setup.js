/**
 * TOTP Setup — Generate secret + QR code URI
 * POST /api/auth/totp-setup
 * Requires authentication (session cookie).
 */

import { generateTotpSecret, buildTotpUri } from "../../_lib/totp.js";

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
    "SELECT u.id, u.email, u.display_name, u.totp_enabled FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.session_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > datetime('now')"
  ).bind(tokenHash).first();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  const sessionToken = requireAuth(request, env);
  const user = await getUserFromSession(db, sessionToken);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const secret = generateTotpSecret();
  const uri = buildTotpUri({ secret, label: user.email, issuer: "DSTS" });

  // Store secret temporarily (not enabled until verified)
  await db.prepare(
    "UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?"
  ).bind(secret, user.id).run();

  return new Response(JSON.stringify({
    ok: true,
    secret,
    uri,
    qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`,
  }), { headers: { "Content-Type": "application/json" } });
}
