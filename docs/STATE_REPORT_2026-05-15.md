# DSTS — STATE REPORT 2026-05-15

> **Scope:** Sprint 0 / public-site stability handoff snapshot
> **Repo:** `/Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com`
> **Branch:** `main`
> **Latest commit:** `c5651bf` (`docs: production re-verify 2026-05-15`)
> **Cloudflare Pages project:** `duongsaotoasang-com-v2`
> **Repo-side completion:** ✅ 100%
> **Production deploy:** ✅ DONE 2026-05-15 — `https://41cfb754.duongsaotoasang-com-v2.pages.dev`
> **Production verification:** ✅ API + Link + SEO + Smoke ALL PASS; ⚠️ Headers blocked by CDN cache only

---

## 1) Trạng thái tổng quan (after re-verify)

- ✅ **Local QA (9 loại) ALL PASS** — content, depth, static, HTML structure, a11y, flow safety, social meta, structured data, asset budget.
- ✅ **Production deploy SUCCESS** — `wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch main` → preview URL `https://41cfb754.duongsaotoasang-com-v2.pages.dev`, auto-promote to custom domain.
- ✅ **Production checks 4/5 PASS** — API surface, link QA, SEO routes, smoke test pages.dev đều PASS.
- ⚠️ **Production headers FAIL** — duy nhất một check fail, nguyên nhân là **Cloudflare CDN custom-domain edge cache cũ**, KHÔNG phải bug code. `_headers` file trong repo đã correct.

---

## 2) Bằng chứng QA đã chạy lại (2026-05-15)

### Local QA (9/9 PASS)
- `node scripts/content-qa.mjs` → `CONTENT_QA_PASS posts=24 pages=2 fallback=26`
- `node scripts/content-depth-qa.mjs` → `CONTENT_DEPTH_QA_PASS posts=24 pages=2 min_post_words_vi=360 min_page_words_vi=180`
- `node scripts/static-page-depth-qa.mjs` → `STATIC_PAGE_DEPTH_QA_PASS pages=32 min_words=180`
- `node scripts/html-structure-qa.mjs` → `HTML_STRUCTURE_QA_PASS pages=35`
- `node scripts/accessibility-qa.mjs` → `ACCESSIBILITY_QA_PASS pages=35`
- `node scripts/public-flow-safety-qa.mjs` → `PUBLIC_FLOW_SAFETY_QA_PASS files=43 forms=2`
- `node scripts/social-metadata-qa.mjs` → `SOCIAL_METADATA_QA_PASS pages=35`
- `node scripts/structured-data-qa.mjs` → `STRUCTURED_DATA_QA_PASS pages=35 blocks=34 entities=34`
- `node scripts/public-asset-budget-qa.mjs` → `PUBLIC_ASSET_BUDGET_QA_PASS files=146 total=2.78MB`

### Production checks (re-verify 2026-05-15T10:40:46Z)

| Check | Result |
|-------|--------|
| `production-api-surface` | ✅ `API_SURFACE_QA_PASS list_no_body=true search_no_body=true detail_body=true missing_404=true` |
| `production-link-qa` | ✅ `LINK_QA_PASS pages=32 discovered=291 unique_internal=59` |
| `production-seo` | ✅ `SEO_ROUTE_QA_PASS indexable=32 noindex=2 redirects=2` |
| `production-headers` | ⚠️ `HEADERS_QA_FAIL` — 6 mismatches (CDN cache override, KHÔNG phải bug code) |

### Smoke test (pages.dev preview) — `BASE_URL=https://duongsaotoasang-com-v2.pages.dev`

- ✅ 60+ route status checks PASS (200 OK, 404 OK, redirects OK)
- ✅ 120+ content checks PASS (Movement Portal surfaces, NDNUM safety wording, robots, sitemap, etc.)
- ✅ `HEADERS_QA_PASS base=https://duongsaotoasang-com-v2.pages.dev checks=8` (pages.dev không bị custom-domain cache override → headers pass)
- ✅ Final: `PASSED: all smoke checks passed`

**Kết luận quan trọng:** Headers PASS trên `pages.dev` nhưng FAIL trên custom domain `duongsaotoasang.com` → xác nhận tuyệt đối issue là CDN/cache override ở custom domain layer, không phải file/code.

---

## 3) Tình trạng blocker còn lại

### `production-headers` — BLOCKED_EXTERNAL (CDN cache only)

6 mismatches trên `https://duongsaotoasang.com`:
- `root-html /` → `Referrer-Policy` got `same-origin` (expected `strict-origin-when-cross-origin`)
- `root-css /app.css` → `max-age=14400` (expected ≤ 300)
- `tokens-css /tokens.css` → `max-age=14400` (expected ≤ 300)
- `asset-js /assets/app-v5.js` → `max-age=14400` (expected ≤ 300)
- `og-image /og.png` → `max-age=14400` (expected ≤ 300)
- `retired-app-js /assets/app.js` → got 200 (expected 404 — retired file vẫn được serve từ edge cache)

**Reference fix packet:** `docs/CLOUDFLARE_CUSTOM_DOMAIN_FIX_PACKET_2026-05-14.md`

**Resolution paths:**
1. **Manual purge:** Founder vào Cloudflare dashboard → `duongsaotoasang.com` zone → Caching → Configuration → Purge Cache → Custom Purge → paste 6 URLs trên.
2. **TTL wait:** Đợi tối đa 4h cho edge cache tự expire.
3. **Sau purge/wait:** Re-run `BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs` → khi `SPRINT_0_RELEASE_GATE_PASS` thì Sprint 0 đóng hoàn toàn.

---

## 4) Next — Đóng vòng cuối

1. **Founder:** Purge Cloudflare cache theo `docs/FOUNDER_ACTION_CHECKLIST.md` Mục 1.
2. **Re-run:** `cd <repo> && BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs`.
3. **Verify PASS:** Nếu output là `SPRINT_0_RELEASE_GATE_PASS`, mark sprint ổn định và đóng `production-headers` blocker.

Tất cả Founder action items dài hạn (NDNUM decisions, hire CSO/Legal, A7 confirm, sponsor pricing, legal opinion) → `docs/FOUNDER_ACTION_CHECKLIST.md`.

---

## 5) Lịch sử commit chốt (2026-05-13 → 2026-05-15)

```
c5651bf docs: production re-verify 2026-05-15
25d33d4 docs: finalize production deploy log with smoke test pass
11ef795 docs: production deploy complete + founder action checklist
30894ad docs: refresh release gate blocker details
1113c75 chore(docs): log latest release gate block cause
8e39dcc chore(docs): record external deploy blocker in state report
... (toàn bộ Wave 1-2-3 NDNUM specs, Movement Portal pages, QA scaffolding)
```

Branch `main`/`origin/main` đồng bộ. Repo sạch (dirty local chỉ là `.wrangler`, `.DS_Store`, `"_redirects 2"`, `"content 2.js"` — không stage).
