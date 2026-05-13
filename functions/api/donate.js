/**
 * functions/api/donate.js — Donation payment lane for duongsaotoasang.com
 *
 * Routes handled:
 *   POST /api/donate/create     — create donation intent, get checkout_url
 *   POST /api/donate/webhook    — HMAC-verified payment webhook from pay.iai.one
 *   GET  /api/donate/:id        — get donation status
 *
 * Environment vars (wrangler.toml [vars]):
 *   PAY_IAI_ONE_BASE_URL        — https://pay.iai.one
 *   PAY_IAI_ONE_TENANT_CODE     — dsts
 *   PAY_IAI_ONE_SITE_CODE       — duongsaotoasang
 *   PAY_IAI_ONE_PROVIDER        — payos
 *   PAY_IAI_ONE_CALLBACK_BASE   — https://duongsaotoasang.com
 *
 * Secrets (wrangler secret put):
 *   PAY_IAI_ONE_API_KEY         — from Team Pay (tenant: dsts)
 *   PAY_DSTS_HMAC               — openssl rand -hex 32
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

async function hmacSha256Hex(secret, payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyHmac(secret, payload, signature) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = Uint8Array.from(
    signature.match(/.{2}/g).map((b) => parseInt(b, 16))
  );
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
}

// ── POST /api/donate/create ───────────────────────────────────────────────────
async function handleDonateCreate(context) {
  const { request, env } = context;

  if (!env.PAY_IAI_ONE_API_KEY) {
    return errorJson("PAYMENT_NOT_CONFIGURED", "Payment not yet activated.", 503);
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

  const callPayload = {
    tenant_code: tenantCode,
    site_code: siteCode,
    provider,
    amount: amountVnd,
    currency: "VND",
    order_id: donationId,
    description: body.message ? `Ủng hộ DSTS: ${String(body.message).slice(0, 100)}` : "Ủng hộ Đường Sao Tỏa Sáng",
    buyer_email: body.donor_email || body.email || null,
    buyer_name: body.donor_name || body.name || null,
    callback_url: `${callbackBase}/api/donate/webhook`,
    success_url: `${callbackBase}/donate?status=success`,
    cancel_url: `${callbackBase}/donate?status=cancel`,
  };

  let providerRef = null;
  let checkoutUrl = null;

  try {
    const resp = await fetch(`${baseUrl}/checkout-session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
        "idempotency-key": idempotencyKey,
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
  } catch (err) {
    return errorJson("GATEWAY_UNREACHABLE", "Payment gateway unreachable.", 502);
  }

  // Persist
  if (env.DB) {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO donations
        (id, idempotency_key, amount_vnd, donor_email, donor_name, message,
         provider, provider_ref, checkout_url, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now', '+30 minutes'))
    `).bind(
      donationId,
      idempotencyKey,
      amountVnd,
      body.donor_email || body.email || null,
      body.donor_name || body.name || null,
      body.message || null,
      provider,
      providerRef,
      checkoutUrl
    ).run();
  }

  return json({ ok: true, id: donationId, checkout_url: checkoutUrl, status: "pending" });
}

// ── POST /api/donate/webhook ──────────────────────────────────────────────────
async function handleDonateWebhook(context) {
  const { request, env } = context;

  const hmacSecret = env.PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC || "";
  const rawBody = await request.text();
  const signature = (
    request.headers.get("x-iai-signature") ||
    request.headers.get("x-webhook-signature") ||
    ""
  ).trim();

  if (hmacSecret && signature) {
    const valid = await verifyHmac(hmacSecret, rawBody, signature);
    if (!valid) {
      return errorJson("SIGNATURE_INVALID", "Webhook signature mismatch.", 401);
    }
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
    // Replay guard
    const existing = await env.DB.prepare(
      "SELECT id FROM donation_webhook_log WHERE event_id = ?"
    ).bind(eventId).first();
    if (existing) {
      return json({ ok: true, replayed: true });
    }

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
    }
  }

  return json({ ok: true });
}

// ── GET /api/donate/:id ───────────────────────────────────────────────────────
async function handleDonateGet(context, donationId) {
  const { env } = context;

  if (!env.DB) {
    return errorJson("DB_UNAVAILABLE", "Database not available.", 503);
  }

  const row = await env.DB.prepare(
    "SELECT id, amount_vnd, status, checkout_url, donor_name, created_at, completed_at FROM donations WHERE id = ?"
  ).bind(donationId).first();

  if (!row) {
    return errorJson("NOT_FOUND", "Donation not found.", 404);
  }

  return json({ ok: true, data: row });
}

// ── Router ────────────────────────────────────────────────────────────────────
export const onRequest = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");
  const method = request.method.toUpperCase();

  if (method === "POST" && path === "/api/donate/create") {
    return handleDonateCreate(context);
  }

  if (method === "POST" && (path === "/api/donate/webhook" || path === "/api/donate/webhook/payment")) {
    return handleDonateWebhook(context);
  }

  const matchGet = path.match(/^\/api\/donate\/([^/]+)$/);
  if (method === "GET" && matchGet) {
    return handleDonateGet(context, matchGet[1]);
  }

  return new Response("Not found", { status: 404 });
};
