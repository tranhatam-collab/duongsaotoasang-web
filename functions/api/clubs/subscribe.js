const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
const errorJson = (code, message, status = 400) => json({ ok: false, error: code, message }, status);

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return prefix ? `${prefix}_${Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")}` : Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost = async ({ request, env }) => {
  if (!env.PAY_IAI_ONE_API_KEY) return errorJson("PAYMENT_NOT_CONFIGURED", "Subscription payments not yet activated.", 503);
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  let body;
  try { body = await request.json(); } catch { return errorJson("INVALID_JSON", "Request body must be valid JSON."); }

  const creatorId = (body.creator_id || "").trim();
  const tier = (body.tier || "").trim().toLowerCase();
  const email = (body.email || "").trim();
  const idempotencyKey = body.idempotency_key || `auto_${randomId()}`;

  if (!creatorId) return errorJson("MISSING_CREATOR", "creator_id is required.");
  if (!["member", "circle", "inner_circle"].includes(tier)) return errorJson("INVALID_TIER", "Tier must be: member, circle, inner_circle.");

  const tierPrices = { member: 99000, circle: 299000, inner_circle: 990000 };
  const tierPoints = { member: 100, circle: 400, inner_circle: 1500 };

  const existingSub = await env.DB.prepare(
    "SELECT id, status FROM subscriptions WHERE idempotency_key = ?"
  ).bind(idempotencyKey).first();
  if (existingSub) return json({ ok: true, replayed: true, id: existingSub.id, status: existingSub.status });

  const subId = randomId("sub");
  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");
  const callbackBase = String(env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com").replace(/\/+$/, "");

  const callPayload = {
    tenant_code: env.PAY_IAI_ONE_TENANT_CODE || "dsts",
    site_code: env.PAY_IAI_ONE_SITE_CODE || "duongsaotoasang",
    provider: env.PAY_IAI_ONE_PROVIDER || "payos",
    internal_order_id: subId,
    amount: tierPrices[tier],
    currency: "VND",
    billing_cycle: "monthly",
    description: `DSTS Club ${tier} subscription`,
    email,
    callback_url: `${callbackBase}/api/clubs/subscription/webhook`,
    success_url: `${callbackBase}/account/subscriptions`,
    cancel_url: `${callbackBase}/club`,
    metadata: { lane: "club", tier },
  };

  let checkoutUrl, providerRef;
  try {
    const resp = await fetch(`${baseUrl}/internal/checkout-session`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": String(env.PAY_IAI_ONE_API_KEY), "x-idempotency-key": idempotencyKey },
      body: JSON.stringify(callPayload),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) return errorJson("GATEWAY_ERROR", data?.message || `pay.iai.one ${resp.status}`, 502);
    checkoutUrl = data.checkout_url || data.checkoutUrl || data.url || null;
    providerRef = data.order_id || data.provider_ref || data.id || null;
  } catch { return errorJson("GATEWAY_UNREACHABLE", "Payment gateway unreachable.", 502); }

  await env.DB.prepare(`
    INSERT OR IGNORE INTO subscriptions (id, creator_id, tier, status, provider, provider_subscription_id, amount_vnd, currency, idempotency_key, created_at, updated_at)
    VALUES (?, ?, ?, 'pending', 'payos', ?, ?, 'VND', ?, datetime('now'), datetime('now'))
  `).bind(subId, creatorId, tier, providerRef, tierPrices[tier], idempotencyKey).run();

  await env.DB.prepare(`
    INSERT OR IGNORE INTO subscription_events (id, subscription_id, event_type, payload)
    VALUES (?, ?, 'created', ?)
  `).bind(randomId("sev"), subId, JSON.stringify(callPayload)).run();

  return json({ ok: true, id: subId, checkout_url: checkoutUrl, status: "pending", tier, amount_vnd: tierPrices[tier], monthly_points: tierPoints[tier] });
};
