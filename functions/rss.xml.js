import { selectFallback } from "./_lib/content-data.js";

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

  const items = rows.map(row => {
    const link = `https://duongsaotoasang.com/content?slug=${row.slug}`;
    const pubDate = toRssDate(row.created_at);
    return `
    <item>
      <title><![CDATA[${row.title_vi || row.title_en || row.slug}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${row.excerpt_vi || row.excerpt_en || ""}]]></description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
    </item>
  `;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Đường Sao Tỏa Sáng</title>
      <link>https://duongsaotoasang.com/</link>
      <description>Nội dung công khai từ Đường Sao Tỏa Sáng</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8"
    }
  });
}

function toRssDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toUTCString();
}
