# DSTS Launch Readiness Implementation Plan

> **Required sub-skill:** Use `superpowers:executing-plans` to implement this plan task-by-task.

**Date locked:** 2026-06-15
**Target communication date:** 2026-06-16
**Repository:** `/Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com`
**Cloudflare Pages project:** `duongsaotoasang-com-v2`
**Cloudflare account:** `62d57eaa548617aeecac766e5a1cb98e`

## 1. Release Position

The public site may be promoted on 2026-06-16 only for capabilities proven by the gates in this plan.

Do not claim that registration, login, membership, donation, or payment is live until all required runtime proof exists. The current repository contains:

- registration code that stores raw passwords;
- login code that compares raw passwords and puts the user ID directly in a cookie;
- a fake `localStorage` application session;
- payment webhooks that can accept unsigned requests;
- no active `DB` binding in `wrangler.toml`;
- no certified production payment credential or completed transaction proof.

These are release blockers, not polish items.

## 2. Same-Day Scope

### Track A: Public UI, bilingual routes, SEO

This track can be completed in one focused day:

- standardize the 10 translated route pairs on `/en/`;
- fix `/map` and `/legacy/` routing;
- mount the shared EN header with static VI fallback;
- add canonical, hreflang, Open Graph, and Twitter metadata;
- remove GA4 and Sentry placeholders unless real IDs are supplied;
- remove dead `assets/i18n.js`;
- normalize the five missing public headers;
- run desktop and mobile browser checks.

### Track B: Registration and login

This track can only be released today if all implementation and infrastructure gates pass:

- secure password hashing with per-user salt;
- opaque server-side sessions;
- fixed public role assignment (`member`);
- registration and login UI wired to real APIs;
- D1 migration and `DB` binding;
- rate limiting and generic auth errors;
- browser proof for register, login, refresh, logout, and expired session.

### Track C: Real payment

This track can only be released today if all external prerequisites are available:

- valid production `pay.iai.one` API key for tenant `dsts`, site `duongsaotoasang`;
- production webhook HMAC registered on both systems;
- D1 binding and payment migrations;
- all payment, point, subscription, and donation webhooks fail closed;
- idempotency and unknown-order guards;
- one authorized low-value production transaction and webhook proof;
- receipt/audit proof and refund/cancellation procedure.

No agent may manufacture credentials, delete a Cloudflare database, or perform a financial transaction without Founder authorization.

## 3. Git Isolation

Do not implement on the dirty `main` worktree. Use:

```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
git worktree add /tmp/dsts-launch-20260615 -b OMCODE/dsts-launch-2026-06-15 73f4e69
cd /tmp/dsts-launch-20260615
```

All implementation commits must stay on `OMCODE/dsts-launch-2026-06-15` until the final review.

## 4. Task 0: Baseline and Fail-Closed Gate

**Files**

- Create: `scripts/launch-readiness-qa.mjs`
- Modify: `scripts/sprint-0-release-gate.mjs`

**Implementation**

1. Add static checks for bilingual routes, auth, payment webhooks, D1 binding, and public placeholders.
2. Wire the new gate into `scripts/sprint-0-release-gate.mjs`.
3. Confirm the gate fails on the current insecure baseline.

**Commands**

```bash
node --check scripts/launch-readiness-qa.mjs
node scripts/launch-readiness-qa.mjs
```

Expected before fixes: `DSTS_LAUNCH_READINESS_FAIL`.

## 5. Task 1: Bilingual Route and Navigation Lock

**Files**

- Modify: `assets/app-v5.js`
- Modify: `_redirects`
- Modify: `index.html`
- Modify: `about.html`
- Modify: `contact.html`
- Modify: `donate.html`
- Modify: `map.html`
- Modify: `legacy/index.html`
- Modify: `register/index.html`
- Modify: `sponsor/index.html`
- Modify: `trust/index.html`
- Modify: `verify/index.html`
- Modify: `en/index.html`
- Modify: `en/about.html`
- Modify: `en/contact.html`
- Modify: `en/donate.html`
- Modify: `en/map.html`
- Modify: `en/legacy.html`
- Modify: `en/register.html`
- Modify: `en/sponsor.html`
- Modify: `en/trust.html`
- Modify: `en/verify.html`

**Implementation**

1. Make `getLang()` recognize `/en` and `/en/*`.
2. Replace query-string language routing with an explicit 10-pair route map.
3. Keep untranslated pages on VI routes; do not create fake EN alternates.
4. Rewrite `/map` to `map.html` with status `200`.
5. Keep `/legacy` mapped to `legacy/index.html`; canonical stays `/legacy/`.
6. Remove duplicate EN hreflang from `verify/index.html`.
7. Add self-referencing `vi`, `en`, and `x-default` hreflang only to real pairs.
8. Mount `siteHeader` and `/assets/app-v5.js` on every EN page.
9. Keep a static VI return link in every EN document.

**Tests**

```bash
node scripts/launch-readiness-qa.mjs
node scripts/html-structure-qa.mjs
node scripts/accessibility-qa.mjs
node scripts/link-qa.mjs
node scripts/seo-route-qa.mjs
```

## 6. Task 2: Public Metadata and Shared Header

**Files**

- Modify: `index.html`
- Delete or consolidate: `assets/i18n.js`
- Modify: `en/*.html`
- Modify: `map.html`
- Modify: `mentor-network.html`
- Modify: `dream-nurture.html`
- Modify: `refund.html`
- Modify: `legacy/index.html`

**Implementation**

1. Remove `G-XXXXXXXXXX` unless a real GA4 Measurement ID is supplied.
2. Remove the placeholder Sentry DSN unless a real DSN is supplied.
3. Add OG and Twitter metadata to all 10 EN pages and `map.html`.
4. Add the shared header host and script where missing.
5. Preserve existing public content and legal disclosures.

**Tests**

```bash
node scripts/social-metadata-qa.mjs
node scripts/structured-data-qa.mjs
node scripts/launch-readiness-qa.mjs
```

## 7. Task 3: Secure Auth Data Model

**Files**

- Create: `migrations/0022_auth_sessions.sql`
- Create: `functions/_lib/auth.js`
- Modify: `functions/api/auth/register.js`
- Modify: `functions/api/auth/login.js`
- Create: `functions/api/auth/me.js`
- Create: `functions/api/auth/logout.js`
- Create: `scripts/auth-behavior-qa.mjs`

**Migration requirements**

- add `password_salt`, `password_iterations`, and password algorithm metadata;
- add `sessions` with hashed token, user ID, expiry, created time, revoked time;
- add auth attempt/rate-limit storage;
- never store a raw password or raw session token.

**Implementation requirements**

1. Normalize email with trim and lowercase.
2. Hash passwords using Web Crypto PBKDF2-SHA-256 with a random salt and at least 310,000 iterations.
3. Compare hashes with constant-time byte comparison.
4. Public registration always creates role `member`; ignore client role escalation.
5. Generate a random 32-byte session token.
6. Store only the session token hash in D1.
7. Cookie must be opaque, `HttpOnly`, `Secure`, `SameSite=Lax`, scoped to `/`, and expire server-side.
8. Add rate limiting and generic invalid-credential errors.
9. Fail closed when `DB` is unavailable.

**Behavior tests**

- registration stores no raw password;
- duplicate normalized email returns `409`;
- client cannot self-assign creator, mentor, sponsor, or admin;
- valid login creates opaque session;
- invalid login creates no session;
- `/api/auth/me` reads the session;
- logout revokes the session;
- expired/revoked session is rejected.

**Commands**

```bash
node --check functions/_lib/auth.js
node --check functions/api/auth/register.js
node --check functions/api/auth/login.js
node --check functions/api/auth/me.js
node --check functions/api/auth/logout.js
node scripts/auth-behavior-qa.mjs
```

## 8. Task 4: Registration and Login UI

**Files**

- Modify: `register/index.html`
- Modify: `en/register.html`
- Create: `login/index.html`
- Create: `en/login.html`
- Modify: `_redirects`
- Modify: `app/app.js`

**Implementation**

1. Wire registration to `/api/auth/register`.
2. Remove public role assignment; collect interest separately if needed.
3. Add accessible validation, loading, success, duplicate, rate-limit, and server-error states.
4. Add login UI wired to `/api/auth/login`.
5. Replace fake `localStorage` auth with `/api/auth/me`.
6. Add logout through `/api/auth/logout`.
7. Do not store tokens, passwords, or user PII in local storage.

**Tests**

```bash
node scripts/auth-behavior-qa.mjs
node scripts/accessibility-qa.mjs
node scripts/html-structure-qa.mjs
node scripts/launch-readiness-qa.mjs
```

## 9. Task 5: Payment Webhook Security

**Files**

- Create: `functions/_lib/payment-webhook.js`
- Modify or retire: `functions/webhooks/payment.js`
- Create: `functions/api/payment/webhook.js`
- Modify: `functions/api/points/webhook.js`
- Modify: `functions/api/clubs/subscription/webhook.js`
- Verify: `functions/api/donate/webhook.js`
- Create: `scripts/payment-webhook-behavior-qa.mjs`

**Implementation**

1. Require a configured HMAC secret; missing secret returns `503 WEBHOOK_NOT_CONFIGURED`.
2. Missing signature returns `401 SIGNATURE_REQUIRED`.
3. Invalid signature returns `401 SIGNATURE_INVALID`.
4. Allow only known event types and status transitions.
5. Reject or ignore unknown payment/order/subscription IDs without side effects.
6. Persist unique event IDs before mutation.
7. Make replay idempotent.
8. Never credit points, activate subscriptions, or mark payments complete from unsigned input.
9. Keep a canonical webhook route and redirect/remove the insecure duplicate.

**Behavior tests**

- unsigned, invalid, unknown ID, replay, valid completion, failed payment, refund;
- no audit mutation for unknown IDs;
- no duplicate credit or activation;
- missing HMAC fails closed.

**Commands**

```bash
node scripts/donate-webhook-behavior-qa.mjs
node scripts/payment-webhook-behavior-qa.mjs
node scripts/launch-readiness-qa.mjs
```

## 10. Task 6: D1 and Production Secrets

**Required Founder/DevOps inputs**

- one available D1 database slot in account `62d57eaa548617aeecac766e5a1cb98e`, or an approved existing D1 database;
- valid production `PAY_IAI_ONE_API_KEY`;
- `PAY_DSTS_HMAC` registered in both DSTS and pay.iai.one;
- cache purge token with `Zone / Cache Purge / Edit`;
- optional real GA4 ID and Sentry DSN.

**Files**

- Modify: `wrangler.toml`
- Update: `docs/IDS_LOCKED_FINAL_2026.md` only with verified IDs

**Commands after a database is approved**

```bash
cd /tmp/dsts-launch-20260615
npx wrangler d1 migrations apply cf-d1-dsts-content-prod --remote --config wrangler.toml
npx wrangler pages secret put PAY_IAI_ONE_API_KEY --project-name duongsaotoasang-com-v2
npx wrangler pages secret put PAY_DSTS_HMAC --project-name duongsaotoasang-com-v2
```

Do not run migrations until `wrangler.toml` points at the verified database ID.

## 11. Task 7: Preview Deploy and Browser QA

**Commands**

```bash
cd /tmp/dsts-launch-20260615
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e npx wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch OMCODE-dsts-launch-2026-06-15 --commit-dirty=true
```

Run:

```bash
PREVIEW_URL=https://REPLACE_WITH_DEPLOYMENT_URL RUN_FULL_SMOKE=1 node scripts/sprint-0-release-gate.mjs
```

Browser evidence is mandatory at 360, 768, and 1280 pixels:

- VI and EN hamburger;
- VI to EN to VI route preservation;
- register, login, refresh, logout;
- no console error;
- keyboard focus and basic axe audit;
- payment CTA does not open unless gateway and DB are configured.

## 12. Task 8: Authorized Payment Proof

This task requires Founder approval because it creates a real financial transaction.

1. Create a low-value VND checkout using the production UI.
2. Verify the pending payment row.
3. Complete payment.
4. Verify a signed webhook changed the exact payment to completed.
5. Verify replay causes no duplicate effect.
6. Verify receipt/audit data.
7. Test refund or document the manual refund procedure.

No screenshots may expose API keys, HMAC values, personal data, or full payment identifiers.

## 13. Task 9: Production Release

Only merge when:

```bash
node scripts/launch-readiness-qa.mjs
RUN_FULL_SMOKE=1 node scripts/sprint-0-release-gate.mjs
```

both pass, preview browser evidence is complete, and the authorized payment proof is signed off.

Production deploy:

```bash
cd /tmp/dsts-launch-20260615
git push -u origin OMCODE/dsts-launch-2026-06-15
```

Merge only after review, then:

```bash
CLOUDFLARE_ACCOUNT_ID=62d57eaa548617aeecac766e5a1cb98e npx wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch main --commit-dirty=false
```

## 14. Communication Gate for 2026-06-16

Allowed claim if Track A passes:

> DSTS has launched its renewed public information platform with Vietnamese and English navigation.

Allowed claim for registration/payment only if Tracks B and C pass:

> Account registration and production VND payment are live and have passed end-to-end verification.

If Tracks B or C do not pass, registration and payment remain visibly closed. Do not replace evidence with “coming soon” claims that imply availability.
