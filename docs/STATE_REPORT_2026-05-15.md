# DSTS — STATE REPORT 2026-05-15

> **Scope:** Sprint 0 / public-site stability handoff snapshot
> **Repo:** `/Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com`
> **Branch:** `main`
> **Latest commit:** `e5e9d23` (`Update state report baseline to latest wording QA commit`)
> **Cloudflare Pages project:** `duongsaotoasang-com-v2`

## 1) Trạng thái tổng quan

- ✅ **Route/API/Content/SEO/SEO metadata/Structured data/asset budget/QA gates** đều pass ở mức local checks (script-based, không phụ thuộc DNS).
- ❌ **Full production verification vẫn chưa thể hoàn tất** vì môi trường hiện tại không resolve DNS của `duongsaotoasang.com` và không reach được Cloudflare Pages endpoint để chạy link/SEO/API/header smoke.
- ✅ **Deploy dry-run đã xác nhận bundle sạch** cho project đúng: `duongsaotoasang-com-v2`.

## 2) Bằng chứng QA đã chạy lại

### Local QA
- `node scripts/content-qa.mjs` → `CONTENT_QA_PASS posts=24 pages=2 fallback=26`
- `node scripts/content-depth-qa.mjs` → `CONTENT_DEPTH_QA_PASS posts=24 pages=2 min_post_words_vi=360 min_page_words_vi=180`
- `node scripts/static-page-depth-qa.mjs` → `STATIC_PAGE_DEPTH_QA_PASS pages=32 min_words=180`
- `node scripts/html-structure-qa.mjs` → `HTML_STRUCTURE_QA_PASS pages=35`
- `node scripts/accessibility-qa.mjs` → `ACCESSIBILITY_QA_PASS pages=35`
- `RUN_DEPLOY_DRY_RUN=1 node scripts/sprint-0-release-gate.mjs` → all local checks pass, **production surface checks BLOCKED** do fetch fail

### Production/proxy checks
- `curl`/`curl -sS` tới `https://duongsaotoasang.com` và `https://806a88f8.duongsaotoasang-com-v2.pages.dev` không resolve / fetch thành công trong môi trường hiện tại (`Could not resolve host` / `fetch failed`), nên production smoke chưa chạy được.

## 3) Tình trạng blocker

- **BLOCKED_EXTERNAL_DNS_OR_CONNECTIVITY**: không thể xác nhận lại production 200/headers/API/sitemap/robots với môi trường agent hiện tại.

## 4) Next

- Tiếp tục giữ Sprint 0 repo lane ở trạng thái **Code-ready**.
- Khi môi trường có DNS/network đến `duongsaotoasang.com`, chạy:
  - `BASE_URL=https://duongsaotoasang-com-v2.pages.dev ./scripts/smoke-test.sh`
  - `NODE_ENV=production RUN_DEPLOY_DRY_RUN=1 node scripts/sprint-0-release-gate.mjs`
  - `BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs`
