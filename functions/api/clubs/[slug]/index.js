const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

export const onRequestGet = async ({ params, env }) => {
  if (!params || !params.slug) return errorJson("MISSING_SLUG", "Creator slug is required.", 400);
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const creator = await env.DB.prepare(`
    SELECT id, slug, display_name, headline, creator_type, status, is_featured, created_at
    FROM creators WHERE slug = ? AND status IN ('active', 'draft')
  `).bind(params.slug).first();

  if (!creator) return errorJson("NOT_FOUND", "Creator not found.", 404);

  const profile = await env.DB.prepare(`
    SELECT bio_short, bio_long, hero_image_url, avatar_url, public_story_html,
           social_links_json, country_code, language_code
    FROM creator_profiles WHERE creator_id = ?
  `).bind(creator.id).first();

  return json({ ok: true, data: { creator, profile } });
};
