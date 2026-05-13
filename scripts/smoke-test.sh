#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE_URL:-https://duongsaotoasang.com}"
BASE="${BASE%/}"
UNKNOWN_PATH="/random-unknown-url-xyz-12345"
MISSING_CONTENT_PATH="/content?slug=missing-smoke-slug-404"

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
  "/dream-nurture"
  "/ndnum"
  "/movement"
  "/movement/sponsors"
  "/movement/events"
  "/movement/diaspora-map"
  "/movement/press"
  "/movement/partners"
  "/movement/tour-2026-2027"
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
  "/posts|data-dsts-ssr=\"posts\""
  "/posts|Khởi nghiệp từ nơi sống thật"
  "/posts|\"@type\":\"ItemList\""
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong|Sáng tạo không bắt đầu từ tham vọng"
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong|data-dsts-ssr=\"content\""
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong|\"@type\":\"BlogPosting\""
  "/events|DSTS Foundation Briefing"
  "/events|Thứ Bảy 20/06/2026"
  "/events|TP. Hồ Chí Minh + online hybrid"
  "/movement|Movement Portal"
  "/movement|data-dsts-surface=\"movement-home\""
  "/movement|Không mở sponsor inquiry"
  "/movement|Không thu email"
  "/movement/sponsors|Đang xây dựng"
  "/movement/events|Không thu email"
  "/movement/press|data-dsts-surface=\"movement-press\""
  "/movement/press|Press Kit DSTS"
  "/movement/press|Không có media contact form"
  "/movement/partners|data-dsts-surface=\"movement-partners\""
  "/movement/partners|DSTS Partners"
  "/movement/partners|Không có sponsor inquiry form"
  "/movement/tour-2026-2027|data-dsts-surface=\"movement-tour\""
  "/movement/tour-2026-2027|DSTS World Tour 2026-2027"
  "/movement/tour-2026-2027|Không có event registration form"
  "/dream-nurture|Nuôi Dưỡng Những Ước Mơ"
  "/dream-nurture|Guardian-first"
  "/dream-nurture|Không xử lý payment"
  "/ndnum|Phase 0B"
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

content_404="$(curl -o /dev/null -sS --connect-timeout 8 --max-time 20 -w "%{http_code}" "${BASE}${MISSING_CONTENT_PATH}")"
if [[ "$content_404" == "404" ]]; then
  printf "PASS content-404  %s\n" "$MISSING_CONTENT_PATH"
else
  printf "FAIL expected 404 for %s, got %s\n" "$MISSING_CONTENT_PATH" "$content_404"
  failed=$((failed + 1))
fi

echo ""
if [[ "$failed" -gt 0 ]]; then
  echo "FAILED: ${failed} smoke check(s) failed"
  exit 1
fi

echo "PASSED: all smoke checks passed"
