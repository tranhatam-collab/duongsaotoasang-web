# DSTS Donation Go-Live Operations Playbook 2026-05-15

> Scope: production payment/email proof for `duongsaotoasang.com`.
> Project: `duongsaotoasang-com-v2`.
> Rule: do not run this playbook until `git status -sb` shows `## main...origin/main`.

## 0. Preflight

Run from the repo root:

```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
git status -sb
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Expected:

```text
## main...origin/main
<same HEAD and origin/main hash>
```

If the branch is dirty, ahead, or behind, stop and reconcile git first.

## 1. Enter Secrets Once

```bash
bash scripts/dsts-secrets-setup.sh
```

Enter:

- Cloudflare Zone ID.
- Cloudflare cache-purge token.
- Cloudflare Wrangler/deploy token.
- `PAY_IAI_ONE_API_KEY`.
- Optional `MAIL_API_KEY`.
- Optional `MAIL_API_WORKSPACE_ID`.

The script auto-generates:

- `PAY_DSTS_HMAC`.
- `POLL_TOKEN`.

When prompted `Push secrets lên Cloudflare Pages?`, answer `n`.
The next script pushes secrets in the correct sequence and redeploys.

## 2. Migrate, Push Secrets, Redeploy, Smoke

Load local secret files into the current terminal:

```bash
export PAY_IAI_ONE_API_KEY="$(cat ~/.dsts-secrets/pay-iai-one-api-key)"
export PAY_DSTS_HMAC="$(cat ~/.dsts-secrets/pay-dsts-hmac)"
export MAIL_API_KEY="$(cat ~/.dsts-secrets/mail-api-key 2>/dev/null || true)"
export MAIL_API_WORKSPACE_ID="$(cat ~/.dsts-secrets/mail-workspace-id 2>/dev/null || true)"
export POLL_TOKEN="$(cat ~/.dsts-secrets/poll-token)"
export CLOUDFLARE_API_TOKEN="$(cat ~/.dsts-secrets/wrangler-api-token)"
```

Run:

```bash
bash scripts/pay-owner-go-live.sh
```

Expected sequence:

1. Apply D1 migrations to `cf-d1-dsts-content-prod`.
2. Push `PAY_IAI_ONE_API_KEY`, `PAY_DSTS_HMAC`, optional mail secrets, and `POLL_TOKEN`.
3. Redeploy `duongsaotoasang-com-v2`.
4. Wait for custom domain attachment.
5. Smoke `POST /api/donate/create`.

Expected final result:

```text
[PASS] donate/create returned 200
```

If status is `503`, wait 30 seconds and retry the create smoke. If it remains `503`, the deployment probably does not have the new secrets bound.

## 3. Signed Webhook Proof

This is a controlled production proof. It manually simulates a completed payment event for the QA donation ID. Do not run it against a real donor transaction unless the payment owner has confirmed the transaction.

```bash
DONATION_ID="$(curl -sS -X POST https://duongsaotoasang.com/api/donate/create \
  -H 'content-type: application/json' \
  -H "x-idempotency-key: qa-$(date +%s)" \
  -d '{"amount_vnd":10000,"donor_name":"QA","donor_email":"qa@duongsaotoasang.com"}' \
  | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)"
echo "Donation ID: $DONATION_ID"

PAYLOAD="{\"event_type\":\"payment.completed\",\"event_id\":\"qa_$(date +%s)\",\"order_id\":\"$DONATION_ID\"}"
SIG="$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$PAY_DSTS_HMAC" -hex | awk '{print $2}')"

curl -sS -X POST https://duongsaotoasang.com/api/donate/webhook \
  -H 'content-type: application/json' \
  -H "x-iai-signature: $SIG" \
  -d "$PAYLOAD"
```

Expected:

```json
{"ok":true}
```

Verify the audit row:

```bash
wrangler d1 execute cf-d1-dsts-content-prod --remote \
  --command "SELECT donation_id, status, provider_message_id FROM donation_email_dispatches WHERE donation_id = '$DONATION_ID'"
```

Expected:

- With `MAIL_API_KEY`: `status=sent` and `provider_message_id` is not null.
- Without a mail provider: `status=skipped_no_provider`.

The `skipped_no_provider` result is acceptable for code behavior but not acceptable for full email-delivery proof. Full delivery proof requires a real provider message ID and inbox screenshot.

## 4. Negative-Path Proof

Unsigned webhook must fail closed:

```bash
curl -sS -o - -w '\nHTTP_STATUS:%{http_code}\n' \
  -X POST https://duongsaotoasang.com/api/donate/webhook \
  -H 'content-type: application/json' \
  -d '{"event_type":"payment.completed","order_id":"don_x"}'
```

Expected:

```text
HTTP_STATUS:401
SIGNATURE_REQUIRED
```

Signed unknown donation must not create an email dispatch row:

```bash
PAYLOAD='{"event_type":"payment.completed","event_id":"neg_unknown","order_id":"don_does_not_exist"}'
SIG="$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$PAY_DSTS_HMAC" -hex | awk '{print $2}')"

curl -sS -X POST https://duongsaotoasang.com/api/donate/webhook \
  -H 'content-type: application/json' \
  -H "x-iai-signature: $SIG" \
  -d "$PAYLOAD"

wrangler d1 execute cf-d1-dsts-content-prod --remote \
  --command "SELECT COUNT(*) AS rows FROM donation_email_dispatches WHERE donation_id = 'don_does_not_exist'"
```

Expected:

```text
{"ok":true,"ignored":"unknown_donation_id",...}
rows = 0
```

## 5. Close CDN Header Gate

```bash
bash scripts/cf-cache-purge.sh
sleep 5
BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs
```

Expected:

```text
SPRINT_0_RELEASE_GATE_PASS
```

If the only remaining output is:

```text
SPRINT_0_RELEASE_GATE_BLOCKED_EXTERNAL
- production-headers: custom-domain cache/header override still active
```

then the code path is still green and Cloudflare edge cache is the remaining blocker.

## 6. Completion Criteria

Go-live proof is complete only when all items are true:

- `git status -sb` is clean and synced.
- `DONATE_WEBHOOK_BEHAVIOR_QA_PASS tests=6 assertions=18` passes locally.
- D1 migration `0006_donation_email_dispatches.sql` is applied remotely.
- `POST /api/donate/create` returns `200` with a `checkout_url`.
- Signed webhook returns `{"ok":true}`.
- `donation_email_dispatches` has the expected row for the QA donation.
- Unsigned webhook returns `401 SIGNATURE_REQUIRED`.
- Unknown signed donation creates zero dispatch rows.
- `sprint-0-release-gate.mjs` returns `SPRINT_0_RELEASE_GATE_PASS` or is blocked only by documented Cloudflare CDN header cache.
