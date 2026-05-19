import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const failures = []

const donateCreate = read(join(repoRoot, "functions", "api", "donate", "create.js"))
const donateWebhook = read(join(repoRoot, "functions", "api", "donate", "webhook.js"))
const wranglerToml = read(join(repoRoot, "wrangler.toml"))
const payOwnerScript = read(join(repoRoot, "scripts", "pay-owner-go-live.sh"))
const payGroundTruth = read(join(repoRoot, "docs", "PAY_IAI_ONE_INTEGRATION_GROUND_TRUTH_2026-05-15.md"))

requireIncludes(donateCreate, "/internal/checkout-session", "functions/api/donate/create.js must use /internal/checkout-session (generic tenant route; /api/v1/checkout/session is vetuonglai-specific)")
requireIncludes(donateCreate, "internal_order_id", "functions/api/donate/create.js must send internal_order_id")
requireIncludes(donateCreate, "billing_cycle: \"one_time\"", "functions/api/donate/create.js must lock billing_cycle=one_time")
requireIncludes(donateCreate, "\"x-idempotency-key\"", "functions/api/donate/create.js must use x-idempotency-key")
requireIncludes(donateCreate, "tenant_code: tenantCode", "functions/api/donate/create.js must send tenant_code")
requireIncludes(donateCreate, "site_code: siteCode", "functions/api/donate/create.js must send site_code")

requireIncludes(donateWebhook, "PAY_DSTS_HMAC || env.PAY_IAI_ONE_HMAC", "functions/api/donate/webhook.js must support DSTS/pay.iai.one HMAC secret fallback")
requireIncludes(donateWebhook, "SIGNATURE_INVALID", "functions/api/donate/webhook.js must fail closed on bad signatures")

requireIncludes(wranglerToml, "PAY_IAI_ONE_BASE_URL        = \"https://pay.iai.one\"", "wrangler.toml must point to pay.iai.one")
requireIncludes(wranglerToml, "PAY_IAI_ONE_TENANT_CODE     = \"dsts\"", "wrangler.toml must default tenant_code to dsts until lane split")
requireIncludes(wranglerToml, "PAY_IAI_ONE_SITE_CODE       = \"duongsaotoasang\"", "wrangler.toml must default site_code to duongsaotoasang")
requireIncludes(wranglerToml, "PAY_IAI_ONE_PROVIDER        = \"payos\"", "wrangler.toml must lock provider=payos for Y1")

requireIncludes(payOwnerScript, "x-idempotency-key", "scripts/pay-owner-go-live.sh smoke test must use x-idempotency-key")
requireIncludes(payOwnerScript, "PAY_IAI_ONE_API_KEY", "scripts/pay-owner-go-live.sh must provision PAY_IAI_ONE_API_KEY")
requireIncludes(payOwnerScript, "PAY_DSTS_HMAC", "scripts/pay-owner-go-live.sh must provision PAY_DSTS_HMAC")

requireIncludes(payGroundTruth, "Hiện tại DSTS dùng `tenant_code: \"dsts\"` + `site_code: \"duongsaotoasang\"`.", "Ground-truth doc must match current runtime tenant/site")
requireIncludes(payGroundTruth, "- [x] **HIGH:** Code drift trong `functions/api/donate/create.js` đã được sửa ở repo.", "Ground-truth doc must reflect repo-side donate/create fix")

// Polling fallback for pay.iai.one webhook gap (§7 of ground truth)
const donatePoll = read(join(repoRoot, "functions", "api", "donate", "poll.js"))
const donateStatus = read(join(repoRoot, "functions", "api", "donate", "[id].js"))
requireIncludes(donatePoll, "/v1/payments/", "functions/api/donate/poll.js must poll pay.iai.one /v1/payments/:id")
requireIncludes(donatePoll, "POLL_TOKEN", "functions/api/donate/poll.js must require POLL_TOKEN auth")
requireIncludes(donateStatus, "/v1/payments/", "functions/api/donate/[id].js must pull-through poll pay.iai.one on pending status")
requireIncludes(wranglerToml, "POLL_TOKEN", "wrangler.toml must document POLL_TOKEN secret")

if (failures.length) {
  console.error("PAYMENT_LEGAL_ALIGNMENT_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log("PAYMENT_LEGAL_ALIGNMENT_QA_PASS")

function read(path) {
  return readFileSync(path, "utf8")
}

function requireIncludes(source, needle, message) {
  if (!source.includes(needle)) {
    failures.push(message)
  }
}
