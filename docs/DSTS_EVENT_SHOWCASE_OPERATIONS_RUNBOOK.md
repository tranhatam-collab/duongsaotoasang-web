# DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK — v1.0

> **Mã tài liệu:** `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK_2026-05-13`
> **Trạng thái:** 🟡 DRAFT — chờ Founder xác nhận trạng thái sự kiện đầu tiên + Operations Lead lock quy trình
> **Owner R:** Founder + Operations · **Approver A:** Founder · **Áp cho:** Layer 1 Movement Portal
> **Tham chiếu:**
> - `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` Mục 6
> - `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` Mục 3 + 7
> - `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` Mục 3 + 8
> - `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md`
> - Drive cũ: Phía Sau Màn Nhung 2026 + tour nhiều quốc gia

---

## 0. MỤC LỤC

1. Mục đích runbook
2. Phạm vi event/showcase
3. Event lifecycle 10 stage
4. Role map + RACI
5. Event data model + status
6. Pre-production checklist
7. Production day checklist
8. Post-event reporting
9. Sponsor fulfillment trong event
10. Child/guardian-first safety
11. Risk register + escalation
12. Templates vận hành
13. Gate mở public

---

## 1. MỤC ĐÍCH RUNBOOK

Runbook này dùng để biến Layer 1 Movement Portal từ trang giới thiệu thành hệ vận hành sự kiện thật.

Mục tiêu:
- Không publish event khi chưa có owner, venue, status, contact và fallback.
- Không để event page chỉ là nội dung mẫu nhưng CTA như đã mở bán.
- Không nhận sponsor/ticket nếu legal lane và payment lane chưa sẵn.
- Mọi event có bằng chứng sau khi chạy: recap, ảnh, số người tham dự, sponsor deliverable, báo cáo minh bạch.

Nguyên tắc khóa:

```text
NO OWNER = NO EVENT
NO STATUS = NO PUBLIC CTA
NO LEGAL LANE = NO PAYMENT
NO POST-EVENT REPORT = NO NEXT SPONSOR CYCLE
```

---

## 2. PHẠM VI EVENT/SHOWCASE

### 2.1 Các loại event Layer 1

| Type | Route | Mục tiêu | Payment lane | Publish rule |
|---|---|---|---|---|
| Annual Gala | `/movement/gala-{year}` | Flagship fundraising + showcase | Lane A/B tùy ticket/donate | Founder + Legal approve |
| Country Tour Stop | `/movement/events/{country}-{city}-{date}` | Local community event | Lane A ticket + Lane B sponsor | Operations approve |
| Online Showcase | `/movement/events/online-{slug}` | Talent/story showcase | Free hoặc Lane A | Content Lead approve |
| Sponsor Dinner | Private link | Sponsor relationship | No public payment | Sponsor Manager approve |
| Press Briefing | `/movement/press/{slug}` | Media update | No payment | Press Liaison approve |
| Young Star Showcase | `/movement/events/young-star-{year}` | Guardian-first showcase | Lane B only | Guardian Safety approve |

### 2.2 Trạng thái event

| Status | Public label | CTA được phép |
|---|---|---|
| `draft` | Đang chuẩn bị | Không hiện public |
| `planned` | Đang lên kế hoạch | Theo dõi / nhận thông tin |
| `open` | Đang mở đăng ký | Register / Buy ticket |
| `sold_out` | Hết chỗ | Waitlist |
| `closed` | Đã đóng đăng ký | Xem thông tin |
| `completed` | Đã diễn ra | Xem recap |
| `postponed` | Đã dời lịch | Nhận cập nhật |
| `cancelled` | Đã hủy | Xem chính sách hoàn tiền |

Không dùng chữ "sắp diễn ra" nếu chưa có ngày giờ, địa điểm, owner và trạng thái.

### 2.3 Mốc Phía Sau Màn Nhung 2026

Trong Drive cũ có mốc `2026-01-22`. Vì ngày này đã qua so với ngày phát hành tài liệu `2026-05-13`, mọi doc vận hành phải ghi:

```text
Phía Sau Màn Nhung 2026: cần Founder xác nhận trạng thái chính thức:
1. Đã diễn ra
2. Đã dời lịch
3. Đã hủy
4. Đang đổi format sang event/tour mới
```

Không public lại mốc `2026-01-22` như một sự kiện tương lai.

---

## 3. EVENT LIFECYCLE 10 STAGE

```text
Stage 0: IDEA INTAKE
  → Founder / Operations nhập event idea
  → Status: draft

Stage 1: FEASIBILITY
  → Kiểm tra city, audience, local host, budget, legal lane
  → Status: draft hoặc rejected

Stage 2: EVENT BRIEF LOCK
  → Lock title, concept, audience, date range, owner
  → Status: planned

Stage 3: BUDGET + LEGAL REVIEW
  → Budget sheet, ticket/sponsor lane, insurance, contract
  → Status: planned

Stage 4: VENUE + PARTNER CONFIRMATION
  → Venue hold, local host, tech vendor, photographer
  → Status: planned

Stage 5: PUBLIC PAGE READY
  → Event page, SEO, CTA, fallback, refund note, contact
  → Status: open only after gate pass

Stage 6: REGISTRATION + SPONSOR ACTIVATION
  → Register, ticket, sponsor deliverable, press outreach
  → Status: open / sold_out

Stage 7: EVENT DAY EXECUTION
  → Check-in, run-of-show, safety, media, sponsor evidence
  → Status: closed

Stage 8: POST-EVENT CLOSE
  → Reconcile payment, refund if needed, vendor payment, recap
  → Status: completed

Stage 9: REPORTING + RENEWAL
  → Publish recap, transparency update, sponsor report, next-city handoff
  → Status: completed
```

---

## 4. ROLE MAP + RACI

### 4.1 Core roles

| Role | Responsibility |
|---|---|
| Founder | Final concept, public claims, sponsor sensitivity, final go/no-go |
| Operations Lead | Owns event plan end-to-end |
| Local Host | Owns local context, venue support, community invitation |
| Sponsor Manager | Sponsor inquiry, agreement, deliverables, report |
| Press Liaison | Press kit, media inquiry, press release, interview schedule |
| Technical Producer | Sound, light, livestream, recording, backup |
| Volunteer Coordinator | Volunteer recruitment, briefing, check-in, crowd support |
| Safety Lead | Emergency plan, minors policy, incident log |
| Finance Lead | Budget, payment reconciliation, refund, vendor invoice |
| Content Lead | Event page, recap, photos, quote approval |

### 4.2 RACI table

| Workstream | R | A | C | I |
|---|---|---|---|---|
| Event concept | Founder | Founder | Operations | Team |
| Budget | Finance Lead | Founder | Operations | Sponsor Manager |
| Venue | Operations | Founder | Local Host | Team |
| Sponsor activation | Sponsor Manager | Founder | Legal/Finance | Operations |
| Registration | Operations | Operations Lead | Tech Lead | Founder |
| Child/guardian safety | Safety Lead | Founder | Legal | Operations |
| Press | Press Liaison | Founder | Content Lead | Sponsor Manager |
| Event day | Operations Lead | Founder | Local Host | All |
| Post-event report | Operations + Finance | Founder | Sponsor Manager | Public |

---

## 5. EVENT DATA MODEL + STATUS

### 5.1 Event record fields

```yaml
event_id: DSTS-EVT-2026-00001
slug: gala-phia-sau-man-nhung-2026-status-review
title_vi:
title_en:
type: gala | tour_stop | online_showcase | press | sponsor_private
status: draft | planned | open | sold_out | closed | completed | postponed | cancelled
country:
city:
venue_name:
venue_address_public:
starts_at:
ends_at:
timezone:
owner:
local_host:
registration_mode: none | free | paid | invite_only | waitlist
payment_lane: none | A | B | mixed
capacity:
registered_count:
sponsor_slots:
press_contact:
support_email:
refund_policy_url:
transparency_report_url:
created_at:
updated_at:
```

### 5.2 Required fields before public

Before status can become `open`:
- `title_vi`
- `type`
- `status`
- `country` or `online`
- `starts_at` + timezone
- `owner`
- `registration_mode`
- `support_email`
- `refund_policy_url` if paid
- `payment_lane` if paid/sponsor involved

### 5.3 D1 schema draft

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_vi TEXT NOT NULL,
  title_en TEXT,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  country TEXT,
  city TEXT,
  venue_name TEXT,
  venue_address_public TEXT,
  starts_at INTEGER,
  ends_at INTEGER,
  timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  owner TEXT NOT NULL,
  local_host TEXT,
  registration_mode TEXT NOT NULL,
  payment_lane TEXT DEFAULT 'none',
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  support_email TEXT,
  refund_policy_url TEXT,
  transparency_report_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  ticket_tier TEXT,
  status TEXT NOT NULL,
  payment_id TEXT,
  checked_in_at INTEGER,
  consent_media INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
```

---

## 6. PRE-PRODUCTION CHECKLIST

### 6.1 T-90 đến T-60 ngày

- [ ] Founder lock concept + outcome
- [ ] Operations Lead assigned
- [ ] Local Host confirmed
- [ ] Budget v0 created
- [ ] Legal lane selected (`none`, `A`, `B`, `mixed`)
- [ ] Sponsor target list created
- [ ] Venue shortlist
- [ ] Risk review v0
- [ ] Event status remains `draft`

### 6.2 T-60 đến T-30 ngày

- [ ] Venue hold or contract
- [ ] Run-of-show v1
- [ ] Sponsor packages mapped to event
- [ ] Press angle drafted
- [ ] Ticket/refund terms reviewed if paid
- [ ] Registration form tested
- [ ] Public page copy drafted
- [ ] Accessibility needs considered
- [ ] Event status can move to `planned`

### 6.3 T-30 đến T-7 ngày

- [ ] Event page published with correct status
- [ ] CTA tested
- [ ] Registration confirmation email tested
- [ ] Calendar invite tested
- [ ] Vendor contacts final
- [ ] Volunteer briefing scheduled
- [ ] Sponsor logo/assets approved
- [ ] Press invite sent
- [ ] Emergency contact sheet ready

### 6.4 T-7 đến T-1 ngày

- [ ] Final attendance export
- [ ] QR/check-in list backup
- [ ] Run-of-show final
- [ ] Tech rehearsal
- [ ] Speaker/artist confirmation
- [ ] Sponsor deliverable checklist printed
- [ ] Incident log template ready
- [ ] Refund/support owner on call

---

## 7. PRODUCTION DAY CHECKLIST

### 7.1 Before doors open

- [ ] Venue access confirmed
- [ ] Stage, sound, light, screen checked
- [ ] Check-in station online + offline backup
- [ ] Volunteer briefing complete
- [ ] Safety Lead confirms exits and emergency contact
- [ ] Sponsor placements photographed before audience entry
- [ ] Press check-in ready

### 7.2 During event

- [ ] Check-in count tracked every 30 minutes
- [ ] Sponsor deliverables timestamped
- [ ] Press/media requests logged
- [ ] Incident log maintained
- [ ] Livestream/recording monitored
- [ ] Consent rules enforced for minors and sensitive stories
- [ ] Founder/MC avoids unapproved financial/legal claims

### 7.3 Closing

- [ ] Final thank-you message
- [ ] Lost/found and incident handoff
- [ ] Photo/video files copied to backup storage
- [ ] Vendor completion confirmation
- [ ] Sponsor evidence folder created
- [ ] Finance Lead receives settlement/export

---

## 8. POST-EVENT REPORTING

### 8.1 T+24h internal close

- [ ] Attendance count
- [ ] Registration no-show rate
- [ ] Revenue/donation initial total
- [ ] Expense initial total
- [ ] Incident report
- [ ] Media mentions
- [ ] Sponsor deliverables status
- [ ] Follow-up owners

### 8.2 T+7 public recap

Public recap must include:
- What happened
- When/where
- Attendance count range
- Sponsor/partner thanks
- Photos only with consent
- Public next step
- Transparency link if money was collected

### 8.3 T+30 sponsor report

Sponsor report includes:
- Deliverables fulfilled
- Evidence URLs
- Audience metrics
- Press/social metrics
- Financial summary relevant to sponsor
- Next activation options

---

## 9. SPONSOR FULFILLMENT TRONG EVENT

### 9.1 Evidence pack

For every sponsor deliverable, create evidence:
- Stage backdrop photo
- Logo placement screenshot/photo
- MC mention timestamp
- Press release copy
- Email/social post screenshot
- Attendee count
- Livestream analytics if applicable

### 9.2 No over-promise rule

Sponsor language must avoid:
- "Guaranteed media coverage"
- "Guaranteed audience number"
- "Guaranteed viral reach"
- "Guaranteed government/institutional endorsement"

Allowed language:
- "Planned placement"
- "Best-effort press outreach"
- "Expected audience range"
- "Published evidence after event"

---

## 10. CHILD/GUARDIAN-FIRST SAFETY

Any event involving children or youth:
- Guardian consent required before registration confirmation.
- No public full name + exact location.
- No direct sponsor-child contact.
- Photos require explicit media consent.
- Interview questions reviewed by Safety Lead.
- Gift/payment to child goes through guardian/coordinator, never direct sponsor request.
- Any safety concern pauses content publication until reviewed.

Public event pages must not expose:
- School name unless officially approved.
- Home city below safe granularity.
- Private health/family details.
- Unmoderated comments for child profiles.

---

## 11. RISK REGISTER + ESCALATION

| Risk | Severity | Owner | Mitigation |
|---|---|---|---|
| Venue cancellation | High | Operations | Backup venue + refund wording |
| Payment lane not ready | High | Finance | Use `planned` CTA, no paid checkout |
| Sponsor asks for content control | High | Sponsor Manager | Agreement clause + Founder escalation |
| Minors privacy issue | Critical | Safety Lead | Guardian-first policy + publication pause |
| Low registration | Medium | Operations | Partner push + waitlist conversion |
| Press misquote | Medium | Press Liaison | Approved boilerplate + recording |
| Technical failure | High | Technical Producer | Rehearsal + offline backup |
| Refund dispute | Medium | Finance | Clear refund policy + support SLA |

Escalation SLA:
- Critical safety/privacy: immediate Founder + Legal
- Payment/refund: 24h Finance + Founder
- Sponsor conflict: 48h Sponsor Manager + Founder
- Press issue: same day Press Liaison + Founder

---

## 12. TEMPLATES VẬN HÀNH

### 12.1 Event brief template

```text
Event title:
Event type:
Country/city:
Date range:
Owner:
Local host:
Audience:
Purpose:
What success looks like:
Payment lane:
Sponsor involvement:
Risk notes:
Founder decision needed:
```

### 12.2 Run-of-show template

```text
00:00 Doors open
00:30 Welcome
00:40 Founder opening
00:55 Segment 1
01:25 Sponsor acknowledgement
01:30 Segment 2
02:00 Community call-to-action
02:15 Closing
02:30 Networking / press
```

### 12.3 Post-event recap template

```text
Title:
Summary:
Date/location:
Attendance:
Key moments:
Sponsor/partner thanks:
Photos:
Transparency link:
Next event:
```

---

## 13. GATE MỞ PUBLIC

Before any Layer 1 event page goes public:

- [ ] `status` is not ambiguous
- [ ] Owner assigned
- [ ] Date/time/timezone present or label is "planned"
- [ ] CTA matches status
- [ ] Payment lane confirmed if paid
- [ ] Refund/support copy present if paid
- [ ] Sponsor claims reviewed
- [ ] Guardian-first rule checked if children/youth involved
- [ ] Route smoke test returns 200
- [ ] Founder or delegated Approver signs off

---

## CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-05-13 | Codex + Founder | Tạo lần đầu — event/showcase lifecycle, RACI, checklist, safety, reporting |

---

## APPROVAL

- [ ] Founder review tổng
- [ ] Operations Lead review lifecycle + checklist
- [ ] Finance Lead review payment/refund flow
- [ ] Safety Lead review guardian-first policy
- [ ] Sponsor Manager review fulfillment evidence

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là runbook vận hành Layer 1 event/showcase. Không dùng để mở bán hoặc nhận sponsor trước khi legal/payment gate trong `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` được xác nhận.*
