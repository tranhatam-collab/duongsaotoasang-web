const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
const errorJson = (code, message, status = 400) => json({ ok: false, error: code, message }, status);

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return prefix ? `${prefix}_${Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")}` : Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyHmac(secret, payload, signature) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  let sigBytes;
  try { sigBytes = Uint8Array.from(signature.match(/.{2}/g).map(b => parseInt(b, 16))); } catch { return false; }
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
}

export const onRequestPost = async ({ request, env }) => {
  const hmacSecret = env.PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC || "";
  const rawBody = await request.text();
  const signature = (request.headers.get("x-iai-signature") || "").trim();

  if (hmacSecret) {
    if (!signature) return errorJson("SIGNATURE_REQUIRED", "Webhook signature header required.", 401);
    const valid = await verifyHmac(hmacSecret, rawBody, signature);
    if (!valid) return errorJson("SIGNATURE_INVALID", "Webhook signature mismatch.", 401);
  }

  let payload;
  try { payload = JSON.parse(rawBody); } catch { return errorJson("INVALID_JSON", "Could not parse webhook payload."); }

  const eventId = payload.event_id || payload.id || randomId("evt");
  const eventType = payload.event_type || payload.type || "unknown";
  const orderId = payload.order_id || payload.subscription_id || null;

  if (!env.DB) return json({ ok: true, note: "no_db" });

  const existing = await env.DB.prepare("SELECT id FROM subscription_events WHERE id = ?").bind(eventId).first();
  if (existing) return json({ ok: true, replayed: true });

  if (orderId && (eventType === "payment.completed" || eventType === "subscription.activated")) {
    const sub = await env.DB.prepare("SELECT id, tier, status FROM subscriptions WHERE id = ?").bind(orderId).first();
    if (!sub) return json({ ok: true, ignored: "unknown_subscription_id" });

    await env.DB.prepare("UPDATE subscriptions SET status = 'active', current_period_start = datetime('now'), current_period_end = datetime('now', '+1 month'), updated_at = datetime('now') WHERE id = ? AND status != 'active'").bind(orderId).run();

    await env.DB.prepare(`INSERT OR IGNORE INTO subscription_events (id, subscription_id, event_type, payload) VALUES (?, ?, ?, ?)`)
      .bind(randomId("sev"), orderId, "activated", rawBody).run();
  }

  if (orderId && eventType === "payment.failed") {
    await env.DB.prepare("UPDATE subscriptions SET status = 'past_due', updated_at = datetime('now') WHERE id = ? AND status = 'active'").bind(orderId).run();
    await env.DB.prepare(`INSERT OR IGNORE INTO subscription_events (id, subscription_id, event_type, payload) VALUES (?, ?, ?, ?)`)
      .bind(randomId("sev"), orderId, "payment_failed", rawBody).run();
  }

  return json({ ok: true });
};
