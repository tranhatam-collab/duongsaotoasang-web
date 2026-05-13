import {
  localizeItem,
  normalizeLang,
  selectFallback
} from "./_lib/content-data.js"

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const lang = normalizeLang(url.searchParams.get("lang"))
  const q = (url.searchParams.get("q") || "").trim()
  const posts = await resolvePosts({ env, q, lang })

  return html(renderPostsPage({ posts, q, lang }), 200)
}

async function resolvePosts({ env, q, lang }) {
  const fallback = selectFallback({ type: "post", limit: 24, q, lang })

  if (!env.DB) {
    return fallback
  }

  try {
    const queryParts = []
    const bindings = []

    queryParts.push(`
      SELECT
        slug,
        type,
        title_vi,
        title_en,
        excerpt_vi,
        excerpt_en,
        tags,
        reading_time,
        cover_url,
        created_at
      FROM contents
      WHERE type = 'post'
    `)

    if (q) {
      queryParts.push(`
        AND (
          slug LIKE ?
          OR title_vi LIKE ?
          OR title_en LIKE ?
          OR excerpt_vi LIKE ?
          OR excerpt_en LIKE ?
          OR tags LIKE ?
        )
      `)
      const like = `%${q}%`
      bindings.push(like, like, like, like, like, like)
    }

    queryParts.push("ORDER BY datetime(created_at) DESC LIMIT 24")

    const stmt = env.DB.prepare(queryParts.join("\n")).bind(...bindings)
    const result = await stmt.all()
    const rows = Array.isArray(result.results) ? result.results : []

    if (!rows.length) {
      return fallback
    }

    return rows.map((item) => localizeItem(item, lang))
  } catch (_err) {
    return fallback
  }
}

function renderPostsPage({ posts, q, lang }) {
  const isEn = lang === "en"
  const title = isEn
    ? "Article Library | Đường Sao Tỏa Sáng"
    : "Thư viện bài viết | Đường Sao Tỏa Sáng"
  const description = isEn
    ? "The public knowledge library of Đường Sao Tỏa Sáng: essays on awareness, creativity, community, and meaningful living."
    : "Thư viện tri thức công khai của Đường Sao Tỏa Sáng: các bài viết về nhận thức, sáng tạo, cộng đồng và hành trình sống có chiều sâu."
  const canonical = `https://duongsaotoasang.com/posts${isEn ? "?lang=en" : ""}`
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "url": canonical,
    "numberOfItems": posts.length,
    "itemListElement": posts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://duongsaotoasang.com/content?slug=${encodeURIComponent(post.slug)}${isEn ? "&lang=en" : ""}`,
      "name": post.title || post.title_vi || post.title_en || post.slug,
      "description": post.excerpt || post.excerpt_vi || post.excerpt_en || ""
    }))
  }

  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b0f14">
  <meta name="robots" content="index,follow">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Đường Sao Tỏa Sáng">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="https://duongsaotoasang.com/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://duongsaotoasang.com/og.png">
  <link rel="stylesheet" href="/app.css">
  <script type="application/ld+json">${safeJson(schema)}</script>
  <style>
    body{background:radial-gradient(820px 460px at 6% 0%,rgba(216,188,119,.13),transparent 62%),radial-gradient(720px 360px at 100% 8%,rgba(132,176,255,.10),transparent 62%),linear-gradient(180deg,#080b0f 0%,#0c1117 100%);color:#eef2f7}
    .posts-main{padding:34px 0 78px}
    .hero-card{border:1px solid rgba(255,255,255,.085);border-radius:26px;background:linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.022));box-shadow:0 24px 80px rgba(0,0,0,.30);padding:30px}
    .eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#e0c896;margin-bottom:10px}
    .hero-title{margin:0;max-width:920px;font-size:48px;line-height:1.06;letter-spacing:-.03em;color:#f5e7c7}
    .hero-desc{max-width:840px;margin:16px 0 0;color:#aeb8c8;font-size:17px;line-height:1.85}
    .toolbar{margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}
    .search-form{display:flex;gap:10px;flex:1 1 520px;max-width:760px;flex-wrap:wrap}
    .search-input{flex:1;min-width:220px;height:52px;border-radius:16px;border:1px solid rgba(224,200,150,.14);background:rgba(255,255,255,.04);color:#eef2f7;padding:0 16px;outline:none;font-size:15px}
    .btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 16px;border-radius:16px;border:1px solid rgba(224,200,150,.18);background:rgba(255,255,255,.04);color:#f5e7c7;text-decoration:none;font-weight:800;font-size:14px}
    .btn.primary{border-color:rgba(216,188,119,.34);background:linear-gradient(180deg,rgba(216,188,119,.18),rgba(216,188,119,.08))}
    .section{padding:28px 0 0}
    .section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
    .section-title{margin:0;color:#f5e7c7;font-size:30px;line-height:1.1;letter-spacing:-.02em}
    .section-desc{margin:0;max-width:780px;color:#aeb8c8;line-height:1.8}
    .post-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
    .item{display:block;border:1px solid rgba(224,200,150,.12);background:rgba(255,255,255,.032);border-radius:18px;padding:18px;text-decoration:none;color:#eef2f7;box-shadow:0 22px 70px rgba(0,0,0,.22);transition:transform .22s ease,border-color .22s ease}
    .item:hover{transform:translateY(-2px);border-color:rgba(216,188,119,.24)}
    .item b{display:block;color:#f8eed4;font-size:20px;line-height:1.34;margin-bottom:8px;letter-spacing:-.02em}
    .item .excerpt{color:#aeb8c8;line-height:1.82;font-size:15px}
    .item .meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#b9c4d3;font-size:13px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08)}
    .status-box{border:1px dashed rgba(224,200,150,.18);border-radius:18px;padding:18px;background:rgba(255,255,255,.03);color:#b9c4d3;line-height:1.75;margin-bottom:16px}
    @media(max-width:1080px){.post-list{grid-template-columns:repeat(2,minmax(0,1fr))}.hero-title{font-size:40px}}
    @media(max-width:760px){.hero-card{padding:22px}.hero-title{font-size:34px}.post-list{grid-template-columns:1fr}.search-form{flex-direction:column}.btn{width:100%}}
  </style>
</head>
<body>
  <div id="siteHeader"></div>
  <main class="wrap posts-main" data-dsts-ssr="posts">
    <section class="hero-card">
      <div class="eyebrow">${isEn ? "KNOWLEDGE LIBRARY" : "THƯ VIỆN TRI THỨC"}</div>
      <h1 class="hero-title">${isEn ? "Articles to read slowly, think deeply, and walk farther." : "Những bài viết để đọc chậm, nghĩ sâu và đi xa hơn."}</h1>
      <p class="hero-desc">${isEn ? "This public library keeps foundational essays readable from the first request. If dynamic data fails, DSTS still serves complete fallback content so no reader meets an empty page." : "Thư viện này giữ các bài viết nền tảng đọc được ngay từ request đầu tiên. Nếu dữ liệu động lỗi, DSTS vẫn phục vụ nội dung fallback đầy đủ để không người đọc nào gặp trang trống."}</p>
      <div class="toolbar">
        <form class="search-form" action="/posts" method="get">
          ${isEn ? `<input type="hidden" name="lang" value="en">` : ""}
          <input class="search-input" name="q" value="${escapeHtml(q)}" placeholder="${isEn ? "Search by topic, keyword, direction..." : "Tìm bài viết theo chủ đề, từ khóa, định hướng..."}">
          <button class="btn primary" type="submit">${isEn ? "Search" : "Tìm kiếm"}</button>
        </form>
        <a class="btn" href="/posts${isEn ? "?lang=en" : ""}">${isEn ? "View all" : "Xem tất cả"}</a>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <div class="eyebrow">${isEn ? "ARTICLE LIST" : "DANH SÁCH BÀI VIẾT"}</div>
          <h2 class="section-title">${isEn ? "Article library" : "Thư viện bài viết"}</h2>
        </div>
        <p class="section-desc">${isEn ? "Each article is a point to pause, reflect, and expand one’s direction in life." : "Mỗi bài viết là một điểm dừng để đọc lại, nhìn lại và mở rộng hướng đi trong đời sống."}</p>
      </div>
      ${q ? `<div class="status-box">${isEn ? "Search results for" : "Kết quả tìm kiếm cho"}: <strong>${escapeHtml(q)}</strong></div>` : ""}
      ${posts.length ? `<div class="post-list">${posts.map((post) => renderPostCard(post, lang)).join("")}</div>` : `<div class="status-box">${isEn ? "No matching articles found." : "Chưa có bài viết phù hợp."}</div>`}
    </section>
  </main>
  <div id="siteFooter"></div>
  <script src="/assets/app-v5.js"></script>
  <script>DSTS.mountSiteChrome({ active: "posts" });</script>
</body>
</html>`
}

function renderPostCard(post, lang) {
  const isEn = lang === "en"
  const title = post.title || post.title_vi || post.title_en || post.slug
  const excerpt = post.excerpt || post.excerpt_vi || post.excerpt_en || ""
  const tags = String(post.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
  const href = `/content?slug=${encodeURIComponent(post.slug)}${isEn ? "&lang=en" : ""}`

  return `<a class="item" href="${escapeHtml(href)}">
    <b>${escapeHtml(title)}</b>
    <div class="excerpt">${escapeHtml(excerpt)}</div>
    <div class="meta">
      <span>${isEn ? "Article" : "Bài viết"}</span>
      ${tags.length ? `<span>${escapeHtml(tags[0])}</span>` : ""}
      <span>${escapeHtml(formatDate(post.created_at, lang))}</span>
    </div>
  </a>`
}

function html(body, status) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
      "x-dsts-ssr-posts": "1"
    }
  })
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function safeJson(value) {
  return JSON.stringify(value).replace(/<\//g, "<\\/")
}

function formatDate(value, lang) {
  if (!value) return ""
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(value))
  } catch (_err) {
    return value
  }
}
