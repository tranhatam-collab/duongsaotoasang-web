import { selectFallback } from "./_lib/content-data.js";
import { buildRss } from "./_lib/feed-utils.js";

export async function onRequestGet(context) {
  const { env } = context;

  const fallbackPosts = selectFallback({ type: "post", limit: 50, lang: "vi" });

  let results = [];
  try {
    if (env.DB) {
      const stmt = env.DB.prepare(`
        SELECT slug, type, title_vi, title_en, excerpt_vi, excerpt_en, created_at
        FROM contents
        WHERE type = 'post'
        ORDER BY datetime(created_at) DESC
        LIMIT 50
      `);
      const data = await stmt.all();
      results = Array.isArray(data.results) ? data.results : [];
    }
  } catch (_err) {
    results = [];
  }

  const rows = results.length ? results : fallbackPosts;

  const xml = buildRss(rows);

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8"
    }
  });
}
