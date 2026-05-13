# NDNUM — Impact Measurement Framework

> **Mã tài liệu:** `NDNUM_IMPACT_MEASUREMENT_FRAMEWORK_v1.0`
> **Trạng thái:** 🟡 DRAFT v1.0
> **Phiên bản:** v1.0-DRAFT
> **Ngày:** 2026-05-13
> **Owner:** M&E Specialist (chưa hire) + Founder
> **Phụ thuộc:** Phase 0B + M&E Specialist hire (có thể defer 1 tháng sau Phase 0B)
> **Tham chiếu:**
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục VI, IX, XII (KPI)
> - `NDNUM_CHILD_SAFETY_POLICY.md` Mục 6 (privacy & data minimization)
> - `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md` Mục 4 (data retention)
> - `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` (consent before assessment)

---

## MỤC LỤC

1. [Logic Model](#1)
2. [Theory of Change](#2)
3. [Outcome Indicators per Tầng](#3)
4. [SDQ Tool (Strengths and Difficulties Questionnaire)](#4)
5. [Data Collection Protocol](#5)
6. [Privacy & k-Anonymity Rules](#6)
7. [External Validation Plan](#7)
8. [Public Impact Dashboard `/transparency/impact`](#8)
9. [D1 Schema References](#9)
10. [DEV-READY — Implementation hooks](#10)

---

<a name="1"></a>
## 1. LOGIC MODEL

Logic Model theo khung **Input → Activities → Outputs → Outcomes → Impact**

### 1.1 Diagram

```
INPUTS                   ACTIVITIES               OUTPUTS
──────────────────────   ──────────────────────   ──────────────────────
• Financial resources    • Mentoring sessions     • # children enrolled
  (Lane B donations,      (weekly, group)         • # sessions delivered
  individual sponsors,   • Life skills workshops  • # mentoring hours
  cohort sponsors)       • Arts & performance     • # guardians engaged
• Coordinator staff       programs               • # SDQ assessments
  (salaried, trained)    • Guardian check-ins       completed
• CSO oversight          • Academic support       • # letters exchanged
• Physical/virtual        referrals                 with sponsors
  program spaces         • Community showcase     • # virtual showcases
• M&E systems             events                 • # volunteer hours
• Sponsor network                                   contributed
         │                        │                        │
         └────────────────────────┘────────────────────────┘
                                  │
                                  ▼
SHORT-TERM OUTCOMES              MEDIUM-TERM OUTCOMES        LONG-TERM IMPACT
────────────────────────         ────────────────────────    ────────────────────────
• Improved sense of              • Improved academic         • Children complete
  safety and belonging             performance               K-12 education
• Stronger guardian-             • Developed arts &         • Economic mobility
  child relationships              creative identity           (higher income
• Increased self-                • Expanded social             potential)
  confidence & self-               network                  • Reduced juvenile
  efficacy                       • Career/path clarity        justice contact
• Basic needs awareness          • Leadership behaviors     • Intergenerational
  & fulfillment                  • Peer mentoring skill       change: alumni
                                                              become mentors
```

### 1.2 Tóm tắt chain

| Level | Tầng 1 (Mầm Sáng, 5-12) | Tầng 2 (Bước Vào Đời, 13-25) | Tầng 3-4 (Mentors, Tỏa Sáng) |
|---|---|---|---|
| **Output** | Sessions attended, skills demonstrated | Workshops completed, projects submitted | Hours mentored, content created |
| **Short-term** | Safety, belonging, self-esteem | Self-efficacy, social skills, career clarity | Giving back identity, community leadership |
| **Medium-term** | School performance, arts engagement | Higher education enrollment, employment | Program sustainability, peer teaching |
| **Long-term** | K-12 completion, economic mobility | Impact career, advocacy | Generational transformation |

---

<a name="2"></a>
## 2. THEORY OF CHANGE

### 2.1 Vấn đề gốc rễ

Nhiều trẻ em Việt — cả trong nước lẫn diaspora — không thiếu tài năng tiềm năng nhưng thiếu ba điều cốt lõi: **(1) môi trường an toàn ổn định** để phát triển; **(2) người lớn có trách nhiệm dài hạn** đồng hành liên tục (không phải volunteer 1 lần); **(3) cộng đồng có giá trị** nâng đỡ nhau qua các thế hệ. Khi thiếu ba điều này, tài năng không được khai phá — không phải vì trẻ không đủ giỏi, mà vì hệ thống xung quanh không đủ vững.

### 2.2 Cơ chế thay đổi

Nếu trẻ em được **(a)** giao cho Coordinator có lương, được đào tạo, ổn định — không phải volunteer cảm hứng; và **(b)** được theo dõi liên tục từ tiểu học đến hết THPT (12+ năm theo mô hình Friends of the Children); và **(c)** được nuôi dưỡng trong môi trường nghệ thuật + cộng đồng với các role model gần gũi (người Việt đã thành công đồng hành); **thì** trẻ sẽ phát triển cả ba chiều: học thuật, nghệ thuật/sáng tạo, và năng lực xã hội — đồng thời cảm thấy thuộc về một cộng đồng có ý nghĩa. Điều này dẫn đến **tốt nghiệp THPT**, **theo đuổi con đường phù hợp**, và cuối cùng **quay lại hỗ trợ thế hệ tiếp theo** (flywheel).

### 2.3 Giả định cần kiểm chứng

| Giả định | Phương pháp kiểm chứng | Timeline |
|---|---|---|
| Coordinator ổn định tạo ra gắn kết dài hạn với trẻ | SDQ repeat measures + churn rate Coordinator | T+12, T+24 |
| Nghệ thuật nâng cao tự tin và kỹ năng xã hội | Pre/post SDQ Prosocial subscale | T0 vs T+12 |
| Guardian engagement làm tăng hiệu quả chương trình | Guardian check-in score vs child SDQ correlation | T+6 |
| Sponsor mediation (không direct contact) không giảm impact so với direct model | So sánh cohort (khi có đủ sample ≥ 2 cohort) | Y3+ |
| Diaspora context không giảm program effectiveness | Stratified analysis VN vs overseas cohort | Y2+ |

---

<a name="3"></a>
## 3. OUTCOME INDICATORS PER TẦNG

### 3.1 Tầng 1 — Mầm Sáng (5-12 tuổi)

Tầng này đặc biệt — indicator phải đo được bởi guardian (proxy) hoặc Coordinator observation, không chỉ self-report từ trẻ nhỏ.

| Indicator | Phương pháp | Tần suất | Target Y1 |
|---|---|---|---|
| **School attendance rate** | Guardian report (%) | Monthly | ≥ 90% attendance |
| **SDQ Total Difficulties score** | SDQ guardian version | T0, T+6, T+12 | Giảm ≥ 10% từ baseline |
| **Self-reported sense of belonging** (age 7+) | Illustrated Likert 1-5 (smiley faces) | T+6, T+12 | ≥ 3.5/5 |
| **Arts participation rate** | Coordinator observation log | Monthly | ≥ 75% sessions attended |
| **Guardian engagement score** | Monthly check-in call (5-point scale) | Monthly | ≥ 4/5 average |
| **Basic needs screening** (food security, safe housing) | Coordinator checklist | T0, T+6 | 100% screened, referrals made if needed |

**Note:** Không đo IQ, academic grade trong Tầng 1 — không muốn tạo pressure học thuật sớm.

---

### 3.2 Tầng 2A — Học sinh 13-17 tuổi

| Indicator | Phương pháp | Tần suất | Target Y1 |
|---|---|---|---|
| **School continuation rate** | Guardian report | T+12 | ≥ 95% still enrolled |
| **Skill assessment score** (life skills workshop) | Pre/post quiz per workshop | Per workshop | ≥ 20% improvement |
| **Mentor session attendance** | Attendance log | Monthly | ≥ 80% |
| **Peer collaboration rating** | Coordinator observation (1-5) | T+6, T+12 | ≥ 3.5/5 |
| **Career exploration activities** | # informational interviews, visits completed | T+12 | ≥ 2 per participant |
| **SDQ self-report** (age 11-17 version) | SDQ self-report | T0, T+12 | Giảm ≥ 10% Total Difficulties |

---

### 3.3 Tầng 2B/2C — Sinh viên & Mới đi làm (18-25 tuổi)

| Indicator | Phương pháp | Tần suất | Target Y1 |
|---|---|---|---|
| **Program completion rate** | System log | T+90, T+180 | ≥ 70% complete 90-day journey |
| **Employment/education outcome** | 6-month follow-up survey | T+180 | ≥ 80% employed or in school |
| **Net Promoter Score (NPS)** | Post-program survey (0-10) | T+90 | ≥ 40 |
| **Skill self-efficacy score** | Pre/post Likert survey (10 items) | T0, T+90 | ≥ 30% improvement |
| **Peer mentoring hours given back** | System log | T+180 | ≥ 2h (if in peer mentor role) |

---

### 3.4 Tầng 3 — Người Đang Tỏa Sáng (Script Journey participants)

| Indicator | Phương pháp | Tần suất | Target Y1 |
|---|---|---|---|
| **Script Journey completion rate** | System log | Per product | ≥ 60% |
| **Arts performance count** | Self-report | T+12 | Increase from baseline |
| **Audition pass rate** (nếu applicable) | Self-report | T+12 | Track, no target Y1 |
| **Arts identity self-report** | Pre/post Likert 5-point | T0, T+90 | ≥ 20% improvement |
| **Community visibility** (shows, publications) | Self-report + social media scan | T+12 | Track, no target Y1 |

---

### 3.5 Tầng 4 — Người Đã Thành Công & Sponsors

| Indicator | Phương pháp | Tần suất | Target Y1 |
|---|---|---|---|
| **Sponsor retention rate** | System log | T+12 | ≥ 80% renew |
| **Community project count** (led by sponsors) | Self-report | T+12 | Track |
| **Younger-peer mentoring hours** | Log (for Master Mentor role) | T+12 | ≥ 10h if active mentor |
| **Sponsor satisfaction score** | Annual survey | T+12 | ≥ 4/5 |

---

### 3.6 Tầng 5 — Cộng Đồng Tỏa Sáng (Membership)

| Indicator | Phương pháp | Tần suất | Target Y1 |
|---|---|---|---|
| **Alumni giving rate** (for aging-out participants) | Donation tracking | T+24 | ≥ 10% of Y1 cohort donate by Y2 |
| **Community leadership roles** | Self-report | T+24 | Track |
| **Member churn rate** | System log | Monthly | < 5%/month |
| **Newsletter engagement** (open rate) | Email platform stats | Monthly | ≥ 30% open rate |

---

<a name="4"></a>
## 4. SDQ TOOL (STRENGTHS AND DIFFICULTIES QUESTIONNAIRE)

### 4.1 Tại sao SDQ

SDQ (Goodman, 1997) là công cụ screening tâm lý trẻ em được validate ở 70+ quốc gia, có bản tiếng Việt chính thức, miễn phí sử dụng cho nghiên cứu và tổ chức phi lợi nhuận. Phù hợp với NDNUM vì:
- Có bản 4-17 tuổi (bao phủ Tầng 1 + 2A)
- Có guardian proxy version cho trẻ nhỏ
- 25 item, hoàn thành trong 5-10 phút
- 5 subscale: Emotional, Conduct, Hyperactivity, Peer, Prosocial
- Total Difficulties = sum của 4 subscale đầu (không tính Prosocial)

### 4.2 Phiên bản theo độ tuổi

| Phiên bản | Tuổi | Người điền | Ngôn ngữ |
|---|---|---|---|
| SDQ Guardian (P4-17) | 4-17 | Phụ huynh/người giám hộ | VI + EN có sẵn |
| SDQ Teacher (T4-17) | 4-17 | Coordinator (proxy teacher) | VI + EN có sẵn |
| SDQ Self-report (S11-17) | 11-17 | Bản thân trẻ | VI + EN có sẵn |
| Illustrated SDQ (custom) | 4-7 | Trẻ em + Coordinator | Cần phát triển (smiley face scale) |

**Chính sách sử dụng:** SDQ miễn phí cho non-commercial use. Đăng ký tại sdqinfo.org. DSTS cần đăng ký tổ chức trước khi dùng.

### 4.3 5 Subscales

| Subscale | # Items | Range | Cao = |
|---|---|---|---|
| Emotional Problems | 5 | 0-10 | Nhiều vấn đề cảm xúc (xấu) |
| Conduct Problems | 5 | 0-10 | Nhiều vấn đề hành vi (xấu) |
| Hyperactivity/Inattention | 5 | 0-10 | Nhiều hyperactivity (xấu) |
| Peer Problems | 5 | 0-10 | Nhiều vấn đề với bạn bè (xấu) |
| **Prosocial Behavior** | 5 | 0-10 | **Nhiều hành vi xã hội (tốt)** |
| **Total Difficulties** | 20 | 0-40 | **Nhiều khó khăn tổng thể (xấu)** |

**Cut-off VN (tham khảo):** Total Difficulties ≤ 13 = normal; 14-16 = borderline; ≥ 17 = abnormal (cần refer)

### 4.4 Administration Timeline

```
T0 (Week 1 of cohort)  →  Baseline SDQ (Guardian + Coordinator)
T+6 (Month 6)          →  Midpoint SDQ (Guardian + Coordinator + Self-report nếu ≥11)
T+12 (Month 12)        →  Endline SDQ (full battery)
T+24 (Year 2, follow-up) → Follow-up SDQ (track persistence of gains)
```

### 4.5 Scoring & Reporting Protocol

1. Coordinator nhập điểm vào D1 ngay sau khi thu thập
2. M&E Specialist review outliers (Total Difficulties ≥ 17) → refer to mental health professional if needed
3. Báo cáo nội bộ: mean + SD per cohort, per subscale, per timepoint
4. Báo cáo public: **chỉ aggregate, không per-child, không per-family**
5. Trường hợp refer: Coordinator + CSO quyết định, guardian notified, confidential

---

<a name="5"></a>
## 5. DATA COLLECTION PROTOCOL

### 5.1 Overview Timeline

```
Week 1 (T0)    → Baseline assessment: SDQ (guardian + coordinator), basic needs screen
Month 1        → First guardian check-in call (15 min)
Monthly        → Coordinator observation log entry (weekly summary)
Month 3        → Quarterly internal report
Month 6 (T+6) → Midpoint: SDQ + self-efficacy + attendance review
Month 9        → Quarterly internal report
Month 12 (T+12)→ Endline: Full assessment battery + annual report
Year 2 (T+24) → Follow-up: Optional SDQ + alumni tracking
```

### 5.2 Coordinator Observation Log (weekly)

**Frequency:** 1 entry per child per week (5-10 minutes to complete)

**Fields:**
```
Week of: [date]
Child ID: [internal only, no name]
Attendance: present | absent (reason if known)
Engagement level: 1 (disengaged) - 5 (highly engaged)
Notable behaviors: [free text, max 200 chars]
Concerns flagged: none | guardian | CSO | M&E
Arts participation: yes | no | partial
Academic concerns: none | minor | flagged for referral
```

**Privacy:** Log accessible only to: assigned Coordinator, Lead Mentor, CSO, M&E Specialist, Founder (read-only). Never accessible to sponsors.

### 5.3 Guardian Monthly Check-in (15 minutes)

**Frequency:** Monthly phone call, Coordinator to guardian

**Structured questionnaire (5 questions, Likert 1-5):**
1. Con đang cảm thấy thế nào tại nhà và ở trường? (1 = rất không tốt, 5 = rất tốt)
2. Bạn thấy có thay đổi tích cực nào trong hành vi/thái độ của con? (1 = không có, 5 = nhiều)
3. Bạn cảm thấy được hỗ trợ đủ bởi chương trình? (1 = hoàn toàn không, 5 = hoàn toàn có)
4. Có vấn đề nào bạn muốn Coordinator biết không? (yes/no + open text)
5. Bạn có muốn thay đổi gì trong chương trình không? (yes/no + open text)

**Processing:** Coordinator log score + notes trong D1 ngay sau call. Aggregate monthly per cohort.

### 5.4 Child Self-report (age 8+)

**Format:** Digital survey (tablet/phone), 10 items, Likert 1-5 with illustrated faces

**Sample items:**
- "Khi tham gia chương trình, tôi cảm thấy..." (thang mặt cười 1-5)
- "Tôi có bạn bè tốt trong nhóm..." (1-5)
- "Tôi học được điều mới mỗi tuần..." (1-5)
- "Tôi tự tin hơn kể từ khi tham gia..." (1-5)
- "Tôi có thể nói chuyện với Coordinator khi cần..." (1-5)

**For age 4-7:** Illustrated version — Coordinator reads question, child points to face (happy/neutral/sad, 3-point scale). Takes ≤ 5 minutes.

**Administration:** Coordinator facilitates, guardian present for age ≤ 10, private for age 11+. Never in presence of sponsors.

### 5.5 Academic Progress Tracking

**Source:** Guardian report (not direct school access — privacy)

**Data collected:**
- School enrollment status: enrolled | unenrolled | homeschool
- Last known grade level
- Guardian-reported academic concern: none | minor | significant
- Attendance (approximate %)

**What DSTS does NOT collect:**
- GPA or actual grades (intrusive, not necessary for program goal)
- School name (privacy rule)
- Teacher names

### 5.6 Event & Activity Log

| Data | Source | Purpose |
|---|---|---|
| Sessions delivered | Coordinator log | Output reporting |
| Mentoring hours | Coordinator time log | Output reporting |
| Arts activities completed | Program records | Output reporting |
| Showcase performances | Event records | Output reporting |

---

<a name="6"></a>
## 6. PRIVACY & k-ANONYMITY RULES

### 6.1 Core principles

| Rule | Detail |
|---|---|
| **k-anonymity ≥ 5** | No statistic published about a group smaller than 5 children. If cohort < 5, defer publication until n ≥ 5 or aggregate with other cohort. |
| **Pseudonymization** | Child data stored with internal ID only (e.g., `CHD_2027_001`). Name never stored in same table as outcomes. |
| **No individual outcomes public** | No "Child A improved by X points" in any public material |
| **Aggregate only in public** | Cohort-level summaries: "The 2027 cohort showed an average 12% improvement in SDQ Total Difficulties" |
| **Sponsor-blind** | Sponsors never see individual child data, SDQ scores, or school/location |

### 6.2 Data access matrix

| Data | Coordinator | Lead Mentor | CSO | M&E Specialist | Founder | Sponsor | Public |
|---|---|---|---|---|---|---|---|
| Child name | ✅ Need-to-know | ✅ | ✅ | ❌ (ID only) | ❌ (ID only) | ❌ | ❌ |
| SDQ individual scores | ✅ | ✅ | ✅ | ✅ (pseudonymized) | ❌ | ❌ | ❌ |
| SDQ cohort aggregate | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (delayed) |
| Observation logs | ✅ | ✅ | ✅ | ✅ | Read-only | ❌ | ❌ |
| School name | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Guardian contact | ✅ | CSO only | ✅ | ❌ | Emergency only | ❌ | ❌ |

### 6.3 Retention schedule

| Data type | Retention | Deletion trigger |
|---|---|---|
| SDQ assessments | 10 years (legal compliance) | Guardian request → anonymize, not delete |
| Observation logs | 3 years active + 7 years archive | — |
| Guardian contact info | Duration of program + 1 year | Guardian withdrawal request → 30 days |
| Incident reports | 10 years (legal) | Cannot delete (legal obligation) |
| Aggregate impact reports | Indefinite (public record) | — |

### 6.4 Data breach protocol

Per `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md` + NĐ 13/2023:
- Discover → notify CSO + Founder within 1h
- Assess scope within 4h
- Notify affected guardians within 72h (NĐ 13/2023)
- Notify Cục An toàn thông tin within 72h if ≥ 100 records affected
- Document + report to Board within 7 days

---

<a name="7"></a>
## 7. EXTERNAL VALIDATION PLAN

### 7.1 Year 1 (2027) — Internal Audit

**Who:** Founder + M&E Specialist + CSO
**What:**
- Review data collection completeness (% missing data)
- Verify SDQ administration fidelity
- Assess coordinator observation log quality
- Calculate T0→T+12 SDQ change for cohort #1 (n=20)
- Document lessons learned for Year 2

**Output:** Internal report (10-15 pages, not public), shared with Board

**Cost:** Staff time only (~40h M&E Specialist)

### 7.2 Year 3 (2029) — External Evaluation

**Who:** Independent evaluation firm (international preferred — Vietnamese or diaspora background)
**Budget:** $30,000 - $50,000
**Scope:**
- Mixed-methods: quantitative (SDQ trends, completion rates, employment outcomes) + qualitative (guardian interviews, alumni focus groups)
- Comparison with Friends of the Children benchmarks where available
- Identify program theory gaps
- Recommend Y4-5 adjustments

**Output:** Public summary report (max 20 pages) + full technical report (internal)

**Procurement:** RFP process, CSO + Board approve vendor

### 7.3 Year 5 (2031) — RCT Feasibility Study

**What:** Assess feasibility of a Randomized Controlled Trial (waitlist control group design)
**Prerequisites:**
- Sample size: need ≥ 100 children in program (target reached by Y4)
- Ethics approval: IRB or equivalent (VN: Hội đồng đạo đức nghiên cứu y tế)
- Waitlist design: children on 6-month waitlist serve as control (ethical approach)

**Cost estimate:** $80,000 - $150,000 (grant-funded)

**Goal:** Generate Level 4 evidence (RCT) to attract major institutional funders (MacArthur, Gates, USAID)

### 7.4 Benchmark: Friends of the Children

NDNUM tracks against Friends of the Children (FOTC) benchmarks as reference:

| FOTC Benchmark (30-year data) | NDNUM Y5 Target |
|---|---|
| 83% youth graduate high school / GED | ≥ 80% |
| 92% avoid juvenile justice involvement | ≥ 90% |
| 93% avoid early parenthood (teen girls) | Track, no target Y1-3 |
| Avg 12+ years with same Friend (Coordinator) | Build retention system |

---

<a name="8"></a>
## 8. PUBLIC IMPACT DASHBOARD `/transparency/impact`

### 8.1 What IS public

| Data point | Format | Update cadence |
|---|---|---|
| Total children in active program | Single number | Quarterly |
| Total program phases completed | Program name + count | Quarterly |
| Total mentoring hours delivered | Cumulative | Quarterly |
| Cohort completion rate | % | Annual (post-cohort) |
| SDQ aggregate improvement | "% of cohort showed improvement in wellbeing score" (no numbers) | Annual |
| Sponsor count (with consent) | Number | Quarterly |
| Financial summary (Lane B) | Total raised, % to program, % to overhead | Annual (audited) |
| Staff team size | Number of paid staff | Quarterly |

### 8.2 What is NOT public

| Data | Reason |
|---|---|
| Individual child SDQ scores | Privacy |
| Individual child names or stories (unless written guardian consent + anonymized) | Privacy |
| Individual guardian information | Privacy |
| School names or locations | Privacy |
| Unadjusted cohort data n < 5 | k-anonymity rule |
| Financial projections (North Star $100M) | Misleading without context |

### 8.3 Dashboard design principles

- **Plain language:** Avoid jargon. "X% of children showed improvement in our wellbeing check" not "SDQ Total Difficulties scores decreased by X points"
- **Honest about what's not yet measured:** "We are building our M&E capacity — full Year 1 data available Q2/2027"
- **Limitations section visible:** Note sample sizes, potential biases
- **Methodology footnote:** Brief explanation of SDQ + k-anonymity for curious readers
- **No cherry-picking:** Show all tracked indicators, not just positive ones
- **Link to full annual report** (PDF) for deeper readers

### 8.4 Technical implementation

**Route:** `/transparency/impact` (static HTML, Layer 1 scope)

**Data source:**
- Manual update by M&E Specialist each quarter (CSV → static generation)
- Do NOT expose raw D1 to public dashboard (privacy risk)
- Process: M&E aggregates → Founder approves → Tech Lead generates HTML → deploy

**Responsive:** Mobile-first. No charts requiring JS if possible — prefer HTML tables with text arrows (↑12%, ↓) for accessibility.

---

<a name="9"></a>
## 9. D1 SCHEMA REFERENCES

*(Wave 3 schema — migration `0009_ndnum_impact.sql`)*

```sql
-- ndnum_impact_assessments: SDQ and other standardized assessments
CREATE TABLE IF NOT EXISTS ndnum_impact_assessments (
  id                    TEXT PRIMARY KEY,
  child_pseudoid        TEXT NOT NULL,     -- internal only, not name
  cohort_id             TEXT NOT NULL,
  assessment_type       TEXT NOT NULL CHECK(assessment_type IN
                          ('sdq_guardian','sdq_self','sdq_coordinator',
                           'self_efficacy','needs_screen','academic_screen')),
  administered_by       TEXT NOT NULL,     -- Coordinator ID
  timepoint             TEXT NOT NULL CHECK(timepoint IN ('T0','T+6','T+12','T+24')),
  -- SDQ subscale scores (null if not SDQ)
  sdq_emotional         INTEGER CHECK(sdq_emotional BETWEEN 0 AND 10),
  sdq_conduct           INTEGER CHECK(sdq_conduct BETWEEN 0 AND 10),
  sdq_hyperactivity     INTEGER CHECK(sdq_hyperactivity BETWEEN 0 AND 10),
  sdq_peer              INTEGER CHECK(sdq_peer BETWEEN 0 AND 10),
  sdq_prosocial         INTEGER CHECK(sdq_prosocial BETWEEN 0 AND 10),
  sdq_total_difficulties INTEGER GENERATED ALWAYS AS
                          (COALESCE(sdq_emotional,0) + COALESCE(sdq_conduct,0) +
                           COALESCE(sdq_hyperactivity,0) + COALESCE(sdq_peer,0)) VIRTUAL,
  -- Generic score for non-SDQ assessments
  raw_score             REAL,
  max_score             REAL,
  notes                 TEXT,
  flagged_for_referral  INTEGER NOT NULL DEFAULT 0,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_pseudoid, assessment_type, timepoint)
);

-- ndnum_coordinator_observations: weekly log entries
CREATE TABLE IF NOT EXISTS ndnum_coordinator_observations (
  id                    TEXT PRIMARY KEY,
  child_pseudoid        TEXT NOT NULL,
  coordinator_id        TEXT NOT NULL,
  week_of               TEXT NOT NULL,     -- ISO date of Monday
  attendance            TEXT NOT NULL CHECK(attendance IN ('present','absent','partial')),
  absence_reason        TEXT,
  engagement_score      INTEGER CHECK(engagement_score BETWEEN 1 AND 5),
  arts_participation    INTEGER NOT NULL DEFAULT 0,
  academic_concern      TEXT NOT NULL DEFAULT 'none'
                        CHECK(academic_concern IN ('none','minor','flagged')),
  concern_flag          TEXT NOT NULL DEFAULT 'none'
                        CHECK(concern_flag IN ('none','guardian','cso','mne')),
  notes                 TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ndnum_guardian_checkins: monthly structured call data
CREATE TABLE IF NOT EXISTS ndnum_guardian_checkins (
  id                    TEXT PRIMARY KEY,
  child_pseudoid        TEXT NOT NULL,
  coordinator_id        TEXT NOT NULL,
  checkin_month         TEXT NOT NULL,     -- YYYY-MM
  q1_wellbeing          INTEGER CHECK(q1_wellbeing BETWEEN 1 AND 5),
  q2_positive_change    INTEGER CHECK(q2_positive_change BETWEEN 1 AND 5),
  q3_program_support    INTEGER CHECK(q3_program_support BETWEEN 1 AND 5),
  q4_concerns           INTEGER NOT NULL DEFAULT 0,
  q4_notes              TEXT,
  q5_feedback           TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_pseudoid, checkin_month)
);

-- ndnum_impact_aggregate: pre-computed cohort aggregates for dashboard
-- Populated by M&E Specialist, not by API
CREATE TABLE IF NOT EXISTS ndnum_impact_aggregate (
  id                    TEXT PRIMARY KEY,
  cohort_id             TEXT NOT NULL,
  report_quarter        TEXT NOT NULL,     -- YYYY-QN
  metric_key            TEXT NOT NULL,
  metric_value          REAL,
  sample_size           INTEGER,           -- must be ≥ 5 before publishing
  is_publishable        INTEGER NOT NULL DEFAULT 0,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(cohort_id, report_quarter, metric_key)
);
```

---

<a name="10"></a>
## 10. DEV-READY — IMPLEMENTATION HOOKS

### 10.1 Dependencies

| Phụ thuộc | Status | Owner |
|---|---|---|
| Phase 0B legal lock | ⏳ Pending | Founder |
| M&E Specialist hire | ⏳ Pending (can defer 1 month post-Phase 0B) | Founder |
| SDQ license registration (sdqinfo.org) | ⏳ Pre-Phase 0B task | M&E Specialist |
| IRB / ethics approval for data collection | ⏳ Year 2-3 | M&E + Legal |

### 10.2 Files cần tạo (Wave 3+)

```
migrations/0009_ndnum_impact.sql      ← D1 schema (Mục 9 above)
functions/api/admin/ndnum/observe.js  ← POST coordinator observation
functions/api/admin/ndnum/assess.js   ← POST SDQ assessment
public/transparency/impact.html       ← Public dashboard (manual update)
```

### 10.3 Files cần đọc trước khi build

```
docs/NDNUM_CHILD_SAFETY_POLICY.md          ← Mục 6 (privacy) + data access matrix
docs/NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md ← Consent before assessment
docs/DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md ← Data retention + breach protocol
functions/_lib/api-helpers.js              ← d1Query pattern
functions/_lib/auth.js                     ← requireAccessJWT (admin-only endpoints)
```

### 10.4 Env vars cần

```
NDNUM_MAE_SPECIALIST_EMAIL=mae@duongsaotoasang.com
NDNUM_IMPACT_DATA_PUBLISH_ENABLED=false  # flip to true when M&E validates first cohort
```

### 10.5 M&E Specialist hire brief (Phase 0B task)

**Role:** Part-time M&E Specialist, 20h/month, Y1
**Required:** Experience with SDQ administration, child welfare programs, data analysis (R or SPSS), report writing (VI/EN)
**Budget:** $2,000-3,500/month
**Timeline:** Hire by Month 2 of Phase 0B so they can design instruments before first cohort

---

## CHANGELOG

| Phiên bản | Ngày | Tác giả | Ghi chú |
|---|---|---|---|
| v1.0-DRAFT | 2026-05-13 | Claude + Founder | Wave 3 W3.3 — initial impact measurement framework |
