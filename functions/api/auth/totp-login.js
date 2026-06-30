/**
 * TOTP Login — Complete 2FA step after password login
 * POST /api/auth/totp-login
 * Body: { temp_token, code }
 */

import { verifyTotp } from "../../_lib/totp.js";
import { generateSessionToken, hashSessionToken } from "../../_lib/auth.js";
import { generateCsrfToken, saveCsrfToken } from "../../_lib/csrf.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const tempToken = (body.temp_token || "").trim();
  const code = (body.code || "").trim();

  if (!tempToken || !code) {
    return new Response(JSON.stringify({ error: "Missing temp_token or code" }), { status: 400 });
  }

  const tempHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tempToken))),
    b => b.toString(16).padStart(2, "0")
  ).join("");

  const session = await db.prepare(
    "SELECT s.id, s.user_id, s.expires_at, u.email, u.display_name, u.role, u.totp_secret, u.totp_enabled FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.session_token_hash = ? AND s.revoked_at IS NULL"
  ).bind(tempHash).first();

  if (!session) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
  }
  if (new Date(session.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: "Token expired" }), { status: 401 });
  }
  if (session.totp_enabled !== 1 || !session.totp_secret) {
    return new Response(JSON.stringify({ error: "2FA not enabled" }), { status: 400 });
  }

  const valid = await verifyTotp(session.totp_secret, code);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid code" }), { status: 403 });
  }

  // Revoke temp session
  await db.prepare("UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?").bind(session.id).run();

  // Issue real session
  const sessionToken = await generateSessionToken();
  const sessionTokenHash = await hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await db.prepare(
    "INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)"
  ).bind(crypto.randomUUID(), session.user_id, sessionTokenHash, request.headers.get("CF-Connecting-IP") || "unknown", expiresAt).run();

  // Generate CSRF token for this session
  const csrfToken = generateCsrfToken();
  await saveCsrfToken(db, sessionTokenHash, csrfToken);

  return new Response(JSON.stringify({
    ok: true,
    csrf_token: csrfToken,
    user: { id: session.user_id, display_name: session.display_name, role: session.role }
  }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `dsts_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
    }
  });
}
