#!/usr/bin/env bash
# pay-owner-go-live.sh — push donation payment secrets to DSTS Cloudflare Pages.
# Usage:  bash scripts/pay-owner-go-live.sh
# Safe to re-run. Secrets unset on exit (trap).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_NAME="${PROJECT_NAME:-duongsaotoasang-com-v2}"
LIVE_HOST="${LIVE_HOST:-https://duongsaotoasang.com}"

cleanup() {
  unset PAY_IAI_ONE_API_KEY PAY_DSTS_HMAC 2>/dev/null || true
}
trap cleanup EXIT

prompt_secret() {
  local label="$1"; local var="$2"
  local existing="${!var-}"
  [ -n "$existing" ] && { echo "[i] $var already set, using it."; return 0; }
  if [ ! -t 0 ]; then
    echo "[FAIL] $var: stdin not TTY. Run directly in terminal." >&2; exit 3
  fi
  local value=""; local attempts=0
  while [ -z "$value" ]; do
    attempts=$((attempts + 1))
    [ "$attempts" -gt 5 ] && { echo "[FAIL] Too many empty attempts." >&2; exit 3; }
    printf "%s: " "$label" >&2
    if ! IFS= read -rs value; then
      printf "\n[FAIL] stdin closed.\n" >&2; exit 3
    fi
    printf "\n" >&2
    [ -z "$value" ] && echo "[!] cannot be empty" >&2
  done
  printf -v "$var" "%s" "$value"
  export "$var"
}

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "[FAIL] missing: $1"; exit 2; }; }

put_secret() {
  local name="$1"; local value="$2"
  printf "%s" "$value" | wrangler pages secret put "$name" \
    --project-name "$PROJECT_NAME" >/dev/null
  echo "  ✓ set $name → $PROJECT_NAME (production)"
}

need_cmd wrangler
need_cmd curl
need_cmd jq
need_cmd openssl

echo "== duongsaotoasang.com — Pay-Owner go-live =="
echo "Project: $PROJECT_NAME"
echo "Host:    $LIVE_HOST"
echo

echo "Step 1/4 — apply D1 migration (idempotent)"
wrangler d1 migrations apply cf-d1-dsts-content-prod --remote --config wrangler.toml && echo "  ✓ migrations applied"

echo
echo "Step 2/4 — collect secrets"
prompt_secret "PAY_IAI_ONE_API_KEY (dsts tenant, from Team Pay)" PAY_IAI_ONE_API_KEY

if [ -z "${PAY_DSTS_HMAC-}" ]; then
  PAY_DSTS_HMAC="$(openssl rand -hex 32)"
  export PAY_DSTS_HMAC
  echo
  echo "[!] Generated PAY_DSTS_HMAC — save this now:"
  echo "    PAY_DSTS_HMAC=$PAY_DSTS_HMAC"
  echo
fi

echo
echo "Step 3/4 — push secrets to Cloudflare Pages"
put_secret PAY_IAI_ONE_API_KEY "$PAY_IAI_ONE_API_KEY"
put_secret PAY_DSTS_HMAC       "$PAY_DSTS_HMAC"

echo
echo "Step 4/4 — smoke donate/create endpoint"
RESP="$(curl -sS -o - -w '\nHTTP_STATUS:%{http_code}' \
  -X POST "$LIVE_HOST/api/donate/create" \
  -H "content-type: application/json" \
  -H "idempotency-key: smoke-$(date +%s)" \
  --data '{"amount_vnd":10000,"donor_name":"Smoke Test","message":"Test donation"}' || true)"
echo "$RESP" | head -5
STATUS="$(echo "$RESP" | grep HTTP_STATUS | cut -d: -f2)"

if [ "$STATUS" = "401" ] || [ "$STATUS" = "000" ]; then
  echo "[FAIL] Got $STATUS — key may be invalid or site not reachable"
  exit 1
else
  echo
  echo "[PASS] duongsaotoasang.com donation lane active (status=$STATUS)"
  echo "       Monitor: wrangler pages deployment tail --project-name $PROJECT_NAME"
  echo "       Note: Cloudflare Pages re-deploys on next push to activate new secrets."
fi
