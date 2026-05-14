const BASE_URL = normalizeBase(process.env.BASE_URL || "https://duongsaotoasang.com")

const ROUTES_TO_SCAN = [
  "/",
  "/about",
  "/program",
  "/posts",
  "/events",
  "/scripts",
  "/donate",
  "/transparency",
  "/legal",
  "/terms",
  "/privacy",
  "/support",
  "/contact",
  "/dream-nurture",
  "/movement",
  "/movement/sponsors",
  "/movement/events",
  "/movement/gala-2026",
  "/movement/diaspora-map",
  "/movement/press",
  "/movement/partners",
  "/movement/tour-2026-2027",
  "/scripts/rising-entrepreneur",
  "/scripts/global-artist",
  "/scripts/singing-icon",
  "/scripts/cinematic-actor",
  "/scripts/the-thinker",
  "/scripts/creative-leader",
  "/scripts/cultural-ambassador",
  "/scripts/dsts-legacy",
  "/scripts/global-story",
  "/nguoiviet-muonnoi-bridge"
]

const failures = []
const checkedTargets = new Set()
let discoveredCount = 0

for (const route of ROUTES_TO_SCAN) {
  const page = await fetchText(route)
  assert(page.status === 200, `${route} expected 200 before link scan, got ${page.status}`)
  if (page.status !== 200) continue

  const links = extractInternalTargets(page.body)
  for (const target of links) {
    discoveredCount += 1
    const normalized = normalizeInternalTarget(target)
    if (!normalized || checkedTargets.has(normalized)) continue
    checkedTargets.add(normalized)

    const result = await fetchStatus(normalized)
    const ok = result.status >= 200 && result.status < 400
    assert(ok, `${route} links to ${normalized}, final status ${result.status}`)
  }
}

if (failures.length) {
  console.error("LINK_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`LINK_QA_PASS pages=${ROUTES_TO_SCAN.length} discovered=${discoveredCount} unique_internal=${checkedTargets.size}`)

function extractInternalTargets(html) {
  const withoutScripts = String(html || "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
  const targets = []
  const pattern = /\b(?:href|src|action)=["']([^"']+)["']/gi
  let match
  while ((match = pattern.exec(withoutScripts)) !== null) {
    const raw = decodeEntities(match[1].trim())
    if (shouldSkip(raw)) continue
    if (raw.startsWith("/")) targets.push(raw)
    if (raw.startsWith("https://duongsaotoasang.com/")) {
      targets.push(raw.replace("https://duongsaotoasang.com", ""))
    }
  }
  return targets
}

function shouldSkip(value) {
  if (!value) return true
  if (value === "#") return true
  if (value.startsWith("#")) return true
  if (value.startsWith("mailto:")) return true
  if (value.startsWith("tel:")) return true
  if (value.startsWith("/cdn-cgi/l/email-protection")) return true
  if (value.startsWith("javascript:")) return true
  if (value.startsWith("data:")) return true
  if (value.includes("${")) return true
  if (value.startsWith("http://")) return true
  if (value.startsWith("https://") && !value.startsWith("https://duongsaotoasang.com/")) return true
  return false
}

function normalizeInternalTarget(value) {
  try {
    const url = new URL(value, BASE_URL)
    if (url.origin !== "https://duongsaotoasang.com" && url.origin !== BASE_URL) return ""
    return `${url.pathname}${url.search}`
  } catch (_error) {
    failures.push(`Invalid internal URL: ${value}`)
    return ""
  }
}

async function fetchText(path) {
  const response = await fetchWithTimeout(path, { method: "GET" })
  const body = response ? await response.text() : ""
  return { status: response?.status || 0, body }
}

async function fetchStatus(path) {
  let response = await fetchWithTimeout(path, { method: "HEAD" })
  if (response && (response.status === 405 || response.status === 403)) {
    response = await fetchWithTimeout(path, { method: "GET" })
  }
  return { status: response?.status || 0 }
}

async function fetchWithTimeout(path, options) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    return await fetch(`${BASE_URL}${path}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "DSTS-LINK-QA/1.0"
      },
      ...options
    })
  } catch (error) {
    failures.push(`${path} fetch failed: ${error.message}`)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function normalizeBase(value) {
  return String(value || "").replace(/\/+$/, "")
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
