/**
 * functions/_lib/email-verification.js
 * Email verification flow helpers.
 *
 * Flow:
 *   1. Register → status = 'pending_email_verification', generate token, send email
 *   2. User clicks verification link → /api/auth/verify-email?token=xxx
 *   3. Backend validates token, sets email_verified_at, status = 'active'
 *   4. Login blocked if status = 'pending_email_verification'
 */

import { sendEmail } from "./email.js";

const VERIFICATION_BASE = "https://duongsaotoasang.com";
const TOKEN_EXPIRY_HOURS = 24;

/**
 * Generate a verification token and store its hash in DB.
 * @param {D1Database} db
 * @param {number} userId
 * @returns {Promise<string>} raw token (to embed in link)
 */
export async function createVerificationToken(db, userId) {
  const rawToken = crypto.randomUUID() + "-" + crypto.randomUUID();
  const tokenHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawToken))),
    (b) => b.toString(16).padStart(2, "0")
  ).join("");

  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();
  await db.prepare(
    "INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(crypto.randomUUID(), userId, tokenHash, expiresAt).run();

  return rawToken;
}

/**
 * Send verification email to user.
 * @param {Object} env
 * @param {{ email: string, display_name: string, token: string }} params
 */
export async function sendVerificationEmail(env, { email, display_name, token }) {
  const verifyUrl = `${VERIFICATION_BASE}/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail(env, {
    to: email,
    subject: "Xác thực email — Đường Sao Tỏa Sáng",
    replyTo: "hello@duongsaotoasang.com",
    tags: [{ name: "type", value: "email_verification" }],
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.5rem;color:#e0c896;margin:0 0 16px">Xác thực email của bạn</h1>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px">
    Chào <strong style="color:#e2e8f0">${display_name || "bạn"}</strong>,
  </p>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px">
    Cảm ơn bạn đã đăng ký tài khoản tại Đường Sao Tỏa Sáng.
    Vui lòng xác thực email để kích hoạt tài khoản:
  </p>
  <p style="margin:0 0 24px;text-align:center">
    <a href="${verifyUrl}" style="display:inline-block;background:#e0c896;color:#0b111d;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">
      Xác thực email
    </a>
  </p>
  <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 16px">
    Hoặc sao chép link này vào trình duyệt:<br>
    <span style="color:#94a3b8;word-break:break-all">${verifyUrl}</span>
  </p>
  <p style="color:#64748b;font-size:13px;line-height:1.6;margin:24px 0 0;border-top:1px solid rgba(224,200,150,0.12);padding-top:24px">
    Link có hiệu lực trong ${TOKEN_EXPIRY_HOURS} giờ. Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.
  </p>
</div>`,
  });
}

/**
 * Verify email token — mark user as verified.
 * @param {D1Database} db
 * @param {string} rawToken
 * @returns {Promise<{ ok: boolean, error?: string, userId?: number }>}
 */
export async function verifyEmailToken(db, rawToken) {
  if (!rawToken) return { ok: false, error: "MISSING_TOKEN" };

  const tokenHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawToken))),
    (b) => b.toString(16).padStart(2, "0")
  ).join("");

  const record = await db.prepare(
    "SELECT id, user_id, expires_at, used_at FROM email_verification_tokens WHERE token_hash = ?"
  ).bind(tokenHash).first();

  if (!record) return { ok: false, error: "INVALID_TOKEN" };
  if (record.used_at) return { ok: false, error: "TOKEN_ALREADY_USED" };
  if (new Date(record.expires_at) < new Date()) return { ok: false, error: "TOKEN_EXPIRED" };

  // Mark token as used + verify user
  await db.batch([
    db.prepare("UPDATE email_verification_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?").bind(record.id),
    db.prepare("UPDATE users SET email_verified_at = CURRENT_TIMESTAMP, status = 'active' WHERE id = ?").bind(record.user_id),
  ]);

  return { ok: true, userId: record.user_id };
}
