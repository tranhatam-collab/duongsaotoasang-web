const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

export const onRequestGet = async ({ request, env }) => {
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const url = new URL(request.url);
  const visibility = (url.searchParams.get("visibility") || "public").trim().toLowerCase();

  const { results } = await env.DB.prepare(`
    SELECT t.id, t.slug, t.title, t.summary, t.host_name, t.talkshow_type,
           t.access_tier, t.starts_at, t.timezone, t.replay_rule, t.status,
           t.ticket_price_vnd, t.points_price,
           c.slug as creator_slug
    FROM club_talkshows t
    INNER JOIN creators c ON c.id = t.creator_id
    WHERE t.status IN ('coming_soon', 'scheduled', 'live')
      AND t.starts_at >= datetime('now')
      AND t.access_tier = ?
    ORDER BY t.starts_at ASC
    LIMIT 50
  `).bind(visibility).all();

  return json({ ok: true, data: results });
};
