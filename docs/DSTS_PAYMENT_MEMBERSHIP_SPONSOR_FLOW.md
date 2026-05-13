# DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW — v1.0

> **Mã tài liệu:** `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW_2026-05-13`
> **Trạng thái:** 🟡 DRAFT — chờ Legal Counsel + Payment Processor xác minh
> **Owner R:** Tech Lead + Legal · **Approver A:** Founder + Legal · **Áp cho:** Layer 1 Movement Portal + Layer 2 Star Journey OS
> **Tham chiếu:**
> - `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md` (Mục 6 + 9)
> - `dsts-master-plan-v1.1-LOCKED.md` (V.5 disclaimer payment)
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` (VII — 3 dòng tiền Legal Firewall)
> - **NĐ 03/2026/NĐ-CP** (donate transparency)
> - Stripe + PayPal + Wise terms

---

## 0. MỤC LỤC

1. Tổng quan 3 dòng tiền (Legal Firewall)
2. Payment Lane A — Commercial (sản phẩm DSTS)
3. Payment Lane B — Nonprofit (donate + sponsor NDNUM)
4. Payment Lane C — Investment (future, không Year 1)
5. Manual Confirmation Flow (Sprint 0-1 — chưa có processor)
6. Stripe Integration (Sprint 2+ khi pháp nhân ready)
7. Membership tiers (4 tier)
8. Sponsor flow (13 gói tài trợ Drive)
9. Order ID + Receipt + Invoice
10. Refund flow
11. Anti-fraud + KYC
12. Reconciliation + monthly close

---

## 1. TỔNG QUAN 3 DÒNG TIỀN — LEGAL FIREWALL

Theo `NDNUM v1.1-REVIEWED` Mục VII, DSTS có 3 dòng tiền KHÔNG cross-subsidize:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DSTS REVENUE ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   LANE A         │   │   LANE B         │   │   LANE C         │
│   COMMERCIAL     │   │   NONPROFIT      │   │   INVESTMENT     │
│                  │   │                  │   │                  │
│ Sản phẩm DSTS:   │   │ Donate + Sponsor │   │ Equity / Token   │
│ - T1-T4          │   │ + Quỹ NDNUM      │   │ (KHÔNG Year 1)   │
│ - Membership     │   │ - Sponsor A Star │   │                  │
│ - Script Journey │   │ - Sponsor A Dream│   │                  │
│ - Event ticket   │   │ - Donation       │   │                  │
│                  │   │                  │   │                  │
│ Pháp nhân:       │   │ Pháp nhân:       │   │ Pháp nhân:       │
│ For-profit Inc   │   │ Nonprofit 501c3  │   │ Holding LLC      │
│ (US LLC hoặc     │   │ (Angel Edu Tam   │   │ + cap table      │
│ VN Cty TNHH)     │   │ Foundation Inc)  │   │ + SAFE/Stripe    │
│                  │   │                  │   │ Atlas            │
│ Stripe acc A     │   │ Stripe acc B     │   │ Stripe acc C     │
│ Bank acc A       │   │ Bank acc B       │   │ Bank acc C       │
│                  │   │                  │   │                  │
└──────────────────┘   └──────────────────┘   └──────────────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                ▼
                    KHÔNG cross-subsidize
                    KHÔNG dùng tiền lane này
                    trả expense lane kia
                    KYC riêng cho từng lane
```

### Quy tắc Firewall

1. **Tiền donate Lane B KHÔNG được chuyển sang Lane A trả lương dev hoặc marketing thương mại.**
2. **Doanh thu sản phẩm Lane A KHÔNG được declare là donation cho mục đích thuế.**
3. **Mỗi lane có pháp nhân + bank account + Stripe account riêng.**
4. **Audit hằng năm riêng từng lane.**

### Khi nào mỗi lane mở

| Lane | Khi mở | Pháp nhân ready? |
|---|---|---|
| A Commercial | Sprint 2 (khi LLC hoặc Cty VN xong) | Phải verify trước |
| B Nonprofit | Phase 0B+ (Tháng 7-8/2026) khi 501c3 hoặc Quỹ Xã hội VN ready | Phải verify trước NĐ 03/2026 |
| C Investment | **KHÔNG Year 1** — Year 2+ khi có traction | – |

---

## 2. PAYMENT LANE A — COMMERCIAL

### 2.1 Sản phẩm Lane A

| Tier | Sản phẩm | Giá | Recurring? |
|---|---|---|---|
| T1 | Free Star Profile + Quiz | $0 | – |
| T1.5 | 7 Day Shine Starter | $9-29 one-time | – |
| T2 | Star Atlas PDF | $19 one-time | – |
| T2 | Star Pulse Pro | $9/tháng | Monthly recurring |
| T2 | Star Library Pro | $19/tháng | Monthly recurring |
| T2 | 30 Day Star Clarity Plan | $49-199 one-time | – |
| T2 | 90 Day Public Journey | $299-999 one-time | – |
| T3 | Star Coach AI | $99/tháng | Monthly recurring |
| T3 | Star Critique | $499 one-time | – |
| T3 | Star Cohort 12w | $999/cohort | – |
| T3 | Star Showcase Annual | $2,999/năm | Yearly recurring |
| T4 | Script Journey 1:1 — Snapshot | $99 one-time | – |
| T4 | Script Journey 1:1 — Story Kit | $499 one-time | – |
| T4 | Script Journey 1:1 — 90 Day Visibility | $1,500-3,000 one-time | – |
| T4 | Script Journey 1:1 — Elite 5 Year | $15,000-25,000 split-payable | – |
| Membership | Verified Star Circle | $99/năm | Yearly recurring |
| Event | Star Showcase Event ticket | $19-99/event | – |

### 2.2 Pháp nhân Lane A

**Option A (recommended):** US LLC (Delaware hoặc Wyoming) qua **Stripe Atlas** ($500 + $100/year):
- DSTS Inc / Star Path Light Up Inc
- Bank account Mercury (free) hoặc Brex
- Stripe account
- W-9 + EIN
- State tax filing yearly

**Option B (VN):** Công ty TNHH VN
- Cty TNHH "Đường Sao Tỏa Sáng" hoặc tương đương
- Bank VCB/TCB
- Cổng thanh toán VN: VNPay, ZaloPay, MoMo
- Stripe khả dụng VN từ 2024 nhưng giới hạn

**Option C (cả 2 — best):** US Inc cho global + Cty VN cho nội địa, cross-billing.

### 2.3 Flow checkout Lane A

```
User trên /products/T2/star-atlas
  → Click "Buy now $19"
  → Chuyển đến /checkout?product=star-atlas
  → Stripe Checkout (hosted, không cần custom UI)
  → User nhập card → Stripe charges $19
  → Stripe webhook → POST /api/webhooks/stripe
  → Cloudflare Worker:
      1. Verify Stripe signature
      2. INSERT INTO orders (id, user_id, product_slug, amount, status='paid')
      3. INSERT INTO payments (...)
      4. Generate order_id = "DSTS-COM-2026-NNNNN"
      5. Trigger fulfillment:
         - Star Atlas: generate PDF → email user
         - Subscription: activate role in users table
      6. Send receipt email + auto-reply
  → User redirected to /thank-you?order=DSTS-COM-2026-NNNNN
```

### 2.4 Recurring subscription

- Stripe Customer Portal cho user tự manage
- Cancel anytime (không khóa)
- Failed payment: 3 retry → cancel + email
- Refund: theo policy Mục 10

---

## 3. PAYMENT LANE B — NONPROFIT

### 3.1 Sản phẩm Lane B

| Sản phẩm | Mức | Recurring? |
|---|---|---|
| Donate one-time | $1 - $100,000 (cap) | – |
| Donate recurring | $5-500/tháng | Monthly |
| Sponsor A Star (DSTS) | $1,000 - $25,000 | One-time hoặc 12-tháng |
| Sponsor A Dream (NDNUM child) | $250 - $5,000 / child / năm | Yearly recurring |
| Legacy Archive donate | $5,000 - $50,000 | One-time |
| Gala fundraising | $100 - $10,000 ticket | – |
| Corporate sponsor (13 gói Drive) | $1,000 - $1,000,000 | Per-event hoặc multi-year |

### 3.2 Pháp nhân Lane B

**Option chính:** 501(c)(3) US (Angel Edu Tam Foundation Inc)
- Tax-deductible cho donor US
- Annual Form 990
- Charitable solicitation registration mỗi state (40+ states)

**Option phụ:** Quỹ Xã hội/Từ thiện VN
- Theo NĐ 03/2026 + Luật Quỹ XH 2024 (nếu có)
- Bộ Nội vụ approval
- Annual report

**Option tạm (Year 1):** Fiscal Sponsor (Open Collective, Tides Foundation)
- Donate qua Open Collective DSTS chapter
- Open Collective lo paperwork, DSTS chỉ vận hành program
- Phí 10-15% donate handling

### 3.3 Flow donate Lane B

```
User trên /donate
  → Chọn mức ($25 / $100 / $500 / Custom)
  → Chọn one-time / recurring
  → Chọn opt-in:
      [ ] Hiển thị tên trong Donor Wall
      [ ] Nhận monthly impact report
      [ ] Tax receipt (cần Form W-9 nếu VN, hoặc tax ID nếu US)
  → Stripe Checkout (Stripe account B - nonprofit)
  → Webhook → Worker:
      1. Verify
      2. INSERT INTO donations (id, donor_id, amount, fund='general' or 'ndnum', recurring)
      3. order_id = "DSTS-NPO-2026-NNNNN"
      4. Generate tax receipt PDF (501c3 letter format US, hoặc biên nhận VN format)
      5. Email tax receipt
      6. Add to Donor Wall (nếu opt-in)
      7. Add to recurring sequence (nếu recurring)
```

### 3.4 Special — Sponsor A Dream (NDNUM)

Áp Guardian-first flow:

```
Sponsor trên /movement/sponsor-a-dream
  → Browse child profiles (only first-name + age + dream area, NO photo, NO identifying info)
  → Chọn 1 child + commit $250-5,000/năm
  → Payment via Stripe (Lane B)
  → Sponsor nhận:
      - Welcome packet với child's first-name letter (viết bởi child, edited bởi Coordinator)
      - 2 báo cáo/năm về tiến độ (qua Coordinator)
      - KHÔNG được liên lạc trực tiếp child
      - KHÔNG được biết tên đầy đủ, địa chỉ, trường học của child
  → Coordinator giám sát toàn bộ communication
  → Phụ huynh có quyền dừng sponsorship bất cứ lúc nào (refund prorated)
```

---

## 4. PAYMENT LANE C — INVESTMENT

🚫 **KHÔNG ÁP DỤNG Year 1**.

Khi DSTS đủ traction (Y2+) và Founder muốn raise:
- US C-Corp Delaware (qua Stripe Atlas chuyển từ LLC)
- SAFE notes hoặc Priced Round
- Cap table management (Carta)
- Secondary marketplace cấm Year 2-3

KHÔNG mix Lane A revenue và Lane C funding trong cùng đối thoại với khách.

---

## 5. MANUAL CONFIRMATION FLOW (SPRINT 0-1)

🚧 **Chưa có Stripe** → dùng manual flow.

### 5.1 Khi nào dùng

- Sprint 0-1, trước khi pháp nhân + Stripe ready
- Backup khi Stripe down
- Sponsor ≥ $25K USD (chuyển khoản trực tiếp với KYC)

### 5.2 Flow

```
User trên /scripts/rising-entrepreneur
  → Đọc payment disclaimer (xem Privacy Rules Mục 6.1)
  → Click "Liên hệ để bắt đầu"
  → Redirect /contact?intent=script-rising-entrepreneur
  → Submit form (Issue 05 contact form Sprint 0)
  → Email tới founder@duongsaotoasang.com
  → Founder reply trong 24-48h:
      1. Gửi proposal PDF (giá + scope + timeline)
      2. Gửi bank info hoặc PayPal link
      3. Gửi e-contract (DocuSign hoặc DropboxSign)
  → User ký + chuyển khoản
  → Founder verify chuyển khoản (1-3 ngày)
  → Founder send confirmation:
      - Receipt PDF với order_id manual "DSTS-MAN-2026-NNN"
      - Kick-off call scheduled
  → User vào program
```

### 5.3 Trang `/payment-confirmation`

Là landing page cho user đã chuyển khoản:
- Form upload screenshot chuyển khoản
- Nhập amount + order_id (nếu đã có)
- Nhập note (gói nào)
- → Send email founder + ack email user

Đã có redirect `/payment-confirmation` → `/contact?type=payment-confirmation` trong `_redirects`.

---

## 6. STRIPE INTEGRATION (Sprint 2+)

### 6.1 Setup checklist

- [ ] Pháp nhân Lane A ready (LLC hoặc Cty VN)
- [ ] Stripe Atlas hoặc Stripe VN activate
- [ ] Bank account linked
- [ ] Tax ID (EIN US, MST VN)
- [ ] Webhook endpoint `https://duongsaotoasang.com/api/webhooks/stripe` registered
- [ ] STRIPE_SECRET_KEY in Cloudflare env vars (KHÔNG commit)
- [ ] STRIPE_WEBHOOK_SECRET in env vars
- [ ] Test mode E2E pass với card 4242 4242 4242 4242

### 6.2 Stripe products mapping

```javascript
// functions/api/stripe-products.js
const PRODUCTS = {
  "star-atlas": { stripe_price_id: "price_xxx", amount: 1900, currency: "usd" },
  "star-pulse-pro": { stripe_price_id: "price_yyy", recurring: "month", amount: 900 },
  "30-day-clarity": { stripe_price_id: "price_zzz", amount: 4900 }, // hoặc 9900, 19900
  // ...
};
```

### 6.3 Webhook handler skeleton

```javascript
// functions/api/webhooks/stripe.js
export async function onRequestPost({ request, env }) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  // Verify signature
  const event = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object, env.DB);
      break;
    case 'invoice.payment_succeeded':
      await handleSubscriptionRenewed(event.data.object, env.DB);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object, env.DB);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object, env.DB);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### 6.4 Tax + invoicing

- Stripe Tax tự calc VAT (EU) + sales tax (US states)
- Invoice tự generate qua Stripe Invoicing
- User download từ Stripe Customer Portal

---

## 7. MEMBERSHIP TIERS (4 TIER)

Theo `NDNUM v1.1-REVIEWED` Mục VI.Tầng 5 — sửa từ 5 tier lộn xộn về 4 tier rõ:

| Tier | Tên | Giá | Quyền lợi |
|---|---|---|---|
| **Free** | Free Member | $0 | Profile + Star Map Quiz + 30 Day Daily Spark email |
| **Light** | Star Pulse Light | $9/tháng | + Star Pulse Pro newsletter weekly + Star Library Lite |
| **Pro** | Star Stream Pro | $29/tháng | + Star Coach AI + Star Library Full + Cohort discount 20% |
| **Annual** | Verified Star Circle | $99/năm | Tất cả Pro + Verification badge + Private discussion + Monthly mentor office hour |
| **Patron** | Patron (apply-only) | $5,000+/năm | Tất cả + Founder office hour + Co-invest opportunities (Y2+) |

Patron là **apply-only**, không tự checkout. Apply qua `/movement/patron` → Founder review → onboard call.

---

## 8. SPONSOR FLOW (13 GÓI TÀI TRỢ DRIVE)

Theo Drive cũ — gói tài trợ 1,000-100,000 USD + gói lớn 25,000-1,000,000 USD.

### 8.1 13 gói chuẩn (đề xuất)

| # | Tên gói | Giá | Quyền lợi |
|---|---|---|---|
| 1 | **Star Friend** | $1,000 | Tên trong donor wall + thank-you certificate |
| 2 | **Star Supporter** | $2,500 | Friend + monthly impact report |
| 3 | **Star Patron** | $5,000 | Supporter + private community access |
| 4 | **Star Champion** | $10,000 | Patron + invitation gala + ticker name in event |
| 5 | **Star Pillar** | $25,000 | Champion + co-curate 1 episode/show |
| 6 | **Star Founding Partner** | $50,000 | Pillar + logo trong show + brand exposure |
| 7 | **Star Visionary** | $100,000 | Founding Partner + naming right 1 program |
| 8 | **Tour Sponsor (1 country)** | $25,000 | Brand visibility 1 country tour |
| 9 | **Tour Sponsor (regional)** | $100,000 | Brand visibility 3+ country |
| 10 | **Tour Title Sponsor (global)** | $500,000 | Title sponsorship full tour |
| 11 | **NDNUM Cohort Sponsor** | $50,000 | Sponsor 1 cohort 20 trẻ × 1 năm |
| 12 | **NDNUM Annual Sponsor** | $250,000 | Sponsor full year NDNUM program |
| 13 | **Legacy Anchor Sponsor** | $1,000,000 | Naming right Legacy Archive + 10-year partnership |

### 8.2 Sponsor flow

```
Corporate sponsor → /movement/sponsors
  → Browse 13 gói
  → Click "Inquiry $25K Pillar"
  → Form: company name + contact + revenue range + intent
  → Submit → Founder + Sponsor Manager nhận email
  → Manual review 5-7 ngày
  → If approved:
      - Send Sponsor Agreement PDF
      - Schedule kick-off call
      - KYC: company registration + AML check
      - Sign + invoice
      - Wire transfer
      - Confirm → activate benefits
  → Track delivery in DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md
```

Chi tiết spec: xem `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` (file 2 trong batch này).

---

## 9. ORDER ID + RECEIPT + INVOICE

### 9.1 Order ID format

```
DSTS-{LANE}-{YEAR}-{SEQUENCE}

Lane:
  COM = Commercial
  NPO = Nonprofit
  INV = Investment
  MAN = Manual (Sprint 0-1)
  SPO = Sponsor (Lane B subtype)

Year: 4-digit
Sequence: 5-digit zero-padded

Ví dụ:
  DSTS-COM-2026-00042
  DSTS-NPO-2026-00100
  DSTS-MAN-2026-00007
  DSTS-SPO-2026-00012
```

### 9.2 Receipt vs Invoice

| | Receipt | Invoice |
|---|---|---|
| Khi nào gửi | Sau khi payment confirmed | Trước payment (cho corp) |
| Bắt buộc field | Order ID + amount + date + product + buyer | + tax ID + due date + payment terms |
| Format | PDF qua email + viewable trong account | PDF + Stripe Hosted Invoice |
| Storage | 7 năm | 7 năm |

### 9.3 Tax receipt cho donate (Lane B)

US donor:
- Form 501(c)(3) acknowledgment letter
- Tax-deductible amount
- IRS-compliant format

VN donor:
- Biên nhận theo NĐ 03/2026 mẫu
- Mã số thuế quỹ

---

## 10. REFUND FLOW

### 10.1 Refund policy theo lane

| Lane | Policy |
|---|---|
| Lane A — Commercial | 14 ngày: 90% · 30 ngày: 50% · >30 ngày: case-by-case |
| Lane A — Subscription | Cancel anytime, refund prorate phần chưa dùng |
| Lane A — Script Journey 1:1 | Cooling 14 ngày: 90% · Milestone-based sau đó |
| Lane B — Donate | KHÔNG refund (đã ghi báo cáo công khai NĐ 03/2026), trừ gian lận |
| Lane B — Sponsor | Per Sponsor Agreement (thường non-refundable sau ký) |

### 10.2 Flow

```
User request refund qua /contact hoặc /account/billing
  → Reason form
  → Submit → ticket trong support queue
  → Founder/Tech Lead review 3-5 ngày
  → If approved:
      - Stripe refund qua dashboard hoặc API
      - Update orders.status = 'refunded'
      - Email user confirmation
      - Update audit_log
  → If rejected:
      - Email user lý do
      - Offer alternative (credit, swap product)
```

### 10.3 Chargeback handling

Chargeback (user dispute qua bank) → Stripe alert → DSTS có 7-21 ngày phản hồi:
- Submit evidence: receipt, email, deliverable proof
- Stripe Dashboard dispute UI
- Win rate target: > 60% (nếu deliverable rõ ràng)
- 3 chargeback / tháng → review user behavior, possible ban

---

## 11. ANTI-FRAUD + KYC

### 11.1 Khi nào KYC

| Amount | KYC level |
|---|---|
| < $100 | None (Stripe auto-fraud) |
| $100-1,000 | Email verify + IP/billing geo match |
| $1,000-10,000 | + ID verify (Stripe Identity hoặc Persona) |
| $10,000-25,000 | + Source of funds declaration |
| ≥ $25,000 | + Full KYC: government ID + proof of address + AML OFAC list check |
| ≥ $100,000 | + Enhanced Due Diligence (EDD): UBO check (Ultimate Beneficial Owner) cho corp |

### 11.2 Tools

- Stripe Radar (built-in)
- Stripe Identity ($1.50/verification)
- Persona ($1-3/verification)
- OFAC list check API (Refinitiv hoặc miễn phí qua opensanctions.org)

### 11.3 Suspicious red flag

- IP / billing country mismatch
- Email tạo < 7 ngày
- Multiple failed cards
- Velocity: > 3 purchases / 24h
- Unusual amount pattern (vd $9,999 split nhiều lần để né $10K threshold)

→ Auto-hold + manual review

---

## 12. RECONCILIATION + MONTHLY CLOSE

### 12.1 Monthly close routine (cuối tháng)

- [ ] Pull Stripe payout report (Lane A + Lane B)
- [ ] Match với bank statement
- [ ] Reconcile order IDs với D1 `orders` table
- [ ] Flag discrepancy (refund pending, chargeback, dispute)
- [ ] Export to Wave/Xero/QuickBooks
- [ ] Generate Founder financial summary
- [ ] Close month → lock data

### 12.2 Quarterly report (cho NĐ 03/2026)

Lane B (nonprofit) cuối mỗi quý:
- Total raised
- By campaign
- By donor type (anonymous vs named)
- Disbursement breakdown
- Operating cost ratio
- Publish `/transparency/q{N}-2026`

### 12.3 Annual close

- External audit (CPA US hoặc kiểm toán độc lập VN)
- Form 990 (US 501c3) by May 15
- VN annual report by March 31 (per NĐ 03/2026)
- Public Annual Report PDF → `/transparency/annual-2026.pdf`

---

## CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-05-13 | Claude + Founder | Tạo lần đầu — 3 lane + manual flow + Stripe + 13 gói sponsor |

---

## APPROVAL

- [ ] Founder review tổng thể
- [ ] Legal Counsel VN review Lane A/B pháp nhân + NĐ 03/2026 compliance
- [ ] Legal Counsel US review Lane A/B/C pháp nhân + 501c3
- [ ] Accountant review Mục 9, 12 (tax + audit)
- [ ] Tech Lead review Mục 6, 9 (implementation)

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là source of truth cho mọi flow tiền vào/ra DSTS. Bất kỳ thay đổi tier/giá/policy phải PR + Legal review. Mọi PR liên quan checkout/donate phải ref file này.*
