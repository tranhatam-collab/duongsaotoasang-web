# DSTS Club — FULL DEV PLAN cho team dev

**Date:** 2026-05-19
**Founder:** Trần Hà Tâm
**Repo:** `duongsaotoasang.com` (Cloudflare Pages + Functions + D1)
**Stack:** Vanilla JS/HTML, Cloudflare Pages Functions (Workers), D1 SQLite

---

## TRẠNG THÁI HẠ TẦNG ĐÃ CÓ (đã apply, dev không cần làm lại)

| Item | Status | Path |
|---|---|---|
| D1 migration `0007_club_phase1.sql` | ✅ APPLIED trên remote `cf-d1-dsts-content-prod` | `migrations/0007_club_phase1.sql` |
| 6 D1 tables exist | ✅ creators, creator_profiles, club_posts, club_talkshows, reward_catalog, club_waitlist | D1 remote |
| Seed demo data | ✅ 2 creator + 2 profile + 4 post + 3 talkshow + 6 reward đã INSERT OR IGNORE | D1 remote |
| Pattern reference donation flow LIVE | ✅ commit `302b748` | `functions/api/donate/*.js` |
| Cloudflare Pages project | ✅ `duongsaotoasang-com-v2` | CF dashboard |

**Lưu ý:** Seed data đã có trong D1 remote. Dev có thể bắt tay test API ngay mà không cần apply migration/seed.

---

## 1. SCOPE — toàn bộ Phase 1 đến Phase 5

| Phase | Scope | Estimate | Block by |
|---|---|---|---|
| **Phase 1** | Web Club MVP (13 route + 6 API read-only + waitlist + seed) | 70-80h | (none) |
| **Phase 2** | Subscription billing + point purchase + reward redemption + referral | 200-300h | pay.iai.one Club contract + Legal Counsel |
| **Phase 3** | Creator dashboard (post editor, talkshow scheduler, revenue, payout) | 150-200h | Creator KYC + signed agreement |
| **Phase 4** | Mobile app iOS+Android | 400-500h | Mobile team riêng + App Store approval |
| **Phase 5** | Advanced ecosystem (livestream, check-in, sponsor dashboard, multi-creator bundles) | 200-300h | Phase 1-4 done |

**Total Web (Phase 1-3 + 5):** 620-880h ≈ 3-4 tháng với 2 dev fulltime.

---

## 2. NGUỒN TÀI LIỆU — đọc theo thứ tự (BẮT BUỘC)

| # | File | Mục đích |
|---|---|---|
| 1 | `docs/00_DSTS_CLUB_MASTER_INDEX_2026.md` | Master index, role-based reading order |
| 2 | `docs/DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md` | Định vị + 3 tier + 7 revenue + Star Points legal lock |
| 3 | `docs/DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md` | 45 route + 11 app tab |
| 4 | `docs/DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md` | Pricing tiers + point packages + revenue share % |
| 5 | `docs/DSTS_CLUB_CREATOR_PAYOUT_AND_PARTNER_MODEL_2026.md` | Creator model A/B/C/D + sponsor model |
| 6 | `docs/DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md` | 16 legal doc + mandatory locks |
| 7 | `docs/DSTS_CLUB_DATABASE_AND_API_SPEC_2026.md` | 32 table outline + 24 endpoint outline |
| 8 | `docs/DSTS_CLUB_DEV_ROADMAP_2026.md` | 5 phase + 12 founder approval đã lock |
| 9 | `docs/DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md` | Phase 1 concrete scope |
| 10 | `docs/DSTS_CLUB_FULL_HANDOFF_DEV_TEAM_2026-05-19.md` | Master handoff |
| 11 | **THIS FILE** | Full dev plan chi tiết với code skeleton |

---

## 3. FOUNDER DEFAULTS — đã chốt (6 câu hỏi)

1. Seed creator: 2 placeholder (`founder-tran-ha-tam` + `creator-vn-diaspora`) đã có trong D1
2. Creator dùng tên thật: chỉ Founder, creator khác = placeholder cho tới khi có signed agreement
3. Talk show demo: preview only (`status=coming_soon`), KHÔNG date thật
4. Reward catalog: hiển thị point cost gợi ý, status=`coming_soon` toàn bộ Phase 1
5. Waitlist owner: D1 `club_waitlist`; admin `/admin/clubs` xử lý Phase 2
6. Homepage prominence: 1 card footer `index.html`, KHÔNG hero (giữ Founder timeline)

Founder có quyền veto/override bất cứ default nào.

---

## 4. BRANCH STRATEGY + COMMIT CONVENTION

```
main (production)
├── layer-3/club-phase1-foundation       # Sprint 1.1: API endpoints + waitlist
├── layer-3/club-phase1-routes-public    # Sprint 1.2: 10 public HTML routes
├── layer-3/club-phase1-routes-account   # Sprint 1.3: 3 account shell routes
├── layer-3/club-phase1-qa-gates         # Sprint 1.4: Add QA gates to release-gate
├── layer-3/club-phase2-billing          # Sprint 2.1: subscription billing
├── layer-3/club-phase2-points           # Sprint 2.2: point purchase + redemption
├── layer-3/club-phase2-referral         # Sprint 2.3: referral ledger
├── layer-3/club-phase3-creator-dashboard
├── layer-3/club-phase4-mobile-app
└── layer-3/club-phase5-advanced
```

**Rule cứng:**
- KHÔNG commit thẳng vào `main`
- 1 PR / 1 sprint slice (4-12h work)
- PR title: `feat(club-phase{N}.{M}): <slice name>`
- Mỗi PR PHẢI pass `node scripts/sprint-0-release-gate.mjs` local trước push
- PR description PHẢI có: scope, test plan, acceptance criteria tick

---

## 5. CODE PATTERN BẮT BUỘC COPY (Layer 0 production-tested)

| Pattern | Source | Áp dụng cho |
|---|---|---|
| `errorJson(code, message, status)` helper + JSON envelope | `functions/api/donate/create.js:6-13` | Tất cả API endpoint |
| Idempotency-key replay guard với D1 UNIQUE | `functions/api/donate/create.js:41-54` | POST endpoint có side-effect |
| Validation strict + bounded input | `functions/api/donate/create.js:33-39` | Mọi input từ public |
| Audit log D1 INSERT OR IGNORE | `functions/api/donate/create.js:111-123` | Mọi mutate operation |
| HMAC fail-closed pattern | `functions/api/donate/webhook.js` | Phase 2 webhook |
| Canonical helper + precise status enum | `functions/_lib/email.js sendAndLogDonationReceipt` | Phase 2 notification |
| Behavior testing Node 19+ mock DB | `scripts/donate-webhook-behavior-qa.mjs` | Phase 2+ webhook tests |

---

## 6. PHASE 1 — SPRINT BREAKDOWN CHI TIẾT

### Sprint 1.1 — API Endpoints (4 endpoint, ~16h)

Branch: `layer-3/club-phase1-foundation`

#### 1.1.1 — `GET /api/clubs`

**File:** `functions/api/clubs/index.js`

**Spec:**
- Auth: public
- Query: (none Phase 1)
- Response 200:
```json
{
  "ok": true,
  "data": [
    {
      "id": "cr_founder_tran_ha_tam",
      "slug": "founder-tran-ha-tam",
      "display_name": "Trần Hà Tâm",
      "headline": "Founder DSTS — hành trình kết nối Người Việt Toả Sáng",
      "creator_type": "thought_leader",
      "is_featured": 1,
      "bio_short": "...",
      "avatar_url": "/img/og-default.svg"
    }
  ]
}
```

**SQL:**
```sql
SELECT c.id, c.slug, c.display_name, c.headline, c.creator_type, c.is_featured,
       p.bio_short, p.avatar_url
FROM creators c
LEFT JOIN creator_profiles p ON p.creator_id = c.id
WHERE c.status = 'active'
ORDER BY c.is_featured DESC, c.display_name ASC
```

**Errors:** `DB_UNAVAILABLE` (503) khi `!env.DB`

#### 1.1.2 — `GET /api/clubs/:slug`

**File:** `functions/api/clubs/[slug].js`

**Spec:**
- Auth: public
- Param: `slug` (creator slug)
- Response 200: `{ ok, data: { creator, profile } }`
- Response 404: `NOT_FOUND` khi creator không tồn tại hoặc `status NOT IN ('active', 'draft')`

**SQL:**
```sql
-- Step 1: creator
SELECT id, slug, display_name, headline, creator_type, status, is_featured, created_at
FROM creators WHERE slug = ? AND status IN ('active', 'draft')

-- Step 2: profile (nếu creator tồn tại)
SELECT bio_short, bio_long, hero_image_url, avatar_url, public_story_html,
       social_links_json, country_code, language_code
FROM creator_profiles WHERE creator_id = ?
```

**Errors:** `MISSING_SLUG` (400), `NOT_FOUND` (404), `DB_UNAVAILABLE` (503)

#### 1.1.3 — `GET /api/clubs/:slug/posts`

**File:** `functions/api/clubs/[slug]/posts.js`

**Spec:**
- Auth: public (Phase 1: chỉ trả `visibility=public` full; tier khác trả teaser-only)
- Query: `?visibility=public|member|circle|inner_circle` (default: `public`)
- Response 200 (public):
```json
{
  "ok": true,
  "visibility": "public",
  "data": [
    { "id": "...", "slug": "...", "title": "...", "excerpt": "...", "body_html": "...", "cover_image_url": "...", "visibility_tier": "public", "content_type": "article", "published_at": "..." }
  ]
}
```
- Response 200 (locked tier — Phase 1 teaser only, KHÔNG trả body_html):
```json
{
  "ok": true,
  "visibility": "member",
  "locked": true,
  "note": "Phase 1: paid content gating — body_html withheld. Subscribe to unlock.",
  "data": [
    { "id": "...", "slug": "...", "title": "...", "excerpt": "...", "cover_image_url": "...", "visibility_tier": "member", "content_type": "article", "published_at": "..." }
  ]
}
```

**SQL:**
```sql
-- Public: full body
SELECT id, slug, title, excerpt, body_html, cover_image_url, visibility_tier, content_type, published_at
FROM club_posts
WHERE creator_id = ? AND visibility_tier = 'public' AND status = 'published'
ORDER BY published_at DESC

-- Locked: NO body_html
SELECT id, slug, title, excerpt, cover_image_url, visibility_tier, content_type, published_at
FROM club_posts
WHERE creator_id = ? AND visibility_tier = ? AND status = 'published'
ORDER BY published_at DESC
```

**Errors:** `MISSING_SLUG` (400), `INVALID_VISIBILITY` (400), `NOT_FOUND` (404), `DB_UNAVAILABLE` (503)

#### 1.1.4 — `POST /api/clubs/waitlist`

**File:** `functions/api/clubs/waitlist.js`

**Spec:**
- Auth: public + Cloudflare Turnstile (Phase 2 — Phase 1 chỉ idempotency-key)
- Body:
```json
{
  "email": "user@example.com",
  "phone": "optional",
  "full_name": "optional",
  "interest_type": "member|circle|inner_circle|creator|sponsor|talkshow_reminder",
  "creator_slug": "optional",
  "notes": "optional, max 1000 chars",
  "source_route": "optional, max 200 chars"
}
```
- Replay guard: UNIQUE(email) → duplicate trả `{ ok: true, replayed: true, id, status }`
- Response 200 new: `{ ok: true, id: "wl_<hex>", status: "new" }`

**Validation:**
- `email` regex: `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`
- `interest_type` whitelist 6 values

**SQL:**
```sql
-- Step 1: check existing
SELECT id, interest_type, status FROM club_waitlist WHERE email = ?

-- Step 2: insert (chỉ khi không có)
INSERT OR IGNORE INTO club_waitlist
  (id, email, phone, full_name, interest_type, creator_slug, notes, source_route, status, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
```

**Errors:** `INVALID_JSON` (400), `INVALID_EMAIL` (400), `INVALID_INTEREST_TYPE` (400), `DB_UNAVAILABLE` (503)

### Sprint 1.2 — Talkshows + Rewards API (2 endpoint, ~6h)

Branch: `layer-3/club-phase1-foundation` (cùng branch 1.1)

#### 1.2.1 — `GET /api/talkshows`

**File:** `functions/api/talkshows.js`

**Spec:**
- Auth: public
- Query: `?upcoming=true&visibility=public` (default: upcoming=true, visibility=public)
- Response 200:
```json
{
  "ok": true,
  "data": [
    {
      "id": "cts_public_intro",
      "slug": "talkshow-mo-mang-public",
      "title": "Talk show mở màng — Public",
      "summary": "...",
      "host_name": "Trần Hà Tâm",
      "talkshow_type": "live",
      "access_tier": "public",
      "starts_at": "2026-06-18 ...",
      "timezone": "Asia/Ho_Chi_Minh",
      "replay_rule": "public",
      "status": "coming_soon",
      "creator_slug": "founder-tran-ha-tam"
    }
  ]
}
```

**SQL:**
```sql
SELECT t.id, t.slug, t.title, t.summary, t.host_name, t.talkshow_type,
       t.access_tier, t.starts_at, t.timezone, t.replay_rule, t.status,
       c.slug as creator_slug
FROM club_talkshows t
INNER JOIN creators c ON c.id = t.creator_id
WHERE t.status IN ('coming_soon', 'scheduled', 'live')
  AND t.starts_at >= datetime('now')
  AND t.access_tier = ?
ORDER BY t.starts_at ASC
LIMIT 50
```

**Errors:** `DB_UNAVAILABLE` (503)

#### 1.2.2 — `GET /api/rewards/catalog`

**File:** `functions/api/rewards/catalog.js`

**Spec:**
- Auth: public
- Query: `?category=digital|event|experience` (optional filter)
- Response 200:
```json
{
  "ok": true,
  "data": [
    {
      "id": "rw_clip_premium",
      "slug": "mo-khoa-clip-premium",
      "title": "Mở khoá 1 clip premium",
      "reward_type": "digital",
      "tier_required": null,
      "points_cost": 50,
      "inventory_mode": "static",
      "status": "coming_soon",
      "description_html": "..."
    }
  ]
}
```

**SQL:**
```sql
SELECT id, slug, title, reward_type, tier_required, points_cost,
       inventory_mode, status, description_html
FROM reward_catalog
WHERE (? IS NULL OR reward_type = ?)
ORDER BY
  CASE reward_type WHEN 'digital' THEN 1 WHEN 'event' THEN 2 WHEN 'experience' THEN 3 ELSE 4 END,
  points_cost ASC
```

**Errors:** `INVALID_CATEGORY` (400), `DB_UNAVAILABLE` (503)

### Sprint 1.3 — Public HTML Routes (10 route, ~32h)

Branch: `layer-3/club-phase1-routes-public`

**Pattern HTML:** Copy structure từ `index.html` — `<header>`, `<main>`, `<footer>` với C-002 entity disclosure. Inline `<style>` per page hoặc dùng `assets/club.css` (em đề xuất tạo file riêng).

#### 1.3.1 — `/club` (landing page)

**File:** `club.html` (root) hoặc `club/index.html`

**Sections:**
1. **Hero** — "DSTS Club — câu lạc bộ kinh tế hai lớp"
2. **Club positioning** — 2 lớp public + paid layer (copy từ `DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md`)
3. **3 packages summary card** — Member 99K / Circle 299K / Inner Circle 990K — CTA "Tìm hiểu thêm"
4. **Featured creators** — fetch `/api/clubs` JS-side, render grid
5. **Upcoming talk shows** — fetch `/api/talkshows`, render list
6. **Reward overview** — fetch `/api/rewards/catalog?category=digital` (preview 3 item)
7. **CTA section** — "Đăng ký waitlist" button → modal form POST `/api/clubs/waitlist`
8. **Footer C-002 entity disclosure** — copy y nguyên từ `index.html` footer

**Acceptance:** trang load < 2s, 7 section visible, fetch 3 API call thành công

#### 1.3.2 — `/club/join` (waitlist form page)

**File:** `club/join.html`

**Sections:**
1. **Hero** — "Đăng ký tham gia DSTS Club"
2. **3-tier overview ngắn**
3. **Form** với fields: email (required), full_name (optional), phone (optional), interest_type (select: 6 values), creator_slug (optional, dropdown từ `/api/clubs`), notes (textarea)
4. **Câu khoá Star Points** (bắt buộc):
> "Star Points là điểm thưởng nội bộ của DSTS Club. Điểm không phải tiền, không phải chứng khoán, không phải tài sản đầu tư, không bảo đảm quy đổi thành tiền mặt, và chỉ được sử dụng trong phạm vi quyền lợi do DSTS công bố theo từng thời kỳ."
5. **Submit** → POST `/api/clubs/waitlist` → success message "Cảm ơn anh/chị đã quan tâm. Chúng tôi sẽ liên hệ sớm."
6. **Footer C-002**

**Acceptance:** form submit → 200 → success state; duplicate email → `replayed: true` → message "Đã ghi nhận trước đó."

#### 1.3.3 — `/club/levels` (3-tier pricing)

**File:** `club/levels.html`

**Sections:**
1. **Hero** — "Ba gói thành viên DSTS Club"
2. **3 cards** chi tiết Member / Circle / Inner Circle (copy y nguyên từ `DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md` §"Ba gói thành viên")
3. **Câu khoá Star Points** (bắt buộc)
4. **Disclaimer:** "Phase 1 chỉ nhận waitlist; thanh toán subscription Phase 2 sau khi hoàn tất KYC merchant cho DSTS Club lane."
5. **CTA → `/club/join`**
6. **Footer C-002**

#### 1.3.4 — `/club/faq`

**File:** `club/faq.html`

**Sections:**
1. Hero "Câu hỏi thường gặp"
2. 10-15 Q&A (template từ `DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md` keypoints)
3. Footer C-002

#### 1.3.5 — `/club/legal`

**File:** `club/legal.html`

**Sections:**
1. Hero "Khung pháp lý DSTS Club"
2. List 16 legal doc (từ `DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md`) — Phase 1: chỉ liệt kê tên + status "DRAFT — Legal Counsel review pending"
3. Câu khoá Star Points
4. Mandatory legal locks (11 bullet)
5. Footer C-002

#### 1.3.6 — `/club/creators` (list)

**File:** `club/creators.html` hoặc dùng JS render từ template

**Sections:**
1. Hero "Creators trong DSTS Club"
2. Grid creator cards (fetch `/api/clubs`)
3. Per card: avatar, display_name, headline, creator_type badge, CTA → `/club/{slug}`
4. Footer C-002

#### 1.3.7 — `/club/{creator}` (creator landing)

**File:** `club/[creator]/index.html` hoặc CF Pages dynamic route

**Note:** Cloudflare Pages không hỗ trợ dynamic HTML route như Next.js. Phải dùng:
- **Option A** (em đề xuất): 1 file `club/creator.html` + JS-side fetch param từ URL `?slug=...` → CF redirect `/club/founder-tran-ha-tam` → `/club/creator.html?slug=founder-tran-ha-tam` qua `_redirects`
- **Option B:** Per-creator file (`club/founder-tran-ha-tam.html`) — KHÔNG scalable

**Sections:**
1. Hero với hero_image_url, display_name, headline
2. Bio long
3. Public story HTML
4. CTA "Đăng ký membership" → `/club/{creator}/membership`
5. Upcoming talkshow của creator (fetch `/api/talkshows` filter creator_slug)
6. Public posts (fetch `/api/clubs/{slug}/posts?visibility=public`)
7. Social links
8. Footer C-002

#### 1.3.8 — `/club/{creator}/public` (creator public posts)

**File:** `club/creator-public.html` (dùng template + URL param `?slug=...`)

**Sections:**
1. Header với creator info
2. List posts visibility=public (fetch `/api/clubs/{slug}/posts?visibility=public`)
3. Per post: title, excerpt, cover_image_url, published_at, CTA "Đọc tiếp" → `/club/{creator}/post/{slug}` (defer Phase 2)
4. Footer C-002

#### 1.3.9 — `/club/{creator}/talkshows`

**File:** `club/creator-talkshows.html`

**Sections:**
1. Header với creator info
2. List talkshow (fetch `/api/talkshows?creator_slug=...`)
3. Per item: title, summary, starts_at, timezone, access_tier badge, status badge
4. CTA "Đặt vé" → defer Phase 2 (Phase 1 chỉ hiển thị `coming_soon`)
5. Footer C-002

#### 1.3.10 — `/club/{creator}/membership`

**File:** `club/creator-membership.html`

**Sections:**
1. Header creator
2. 3-tier card (copy `/club/levels` 3 card)
3. CTA "Đăng ký waitlist cho creator này" → modal POST `/api/clubs/waitlist` với `creator_slug=...`
4. Câu khoá Star Points
5. Footer C-002

#### 1.3.11 — `/club/{creator}/rewards`

**File:** `club/creator-rewards.html`

**Sections:**
1. Header creator
2. Reward catalog filter theo creator (Phase 1: filter chung — TODO Phase 2 link creator-specific reward)
3. Fetch `/api/rewards/catalog`
4. Per card: title, reward_type badge, points_cost, status "coming_soon"
5. Câu khoá Star Points
6. Footer C-002

### Sprint 1.4 — Account Shell Routes (3 route, ~6h)

Branch: `layer-3/club-phase1-routes-account`

**Phase 1: chỉ shell, KHÔNG có auth/login.** Placeholder pages cho dev tương lai.

#### 1.4.1 — `/account/library`

**File:** `account/library.html`

**Sections:**
1. Hero "Thư viện của bạn"
2. Placeholder "Đăng nhập sẽ mở Phase 2"
3. Footer C-002

#### 1.4.2 — `/account/calendar`

**File:** `account/calendar.html`

**Sections:**
1. Hero "Lịch của bạn"
2. Placeholder
3. Footer C-002

#### 1.4.3 — `/account/wallet`

**File:** `account/wallet.html`

**Sections:**
1. Hero "Ví Star Points của bạn"
2. Placeholder "Đăng nhập sẽ mở Phase 2"
3. Câu khoá Star Points
4. Footer C-002

### Sprint 1.5 — `_redirects` + QA gates (~4h)

Branch: `layer-3/club-phase1-qa-gates`

#### 1.5.1 — `_redirects` update

Thêm vào cuối `_redirects`:
```
# DSTS Club Phase 1
/club                              /club.html             200
/club/join                         /club/join.html        200
/club/levels                       /club/levels.html      200
/club/faq                          /club/faq.html         200
/club/legal                        /club/legal.html       200
/club/creators                     /club/creators.html    200
/club/:slug                        /club/creator.html?slug=:slug             200
/club/:slug/public                 /club/creator-public.html?slug=:slug      200
/club/:slug/talkshows              /club/creator-talkshows.html?slug=:slug   200
/club/:slug/membership             /club/creator-membership.html?slug=:slug  200
/club/:slug/rewards                /club/creator-rewards.html?slug=:slug     200
/account/library                   /account/library.html  200
/account/calendar                  /account/calendar.html 200
/account/wallet                    /account/wallet.html   200
```

#### 1.5.2 — QA gate `scripts/club-phase1-qa.mjs` (mới)

Checks:
- 14 HTML file tồn tại
- Câu khoá Star Points xuất hiện trên: `club/levels.html`, `club/faq.html`, `club/legal.html`, `club/creator-membership.html`, `club/creator-rewards.html`, `account/wallet.html`, `club.html`
- C-002 entity disclosure footer trên TẤT CẢ 14 file Club
- Không có chuỗi cấm: "đầu tư", "lãi suất", "lợi nhuận cam kết", "rút tiền", "đổi USD"

#### 1.5.3 — Tích hợp vào `scripts/sprint-0-release-gate.mjs`

Thêm:
```javascript
await requirePass("local-club-phase1-qa", "node", ["scripts/club-phase1-qa.mjs"])
await requirePass("local-club-api-syntax-clubs-index", "node", ["--check", "functions/api/clubs/index.js"])
await requirePass("local-club-api-syntax-clubs-slug", "node", ["--check", "functions/api/clubs/[slug].js"])
await requirePass("local-club-api-syntax-clubs-posts", "node", ["--check", "functions/api/clubs/[slug]/posts.js"])
await requirePass("local-club-api-syntax-clubs-waitlist", "node", ["--check", "functions/api/clubs/waitlist.js"])
await requirePass("local-club-api-syntax-talkshows", "node", ["--check", "functions/api/talkshows.js"])
await requirePass("local-club-api-syntax-rewards", "node", ["--check", "functions/api/rewards/catalog.js"])
```

#### 1.5.4 — Update existing QA scripts để pass cho Club routes

- `scripts/claim-register-qa.mjs`: thêm Club required phrases cho 7 page
- `scripts/public-flow-safety-qa.mjs`: whitelist Club input names (email, full_name, phone, notes, etc.) trong `allowedJsInputFiles` hoặc tạo allowedClubInputFiles riêng
- `scripts/content-qa.mjs`: allow Club waitlist form
- `scripts/html-structure-qa.mjs`: verify Club HTML có 1 h1, meta tags, canonical
- `scripts/seo-route-qa.mjs`: add 14 Club route vào sitemap + check noindex/index

### Sprint 1.6 — Smoke + Deploy (~4h)

Branch: merge tất cả Phase 1 sub-branch vào `layer-3/club-phase1-foundation`, rồi PR vào `main`.

**Pre-merge checklist:**
- [ ] `node scripts/sprint-0-release-gate.mjs` local → PASS hoặc BLOCKED_EXTERNAL (chỉ HEADERS_QA cache)
- [ ] 6 API endpoint trả 200 với `wrangler pages dev .` local
- [ ] 14 HTML route render đúng trên local dev
- [ ] Manual deploy preview: `wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch preview` (KHÔNG `main`)
- [ ] Smoke preview: `BASE_URL=<preview-url> node scripts/sprint-0-release-gate.mjs` → PASS
- [ ] Founder smoke 24h preview link
- [ ] Founder approve → merge main + deploy production

---

## 7. PHASE 1 — ACCEPTANCE CRITERIA (10 checkbox cứng)

- [ ] 10 public route render đúng (`/club`, `/club/join`, `/club/creators`, `/club/{creator}`, `/club/{creator}/public`, `/club/{creator}/talkshows`, `/club/{creator}/membership`, `/club/{creator}/rewards`, `/club/faq`, `/club/legal`)
- [ ] 3 account shell route render đúng (`/account/library`, `/account/calendar`, `/account/wallet`)
- [ ] 6 API endpoint trả đúng JSON envelope `{ok, data, error}`
- [ ] D1 migration sạch trên remote (đã apply, dev verify `wrangler d1 execute --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'club_%'"`)
- [ ] Seed: ≥ 2 creator + 4 post + 3 talkshow + 6 reward demo (đã có)
- [ ] Waitlist form ghi được vào D1 (POST `/api/clubs/waitlist` → 200 + D1 row)
- [ ] Câu khoá Star Points nguyên văn xuất hiện trên 7 page bắt buộc
- [ ] C-002 entity disclosure footer trên TẤT CẢ 14 Club page
- [ ] `sprint-0-release-gate.mjs` PASS hoặc BLOCKED_EXTERNAL
- [ ] Founder smoke 24h preview link không lỗi P0/P1

---

## 8. PHASE 2 — SPRINT BREAKDOWN (chi tiết khi Phase 1 done)

### Sprint 2.1 — Subscription Billing (~80h)

**Dependencies:** pay.iai.one Club contract `(dsts, duongsaotoasang-club, payos)` provisioned.

**Scope:**
- D1 migration `0008_subscriptions.sql`: `subscriptions`, `subscription_events`, `subscription_renewal_log`
- API: `POST /api/clubs/subscribe`, `GET /api/me/subscriptions`, `POST /api/clubs/subscription/cancel`
- Webhook handler: `POST /api/clubs/subscription/webhook` (HMAC verify, status update)
- Email: subscription confirmation, renewal reminder, cancel confirmation
- HTML: `/club/{creator}/checkout`, `/account/subscriptions`
- Audit: every subscription event → `subscription_events` row

### Sprint 2.2 — Point Purchase + Reward Redemption (~60h)

**Scope:**
- D1: `point_ledger`, `point_packages`, `reward_redemptions`
- API: `POST /api/points/purchase`, `GET /api/me/points`, `POST /api/rewards/redeem`, `GET /api/rewards/catalog/:slug`
- Anti-fraud: point purchase replay guard, redeem idempotency
- HTML: `/points/purchase`, `/account/points`, reward catalog full render với redeem CTA
- Audit: `point_ledger` per transaction

### Sprint 2.3 — Referral Ledger (~40h)

**Scope:**
- D1: `referral_links`, `referral_events`, `referral_clawback_log`
- State machine: `pending → earned → clawed_back`
- API: `POST /api/referrals/create`, `GET /api/referrals/me`, internal `POST /api/admin/referrals/clawback`
- Logic: clawback khi refund/fraud trong 30 ngày
- HTML: `/account/referrals`

### Sprint 2.4 — Email automation (~20h)

**Scope:**
- Helper: `functions/_lib/email.js sendAndLogClubReceipt` (canonical)
- Templates: subscription/point/reward/referral confirmation
- D1: `club_email_dispatches` (audit log)

---

## 9. PHASE 3 — CREATOR DASHBOARD (~150h khi Phase 2 done)

**Block by:** Creator KYC + signed agreement.

**Scope:**
- Auth system (Phase 2 prerequisite)
- `/creator/dashboard`, `/creator/posts`, `/creator/talkshows`, `/creator/members`, `/creator/revenue`, `/creator/payouts`, `/creator/points`, `/creator/settings`, `/creator/profile`, `/creator/reports`
- Post editor (markdown + media upload R2)
- Talkshow scheduler (datetime picker + capacity)
- Member list (read-only Phase 3, full export Phase 4)
- Revenue dashboard (revenue share calculation)
- Payout request (manual review by admin, auto Phase 4)
- D1 migrations 0009-0012

---

## 10. PHASE 4 — MOBILE APP (~400h, mobile team riêng)

**Scope:** iOS + Android, React Native hoặc Flutter (mobile lead chọn). Theo `DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md` §"App phase 1 included".

**App tabs:** Home, Club, Creators, Talk Shows, Library, Wallet, Rewards, Referral, Events, Profile, Support.

**Defer in app:** Buy points/memberships/checkout (theo `DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md` "App phase 1 is engagement-first").

**Block:** App Store + Google Play approval process; pay.iai.one có path mobile checkout chưa.

---

## 11. PHASE 5 — ADVANCED ECOSYSTEM (~200h)

**Scope:**
- Livestream room (WebRTC + recording)
- Offline check-in QR
- VIP meet scheduling
- Multi-creator bundles
- Người Việt Muôn Nơi profile sync
- DSTS showcase sync
- Sponsor campaign dashboard
- Chapter leader tools

---

## 12. QA GATES — PER PHASE

Mỗi Phase phải thêm QA gate vào `scripts/sprint-0-release-gate.mjs`:

| Phase | QA script | Block on |
|---|---|---|
| 1 | `scripts/club-phase1-qa.mjs` | Câu khoá Star Points absent, C-002 absent, forbidden phrases |
| 2 | `scripts/club-billing-qa.mjs` | HMAC fail-closed broken, audit row missing |
| 2 | `scripts/club-points-policy-qa.mjs` | Forbidden words ("đầu tư", "lãi suất", "rút tiền") |
| 3 | `scripts/club-creator-payout-qa.mjs` | Revenue share calculation error, payout without signed contract |
| 4 | (mobile team riêng — App Store + Play Store review) | |
| 5 | `scripts/club-livestream-qa.mjs` | Webhook signature, capacity overflow |

---

## 13. DEFER LIST (KHÔNG làm Phase 1)

| Item | Defer phase |
|---|---|
| Subscription billing thật | Phase 2.1 |
| Point purchase | Phase 2.2 |
| Reward redemption automation | Phase 2.2 |
| Creator payout engine | Phase 3 |
| Referral ledger thật | Phase 2.3 |
| Event QR check-in | Phase 5 |
| App iOS/Android | Phase 4 |
| Livestream room | Phase 5 |
| Sponsor dashboard | Phase 5 |
| Multi-creator bundles | Phase 5 |
| Auth/login system | Phase 2 (prerequisite Phase 3+) |
| Creator dashboard | Phase 3 |
| Admin dashboard | Phase 3 |

PR nào trong Phase 1 đụng vào item trên → REJECT, mở issue mới.

---

## 14. TIMELINE THỰC TẾ

| Phase | Effort | Calendar (2 dev fulltime) | Block |
|---|---|---|---|
| Phase 1 | 70-80h | 1-2 tuần | (none — bắt tay ngay) |
| Phase 2 | 200-300h | 4-6 tuần | pay.iai.one Club contract + Legal Counsel |
| Phase 3 | 150-200h | 3-4 tuần | Creator KYC + signed agreement |
| Phase 4 | 400-500h | 8-12 tuần | Mobile team + App Store |
| Phase 5 | 200-300h | 4-6 tuần | Phase 1-4 done |

**Total Web (1-3+5):** 620-880h ≈ **3-4 tháng với 2 dev fulltime**.

---

## 15. FOUNDER VS DEV RESPONSIBILITY SPLIT

| Việc | Owner |
|---|---|
| Pay.iai.one Club contract setup | Founder làm việc với ops |
| Legal Counsel sign-off 16 doc | Founder hire + chase |
| Creator KYC + signed agreement | Founder |
| Cloudflare Pages secrets ops | Founder (`wrangler pages secret put`) |
| D1 schema concrete | Dev |
| API contract internal | Dev |
| HTML routes + UX | Dev + designer |
| QA scripts | Dev |
| Code architecture | Dev lead |
| Wording legal trên public surface | Founder veto |
| Pricing tier + point cost | Founder veto |

---

## 16. AUDITOR PROTOCOL (em — Claude)

Em KHÔNG code. Em verify khi team push:

1. Team paste `git log --oneline -N` + `git diff main..feature-branch --stat` cho Founder
2. Founder forward output cho em
3. Em verify:
   - Migration sạch (idempotent, FK đúng, index hợp lý)
   - API endpoint khớp pattern `donate/*.js` (idempotency, validation, audit log, errorJson convention)
   - HTML route có C-002 entity disclosure footer
   - Câu khoá Star Points hiện diện trên route bắt buộc
   - QA gate mới add vào release-gate
   - Acceptance criteria checkbox tick cụ thể với evidence
4. Em verdict: APPROVE / REJECT với reason cụ thể (file:line)
5. REJECT → team fix → re-verify

Em audit live mỗi sprint, KHÔNG audit từng commit nhỏ.

---

## 17. COMMUNICATION CHANNELS

| Việc | Channel |
|---|---|
| Team báo cáo milestone | Founder paste output vào chat với em |
| Em verdict | Em reply trong chat |
| Founder quyết business question | Trả lời team trực tiếp |
| pay.iai.one ops cấp contract Club | Founder làm việc trực tiếp |
| Legal Counsel sign-off | Founder làm việc trực tiếp |

---

## 18. HAND-OFF COMPLETE CHECKLIST

Em đã chuẩn bị xong:
- [x] 11 doc nguồn committed vào `docs/`
- [x] Migration `0007_club_phase1.sql` đã apply trên D1 remote
- [x] Seed data (2 creator + 4 post + 3 talkshow + 6 reward) đã INSERT trên D1 remote
- [x] Donation pattern reference LIVE (commit `302b748`) — team copy từ đó
- [x] File kế hoạch chi tiết này (DSTS_CLUB_FULL_DEV_PLAN_2026-05-19.md)
- [x] Branch naming convention
- [x] Acceptance criteria 10 checkbox cứng
- [x] Defer list rõ ràng
- [x] Auditor protocol
- [x] Founder defaults 6 câu hỏi

Team dev nhận file này + đọc 10 doc Club trong `docs/` là đủ bắt tay Phase 1.

---

## 19. LỆNH GIAO TEAM DEV (Founder paste cho team)

```
DSTS Club Phase 1-5 — Full kickoff toàn bộ kế hoạch

Repo: github.com/tranhatam-collab/duongsaotoasang-web
Branch base: main (donation Layer 0 LIVE, ready)

Đọc trước khi viết dòng code đầu tiên:
  docs/DSTS_CLUB_FULL_DEV_PLAN_2026-05-19.md   ← FILE CHÍNH

File này có:
- 19 mục đầy đủ, mỗi sprint break thành sub-task với code skeleton cụ thể
- 6 API endpoint với SQL + JSON shape + error codes
- 13 HTML route với section breakdown + acceptance per route
- D1 migration đã apply, seed data đã có (không cần làm lại)
- Auditor protocol — Founder forward output cho auditor verify mỗi milestone

Tài liệu nguồn (đọc theo thứ tự — §2 trong DEV_PLAN):
  docs/00_DSTS_CLUB_MASTER_INDEX_2026.md
  docs/DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md
  docs/DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md
  docs/DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md
  docs/DSTS_CLUB_CREATOR_PAYOUT_AND_PARTNER_MODEL_2026.md
  docs/DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md
  docs/DSTS_CLUB_DATABASE_AND_API_SPEC_2026.md
  docs/DSTS_CLUB_DEV_ROADMAP_2026.md
  docs/DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md
  docs/DSTS_CLUB_FULL_HANDOFF_DEV_TEAM_2026-05-19.md

Bắt tay Phase 1 (1-2 tuần):
  cd duongsaotoasang.com
  git checkout main && git pull
  git checkout -b layer-3/club-phase1-foundation
  
  # Verify D1 đã có 6 Club table + seed (Founder cấp CF token nếu chưa):
  export CLOUDFLARE_API_TOKEN=<...>
  wrangler d1 execute cf-d1-dsts-content-prod --remote \
    --command "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'club_%' OR name LIKE 'creator%' OR name = 'reward_catalog'"
  # Expect: 6 tables
  
  # Bắt tay theo §6 trong DEV_PLAN (Sprint 1.1 → 1.6)

Báo cáo:
- Mỗi sprint slice done → paste cho Founder
- Founder forward auditor verify
- APPROVE → tiếp sprint next; REJECT → fix theo file:line auditor chỉ

Block dependencies:
- Phase 1: KHÔNG cần thêm gì
- Phase 2: pay.iai.one contract Club + Legal Counsel sign-off (Founder chase)
- Phase 3: Creator KYC + signed agreement (Founder chase)

Câu hỏi business: hỏi Founder. Câu hỏi technical: paste cho Founder forward auditor.
```

---

## 20. KẾT LUẬN

File này cover **100% kế hoạch DSTS Club** từ Phase 1 đến Phase 5, mỗi sprint break thành sub-task với code skeleton, SQL, JSON shape, acceptance criteria cứng.

Team dev nhận file này + 10 doc nguồn = đủ để bắt tay Phase 1 trong 1-2 tuần.

Founder reserve quyền veto/override defaults trong bất kỳ phase nào.

Auditor (Claude) verify mỗi milestone team push, KHÔNG code.

**Hand-off complete.**
