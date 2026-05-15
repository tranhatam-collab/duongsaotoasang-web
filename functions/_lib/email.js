/**
 * functions/_lib/email.js
 * Email wrapper using mail.iai.one API (preferred) or Resend (fallback).
 * Falls back gracefully (logs warning) if no mail provider key is set.
 *
 * Templates needed:
 *   Sponsor: auto-reply to inquirer, Founder alert, Sponsor Manager alert
 *   Event:   registration confirm, T-7 reminder, T-1 reminder, T+7 recap
 */

const FROM_ADDRESS = "DSTS <hello@duongsaotoasang.com>";
const RESEND_API = "https://api.resend.com/emails";
const MAIL_IAI_ONE_SEND_API = "https://api.mail.iai.one/v1/send";

// ── Core sender ───────────────────────────────────────────────────────────────

/**
 * Send a single email via Resend.
 * @returns {{ ok: boolean, id?: string, error?: string }}
 */
export async function sendEmail(env, { to, subject, html, replyTo, tags = [] }) {
  if (env.MAIL_API_KEY) {
    return sendViaMailIaiOne(env, { to, subject, html, replyTo, tags });
  }

  if (!env.RESEND_API_KEY) {
    console.warn("[email] MAIL_API_KEY/RESEND_API_KEY not set — skipping email to:", to);
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(tags.length ? { tags } : {}),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[email] Resend error", res.status, data);
      return { ok: false, error: data?.message || `Resend ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (e) {
    console.error("[email] Network error", e?.message);
    return { ok: false, error: e?.message || "network error" };
  }
}

async function sendViaMailIaiOne(env, { to, subject, html, replyTo, tags = [] }) {
  try {
    const recipients = Array.isArray(to) ? to : [to];
    const res = await fetch(MAIL_IAI_ONE_SEND_API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.MAIL_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: recipients,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(env.MAIL_API_WORKSPACE_ID ? { workspace_id: env.MAIL_API_WORKSPACE_ID } : {}),
        ...(tags.length ? { tags } : {}),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[email] mail.iai.one error", res.status, data);
      return { ok: false, error: data?.message || data?.error || `mail.iai.one ${res.status}` };
    }

    return {
      ok: true,
      id: data?.message_id || data?.id || null,
      provider: "mail_iai_one",
      raw: data,
    };
  } catch (e) {
    console.error("[email] mail.iai.one network error", e?.message);
    return { ok: false, error: e?.message || "network error" };
  }
}

// ── Sponsor templates ─────────────────────────────────────────────────────────

export async function sendSponsorAutoReply(env, { inquirerName, inquirerEmail, tierName }) {
  return sendEmail(env, {
    to: inquirerEmail,
    subject: `Cảm ơn bạn đã liên hệ — DSTS Sponsorship "${tierName}"`,
    replyTo: "hello@duongsaotoasang.com",
    tags: [{ name: "type", value: "sponsor_auto_reply" }],
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.5rem;color:#e0c896;margin:0 0 16px">Cảm ơn, ${inquirerName || "bạn"}!</h1>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 16px">
    Chúng tôi đã nhận được yêu cầu tài trợ <strong style="color:#e2e8f0">"${tierName}"</strong> của bạn
    và sẽ liên hệ lại trong vòng <strong>3-5 ngày làm việc</strong>.
  </p>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 32px">
    Trong thời gian chờ, bạn có thể tìm hiểu thêm về sứ mệnh DSTS tại
    <a href="https://duongsaotoasang.com" style="color:#e0c896">duongsaotoasang.com</a>.
  </p>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:0 0 24px">
  <p style="font-size:.8rem;color:#64748b">
    © 2026 Đường Sao Tỏa Sáng · <a href="https://duongsaotoasang.com/legal.html" style="color:#64748b">Chính sách bảo mật</a>
  </p>
</div>`,
  });
}

export async function sendSponsorFounderAlert(env, { inquirerName, inquirerEmail, tierName, company, message }) {
  const founderEmail = env.FOUNDER_EMAIL || "hello@duongsaotoasang.com";
  return sendEmail(env, {
    to: founderEmail,
    subject: `[Sponsor Inquiry] ${tierName} — ${inquirerName}${company ? ` (${company})` : ""}`,
    tags: [{ name: "type", value: "sponsor_founder_alert" }],
    html: `
<div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;border:2px solid #e0c896">
  <h2 style="margin:0 0 16px;color:#0b111d">New Sponsor Inquiry</h2>
  <table style="width:100%;border-collapse:collapse;font-size:.9rem">
    <tr><td style="padding:6px 0;color:#64748b;width:140px">Name</td><td style="color:#0b111d"><strong>${inquirerName}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Email</td><td><a href="mailto:${inquirerEmail}" style="color:#c9a66b">${inquirerEmail}</a></td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Company</td><td style="color:#0b111d">${company || "—"}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Tier</td><td style="color:#0b111d"><strong>${tierName}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#64748b;vertical-align:top">Message</td><td style="color:#0b111d">${message || "—"}</td></tr>
  </table>
  <p style="margin:20px 0 0;font-size:.8rem;color:#64748b">Auto-sent by DSTS Sponsors API · Reply directly to respond</p>
</div>`,
  });
}

// ── Event templates ───────────────────────────────────────────────────────────

export async function sendEventRegistrationConfirm(env, { name, email, eventTitle, startsAt, ticketCode, city }) {
  const dateStr = startsAt
    ? new Date(startsAt).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBD";

  return sendEmail(env, {
    to: email,
    subject: `Xác nhận đăng ký — ${eventTitle}`,
    replyTo: "hello@duongsaotoasang.com",
    tags: [{ name: "type", value: "event_confirm" }],
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.4rem;color:#e0c896;margin:0 0 8px">Đăng ký thành công! 🎉</h1>
  <h2 style="font-size:1.1rem;font-weight:400;color:#e2e8f0;margin:0 0 24px">${eventTitle}</h2>
  <div style="background:rgba(224,200,150,.08);border:1px solid rgba(224,200,150,.2);border-radius:8px;padding:20px;margin:0 0 24px">
    <p style="margin:0 0 8px;color:#94a3b8;font-size:.85rem">Ngày &amp; Giờ</p>
    <p style="margin:0 0 16px;font-size:1rem;font-weight:600">${dateStr}${city ? ` · ${city}` : ""}</p>
    ${ticketCode ? `<p style="margin:0 0 8px;color:#94a3b8;font-size:.85rem">Mã vé</p>
    <p style="margin:0;font-size:1.2rem;font-weight:700;letter-spacing:.08em;color:#e0c896">${ticketCode}</p>` : ""}
  </div>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 16px">
    Vui lòng mang mã vé hoặc email này đến sự kiện để check-in.
  </p>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:24px 0">
  <p style="font-size:.8rem;color:#64748b">
    © 2026 Đường Sao Tỏa Sáng · <a href="https://duongsaotoasang.com/legal.html" style="color:#64748b">Chính sách bảo mật</a>
  </p>
</div>`,
  });
}

export async function sendEventReminder(env, { name, email, eventTitle, startsAt, daysUntil, city }) {
  const dateStr = startsAt
    ? new Date(startsAt).toLocaleDateString("vi-VN", { weekday: "long", month: "long", day: "numeric" })
    : "sắp tới";

  return sendEmail(env, {
    to: email,
    subject: `Nhắc nhở: ${eventTitle} — còn ${daysUntil} ngày`,
    tags: [{ name: "type", value: `event_reminder_T-${daysUntil}` }],
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.3rem;color:#e0c896;margin:0 0 8px">⏰ Còn ${daysUntil} ngày!</h1>
  <h2 style="font-size:1.1rem;font-weight:400;color:#e2e8f0;margin:0 0 20px">${eventTitle}</h2>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 8px">
    <strong style="color:#e2e8f0">Ngày:</strong> ${dateStr}${city ? ` · <strong style="color:#e2e8f0">${city}</strong>` : ""}
  </p>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px">
    Đừng quên mang mã vé của bạn. Hẹn gặp lại tại sự kiện!
  </p>
  <a href="https://duongsaotoasang.com/events.html" style="display:inline-block;background:#c9a66b;color:#0b111d;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700">
    Xem chi tiết sự kiện
  </a>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:32px 0 24px">
  <p style="font-size:.8rem;color:#64748b">© 2026 Đường Sao Tỏa Sáng</p>
</div>`,
  });
}

export async function sendEventRecap(env, { name, email, eventTitle, recapUrl }) {
  return sendEmail(env, {
    to: email,
    subject: `Cảm ơn bạn đã tham gia — ${eventTitle}`,
    tags: [{ name: "type", value: "event_recap" }],
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.4rem;color:#e0c896;margin:0 0 16px">Cảm ơn bạn đã tham gia! ✨</h1>
  <h2 style="font-size:1.1rem;font-weight:400;color:#e2e8f0;margin:0 0 24px">${eventTitle}</h2>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 16px">
    Cảm ơn ${name || "bạn"} đã đồng hành cùng Đường Sao Tỏa Sáng.
    Chúng tôi hy vọng buổi tối đã mang lại cho bạn những cảm xúc và kết nối ý nghĩa.
  </p>
  ${recapUrl ? `<p style="margin:0 0 24px"><a href="${recapUrl}" style="color:#e0c896">Xem ảnh &amp; highlights sự kiện →</a></p>` : ""}
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px">
    Theo dõi DSTS để không bỏ lỡ sự kiện tiếp theo:
    <a href="https://duongsaotoasang.com/events.html" style="color:#e0c896">duongsaotoasang.com/events</a>
  </p>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:24px 0">
  <p style="font-size:.8rem;color:#64748b">© 2026 Đường Sao Tỏa Sáng · <a href="https://duongsaotoasang.com/legal.html" style="color:#64748b">Huỷ đăng ký</a></p>
</div>`,
  });
}

/**
 * sendAndLogDonationReceipt
 *
 * Single canonical path for: payment.completed/order.paid webhook,
 * GET /api/donate/:id pull-through, POST /api/donate/poll sweep.
 *
 * Always writes a `donation_email_dispatches` row (audit invariant) with
 * a precise status value so downstream QA can verify outcomes:
 *
 *   "sent"                  → mail provider returned ok with provider_message_id
 *   "skipped_no_provider"   → MAIL_API_KEY/RESEND_API_KEY both missing
 *   "skipped_no_recipient"  → donor_email null
 *   "skipped"               → provider explicitly returned skipped
 *   "failed"                → provider returned error
 *
 * The caller is responsible for ensuring `donation` is a real row from
 * the donations table — passing a synthetic/unknown donation will be
 * rejected with status "no_donation" and NO dispatch row is written.
 */
export async function sendAndLogDonationReceipt(env, { donation, eventId, source }) {
  if (!donation || !donation.id) {
    return { ok: false, status: "no_donation" };
  }

  const hasMailProvider = !!(env.MAIL_API_KEY || env.RESEND_API_KEY);
  const hasRecipient = !!donation.donor_email;
  const providerLabel = env.MAIL_API_KEY ? "mail_iai_one" : (env.RESEND_API_KEY ? "resend" : "none");

  let mailResult;
  let dispatchStatus;

  if (!hasMailProvider) {
    mailResult = { ok: false, skipped: true, reason: "no_provider" };
    dispatchStatus = "skipped_no_provider";
  } else if (!hasRecipient) {
    mailResult = { ok: false, skipped: true, reason: "no_recipient" };
    dispatchStatus = "skipped_no_recipient";
  } else {
    mailResult = await sendDonationReceipt(env, {
      donorEmail: donation.donor_email,
      donorName: donation.donor_name,
      donationId: donation.id,
      amountVnd: donation.amount_vnd || 0,
    });
    if (mailResult?.ok && mailResult?.skipped) {
      dispatchStatus = "skipped";
    } else if (mailResult?.ok) {
      dispatchStatus = "sent";
    } else {
      dispatchStatus = "failed";
    }
  }

  if (env.DB) {
    const dispatchId =
      (globalThis.crypto?.randomUUID && `ded_${globalThis.crypto.randomUUID().replace(/-/g, "")}`) ||
      `ded_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    const synthEventId = eventId || `${source || "pull"}_${donation.id}_${Date.now()}`;

    await env.DB.prepare(`
      INSERT OR IGNORE INTO donation_email_dispatches
        (id, donation_id, event_id, recipient_email, provider, provider_message_id, status, response_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      dispatchId,
      donation.id,
      synthEventId,
      donation.donor_email || null,
      providerLabel,
      mailResult?.id || null,
      dispatchStatus,
      JSON.stringify(mailResult || {})
    ).run();
  }

  return {
    ok: dispatchStatus === "sent",
    status: dispatchStatus,
    providerMessageId: mailResult?.id || null,
  };
}

export async function sendDonationReceipt(env, { donorEmail, donorName, donationId, amountVnd }) {
  if (!donorEmail) return { ok: true, skipped: true };

  const amount = Number(amountVnd || 0).toLocaleString("vi-VN");
  return sendEmail(env, {
    to: donorEmail,
    subject: `Biên nhận đóng góp DSTS #${donationId}`,
    replyTo: "hello@duongsaotoasang.com",
    tags: [{ name: "type", value: "donation_receipt" }],
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:36px 30px;border-radius:12px">
  <h1 style="font-size:1.4rem;color:#e0c896;margin:0 0 14px">Cảm ơn bạn đã đóng góp cho DSTS</h1>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 18px">
    ${donorName ? `Xin chào <strong style="color:#e2e8f0">${donorName}</strong>,` : "Xin chào,"}
    đóng góp của bạn đã được hệ thống ghi nhận thành công.
  </p>
  <div style="background:rgba(224,200,150,.08);border:1px solid rgba(224,200,150,.2);border-radius:8px;padding:16px 18px;margin:0 0 18px">
    <p style="margin:0 0 8px;color:#94a3b8;font-size:.85rem">Mã giao dịch nội bộ</p>
    <p style="margin:0 0 12px;color:#e2e8f0;font-weight:700;letter-spacing:.03em">${donationId}</p>
    <p style="margin:0 0 8px;color:#94a3b8;font-size:.85rem">Số tiền</p>
    <p style="margin:0;color:#e0c896;font-size:1.2rem;font-weight:700">${amount} VND</p>
  </div>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 12px">
    Đây là email xác nhận tự động cho giao dịch đóng góp trên duongsaotoasang.com.
  </p>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 0">
    Nếu cần đối soát thêm, vui lòng liên hệ
    <a href="mailto:hello@duongsaotoasang.com" style="color:#e0c896">hello@duongsaotoasang.com</a>.
  </p>
</div>`,
  });
}
