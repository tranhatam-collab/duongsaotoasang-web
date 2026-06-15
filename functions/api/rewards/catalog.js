const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

const VALID_CATEGORIES = ["digital", "event", "experience"];

export const onRequestGet = async ({ request, env }) => {
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const url = new URL(request.url);
  const category = (url.searchParams.get("category") || "").trim().toLowerCase();

  if (category && !VALID_CATEGORIES.includes(category)) {
    return errorJson("INVALID_CATEGORY", "Category must be one of: digital, event, experience");
  }

  const { results } = await env.DB.prepare(`
    SELECT id, slug, title, reward_type, tier_required, points_cost,
           inventory_mode, status, description_html
    FROM reward_catalog
    WHERE (? IS NULL OR ? = '' OR reward_type = ?)
    ORDER BY
      CASE reward_type WHEN 'digital' THEN 1 WHEN 'event' THEN 2 WHEN 'experience' THEN 3 ELSE 4 END,
      points_cost ASC
  `).bind(category, category, category).all();

  return json({ ok: true, data: results });
};
