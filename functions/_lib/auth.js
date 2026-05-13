/**
 * functions/_lib/auth.js
 * Authentication helpers for Cloudflare Functions.
 *
 * - Cloudflare Access JWT validation (admin endpoints)
 * - Staff role check (email allowlist)
 * - Bearer token extraction
 * - HMAC verify (re-exported from api-helpers pattern for convenience)
 */

// ── Cloudflare Access JWT ─────────────────────────────────────────────────────

const CF_ACCESS_HEADER = "CF-Access-Jwt-Assertion";
const CF_ACCESS_CERTS_URL_SUFFIX = "/cdn-cgi/access/certs";

/**
 * Validate a Cloudflare Access JWT from the request header.
 * Requires env.CF_ACCESS_TEAM_DOMAIN (e.g. "dsts.cloudflareaccess.com").
 *
 * Returns { ok: true, email, sub, aud, exp } on success.
 * Throws a Response (401) on failure.
 */
export async function requireAccessJWT(request, env) {
  const token = request.headers.get(CF_ACCESS_HEADER);
  if (!token) {
    throw new Response(
      JSON.stringify({ ok: false, error: "ACCESS_JWT_MISSING", message: "Cloudflare Access JWT required." }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN;
  if (!teamDomain) {
    // Dev mode: skip verification but still decode the JWT
    const payload = _decodeJwtPayload(token);
    if (!payload) {
      throw new Response(
        JSON.stringify({ ok: false, error: "ACCESS_JWT_INVALID", message: "Could not decode JWT." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
    console.warn("[auth] CF_ACCESS_TEAM_DOMAIN not set — JWT decoded but NOT verified (dev mode)");
    return payload;
  }

  // Fetch public keys from Cloudflare
  let keys;
  try {
    const certsUrl = `https://${teamDomain}${CF_ACCESS_CERTS_URL_SUFFIX}`;
    const res = await fetch(certsUrl, { cf: { cacheTtl: 300 } });
    const data = await res.json();
    keys = data.keys || data.public_certs || [];
  } catch (e) {
    console.error("[auth] Failed to fetch CF Access certs:", e?.message);
    throw new Response(
      JSON.stringify({ ok: false, error: "ACCESS_CERTS_UNREACHABLE", message: "Could not verify identity." }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  }

  // Verify signature against each public key
  const payload = _decodeJwtPayload(token);
  if (!payload) {
    throw new Response(
      JSON.stringify({ ok: false, error: "ACCESS_JWT_MALFORMED", message: "JWT could not be parsed." }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  const verified = await _verifyJwtSignature(token, keys);
  if (!verified) {
    throw new Response(
      JSON.stringify({ ok: false, error: "ACCESS_JWT_INVALID", message: "JWT signature verification failed." }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  // Check expiry
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Response(
      JSON.stringify({ ok: false, error: "ACCESS_JWT_EXPIRED", message: "JWT has expired." }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  return { ok: true, email: payload.email, sub: payload.sub, aud: payload.aud, exp: payload.exp };
}

// ── Staff role check ──────────────────────────────────────────────────────────

/**
 * Verify that the JWT email is in the STAFF_EMAILS allow-list (env var, comma-separated).
 * Call after requireAccessJWT.
 * Throws 403 if not authorized.
 */
export function requireStaffRole(jwtPayload, env) {
  const staffEmails = (env.STAFF_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (staffEmails.length === 0) {
    // No allow-list configured — allow all authenticated users (dev default)
    console.warn("[auth] STAFF_EMAILS not set — all Access JWT users are treated as staff");
    return true;
  }

  const email = (jwtPayload.email || "").toLowerCase();
  if (!staffEmails.includes(email)) {
    throw new Response(
      JSON.stringify({ ok: false, error: "FORBIDDEN", message: "Your account does not have staff access." }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }
  return true;
}

// ── Bearer token ──────────────────────────────────────────────────────────────

/**
 * Extract Bearer token from Authorization header.
 * Returns the token string, or null if absent/malformed.
 */
export function extractBearer(request) {
  const auth = request.headers.get("Authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

// ── HMAC verify ───────────────────────────────────────────────────────────────

/**
 * Verify HMAC-SHA256 signature (hex-encoded).
 * Used for pay.iai.one webhooks and any other HMAC-signed requests.
 */
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

// ── Private JWT helpers ───────────────────────────────────────────────────────

function _decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

async function _verifyJwtSignature(token, publicKeys) {
  const [headerB64, payloadB64, sigB64] = token.split(".");
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  for (const keyData of publicKeys) {
    try {
      let cryptoKey;
      if (keyData.kty === "RSA") {
        cryptoKey = await crypto.subtle.importKey(
          "jwk", keyData,
          { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
          false, ["verify"]
        );
      } else if (keyData.kty === "EC") {
        cryptoKey = await crypto.subtle.importKey(
          "jwk", keyData,
          { name: "ECDSA", namedCurve: keyData.crv || "P-256" },
          false, ["verify"]
        );
      } else {
        continue;
      }

      const sig = Uint8Array.from(atob(sigB64.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
      const alg = keyData.kty === "EC"
        ? { name: "ECDSA", hash: "SHA-256" }
        : { name: "RSASSA-PKCS1-v1_5" };

      const valid = await crypto.subtle.verify(alg, cryptoKey, sig, data);
      if (valid) return true;
    } catch {
      continue;
    }
  }
  return false;
}
