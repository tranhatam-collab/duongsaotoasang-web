# DEPLOY ĐÚNG ID CÓ TÊN MIỀN — 2026-06-15

## Kết luận
Production đã được deploy ĐÚNG vào project chứa tên miền `duongsaotoasang.com`.

## Bằng chứng

### Account / Project đúng (CÓ tên miền)
- Account ID: `62d57eaa548617aeecac766e5a1cb98e` (Anhhatam@gmail.com's Account)
- Project: `duongsaotoasang-com-v2`
- Subdomain: `duongsaotoasang-com-v2-dd2.pages.dev`  (có hậu tố `-dd2`)
- Domains: `duongsaotoasang.com`, `www.duongsaotoasang.com`
- Deployment production mới: `9ac9e32c-682b-48f1-b8a2-60cae254a6d9`
- Source commit: `e08f5f7`
- Trước đó production là `4b10a601` (commit `3d93f24`) — đã được thay thế.

### Account / Project SAI (KHÔNG có tên miền) — nơi các deploy trước đã đi nhầm
- Account ID: `f3f9e76222dcb488d5e303e29e8ba192` (Tranhatam@gmail.com's Account)
- Project: `duongsaotoasang-com-v2`
- Subdomain: `duongsaotoasang-com-v2.pages.dev` (KHÔNG có `-dd2`)
- Deploy nhầm: `c9fa97b0` (e08f5f7), `54c5d578` (02d02bd) — KHÔNG phục vụ tên miền, bỏ qua.

## Nguyên nhân gốc
Có HAI project trùng tên `duongsaotoasang-com-v2` ở hai account khác nhau.
Wrangler đăng nhập OAuth (`tranhatam@gmail.com`) mặc định trỏ vào account SAI
(`f3f9e76...`). Nếu không ép `CLOUDFLARE_ACCOUNT_ID`, mọi deploy đi nhầm project
không có tên miền.

## LỆNH DEPLOY ĐÚNG (bắt buộc dùng account ID có tên miền)
```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e \
  wrangler pages deploy . \
    --project-name=duongsaotoasang-com-v2 \
    --branch=main \
    --commit-hash=$(git rev-parse HEAD) \
    --commit-dirty=false
```

## Xác minh production (sau deploy 9ac9e32c)
- `https://duongsaotoasang.com/assets/app-v5.js` chứa `data-lang-switcher` → OK
- `https://duongsaotoasang.com/app.css` chứa `/assets/badge.css` → OK
- `https://duongsaotoasang.com/assets/badge.js` → 200 OK
- `https://duongsaotoasang.com/` → 200 OK
- `POST /api/trust-score/batch` → 500 "DB not bound" (route đã chạy đúng; 500 do D1 chưa bind — việc P1)

## CẢNH BÁO GitHub Actions
Workflow dùng `secrets.CLOUDFLARE_ACCOUNT_ID`. Secret này PHẢI bằng
`62d57eaa548617aeecac766e5a1cb98e`. Nếu đang trỏ account khác, auto-deploy sẽ lại
đi nhầm project không có tên miền. Founder cần kiểm tra/đặt lại secret này.

## Việc còn lại (P1 — cần Founder, không phải lỗi code)
- Bind D1 database (hiện API trả 500 "DB not bound").
- Bind R2 bucket cho upload.
- Đặt secrets: `TRUST_IAI_ONE_API_KEY`, `TRUST_IAI_ONE_WEBHOOK_SECRET`,
  `CF_ACCESS_TEAM_DOMAIN`, `STAFF_EMAILS`.
- Cập nhật Cache Rule 14400s → 300s.
- Kiểm tra/sửa `CLOUDFLARE_ACCOUNT_ID` trong GitHub Secrets.
