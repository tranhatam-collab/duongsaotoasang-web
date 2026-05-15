#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/dsts-secrets-setup.sh
#
# DSTS Master Secrets Setup — nhập 1 lần, lưu hết vào ~/.dsts-secrets/
# Claude Code đọc từ thư mục này khi cần chạy CF purge, deploy, wrangler, etc.
#
# Usage:
#   bash scripts/dsts-secrets-setup.sh
#
# Secrets sẽ được lưu:
#   ~/.dsts-secrets/cf-token            → Cloudflare API Token (cache purge)
#   ~/.dsts-secrets/cf-zone-id          → Cloudflare Zone ID
#   ~/.dsts-secrets/pay-iai-one-api-key → pay.iai.one merchant API key (Lane A+B)
#   ~/.dsts-secrets/pay-dsts-hmac       → HMAC secret cho webhook (generate nếu chưa có)
#   ~/.dsts-secrets/mail-api-key        → mail.iai.one API key (gửi email)
#   ~/.dsts-secrets/mail-workspace-id   → mail.iai.one Workspace ID
#   ~/.dsts-secrets/poll-token          → Poll endpoint auth token (auto-generate)
#   ~/.dsts-secrets/wrangler-api-token  → Cloudflare API Token dùng cho wrangler deploy
#
# Sau khi lưu xong, anh có 2 option:
#   A) Push secrets lên Cloudflare Pages ngay trong script này
#   B) Để Claude Code chạy "wrangler pages secret put" dựa vào file đã lưu
#
# SECURITY:
#   - Tất cả file chmod 600, thư mục chmod 700
#   - KHÔNG BAO GIỜ commit vào git (gitignore ~/ nên safe)
#   - Shell var bị unset ngay sau khi lưu
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SECRETS_DIR="$HOME/.dsts-secrets"
PROJECT="duongsaotoasang-com-v2"

# ── Colors ────────────────────────────────────────────────────────────────────
GRN='\033[0;32m' YEL='\033[1;33m' RED='\033[0;31m' BLU='\033[0;34m' RST='\033[0m'
ok()   { echo -e "${GRN}[✓]${RST} $*"; }
warn() { echo -e "${YEL}[!]${RST} $*"; }
err()  { echo -e "${RED}[✗]${RST} $*"; }
info() { echo -e "${BLU}[i]${RST} $*"; }

# ── TTY check ─────────────────────────────────────────────────────────────────
if [ ! -t 0 ]; then
  err "Cần chạy trực tiếp trong terminal (không pipe). Abort."
  exit 3
fi

# ── Header ───────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  DSTS — Master Secrets Setup                                         ║"
echo "║  Lưu tất cả API keys vào ~/.dsts-secrets/ (chmod 600, gitignored)   ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
info "Project: $PROJECT"
info "Secrets dir: $SECRETS_DIR"
echo ""

# ── Init secrets dir ─────────────────────────────────────────────────────────
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

# ── Helper: prompt_secret ─────────────────────────────────────────────────────
# Usage: prompt_secret <filename> <label> <help_url> <is_required>
save_secret() {
  local file="$SECRETS_DIR/$1"
  local label="$2"
  local hint="$3"
  local required="${4:-required}"
  local existing=""
  [ -f "$file" ] && existing=$(cat "$file")

  echo "──────────────────────────────────────────────────────────────────────"
  if [ -n "$existing" ]; then
    local masked="${existing:0:6}…${existing: -4}"
    info "$label: đã có ($masked)"
    read -p "  Skip (giữ nguyên)? [Y/n]: " skip_it
    if [ "$skip_it" != "n" ] && [ "$skip_it" != "N" ]; then
      ok "Giữ nguyên: $label"
      return 0
    fi
  else
    echo -e "${YEL}  ${label}${RST} — $required"
    [ -n "$hint" ] && info "  Lấy tại: $hint"
  fi

  read -s -p "  Paste value (ẩn): " val
  echo ""

  if [ -z "$val" ]; then
    if [ "$required" = "optional" ]; then
      warn "Bỏ qua (optional): $label"
      return 0
    else
      err "Không được để trống: $label. Abort."
      exit 3
    fi
  fi

  printf '%s' "$val" > "$file"
  chmod 600 "$file"
  ok "Đã lưu: $label → $file"
  unset val
}

# ── Helper: auto_generate ─────────────────────────────────────────────────────
auto_generate() {
  local file="$SECRETS_DIR/$1"
  local label="$2"
  if [ -f "$file" ]; then
    local existing masked
    existing=$(cat "$file")
    masked="${existing:0:6}…${existing: -4}"
    info "$label: đã có ($masked) — giữ nguyên"
    return 0
  fi
  local val
  val=$(openssl rand -hex 32)
  printf '%s' "$val" > "$file"
  chmod 600 "$file"
  ok "Auto-generated: $label → $file"
  unset val
}

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — Cloudflare (cache purge + deploy)
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "▌ SECTION 1 — Cloudflare"
echo ""

save_secret "cf-zone-id" \
  "CF Zone ID" \
  "dash.cloudflare.com → duongsaotoasang.com → Overview → right sidebar" \
  "required"

save_secret "cf-token" \
  "CF API Token — Cache Purge" \
  "dash.cloudflare.com/profile/api-tokens → Create Token → Zone:Cache Purge:Edit" \
  "required (cho cache purge sau deploy)"

save_secret "wrangler-api-token" \
  "CF API Token — Wrangler Deploy" \
  "dash.cloudflare.com/profile/api-tokens → Create Token → dùng template 'Edit Cloudflare Workers'" \
  "optional (chỉ cần nếu muốn Claude Code tự deploy)"

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — pay.iai.one
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "▌ SECTION 2 — pay.iai.one (donation gateway)"
echo ""

save_secret "pay-iai-one-api-key" \
  "PAY_IAI_ONE_API_KEY — merchant API key" \
  "pay.iai.one merchant dashboard → tenant: dsts, site: duongsaotoasang" \
  "required (donate flow sẽ trả 503 nếu thiếu)"

# Auto-generate HMAC nếu chưa có (shared với pay.iai.one webhook)
echo "──────────────────────────────────────────────────────────────────────"
info "PAY_DSTS_HMAC — HMAC secret cho webhook signature verify"
info "Nếu anh chưa có: script sẽ tự generate 1 key ngẫu nhiên."
info "Sau đó anh cần paste key này vào pay.iai.one dashboard để 2 bên khớp."
auto_generate "pay-dsts-hmac" "PAY_DSTS_HMAC"
echo ""
info "HMAC key đã lưu tại: $SECRETS_DIR/pay-dsts-hmac"
info "→ Anh cần đăng ký key này ở pay.iai.one (webhook HMAC setting)"

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — mail.iai.one (email automation)
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "▌ SECTION 3 — mail.iai.one (email receipt tự động)"
echo ""

save_secret "mail-api-key" \
  "MAIL_API_KEY — mail.iai.one API key" \
  "mail.iai.one dashboard → API Keys" \
  "optional (email receipt bị skip nếu thiếu, fallback RESEND_API_KEY)"

save_secret "mail-workspace-id" \
  "MAIL_API_WORKSPACE_ID — workspace ID" \
  "mail.iai.one dashboard → Workspace ID" \
  "optional (bắt buộc nếu MAIL_API_KEY đã set)"

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — Internal tokens
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "▌ SECTION 4 — Internal tokens (tự generate)"
echo ""

auto_generate "poll-token" "POLL_TOKEN (donation poll sweep auth)"

# ══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "══════════════════════════════════════════════════════════════════════"
echo "  DSTS Secrets — Summary"
echo "══════════════════════════════════════════════════════════════════════"
echo ""

check_file() {
  local file="$SECRETS_DIR/$1"
  local label="$2"
  if [ -f "$file" ] && [ -s "$file" ]; then
    local val masked
    val=$(cat "$file")
    masked="${val:0:6}…${val: -4}"
    ok "$label ($masked)"
  else
    warn "$label — MISSING"
  fi
}

check_file "cf-zone-id"          "CF Zone ID"
check_file "cf-token"            "CF API Token (cache purge)"
check_file "wrangler-api-token"  "CF API Token (wrangler deploy)"
check_file "pay-iai-one-api-key" "PAY_IAI_ONE_API_KEY"
check_file "pay-dsts-hmac"       "PAY_DSTS_HMAC"
check_file "mail-api-key"        "MAIL_API_KEY"
check_file "mail-workspace-id"   "MAIL_API_WORKSPACE_ID"
check_file "poll-token"          "POLL_TOKEN"

echo ""

# ══════════════════════════════════════════════════════════════════════════════
# OPTION — Push secrets to Cloudflare Pages via wrangler
# ══════════════════════════════════════════════════════════════════════════════
echo "──────────────────────────────────────────────────────────────────────"
echo "  Push secrets lên Cloudflare Pages ($PROJECT)?"
echo "  Cần: wrangler CLI + wrangler-api-token đã lưu"
echo ""
read -p "  Push ngay? [y/N]: " do_push

if [ "$do_push" = "y" ] || [ "$do_push" = "Y" ]; then
  WRANGLER_TOKEN_FILE="$SECRETS_DIR/wrangler-api-token"
  if [ ! -f "$WRANGLER_TOKEN_FILE" ] || [ ! -s "$WRANGLER_TOKEN_FILE" ]; then
    err "wrangler-api-token chưa được lưu → bỏ qua push."
  else
    export CLOUDFLARE_API_TOKEN
    CLOUDFLARE_API_TOKEN=$(cat "$WRANGLER_TOKEN_FILE")

    push_secret() {
      local secret_file="$SECRETS_DIR/$1"
      local secret_name="$2"
      if [ -f "$secret_file" ] && [ -s "$secret_file" ]; then
        printf '%s' "$(cat "$secret_file")" | \
          npx wrangler pages secret put "$secret_name" \
            --project-name "$PROJECT" 2>/dev/null \
          && ok "Pushed: $secret_name" \
          || warn "Failed: $secret_name (wrangler error)"
      else
        info "Skipped (empty): $secret_name"
      fi
    }

    echo ""
    info "Pushing secrets to $PROJECT..."
    echo ""
    push_secret "pay-iai-one-api-key" "PAY_IAI_ONE_API_KEY"
    push_secret "pay-dsts-hmac"       "PAY_DSTS_HMAC"
    push_secret "mail-api-key"        "MAIL_API_KEY"
    push_secret "mail-workspace-id"   "MAIL_API_WORKSPACE_ID"
    push_secret "poll-token"          "POLL_TOKEN"

    unset CLOUDFLARE_API_TOKEN
    echo ""
    ok "Push hoàn tất. Kiểm tra tại:"
    info "https://dash.cloudflare.com → Workers & Pages → $PROJECT → Settings → Environment Variables"
  fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# NEXT STEPS
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "══════════════════════════════════════════════════════════════════════"
echo "  Bước tiếp theo"
echo "══════════════════════════════════════════════════════════════════════"
echo ""
echo "  1. Purge CF cache (unlock gate cuối):"
echo "     bash scripts/cf-cache-purge.sh"
echo ""
echo "  2. Verify headers pass:"
echo "     BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs"
echo "     → expected: SPRINT_0_RELEASE_GATE_PASS"
echo ""
echo "  3. Apply D1 migration mới (nếu chưa):"
echo "     npx wrangler d1 migrations apply cf-d1-dsts-content-prod --remote"
echo ""
echo "  4. HMAC cần register ở pay.iai.one:"
info "     $(cat "$SECRETS_DIR/pay-dsts-hmac" 2>/dev/null | head -c 16)… (xem đầy đủ tại $SECRETS_DIR/pay-dsts-hmac)"
echo ""
echo "══════════════════════════════════════════════════════════════════════"
