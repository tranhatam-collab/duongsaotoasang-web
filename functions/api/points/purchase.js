const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
const errorJson = (code, message, status = 400) => json({ ok: false, error: code, message }, status);

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return prefix ? `${prefix}_${Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")}` : Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost = async ({ request, env }) => {
  if (!env.PAY_IAI_ONE_API_KEY) return errorJson("PAYMENT_NOT_CONFIGURED", "Point purchase not yet activated.", 503);
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  let body;
  try { body = await request.json(); } catch { return errorJson("INVALID_JSON", "Request body must be valid JSON."); }

  const packageId = (body.package_id || "").trim();
  const idempotencyKey = body.idempotency_key || `auto_${randomId()}`;

  const pkg = await env.DB.prepare("SELECT id, name, points, price_vnd, bonus_points FROM point_packages WHERE id = ? AND status = 'active'").bind(packageId).first();
  if (!pkg) return errorJson("INVALID_PACKAGE", "Point package not found or inactive.");

  const existing = await env.DB.prepare("SELECT id FROM point_ledger WHERE idempotency_key = ?").bind(idempotencyKey).first();
  if (existing) return json({ ok: true, replayed: true });

  const ledgerId = randomId("ptx");
  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");
  const callbackBase = String(env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com").replace(/\/+$/, "");
  const totalPoints = pkg.points + pkg.bonus_points;
  const memo = `${pkg.name} (${pkg.points} pts + ${pkg.bonus_points} bonus = ${totalPoints} pts)`;

  const callPayload = {
    tenant_code: env.PAY_IAI_ONE_TENANT_CODE || "dsts",
    site_code: env.PAY_IAI_ONE_SITE_CODE || "duongsaotoasang",
    provider: env.PAY_IAI_ONE_PROVIDER || "payos",
    internal_order_id: ledgerId,
    amount: pkg.price_vnd,
    currency: "VND",
    billing_cycle: "one_time",
    description: memo,
    callback_url: `${callbackBase}/api/points/purchase/webhook`,
    success_url: `${callbackBase}/account/points`,
    cancel_url: `${callbackBase}/points/purchase`,
    metadata: { lane: "club", action: "point_purchase", package_id: pkg.id, total_points: totalPoints },
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

  await env.DB.prepare(`INSERT OR IGNORE INTO point_ledger (id, transaction_type, amount, balance_after, reference_type, reference_id, idempotency_key, description, created_at)
    VALUES (?, 'purchased', ?, 0, 'point_package', ?, ?, ?, datetime('now'))`)
    .bind(ledgerId, totalPoints, pkg.id, idempotencyKey, memo).run();

  return json({ ok: true, id: ledgerId, checkout_url: checkoutUrl, points: totalPoints, price_vnd: pkg.price_vnd });
};
