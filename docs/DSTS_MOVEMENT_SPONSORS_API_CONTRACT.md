# DSTS_MOVEMENT_SPONSORS_API_CONTRACT — v1.0-DEV-READY

> **Mã tài liệu:** `DSTS_MOVEMENT_SPONSORS_API_CONTRACT_2026-05-13`
> **Trạng thái:** 🟡 DRAFT v1.0-DEV-READY (Wave 2)
> **Owner R:** Tech Lead + Founder · **Approver A:** Founder + Legal · **Timeline:** Build trong Layer 1 Phase 1.2 (Tháng 10/2026)
> **Tham chiếu:**
> - `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` (data source — 13 tier, 8 stage, schema)
> - `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` Mục 8 + 11 (sponsor flow + KYC)
> - `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` Mục 4.2 + 4.3 (consumer UI)
> - `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md` (legal contract)
> - Existing code pattern: `functions/api/donate/create.js`, `functions/api/donate/webhook.js`
> - Existing migration: `migrations/0005_donations.sql`

---

## 0. MỤC LỤC

1. Design principles
2. Authentication + authorization
3. Endpoints (6 endpoint)
4. Data shapes (TypeScript-like interface)
5. D1 schema final + migration
6. Error code table
7. Rate limiting
8. Email notification flow
9. Integration với pattern existing
10. Implementation checklist
11. Smoke test cases
12. Changelog

---

## 1. DESIGN PRINCIPLES

Theo convention đã thiết lập với `functions/api/donate/*`:

- **REST + JSON** (no GraphQL, no gRPC)
- **Idempotency-key header** cho mọi POST mutation (cùng key → cùng response)
- **Error code convention:** `{ ok: false, error: "ERROR_CODE", message: "Human-readable" }` + HTTP status code
- **Success convention:** `{ ok: true, ...data }`
- **Pagination:** cursor-based với `limit` (default 20, max 100) + `cursor` (opaque base64 string)
- **Filter:** query string `?status=open&country=vn`
- **Sort:** `?sort=created_at_desc|amount_asc|...` (whitelist trên server)
- **Versioning:** URL không version (`/api/movement/...`), thay đổi breaking → tạo `/api/v2/movement/...`
- **Content-Type:** `application/json; charset=utf-8` mọi response
- **CORS:** same-origin (Cloudflare Pages serve cả frontend + Functions); nếu cần external → whitelist domain qua `_headers`
- **Locale:** mặc định `vi`, support `en` qua `Accept-Language` header (tier name, error message dịch theo locale)

---

## 2. AUTHENTICATION + AUTHORIZATION

### 2.1 Public read endpoints (no auth)

- `GET /api/movement/sponsors/tiers`
- `GET /api/movement/sponsors/tiers/:slug`
- `GET /api/movement/sponsors/donor-wall`

Lý do: hỗ trợ public browsing + SEO indexing.

### 2.2 Public write endpoint (no auth, rate-limited)

- `POST /api/movement/sponsors/inquiry`

Rate limit (Mục 7): 5 req/15min per IP + Cloudflare Turnstile token verify.

### 2.3 Admin endpoints (auth required)

- `GET /api/admin/sponsors`
- `PATCH /api/admin/sponsors/:id`

Auth: **Cloudflare Access JWT** (Zero Trust). Setup:
1. Cloudflare Access policy: protect `/api/admin/*` route, allow Founder + Sponsor Manager email
2. JWT validated qua `CF-Access-Jwt-Assertion` header
3. Server decode JWT → đọc `email` claim → match với whitelist `env.ADMIN_EMAILS` (comma-separated)
4. Nếu không match → `401 UNAUTHORIZED`

Implementation: helper `validateAdminRequest(request, env)` trong `functions/_lib/auth.js` (mới tạo Wave 2).

---

## 3. ENDPOINTS

### 3.1 GET `/api/movement/sponsors/tiers`

List 13 sponsor tier (toàn bộ public, không cần pagination — chỉ 13 row).

**Query params:**
- `lane` (optional): `A` | `B` — filter theo lane
- `min_amount_usd` (optional): integer
- `max_amount_usd` (optional): integer

**Sample request:**
```http
GET /api/movement/sponsors/tiers?lane=B&min_amount_usd=10000 HTTP/1.1
Host: duongsaotoasang.com
Accept: application/json
Accept-Language: vi
```

**Sample response (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "tier_001",
      "slug": "community-friend",
      "tier_index": 1,
      "tier_name": { "vi": "Người bạn đồng hành", "en": "Community Friend" },
      "amount_usd": 1000,
      "amount_vnd_estimate": 24500000,
      "lane": "B",
      "benefits": [
        "Logo trên website transparency page",
        "Annual impact report (PDF)",
        "Recognition in sponsor wall"
      ],
      "deliverables_summary": "Logo + báo cáo hàng năm",
      "manual_hours": 4,
      "is_active": true,
      "addendum_required": false
    },
    {
      "id": "tier_011",
      "slug": "cohort-sponsor-50k",
      "tier_index": 11,
      "tier_name": { "vi": "Tài trợ Cohort", "en": "Cohort Sponsor" },
      "amount_usd": 50000,
      "amount_vnd_estimate": 1225000000,
      "lane": "B",
      "benefits": [
        "Bảo trợ 1 cohort 10 trẻ Mầm Sáng × 1 năm",
        "2 báo cáo/năm qua Coordinator",
        "Virtual visit 1 lần/năm (group, no individual)",
        "Annual Impact Report"
      ],
      "deliverables_summary": "Bảo trợ cohort NDNUM + báo cáo qua Coordinator",
      "manual_hours": 40,
      "is_active": true,
      "addendum_required": true,
      "addendum_note": "NDNUM Cohort #11 clause: No direct child contact (NDNUM Mục XIII)"
    }
  ],
  "meta": {
    "total": 13,
    "filtered": 7,
    "as_of": "2026-05-13T09:00:00Z"
  }
}
```

**Error case:**
- `400 INVALID_FILTER`: `lane` không phải `A` hoặc `B`
- `500 INTERNAL_ERROR`: D1 query fail

**Sample curl:**
```bash
curl -sS "https://duongsaotoasang.com/api/movement/sponsors/tiers?lane=B" | jq .
```

### 3.2 GET `/api/movement/sponsors/tiers/:slug`

Detail 1 tier.

**Sample request:**
```http
GET /api/movement/sponsors/tiers/cohort-sponsor-50k HTTP/1.1
```

**Sample response (200 OK):**
```json
{
  "ok": true,
  "data": {
    "id": "tier_011",
    "slug": "cohort-sponsor-50k",
    "tier_index": 11,
    "tier_name": { "vi": "Tài trợ Cohort", "en": "Cohort Sponsor" },
    "amount_usd": 50000,
    "amount_vnd_estimate": 1225000000,
    "lane": "B",
    "description_long": { "vi": "Bảo trợ 1 cohort gồm 10 trẻ em...", "en": "..." },
    "benefits": [...],
    "deliverables": [
      { "month": 1, "description": "Kickoff + Coordinator assignment" },
      { "month": 3, "description": "Mid-year letter from Coordinator" },
      { "month": 6, "description": "Virtual cohort showcase (group)" },
      { "month": 9, "description": "Quarter 3 update" },
      { "month": 12, "description": "Annual Impact Report + renewal proposal" }
    ],
    "manual_hours": 40,
    "is_active": true,
    "addendum_required": true,
    "addendum_clauses": [
      "NDNUM Mục XIII Rule 3: No 1:1 adult-child contact",
      "NDNUM Mục XIII Rule 12: Sponsor báo cáo qua Coordinator, không gặp trẻ trực tiếp"
    ],
    "kyc_required_amount_usd": 50000,
    "agreement_template_url": "/legal/sponsor-agreement-template-v1.pdf"
  }
}
```

**Error case:**
- `404 TIER_NOT_FOUND`

### 3.3 POST `/api/movement/sponsors/inquiry`

Public form submit — chuyển lead về Sponsor Manager.

**Headers required:**
- `Content-Type: application/json`
- `Idempotency-Key: <opaque uuid>` (client-generated)
- `cf-turnstile-response: <token>` (Cloudflare Turnstile widget token)

**Request body:**
```json
{
  "company": "Acme Corp Ltd.",
  "contact_name": "Nguyen Van A",
  "contact_email": "contact@acme.vn",
  "contact_phone": "+84 90 1234 5678",
  "tier_slug": "cohort-sponsor-50k",
  "intended_amount_usd": 50000,
  "budget_range": "30k-100k",
  "intent_notes": "Quan tâm tài trợ NDNUM cohort cho năm 2027.",
  "preferred_contact_method": "email",
  "source_referrer": "movement-sponsors-page",
  "lang": "vi"
}
```

**Field validation:**
- `company`: string, 2-200 chars, required nếu `tier_slug` = top 7 tier ($25K+)
- `contact_name`: string, 2-100 chars, required
- `contact_email`: RFC 5322 valid email, required
- `contact_phone`: E.164 format optional, max 20 chars
- `tier_slug`: string, optional, phải tồn tại trong `sponsor_tiers`
- `intended_amount_usd`: integer, optional, ≥ 1000
- `budget_range`: enum `< 5k | 5k-30k | 30k-100k | 100k-500k | 500k+ | tbd`
- `intent_notes`: string, max 2000 chars
- `preferred_contact_method`: enum `email | phone | both`, default `email`
- `lang`: `vi | en`, default `vi`

**Sample response (200 OK):**
```json
{
  "ok": true,
  "inquiry_id": "inq_a3f2b1c4d5e6f7g8",
  "status": "received",
  "sla_hours": 72,
  "message": "Đã nhận inquiry. Sponsor Manager sẽ liên hệ trong 72h.",
  "next_step": {
    "label": "Xem các tier khác",
    "href": "/movement/sponsors"
  }
}
```

**Error cases:**
- `400 INVALID_TIER`: `tier_slug` không tồn tại
- `400 INVALID_AMOUNT`: `intended_amount_usd` < 1000 hoặc > 10,000,000
- `400 INVALID_EMAIL`: email không valid
- `400 KYC_REQUIRED_FOR_TIER`: tier yêu cầu KYC nhưng form không có `company` (tier $25K+)
- `403 TURNSTILE_FAILED`: token Turnstile không hợp lệ
- `409 IDEMPOTENT_DUPLICATE`: idempotency-key đã được dùng với body khác (theo HTTP idempotency standard)
- `429 RATE_LIMITED`: vượt 5 req/15min/IP
- `502 EMAIL_GATEWAY_ERROR`: email notification fail (vẫn ghi DB, retry sau)

### 3.4 GET `/api/movement/sponsors/donor-wall`

Public donor wall — sponsor đã opt-in để hiển thị tên/logo.

**Query params:**
- `tier` (optional): filter theo tier_slug
- `year` (optional): filter theo year
- `limit` (default 20, max 100)
- `cursor` (optional)

**Sample response (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "display_name": "Acme Corp",
      "logo_url": "/assets/sponsors/acme-corp.svg",
      "tier_name": { "vi": "Tài trợ Cohort", "en": "Cohort Sponsor" },
      "tier_lane": "B",
      "year": 2026,
      "website_url": "https://acme.vn"
    },
    {
      "display_name": "Anonymous",
      "logo_url": null,
      "tier_name": { "vi": "Người bạn đồng hành", "en": "Community Friend" },
      "tier_lane": "B",
      "year": 2026,
      "website_url": null
    }
  ],
  "meta": {
    "total": 47,
    "filtered": 47,
    "limit": 20,
    "next_cursor": "eyJpZCI6...="
  }
}
```

Rule: chỉ trả sponsor có `display_consent = 1` (opt-in). Anonymous sponsor hiển thị `display_name: "Anonymous"`.

### 3.5 GET `/api/admin/sponsors` (auth required)

Admin list với kanban-style filter.

**Query params:**
- `stage` (optional): one of 8 stage (`prospect | inquiry | qualified | proposal | agreement | active | fulfilled | renewed`)
- `tier` (optional)
- `country` (optional): ISO 3166-1 alpha-2
- `assigned_to` (optional): admin email
- `sort`: `created_at_desc | amount_desc | stage_progress`
- `limit`, `cursor`

**Sample response (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "spn_xyz123",
      "company": "Acme Corp Ltd.",
      "contact_name": "Nguyen Van A",
      "contact_email": "contact@acme.vn",
      "tier_slug": "cohort-sponsor-50k",
      "amount_usd": 50000,
      "stage": "proposal",
      "stage_history": [
        { "stage": "inquiry", "at": "2026-05-10T10:00:00Z", "by": "system" },
        { "stage": "qualified", "at": "2026-05-11T14:30:00Z", "by": "sponsor.manager@dsts.vn" },
        { "stage": "proposal", "at": "2026-05-13T09:00:00Z", "by": "sponsor.manager@dsts.vn" }
      ],
      "kyc_status": "pending",
      "agreement_signed_at": null,
      "assigned_to": "sponsor.manager@dsts.vn",
      "country": "VN",
      "created_at": "2026-05-10T10:00:00Z",
      "updated_at": "2026-05-13T09:00:00Z"
    }
  ],
  "meta": { "total": 24, "filtered": 8, "limit": 20 }
}
```

### 3.6 PATCH `/api/admin/sponsors/:id` (auth required)

Advance stage, update KYC, assign owner.

**Request body:**
```json
{
  "stage": "agreement",
  "kyc_status": "approved",
  "kyc_notes": "OFAC + sanctions check passed. Documents uploaded to Drive folder XYZ.",
  "assigned_to": "founder@dsts.vn",
  "agreement_signed_at": "2026-05-15T14:00:00Z"
}
```

**Allowed transitions:**
- `prospect → inquiry → qualified → proposal → agreement → active → fulfilled → renewed`
- Skip stage: KHÔNG cho phép (force linear progression)
- Backward: chỉ admin với role `Founder` (validate JWT claim)

**Sample response (200 OK):**
```json
{
  "ok": true,
  "id": "spn_xyz123",
  "stage": "agreement",
  "stage_history": [..., { "stage": "agreement", "at": "2026-05-13T15:00:00Z", "by": "sponsor.manager@dsts.vn" }]
}
```

**Error cases:**
- `400 INVALID_STAGE`
- `400 INVALID_TRANSITION`: skip stage hoặc backward without Founder role
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`: email không trong `ADMIN_EMAILS`
- `404 SPONSOR_NOT_FOUND`
- `409 STALE_UPDATE`: `updated_at` đã thay đổi giữa GET và PATCH (optimistic locking)

---

## 4. DATA SHAPES (TypeScript-like)

```typescript
interface SponsorTier {
  id: string;                // 'tier_001' to 'tier_013'
  slug: string;
  tier_index: 1 | 2 | ... | 13;
  tier_name: { vi: string; en: string };
  amount_usd: number;
  amount_vnd_estimate: number;
  lane: 'A' | 'B';
  description_long?: { vi: string; en: string };
  benefits: string[];
  deliverables: Array<{ month: number; description: string }>;
  deliverables_summary: string;
  manual_hours: number;
  is_active: boolean;
  addendum_required: boolean;
  addendum_note?: string;
  addendum_clauses?: string[];
  kyc_required_amount_usd?: number;
  agreement_template_url?: string;
  created_at: string;
  updated_at: string;
}

interface SponsorInquiry {
  id: string;                // 'inq_xxx'
  company?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  tier_slug?: string;
  intended_amount_usd?: number;
  budget_range?: string;
  intent_notes?: string;
  preferred_contact_method: 'email' | 'phone' | 'both';
  source_referrer?: string;
  lang: 'vi' | 'en';
  status: 'received' | 'processing' | 'converted' | 'closed';
  converted_sponsor_id?: string;
  ip_hash?: string;          // SHA-256 cho rate limiting + audit
  user_agent?: string;
  turnstile_action?: string;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
}

interface Sponsor {
  id: string;                // 'spn_xxx'
  company: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  country?: string;          // ISO 3166-1 alpha-2
  tier_slug: string;
  amount_usd: number;
  amount_actual_usd?: number;  // sau khi confirmed
  amount_currency_paid?: string; // 'USD' | 'VND'
  stage: 'prospect' | 'inquiry' | 'qualified' | 'proposal' | 'agreement' | 'active' | 'fulfilled' | 'renewed';
  stage_history: Array<{ stage: string; at: string; by: string; notes?: string }>;
  kyc_status: 'pending' | 'in_review' | 'approved' | 'rejected';
  kyc_notes?: string;
  agreement_template_version?: string;
  agreement_signed_at?: string;
  agreement_pdf_url?: string;
  display_consent: 0 | 1;   // opt-in for donor wall
  display_name?: string;    // override company nếu cần
  logo_url?: string;
  website_url?: string;
  assigned_to: string;      // admin email
  inquiry_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SponsorCommunication {
  id: string;
  sponsor_id: string;
  type: 'email' | 'call' | 'meeting' | 'document' | 'reminder';
  direction: 'inbound' | 'outbound';
  subject?: string;
  body_excerpt?: string;
  attachment_urls?: string[];
  occurred_at: string;
  logged_by: string;        // admin email
  created_at: string;
}

interface SponsorDeliverable {
  id: string;
  sponsor_id: string;
  month_offset: number;      // 1-12 từ agreement_signed_at
  description: string;
  due_at: string;
  status: 'planned' | 'in_progress' | 'completed' | 'overdue';
  completed_at?: string;
  evidence_url?: string;
  notes?: string;
}
```

---

## 5. D1 SCHEMA FINAL + MIGRATION

File: `migrations/0006_sponsors.sql`

```sql
-- 0006_sponsors.sql
-- Sponsor management for Layer 1 Movement Portal
-- Applied via: wrangler d1 migrations apply cf-d1-dsts-content-prod --remote

-- 5.1 sponsor_tiers: 13 tier master data
CREATE TABLE IF NOT EXISTS sponsor_tiers (
  id                  TEXT PRIMARY KEY,           -- 'tier_001' to 'tier_013'
  slug                TEXT UNIQUE NOT NULL,
  tier_index          INTEGER NOT NULL UNIQUE,
  tier_name_vi        TEXT NOT NULL,
  tier_name_en        TEXT NOT NULL,
  amount_usd          INTEGER NOT NULL,
  amount_vnd_estimate INTEGER,
  lane                TEXT NOT NULL CHECK (lane IN ('A','B')),
  description_long_vi TEXT,
  description_long_en TEXT,
  benefits_json       TEXT NOT NULL,              -- JSON array
  deliverables_json   TEXT,                       -- JSON array of {month, description}
  deliverables_summary TEXT NOT NULL,
  manual_hours        INTEGER NOT NULL DEFAULT 0,
  is_active           INTEGER NOT NULL DEFAULT 1,
  addendum_required   INTEGER NOT NULL DEFAULT 0,
  addendum_note       TEXT,
  addendum_clauses_json TEXT,                     -- JSON array
  kyc_required_amount_usd INTEGER,
  agreement_template_url TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tier_lane ON sponsor_tiers(lane);
CREATE INDEX IF NOT EXISTS idx_tier_active ON sponsor_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_tier_amount ON sponsor_tiers(amount_usd);

-- 5.2 sponsor_inquiries: public form submissions
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id                  TEXT PRIMARY KEY,           -- 'inq_xxx'
  idempotency_key     TEXT NOT NULL UNIQUE,
  company             TEXT,
  contact_name        TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_phone       TEXT,
  tier_slug           TEXT REFERENCES sponsor_tiers(slug),
  intended_amount_usd INTEGER,
  budget_range        TEXT,
  intent_notes        TEXT,
  preferred_contact_method TEXT DEFAULT 'email',
  source_referrer     TEXT,
  lang                TEXT DEFAULT 'vi',
  status              TEXT NOT NULL DEFAULT 'received'
                      CHECK (status IN ('received','processing','converted','closed')),
  converted_sponsor_id TEXT,
  ip_hash             TEXT,
  user_agent          TEXT,
  turnstile_action    TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inq_status ON sponsor_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inq_email ON sponsor_inquiries(contact_email);
CREATE INDEX IF NOT EXISTS idx_inq_tier ON sponsor_inquiries(tier_slug);
CREATE INDEX IF NOT EXISTS idx_inq_created ON sponsor_inquiries(created_at);

-- 5.3 sponsors: confirmed sponsor relationship
CREATE TABLE IF NOT EXISTS sponsors (
  id                  TEXT PRIMARY KEY,           -- 'spn_xxx'
  company             TEXT NOT NULL,
  contact_name        TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_phone       TEXT,
  country             TEXT,
  tier_slug           TEXT NOT NULL REFERENCES sponsor_tiers(slug),
  amount_usd          INTEGER NOT NULL,
  amount_actual_usd   INTEGER,
  amount_currency_paid TEXT,
  stage               TEXT NOT NULL DEFAULT 'prospect'
                      CHECK (stage IN ('prospect','inquiry','qualified','proposal','agreement','active','fulfilled','renewed')),
  stage_history_json  TEXT NOT NULL DEFAULT '[]',
  kyc_status          TEXT NOT NULL DEFAULT 'pending'
                      CHECK (kyc_status IN ('pending','in_review','approved','rejected')),
  kyc_notes           TEXT,
  agreement_template_version TEXT,
  agreement_signed_at TEXT,
  agreement_pdf_url   TEXT,
  display_consent     INTEGER NOT NULL DEFAULT 0,
  display_name        TEXT,
  logo_url            TEXT,
  website_url         TEXT,
  assigned_to         TEXT NOT NULL,
  inquiry_id          TEXT REFERENCES sponsor_inquiries(id),
  notes               TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_spn_stage ON sponsors(stage);
CREATE INDEX IF NOT EXISTS idx_spn_tier ON sponsors(tier_slug);
CREATE INDEX IF NOT EXISTS idx_spn_country ON sponsors(country);
CREATE INDEX IF NOT EXISTS idx_spn_assigned ON sponsors(assigned_to);
CREATE INDEX IF NOT EXISTS idx_spn_display ON sponsors(display_consent) WHERE display_consent = 1;

-- 5.4 sponsor_communications: log mọi interaction
CREATE TABLE IF NOT EXISTS sponsor_communications (
  id                  TEXT PRIMARY KEY,
  sponsor_id          TEXT NOT NULL REFERENCES sponsors(id),
  type                TEXT NOT NULL CHECK (type IN ('email','call','meeting','document','reminder')),
  direction           TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  subject             TEXT,
  body_excerpt        TEXT,
  attachment_urls_json TEXT,
  occurred_at         TEXT NOT NULL,
  logged_by           TEXT NOT NULL,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comm_sponsor ON sponsor_communications(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_comm_occurred ON sponsor_communications(occurred_at);

-- 5.5 sponsor_deliverables: fulfillment tracking
CREATE TABLE IF NOT EXISTS sponsor_deliverables (
  id                  TEXT PRIMARY KEY,
  sponsor_id          TEXT NOT NULL REFERENCES sponsors(id),
  month_offset        INTEGER NOT NULL,
  description         TEXT NOT NULL,
  due_at              TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'planned'
                      CHECK (status IN ('planned','in_progress','completed','overdue')),
  completed_at        TEXT,
  evidence_url        TEXT,
  notes               TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deliv_sponsor ON sponsor_deliverables(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_deliv_status ON sponsor_deliverables(status);
CREATE INDEX IF NOT EXISTS idx_deliv_due ON sponsor_deliverables(due_at);

-- 5.6 Seed 13 tier (placeholder — Founder lock pricing trong Sponsorship Tracker Mục 1)
-- INSERT INTO sponsor_tiers VALUES (...) — separate seed script
```

Apply: `npx wrangler d1 migrations apply cf-d1-dsts-content-prod --remote`

Test apply local: `npx wrangler d1 migrations apply cf-d1-dsts-content-prod --local`

---

## 6. ERROR CODE TABLE

| Code | HTTP | Mô tả |
|---|---|---|
| `INVALID_JSON` | 400 | Request body không phải JSON valid |
| `INVALID_FILTER` | 400 | Query string filter sai (e.g. lane không phải A/B) |
| `INVALID_TIER` | 400 | `tier_slug` không tồn tại trong `sponsor_tiers` |
| `INVALID_AMOUNT` | 400 | `intended_amount_usd` < 1000 hoặc > 10M |
| `INVALID_EMAIL` | 400 | Email không pass RFC 5322 validation |
| `INVALID_STAGE` | 400 | Stage value không trong whitelist |
| `INVALID_TRANSITION` | 400 | Skip stage hoặc backward không phép |
| `KYC_REQUIRED_FOR_TIER` | 400 | Tier $25K+ yêu cầu `company` field |
| `MISSING_REQUIRED_FIELD` | 400 | Field bắt buộc bị thiếu |
| `UNAUTHORIZED` | 401 | JWT missing hoặc invalid |
| `FORBIDDEN` | 403 | Email không trong `ADMIN_EMAILS` |
| `TURNSTILE_FAILED` | 403 | Cloudflare Turnstile verify fail |
| `TIER_NOT_FOUND` | 404 | Slug không tồn tại |
| `SPONSOR_NOT_FOUND` | 404 | `sponsor_id` không tồn tại |
| `IDEMPOTENT_DUPLICATE` | 409 | Idempotency-key đã dùng với body khác |
| `STALE_UPDATE` | 409 | `updated_at` đã thay đổi (optimistic lock) |
| `RATE_LIMITED` | 429 | Vượt rate limit |
| `INTERNAL_ERROR` | 500 | D1 query fail hoặc lỗi không xác định |
| `EMAIL_GATEWAY_ERROR` | 502 | Resend/Mailgun không gửi được |
| `GATEWAY_UNREACHABLE` | 502 | External API timeout |

---

## 7. RATE LIMITING

### 7.1 Inquiry endpoint

5 req/15min per IP. Implement:

1. **Cloudflare Turnstile widget** (front-end) — block bot tự động
2. **KV-based rate limiter** (server) — fallback nếu Turnstile pass:
   - Key: `rl:inquiry:{ip_hash}`
   - Value: count
   - TTL: 900s (15 min)
   - Pseudo-code:
     ```javascript
     const key = `rl:inquiry:${await sha256(ip)}`;
     const count = parseInt(await env.RATE_LIMIT_KV.get(key)) || 0;
     if (count >= 5) return errorJson("RATE_LIMITED", "Too many requests.", 429);
     await env.RATE_LIMIT_KV.put(key, String(count + 1), { expirationTtl: 900 });
     ```
3. **Cloudflare WAF rule** (optional, additional layer): block IP có > 50 req/hour cho `/api/movement/sponsors/inquiry`

### 7.2 Public read endpoints

Caching strategy thay vì rate limit:
- `Cache-Control: public, max-age=300, s-maxage=900` cho `/tiers` (5 min browser, 15 min CF cache)
- `Cache-Control: public, max-age=60, s-maxage=300` cho `/donor-wall`
- Invalidate qua `PURGE` API khi admin update sponsor

---

## 8. EMAIL NOTIFICATION FLOW

### 8.1 On inquiry submit (POST `/inquiry`)

3 email gửi đồng thời:

1. **Auto-reply to inquirer:**
   - From: `noreply@duongsaotoasang.com`
   - To: `contact_email`
   - Template: `inquiry-autoreply-{lang}.html`
   - Subject: "Đã nhận inquiry tài trợ — Đường Sao Tỏa Sáng"
   - Body: cảm ơn + SLA 72h + link `/movement/sponsors` + Founder boilerplate

2. **Notify Founder:**
   - From: `inquiry-bot@duongsaotoasang.com`
   - To: `env.FOUNDER_EMAIL` (default `founder@duongsaotoasang.com`)
   - Subject: "🔔 Sponsor Inquiry: {company} — {tier_slug} — ${intended_amount_usd}"
   - Body: full form fields + link `/api/admin/sponsors?inquiry_id=...`

3. **Notify Sponsor Manager:**
   - From: `inquiry-bot@duongsaotoasang.com`
   - To: `env.SPONSOR_MANAGER_EMAIL`
   - Same content as Founder

Provider: **Resend** (recommend, simple API) hoặc **Mailgun**.

Implementation: `functions/api/_lib/email.js` với helper `sendEmail(to, template, vars)`.

### 8.2 On stage transition (PATCH `/admin/sponsors/:id`)

Trigger email cho stage milestones:

- `qualified`: notify Founder
- `proposal`: notify Sponsor Manager + send proposal PDF
- `agreement`: notify Legal Counsel + Founder
- `active`: notify Operations (assign Coordinator nếu là NDNUM tier)
- `fulfilled`: notify Sponsor + Founder (annual report ready)

---

## 9. INTEGRATION VỚI PATTERN EXISTING

### 9.1 Reuse từ `functions/api/donate/create.js`

Helper sẽ extract vào `functions/_lib/api-helpers.js`:

```javascript
// functions/_lib/api-helpers.js (mới tạo Wave 2)
export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

export function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

export async function sha256Hex(str) {
  const bytes = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function checkIdempotency(env, table, key) {
  if (!env.DB) return null;
  const row = await env.DB.prepare(
    `SELECT * FROM ${table} WHERE idempotency_key = ?`
  ).bind(key).first();
  return row;
}
```

Refactor `functions/api/donate/create.js` sang use helper này (no-functional-change). Sau đó áp cho sponsor inquiry.

### 9.2 Reuse HMAC verify từ `webhook.js`

Khi cần webhook callback (nếu Phase 2 tích hợp Stripe/PayPal trực tiếp), reuse `verifySignature(secret, payload, signature)` pattern từ `functions/api/donate/webhook.js`.

### 9.3 Reuse env binding pattern

`wrangler.toml` đã có `[[d1_databases]]` binding cho `DB`. Thêm KV binding cho rate limit:

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "..."           # Cloudflare tạo qua: wrangler kv namespace create "RATE_LIMIT"
preview_id = "..."
```

---

## 10. IMPLEMENTATION CHECKLIST

### Phase 1.1 (Tháng 9/2026 — Setup)

- [ ] Extract helpers vào `functions/_lib/api-helpers.js`
- [ ] Refactor `functions/api/donate/create.js` sang dùng helper (no-functional-change)
- [ ] Setup Cloudflare KV namespace `RATE_LIMIT_KV`
- [ ] Setup Cloudflare Access policy cho `/api/admin/*`
- [ ] Setup Cloudflare Turnstile site key + secret (env vars)
- [ ] Setup Resend account + API key (env var `RESEND_API_KEY`)
- [ ] Add migration `0006_sponsors.sql` + apply local + remote
- [ ] Seed 13 tier (sau khi Founder lock pricing trong Sponsorship Tracker Mục 1)

### Phase 1.2 (Tháng 10/2026 — Build endpoints)

- [ ] Build `GET /api/movement/sponsors/tiers` (`functions/api/movement/sponsors/tiers/index.js`)
- [ ] Build `GET /api/movement/sponsors/tiers/[slug].js`
- [ ] Build `POST /api/movement/sponsors/inquiry` (`functions/api/movement/sponsors/inquiry.js`)
- [ ] Build `GET /api/movement/sponsors/donor-wall`
- [ ] Build `GET /api/admin/sponsors`
- [ ] Build `PATCH /api/admin/sponsors/[id].js`
- [ ] Email templates: inquiry-autoreply (vi+en), inquiry-notify-admin, stage-transition-* (5 file)

### Phase 1.3 (Tháng 11/2026 — Integration test)

- [ ] Wire UI `/movement/sponsors` page consume `GET .../tiers`
- [ ] Wire UI inquiry form submit `POST .../inquiry` + Turnstile widget
- [ ] Wire admin dashboard `/admin/sponsors` consume `GET /api/admin/sponsors`
- [ ] Verify rate limit + idempotency
- [ ] Verify email flow end-to-end (use Resend sandbox)
- [ ] Verify Cloudflare Access policy + JWT decode

---

## 11. SMOKE TEST CASES

### Test 1: Public list 13 tier

```bash
curl -sS "https://duongsaotoasang.com/api/movement/sponsors/tiers" | jq '.data | length'
# Expected: 13
```

### Test 2: Filter by lane

```bash
curl -sS "https://duongsaotoasang.com/api/movement/sponsors/tiers?lane=B" | jq '.data | length'
# Expected: số tier có lane=B (theo Sponsorship Tracker Mục 2)
```

### Test 3: Inquiry submit happy path

```bash
curl -sS -X POST "https://duongsaotoasang.com/api/movement/sponsors/inquiry" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "cf-turnstile-response: $TURNSTILE_TOKEN" \
  -d '{
    "company": "Test Corp",
    "contact_name": "Test User",
    "contact_email": "test@example.com",
    "tier_slug": "community-friend",
    "intended_amount_usd": 1000,
    "budget_range": "< 5k",
    "lang": "vi"
  }' | jq .
# Expected: { "ok": true, "inquiry_id": "inq_xxx", "status": "received", "sla_hours": 72 }
# Verify: email reach Founder + Sponsor Manager + auto-reply user
```

### Test 4: Idempotent replay

Run Test 3 lần 2 với **cùng idempotency-key + cùng body** → response giống lần 1 (không tạo inquiry mới).

### Test 5: KYC required for tier $25K+

```bash
curl -sS -X POST "https://duongsaotoasang.com/api/movement/sponsors/inquiry" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "cf-turnstile-response: $TURNSTILE_TOKEN" \
  -d '{
    "contact_name": "Test User",
    "contact_email": "test@example.com",
    "tier_slug": "cohort-sponsor-50k",
    "intended_amount_usd": 50000
  }'
# Expected: 400 KYC_REQUIRED_FOR_TIER (missing company)
```

### Test 6: Rate limit

Run Test 3 6 lần liên tục → lần 6 expected `429 RATE_LIMITED`.

### Test 7: Admin endpoint without JWT

```bash
curl -sS -i "https://duongsaotoasang.com/api/admin/sponsors"
# Expected: 401 UNAUTHORIZED
```

### Test 8: Admin endpoint with JWT

```bash
curl -sS "https://duongsaotoasang.com/api/admin/sponsors" \
  -H "CF-Access-Jwt-Assertion: $JWT" | jq .
# Expected: { "ok": true, "data": [...], "meta": {...} }
```

### Test 9: Stage transition

```bash
curl -sS -X PATCH "https://duongsaotoasang.com/api/admin/sponsors/spn_xxx" \
  -H "Content-Type: application/json" \
  -H "CF-Access-Jwt-Assertion: $JWT" \
  -d '{ "stage": "qualified" }' | jq .
# Expected: { "ok": true, "id": "spn_xxx", "stage": "qualified", "stage_history": [...] }
```

### Test 10: Invalid stage transition

```bash
# Sponsor currently at 'inquiry' stage, try skip to 'agreement'
curl -sS -X PATCH "..." -d '{ "stage": "agreement" }'
# Expected: 400 INVALID_TRANSITION
```

---

## 12. CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0-DEV-READY | 2026-05-13 | Claude + Founder | Wave 2 W2.T2: tạo lần đầu — 6 endpoint + 5 D1 table + migration 0006 + 19 error code + smoke test 10 case. Dev-ready cho Tech Lead build Layer 1.2 (Tháng 10/2026) |

---

## APPROVAL

- [ ] Founder review tổng
- [ ] Tech Lead review endpoint + helper extraction
- [ ] Legal Counsel review KYC trigger + data retention
- [ ] DPO review email content + privacy notice trong auto-reply
- [ ] DevOps review Cloudflare Access policy + KV namespace setup

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là API contract dev-ready cho Layer 1 Sponsors. Khi build endpoint, reuse helper từ `functions/api/donate/create.js` + apply migration `migrations/0006_sponsors.sql`. UI consumer tham chiếu `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` Mục 4.2-4.3. Legal contract template tham chiếu `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md`.*
