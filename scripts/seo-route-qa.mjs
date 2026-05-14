const BASE_URL = normalizeBase(process.env.BASE_URL || "https://duongsaotoasang.com")

const INDEXABLE_ROUTES = [
  ["/", "https://duongsaotoasang.com/"],
  ["/about", "https://duongsaotoasang.com/about"],
  ["/program", "https://duongsaotoasang.com/program"],
  ["/posts", "https://duongsaotoasang.com/posts"],
  ["/content?slug=impact-khong-phai-cau-chuyen-cam-dong", "https://duongsaotoasang.com/content?slug=impact-khong-phai-cau-chuyen-cam-dong"],
  ["/content?slug=sang-tao-khong-bat-dau-tu-tham-vong", "https://duongsaotoasang.com/content?slug=sang-tao-khong-bat-dau-tu-tham-vong"],
  ["/events", "https://duongsaotoasang.com/events"],
  ["/scripts", "https://duongsaotoasang.com/scripts"],
  ["/donate", "https://duongsaotoasang.com/donate"],
  ["/transparency", "https://duongsaotoasang.com/transparency"],
  ["/legal", "https://duongsaotoasang.com/legal"],
  ["/privacy", "https://duongsaotoasang.com/privacy"],
  ["/terms", "https://duongsaotoasang.com/terms"],
  ["/support", "https://duongsaotoasang.com/support"],
  ["/contact", "https://duongsaotoasang.com/contact"],
  ["/dream-nurture", "https://duongsaotoasang.com/dream-nurture"],
  ["/movement", "https://duongsaotoasang.com/movement"],
  ["/movement/sponsors", "https://duongsaotoasang.com/movement/sponsors"],
  ["/movement/events", "https://duongsaotoasang.com/movement/events"],
  ["/movement/diaspora-map", "https://duongsaotoasang.com/movement/diaspora-map"],
  ["/movement/press", "https://duongsaotoasang.com/movement/press"],
  ["/movement/partners", "https://duongsaotoasang.com/movement/partners"],
  ["/movement/tour-2026-2027", "https://duongsaotoasang.com/movement/tour-2026-2027"],
  ["/scripts/rising-entrepreneur", "https://duongsaotoasang.com/scripts/rising-entrepreneur"],
  ["/scripts/global-artist", "https://duongsaotoasang.com/scripts/global-artist"],
  ["/scripts/singing-icon", "https://duongsaotoasang.com/scripts/singing-icon"],
  ["/scripts/cinematic-actor", "https://duongsaotoasang.com/scripts/cinematic-actor"],
  ["/scripts/the-thinker", "https://duongsaotoasang.com/scripts/the-thinker"],
  ["/scripts/creative-leader", "https://duongsaotoasang.com/scripts/creative-leader"],
  ["/scripts/cultural-ambassador", "https://duongsaotoasang.com/scripts/cultural-ambassador"],
  ["/scripts/dsts-legacy", "https://duongsaotoasang.com/scripts/dsts-legacy"],
  ["/scripts/global-story", "https://duongsaotoasang.com/scripts/global-story"]
]

const NOINDEX_ROUTES = [
  ["/movement/gala-2026", "https://duongsaotoasang.com/movement/gala-2026"],
  ["/nguoiviet-muonnoi-bridge", "https://duongsaotoasang.com/nguoiviet-muonnoi-bridge"]
]

const REDIRECT_ROUTES = [
  ["/programs", "https://duongsaotoasang.com/program"],
  ["/refund", "https://duongsaotoasang.com/legal"]
]

const BLOCKED_PUBLIC_TEXT = [
  "Đang tải nội dung...",
  "Xin chờ trong giây lát.",
  "Đang tải bài viết..."
]

const failures = []

for (const [path, canonical] of INDEXABLE_ROUTES) {
  const response = await fetchRoute(path)
  assert(response.status === 200, `${path} expected 200, got ${response.status}`)
  validateHtmlRoute({ path, html: response.body, canonical, shouldIndex: true })
}

for (const [path, canonical] of NOINDEX_ROUTES) {
  const response = await fetchRoute(path)
  assert(response.status === 200, `${path} expected 200, got ${response.status}`)
  validateHtmlRoute({ path, html: response.body, canonical, shouldIndex: false })
}

for (const [path, canonical] of REDIRECT_ROUTES) {
  const response = await fetchRoute(path)
  assert(response.status === 200, `${path} expected final 200 after redirect, got ${response.status}`)
  validateCanonical({ path, html: response.body, canonical })
}

const sitemap = await fetchRoute("/sitemap.xml")
assert(sitemap.status === 200, `/sitemap.xml expected 200, got ${sitemap.status}`)
for (const [, canonical] of INDEXABLE_ROUTES) {
  assert(sitemap.body.includes(`<loc>${canonical}</loc>`), `sitemap missing indexable URL: ${canonical}`)
}
for (const [, canonical] of NOINDEX_ROUTES) {
  assert(!sitemap.body.includes(`<loc>${canonical}</loc>`), `sitemap must exclude noindex URL: ${canonical}`)
}

if (failures.length) {
  console.error("SEO_ROUTE_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`SEO_ROUTE_QA_PASS indexable=${INDEXABLE_ROUTES.length} noindex=${NOINDEX_ROUTES.length} redirects=${REDIRECT_ROUTES.length}`)

function validateHtmlRoute({ path, html, canonical, shouldIndex }) {
  const title = extractTagContent(html, "title")
  const description = extractMeta(html, "name", "description")
  const robots = extractMeta(html, "name", "robots")
  const ogUrl = extractMeta(html, "property", "og:url")

  assert(title.length >= 12, `${path} missing or short <title>`)
  assert(description.length >= 40, `${path} missing or short meta description`)
  assert(hasRobotDirective(robots, shouldIndex ? "index" : "noindex"), `${path} robots mismatch: ${robots || "(missing)"}`)
  assert(!hasRobotDirective(robots, shouldIndex ? "noindex" : "index"), `${path} robots has conflicting directive: ${robots}`)
  validateCanonical({ path, html, canonical })
  assert(ogUrl === canonical, `${path} og:url mismatch: expected ${canonical}, got ${ogUrl || "(missing)"}`)

  for (const text of BLOCKED_PUBLIC_TEXT) {
    assert(!html.includes(text), `${path} contains loading placeholder text: ${text}`)
  }
}

function validateCanonical({ path, html, canonical }) {
  const actual = extractCanonical(html)
  assert(actual === canonical, `${path} canonical mismatch: expected ${canonical}, got ${actual || "(missing)"}`)
  assert(!actual.endsWith(".html"), `${path} canonical must not end in .html: ${actual}`)
  assert(!actual.includes("pages.dev"), `${path} canonical must not use pages.dev: ${actual}`)
  assert(!actual.includes("duongsaotoasang-web"), `${path} canonical must not use wrong Pages project: ${actual}`)
}

async function fetchRoute(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "DSTS-SEO-QA/1.0"
      }
    })
    const body = await response.text()
    return { status: response.status, body }
  } catch (error) {
    failures.push(`${path} fetch failed: ${error.message}`)
    return { status: 0, body: "" }
  } finally {
    clearTimeout(timeout)
  }
}

function normalizeBase(value) {
  return String(value || "").replace(/\/+$/, "")
}

function extractCanonical(html) {
  const match = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)
    || html.match(/<link\b[^>]*rel=canonical[^>]*>/i)
  return match ? extractAttr(match[0], "href") : ""
}

function extractMeta(html, attrName, attrValue) {
  const escaped = escapeRegExp(attrValue)
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attrName}=["']${escaped}["'])[^>]*>`, "i")
  const match = html.match(pattern)
  return match ? extractAttr(match[0], "content") : ""
}

function extractTagContent(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i")
  const match = html.match(pattern)
  return match ? decodeEntities(match[1].trim()) : ""
}

function extractAttr(tag, attrName) {
  const pattern = new RegExp(`\\b${attrName}=["']([^"']*)["']`, "i")
  const match = tag.match(pattern)
  return match ? decodeEntities(match[1].trim()) : ""
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hasRobotDirective(value, directive) {
  return String(value || "")
    .toLowerCase()
    .split(",")
    .map((part) => part.trim())
    .includes(directive)
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
