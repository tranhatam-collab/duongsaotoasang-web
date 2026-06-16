import {
  INDEXABLE_STATIC_ROUTES,
  NOINDEX_ROUTES,
  REDIRECT_ROUTES,
  canonicalFor
} from "../functions/_lib/public-routes.js"

const BASE_URL = normalizeBase(process.env.BASE_URL || "https://duongsaotoasang.com")

const INDEXABLE_ROUTES = [
  ...INDEXABLE_STATIC_ROUTES.map((path) => [path, canonicalFor(path)]),
  ["/content?slug=impact-khong-phai-cau-chuyen-cam-dong", "https://duongsaotoasang.com/content?slug=impact-khong-phai-cau-chuyen-cam-dong"],
  ["/content?slug=sang-tao-khong-bat-dau-tu-tham-vong", "https://duongsaotoasang.com/content?slug=sang-tao-khong-bat-dau-tu-tham-vong"]
]

const NOINDEX_ROUTE_CHECKS = NOINDEX_ROUTES.map((path) => [path, canonicalFor(path)])

const REDIRECT_ROUTE_CHECKS = REDIRECT_ROUTES.map(([path, target]) => [path, canonicalFor(target)])

const BLOCKED_PUBLIC_TEXT = [
  "Đang tải nội dung...",
  "Xin chờ trong giây lát.",
  "Đang tải bài viết..."
]
const EXPECTED_OG_IMAGE = "https://duongsaotoasang.com/og.png"

const failures = []

for (const [path, canonical] of INDEXABLE_ROUTES) {
  const response = await fetchRoute(path)
  assert(response.status === 200, `${path} expected 200, got ${response.status}`)
  validateHtmlRoute({ path, html: response.body, canonical, shouldIndex: true })
}

for (const [path, canonical] of NOINDEX_ROUTE_CHECKS) {
  const response = await fetchRoute(path)
  assert(response.status === 200, `${path} expected 200, got ${response.status}`)
  validateHtmlRoute({ path, html: response.body, canonical, shouldIndex: false })
}

for (const [path, canonical] of REDIRECT_ROUTE_CHECKS) {
  const response = await fetchRoute(path)
  assert(response.status === 200, `${path} expected final 200 after redirect, got ${response.status}`)
  validateCanonical({ path, html: response.body, canonical })
}

const sitemap = await fetchRoute("/sitemap.xml")
assert(sitemap.status === 200, `/sitemap.xml expected 200, got ${sitemap.status}`)
for (const [, canonical] of INDEXABLE_ROUTES) {
  assert(sitemap.body.includes(`<loc>${canonical}</loc>`), `sitemap missing indexable URL: ${canonical}`)
}
for (const [, canonical] of NOINDEX_ROUTE_CHECKS) {
  assert(!sitemap.body.includes(`<loc>${canonical}</loc>`), `sitemap must exclude noindex URL: ${canonical}`)
}

const robots = await fetchRoute("/robots.txt")
assert(robots.status === 200, `/robots.txt expected 200, got ${robots.status}`)
assert(robots.body.includes("User-agent: *"), "/robots.txt must target all crawlers")
assert(robots.body.includes("Allow: /"), "/robots.txt must allow crawling")
assert(robots.body.includes("Sitemap: https://duongsaotoasang.com/sitemap.xml"), "/robots.txt must point to production sitemap")
// Only check the generic User-agent: * block for Disallow: / (Cloudflare may inject
// bot-specific Disallow lines which are acceptable — they target specific crawlers
// like GPTBot, not the public site).
const genericBlockMatch = robots.body.match(/User-agent:\s*\*[\s\S]*?(?=User-agent:|$)/i);
const genericBlock = genericBlockMatch ? genericBlockMatch[0] : robots.body;
assert(!/Disallow:\s*\//i.test(genericBlock), "/robots.txt generic block must not disallow the public site")
assert(!robots.body.includes(".html"), "/robots.txt must not point to .html routes")
assert(!robots.body.includes("pages.dev"), "/robots.txt must not use pages.dev")
assert(!robots.body.includes("duongsaotoasang-web"), "/robots.txt must not use wrong Pages project")

const ogImage = await fetchBinary("/og.png")
assert(ogImage.status === 200, `/og.png expected 200, got ${ogImage.status}`)
assert(ogImage.contentType.includes("image/png"), `/og.png must return image/png, got ${ogImage.contentType || "(missing)"}`)
assert(ogImage.bytes > 1000, `/og.png appears empty or too small: ${ogImage.bytes} bytes`)

if (failures.length) {
  console.error("SEO_ROUTE_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`SEO_ROUTE_QA_PASS indexable=${INDEXABLE_ROUTES.length} noindex=${NOINDEX_ROUTE_CHECKS.length} redirects=${REDIRECT_ROUTE_CHECKS.length}`)

function validateHtmlRoute({ path, html, canonical, shouldIndex }) {
  const title = extractTagContent(html, "title")
  const description = extractMeta(html, "name", "description")
  const robots = extractMeta(html, "name", "robots")
  const ogUrl = extractMeta(html, "property", "og:url")
  const ogImage = extractMeta(html, "property", "og:image")
  const twitterImage = extractMeta(html, "name", "twitter:image")

  assert(title.length >= 12, `${path} missing or short <title>`)
  assert(description.length >= 40, `${path} missing or short meta description`)
  assert(hasRobotDirective(robots, shouldIndex ? "index" : "noindex"), `${path} robots mismatch: ${robots || "(missing)"}`)
  assert(!hasRobotDirective(robots, shouldIndex ? "noindex" : "index"), `${path} robots has conflicting directive: ${robots}`)
  validateCanonical({ path, html, canonical })
  assert(ogUrl === canonical, `${path} og:url mismatch: expected ${canonical}, got ${ogUrl || "(missing)"}`)
  assert(ogImage === EXPECTED_OG_IMAGE, `${path} og:image mismatch: expected ${EXPECTED_OG_IMAGE}, got ${ogImage || "(missing)"}`)
  if (twitterImage) {
    assert(twitterImage === EXPECTED_OG_IMAGE, `${path} twitter:image mismatch: expected ${EXPECTED_OG_IMAGE}, got ${twitterImage}`)
  }

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

async function fetchBinary(path) {
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
    const body = await response.arrayBuffer()
    return {
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      bytes: body.byteLength
    }
  } catch (error) {
    failures.push(`${path} fetch failed: ${error.message}`)
    return { status: 0, contentType: "", bytes: 0 }
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
