const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

const VALID_TIERS = ["public", "member", "circle", "inner_circle"];

export const onRequestGet = async ({ params, request, env }) => {
  if (!params || !params.slug) return errorJson("MISSING_SLUG", "Creator slug is required.", 400);
  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const url = new URL(request.url);
  const visibility = (url.searchParams.get("visibility") || "public").trim().toLowerCase();
  if (!VALID_TIERS.includes(visibility)) return errorJson("INVALID_VISIBILITY", "Visibility must be one of: public, member, circle, inner_circle", 400);

  const creator = await env.DB.prepare(
    "SELECT id FROM creators WHERE slug = ? AND status IN ('active', 'draft')"
  ).bind(params.slug).first();

  if (!creator) return errorJson("NOT_FOUND", "Creator not found.", 404);

  const locked = visibility !== "public";

  const query = locked
    ? `SELECT id, slug, title, excerpt, cover_image_url, visibility_tier, content_type, published_at
       FROM club_posts
       WHERE creator_id = ? AND visibility_tier = ? AND status = 'published'
       ORDER BY published_at DESC`
    : `SELECT id, slug, title, excerpt, body_html, cover_image_url, visibility_tier, content_type, published_at
       FROM club_posts
       WHERE creator_id = ? AND visibility_tier = 'public' AND status = 'published'
       ORDER BY published_at DESC`;

  const { results } = await env.DB.prepare(query).bind(creator.id, visibility).all();

  if (locked) {
    return json({
      ok: true,
      visibility,
      locked: true,
      note: "Phase 1: paid content gating — body_html withheld. Subscribe to unlock.",
      data: results,
    });
  }

  return json({ ok: true, visibility, data: results });
};
