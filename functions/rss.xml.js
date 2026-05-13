export async function onRequestGet(context) {
  const { env } = context;

  const fallbackPosts = [
    {
      slug: "hanh-trinh-nhin-lai-chinh-minh",
      title_vi: "Hành trình nhìn lại chính mình trong một thế giới quá ồn",
      excerpt_vi: "Có những giai đoạn con người không thiếu thông tin, mà thiếu sự lắng lại đủ sâu để nhận ra mình đang đi về đâu.",
      created_at: "2026-03-01T08:00:00.000Z"
    },
    {
      slug: "sang-tao-khong-bat-dau-tu-tham-vong",
      title_vi: "Sáng tạo không bắt đầu từ tham vọng mà từ sự thấy rõ",
      excerpt_vi: "Điều tạo nên giá trị bền vững không phải là làm cho thật nhiều, mà là tạo ra đúng thứ cần được sinh ra.",
      created_at: "2026-02-26T08:00:00.000Z"
    },
    {
      slug: "cong-dong-khong-phai-dam-dong",
      title_vi: "Cộng đồng không phải đám đông, mà là những người cùng giữ một hướng đi",
      excerpt_vi: "Một cộng đồng đúng không được xây bằng tiếng ồn, mà bằng sự tin cậy, trách nhiệm và khả năng cùng đi xa.",
      created_at: "2026-02-20T08:00:00.000Z"
    }
  ];

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
