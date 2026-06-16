import { execFileSync } from "node:child_process"
import { readFileSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const KB = 1024
const budgets = {
  html: 225 * KB,
  css: 90 * KB,
  js: 90 * KB,
  functionsJs: 250 * KB,
  png: 1200 * KB,
  deploySourceTotal: 5 * 1024 * KB
}

const requiredAssets = [
  "app.css",
  "tokens.css",
  "assets/app-v5.js",
  "og.png"
]

const forbiddenTracked = [
  "assets/app.js",
  "assets/app-v2.js",
  "assets/app-v3.js",
  "assets/app-v4.js",
  "_redirects 2",
  "legal 2.html",
  "dsts-bug-report.md"
]

const failures = []
const files = trackedFiles()
let totalPublicBytes = 0

for (const required of requiredAssets) {
  assert(files.includes(required), `required public asset must be tracked: ${required}`)
}

for (const forbidden of forbiddenTracked) {
  assert(!files.includes(forbidden), `forbidden legacy/local file must not be tracked: ${forbidden}`)
}

for (const file of files) {
  const size = fileSize(file)
  totalPublicBytes += size

  assert(!file.endsWith(".map"), `source map must not be tracked for public deploy: ${file}`)
  assert(!file.startsWith(".wrangler/"), `wrangler runtime state must not be tracked: ${file}`)
  assert(!file.startsWith(".claude/"), `agent runtime state must not be tracked: ${file}`)
  assert(!/(^|\/)\.DS_Store$/.test(file), `macOS metadata must not be tracked: ${file}`)

  if (file.endsWith(".html")) {
    assert(size <= budgets.html, `${file} exceeds HTML budget ${formatBytes(size)} > ${formatBytes(budgets.html)}`)
  }

  if (file.endsWith(".css")) {
    assert(size <= budgets.css, `${file} exceeds CSS budget ${formatBytes(size)} > ${formatBytes(budgets.css)}`)
  }

  if (file.endsWith(".js") || file.endsWith(".mjs")) {
    if (file.startsWith("assets/")) {
      assert(size <= budgets.js, `${file} exceeds JS budget ${formatBytes(size)} > ${formatBytes(budgets.js)}`)
    }
    if (file.startsWith("functions/")) {
      assert(size <= budgets.functionsJs, `${file} exceeds Functions JS budget ${formatBytes(size)} > ${formatBytes(budgets.functionsJs)}`)
    }
  }

  if (file.endsWith(".png")) {
    assert(size <= budgets.png, `${file} exceeds PNG budget ${formatBytes(size)} > ${formatBytes(budgets.png)}`)
    assert(isPng(file), `${file} must have a PNG signature`)
  }
}

assert(totalPublicBytes <= budgets.deploySourceTotal, `tracked deploy source exceeds total budget ${formatBytes(totalPublicBytes)} > ${formatBytes(budgets.deploySourceTotal)}`)

if (failures.length) {
  console.error("PUBLIC_ASSET_BUDGET_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`PUBLIC_ASSET_BUDGET_QA_PASS files=${files.length} total=${formatBytes(totalPublicBytes)}`)

function trackedFiles() {
  const output = execFileSync("git", ["ls-files"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  })

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => !file.startsWith("docs/"))
    .filter((file) => !file.startsWith("investors/downloads/"))
    .filter((file) => !file.startsWith("scripts/"))
    .filter((file) => !file.startsWith("migrations/"))
}

function fileSize(file) {
  return statSync(join(repoRoot, file)).size
}

function isPng(file) {
  const signature = readFileSync(join(repoRoot, file)).subarray(0, 8)
  const expected = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  return expected.every((byte, index) => signature[index] === byte)
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)}MB`
  return `${(bytes / 1024).toFixed(1)}KB`
}

function assert(condition, message) {
  if (!condition) failures.push(message)
}
