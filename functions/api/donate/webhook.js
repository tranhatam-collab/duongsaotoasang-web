/**
 * functions/api/donate/webhook.js
 * POST /api/donate/webhook — HMAC-verified payment webhook from pay.iai.one
 */

import { sendDonationReceipt } from "../../_lib/email.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

async function verifyHmac(secret, payload, signature) {
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

export const onRequestPost = async ({ request, env }) => {
  const hmacSecret = env.PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC || "";
  const rawBody = await request.text();
  const signature = (
    request.headers.get("x-iai-signature") ||
    request.headers.get("x-webhook-signature") ||
    ""
  ).trim();

  if (hmacSecret && signature) {
    const valid = await verifyHmac(hmacSecret, rawBody, signature);
    if (!valid) return errorJson("SIGNATURE_INVALID", "Webhook signature mismatch.", 401);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return errorJson("INVALID_JSON", "Could not parse webhook payload.");
  }

  const eventId = payload.event_id || payload.id || randomId("evt");
  const eventType = payload.event_type || payload.type || "unknown";
  const donationId = payload.order_id || payload.donation_id || null;

  if (env.DB) {
    const existing = await env.DB.prepare(
      "SELECT id FROM donation_webhook_log WHERE event_id = ?"
    ).bind(eventId).first();
    if (existing) return json({ ok: true, replayed: true });

    await env.DB.prepare(`
      INSERT OR IGNORE INTO donation_webhook_log (id, event_id, event_type, donation_id, payload, processed)
      VALUES (?, ?, ?, ?, ?, 0)
    `).bind(randomId("dwh"), eventId, eventType, donationId, rawBody).run();

    if (donationId && (eventType === "payment.completed" || eventType === "order.paid")) {
      await env.DB.prepare(`
        UPDATE donations
        SET status = 'completed', completed_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ? AND status != 'completed'
      `).bind(donationId).run();

      const donation = await env.DB.prepare(`
        SELECT id, donor_email, donor_name, amount_vnd
        FROM donations
        WHERE id = ?
      `).bind(donationId).first();

      const mailResult = await sendDonationReceipt(env, {
        donorEmail: donation?.donor_email || null,
        donorName: donation?.donor_name || null,
        donationId,
        amountVnd: donation?.amount_vnd || 0,
      });

      await env.DB.prepare(`
        UPDATE donation_webhook_log
        SET processed = 1
        WHERE event_id = ?
      `).bind(eventId).run();

      await env.DB.prepare(`
        INSERT OR IGNORE INTO donation_email_dispatches
          (id, donation_id, event_id, recipient_email, provider, provider_message_id, status, response_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        randomId("ded"),
        donationId,
        eventId,
        donation?.donor_email || null,
        mailResult?.provider || (env.MAIL_API_KEY ? "mail_iai_one" : "resend"),
        mailResult?.id || null,
        mailResult?.ok ? "sent" : "failed",
        JSON.stringify(mailResult || {})
      ).run();
    }
  }

  return json({ ok: true });
};
