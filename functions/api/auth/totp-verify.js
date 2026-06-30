/**
 * TOTP Verify — Enable 2FA or verify code
 * POST /api/auth/totp-verify
 * Body: { code } — verifies and enables TOTP
 * PUT /api/auth/totp-verify (no body needed — just check if enabled)
 * GET /api/auth/totp-verify — check status
 *
 * For payment/trust gates:
 * POST /api/auth/totp-verify { code, action: "payment_gate" | "trust_gate" }
 */

import { verifyTotp } from "../../_lib/totp.js";
import { validateCsrf } from "../../_lib/csrf.js";

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
    "SELECT u.id, u.email, u.display_name, u.totp_secret, u.totp_enabled FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.session_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > datetime('now')"
  ).bind(tokenHash).first();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  // CSRF validation
  const csrf = await validateCsrf(db, request);
  if (!csrf.ok) return csrf.response;

  const sessionToken = requireAuth(request, env);
  const user = await getUserFromSession(db, sessionToken);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  let body = {};
  try { body = await request.json(); } catch {}

  const code = (body.code || "").trim();
  const action = (body.action || "setup").trim();

  if (!code || code.length !== 6) {
    return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400 });
  }

  if (!user.totp_secret) {
    return new Response(JSON.stringify({ error: "TOTP not set up" }), { status: 400 });
  }

  const valid = await verifyTotp(user.totp_secret, code);
  if (!valid) {
    // Log failed attempt
    await db.prepare(
      "INSERT INTO totp_verification_log (id, user_id, action, success, ip_address, created_at) VALUES (?, ?, ?, 0, ?, datetime('now'))"
    ).bind(crypto.randomUUID(), user.id, action, request.headers.get("CF-Connecting-IP") || "unknown").run().catch(() => {});
    return new Response(JSON.stringify({ error: "Invalid code" }), { status: 403 });
  }

  // Log success
  await db.prepare(
    "INSERT INTO totp_verification_log (id, user_id, action, success, ip_address, created_at) VALUES (?, ?, ?, 1, ?, datetime('now'))"
  ).bind(crypto.randomUUID(), user.id, action, request.headers.get("CF-Connecting-IP") || "unknown").run().catch(() => {});

  if (action === "setup" && !user.totp_enabled) {
    // Enable TOTP
    await db.prepare(
      "UPDATE users SET totp_enabled = 1, totp_verified_at = datetime('now') WHERE id = ?"
    ).bind(user.id).run();
    return new Response(JSON.stringify({ ok: true, enabled: true }));
  }

  // For payment_gate / trust_gate — return success without changing state
  return new Response(JSON.stringify({ ok: true, verified: true }));
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  const sessionToken = requireAuth(request, env);
  const user = await getUserFromSession(db, sessionToken);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  return new Response(JSON.stringify({
    ok: true,
    totp_enabled: user.totp_enabled === 1,
  }), { headers: { "Content-Type": "application/json" } });
}
