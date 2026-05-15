# EMAIL_AUTOMATION_EXECUTION_STATUS_2026-05-15

## Scope completed in this repo (duongsaotoasang.com)

### 1) Payment → Email automation (DONE in code)
- Added donation receipt sender in `functions/_lib/email.js`
  - Provider priority: `MAIL_API_KEY` (`mail.iai.one`) first, `RESEND_API_KEY` fallback
  - Added template `sendDonationReceipt(...)`
- Wired donation webhook to trigger receipt send in `functions/api/donate/webhook.js`
  - On `payment.completed` or `order.paid`:
    1. update `donations.status=completed`
    2. send donation receipt email to `donor_email`
    3. mark `donation_webhook_log.processed=1`
    4. insert dispatch result into `donation_email_dispatches`

### 2) Evidence table for email dispatch (DONE in code)
- Added migration: `migrations/0006_donation_email_dispatches.sql`
- Table fields: provider, provider_message_id, status, response_json (for delivery audit)

### 3) Runtime contract declaration (DONE in config)
- Updated `wrangler.toml` required secrets comments:
  - `MAIL_API_KEY`
  - `MAIL_API_WORKSPACE_ID`

---

## Current verification

### PASS
- `node scripts/payment-legal-alignment-qa.mjs` → `PAYMENT_LEGAL_ALIGNMENT_QA_PASS`
- `node scripts/public-flow-safety-qa.mjs` → `PUBLIC_FLOW_SAFETY_QA_PASS`

### Existing FAIL (not introduced by this patch)
- `bash scripts/smoke-test.sh` fails at `HEADERS_QA_FAIL` against live host headers/cache:
  - `referrer-policy` mismatch
  - static cache max-age too high
  - `/assets/app.js` returns 200 (expected 404)

These are live edge/header/caching issues, separate from donation-email code path.

---

## Owner handoff (what still needs external execution)

### Team Pay / DevOps (Cloudflare)
1. Apply new migration:
```bash
wrangler d1 migrations apply cf-d1-dsts-content-prod --remote --config wrangler.toml
```
2. Ensure required secrets on Pages project `duongsaotoasang-com-v2`:
```bash
wrangler pages secret put PAY_IAI_ONE_API_KEY --project-name duongsaotoasang-com-v2
wrangler pages secret put PAY_DSTS_HMAC --project-name duongsaotoasang-com-v2
wrangler pages secret put MAIL_API_KEY --project-name duongsaotoasang-com-v2
wrangler pages secret put MAIL_API_WORKSPACE_ID --project-name duongsaotoasang-com-v2
```

### QA (payment email live proof)
Run one signed payment webhook flow and capture:
1. `donations` row with `status=completed`
2. `donation_email_dispatches` latest row with:
   - `status=sent`
   - `provider_message_id` non-null
3. inbox screenshot of recipient email

Pass condition:
- payment webhook accepted
- dispatch table has `status=sent`
- inbox proof exists for same donation/event id

---

## Domain/team status after this patch

- `duongsaotoasang.com` (Email lane): **CODE READY**
  - Auto receipt logic and audit logging are implemented.
  - Waiting on live secrets + migration + proof run.
- Other domains (`tranhatam.com`, `nguyenlananh.com`, `aiaccountingloop.com`, `tramsaigon.com`, `iaifoundation.com`):
  - No direct code changes in this repo for those domains.
  - Their blockers remain in owner lanes (Cloudflare secrets, DNS scope, inbox proof).
