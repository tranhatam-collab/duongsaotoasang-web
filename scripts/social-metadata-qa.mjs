import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")
const PRODUCTION_ORIGIN = "https://duongsaotoasang.com"
const DEFAULT_SOCIAL_IMAGE = `${PRODUCTION_ORIGIN}/og.png`

const failures = []
const files = trackedHtmlFiles()

for (const file of files) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  const head = matchOne(source, /<head[^>]*>([\s\S]*?)<\/head>/i, `${file} must include a <head>`)
  const robots = readRequiredMeta(head, "name", "robots", "content", file)
  const canonical = readRequiredLink(head, "canonical", file)

  const ogTitle = readRequiredMeta(head, "property", "og:title", "content", file)
  const ogDescription = readRequiredMeta(head, "property", "og:description", "content", file)
  const ogUrl = readRequiredMeta(head, "property", "og:url", "content", file)
  const ogImage = readRequiredMeta(head, "property", "og:image", "content", file)
  const twitterCard = readRequiredMeta(head, "name", "twitter:card", "content", file)
  const twitterImage = readRequiredMeta(head, "name", "twitter:image", "content", file)
  const twitterTitle = readOptionalMeta(head, "name", "twitter:title", "content", file)
  const twitterDescription = readOptionalMeta(head, "name", "twitter:description", "content", file)

  validateTextLength(ogTitle, 10, 120, `${file} og:title`)
  validateTextLength(ogDescription, 40, 320, `${file} og:description`)
  validateProductionUrl(file, "og:url", ogUrl)
  validateProductionUrl(file, "og:image", ogImage)
  validateProductionUrl(file, "twitter:image", twitterImage)

  assert(ogImage === DEFAULT_SOCIAL_IMAGE, `${file} og:image must be ${DEFAULT_SOCIAL_IMAGE}`)
  assert(twitterImage === DEFAULT_SOCIAL_IMAGE, `${file} twitter:image must be ${DEFAULT_SOCIAL_IMAGE}`)
  assert(["summary_large_image", "summary"].includes(twitterCard), `${file} twitter:card must be summary_large_image or summary`)

  if (twitterTitle) validateTextLength(twitterTitle, 10, 120, `${file} twitter:title`)
  if (twitterDescription) validateTextLength(twitterDescription, 40, 320, `${file} twitter:description`)

  if (isIndexable(robots)) {
    assert(ogUrl === canonical, `${file} og:url expected canonical ${canonical}, got ${ogUrl}`)
  }
}

if (failures.length) {
  console.error("SOCIAL_METADATA_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`SOCIAL_METADATA_QA_PASS pages=${files.length}`)

function trackedHtmlFiles() {
  const output = execFileSync("git", ["ls-files", "*.html"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  })

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => !file.startsWith("_archive_2026-05-13/"))
}

function readRequiredMeta(head, key, value, attribute, file) {
  const tags = findMetaTags(head, key, value)
  assert(tags.length === 1, `${file} must include exactly one meta ${value}, got ${tags.length}`)
  return normalizeText(readAttribute(tags[0] || "", attribute))
}

function readOptionalMeta(head, key, value, attribute, file) {
  const tags = findMetaTags(head, key, value)
  assert(tags.length <= 1, `${file} must include at most one meta ${value}, got ${tags.length}`)
  return normalizeText(readAttribute(tags[0] || "", attribute))
}

function readRequiredLink(head, rel, file) {
  const tags = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => new RegExp(`\\brel=["']${escapeRegExp(rel)}["']`, "i").test(tag))

  assert(tags.length === 1, `${file} must include exactly one link rel=${rel}, got ${tags.length}`)
  return normalizeText(readAttribute(tags[0] || "", "href"))
}

function findMetaTags(head, key, value) {
  return [...head.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => new RegExp(`\\b${escapeRegExp(key)}=["']${escapeRegExp(value)}["']`, "i").test(tag))
}

function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(attribute)}=["']([^"']*)["']`, "i"))
  return match ? match[1] : ""
}

function validateTextLength(value, min, max, label) {
  assert(Boolean(value), `${label} must not be empty`)
  assert(value.length >= min, `${label} must be at least ${min} chars, got ${value.length}`)
  assert(value.length <= max, `${label} must be at most ${max} chars, got ${value.length}`)
  validateNoKnownBadValue(value, label)
}

function validateProductionUrl(file, label, value) {
  assert(Boolean(value), `${file} ${label} must not be empty`)
  assert(value.startsWith(`${PRODUCTION_ORIGIN}/`), `${file} ${label} must use production origin`)
  validateNoKnownBadValue(value, `${file} ${label}`)
}

function validateNoKnownBadValue(value, label) {
  const blocked = [
    [/duongsaotoasang-web/i, "wrong Pages project"],
    [/pages\.dev/i, "preview domain"],
    [/localhost|127\.0\.0\.1/i, "local URL"],
    [/Lorem ipsum/i, "placeholder lorem ipsum"]
  ]

  for (const [pattern, name] of blocked) {
    assert(!pattern.test(value), `${label} must not contain ${name}`)
  }
}

function isIndexable(robots) {
  return robots === "index,follow"
}

function matchOne(source, pattern, message) {
  const match = source.match(pattern)
  assert(Boolean(match), message)
  return match ? match[1] : ""
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim()
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
