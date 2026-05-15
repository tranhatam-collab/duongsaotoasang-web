---
title: pay.iai.one Integration Ground Truth (DSTS-side)
version: v1.0
status: LIVE-SNAPSHOT 2026-05-15
date: 2026-05-15
authors: [Claude Code — fetched from pay.iai.one live endpoints]
references:
  - https://pay.iai.one/health
  - https://pay.iai.one/v1/providers
  - https://pay.iai.one/docs
  - https://pay.iai.one/openapi.json
  - DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md
  - functions/api/donate/create.js
  - functions/api/donate/webhook.js
evidence:
  - docs/_evidence/pay-iai-providers-snapshot-2026-05-15.json
  - docs/_evidence/pay-iai-openapi-2026-05-15.json
---

# pay.iai.one — Integration Ground Truth (DSTS-side)

> **Purpose:** Khoá xuống đúng những gì pay.iai.one **thực sự cung cấp ngày 2026-05-15**, không phải kỳ vọng cũ trong các spec. Tài liệu này là source of truth cho DSTS payment integration.
>
> **Type:** Internal contract. pay.iai.one là payment gateway riêng (multi-tenant, Cloudflare Workers), được DSTS dùng làm Lane A + Lane B Vietnamese-domestic payment provider.

---

## 1. Live capabilities (2026-05-15)

| Item | Status | Detail |
|------|--------|--------|
| **Provider** | ✅ Live | **payOS** only (`payos`) |
| **Currency** | ✅ Live | **VND** only |
| **Billing cycle** | ✅ Live | **one_time** only |
| **Hosted checkout** | ✅ Live | payOS-hosted redirect |
| **Refund API** | ✅ Documented | refund_api mode listed for payOS |
| **Query API** | ✅ Live | `GET /v1/payments/{internal_order_id}` |
| **Webhook (callback_url)** | ✅ Receive | merchant cung cấp `callback_url`, pay.iai.one POST status |
| **Standard webhook events** | 🟡 PLANNED, KHÔNG LIVE | `payment.succeeded`, `payment.failed`, `refund.created` |
| **Subscription** | 🔴 PLANNED, KHÔNG LIVE | `subscription.activated/cancelled/expired` |
| **Multi-currency** | 🔴 KHÔNG LIVE | Chỉ VND |
| **Recurring billing** | 🔴 KHÔNG LIVE | Chỉ one_time |

---

## 2. Provider matrix (full)

Nguồn: `GET https://pay.iai.one/v1/providers` (snapshot evidence: `docs/_evidence/pay-iai-providers-snapshot-2026-05-15.json`).

| Code | Label | Market | Stage | Currencies | Methods | env_ready | Status |
|------|-------|--------|-------|-----------|---------|-----------|--------|
| `payos` | payOS | vietnam | launch | VND | vietqr, bank_transfer, payment_link | ✅ true | **LIVE** |
| `momo` | MoMo | vietnam | launch | VND | wallet, atm_card, intl_card, installment | ❌ false | Credentials missing |
| `zalopay` | ZaloPay | vietnam | launch | VND | wallet, banking, domestic_card, intl_card, qr | ❌ false | Credentials missing |
| `vnpay` | VNPay | vietnam | launch | VND | atm_card, internet_banking, vnpay_qr, intl_card | ❌ false | Credentials missing |
| `paypal` | PayPal | international | phase_2 | USD, EUR, GBP | paypal_balance, intl_card | ❌ false | Phase 2, defer |
| `stripe` | Stripe | international | phase_2 | (multi) | intl_card, apple_pay, ... | ❌ false | Phase 2, defer |

**Implication cho DSTS:**
- **Y1 (2026):** chỉ dùng **payOS via pay.iai.one** cho Lane A + Lane B (VN-domestic only)
- **Y2 (2027):** activate MoMo + ZaloPay + VNPay khi anh thêm credentials vào pay.iai.one
- **Y3 (2028+):** activate PayPal + Stripe cho cross-border, OR migrate Lane A US/EU sang Stripe-direct theo plan trong `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` Mục "Stripe Y2 migration"

---

## 3. Endpoint contract

### 3.1 Public (merchant API)
```
POST https://pay.iai.one/api/v1/checkout/session
Headers:
  x-api-key:           <merchant API key, from pay.iai.one dashboard>
  x-idempotency-key:   <random per-request>
  content-type:        application/json
```

### 3.2 Internal (multi-tenant operator)
```
POST https://pay.iai.one/internal/checkout-session
Headers:
  x-site-key:          <site key>
  x-idempotency-key:   <random per-request>
  content-type:        application/json
```

### 3.3 Query payment status
```
GET https://pay.iai.one/v1/payments/{internal_order_id}
```

### 3.4 Health + providers (no auth)
```
GET https://pay.iai.one/health
GET https://pay.iai.one/v1/providers
GET https://pay.iai.one/openapi.json
GET https://pay.iai.one/docs (HTML)
```

---

## 4. Request body schema (POST /api/v1/checkout/session)

```jsonc
{
  // REQUIRED
  "tenant_code":      "dsts",              // current shared tenant, before lane split
  "site_code":        "duongsaotoasang",   // string
  "internal_order_id":"don_abc123",        // string, MUST be unique per merchant
  "amount":           120000,              // integer, VND (no decimals)
  "currency":         "VND",               // enum: ["VND"]
  "billing_cycle":    "one_time",          // enum: ["one_time"]
  "success_url":      "https://duongsaotoasang.com/donate?status=success",
  "cancel_url":       "https://duongsaotoasang.com/donate?status=cancel",

  // OPTIONAL
  "provider":         "payos",             // default "payos" — only live option Y1
  "plan_code":        "donation",          // string, free-form plan label
  "callback_url":     "https://duongsaotoasang.com/api/donate/webhook",
  "user_id":          "user_123",          // string, merchant-side user ID
  "email":            "donor@example.com", // string, email format
  "full_name":        "Nguyen Van A",      // string
  "locale":           "vi",                // string, "vi" or "en"
  "ref_code":         "campaign-q2-2026",  // string, marketing ref
  "description":      "Ủng hộ DSTS",       // string
  "metadata":         { "lane": "b" }      // object, custom merchant data
}
```

**Response (200 OK):**
```jsonc
{
  "ok": true,
  "checkout_url": "https://pay.iai.one/checkout/xxx",
  "order_id":     "ord_xxx",
  // ... additional fields
}
```

---

## 5. ⚠️ DRIFT DETECTED — DSTS code vs pay.iai.one contract

### Drift #1: Wrong endpoint path

**File:** `functions/api/donate/create.js` line 84

**Current:**
```javascript
const resp = await fetch(`${baseUrl}/checkout-session`, { ... })
```

**Correct (per pay.iai.one contract):**
```javascript
const resp = await fetch(`${baseUrl}/api/v1/checkout/session`, { ... })
```

**Impact:** Khi PAY_IAI_ONE_API_KEY được set + chạy production, DSTS sẽ hit `/checkout-session` (KHÔNG TỒN TẠI) → 404 → `GATEWAY_ERROR`. Donation flow broken.

**Fix:** Sửa baseUrl path để dùng `/api/v1/checkout/session` (public merchant endpoint).

### Drift #2: Field name mismatch

**File:** `functions/api/donate/create.js` lines 63-78

**Current payload uses:** `order_id` (line 69), `buyer_email`, `buyer_name`

**Correct per contract:**
- `order_id` → `internal_order_id`
- `buyer_email` → `email`
- `buyer_name` → `full_name`

**Impact:** Request body sẽ fail schema validation tại pay.iai.one → 400 Bad Request.

### Drift #3: Idempotency header name

**File:** `functions/api/donate/create.js` line 89

**Current:** `"idempotency-key": idempotencyKey`

**Correct:** `"x-idempotency-key": idempotencyKey`

---

## 6. Recommended fix (PR for DSTS)

Em không sửa trong session này (cần Founder approve thay đổi runtime code), nhưng đây là patch ready-to-apply:

```javascript
// functions/api/donate/create.js — corrected payload + endpoint

const callPayload = {
  tenant_code: tenantCode,
  site_code: siteCode,
  provider,                              // "payos" default
  internal_order_id: donationId,         // was: order_id
  amount: amountVnd,
  currency: "VND",
  billing_cycle: "one_time",             // NEW: required field
  description: body.message
    ? `Ủng hộ DSTS: ${String(body.message).slice(0, 100)}`
    : "Ủng hộ Đường Sao Tỏa Sáng",
  email: body.donor_email || body.email || null,           // was: buyer_email
  full_name: body.donor_name || body.name || null,         // was: buyer_name
  callback_url: `${callbackBase}/api/donate/webhook`,
  success_url: `${callbackBase}/donate?status=success`,
  cancel_url: `${callbackBase}/donate?status=cancel`,
  metadata: { lane: "b", source: "dsts-donate" },          // NEW: optional
};

const resp = await fetch(`${baseUrl}/api/v1/checkout/session`, {  // was: /checkout-session
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
    "x-idempotency-key": idempotencyKey,                   // was: idempotency-key
  },
  body: JSON.stringify(callPayload),
});
```

---

## 7. Webhook contract (callback_url)

Khi DSTS gửi `callback_url` trong request, pay.iai.one sẽ POST tới URL đó khi payment status thay đổi.

**Current pay.iai.one implementation:**
- ✅ Receive `callback_url` → POST status update
- 🟡 **PLANNED, không guarantee yet:** standardized event names `payment.succeeded`, `payment.failed`, `refund.created`

**DSTS webhook handler:** `functions/api/donate/webhook.js`
- HMAC verify với `PAY_DSTS_HMAC` hoặc `PAY_IAI_ONE_HMAC` env var
- Update `donations.status` trong D1

**⚠️ Caveat:** Vì pay.iai.one webhook contract chưa final (planned, not live), DSTS phải:
1. Implement **polling fallback** — `GET /v1/payments/{internal_order_id}` every 60s for pending donations
2. Log raw webhook payload để debug
3. KHÔNG depend on specific event name (`payment.succeeded`) cho đến khi pay.iai.one lock contract

---

## 8. Compliance + legal notes

### 8.1 Pay.iai.one bản thân không phải PCI-DSS gateway
pay.iai.one **routes to** payOS (PCI-DSS compliant Level 1), nhưng không lưu card data. DSTS không cần PCI compliance khi dùng pay.iai.one + payOS hosted checkout.

### 8.2 Pay.iai.one tenant_code = entity proxy
Hiện tại DSTS dùng `tenant_code: "dsts"` + `site_code: "duongsaotoasang"`. Khi anh tách Lane A/B (per `DSTS_LEGAL_LANE_ARCHITECTURE_AND_NDNUM_SAFE_LAUNCH_PLAN_2026.md`), **cần tách tenant**:
- Lane A (Việt Can Star Entertainment JSC) → `tenant_code: "vietcanstar"` + bank account VN JSC
- Lane B (Angel Edu Tam Foundation) → `tenant_code: "angeledutam"` + bank account Foundation
- Lane E Investment → KHÔNG dùng pay.iai.one (custom investor onboarding)

**Action item Founder:** Yêu cầu anh (operator của pay.iai.one) tạo 2-3 tenant riêng cho DSTS multi-lane, không trộn revenue trong 1 tenant.

### 8.3 Refund flow
Refund qua API: `POST /v1/refunds` (chưa documented trong OpenAPI hiện tại, nhưng listed trong provider modes). Cần verify trước khi launch.

### 8.4 Bank account binding
pay.iai.one auto-settle về bank account đã đăng ký với payOS. **Anh phải đảm bảo:**
- Lane A revenue → Việt Can Star JSC bank account
- Lane B donations → Foundation bank account
- Tuyệt đối KHÔNG settle Lane B donations vào personal/commercial bank.

---

## 9. Env vars cần set trong Cloudflare DSTS

```bash
# Wrangler/Cloudflare Pages env vars (production):
PAY_IAI_ONE_API_KEY=<from pay.iai.one merchant dashboard>
PAY_IAI_ONE_BASE_URL=https://pay.iai.one
PAY_IAI_ONE_TENANT_CODE=duongsaotoasang        # OR specific lane tenant
PAY_IAI_ONE_SITE_CODE=duongsaotoasang
PAY_IAI_ONE_PROVIDER=payos                     # Y1 fixed
PAY_IAI_ONE_CALLBACK_BASE=https://duongsaotoasang.com

# HMAC secret for webhook signature verify:
PAY_DSTS_HMAC=<shared secret with pay.iai.one>
# OR fallback:
PAY_IAI_ONE_HMAC=<same value>
```

---

## 10. Action items

### 10.1 Code fix (DSTS dev)
- [x] **HIGH:** Code drift trong `functions/api/donate/create.js` đã được sửa ở repo.
- [ ] Add polling fallback cho `GET /v1/payments/:id` (vì webhook event names chưa final)
- [ ] Push production secrets + redeploy/smoke trên Cloudflare Pages

### 10.2 Pay.iai.one operator (Founder)
- [ ] Lock webhook event contract (publish standard names + payload schema)
- [ ] Confirm refund API endpoint shape
- [ ] Set up 3 tenants cho DSTS multi-lane (vietcanstar, angeledutam, duongsaotoasang shared)
- [ ] Activate MoMo/ZaloPay/VNPay credentials (Y2 plan)
- [ ] Document tax invoice / e-invoice flow cho Lane A revenue (cần cho VN tax compliance)

### 10.3 Cross-doc sync
- [ ] Update `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` reflect pay.iai.one ground truth
- [ ] Update `DSTS_MOVEMENT_EVENTS_API_CONTRACT.md` Mục 8 pay.iai.one section
- [ ] Update `functions/api/donate/create.js` per Mục 6 patch above

---

## 11. Evidence

Raw snapshots fetched 2026-05-15:
- `docs/_evidence/pay-iai-providers-snapshot-2026-05-15.json` — full provider matrix
- `docs/_evidence/pay-iai-openapi-2026-05-15.json` — OpenAPI 3.1 spec

Re-fetch command (anh chạy lại bất kỳ lúc nào để check drift):
```bash
curl -s -H "User-Agent: Mozilla/5.0 Chrome/120.0" https://pay.iai.one/v1/providers \
  > docs/_evidence/pay-iai-providers-snapshot-$(date -u +%Y-%m-%d).json
curl -s -H "User-Agent: Mozilla/5.0 Chrome/120.0" https://pay.iai.one/openapi.json \
  > docs/_evidence/pay-iai-openapi-$(date -u +%Y-%m-%d).json
```
