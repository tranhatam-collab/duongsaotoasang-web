/**
 * functions/api/contact.js
 * POST /api/contact — public inquiry form endpoint
 * Validates input, sends email to founder, returns JSON.
 * No PII stored to D1 unless explicitly required later.
 */

import { sendEmail } from "../_lib/email.js";
import { rateLimitPublic } from "../_lib/rate-limit-middleware.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  // Rate limit: 5 contact submissions/hour per IP
  const rl = await rateLimitPublic(context, "contact", 5, 60);
  if (rl.limited) return rl.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid JSON body." });
  }

  const { name, email, subject, message } = body || {};

  // Validation
  if (!name || !email || !message) {
    return jsonResponse(400, { ok: false, error: "Name, email, and message are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(400, { ok: false, error: "Invalid email format." });
  }
  if (name.length > 100 || email.length > 100 || (subject && subject.length > 200) || message.length > 2000) {
    return jsonResponse(400, { ok: false, error: "Input too long." });
  }

  const founderEmail = env.FOUNDER_EMAIL || "contact@duongsaotoasang.com";
  const mailSubject = subject
    ? `[DSTS Contact] ${subject} — ${name}`
    : `[DSTS Contact] Message from ${name}`;

  const html = `
<div style="font-family:Inter,system-ui,Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px;background:#0b111d;color:#e2e8f0;border-radius:12px;border:1px solid rgba(216,188,119,.2)">
  <h2 style="margin:0 0 20px;color:#e0c896;font-size:1.25rem">New contact form submission</h2>
  <table style="width:100%;border-collapse:collapse;font-size:.95rem;line-height:1.6">
    <tr><td style="padding:6px 0;color:#94a3b8;width:120px">Name</td><td style="color:#e2e8f0">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:6px 0;color:#94a3b8">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#e0c896">${escapeHtml(email)}</a></td></tr>
    ${subject ? `<tr><td style="padding:6px 0;color:#94a3b8">Subject</td><td style="color:#e2e8f0">${escapeHtml(subject)}</td></tr>` : ""}
    <tr><td style="padding:6px 0;color:#94a3b8;vertical-align:top">Message</td><td style="color:#e2e8f0;white-space:pre-wrap">${escapeHtml(message)}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:24px 0">
  <p style="font-size:.8rem;color:#64748b">Sent via duongsaotoasang.com/api/contact · Reply directly to respond</p>
</div>`;

  const result = await sendEmail(env, {
    to: founderEmail,
    subject: mailSubject,
    replyTo: email,
    html,
    tags: [{ name: "type", value: "contact_form" }],
  });

  if (!result.ok) {
    console.error("[contact] email failed", result.error);
    return jsonResponse(502, { ok: false, error: "Unable to send message. Please try again later." });
  }

  return jsonResponse(200, { ok: true, message: "Message sent. We will reply within 3-5 business days." });
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }
  return onRequestPost(context);
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
    },
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
