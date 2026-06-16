/**
 * functions/api/donate/webhook.js
 * POST /api/donate/webhook — HMAC-verified payment webhook from pay.iai.one
 *
 * SECURITY INVARIANTS:
 *   1. If env.PAY_DSTS_HMAC (or PAY_IAI_ONE_HMAC) is set in production,
 *      ALL requests MUST present a valid signature header. Missing
 *      header → 401 SIGNATURE_REQUIRED. Bad signature → 401 SIGNATURE_INVALID.
 *      Fail-CLOSED, never fail-open.
 *   2. Unknown donation_id (no matching row in donations table) → log webhook
 *      with processed=1, return ok+ignored, but NEVER call sendDonationReceipt
 *      and NEVER write donation_email_dispatches. Audit integrity.
 *   3. Replay protection via donation_webhook_log.event_id unique guard.
 */

import { sendAndLogDonationReceipt } from "../../_lib/email.js";

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
  const hmacSecret = env.PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC;
  const rawBody = await request.text();
  const signature = (
    request.headers.get("x-iai-signature") ||
    request.headers.get("x-webhook-signature") ||
    ""
  ).trim();

  // FAIL-CLOSED: HMAC secret is required in production
  if (!hmacSecret) {
    return errorJson("HMAC_SECRET_NOT_CONFIGURED", "Webhook HMAC secret not configured.", 500);
  }
  
  if (!signature) {
    return errorJson("SIGNATURE_REQUIRED", "Webhook signature header required.", 401);
  }
  const valid = await verifyHmac(hmacSecret, rawBody, signature);
  if (!valid) return errorJson("SIGNATURE_INVALID", "Webhook signature mismatch.", 401);

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
    // Replay protection
    const existing = await env.DB.prepare(
      "SELECT id FROM donation_webhook_log WHERE event_id = ?"
    ).bind(eventId).first();
    if (existing) return json({ ok: true, replayed: true });

    await env.DB.prepare(`
      INSERT OR IGNORE INTO donation_webhook_log (id, event_id, event_type, donation_id, payload, processed)
      VALUES (?, ?, ?, ?, ?, 0)
    `).bind(randomId("dwh"), eventId, eventType, donationId, rawBody).run();

    if (donationId && (eventType === "payment.completed" || eventType === "order.paid")) {
      // Verify donation exists BEFORE any side-effects (mail, dispatch row, status update)
      const donation = await env.DB.prepare(`
        SELECT id, donor_email, donor_name, amount_vnd, status
        FROM donations
        WHERE id = ?
      `).bind(donationId).first();

      if (!donation) {
        // Unknown donation — close out the webhook log but produce no audit pollution
        await env.DB.prepare(`
          UPDATE donation_webhook_log SET processed = 1 WHERE event_id = ?
        `).bind(eventId).run();
        return json({ ok: true, ignored: "unknown_donation_id", donation_id: donationId });
      }

      // Update donation status (idempotent, only if not already completed)
      await env.DB.prepare(`
        UPDATE donations
        SET status = 'completed', completed_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ? AND status != 'completed'
      `).bind(donationId).run();

      // Single canonical send-and-log path (writes donation_email_dispatches row)
      await sendAndLogDonationReceipt(env, { donation, eventId, source: "webhook" });

      await env.DB.prepare(`
        UPDATE donation_webhook_log SET processed = 1 WHERE event_id = ?
      `).bind(eventId).run();
    } else if (donationId && (eventType === "payment.failed" || eventType === "payment.canceled")) {
      // Handle payment failure/cancellation
      await env.DB.prepare(`
        UPDATE donations SET status = 'failed', updated_at = datetime('now') WHERE id = ?
      `).bind(donationId).run();

      await env.DB.prepare(`
        UPDATE donation_webhook_log SET processed = 1 WHERE event_id = ?
      `).bind(eventId).run();
    } else if (donationId && eventType === "payment.refunded") {
      // Handle payment refund
      await env.DB.prepare(`
        UPDATE donations SET status = 'refunded', updated_at = datetime('now') WHERE id = ?
      `).bind(donationId).run();

      await env.DB.prepare(`
        UPDATE donation_webhook_log SET processed = 1 WHERE event_id = ?
      `).bind(eventId).run();
    }
  }

  return json({ ok: true });
};
