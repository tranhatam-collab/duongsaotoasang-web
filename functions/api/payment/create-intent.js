// DSTS Payment — Create Payment Intent (canonical pay.iai.one contract)
// POST /api/payment/create-intent
//
// Merchant of record (VN): CÔNG TY CỔ PHẦN GIẢI TRÍ NGÔI SAO VIỆT CAN
//   (V4, MST 0315462505) — F10 lock 2026-05-19. Settlement via pay.iai.one → PayOS.
//
// ⚠️ Canonical rule (ADR + F10): EVERY payment goes through pay.iai.one.
//   - VN lane: provider=payos via /internal/checkout-session (ACTIVE)
//   - INTL lane (Stripe/PayPal direct): DEFERRED — VIET CAN NEW CORP (Georgia C-Corp, USA) — 7722 Stone Meadow Trail, Lithonia, Georgia 30058, USA — not yet
//     activated. Direct-provider bypass is NOT allowed; such requests are
//     rejected with INTL_DEFERRED until Founder activates the US lane.
//
// Endpoint contract: pay.iai.one /internal/checkout-session
//   (/api/v1/checkout/session is vetuonglai-specific; /api/v1/intents does NOT exist)
//   Auth: x-api-key header (NOT Bearer). Idempotency: x-idempotency-key.

// Inline 2FA helpers — Cloudflare Pages Functions ESM import from _lib/ can fail
async function getSessionUser(db, request) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/dsts_session=([^;]+)/);
  if (!m) return null;
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(m[1]))), b => b.toString(16).padStart(2,"0")).join("");
  return db.prepare("SELECT u.id, u.totp_enabled, u.totp_secret FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.session_token_hash=? AND s.revoked_at IS NULL AND s.expires_at>datetime('now')").bind(hash).first();
}
async function totpVerify(secret, code, win = 1) {
  if (!secret || !code || code.length !== 6) return false;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of cleaned) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  const key = await crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let w = -win; w <= win; w++) {
    const cb = new ArrayBuffer(8);
    new DataView(cb).setUint32(0, 0, false);
    new DataView(cb).setUint32(4, counter + w, false);
    const sig = await crypto.subtle.sign("HMAC", key, new Uint8Array(cb));
    const h = new Uint8Array(sig);
    const off = h[h.length - 1] & 0x0f;
    const bin = ((h[off] & 0x7f) << 24) | ((h[off + 1] & 0xff) << 16) | ((h[off + 2] & 0xff) << 8) | (h[off + 3] & 0xff);
    if (String(bin % 10 ** 6).padStart(6, "0") === code) return true;
  }
  return false;
}
async function check2FAGate(db, user, code) {
  if (!user || user.totp_enabled !== 1) return { ok: true };
  const sec = await db.prepare("SELECT require_2fa_for_payment FROM user_security_settings WHERE user_id=?").bind(user.id).first();
  if (!sec || sec.require_2fa_for_payment !== 1) return { ok: true };
  if (!code) return { ok: false, error: "2FA_REQUIRED", message: "Mã xác thực 2 bước là bắt buộc." };
  if (!await totpVerify(user.totp_secret, code)) return { ok: false, error: "INVALID_2FA_CODE", message: "Mã xác thực không đúng." };
  return { ok: true };
}

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

export async function onRequestPost(context) {
  try {
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

  const { amount_cents, currency, description, user_id, type, totp_code } = body;
  const provider = String(body.provider || "payos").toLowerCase();

  // 2FA gate for authenticated users with payment 2FA enabled
  const sessionUser = await getSessionUser(db, request);
  if (sessionUser) {
    const gate = await check2FAGate(db, sessionUser, totp_code);
    if (!gate.ok) return new Response(JSON.stringify(gate), { status: 403, headers: { "Content-Type": "application/json" } });
  }

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
        callback_url: `${callbackBase}/webhooks/payment`,
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

  // Record the pay.iai.one provider reference. Schema note: the payments table
  // has provider_transaction_id (NOT provider_ref/checkout_url), and status is
  // CHECK-constrained to pending/completed/failed/refunded — so we keep status
  // 'pending' here and let the webhook flip it to 'completed' on settlement.
  // checkout_url is returned to the client below (no DB column needed).
  if (providerRef) {
    await db.prepare(
      "UPDATE payments SET provider_transaction_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(providerRef, paymentId).run().catch(() => {});
  }

  return new Response(JSON.stringify({
    ok: true,
    paymentId,
    order_id: internalOrderId,
    provider: "payos",
    checkout_url: checkoutUrl,
    clientAction: checkoutUrl ? { type: "redirect", url: checkoutUrl } : { type: "pending", url: null },
  }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://duongsaotoasang.com" } });
  } catch (e) {
    console.error("create-intent fatal:", e);
    return new Response(JSON.stringify({ ok: false, error: "INTERNAL_ERROR", message: String(e.message || e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
