#!/usr/bin/env bash
# cf-cache-purge.sh — Purge specific URLs from Cloudflare edge cache using saved token
# Usage:  bash scripts/cf-cache-purge.sh [--all]
# Default: purges the 6 URLs that have stale headers (per release-gate)
# --all:  purges entire zone cache (use sparingly)

set -euo pipefail

SECRETS_DIR="$HOME/.dsts-secrets"
TOKEN_FILE="$SECRETS_DIR/cf-token"
ZONE_FILE="$SECRETS_DIR/cf-zone-id"

if [ ! -f "$TOKEN_FILE" ] || [ ! -f "$ZONE_FILE" ]; then
  echo "[FAIL] Secrets not found at $SECRETS_DIR" >&2
  echo "       Run first: bash scripts/cf-token-setup.sh" >&2
  exit 2
fi

CF_TOKEN=$(cat "$TOKEN_FILE")
CF_ZONE_ID=$(cat "$ZONE_FILE")

if [ "${1:-}" = "--all" ]; then
  echo "[!] Purging ENTIRE zone cache (--all flag)..."
  PAYLOAD='{"purge_everything":true}'
else
  echo "[i] Purging 6 stale URLs (default)..."
  PAYLOAD='{
    "files": [
      "https://duongsaotoasang.com/",
      "https://duongsaotoasang.com/app.css",
      "https://duongsaotoasang.com/tokens.css",
      "https://duongsaotoasang.com/assets/app-v5.js",
      "https://duongsaotoasang.com/assets/app.js",
      "https://duongsaotoasang.com/og.png"
    ]
  }'
fi

RESPONSE=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$PAYLOAD")

# Parse response
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[^,}]*' | head -1 | cut -d: -f2)

if [ "$SUCCESS" = "true" ]; then
  echo "[OK] Cache purge SUCCESS."
  echo ""
  echo "Wait 30s, then re-verify with:"
  echo "  BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs"
else
  echo "[FAIL] Cache purge FAILED:" >&2
  echo "$RESPONSE" | head -5 >&2
  exit 5
fi

# Clear sensitive var
unset CF_TOKEN
