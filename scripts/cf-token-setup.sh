#!/usr/bin/env bash
# cf-token-setup.sh — Interactive prompt to securely save Cloudflare API token + Zone ID
# Usage:  bash scripts/cf-token-setup.sh
# Result: ~/.dsts-secrets/cf-token chmod 600, gitignored, used by cf-cache-purge.sh

set -euo pipefail

SECRETS_DIR="$HOME/.dsts-secrets"
TOKEN_FILE="$SECRETS_DIR/cf-token"
ZONE_FILE="$SECRETS_DIR/cf-zone-id"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DSTS — Cloudflare API Token Setup                         ║"
echo "║  Saves to ~/.dsts-secrets/  (chmod 600, gitignored)        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if already set
if [ -f "$TOKEN_FILE" ] && [ -f "$ZONE_FILE" ]; then
  echo "[i] Token + Zone ID already saved at: $SECRETS_DIR"
  read -p "    Overwrite? [y/N]: " overwrite
  if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
    echo "[i] Keeping existing token. Exit."
    exit 0
  fi
fi

# Verify stdin is TTY
if [ ! -t 0 ]; then
  echo "[FAIL] stdin not TTY. Run directly in terminal (not piped)." >&2
  exit 3
fi

# Prompt for token (hidden input)
echo ""
echo "Step 1/2 — Paste Cloudflare API Token"
echo "    Get from: https://dash.cloudflare.com/profile/api-tokens"
echo "    Permissions: Zone > Cache Purge > Purge"
echo "    Zone Resources: duongsaotoasang.com only"
echo ""
read -s -p "    CF API Token: " CF_TOKEN
echo ""

if [ -z "$CF_TOKEN" ]; then
  echo "[FAIL] Token empty. Abort." >&2
  exit 3
fi

# Prompt for zone ID (visible — not secret)
echo ""
echo "Step 2/2 — Paste Cloudflare Zone ID"
echo "    Get from: dashboard > duongsaotoasang.com > Overview > API section (right sidebar)"
echo ""
read -p "    Zone ID: " CF_ZONE_ID

if [ -z "$CF_ZONE_ID" ]; then
  echo "[FAIL] Zone ID empty. Abort." >&2
  exit 3
fi

# Create secrets dir + write files
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

printf '%s' "$CF_TOKEN" > "$TOKEN_FILE"
chmod 600 "$TOKEN_FILE"

printf '%s' "$CF_ZONE_ID" > "$ZONE_FILE"
chmod 600 "$ZONE_FILE"

# Verify token works (no body output, just status)
echo ""
echo "Verifying token..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID")

if [ "$HTTP_CODE" = "200" ]; then
  echo "[OK] Token verified — zone accessible."
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
  echo "[FAIL] Token invalid or lacks permissions. HTTP $HTTP_CODE" >&2
  rm -f "$TOKEN_FILE" "$ZONE_FILE"
  exit 4
elif [ "$HTTP_CODE" = "000" ]; then
  echo "[WARN] No network to verify. Token saved but unverified." >&2
else
  echo "[WARN] Unexpected HTTP $HTTP_CODE. Token saved but verification inconclusive." >&2
fi

# Clear from shell history immediately
unset CF_TOKEN

echo ""
echo "════════════════════════════════════════════════════════════"
echo "DONE. Secrets saved at: $SECRETS_DIR"
echo "    Token:   $TOKEN_FILE  (chmod 600)"
echo "    Zone ID: $ZONE_FILE   (chmod 600)"
echo ""
echo "Next: bash scripts/cf-cache-purge.sh"
echo "      (purges 6 URLs that need refresh, see FOUNDER_ACTION_CHECKLIST.md)"
echo "════════════════════════════════════════════════════════════"
