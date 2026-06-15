# DSTS — IDS LOCKED FINAL

> **Phiên bản:** v1.0 — 2026-06-15
> **Trạng thái:** 🔒 LOCKED - KHÔNG ĐƯỢC THAY ĐỔI
> **Owner:** Trần Hà Tâm (Founder)
> **Mục đích:** Chốt cuối cùng các ID quan trọng để bất cứ team nào cũng hiểu, không được làm sai

---

## ⚠️ QUAN TRỌNG - KHÔNG ĐƯỢC THAY ĐỔI

Tất cả các ID trong file này đã được **KHÓA CỨNG**. Bất kỳ thay đổi nào cần:
1. Phê duyệt trực tiếp từ Founder
2. Update version number ở trên
3. Commit message rõ ràng: `chore: update IDS_LOCKED_FINAL vX.Y - reason`

---

## CLOUDFLARE ACCOUNT

| Item | Value | Description | Usage |
|---|---|---|---|
| **Account ID** | `62d57eaa548617aeecac766e5a1cb98e` | Anhhatam@gmail.com's Account | **ONLY** account cho DSTS |
| **Account Name** | Anhhatam@gmail.com's Account | Tên hiển thị trong Cloudflare Dashboard | - |
| **Email** | tranhatam@gmail.com | Email đăng nhập | - |

> **WARNING:** KHÔNG BAO GIỜ sử dụng account ID khác (`f3f9e76222dcb488d5e303e29e8ba192` hoặc `93112cc89181e75335cbd7ef7e392ba3`)

---

## CLOUDFLARE PAGES PROJECT

| Item | Value | Description | Usage |
|---|---|---|---|
| **Project Name** | `duongsaotoasang-com-v2` | Tên project trong Cloudflare Pages | Deploy command |
| **Project ID** | `51a9959e-de12-459e-b169-ac57e58610bd` | Internal ID (không dùng trong wrangler) | API calls |
| **Subdomain** | `duongsaotoasang-com-v2-dd2.pages.dev` | Default Pages URL | Preview/Production |
| **Production Branch** | `main` | Branch deploy tự động | Git workflow |
| **Custom Domain** | `duongsaotoasang.com` | Primary domain | Public access |
| **Custom Domain** | `www.duongsaotoasang.com` | Redirect domain | SEO/Redirect |

> **WARNING:** KHÔNG tạo project mới với tên khác. KHÔNG delete project này.

---

## CLOUDFLARE ZONE (DNS)

| Item | Value | Description | Usage |
|---|---|---|---|
| **Zone ID** | `551f3742f1ab3f8babd106ffa1abde8c` | Zone ID cho duongsaotoasang.com | Cache purge, DNS API |
| **Zone Name** | duongsaotoasang.com | Tên zone | - |

> **WARNING:** File `~/.dsts-secrets/cf-zone-id` hiện chứa nhầm token 53 ký tự. Sửa thành Zone ID trên.

---

## D1 DATABASE

| Item | Value | Description | Usage |
|---|---|---|---|
| **Status** | 🔴 NOT BOUND | Account đã đạt giới hạn 10 database | - |
| **Old DB ID** | `2106abac-ff84-4f13-b80f-d73c76fb7d27` | ❌ KHÔNG TỒN TẠI - đã xóa | KHÔNG dùng |
| **Audit DB ID** | `84b5d905-7abe-492d-b3b8-4eb7288f4053` | ❌ KHÔNG DÙNG - là database accounting | KHÔNG dùng cho DSTS |

> **ACTION REQUIRED:** Trước khi bind D1, cần:
> 1. Xóa unused databases trong account
> 2. Tạo database mới tên `dsts-prod`
> 3. Update ID vào file này

---

## R2 BUCKET

| Item | Value | Description | Usage |
|---|---|---|---|
| **Status** | 🔴 NOT BOUND | Đã xóa khỏi wrangler.toml | - |
| **Old Bucket** | `dsts-legacy-media` | ❌ KHÔNG DÙNG - đã xóa binding | - |

> **ACTION REQUIRED:** Trước khi bind R2, cần tạo bucket mới và update ID.

---

## WRANGLER CONFIG

| Item | Value | Description | Usage |
|---|---|---|---|
| **Compatibility Date** | `2026-03-09` | Workers runtime version | wrangler.toml |
| **Pages Build Output** | `.` | Deploy từ root directory | wrangler.toml |
| **Branch** | `main` | Production branch | Git workflow |

> **NOTE:** `wrangler.toml` hiện KHÔNG có `account_id` (Pages không hỗ trợ). Sử dụng env var `CLOUDFLARE_ACCOUNT_ID` khi deploy.

---

## DEPLOYMENT COMMANDS

### Deploy Production
```bash
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch main --no-bundle --commit-dirty=true
```

### Deploy Preview
```bash
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch preview --no-bundle
```

### Cache Purge (Zone API)
```bash
# Cần API Token với quyền Zone → Cache Purge → Edit
curl -X POST "https://api.cloudflare.com/client/v4/zones/551f3742f1ab3f8babd106ffa1abde8c/purge_cache" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## ENVIRONMENT VARIABLES (REQUIRED)

### Production Environment Variables
```bash
PAY_IAI_ONE_BASE_URL="https://pay.iai.one"
PAY_IAI_ONE_TENANT_CODE="dsts"
PAY_IAI_ONE_SITE_CODE="duongsaotoasang"
PAY_IAI_ONE_PROVIDER="payos"
PAY_IAI_ONE_CALLBACK_BASE="https://duongsaotoasang.com"
MAIL_API_BASE_URL="https://mail.iai.one/_mail/v1"
EMAIL_FROM="DSTS <hello@duongsaotoasang.com>"
EMAIL_FROM_NOREPLY="DSTS <noreply@duongsaotoasang.com>"
SUPPORT_EMAIL="support@duongsaotoasang.com"
```

### Secrets (wrangler pages secret put)
```bash
PAY_IAI_ONE_API_KEY        # from Team Pay (tenant: dsts, site: duongsaotoasang)
PAY_DSTS_HMAC              # openssl rand -hex 32
MAIL_API_KEY               # from mail.iai.one
POLL_TOKEN                 # openssl rand -hex 32
```

> **WARNING:** KHÔNG commit secrets vào repo. Sử dụng `wrangler pages secret put`.

---

## GIT REPOSITORY

| Item | Value | Description | Usage |
|---|---|---|---|
| **Repository** | tranhatam-collab/duongsaotoasang-web | GitHub repo | - |
| **Default Branch** | `main` | Production branch | - |
| **Remote** | github-tranhatam:tranhatam-collab/duongsaotoasang-web.git | Git remote | - |

---

## URL REFERENCES

| Type | URL | Description |
|---|---|---|
| **Production** | https://duongsaotoasang.com | Primary domain |
| **Pages Dev** | https://duongsaotoasang-com-v2-dd2.pages.dev | Cloudflare Pages URL |
| **Cloudflare Dashboard** | https://dash.cloudflare.com | Account management |
| **Project Dashboard** | https://dash.cloudflare.com/62d57eaa548617aeecac766e5a1cb98e/pages/view/duongsaotoasang-com-v2 | Project settings |

---

## VERIFICATION CHECKLIST

Trước khi deploy hoặc làm thay đổi cấu hình, verify:

- [ ] Account ID = `62d57eaa548617aeecac766e5a1cb98e`
- [ ] Project name = `duongsaotoasang-com-v2`
- [ ] Zone ID = `551f3742f1ab3f8babd106ffa1abde8c`
- [ ] Branch = `main`
- [ ] D1 binding = KHÔNG (chưa bind)
- [ ] R2 binding = KHÔNG (chưa bind)
- [ ] Functions = Đã restore (49 functions)
- [ ] Custom domains = `duongsaotoasang.com`, `www.duongsaotoasang.com`

---

## CHANGE LOG

| Version | Date | Changes | Author |
|---|---|---|---|
| v1.0 | 2026-06-15 | Initial lock - chốt cuối cùng IDs quan trọng | Devin |

---

**File này được tạo để đảm bảo consistency across teams.**
**Bất kỳ thay đổi nào cần approval từ Founder.**
**Nếu nghi ngờ, hỏi Founder trước khi làm.**
