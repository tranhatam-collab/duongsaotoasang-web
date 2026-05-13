# DSTS_MOVEMENT_EVENTS_API_CONTRACT — v1.0-DEV-READY

> **Mã tài liệu:** `DSTS_MOVEMENT_EVENTS_API_CONTRACT_2026-05-13`
> **Trạng thái:** 🟡 DRAFT v1.0-DEV-READY (Wave 2)
> **Owner R:** Tech Lead + Operations · **Approver A:** Founder + Legal · **Timeline:** Build trong Layer 1 Phase 1.3 (Tháng 11/2026)
> **Tham chiếu:**
> - `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` Mục 5-7 (data model + lifecycle)
> - `DSTS_TOUR_CALENDAR_2026_2027.md` Mục 14 (tour route + schema)
> - `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` Mục 6 (event flow)
> - `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` Mục 4.4-4.7 (UI consumer)
> - `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` Mục 1 (design convention)
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục IV.3 (guardian consent rule cho event có trẻ em)
> - Existing pattern: `functions/api/donate/create.js`, `functions/api/donate/webhook.js`

---

## 0. MỤC LỤC

1. Design principles (kế thừa Sponsors API)
2. Authentication
3. Endpoints (6 endpoint)
4. Event status state machine (8 trạng thái)
5. Child safety rule trong API (CRITICAL)
6. Data shapes
7. D1 schema + migration `0007_events.sql`
8. Payment integration (pay.iai.one Lane A cho ticket)
9. Email flow + lifecycle reminder
10. Error code table
11. Implementation checklist
12. Smoke test cases
13. Changelog

---

## 1. DESIGN PRINCIPLES

Same as `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` Mục 1:

- REST + JSON
- Idempotency-key cho mọi POST
- `{ ok: true | false, ... }` envelope
- Cursor pagination
- Locale `vi | en`
- Versioning URL không version
- CORS same-origin

---

## 2. AUTHENTICATION

### 2.1 Public read (no auth)

- `GET /api/movement/events`
- `GET /api/movement/events/:slug`
- `GET /api/movement/tour-stops`
- `GET /api/movement/tour-stops/:country`

### 2.2 Public write (rate-limited, no auth nếu là user, JWT nếu là staff check-in)

- `POST /api/movement/events/:slug/register` (public, rate-limited 3 req/5min/IP + Turnstile)
- `POST /api/movement/events/:slug/check-in/:registration_id` (staff JWT required)

### 2.3 Admin (Cloudflare Access JWT)

- `PATCH /api/admin/events/:slug` (status transition, capacity update)
- `GET /api/admin/events/:slug/registrations` (export attendee list)

---

## 3. ENDPOINTS

### 3.1 GET `/api/movement/events`

**Query params:**
- `status` (optional): one of 8 status (xem Mục 4)
- `country` (optional): ISO 3166-1 alpha-2
- `year` (optional): YYYY
- `type` (optional): `gala | tour_stop | online_showcase | sponsor_dinner | press_briefing | young_star_showcase`
- `sort`: `starts_at_asc` (default), `starts_at_desc`, `created_at_desc`
- `limit` (default 20, max 50), `cursor`

**Sample response (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "evt_xxx",
      "slug": "vietnam-hcmc-2026-09-15",
      "type": "tour_stop",
      "status": "open",
      "title": { "vi": "Vietnam Tour Stop — HCMC Story Showcase", "en": "..." },
      "starts_at": "2026-09-15T18:30:00+07:00",
      "ends_at": "2026-09-15T21:30:00+07:00",
      "timezone": "Asia/Ho_Chi_Minh",
      "venue_name": "GEM Center",
      "city": "Ho Chi Minh City",
      "country": "VN",
      "country_name_vi": "Việt Nam",
      "cover_url": "/assets/events/hcmc-2026-09.jpg",
      "ticket_tiers": [
        { "label": "Standard", "amount_usd": 25, "capacity": 150, "remaining": 87 },
        { "label": "VIP", "amount_usd": 80, "capacity": 50, "remaining": 12 }
      ],
      "children_participation": false,
      "lane": "A",
      "sponsor_logos_url": ["/assets/sponsors/acme.svg"],
      "register_url": "/movement/events/vietnam-hcmc-2026-09-15"
    }
  ],
  "meta": { "total": 47, "filtered": 5, "limit": 20, "next_cursor": "eyJ..." }
}
```

### 3.2 GET `/api/movement/events/:slug`

Detail 1 event.

**Sample response:**
```json
{
  "ok": true,
  "data": {
    "id": "evt_xxx",
    "slug": "vietnam-hcmc-2026-09-15",
    "type": "tour_stop",
    "status": "open",
    "title": { "vi": "...", "en": "..." },
    "description_long": { "vi": "...", "en": "..." },
    "starts_at": "2026-09-15T18:30:00+07:00",
    "ends_at": "2026-09-15T21:30:00+07:00",
    "timezone": "Asia/Ho_Chi_Minh",
    "venue_name": "GEM Center",
    "venue_address": "8 Nguyen Binh Khiem, District 1, HCMC",
    "venue_map_url": "https://goo.gl/maps/...",
    "city": "Ho Chi Minh City",
    "country": "VN",
    "cover_url": "/assets/events/hcmc-2026-09.jpg",
    "gallery_urls": [...],
    "speakers": [
      { "name": "Founder Name", "role": "Founder DSTS", "photo_url": "..." }
    ],
    "schedule": [
      { "time": "18:30", "title_vi": "Đón khách + welcome drink", "title_en": "..." },
      { "time": "19:00", "title_vi": "Founder opening", "title_en": "..." }
    ],
    "ticket_tiers": [...],
    "children_participation": false,
    "child_safety_officer_assigned": null,
    "lane": "A",
    "payment_lane": {
      "lane": "A",
      "currency": "USD",
      "alt_currency": "VND",
      "exchange_rate_usd_vnd": 24500,
      "support_email": "events@duongsaotoasang.com",
      "refund_policy_url": "/legal#refund"
    },
    "sponsor_logos": [
      { "name": "Acme", "logo_url": "...", "website_url": "..." }
    ],
    "press_kit_url": "/movement/press#hcmc-2026-09",
    "iCalendar_url": "/api/movement/events/vietnam-hcmc-2026-09-15.ics",
    "register_count": 138,
    "capacity_total": 200,
    "capacity_remaining": 62,
    "created_at": "2026-08-01T10:00:00Z",
    "updated_at": "2026-09-10T15:30:00Z"
  }
}
```

**Error:**
- `404 EVENT_NOT_FOUND`

### 3.3 POST `/api/movement/events/:slug/register`

**Headers:**
- `Content-Type: application/json`
- `Idempotency-Key: <uuid>`
- `cf-turnstile-response: <token>`

**Request body (no children):**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "+84 90 1234 5678",
  "ticket_tier": "Standard",
  "quantity": 1,
  "consent_media": true,
  "consent_marketing": false,
  "lang": "vi"
}
```

**Request body (with children — children_participation=true):**
```json
{
  "name": "Nguyen Van A (guardian)",
  "email": "guardian@example.com",
  "phone": "+84 90 1234 5678",
  "ticket_tier": "Family",
  "quantity": 2,
  "consent_media": true,
  "consent_marketing": false,
  "lang": "vi",
  "guardian_name": "Nguyen Van A",
  "guardian_relationship": "father",
  "guardian_phone": "+84 90 1234 5678",
  "guardian_email": "guardian@example.com",
  "guardian_consent_signed": true,
  "child_first_names": ["B", "C"],
  "child_ages": [8, 11]
}
```

**Validation:**
- `name`: 2-100 chars, required
- `email`: RFC 5322 valid, required
- `phone`: E.164, optional (required if `ticket_tier != "Free"`)
- `ticket_tier`: phải tồn tại trong event `ticket_tiers`
- `quantity`: integer 1-10
- `consent_media`, `consent_marketing`: boolean
- **NẾU `event.children_participation = true`:**
  - `guardian_*`: tất cả required
  - `guardian_consent_signed`: phải `true`
  - `child_first_names`: array string, ≥ 1
  - `child_ages`: array integer 5-17, length = `child_first_names.length`
  - **Reject** nếu user form đăng ký là minor (heuristic: `name` match một trong `child_first_names`, hoặc phone trùng guardian phone with explicit "self_register": true → 400 error)

**Sample response (200 OK, paid tier):**
```json
{
  "ok": true,
  "registration_id": "reg_xxx",
  "event_id": "evt_xxx",
  "status": "pending_payment",
  "payment_required": true,
  "checkout_url": "https://pay.iai.one/checkout/abc123",
  "qr_code_url": null,
  "sla_minutes": 30,
  "next_step": {
    "label": "Hoàn tất thanh toán",
    "href": "https://pay.iai.one/checkout/abc123"
  }
}
```

**Sample response (200 OK, free tier):**
```json
{
  "ok": true,
  "registration_id": "reg_yyy",
  "event_id": "evt_xxx",
  "status": "confirmed",
  "payment_required": false,
  "checkout_url": null,
  "qr_code_url": "/api/movement/events/evt_xxx/registrations/reg_yyy/qr.png",
  "next_step": {
    "label": "Xem ticket",
    "href": "/movement/events/vietnam-hcmc-2026-09-15/ticket/reg_yyy"
  }
}
```

**Error cases:**
- `400 EVENT_NOT_OPEN`: status không phải `open`
- `400 EVENT_SOLD_OUT`: `capacity_remaining` = 0
- `400 INSUFFICIENT_CAPACITY`: `quantity` > `capacity_remaining`
- `400 INVALID_TICKET_TIER`
- `400 GUARDIAN_CONSENT_REQUIRED`: event có trẻ em nhưng form không có guardian fields
- `400 GUARDIAN_CONSENT_NOT_SIGNED`: `guardian_consent_signed != true`
- `400 SELF_REGISTER_AS_MINOR`: user dưới 18 tự đăng ký mà không có guardian (theo NDNUM Mục IV.3)
- `400 INVALID_CHILD_AGE`: age < 5 hoặc > 17
- `403 TURNSTILE_FAILED`
- `429 RATE_LIMITED`
- `502 PAYMENT_GATEWAY_ERROR`: pay.iai.one không response (registration vẫn tạo, status=`pending_payment`, sẽ retry)

### 3.4 GET `/api/movement/events/:slug/check-in/:registration_id` (staff JWT)

**Auth:** Cloudflare Access JWT, role `staff` or `founder`.

**Sample response (200 OK):**
```json
{
  "ok": true,
  "registration_id": "reg_xxx",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "ticket_tier": "Standard",
  "quantity": 2,
  "status": "confirmed",
  "checked_in": false,
  "children_participation": false,
  "guardian_required": false
}
```

**To check-in:** `POST /api/movement/events/:slug/check-in/:registration_id` với body `{ "checked_in_by": "staff@email" }` → returns `{ ok: true, checked_in_at: "..." }`.

### 3.5 GET `/api/movement/tour-stops`

List tour stop calendar.

**Query params:**
- `phase` (optional): `0A | 0B | 1 | 2 | 3 | 4 | 5`
- `region` (optional): `sea | east_asia | oceania | north_america | europe`
- `status` (optional): one of 7 level `L0-L7`
- `limit`, `cursor`

**Sample response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "tour_001",
      "phase": "1",
      "country": "VN",
      "country_name_vi": "Việt Nam",
      "city": "Ho Chi Minh City",
      "status_level": "L5",
      "status_label": "confirmed",
      "target_month": "2026-09",
      "confirmed_date": "2026-09-15",
      "event_id": "evt_xxx",
      "event_slug": "vietnam-hcmc-2026-09-15",
      "format": "Community Briefing + Story Showcase",
      "local_host_status": "confirmed",
      "venue_status": "confirmed",
      "readiness_score": 88,
      "public_page_url": "/movement/events/vietnam-hcmc-2026-09-15",
      "sponsor_target": "Star Champion, Star Pillar"
    }
  ],
  "meta": { "total": 33, "filtered": 6, "limit": 20 }
}
```

### 3.6 GET `/api/movement/tour-stops/:country`

Detail per country (multiple cities). Schema giống `/tour-stops` nhưng filter country + thêm `phase_context` + `country_readiness_aggregate`.

---

## 4. EVENT STATUS STATE MACHINE

8 status theo Event Runbook Mục 2.2:

```
draft ───→ planned ───→ open ────────→ closed ────→ completed
                          │   │                        │
                          │   └─→ sold_out ───→ closed │
                          │                            │
                          └─→ postponed ◄──────────────┘
                          └─→ cancelled
```

**Public access rules:**
- `draft`: KHÔNG public, chỉ admin
- `planned`: public, hiển thị "Đang lên kế hoạch", CTA "Theo dõi / nhận thông tin"
- `open`: public, mở registration
- `sold_out`: public, registration đóng, mở waitlist
- `closed`: public, registration đóng, không waitlist
- `completed`: public, hiển thị recap
- `postponed`: public, hiển thị "Đã dời lịch"
- `cancelled`: public, hiển thị refund policy

**Allowed transitions:**
- `draft → planned` (admin)
- `planned → open | postponed | cancelled` (admin)
- `open → sold_out | closed | postponed | cancelled` (admin or auto trigger)
- `sold_out → closed | postponed | cancelled` (admin)
- `closed → completed` (admin, sau event date)
- `postponed → planned | cancelled` (admin)

**Registration accepted only when:** `status = open` AND `capacity_remaining > 0`.

---

## 5. CHILD SAFETY RULE TRONG API (CRITICAL)

> **Source of truth:** `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục IV (Guardian-first) + Mục XIII (12 quy tắc) + `NDNUM_CHILD_SAFETY_POLICY.md` (Wave 3).

### 5.1 Field `children_participation` (event level)

Mọi event record có field `children_participation: boolean`. Set khi tạo event qua admin endpoint:

```http
POST /api/admin/events (Wave 3 sẽ build)
{
  "type": "young_star_showcase",
  "children_participation": true,
  "child_safety_officer_assigned": "cso@duongsaotoasang.com",
  ...
}
```

**Validation server-side:** Nếu `type = "young_star_showcase"` → `children_participation` MUST be `true`. Nếu `children_participation = true` → `child_safety_officer_assigned` MUST be set.

### 5.2 Field `guardian_*` (registration level)

Khi `event.children_participation = true`:
- Registration form bắt buộc fields: `guardian_name`, `guardian_relationship`, `guardian_phone`, `guardian_email`, `guardian_consent_signed`, `child_first_names`, `child_ages`
- Server validate `guardian_consent_signed === true`
- Server reject nếu phát hiện self-register-as-minor

### 5.3 Reject self-register as minor

Heuristic check trong server:
```javascript
// pseudo-code in functions/api/movement/events/[slug]/register.js
if (event.children_participation === true) {
  if (!body.guardian_name || !body.guardian_consent_signed) {
    return errorJson("GUARDIAN_CONSENT_REQUIRED", "Sự kiện này yêu cầu đăng ký qua phụ huynh/người giám hộ.", 400);
  }
  // Optional: nếu form có field "user_age" và < 18, reject
  if (body.user_age && body.user_age < 18) {
    return errorJson("SELF_REGISTER_AS_MINOR", "Người dưới 18 tuổi không được tự đăng ký. Vui lòng để phụ huynh đăng ký.", 400);
  }
}
```

### 5.4 Data retention

- `child_first_names` + `child_ages` lưu **encrypted-at-rest** trong D1 (sử dụng `event_child_registrations` table với column `child_data_encrypted` — Wave 3 NDNUM Consent Flow sẽ define encryption method).
- KHÔNG hiển thị child info trong admin endpoint trừ khi role = `cso` hoặc `founder`.
- KHÔNG export child info qua public API.
- Retention: 1 năm sau event, sau đó hash anonymize.

### 5.5 Phase 0B blocker

⚠️ Endpoint `POST /api/movement/events/:slug/register` cho event có `children_participation = true` **CHỈ ĐƯỢC ENABLE** sau khi:
1. Phase 0B legal lock done
2. CSO assigned
3. `NDNUM_CHILD_SAFETY_POLICY.md` LOCKED (Wave 3)
4. `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` LOCKED (Wave 3)
5. Migration `0008_ndnum_consent.sql` applied

Implementation: env var `NDNUM_CHILD_REGISTRATION_ENABLED=false` → reject mọi registration cho event children_participation=true với `503 NDNUM_PHASE_0B_NOT_READY`. Flip về `true` sau Wave 3.

---

## 6. DATA SHAPES (TypeScript-like)

```typescript
interface Event {
  id: string;
  slug: string;
  type: 'gala' | 'tour_stop' | 'online_showcase' | 'sponsor_dinner' | 'press_briefing' | 'young_star_showcase';
  status: 'draft' | 'planned' | 'open' | 'sold_out' | 'closed' | 'completed' | 'postponed' | 'cancelled';
  status_history: Array<{ status: string; at: string; by: string; notes?: string }>;
  title: { vi: string; en: string };
  description_long?: { vi: string; en: string };
  starts_at: string;
  ends_at: string;
  timezone: string;
  venue_name: string;
  venue_address?: string;
  venue_map_url?: string;
  city: string;
  country: string;
  cover_url?: string;
  gallery_urls?: string[];
  speakers?: Array<{ name: string; role: string; photo_url?: string; bio?: string }>;
  schedule?: Array<{ time: string; title_vi: string; title_en: string }>;
  ticket_tiers: Array<{ label: string; amount_usd: number; capacity: number; remaining: number }>;
  capacity_total: number;
  capacity_remaining: number;
  register_count: number;
  children_participation: boolean;
  child_safety_officer_assigned?: string;
  lane: 'A' | 'B';
  payment_lane: {
    lane: 'A' | 'B';
    currency: string;
    alt_currency?: string;
    exchange_rate_usd_vnd?: number;
    support_email?: string;
    refund_policy_url?: string;
  };
  sponsor_logos?: Array<{ name: string; logo_url: string; website_url?: string }>;
  press_kit_url?: string;
  iCalendar_url?: string;
  tour_stop_id?: string;
  created_at: string;
  updated_at: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  idempotency_key: string;
  name: string;
  email: string;
  phone?: string;
  ticket_tier: string;
  quantity: number;
  amount_total_usd: number;
  consent_media: boolean;
  consent_marketing: boolean;
  lang: 'vi' | 'en';
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'refunded';
  payment_required: boolean;
  payment_provider?: string;
  payment_provider_ref?: string;
  payment_completed_at?: string;
  checkout_url?: string;
  qr_code_url?: string;
  checked_in: boolean;
  checked_in_at?: string;
  checked_in_by?: string;
  guardian_required: boolean;
  guardian_data?: EventChildRegistration;
  ip_hash?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

interface EventChildRegistration {
  id: string;
  registration_id: string;
  guardian_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_email: string;
  guardian_consent_signed: boolean;
  guardian_consent_signed_at: string;
  child_data_encrypted: string;       // encrypted JSON of child_first_names + child_ages
  cso_review_status: 'pending' | 'approved' | 'flagged';
  cso_reviewed_by?: string;
  cso_reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

interface TourStop {
  id: string;
  phase: '0A' | '0B' | '1' | '2' | '3' | '4' | '5';
  country: string;
  country_name_vi: string;
  city: string;
  status_level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
  status_label: string;
  target_month?: string;
  confirmed_date?: string;
  event_id?: string;
  event_slug?: string;
  format: string;
  local_host_name?: string;
  local_host_status?: string;
  venue_name?: string;
  venue_status?: string;
  budget_status?: string;
  readiness_score?: number;
  public_page_url?: string;
  sponsor_target?: string;
  created_at: string;
  updated_at: string;
}
```

---

## 7. D1 SCHEMA + MIGRATION

File: `migrations/0007_events.sql`

```sql
-- 0007_events.sql
-- Event + Registration + Tour Stop schema for Layer 1 Movement Portal
-- Applied via: wrangler d1 migrations apply cf-d1-dsts-content-prod --remote

-- 7.1 events: master event table
CREATE TABLE IF NOT EXISTS events (
  id                  TEXT PRIMARY KEY,
  slug                TEXT UNIQUE NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('gala','tour_stop','online_showcase','sponsor_dinner','press_briefing','young_star_showcase')),
  status              TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','planned','open','sold_out','closed','completed','postponed','cancelled')),
  status_history_json TEXT NOT NULL DEFAULT '[]',
  title_vi            TEXT NOT NULL,
  title_en            TEXT,
  description_long_vi TEXT,
  description_long_en TEXT,
  starts_at           TEXT NOT NULL,
  ends_at             TEXT NOT NULL,
  timezone            TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  venue_name          TEXT,
  venue_address       TEXT,
  venue_map_url       TEXT,
  city                TEXT,
  country             TEXT,
  cover_url           TEXT,
  gallery_urls_json   TEXT,
  speakers_json       TEXT,
  schedule_json       TEXT,
  ticket_tiers_json   TEXT NOT NULL DEFAULT '[]',
  capacity_total      INTEGER NOT NULL DEFAULT 0,
  capacity_remaining  INTEGER NOT NULL DEFAULT 0,
  register_count      INTEGER NOT NULL DEFAULT 0,
  children_participation INTEGER NOT NULL DEFAULT 0,
  child_safety_officer_assigned TEXT,
  lane                TEXT NOT NULL DEFAULT 'A' CHECK (lane IN ('A','B')),
  payment_currency    TEXT NOT NULL DEFAULT 'USD',
  payment_alt_currency TEXT,
  exchange_rate_usd_vnd INTEGER,
  support_email       TEXT,
  refund_policy_url   TEXT,
  sponsor_logos_json  TEXT,
  press_kit_url       TEXT,
  tour_stop_id        TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_country ON events(country);
CREATE INDEX IF NOT EXISTS idx_events_starts ON events(starts_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_children ON events(children_participation) WHERE children_participation = 1;

-- 7.2 event_registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id                  TEXT PRIMARY KEY,
  event_id            TEXT NOT NULL REFERENCES events(id),
  idempotency_key     TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  ticket_tier         TEXT NOT NULL,
  quantity            INTEGER NOT NULL DEFAULT 1,
  amount_total_usd    INTEGER NOT NULL DEFAULT 0,
  consent_media       INTEGER NOT NULL DEFAULT 0,
  consent_marketing   INTEGER NOT NULL DEFAULT 0,
  lang                TEXT DEFAULT 'vi',
  status              TEXT NOT NULL DEFAULT 'pending_payment'
                      CHECK (status IN ('pending_payment','confirmed','cancelled','refunded')),
  payment_required    INTEGER NOT NULL DEFAULT 1,
  payment_provider    TEXT,
  payment_provider_ref TEXT,
  payment_completed_at TEXT,
  checkout_url        TEXT,
  qr_code_url         TEXT,
  checked_in          INTEGER NOT NULL DEFAULT 0,
  checked_in_at       TEXT,
  checked_in_by       TEXT,
  guardian_required   INTEGER NOT NULL DEFAULT 0,
  ip_hash             TEXT,
  user_agent          TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_reg_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_checked ON event_registrations(checked_in);

-- 7.3 event_child_registrations (encrypted)
CREATE TABLE IF NOT EXISTS event_child_registrations (
  id                  TEXT PRIMARY KEY,
  registration_id     TEXT NOT NULL UNIQUE REFERENCES event_registrations(id),
  guardian_name       TEXT NOT NULL,
  guardian_relationship TEXT NOT NULL,
  guardian_phone      TEXT NOT NULL,
  guardian_email      TEXT NOT NULL,
  guardian_consent_signed INTEGER NOT NULL DEFAULT 0,
  guardian_consent_signed_at TEXT NOT NULL,
  child_data_encrypted TEXT NOT NULL,        -- encrypted JSON
  cso_review_status   TEXT NOT NULL DEFAULT 'pending'
                      CHECK (cso_review_status IN ('pending','approved','flagged')),
  cso_reviewed_by     TEXT,
  cso_reviewed_at     TEXT,
  retention_until     TEXT,                  -- 1 year after event
  anonymized_at       TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_child_reg ON event_child_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_child_cso ON event_child_registrations(cso_review_status);
CREATE INDEX IF NOT EXISTS idx_child_retention ON event_child_registrations(retention_until);

-- 7.4 tour_stops
CREATE TABLE IF NOT EXISTS tour_stops (
  id                  TEXT PRIMARY KEY,
  phase               TEXT NOT NULL CHECK (phase IN ('0A','0B','1','2','3','4','5')),
  country             TEXT NOT NULL,
  country_name_vi     TEXT,
  city                TEXT NOT NULL,
  status_level        TEXT NOT NULL CHECK (status_level IN ('L0','L1','L2','L3','L4','L5','L6','L7')),
  status_label        TEXT NOT NULL,
  target_month        TEXT,
  confirmed_date      TEXT,
  event_id            TEXT REFERENCES events(id),
  event_slug          TEXT,
  format              TEXT,
  local_host_name     TEXT,
  local_host_status   TEXT,
  venue_name          TEXT,
  venue_status        TEXT,
  budget_status       TEXT,
  readiness_score     INTEGER,
  public_page_url     TEXT,
  sponsor_target      TEXT,
  notes               TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tour_phase ON tour_stops(phase);
CREATE INDEX IF NOT EXISTS idx_tour_country ON tour_stops(country);
CREATE INDEX IF NOT EXISTS idx_tour_status ON tour_stops(status_level);
CREATE INDEX IF NOT EXISTS idx_tour_readiness ON tour_stops(readiness_score);

-- 7.5 event_webhook_log (for pay.iai.one callback)
CREATE TABLE IF NOT EXISTS event_payment_webhook_log (
  id              TEXT PRIMARY KEY,
  event_id        TEXT NOT NULL,
  registration_id TEXT,
  event_type      TEXT NOT NULL,
  provider        TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  payload         TEXT NOT NULL,
  processed       INTEGER NOT NULL DEFAULT 0,
  received_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_epwl_event_id ON event_payment_webhook_log(provider_event_id);
```

Apply: `npx wrangler d1 migrations apply cf-d1-dsts-content-prod --remote`

---

## 8. PAYMENT INTEGRATION (pay.iai.one Lane A)

### 8.1 Reuse pattern từ `functions/api/donate/create.js`

Cho event ticket Lane A, copy pattern:

```javascript
// functions/api/movement/events/[slug]/register.js (pseudo)
const callPayload = {
  tenant_code: env.PAY_IAI_ONE_TENANT_CODE,
  site_code: env.PAY_IAI_ONE_SITE_CODE,
  provider: env.PAY_IAI_ONE_PROVIDER,
  amount: amountVnd,  // converted from USD using event.exchange_rate_usd_vnd
  currency: "VND",
  order_id: registrationId,  // prefix: 'evt_<id>'
  description: `Vé ${event.title_vi} - ${ticketTier} - ${quantity} người`,
  buyer_email: body.email,
  buyer_name: body.name,
  callback_url: `${callbackBase}/api/movement/events/webhook`,
  success_url: `${callbackBase}/movement/events/${slug}/ticket/${registrationId}?status=success`,
  cancel_url: `${callbackBase}/movement/events/${slug}?status=cancel`,
};
```

### 8.2 Webhook handler

File: `functions/api/movement/events/webhook.js` (mới Wave 2/Phase 1.3)

Copy pattern từ `functions/api/donate/webhook.js`:
- Verify HMAC signature
- Idempotent (event_id unique trong `event_payment_webhook_log`)
- Update `event_registrations.status = 'confirmed'` + `payment_completed_at = now()`
- Decrement `events.capacity_remaining`
- Trigger confirmation email với QR code

### 8.3 Refund

Manual via admin → `PATCH /api/admin/events/:slug/registrations/:id` body `{ "status": "refunded" }`. Trigger `pay.iai.one` refund API + increment capacity_remaining + email user.

---

## 9. EMAIL FLOW + LIFECYCLE REMINDER

### 9.1 On registration confirm (status → confirmed)

- **To attendee:** Confirmation + QR code + iCalendar invite
- **To Operations:** "🎟️ New registration: {name} - {tier} - {event}"

### 9.2 Reminder T-7 (7 ngày trước event)

Cron job (Cloudflare Workers Cron Triggers) chạy hàng ngày 09:00 GMT+7:
- Query events where `starts_at` is 7 days from now AND `status = open|sold_out|closed`
- For each registration with status=`confirmed`: send reminder email với event detail + map

### 9.3 Reminder T-1 (1 ngày trước event)

Same cron, gửi reminder kèm "Tomorrow's logistics".

### 9.4 Recap T+7 (7 ngày sau event)

Same cron, gửi:
- Thank-you email
- Photo gallery link (sau khi Content Lead upload)
- Donation/sponsor call-to-action cho event tiếp theo

### 9.5 CSO notification cho event có trẻ em

Khi `event_child_registrations` row được insert, gửi email:
- **To CSO:** "🚨 New child registration for {event} - {child_count} children. Review at /admin/cso/registrations/{id}"

CSO phải `cso_review_status = approved` trước event date, nếu không → block check-in.

---

## 10. ERROR CODE TABLE

| Code | HTTP | Mô tả |
|---|---|---|
| `INVALID_JSON` | 400 | Body không phải JSON valid |
| `INVALID_FILTER` | 400 | Query filter sai |
| `INVALID_TICKET_TIER` | 400 | Tier không tồn tại trong event |
| `INVALID_QUANTITY` | 400 | Quantity < 1 hoặc > 10 |
| `INVALID_CHILD_AGE` | 400 | Age < 5 hoặc > 17 |
| `EVENT_NOT_FOUND` | 404 | Slug không tồn tại |
| `EVENT_NOT_OPEN` | 400 | Status không phải open |
| `EVENT_SOLD_OUT` | 400 | Capacity_remaining = 0 |
| `INSUFFICIENT_CAPACITY` | 400 | Quantity > capacity_remaining |
| `GUARDIAN_CONSENT_REQUIRED` | 400 | Event có trẻ em, form thiếu guardian fields |
| `GUARDIAN_CONSENT_NOT_SIGNED` | 400 | guardian_consent_signed != true |
| `SELF_REGISTER_AS_MINOR` | 400 | Người < 18 tự đăng ký không guardian |
| `NDNUM_PHASE_0B_NOT_READY` | 503 | Event children=true nhưng Phase 0B chưa done (env var off) |
| `TURNSTILE_FAILED` | 403 | Turnstile verify fail |
| `RATE_LIMITED` | 429 | Vượt 3 req/5min/IP |
| `IDEMPOTENT_DUPLICATE` | 409 | Idempotency-key conflict |
| `PAYMENT_GATEWAY_ERROR` | 502 | pay.iai.one fail |
| `PAYMENT_GATEWAY_UNREACHABLE` | 502 | pay.iai.one timeout |
| `INTERNAL_ERROR` | 500 | D1 query fail |

---

## 11. IMPLEMENTATION CHECKLIST

### Phase 1.1 (Tháng 9/2026 — Setup)

- [ ] Apply migration `0007_events.sql` local + remote
- [ ] Seed tour_stops table với 33+ country (theo Tour Calendar Mục 4-9)
- [ ] Seed events với 6-10 placeholder (planned + open status)
- [ ] Set env var `NDNUM_CHILD_REGISTRATION_ENABLED=false` (default)

### Phase 1.2 (Tháng 10/2026 — Build read endpoints)

- [ ] Build `GET /api/movement/events` (`functions/api/movement/events/index.js`)
- [ ] Build `GET /api/movement/events/[slug].js`
- [ ] Build `GET /api/movement/tour-stops`
- [ ] Build `GET /api/movement/tour-stops/[country].js`
- [ ] iCalendar generation helper

### Phase 1.3 (Tháng 11/2026 — Build write endpoints)

- [ ] Build `POST /api/movement/events/[slug]/register.js`
- [ ] Build webhook handler `functions/api/movement/events/webhook.js`
- [ ] Build `POST /api/movement/events/[slug]/check-in/[id].js` (staff JWT)
- [ ] Build admin endpoints `/api/admin/events/*`
- [ ] Setup Cloudflare Workers Cron Triggers cho T-7/T-1/T+7 reminders
- [ ] Email templates (5+ template VI+EN)
- [ ] Integration test với pay.iai.one sandbox

### Phase 1.4 (Tháng 12/2026 — Polish)

- [ ] Wire admin dashboard CSO review screen
- [ ] Audit log cho child data access
- [ ] Anonymize cron job (1-year retention)

### Wave 3 / Phase 0B prerequisite cho `children_participation = true` events

- [ ] `NDNUM_CHILD_SAFETY_POLICY.md` LOCKED
- [ ] `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` LOCKED
- [ ] Migration `0008_ndnum_consent.sql` applied
- [ ] CSO assigned + email configured
- [ ] Flip env var `NDNUM_CHILD_REGISTRATION_ENABLED=true`

---

## 12. SMOKE TEST CASES

### Test 1: List events

```bash
curl -sS "https://duongsaotoasang.com/api/movement/events?status=open&country=VN" | jq '.data | length'
```

### Test 2: Register paid event happy path

```bash
curl -sS -X POST "https://duongsaotoasang.com/api/movement/events/vietnam-hcmc-2026-09-15/register" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "cf-turnstile-response: $TURNSTILE_TOKEN" \
  -d '{"name":"Test","email":"t@test.com","phone":"+84901234567","ticket_tier":"Standard","quantity":1,"consent_media":true,"consent_marketing":false}'
# Expected: { ok:true, status:"pending_payment", checkout_url:"https://pay.iai.one/..." }
```

### Test 3: Reject child registration without guardian

```bash
# Event Young Star Showcase, children_participation=true
curl -sS -X POST "https://duongsaotoasang.com/api/movement/events/young-star-2026-12-01/register" \
  -d '{"name":"Self","email":"self@test.com","ticket_tier":"Family","quantity":1}'
# Expected: 400 GUARDIAN_CONSENT_REQUIRED
```

### Test 4: Phase 0B gating

```bash
# Env var NDNUM_CHILD_REGISTRATION_ENABLED=false
# Register cho event children=true → 503 NDNUM_PHASE_0B_NOT_READY
```

### Test 5: Sold out

Register N+1 với N = capacity → 400 EVENT_SOLD_OUT.

### Test 6: Tour stops by phase

```bash
curl -sS "https://duongsaotoasang.com/api/movement/tour-stops?phase=1" | jq '.data | length'
```

### Test 7: Webhook idempotent

POST webhook 2 lần cùng `provider_event_id` → registration chỉ confirmed 1 lần.

### Test 8: Check-in by staff

```bash
curl -sS -X POST "..." -H "CF-Access-Jwt-Assertion: $JWT" -d '{"checked_in_by":"staff@email"}'
# Expected: { ok:true, checked_in_at:"..." }
```

### Test 9: iCalendar export

```bash
curl -sS "https://duongsaotoasang.com/api/movement/events/vietnam-hcmc-2026-09-15.ics"
# Expected: text/calendar with VEVENT
```

---

## 13. CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0-DEV-READY | 2026-05-13 | Claude + Founder | Wave 2 W2.T3: tạo lần đầu — 6 endpoint + 5 D1 table + migration 0007 + 19 error code + child safety rule + Phase 0B gating + smoke test 9 case. Dev-ready cho Tech Lead build Layer 1.3 (Tháng 11/2026) |

---

## APPROVAL

- [ ] Founder review tổng
- [ ] Tech Lead review endpoint + payment integration
- [ ] CSO review child registration flow
- [ ] Legal Counsel review data retention + guardian consent
- [ ] Operations Lead review event lifecycle + reminders
- [ ] DPO review encryption + anonymize policy

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là API contract dev-ready cho Layer 1 Events + Tour. Child participation events bị Phase 0B blocker — chỉ enable sau khi 2 NDNUM spec con (Child Safety Policy + Guardian Consent Flow) LOCKED + CSO assigned. UI consumer tham chiếu `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` Mục 4.4-4.7. Payment pattern reuse `functions/api/donate/create.js`.*
