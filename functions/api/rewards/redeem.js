const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
const errorJson = (code, message, status = 400) => json({ ok: false, error: code, message }, status);

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return prefix ? `${prefix}_${Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")}` : Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost = async ({ request, env }) => {
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  let body;
  try { body = await request.json(); } catch { return errorJson("INVALID_JSON", "Request body must be valid JSON."); }

  const rewardId = (body.reward_id || "").trim();
  const idempotencyKey = body.idempotency_key || `auto_${randomId()}`;

  if (!rewardId) return errorJson("MISSING_REWARD", "reward_id is required.");

  const reward = await env.DB.prepare("SELECT id, title, points_cost, status, inventory_mode, tier_required FROM reward_catalog WHERE id = ?").bind(rewardId).first();
  if (!reward) return errorJson("NOT_FOUND", "Reward not found.", 404);
  if (reward.status !== "active") return errorJson("REWARD_UNAVAILABLE", "Reward is not yet available for redemption.");

  const existing = await env.DB.prepare("SELECT id, status FROM reward_redemptions WHERE idempotency_key = ?").bind(idempotencyKey).first();
  if (existing) return json({ ok: true, replayed: true, id: existing.id, status: existing.status });

  const userId = body.user_id || null;
  const currentBalance = userId ? await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) as bal FROM point_ledger WHERE user_id = ?").bind(userId).first() : null;
  const balance = currentBalance?.bal || 0;

  if (reward.points_cost > balance) return errorJson("INSUFFICIENT_POINTS", `You need ${reward.points_cost} Star Points but have ${balance}.`);

  const redemptionId = randomId("rdm");

  await env.DB.prepare(`INSERT OR IGNORE INTO reward_redemptions (id, reward_id, user_id, points_cost, status, idempotency_key, created_at)
    VALUES (?, ?, ?, ?, 'pending', ?, datetime('now'))`)
    .bind(redemptionId, rewardId, userId, reward.points_cost, idempotencyKey).run();

  await env.DB.prepare(`INSERT OR IGNORE INTO point_ledger (id, user_id, transaction_type, amount, balance_after, reference_type, reference_id, idempotency_key, description, created_at)
    VALUES (?, ?, 'redeemed', ?, ?, 'reward_redemption', ?, ?, ?, datetime('now'))`)
    .bind(randomId("ptx"), userId, -reward.points_cost, balance - reward.points_cost, redemptionId, idempotencyKey, `Redeemed: ${reward.title}`).run();

  return json({ ok: true, id: redemptionId, status: "pending", points_spent: reward.points_cost, reward_title: reward.title });
};
