// DSTS Payment — Create Payment Intent (canonical pay.iai.one contract)
// POST /api/payment/create-intent
//
// Merchant of record (VN): CÔNG TY CỔ PHẦN GIẢI TRÍ NGÔI SAO VIỆT CAN
//   (V4, MST 0315462505) — F10 lock 2026-05-19. Settlement via pay.iai.one → PayOS.
//
// ⚠️ Canonical rule (ADR + F10): EVERY payment goes through pay.iai.one.
//   - VN lane: provider=payos via /internal/checkout-session (ACTIVE)
//   - INTL lane (Stripe/PayPal direct): DEFERRED — Viet Can New Corp US not yet
//     activated. Direct-provider bypass is NOT allowed; such requests are
//     rejected with INTL_DEFERRED until Founder activates the US lane.
//
// Endpoint contract: pay.iai.one /internal/checkout-session
//   (/api/v1/checkout/session is vetuonglai-specific; /api/v1/intents does NOT exist)
//   Auth: x-api-key header (NOT Bearer). Idempotency: x-idempotency-key.

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: "DB_NOT_BOUND" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.PAY_IAI_ONE_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "PAYMENT_NOT_CONFIGURED" }), {
      status: 503, headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "INVALID_JSON" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { amount_cents, currency, description, user_id, type } = body;
  const provider = String(body.provider || "payos").toLowerCase();

  if (!amount_cents || !currency || !description) {
    return new Response(JSON.stringify({ ok: false, error: "MISSING_FIELDS", message: "amount_cents, currency, description required" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  // F10 lock: only the VN PayOS lane is active. Direct Stripe/PayPal is the
  // deferred INTL lane and MUST NOT bypass pay.iai.one.
  if (provider !== "payos") {
    return new Response(JSON.stringify({
      ok: false,
      error: "INTL_DEFERRED",
      message: "Thanh toán quốc tế (Stripe/PayPal) chưa kích hoạt. Hiện chỉ hỗ trợ VietQR qua pay.iai.one (PayOS).",
    }), { status: 422, headers: { "Content-Type": "application/json" } });
  }

  // VND is the anchor currency for the VN PayOS lane (no subunit → amount_cents
  // is the integer VND amount). Reject non-VND for the active lane.
  const currencyUpper = String(currency).toUpperCase();
  if (currencyUpper !== "VND") {
    return new Response(JSON.stringify({ ok: false, error: "UNSUPPORTED_CURRENCY", message: "VN lane chỉ hỗ trợ VND." }), {
      status: 422, headers: { "Content-Type": "application/json" },
    });
  }
  const amountVnd = parseInt(String(amount_cents), 10);
  if (!amountVnd || amountVnd < 1000) {
    return new Response(JSON.stringify({ ok: false, error: "INVALID_AMOUNT" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  // Persist payment record (pending) — idempotency anchor.
  const result = await db.prepare(
    "INSERT INTO payments (user_id, amount_cents, currency, description, type, status, provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(user_id || null, amountVnd, "VND", description, type || "donation", "payos", "pending").run();
  const paymentId = result.meta.last_row_id;

  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");
  const tenantCode = String(env.PAY_IAI_ONE_TENANT_CODE || "dsts").trim();
  const siteCode = String(env.PAY_IAI_ONE_SITE_CODE || "duongsaotoasang").trim();
  const payProvider = String(env.PAY_IAI_ONE_PROVIDER || "payos").trim();
  const callbackBase = String(env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com").replace(/\/+$/, "");

  const internalOrderId = `dsts-pay-${paymentId}-${randomId()}`;
  const idempotencyKey =
    (request.headers.get("idempotency-key") || request.headers.get("x-idempotency-key") || "").trim() ||
    `auto_${randomId()}`;

  let checkoutUrl = null;
  let providerRef = null;

  try {
    const payRes = await fetch(`${baseUrl}/internal/checkout-session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
        "x-idempotency-key": idempotencyKey,
      },
      body: JSON.stringify({
        tenant_code: tenantCode,
        site_code: siteCode,
        provider: payProvider,
        internal_order_id: internalOrderId,
        amount: amountVnd,
        currency: "VND",
        billing_cycle: "one_time",
        description: String(description).slice(0, 200),
        email: body.email || null,
        full_name: body.full_name || null,
        callback_url: `${callbackBase}/api/payment/webhook`,
        success_url: `${callbackBase}/checkout/success?order=${internalOrderId}`,
        cancel_url: `${callbackBase}/`,
        metadata: { payment_id: String(paymentId), type: type || "donation", source: "dsts-create-intent" },
      }),
    });

    const payJson = await payRes.json().catch(() => ({}));
    if (!payRes.ok) {
      const msg = payJson?.message || payJson?.error || `pay.iai.one responded ${payRes.status}`;
      return new Response(JSON.stringify({ ok: false, error: "GATEWAY_ERROR", message: msg, paymentId }), {
        status: 502, headers: { "Content-Type": "application/json" },
      });
    }
    checkoutUrl = payJson.checkout_url || payJson.checkoutUrl || payJson.payment_link || null;
    providerRef = payJson.provider_order_id || payJson.payment_session_id || null;
  } catch (e) {
    console.error("pay.iai.one error:", e);
    return new Response(JSON.stringify({ ok: false, error: "GATEWAY_UNREACHABLE", paymentId }), {
      status: 502, headers: { "Content-Type": "application/json" },
    });
  }

  // Record provider ref + checkout url.
  if (providerRef || checkoutUrl) {
    await db.prepare(
      "UPDATE payments SET provider_ref = ?, checkout_url = ?, status = ? WHERE id = ?"
    ).bind(providerRef, checkoutUrl, checkoutUrl ? "provider_created" : "pending", paymentId)
      .run().catch(() => {});
  }

  return new Response(JSON.stringify({
    ok: true,
    paymentId,
    order_id: internalOrderId,
    provider: "payos",
    checkout_url: checkoutUrl,
    clientAction: checkoutUrl ? { type: "redirect", url: checkoutUrl } : { type: "pending", url: null },
  }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://duongsaotoasang.com" } });
}
