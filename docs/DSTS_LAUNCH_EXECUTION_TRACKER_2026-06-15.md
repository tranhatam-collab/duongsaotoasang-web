# DSTS Launch Execution Tracker

**Date:** 2026-06-15
**Target:** Communication on 2026-06-16
**Implementation branch:** `OMCODE/dsts-launch-2026-06-15`
**Plan:** `docs/superpowers/plans/2026-06-15-dsts-launch-readiness.md`

## Current Verdict

`IN_PROGRESS — PUBLIC UI CAN PROCEED; REGISTRATION AND PAYMENT ARE BLOCKED`

The current production site remains live. This tracker does not certify registration or payment.

## Workstream Status

| ID | Workstream | Status | Evidence / blocker |
|---|---|---|---|
| L0 | Final audit and implementation plan | DONE | Plan and fail-closed launch gate added |
| L1 | `/en/` route, canonical, hreflang, switcher | PENDING | `getLang()` still query-only; `/map` still 301 |
| L2 | EN header and metadata | PENDING | 10 EN pages missing shared header; 9 missing social metadata |
| L3 | Public header and analytics cleanup | PENDING | GA4/Sentry placeholders; five header gaps |
| L4 | Secure auth backend | BLOCKED | Raw password storage, raw comparison, weak session cookie |
| L5 | Registration/login UI | BLOCKED | Register is intentionally closed; login page absent |
| L6 | Payment webhook security | BLOCKED | Unsigned mutation path and fail-open HMAC paths exist |
| L7 | D1 and secrets | BLOCKED_EXTERNAL | No verified `DB` binding; account database capacity requires DevOps decision |
| L8 | Preview deploy and browser QA | PENDING | Starts after L1-L7 code gates |
| L9 | Authorized production payment proof | BLOCKED_FOUNDER | Requires valid production credential and authorized real transaction |
| L10 | Production release | PENDING | Requires launch gate, preview QA, runtime proof |

## Non-Negotiable Gates

- [ ] `node scripts/launch-readiness-qa.mjs` passes.
- [ ] `RUN_FULL_SMOKE=1 node scripts/sprint-0-release-gate.mjs` passes on preview.
- [ ] Passwords are salted and hashed; no plaintext reaches D1.
- [ ] Sessions are opaque and server-side; no auth token in local storage.
- [ ] All payment-related webhooks fail closed when HMAC is missing.
- [ ] Unknown payment IDs create no state change.
- [ ] D1 binding and migrations are verified against the intended database.
- [ ] Production API key is verified against the canonical pay.iai.one contract.
- [ ] One authorized real payment completes through a signed webhook.
- [ ] Mobile/desktop browser evidence exists for VI, EN, register, login, and checkout.

## Founder / DevOps Inputs

| Input | Status | Required action |
|---|---|---|
| D1 database capacity / approved database ID | MISSING | Free one slot or provide an approved D1 database |
| Production pay.iai.one API key | UNVERIFIED | Issue/verify key for `dsts` + `duongsaotoasang` |
| Payment HMAC registration | UNVERIFIED | Register the same secret in pay.iai.one and Cloudflare |
| Cache purge permission | INCOMPLETE | Token needs `Zone / Cache Purge / Edit` |
| GA4 Measurement ID | OPTIONAL | Supply real ID or remove GA4 block |
| Sentry DSN | OPTIONAL | Supply real DSN or remove Sentry block |
| Real payment authorization | MISSING | Approve a low-value VND proof transaction |

## Automation Rule

Every automated run must:

1. Work only in `/tmp/dsts-launch-20260615`.
2. Read this tracker and the locked plan.
3. Select the highest-priority `PENDING` item that is not externally blocked.
4. Implement one bounded task.
5. Run its focused tests and `node scripts/launch-readiness-qa.mjs`.
6. Commit only intentional files.
7. Update this tracker with command evidence.
8. Stop and report `BLOCKED` instead of fabricating credentials, infrastructure, legal approval, or payment proof.
