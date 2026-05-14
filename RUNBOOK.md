# DSTS Public Site Runbook

> **Project:** duongsaotoasang.com
> **Cloudflare Pages project:** `duongsaotoasang-com-v2`
> **Wrong project to avoid:** `duongsaotoasang-web`
> **Repo:** `tranhatam-collab/duongsaotoasang-web`
> **Branch:** `main`
> **Last updated:** 2026-05-14

This runbook covers the public website, static content, Cloudflare Pages deploys, API/content fallback, SEO smoke, and incident response.

It does not cover these separate owner lanes:

- email automation
- payment/pay implementation
- registration/login/auth

Those lanes must not be changed from this runbook.

---

## 1. Current Operating Status

Repo-side Sprint 0 status:

```text
ROUTE/API/CONTENT/SEO: DONE
CONTENT INDEX REDIRECT: DONE
PRODUCTION HEADER/CACHE: BLOCKED_EXTERNAL
```

Known external blocker:

```text
duongsaotoasang.com custom-domain rules still override:
- Referrer-Policy -> same-origin
- static asset Cache-Control -> max-age=14400
```

Preview deploys apply repo `_headers` correctly. Fix the remaining blocker in Cloudflare zone/custom-domain cache/header rules, not in app code.

Reference report:

```text
docs/STATE_REPORT_2026-05-14.md
```

---

## 2. Owner Matrix

| Area | Primary Owner | Backup | Notes |
|---|---|---|---|
| Founder approval | Trần Hà Tâm | Founder delegate | Final public launch and content gate |
| Repo code and deploy | Tech Lead / Codex | Founder | Static HTML, Functions, smoke tests |
| Cloudflare Pages project | Founder | Tech Lead | Always use `duongsaotoasang-com-v2` |
| Cloudflare zone rules | Founder / Cloudflare admin | Tech Lead | Needed for header/cache blocker |
| Content library | Content Writer | Founder | `data/posts.json`, `data/content.json`, inline fallback sync |
| Legal copy | Legal Advisor | Founder | Terms/privacy/refund/support |
| Child safety / NDNUM | CSO + Founder | Legal Advisor | No direct child contact flow |
| Email automation | Separate team | Separate team | Out of scope here |
| Payment/pay | Separate team | Separate team | Out of scope here |
| Auth/login/register | Separate team | Separate team | Out of scope here |

---

## 3. Severity Levels

| Severity | Definition | Examples | Response |
|---|---|---|---|
| SEV-0 | Site unusable or wrong project live | Homepage black, all routes 404, deploy to `duongsaotoasang-web` | Stop feature work, restore last good deploy |
| SEV-1 | Core route broken | `/posts`, `/content?slug=...`, `/about`, `/contact`, `/donate`, `/transparency` fail | Fix forward or rollback within 30 minutes |
| SEV-2 | Trust or SEO regression | canonical wrong, sitemap missing, sample reviews unlabeled, noindex route indexed | Fix same day |
| SEV-3 | Cosmetic/content typo | small wording issue, layout polish | Batch into next content pass |

---

## 4. Pre-Deploy Checklist

Run from repo root:

```bash
git status --short --untracked-files=all
git log --oneline -5
node --check functions/_middleware.js
node --check functions/api/content.js
node --check functions/api/contents.js
node --check functions/api/search.js
node scripts/content-qa.mjs
git diff --check
```

Rules:

- Do not stage `.DS_Store`, `.wrangler/`, `.claude/`, duplicate Finder files, or local artifacts.
- Do not edit email automation, payment/pay, or auth/login/register flows in this lane.
- Do not deploy if tracked files are dirty and uncommitted.
- Do not deploy to `duongsaotoasang-web`.

---

## 5. Deploy Procedure

Use the clean deploy script. It deploys exactly `HEAD` from a git archive and rejects local junk.

```bash
PROJECT_NAME=duongsaotoasang-com-v2 BRANCH=main bash scripts/deploy-pages-clean.sh
```

Expected output includes:

```text
Project: duongsaotoasang-com-v2
Deployment complete! Take a peek over at https://<hash>.duongsaotoasang-com-v2.pages.dev
```

If Wrangler fails in sandbox because it cannot write logs or resolve Cloudflare API, rerun outside sandbox with approval.

---

## 6. Preview Verification

Replace `<preview>` with the URL returned by Wrangler:

```bash
BASE_URL=<preview> ./scripts/smoke-test.sh
BASE_URL=<preview> node scripts/seo-route-qa.mjs
```

Required output:

```text
PASSED: all smoke checks passed
PASS content-index-redirect  /content -> /posts
SEO_ROUTE_QA_PASS indexable=32 noindex=2 redirects=2
```

Spot-check manually:

```bash
curl -sS -I -L <preview>/content
curl -sS -I '<preview>/content?slug=sang-tao-khong-bat-dau-tu-tham-vong'
curl -sS -I -L <preview>/docs/STATE_REPORT_2026-05-14.md
```

Expected:

- `/content` redirects to `/posts`
- `/content?slug=...` returns `200`
- docs route returns `200`

---

## 7. Production Verification

Production route/API/SEO checks:

```bash
curl -sS -I -L https://duongsaotoasang.com/content
curl -sS -I 'https://duongsaotoasang.com/content?slug=sang-tao-khong-bat-dau-tu-tham-vong'
curl -sS -L 'https://duongsaotoasang.com/api/search?q=guardian&limit=3'
BASE_URL=https://duongsaotoasang.com node scripts/seo-route-qa.mjs
```

Expected:

- `/content` redirects to `/posts`
- valid content slug returns `200`
- API search returns metadata only, no full body fields
- SEO route QA passes

Full production smoke currently remains blocked by external Cloudflare custom-domain header/cache override. Do not treat that as a repo regression if preview headers pass and `docs/STATE_REPORT_2026-05-14.md` still matches current evidence.

---

## 8. Rollback Procedure

Use rollback only when a production-impacting regression is confirmed and fix-forward is not faster.

### Option A — Fix Forward

Use this for content, route, API, and SEO regressions that can be patched quickly.

```bash
git status --short
git pull --ff-only
# edit scoped files
node scripts/content-qa.mjs
git diff --check
git add <changed-files>
git commit -m "Fix <short issue>"
git push origin main
PROJECT_NAME=duongsaotoasang-com-v2 BRANCH=main bash scripts/deploy-pages-clean.sh
```

### Option B — Re-deploy A Known Good Commit

Use a detached checkout and do not force-push:

```bash
git fetch origin main
git switch --detach <known-good-commit>
PROJECT_NAME=duongsaotoasang-com-v2 BRANCH=main bash scripts/deploy-pages-clean.sh
git switch main
git pull --ff-only
```

After restoring service, open a follow-up fix-forward commit on `main`.

### Option C — Revert A Bad Commit

Use this when the bad commit is known and reverting it will not undo unrelated user work:

```bash
git revert <bad-commit> --no-edit
git push origin main
PROJECT_NAME=duongsaotoasang-com-v2 BRANCH=main bash scripts/deploy-pages-clean.sh
```

Never use `git reset --hard` for this repo unless Founder explicitly requests it.

---

## 9. Incident Response

### First 5 Minutes

1. Confirm exact URL and status:

```bash
curl -sS -I -L https://duongsaotoasang.com/
curl -sS -I -L https://duongsaotoasang.com/posts
curl -sS -I 'https://duongsaotoasang.com/content?slug=sang-tao-khong-bat-dau-tu-tham-vong'
```

2. Confirm latest deploy target:

```bash
git log --oneline -5
git status --short --untracked-files=all
```

3. If the problem is only custom-domain header/cache and preview passes, mark `BLOCKED_EXTERNAL`.

### First 30 Minutes

Run:

```bash
BASE_URL=https://duongsaotoasang.com node scripts/seo-route-qa.mjs
BASE_URL=<latest-preview> ./scripts/smoke-test.sh
```

Classify:

- `DONE`: preview and production route/API/SEO pass
- `BLOCKED_EXTERNAL`: preview pass, production fails only on zone header/cache
- `REGRESSION`: preview fails or route/API/content fails on production

### Incident Notes

Write incident notes under:

```text
docs/_artifacts/incident-YYYY-MM-DD-<slug>.md
```

Include:

- affected URLs
- first detection time
- commands run
- root cause
- fix commit
- deployment URL
- follow-up owner

---

## 10. Data And Content Safety

Content source files:

```text
data/posts.json
data/content.json
functions/_lib/content-data.js
functions/_lib/feed-utils.js
functions/_lib/public-routes.js
posts.html
content.html
sitemap.xml
rss.xml
```

After changing content, indexable public routes, sitemap, or RSS surfaces, run:

```bash
node scripts/sync-static-content-data.mjs
node scripts/content-qa.mjs
```

API safety rule:

- `/api/contents` and `/api/search` must not return full `content`, `content_vi`, `content_en`, `body`, `body_vi`, or `body_en` fields.
- `/api/content?slug=...` may return full body for a single requested slug.

Verify:

```bash
node scripts/api-surface-qa.mjs
```

---

## 11. External Cloudflare Header/Cache Fix

Current custom-domain blocker:

```text
referrer-policy: same-origin
cache-control: public, max-age=14400, must-revalidate
```

Expected:

```text
referrer-policy: strict-origin-when-cross-origin
cache-control: public, max-age=300, must-revalidate
```

Owner action in Cloudflare dashboard:

1. Open zone `duongsaotoasang.com`.
2. Inspect Cache Rules, Page Rules, Transform Rules, Browser Cache TTL, and managed security headers.
3. Remove or narrow any rule that overrides Pages `_headers`.
4. Keep HTML `max-age=0, must-revalidate`.
5. Keep `/assets/*`, `/app.css`, `/tokens.css`, `/og.png` max-age <= 300 until launch lock.
6. Re-run:

```bash
BASE_URL=https://duongsaotoasang.com ./scripts/smoke-test.sh
```

---

## 12. Post-Deploy Monitoring

Until external monitoring is approved, use manual checks after each deploy:

```bash
curl -sS -I -L https://duongsaotoasang.com/
curl -sS -I -L https://duongsaotoasang.com/posts
curl -sS -I -L https://duongsaotoasang.com/content
curl -sS -I -L https://duongsaotoasang.com/sitemap.xml
curl -sS -I -L https://duongsaotoasang.com/rss.xml
```

Future external tools require Founder approval and separate setup:

- uptime monitoring
- analytics
- error logging

Do not add third-party trackers without legal/privacy review.

---

## 13. Definition Of Done For Public-Site Changes

A public-site change is done only when:

- `git status --short --untracked-files=all` is reviewed
- scoped files are staged only
- `git diff --check` passes
- relevant Node syntax checks pass
- `node scripts/content-qa.mjs` passes
- preview deploy is on `duongsaotoasang-com-v2`
- preview smoke passes
- SEO route QA passes
- production spot checks pass
- known external blockers are reported separately, not hidden

If any step fails, do not call the work done.
