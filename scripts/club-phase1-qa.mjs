import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");

const failures = [];

const REQUIRED_FILES = [
  "club.html",
  "club/join.html",
  "club/levels.html",
  "club/faq.html",
  "club/legal.html",
  "club/creators.html",
  "club/creator.html",
  "club/creator-public.html",
  "club/creator-talkshows.html",
  "club/creator-membership.html",
  "club/creator-rewards.html",
  "account/library.html",
  "account/calendar.html",
  "account/wallet.html",
];

const STAR_POINTS_PAGES = [
  "club.html", "club/levels.html", "club/faq.html", "club/legal.html",
  "club/creator-membership.html", "club/creator-rewards.html",
  "account/wallet.html",
];

const STAR_POINTS_DISCLAIMER =
  "Star Points là điểm thưởng nội bộ của DSTS Club. Điểm không phải tiền, không phải chứng khoán, không phải tài sản đầu tư, không bảo đảm quy đổi thành tiền mặt";

const FORBIDDEN_PHRASES = [
  "đầu tư", "lãi suất", "lợi nhuận cam kết", "rút tiền", "đổi USD",
];

const C_002_FRAGMENT = "data-dsts-claim=\"C-002\"";

for (const file of REQUIRED_FILES) {
  const fullPath = join(repoRoot, file);
  try {
    readFileSync(fullPath, "utf8");
  } catch {
    failures.push(`MISSING_FILE: ${file} — required Club Phase 1 route not found`);
  }
}

for (const page of STAR_POINTS_PAGES) {
  const fullPath = join(repoRoot, page);
  try {
    const content = readFileSync(fullPath, "utf8");
    if (!content.includes(STAR_POINTS_DISCLAIMER)) {
      failures.push(`STAR_POINTS_MISSING: ${page} — mandatory Star Points disclaimer absent`);
    }
  } catch {
    failures.push(`STAR_POINTS_CHECK_FAIL: ${page} — file not readable`);
  }
}

for (const file of REQUIRED_FILES) {
  const fullPath = join(repoRoot, file);
  try {
    const content = readFileSync(fullPath, "utf8");
    for (const phrase of FORBIDDEN_PHRASES) {
      const lines = content.split("\n").filter(line =>
        line.includes(phrase) && !line.includes("không phải") && !line.includes("Star Points")
      );
      if (lines.length) {
        failures.push(`FORBIDDEN_PHRASE: "${phrase}" found in ${file} (${lines.length} occurance(s) outside legal disclaimer)`);
      }
    }
  } catch {
    failures.push(`C002_CHECK_FAIL: ${file} — file not readable`);
  }
}

for (const file of REQUIRED_FILES) {
  const fullPath = join(repoRoot, file);
  try {
    const content = readFileSync(fullPath, "utf8");
    if (!content.includes(C_002_FRAGMENT)) {
      failures.push(`C002_MISSING: ${file} — entity disclosure footer absent`);
    }
  } catch {
    // already reported above
  }
}

const apiFiles = [
  "functions/api/clubs/index.js",
  "functions/api/clubs/[slug]/index.js",
  "functions/api/clubs/[slug]/posts.js",
  "functions/api/clubs/waitlist.js",
  "functions/api/talkshows.js",
  "functions/api/rewards/catalog.js",
];

for (const f of apiFiles) {
  try {
    const content = readFileSync(join(repoRoot, f), "utf8");
    if (!content.includes("errorJson")) {
      failures.push(`API_PATTERN: ${f} — missing errorJson helper`);
    }
    if (!content.includes("onRequest")) {
      failures.push(`API_PATTERN: ${f} — missing onRequest export`);
    }
  } catch {
    failures.push(`API_FILE_MISSING: ${f}`);
  }
}

if (failures.length) {
  console.error("CLUB_PHASE1_QA_FAIL");
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log(`CLUB_PHASE1_QA_PASS files=${REQUIRED_FILES.length} starpoints=${STAR_POINTS_PAGES.length} api=${apiFiles.length}`);
