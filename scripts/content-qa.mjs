import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import {
  FALLBACK_CONTENTS,
  PAGE_CONTENTS,
  POST_CONTENTS,
  findFallback,
  selectFallback
} from "../functions/_lib/content-data.js"

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

const failures = []
const staticContent = readJson("data/content.json")
const staticPosts = readJson("data/posts.json")

assert(Array.isArray(POST_CONTENTS), "POST_CONTENTS must be an array")
assert(Array.isArray(PAGE_CONTENTS), "PAGE_CONTENTS must be an array")
assert(Array.isArray(FALLBACK_CONTENTS), "FALLBACK_CONTENTS must be an array")
assert(POST_CONTENTS.length >= MIN_PUBLIC_POSTS, `POST_CONTENTS must contain at least ${MIN_PUBLIC_POSTS} public posts`)
assert(FALLBACK_CONTENTS.length === POST_CONTENTS.length + PAGE_CONTENTS.length, "FALLBACK_CONTENTS must combine posts and pages")
validateStaticJson()

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
