export async function onRequestGet(context) {
  const { env } = context;

  const stmt = env.DB.prepare(`
    SELECT slug, type, title_vi, title_en, excerpt_vi, excerpt_en, updated_at
    FROM contents
    WHERE visibility = 'public'
      AND status = 'published'
      AND type = 'post'
    ORDER BY updated_at DESC
    LIMIT 50
  `);

  const { results = [] } = await stmt.all();

  const items = results.map(row => `
    <item>
      <title><![CDATA[${row.title_vi || row.title_en || row.slug}]]></title>
      <link>https://duongsaotoasang.com/posts/${row.slug}</link>
      <guid>https://duongsaotoasang.com/posts/${row.slug}</guid>
      <description><![CDATA[${row.excerpt_vi || row.excerpt_en || ""}]]></description>
      <pubDate>${new Date(row.updated_at).toUTCString()}</pubDate>
    </item>
  `).join("");

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
