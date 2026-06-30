/**
 * functions/api/auth/verify-email.js
 * GET /api/auth/verify-email?token=xxx — verify email and activate account
 * POST /api/auth/verify-email/resend — resend verification email (body: { email })
 */

import { verifyEmailToken, createVerificationToken, sendVerificationEmail } from "../../_lib/email-verification.js";

const allowedOrigin = "https://duongsaotoasang.com";

export async function onRequestGet(context) {
  const { env, request } = context;
  const db = env.DB;
  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: "DB_NOT_BOUND" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: "MISSING_TOKEN", message: "Thiếu token xác thực." }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  const result = await verifyEmailToken(db, token);

  if (!result.ok) {
    const messages = {
      INVALID_TOKEN: "Token không hợp lệ.",
      TOKEN_ALREADY_USED: "Token đã được sử dụng.",
      TOKEN_EXPIRED: "Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.",
    };
    return new Response(JSON.stringify({ ok: false, error: result.error, message: messages[result.error] || "Xác thực thất bại." }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  return new Response(JSON.stringify({ ok: true, message: "Email đã được xác thực. Bạn có thể đăng nhập ngay bây giờ." }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
  });
}

// Resend verification email
export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;
  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: "DB_NOT_BOUND" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: "INVALID_JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email) {
    return new Response(JSON.stringify({ ok: false, error: "MISSING_EMAIL" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  const user = await db.prepare(
    "SELECT id, email, display_name, status, email_verified_at FROM users WHERE email = ?"
  ).bind(email).first();

  if (!user) {
    // Don't leak whether email exists
    return new Response(JSON.stringify({ ok: true, message: "Nếu email tồn tại, email xác thực đã được gửi." }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  if (user.email_verified_at) {
    return new Response(JSON.stringify({ ok: true, message: "Email đã được xác thực. Bạn có thể đăng nhập." }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  try {
    const token = await createVerificationToken(db, user.id);
    await sendVerificationEmail(env, { email: user.email, display_name: user.display_name, token });
  } catch (e) {
    console.error("[verify-email/resend] Error:", e?.message);
    return new Response(JSON.stringify({ ok: false, error: "SEND_FAILED" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
    });
  }

  return new Response(JSON.stringify({ ok: true, message: "Email xác thực đã được gửi lại." }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin },
  });
}
