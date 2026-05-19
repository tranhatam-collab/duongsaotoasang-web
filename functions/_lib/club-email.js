export async function sendAndLogClubReceipt(env, { template, donation, subscription, points }) {
  if (!env.DB) return { ok: false, status: "no_db" };

  const hasMailProvider = !!(env.MAIL_API_KEY || env.RESEND_API_KEY);
  const hasRecipient = !!(donation?.donor_email || subscription?.email);
  const recipientEmail = donation?.donor_email || subscription?.email || null;
  const providerLabel = env.MAIL_API_KEY ? "mail_iai_one" : (env.RESEND_API_KEY ? "resend" : "none");
  const dispatchId = `ced_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const synthEventId = `${template}_${Date.now()}`;

  let dispatchStatus;
  let mailResult;

  if (!hasMailProvider) {
    dispatchStatus = "skipped_no_provider";
    mailResult = { ok: false, skipped: true, reason: "no_provider" };
  } else if (!hasRecipient) {
    dispatchStatus = "skipped_no_recipient";
    mailResult = { ok: false, skipped: true, reason: "no_recipient" };
  } else {
    const subject = template === "subscription_confirm" ? "Xác nhận đăng ký DSTS Club"
      : template === "point_purchase" ? "Xác nhận mua Star Points"
      : template === "reward_redeem" ? "Xác nhận đổi reward"
      : "Thông báo DSTS Club";
    const { sendEmail } = await import("./email.js");
    mailResult = await sendEmail(env, { to: recipientEmail, subject, html: `<p>Cảm ơn bạn!</p><p>Giao dịch DSTS Club của bạn đã được ghi nhận.</p>` });
    dispatchStatus = mailResult?.ok ? "sent" : "failed";
  }

  await env.DB.prepare(`
    INSERT OR IGNORE INTO club_email_dispatches (id, template, recipient_email, provider, provider_message_id, status, response_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(dispatchId, template, recipientEmail, providerLabel, mailResult?.id || null, dispatchStatus, JSON.stringify(mailResult || {})).run();

  return { ok: dispatchStatus === "sent", status: dispatchStatus };
}
