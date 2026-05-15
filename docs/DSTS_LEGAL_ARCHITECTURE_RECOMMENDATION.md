---
title: DSTS — Legal Architecture Recommendation (Full Program Chain)
version: v1.0-DRAFT-RECOMMENDATION
status: DRAFT — Founder starting point, requires Legal Counsel VN + US sign-off before any commitment
date: 2026-05-15
authors: [Claude Code — structural recommendation; NOT a substitute for licensed Legal Counsel]
disclaimer: |
  This document is a structural recommendation based on common nonprofit + commercial + investment
  best practices. It is NOT legal advice. Founder MUST engage licensed Legal Counsel in both
  Vietnam and United States before:
    - Executing any contract
    - Opening any bank account
    - Soliciting any donation or investment
    - Registering any program as nonprofit
    - Starting child-related operations
references:
  - dsts-master-plan-v1.2-DRAFT.md (3-layer architecture)
  - dsts-nuoi-duong-nhung-uoc-mo-v1.2-LOCKED.md (NDNUM child program)
  - NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md (FD-1 = Option C fiscal sponsor Y1)
  - DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md (sponsor contract boilerplate)
  - DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md (Lane A/B/C separation)
founder_owned_entities:
  - "Công ty Cổ phần Giải trí Ngôi Sao Việt Can (Vietnam JSC) — commercial/entertainment ready"
  - "Việt Can New Corp (US Corporation) — US legal entity ready"
---

# DSTS — Legal Architecture Recommendation

> **STARTING POINT cho Legal Counsel.** Doc này map toàn bộ chuỗi chương trình DSTS vào structure pháp lý có sẵn (2 entity anh đã có) + đề xuất 1 entity bổ sung (nonprofit) để mở khoá toàn bộ lane.
>
> **Mục tiêu:** Anh có thể launch tất cả chương trình mà KHÔNG bị giới hạn pháp lý, với mỗi lane có entity + bank account + compliance framework riêng.

---

## 0) Tóm tắt 1 trang (Executive Summary)

DSTS có 3 dòng tiền khác nhau, **không được trộn**:

| Lane | Mục đích | Entity đề xuất | Trạng thái Y1 |
|------|---------|----------------|----------------|
| **A — Commercial** | Bán Script Journey, membership, ticket, sponsorship cho commercial event | **Công ty CP Giải trí Ngôi Sao Việt Can** (VN JSC) | ✅ Sẵn sàng vận hành ngay |
| **B — Nonprofit** | Donation, NDNUM child program, general fund | **Việt Can New Corp** (US) → convert/file 501(c)(3) **+** fiscal sponsor Y1 | ⏳ Cần Form 1023 hoặc fiscal sponsor |
| **C — Investment** | Equity, convertible note (future investors) | **NEW: VC Star SPV LLC** (US, Delaware) — chưa lập | 🔴 ĐÓNG Y1-Y2, mở Y3+ |

**Cross-lane rule:** Không có giao dịch trực tiếp giữa A↔B↔C. Mọi transfer phải qua market-rate arms-length contract + tax invoice.

---

## 1) Bản đồ Chương trình DSTS → Lane → Entity

| Chương trình | Hoạt động chính | Lane | Entity | Revenue model |
|--------------|-----------------|------|--------|---------------|
| **Layer 0 — Public Site** | Content, transparency, news | Cross-cutting | Việt Can VN (host) | Operating expense |
| **Layer 1 — Movement Portal** | | | | |
| ├─ Sponsors (13 tiers commercial) | Brand partnership, naming rights | A | Việt Can VN | Sponsor fee 1K-100K USD |
| ├─ Sponsors (NDNUM-tied tiers) | Child program sponsorship | B | Việt Can US (or fiscal sponsor) | Donation tax-deductible |
| ├─ Events (Briefing/Showcase) | Ticketed events, commercial | A | Việt Can VN | Ticket + sponsor |
| ├─ Events (Gala 2026 if charity) | Charity gala (donation-based) | B | Việt Can US (or fiscal sponsor) | Donation + auction |
| ├─ Tour 2026-2027 | Multi-country tour ticket sales | A | Việt Can VN (+ local partner per stop) | Ticket + sponsor + merch |
| ├─ Diaspora Map | Free public resource | Cross | Việt Can VN (host) | None (operating expense) |
| └─ Press / Partners | PR, brand partnerships | A | Việt Can VN | Sponsor + brand fee |
| **Script Journey** (9 scripts) | Personal development courses | A | Việt Can VN | Course fee + cohort fee |
| **Membership tiers** | Subscription-based community | A | Việt Can VN | Monthly/annual fee |
| **NDNUM — Nuôi Dưỡng Những Ước Mơ** | Child mentoring nonprofit | B | Y1 fiscal sponsor → Y2+ Việt Can US 501(c)(3) | Donation only |
| **Star Journey OS** (Layer 2 future) | SaaS platform (creator tools) | A | Việt Can VN (or new tech SPV) | SaaS subscription |
| **Future Investment Round** | Equity/note from accredited investors | C | NEW SPV (Delaware LLC) | Investor capital |

---

## 2) Entity Setup — Chi tiết từng entity

### 2.1 Lane A — Việt Can VN JSC (existing) ✅

**Full name:** Công ty Cổ phần Giải trí Ngôi Sao Việt Can
**Type:** Joint Stock Company (Công ty cổ phần) — Vietnam
**Legal basis:** Luật Doanh nghiệp 2020
**Status:** ✅ Đã thành lập, ready to operate

**Activities permitted (cần verify giấy phép kinh doanh):**
- ✅ Tổ chức biểu diễn nghệ thuật (Mã ngành 9000)
- ✅ Hoạt động sáng tác nghệ thuật và giải trí (9000)
- ✅ Dịch vụ đại diện, môi giới giải trí
- ⚠️ Cần check: Đào tạo (8559) — cho Script Journey courses
- ⚠️ Cần check: Xuất bản nội dung số (5819) — cho digital content
- ⚠️ Cần check: Quảng cáo (7310) — cho sponsor activation
- ⚠️ Cần check: Lập trình máy tính (6201) — cho Star Journey OS SaaS

**Action items:**
- [ ] Legal Counsel review giấy phép kinh doanh hiện tại
- [ ] Bổ sung mã ngành nếu thiếu (filing Phòng ĐKKD ~1-2 tuần)
- [ ] Open USD bank account (BIDV / Vietcombank — verify cross-border)
- [ ] Register tax code, VAT, e-invoice system
- [ ] Setup payroll cho staff (nếu hire VN)

**Tax structure:**
- Corporate Income Tax: 20% trên lợi nhuận
- VAT: 10% trên revenue (xuất hoá đơn)
- Personal Income Tax: nếu thanh toán artist/freelancer cá nhân, withhold 10%
- Special considerations: nếu thu sponsor từ nước ngoài → cần verify withholding tax + DTA (double tax agreement)

**Banking:**
- Account 1: VND operating
- Account 2: USD receiving (cross-border sponsor)
- Cards: corporate debit/credit cho operating expense
- Payment gateway: pay.iai.one (Việt Nam) + Stripe/PayPal (international)

**Compliance frameworks:**
- Luật Doanh nghiệp 2020
- Luật Lao động 2019 (HR)
- Luật Quảng cáo 2012 (marketing)
- Luật Sở hữu trí tuệ 2005 (IP/copyright for content)
- Luật An ninh mạng 2018 + NĐ 13/2023 (data protection)

---

### 2.2 Lane B — Nonprofit Stack (2-tier strategy)

**Y1 (2026-2027) — Fiscal Sponsor (per FD-1 lock):**

Anh không cần lập entity nonprofit ngay. Trong năm đầu, dùng fiscal sponsor để:
- Nhận donation tax-deductible US ngay
- Tránh 6-12 tháng setup 501(c)(3)
- Test program-market fit trước khi commit setup cost

**Fiscal sponsor shortlist (Legal Counsel pick 1):**
| Org | Admin fee | Pros | Cons |
|-----|-----------|------|------|
| **GiveDirectly Foundation** | 5-7% | Strong governance, transparent | Slow approval (3-6 tháng) |
| **Players Philanthropy Fund** | 4-6% | Fast onboarding (~30 ngày) | Sport-focused, có thể không fit |
| **Global Giving** | 8-12% | Built-in fundraising platform | Cao admin fee |
| **Tides Foundation** | 7-9% | Progressive cause alignment | Strict due-diligence |

**Y2-Y3 (2028+) — Việt Can New Corp transition to 501(c)(3):**

**Option B-1 (Recommended): Convert Việt Can New Corp to 501(c)(3)**
- IF Việt Can New Corp hiện đang là regular C-Corp → file Form 1023 (long form, ~$600 fee + 3-6 tháng IRS review)
- Sửa Articles of Incorporation để bao gồm: charitable purpose, prohibition of private inurement, dissolution clause
- Setup independent Board of Directors (≥3 unrelated members)
- Implement conflict-of-interest policy
- Annual Form 990 filing requirement

**Option B-2: Lập new 501(c)(3) entity riêng**
- "Angel Edu Tam Foundation" (như doc cũ đề cập) hoặc "Đường Sao Tỏa Sáng Foundation"
- Lý do tách: giữ Việt Can New Corp cho commercial US activities, foundation chỉ thuần nonprofit
- Cost: ~$600 IRS Form 1023 + state filing ~$50-300 + legal $2-5K

**Vietnam-side nonprofit (Y2+ optional):**
- Lập Quỹ từ thiện hoặc Tổ chức phi lợi nhuận theo NĐ 03/2026
- 3+ sáng lập viên, vốn pháp định 5+ tỷ VND
- Trực thuộc Bộ Nội vụ (national) hoặc UBND tỉnh (local)
- Lý do: nhận donation tax-deductible VN + operate program VN-side hợp pháp

**Lane B banking (separate from Lane A):**
- US side: Mercury Bank hoặc Wells Fargo (501(c)(3) account)
- VN side (Y2+): tài khoản quỹ riêng, separate signing authorities
- NEVER commingle với Lane A accounts

**Lane B compliance frameworks:**
- IRC 501(c)(3) — tax-exempt operations
- IRC 4958 — prohibition against excess benefit transactions
- IRC 6033 — Form 990 annual reporting
- State-level fundraising registration: 40+ states cần register before solicit donation (Unified Registration Statement helps)
- COPPA — Children Online Privacy Protection Act (NDNUM)
- CAPTA — Child Abuse Prevention and Treatment Act (mandatory reporting)
- NĐ 03/2026 (VN side, when established)
- Luật Trẻ em 2016 + NĐ 56/2017 (VN child protection)

---

### 2.3 Lane C — Investment SPV (future, NEW entity Y3+)

**🔴 CRITICAL: Không mở Lane C Y1-Y2. Mọi mention "investment" trong public surface phải bị block.**

**When ready (Y3+ earliest), recommended structure:**

**New entity:** "VC Star Holdings LLC" (Delaware, USA)
- LLC pass-through taxation
- Operating Agreement với equity classes (Class A founder, Class B preferred investor)
- Member managers + Manager
- Registered agent (CT Corporation or similar)

**Why Delaware:**
- Best-in-class corporate law (Court of Chancery)
- Investor-familiar structure (VC funds prefer DE)
- Privacy (no public member disclosure)
- Tax efficiency (no state corporate tax for out-of-state revenue)

**Activities permitted:**
- Equity investment in DSTS commercial entities (Lane A)
- Convertible note offerings
- SAFE (Simple Agreement for Future Equity)
- NEVER fund Lane B nonprofit (would be self-dealing for nonprofit donor)

**Investor onboarding requirements:**
- Accredited Investor verification (SEC Rule 506(b) or 506(c))
- KYC (Know Your Customer) — passport + proof of address + source of funds
- AML (Anti-Money Laundering) — OFAC sanctions check
- Subscription Agreement signed
- Investor Questionnaire completed
- Securities counsel sign-off per offering

**Lane C compliance frameworks:**
- Securities Act of 1933 (registration exemption)
- Securities Exchange Act of 1934 (ongoing reporting)
- SEC Rule 506(b)/(c) — private placement
- Blue Sky laws (state-level)
- Investment Advisers Act (if structured as fund)
- FINRA rules (if broker-dealer involved)
- FATCA (foreign account reporting)
- Vietnam: Luật Chứng khoán 2019 (if VN investors)

**Cost estimate when ready:**
- Securities counsel: $15-30K initial setup + per-offering $5-15K
- LLC formation: $300-500 + registered agent $200/year
- Delaware franchise tax: $400/year minimum
- Annual audit: $10-25K
- Total Y1 of Lane C: ~$30-60K

**Action item NOW (Y1):**
- [ ] Block all "investment" CTAs on public site
- [ ] Add disclaimer trên DONATE / MEMBERSHIP / SPONSOR pages: "Đóng góp này KHÔNG phải đầu tư. Không có lợi nhuận, không có quyền sở hữu, không có quyền kiểm soát."
- [ ] Founder DO NOT discuss equity với donor/sponsor

---

## 3) Cross-Lane Firewall — 5 Rule Bất biến

| # | Rule | Why | Enforcement |
|---|------|-----|-------------|
| 1 | **Zero direct transfer** | A → B transfer = nonprofit private inurement violation; B → A = misuse of charitable funds | Bank accounts separate, ledger code separate, signing authorities separate |
| 2 | **Arms-length contracts only** | Nếu A và B cần collaborate (e.g., A sponsor B event), phải có contract market-rate | Each contract reviewed by Legal Counsel + counter-signed by both entity authorized signatory |
| 3 | **No shared payroll** | Same person trên both A và B payroll = conflict of interest | Each entity has separate employment contract; if Founder works on both, split FTE % + document |
| 4 | **No shared branding (donor confusion test)** | Donor không được tưởng "Việt Can JSC" và "Việt Can Foundation" là cùng 1 entity | Disclaimer mọi public surface: "X is operated by Y entity, a separate legal entity from Z" |
| 5 | **Audit trail per lane** | IRS / Bộ Nội vụ / SEC sẽ audit từng lane riêng | Each lane has own bookkeeping software (QuickBooks separate files), annual audit per lane |

---

## 4) Compliance Stack — Tổng quan luật áp dụng

### 4.1 Vietnam laws
| Law | Áp dụng cho | Action required |
|-----|-------------|-----------------|
| Luật Doanh nghiệp 2020 | Việt Can VN JSC | Annual filing, board meeting minutes |
| Luật Lao động 2019 | All VN staff | Employment contracts, BHXH, BHYT |
| Luật Trẻ em 2016 + NĐ 56/2017 | NDNUM | Child safety policy, mandatory reporting |
| NĐ 13/2023 | All data collection | Privacy policy, breach notice 72h |
| NĐ 03/2026 | VN nonprofit (Y2+) | Foundation registration Bộ Nội vụ |
| Luật Quảng cáo 2012 | Marketing materials | No false claims, child-safe ads |
| Luật Sở hữu trí tuệ 2005 | Content/IP | Trademark, copyright registration |
| Luật An ninh mạng 2018 | Website + data | Data localization considerations |
| Luật Phòng chống tham nhũng 2018 | All operations | Anti-bribery policy, gift register |
| Luật Chứng khoán 2019 | Lane C (future) | Investor protection if VN investors |

### 4.2 United States laws
| Law | Áp dụng cho | Action required |
|-----|-------------|-----------------|
| IRC 501(c)(3) | Việt Can US Foundation | Form 1023 filing, Form 990 annual |
| IRC 4958 | Nonprofit | No excess benefit, comp committee |
| State Charity Registration | 40+ states | Unified Registration Statement |
| COPPA | NDNUM (kids < 13) | Verifiable parental consent |
| CAPTA | All child-related | Mandatory reporting, background checks |
| FCPA | Cross-border | Anti-bribery, books & records |
| FATCA | Foreign accounts | Form 8938 if applicable |
| FTC Act | Advertising | No false/misleading claims |
| Securities Act 1933 | Lane C (future) | Reg D exemption filing |
| Investment Advisers Act | Lane C (future) | Investment adviser registration if managed |

### 4.3 Cross-border + International
| Framework | Áp dụng cho | Action required |
|-----------|-------------|-----------------|
| US-VN Tax Treaty | Transfers VN ↔ US | Form W-8BEN / W-9 filing |
| GDPR | EU donors/users | Privacy policy GDPR-compliant |
| UK GDPR | UK donors/users | Same as GDPR |
| Australia Privacy Act | AU donors/users | APP compliance |
| Canada PIPEDA | CA donors/users | Consent + disclosure |
| OFAC Sanctions | All financial | Block sanctioned countries |
| UNCRC | Child program | UN Convention principles |

---

## 5) Roadmap Implementation (12 tháng)

### Month 1-2 (T6-T7/2026) — Phase 0B Lock
- [ ] Hire CSO (Child Safety Officer) — UNICEF VN alumni or equiv
- [ ] Hire Legal Counsel VN ($3-5K/month retainer)
- [ ] Hire Legal Counsel US ($300-500/hour project-based)
- [ ] Verify Việt Can VN JSC business license — bổ sung mã ngành nếu thiếu
- [ ] Verify Việt Can New Corp US status — federal + state filings current
- [ ] Decide fiscal sponsor (shortlist 3, pick 1)
- [ ] Sign fiscal sponsorship agreement
- [ ] Setup Lane B US bank account through fiscal sponsor

### Month 3-4 (T8-T9/2026) — Phase 0C Soft Launch
- [ ] Lock 13 sponsor tier pricing (commercial)
- [ ] Sign DSTS Sponsor Agreement template với Legal Counsel
- [ ] Open commercial sponsor inquiries (Lane A)
- [ ] NDNUM landing page public (waitlist only, no child intake)
- [ ] Public donation page open (through fiscal sponsor — Lane B)
- [ ] Launch Layer 1 Movement Portal Phase 1.2

### Month 5-6 (T10-T11/2026) — Phase 1 Pilot
- [ ] First commercial event (Lane A revenue)
- [ ] First nonprofit donation campaign (Lane B through fiscal sponsor)
- [ ] M&E Specialist hired
- [ ] Pilot adult mentor program (no children yet)

### Month 7-12 (T12/2026-T5/2027) — Phase 2 Scale
- [ ] File Form 1023 for Việt Can US OR new foundation entity
- [ ] First child cohort (10-20 trẻ, full Phase 0B locked)
- [ ] First impact report (annual)
- [ ] Annual audit Lane A + Lane B
- [ ] Q1/2027: Decide Lane C readiness (Y3+ or further defer)

---

## 6) Founder Action Checklist (ngay sau đọc doc này)

### Immediate (this week)
- [ ] Hand doc này cho Legal Counsel VN (recommend YKVN, VILAF, hoặc Tilleke & Gibbins)
- [ ] Hand doc này cho Legal Counsel US (recommend boutique nonprofit firm)
- [ ] Verify Việt Can VN JSC business license — chụp + share Legal Counsel review
- [ ] Verify Việt Can New Corp US incorporation status — Articles + IRS letter share Legal Counsel

### Within 30 days
- [ ] Open USD account cho Việt Can VN (cross-border ready)
- [ ] Pick fiscal sponsor + sign agreement
- [ ] Hire CSO + Legal retainer (per FOUNDER_ACTION_CHECKLIST Mục 3)
- [ ] Update DSTS public surfaces với entity disclosure footers

### Within 90 days
- [ ] File Form 1023 (if converting Việt Can New Corp to 501(c)(3))
- [ ] First contract executed under each Lane (separate signatories)
- [ ] First audit framework engaged (annual audit firm)
- [ ] Phase 0B sign-off — open NDNUM child program for cohort #1

---

## 7) Red Flags — Things Founder Must NOT Do

🔴 **DO NOT** mix donation money với commercial money (mục đích inurement violation)
🔴 **DO NOT** promise donor any return, equity, or recognition that has financial value
🔴 **DO NOT** use Việt Can VN bank account to receive NDNUM donations
🔴 **DO NOT** use Việt Can US bank account to receive Script Journey course fees
🔴 **DO NOT** launch any child program without CSO sign-off
🔴 **DO NOT** discuss "investment" or "equity" với donor/sponsor (mọi mention cần Legal Counsel review trước)
🔴 **DO NOT** sign any contract that mixes lane (e.g., sponsor agreement promising both commercial branding AND charitable tax deduction)
🔴 **DO NOT** operate child program in jurisdictions where DSTS không có legal presence + CSO local approval
🔴 **DO NOT** publish child identity (photo, name, location, school) on any public surface, EVER
🔴 **DO NOT** delay annual audit / Form 990 / báo cáo Bộ Nội vụ — penalties cumulative

---

## 8) Disclaimers (mandatory on all public surfaces)

### 8.1 Footer text mọi page
```
Đường Sao Tỏa Sáng được vận hành bởi:
  · Lane A — Công ty Cổ phần Giải trí Ngôi Sao Việt Can (Việt Nam, MST: [TBD])
  · Lane B — Việt Can New Corp Foundation (USA, EIN: [TBD]) thông qua [Fiscal Sponsor Name] Y1
Đây là các pháp nhân riêng biệt. Mọi giao dịch tài chính chảy qua entity tương ứng với loại hoạt động.
```

### 8.2 Donate page disclaimer
```
Donation flow qua [Fiscal Sponsor Name], một tổ chức 501(c)(3) US (EIN: [XXX]).
Donation của anh/chị tax-deductible theo luật US. Không phải đầu tư, không có lợi nhuận, không có quyền sở hữu.
DSTS không sử dụng donation cho bất kỳ hoạt động thương mại nào.
```

### 8.3 Membership/Course page disclaimer
```
Khóa học / Membership này là dịch vụ thương mại operated by Công ty Cổ phần Giải trí Ngôi Sao Việt Can (MST: [TBD]).
Phí được sử dụng cho hoạt động vận hành commercial. Không phải donation tax-deductible.
```

### 8.4 NDNUM page disclaimer
```
NDNUM là chương trình phi lợi nhuận trong giai đoạn chuẩn bị. Chưa nhận đăng ký trẻ em.
Mọi hoạt động liên quan trẻ em chỉ được triển khai sau khi hoàn tất:
  1. Child Safety Policy approved bởi CSO
  2. Guardian consent flow legal-reviewed
  3. Pháp nhân Lane B operational với bank account riêng
  4. Coordinator đã hire + trained ≥40h
```

---

## 9) Cost Estimate (legal setup Y1)

| Item | Cost | Timing |
|------|------|--------|
| Legal Counsel VN retainer | $3-5K/tháng × 12 = $36-60K | T6/2026 ongoing |
| Legal Counsel US (project-based) | $300-500/hour × 100h = $30-50K | T6-T12/2026 |
| Fiscal sponsor admin fee | 5-8% of donations | Variable |
| Form 1023 filing (if convert) | $600 IRS + $2-5K legal | T8-T9/2026 |
| State charity registration | $25-100 × 40 states = $1-4K | T9-T10/2026 |
| Trademark registration (VN + US) | $1K + $750 = ~$2K | T7/2026 |
| Annual audit firm engagement | $10-25K | T12/2026 |
| Bank account setup fees | ~$500-1K | T6/2026 |
| CSO + child safety training program | $20-30K | T6-T9/2026 |
| Securities counsel (Lane C readiness Y2 only) | $0 Y1 | Defer |
| D&O insurance (Lane B) | $3-8K/year | T9/2026 |
| **TOTAL Y1 LEGAL + COMPLIANCE** | **$105-185K** | |

---

## 10) Decision Tree cho mỗi hoạt động mới

Trước khi launch bất kỳ chương trình/sản phẩm/event mới, Founder + Legal Counsel chạy decision tree:

```
Q1: Hoạt động này có thu tiền không?
  └─ Không → Operating expense, Lane A (Việt Can VN) chi trả
  └─ Có → Q2

Q2: Tiền thu để chi cho gì?
  └─ Vận hành commercial (course, event, product) → Lane A (Việt Can VN)
  └─ Hỗ trợ child/scholarship/community (no consumer benefit) → Lane B (Foundation/Fiscal Sponsor)
  └─ Return cho người đóng (equity, dividend) → Lane C (SPV) — Y3+ only

Q3 (chỉ với Lane B): Có liên quan trẻ em không?
  └─ Không → Standard nonprofit flow
  └─ Có → CSO sign-off bắt buộc + Phase 0B locked + Guardian consent flow

Q4: Có cross-border element không?
  └─ Không → Standard single-jurisdiction
  └─ Có → US-VN tax treaty + FATCA + currency control compliance

Q5: Có liên quan đến chính phủ (sponsor, contract, grant)?
  └─ Không → Standard private contract
  └─ Có → Anti-corruption review (FCPA + Luật phòng chống tham nhũng VN) trước khi sign
```

---

## 11) Glossary

- **501(c)(3):** Section 501(c)(3) of US Internal Revenue Code — tax-exempt nonprofit status
- **Fiscal Sponsor:** Existing 501(c)(3) that "hosts" your program legally before you have your own status
- **Form 1023:** IRS application for 501(c)(3) recognition
- **Form 990:** Annual information return for 501(c)(3) nonprofits
- **JSC:** Joint Stock Company (Công ty cổ phần) — VN corporate form
- **NĐ:** Nghị định (Decree) — VN regulation
- **SPV:** Special Purpose Vehicle — entity created for specific purpose (e.g., investment)
- **Self-Dealing:** Transaction between nonprofit and insider — generally prohibited
- **Private Inurement:** Nonprofit income benefiting insider — violates 501(c)(3)
- **Inurement vs. Self-dealing:** Inurement is broader (any benefit), self-dealing is specific transactions
- **Arms-length:** Transaction terms equivalent to unrelated third parties (market rate)
- **KYC:** Know Your Customer — identity verification
- **AML:** Anti-Money Laundering — source-of-funds verification

---

## 12) Next Step

1. **Anh đọc doc này 1-2 lần**, note câu hỏi.
2. **Forward cho 2 Legal Counsel** (VN + US) với câu hỏi: "Plan này có gap pháp lý gì? Modify ra sao?"
3. **30-60 min phone call** với mỗi Legal Counsel để review structure
4. **Modify doc → v1.1-LEGAL-REVIEWED** với Legal Counsel sign-off
5. **Founder approve v1.1** → lock thành working framework
6. **Execute Phase 0B locks** theo Roadmap Mục 5

---

## 13) Disclaimer cuối

**This document is NOT legal advice.** This is a structural recommendation that Founder MUST validate with licensed Legal Counsel in both Vietnam and United States before any commitment. Author (Claude Code) is not a lawyer and has no authority to provide legal advice. All recommendations herein are based on publicly available frameworks and best practices, but specific application to DSTS requires licensed professional review.

**Recommended Legal Counsel sources:**
- **Vietnam:** YKVN (Hanoi/HCMC), VILAF, Tilleke & Gibbins, Allens, Mayer Brown JSM
- **United States nonprofit:** Adler & Colvin (San Francisco), Hurwit & Associates (Boston), Pro Bono Partnership (various states)
- **United States securities (Lane C only):** Cooley LLP, Wilson Sonsini, Latham & Watkins

---

**END OF DOCUMENT**
