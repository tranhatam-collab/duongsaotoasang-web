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
  const hmacSecret = env.PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC;
  const rawBody = await request.text();
  const signature = (request.headers.get("x-iai-signature") || "").trim();

  // FAIL-CLOSED: HMAC secret is required in production
  if (!hmacSecret) {
    return errorJson("HMAC_SECRET_NOT_CONFIGURED", "Webhook HMAC secret not configured.", 500);
  }
  
  if (!signature) return errorJson("SIGNATURE_REQUIRED", "Webhook signature header required.", 401);
  const valid = await verifyHmac(hmacSecret, rawBody, signature);
  if (!valid) return errorJson("SIGNATURE_INVALID", "Webhook signature mismatch.", 401);

  let payload;
  try { payload = JSON.parse(rawBody); } catch { return errorJson("INVALID_JSON", "Could not parse webhook payload."); }

  const eventId = payload.event_id || payload.id || randomId("evt");
  const eventType = payload.event_type || payload.type || "unknown";
  const orderId = payload.order_id || payload.point_ledger_id || null;

  if (!env.DB) return json({ ok: true, note: "no_db" });
  if (!orderId || eventType !== "payment.completed") return json({ ok: true });

  const tx = await env.DB.prepare("SELECT id, amount, balance_after FROM point_ledger WHERE id = ? AND transaction_type = 'purchased'").bind(orderId).first();
  if (!tx) return json({ ok: true, ignored: "unknown_ledger_id" });

  const currentBalance = await env.DB.prepare("SELECT COALESCE(SUM(balance_after), 0) as bal FROM point_ledger WHERE id = ?").bind(orderId).first();
  const newBalance = (currentBalance?.bal || 0) + tx.amount;

  await env.DB.prepare("UPDATE point_ledger SET balance_after = ? WHERE id = ?").bind(newBalance, orderId).run();

  return json({ ok: true, credited: true, points: tx.amount, balance_after: newBalance });
};
