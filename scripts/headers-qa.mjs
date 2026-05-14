const BASE_URL = normalizeBase(process.env.BASE_URL || "https://duongsaotoasang.com")
const IS_HTTPS = BASE_URL.startsWith("https://")

const failures = []

const checks = [
  {
    path: "/",
    label: "root-html",
    expectedStatus: 200,
    expectations: [
      hasHeader("x-content-type-options", "nosniff"),
      hasHeader("referrer-policy", "strict-origin-when-cross-origin"),
      hasHeader("x-frame-options", "SAMEORIGIN"),
      includesHeader("permissions-policy", "camera=()"),
      includesHeader("permissions-policy", "microphone=()"),
      includesHeader("permissions-policy", "geolocation=()"),
      cacheMaxAgeAtMost(300),
      cacheIncludes("must-revalidate"),
      hstsWhenHttps()
    ]
  },
  {
    path: "/app.css",
    label: "root-css",
    expectedStatus: 200,
    expectations: [
      hasHeader("x-content-type-options", "nosniff"),
      contentTypeIncludes("text/css"),
      cacheMaxAgeAtMost(300),
      cacheIncludes("must-revalidate")
    ]
  },
  {
    path: "/tokens.css",
    label: "tokens-css",
    expectedStatus: 200,
    expectations: [
      hasHeader("x-content-type-options", "nosniff"),
      contentTypeIncludes("text/css"),
      cacheMaxAgeAtMost(300),
      cacheIncludes("must-revalidate")
    ]
  },
  {
    path: "/assets/app-v5.js",
    label: "asset-js",
    expectedStatus: 200,
    expectations: [
      hasHeader("x-content-type-options", "nosniff"),
      contentTypeIncludes("javascript"),
      cacheMaxAgeAtMost(300),
      cacheIncludes("must-revalidate")
    ]
  },
  {
    path: "/og.png",
    label: "og-image",
    expectedStatus: 200,
    expectations: [
      hasHeader("x-content-type-options", "nosniff"),
      contentTypeIncludes("image/png"),
      cacheMaxAgeAtMost(300),
      cacheIncludes("must-revalidate")
    ]
  },
  {
    path: "/api/contents?type=post&limit=1",
    label: "api-list",
    expectedStatus: 200,
    expectations: [
      contentTypeIncludes("application/json"),
      cacheMaxAgeAtMost(60)
    ]
  },
  {
    path: "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong",
    label: "content-detail",
    expectedStatus: 200,
    expectations: [
      contentTypeIncludes("text/html"),
      cacheMaxAgeAtMost(60)
    ]
  }
]

for (const check of checks) {
  const response = await fetchHeaders(check.path)
  assert(response.status === check.expectedStatus, `${check.label} ${check.path} expected ${check.expectedStatus}, got ${response.status}`)
  if (response.status !== check.expectedStatus) continue

  for (const expectation of check.expectations) {
    expectation({ ...response, label: check.label, path: check.path })
  }
}

if (failures.length) {
  console.error("HEADERS_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`HEADERS_QA_PASS base=${BASE_URL} checks=${checks.length}`)

async function fetchHeaders(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "DSTS-HEADERS-QA/1.0"
      }
    })
    await response.arrayBuffer()
    return {
      status: response.status,
      headers: response.headers
    }
  } catch (error) {
    failures.push(`${path} fetch failed: ${error.message}`)
    return { status: 0, headers: new Headers() }
  } finally {
    clearTimeout(timeout)
  }
}

function hasHeader(name, expectedValue) {
  return ({ headers, label, path }) => {
    const actual = headers.get(name) || ""
    assert(actual.toLowerCase() === expectedValue.toLowerCase(), `${label} ${path} header ${name} expected ${expectedValue}, got ${actual || "(missing)"}`)
  }
}

function includesHeader(name, expectedFragment) {
  return ({ headers, label, path }) => {
    const actual = headers.get(name) || ""
    assert(actual.toLowerCase().includes(expectedFragment.toLowerCase()), `${label} ${path} header ${name} missing ${expectedFragment}; got ${actual || "(missing)"}`)
  }
}

function contentTypeIncludes(expectedFragment) {
  return includesHeader("content-type", expectedFragment)
}

function cacheIncludes(expectedFragment) {
  return includesHeader("cache-control", expectedFragment)
}

function cacheMaxAgeAtMost(limitSeconds) {
  return ({ headers, label, path }) => {
    const cacheControl = headers.get("cache-control") || ""
    const maxAge = parseMaxAge(cacheControl)
    assert(maxAge !== null, `${label} ${path} cache-control missing max-age; got ${cacheControl || "(missing)"}`)
    if (maxAge !== null) {
      assert(maxAge <= limitSeconds, `${label} ${path} max-age must be <= ${limitSeconds}, got ${maxAge}`)
    }
    assert(!/immutable/i.test(cacheControl), `${label} ${path} cache-control must not be immutable; got ${cacheControl}`)
  }
}

function hstsWhenHttps() {
  return ({ headers, label, path }) => {
    if (!IS_HTTPS) return
    const value = headers.get("strict-transport-security") || ""
    assert(value.includes("max-age=31536000"), `${label} ${path} strict-transport-security expected max-age=31536000, got ${value || "(missing)"}`)
  }
}

function parseMaxAge(cacheControl) {
  const match = /(?:^|,\s*)max-age=(\d+)/i.exec(cacheControl)
  if (!match) return null
  return Number.parseInt(match[1], 10)
}

function normalizeBase(value) {
  return String(value || "").replace(/\/+$/, "")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
