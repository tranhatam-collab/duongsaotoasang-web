import { FALLBACK_CONTENTS, PAGE_CONTENTS, POST_CONTENTS } from "../functions/_lib/content-data.js"

const MIN_POST_WORDS_VI = 360
const MIN_POST_WORDS_EN = 140
const MIN_PAGE_WORDS_VI = 180
const MIN_PAGE_WORDS_EN = 110
const MIN_EXCERPT_CHARS_VI = 80
const MIN_EXCERPT_CHARS_EN = 60
const MIN_POST_H2 = 2
const MIN_PAGE_H2 = 2
const BLOCKED_PATTERNS = [
  /\bTODO\b/i,
  /Lorem ipsum/i,
  /coming soon/i,
  /placeholder/i,
  /đang cập nhật/i,
  /dang cap nhat/i
]

const failures = []

assert(Array.isArray(POST_CONTENTS), "POST_CONTENTS must be an array")
assert(Array.isArray(PAGE_CONTENTS), "PAGE_CONTENTS must be an array")
assert(Array.isArray(FALLBACK_CONTENTS), "FALLBACK_CONTENTS must be an array")

for (const item of POST_CONTENTS) {
  validateArticle(item, {
    kind: "post",
    minWordsVi: MIN_POST_WORDS_VI,
    minWordsEn: MIN_POST_WORDS_EN,
    minH2: MIN_POST_H2
  })
}

for (const item of PAGE_CONTENTS) {
  validateArticle(item, {
    kind: "page",
    minWordsVi: MIN_PAGE_WORDS_VI,
    minWordsEn: MIN_PAGE_WORDS_EN,
    minH2: MIN_PAGE_H2
  })
}

if (failures.length) {
  console.error("CONTENT_DEPTH_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`CONTENT_DEPTH_QA_PASS posts=${POST_CONTENTS.length} pages=${PAGE_CONTENTS.length} min_post_words_vi=${MIN_POST_WORDS_VI} min_page_words_vi=${MIN_PAGE_WORDS_VI}`)

function validateArticle(item, options) {
  const label = `${options.kind}:${item.slug || "(missing-slug)"}`
  const contentVi = String(item.content_vi || "")
  const contentEn = String(item.content_en || "")
  const plainVi = stripHtml(contentVi)
  const plainEn = stripHtml(contentEn)
  const h2Vi = countTags(contentVi, "h2")
  const h2En = countTags(contentEn, "h2")

  assert(Boolean(item.slug), `${label} must have slug`)
  assert(Boolean(item.title_vi), `${label} must have title_vi`)
  assert(Boolean(item.title_en), `${label} must have title_en`)
  assert(Boolean(item.excerpt_vi), `${label} must have excerpt_vi`)
  assert(Boolean(item.excerpt_en), `${label} must have excerpt_en`)
  assert(String(item.excerpt_vi || "").length >= MIN_EXCERPT_CHARS_VI, `${label} excerpt_vi must be at least ${MIN_EXCERPT_CHARS_VI} chars`)
  assert(String(item.excerpt_en || "").length >= MIN_EXCERPT_CHARS_EN, `${label} excerpt_en must be at least ${MIN_EXCERPT_CHARS_EN} chars`)
  assert(wordCount(plainVi) >= options.minWordsVi, `${label} content_vi must be at least ${options.minWordsVi} words`)
  assert(wordCount(plainEn) >= options.minWordsEn, `${label} content_en must be at least ${options.minWordsEn} words`)
  assert(h2Vi >= options.minH2, `${label} content_vi must include at least ${options.minH2} h2 sections`)
  assert(h2En >= options.minH2, `${label} content_en must include at least ${options.minH2} h2 sections`)
  assert(countTags(contentVi, "p") >= 4, `${label} content_vi must include at least 4 paragraphs`)
  assert(countTags(contentEn, "p") >= 4, `${label} content_en must include at least 4 paragraphs`)
  assert(tags(item.tags).length >= 2, `${label} must include at least 2 tags`)
  assert(/phút đọc/i.test(String(item.reading_time || "")), `${label} reading_time must be Vietnamese public reading time`)
  assert(isValidIsoDate(item.created_at), `${label} created_at must be a valid ISO date`)

  const combined = [
    item.title_vi,
    item.title_en,
    item.excerpt_vi,
    item.excerpt_en,
    contentVi,
    contentEn
  ].join("\n")

  for (const pattern of BLOCKED_PATTERNS) {
    assert(!pattern.test(combined), `${label} must not contain placeholder marker: ${pattern}`)
  }
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function wordCount(value) {
  return String(value || "").split(/\s+/).filter(Boolean).length
}

function countTags(value, tagName) {
  const matches = String(value || "").match(new RegExp(`<${tagName}\\b`, "gi"))
  return matches ? matches.length : 0
}

function tags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function isValidIsoDate(value) {
  const date = new Date(value)
  return Boolean(value) && !Number.isNaN(date.getTime())
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
