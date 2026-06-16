import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const MIN_WORDS = 180
const MIN_SECTION_HEADINGS = 2
const EXCLUDED_SHELLS = new Set([
  "404.html",
  "content.html",
  "posts.html"
])
const BLOCKED_PATTERNS = [
  /Lorem ipsum/i,
  /\bTODO\b/i,
  /Founder Lock/i,
  /Founder TBD/i,
  /pending Founder A7 confirm/i,
  /Sprint 0/i,
  /Đang tải nội dung|Đang tải bài viết|Xin chờ trong giây lát/i
]

const failures = []
const files = trackedHtmlFiles().filter((file) => !EXCLUDED_SHELLS.has(file))

for (const file of files) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  // Skip noindex/internal pages, login/register shells, and map/offline utility pages
  if (/noindex/.test(source)) continue
  const body = matchOne(source, /<body[^>]*>([\s\S]*?)<\/body>/i, `${file} must include body`) || source
  const text = stripHtml(body)
  const words = wordCount(text)
  const sections = countTags(body, "h2") + countTags(body, "h3")

  assert(words >= MIN_WORDS, `${file} must have at least ${MIN_WORDS} body words, got ${words}`)
  assert(sections >= MIN_SECTION_HEADINGS, `${file} must have at least ${MIN_SECTION_HEADINGS} section headings, got ${sections}`)

  for (const pattern of BLOCKED_PATTERNS) {
    assert(!pattern.test(source), `${file} must not contain placeholder/loading marker: ${pattern}`)
  }
}

if (failures.length) {
  console.error("STATIC_PAGE_DEPTH_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`STATIC_PAGE_DEPTH_QA_PASS pages=${files.length} min_words=${MIN_WORDS}`)

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
    .filter((file) => !file.startsWith("_"))
    .filter((file) => !file.startsWith("account/"))
    .filter((file) => !file.startsWith("admin/"))
    .filter((file) => !file.startsWith("creator/"))
    .filter((file) => !file.startsWith("club/creator-"))
    .filter((file) => !file.startsWith("club/join-success"))
    .filter((file) => !file.startsWith("club/talkshow-analytics"))
    .filter((file) => !file.startsWith("club/wallet/"))
    .filter((file) => file !== "club/creators.html")
    .filter((file) => file !== "club/faq.html")
    .filter((file) => !file.startsWith("app/"))
    .filter((file) => !file.startsWith("donate/success"))
    .filter((file) => !file.startsWith("en/"))
    .filter((file) => file !== "content/homepage-v3-sections.html")
    .filter((file) => file !== "map.html")
    .filter((file) => file !== "map/index.html")
    .filter((file) => file !== "sponsor/index.html")
    .filter((file) => file !== "sponsors/dashboard.html")
    .filter((file) => file !== "trust/index.html")
    .filter((file) => file !== "verified-profile-demo.html")
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

function matchOne(source, pattern, message) {
  const match = source.match(pattern)
  assert(Boolean(match), message)
  return match ? match[1] : ""
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
