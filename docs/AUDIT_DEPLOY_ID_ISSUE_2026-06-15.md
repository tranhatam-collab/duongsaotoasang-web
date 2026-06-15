# DSTS Deploy ID Audit and Fix

**Date:** 2026-06-15
**Status:** VERIFIED AND FIXED REPO-SIDE

## Locked Deployment Target

| Item | Verified value |
|---|---|
| Cloudflare account | `62d57eaa548617aeecac766e5a1cb98e` |
| Pages project name | `duongsaotoasang-com-v2` |
| Pages project internal ID | `51a9959e-de12-459e-b169-ac57e58610bd` |
| Default Pages domain | `duongsaotoasang-com-v2-dd2.pages.dev` |
| Custom domain | `duongsaotoasang.com` |
| WWW domain | `www.duongsaotoasang.com` |
| Production branch | `main` |
| Git repository | `tranhatam-collab/duongsaotoasang-web` |

## Live Cloudflare Evidence

Command:

```bash
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e npx wrangler pages project list
```

Verified result:

- project `duongsaotoasang-com-v2` exists in the locked account;
- project domains include `duongsaotoasang-com-v2-dd2.pages.dev`;
- custom domains include `duongsaotoasang.com` and `www.duongsaotoasang.com`;
- Git provider is `No`, so direct upload through Wrangler/GitHub Actions is expected.

Production deployment state was verified with:

```bash
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e \
  npx wrangler pages deployment list \
  --project-name duongsaotoasang-com-v2 \
  --environment production \
  --json
```

Baseline deployment before this fix:

- deployment ID: `cf0905e7-ea62-447a-bd69-eb59698457f5`;
- deployment URL: `https://cf0905e7.duongsaotoasang-com-v2-dd2.pages.dev`;
- branch: `main`;
- environment: `Production`.

## Post-Fix Production Deployment

Repo fix commit:

```text
3d93f24 fix: lock Cloudflare Pages deploy target
```

Clean production deploy:

```text
deployment ID: 4b10a601-a71f-4cbf-a551-0c004330acb0
source commit: 3d93f24
branch: main
environment: Production
URL: https://4b10a601.duongsaotoasang-com-v2-dd2.pages.dev
```

Route verification on both the deployment URL and custom domain:

| Route | Deployment URL | Custom domain |
|---|---:|---:|
| `/` | 200 | 200 |
| `/about` | 200 | 200 |
| `/register` | 308 to canonical route | 308 to canonical route |
| `/en/` | 200 | 200 |
| `/map` | 308 to canonical route | 308 to canonical route |
| `/legacy/` | 200 | 200 |

The deploy itself is healthy. Separate application APIs that require D1 remain
unavailable until an approved DSTS database is created and bound. This is a
known runtime dependency, not a Pages project-ID failure.

Both `https://duongsaotoasang.com/` and
`https://duongsaotoasang-com-v2-dd2.pages.dev/` return HTTP `200` with the
same page title. The body difference is Cloudflare email-address obfuscation
injected on the custom domain, not a different deployment.

## Actual Problems Found

### 1. Invalid D1 binding in `wrangler.toml`

The repository referenced:

```toml
database_name = "dsts-db"
database_id = "d1b1df1d-cb0b-4643-83ec-979acc803cae"
```

Live `wrangler d1 list` confirms this database does not exist in the locked
account. The account currently contains ten other databases and no DSTS
database.

**Fix:** remove the invalid binding until an approved DSTS database exists.

### 2. Invalid R2 binding in `wrangler.toml`

The repository referenced bucket `dsts-legacy-media`.

Live `wrangler r2 bucket list` confirms that bucket does not exist.

**Fix:** remove the invalid binding until the bucket is created and verified.

### 3. GitHub Actions was present but the audit claimed it was absent

The repository contains `.github/workflows/deploy-v3.yml`.

The previous audit statement “No GitHub Actions deploy config found” was
incorrect.

### 4. Workflow tested the wrong Pages hostname

The workflow used:

```text
https://duongsaotoasang-com-v2.pages.dev
```

The locked project hostname is:

```text
https://duongsaotoasang-com-v2-dd2.pages.dev
```

**Fix:** update the smoke-test base URL.

### 5. Workflow used the old Pages action

The workflow used `cloudflare/pages-action@v1`.

**Fix:** use `cloudflare/wrangler-action@v3` and an explicit command:

```text
pages deploy . --project-name=duongsaotoasang-com-v2 --branch=main
```

## Canonical Deploy Command

Deploy committed source only:

```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e \
  PROJECT_NAME=duongsaotoasang-com-v2 \
  BRANCH=main \
  bash scripts/deploy-pages-clean.sh
```

Do not deploy to `duongsaotoasang-web`. Do not use a Pages URL without the
locked `-dd2` suffix when validating the default project domain.

## Final Verdict

The reported “wrong project with no custom domain” diagnosis is not supported
by live Cloudflare evidence. The Pages target is correct. The real repo-side
deploy risks were invalid D1/R2 bindings and a stale GitHub Actions workflow;
those are the items fixed by this change.
