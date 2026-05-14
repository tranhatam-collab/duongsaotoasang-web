import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")
const SITE_ORIGIN = "https://duongsaotoasang.com"

const failures = []
const files = trackedHtmlFiles()
let blockCount = 0
let objectCount = 0

for (const file of files) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  const robots = extractMetaContent(source, "robots")
  const blocks = extractJsonLdBlocks(source)

  if (isIndexable(robots)) {
    assert(blocks.length > 0, `${file} indexable page must include JSON-LD structured data`)
  }

  for (const block of blocks) {
    blockCount += 1
    let parsed
    try {
      parsed = JSON.parse(block)
    } catch (error) {
      failures.push(`${file} JSON-LD block ${blockCount} must parse: ${error.message}`)
      continue
    }

    for (const entity of flattenEntities(parsed)) {
      objectCount += 1
      validateEntity(file, entity, isIndexable(robots))
    }

    validateNoBadUrls(file, parsed, isIndexable(robots))
  }
}

if (failures.length) {
  console.error("STRUCTURED_DATA_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`STRUCTURED_DATA_QA_PASS pages=${files.length} blocks=${blockCount} entities=${objectCount}`)

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

function extractJsonLdBlocks(source) {
  const blocks = []
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  for (const match of source.matchAll(pattern)) {
    blocks.push(match[1].trim())
  }
  return blocks
}

function flattenEntities(value) {
  if (Array.isArray(value)) return value.flatMap((item) => flattenEntities(item))
  if (!value || typeof value !== "object") return []

  const graph = Array.isArray(value["@graph"]) ? value["@graph"].flatMap((item) => flattenEntities(item)) : []
  return [value, ...graph]
}

function validateEntity(file, entity, indexablePage) {
  const context = entity["@context"]
  const type = entity["@type"]

  assert(hasSchemaContext(context), `${file} JSON-LD entity must use schema.org @context`)
  assert(Boolean(type), `${file} JSON-LD entity must include @type`)

  if (indexablePage) {
    for (const key of ["url", "@id"]) {
      const value = entity[key]
      if (typeof value === "string" && value.startsWith(SITE_ORIGIN)) {
        assert(!value.includes(".html"), `${file} JSON-LD ${key} must use clean URL: ${value}`)
      }
    }
  }
}

function validateNoBadUrls(file, value, indexablePage) {
  walk(value, (key, current) => {
    if (typeof current !== "string") return

    assert(!current.includes("pages.dev"), `${file} JSON-LD ${key} must not use pages.dev: ${current}`)
    assert(!current.includes("duongsaotoasang-web"), `${file} JSON-LD ${key} must not use wrong Pages project: ${current}`)

    if (indexablePage && isUrlKey(key) && current.startsWith(SITE_ORIGIN)) {
      assert(!current.includes(".html"), `${file} JSON-LD ${key} must use clean URL: ${current}`)
    }
  })
}

function walk(value, visitor, key = "$") {
  visitor(key, value)

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${key}[${index}]`))
    return
  }

  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      walk(childValue, visitor, childKey)
    }
  }
}

function extractMetaContent(source, name) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\bname=["']${escapeRegExp(name)}["'])[^>]*>`, "i")
  const match = source.match(pattern)
  return match ? readAttribute(match[0], "content") : ""
}

function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(attribute)}=["']([^"']*)["']`, "i"))
  return match ? match[1].trim() : ""
}

function hasSchemaContext(value) {
  if (value === "https://schema.org") return true
  if (Array.isArray(value)) return value.includes("https://schema.org")
  if (value && typeof value === "object") return Object.values(value).includes("https://schema.org")
  return false
}

function isIndexable(robots) {
  return String(robots || "")
    .toLowerCase()
    .split(",")
    .map((part) => part.trim())
    .includes("index")
}

function isUrlKey(key) {
  return ["url", "@id", "sameAs", "image", "logo"].includes(key)
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
