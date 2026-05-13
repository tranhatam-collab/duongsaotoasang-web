#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE_URL:-https://duongsaotoasang.com}"
BASE="${BASE%/}"
UNKNOWN_PATH="/random-unknown-url-xyz-12345"

urls=(
  "/"
  "/about"
  "/program"
  "/posts"
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong"
  "/events"
  "/scripts"
  "/donate"
  "/transparency"
  "/legal"
  "/terms"
  "/refund"
  "/privacy"
  "/contact"
  "/payment-confirmation"
  "/scripts/rising-entrepreneur"
  "/scripts/global-artist"
  "/scripts/singing-icon"
  "/scripts/cinematic-actor"
  "/scripts/the-thinker"
  "/scripts/creative-leader"
  "/scripts/cultural-ambassador"
  "/scripts/dsts-legacy"
  "/scripts/global-story"
  "/sitemap.xml"
  "/rss.xml"
  "/robots.txt"
)

content_checks=(
  "/posts|THƯ VIỆN TRI THỨC"
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong|Sáng tạo không bắt đầu từ tham vọng"
  "/events|DSTS Foundation Briefing"
  "/events|Thứ Bảy 20/06/2026"
  "/events|TP. Hồ Chí Minh + online hybrid"
  "/donate|Trạng thái: TẠM ĐÓNG"
  "/transparency|Báo cáo khởi tạo Q2/2026"
  "/legal|id=\"refund\""
  "/scripts/rising-entrepreneur|id=\"purchaseSafety\""
  "/scripts/rising-entrepreneur|Đánh giá minh họa"
  "/assets/app-v5.js|dsts-entity-disclosure"
)

failed=0

echo "=== DSTS Sprint 0 Smoke Test ==="
echo "Base: ${BASE}"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

for path in "${urls[@]}"; do
  status="$(curl -o /dev/null -sS -L --max-redirs 5 --connect-timeout 8 --max-time 20 -w "%{http_code}" "${BASE}${path}")"
  if [[ "$status" == "200" ]]; then
    printf "PASS %s  %s\n" "$status" "$path"
  else
    printf "FAIL %s  %s\n" "$status" "$path"
    failed=$((failed + 1))
  fi
done

echo ""
echo "=== Content checks ==="
for check in "${content_checks[@]}"; do
  path="${check%%|*}"
  needle="${check#*|}"
  body="$(curl -sS -L --max-redirs 5 --connect-timeout 8 --max-time 20 "${BASE}${path}")"
  if grep -Fq "$needle" <<< "$body"; then
    printf "PASS content  %s  contains [%s]\n" "$path" "$needle"
  else
    printf "FAIL content  %s  missing [%s]\n" "$path" "$needle"
    failed=$((failed + 1))
  fi
done

echo ""
echo "=== 404 check ==="
status_404="$(curl -o /dev/null -sS --connect-timeout 8 --max-time 20 -w "%{http_code}" "${BASE}${UNKNOWN_PATH}")"
if [[ "$status_404" == "404" ]]; then
  printf "PASS 404  %s\n" "$UNKNOWN_PATH"
else
  printf "FAIL expected 404 for %s, got %s\n" "$UNKNOWN_PATH" "$status_404"
  failed=$((failed + 1))
fi

echo ""
if [[ "$failed" -gt 0 ]]; then
  echo "FAILED: ${failed} smoke check(s) failed"
  exit 1
fi

echo "PASSED: all smoke checks passed"
