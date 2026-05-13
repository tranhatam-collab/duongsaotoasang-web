# DSTS_TOUR_CALENDAR_2026_2027 — v1.0

> **Mã tài liệu:** `DSTS_TOUR_CALENDAR_2026_2027_2026-05-13`
> **Trạng thái:** 🟡 DRAFT — lịch chiến lược, chưa phải lịch public bán vé
> **Owner R:** Founder + Operations · **Approver A:** Founder · **Áp cho:** Layer 1 Movement Portal
> **Tham chiếu:**
> - `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` Mục 3.3 + 6
> - `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md`
> - `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md`
> - Drive cũ: Tổng kế hoạch nhiều quốc gia + Phía Sau Màn Nhung 2026

---

## 0. MỤC LỤC

1. Mục đích tour calendar
2. Nguyên tắc công bố lịch
3. Tour architecture 2026-2027
4. Country cluster map
5. Phase 0 — status review
6. Phase 1 — Southeast Asia
7. Phase 2 — East Asia + Australia
8. Phase 3 — North America
9. Phase 4 — Europe
10. Phase 5 — Global consolidation
11. City readiness score
12. Sponsor mapping theo region
13. Operations dependencies
14. Public route + data schema
15. Gate Founder lock

---

## 1. MỤC ĐÍCH TOUR CALENDAR

Tour Calendar là bản kế hoạch vận hành cho Layer 1 Movement Portal, dùng để:
- Chọn thứ tự quốc gia/thành phố theo mức sẵn sàng, không theo cảm hứng.
- Chuẩn hóa route `/movement/tour-2026-2027`.
- Gắn sponsor package theo country/region.
- Tránh công bố lịch quá sớm khi chưa có local host, venue, legal lane và budget.
- Làm nguồn cho Operations, Sponsor Manager, Press Liaison và Content Lead.

Tour này không chỉ là "show"; nó là chuỗi hoạt động cộng đồng:
- Story showcase
- Sponsor/donor briefing
- Vietnamese diaspora meetup
- Press/media story
- Youth/guardian-first inspiration event
  - **Áp Guardian-first flow** theo `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục IV + 12 quy tắc cứng Mục XIII
  - **Không tour stop nào có trẻ em participation** trước khi Phase 0B legal lock done + CSO assigned + `NDNUM_CHILD_SAFETY_POLICY.md` (Wave 3) LOCKED
  - Sponsor báo cáo qua Coordinator, không gặp trẻ trực tiếp
- Founder/community dialogue

---

## 2. NGUYÊN TẮC CÔNG BỐ LỊCH

### 2.1 Status levels

| Level | Internal status | Public wording | CTA |
|---|---|---|---|
| L0 | idea | Không public | Không CTA |
| L1 | target_country | Quốc gia mục tiêu | Nhận cập nhật |
| L2 | local_host_review | Đang xác minh đối tác địa phương | Đề xuất local host |
| L3 | planned_quarter | Dự kiến quý/tháng | Waitlist |
| L4 | date_hold | Đang giữ lịch | Register interest |
| L5 | confirmed | Đã xác nhận | Register / ticket |
| L6 | completed | Đã diễn ra | Recap |
| L7 | postponed/cancelled | Đã dời/hủy | Support/refund |

### 2.2 Public rule

Không công bố ngày cụ thể nếu thiếu:
- Local Host
- Venue hold
- Operations Lead
- Budget owner
- Payment/refund wording if paid
- Sponsor deliverable owner if sponsor attached

### 2.3 Mốc đã qua

Mốc `2026-01-22` trong Drive cũ phải được xử lý như một item `status_review`, không ghi là "sắp diễn ra".

---

## 3. TOUR ARCHITECTURE 2026-2027

### 3.1 Strategic sequence

```text
Phase 0A — 2026-05 to 2026-06
  Foundation + status review + partner map (Layer 0 Sprint 0-4)

Phase 0B — 2026-06 to 2026-08
  Legal + Child Safety Lock (NDNUM Phase 0B — blocker cho Phase 1+)
  Output: pháp nhân Lane B, Legal Counsel + CSO assigned,
  7 NDNUM spec con LOCKED, NDNUM v1.2-LOCKED

Phase 1 — 2026-09 to 2026-11
  Southeast Asia pilot (dịch +2 tháng vs v1.0)

Phase 2 — 2026-12 to 2027-02
  East Asia + Australia expansion (dịch +2 tháng vs v1.0)

Phase 3 — 2027-03 to 2027-06
  North America (dịch +2 tháng vs v1.0)

Phase 4 — 2027-07 to 2027-10
  Europe (dịch +2 tháng vs v1.0)

Phase 5 — 2027-11 to 2028-02
  Global consolidation + annual gala/report (dịch +2 tháng vs v1.0)
```

### 3.2 Event formats per city

| Format | Duration | Capacity | Purpose |
|---|---:|---:|---|
| Community Briefing | 90 phút | 30-80 | Partner/sponsor intro |
| Story Showcase | 2-3 giờ | 100-300 | Public inspiration event |
| Sponsor Dinner | 2 giờ | 10-30 | Relationship + renewal |
| Press Roundtable | 60 phút | 5-20 media | Press narrative |
| Online Bridge | 90 phút | 100-1000 | City with weak physical readiness |

### 3.3 Tour naming

Working title:

```text
DSTS World Tour 2026-2027
Đường Sao Tỏa Sáng — Hành trình người Việt toàn cầu
```

Không gắn sponsor title vào tour name trước khi Sponsor Agreement signed.

---

## 4. COUNTRY CLUSTER MAP

### 4.1 Priority clusters

| Cluster | Countries | Strategic reason |
|---|---|---|
| SEA Core | Vietnam, Singapore, Malaysia, Thailand, Cambodia, Laos, Philippines, Indonesia | Gần founder network, chi phí thấp, dễ pilot |
| East Asia | Japan, South Korea, Taiwan, Hong Kong | Cộng đồng Việt mạnh, truyền thông tốt |
| Oceania | Australia, New Zealand | Diaspora mature, sponsor potential |
| North America | United States, Canada | Large diaspora, philanthropy, press |
| Europe West | France, Germany, Netherlands, Belgium, Switzerland | Historic diaspora + institutional partners |
| Europe North | UK, Ireland, Denmark, Sweden, Norway, Finland | Education/culture network |
| Europe East | Czech Republic, Poland, Hungary | Vietnamese communities strong |
| Middle East | UAE, Qatar | Sponsor + global stage potential |

### 4.2 33+ target countries draft

```text
Vietnam
Singapore
Malaysia
Thailand
Cambodia
Laos
Philippines
Indonesia
Japan
South Korea
Taiwan
Hong Kong
Australia
New Zealand
United States
Canada
France
Germany
Netherlands
Belgium
Switzerland
United Kingdom
Ireland
Denmark
Sweden
Norway
Finland
Czech Republic
Poland
Hungary
Austria
UAE
Qatar
```

This is a target list, not a public confirmed schedule.

---

## 5. PHASE 0 — STATUS REVIEW (0A) + LEGAL/CHILD SAFETY LOCK (0B)

**Timeline:** 2026-05 to 2026-08 (Phase 0A: T5-6, Phase 0B: T6-8 — chèn theo Master Plan v1.2-DRAFT Mục IX)

Purpose:
- Finish Layer 0 Foundation (Phase 0A).
- Verify Drive event history.
- Confirm what happened with `Phía Sau Màn Nhung 2026`.
- Build local host database.
- Lock tour readiness criteria.
- **Phase 0B (chặn Phase 1+ launch):** lock pháp nhân Lane B + Legal Counsel + CSO assigned + 7 NDNUM spec con + NDNUM v1.2-LOCKED (xem `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục XI).

Deliverables Phase 0A:
- [ ] Founder confirms status of `2026-01-22` (completed | postponed | cancelled | merged)
- [ ] Operations creates `local_hosts.csv`
- [ ] Sponsor Manager creates top 100 sponsor prospect list
- [ ] Press Liaison drafts tour boilerplate
- [ ] Finance confirms which payment lanes are unavailable/available
- [ ] Tech Lead keeps Layer 1 routes closed until coming-soon approved

Deliverables Phase 0B (NDNUM):
- [ ] Founder answers 6 NDNUM decisions (Mục XVI)
- [ ] Legal Counsel VN hired
- [ ] Child Safety Officer consultant hired
- [ ] 7 NDNUM spec con drafted + LOCKED
- [ ] NDNUM v1.2-LOCKED published
- [ ] Pháp nhân Lane B (Nonprofit) registered + bank account active
- [ ] D&O + General Liability + Event Liability insurance bound

Exit criteria:
- Layer 0 smoke test green
- `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` locked to v1.0
- Country readiness score template approved
- NDNUM v1.2-LOCKED published (chặn Phase 1 Tour launch)
- CSO signed off on tour stops liên quan trẻ em (Young Star Showcase)

---

## 6. PHASE 1 — SOUTHEAST ASIA PILOT

**Timeline:** 2026-09 to 2026-11 (dịch +2 tháng vs v1.0 để chờ Phase 0B legal lock)

### 6.1 Target cities

| Month | Country | City | Status | Format |
|---|---|---|---|---|
| 2026-09 | Vietnam | Ho Chi Minh City | target_country | Community Briefing + Story Showcase |
| 2026-09 | Vietnam | Hanoi | target_country | Press Roundtable + Showcase |
| 2026-10 | Singapore | Singapore | target_country | Sponsor Dinner + Showcase |
| 2026-10 | Malaysia | Kuala Lumpur | target_country | Community Briefing |
| 2026-11 | Thailand | Bangkok | target_country | Online Bridge or Showcase |
| 2026-11 | Cambodia | Phnom Penh | target_country | Community Briefing |

### 6.2 Pilot goals

| Metric | Target |
|---|---:|
| Local Host confirmed | 4 |
| Events run | 3-5 |
| Sponsor inquiry | 20 |
| Press mention | 5 |
| Attendee total | 500-1,000 |
| Post-event reports published | 100% |

### 6.3 Do not expand if

- Event reports are missing.
- Sponsor deliverables are late.
- Payment/refund support cannot respond within 48h.
- Local safety incidents are unresolved.

---

## 7. PHASE 2 — EAST ASIA + AUSTRALIA

**Timeline:** 2026-12 to 2027-02 (dịch +2 tháng vs v1.0)

### 7.1 Target cities

| Month | Country | City | Status | Format |
|---|---|---|---|---|
| 2026-12 | Japan | Tokyo | target_country | Story Showcase + Press |
| 2026-12 | South Korea | Seoul | target_country | Community Briefing |
| 2027-01 | Taiwan | Taipei | target_country | Showcase |
| 2027-01 | Hong Kong | Hong Kong | target_country | Sponsor Dinner |
| 2027-02 | Australia | Sydney | target_country | Story Showcase |
| 2027-02 | Australia | Melbourne | target_country | Community Briefing |

### 7.2 Expansion goals

| Metric | Target |
|---|---:|
| Regional sponsor confirmed | 1-2 |
| Event attendance | 1,000-2,000 |
| Press coverage | 10 |
| Diaspora Star Map opt-in | 100 |
| Sponsor revenue | $50K-$150K |

### 7.3 Australia/New Zealand note

New Zealand can be added as an online bridge or local event if Australia operations show green on:
- Sponsor fulfillment
- Press handling
- Event day check-in
- Post-event reporting

---

## 8. PHASE 3 — NORTH AMERICA

**Timeline:** 2027-03 to 2027-06 (dịch +2 tháng vs v1.0)

### 8.1 Target cities

| Month | Country | City | Status | Format |
|---|---|---|---|---|
| 2027-03 | United States | California / Orange County | target_country | Flagship diaspora event |
| 2027-04 | United States | San Jose | target_country | Story Showcase |
| 2027-04 | United States | Houston | target_country | Community Briefing |
| 2027-05 | United States | New York | target_country | Press Roundtable |
| 2027-05 | Canada | Toronto | target_country | Showcase |
| 2027-06 | Canada | Vancouver | target_country | Community Briefing |

### 8.2 North America gates

Before publishing confirmed dates:
- US nonprofit/fiscal sponsor decision resolved if fundraising.
- Ticket tax/payment lane reviewed.
- Venue insurance reviewed.
- Media boilerplate English locked.
- Sponsor Agreement jurisdiction reviewed.

### 8.3 Target outcomes

| Metric | Target |
|---|---:|
| Sponsor inquiry | 40 |
| Confirmed sponsors | 3-5 |
| Press coverage | 20 |
| Attendee total | 2,000-5,000 |
| Sponsor revenue | $100K-$300K |

---

## 9. PHASE 4 — EUROPE

**Timeline:** 2027-07 to 2027-10 (dịch +2 tháng vs v1.0)

### 9.1 Target cities

| Month | Country | City | Status | Format |
|---|---|---|---|---|
| 2027-07 | France | Paris | target_country | Showcase + Press |
| 2027-07 | Germany | Berlin | target_country | Community Briefing |
| 2027-08 | Czech Republic | Prague | target_country | Diaspora Story Night |
| 2027-08 | Poland | Warsaw | target_country | Online Bridge / Briefing |
| 2027-09 | Netherlands | Amsterdam | target_country | Sponsor Dinner |
| 2027-09 | Belgium | Brussels | target_country | Institutional briefing |
| 2027-10 | United Kingdom | London | target_country | Showcase + Press |

### 9.2 Europe gates

- GDPR event registration review.
- Media/photo consent localized.
- Sponsor VAT/tax invoice review.
- Local host signed role agreement.
- Language support plan for Vietnamese/English/local language.

### 9.3 Europe target outcomes

| Metric | Target |
|---|---:|
| Events run | 5-7 |
| Local hosts | 7 |
| Press coverage | 20 |
| Partner MOU | 5 |
| Sponsor revenue | $100K-$250K |

---

## 10. PHASE 5 — GLOBAL CONSOLIDATION

**Timeline:** 2027-11 to 2028-02 (dịch +2 tháng vs v1.0)

Purpose:
- Publish annual impact report.
- Renew sponsors.
- Decide Year 2 tour route.
- Convert Movement Portal audience into Layer 2 Star Journey OS users.
- Prepare flagship gala/report.

Deliverables:
- [ ] `DSTS World Tour 2026-2027 Annual Report`
- [ ] Sponsor renewal deck
- [ ] Diaspora Star Map v1 public report
- [ ] Press recap package
- [ ] Founder decision: Year 2 focus countries

---

## 11. CITY READINESS SCORE

Each city gets score 0-100. Public confirmed dates require >= 80.

| Category | Weight |
|---|---:|
| Local Host quality | 20 |
| Venue readiness | 15 |
| Audience/community base | 15 |
| Sponsor prospect | 15 |
| Legal/payment clarity | 10 |
| Press potential | 10 |
| Operations cost | 10 |
| Safety risk | 5 |

### 11.1 Score interpretation

| Score | Meaning | Action |
|---|---|---|
| 0-39 | Not ready | Internal research only |
| 40-59 | Weak | Online bridge only |
| 60-79 | Possible | Planned quarter, no date |
| 80-89 | Ready | Date hold allowed |
| 90-100 | Strong | Confirm + sponsor campaign |

### 11.2 City score template

```text
Country:
City:
Local Host:
Venue candidate:
Community base:
Sponsor prospects:
Legal/payment notes:
Press notes:
Cost estimate:
Safety notes:
Score:
Decision:
```

---

## 12. SPONSOR MAPPING THEO REGION

### 12.1 Sponsor tier by phase

| Phase | Sponsor package focus |
|---|---|
| Phase 1 SEA | Star Champion, Star Pillar, 1-country Tour Sponsor |
| Phase 2 East Asia/Oceania | Tour Sponsor 1 Country, Regional Sponsor |
| Phase 3 North America | Regional Sponsor, Founding Partner, Visionary |
| Phase 4 Europe | Regional Sponsor, Institutional Partner |
| Phase 5 Consolidation | Global Title Sponsor, Legacy Anchor |

### 12.2 Sponsor activation per city

Every sponsor-attached city must define:
- Sponsor name
- Tier
- Deliverables
- Evidence owner
- Approval deadline
- Report deadline
- Conflict note

No sponsor logo goes public without:
- Signed agreement
- Payment milestone or written approval
- Brand asset approval
- Legal review if co-branded claims are used

---

## 13. OPERATIONS DEPENDENCIES

### 13.1 Must exist before Phase 1 public launch

- [ ] `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` locked
- [ ] Sponsor Agreement template reviewed
- [ ] Refund/support policy public
- [ ] `movement/coming-soon` or equivalent route approved
- [ ] Local Host role agreement template
- [ ] Press boilerplate
- [ ] Event budget template
- [ ] Post-event report template

### 13.2 Recommended tools

| Need | Tool |
|---|---|
| Event source of truth | D1 `events` table or Airtable/Notion during pilot |
| Registration | Tally/Typeform pilot, D1 form later |
| Ticket | Stripe Checkout Lane A |
| Donate/sponsor | Lane B processor or fiscal sponsor |
| Email | Resend/Mailgun |
| Calendar | ICS file + Google Calendar public embed |
| Check-in | QR code + CSV backup |
| Dashboard | Admin CMS Layer 2 |

---

## 14. PUBLIC ROUTE + DATA SCHEMA

### 14.1 Route plan

```text
/movement/tour-2026-2027
/movement/tour-2026-2027/vietnam
/movement/tour-2026-2027/singapore
/movement/tour-2026-2027/australia
/movement/tour-2026-2027/united-states
/movement/tour-2026-2027/europe
```

### 14.2 Tour stop record

```yaml
tour_stop_id: DSTS-TOUR-2026-00001
phase: 1
country:
city:
status:
target_month:
confirmed_date:
local_host:
venue:
format:
capacity_target:
sponsor_target:
public_page_url:
event_id:
readiness_score:
notes:
```

### 14.3 Public display rule

Homepage/public route can show:
- Target countries
- Target quarters/months
- Confirmed dates only after gate
- Status labels
- Waitlist CTA

Homepage/public route must not show:
- Unconfirmed venue
- Private local host contact
- Sponsor prospect names
- **Child/youth identity details** (tên đầy đủ, hình ảnh nhận diện, năm sinh chính xác) — full compliance `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục XIII
- **School name + exact home city** của trẻ em
- Sponsor-child direct interaction (mọi liên hệ qua Coordinator có lương)
- Revenue targets as guaranteed outcome

---

## 15. GATE FOUNDER LOCK

Before publishing this tour calendar publicly:

- [ ] Founder confirms Phase 0 status
- [ ] Founder decides whether `Phía Sau Màn Nhung 2026` is recap, postponed, cancelled, or merged
- [ ] Operations assigns Phase 1 Local Host candidates
- [ ] Sponsor Manager approves Phase 1 sponsor package focus
- [ ] Legal/payment lane status is written in public copy
- [ ] Route `/movement/tour-2026-2027` has fallback and 404-safe behavior
- [ ] No public date is shown without score >= 80

---

## CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-05-13 | Codex + Founder | Tạo lần đầu — tour architecture 2026-2027, 33+ countries, phase gates, city readiness score |
| v1.0.1 | 2026-05-13 | Claude + Founder | Wave 1 patch: chèn Phase 0B (2026-06 → 2026-08), dịch Phase 1-5 lùi +2 tháng, thêm reference NDNUM Mục XIII guardian-first + 12 quy tắc cứng |

---

## APPROVAL

- [ ] Founder review countries + phase order
- [ ] Operations Lead review city readiness score
- [ ] Sponsor Manager review regional sponsor mapping
- [ ] Legal/Finance review payment lane notes
- [ ] Press Liaison review public wording

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là lịch chiến lược nội bộ cho Layer 1. Không dùng như public ticket calendar trước khi từng city đạt readiness gate.*
