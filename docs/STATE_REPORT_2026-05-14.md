# DSTS — STATE REPORT 2026-05-14

> **Scope:** Sprint 0 execution status after continuous public-site hardening.
> **Repo:** `tranhatam-collab/duongsaotoasang-web`
> **Branch:** `main`
> **Latest verified baseline commit:** `a5d0ee9`
> **Cloudflare Pages project:** `duongsaotoasang-com-v2`
> **Do not confuse with:** `duongsaotoasang-web`

---

## 1. Executive Status

Layer 0 public-site recovery is now substantially complete for route, content, fallback, API surface, SEO, sitemap, RSS, 404, Movement read-only surfaces, NDNUM public surface, and script review safety.

The remaining known blocker is outside the repo:

```text
Custom domain production header/cache override
```

Preview deploys apply repo `_headers` correctly. The custom domain `duongsaotoasang.com` is still overriding:

- `referrer-policy` to `same-origin`
- static asset `cache-control` to `max-age=14400`

Repo `_headers` expects:

- `referrer-policy: strict-origin-when-cross-origin`
- static assets including `/tokens.css` `max-age=300, must-revalidate`

This must be fixed in Cloudflare zone/custom-domain cache/header rules, not by changing static site code.

---

## 2. Verified Green Areas

| Area | Status | Evidence |
|---|---:|---|
| Public routes | PASS | Preview full smoke passed on `71da6cda.duongsaotoasang-com-v2.pages.dev` |
| `/posts` fallback | PASS | 24 posts, `data-dsts-ssr="posts"`, no legacy loading placeholder |
| `/content?slug=...` detail | PASS | Valid slug renders SSR content; missing slug returns content 404 |
| `/content` without slug | PASS | Server-side middleware redirects to `/posts` |
| API list safety | PASS | `/api/contents` list responses do not expose full body |
| API search safety | PASS | `/api/search?q=guardian&limit=3` returns metadata only |
| API detail body | PASS | `/api/content?slug=guardian-first-nguyen-tac-bao-ve-tre-em-ndnum` returns full body |
| Link QA | PASS | 32 pages scanned, 289 discovered links, 59 unique internal links |
| SEO route QA | PASS | 32 indexable, 2 noindex, 2 redirects |
| 404 route | PASS | Unknown routes return 404 and current app shell |
| 404 contact boundary | PASS | 404 routes to `/contact` + `/support`, no raw email exposed |
| Movement read-only surfaces | PASS | No sponsor inquiry, event registration, payment, or auth flow opened |
| NDNUM public surface | PASS | Guardian-first language and no direct child contact flow |
| Script reviews | PASS | Sample-only labels; no public review form remains |
| Ops runbook | PASS | Root `RUNBOOK.md` documents deploy, rollback, owner matrix, incident response, and external Cloudflare blocker |
| Design tokens | PASS | Root `tokens.css` exports color, spacing, typography, radius, shadow and is imported by `app.css` |

---

## 3. Recent Commits Relevant To Sprint 0

| Commit | Purpose |
|---|---|
| `a5d0ee9` | Add public-site operations runbook |
| `c0da82b` | Update Sprint 0 status docs with content redirect evidence |
| `e2691fc` | Fix `_routes.json` for Pages middleware without overlapping rules |
| `fa72dc2` | Add Pages middleware so `/content` without slug redirects to `/posts` |
| `82b71bd` | Avoid brittle API search smoke body check; rely on schema QA |
| `72e1eca` | Use stable search smoke marker |
| `063621a` | Strip fallback body from search APIs |
| `7fea23b` | Route 404 contact to support pages |
| `2ac72f0` | Remove dead review form code |
| `423caba` | Harden Movement fallback routes |
| `2987db9` | Fix 404 app shell script |
| `ac52b0a` | Mark script reviews sample-only and remove public review submission path |
| `a710885` | Make contact manual-only, no public contact form |
| `d19c7c3` | Remove legacy loading placeholders |
| `7a53ca4` | Sync inline fallback data in `posts.html` and `content.html` |
| `6e059c3` | Sync static content data files |

---

## 4. Verification Commands

Use preview for full smoke while production custom-domain header/cache override is unresolved:

```bash
BASE_URL=https://d1db9982.duongsaotoasang-com-v2.pages.dev ./scripts/smoke-test.sh
```

Expected:

```text
PASSED: all smoke checks passed
PASS content-index-redirect  /content -> /posts
```

SEO QA:

```bash
BASE_URL=https://d1db9982.duongsaotoasang-com-v2.pages.dev node scripts/seo-route-qa.mjs
BASE_URL=https://duongsaotoasang.com node scripts/seo-route-qa.mjs
```

Expected:

```text
SEO_ROUTE_QA_PASS indexable=32 noindex=2 redirects=2
```

Production API schema spot checks:

```bash
curl -sS -L 'https://duongsaotoasang.com/api/search?q=guardian&limit=3'
curl -sS -L 'https://duongsaotoasang.com/api/contents?type=post&limit=3'
curl -sS -L 'https://duongsaotoasang.com/api/content?slug=guardian-first-nguyen-tac-bao-ve-tre-em-ndnum'
```

Expected:

- list/search endpoints return metadata only
- detail endpoint returns full localized content body

---

## 5. Known Blocker

### BLOCKED — Cloudflare custom-domain header/cache override

Full production smoke currently fails at `scripts/headers-qa.mjs` because custom domain headers differ from preview:

```text
HEADERS_QA_FAIL
- root-html / header referrer-policy expected strict-origin-when-cross-origin, got same-origin
- root-css /app.css max-age must be <= 300, got 14400
- tokens-css /tokens.css max-age must be <= 300, got 14400
- asset-js /assets/app-v5.js max-age must be <= 300, got 14400
- og-image /og.png max-age must be <= 300, got 14400
```

Repo evidence:

```text
_headers contains:
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: public, max-age=300, must-revalidate
```

Preview evidence:

```text
Preview applies repo _headers correctly.
```

Production custom-domain evidence:

```text
duongsaotoasang.com applies same-origin and max-age=14400 even on cache MISS.
```

Required owner action:

1. Inspect Cloudflare zone rules for `duongsaotoasang.com`.
2. Find Browser Cache TTL, Cache Rules, Transform Rules, Managed Rules, or Page Rules overriding origin headers.
3. Set `duongsaotoasang.com/app.css`, `/tokens.css`, `/assets/*`, `/og.png` to respect origin headers or max-age <= 300.
4. Set Referrer Policy to `strict-origin-when-cross-origin`.
5. Re-run:

```bash
BASE_URL=https://duongsaotoasang.com ./scripts/smoke-test.sh
```

---

## 6. Excluded Lanes

Per Founder instruction, this repo-side sprint did not handle:

- email automation
- payment/pay implementation
- registration/login/auth

Public pages that touch those topics are read-only, manual-only, or explicitly closed/pending.

---

## 7. Current Judgment

Sprint 0 should be treated as:

```text
ROUTE/API/CONTENT/SEO: DONE
CONTENT INDEX REDIRECT: DONE
PRODUCTION HEADER/CACHE: BLOCKED_EXTERNAL
FULL PRODUCTION SMOKE: BLOCKED_EXTERNAL until Cloudflare zone rule is corrected
```

The site is no longer in the old P0 state of black pages, broken primary routes, stuck content, missing public pages, or unsafe API list/search body exposure.
