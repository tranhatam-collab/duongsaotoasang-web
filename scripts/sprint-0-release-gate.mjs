import { execFile } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const PREVIEW_URL = normalizeBase(process.env.PREVIEW_URL || "")
const PRODUCTION_URL = normalizeBase(process.env.PRODUCTION_URL || "https://duongsaotoasang.com")
const RUN_FULL_SMOKE = process.env.RUN_FULL_SMOKE === "1"

const hardFailures = []
const externalBlockers = []

console.log("=== DSTS Sprint 0 Release Gate ===")
console.log(`production=${PRODUCTION_URL}`)
console.log(`preview=${PREVIEW_URL || "(skipped)"}`)
console.log(`full_smoke=${RUN_FULL_SMOKE ? "yes" : "no"}`)
console.log("")

await requirePass("local-content-qa", "node", ["scripts/content-qa.mjs"])

if (PREVIEW_URL) {
  await requirePass("preview-seo", "node", ["scripts/seo-route-qa.mjs"], { BASE_URL: PREVIEW_URL })
  await requirePass("preview-headers", "node", ["scripts/headers-qa.mjs"], { BASE_URL: PREVIEW_URL })
  if (RUN_FULL_SMOKE) {
    await requirePass("preview-smoke", "bash", ["scripts/smoke-test.sh"], { BASE_URL: PREVIEW_URL })
  }
}

await requirePass("production-seo", "node", ["scripts/seo-route-qa.mjs"], { BASE_URL: PRODUCTION_URL })

const productionHeaders = await runStep("production-headers", "node", ["scripts/headers-qa.mjs"], {
  BASE_URL: PRODUCTION_URL
})

if (!productionHeaders.ok) {
  if (isKnownCloudflareHeaderCacheBlocker(productionHeaders.output)) {
    externalBlockers.push("production-headers: custom-domain cache/header override still active")
  } else {
    hardFailures.push(`production-headers failed unexpectedly:\n${productionHeaders.output}`)
  }
}

if (hardFailures.length) {
  console.error("SPRINT_0_RELEASE_GATE_FAIL")
  for (const failure of hardFailures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

if (externalBlockers.length) {
  console.log("SPRINT_0_RELEASE_GATE_BLOCKED_EXTERNAL")
  for (const blocker of externalBlockers) {
    console.log(`- ${blocker}`)
  }
  console.log("- follow docs/CLOUDFLARE_CUSTOM_DOMAIN_FIX_PACKET_2026-05-14.md")
  process.exit(2)
}

console.log("SPRINT_0_RELEASE_GATE_PASS")

async function requirePass(label, command, args, env = {}) {
  const result = await runStep(label, command, args, env)
  if (!result.ok) {
    hardFailures.push(`${label} failed:\n${result.output}`)
  }
}

async function runStep(label, command, args, env = {}) {
  console.log(`--- ${label} ---`)
  try {
    const result = await execFileAsync(command, args, {
      cwd: repoRoot,
      env: { ...process.env, ...env },
      maxBuffer: 1024 * 1024 * 30
    })
    const output = normalizeOutput(result.stdout, result.stderr)
    processStepOutput(output)
    return { ok: true, output }
  } catch (error) {
    const output = normalizeOutput(error.stdout, error.stderr) || String(error.message || "").trim()
    processStepOutput(output)
    return { ok: false, output, code: error.code }
  }
}

function isKnownCloudflareHeaderCacheBlocker(output) {
  const text = String(output || "")
  if (!text.includes("HEADERS_QA_FAIL")) return false

  const knownFragments = [
    "referrer-policy expected strict-origin-when-cross-origin, got same-origin",
    "max-age must be <= 300, got 14400",
    "retired-app-js /assets/app.js expected 404, got 200"
  ]

  return knownFragments.some((fragment) => text.includes(fragment))
}

function processStepOutput(output) {
  const text = String(output || "").trim()
  if (!text) return
  console.log(text)
}

function normalizeOutput(...parts) {
  return parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join("\n")
}

function normalizeBase(value) {
  return String(value || "").replace(/\/+$/, "")
}
