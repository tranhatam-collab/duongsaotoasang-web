/**
 * functions/api/donate/create.js
 * POST /api/donate/create — create donation intent, return checkout_url from pay.iai.one
 */

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

export const onRequestPost = async ({ request, env }) => {
  if (!env.PAY_IAI_ONE_API_KEY) {
    return errorJson("PAYMENT_NOT_CONFIGURED", "Donation payments not yet activated.", 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson("INVALID_JSON", "Request body must be valid JSON.");
  }

  const amountVnd = parseInt(body.amount_vnd || body.amount || 0, 10);
  if (!amountVnd || amountVnd < 5000) {
    return errorJson("INVALID_AMOUNT", "Minimum donation is 5,000 VND.");
  }
  if (amountVnd > 100_000_000) {
    return errorJson("INVALID_AMOUNT", "Maximum donation is 100,000,000 VND.");
  }

  const idempotencyKey =
    (request.headers.get("idempotency-key") ||
      request.headers.get("x-idempotency-key") ||
      "").trim() || `auto_${randomId()}`;

  // Replay guard
  if (env.DB) {
    const existing = await env.DB.prepare(
      "SELECT id, checkout_url, status FROM donations WHERE idempotency_key = ?"
    ).bind(idempotencyKey).first();
    if (existing) {
      return json({ ok: true, replayed: true, id: existing.id, status: existing.status, checkout_url: existing.checkout_url });
    }
  }

  const donationId = randomId("don");
  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");
  const tenantCode = String(env.PAY_IAI_ONE_TENANT_CODE || "dsts").trim();
  const siteCode = String(env.PAY_IAI_ONE_SITE_CODE || "duongsaotoasang").trim();
  const provider = String(env.PAY_IAI_ONE_PROVIDER || "payos").trim();
  const callbackBase = String(env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com").replace(/\/+$/, "");

  // Payload schema per pay.iai.one Internal Contract v2026-04-15
  // Reference: docs/PAY_IAI_ONE_INTEGRATION_GROUND_TRUTH_2026-05-15.md
  const callPayload = {
    tenant_code: tenantCode,
    site_code: siteCode,
    provider,
    internal_order_id: donationId,   // pay.iai.one field name (was order_id)
    amount: amountVnd,
    currency: "VND",
    billing_cycle: "one_time",       // required by pay.iai.one contract
    description: body.message
      ? `Ủng hộ DSTS: ${String(body.message).slice(0, 100)}`
      : "Ủng hộ Đường Sao Tỏa Sáng",
    email: body.donor_email || body.email || null,    // was buyer_email
    full_name: body.donor_name || body.name || null,  // was buyer_name
    callback_url: `${callbackBase}/api/donate/webhook`,
    success_url: `${callbackBase}/donate?status=success`,
    cancel_url: `${callbackBase}/donate?status=cancel`,
    metadata: { lane: "b", source: "dsts-donate" },
  };

  let providerRef = null;
  let checkoutUrl = null;

  try {
    // Endpoint: internal contract per pay.iai.one routes
    // (/api/v1/checkout/session is vetuonglai-specific; generic tenants use /internal/checkout-session)
    const resp = await fetch(`${baseUrl}/internal/checkout-session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
        "x-idempotency-key": idempotencyKey,  // was: idempotency-key
      },
      body: JSON.stringify(callPayload),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = data?.message || data?.error || `pay.iai.one responded ${resp.status}`;
      return errorJson("GATEWAY_ERROR", msg, 502);
    }

    checkoutUrl = data.checkout_url || data.checkoutUrl || data.payment_link || data.url || null;
    providerRef = data.order_id || data.provider_ref || data.id || null;
  } catch {
    return errorJson("GATEWAY_UNREACHABLE", "Payment gateway unreachable.", 502);
  }

  if (env.DB) {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO donations
        (id, idempotency_key, amount_vnd, donor_email, donor_name, message,
         provider, provider_ref, checkout_url, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now', '+30 minutes'))
    `).bind(
      donationId, idempotencyKey, amountVnd,
      body.donor_email || body.email || null,
      body.donor_name || body.name || null,
      body.message || null,
      provider, providerRef, checkoutUrl
    ).run();
  }

  return json({ ok: true, id: donationId, checkout_url: checkoutUrl, status: "pending" });
};
