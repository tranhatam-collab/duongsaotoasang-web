# DSTS — STATE REPORT 2026-05-15

> **Scope:** Sprint 0 / public-site stability handoff snapshot
> **Repo:** `/Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com`
> **Branch:** `main`
> **Latest commit:** `1113c75` (`chore(docs): log latest release gate cause`)
> **Cloudflare Pages project:** `duongsaotoasang-com-v2`

## 1) Trạng thái tổng quan

- ✅ **Route/API/Content/SEO/SEO metadata/Structured data/asset budget/QA gates** đều pass ở mức local checks (script-based, không phụ thuộc DNS).
- ❌ **Full production verification vẫn chưa thể hoàn tất** vì môi trường hiện tại không resolve DNS của `duongsaotoasang.com` và không reach được Cloudflare Pages endpoint để chạy link/SEO/API/header smoke.
- ✅ **Deploy dry-run đã xác nhận bundle sạch** cho project đúng: `duongsaotoasang-com-v2`.
- ✅ **Function API logic được kiểm trực tiếp**: gọi trực tiếp `functions/api/contents.js`, `functions/api/content.js`, `functions/api/search.js` (không cần DNS) đều trả về fallback/local JSON đúng trạng thái và `404` khi thiếu slug.

## 2) Bằng chứng QA đã chạy lại

### Local QA
- `node scripts/content-qa.mjs` → `CONTENT_QA_PASS posts=24 pages=2 fallback=26`
- `node scripts/content-depth-qa.mjs` → `CONTENT_DEPTH_QA_PASS posts=24 pages=2 min_post_words_vi=360 min_page_words_vi=180`
- `node scripts/static-page-depth-qa.mjs` → `STATIC_PAGE_DEPTH_QA_PASS pages=32 min_words=180`
- `node scripts/html-structure-qa.mjs` → `HTML_STRUCTURE_QA_PASS pages=35`
- `node scripts/accessibility-qa.mjs` → `ACCESSIBILITY_QA_PASS pages=35`
- `RUN_DEPLOY_DRY_RUN=1 node scripts/sprint-0-release-gate.mjs` → all local checks pass, **production surface checks BLOCKED** do fetch fail

### Production/proxy checks
- `curl`/`curl -sS` tới `https://duongsaotoasang.com` và `https://duongsaotoasang-com-v2.pages.dev` không resolve / fetch thành công trong môi trường hiện tại (`Could not resolve host` / `fetch failed`), nên production smoke chưa chạy được.
- `wrangler pages deploy . --project-name duongsaotoasang-com-v2` đã thử trong phiên hiện tại:
  - OAuth wrangler có quyền `pages write`,
  - nhưng vẫn fail: `Unable to resolve Cloudflare's API hostname (api.cloudflare.com or dash.cloudflare.com)` và `EPERM` khi ghi log ở `/Users/tranhatam/.wrangler/logs/...` (lỗi môi trường, không phải lỗi code/site files).

## 3) Tình trạng blocker

- **BLOCKED_EXTERNAL_DNS_OR_CONNECTIVITY**: không thể xác nhận lại production 200/headers/API/sitemap/robots với môi trường agent hiện tại.
- **BLOCKED_EXTERNAL_DNS_OR_CONNECTIVITY**: không thể xác nhận lại production 200/headers/API/sitemap/robots và deploy endpoint do DNS/network từ môi trường hiện tại.

## 4) Next

- Tiếp tục giữ Sprint 0 repo lane ở trạng thái **Code-ready**.
- Khi môi trường có DNS/network đến `duongsaotoasang.com`, chạy:
  - `BASE_URL=https://duongsaotoasang-com-v2.pages.dev ./scripts/smoke-test.sh`
  - `NODE_ENV=production RUN_DEPLOY_DRY_RUN=1 node scripts/sprint-0-release-gate.mjs`
  - `BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs`

## 4) Cập nhật chạy tự động gần đây

- `RUN_DEPLOY_DRY_RUN=1` + `node scripts/sprint-0-release-gate.mjs` đã chạy xong local:
  - Tất cả bước local đều pass và deploy dry-run pass.
  - `production-api-surface`, `production-link-qa`, `production-seo-route-qa`, `production-headers` đều fail do `fetch failed`/`Could not resolve host`.
  - Kết luận: vẫn `BLOCKED_EXTERNAL_DNS_OR_CONNECTIVITY`, chưa phải lỗi nội dung hay route.
