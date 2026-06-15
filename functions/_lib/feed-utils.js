export const DEFAULT_FEED_META = {
  title: "Đường Sao Tỏa Sáng",
  link: "https://duongsaotoasang.com/",
  description: "Nội dung công khai từ Đường Sao Tỏa Sáng"
}

export function buildRss(posts, meta = DEFAULT_FEED_META) {
  const feedMeta = { ...DEFAULT_FEED_META, ...meta }
  const items = posts.map((post) => {
    const link = `https://duongsaotoasang.com/content?slug=${post.slug}`
    const pubDate = toRssDate(post.created_at)
    return `    <item>
      <title><![CDATA[${toCdata(post.title_vi || post.title_en || post.slug)}]]></title>
      <link>${xmlEscape(link)}</link>
      <guid>${xmlEscape(link)}</guid>
      <description><![CDATA[${toCdata(post.excerpt_vi || post.excerpt_en || "")}]]></description>
      ${pubDate ? `<pubDate>${xmlEscape(pubDate)}</pubDate>` : ""}
    </item>`
  }).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(feedMeta.title)}</title>
    <link>${xmlEscape(feedMeta.link)}</link>
    <description>${xmlEscape(feedMeta.description)}</description>
${items}
  </channel>
</rss>
`
}

export function toRssDate(value) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toUTCString()
}

export function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toCdata(value) {
  return String(value || "").replaceAll("]]>", "]]]]><![CDATA[>")
}
