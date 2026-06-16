/**
 * Session helpers — get user from session cookie, check 2FA requirements.
 */

export async function getUserFromSessionCookie(db, request) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/dsts_session=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  const tokenHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))),
    b => b.toString(16).padStart(2, "0")
  ).join("");

  return db.prepare(
    "SELECT u.id, u.email, u.display_name, u.role, u.totp_enabled, u.totp_secret, u.status FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.session_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > datetime('now')"
  ).bind(tokenHash).first();
}

export async function getUserSecurity(db, userId) {
  const settings = await db.prepare(
    "SELECT require_2fa_for_payment, require_2fa_for_trust, require_2fa_for_login FROM user_security_settings WHERE user_id = ?"
  ).bind(userId).first();
  return settings || { require_2fa_for_payment: 0, require_2fa_for_trust: 0, require_2fa_for_login: 0 };
}

import { verifyTotp } from "./totp.js";

export async function check2FAGate(db, user, action, totpCode) {
  // action: 'payment' | 'trust' | 'login'
  if (!user || user.totp_enabled !== 1) return { ok: true };

  const sec = await getUserSecurity(db, user.id);
  const requires2FA =
    (action === "payment" && sec.require_2fa_for_payment === 1) ||
    (action === "trust" && sec.require_2fa_for_trust === 1) ||
    (action === "login" && sec.require_2fa_for_login === 1);

  if (!requires2FA) return { ok: true };

  if (!totpCode) {
    return { ok: false, error: "2FA_REQUIRED", message: "Mã xác thực 2 bước (Authenticator) là bắt buộc." };
  }

  const valid = await verifyTotp(user.totp_secret, totpCode);
  if (!valid) {
    return { ok: false, error: "INVALID_2FA_CODE", message: "Mã xác thực không đúng." };
  }

  return { ok: true };
}
