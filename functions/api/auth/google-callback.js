/**
 * Google OAuth Sign-In Callback
 * POST /api/auth/google-callback
 *
 * Body: { credential: "<Google ID token (JWT)>" }
 *
 * Flow:
 *   1. Client calls Google Identity Services (GIS) → gets ID token (JWT)
 *   2. Client POSTs token here
 *   3. Server verifies JWT signature against Google public keys
 *   4. If valid: create or update user, issue session
 */

import { generateSessionToken, hashSessionToken } from "../../_lib/auth.js";

const GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs";

async function verifyGoogleIdToken(idToken, clientId) {
  // Fetch Google's public keys
  const res = await fetch(GOOGLE_CERTS_URL, { cf: { cacheTtl: 3600 } });
  const { keys } = await res.json();

  // Decode JWT header to find kid
  const [headerB64] = idToken.split(".");
  const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));

  const keyData = keys.find(k => k.kid === header.kid);
  if (!keyData) throw new Error("Key not found");

  // Import key and verify
  const cryptoKey = await crypto.subtle.importKey(
    "jwk", keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["verify"]
  );

  const [h, payload, sig] = idToken.split(".");
  const data = new TextEncoder().encode(`${h}.${payload}`);
  const sigBytes = Uint8Array.from(atob(sig.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));

  const valid = await crypto.subtle.verify({ name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, cryptoKey, sigBytes, data);
  if (!valid) throw new Error("Invalid signature");

  const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

  // Verify audience and issuer
  if (claims.iss !== "https://accounts.google.com" && claims.iss !== "accounts.google.com") {
    throw new Error("Invalid issuer");
  }
  if (claims.aud !== clientId) throw new Error("Invalid audience");
  if (claims.exp * 1000 < Date.now()) throw new Error("Token expired");

  return claims;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new Response(JSON.stringify({ error: "GOOGLE_AUTH_NOT_CONFIGURED" }), { status: 503 });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const idToken = body.credential || body.id_token;
  if (!idToken) return new Response(JSON.stringify({ error: "Missing credential" }), { status: 400 });

  let claims;
  try {
    claims = await verifyGoogleIdToken(idToken, clientId);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid token", detail: e.message }), { status: 401 });
  }

  const email = claims.email?.toLowerCase();
  const name = claims.name || claims.given_name || email.split("@")[0];
  const avatar = claims.picture || null;
  const subject = claims.sub;

  if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });

  // Try to find existing OAuth user or email-matched user
  let user = await db.prepare(
    "SELECT id, email, display_name, role, status, totp_enabled FROM users WHERE oauth_provider = 'google' AND oauth_subject = ?"
  ).bind(subject).first();

  if (!user) {
    // Check by email (user may have registered with password before)
    user = await db.prepare("SELECT id, email, display_name, role, status, totp_enabled FROM users WHERE email = ?").bind(email).first();
    if (user) {
      // Link OAuth to existing account
      await db.prepare(
        "UPDATE users SET oauth_provider = 'google', oauth_subject = ?, oauth_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(subject, JSON.stringify({ avatar }), user.id).run();
    }
  }

  let userId;
  if (!user) {
    // Create new user
    const result = await db.prepare(
      "INSERT INTO users (email, display_name, role, status, oauth_provider, oauth_subject, oauth_data, created_at, updated_at) VALUES (?, ?, 'member', 'active', 'google', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
    ).bind(email, name, subject, JSON.stringify({ avatar })).run();
    userId = result.meta.last_row_id;
    user = { id: userId, email, display_name: name, role: "member", status: "active", totp_enabled: 0 };
  } else {
    userId = user.id;
    if (user.status === "suspended") {
      return new Response(JSON.stringify({ error: "Account suspended" }), { status: 403 });
    }
  }

  // Issue session
  const sessionToken = await generateSessionToken();
  const sessionTokenHash = await hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await db.prepare(
    "INSERT INTO sessions (id, user_id, session_token_hash, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)"
  ).bind(crypto.randomUUID(), userId, sessionTokenHash, request.headers.get("CF-Connecting-IP") || "unknown", expiresAt).run();

  return new Response(JSON.stringify({
    ok: true,
    user: { id: userId, email, display_name: user.display_name, role: user.role },
    requires_2fa: user.totp_enabled === 1,
  }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `dsts_session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`,
    },
  });
}
