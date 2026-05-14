const BASE_URL = normalizeBase(process.env.BASE_URL || "https://duongsaotoasang.com")

const failures = []

const list = await fetchJson("/api/contents?type=post&limit=3")
assert(Array.isArray(list.body), "/api/contents must return an array")
assert(list.status === 200, `/api/contents expected 200, got ${list.status}`)
if (Array.isArray(list.body)) {
  assert(list.body.length === 3, `/api/contents?limit=3 expected 3 items, got ${list.body.length}`)
  for (const [index, item] of list.body.entries()) {
    validateListItem(item, `/api/contents[${index}]`)
  }
}

const search = await fetchJson("/api/contents?type=post&q=guardian&limit=5")
assert(search.status === 200, `/api/contents search expected 200, got ${search.status}`)
if (Array.isArray(search.body)) {
  for (const [index, item] of search.body.entries()) {
    validateListItem(item, `/api/contents?q=guardian[${index}]`)
  }
}

const legacySearch = await fetchJson("/api/search?q=guardian&limit=3")
assert(legacySearch.status === 200, `/api/search expected 200, got ${legacySearch.status}`)
assert(Array.isArray(legacySearch.body), "/api/search must return an array")
if (Array.isArray(legacySearch.body)) {
  assert(legacySearch.body.length >= 1, `/api/search?q=guardian expected at least 1 item, got ${legacySearch.body.length}`)
  for (const [index, item] of legacySearch.body.entries()) {
    validateListItem(item, `/api/search?q=guardian[${index}]`)
  }
}

const emptySearch = await fetchJson("/api/search")
assert(emptySearch.status === 200, `/api/search without query expected 200, got ${emptySearch.status}`)
assert(Array.isArray(emptySearch.body) && emptySearch.body.length === 0, "/api/search without query must return an empty array")

const detail = await fetchJson("/api/content?slug=guardian-first-nguyen-tac-bao-ve-tre-em-ndnum")
assert(detail.status === 200, `/api/content valid slug expected 200, got ${detail.status}`)
assert(typeof detail.body?.content === "string" && detail.body.content.length > 200, "/api/content valid slug must return localized content body")
assert(detail.body?.slug === "guardian-first-nguyen-tac-bao-ve-tre-em-ndnum", "/api/content valid slug must return requested slug")

const missing = await fetchJson("/api/content?slug=missing-smoke-slug-404")
assert(missing.status === 404, `/api/content missing slug expected 404, got ${missing.status}`)
assert(missing.body?.error === "not found", "/api/content missing slug must return not found error")

if (failures.length) {
  console.error("API_SURFACE_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log("API_SURFACE_QA_PASS list_no_body=true search_no_body=true detail_body=true missing_404=true")

function validateListItem(item, label) {
  assert(item && typeof item === "object", `${label} must be an object`)
  assert(typeof item.slug === "string" && item.slug.length > 0, `${label} missing slug`)
  assert(typeof item.title === "string" && item.title.length > 0, `${label} missing localized title`)
  assert(typeof item.excerpt === "string" && item.excerpt.length > 0, `${label} missing localized excerpt`)
  assert(!("content" in item), `${label} must not expose localized content`)
  assert(!("content_vi" in item), `${label} must not expose content_vi`)
  assert(!("content_en" in item), `${label} must not expose content_en`)
}

async function fetchJson(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "accept": "application/json",
        "user-agent": "DSTS-API-QA/1.0"
      }
    })
    const text = await response.text()
    let body = null
    try {
      body = JSON.parse(text)
    } catch (_error) {
      failures.push(`${path} did not return JSON`)
    }
    return { status: response.status, body }
  } catch (error) {
    failures.push(`${path} fetch failed: ${error.message}`)
    return { status: 0, body: null }
  } finally {
    clearTimeout(timeout)
  }
}

function normalizeBase(value) {
  return String(value || "").replace(/\/+$/, "")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
