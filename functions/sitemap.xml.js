export async function onRequestGet(context) {
  const { env } = context;

  const staticUrls = [
    "/",
    "/about",
    "/program",
    "/events",
    "/scripts",
    "/donate",
    "/transparency",
    "/legal",
    "/contact",
    "/posts"
  ];

  const stmt = env.DB.prepare(`
    SELECT slug, type, updated_at
    FROM contents
    WHERE visibility = 'public'
      AND status = 'published'
  `);

  const { results = [] } = await stmt.all();

  const staticXml = staticUrls.map(url => `
    <url>
      <loc>https://duongsaotoasang.com${url}</loc>
    </url>
  `).join("");

  const dynamicXml = results.map(row => {
    const loc = row.type === "post"
      ? `https://duongsaotoasang.com/posts/${row.slug}`
      : `https://duongsaotoasang.com/${row.slug}`;

    return `
      <url>
        <loc>${loc}</loc>
        <lastmod>${new Date(row.updated_at).toISOString()}</lastmod>
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
