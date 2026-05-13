import {
  findFallback,
  localizeItem,
  normalizeLang
} from "./_lib/content-data.js"

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const slug = (url.searchParams.get("slug") || "").trim()
  const lang = normalizeLang(url.searchParams.get("lang"))

  if (!slug) {
    return Response.redirect(`${url.origin}/posts${lang === "en" ? "?lang=en" : ""}`, 302)
  }

  const item = await resolveContentItem({ env, slug, lang })

  if (!item) {
    return html(renderNotFoundPage({ slug, lang }), 404)
  }

  return html(renderContentPage({ item, slug, lang }), 200)
}

async function resolveContentItem({ env, slug, lang }) {
  const fallback = findFallback(slug, lang)

  if (!env.DB) {
    return fallback
  }

  try {
    const query = `
      SELECT
        slug,
        type,
        title_vi,
        title_en,
        excerpt_vi,
        excerpt_en,
        content_vi,
        content_en,
        tags,
        reading_time,
        cover_url,
        created_at
      FROM contents
      WHERE slug = ?
      LIMIT 1
    `
    const { results } = await env.DB.prepare(query).bind(slug).all()
    if (results && results.length > 0) {
      return localizeItem(results[0], lang)
    }
  } catch (_err) {
    return fallback
  }

  return fallback
}

function renderContentPage({ item, slug, lang }) {
  const title = item.title || item.title_vi || item.title_en || "Nội dung"
  const excerpt = item.excerpt || item.excerpt_vi || item.excerpt_en || ""
  const content = item.content || item.content_vi || item.content_en || ""
  const tags = String(item.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
  const articleUrl = `https://duongsaotoasang.com/content?slug=${encodeURIComponent(item.slug || slug)}${lang === "en" ? "&lang=en" : ""}`
  const typeLabel = item.type === "page"
    ? (lang === "en" ? "Page" : "Trang")
    : (lang === "en" ? "Article" : "Bài viết")
  const publishedLabel = lang === "en" ? "Published" : "Xuất bản"
  const tagsLabel = lang === "en" ? "Topics" : "Chủ đề"
  const backPosts = lang === "en" ? "Back to article library" : "Quay lại thư viện bài viết"
  const backHome = lang === "en" ? "Back home" : "Về trang chủ"

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "url": articleUrl,
    "datePublished": item.created_at || undefined,
    "dateModified": item.updated_at || item.created_at || undefined,
    "inLanguage": lang === "en" ? "en" : "vi",
    "author": {
      "@type": "Organization",
      "name": "Đường Sao Tỏa Sáng",
      "url": "https://duongsaotoasang.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Đường Sao Tỏa Sáng",
      "url": "https://duongsaotoasang.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://duongsaotoasang.com/og.png"
      }
    },
    "mainEntityOfPage": articleUrl
  }

  return basePage({
    lang,
    title: `${title} | Đường Sao Tỏa Sáng`,
    description: excerpt || title,
    canonical: articleUrl,
    ogType: "article",
    schema,
    active: "posts",
    body: `
      <main data-dsts-ssr="content">
        <section class="content-hero reveal">
          <div class="wrap">
            <div class="eyebrow">${lang === "en" ? "FULL CONTENT" : "NỘI DUNG CHI TIẾT"}</div>
            <h1 class="article-title">${escapeHtml(title)}</h1>
            <p class="article-excerpt">${escapeHtml(excerpt)}</p>
            <div class="article-meta">
              <span class="meta-pill">${escapeHtml(typeLabel)}</span>
              <span class="meta-pill">${escapeHtml(publishedLabel)}: ${escapeHtml(formatDate(item.created_at, lang))}</span>
              ${tags.length ? `<span class="meta-pill">${escapeHtml(tagsLabel)}: ${escapeHtml(tags.join(", "))}</span>` : ""}
            </div>
          </div>
        </section>
        <section class="article-shell reveal">
          <div class="article-card">
            <article class="article-body">${content}</article>
            <nav class="bottom-nav" aria-label="Article navigation">
              <a class="btn-link primary" href="/posts${lang === "en" ? "?lang=en" : ""}">${escapeHtml(backPosts)}</a>
              <a class="btn-link" href="/${lang === "en" ? "?lang=en" : ""}">${escapeHtml(backHome)}</a>
            </nav>
          </div>
        </section>
      </main>
    `
  })
}

function renderNotFoundPage({ slug, lang }) {
  const title = lang === "en" ? "Article not found" : "Không tìm thấy bài viết"
  const desc = lang === "en"
    ? "This slug is not available in the public content library or its URL has changed."
    : "Slug này chưa có trong thư viện nội dung công khai hoặc đã được đổi đường dẫn."

  return basePage({
    lang,
    title: `${title} | Đường Sao Tỏa Sáng`,
    description: desc,
    canonical: "https://duongsaotoasang.com/posts",
    ogType: "website",
    schema: null,
    active: "posts",
    body: `
      <main data-dsts-ssr="content-not-found">
        <section class="content-hero reveal">
          <div class="wrap">
            <div class="eyebrow">${lang === "en" ? "FULL CONTENT" : "NỘI DUNG CHI TIẾT"}</div>
            <h1 class="article-title">${escapeHtml(title)}</h1>
            <p class="article-excerpt">${escapeHtml(desc)}</p>
          </div>
        </section>
        <section class="article-shell reveal">
          <div class="article-card">
            <div class="status-box not-found-box">
              <h2>${escapeHtml(title)}</h2>
              <p>${escapeHtml(desc)}</p>
              <p>Slug: <code>${escapeHtml(slug)}</code></p>
              <a class="btn-link primary" href="/posts${lang === "en" ? "?lang=en" : ""}">${lang === "en" ? "Open article library" : "Mở thư viện bài viết"}</a>
            </div>
          </div>
        </section>
      </main>
    `
  })
}

function basePage({ lang, title, description, canonical, ogType, schema, active, body }) {
  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b111d">
  <meta name="robots" content="${ogType === "article" ? "index,follow" : "noindex,follow"}">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="${escapeHtml(ogType)}">
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
  ${schema ? `<script type="application/ld+json">${safeJson(schema)}</script>` : ""}
  <style>
    body{background:radial-gradient(760px 420px at 8% 0%,rgba(224,200,150,.12),transparent 62%),linear-gradient(180deg,#080b0f 0%,#0c1117 100%);color:#eef2f7}
    .content-hero{padding:54px 0 24px;border-bottom:1px solid rgba(255,255,255,.06)}
    .eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#e0c896;margin-bottom:12px}
    .article-title{margin:0;max-width:960px;font-size:48px;line-height:1.08;letter-spacing:-.03em;color:#f6e7c7}
    .article-excerpt{max-width:820px;margin:18px 0 0;color:#aeb8c8;font-size:18px;line-height:1.85}
    .article-meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
    .meta-pill{display:inline-flex;align-items:center;min-height:34px;padding:0 11px;border:1px solid rgba(224,200,150,.16);border-radius:999px;background:rgba(255,255,255,.04);color:#d8caa8;font-size:13px;font-weight:700}
    .article-shell{padding:28px 0 72px}
    .article-card{max-width:920px;margin:0 auto;border:1px solid rgba(224,200,150,.12);border-radius:24px;background:rgba(255,255,255,.035);padding:34px;box-shadow:0 22px 70px rgba(0,0,0,.24)}
    .article-body{color:#dbe3ee;font-size:17px;line-height:1.92}
    .article-body h2{margin:34px 0 12px;color:#f5e7c7;font-size:28px;line-height:1.22;letter-spacing:-.015em}
    .article-body p{margin:0 0 18px}
    .bottom-nav{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08)}
    .btn-link{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 15px;border-radius:14px;border:1px solid rgba(224,200,150,.18);color:#f5e7c7;text-decoration:none;font-weight:800;background:rgba(255,255,255,.04)}
    .btn-link.primary{background:linear-gradient(180deg,rgba(224,200,150,.20),rgba(224,200,150,.08));border-color:rgba(224,200,150,.32)}
    .status-box{border:1px dashed rgba(224,200,150,.18);border-radius:18px;padding:20px;background:rgba(255,255,255,.03);color:#b9c4d3;line-height:1.75}
    @media(max-width:700px){.content-hero{padding:36px 0 18px}.article-title{font-size:34px}.article-card{padding:22px}.article-body{font-size:16px}}
  </style>
</head>
<body>
  <div id="siteHeader"></div>
  ${body}
  <div id="siteFooter"></div>
  <script src="/assets/app-v5.js"></script>
  <script>DSTS.mountSiteChrome({ active: "${escapeHtml(active)}" });</script>
</body>
</html>`
}

function html(body, status) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
      "x-dsts-ssr-content": "1"
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
