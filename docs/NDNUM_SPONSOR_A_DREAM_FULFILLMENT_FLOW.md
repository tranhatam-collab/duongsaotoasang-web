# NDNUM — Sponsor-a-Dream Fulfillment Flow

> **Mã tài liệu:** `NDNUM_SPONSOR_A_DREAM_FULFILLMENT_FLOW_v1.0`
> **Trạng thái:** 🟡 DRAFT v1.0
> **Phiên bản:** v1.0-DRAFT
> **Ngày:** 2026-05-13
> **Owner:** Operations + Founder
> **Phụ thuộc:** Phase 0B legal lock + Coordinator hired (ít nhất 1 người)
> **Tham chiếu:**
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục V (Mentor model), Mục VI (Tầng 4 products)
> - `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` Mục 4-5
> - `NDNUM_CHILD_SAFETY_POLICY.md` (quy tắc 3, 4, 12)
> - `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` (consent before any sponsor communication)

---

## MỤC LỤC

1. [Overview](#1)
2. [3 Sponsorship Lanes](#2)
3. [Sponsor Journey Map — 8 bước](#3)
4. [Coordinator Role & Workload](#4)
5. [Communication Protocol (Rules)](#5)
6. [$120/năm — Bảo Trợ 1 Mầm Sáng](#6)
7. [$50K/năm — Cohort Sponsor](#7)
8. [$250K/năm — Annual General Fund Sponsor](#8)
9. [Sponsor Termination & Child Continuity](#9)
10. [Photo & Media Policy (Tóm tắt)](#10)
11. [D1 Schema References](#11)
12. [API References (Wave 3, blocked by Phase 0B)](#12)
13. [Acceptance Criteria & Red Lines](#13)
14. [DEV-READY — Implementation hooks](#14)

---

<a name="1"></a>
## 1. OVERVIEW

Sponsor-a-Dream là cơ chế tài chính cốt lõi của NDNUM — cho phép Tầng 4 (người đã thành công) đóng góp tài chính để nuôi dưỡng Tầng 1 (Mầm Sáng, 5-12 tuổi).

**Nguyên tắc thiết kế:**

| Nguyên tắc | Chi tiết |
|---|---|
| Không tiếp xúc trực tiếp | Sponsor KHÔNG bao giờ gặp, gọi, hoặc nhắn tin trực tiếp với trẻ em |
| Coordinator là trung tâm | Mọi communication giữa sponsor và trẻ/phụ huynh đều qua Coordinator |
| Sponsor không biết tên đầy đủ trẻ | Chỉ biết "trẻ A trong cohort X" |
| Trẻ không biết sponsor là ai | Rule #3 tuyệt đối (child safety reason: tránh unhealthy attachment) |
| Continuity guarantee | DSTS cam kết 5-năm đồng hành dù sponsor thay đổi |

**Tại sao không có video call 1:1 sponsor-trẻ:**
Mô hình "sponsor gặp trẻ" phổ biến (Compassion International, World Vision older model) có rủi ro: tạo attachment không lành mạnh, lộ địa chỉ/school, grooming risk từ sponsor không được screening đủ. NDNUM chọn model hoàn toàn mediated.

---

<a name="2"></a>
## 2. 3 SPONSORSHIP LANES

| Lane | Giá | Đối tượng sponsor | Đối tượng được nhận | YR1 capacity |
|---|---|---|---|---|
| **Individual Dream Sponsor** | $120/năm | Tầng 4 cá nhân, diaspora, bất kỳ ai | 1 trẻ em trong cohort (mediated) | 50 sponsors → 50 trẻ |
| **Cohort Sponsor** | $50,000/năm | Doanh nghiệp, gia đình, tổ chức | 20 trẻ em (1 cohort đầy đủ) | 1 cohort |
| **Annual General Fund** | $250,000/năm | Tổ chức lớn, family office | Vận hành chương trình tổng thể | 1 vị trí Y1 |

**Phân loại Lane B (Nonprofit):**
Tất cả 3 lanes đều là **Lane B (Nonprofit donate)** — tiền vào pháp nhân nonprofit. Hóa đơn quyên góp/tax receipt tùy quốc gia sponsor sau khi pháp nhân lock (NDNUM Mục XVI Decision #1).

---

<a name="3"></a>
## 3. SPONSOR JOURNEY MAP — 8 BƯỚC

```
Bước 1 ──── Bước 2 ──── Bước 3 ──── Bước 4 ──── Bước 5 ──── Bước 6 ──── Bước 7 ──── Bước 8
Discover  →  Inquiry  →  KYC/Fit  →  Match    →  Welcome  →  Active   →  Annual   → Exit/Renew
(passive)   (form)     (Coord.)   (Coord.)   (onboard)   (12mo)    (renewal)   
```

### Bước 1 — Discovery
- Sponsor biết NDNUM qua: DSTS website `/dream-nurture`, event, word of mouth
- Không có public "sponsor profile" để chọn — không phải chọn trẻ cụ thể

### Bước 2 — Inquiry
- Điền form trên DSTS website (POST `/api/ndnum/sponsors/apply`)
- Fields: name, email, organization (nếu có), lane quan tâm, motivation (why sponsor), acknowledgement checkbox (đọc và đồng ý Child Safety Rules)
- Không thu thập: thông tin tài chính, số CMND/passport (chưa cần ở bước này)

### Bước 3 — KYC & Fit Screen (Coordinator)
- Coordinator gọi điện 30 phút với sponsor
- Mục tiêu: verify identity sơ bộ, explain program rules, answer questions, detect red flags
- Red flags PHẢI escalate CSO:
  - Hỏi về trẻ cụ thể ("con của nhà nào?", "có ảnh không?")
  - Đề nghị gặp mặt trẻ trực tiếp
  - Hỏi về địa chỉ trường/nhà trẻ
  - Background có liên quan đến vi phạm với trẻ em (tự khai hoặc phát hiện)
- KYC tier theo giá trị (xem Mục 8 Sponsor Agreement Template):
  - $120/năm: tên + email + card check
  - $50K+: government ID + AML declaration

### Bước 4 — Match (Coordinator-mediated)
- Coordinator phân trẻ vào "sponsor slot" dựa trên: cohort capacity, child age, program needs
- Sponsor KHÔNG chọn trẻ cụ thể
- Coordinator thông báo: "Bạn đã được match với 1 trẻ trong Cohort [X]. Chúng tôi sẽ gửi báo cáo đầu tiên sau 30 ngày."

### Bước 5 — Welcome & Onboarding
- Email welcome từ Coordinator (không phải automation — personalized)
- Welcome packet:
  - Giải thích lại rules (no direct contact, no public sharing, no naming child)
  - Subscription setup (auto-renew annual, cancel anytime)
  - First donation processed (Lane B)
  - Instruction: "Nếu muốn viết thư cho trẻ, gửi về địa chỉ email này..."

### Bước 6 — Active (12 tháng)
- 2 báo cáo/năm (T+6 và T+12) — xem Mục 6 cho chi tiết
- 1 "nhóm virtual visit" invite (nếu Phase 0B + CSO approve)
- Sponsor có thể gửi tối đa 2 thư/năm (qua Coordinator review)

### Bước 7 — Annual Renewal
- T-30 days: email nhắc renewal
- T-7 days: email + option hủy
- T0: auto-renew nếu không hủy (cancel any time before)
- Renewal báo cáo: tóm tắt năm qua

### Bước 8 — Exit / Transfer
- Hủy: pro-rate refund nếu DSTS cancel chương trình; không refund nếu sponsor cancel (đã committed)
- Remaining funds: vào general cohort pool — đảm bảo continuity cho trẻ
- Child KHÔNG được thông báo sponsor rút lui (protection rule)

---

<a name="4"></a>
## 4. COORDINATOR ROLE & WORKLOAD

### 4.1 Coordinator là trung gian duy nhất

```
Sponsor ←──────────── Coordinator ────────────→ Child / Guardian
         (reports, letters)        (activities, letters)
```

### 4.2 Workload estimate (Y1: 5 Coordinators × 10 sponsor slots mỗi người)

| Activity | Thời gian/sponsor/năm | ×50 sponsors |
|---|---|---|
| Inquiry call (Bước 3) | 0.5h | 25h |
| Match + welcome (Bước 4-5) | 1h | 50h |
| Báo cáo T+6 viết + review | 2h | 100h |
| Báo cáo T+12 viết + review | 2h | 100h |
| Letter review (gửi + nhận) | 0.5h/letter × 4 | 100h |
| Virtual visit prep + facilitation | 3h/nhóm × 10 nhóm | 30h |
| Renewal + admin | 0.5h | 25h |
| **Tổng/Coordinator/năm** | **~86h** | — |

**Kết luận:** 5 coordinators Y1 có thể handle ~50 individual sponsors (17h/người/năm ngoài việc khác). Không quá tải nếu không thêm Cohort Sponsor cùng lúc.

### 4.3 Y1 capacity tổng

| Lane | Y1 max | Coordinator needed |
|---|---|---|
| Individual ($120) | 50 | 2 Coordinators |
| Cohort ($50K) | 1 | 2 Coordinators (dedicated) |
| General Fund ($250K) | 1 | Board-level reporting, không cần Coordinator |
| **Tổng** | 52 sponsors, 70 trẻ | 5 Coordinators |

---

<a name="5"></a>
## 5. COMMUNICATION PROTOCOL (RULES)

### Rule #1 — Không direct contact bao giờ

| Loại contact | Allowed? | Why |
|---|---|---|
| Sponsor → trẻ: thư tay (qua Coordinator) | ✅ Có | Coordinator review |
| Sponsor → phụ huynh: email trực tiếp | ❌ Không | Rủi ro overstep, grooming |
| Sponsor → trẻ: video call 1:1 | ❌ Không bao giờ | Hard rule #1 |
| Sponsor → trẻ: social media | ❌ Không bao giờ | Hard rule #11 |
| Group virtual visit (sponsor + nhiều trẻ + Coordinator + CSO) | ✅ Có | CSO approved |

### Rule #2 — Sponsor letters (viết cho trẻ)

**Sponsor → Trẻ:**
1. Sponsor viết thư (email tới Coordinator, subject: "Letter for Cohort [X] Slot [Y]")
2. Coordinator review trong 5 ngày làm việc:
   - Block nếu: hỏi địa chỉ, số điện thoại, trường học, hỏi gặp mặt
   - Block nếu: tone không phù hợp (quá intimate, quá casual với trẻ)
   - Approve: in ra, đưa cho phụ huynh, phụ huynh đưa cho trẻ đọc
3. Max 2 thư/năm từ mỗi sponsor

**Trẻ → Sponsor (qua phụ huynh + Coordinator):**
1. Trẻ vẽ/viết (có phụ huynh hỗ trợ)
2. Phụ huynh xem + scan
3. Coordinator review (không có thông tin nhận dạng trực tiếp)
4. Forward cho sponsor: "A letter from your sponsored dream 🌟"
5. Max 2 thư/năm

### Rule #3 — Báo cáo tiến độ

**Format báo cáo T+6 / T+12 (1 trang):**

```
NDNUM Progress Report — [Cohort X] · [Tháng/Năm]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trẻ em bạn đang đồng hành: [không tên — chỉ "Dream #ID"]
Tuổi: [band — e.g., "9-10 tuổi"]
Tỉnh/thành: [chỉ tỉnh/thành — không phường/quận]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trong 6 tháng qua:
- [2-3 milestone học tập]
- [1-2 hoạt động nghệ thuật/sáng tạo]
- [1 mục tiêu tiếp theo]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Từ Coordinator: [1 đoạn narrative 50-100 từ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ảnh: [1 ảnh nhóm hoạt động — min 5 trẻ, không uniform, CSO approved]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cảm ơn bạn đã đồng hành với ước mơ.
— [Tên Coordinator], NDNUM Team
```

### Rule #4 — Virtual group visit

| Điều kiện bắt buộc | Detail |
|---|---|
| CSO approve từng session | Email approval trước ≥ 48h |
| Tối thiểu 5 trẻ, tối đa 3 sponsors | Không 1:1 |
| 1 Coordinator + 1 CSO/Lead Mentor hiện diện | Không vắng mặt staff |
| Không recording | Trừ khi có per-session guardian consent |
| Sponsor camera ON | Không ẩn danh trong virtual visit |
| Không trao đổi thông tin liên lạc trong call | Coordinator facilitate toàn bộ |

---

<a name="6"></a>
## 6. $120/NĂM — BẢO TRỢ 1 MẦM SÁNG (Individual Dream Sponsor)

### 6.1 Deliverables (12 tháng)

| # | Deliverable | Timing | Responsible |
|---|---|---|---|
| 1 | Welcome email + program guide | Day 1 | Automated + Coordinator personalize |
| 2 | Báo cáo T+6 (progress report) | Month 6 | Coordinator |
| 3 | Báo cáo T+12 (annual report) | Month 12 | Coordinator |
| 4 | Letter từ trẻ (up to 2) | T+4, T+10 | Phụ huynh → Coordinator → Sponsor |
| 5 | 1 invite virtual group visit | Month 9 | CSO approve |
| 6 | Renewal reminder | Day 335, 358 | Automated |
| 7 | Annual receipt/acknowledgement | Day 365 | Finance |

### 6.2 Tài chính

- Giá: **$120 USD/năm** (hoặc $10/tháng)
- Thanh toán: Lane B donate flow → pay.iai.one → nonprofit bank
- Auto-renew: Stripe subscription (US sponsors) hoặc VietQR annual invoice (VN donors)
- Cancel: any time before renewal date, no refund after processing
- Receipt: email tự động sau khi payment complete (IRS-compliant nếu 501c3 active)

### 6.3 Allocation of $120

| Chi mục | Phần trăm | USD |
|---|---|---|
| Coordinator time (direct program delivery) | 60% | $72 |
| Child activity materials + program costs | 25% | $30 |
| Admin + platform + overhead | 15% | $18 |

### 6.4 Capacity note

- Y1 max: 50 individual sponsors (capacity của 2 Coordinators)
- Khi sponsor > 50: waitlist, không nhận thêm đến khi hire thêm Coordinator

---

<a name="7"></a>
## 7. $50K/NĂM — COHORT SPONSOR

### 7.1 What is a cohort

1 cohort = 20 trẻ Mầm Sáng, 2 Coordinators, 1 năm, 1 thành phố/vùng

### 7.2 Deliverables (12 tháng)

| # | Deliverable | Timing |
|---|---|---|
| 1 | Dedicated Coordinator introduction call | Month 1 |
| 2 | Quarterly board-level report (4 trang) | Month 3, 6, 9, 12 |
| 3 | Cohort ảnh nhóm (6 tháng/lần, CSO approved) | Month 6, 12 |
| 4 | 1 virtual cohort showcase (sponsor có thể xem từ xa) | Month 10 |
| 5 | Annual impact summary (30 trang, branded NDNUM + Sponsor logo in acknowledgement) | Month 12 |
| 6 | Sponsor logo trong annual report NDNUM (nếu consent) | Month 12 |

### 7.3 KYC cho Cohort Sponsor

- Government ID của người ký (hoặc Corporate Certificate of Incorporation)
- AML declaration (nguồn gốc quỹ)
- Anti-corruption acknowledgement (FCPA + Luật phòng chống tham nhũng VN 2018)
- Không phải tobacco, gambling, adult entertainment, anti-LGBT (xem Sponsor Agreement Template Mục 14)

### 7.4 Tài chính

- $50,000/năm → Lane B nonprofit
- Wire transfer (ưu tiên) hoặc check (US) hoặc chuyển khoản bank (VN)
- Installment OK: $25K tháng 1, $25K tháng 7
- Refund policy: pro-rate nếu DSTS cancel; không refund nếu Sponsor cancel sau Month 3

---

<a name="8"></a>
## 8. $250K/NĂM — ANNUAL GENERAL FUND SPONSOR

### 8.1 Purpose

Tài trợ vận hành chương trình tổng thể — không earmark cho trẻ cụ thể hoặc cohort cụ thể.

Chi mục được dùng: lương Coordinator đội, training, technology platform, impact measurement (M&E), legal/compliance overhead.

### 8.2 Deliverables (12 tháng)

| # | Deliverable | Timing |
|---|---|---|
| 1 | Quarterly program update call với Founder | Every 3 months |
| 2 | Full annual report + audited financials | Month 12 |
| 3 | "Founding Sponsor" recognition trong NDNUM materials (logo in footer, press releases) | Ongoing |
| 4 | First right of refusal for next year renewal | Month 11 |

### 8.3 Ràng buộc

- Sponsor KHÔNG có quyền quyết định về chương trình (không phải board seat)
- Sponsor KHÔNG được yêu cầu thay đổi program policy, child safety rules, CSO authority
- Nếu Sponsor yêu cầu vi phạm bất kỳ điều trên → terminate immediately, refund pro-rate

---

<a name="9"></a>
## 9. SPONSOR TERMINATION & CHILD CONTINUITY

### 9.1 Nguyên tắc Continuity

> **DSTS cam kết: trẻ em sẽ được đồng hành liên tục 5 năm (K-12) dù sponsor thay đổi.**

Trẻ em KHÔNG biết ai là sponsor. Khi sponsor rút, trẻ không được thông báo — chương trình tiếp tục bình thường.

### 9.2 Nguồn bridge fund

- Continuity reserve: 10% tất cả donate vào General Pool
- Khi individual sponsor cancel: slot được bridge từ General Pool tối đa 6 tháng
- Coordinator tìm replacement sponsor trong 6 tháng

### 9.3 Termination triggers (DSTS terminate sponsor)

| Trigger | Process |
|---|---|
| Vi phạm Child Safety Rules (Rule #1-12) | Immediate termination, no refund, report to CSO |
| Tìm cách liên hệ trực tiếp trẻ/phụ huynh | Immediate termination |
| Thay đổi pháp nhân thành red-flag industry | Review + terminate nếu không resolve |
| Không pass KYC renewal (bi-annual) | Terminate + return remaining funds |

### 9.4 Sponsor voluntary exit

- Notify 30 ngày trước
- Remaining funds: không refund — vào General Pool cho child continuity
- Sponsor nhận: acknowledgement letter, final report cho period served

---

<a name="10"></a>
## 10. PHOTO & MEDIA POLICY (TÓM TẮT)

*(Xem `NDNUM_CHILD_SAFETY_POLICY.md` Mục 7 cho full detail)*

| Loại | Được phép? | Điều kiện |
|---|---|---|
| Ảnh nhóm ≥5 trẻ | ✅ Có | CSO approve, không uniform, không school logo |
| Video nhóm | ✅ Có (internal report only) | CSO approve + per-session guardian consent |
| Ảnh cá nhân trẻ | ❌ Không bao giờ | — |
| Ảnh trẻ trên social media | ❌ Không bao giờ | Kể cả blurred |
| Tên trẻ trong bất kỳ tài liệu public | ❌ Không bao giờ | Chỉ "Dream #ID" nội bộ |
| Trích dẫn trẻ (anonymized) trong annual report | ✅ Có | Guardian written consent, name masked |

---

<a name="11"></a>
## 11. D1 SCHEMA REFERENCES

*(Wave 3 schema — migration `0008_ndnum_consent.sql` trở đi)*

```sql
-- ndnum_sponsors: sponsor identity + KYC status
CREATE TABLE IF NOT EXISTS ndnum_sponsors (
  id               TEXT PRIMARY KEY,
  external_id      TEXT UNIQUE,     -- hashed from email
  name             TEXT NOT NULL,
  email_encrypted  TEXT NOT NULL,   -- encrypted at rest
  organization     TEXT,
  lane             TEXT NOT NULL CHECK(lane IN ('individual','cohort','general_fund')),
  kyc_status       TEXT NOT NULL DEFAULT 'pending'
                   CHECK(kyc_status IN ('pending','passed','failed','watchlist')),
  kyc_reviewed_at  TEXT,
  kyc_reviewed_by  TEXT,            -- Coordinator ID
  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK(status IN ('pending','active','paused','terminated','churned')),
  red_flag_notes   TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ndnum_sponsor_assignments: sponsor ↔ cohort slot (anonymous)
CREATE TABLE IF NOT EXISTS ndnum_sponsor_assignments (
  id               TEXT PRIMARY KEY,
  sponsor_id       TEXT NOT NULL REFERENCES ndnum_sponsors(id),
  cohort_slot_id   TEXT NOT NULL,   -- internal slot, not child ID
  lane             TEXT NOT NULL,
  assigned_at      TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at       TEXT,
  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK(status IN ('active','transferred','expired','terminated'))
);

-- ndnum_coordinator_logs: all sponsor↔program communication
CREATE TABLE IF NOT EXISTS ndnum_coordinator_logs (
  id               TEXT PRIMARY KEY,
  sponsor_id       TEXT REFERENCES ndnum_sponsors(id),
  coordinator_id   TEXT NOT NULL,
  action           TEXT NOT NULL,   -- 'letter_reviewed', 'report_sent', 'call_conducted', etc.
  notes            TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ndnum_communication_log: letter tracking
CREATE TABLE IF NOT EXISTS ndnum_communication_log (
  id               TEXT PRIMARY KEY,
  sponsor_id       TEXT NOT NULL REFERENCES ndnum_sponsors(id),
  cohort_slot_id   TEXT NOT NULL,
  direction        TEXT NOT NULL CHECK(direction IN ('sponsor_to_child','child_to_sponsor')),
  status           TEXT NOT NULL DEFAULT 'pending_review'
                   CHECK(status IN ('pending_review','approved','blocked','delivered')),
  reviewed_by      TEXT,            -- Coordinator ID
  reviewed_at      TEXT,
  block_reason     TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

<a name="12"></a>
## 12. API REFERENCES (WAVE 3, BLOCKED BY PHASE 0B)

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/ndnum/sponsors/apply` | POST | Turnstile | Sponsor submits inquiry |
| `/api/ndnum/sponsors/donate` | POST | - | Lane B donate with NDNUM tag |
| `/api/admin/ndnum/sponsors` | GET | CF Access JWT | Coordinator: list sponsor queue |
| `/api/admin/ndnum/sponsors/:id/kyc` | PATCH | CF Access JWT | Update KYC status |
| `/api/admin/ndnum/sponsors/:id/assign` | POST | CF Access JWT | Assign to cohort slot |
| `/api/admin/ndnum/communications/:id/review` | PATCH | CF Access JWT | Approve/block letter |

**Sample request — sponsor apply:**
```json
POST /api/ndnum/sponsors/apply
{
  "name": "Nguyễn Văn A",
  "email": "sponsor@example.com",
  "organization": "ABC Corp",
  "lane": "individual",
  "motivation": "Tôi muốn đồng hành với trẻ em Việt...",
  "child_safety_acknowledged": true,
  "turnstile_token": "xxx"
}
```

**Response:**
```json
{ "ok": true, "message": "Cảm ơn bạn! Coordinator sẽ liên hệ trong 3-5 ngày làm việc." }
```

**Guard:** `NDNUM_SPONSOR_APPLICATIONS_ENABLED` env var — `false` until Coordinator staff is hired. Returns `503 NDNUM_COORDINATOR_NOT_READY`.

---

<a name="13"></a>
## 13. ACCEPTANCE CRITERIA & RED LINES

### Red lines (KHÔNG ĐƯỢC vi phạm bất kỳ lúc nào)

| Red line | Consequence |
|---|---|
| Sponsor có thông tin nhận dạng trẻ (tên đầy đủ, trường, địa chỉ) | Terminate sponsor + escalate CSO |
| Trẻ em biết tên sponsor (Rule #3) | CSO incident report |
| Sponsor liên hệ phụ huynh trực tiếp | Terminate + CSO |
| Ảnh trẻ cá nhân xuất hiện trong bất kỳ tài liệu nào | Immediate remove + CSO + guardian notify |
| Coordinator dùng tiền sponsor sai chi mục | Finance audit + legal |

### Acceptance criteria (trước khi launch)

- [ ] Coordinator ít nhất 1 người đã pass background check + 40h training
- [ ] CSO đã approve Communication Protocol này
- [ ] D1 migration `0008_ndnum_sponsors.sql` đã run + tested local
- [ ] `NDNUM_SPONSOR_APPLICATIONS_ENABLED=false` → `true` chỉ khi Coordinator ready
- [ ] Legal letter template có điều khoản "no direct contact" rõ ràng (xem `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md` Appendix #11)

---

<a name="14"></a>
## 14. DEV-READY — IMPLEMENTATION HOOKS

### Files cần đọc trước khi build

```
docs/dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md  ← Mục V, VII
docs/NDNUM_CHILD_SAFETY_POLICY.md                    ← Rules #3, #4, #12
docs/NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md           ← Consent trước sponsor contact
docs/DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md        ← Addendum #11 (NDNUM Cohort)
functions/_lib/api-helpers.js                        ← Response + rate limit pattern
functions/_lib/email.js                              ← sendSponsorAutoReply pattern
```

### Files cần tạo (Wave 3)

```
migrations/0008_ndnum_sponsors.sql    ← D1 schema (Mục 11 above)
functions/api/ndnum/sponsors/apply.js ← POST handler
functions/api/ndnum/sponsors/donate.js← Lane B donate với NDNUM tag
```

### Env vars cần

```
NDNUM_SPONSOR_APPLICATIONS_ENABLED=false  # flip to true when Coordinator ready
COORDINATOR_EMAIL=coordinator@duongsaotoasang.com
CSO_EMAIL=cso@duongsaotoasang.com
```

---

## CHANGELOG

| Phiên bản | Ngày | Tác giả | Ghi chú |
|---|---|---|---|
| v1.0-DRAFT | 2026-05-13 | Claude + Founder | Wave 3 W3.2 — initial fulfillment flow spec |
