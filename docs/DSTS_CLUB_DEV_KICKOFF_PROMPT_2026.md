# DSTS Club — Dev Kickoff Prompt (Phase 1 Web MVP)

**Date:** 2026-05-19
**Owner:** Founder Trần Hà Tâm
**Target dev team:** 2–3 fullstack devs (Cloudflare Pages + Functions + D1 stack, đã quen Layer 0 Sprint 0)
**Branch strategy:** `layer-3/club-phase1-*` (mỗi sprint 1 branch riêng, merge vào `main` qua PR)
**Repository:** `duongsaotoasang.com/`

---

## 0. Cảnh báo trung thực (đọc trước khi bắt tay)

Bộ docs nguồn (7 file `DSTS_CLUB_*_2026.md` trong `docs/`) là **outline cấp cao**, KHÔNG phải spec production-grade. Trước khi viết code production, team CẦN tạo Wave 2 spec chi tiết — tương đương `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` đã có sẵn cho Layer 1. Nếu nhảy thẳng vào code mà không spec ra: sẽ phải refactor lớn ở Phase 2.

**Hệ quả:** Phase 1 này là "MVP read-only + manual workflows" — chưa có billing tự động, chưa có payout tự động, chưa có anti-fraud. Phase 2 mới enable automation.

**Dependencies BLOCK:**
- Donation flow (Layer 0) phải go-live trước (đang chờ team pay.iai.one verify key + contract). Lý do: Phase 1 Club có tái sử dụng pattern `functions/api/donate/create.js` (idempotency, HMAC verify, D1 audit log).
- pay.iai.one phải có contract riêng cho `tenant=dsts, site=duongsaotoasang-club, provider=payos` — KHÔNG dùng chung contract với donation. Founder cần làm việc với team gateway tạo contract mới.
- Legal Counsel phải review 16 legal doc trong `DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md` trước khi đăng giá lên public — đặc biệt câu khoá "Star Points không phải tiền/chứng khoán/đầu tư".

---

## 1. Phase 1 Web Club MVP — Scope (sprint 4–6 tuần, 2 dev)

### 1.1 Routes phải build (public + member layer, read-only)

| Route | Type | Source data |
|---|---|---|
| `/club` | Public landing | static + creator highlight feed |
| `/club/levels` | Public — 3 tier pricing | static, lock theo `DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md` |
| `/club/join` | Public — CTA + waitlist form | D1 table `club_waitlist` |
| `/club/faq` | Public | static MD render |
| `/club/legal` | Public — link 16 doc | static |
| `/club/creators` | Public — list creator profiles | D1 `creators` + `creator_profiles` |
| `/club/{creator}` | Public — creator landing | D1 join 3 table |
| `/club/{creator}/public` | Public — public posts | D1 `club_posts` filtered `visibility=public` |
| `/club/{creator}/membership` | Public — tier benefits + CTA | static |
| `/club/{creator}/talkshows` | Public — public schedule | D1 `club_talkshows` filtered `visibility=public` |
| `/rewards` | Public — reward catalog | D1 `reward_catalog` (read-only Phase 1) |
| `/points` | Public — Star Points policy | static, lock câu khoá pháp lý |
| `/account` | Member-only — placeholder | login redirect Phase 2 |

**KHÔNG build Phase 1:** `/account/wallet`, `/account/points`, `/account/referrals`, `/creator/*`, `/admin/*`, billing flow, point purchase. Tất cả defer Phase 2.

### 1.2 D1 schema (migrations cần tạo)

`migrations/0007_club_phase1.sql`:
```sql
CREATE TABLE creators (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,  -- artist/entrepreneur/expert/thought_leader/community/diaspora/special
  status TEXT NOT NULL DEFAULT 'draft',  -- draft/active/paused/removed
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE creator_profiles (
  creator_id TEXT PRIMARY KEY REFERENCES creators(id),
  short_bio TEXT,
  long_bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  topics TEXT,  -- comma-separated
  social_links_json TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE club_posts (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES creators(id),
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  visibility TEXT NOT NULL,  -- public/member/circle/inner_circle
  published_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE club_talkshows (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES creators(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TEXT NOT NULL,
  visibility TEXT NOT NULL,  -- public/member/circle/inner_circle
  capacity INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE reward_catalog (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,  -- digital/event/experience
  title TEXT NOT NULL,
  description TEXT,
  point_cost INTEGER NOT NULL,
  tier_required TEXT,  -- null/member/circle/inner_circle
  status TEXT NOT NULL DEFAULT 'active',
  inventory INTEGER  -- null = unlimited
);

CREATE TABLE club_waitlist (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  preferred_tier TEXT,  -- member/circle/inner_circle
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(email)
);

CREATE INDEX idx_club_posts_creator_visibility ON club_posts(creator_id, visibility, status);
CREATE INDEX idx_club_talkshows_scheduled ON club_talkshows(scheduled_at, visibility);
CREATE INDEX idx_reward_catalog_category ON reward_catalog(category, status);
```

### 1.3 API endpoints (read-only Phase 1)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/club/creators` | public | List active creators |
| `GET` | `/api/club/creators/:slug` | public | Creator detail + profile |
| `GET` | `/api/club/creators/:slug/posts?visibility=public` | public | Public posts |
| `GET` | `/api/club/talkshows?upcoming=true&visibility=public` | public | Upcoming public talk shows |
| `GET` | `/api/club/rewards` | public | Reward catalog (read-only) |
| `POST` | `/api/club/waitlist` | public + Turnstile + idempotency-key | Insert waitlist email |

**Pattern bắt buộc:** copy từ `functions/api/donate/create.js` — `errorJson` helper, idempotency-key replay guard, Cloudflare Turnstile cho POST endpoint, validation strict, audit log nếu mutate.

### 1.4 Legal copy lock (BLOCKING — phải có trước khi public)

Trên các trang `/club/levels`, `/points`, `/rewards`, FOOTER hoặc disclaimer paragraph bắt buộc xuất hiện nguyên văn câu khoá (lấy từ `DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md`):

> **Star Points là điểm thưởng nội bộ của DSTS Club. Điểm không phải tiền, không phải chứng khoán, không phải tài sản đầu tư, không bảo đảm quy đổi thành tiền mặt, và chỉ được sử dụng trong phạm vi quyền lợi do DSTS công bố theo từng thời kỳ.**

QA gate script `scripts/club-legal-disclosure-qa.mjs` phải kiểm tra câu này tồn tại trên 3 route trên. KHÔNG merge PR nếu fail.

### 1.5 QA gates phải thêm vào `scripts/sprint-0-release-gate.mjs`

```javascript
await requirePass("local-club-routes-syntax", "node", ["--check", "functions/api/club/creators.js"])
await requirePass("local-club-legal-disclosure-qa", "node", ["scripts/club-legal-disclosure-qa.mjs"])
await requirePass("local-club-points-policy-qa", "node", ["scripts/club-points-policy-qa.mjs"])
```

`club-points-policy-qa.mjs` phải fail nếu thấy chuỗi cấm: "đầu tư", "lãi suất", "lợi nhuận cam kết", "rút tiền", "đổi USD" trong `/points` hoặc `/rewards` HTML.

---

## 2. Acceptance criteria — sprint kết thúc khi

- [ ] 13 route Phase 1 live trên `https://duongsaotoasang.com/club/*` + `https://duongsaotoasang.com/rewards`, `https://duongsaotoasang.com/points`
- [ ] D1 migration `0007_club_phase1.sql` applied trên remote, có ít nhất 3 creator demo + 10 post + 5 talkshow + 12 reward seed
- [ ] 6 API endpoint trả 200 với schema khớp; POST waitlist trả 200 + duplicate trả `replayed: true`
- [ ] Tất cả 3 QA gate mới PASS trong `sprint-0-release-gate.mjs`
- [ ] Legal Counsel sign-off bằng văn bản trên 16 doc (hoặc DRAFT-LEGAL-PENDING đính kèm, KHÔNG public price/points trước sign-off)
- [ ] `_redirects` cập nhật cho 13 route mới
- [ ] Smoke test pass: `curl https://duongsaotoasang.com/club` trả 200 + có C-002 entity disclosure footer + có câu khoá Star Points trên `/points`

---

## 3. KHÔNG được làm trong Phase 1 (defer Phase 2+)

- Subscription billing — chưa có pay.iai.one contract cho Club, KHÔNG hard-code tier price gọi gateway
- Point purchase — chưa có anti-fraud + chưa có app store posture
- Reward redemption — read-only catalog only
- Creator dashboard — defer Phase 3
- Mobile app — defer Phase 4
- Referral tracking — defer Phase 2 (vì cần clawback logic + payment integration)
- Talk show ticketing — defer Phase 2 (cần payment + capacity lock)
- Creator payout — defer Phase 3 (cần KYC + tax form + bank API)

Nếu PR nào đụng vào item trên Phase 1: REJECT, mở issue riêng.

---

## 4. Hand-off cho dev lead

**Branch khởi tạo:**
```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
git checkout -b layer-3/club-phase1-foundation
```

**Đọc theo thứ tự (KHÔNG skip):**
1. `docs/DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md` — định vị + 3 tier + 7 nguồn revenue + câu khoá pháp lý
2. `docs/DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md` — 45 route + 11 app tab
3. `docs/DSTS_CLUB_DATABASE_AND_API_SPEC_2026.md` — table list + endpoint list (NOTE: outline, không có column type — section 1.2 + 1.3 trong file này là concrete)
4. `docs/DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md` — pricing matrix
5. `docs/DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md` — 16 legal doc + mandatory locks
6. `docs/DSTS_CLUB_CREATOR_PAYOUT_AND_PARTNER_MODEL_2026.md` — defer Phase 3 nhưng đọc để hiểu data shape cho `creators`/`creator_profiles`
7. `docs/DSTS_CLUB_DEV_ROADMAP_2026.md` — 5-phase roadmap + 12 founder approval đã lock

**Reference pattern (Layer 0 đã làm tốt, copy):**
- `functions/api/donate/create.js` — idempotency, validation, gateway call, D1 write, errorJson convention
- `functions/api/donate/webhook.js` — HMAC verify fail-closed pattern
- `functions/_lib/email.js` — canonical helper pattern (`sendAndLogDonationReceipt`)
- `scripts/donate-webhook-behavior-qa.mjs` — behavior testing với Node 19+ crypto.subtle + mock DB

**Commit convention:**
- 1 PR / 1 route group hoặc 1 endpoint group, không monolith
- Title prefix: `feat(club-phase1): …`, `fix(club-phase1): …`, `docs(club): …`
- Mỗi PR phải pass full `node scripts/sprint-0-release-gate.mjs` local trước khi push
- Direct-to-main strategy chỉ áp dụng cho docs; code phải qua PR review

**Báo founder khi:**
- pay.iai.one contract Club đã có (anh Tâm sẽ làm việc với team gateway, dev không cần touch)
- Legal Counsel sign-off đã có
- Phase 1 done → trước khi public, gửi link preview cho founder smoke 24h

---

## 5. Estimate

| Item | Effort |
|---|---|
| D1 migration 0007 + seed data | 4h |
| 6 API endpoint + idempotency + Turnstile | 16h |
| 13 HTML route + JS render | 32h |
| Legal disclosure embed + QA script | 6h |
| Test data + smoke + release gate integration | 8h |
| PR review + fix round + deploy | 12h |
| **Total** | **78h ≈ 2 weeks với 1 dev / 1 week với 2 dev** |

---

## 6. Câu hỏi mở (founder cần quyết trước khi sprint start)

1. Pay.iai.one — tạo contract Club tách biệt (`site=duongsaotoasang-club`) hay reuse `site=duongsaotoasang` với routing nội bộ? Khuyến nghị: **tách biệt** để audit Lane A / Lane B / Club rõ ràng.
2. Star Points purchase trong Phase 2: dùng VND-only hay enable USD via Stripe? Khuyến nghị: **VND-only Y1**, USD defer Y2.
3. Subscription billing model Phase 2: monthly recurring auto-charge hay 30-day prepaid renewal manual? Khuyến nghị: **prepaid renewal** Y1 (đơn giản hơn, không cần card-on-file).
4. Creator KYC Y1: chỉ accept Vietnam-domestic creator hay open quốc tế? Khuyến nghị: **Vietnam-domestic Y1**, quốc tế defer Y2.
5. Reward shop redemption Phase 1: enabled hay catalog-only? Khuyến nghị: **catalog-only Phase 1**, redemption Phase 2.
6. Legal Counsel: anh có firm cụ thể chưa? Nếu chưa → BLOCK public launch.

---

**Hết kickoff prompt. Dev lead nhận file này, đọc 7 source doc trong `docs/`, mở branch, làm theo §2 acceptance criteria.**
