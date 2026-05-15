# NDNUM_CHILD_SAFETY_POLICY_2026.md

**Version:** 1.0  
**Date:** 2026-05-15  
**Status:** DRAFT — operational child safety policy for NDNUM, requires CSO sign-off before v1.0-LOCKED  
**Scope:** All NDNUM activities — preparing phase, pilot phase, and operational phases  
**Audience:** Founder, CSO, Legal, Operations, Coordinators, Mentors, Volunteers, Sponsors  
**Companion doc:** `NDNUM_CHILD_SAFETY_POLICY.md` (deeper structural policy v1.0-DRAFT) — this file is the team-execution-facing version.

---

# 1. PURPOSE

Bảo vệ tuyệt đối trẻ em trong mọi hoạt động NDNUM. Mục tiêu: zero incident, zero exposure, zero confusion.

Document này khoá cho team thực thi (Coordinator, Mentor, Volunteer, Sponsor, Dev). Document đi vào chiều sâu pháp lý + framework là `NDNUM_CHILD_SAFETY_POLICY.md` (~900 lines).

---

# 2. APPLY KHI NÀO

- Mọi hoạt động liên quan trẻ em (< 18) trong NDNUM
- Mọi hoạt động DSTS có `children_participation = true`
- Mọi nội dung public reference trẻ em
- Mọi đào tạo mentor, coordinator, volunteer
- Mọi sponsor onboarding nếu sponsor tier liên quan trẻ em

---

# 3. NGUYÊN TẮC BẤT BIẾN (12 RULES)

1. **Guardian-first.** Mọi tương tác với trẻ em phải đi qua phụ huynh/người giám hộ.
2. **No self-registration.** Trẻ em không tự tạo account, không tự apply.
3. **No private 1:1 adult-child.** Cấm DM riêng, chat riêng, gọi video riêng, gặp riêng.
4. **No public child profile.** Không công bố tên, ảnh, trường, địa chỉ, thông tin định danh.
5. **No fame/income promise.** Không hứa nổi tiếng, không hứa thu nhập, không hứa kết quả.
6. **Mentor screened + trained.** Mentor chưa qua screening + 40h training không được tương tác.
7. **Supervised only.** Mọi tương tác có ≥2 người lớn (two-person integrity).
8. **Incident reporting mandatory.** Mọi sự cố báo trong 24h.
9. **Lane separation absolute.** Sponsor không phải investor, support không phải profit.
10. **Age min 4.** Không nhận trẻ < 4 tuổi.
11. **CSO veto.** Child Safety Officer có quyền dừng mọi hoạt động không cần Founder approve.
12. **Right to withdraw.** Guardian có quyền rút consent bất kỳ lúc nào, không bị penalty.

---

# 4. NGƯỜI THAM GIA — RỜI ĐỘNG

## 4.1 Mentor states
`applied → screening → trained → approved → active → suspended | removed`

- `applied`: nộp đơn, chưa interview
- `screening`: đang background check (LLTP VN / DBS UK / FBI US tuỳ jurisdiction)
- `trained`: hoàn thành 40h training
- `approved`: CSO approved, ký Acknowledgement Form
- `active`: đang tương tác với trẻ (supervised)
- `suspended`: có nghi vấn, dừng tương tác chờ điều tra
- `removed`: kết thúc engagement (voluntary hoặc CSO-forced)

## 4.2 Guardian consent states
`pending → reviewed → approved | rejected → revoked (any time)`

- `pending`: guardian submit consent
- `reviewed`: program team review (legal + child safety)
- `approved`: CSO sign-off, child có thể tham gia supervised activity
- `rejected`: thiếu thông tin hoặc red flag
- `revoked`: guardian rút consent → dừng mọi activity của child ngay lập tức

## 4.3 Child profile states (INTERNAL ONLY)
`internal_only` — không có public profile bao giờ, ever.

---

# 5. CẤM HOÀN TOÀN

Team **không được làm** những việc sau, ngay cả khi anh Founder request:

- ❌ Đăng ký trẻ em qua public form
- ❌ Trẻ em tự tạo account
- ❌ Mentor 1:1 riêng (không supervised)
- ❌ Sponsor liên lạc trực tiếp với trẻ
- ❌ Sponsor biết tên/ảnh/trường của trẻ
- ❌ Đăng ảnh trẻ public (kể cả blur)
- ❌ Hứa kết quả (nổi tiếng, thu nhập, học bổng có guarantee)
- ❌ Recording session mà không có per-session consent
- ❌ Social media kết nối adult-child
- ❌ Tổ chức hoạt động có trẻ trước khi Phase 0B lock
- ❌ Mở child intake trước khi CSO approve
- ❌ Sửa policy này mà không có CSO sign-off

---

# 6. INCIDENT FLOW

## 6.1 4 loại incident
- **Type A — Safety emergency:** Trẻ trong nguy hiểm → call 113 (VN) / 911 (US) → CSO trong 1h
- **Type B — Boundary breach:** Mentor/staff vi phạm 12 rules → CSO trong 4h
- **Type C — Concern report:** Guardian/Coordinator có lo lắng → CSO trong 24h
- **Type D — Near-miss:** Suýt vi phạm → log trong 48h, monthly review

## 6.2 Mandatory reporting (≤ 4h to CSO)
Mọi staff/mentor/volunteer thấy/nghe/nghi 1 trong các incident → MUST report. Không có "tôi không chắc". Không có "để tôi suy nghĩ thêm".

## 6.3 External escalation (≤ 24h to authority)
- VN: Tổng đài Bảo vệ Trẻ em **1800 1567** (free, 24/7)
- US: Childhelp National Hotline **1-800-422-4453**
- UK: NSPCC **0808 800 5000**
- AU: Kids Helpline **1800 55 1800**

CSO làm escalation, KHÔNG phải Coordinator hay Mentor.

## 6.4 Audit trail
Mọi incident → log vào `ndnum_incidents` table với fields: `id, type, reported_by, reported_at, child_id (internal), mentor_id, narrative, cso_action, external_report_filed, resolved_at, status`.

---

# 7. CSO ROLE & VETO

## 7.1 Position
- **Board-independent.** CSO không report Founder direct, CSO report tới Board of Directors hoặc một Independent Oversight Committee.
- **Cannot be terminated by Founder alone.** Phải có Board vote.
- **Contract minimum 2 năm.**

## 7.2 Powers
- Veto bất kỳ activity nếu nghi unsafe (immediate, no appeal)
- Pause toàn bộ NDNUM operation nếu thấy systemic risk
- Direct line tới external authority bypass Founder
- Final approve mọi training curriculum, mọi consent form, mọi communication template

## 7.3 Independent oversight
- CSO có budget riêng cho external consultant/audit (~5% NDNUM operating budget)
- Quarterly child safety audit, report tới Board
- Annual external child safety review by 3rd party

---

# 8. CONSENT MECHANICS (mục lục, full flow tại NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md)

## 8.1 4 layers consent
1. **Guardian primary consent** — tham gia program (annual renewal)
2. **Activity-specific consent** — mỗi event/session (no carry-over)
3. **Media consent** — chụp ảnh nhóm (group ≥5, no individual), per-session
4. **Data consent** — process per NĐ 13/2023 + COPPA

## 8.2 Verifiable consent (COPPA Method)
- Method 1: Credit card $0.01 verify (US)
- Method 2: Government-ID upload + signature
- Method 3: Video call với guardian + ID
- Method 4: Postal mail consent form (slow)
- Method 5: Phone call recording (with consent)

VN equivalent: NĐ 56/2017 — written consent + ID copy.

---

# 9. MENTOR SCREENING (mục lục, full curriculum tại NDNUM_MENTOR_SCREENING_AND_TRAINING.md)

## 9.1 7-step funnel
1. Application form
2. CV review
3. 30-min phone screen (8 CSO-approved questions)
4. Background check (country-specific)
5. In-person interview (3 scenarios)
6. Reference check (3 references)
7. CSO final approve

## 9.2 Disqualifiers (absolute)
- Bất kỳ tội liên quan trẻ em / bạo lực / gian lận
- Lying on application (instant disqualify)
- Refuses background check
- Cannot pass mandatory reporting quiz

## 9.3 40h training (7 modules)
1. Child Development (6h)
2. Child Safety Law (6h)
3. Guardian-first Communication (6h)
4. Mandatory Reporting (4h)
5. Data Privacy (4h)
6. Anti-grooming + Boundaries (8h)
7. NDNUM Structure + 12 Rules (6h)

## 9.4 Recertification
Annual 8h refresher + scenario quiz pass ≥ 80%.

---

# 10. DATA & TECHNICAL CONTROLS

## 10.1 Data minimization
Chỉ collect data cần thiết. Không collect "just in case".

## 10.2 Pseudonymization
Child internal ID, KHÔNG dùng real name trong logs, dashboards, reports.

## 10.3 k-anonymity ≥ 5
Không publish stat cho cohort < 5 trẻ.

## 10.4 Data retention
- Active enrollment: full retention
- Post-exit: 7 năm (legal hold) → anonymize → 3 năm → delete
- Incident logs: 25 năm (kéo dài SOL cho child sex abuse claims US)

## 10.5 Access matrix
| Role | Child PII | Guardian PII | Coordinator notes | SDQ scores | Aggregate stats |
|------|-----------|--------------|-------------------|------------|-----------------|
| Founder | ❌ | ❌ | ❌ | ❌ | ✅ |
| CSO | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coordinator (assigned) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coordinator (other) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Lead Mentor | ❌ | partial | partial | aggregate | ✅ |
| Sponsor | ❌ | ❌ | ❌ | ❌ | ✅ |
| Public | ❌ | ❌ | ❌ | ❌ | ✅ (k≥5) |

## 10.6 Tech env gate
DSTS code có flag `NDNUM_CHILD_REGISTRATION_ENABLED=false` → mọi `children_participation=true` request → reject 503 `NDNUM_NOT_OPERATIONAL`. Flag chỉ chuyển `true` khi:
- CSO sign-off
- Legal Counsel sign-off
- Phase 0B locked
- First Coordinator hired

---

# 11. PUBLIC SURFACE RULES

## 11.1 NDNUM public pages
- `/dream-nurture` — roadmap only, no intake
- Footer disclaimer: "Chương trình chưa mở tiếp nhận trẻ em"
- No child photo, no child name, no testimonial từ child

## 11.2 Sponsor pages
- Sponsor tier liên quan trẻ → label: "Hỗ trợ chương trình", KHÔNG "Tài trợ một trẻ cụ thể"
- "No direct child contact" clause trong sponsor agreement
- Sponsor không bao giờ được nhận: tên, ảnh, school của trẻ
- Sponsor báo cáo annual: aggregate impact metrics only (k ≥ 5)

## 11.3 Event pages
Nếu event có trẻ tham gia (`children_participation=true`):
- CSO pre-approve format + checklist
- Two-person integrity tại event
- Photo policy: group only ≥5, CSO pre-approve trước khi capture
- No live stream
- No public attendee list

---

# 12. GATE PHÊ DUYỆT

## Gate 1 — Founder Review
- [ ] Hiểu 12 rules, agree không exception
- [ ] Đồng ý CSO independent reporting line
- [ ] Budget cho CSO + training + audit confirmed
- [ ] Hire timeline approved (CSO T6/2026)

## Gate 2 — CSO Review
- [ ] Background check process verified
- [ ] Training curriculum approved (7 modules, 40h)
- [ ] Incident reporting flow verified
- [ ] Sponsor agreement "no direct contact" clause confirmed
- [ ] Data access matrix approved

## Gate 3 — Legal Review (VN + US Counsel)
- [ ] Compliance: Luật Trẻ em 2016, NĐ 56/2017, NĐ 13/2023 (VN)
- [ ] Compliance: COPPA, CAPTA, state mandatory reporting (US)
- [ ] Consent form template legally binding both jurisdictions
- [ ] Data retention schedule compliant
- [ ] CSO contract terms reviewed

---

# 13. SIGN-OFF

Document này v1.0-LOCKED chỉ khi có 3 chữ ký:
1. Founder
2. CSO
3. Legal Counsel (VN + US, hoặc 1 firm cross-jurisdiction)

Trước khi 3 chữ ký → v1.0-DRAFT, NDNUM operations BLOCKED.

---

# 14. CROSS-REFERENCES

- `NDNUM_CHILD_SAFETY_POLICY.md` — full policy v1.0-DRAFT (~900 lines), deep dive
- `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` — consent mechanics
- `NDNUM_MENTOR_SCREENING_AND_TRAINING.md` — hire + training spec
- `NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md` — entity + money lane (FD-1 = Option C locked)
- `NDNUM_IMPACT_MEASUREMENT_FRAMEWORK.md` — SDQ + k-anonymity protocol
- `DSTS_LEGAL_LANE_ARCHITECTURE_AND_NDNUM_SAFE_LAUNCH_PLAN_2026.md` — 5-lane architecture
- `DSTS_ENTITY_AND_LANE_MAP_2026.md` — entity mapping per program

---

# 15. FINAL DIRECTIVE

NDNUM không tồn tại để build product. NDNUM tồn tại để bảo vệ trẻ em đang lớn lên trong một hệ thống có thể tin được. Mỗi rule trong document này có thể "chậm" workflow, nhưng KHÔNG có rule nào negotiable.

Khi có conflict giữa speed và safety → safety wins, every time, no exception.
