import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")
const PRODUCTION_ORIGIN = "https://duongsaotoasang.com"

const failures = []
const files = trackedHtmlFiles()
const seenCanonical = new Map()
const seenTitle = new Map()
const seenDescription = new Map()

for (const file of files) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  const head = matchOne(source, /<head[^>]*>([\s\S]*?)<\/head>/i, `${file} must include a <head>`)
  const htmlOpen = matchOne(source, /<html\b([^>]*)>/i, `${file} must include an <html> tag`)
  const h1Tags = source.match(/<h1\b/gi) || []
  const title = extractTagText(head || "", "title", file)
  const description = extractMetaContent(head || "", "description", file)
  const canonical = extractLinkHref(head || "", "canonical", file)
  const robots = extractMetaContent(head || "", "robots", file)

  assert(htmlOpen && /\blang=["']vi["']/i.test(htmlOpen), `${file} html lang must be vi`)
  assert(h1Tags.length === 1, `${file} must have exactly one <h1>, got ${h1Tags.length}`)

  validateTextLength(title, 10, 90, `${file} <title>`)
  validateTextLength(description, 40, 320, `${file} meta description`)
  validateCanonical(file, canonical, robots)
  validateRobots(file, robots)
  validateNoKnownBadContent(file, source)

  if (isIndexable(robots)) {
    rememberUnique(seenCanonical, canonical, file, "canonical")
    rememberUnique(seenTitle, title, file, "title")
    rememberUnique(seenDescription, description, file, "description")
  }
}

if (failures.length) {
  console.error("HTML_STRUCTURE_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`HTML_STRUCTURE_QA_PASS pages=${files.length}`)

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

function extractTagText(source, tagName, file) {
  const matches = [...source.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"))]
  assert(matches.length === 1, `${file} must include exactly one <${tagName}>, got ${matches.length}`)
  return normalizeText(matches[0]?.[1] || "")
}

function extractMetaContent(source, name, file) {
  const matches = [...source.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => new RegExp(`\\bname=["']${escapeRegExp(name)}["']`, "i").test(tag))

  assert(matches.length === 1, `${file} must include exactly one meta ${name}, got ${matches.length}`)
  return normalizeText(readAttribute(matches[0] || "", "content"))
}

function extractLinkHref(source, rel, file) {
  const matches = [...source.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => new RegExp(`\\brel=["']${escapeRegExp(rel)}["']`, "i").test(tag))

  assert(matches.length === 1, `${file} must include exactly one link rel=${rel}, got ${matches.length}`)
  return normalizeText(readAttribute(matches[0] || "", "href"))
}

function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(attribute)}=["']([^"']*)["']`, "i"))
  return match ? match[1] : ""
}

function validateTextLength(value, min, max, label) {
  assert(Boolean(value), `${label} must not be empty`)
  assert(value.length >= min, `${label} must be at least ${min} chars, got ${value.length}`)
  assert(value.length <= max, `${label} must be at most ${max} chars, got ${value.length}`)
}

function validateCanonical(file, canonical, robots) {
  assert(Boolean(canonical), `${file} canonical must not be empty`)
  assert(canonical.startsWith(`${PRODUCTION_ORIGIN}/`), `${file} canonical must use production origin`)
  assert(!canonical.includes("pages.dev"), `${file} canonical must not use pages.dev`)
  assert(!canonical.includes("duongsaotoasang-web"), `${file} canonical must not use wrong Pages project`)

  if (isIndexable(robots)) {
    assert(!canonical.includes(".html"), `${file} indexable canonical must use clean URL`)
    const expected = `${PRODUCTION_ORIGIN}${routeFromHtmlFile(file)}`
    assert(canonical === expected, `${file} canonical expected ${expected}, got ${canonical}`)
  }
}

function validateRobots(file, robots) {
  assert(["index,follow", "noindex,follow"].includes(robots), `${file} robots must be index,follow or noindex,follow`)
}

function validateNoKnownBadContent(file, source) {
  const blocked = [
    [/duongsaotoasang-web/i, "wrong Pages project"],
    [/pages\.dev/i, "preview domain"],
    [/Đang tải nội dung|Đang tải bài viết|Xin chờ trong giây lát/i, "legacy loading placeholder"],
    [/Lorem ipsum/i, "placeholder lorem ipsum"]
  ]

  for (const [pattern, label] of blocked) {
    assert(!pattern.test(source), `${file} must not contain ${label}`)
  }
}

function rememberUnique(map, value, file, label) {
  if (!value) return
  if (!map.has(value)) {
    map.set(value, file)
    return
  }
  failures.push(`${label} must be unique across indexable pages: ${value} (${map.get(value)}, ${file})`)
}

function routeFromHtmlFile(file) {
  if (file === "index.html") return "/"
  if (file.endsWith("/index.html")) return `/${file.slice(0, -"/index.html".length)}`
  return `/${file.slice(0, -".html".length)}`
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
