const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

export const onRequestGet = async ({ env }) => {
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const { results } = await env.DB.prepare(`
    SELECT c.id, c.slug, c.display_name, c.headline, c.creator_type, c.is_featured,
           p.bio_short, p.avatar_url
    FROM creators c
    LEFT JOIN creator_profiles p ON p.creator_id = c.id
    WHERE c.status = 'active'
    ORDER BY c.is_featured DESC, c.display_name ASC
  `).all();

  return json({ ok: true, data: results });
};
