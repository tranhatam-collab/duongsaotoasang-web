# DSTS_MOVEMENT_UI_ROUTES_MOCKUP — v1.0-DEV-READY

> **Mã tài liệu:** `DSTS_MOVEMENT_UI_ROUTES_MOCKUP_2026-05-13`
> **Trạng thái:** 🟡 DRAFT v1.0-DEV-READY (Wave 2) — đủ chi tiết cho Frontend dev bắt đầu Layer 1.1 (Tháng 9/2026)
> **Owner R:** Frontend Lead + Founder · **Approver A:** Founder · **Timeline:** Tháng 9-12/2026 (sau Phase 0B legal lock)
> **Tham chiếu:**
> - `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` Mục 4 (route map gốc)
> - `DSTS_TOUR_CALENDAR_2026_2027.md` Mục 14 (tour route)
> - `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` (sponsor data shape)
> - `DSTS_MOVEMENT_EVENTS_API_CONTRACT.md` (event data shape)
> - `BRANDPRO_INTEGRATION_MAP.md` (visual tokens)
> - Existing HTML pages: `index.html`, `about.html`, `program.html`, `donate.html`

---

## 0. MỤC LỤC

1. Mục đích + scope
2. Route inventory (10 routes)
3. Page hierarchy + breadcrumb
4. Per-route block (template + 10 routes detail)
5. Component library (8 components)
6. Responsive breakpoints (6 sizes)
7. Asset requirements
8. Accessibility (WCAG 2.1 AA)
9. Localization (VI primary, EN secondary)
10. Implementation checklist
11. Gate Founder approve
12. Changelog

---

## 1. MỤC ĐÍCH + SCOPE

### Mục đích

File này cung cấp **đặc tả UI dev-ready** cho 10 route Layer 1 Movement Portal, đủ chi tiết để Frontend dev:

- Vẽ Figma low-fi mockup trong 1 ngày
- Build static HTML skeleton trong 1 sprint week
- Plug API contract (Sponsors + Events) trong sprint tiếp theo
- Pass WCAG 2.1 AA audit

### Scope

**INCLUDED:**
- Route URL pattern + page goal
- Section layout (header, hero, body blocks, CTA, footer)
- ASCII wireframe per route
- Data source (static / D1 / Notion CMS / API)
- SEO meta requirements
- 5-state pattern (loading, empty, error, success, partial)
- CTA buttons + destinations
- Component props (TypeScript-like)
- Responsive breakpoints
- A11y + i18n notes

**NOT INCLUDED (sẽ ở Wave 3 hoặc dev tự xử lý):**
- High-fi Figma file (Designer sẽ làm sau khi đọc file này)
- CSS pixel-perfect values (lấy từ Brandpro `tokens.css`)
- Production API endpoints (xem `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` + `DSTS_MOVEMENT_EVENTS_API_CONTRACT.md`)
- Backend pagination/filter implementation

---

## 2. ROUTE INVENTORY

10 route Layer 1, tất cả đều public (không login required):

| # | Route URL | Page goal | Data source | Priority Phase |
|---|---|---|---|---|
| 1 | `/movement` | Landing portal + 3-column overview | Static + Notion CMS | Phase 1.1 |
| 2 | `/movement/sponsors` | List 13 gói tài trợ + inquiry CTA | API `GET /api/movement/sponsors/tiers` | Phase 1.2 |
| 3 | `/movement/sponsors/{tier-slug}` | Detail 1 tier + benefits + inquiry form | API `GET .../tiers/:slug` + `POST .../inquiry` | Phase 1.2 |
| 4 | `/movement/events` | Calendar events (gala + tour + showcase) | API `GET /api/movement/events?status=open\|planned` | Phase 1.3 |
| 5 | `/movement/events/{event-slug}` | Detail event + register + payment | API `GET .../events/:slug` + `POST .../register` | Phase 1.3 |
| 6 | `/movement/tour-2026-2027` | Tour overview 33+ country map | API `GET .../tour-stops` + Static SVG map | Phase 1.3 |
| 7 | `/movement/tour-2026-2027/{country}` | Tour stop detail per country | API `GET .../tour-stops/:country` | Phase 1.3 |
| 8 | `/movement/gala-2026` | Gala flagship (sau Founder confirm A7) | API `GET .../events/gala-2026` | Phase 1.3 (BLOCKED bởi A7) |
| 9 | `/movement/diaspora-map` | Star Map opt-in (Vietnamese diaspora) | Static + Mapbox/Leaflet | Phase 1.4 |
| 10 | `/movement/press` | Press kit + media center download | Static + Notion CMS | Phase 1.4 |
| 11 | `/movement/partners` | Brand partner showcase | Static + JSON `data/partners.json` | Phase 1.4 |
| 12 | `/movement/coming-soon` | Placeholder cho route chưa active | Static HTML | Phase 1.1 (always-on) |

Total: 12 route (10 public + 2 hỗ trợ: `coming-soon` + `partners`). Note: `/movement` hợp nhất landing portal entry point.

---

## 3. PAGE HIERARCHY + BREADCRUMB

```
/                                          (Layer 0 home — KHÔNG thuộc Layer 1)
├── /movement                              (Layer 1 home)
│   ├── /movement/sponsors                 (Sponsors hub)
│   │   └── /movement/sponsors/{tier-slug} (Tier detail)
│   ├── /movement/events                   (Events calendar)
│   │   ├── /movement/events/{event-slug}  (Event detail)
│   │   └── /movement/gala-2026            (Gala detail — alias cho event Gala 2026)
│   ├── /movement/tour-2026-2027           (Tour overview)
│   │   └── /movement/tour-2026-2027/{country}  (Per-country)
│   ├── /movement/diaspora-map             (Star Map)
│   ├── /movement/press                    (Press kit)
│   ├── /movement/partners                 (Partners)
│   └── /movement/coming-soon              (Placeholder)
```

**Breadcrumb pattern:** `Trang chủ › Phong trào › [Section] › [Detail]`

Ví dụ:
- `/movement/sponsors/cohort-sponsor-50k` → `Trang chủ › Phong trào › Tài trợ › Cohort Sponsor $50K`
- `/movement/tour-2026-2027/vietnam` → `Trang chủ › Phong trào › Tour 2026-2027 › Việt Nam`

**Mobile nav pattern:** hamburger menu với 2 cấp; landing route đầu mỗi cấp giữ active state.

---

## 4. PER-ROUTE BLOCK

### Template chung

Mỗi route phải có đủ:

```yaml
url_pattern: /movement/...
page_goal: "1 câu — user xong page này biết/làm được gì"
sections:
  - header (giữ chung với Layer 0)
  - hero
  - body_blocks: [...]
  - cta
  - footer (giữ chung với Layer 0)
data_source: static | api | cms
api_endpoints: [...]                     # nếu data_source = api
seo_meta:
  title: "..."
  description: "..."
  og_image: "1200x630.jpg"
states:
  loading: "Đang tải..."
  empty: "..."
  error: "..."
  success: "..."
  partial: "..."
cta_buttons:
  - label: "..."
    destination: "..."
    state_required: "..."
a11y_notes: "..."
i18n_notes: "..."
```

---

### 4.1 `/movement` — Landing portal

```yaml
url_pattern: /movement
page_goal: "Giới thiệu Phong trào DSTS toàn cảnh + dẫn user đi 3 hướng: tài trợ, sự kiện, press."
data_source: static + notion_cms
api_endpoints:
  - GET /api/movement/highlights        # 3 metric card (countries, tiers, gala)
  - GET /api/movement/featured-partners # logo strip
seo_meta:
  title: "Phong trào — Đường Sao Tỏa Sáng"
  description: "Một phong trào tôn vinh hành trình tỏa sáng của Người Việt trên toàn cầu. Tour 33+ quốc gia, 13 gói tài trợ, gala flagship."
  og_image: "/assets/og/movement.jpg" (1200x630, brand visual)
```

Wireframe:

```
┌───────────────────────────────────────────────────────────┐
│ Header (shared Layer 0)                                   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  <MovementHero>                                           │
│  ███ MOVEMENT PORTAL ███                                  │
│  "Một phong trào tôn vinh hành trình tỏa sáng             │
│   của Người Việt Nam trên toàn cầu"                       │
│  [Become Sponsor →] [Upcoming Events →] [Press →]         │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  <ThreeMetricGrid>                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ 33+      │  │ 13       │  │ Q1/2027  │                │
│  │ COUNTRIES│  │ SPONSOR  │  │ NEXT     │                │
│  │ Tour     │  │ TIERS    │  │ GALA     │                │
│  │ 2026-27  │  │ $1K-$1M  │  │ (TBD)*   │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│  * Gala status pending Founder A7 confirm                │
├───────────────────────────────────────────────────────────┤
│  <PartnerLogoStrip>                                       │
│  FEATURED PARTNERS                                        │
│  [Logo1] [Logo2] [Logo3] [Logo4] [Logo5]                 │
├───────────────────────────────────────────────────────────┤
│  <TransparencyPreview>                                    │
│  Sponsor raised: $XX,XXX  Disbursed: $XX,XXX             │
│  → Open full report at /transparency                      │
├───────────────────────────────────────────────────────────┤
│ Footer (shared Layer 0)                                   │
└───────────────────────────────────────────────────────────┘
```

States: `loading` (skeleton blocks), `empty` (nếu API fail, show static fallback), `error` (small notice + retry).

CTA destinations:
- `Become Sponsor →` → `/movement/sponsors`
- `Upcoming Events →` → `/movement/events`
- `Press →` → `/movement/press`

A11y: H1 = "Phong trào — Đường Sao Tỏa Sáng", H2 cho mỗi block. 3 metric card đều phải có aria-label đầy đủ.

---

### 4.2 `/movement/sponsors` — Sponsors hub

```yaml
url_pattern: /movement/sponsors
page_goal: "List 13 gói tài trợ + cho user filter theo tier/lane + 1-click inquiry."
data_source: api
api_endpoints:
  - GET /api/movement/sponsors/tiers       # list 13 tier
  - POST /api/movement/sponsors/inquiry    # form submit
seo_meta:
  title: "13 gói tài trợ — Phong trào DSTS"
  description: "Từ $1K Community Friend đến $1M Visionary Legacy. 13 cấp tài trợ rõ ràng, minh bạch, không over-promise."
  og_image: "/assets/og/sponsors.jpg"
```

Wireframe:

```
┌───────────────────────────────────────────────────────────┐
│ Header + Breadcrumb: Trang chủ › Phong trào › Tài trợ    │
├───────────────────────────────────────────────────────────┤
│  <SponsorHero>                                            │
│  "13 cách bạn có thể nâng đỡ phong trào"                  │
│  Filter: [All] [Lane A] [Lane B] [Under $10K] [$10K+]    │
├───────────────────────────────────────────────────────────┤
│  <SponsorTierCard> × 13                                   │
│  Grid 3-col (desktop), 2-col (tablet), 1-col (mobile)    │
│  ┌─────────────────┐ ┌─────────────────┐                 │
│  │ Tier #1         │ │ Tier #2         │                 │
│  │ Community Friend│ │ Believer        │                 │
│  │ $1,000          │ │ $5,000          │                 │
│  │ • Benefit 1     │ │ • Benefit 1     │                 │
│  │ • Benefit 2     │ │ • Benefit 2     │                 │
│  │ • Benefit 3     │ │ • Benefit 3     │                 │
│  │ [Learn more →]  │ │ [Learn more →]  │                 │
│  └─────────────────┘ └─────────────────┘                 │
│  (continue 13 tiers...)                                  │
├───────────────────────────────────────────────────────────┤
│  <SponsorInquiryForm> (collapsible CTA)                   │
│  "Không sure tier nào phù hợp? Liên hệ Sponsor Manager"  │
│  Form: tên công ty, người liên hệ, email, ngân sách, ...  │
│  [Submit Inquiry →]                                      │
├───────────────────────────────────────────────────────────┤
│  <PrivacyNotice>                                          │
│  "DSTS không over-promise. Mọi cam kết theo                │
│   DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md Mục 3."        │
└───────────────────────────────────────────────────────────┘
```

States:
- `loading`: skeleton 13 card
- `empty`: "Hệ thống tier đang được cập nhật. Liên hệ Sponsor Manager qua email."
- `error`: "Không tải được danh sách tier. [Thử lại]"
- `success` (inquiry submit): "Đã nhận inquiry. Sponsor Manager sẽ liên hệ trong 72h."
- `partial`: load 3 tier đầu, lazy-load 10 còn lại

A11y: filter chip có aria-pressed; form có aria-required cho field bắt buộc; tier price có aria-label đầy đủ ("Five thousand US dollars").

---

### 4.3 `/movement/sponsors/{tier-slug}` — Tier detail

```yaml
url_pattern: /movement/sponsors/{tier-slug}
page_goal: "Detail 1 tier: benefit + deliverable + manual hours + sponsor agreement preview + 1-click inquiry."
data_source: api
api_endpoints:
  - GET /api/movement/sponsors/tiers/:slug
seo_meta:
  title: "{tier_name_vi} — {amount_usd} — Phong trào DSTS"
  description: "{deliverables_summary}"
  og_image: "/assets/og/sponsor-{tier-slug}.jpg"
```

Wireframe:

```
┌───────────────────────────────────────────────────────────┐
│ Breadcrumb: Trang chủ › Phong trào › Tài trợ › {tier}    │
├───────────────────────────────────────────────────────────┤
│  <TierHeroBanner>                                         │
│  Tier #11 — Cohort Sponsor — $50,000                      │
│  "Bảo trợ 1 cohort 10 trẻ em Mầm Sáng × 1 năm"           │
├───────────────────────────────────────────────────────────┤
│  <TierBenefitsList>                                       │
│  ✓ Logo trên website + report                            │
│  ✓ 2 báo cáo/năm qua Coordinator                         │
│  ✓ Virtual visit 1 lần/năm (group, no individual)        │
│  ✓ Annual Impact Report                                   │
│  ⊘ KHÔNG: 1:1 child contact, photo individual            │
├───────────────────────────────────────────────────────────┤
│  <DeliverablesTimeline>                                   │
│  Month 1: Kickoff + Coordinator assignment                │
│  Month 3: Mid-year letter from Coordinator                │
│  Month 6: Virtual cohort showcase (group)                 │
│  Month 9: Quarter 3 update                                │
│  Month 12: Annual Impact Report + renewal proposal       │
├───────────────────────────────────────────────────────────┤
│  <SponsorAgreementPreview>                                │
│  📄 Sponsor Agreement Template (preview):                │
│  • 14 sections (Parties, Scope, Deliverables, ...)        │
│  • Tier-specific addendum: NDNUM Cohort #11 clause       │
│  • "No direct child contact" rule (explicit)              │
│  [Download draft PDF →]                                  │
├───────────────────────────────────────────────────────────┤
│  <InquiryFormInline>                                     │
│  "Tôi quan tâm tier này. Tên: __ Công ty: __ Email: __"  │
│  [Submit Inquiry →]                                      │
└───────────────────────────────────────────────────────────┘
```

States: tương tự /sponsors. Special: nếu `tier_slug` không tồn tại → 404 với link về `/movement/sponsors`.

---

### 4.4 `/movement/events` — Events calendar

```yaml
url_pattern: /movement/events
page_goal: "List sự kiện sắp tới + filter theo type/country/year."
data_source: api
api_endpoints:
  - GET /api/movement/events?status=open|planned&country=xx
seo_meta:
  title: "Sự kiện — Phong trào DSTS"
  description: "Tour 33+ quốc gia, gala flagship, online showcase, sponsor briefing — đầy đủ lịch sắp tới."
```

Wireframe:

```
┌───────────────────────────────────────────────────────────┐
│ Breadcrumb: Trang chủ › Phong trào › Sự kiện             │
├───────────────────────────────────────────────────────────┤
│  <EventsHero>                                             │
│  "Sự kiện sắp tới"                                        │
│  Filter: [All] [Tour] [Gala] [Showcase] [Online]         │
│          [Country: All ▼] [Year: 2026 ▼]                 │
├───────────────────────────────────────────────────────────┤
│  <EventCard> × N (sorted by starts_at ASC)                │
│  ┌─────────────────────────────────────┐                 │
│  │ [Cover image 16:9]                  │                 │
│  │ Status: 🟢 Open registration         │                 │
│  │ 2026-09-15 · Ho Chi Minh City       │                 │
│  │ "Vietnam Tour Stop — Story Showcase"│                 │
│  │ Lane A ticket: $25 · 200 spots      │                 │
│  │ [Register →]                        │                 │
│  └─────────────────────────────────────┘                 │
│  (continue events list, pagination 10/page)              │
├───────────────────────────────────────────────────────────┤
│  <UpcomingTourTeaser>                                     │
│  "Tour 33+ quốc gia 2026-2027"                            │
│  [Open tour overview →]                                   │
└───────────────────────────────────────────────────────────┘
```

Status badge mapping (theo Event Runbook Mục 2.2):
- `draft`/`planned` → 🟡 "Đang lên kế hoạch"
- `open` → 🟢 "Đang mở đăng ký"
- `sold_out` → 🟠 "Hết chỗ — Waitlist"
- `closed` → ⚪ "Đã đóng"
- `completed` → 🔵 "Đã diễn ra — Xem recap"
- `postponed` → 🟡 "Đã dời lịch"
- `cancelled` → 🔴 "Đã hủy"

States: `loading` skeleton 5 card; `empty` "Chưa có sự kiện công bố. [Đăng ký nhận thông báo]"; `error` retry.

---

### 4.5 `/movement/events/{event-slug}` — Event detail

```yaml
url_pattern: /movement/events/{event-slug}
page_goal: "Detail event + register/buy ticket. Nếu có trẻ em → enforce guardian consent."
data_source: api
api_endpoints:
  - GET /api/movement/events/:slug
  - POST /api/movement/events/:slug/register
seo_meta:
  title: "{event_title} — {date} — {city}"
  description: "{public_excerpt}"
  og_image: "{event_cover_url}"
```

Wireframe:

```
┌───────────────────────────────────────────────────────────┐
│ Breadcrumb: Trang chủ › Phong trào › Sự kiện › {event}   │
├───────────────────────────────────────────────────────────┤
│  <EventHero>                                              │
│  [Cover 16:9]                                             │
│  Status: 🟢 Đang mở đăng ký                              │
│  2026-09-15 18:30-21:30 · Ho Chi Minh City               │
│  Venue: GEM Center (xác nhận)                            │
├───────────────────────────────────────────────────────────┤
│  <EventBody> (Notion CMS rendered)                        │
│  Mô tả sự kiện · Speakers · Schedule · FAQ               │
├───────────────────────────────────────────────────────────┤
│  <TicketTiers>                                            │
│  ┌────────────┐ ┌────────────┐                           │
│  │ Standard   │ │ VIP        │                           │
│  │ $25        │ │ $80        │                           │
│  │ 150 spots  │ │ 50 spots   │                           │
│  │ [Register] │ │ [Register] │                           │
│  └────────────┘ └────────────┘                           │
├───────────────────────────────────────────────────────────┤
│  <RegistrationForm> (collapsed)                           │
│  Name · Email · Phone · Ticket tier                       │
│  ☐ Consent media (photo/video) — optional                │
│  ☐ Consent marketing (newsletter) — optional             │
│  IF children_participation: Guardian fields required      │
│  [Pay & Register →]                                       │
├───────────────────────────────────────────────────────────┤
│  <SponsorAcknowledgement>                                 │
│  "Powered by: [Logo1] [Logo2] [Logo3]"                    │
└───────────────────────────────────────────────────────────┘
```

Guardian field gating (theo `DSTS_MOVEMENT_EVENTS_API_CONTRACT.md` + NDNUM Mục IV.3):

```html
{{#if event.children_participation}}
  <fieldset>
    <legend>Phụ huynh / Người giám hộ</legend>
    <input name="guardian_name" required>
    <input name="guardian_relationship" required>
    <input name="guardian_phone" required>
    <input name="guardian_email" required>
    <input type="checkbox" name="guardian_consent_signed" required>
      Tôi xác nhận đã đọc và đồng ý NDNUM_PARENT_GUARDIAN_CONSENT_FLOW
  </fieldset>
{{/if}}
```

States: paying (locked form + spinner), payment_success (QR/receipt), payment_failed (retry/contact support).

---

### 4.6 `/movement/tour-2026-2027` — Tour overview

```yaml
url_pattern: /movement/tour-2026-2027
page_goal: "Overview tour 33+ quốc gia, Phase 1-5 timeline, country readiness map."
data_source: api + static_svg_map
api_endpoints:
  - GET /api/movement/tour-stops
```

Wireframe:

```
┌───────────────────────────────────────────────────────────┐
│  <TourHero>                                               │
│  "Tour 2026-2027 — 33+ quốc gia, 5 phase"                │
├───────────────────────────────────────────────────────────┤
│  <WorldMapInteractive> (SVG with pins)                    │
│                                                           │
│   [Mapbox/Leaflet với pins level L0-L7]                  │
│   Hover pin → tooltip { country, status, date_hold }     │
│   Click pin → /movement/tour-2026-2027/{country}         │
├───────────────────────────────────────────────────────────┤
│  <PhaseTimeline>                                          │
│  Phase 0B: T6-8/2026 — Legal lock                         │
│  Phase 1:  T9-11/2026 — SEA (6 cities)                   │
│  Phase 2:  T12/26-T2/27 — East Asia + Australia          │
│  Phase 3:  T3-6/2027 — North America                     │
│  Phase 4:  T7-10/2027 — Europe                           │
│  Phase 5:  T11/27-T2/28 — Global consolidation           │
├───────────────────────────────────────────────────────────┤
│  <CityReadinessTable>                                     │
│  Country | City | Phase | Status | Date hold | Score      │
│  ...                                                      │
└───────────────────────────────────────────────────────────┘
```

Map technology: **Mapbox GL JS** (free tier 50K loads/month, có VN support) hoặc **Leaflet + OSM** (zero-cost). Recommend Leaflet cho Phase 1.1 (sau switch sang Mapbox khi cần geocoding).

---

### 4.7 `/movement/tour-2026-2027/{country}` — Country tour detail

Similar pattern: hero + city table + reach metric + sponsor mapping. Filter: tham chiếu `DSTS_TOUR_CALENDAR_2026_2027.md` Mục 6-9.

---

### 4.8 `/movement/gala-2026` — Gala detail

⚠️ **BLOCKED:** Wait until Founder confirms A7 status (`Phía Sau Màn Nhung 2026` — completed | postponed | cancelled | merged). Trước đó hiển thị `/movement/coming-soon` với note "Gala 2026 status pending Founder confirm".

Sau khi unblock, route alias đến `/movement/events/gala-2026` (event slug) hoặc render dedicated gala layout.

---

### 4.9 `/movement/diaspora-map` — Star Map

```yaml
page_goal: "Visualize Vietnamese diaspora trên thế giới, opt-in pin profile."
data_source: api + static_geojson
privacy_note: "Tham chiếu DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md — opt-in only, k-anonymity ≥ 5."
```

Wireframe: world map + opt-in form + privacy notice. Pins chỉ hiển thị khi user opt-in + có ≥ 5 user per region (k-anonymity). Trẻ em < 18: KHÔNG được pin.

---

### 4.10 `/movement/press` — Press kit

```yaml
page_goal: "Press kit download (logo, boilerplate, founder photo, press release archive)."
data_source: static_files
```

Sections: hero · press release archive · download asset (logo SVG/PNG, boilerplate VI/EN, founder bio) · media contact form.

---

### 4.11 `/movement/partners` — Partners showcase

```yaml
page_goal: "Brand partner showcase (current + alumni). Không phải sponsor — partner mean ecosystem allies."
data_source: static_json (data/partners.json)
```

Wireframe: hero + 4-col logo grid + tier indication (Strategic / Operational / Media / Academic).

---

### 4.12 `/movement/coming-soon` — Placeholder

```yaml
page_goal: "Khi route Layer 1 chưa active, redirect tới đây. Notify user + capture email."
data_source: static
```

Wireframe: hero "Đang chuẩn bị mở Tháng 9/2026" + email capture form + link về `/` Layer 0.

---

## 5. COMPONENT LIBRARY

8 component reusable cần build (props TypeScript-like):

```typescript
// 5.1 MovementHero
interface MovementHeroProps {
  title: string;
  subtitle: string;
  cta: Array<{ label: string; href: string; variant: 'primary' | 'secondary' }>;
  background: 'gradient' | 'image';
  backgroundImage?: string;
}

// 5.2 SponsorTierCard
interface SponsorTierCardProps {
  id: string;
  slug: string;
  tierName: { vi: string; en: string };
  amountUsd: number;
  benefits: string[];
  deliverablesSummary: string;
  manualHours: number;
  lane: 'A' | 'B';
  highlight?: boolean;
  href: string; // /movement/sponsors/{slug}
}

// 5.3 EventCard
interface EventCardProps {
  id: string;
  slug: string;
  coverUrl: string;
  status: 'draft' | 'planned' | 'open' | 'sold_out' | 'closed' | 'completed' | 'postponed' | 'cancelled';
  startsAt: string; // ISO 8601
  city: string;
  country: string;
  title: string;
  ticketTier?: { label: string; amountUsd: number };
  capacityRemaining?: number;
  childrenParticipation?: boolean;
  href: string;
}

// 5.4 TourStopMarker (cho map)
interface TourStopMarkerProps {
  country: string;
  city: string;
  level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
  status: string;
  dateHold?: string;
  readinessScore?: number;
  onClick: (country: string) => void;
}

// 5.5 DiasporaMapPin
interface DiasporaMapPinProps {
  region: string; // city + country
  count: number; // ≥ 5 vì k-anonymity
  optedIn: boolean;
}

// 5.6 PressKitDownloadCard
interface PressKitDownloadCardProps {
  title: string;
  type: 'logo' | 'boilerplate' | 'photo' | 'release';
  format: 'svg' | 'png' | 'pdf' | 'docx' | 'zip';
  size: string; // "120 KB"
  downloadUrl: string;
  thumbnailUrl?: string;
}

// 5.7 PartnerLogoStrip
interface PartnerLogoStripProps {
  partners: Array<{
    name: string;
    logoUrl: string;
    tier: 'strategic' | 'operational' | 'media' | 'academic';
    websiteUrl?: string;
  }>;
  maxDisplay?: number;
}

// 5.8 ComingSoonBanner
interface ComingSoonBannerProps {
  targetMonth: string; // "Tháng 9/2026"
  emailCapture?: boolean;
  fallbackHref?: string; // link về /
}
```

Recommend build với **Web Components** (vanilla) hoặc **Astro components** (nếu migrate sang Astro). Tránh React framework heavy cho Layer 1 static portal.

---

## 6. RESPONSIVE BREAKPOINTS

6 breakpoint theo Master Plan V.3:

| Breakpoint | Width | Layout adaptation |
|---|---|---|
| Mobile S | 320px | 1-col, hamburger nav, font 16px base |
| Mobile M | 375px | 1-col, hamburger nav |
| Mobile L | 414px | 1-col, hamburger nav, image full-width |
| Tablet | 768px | 2-col grid, side nav option |
| Desktop | 1024px | 3-col grid, top nav |
| Desktop XL | 1440px | 3-col grid, max-content-width 1200px |

CSS strategy: mobile-first, `@media (min-width: ...)`. Container max-width: 1200px center. Gutter: 16px mobile, 24px tablet, 32px desktop.

---

## 7. ASSET REQUIREMENTS

### 7.1 Logo + visual tokens

- DSTS logo SVG (full, mark only, dark, light) — từ Brandpro kit-v1.1/07
- 4 brand color (primary, secondary, accent, neutral) — `tokens.css`
- Typography: Inter (sans) + Lora (serif) — Google Fonts subset latin-vi

### 7.2 Map assets

- World map SVG (33+ country highlighted) hoặc Mapbox/Leaflet
- 33+ country flag (24x24, 48x48 PNG)

### 7.3 Sponsor tier icons

- 13 tier icon (Lucide Icons hoặc custom SVG)
- Tier color coding: Lane A (warm — gold/orange), Lane B (cool — blue/green)

### 7.4 Photography

- Founder portrait (1024x1024)
- 3-5 event reference photo (chưa có nếu Phase 0B chưa done; placeholder Brandpro)
- Stock photo nếu cần (Unsplash, Pexels — credit required)

### 7.5 OG images (1200x630)

- `/assets/og/movement.jpg`
- `/assets/og/sponsors.jpg`
- `/assets/og/events.jpg`
- `/assets/og/tour.jpg`
- `/assets/og/sponsor-{tier-slug}.jpg` (13 file, 1 per tier)

Total asset budget: ~50 file, ~5-10 MB compressed.

---

## 8. ACCESSIBILITY (WCAG 2.1 AA)

Mandatory:
- [ ] 1 H1 per page, hierarchical H2-H6
- [ ] All images have meaningful `alt` (or `alt=""` cho decorative)
- [ ] Keyboard navigable (Tab + Enter + Esc)
- [ ] Visible focus ring (don't `outline: none`)
- [ ] Color contrast ≥ 4.5:1 cho text, ≥ 3:1 cho UI element
- [ ] Form field có `<label>` (or `aria-label`)
- [ ] Form error có `aria-invalid` + `aria-describedby`
- [ ] Skip link đầu page ("Skip to main content")
- [ ] ARIA landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] No flashing > 3 times/sec
- [ ] Video có caption (Vietnamese + English subtitle)

Tools test: axe DevTools, Lighthouse a11y audit, manual keyboard test.

---

## 9. LOCALIZATION

- **Primary:** Vietnamese (`vi`)
- **Secondary:** English (`en`)
- **i18n strategy:** Hash-based language switcher (`lang=vi|en` query param hoặc separate URL `/en/movement/...`)
- **Locale-specific:** Date format (`dd/mm/yyyy` VN, `mm/dd/yyyy` US/EN), number format (Vietnamese `1.000.000` vs English `1,000,000`)
- **Currency display:** USD primary, VND alternative cho VN event
- **Content split:** Marketing copy (hero, CTA) bilingual at minimum; sponsor agreement legal text bilingual mandatory (NDNUM Mục IV)

Strategy file: `data/i18n/{vi|en}.json` cho UI string, Notion CMS `lang` field cho long-form content.

---

## 10. IMPLEMENTATION CHECKLIST

### Phase 1.1 — Tháng 9/2026 (Setup)

- [ ] Tạo `/movement/coming-soon.html` (static placeholder)
- [ ] Update `_redirects` reserve 11 Movement route → coming-soon (theo Wave 2 W2.T5)
- [ ] Designer ký off Figma low-fi mockup 10 route
- [ ] Frontend setup component library skeleton (8 component)
- [ ] Brand visual setup tokens.css

### Phase 1.2 — Tháng 10/2026 (Sponsors)

- [ ] Build `/movement` home + 3-metric grid
- [ ] Build `/movement/sponsors` + 13 tier card
- [ ] Build `/movement/sponsors/{tier-slug}` detail
- [ ] Wire API `GET .../sponsors/tiers` + `POST .../inquiry`
- [ ] Smoke test: load 13 tier + submit 1 inquiry → email reach Sponsor Manager

### Phase 1.3 — Tháng 11/2026 (Events + Tour)

- [ ] Build `/movement/events` calendar
- [ ] Build `/movement/events/{event-slug}` detail
- [ ] Build `/movement/tour-2026-2027` overview
- [ ] Build `/movement/tour-2026-2027/{country}` detail
- [ ] Build `/movement/gala-2026` IF Founder confirms A7
- [ ] Wire API `GET .../events` + `POST .../register`
- [ ] Wire payment với pay.iai.one Lane A (event ticket)

### Phase 1.4 — Tháng 12/2026 (Press + Map + Partners)

- [ ] Build `/movement/press` press kit
- [ ] Build `/movement/partners` showcase
- [ ] Build `/movement/diaspora-map` (Mapbox/Leaflet)
- [ ] Launch Layer 1 public, swap coming-soon → real route in `_redirects`
- [ ] Press release "Layer 1 Live"

---

## 11. GATE FOUNDER APPROVE

Trước khi public bất kỳ Movement route nào:

- [ ] Founder ký off Figma low-fi mockup
- [ ] Brand Guardian (Founder kiêm) ký off visual identity
- [ ] Legal Counsel ký off privacy notice text (hard-coded mọi page)
- [ ] CSO ký off bất kỳ route nào có `children_participation` reference
- [ ] Tech Lead xác nhận API contract aligned với UI route
- [ ] QA pass Lighthouse score ≥ 90/100 (Performance, A11y, SEO, Best Practices)
- [ ] WCAG 2.1 AA pass với axe DevTools
- [ ] Mobile S (320px) usability test pass với real device

---

## 12. CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0-DEV-READY | 2026-05-13 | Claude + Founder | Wave 2 W2.T1: tạo lần đầu — 10 route + 8 component + 6 breakpoint + a11y + i18n. Dev-ready cho Frontend kickoff Layer 1.1 Tháng 9/2026 |

---

## APPROVAL

- [ ] Founder review tổng
- [ ] Frontend Lead review component library + responsive
- [ ] Designer review wireframe + asset list
- [ ] SEO Specialist review meta + schema.org
- [ ] Legal Counsel review privacy text
- [ ] CSO review child participation flow

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là bộ đặc tả UI route dev-ready cho Layer 1 Movement Portal. Khi gọi API endpoint, tham chiếu `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` + `DSTS_MOVEMENT_EVENTS_API_CONTRACT.md`. Khi build sponsor flow, đọc thêm `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` + `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md`.*
