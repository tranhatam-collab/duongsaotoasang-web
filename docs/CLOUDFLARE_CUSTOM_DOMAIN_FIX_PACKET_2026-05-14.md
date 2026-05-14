# DSTS Cloudflare Custom-Domain Fix Packet 2026-05-14

> **Scope:** unblock production header/cache verification for `duongsaotoasang.com`.
> **Pages project:** `duongsaotoasang-com-v2`
> **Wrong project to avoid:** `duongsaotoasang-web`
> **Status:** `BLOCKED_EXTERNAL` until a Cloudflare zone admin fixes cache/header rules and purges stale cache.

---

## 1. Current Verdict

Repo and preview are healthy. Production custom domain still has Cloudflare zone-level overrides.

```text
PREVIEW:    PASS
PRODUCTION: FAIL custom-domain cache/header rules
```

Verified preview:

```bash
BASE_URL=https://75c56375.duongsaotoasang-com-v2.pages.dev node scripts/headers-qa.mjs
```

Expected and observed:

```text
HEADERS_QA_PASS base=https://75c56375.duongsaotoasang-com-v2.pages.dev checks=8
```

Verified production:

```bash
BASE_URL=https://duongsaotoasang.com node scripts/headers-qa.mjs
```

Observed:

```text
HEADERS_QA_FAIL
- root-html / header referrer-policy expected strict-origin-when-cross-origin, got same-origin
- root-css /app.css max-age must be <= 300, got 14400
- tokens-css /tokens.css max-age must be <= 300, got 14400
- asset-js /assets/app-v5.js max-age must be <= 300, got 14400
- retired-app-js /assets/app.js expected 404, got 200
- og-image /og.png max-age must be <= 300, got 14400
```

---

## 2. Confirmed Cloudflare Project Identity

Wrangler account access confirmed that the custom domain belongs to the correct Pages project:

```text
Project Name: duongsaotoasang-com-v2
Project Domains: duongsaotoasang-com-v2.pages.dev, duongsaotoasang.com, www.duongsaotoasang.com
Last Modified: current deploy window
```

The similar project below is not the production target:

```text
duongsaotoasang-web
Domain: duongsaotoasang-web.pages.dev only
```

---

## 3. Why This Is Not A Repo Regression

Repo `_headers` expects stricter values:

```text
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: public, max-age=300, must-revalidate
```

Preview applies those values. Production does not.

The retired legacy file proves the issue is custom-domain cache, not deploy source:

```bash
curl -sS -I -L https://75c56375.duongsaotoasang-com-v2.pages.dev/assets/app.js
curl -sS -I -L https://duongsaotoasang.com/assets/app.js
```

Expected preview:

```text
HTTP/2 404
cache-control: no-store
```

Observed production:

```text
HTTP/2 200
cache-control: public, max-age=31536000, immutable
cf-cache-status: HIT
```

That file no longer exists in git or the deploy bundle. It is stale Cloudflare cache.

---

## 4. Required Cloudflare Admin Actions

Open the Cloudflare zone for:

```text
duongsaotoasang.com
```

Inspect these areas:

- Cache Rules
- Page Rules
- Transform Rules / Response Header Rules
- Browser Cache TTL
- Managed security headers
- Any rule matching `duongsaotoasang.com/*`, `/assets/*`, `/app.css`, `/tokens.css`, `/og.png`

Apply these target settings:

| Path | Required behavior |
|---|---|
| `/` and HTML pages | respect Pages `_headers`; no long browser cache |
| `/app.css` | `Cache-Control: public, max-age=300, must-revalidate` |
| `/tokens.css` | `Cache-Control: public, max-age=300, must-revalidate` |
| `/assets/app-v5.js` | `Cache-Control: public, max-age=300, must-revalidate` |
| `/og.png` | `Cache-Control: public, max-age=300, must-revalidate` |
| `/assets/app.js` | purge stale file; should return `404` + `no-store` |
| all routes | `Referrer-Policy: strict-origin-when-cross-origin` |

Do not create a new Pages project. Do not move the custom domain.

---

## 5. Purge URLs

Purge these exact URLs:

```text
https://duongsaotoasang.com/assets/app.js
https://duongsaotoasang.com/assets/app-v5.js
https://duongsaotoasang.com/app.css
https://duongsaotoasang.com/tokens.css
https://duongsaotoasang.com/og.png
https://duongsaotoasang.com/
```

If the dashboard offers a broad purge and traffic is low, a full custom-domain purge is acceptable.

---

## 6. API Option For Zone Admin

Only run this with a real zone-scoped token that has cache purge permission. Do not commit the token.

```bash
export CF_ZONE_ID="REPLACE_WITH_ZONE_ID"
export CF_API_TOKEN="REPLACE_WITH_ZONE_CACHE_PURGE_TOKEN"

curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://duongsaotoasang.com/assets/app.js",
      "https://duongsaotoasang.com/assets/app-v5.js",
      "https://duongsaotoasang.com/app.css",
      "https://duongsaotoasang.com/tokens.css",
      "https://duongsaotoasang.com/og.png",
      "https://duongsaotoasang.com/"
    ]
  }'
```

This workspace currently has no `CF_API_TOKEN` or `CF_ZONE_ID` environment variable available, so Codex cannot safely run the purge from the repo session.

---

## 7. Post-Fix Verification

Run:

```bash
BASE_URL=https://duongsaotoasang.com node scripts/headers-qa.mjs
BASE_URL=https://duongsaotoasang.com node scripts/seo-route-qa.mjs
BASE_URL=https://duongsaotoasang.com ./scripts/smoke-test.sh
curl -sS -I -L https://duongsaotoasang.com/assets/app.js
```

Required:

```text
HEADERS_QA_PASS base=https://duongsaotoasang.com checks=8
SEO_ROUTE_QA_PASS indexable=32 noindex=2 redirects=2
PASSED: all smoke checks passed
HTTP/2 404
```

After those pass, update `docs/STATE_REPORT_2026-05-14.md` from:

```text
PRODUCTION HEADER/CACHE: BLOCKED_EXTERNAL
```

to:

```text
PRODUCTION HEADER/CACHE: DONE
FULL PRODUCTION SMOKE: DONE
```
