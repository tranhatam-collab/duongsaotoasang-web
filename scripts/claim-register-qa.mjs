import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")
const claimRegisterPath = join(repoRoot, "docs", "DSTS_PUBLIC_CLAIM_REGISTER_2026.md")

const failures = []
const trackedPublicFiles = listTrackedPublicHtmlFiles()
const blockedClaims = parseBlockedClaims(readFileSync(claimRegisterPath, "utf8"))

for (const file of trackedPublicFiles) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  validateBlockedClaims(file, source)
}

validateRequiredSurface(
  "donate.html",
  [
    "Trạng thái: TẠM ĐÓNG",
    "Không chuyển khoản, quét QR hoặc gửi tiền nếu chưa nhận hướng dẫn chính thức và mã xác nhận từ kênh liên hệ của DSTS."
  ],
  [
    "tax-deductible",
    "pay.iai.one/checkout",
    "stripe.com",
    "paypal.com"
  ]
)

validateRequiredSurface(
  "legal.html",
  [
    // C-002 entity disclosure (updated from placeholder 2026-05-15)
    "Công ty Cổ phần Giải trí Ngôi Sao Việt Can",
    "Viet Can New Corp",
    "Angel Edu Tam Foundation"
  ],
  [
    "501(c)(3)",
    "tax-deductible"
  ]
)

validateRequiredSurface(
  "transparency.html",
  [
    "Chưa kích hoạt nhận đóng góp công khai.",
    "Không có QR, tài khoản ngân hàng hoặc cổng thanh toán chính thức trên trang này."
  ],
  [
    "tax-deductible"
  ]
)

validateRequiredSurface(
  "dream-nurture.html",
  [
    "DSTS không nhận đăng ký trẻ em lúc này.",
    "không xử lý thanh toán trên trang này"
  ],
  [
    "Sponsor a specific child",
    "Đăng ký con tham gia ngay",
    "Enroll your child now"
  ]
)

if (failures.length) {
  console.error("CLAIM_REGISTER_QA_FAIL")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`CLAIM_REGISTER_QA_PASS files=${trackedPublicFiles.length} blocked_claims=${blockedClaims.length}`)

function listTrackedPublicHtmlFiles() {
  const output = execFileSync("git", ["ls-files", "*.html"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  })

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => !file.startsWith("docs/"))
    .filter((file) => !file.startsWith("scripts/"))
    .filter((file) => !file.includes("_archive_"))
}

function parseBlockedClaims(source) {
  const claims = []
  const lines = source.split(/\r?\n/)
  let inBlockedTable = false

  for (const line of lines) {
    if (line.startsWith("# 4. BLOCKED CLAIMS")) {
      inBlockedTable = true
      continue
    }
    if (inBlockedTable && line.startsWith("# 5.")) break
    if (!inBlockedTable) continue
    if (!line.startsWith("| B-")) continue

    const parts = line.split("|").map((part) => part.trim())
    if (parts.length < 5) continue

    const code = parts[1]
    const vi = parts[2]
    const en = parts[3] === "Same" ? "" : parts[3]

    claims.push({
      code,
      vi,
      en
    })
  }

  return claims
}

function validateBlockedClaims(file, source) {
  const normalizedSource = normalizeText(source)
  for (const claim of blockedClaims) {
    for (const phrase of [claim.vi, claim.en]) {
      if (!phrase) continue
      if (normalizedSource.includes(normalizeText(phrase))) {
        failures.push(`${file} contains blocked public claim ${claim.code}: ${phrase}`)
      }
    }
  }
}

function validateRequiredSurface(file, requiredPhrases, blockedPhrases) {
  const source = readFileSync(join(repoRoot, file), "utf8")
  const normalizedSource = normalizeText(source)

  for (const phrase of requiredPhrases) {
    if (!normalizedSource.includes(normalizeText(phrase))) {
      failures.push(`${file} is missing required payment/legal phrase: ${phrase}`)
    }
  }

  for (const phrase of blockedPhrases) {
    if (normalizedSource.includes(normalizeText(phrase))) {
      failures.push(`${file} contains blocked payment/legal phrase: ${phrase}`)
    }
  }
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}
