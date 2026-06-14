#!/bin/bash
# Smoke test v3.0 — All new routes
BASE=${BASE_URL:-https://duongsaotoasang.com}
echo "=== DSTS v3.0 Smoke Test ==="
echo "Base: $BASE"
echo ""

ROUTES=(
  "/"
  "/verify/"
  "/legacy/"
  "/sponsor/"
  "/map.html"
  "/trust/"
  "/register/"
  "/mentor-network.html"
  "/dream-nurture.html"
  "/club/"
  "/donate.html"
  "/api/verify/1"
  "/api/legacy?privacy=public"
  "/api/sponsor"
  "/api/map/entities?limit=10"
)

for route in "${ROUTES[@]}"; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE$route")
  if [ "$code" = "200" ] || [ "$code" = "308" ]; then
    echo "✅ $route → $code"
  else
    echo "❌ $route → $code"
  fi
done
echo ""
echo "=== Smoke Test Complete ==="
