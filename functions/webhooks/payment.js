// DSTS Payment Webhook — POST /webhooks/payment
// HMAC-verified settlement callback from pay.iai.one for the Club payment path
// (/api/payment/create-intent). Mirrors the proven canonical contract used by
// /api/donate/webhook so signature scheme + event fields match exactly:
//   - Signature: HEX HMAC-SHA256 over the raw body, header x-iai-signature
//     (fallback x-webhook-signature). Secret: PAY_DSTS_HMAC / PAY_IAI_ONE_HMAC.
//   - Order key: pay.iai.one sends `order_id` = our internal_order_id, formatted
//     `dsts-pay-{paymentId}-{rand}`; we extract paymentId to update the row.
//   - Paid event types: payment.completed | order.paid.
//   - Fail-CLOSED on missing/invalid signature. Replay guard via
//     payment_webhook_events.event_id.

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

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

// internal_order_id = `dsts-pay-{paymentId}-{rand}` → integer paymentId
function paymentIdFromOrderId(orderId) {
  if (!orderId) return null;
  const m = String(orderId).match(/^dsts-pay-(\d+)-/);
  return m ? parseInt(m[1], 10) : null;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return new Response("DB not bound", { status: 500 });

  const rawBody = await request.text();
  const hmacSecret = env.PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC;
  const signature = (
    request.headers.get("x-iai-signature") ||
    request.headers.get("x-webhook-signature") ||
    ""
  ).trim();

  // Fail-closed signature verification.
  if (!hmacSecret) return json({ ok: false, error: "HMAC_SECRET_NOT_CONFIGURED" }, 500);
  if (!signature) return json({ ok: false, error: "SIGNATURE_REQUIRED" }, 401);
  if (!(await verifyHmac(hmacSecret, rawBody, signature))) {
    return json({ ok: false, error: "SIGNATURE_INVALID" }, 401);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, 400);
  }

  const eventId = body.event_id || body.id || crypto.randomUUID();
  const eventType = body.event_type || body.type || "unknown";
  const orderId = body.order_id || body.internal_order_id || null;
  const providerTxn = body.provider_transaction_id || body.provider_order_id || null;
  const receiptUrl = body.receipt_url || null;

  // Replay guard (event_id dedup).
  const existingEvent = await db.prepare(
    "SELECT id FROM payment_webhook_events WHERE event_id = ?"
  ).bind(eventId).first().catch(() => null);
  if (existingEvent) return json({ ok: true, replayed: true });

  const isPaid = eventType === "payment.completed" || eventType === "order.paid";
  const paymentId = paymentIdFromOrderId(orderId);

  if (isPaid && paymentId) {
    // Unknown-payment guard — never pollute on a non-existent row.
    const payment = await db.prepare("SELECT id, status FROM payments WHERE id = ?")
      .bind(paymentId).first().catch(() => null);
    if (!payment) {
      await db.prepare(
        "INSERT INTO payment_webhook_events (id, event_id, payment_id, processed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
      ).bind(crypto.randomUUID(), eventId, paymentId).run().catch(() => {});
      return json({ ok: true, ignored: "unknown_payment_id", order_id: orderId });
    }

    // Idempotent: only flip if not already completed.
    await db.prepare(
      "UPDATE payments SET status = 'completed', provider_transaction_id = COALESCE(?, provider_transaction_id), receipt_url = COALESCE(?, receipt_url), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status != 'completed'"
    ).bind(providerTxn, receiptUrl, paymentId).run();
  }

  // Log event for replay guard. payment_id is NOT NULL in schema → fall back to
  // the order id (or event id) string when we couldn't resolve a numeric id.
  const replayKey = paymentId != null ? String(paymentId) : (orderId || eventId);
  await db.prepare(
    "INSERT INTO payment_webhook_events (id, event_id, payment_id, processed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(crypto.randomUUID(), eventId, replayKey).run().catch(() => {});

  return json({ ok: true });
}
