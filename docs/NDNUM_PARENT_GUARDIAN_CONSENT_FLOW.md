---
title: NDNUM — Parent/Guardian Consent Flow
version: v1.0-DRAFT
status: DRAFT
date: 2026-05-13
authors: [Claude Code — structural draft; Legal Counsel + CSO required before v1.0-LOCKED]
references:
  - dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md (Mục IV.3, XIII Rule #2)
  - NDNUM_CHILD_SAFETY_POLICY.md (Rule #2, Rule #8)
  - DSTS_MOVEMENT_EVENTS_API_CONTRACT.md (Mục 5 child safety enforcement)
  - DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md (sensitive data handling)
blocker: Phase 0B legal lock required before implementation
---

# NDNUM — Parent/Guardian Consent Flow

> **STATUS: DRAFT v1.0 — Structural spec only.**  
> This document requires co-review and approval from Legal Counsel (VN + US) and Child Safety Officer (CSO) before implementation. No guardian consent process may be launched before Phase 0B is complete and this document is v1.0-LOCKED.

---

## Mục 1 — Legal Framework

### 1.1 Vietnam — Luật Trẻ em 2016 (Luật số 102/2016/QH13)

- **Điều 14** — Trẻ em có quyền được bảo vệ thông tin cá nhân. Việc thu thập, sử dụng thông tin cá nhân của trẻ em phải có sự đồng ý của cha, mẹ, người giám hộ.
- **Điều 15** — Quyền riêng tư: trẻ em có quyền bí mật đời sống riêng tư, bí mật cá nhân.
- **Điều 47** — Cha mẹ có nghĩa vụ nuôi dưỡng, chăm sóc và bảo vệ trẻ em.

**Implementation requirement:** Tất cả dữ liệu của trẻ em chỉ được thu thập sau khi có văn bản đồng ý từ cha/mẹ hoặc người giám hộ hợp pháp. Không được thu thập dữ liệu trẻ em dưới bất kỳ hình thức nào trước khi hoàn tất quy trình đồng ý trong tài liệu này.

### 1.2 Vietnam — Nghị định 56/2017/NĐ-CP

- **Điều 7** — Trẻ em tham gia các hoạt động văn hóa, nghệ thuật cần có sự đồng ý của cha mẹ/người giám hộ.
- **Điều 9** — Trẻ em tham gia biểu diễn nghệ thuật: cơ sở biểu diễn phải lưu hồ sơ đồng ý của cha mẹ.
- **Điều 17** — Bảo vệ thông tin riêng tư của trẻ em trong môi trường mạng.

**NDNUM specific:** Mọi sự kiện hoặc hoạt động chương trình có trẻ em tham gia phải có hồ sơ đồng ý lưu trữ tối thiểu 10 năm.

### 1.3 Vietnam — Nghị định 13/2023/NĐ-CP (VN PDPA)

- **Điều 9** — Dữ liệu cá nhân nhạy cảm: dữ liệu trẻ em là dữ liệu nhạy cảm, yêu cầu biện pháp bảo vệ cao nhất.
- **Điều 23** — Xử lý dữ liệu cá nhân của trẻ em: phải có sự đồng ý của cha mẹ/người giám hộ, dữ liệu chỉ dùng đúng mục đích đã cam kết.
- **Điều 26** — Vi phạm dữ liệu: thông báo tới cá nhân bị ảnh hưởng trong vòng **72 giờ**, thông báo tới Cục An toàn thông tin (Bộ TT&TT) trong vòng **72 giờ** nếu vi phạm ≥ 100 hồ sơ.

**72h breach disclosure rule:** Nếu dữ liệu guardian/child bị lộ lọt, NDNUM phải:
1. Thông báo toàn bộ guardian bị ảnh hưởng trong 72h
2. Báo cáo Cục An toàn thông tin nếu vi phạm ≥ 100 hồ sơ
3. Ghi nhật ký sự cố (CSO + Legal sign-off)

### 1.4 United States — Children's Online Privacy Protection Act (COPPA)

Applicable when:
- Child resides in the US OR guardian is US-based
- NDNUM digital platform accessible from the US

Key requirements:
- **Verifiable Parental Consent (VPC):** Before collecting any personal information from a child under 13
- **Direct notice:** Clear, plain-language notice to guardian of what is collected, how it is used, who may access it
- **Right of review and deletion:** Guardian may review, update, or delete child's information
- **No conditioning:** Cannot condition participation on collection of more data than minimally necessary

FTC-approved VPC methods: see Mục 9 for full technical detail.

### 1.5 United States — Child Abuse Prevention and Treatment Act (CAPTA)

- Mandatory reporter obligations for all staff who interact with children (see NDNUM_CHILD_SAFETY_POLICY.md Mục 5)
- Guardian consent does NOT override mandatory reporting obligation

### 1.6 European Union — GDPR Article 8

Applicable when guardian is an EU resident:
- Lawful basis for processing child data: **explicit parental consent** (Article 6(1)(a) + Article 9(2)(a))
- Age of digital consent: **16 years** under GDPR (or lower if member state sets lower threshold, min 13)
- Special category data: health/wellbeing data (SDQ scores) requires Article 9 explicit consent
- Right to erasure (Article 17): guardian may request deletion; NDNUM must comply within 30 days unless legal retention obligation applies

### 1.7 United Kingdom — Children Act 2004

Applicable for UK diaspora children:
- Section 11: local authorities and organizations with functions relating to children must make arrangements for ensuring their functions are discharged having regard to the need to safeguard and promote the welfare of children
- DBS check requirement (see NDNUM_MENTOR_SCREENING_AND_TRAINING.md)

### 1.8 Conflict of Laws Rule

**When two or more legal systems apply (e.g., VN child attending DSTS AU tour), NDNUM applies the MORE protective standard in every case.**

Example: GDPR requires erasure within 30 days; VN Nghị định 13 requires notification within 72h of breach. NDNUM applies both: 30-day erasure AND 72h breach notification.

---

## Mục 2 — Guardian Verification Methods

NDNUM accepts exactly **5 methods** for verifying guardian identity and obtaining consent. These mirror COPPA FTC-approved VPC methods adapted for multi-jurisdiction operation.

### Method 1 — Video Verification Call (Preferred)

**Process:**
1. Guardian schedules 30-minute video call with Coordinator (calendly link or direct scheduling)
2. Coordinator records call START with guardian's verbal permission (per-session only — no carry-over)
3. Guardian presents government-issued photo ID on camera (passport, CCCD, state driver's license)
4. Coordinator reads consent form aloud, guardian confirms understanding
5. Guardian gives verbal consent on camera with date and program name stated
6. Coordinator uploads encrypted recording to D1 `consent_log` with `method = 'video_call'`
7. CSO reviews recording within 5 business days and marks `cso_reviewed_by`

**Acceptable IDs:**
- Vietnam: Căn cước công dân (CCCD/CCCD gắn chip), hộ chiếu, chứng minh nhân dân
- US/AU/UK/EU: National passport or government-issued photo ID

**Recording storage:** AES-256 encrypted, access restricted to CSO + Legal Counsel only. Retained 10 years.

### Method 2 — Scanned Signed Paper Consent Form

**Process:**
1. Coordinator mails or emails physical consent form template (see Mục 4)
2. Guardian prints, signs with blue/black ink (no digital signature on this method), dates
3. Guardian scans and emails signed copy to designated NDNUM email (not accessible to general staff)
4. Original signed paper must be mailed to DSTS physical address within 30 days
5. Coordinator logs receipt with `method = 'paper_scan_pending_original'`
6. Upon original receipt: `method = 'paper_original_received'`, CSO reviews

**Acceptable signatures:** Guardian's wet signature (pen on paper). Electronic signature on printed form: NOT acceptable under this method (use Method 3 for e-signature).

### Method 3 — Qualified Electronic Signature with Identity Verification

**Process:**
1. NDNUM sends consent package via qualified e-signature platform
2. **Vietnam:** ViettelCA, VNPT-CA, or BKAV-CA qualified e-signature (Nghị định 130/2018)
3. **US/AU/UK:** DocuSign Identity Verification (government ID + selfie match) or equivalent
4. **EU:** Qualified Electronic Signature (QES) under eIDAS Regulation
5. Platform-generated audit trail + identity verification certificate uploaded to `consent_log`

**Cost note:** Qualified e-signature platforms charge per document ($1-5 USD). Budget for 200 guardian consents Y1 = $200-1,000.

### Method 4 — In-Person Signing at DSTS Event

**Process:**
1. Coordinator or Lead Mentor brings printed consent forms to DSTS event where guardian is present
2. Guardian reads form, asks questions
3. Guardian signs in presence of Coordinator/Lead Mentor (witness)
4. Coordinator/Lead Mentor countersigns as witness
5. Form scanned and logged within 24h
6. CSO reviews within 5 business days

**Requirement:** Witness must be trained Coordinator or above. Volunteer Support cannot witness consent.

### Method 5 — Phone + Email Confirmation Chain (Emergency Only)

**Use case:** Guardian cannot use Methods 1-4 due to documented emergency (medical, natural disaster, evacuation). Requires CSO pre-approval to use this method.

**Process:**
1. CSO pre-approves use of Method 5 in writing (email to NDNUM records)
2. Coordinator conducts 15-minute recorded phone call (guardian verbal consent, scripted questions)
3. Immediately after call, Coordinator sends detailed email to guardian summarizing what was agreed
4. Guardian replies to email confirming (email reply constitutes second-factor)
5. Both phone recording and email chain logged
6. CSO must follow up with guardian for Method 1, 2, 3, or 4 signature within 60 days
7. Until permanent signature obtained, child participation limited to general group activities (no sensitive assessments, no media)

**Expiry:** Method 5 consent expires after 60 days if not converted to another method.

---

## Mục 3 — 10-Step Consent Flow

```
Step 1: Discovery
    Guardian encounters NDNUM via referral, event, or /dream-nurture page
    ↓
Step 2: Information Pack
    Coordinator sends info pack to guardian only (no child data collected)
    Info pack includes: program overview, 12 rules plain-language, privacy notice, FAQ
    ↓
Step 3: Interest Form
    Guardian submits interest form → guardian_accounts table (NO child name, NO school)
    Fields: guardian full name, relationship to child, contact email, country, referral source
    ↓
Step 4: Eligibility Pre-Screen Call
    Coordinator + guardian, 15 minutes, no child present
    Checks: child age (4-17), location, guardian's ability to commit to program
    If ineligible: kind decline letter, no data retained beyond 30 days
    ↓
Step 5: Consent Bundle
    Coordinator sends via secure email:
    - Full consent form (see Mục 4)
    - Privacy notice (plain language, VI + EN)
    - 12 Immutable Rules summary (1 page)
    - FAQ: what data do we collect and why?
    - Contact for questions: CSO email + phone
    ↓
Step 6: Guardian Consent Signing
    Guardian chooses one of 5 verification methods (Mục 2)
    Consent signed → consent_log entry created with status = 'pending_cso_review'
    ↓
Step 7: CSO Review + Approval
    CSO reviews consent record within 5 business days
    Checks: ID matches, consent clear, no duress indicators, form complete
    Approves → consent_log.status = 'approved', guardian_accounts.status = 'active'
    Rejects → Coordinator contacts guardian, restart from Step 6
    ↓
Step 8: Child Intake Assessment
    CSO or Lead Mentor present (mandatory)
    Guardian present (mandatory)
    No sponsor present (prohibited — Rule #3)
    Coordinator conducts 60-minute structured interview
    Topics: child's interests, developmental stage, learning style, guardian expectations
    Child given age-appropriate assent form (age 8+): "Do you want to join this program?"
    ↓
Step 9: Program Assignment + Coordinator Introduction
    Child assigned to cohort and Coordinator
    Guardian meets Coordinator (video or in-person, no child present for this meeting)
    Guardian given Coordinator contact info (program email only, no personal mobile)
    Child NOT told about sponsors
    ↓
Step 10: Annual Renewal
    12 months after enrollment:
    Coordinator contacts guardian 30 days before renewal date
    Steps 5-7 repeated (re-send bundle, re-sign consent)
    Child re-assent (age 8+): verbal assent to continue
    If guardian declines renewal: Steps as per Mục 5 "Guardian withdraws consent"
```

### 3.1 Consent Timeline Requirements

| Step | SLA | Responsible |
|------|-----|-------------|
| Info pack sent after interest form | 5 business days | Coordinator |
| Eligibility call scheduled | 10 business days after interest form | Coordinator |
| Consent bundle sent after call | 3 business days | Coordinator |
| CSO review after signing | 5 business days | CSO |
| Intake assessment scheduled | 10 business days after CSO approval | Coordinator |
| Annual renewal notice sent | 30 days before renewal date | System (automated) |
| Annual renewal deadline | 14 days before renewal date | Guardian |

---

## Mục 4 — Consent Form Template (VI/EN)

### 4.1 Vietnamese Version

```
---
CHƯƠNG TRÌNH NUÔI DƯỠNG NHỮNG ƯỚC MƠ (NDNUM)
ĐƯỜNG SAO TỎA SÁNG (DSTS)

PHIẾU ĐỒNG Ý THAM GIA CHƯƠNG TRÌNH
VERSION: v1.0-DRAFT — Chưa có hiệu lực pháp lý cho đến khi được Legal Counsel phê duyệt

THÔNG TIN NGƯỜI GIÁM HỘ:
Họ tên đầy đủ: _______________________
Số CCCD/Hộ chiếu: _______________________
Mối quan hệ với trẻ: _______________________
Địa chỉ liên lạc (email): _______________________
Số điện thoại: _______________________

THÔNG TIN TRẺ EM (không điền tên đầy đủ ở đây — Chương trình sẽ cấp ID nội bộ):
Ngày sinh: _______________________
Giới tính tự khai (tùy chọn): _______________________
Quốc gia sinh sống: _______________________

CHƯƠNG TRÌNH LÀ GÌ:
Nuôi Dưỡng Những Ước Mơ (NDNUM) là chương trình hỗ trợ phát triển toàn diện cho trẻ em
Việt Nam toàn cầu, do Đường Sao Tỏa Sáng (DSTS) điều hành. Chương trình cung cấp:
- Điều phối viên chuyên trách (Coordinator) đồng hành tối thiểu 5 năm
- Cơ hội tham gia các hoạt động nghệ thuật, văn hóa phù hợp lứa tuổi
- Mạng lưới hỗ trợ cộng đồng (không có giao tiếp trực tiếp sponsor-trẻ)

THÔNG TIN THU THẬP:
Chúng tôi thu thập và xử lý các thông tin sau về con/em của quý vị:
□ Thông tin liên lạc của người giám hộ (email, số điện thoại)
□ Ngày sinh và độ tuổi của trẻ (không phải tên đầy đủ trong hệ thống công khai)
□ Kết quả đánh giá phát triển (SDQ — Strengths and Difficulties Questionnaire), ẩn danh
□ Nhật ký quan sát hàng tuần của Coordinator (nội bộ, không chia sẻ với sponsor)
□ Ảnh nhóm (tối thiểu 5 trẻ cùng frame, không đồng phục, CSO phê duyệt trước khi chụp)

THÔNG TIN KHÔNG THU THẬP:
□ Tên trường học của trẻ
□ Địa chỉ nhà của trẻ
□ Tên đầy đủ của trẻ trong bất kỳ tài liệu công khai nào
□ Thông tin y tế (trừ trường hợp khẩn cấp có sự đồng ý riêng)

MỤC ĐÍCH SỬ DỤNG THÔNG TIN:
- Quản lý chương trình và phát triển cá nhân hóa cho từng trẻ
- Báo cáo nội bộ cho Ban điều hành và Hội đồng quản trị (ẩn danh theo cohort)
- Nghiên cứu tác động (k-ẩn danh ≥ 5: không công bố số liệu về nhóm ít hơn 5 trẻ)
- Tuân thủ nghĩa vụ pháp lý

THỜI GIAN LƯU TRỮ:
- Dữ liệu chương trình: xóa trong 30 ngày sau khi trẻ rời chương trình hoặc theo yêu cầu
- Hồ sơ đồng ý và hồ sơ sự cố: lưu trữ tối thiểu 10 năm theo quy định pháp lý
- Nhật ký bảo mật: lưu trữ vĩnh viễn theo quy định

12 QUY TẮC KHÔNG THAY ĐỔI (TÓM TẮT):
(1) Không có giao tiếp 1:1 giữa mentor và trẻ — luôn có ≥ 2 người lớn
(2) Cần đồng ý của quý vị trước mỗi hoạt động mới
(3) Trẻ sẽ không biết sponsor là ai
(4) Không đăng ảnh/thông tin cá nhân của trẻ công khai
(5) Độ tuổi tối thiểu tham gia: 4 tuổi
(6) Cán bộ An toàn Trẻ em (CSO) có quyền dừng bất kỳ hoạt động nào
(7) Tất cả nhân viên có nghĩa vụ báo cáo nghi ngờ xâm hại trong 24 giờ
(8) Không ghi hình/ghi âm trẻ mà không có đồng ý riêng từng buổi
(9) Tất cả nhân viên đều được kiểm tra lý lịch tư pháp trước khi tiếp xúc với trẻ
(10) Nguyên tắc 2 người: không bao giờ để trẻ 1:1 với bất kỳ người lớn nào
(11) Nhân viên không được đăng ảnh trẻ lên mạng xã hội cá nhân
(12) Khi trẻ rời chương trình, có kế hoạch chuyển tiếp chính thức

QUYỀN CỦA QUÝ VỊ:
- Rút đồng ý bất kỳ lúc nào bằng cách liên hệ: ndnum@duongsaotoasang.com
- Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu của con/em
- Khiếu nại với Cục An toàn thông tin (Bộ TT&TT) nếu cho rằng quyền lợi bị vi phạm
- Liên hệ trực tiếp CSO qua đường dây độc lập: [CSO email — điền sau khi CSO được tuyển dụng]

CHỮ KÝ:
Tôi xác nhận rằng tôi là cha/mẹ/người giám hộ hợp pháp của trẻ nêu trên.
Tôi đã đọc và hiểu toàn bộ thông tin trên.
Tôi đồng ý để con/em tham gia chương trình NDNUM theo các điều khoản đã nêu.

Họ tên: _______________________
Ngày: _______________________
Chữ ký: _______________________

[DÀNH CHO NDNUM NỘI BỘ — Không điền khi gửi cho guardian]
Coordinator xác nhận: _______ Ngày: _______
CSO phê duyệt: _______ Ngày: _______
Phương thức xác minh: _______
ID hồ sơ consent_log: _______
---
```

### 4.2 English Version

```
---
NURTURING DREAMS PROGRAM (NDNUM)
ĐƯỜNG SAO TỎA SÁNG (DSTS)

PROGRAM PARTICIPATION CONSENT FORM
VERSION: v1.0-DRAFT — Not legally effective until approved by Legal Counsel

GUARDIAN INFORMATION:
Full legal name: _______________________
Government ID number (passport / national ID): _______________________
Relationship to child: _______________________
Contact email: _______________________
Phone number: _______________________

CHILD INFORMATION (do not enter full name here — program assigns internal ID):
Date of birth: _______________________
Country of residence: _______________________

ABOUT THE PROGRAM:
Nurturing Dreams (NDNUM) is a long-term child development program supporting Vietnamese
children globally, operated by Đường Sao Tỏa Sáng (DSTS). The program provides:
- A dedicated salaried Coordinator who stays with the child for a minimum of 5 years
- Age-appropriate arts and cultural development opportunities
- Community support network (no direct sponsor-to-child contact)

DATA WE COLLECT:
□ Guardian contact information (email, phone)
□ Child's date of birth and age band (full name not used in any public system)
□ Developmental assessments (SDQ — anonymized, cohort-level reporting only)
□ Weekly Coordinator observation notes (internal only, not shared with sponsors)
□ Group photos (minimum 5 children per frame, no uniforms, CSO pre-approves)

DATA WE DO NOT COLLECT:
□ Child's school name
□ Child's home address
□ Child's full name in any public document
□ Medical information (except emergency, separate consent required)

HOW WE USE YOUR DATA:
- Program delivery and individual development tracking
- Internal reporting to management and board (anonymized, cohort-level)
- Impact research (k-anonymity ≥ 5: no statistic published for groups under 5 children)
- Legal compliance

DATA RETENTION:
- Program data: deleted within 30 days of program exit or guardian request
- Consent records and incident records: retained minimum 10 years (legal requirement)
- Security logs: permanent retention as required

12 IMMUTABLE RULES (SUMMARY):
(1) No 1:1 contact between any adult and child — always ≥ 2 adults present
(2) Your consent required before each new activity
(3) Your child will never know who sponsors them
(4) No individual child photo or personal information published publicly
(5) Minimum participation age: 4 years
(6) Child Safety Officer (CSO) may halt any activity at any time
(7) All staff must report suspected abuse within 24 hours
(8) No recording of children without per-session consent — previous consent does not carry over
(9) All staff complete background checks before any contact with children
(10) Two-person integrity: no child is ever alone with any single adult
(11) Staff may not post child images on personal social media accounts
(12) When a child exits the program, a formal transition plan is required

YOUR RIGHTS:
- Withdraw consent at any time: contact ndnum@duongsaotoasang.com
- Request access, correction, or deletion of your child's data
- Lodge a complaint with the relevant data protection authority
- Contact the CSO directly via independent line: [CSO contact — to be filled after hiring]

SIGNATURE:
I confirm that I am the legal parent/guardian of the child named above.
I have read and understood all of the above information.
I consent to my child's participation in the NDNUM program under the terms stated.

Full name: _______________________
Date: _______________________
Signature: _______________________

[FOR NDNUM INTERNAL USE ONLY — Do not complete when sending to guardian]
Coordinator confirmed: _______ Date: _______
CSO approved: _______ Date: _______
Verification method used: _______
consent_log record ID: _______
---
```

---

## Mục 5 — Edge Cases

### 5.1 Divorced or Separated Parents

**Default rule:** Both parents with parental rights must sign consent.

**Exception — sole custody:** If one parent holds sole legal custody, provide:
- Court order granting sole custody (certified copy)
- Declaration from presenting parent stating other parent has no custody rights
- CSO reviews documentation before approving consent

**Exception — one parent unreachable:** 
- Documented written attempts to contact over 30 days
- Legal declaration from present parent
- CSO case-by-case decision, documented in `consent_log`

**Prohibited:** DSTS cannot accept one parent's assurance that the other parent agrees. Written documentation required.

### 5.2 Foster Care

**Required documentation:**
- Licensed foster agency consent (on agency letterhead, signed by case worker)
- Foster parent consent (standard form)
- Any court-imposed restrictions on activities (e.g., no media, no travel)

**Process:**
- Coordinator liaises with case worker, not directly with biological parents
- Renewal requires agency re-authorization each program year
- If foster placement changes mid-year: immediate program hold until new guardian consents

### 5.3 Single Guardian (Other Parent Deceased)

**Required documentation:**
- Death certificate (certified copy) OR
- Court declaration of sole surviving guardian

Documents retained in encrypted storage, access restricted to CSO + Legal Counsel.

### 5.4 Guardian Relocates Mid-Year

1. Guardian informs Coordinator of relocation
2. Coordinator triggers re-consent: Steps 5-7 of Mục 3 re-run
3. Child's program assignment continues during re-consent process (max 30-day grace period)
4. If guardian in different country: recheck applicable law (may require additional consent elements)
5. If guardian unreachable for >60 days after known relocation: program hold, CSO review

### 5.5 Guardian Withdraws Consent

Withdrawal is immediate and unconditional. DSTS does not contest, delay, or conditionally accept withdrawals.

**NDNUM response within 24 hours of withdrawal:**
1. Child exits all program activities immediately
2. Coordinator notified; no further contact with child
3. All child profile data scheduled for deletion within 30 days
4. Consent records and incident records (if any) retained per legal requirement (10 years)
5. Guardian receives written confirmation of withdrawal and data deletion timeline
6. Child receives age-appropriate explanation from Lead Mentor or CSO (not Coordinator)

**Data the guardian may NOT force deletion of:**
- Incident reports filed with authorities
- Records required for ongoing legal proceedings
- Anonymized aggregate cohort data (no individual identified)

### 5.6 Child Refuses Assent (Age 8+)

Children age 8 and above are asked for their assent (not legally binding consent, but ethically required per NDNUM values):

- If child declines assent: DSTS honors the child's decision regardless of guardian consent
- Child not enrolled against their will
- Coordinator documents refusal, no consequences to child or guardian
- Guardian may re-introduce program after 6-month cooling off period

### 5.7 Guardian Has Limited Literacy

- Coordinator reads entire consent form aloud (one of: VI or EN or both)
- Process recorded (with guardian's verbal permission)
- Guardian may bring a trusted adult to assist (not DSTS staff)
- If guardian cannot sign: CSO-approved verbal consent + witness signature + recording

### 5.8 Emergency Medical Treatment

Guardian consent for program activities does NOT constitute consent for medical treatment. If a child requires emergency medical treatment:

1. Emergency services called immediately (no delay for consent)
2. Guardian contacted immediately after emergency services
3. DSTS follows emergency responder instructions
4. CSO notified within 2 hours of any medical emergency
5. Incident report filed (Type A/B based on severity — see NDNUM_CHILD_SAFETY_POLICY.md Mục 5)

---

## Mục 6 — D1 Schema

### 6.1 Table: `guardian_accounts`

```sql
-- Migration: 0008_ndnum_consent.sql

CREATE TABLE guardian_accounts (
  id                    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  external_id_hash      TEXT UNIQUE NOT NULL,     -- SHA-256 of guardian email, for deduplication
  display_name          TEXT NOT NULL,            -- Guardian full name (encrypted at rest)
  contact_email_enc     TEXT NOT NULL,            -- AES-256 encrypted email
  contact_phone_enc     TEXT,                     -- AES-256 encrypted phone (optional)
  country_code          TEXT NOT NULL,            -- ISO 3166-1 alpha-2 (VN, US, AU, GB, etc.)
  relationship_to_child TEXT NOT NULL CHECK(relationship_to_child IN (
    'parent_biological', 'parent_adoptive', 'legal_guardian',
    'foster_parent', 'relative_court_appointed', 'other_documented'
  )),
  custody_notes         TEXT,                     -- Notes on custody status (sole, joint, foster agency)
  consent_method        TEXT CHECK(consent_method IN (
    'video_call', 'paper_original_received', 'paper_scan_pending_original',
    'qualified_esignature', 'in_person_witness', 'phone_email_emergency'
  )),
  consent_verified_at   TEXT,                     -- ISO 8601 datetime
  consent_renewed_at    TEXT,                     -- ISO 8601 datetime of most recent annual renewal
  consent_expires_at    TEXT,                     -- 12 months after consent_verified_at
  cso_reviewed_by       TEXT REFERENCES ndnum_staff(id),
  status                TEXT NOT NULL DEFAULT 'pending_consent' CHECK(status IN (
    'pending_consent', 'pending_cso_review', 'active', 'suspended',
    'withdrawn', 'expired', 'rejected'
  )),
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_guardian_accounts_status ON guardian_accounts(status);
CREATE INDEX idx_guardian_accounts_expires ON guardian_accounts(consent_expires_at);
```

### 6.2 Table: `child_profiles`

```sql
CREATE TABLE child_profiles (
  id                    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  program_id            TEXT UNIQUE NOT NULL,     -- Internal ID (e.g., NDNUM-2027-0001) — NOT child's real name
  age_band              TEXT NOT NULL CHECK(age_band IN (
    '4-6', '7-9', '10-12', '13-15', '16-17'
  )),
  birth_year            INTEGER NOT NULL,         -- Year only, not full date (privacy minimization)
  cohort_id             TEXT REFERENCES ndnum_cohorts(id),
  guardian_account_id   TEXT NOT NULL REFERENCES guardian_accounts(id),
  coordinator_id        TEXT REFERENCES ndnum_staff(id),
  enrollment_date       TEXT NOT NULL,            -- ISO 8601 date
  program_tier          TEXT NOT NULL DEFAULT 'tang_1' CHECK(program_tier IN (
    'tang_1', 'tang_2', 'tang_3', 'tang_4', 'tang_5'
  )),
  status                TEXT NOT NULL DEFAULT 'active' CHECK(status IN (
    'pending_intake', 'active', 'on_hold', 'graduated', 'exited_voluntary',
    'exited_guardian_withdrawal', 'transferred', 'aged_out'
  )),
  exit_date             TEXT,                     -- ISO 8601 date
  exit_reason           TEXT,                     -- Brief notes for internal continuity
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

-- NOTE: No name column. No school column. No address column.
-- program_id is the only identifier used in all program records.

CREATE INDEX idx_child_profiles_cohort ON child_profiles(cohort_id);
CREATE INDEX idx_child_profiles_status ON child_profiles(status);
CREATE INDEX idx_child_profiles_guardian ON child_profiles(guardian_account_id);
```

### 6.3 Table: `consent_log`

```sql
CREATE TABLE consent_log (
  id                    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  guardian_account_id   TEXT NOT NULL REFERENCES guardian_accounts(id),
  consent_type          TEXT NOT NULL CHECK(consent_type IN (
    'program_enrollment', 'annual_renewal', 'photo_group', 'recording_session',
    'media_publication', 'data_research_use', 'emergency_method5'
  )),
  consent_at            TEXT NOT NULL,            -- ISO 8601 datetime
  method                TEXT NOT NULL CHECK(method IN (
    'video_call', 'paper_original_received', 'paper_scan_pending_original',
    'qualified_esignature', 'in_person_witness', 'phone_email_emergency'
  )),
  witness_staff_id      TEXT REFERENCES ndnum_staff(id),
  file_ref              TEXT,                     -- Encrypted storage path (not public URL)
  cso_reviewed_by       TEXT REFERENCES ndnum_staff(id),
  cso_reviewed_at       TEXT,
  revoked_at            TEXT,                     -- If guardian withdraws this specific consent
  revocation_reason     TEXT,
  notes                 TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_consent_log_guardian ON consent_log(guardian_account_id);
CREATE INDEX idx_consent_log_type ON consent_log(consent_type);
CREATE INDEX idx_consent_log_revoked ON consent_log(revoked_at) WHERE revoked_at IS NOT NULL;
```

### 6.4 Table: `ndnum_cohorts` (reference)

```sql
CREATE TABLE ndnum_cohorts (
  id                    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  cohort_name           TEXT NOT NULL,            -- e.g., "Cohort 2027-A"
  program_year          INTEGER NOT NULL,
  max_capacity          INTEGER NOT NULL DEFAULT 20,
  current_enrollment    INTEGER NOT NULL DEFAULT 0,
  start_date            TEXT NOT NULL,
  end_date              TEXT,
  status                TEXT NOT NULL DEFAULT 'forming' CHECK(status IN (
    'forming', 'active', 'completed', 'cancelled'
  )),
  created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 6.5 Migration File: `migrations/0008_ndnum_consent.sql`

```sql
-- Migration: 0008_ndnum_consent.sql
-- Description: NDNUM guardian consent + child profile tables
-- Depends on: migrations/0001-0007 (prior migrations)
-- Blocker: DO NOT APPLY until Phase 0B legal lock complete
-- Apply command: npx wrangler d1 migrations apply duongsaotoasang-com --local (local)
--               npx wrangler d1 migrations apply duongsaotoasang-com (production)

-- Run the CREATE TABLE statements from Mục 6.1 - 6.4 above in order:
-- 1. ndnum_cohorts (no FK dependency)
-- 2. guardian_accounts (depends on ndnum_staff from migration 0007 or 0008a)
-- 3. child_profiles (depends on guardian_accounts + ndnum_cohorts)
-- 4. consent_log (depends on guardian_accounts)

-- NOTE: ndnum_staff table reference — if 0007_events.sql does not include ndnum_staff,
-- this migration must include a stub ndnum_staff table or be sequenced after the
-- NDNUM_MENTOR_SCREENING_AND_TRAINING migration creates it.

-- Rollback:
-- DROP TABLE IF EXISTS consent_log;
-- DROP TABLE IF EXISTS child_profiles;
-- DROP TABLE IF EXISTS guardian_accounts;
-- DROP TABLE IF EXISTS ndnum_cohorts;
```

---

## Mục 7 — API Endpoints

> **Blocker:** All endpoints below are Phase 0B blocked. `NDNUM_CHILD_REGISTRATION_ENABLED=false` env gate returns `503 SERVICE_UNAVAILABLE` for all write operations.

### 7.1 POST `/api/ndnum/guardian/register`

Guardian creates account. No child data submitted at this step.

**Request:**
```json
{
  "fullName": "Nguyễn Thị Lan",
  "email": "lan@example.com",
  "phone": "+84901234567",
  "countryCode": "VN",
  "relationshipToChild": "parent_biological",
  "referralSource": "event | website | referral | social | other",
  "turnstileToken": "...",
  "idempotencyKey": "guardian-reg-uuid-v4"
}
```

**Response 201:**
```json
{
  "ok": true,
  "guardianAccountId": "a1b2c3d4",
  "status": "pending_consent",
  "nextStep": "coordinator_will_contact",
  "message": "Chúng tôi đã nhận thông tin và sẽ liên hệ trong 5 ngày làm việc."
}
```

**Response 503 (Phase 0B gate):**
```json
{
  "ok": false,
  "error": "NDNUM_COORDINATOR_NOT_READY",
  "message": "Chương trình đang trong giai đoạn chuẩn bị. Vui lòng đăng ký nhận thông báo.",
  "newsletterUrl": "/api/newsletter/subscribe"
}
```

**Validation rules:**
- Email: unique per `external_id_hash`; re-registration of same email returns existing account ID
- Idempotency key: 24h window
- Turnstile: required on all public endpoints
- Rate limit: 3 registrations per IP per hour

### 7.2 POST `/api/ndnum/guardian/consent`

Guardian submits consent. Only callable after account created and Coordinator has sent consent bundle.

**Request (multipart/form-data):**
```
guardianAccountId: string
consentType: "program_enrollment"
method: "paper_scan_pending_original" | "qualified_esignature" | "in_person_witness" | "phone_email_emergency"
consentedAt: ISO 8601 datetime
file: [binary — scanned form or e-signature certificate, max 10MB, PDF only]
idempotencyKey: string
```

**Note:** Method `video_call` is not submitted via API — Coordinator logs it directly in admin console.

**Response 202:**
```json
{
  "ok": true,
  "consentLogId": "c1d2e3f4",
  "status": "pending_cso_review",
  "reviewSla": "5 business days",
  "message": "Đã nhận phiếu đồng ý. CSO sẽ xét duyệt trong 5 ngày làm việc."
}
```

### 7.3 GET `/api/admin/ndnum/consent-queue` (CSO Admin — CF Access JWT)

Returns list of consent records pending CSO review.

**Headers:** `CF-Access-Jwt-Assertion: <token>`

**Response 200:**
```json
{
  "ok": true,
  "queue": [
    {
      "consentLogId": "c1d2e3f4",
      "guardianAccountId": "a1b2c3d4",
      "guardianCountry": "VN",
      "consentType": "program_enrollment",
      "method": "paper_scan_pending_original",
      "submittedAt": "2027-01-15T08:00:00Z",
      "fileRef": "/secure/consents/c1d2e3f4.pdf",
      "daysPending": 2
    }
  ],
  "totalPending": 1,
  "overdueCount": 0
}
```

### 7.4 PATCH `/api/admin/ndnum/consent/:id/approve` (CSO Admin — CF Access JWT)

CSO approves or rejects a consent record.

**Headers:** `CF-Access-Jwt-Assertion: <token>`

**Request:**
```json
{
  "decision": "approved" | "rejected",
  "notes": "ID verified, form complete",
  "idempotencyKey": "approve-uuid-v4"
}
```

**Response 200:**
```json
{
  "ok": true,
  "consentLogId": "c1d2e3f4",
  "newStatus": "approved",
  "guardianAccountStatus": "active"
}
```

**Side effects on approve:**
- `consent_log.cso_reviewed_by` = CSO staff ID
- `consent_log.cso_reviewed_at` = now
- `guardian_accounts.status` = 'active'
- `guardian_accounts.consent_verified_at` = now
- `guardian_accounts.consent_expires_at` = now + 365 days
- Email to guardian: "Hồ sơ đã được phê duyệt — Coordinator sẽ liên hệ để sắp xếp buổi đánh giá đầu vào"

### 7.5 DELETE `/api/ndnum/guardian/consent/:id` (Right to Erasure)

Guardian requests erasure of their account and child data.

**Auth:** Guardian must provide email + OTP (sent to registered email) to confirm identity before erasure.

**Request:**
```json
{
  "guardianAccountId": "a1b2c3d4",
  "otpCode": "123456",
  "erasureReason": "voluntary_withdrawal | program_not_suitable | privacy_concern | other",
  "idempotencyKey": "erasure-uuid-v4"
}
```

**Response 200:**
```json
{
  "ok": true,
  "message": "Yêu cầu xóa dữ liệu đã được ghi nhận. Dữ liệu sẽ được xóa trong 30 ngày.",
  "confirmedAt": "2027-01-15T10:00:00Z",
  "deletionBy": "2027-02-14T10:00:00Z",
  "retainedItems": ["consent_log (legal retention 10 years)", "anonymized cohort aggregate (no identifier)"]
}
```

**Side effects:**
- `guardian_accounts.status` = 'withdrawn'
- `guardian_accounts.contact_email_enc` scheduled for deletion in 30 days
- All `child_profiles` for this guardian: `status` = 'exited_guardian_withdrawal'
- CSO notified via system alert
- Email to guardian: deletion confirmation with reference number

---

## Mục 8 — Privacy Appendix

### 8.1 Data Minimization Principle

NDNUM collects the minimum data required for program delivery. Before adding any new data field to guardian_accounts or child_profiles, Product must answer:

1. What is this data used for?
2. Can the program deliver without it?
3. What is the retention period?
4. Who can access it?
5. Has Legal/CSO reviewed this addition?

If any answer is unclear, the field is not added.

### 8.2 Data Access Matrix

| Data Type | Coordinator | Lead Mentor | CSO | Legal | Founder | Board | Sponsor | Public |
|-----------|-------------|-------------|-----|-------|---------|-------|---------|--------|
| Guardian contact (encrypted) | Read own | No | Read all | Incident only | No | No | No | No |
| Child program_id | Read assigned | Read cohort | Read all | Incident only | No | No | No | No |
| SDQ scores | Write/Read assigned | Read cohort | Read all | No | No | No | No | No |
| Observation logs | Write/Read own | Read cohort | Read all | No | No | No | No | No |
| Consent records | No | No | Read/Write | Read | No | Summary only | No | No |
| Incident reports | Read involved | Read cohort | Full access | Full access | Summary only | Summary only | No | No |
| Aggregate impact | No | No | Write | No | Read | Read | Read (cohort) | Public dashboard |

### 8.3 Encryption Standards

- Guardian contact data: AES-256-GCM at rest; key stored in Cloudflare Secrets
- Consent form files: AES-256-GCM, separate key from contact data
- SDQ scores: pseudonymized ID only; scored data stored separately from identifier data
- Transmission: TLS 1.3 minimum; no consent data over HTTP

### 8.4 Breach Response Protocol (NĐ 13/2023 + GDPR)

**Trigger:** Unauthorized access to, disclosure of, or loss of guardian/child data.

**Response timeline:**
```
T+0h: Discovery → CSO notified immediately
T+4h: Initial assessment (scope, type, data affected)
T+24h: Internal incident report filed (see NDNUM_CHILD_SAFETY_POLICY.md Appendix A)
T+48h: Affected guardians notified (email + phone if >20 records)
T+72h: Regulatory notification filed (Cục An toàn thông tin if ≥100 records; GDPR DPA if EU guardians affected)
T+7d: Full incident report to Board
T+30d: Post-incident review + remediation plan
```

**Notification content (guardian):**
- What happened (in plain language)
- What data was affected
- What NDNUM is doing to fix it
- What guardian can do (change passwords, monitor accounts)
- Contact for questions
- Regulatory body contact for complaints

### 8.5 Data Retention Schedule

| Data Category | Retention | Basis |
|---------------|-----------|-------|
| Guardian account (active) | Duration of program + 30 days after exit | Contract |
| Guardian account (withdrawn) | 30 days after withdrawal (then delete identifiers) | NDNUM policy |
| Consent records | 10 years | VN legal obligation + COPPA |
| SDQ assessment data | 10 years (anonymized after child exits) | Research integrity |
| Incident reports | 10 years | Legal obligation |
| Coordinator observation logs | 5 years after child exits | Program quality |
| Email logs (system-generated) | 2 years | Technical operations |
| Aggregate cohort data | Permanent (no individual identifier) | Impact research |

---

## Mục 9 — COPPA 5 Verifiable Parental Consent (VPC) Methods

FTC guidance: "Operators must make reasonable efforts ... to obtain verifiable parental consent."

### Method 1 (COPPA) — Signed consent form sent by postal mail (paper)

- Parent prints, signs, mails
- NDNUM paper: Method 2 in Mục 2

### Method 2 (COPPA) — Credit card transaction + notice to account holder

- Parent uses credit card; FTC accepts this as parental verification for small purchase contexts
- **NDNUM does NOT use this method** — NDNUM does not charge parents for enrollment

### Method 3 (COPPA) — Toll-free telephone call staffed by trained personnel

- FTC allows trained staff phone call as VPC
- NDNUM analog: Method 5 (phone_email_emergency) — used only in documented emergencies with CSO pre-approval, and must be converted to another method within 60 days

### Method 4 (COPPA) — Video conference with parent

- FTC allows real-time video verification
- NDNUM: Method 1 in Mục 2 (video_call)

### Method 5 (COPPA) — Government-issued ID verification with deletion after

- Parent uploads government ID; system verifies; ID deleted after verification
- FTC allows this; identity verification platforms (Jumio, Onfido) provide this service
- **NDNUM future option:** If NDNUM reaches 100+ US guardians/year, implement automated ID verification via Jumio API (estimated $2-4 per verification)
- For Phase 0B: use Method 1 (video call) as primary; automated ID verification deferred

### COPPA Specific Requirements NDNUM Must Meet:

1. **Direct notice to parent before data collection:** Consent bundle (Mục 3 Step 5) serves as this notice
2. **Description of data collected:** Consent form (Mục 4) itemizes all data types
3. **Right to review:** API endpoint 7.5 (erasure) + admin email to review data
4. **Right to refuse further collection:** Consent withdrawal (Mục 5.5)
5. **Confidentiality, security, integrity:** Mục 8.3 encryption + access matrix
6. **No conditioning on more info than necessary:** NDNUM does not require phone number, school name, or address for enrollment

**COPPA "actual knowledge" trigger:** If NDNUM discovers a child under 13 whose guardian has not completed consent, all data collection must stop immediately and existing data deleted within 10 business days.

---

## Mục 10 — Acceptance Criteria

- [ ] No child data collected before guardian_account.status = 'active' (CSO approved)
- [ ] All 5 consent methods documented and staff-trained before first cohort
- [ ] Consent form reviewed by Legal Counsel VN + US before use
- [ ] `0008_ndnum_consent.sql` migration tested locally with `npx wrangler d1 migrations apply duongsaotoasang-com --local`
- [ ] All API endpoints return `NDNUM_COORDINATOR_NOT_READY` when `NDNUM_CHILD_REGISTRATION_ENABLED=false`
- [ ] Breach response drill conducted before first cohort launch
- [ ] COPPA notice posted at `/privacy` with age-under-13 section
- [ ] Guardian can complete consent in ≤30 minutes using Method 1 (video call)

---

## Mục DEV-READY — Implementation Hooks

**Hard blockers (must complete before any code ships):**
1. Phase 0B legal lock (legal entity, CSO hire, Legal Counsel VN+US on retainer)
2. This document: v1.0-LOCKED (Legal Counsel + CSO co-review required)
3. NDNUM_CHILD_SAFETY_POLICY.md: v1.0-LOCKED (CSO sign-off)

**Soft blockers (can build in parallel, cannot deploy):**
- Migration `0008_ndnum_consent.sql` — can write and test locally
- API endpoints — can build, must pass `NDNUM_CHILD_REGISTRATION_ENABLED` gate
- Consent form HTML — can design, cannot collect real consent until locked

**Files to touch when unblocked:**
- `migrations/0008_ndnum_consent.sql` — create from Mục 6
- `functions/api/ndnum/guardian/register.js` — new endpoint
- `functions/api/ndnum/guardian/consent.js` — new endpoint
- `functions/api/admin/ndnum/consent-queue.js` — admin endpoint (CF Access JWT)
- `functions/api/admin/ndnum/consent/[id]/approve.js` — admin endpoint
- `functions/api/ndnum/guardian/consent/[id].js` — DELETE (erasure)
- `functions/_lib/email.js` — add `sendGuardianConsentConfirm` + `sendGuardianConsentApproved`
- `wrangler.toml` — add `NDNUM_CHILD_REGISTRATION_ENABLED = "false"` to `[vars]`

**Related docs:**
- NDNUM_CHILD_SAFETY_POLICY.md — Rule #2 (consent before every activity), Rule #8 (per-session recording consent)
- NDNUM_MENTOR_SCREENING_AND_TRAINING.md — Coordinator training Module 5 (data privacy)
- DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md — data retention + breach notification
