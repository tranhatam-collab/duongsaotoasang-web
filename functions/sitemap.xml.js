import { selectFallback } from "./_lib/content-data.js";

export async function onRequestGet(context) {
  const { env } = context;

  const fallbackPostUrls = selectFallback({ type: "post", limit: 100, lang: "vi" })
    .map((row) => `/content?slug=${row.slug}`);

  const staticUrls = Array.from(new Set([
    "/",
    "/about",
    "/program",
    "/events",
    "/scripts",
    "/donate",
    "/transparency",
    "/legal",
    "/privacy",
    "/terms",
    "/support",
    "/contact",
    "/posts",
    "/scripts/rising-entrepreneur",
    "/scripts/global-artist",
    "/scripts/singing-icon",
    "/scripts/cinematic-actor",
    "/scripts/the-thinker",
    "/scripts/creative-leader",
    "/scripts/cultural-ambassador",
    "/scripts/dsts-legacy",
    "/scripts/global-story",
    ...fallbackPostUrls
  ]));

  let results = [];
  try {
    if (env.DB) {
      const stmt = env.DB.prepare(`
        SELECT slug, type, created_at
        FROM contents
        WHERE type IN ('post', 'page')
        LIMIT 100
      `);
      const data = await stmt.all();
      results = Array.isArray(data.results) ? data.results : [];
    }
  } catch (_err) {
    results = [];
  }

  const staticXml = staticUrls.map(url => `
    <url>
      <loc>https://duongsaotoasang.com${url}</loc>
    </url>
  `).join("");

  const dynamicXml = results.map(row => {
    const loc = row.type === "post"
      ? `https://duongsaotoasang.com/content?slug=${row.slug}`
      : `https://duongsaotoasang.com/${row.slug}`;
    const lastmod = toIsoDate(row.created_at);

    return `
      <url>
        <loc>${loc}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
      </url>
    `;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticXml}
    ${dynamicXml}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}

function toIsoDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}
