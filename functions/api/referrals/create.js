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

  const referralType = (body.referral_type || "").trim();
  const userId = body.user_id || null;

  if (!referralType || !["member", "circle", "inner_circle", "points_purchase"].includes(referralType)) {
    return errorJson("INVALID_TYPE", "Referral type must be: member, circle, inner_circle, points_purchase.");
  }

  const referralRewards = { member: 20, circle: 75, inner_circle: 250, points_purchase: 10 };

  const code = randomId("ref").slice(0, 16);
  const linkId = randomId("rfl");

  await env.DB.prepare(`INSERT OR IGNORE INTO referral_links (id, user_id, code, referral_type, reward_points, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'active', datetime('now'))`)
    .bind(linkId, userId, code, referralType, referralRewards[referralType]).run();

  const baseUrl = body.base_url || "https://duongsaotoasang.com";
  const shareUrl = `${baseUrl}/club/join?ref=${code}`;

  return json({ ok: true, id: linkId, code, share_url: shareUrl, reward_points: referralRewards[referralType], referral_type: referralType });
};
