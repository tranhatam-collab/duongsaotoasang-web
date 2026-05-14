import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const failures = []
const files = trackedHtmlFiles()

for (const file of files) {
  const source = readFileSync(join(repoRoot, file), "utf8")

  validateLandmarks(file, source)
  validateIds(file, source)
  validateImages(file, source)
  validateButtons(file, source)
  validateLinks(file, source)
}

if (failures.length) {
  console.error("ACCESSIBILITY_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`ACCESSIBILITY_QA_PASS pages=${files.length}`)

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

function validateLandmarks(file, source) {
  const mains = source.match(/<main\b/gi) || []
  assert(mains.length === 1, `${file} must have exactly one <main>, got ${mains.length}`)
}

function validateIds(file, source) {
  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1])
  const seen = new Set()
  const duplicate = new Set()

  for (const id of ids) {
    if (seen.has(id)) duplicate.add(id)
    seen.add(id)
  }

  assert(duplicate.size === 0, `${file} must not contain duplicate ids: ${[...duplicate].join(", ")}`)
}

function validateImages(file, source) {
  const images = [...source.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])
  images.forEach((tag, index) => {
    assert(hasAttribute(tag, "alt"), `${file} image ${index + 1} must include alt attribute`)
  })
}

function validateButtons(file, source) {
  const buttons = [...source.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)]
  buttons.forEach((match, index) => {
    const attrs = match[1] || ""
    const label = accessibleText(match[2] || "")
    const hasAriaName =
      nonEmptyAttribute(attrs, "aria-label") ||
      nonEmptyAttribute(attrs, "aria-labelledby") ||
      nonEmptyAttribute(attrs, "title")

    assert(Boolean(label || hasAriaName), `${file} button ${index + 1} must have text or accessible label`)
  })
}

function validateLinks(file, source) {
  const links = [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
  const ids = new Set([...source.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]))
  const names = new Set([...source.matchAll(/\bname=["']([^"']+)["']/gi)].map((match) => match[1]))

  links.forEach((match, index) => {
    const attrs = match[1] || ""
    const href = readAttribute(attrs, "href")
    const label = accessibleText(match[2] || "")
    const hasAriaName =
      nonEmptyAttribute(attrs, "aria-label") ||
      nonEmptyAttribute(attrs, "aria-labelledby") ||
      nonEmptyAttribute(attrs, "title")

    assert(Boolean(href), `${file} link ${index + 1} must include href`)
    assert(href !== "#", `${file} link ${index + 1} must not use href="#"`)
    assert(!/^javascript:/i.test(href), `${file} link ${index + 1} must not use javascript: href`)
    assert(Boolean(label || hasAriaName), `${file} link ${index + 1} must have text or accessible label`)

    if (/^#[A-Za-z][\w:.-]*$/.test(href)) {
      const target = href.slice(1)
      assert(ids.has(target) || names.has(target), `${file} link ${index + 1} references missing fragment target ${href}`)
    }
  })
}

function readAttribute(attrs, attribute) {
  const match = attrs.match(new RegExp(`\\b${escapeRegExp(attribute)}=["']([^"']*)["']`, "i"))
  return match ? match[1].trim() : ""
}

function hasAttribute(tag, attribute) {
  return new RegExp(`\\b${escapeRegExp(attribute)}(?:=["'][^"']*["'])?`, "i").test(tag)
}

function nonEmptyAttribute(attrs, attribute) {
  return Boolean(readAttribute(attrs, attribute))
}

function accessibleText(value) {
  return String(value || "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\$\{[^}]+\}/g, " value ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
