#!/usr/bin/env bash
# pay-owner-go-live.sh — DSTS donation payment go-live for Cloudflare Pages.
#
# Per Cloudflare docs, secrets set on a Pages project are scoped to the
# NEXT deployment, not the currently-live one. Correct sequence:
#
#   1. apply D1 migration            (idempotent — runs against remote DB)
#   2. push secrets to Pages project (Wrangler `pages secret put`)
#   3. trigger redeploy              (Wrangler `pages deploy .`)
#   4. wait briefly for propagation
#   5. smoke live endpoint           (POST /api/donate/create on prod host)
#
# Smoke that runs BEFORE the redeploy hits the stale deployment without
# the new secrets and will return 503 PAYMENT_NOT_CONFIGURED — false fail.
#
# Usage: bash scripts/pay-owner-go-live.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_NAME="${PROJECT_NAME:-duongsaotoasang-com-v2}"
LIVE_HOST="${LIVE_HOST:-https://duongsaotoasang.com}"
DB_NAME="${DB_NAME:-cf-d1-dsts-content-prod}"

cleanup() {
  unset PAY_IAI_ONE_API_KEY PAY_DSTS_HMAC MAIL_API_KEY MAIL_API_WORKSPACE_ID POLL_TOKEN 2>/dev/null || true
}
trap cleanup EXIT

prompt_secret() {
  local label="$1"; local var="$2"; local optional="${3:-required}"
  local existing="${!var-}"
  [ -n "$existing" ] && { echo "[i] $var already set in env, using it."; return 0; }
  if [ ! -t 0 ]; then
    echo "[FAIL] $var: stdin not TTY. Run directly in terminal." >&2; exit 3
  fi
  local value=""; local attempts=0
  while [ -z "$value" ]; do
    attempts=$((attempts + 1))
    if [ "$optional" = "optional" ] && [ "$attempts" -gt 1 ]; then
      echo "[i] skipped (optional): $var" >&2
      return 0
    fi
    [ "$attempts" -gt 5 ] && { echo "[FAIL] Too many empty attempts." >&2; exit 3; }
    if [ "$optional" = "optional" ]; then
      printf "%s [empty to skip]: " "$label" >&2
    else
      printf "%s: " "$label" >&2
    fi
    if ! IFS= read -rs value; then
      printf "\n[FAIL] stdin closed.\n" >&2; exit 3
    fi
    printf "\n" >&2
    if [ -z "$value" ] && [ "$optional" = "optional" ]; then
      echo "[i] skipped (optional): $var" >&2
      return 0
    fi
    [ -z "$value" ] && echo "[!] cannot be empty" >&2
  done
  printf -v "$var" "%s" "$value"
  export "$var"
}

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "[FAIL] missing: $1"; exit 2; }; }

put_secret() {
  local name="$1"; local value="$2"
  [ -z "${value:-}" ] && { echo "  - skip $name (empty)"; return 0; }
  printf "%s" "$value" | wrangler pages secret put "$name" \
    --project-name "$PROJECT_NAME" >/dev/null
  echo "  ✓ set $name → $PROJECT_NAME"
}

need_cmd wrangler
need_cmd curl
need_cmd openssl

echo "== DSTS Pay-Owner go-live (corrected sequence) =="
echo "Project: $PROJECT_NAME"
echo "DB:      $DB_NAME"
echo "Host:    $LIVE_HOST"
echo

# ── Step 1/5 — D1 migration ──────────────────────────────────────────────────
echo "Step 1/5 — apply D1 migration (idempotent, --remote)"
wrangler d1 migrations apply "$DB_NAME" --remote --config wrangler.toml \
  && echo "  ✓ migrations applied"
echo

# ── Step 2/5 — collect secrets ───────────────────────────────────────────────
echo "Step 2/5 — collect secrets (paste hidden)"
prompt_secret "PAY_IAI_ONE_API_KEY (Team Pay merchant key)" PAY_IAI_ONE_API_KEY required

if [ -z "${PAY_DSTS_HMAC-}" ]; then
  PAY_DSTS_HMAC="$(openssl rand -hex 32)"
  export PAY_DSTS_HMAC
  echo
  echo "[!] Generated PAY_DSTS_HMAC — register this at pay.iai.one webhook setting:"
  echo "    $PAY_DSTS_HMAC"
  echo
fi

prompt_secret "MAIL_API_KEY (mail.iai.one)" MAIL_API_KEY optional
prompt_secret "MAIL_API_WORKSPACE_ID (mail.iai.one)" MAIL_API_WORKSPACE_ID optional

if [ -z "${POLL_TOKEN-}" ]; then
  POLL_TOKEN="$(openssl rand -hex 32)"
  export POLL_TOKEN
  echo "[i] Generated POLL_TOKEN for /api/donate/poll auth"
fi

# ── Step 3/5 — push secrets ──────────────────────────────────────────────────
echo
echo "Step 3/5 — push secrets to Cloudflare Pages (production scope)"
put_secret PAY_IAI_ONE_API_KEY     "$PAY_IAI_ONE_API_KEY"
put_secret PAY_DSTS_HMAC           "$PAY_DSTS_HMAC"
put_secret MAIL_API_KEY            "${MAIL_API_KEY:-}"
put_secret MAIL_API_WORKSPACE_ID   "${MAIL_API_WORKSPACE_ID:-}"
put_secret POLL_TOKEN              "$POLL_TOKEN"

# ── Step 4/5 — REDEPLOY (critical: secrets bind to next deployment) ──────────
echo
echo "Step 4/5 — redeploy so new secrets are bound to live deployment"
echo "         (Cloudflare Pages: secrets apply to deployments AFTER they were set)"
wrangler pages deploy . --project-name "$PROJECT_NAME" --branch main \
  | tee /tmp/dsts-deploy.out
DEPLOY_URL="$(grep -oE 'https://[a-z0-9-]+\.pages\.dev' /tmp/dsts-deploy.out | head -1 || true)"
echo "  Deploy URL: ${DEPLOY_URL:-unknown}"

echo
echo "  Waiting 15s for custom domain to attach…"
sleep 15

# ── Step 5/5 — smoke ─────────────────────────────────────────────────────────
echo
echo "Step 5/5 — smoke POST /api/donate/create on $LIVE_HOST"
RESP="$(curl -sS -o - -w '\nHTTP_STATUS:%{http_code}' \
  -X POST "$LIVE_HOST/api/donate/create" \
  -H "content-type: application/json" \
  -H "x-idempotency-key: smoke-$(date +%s)" \
  --data '{"amount_vnd":10000,"donor_name":"Smoke Test","message":"Pay-owner go-live smoke"}' || true)"
echo "$RESP" | head -8
STATUS="$(echo "$RESP" | grep HTTP_STATUS | cut -d: -f2)"

echo
case "$STATUS" in
  200)
    echo "[PASS] donate/create returned 200 — Lane B donation flow LIVE."
    echo "       Next: send a signed webhook to /api/donate/webhook to prove receipt audit."
    ;;
  503)
    echo "[WARN] Got 503 — secrets may not have propagated yet. Wait 30s and retry:"
    echo "       curl -X POST $LIVE_HOST/api/donate/create -H 'content-type: application/json' \\"
    echo "         -H 'x-idempotency-key: smoke2' --data '{\"amount_vnd\":10000}'"
    ;;
  502)
    echo "[FAIL] Got 502 — pay.iai.one unreachable or returned error. Check API key validity."
    exit 1
    ;;
  *)
    echo "[FAIL] Unexpected status: $STATUS"
    exit 1
    ;;
esac

echo
echo "Done. Monitor logs: wrangler pages deployment tail --project-name $PROJECT_NAME"
