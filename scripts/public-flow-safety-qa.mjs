import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const failures = []
const files = trackedPublicFiles()
let formCount = 0

const allowedFormFiles = new Set(["posts.html", "functions/posts.js"])
const allowedInputNames = new Set(["q", "lang"])
const allowedInputTypes = new Set(["", "text", "search", "hidden"])
const allowedFormActions = new Set(["", "/posts"])
const allowedFormMethods = new Set(["", "get"])
const allowedSensitiveManualLinks = new Set([
  "/contact?type=payment-confirmation",
  "/payment-confirmation"
])
// Files where JS-driven inputs are allowed outside a <form> element
// (POST to /api/* via fetch, no native HTML form submit).
const allowedJsInputFiles = new Set(["donate.html"])
const allowedDonateInputIds = new Set(["donateAmt", "donorName", "donorEmail", "donorMsg"])

for (const file of files) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  // Noindex/internal pages are not public lane; skip public-flow safety
  if (isNoindexFile(source)) continue
  validateForms(file, source)
  validateControlTags(file, source)
  validateLinksAndActions(file, source)
}

if (failures.length) {
  console.error("PUBLIC_FLOW_SAFETY_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`PUBLIC_FLOW_SAFETY_QA_PASS files=${files.length} forms=${formCount}`)

function trackedPublicFiles() {
  const output = execFileSync("git", ["ls-files", "*.html", "functions/*.js", "functions/**/*.js"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  })

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => !file.startsWith("_archive_2026-05-13/"))
    .filter((file) => !file.startsWith("functions/api/donate/"))
    .filter((file) => !file.startsWith("functions/_lib/"))
}

function validateForms(file, source) {
  const forms = [...source.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)]
  formCount += forms.length

  forms.forEach((match, index) => {
    const attrs = match[1] || ""
    const body = match[2] || ""
    assert(allowedFormFiles.has(file), `${file} form ${index + 1} is not allowed in this public lane`)

    const action = normalizeAttribute(readAttribute(attrs, "action"))
    const method = normalizeAttribute(readAttribute(attrs, "method")).toLowerCase()
    assert(allowedFormActions.has(action), `${file} form ${index + 1} action must be /posts or empty, got ${action || "(empty)"}`)
    assert(allowedFormMethods.has(method), `${file} form ${index + 1} method must be get or empty, got ${method || "(empty)"}`)
    assert(!hasAttribute(attrs, "data-netlify"), `${file} form ${index + 1} must not enable hosted form collection`)
    assert(!hasAttribute(attrs, "data-turbo"), `${file} form ${index + 1} must not opt into external submission behavior`)

    validateInputs(file, body, `form ${index + 1}`)
  })
}

function validateControlTags(file, source) {
  const withoutForms = source.replace(/<form\b[\s\S]*?<\/form>/gi, " ")
  const controls = [...withoutForms.matchAll(/<(input|textarea|select)\b[^>]*>/gi)]

  controls.forEach((match, index) => {
    if (allowedJsInputFiles.has(file)) {
      const idAttr = readAttribute(match[0], "id")
      if (allowedDonateInputIds.has(idAttr)) return
      assert(false, `${file} ${match[1]} id="${idAttr}" not in donate whitelist`)
      return
    }
    assert(false, `${file} ${match[1]} ${index + 1} appears outside an allowed search form`)
  })
}

function validateInputs(file, source, scope) {
  const inputs = [...source.matchAll(/<input\b[^>]*>/gi)].map((match) => match[0])
  const textareas = [...source.matchAll(/<textarea\b[^>]*>/gi)].map((match) => match[0])
  const selects = [...source.matchAll(/<select\b[^>]*>/gi)].map((match) => match[0])

  textareas.forEach((_tag, index) => {
    assert(false, `${file} ${scope} textarea ${index + 1} is not allowed in this public lane`)
  })
  selects.forEach((_tag, index) => {
    assert(false, `${file} ${scope} select ${index + 1} is not allowed in this public lane`)
  })

  inputs.forEach((tag, index) => {
    const name = normalizeAttribute(readAttribute(tag, "name"))
    const type = normalizeAttribute(readAttribute(tag, "type")).toLowerCase()

    assert(allowedInputNames.has(name), `${file} ${scope} input ${index + 1} name must be q/lang, got ${name || "(empty)"}`)
    assert(allowedInputTypes.has(type), `${file} ${scope} input ${index + 1} type must be text/search/hidden/empty, got ${type || "(empty)"}`)
    assert(!/email|password|phone|tel|card|checkout|payment|pay|auth|login|register|signup/i.test(name), `${file} ${scope} input ${index + 1} opens an excluded lane`)
  })
}

function validateLinksAndActions(file, source) {
  // Strip C-002 legal footer block from link validation (legal disclosure, not user flow)
  const sourceWithoutC002 = source.replace(/<div\s+data-dsts-claim=["']C-002["'][^>]*>[\s\S]*?<\/div>/gi, "")
  const tags = [...sourceWithoutC002.matchAll(/<(a|form)\b[^>]*>/gi)].map((match) => match[0])

  tags.forEach((tag) => {
    for (const attribute of ["href", "action"]) {
      const value = normalizeAttribute(readAttribute(tag, attribute))
      if (!value || allowedSensitiveManualLinks.has(value) || value.startsWith("mailto:")) continue

      assert(!isExcludedFlowTarget(value), `${file} ${attribute} opens excluded flow: ${value}`)
    }
  })
}

function isExcludedFlowTarget(value) {
  return /(^|\/)(api\/donate|checkout|login|register|signup|auth)(\/|$|\?)/i.test(value) ||
    /pay\.iai\.one|stripe|paypal/i.test(value)
}

function isNoindexFile(source) {
  return /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(source)
}

function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(attribute)}=["']([^"']*)["']`, "i"))
  return match ? match[1] : ""
}

function hasAttribute(tag, attribute) {
  return new RegExp(`\\b${escapeRegExp(attribute)}(?:=["'][^"']*["'])?`, "i").test(tag)
}

function normalizeAttribute(value) {
  return String(value || "").replace(/&amp;/g, "&").trim()
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
