/**
 * Password Reset — Request
 * POST /api/auth/reset-request
 *
 * Body: { email }
 * Sends reset link via email (mail.iai.one).
 */

import { sendEmail } from "../../_lib/email.js";

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB not bound" }), { status: 500 });

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
  }

  const user = await db.prepare("SELECT id, email, display_name FROM users WHERE email = ?").bind(email).first();
  if (!user) {
    // Silent success — don't reveal whether email exists
    return new Response(JSON.stringify({ ok: true, message: "If an account exists, a reset link has been sent." }));
  }

  // Generate reset token (32 bytes hex = 64 chars)
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
  const tokenHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))), b => b.toString(16).padStart(2, "0")).join("");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  await db.prepare(
    "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(randomId("prt"), user.id, tokenHash, expiresAt).run();

  // Send email
  const resetUrl = `https://duongsaotoasang.com/reset-password?token=${token}`;
  try {
    await sendEmail(env, {
      to: user.email,
      subject: "Đặt lại mật khẩu DSTS",
      replyTo: "hello@duongsaotoasang.com",
      tags: [{ name: "type", value: "password_reset" }],
      html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.5rem;color:#e0c896;margin:0 0 16px">Đặt lại mật khẩu</h1>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 16px">
    Xin chào ${user.display_name || "bạn"},
  </p>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px">
    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản DSTS. Nhấn vào nút bên dưới để tiếp tục:
  </p>
  <a href="${resetUrl}" style="display:inline-block;background:#c9a66b;color:#0b111d;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:1rem">Đặt lại mật khẩu</a>
  <p style="color:#64748b;font-size:.85rem;margin:24px 0 0">
    Liên kết có hiệu lực trong <strong>1 giờ</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.
  </p>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:24px 0">
  <p style="font-size:.8rem;color:#64748b">© 2026 Đường Sao Tỏa Sáng</p>
</div>`,
    });
  } catch (e) {
    console.error("[reset-request] email failed:", e);
  }

  return new Response(JSON.stringify({ ok: true, message: "If an account exists, a reset link has been sent." }));
}
