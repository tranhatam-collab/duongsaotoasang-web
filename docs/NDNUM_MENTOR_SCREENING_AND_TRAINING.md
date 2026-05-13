# NDNUM — Mentor Screening & Training Spec

> **Mã tài liệu:** `NDNUM_MENTOR_SCREENING_AND_TRAINING_v1.0`
> **Trạng thái:** 🟡 DRAFT v1.0
> **Phiên bản:** v1.0-DRAFT
> **Ngày:** 2026-05-13
> **Owner:** HR + CSO (co-author — CSO review required before v1.0-LOCKED)
> **Phụ thuộc:** Phase 0B — CSO hired TRƯỚC khi mở hiring funnel
> **Tham chiếu:**
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục V (Mentor model), Mục XIII (12 quy tắc), Mục XIV (Phase 0B deliverables)
> - `NDNUM_CHILD_SAFETY_POLICY.md` (Rules #6, #9, #10)
> - `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` (guardian consent sebelum child contact)

---

## MỤC LỤC

1. [Tổng quan — 5 Role Definitions](#1)
2. [Hiring Funnel — Coordinator (7 bước)](#2)
3. [Background Check Process](#3)
4. [Training Curriculum](#4)
5. [Certification & CPD](#5)
6. [Compensation Table (Y1)](#6)
7. [Y1 Hiring Timeline](#7)
8. [Code of Conduct & Disciplinary Process](#8)
9. [DEV-READY — Implementation hooks](#9)

---

<a name="1"></a>
## 1. TỔNG QUAN — 5 ROLE DEFINITIONS

### 1.1 Sơ đồ tổ chức (People layer)

```
Board
  └── Child Safety Officer (CSO)  ← Độc lập, báo cáo thẳng Board
        │
        └── NDNUM Operations
              ├── Lead Mentor (Trưởng Nhóm) × 1 (Y1)
              │     └── Program Coordinators × 5 (Y1)
              │           └── [children + guardians, max 5 trẻ/Coordinator]
              ├── Peer Mentor (Tầng 2B+, volunteer) × variable
              └── Volunteer Support × variable (NO child contact)
```

---

### 1.2 Role 1 — Child Safety Officer (CSO)

| Thuộc tính | Chi tiết |
|---|---|
| **Reporting line** | **Board trực tiếp** — KHÔNG qua Founder, KHÔNG qua Operations |
| **Independence** | Không thể bị Founder terminate unilaterally — cần Board vote |
| **Loại** | Part-time consultant Y1 ($2-3K/month), full-time Y2+ |
| **Qualification required** | IICRC Certified Child Protection Specialist, hoặc: ChildSafe certification, hoặc: 5+ năm child welfare/protection với tổ chức có uy tín (UNICEF, Save the Children, etc.) |
| **Conflict of interest** | Không là: current/former sponsor, family của staff, investor trong DSTS |
| **Contract minimum** | 2 năm (để đảm bảo continuity) |
| **Authority** | Pause/cancel bất kỳ activity nào có trẻ em; đình chỉ bất kỳ staff nào; report Board mà không cần Founder approval |

**Nhiệm vụ cốt lõi:**
- Co-author screening criteria cho mọi role tiếp xúc trẻ
- Approve/reject tất cả hiring quyết định (Coordinator, Lead Mentor, Peer Mentor)
- Conduct quarterly audit (observation log review, incident review)
- Annual report độc lập lên Board
- Receive and investigate tất cả incidents
- Train team về child protection annually

**CSO tuyển trước bất kỳ ai khác. Không có CSO = không có chương trình.**

---

### 1.3 Role 2 — Lead Mentor (Trưởng Nhóm)

| Thuộc tính | Chi tiết |
|---|---|
| **Số lượng Y1** | 1 người |
| **Loại** | Part-time salaried, 20-30h/week |
| **Experience required** | 5+ năm child development, education, hoặc social work |
| **Language** | Vietnamese required (native hoặc fluent), English a plus |
| **Background check** | Bắt buộc, cùng tiêu chuẩn Coordinator |
| **Reports to** | Operations (NDNUM) với CSO oversight |

**Nhiệm vụ:**
- Supervise 5 Coordinators hàng ngày
- Co-facilitate group sessions (không solo với trẻ)
- Weekly 1:1 với mỗi Coordinator (30 phút)
- Escalation point khi Coordinator gặp khó
- Tham gia 8h/năm CSO-led training
- Maintain program fidelity (đảm bảo 12 quy tắc được tuân thủ)

---

### 1.4 Role 3 — Program Coordinator (Điều Phối Viên)

**Vai trò quan trọng nhất trong toàn chương trình.** Coordinator là người duy nhất có direct, supervised contact với trẻ em. Không có volunteer cảm hứng ở đây.

| Thuộc tính | Chi tiết |
|---|---|
| **Số lượng Y1** | 5 người (full-time) |
| **Loại** | Full-time salaried employee |
| **Ratio** | 1 Coordinator : 5 trẻ (max — không vượt) |
| **Experience minimum** | 2+ năm working với trẻ em (giáo viên, social worker, youth program) |
| **Language** | Vietnamese required |
| **Background check** | Bắt buộc, bi-annual renewal |
| **Training before child contact** | 40h (xem Mục 4) |
| **Reports to** | Lead Mentor, with CSO oversight |

**Nhiệm vụ:**
- Tổ chức và facilitate tất cả weekly sessions (online + offline)
- Duy trì Observation Log mỗi tuần cho từng trẻ
- Conduct guardian monthly check-in calls (15 phút/tháng/trẻ)
- Mediate tất cả sponsor communication (review letters in/out)
- Administer SDQ assessments (T0, T+6, T+12)
- Escalate incidents tới CSO trong 4h
- Hỗ trợ academic referrals khi cần

**Điều Coordinator KHÔNG được làm:**
- Solo 1:1 với trẻ em không có log
- Share thông tin trẻ với sponsor (tên, trường, địa chỉ)
- Nhận tiền/quà từ guardian hoặc sponsor
- Kết bạn mạng xã hội với trẻ hoặc guardian (personal accounts)
- Gặp trẻ ngoài giờ chương trình (không log)

---

### 1.5 Role 4 — Peer Mentor (Cố Vấn Đồng Tuổi)

| Thuộc tính | Chi tiết |
|---|---|
| **Đối tượng** | Tầng 2B sinh viên 18+ hoặc alumni DSTS Tầng 2+ |
| **Loại** | Part-time volunteer + stipend $50-100/event |
| **Age minimum** | 18 tuổi |
| **Background check** | Bắt buộc trước khi tham gia |
| **Child contact** | KHÔNG có contact trực tiếp với Tầng 1 (trẻ em 5-12) |
| **Scope** | Chỉ mentor Tầng 2 (học sinh 13-17, sinh viên 18+) — peer-to-peer |

**Ghi chú quan trọng:** Peer Mentor 1:1 với sinh viên Tầng 2 là allowed (cùng tuổi, adult). Không được tham gia bất kỳ activity nào có Tầng 1.

---

### 1.6 Role 5 — Volunteer Support

| Thuộc tính | Chi tiết |
|---|---|
| **Scope** | Admin tasks ONLY: logistics, translation, social media, fundraising |
| **Child contact** | Zero — tuyệt đối không |
| **Child data access** | Zero — không có access vào bất kỳ system nào có child data |
| **Background check** | Optional (no child contact) — nhưng recommended nếu present tại events |
| **Supervision** | Operations staff (không cần CSO approval) |

---

<a name="2"></a>
## 2. HIRING FUNNEL — COORDINATOR (7 BƯỚC)

### Overview

```
Step 1: Job Posting
    ↓
Step 2: Application + Cover Letter
    ↓
Step 3: Phone Screen (30 min, CSO-approved questions)
    ↓
Step 4: In-person Interview (90 min, scenario-based)
    ↓
Step 5: Background Check (2-4 weeks)
    ↓
Step 6: Trial Period (2 weeks supervised, no solo child contact)
    ↓
Step 7: Hire + 40h Training (BEFORE any child assignment)
```

### Step 1 — Job Posting (sample JD)

---
**NDNUM Program Coordinator — Điều Phối Viên Chương Trình**
*Đường Sao Tỏa Sáng (DSTS) | Full-time | [Location: Vietnam / US / Remote TBD]*

**Về vị trí:**
Coordinator là người đồng hành trực tiếp và ổn định nhất trong cuộc đời trẻ em tham gia NDNUM. Bạn sẽ dẫn dắt các nhóm nhỏ (max 5 trẻ), duy trì liên lạc hàng tuần với gia đình, và đảm bảo mọi trẻ đều có không gian an toàn để phát triển.

**Yêu cầu bắt buộc:**
- 2+ năm kinh nghiệm làm việc trực tiếp với trẻ em (giáo viên, nhân viên xã hội, youth program staff)
- Tiếng Việt thành thạo (native hoặc C1+)
- Cam kết làm việc tối thiểu 2 năm
- Sẵn sàng pass background check toàn diện
- Đồng ý với 12 Quy Tắc Bất Biến NDNUM

**Ưu tiên:**
- Có kinh nghiệm với cộng đồng diaspora Việt
- Có training về child protection hoặc trauma-informed care
- Tiếng Anh giao tiếp được

**Quy trình nộp:** Cover letter (500 từ, trả lời "Tại sao bảo vệ trẻ em quan trọng với bạn?") + CV
---

### Step 2 — Application Review (HR + CSO)

**Sàng lọc đầu tiên (CSO + HR):**
- Cover letter chất lượng — có suy nghĩ thực sự về child safety không?
- CV: 2+ năm child-facing experience verified
- Loại ngay nếu: cover letter chỉ nói về "passion" mà không có substance, hoặc kinh nghiệm không liên quan

### Step 3 — Phone Screen (30 phút)

**CSO-approved question bank (chọn 5/8):**

1. *"Kể về một tình huống bạn nghi ngờ một trẻ em đang bị nguy hiểm. Bạn đã làm gì?"*
   *(Đáp án tốt: đã báo cáo, không tự xử lý, biết đường dây hỗ trợ)*

2. *"Nếu một phụ huynh yêu cầu bạn không ghi chép buổi học của con họ, bạn sẽ làm gì?"*
   *(Đáp án tốt: giải thích policy, không đồng ý, escalate nếu cần)*

3. *"Giải thích với tôi tại sao không bao giờ được 1:1 với trẻ em mà không có supervision?"*
   *(Đáp án tốt: hiểu rõ lý do — grooming prevention, no-witness situations, trust with guardians)*

4. *"Nếu một sponsor hỏi bạn tên và trường học của trẻ họ đang bảo trợ, bạn sẽ nói gì?"*
   *(Đáp án tốt: từ chối, giải thích privacy policy, không tiết lộ)*

5. *"Bạn có biết COPPA và Luật Trẻ em VN 2016 là gì không?"*
   *(Không cần biết chi tiết — cần biết có luật bảo vệ trẻ em và biết phải tìm hiểu)*

6. *"Nếu một trẻ em trong nhóm của bạn tự tiết lộ rằng bị ngược đãi ở nhà, bước đầu tiên bạn làm là gì?"*
   *(Đáp án tốt: lắng nghe không phán xét, không hứa giữ bí mật, báo cáo CSO ngay)*

7. *"Tại sao bạn muốn làm công việc này, không phải volunteer?"*
   *(Đáp án tốt: hiểu sự khác biệt giữa salaried commitment và volunteer inspiration)*

8. *"Bạn cảm thấy thế nào về việc có một Child Safety Officer với quyền đình chỉ bạn bất kỳ lúc nào?"*
   *(Đáp án tốt: welcome oversight, không cảm thấy bị kiểm soát)*

**Pass criteria:** Trả lời đúng tinh thần ≥ 5/5 câu được hỏi. Fail = không mời tiếp.

### Step 4 — In-person Interview (90 phút)

**Panel:** HR + Lead Mentor + CSO (hoặc CSO delegate)

**Cấu trúc:**
- 20 phút: Giới thiệu, deep dive vào CV
- 40 phút: Scenario roleplay (3 tình huống thực tế)
- 20 phút: Program orientation questions
- 10 phút: Ứng viên hỏi

**3 Scenario roleplay:**

*Scenario A (Guardian conflict):*
"Phụ huynh của một trẻ gọi điện tức giận, nói rằng con họ về nhà và kể rằng bạn đã nói điều gì đó làm con buồn. Phụ huynh muốn gặp riêng bạn — không có Lead Mentor."
*(Expect: không gặp riêng, mời có Lead Mentor hoặc CSO, lắng nghe, ghi log)*

*Scenario B (Child disclosure):*
"Trong buổi học, một trẻ 9 tuổi kéo bạn ra một bên và nói: 'Cô ơi, con không muốn về nhà vì ba hay đánh con.'"
*(Expect: lắng nghe, không hứa giữ bí mật, không hỏi dồn, báo CSO ngay sau buổi, không tự điều tra)*

*Scenario C (Sponsor boundary):*
"Một sponsor gửi email cho bạn, nói muốn tặng quà sinh nhật trực tiếp cho trẻ và hỏi địa chỉ nhà."
*(Expect: từ chối lịch sự, giải thích policy, offer thay thế — gửi qua Coordinator, không tiết lộ bất kỳ thông tin nào)*

### Step 5 — Background Check

*(Xem Mục 3 chi tiết)*

Không proceed sang Step 6 cho đến khi background check clear.

### Step 6 — Trial Period (2 tuần)

- Tham gia các buổi sinh hoạt hiện có (nếu có cohort running) dưới dạng observer
- Shadow Lead Mentor và Coordinator hiện tại (nếu hire replacement)
- Không có solo contact với trẻ
- Lead Mentor + CSO đánh giá cuối trial: Pass / Probation extend (2 thêm tuần) / Fail (terminate)

### Step 7 — Hire + 40h Training

- Ký hợp đồng lao động (minimum 2 năm)
- Ký Child Safety Policy Acknowledgement (Appendix B của `NDNUM_CHILD_SAFETY_POLICY.md`)
- Complete 40h training (xem Mục 4) **TRƯỚC** khi gặp bất kỳ trẻ nào trong vai Coordinator

---

<a name="3"></a>
## 3. BACKGROUND CHECK PROCESS

### 3.1 Yêu cầu theo quốc gia

| Quốc gia | Loại check bắt buộc | Thời gian | Chi phí |
|---|---|---|---|
| **Việt Nam** | Lý lịch tư pháp (Bộ Tư pháp hoặc Công an tỉnh/thành) + xác nhận không vi phạm NĐ 71/2011 | 3-10 ngày | ~200K VND, DSTS trả |
| **Hoa Kỳ (US)** | FBI Identity History Summary (Level 2 fingerprint) + sex offender registry check tất cả 50 tiểu bang | 2-8 tuần | ~$50-100, DSTS trả |
| **Úc (AU)** | National Police Check (Australian Criminal Intelligence Commission) + Working with Children Check theo tiểu bang | 1-4 tuần | ~$40-60 AUD, DSTS trả |
| **EU** | Quốc gia cụ thể: certificate of good conduct từ cơ quan cảnh sát quốc gia + ECRIS check nếu đã sống ở nhiều nước EU | 2-6 tuần | Varies, DSTS trả |
| **Khác** | National police clearance + Interpol Red Notice check (qua cơ quan địa phương) | Varies | DSTS trả |

**Nếu ứng viên đã sống ở nhiều quốc gia:** Phải check từng quốc gia đã sống ≥ 6 tháng trong 10 năm gần nhất.

### 3.2 Disqualifiers (từ chối ngay)

| Loại conviction | Flexible? |
|---|---|
| Bất kỳ tội liên quan đến trẻ em (sexual abuse, exploitation, neglect, trafficking) | ❌ Absolute — không exceptions |
| Tội bạo lực thể chất (dù đã mãn hạn) | ❌ Absolute |
| Gian lận liên quan đến tổ chức phi lợi nhuận hoặc giáo dục | ❌ Absolute |
| Drug/alcohol offense trong 5 năm gần nhất | ⚠️ CSO review case-by-case |
| Conviction nhỏ đã hơn 10 năm, không liên quan đến trẻ | ⚠️ CSO review + Board inform |

### 3.3 Renewal schedule

- **Bi-annual (mỗi 2 năm):** Tất cả Coordinator và Lead Mentor
- **Annual:** CSO (tự kiểm tra và báo cáo Board)
- **On incident:** Nếu có incident report liên quan — immediate re-check trước khi trở lại làm việc

### 3.4 Data handling

Background check documents:
- Lưu trong secure encrypted folder (không trong D1 public schema)
- Access: HR + CSO chỉ
- Retention: Duration of employment + 7 years (legal obligation)
- Not shared với: Board members, Founder (chỉ Pass/Fail kết quả), sponsors

---

<a name="4"></a>
## 4. TRAINING CURRICULUM

### 4.1 Overview

| Chương trình | Ai phải học | Tổng giờ | Khi nào |
|---|---|---|---|
| Coordinator Foundation Training | Tất cả Coordinator | 40h | Trước child contact |
| Lead Mentor Additional Training | Lead Mentor | +20h (ngoài 40h) | Trước supervisor role |
| CSO Deep-Dive Training | CSO-led session cho cả team | 8h/năm | Annual renewal |
| First Aid & CPR | Coordinator + Lead Mentor | 8h + annual recert | Trước child contact |
| Peer Mentor Orientation | Peer Mentor | 4h | Trước participation |

---

### 4.2 Coordinator Foundation Training (40h)

#### Module 1 — Child Development Theory (8h)

**Mục tiêu:** Coordinator hiểu trẻ đang ở giai đoạn phát triển nào để respond phù hợp.

**Nội dung:**
- Erikson's Stages of Psychosocial Development (8 stages, focus trên ages 5-12)
- Vygotsky's Zone of Proximal Development — how to scaffold learning
- Adverse Childhood Experiences (ACEs) — trauma-informed care basics
- Attachment theory (Bowlby) — why stable caregivers matter
- Cultural context: Vietnamese child-rearing practices vs. Western developmental frameworks
- Neuroscience basics: why relationships matter for brain development

**Format:** Online video (4h) + live workshop với Lead Mentor (4h)
**Assessment:** Case study discussion — no pass/fail grade, but completion required

---

#### Module 2 — Child Safety Law (8h)

**Mục tiêu:** Coordinator biết nghĩa vụ pháp lý, không chỉ policy nội bộ.

**Nội dung:**

*Việt Nam:*
- Luật Trẻ em 2016 (Luật số 102/2016/QH13): quyền trẻ em, nghĩa vụ bảo vệ, trách nhiệm tổ chức
- Nghị định 56/2017/NĐ-CP: quy định chi tiết về môi trường giáo dục an toàn
- Nghị định 71/2011/NĐ-CP: quy định chi tiết về luật bảo vệ, chăm sóc và giáo dục trẻ em
- Đường dây hỗ trợ trẻ em 1800 1567

*Hoa Kỳ (cho US-based Coordinators và với diaspora children):*
- CAPTA (Child Abuse Prevention and Treatment Act) — mandatory reporting
- Title IX basics
- Child Protective Services (CPS) reporting process by state
- National Child Abuse Hotline: 1-800-422-4453

*Quốc tế:*
- UNCRC (UN Convention on the Rights of the Child) — Articles 3, 12, 16, 19, 34
- How UNCRC applies to program design

*Data protection:*
- COPPA (Children's Online Privacy Protection Act, US) — overview
- Nghị định 13/2023/NĐ-CP (VN PDPA) — data minimization, consent, retention

**Format:** Online self-paced (5h) + 3h với Legal Counsel hoặc external trainer
**Assessment:** Quiz (20 questions, pass ≥ 80%)

---

#### Module 3 — Guardian-first Communication (8h)

**Mục tiêu:** Coordinator thành thạo giao tiếp với phụ huynh — nền tảng của toàn chương trình.

**Nội dung:**
- Why guardian-first: không phải bureaucracy — đây là protection cho tất cả (child, guardian, Coordinator)
- Monthly check-in call structure (5-question framework)
- Handling difficult conversations (guardian disagrees with program decision, child having problems)
- Cultural competence: Vietnamese family dynamics, diaspora family stress, intergenerational differences
- Guardian consent and its limits — what guardian can and cannot consent to on behalf of child
- Recognizing when guardian is part of the problem (domestic violence, neglect) — escalation protocol
- Documentation: what to log, how to log neutrally without judgment

**Format:** Live roleplay workshop với Lead Mentor + CSO (8h, split 2 sessions of 4h)
**Assessment:** Roleplay graded by Lead Mentor (Pass/Fail)

---

#### Module 4 — Mandatory Reporting Procedures (6h)

**Mục tiêu:** Coordinator biết CHÍNH XÁC phải làm gì khi nghi ngờ abuse/neglect — không phân vân, không trì hoãn.

**Nội dung:**
- Definition: what constitutes abuse (physical, emotional, sexual, neglect) per VN + US law
- Signs and indicators (behavioral + physical) — không chẩn đoán, chỉ observe và report
- How a child discloses: what to say, what NOT to say ("I believe you", không "Are you sure?")
- The reporting chain: Child → Coordinator (4h) → CSO (24h) → Authorities if required
- Mandatory reporting timing (VN: immediate; US: 24-72h depending on state)
- What happens after you report (investigate process — Coordinator không phải investigate)
- Protecting yourself: documentation, legal protection for good-faith reporters
- When reporting is uncertain: consult CSO, document doubt, err on the side of reporting

**Format:** Online scenarios (3h) + live discussion với CSO (3h)
**Assessment:** Scenario test — 3 scenarios, pass all 3 (no partial credit)

---

#### Module 5 — Data Privacy in Practice (4h)

**Mục tiêu:** Coordinator hiểu không chỉ "không được chia sẻ" mà hiểu TẠI SAO và HOW to handle data daily.

**Nội dung:**
- What data we collect and why (minimal collection principle)
- Child pseudonymization: why we use IDs, how to use them in notes
- The observation log: what belongs, what doesn't (never names of schools, exact addresses)
- Sponsor communication: what to redact before forwarding any document
- Device security: never child data on personal phone, lock screen required, report lost device
- Data breach: what counts as a breach, who to tell, how fast
- Right to erasure: what happens when guardian requests deletion

**Format:** Online self-paced (2h) + 2h practical workshop (log entries practice)
**Assessment:** Practical exercise — write 3 observation log entries, reviewed by Lead Mentor

---

#### Module 6 — Anti-grooming & Boundary Training (4h)

**Mục tiêu:** Coordinator biết grooming patterns — nhận ra từ bên ngoài (potential abusers) VÀ tự kiểm tra bản thân.

**Nội dung:**
- What is grooming: definition, stages (targeting, gaining trust, isolation, desensitization, maintaining control)
- Red flags IN OTHERS: adults who single out children, give excessive gifts, seek alone time
- Red flags IN YOURSELF: catching yourself bending rules "just this once", favoritism, keeping secrets with child
- The "Two-person integrity rule" — why it protects everyone including staff
- Professional boundaries: what's appropriate affection (high-five, side hug with child initiated) vs. inappropriate
- Digital boundaries: no personal social media connection with children or guardians
- What to do if a child tries to form inappropriate attachment to you

**Format:** Online video (2h) + discussion group with Lead Mentor + CSO (2h)
**Assessment:** Reflection essay (500 từ: "What did you learn about your own boundaries?"), reviewed by CSO

---

#### Module 7 — DSTS/NDNUM Program Structure & 12 Rules (2h)

**Mục tiêu:** Coordinator hiểu toàn bộ program structure, không chỉ role của mình.

**Nội dung:**
- DSTS ecosystem overview (Layer 0, Phase 0B, Layer 1, NDNUM)
- NDNUM's 5 Tầng và vị trí Coordinator trong đó
- 12 Immutable Rules — read, discuss, sign acknowledgement
- Coordinator's relationship với Sponsor flow (mediation role)
- Escalation chart: who do I call for what issue
- Program calendar và deliverables overview

**Format:** Self-paced reading (1h) + onboarding Q&A with Lead Mentor (1h)
**Assessment:** Sign Child Safety Policy Acknowledgement form

---

### 4.3 Lead Mentor Additional Training (+20h)

On top of 40h Foundation:

| Module | Content | Hours |
|---|---|---|
| Supervision skills | How to do 1:1 with Coordinator, performance feedback, coaching vs. directing | 8h |
| Crisis management | When CSO not immediately available, first-responder decisions | 4h |
| Program fidelity | How to audit Coordinator logs, quality checks | 4h |
| Conflict resolution | Guardian escalations, team conflicts, inter-cohort issues | 4h |

---

### 4.4 Annual CSO-led Training (8h/năm, toàn team)

| Session | Content | Hours |
|---|---|---|
| Incident review | Anonymized review of incidents from prior year (VN + international cases) | 2h |
| Law updates | Any changes to child protection law VN/US/relevant | 2h |
| Scenario drills | New scenarios not covered in foundation training | 2h |
| Policy review | Any updates to Child Safety Policy, 12 Rules | 1h |
| Open Q&A + attestation signing | Annual re-attestation | 1h |

---

<a name="5"></a>
## 5. CERTIFICATION & CPD

### 5.1 NDNUM Certification

**NDNUM Certified Coordinator** status awarded when:
- [x] 40h Foundation Training completed (all modules, all assessments passed)
- [x] Background check cleared
- [x] 2-week trial period passed (Lead Mentor + CSO approval)
- [x] Child Safety Policy Acknowledgement signed
- [x] First Aid & CPR certified

**Certificate:**
- Issued by CSO (not Founder, not HR)
- Valid 1 year (renewal: annual CPD + annual CSO attestation)
- Stored in HR file + digital copy in secure system

### 5.2 Continuing Professional Development (CPD)

| Type | Hours/year | Who ensures |
|---|---|---|
| CSO annual training | 8h | CSO (mandatory attendance) |
| First Aid recertification | 8h (every 2 years) | HR schedules, DSTS pays |
| External training (optional, reimbursed) | Up to 16h | Staff initiative, Manager approval |
| **Minimum CPD/year** | **8h mandatory** | Lead Mentor tracks |

**Non-compliance:** Coordinator không complete 8h CPD → không renew certification → cannot work with children until remediated.

### 5.3 First Aid & CPR

- Required: American Red Cross Standard First Aid + CPR/AED (hoặc VN equivalent: Sơ cứu cơ bản theo Bộ Y tế)
- Renewal: every 2 years (or sooner if significant changes to guidelines)
- Cost: DSTS pays (~$50-80 USD per person)
- Both Coordinator and Lead Mentor required; CSO strongly recommended

---

<a name="6"></a>
## 6. COMPENSATION TABLE (Y1)

### 6.1 Salary ranges

| Role | Type | VN Rate | US/AU/EU Rate | Notes |
|---|---|---|---|---|
| **CSO** | Part-time consultant | 40-60M VND/month | $2,000-3,000/month | Independent contractor, 2-year minimum |
| **Lead Mentor** | Part-time employee | 15-25M VND/month | $3,000-4,500/month | TBD Founder Decision #4 |
| **Coordinator (full-time)** | Full-time employee | 8-12M VND/month | $3,000-5,000/month | Market rate, adjusted by city |
| **Peer Mentor** | Volunteer + stipend | 500K-1M VND/event | $50-100/event | Tax withholding if applicable |
| **M&E Specialist** | Part-time | 15-20M VND/month | $2,000-3,500/month | Defer 1 month post-Phase 0B |

### 6.2 Y1 People Budget Estimate

| Role | Count | Monthly Cost (blended) | Annual |
|---|---|---|---|
| CSO | 1 | $2,500 | $30,000 |
| Lead Mentor | 1 | $2,000 | $24,000 |
| Coordinator | 5 | $1,500 avg (VN-based) | $90,000 |
| M&E Specialist | 1 (part-time) | $2,000 | $18,000 (9 months) |
| Peer Mentor | 10 | $75/event × 2 events | $1,500 |
| **Total People** | | | **~$163,500/year** |

**Context vs. Y1 Budget:** NDNUM Y1 revenue target $100K-500K. People cost $163K → requires minimum $200K revenue OR Cohort/General Fund sponsor to cover operations. This is the fundraising goal for Phase 0B.

---

<a name="7"></a>
## 7. Y1 HIRING TIMELINE

```
Phase 0B (Tháng 6-8/2026)
  │
  ├── Month 1 (T6/2026):
  │     ● CSO hired — FIRST HIRE, before anything else
  │     ● Job postings for Coordinator × 5 go live (CSO approves JD)
  │     ● M&E Specialist search begins
  │
  ├── Month 2 (T7/2026):
  │     ● Phone screens + interviews running
  │     ● Background checks initiated for short-listed candidates
  │     ● Training materials prepared (Lead Mentor + CSO co-develop)
  │
  ├── Month 3 (T8/2026 — end of Phase 0B):
  │     ● 2 Coordinators hired + background check cleared
  │     ● Lead Mentor hired
  │     ● M&E Specialist hired (can start Month 4)
  │
Layer 1 (Tháng 9-12/2026)
  │
  ├── Month 4 (T9/2026):
  │     ● 2 Coordinators start 40h training
  │     ● 3 remaining Coordinator searches continue
  │     ● Guardian consent system tested (no real children yet)
  │
  ├── Month 5 (T10/2026):
  │     ● 3 more Coordinators hired + background check
  │     ● All 5 Coordinators complete 40h training by end of month
  │     ● Dry-run cohort session (no children — staff practice)
  │
  ├── Month 6 (T11/2026):
  │     ● Guardian consent flow opens (parents can register interest)
  │     ● CSO + Lead Mentor review first 20 guardian applications
  │
  ● Month 7 (T12/2026 or Q1/2027):
        ● FIRST COHORT OPENS — 20 trẻ, all consent signed, all staff certified
```

**Hard gates before first cohort:**
- [ ] CSO in role ≥ 2 months
- [ ] All 5 Coordinators: background check cleared + 40h training + First Aid cert
- [ ] Guardian consent system live and tested
- [ ] Incident reporting hotline active
- [ ] D1 schema (migration 0008+) deployed
- [ ] CSO conducts pre-launch audit

---

<a name="8"></a>
## 8. CODE OF CONDUCT & DISCIPLINARY PROCESS

### 8.1 Immediate Dismissal Triggers (zero tolerance)

| Trigger | Action |
|---|---|
| Any sexual conduct with a child | Immediate suspension pending investigation; mandatory report to authorities; terminate |
| Physical abuse of a child | Same as above |
| Sharing child identity/information with sponsor or public | Immediate suspension; investigate; terminate if confirmed |
| Allowing unsupervised 1:1 contact with a child | Immediate suspension; investigate |
| Falsifying observation logs or SDQ records | Terminate |
| Receiving money/gifts from guardian or sponsor | Terminate if confirmed intentional |
| Background check fraud (withholding criminal history) | Terminate; potential legal action |

**Who decides termination:** CSO recommends → HR executes. Founder cannot override CSO recommendation in child safety-related terminations.

### 8.2 Investigation Process (CSO-led)

**Timeline: max 5 business days from incident report to finding**

```
Day 0: Incident reported → CSO receives report
Day 0: Coordinator suspended with pay (paid suspension — not punishment, but separation)
Day 1-3: CSO conducts interviews (guardian, child via guardian, witnesses)
Day 1-3: Review observation logs, D1 records, email logs
Day 4: CSO preliminary finding → shared with Board (not Founder alone)
Day 5: Final decision: Clear / Disciplinary action / Terminate / Refer to authorities
Day 5: Written finding report to HR + Board + affected guardian (redacted)
```

**Child protection during investigation:**
- Suspended Coordinator NOT replaced immediately — Lead Mentor covers
- No new child contact for any staff under investigation
- Guardian notified within 24h that investigation underway (no details, no prejudgment)

### 8.3 Progressive Discipline (non-termination issues)

| Severity | Examples | Process |
|---|---|---|
| Minor (1st offense) | Late observation log, missed guardian call, not logging a session | Verbal + logged by Lead Mentor |
| Moderate | Repeated minor violations, unprofessional communication with guardian | Written warning + remediation plan (30 days) |
| Serious | Non-child-safety rule violation (sharing non-sensitive program info, social media boundary) | Final written warning + CSO review + possible suspension |
| Critical (non-dismissal) | Policy violation with no immediate child safety impact, but trust breach | Termination conversation; outcome: PIP or terminate |

### 8.4 Whistleblower Protection

- Any staff (including Volunteer) can report concerns about ANY other staff member, including Lead Mentor or Founder
- Report goes to: CSO (for child safety concerns) or Board (for CSO concerns)
- Anonymous reporting: email alias `safety@duongsaotoasang.com` monitored by CSO only
- No retaliation policy: reporting in good faith = protected, even if investigation finds no violation
- If Founder is subject of complaint: report to Board directly, CSO facilitates

---

<a name="9"></a>
## 9. DEV-READY — IMPLEMENTATION HOOKS

### 9.1 Immediate tasks (Phase 0B, Month 1)

| Task | Owner | Blocker? |
|---|---|---|
| Post CSO job listing | HR + Founder | None — do immediately |
| Register at sdqinfo.org for SDQ license | M&E search lead | Can do before M&E hired |
| Draft Coordinator job posting (using Step 1 above) | HR + CSO | CSO must approve before posting |
| Create `safety@duongsaotoasang.com` email alias | Tech Lead | None — do immediately |

### 9.2 Files cần tạo (Wave 3+)

```
public/ndnum/careers.html    ← Job listings page (simple static HTML)
docs/NDNUM_STAFF_ONBOARDING_CHECKLIST.md  ← Coordinator Day 1-30 checklist
```

### 9.3 `public/ndnum/careers.html` scope (brief)

- Static HTML page, same visual style as `movement/coming-soon.html`
- Content: 3 open roles (CSO, Coordinator × 5, M&E Specialist)
- Each role: title, description (from Step 1 JD above), requirements, how to apply
- Apply: email link (not a form — Phase 0B keep it simple)
- Banner: "Chúng tôi không nhận đơn từ người có án phạt liên quan đến trẻ em. Mọi vị trí đều yêu cầu background check."
- Route: `/ndnum/careers` (add to `_redirects` when built)

### 9.4 D1 references (for staff management — not child data)

```sql
-- Staff table (in migration 0008 or dedicated 0010_ndnum_staff.sql)
CREATE TABLE IF NOT EXISTS ndnum_staff (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  role             TEXT NOT NULL CHECK(role IN
                     ('cso','lead_mentor','coordinator','peer_mentor','volunteer')),
  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK(status IN ('active','suspended','terminated','resigned')),
  background_check_cleared_at TEXT,
  background_check_expires_at TEXT,
  training_completed_at TEXT,
  cert_expires_at  TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## CHANGELOG

| Phiên bản | Ngày | Tác giả | Ghi chú |
|---|---|---|---|
| v1.0-DRAFT | 2026-05-13 | Claude + Founder | Wave 3 W3.4 — needs CSO co-review before LOCKED |
