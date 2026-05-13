# DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC — v1.0

> **Mã tài liệu:** `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC_2026-05-13`
> **Trạng thái:** 🟡 DRAFT — spec đang viết song song với Layer 0 Sprint 0
> **Owner R:** Founder + Operations · **Approver A:** Founder · **Timeline:** Tháng 7-10/2026 (sau Layer 0)
> **Tham chiếu:**
> - `00_DSTS_MASTER_INDEX_2026.md` Mục 5.2
> - Drive cũ (Layer A): lưu diễn toàn cầu + sponsor + gala + truyền thông
> - `dsts-master-plan-v1.1-LOCKED.md`
> - `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md`

---

## 0. MỤC LỤC

1. Định nghĩa Layer 1 — Movement Portal
2. Khác biệt Layer 1 vs Layer 0 vs Layer 2
3. Sản phẩm chính Layer 1
4. Route map + screen mockup
5. Sponsor flow (13 gói)
6. Event flow (Tour 33+ quốc gia + Gala)
7. Diaspora Star Map
8. Press Kit + Media Center
9. Tích hợp với Layer 0 + Layer 2
10. Roadmap triển khai 4 tháng
11. KPI Layer 1

---

## 1. ĐỊNH NGHĨA LAYER 1 — MOVEMENT PORTAL

### Layer 1 là gì?

**Movement Portal** là phần website public, **không cần đăng ký tài khoản**, dùng để:
- Công bố mục tiêu phong trào "Đường Sao Tỏa Sáng"
- Mời gọi sponsor, donor, partner
- Hiển thị lịch tour, sự kiện, gala
- Press kit + media inquiry
- Diaspora Star Map (opt-in, từ Layer 2 data)

### Khác biệt Layer 1 vs Layer 2

| Layer 1 (Movement Portal) | Layer 2 (Star Journey OS) |
|---|---|
| Không cần login | Cần login + dashboard |
| Mục tiêu: kêu gọi + công bố | Mục tiêu: sản phẩm + lộ trình cá nhân |
| Đối tượng: sponsor, media, đối tác | Đối tượng: người Việt muốn tỏa sáng |
| Một chiều (info → user) | Hai chiều (interactive + journey) |
| Content tĩnh + dynamic update | Personalized + AI generated |
| Page count: ~10-15 trang | Page count: ~30+ trang + member area |

### Tại sao tách Layer 1 và Layer 2

1. **Layer 1 launch sớm** (Tháng 7-10/2026), bắt đầu kêu gọi sponsor + tour 22/01/2026 trước khi Layer 2 dashboard hoàn thiện
2. **Layer 1 không phụ thuộc database** — chủ yếu static HTML + Notion CMS
3. **Layer 1 SEO mạnh** — meta đầy đủ, indexable, share được trên mạng xã hội
4. **Layer 2 cần tech sâu** — D1, SSO, AI, dashboard — build trong Layer 2 sprint sau

---

## 2. KHÁC BIỆT LAYER 1 vs LAYER 0 vs LAYER 2

```
LAYER 0 — FOUNDATION (Sprint 0-4, đang chạy)
├── Routing OK
├── Pages chính có nội dung (/about, /program, /contact, /donate, /transparency, /legal)
├── /posts + /content fallback
├── /scripts đã có 9 archetype
├── /events placeholder
└── SEO + ops baseline

      ↓ extend (Tháng 7-10/2026)

LAYER 1 — MOVEMENT PORTAL (public-facing, no login)
├── /movement                       ← landing portal phong trào
├── /movement/sponsors              ← 13 gói tài trợ
├── /movement/events                ← calendar tour + gala
├── /movement/events/{event-slug}   ← detail event
├── /movement/tour-2026-2027        ← tour 33+ countries
├── /movement/gala-2026             ← gala đầu tiên 22/01/2026
├── /movement/diaspora-map          ← Star Map opt-in
├── /movement/press                 ← press kit + media center
├── /movement/partners              ← brand partner showcase
└── /movement/coming-soon           ← placeholder cho features đang chờ

      ↓ extend (Tháng 11+/2026)

LAYER 2 — STAR JOURNEY OS (member-only, login required)
├── /journey/assessment             ← Star Map Quiz
├── /journey/dashboard              ← personal dashboard
├── /journey/products               ← T1-T4 products
├── /journey/atlas                  ← personal Star Atlas
├── /journey/coach                  ← AI Star Coach
├── /journey/showcase               ← personal showcase
├── /account                        ← billing, privacy, data
└── api.duongsaotoasang.com         ← 18+ API endpoints
```

---

## 3. SẢN PHẨM CHÍNH LAYER 1

### 3.1 Sponsor portal (`/movement/sponsors`)

13 gói tài trợ ($1K - $1M) — xem chi tiết `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md`.

### 3.2 Event portal (`/movement/events`)

- Calendar list + filter (year, country, type)
- Mỗi event có page detail
- Registration form (không cần account)
- Auto-confirm email
- Pre-event reminder (1 ngày trước)
- Post-event recap

### 3.3 Tour 2026-2027 (`/movement/tour-2026-2027`)

- Map 33+ quốc gia (visual + list)
- Mỗi city có local host info + đối tác
- Schedule per city
- Sponsor packages per region
- Local press contact

### 3.4 Gala 2026-01-22 (`/movement/gala-2026`)

- "Phía Sau Màn Nhung 2026" — sự kiện đầu tiên
- Ngày: 22/01/2026
- Detail page với:
  - Theme + concept
  - Lineup nghệ sĩ
  - Ticket tiers + sponsor tiers
  - Venue + map
  - Press inquiry CTA
  - Live stream link (khi event live)

### 3.5 Diaspora Star Map (`/movement/diaspora-map`)

- Bản đồ thế giới với pin Việt Nam tỏa sáng theo country
- Click pin → list profile public (từ Layer 2, opt-in only)
- Filter theo lĩnh vực (entrepreneur, artist, singer, actor, thinker, leader, ambassador, legacy)
- Privacy-first: chỉ hiển thị user opt-in
- Không hiện email/phone, chỉ first name + city + brief bio

### 3.6 Press Center (`/movement/press`)

- Logo files (Brandpro spec từ `07-Visual-Identity-Spec.md`)
- Press release archive
- Founder bio + photo (high-res)
- Boilerplate "About DSTS"
- Press inquiry form → `press@duongsaotoasang.com`
- Media coverage timeline

### 3.7 Partners (`/movement/partners`)

- Brand partner showcase (corporate sponsor logos)
- Ecosystem partner (Muôn Nơi, IAI.ONE, Phương Đông)
- Government / institutional partner
- Verified với MOU ký

---

## 4. ROUTE MAP + SCREEN MOCKUP

### 4.1 Route map Layer 1

```
duongsaotoasang.com/
├── /movement                       (Layer 1 home — đăng nhập không bắt buộc)
│   ├── /sponsors                   (13 gói + inquiry)
│   ├── /sponsors/{tier-slug}       (detail mỗi gói)
│   ├── /events                     (calendar)
│   ├── /events/{event-slug}        (detail + register)
│   ├── /tour-2026-2027             (tour overview)
│   ├── /tour-2026-2027/{country}   (per country)
│   ├── /gala-2026                  (gala đầu tiên)
│   ├── /diaspora-map               (Star Map)
│   ├── /press                      (press kit)
│   ├── /partners                   (partner showcase)
│   └── /coming-soon                (placeholder)
```

### 4.2 Screen mockup sketch

```
┌─────────────────────────────────────────────────────────┐
│ Header (giữ chung với Layer 0)                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│        ███ MOVEMENT PORTAL ███                          │
│                                                         │
│   "Một phong trào tôn vinh hành trình tỏa sáng         │
│    của Người Việt Nam trên toàn cầu"                    │
│                                                         │
│   [Become Sponsor]  [Upcoming Events]  [Press]          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  3-COLUMN GRID                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 33+      │  │ 13       │  │ Q1/2026  │              │
│  │ COUNTRIES│  │ SPONSOR  │  │ FIRST    │              │
│  │ Tour     │  │ TIERS    │  │ GALA     │              │
│  │ 2026-27  │  │ $1K-$1M  │  │ 22/01    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│  FEATURED PARTNERS                                      │
│  [Logo1] [Logo2] [Logo3] [Logo4] [Logo5]               │
├─────────────────────────────────────────────────────────┤
│  TRANSPARENCY (preview /transparency)                   │
│  Sponsor raised: ...   Disbursed: ...   Open report     │
├─────────────────────────────────────────────────────────┤
│ Footer (giữ chung với Layer 0)                          │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Đặt route Layer 1 trong `_redirects` (Sprint 1-2)

```
# === Layer 1 Movement Portal routes ===
# Phase 1.1: Coming-soon placeholder
/movement                /movement/coming-soon.html       200
/movement/sponsors       /movement/coming-soon.html       200
/movement/events         /movement/coming-soon.html       200

# Phase 1.2: Khi nội dung sẵn, swap
# /movement                /movement/index.html             200
# /movement/sponsors       /movement/sponsors.html          200
# ...
```

🚫 KHÔNG enable Layer 1 route trong Sprint 0 (theo `dsts-master-plan-v1.1-LOCKED.md` V.1 comment: "Add /movement only after coming-soon.html exists and Founder approves opening post-Sprint-0 roadmap routes").

---

## 5. SPONSOR FLOW (13 GÓI)

Chi tiết trong `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` (file 2 batch này).

Tổng quan flow public-facing:

```
Sponsor truy cập /movement/sponsors
  → Browse 13 gói
  → Click gói quan tâm → /movement/sponsors/star-pillar-25k
  → Đọc benefit + deliverable + timeline
  → Click "Request Inquiry"
  → Form: company + contact + budget range + intent
  → Submit → email founder + Sponsor Manager
  → Manual review 5-7 ngày
  → Sponsor Agreement → KYC → Wire
  → Activate
```

---

## 6. EVENT FLOW (TOUR + GALA)

### 6.1 Event registration flow

```
User truy cập /movement/events/gala-2026-01-22
  → Đọc detail
  → Click "Register" (free) hoặc "Buy ticket"
  → Form: tên + email + ticket tier
  → Submit:
      - If free: confirm + add to calendar
      - If paid: Stripe Checkout
  → Confirmation email với QR code (event check-in)
  → 7 ngày trước event: reminder email
  → 1 ngày trước: reminder + venue map
  → Sau event: recap email + photo album link
```

### 6.2 Event types

| Type | Examples | Tier |
|---|---|---|
| Gala | Phía Sau Màn Nhung 2026 | Annual flagship |
| Tour show | Star Tour {country} 2026-2027 | Multi-city quarterly |
| Monthly Online Showcase | Online Talent Night | Monthly |
| Founder Story Night | 1 founder spotlight | Quarterly |
| Artist Story Night | 1 artist spotlight | Quarterly |
| Diaspora Dialogue | Panel cross-country | Quarterly |
| Young Star Showcase | Tầng 1-2 NDNUM showcase | Yearly |

### 6.3 Roles cho mỗi event

- **Event Lead** — Operations đảm nhận end-to-end
- **Local Host** — partner địa phương (per city)
- **Press Liaison** — handle media
- **Volunteer Coordinator** — recruit + brief volunteer
- **Technical Producer** — sound/light/stream (outsource)

---

## 7. DIASPORA STAR MAP

### 7.1 Mục đích

- Bản đồ tỏa sáng Người Việt toàn cầu
- Inspiration cho generation tiếp theo
- Community building cross-country

### 7.2 Privacy-first rule

Như đã ghi trong `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md` Mục 7:

- Chỉ user opt-in mới hiển thị
- KHÔNG hiển thị email/phone public
- First name + city only (không full name, không exact address)
- Có thể withdraw bất cứ lúc nào
- Verification badge nếu evidence link
- Non-indexable nếu user chọn "private link only"

### 7.3 Data source

- Layer 2 user opt-in (chính)
- Manual curation từ founder (cho ngôi sao đã nổi tiếng, theo Public Figure exception)
- Press / community submission (qua moderation)

### 7.4 UI elements

- World map (mapbox hoặc leaflet open-source)
- Country pin với count
- Click country → list user
- Click user → mini profile card (first name + city + lĩnh vực + 1-line bio + link Showcase nếu có)
- Filter: lĩnh vực, year of "shining", etc.

---

## 8. PRESS KIT + MEDIA CENTER

### 8.1 Press kit assets

- Logo files: SVG + PNG @1x/@2x/@3x, light + dark
- Color palette (theo Brandpro 07.C)
- Typography spec
- Founder photo: high-res, multiple angle
- Boilerplate "About DSTS" (English + Vietnamese)
- Fact sheet PDF
- Recent press release archive
- Media-ready event photos (Creative Commons với credit)

### 8.2 Press release template

```
FOR IMMEDIATE RELEASE
[City, Country] — [Date]

[Headline — câu mở thu hút]

[Sub-headline — 1 câu mở rộng]

[Paragraph 1 — what, when, where]

[Paragraph 2 — why, how]

[Paragraph 3 — context + significance]

[Quote founder]

[Quote partner/sponsor nếu có]

About Đường Sao Tỏa Sáng:
[Boilerplate]

Media Contact:
press@duongsaotoasang.com
+84 ... (khi có)
```

### 8.3 Media inquiry form

`/movement/press/inquiry`:
- Name
- Outlet
- Type: news, podcast, documentary, social
- Deadline
- Question/Topic
- → Email founder + Press Liaison (24h SLA)

---

## 9. TÍCH HỢP VỚI LAYER 0 + LAYER 2

### 9.1 Layer 0 → Layer 1

- Layer 0 `/about` link đến Layer 1 `/movement` để xem phong trào
- Layer 0 `/scripts` link đến Layer 1 `/movement/sponsors` cho corp ai muốn sponsor archetype
- Layer 0 footer có link `/movement/press` cho media

### 9.2 Layer 1 → Layer 2

- Mọi CTA "Tham gia hành trình" trên Layer 1 → Layer 2 `/journey/assessment`
- Diaspora Star Map data từ Layer 2 `showcase_profiles` table (chỉ public)
- Event registration optionally link với Layer 2 user account (khi có)

### 9.3 Layer 1 → Layer 0 transparency

- `/movement/sponsors` raised total link đến `/transparency` chi tiết
- Mọi sponsor confirmed → update transparency report (theo NĐ 03/2026)

---

## 10. ROADMAP TRIỂN KHAI 4 THÁNG

### Tháng 7/2026 — Setup (Phase 1.1)

- [ ] Lock pháp nhân Lane B (cho donate + sponsor)
- [ ] Thiết kế Layer 1 portal mockup
- [ ] Build `/movement/coming-soon.html`
- [ ] Brand visual cho event (per Brandpro 08)

### Tháng 8/2026 — Build (Phase 1.2)

- [ ] Build `/movement` home
- [ ] Build `/movement/sponsors` + 13 gói detail
- [ ] Build sponsor inquiry form + workflow
- [ ] Brand storytelling content cho 13 gói

### Tháng 9/2026 — Events (Phase 1.3)

- [ ] Build `/movement/events` calendar
- [ ] Build event detail template
- [ ] Build event registration flow
- [ ] Build `/movement/gala-2026` cho 22/01 event
- [ ] Build `/movement/tour-2026-2027`

### Tháng 10/2026 — Press + Map (Phase 1.4)

- [ ] Build `/movement/press` kit
- [ ] Build `/movement/partners` showcase
- [ ] Build `/movement/diaspora-map` MVP
- [ ] Launch Layer 1 public
- [ ] Press release "Layer 1 Live"

### Tháng 11/2026 onwards — Optimize + Layer 2 kick

- Monitor sponsor inquiry rate
- A/B test sponsor copy
- Bắt đầu Layer 2 spec sâu

---

## 11. KPI LAYER 1

### Year 1 (2026)

| Metric | Target |
|---|---|
| Movement page traffic | 50,000 unique/quarter |
| Sponsor inquiry | 100 inquiry/year |
| Sponsor confirmed | 10-15 (mix tier) |
| Sponsor revenue (Lane B) | $200,000 - $500,000 |
| Event registered (all events) | 5,000 |
| Event paid revenue (Lane A ticket) | $50,000 |
| Press inquiry | 50 |
| Press coverage | 20 media outlet |
| Diaspora Star Map opt-in | 200 user |
| Partner MOU | 5 |

### Year 2

| Metric | Target |
|---|---|
| Sponsor revenue | $1-3M |
| Event revenue | $200K |
| Press coverage | 100 outlet |
| Star Map opt-in | 1,000 |
| Partner MOU | 20 |

---

## CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-05-13 | Claude + Founder | Tạo lần đầu — Movement Portal spec với 7 sub-portal |

---

## APPROVAL

- [ ] Founder review tổng
- [ ] Operations Lead review event flow
- [ ] Sponsor Manager review 13 gói
- [ ] Press Liaison review press kit
- [ ] Tech Lead review tích hợp Layer 0/2

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là spec foundation cho Layer 1. Chi tiết per module xem các file con:*
- *`DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` (13 gói chi tiết)*
- *`DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` (event ops)*
- *`DSTS_TOUR_CALENDAR_2026_2027.md` (tour schedule)*

*Mọi PR Layer 1 phải ref file này. Sprint 1+ enable Layer 1 routes trong `_redirects`.*
