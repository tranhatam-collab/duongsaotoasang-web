import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import {
  FALLBACK_CONTENTS,
  PAGE_CONTENTS,
  POST_CONTENTS,
  findFallback,
  selectFallback
} from "../functions/_lib/content-data.js"
import {
  INDEXABLE_STATIC_ROUTES,
  NOINDEX_ROUTES,
  canonicalFor
} from "../functions/_lib/public-routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const MIN_PUBLIC_POSTS = 24
const MAX_RSS_POSTS = 50
const MAX_SITEMAP_POSTS = 100
const REQUIRED_PAGE_SLUGS = ["about", "program"]
const BLOCKED_INLINE_PATTERNS = [
  /<script\b/i,
  /\son[a-z]+\s*=/i,
  /javascript:/i,
  /data:text\/html/i
]
const SCRIPT_DETAIL_FILES = [
  "scripts/rising-entrepreneur.html",
  "scripts/global-artist.html",
  "scripts/singing-icon.html",
  "scripts/cinematic-actor.html",
  "scripts/the-thinker.html",
  "scripts/creative-leader.html",
  "scripts/cultural-ambassador.html",
  "scripts/dsts-legacy.html",
  "scripts/global-story.html"
]

const failures = []
const staticContent = readJson("data/content.json")
const staticPosts = readJson("data/posts.json")

assert(Array.isArray(POST_CONTENTS), "POST_CONTENTS must be an array")
assert(Array.isArray(PAGE_CONTENTS), "PAGE_CONTENTS must be an array")
assert(Array.isArray(FALLBACK_CONTENTS), "FALLBACK_CONTENTS must be an array")
assert(POST_CONTENTS.length >= MIN_PUBLIC_POSTS, `POST_CONTENTS must contain at least ${MIN_PUBLIC_POSTS} public posts`)
assert(FALLBACK_CONTENTS.length === POST_CONTENTS.length + PAGE_CONTENTS.length, "FALLBACK_CONTENTS must combine posts and pages")
validateStaticJson()
validateStaticSitemap()
validateInlineFallbacks()
validateStaticLoadingPlaceholders()
validateAppShellReferences()
validatePublicLaneBoundaries()

const allSlugs = new Set()
const postSlugs = new Set()

for (const item of FALLBACK_CONTENTS) {
  validateBaseItem(item)

  assert(!allSlugs.has(item.slug), `Duplicate fallback slug: ${item.slug}`)
  allSlugs.add(item.slug)

  if (item.type === "post") {
    validatePost(item)
    postSlugs.add(item.slug)
  }

  if (item.type === "page") {
    validatePage(item)
  }
}

for (const slug of REQUIRED_PAGE_SLUGS) {
  assert(PAGE_CONTENTS.some((item) => item.slug === slug), `Missing required fallback page: ${slug}`)
}

const selectedPosts = selectFallback({ type: "post", limit: MIN_PUBLIC_POSTS, lang: "vi" })
assert(selectedPosts.length === MIN_PUBLIC_POSTS, `selectFallback must return ${MIN_PUBLIC_POSTS} posts for baseline limit`)

const selectedDates = selectedPosts.map((item) => new Date(item.created_at).getTime())
for (let i = 1; i < selectedDates.length; i += 1) {
  assert(selectedDates[i - 1] >= selectedDates[i], "selectFallback posts must be sorted newest-first")
}

for (const slug of postSlugs) {
  const item = findFallback(slug, "vi")
  assert(item && item.slug === slug, `findFallback must resolve post slug: ${slug}`)
  assert(typeof item.title === "string" && item.title.length > 0, `findFallback must localize title for: ${slug}`)
  assert(typeof item.content === "string" && item.content.length > 0, `findFallback must localize content for: ${slug}`)
}

validateFeedFunction("functions/rss.xml.js", MAX_RSS_POSTS)
validateFeedFunction("functions/sitemap.xml.js", MAX_SITEMAP_POSTS)

if (failures.length) {
  console.error("CONTENT_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`CONTENT_QA_PASS posts=${POST_CONTENTS.length} pages=${PAGE_CONTENTS.length} fallback=${FALLBACK_CONTENTS.length}`)

function validateStaticJson() {
  assert(Array.isArray(staticContent), "data/content.json must be an array")
  assert(Array.isArray(staticPosts), "data/posts.json must be an array")
  if (!Array.isArray(staticContent) || !Array.isArray(staticPosts)) return

  assert(staticContent.length === FALLBACK_CONTENTS.length, `data/content.json must contain ${FALLBACK_CONTENTS.length} items, got ${staticContent.length}`)
  assert(staticPosts.length === POST_CONTENTS.length, `data/posts.json must contain ${POST_CONTENTS.length} posts, got ${staticPosts.length}`)
  assertSameSlugSet(staticContent, FALLBACK_CONTENTS, "data/content.json")
  assertSameSlugSet(staticPosts, POST_CONTENTS, "data/posts.json")

  for (const item of staticPosts) {
    assert(!("content" in item), `data/posts.json must not include content for ${item.slug}`)
    assert(!("content_vi" in item), `data/posts.json must not include content_vi for ${item.slug}`)
    assert(!("content_en" in item), `data/posts.json must not include content_en for ${item.slug}`)
  }
}

function validateStaticSitemap() {
  const source = readFileSync(join(repoRoot, "sitemap.xml"), "utf8")
  const locs = Array.from(source.matchAll(/<loc>([\s\S]*?)<\/loc>/g), (match) => decodeXml(match[1].trim()))
  const locSet = new Set(locs)
  const expectedStatic = INDEXABLE_STATIC_ROUTES.map(canonicalFor)
  const expectedPosts = POST_CONTENTS.map((post) => canonicalFor(`/content?slug=${post.slug}`))
  const expected = [...expectedStatic, ...expectedPosts]

  assert(locs.length === expected.length, `sitemap.xml must contain ${expected.length} URLs, got ${locs.length}`)
  for (const loc of expected) {
    assert(locSet.has(loc), `sitemap.xml missing URL: ${loc}`)
  }
  for (const path of NOINDEX_ROUTES) {
    assert(!locSet.has(canonicalFor(path)), `sitemap.xml must exclude noindex URL: ${canonicalFor(path)}`)
  }
  for (const loc of locs) {
    assert(loc.startsWith("https://duongsaotoasang.com/"), `sitemap.xml URL must use production domain: ${loc}`)
    assert(!loc.includes(".html"), `sitemap.xml URL must use clean route, not .html: ${loc}`)
    assert(!loc.includes("pages.dev"), `sitemap.xml URL must not use preview domain: ${loc}`)
    assert(!loc.includes("duongsaotoasang-web"), `sitemap.xml URL must not use wrong Pages project: ${loc}`)
  }
}

function validateInlineFallbacks() {
  const inlinePosts = parseInlineJson("posts.html", /const fallbackPosts = (\[[\s\S]*?\]);/)
  const inlineContents = parseInlineJson("content.html", /const fallbackContents = (\{[\s\S]*?\});\s+function resolveTitle/)

  assert(Array.isArray(inlinePosts), "posts.html inline fallbackPosts must be an array")
  assert(inlineContents && typeof inlineContents === "object" && !Array.isArray(inlineContents), "content.html inline fallbackContents must be an object")

  if (Array.isArray(inlinePosts)) {
    assert(inlinePosts.length === POST_CONTENTS.length, `posts.html inline fallbackPosts must contain ${POST_CONTENTS.length} posts, got ${inlinePosts.length}`)
    assertSameSlugSet(inlinePosts, POST_CONTENTS, "posts.html inline fallbackPosts")
  }

  if (inlineContents && typeof inlineContents === "object" && !Array.isArray(inlineContents)) {
    const inlineContentItems = Object.values(inlineContents)
    assert(inlineContentItems.length === FALLBACK_CONTENTS.length, `content.html inline fallbackContents must contain ${FALLBACK_CONTENTS.length} items, got ${inlineContentItems.length}`)
    assertSameSlugSet(inlineContentItems, FALLBACK_CONTENTS, "content.html inline fallbackContents")
  }
}

function validateStaticLoadingPlaceholders() {
  const checks = [
    ["content.html", /id="pageTitle">Đang tải nội dung\.\.\.</],
    ["content.html", /id="pageExcerpt">Xin chờ trong giây lát\.</],
    ["content.html", /id="loadingText">Đang tải nội dung\.\.\.</],
    ["content.html", /loadingTitle:\s*"Đang tải nội dung\.\.\."/],
    ["content.html", /loadingDesc:\s*"Xin chờ trong giây lát\."/],
    ["content.html", /loadingBody:\s*"Đang tải nội dung\.\.\."/],
    ["content.html", /loadingTitle:\s*"Loading content\.\.\."/],
    ["content.html", /loadingBody:\s*"Loading content\.\.\."/],
    ["posts.html", /loading:\s*"Đang tải bài viết\.\.\."/],
    ["posts.html", /loading:\s*"Loading articles\.\.\."/]
  ]

  for (const [relativePath, pattern] of checks) {
    const source = readFileSync(join(repoRoot, relativePath), "utf8")
    assert(!pattern.test(source), `${relativePath} must not ship legacy loading placeholder: ${pattern}`)
  }
}

function validateAppShellReferences() {
  const htmlFiles = listHtmlFiles(repoRoot)
  for (const relativePath of htmlFiles) {
    const source = readFileSync(join(repoRoot, relativePath), "utf8")
    assert(!/from\s+["']\/app\.js["']/i.test(source), `${relativePath} must not import legacy /app.js`)
    assert(!/<script[^>]+src=["']\/app\.js["']/i.test(source), `${relativePath} must not load legacy /app.js`)
    assert(!/<script[^>]+src=["']\/assets\/app\.js["']/i.test(source), `${relativePath} must not load legacy /assets/app.js`)
  }
}

function validatePublicLaneBoundaries() {
  const contact = readFileSync(join(repoRoot, "contact.html"), "utf8")
  assert(contact.includes('data-dsts-contact-mode="manual-only"'), "contact.html must disclose manual-only contact mode")
  assert(!/<form\b/i.test(contact), "contact.html must not ship a public form while email automation is owned by another lane")
  assert(!/tel:\+84123456789/i.test(contact), "contact.html must not ship placeholder phone number")
  assert(!/facebook\.com\/duongsaotoasang|twitter\.com\/duongsaotoasang|instagram\.com\/duongsaotoasang|youtube\.com\/@duongsaotoasang/i.test(contact), "contact.html must not ship unverified social links")

  const notFound = readFileSync(join(repoRoot, "404.html"), "utf8")
  assert(notFound.includes('href="/contact"'), "404.html must route users to manual contact page")
  assert(notFound.includes('href="/support"'), "404.html must route users to support guidance")
  assert(!/contact@duongsaotoasang\.com|duongsaotoasang@gmail\.com|mailto:/i.test(notFound), "404.html must not expose raw email/admin addresses")

  const movementFallback = readFileSync(join(repoRoot, "movement/coming-soon.html"), "utf8")
  assert(movementFallback.includes('meta name="robots" content="noindex,follow"'), "movement/coming-soon.html must stay noindex")
  assert(movementFallback.includes("/assets/app-v5.js"), "movement/coming-soon.html must load current app shell")
  assert(movementFallback.includes("không thu email"), "movement/coming-soon.html must disclose no email collection")
  assert(movementFallback.includes("không xử lý payment"), "movement/coming-soon.html must disclose no payment processing")
  assert(movementFallback.includes("không tạo tài khoản"), "movement/coming-soon.html must disclose no account creation")
  assert(!/<form\b/i.test(movementFallback), "movement/coming-soon.html must not ship public forms")
  assert(!/mailto:/i.test(movementFallback), "movement/coming-soon.html must not bypass manual contact page with mailto links")
  assert(!/href=["']\/donate["']/i.test(movementFallback), "movement/coming-soon.html must not route pending Movement users to donate")

  for (const relativePath of SCRIPT_DETAIL_FILES) {
    const source = readFileSync(join(repoRoot, relativePath), "utf8")
    assert(source.includes('data-dsts-review-mode="sample-only"'), `${relativePath} must disclose sample-only review mode`)
    assert(source.includes("Kênh gửi đánh giá chưa mở"), `${relativePath} must explain review submission is closed`)
    assert(source.includes("Người đánh giá minh họa A"), `${relativePath} must use generic Vietnamese sample reviewer label A`)
    assert(source.includes("Người đánh giá minh họa B"), `${relativePath} must use generic Vietnamese sample reviewer label B`)
    assert(source.includes("Sample reviewer A"), `${relativePath} must use generic English sample reviewer label A`)
    assert(source.includes("Sample reviewer B"), `${relativePath} must use generic English sample reviewer label B`)
    assert(!/<form\b/i.test(source), `${relativePath} must not ship public review forms`)
    assert(!/id="formSubmit"|id="formName"|id="formComment"|id="formRating"/i.test(source), `${relativePath} must not ship inactive review input controls`)
    assert(!/class="comment-form"|\.comment-form|formName|formComment|formSubmit|formRating|Submit review/i.test(source), `${relativePath} must not keep dead review form code or labels`)
  }
}

function listHtmlFiles(dir, prefix = "") {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    if (entry.name === "node_modules" || entry.name === "docs" || entry.name === "_site") continue
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listHtmlFiles(fullPath, relativePath))
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(relativePath)
    }
  }
  return files
}

function validateBaseItem(item) {
  assert(item && typeof item === "object", "Fallback item must be an object")
  assert(matches(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/), `Invalid slug format: ${item.slug}`)
  assert(["post", "page"].includes(item.type), `Invalid content type for ${item.slug}: ${item.type}`)
  assert(nonEmpty(item.title_vi, 12), `Missing or short title_vi for ${item.slug}`)
  assert(nonEmpty(item.title_en, 12), `Missing or short title_en for ${item.slug}`)
  assert(nonEmpty(item.excerpt_vi, 40), `Missing or short excerpt_vi for ${item.slug}`)
  assert(nonEmpty(item.excerpt_en, 40), `Missing or short excerpt_en for ${item.slug}`)
  assert(nonEmpty(item.content_vi, 80), `Missing or short content_vi for ${item.slug}`)
  assert(nonEmpty(item.content_en, 80), `Missing or short content_en for ${item.slug}`)
  assert(nonEmpty(item.tags, 3), `Missing tags for ${item.slug}`)
  assert(nonEmpty(item.reading_time, 3), `Missing reading_time for ${item.slug}`)
  assert(validDate(item.created_at), `Invalid created_at for ${item.slug}: ${item.created_at}`)

  const htmlFields = [item.content_vi, item.content_en]
  for (const field of htmlFields) {
    for (const pattern of BLOCKED_INLINE_PATTERNS) {
      assert(!pattern.test(field), `Unsafe inline HTML pattern ${pattern} in ${item.slug}`)
    }
  }
}

function validatePost(item) {
  assert(wordCount(stripHtml(item.content_vi)) >= 220, `content_vi too thin for post ${item.slug}`)
  assert(wordCount(stripHtml(item.content_en)) >= 90, `content_en too thin for post ${item.slug}`)
  assert(item.type === "post", `Post validator received non-post ${item.slug}`)
}

function validatePage(item) {
  assert(wordCount(stripHtml(item.content_vi)) >= 8, `content_vi too thin for page ${item.slug}`)
  assert(wordCount(stripHtml(item.content_en)) >= 8, `content_en too thin for page ${item.slug}`)
}

function validateFeedFunction(relativePath, minimumLimit) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8")
  assert(source.includes("selectFallback"), `${relativePath} must use fallback content source`)
  assert(source.includes("type: \"post\""), `${relativePath} must include post fallback URLs/items`)

  const match = source.match(/limit:\s*(\d+)/)
  assert(match, `${relativePath} must declare a fallback limit`)
  if (match) {
    const limit = Number.parseInt(match[1], 10)
    assert(limit >= Math.min(minimumLimit, POST_CONTENTS.length), `${relativePath} fallback limit ${limit} is too low for ${POST_CONTENTS.length} posts`)
  }
}

function assertSameSlugSet(actualItems, expectedItems, label) {
  const actual = actualItems.map((item) => item.slug).sort()
  const expected = expectedItems.map((item) => item.slug).sort()
  assert(actual.length === expected.length, `${label} slug count mismatch`)
  for (let i = 0; i < expected.length; i += 1) {
    assert(actual[i] === expected[i], `${label} slug mismatch at ${i}: expected ${expected[i]}, got ${actual[i]}`)
  }
}

function readJson(relativePath) {
  try {
    return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8"))
  } catch (error) {
    failures.push(`${relativePath} must be valid JSON: ${error.message}`)
    return null
  }
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function parseInlineJson(relativePath, pattern) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8")
  const match = source.match(pattern)
  if (!match) {
    failures.push(`${relativePath} missing expected inline fallback block`)
    return null
  }

  try {
    return JSON.parse(match[1])
  } catch (error) {
    failures.push(`${relativePath} inline fallback block must be valid JSON: ${error.message}`)
    return null
  }
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}

function matches(value, pattern) {
  return typeof value === "string" && pattern.test(value)
}

function nonEmpty(value, minLength) {
  return typeof value === "string" && value.trim().length >= minLength
}

function validDate(value) {
  if (!value) return false
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp)
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
}

function wordCount(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}
