# DSTS — MASTER PLAN v3.0 (95–100 Roadmap)

> **Founder:** Trần Hà Tâm · **Brand:** Đường Sao Tỏa Sáng (DSTS)
> **Phiên bản:** v3.1 — 2026-06-15 (UPDATED: Deploy Live Status)
> **Thay thế:** `MASTER_PLAN_v2.md`, `dsts-master-plan-v1.2-DRAFT.md`
> **Domain chính:** https://duongsaotoasang.com
> **Hệ sinh thái:** IAI.ONE · Người Việt Muôn Nơi · Phương Đông · VIET CAN NEW CORP / VFA
> **Mục tiêu:** Đưa DSTS từ **88/100 → 95–100** bằng cách xây 6 Layer còn thiếu, thay vì thêm landing page.

---

## 0. NGUYÊN TẮC BẤT BIẾN (v3.0 — Kế thừa + Mở rộng)

Giữ nguyên 7 nguyên tắc bất biến DSTS từ v1.2/v2.0, bổ sung 3 nguyên tắc mới cho giai đoạn 95–100:

| # | Nguyên tắc | Bắt nguồn | Áp dụng từ |
|---|---|---|---|
| 1 | Không để trang public hiện "Đang tải…" mãi mãi | v1.0 | Tất cả layer |
| 2 | Không có link gãy trên homepage | v1.0 | Tất cả layer |
| 3 | Không duplicate canonical | v1.0 | Tất cả layer |
| 4 | Không commit credential vào repo | v1.0 | Tất cả layer |
| 5 | Không deploy thẳng lên `main` khi chưa PR review | v1.0 | Tất cả layer |
| 6 | Mọi giá > 1,000 USD phải có Terms + Refund | v1.0 | Tất cả layer |
| 7 | Reviews tĩnh phải có nhãn "Đánh giá minh họa" | v1.0 | Tất cả layer |
| **8** | **Verification không bao giờ là hình thức** | v3.0 mới | Layer 1, 5, 6 |
| **9** | **Không lưu trữ dữ liệu cá nhân nhạy cảm không mã hóa** | v3.0 mới | Layer 2, 5 |
| **10** | **Creator Economy phải minh bạch 100%** | v3.0 mới | Layer 3, 4 |

---

## I. ĐÁNH GIÁ HIỆN TẠI — 88/100 (Baseline v3.0)

Dựa trên audit thực tế repo-side (~92/100) + production (~90/100) + đánh giá chiến lược founder. Con số 88 là **điểm thực chiến** (không phải repo-side lý thuyết).

| Hạng mục | Điểm hiện tại | Trầm trọng | Để lên 95–100 cần |
|---|---|---|---|
| Vision | 95 | Cốt lõi đã đúng | Không cần thêm, chỉ cần enforce |
| Architecture | 92 | Đủ lớn | 6 Layer mới |
| Product | 80 | Nhiều spec, ít chứng minh | 6 Layer mới |
| Legal | 85 | Đã tốt hơn rất nhiều | Sponsor + Verified legal framework |
| Trust | 88 | **Thiếu layer xác thực** | Trust + Verification Layer |
| Monetization | 82 | Chưa có dashboard thật | Creator Economy + Sponsor |
| Community | 90 | Tiềm năng lớn | Global Map + Verification |
| Mobile Strategy | 92 | PWA/app OK | Không cần thêm gốc |
| **TỔNG** | **88/100** | | **+7 đến +12 điểm** |

### Gap cụ thể còn thiếu (đã xác minh qua audit 2026-06-03)

| Gap | Mức độ | Layer khắc phục |
|---|---|---|
| Stripe/PayPal donation flow thật | P1 | Monetization |
| GA4 / Sentry / UptimeRobot | P1 | Ops |
| Entity SEO (Wikidata, LinkedIn, GBP) | P1 | Trust |
| Security audit (pen-test) | P2 | Trust |
| i18n full EN/VI switcher | P2 | Product |
| Performance budget + CLS tối ưu | P2 | Product |

→ Những gap trên **vẫn còn trong backlog Sprint 1–4** của v2.0. Chúng không biến mất, nhưng **không đủ** để lên 95–100. Cần thêm 6 Layer chiến lược.

---

## II. 6 LAYER MỚI — TỪ 88 → 95–100

Đây là **tài sản mạnh nhất còn thiếu** của DSTS. Không phải thêm landing page. Mà là xây **hạ tầng lưu giữ, xác thực và lan tỏa giá trị**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DSTS ECOSYSTEM v3.0                                │
│                        (Creator + Mentor + Legacy)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 6 — Global Vietnamese Map                                            │
│  Bản đồ người Việt thành công: Creator, Mentor, Doanh nhân, Nhà khoa học,   │
│  Người cống hiến — đã xác thực, có vị trí địa lý hoặc domain.               │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 5 — Trust Layer (trust.iai.one integration)                          │
│  Mentor verification · Story verification · Creator verification ·            │
│  Achievement verification — bằng chứng thật, không hình thức.               │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Sponsor Ecosystem                                                │
│  Sponsor Portal · Sponsor Dashboard · Sponsor Impact Reports ·              │
│  Sponsor Campaigns — minh bạch từng đồng.                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Creator Economy Dashboard                                        │
│  Doanh thu · Người theo dõi · Retention · Conversion · Referrals ·            │
│  Talk show performance — creator nhìn thấy giá trị mình tạo ra.             │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2 — Story Preservation Engine (Digital Legacy System)              │
│  Video · Audio · Documents · Photos · Timeline · Family Tree ·                 │
│  Legacy Archive — sống hàng chục năm, không chỉ là content.                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 1 — Verified Identity Layer                                          │
│  Verified Creator · Verified Mentor · Verified Success Story ·               │
│  Verified Sponsor · Verified Contributor — Trust Score + Badge + Evidence.  │
├─────────────────────────────────────────────────────────────────────────────┤
│  FOUNDATION (đã có): Story Library · Mentor Network · Dream Nurture ·       │
│  DSTS Club · PWA · Web · Content · Donate · Legal framework                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## III. LAYER 1 — VERIFIED IDENTITY LAYER

### 1.1. Mục tiêu
Biến DSTS từ "website nội dung" thành **hệ thống danh tính đáng tin cậy** cho người Việt toàn cầu.

### 1.2. Các đối tượng xác thực

| Role | Badge | Evidence Required | Reviewer |
|---|---|---|---|
| Verified Creator | 🌟 Creator | Gov ID + Portfolio + 1 reference | DSTS Trust Team |
| Verified Mentor | 🎓 Mentor | Gov ID + Credential + 2 mentee ref | DSTS Trust Team + Peer |
| Verified Success Story | 📖 Story | Gov ID + Evidence of achievement | DSTS Trust Team |
| Verified Sponsor | 💎 Sponsor | Business reg + Tax ID + 1 past CSR | DSTS Legal |
| Verified Contributor | 🤝 Contributor | Gov ID + Contribution proof | DSTS Trust Team |

### 1.3. Trust Score Algorithm (đơn giản, minh bạch)

```text
Trust Score (0–100) =
  Identity Verification      25 điểm (Gov ID matched)
  + Social Proof             25 điểm (LinkedIn/Website/Press)
  + Activity History         20 điểm (Contribution log trên DSTS)
  + Peer Endorsement         15 điểm (Verified user vouch)
  + Community Standing       15 điểm (No violation report)
```

> **Nguyên tắc 8:** Verification không bao giờ là hình thức. Trust Score dưới 60 = không hiển thị badge.

### 1.4. Evidence Pack
Mỗi verified user có một **Evidence Pack** công khai (tùy chọn) hoặc riêng tư:

- Identity verification date
- Linked verified accounts (LinkedIn, website, IAI.ONE profile)
- Contribution timeline trên DSTS
- Endorsement list (chỉ hiển thị từ verified users)

### 1.5. Data Model (bảng bổ sung)

```sql
-- migrations/0013_verified_identity.sql
CREATE TABLE IF NOT EXISTS verified_identities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  role TEXT CHECK(role IN ('creator','mentor','success_story','sponsor','contributor')),
  trust_score INTEGER DEFAULT 0 CHECK(trust_score BETWEEN 0 AND 100),
  gov_id_verified INTEGER DEFAULT 0,
  gov_id_verified_at TEXT,
  social_proof_score INTEGER DEFAULT 0,
  activity_score INTEGER DEFAULT 0,
  peer_score INTEGER DEFAULT 0,
  standing_score INTEGER DEFAULT 0,
  evidence_pack_json TEXT,
  badge_display_name TEXT,
  verified_at TEXT,
  expires_at TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','revoked','expired')),
  reviewer_notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verified_role ON verified_identities(role);
CREATE INDEX idx_verified_status ON verified_identities(status);
CREATE INDEX idx_verified_score ON verified_identities(trust_score DESC);
```

### 1.6. UI/UX Spec

- **Badge:** Hiển thị cạnh tên trong mọi context (club, talk show, post, mentor card).
- **Hover/Click:** Mở mini-panel hiển thị Trust Score + 5 dimension score + verification date.
- **Evidence Pack:** Link `/verify/{user_id}` — trang công khai với đầy đủ bằng chứng đã ẩn danh hóa phù hợp.
- **Apply Flow:** Form `/apply/verified-creator`, `/apply/verified-mentor` — upload evidence → pending → review → email.

---

## IV. LAYER 2 — STORY PRESERVATION ENGINE (Digital Legacy System)

### 2.1. Mục tiêu
Story Library hiện tại là **content**. Layer 2 biến nó thành **Digital Legacy System** — lưu giữ hàng chục năm.

### 2.2. Thành phần hệ thống

| Component | Mô tả | Format | Storage |
|---|---|---|---|
| Legacy Video | Interview / Talk show / Message to future | MP4, WebM | R2 (Cloudflare) |
| Legacy Audio | Podcast / Audio diary / Oral history | MP3, AAC | R2 |
| Legacy Document | Essay / Letter / Manuscript / Research | PDF, Markdown | R2 + D1 metadata |
| Legacy Photo | Timeline photo / Family album / Event | JPG, WebP, AVIF | R2 |
| Timeline | Interactive life timeline | JSON render | D1 |
| Family Tree | Genealogy (tùy chọn, private) | JSON / GEDCOM | D1 encrypted |
| Legacy Archive | Searchable archive of all above | Indexed | D1 + R2 |

### 2.3. Data Model

```sql
-- migrations/0014_legacy_system.sql
CREATE TABLE IF NOT EXISTS legacy_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id INTEGER NOT NULL,
  item_type TEXT CHECK(item_type IN ('video','audio','document','photo','timeline_event','family_tree_node')),
  title TEXT NOT NULL,
  description TEXT,
  r2_object_key TEXT,
  r2_bucket TEXT,
  mime_type TEXT,
  file_size_bytes INTEGER,
  duration_seconds INTEGER,
  capture_date TEXT,
  location_text TEXT,
  location_lat REAL,
  location_lon REAL,
  privacy_level TEXT DEFAULT 'public' CHECK(privacy_level IN ('public','members','private','family')),
  tags TEXT,
  timeline_year INTEGER,
  timeline_order INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_legacy_owner ON legacy_items(owner_user_id);
CREATE INDEX idx_legacy_type ON legacy_items(item_type);
CREATE INDEX idx_legacy_privacy ON legacy_items(privacy_level);

CREATE TABLE IF NOT EXISTS legacy_search_index (
  item_id INTEGER PRIMARY KEY,
  search_text TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

> **Nguyên tắc 9:** Không lưu trữ dữ liệu cá nhân nhạy cảm không mã hóa. Family tree private phải encrypt trước khi lưu D1.

### 2.4. UI/UX Spec

- **Story Library (/posts) mở rộng:** Thêm filter `type=legacy` + tab `Digital Legacy`.
- **Legacy Player:** Custom video/audio player với chapters, transcript toggle, download (nếu owner cho phép).
- **Timeline View:** Component dọc, scrollable, zoomable theo năm/thập kỷ.
- **Family Tree:** Private, chỉ owner và invited family members. Không public.
- **Archive Search:** Full-text search across title + description + auto-transcript (nếu có).

---

## V. LAYER 3 — CREATOR ECONOMY DASHBOARD

### 3.1. Mục tiêu
Creator nhìn thấy **giá trị thật** mình tạo ra trên DSTS. Không chỉ là số điểm.

### 3.2. Metrics hiển thị

| Metric | Định nghĩa | Nguồn |
|---|---|---|
| Doanh thu (Revenue) | Tổng net revenue từ membership + talk show + tips | D1 subscriptions, payouts |
| Người theo dõi (Followers) | Số member theo dõi creator | D1 club_memberships |
| Retention Rate | % member renew gói sau tháng đầu | D1 subscription_logs |
| Conversion Rate | % visitor → member | D1 analytics_events |
| Referrals | Số member được giới thiệu bởi creator | D1 referrals |
| Talk Show Performance | Views, engagement, revenue per talk show | D1 talk_shows |
| Creator Contribution Points | Điểm đóng góp (tích hợp từ spec Club 02/03) | D1 creator_points |
| Star Points Balance | Điểm hiện có (không phải tiền) | D1 wallets |

### 3.3. Dashboard Layout

```text
┌──────────────────────────────────────────────┐
│  Creator Dashboard — {Creator Name} 🌟      │
├──────────┬──────────┬──────────┬─────────────┤
│ Revenue  │ Followers│ Retention│ Conversion  │
│ $X,XXX   │ 1,234    │ 67%      │ 4.2%        │
├──────────┴──────────┴──────────┴─────────────┤
│  [Chart: Revenue 30d]  [Chart: Retention 90d]│
├──────────────────────────────────────────────┤
│  Talk Show Performance Table                 │
│  ┌────────────┬───────┬────────┬────────────┐│
│  │ Talk Show  │ Views │ Tips   │ Net Revenue││
│  ├────────────┼───────┼────────┼────────────┤│
│  │ ...        │ ...   │ ...    │ ...        ││
│  └────────────┴───────┴────────┴────────────┘│
├──────────────────────────────────────────────┤
│  Referral Leaderboard (this month)           │
│  Payout History | Next Payout Date | Tax Docs  │
└──────────────────────────────────────────────┘
```

### 3.4. Data Model (bổ sung view/table)

```sql
-- migrations/0015_creator_analytics.sql
CREATE TABLE IF NOT EXISTS creator_analytics_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  revenue_net_cents INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  churned_members INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  talk_show_views INTEGER DEFAULT 0,
  talk_show_tips_cents INTEGER DEFAULT 0,
  referral_signups INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(creator_user_id, date)
);

CREATE INDEX idx_analytics_creator_date ON creator_analytics_daily(creator_user_id, date DESC);
```

> **Nguyên tắc 10:** Creator Economy phải minh bạch 100%. Mọi số liệu phải có tooltip giải thích cách tính.

---

## VI. LAYER 4 — SPONSOR ECOSYSTEM

### 4.1. Mục tiêu
Biến Sponsor từ "ý tưởng" thành **hệ thống portal + dashboard + báo cáo**.

### 4.2. Các thành phần

| Component | Mô tả | URL Pattern |
|---|---|---|
| Sponsor Portal | Đăng ký, đăng nhập, quản lý profile | `/sponsor/portal` |
| Sponsor Dashboard | Tổng quan chiến dịch, budget, ROI | `/sponsor/dashboard` |
| Campaign Manager | Tạo/chỉnh sửa chiến dịch tài trợ | `/sponsor/campaigns` |
| Impact Reports | Báo cáo tác động | `/sponsor/reports/{id}` |
| Public Sponsor Wall | Danh sách sponsor đã xác thực, công khai | `/sponsors` |

### 4.3. Campaign Types

| Type | Mô tả | Min Budget |
|---|---|---|
| Story Grant | Tài trợ cho một Success Story được ghi lại | 500 USD |
| Mentor Stipend | Tài trợ lương/thù lao cho Mentor Network | 1,000 USD/quý |
| Event Sponsorship | Tài trợ sự kiện DSTS (talk show, workshop) | 2,000 USD |
| Dream Nurture Fund | Tài trợ học bổng/cơ hội cho Dream Nurture | 5,000 USD |
| Infrastructure | Tài trợ vận hành hạ tầng DSTS | Tùy thương lượng |

### 4.4. Data Model

```sql
-- migrations/0016_sponsor_system.sql
CREATE TABLE IF NOT EXISTS sponsors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  org_name TEXT NOT NULL,
  org_type TEXT CHECK(org_type IN ('corporate','foundation','individual','government')),
  tax_id TEXT,
  business_reg_doc_url TEXT,
  verified_identity_id INTEGER,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','active','suspended')),
  total_contributed_cents INTEGER DEFAULT 0,
  public_profile_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sponsor_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sponsor_id INTEGER NOT NULL,
  campaign_type TEXT CHECK(campaign_type IN ('story_grant','mentor_stipend','event_sponsorship','dream_nurture','infrastructure')),
  title TEXT NOT NULL,
  description TEXT,
  budget_cents INTEGER NOT NULL,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft','active','completed','cancelled')),
  impact_report_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sponsor_status ON sponsors(status);
CREATE INDEX idx_campaign_sponsor ON sponsor_campaigns(sponsor_id);
```

### 4.5. Impact Report Template

Mỗi campaign kết thúc phải có báo cáo tác động:

```json
{
  "campaign_id": 123,
  "people_reached": 15000,
  "stories_funded": 3,
  "mentors_supported": 2,
  "events_funded": 1,
  "students_supported": 10,
  "media_mentions": 2,
  "roi_score": 85
}
```

---

## VII. LAYER 5 — TRUST LAYER (trust.iai.one integration)

### 5.1. Mục tiêu
Tích hợp `trust.iai.one` làm **nền tảng xác minh độc lập** cho DSTS. Đây là thứ làm DSTS khác biệt.

### 5.2. Scope tích hợp

| Verified Object | trust.iai.one Role | DSTS Integration |
|---|---|---|
| Mentor | Verify credential + background check | API sync → DSTS Verified Mentor badge |
| Success Story | Verify achievement claim | API sync → DSTS Verified Story badge |
| Creator | Verify identity + social presence | API sync → DSTS Verified Creator badge |
| Sponsor | Verify business + tax standing | API sync → DSTS Verified Sponsor badge |
| Achievement | Verify award, degree, publication | Standalone on DSTS, reference trust.iai.one |

### 5.3. API Contract (tích hợp)

```
POST https://trust.iai.one/api/v1/verify
Headers:
  Authorization: Bearer {DSTS_TRUST_API_KEY}
  Content-Type: application/json

Body:
{
  "entity_type": "mentor|creator|story|sponsor|achievement",
  "entity_id": "dsts-{internal_id}",
  "evidence_urls": ["https://duongsaotoasang.com/evidence/..."],
  "callback_url": "https://duongsaotoasang.com/webhooks/trust-iai"
}

Response:
{
  "verification_id": "iai-v-12345",
  "status": "pending|approved|rejected",
  "trust_score": 78,
  "verified_at": "2026-06-11T10:00:00Z",
  "expires_at": "2027-06-11T10:00:00Z",
  "report_url": "https://trust.iai.one/report/iai-v-12345"
}
```

### 5.4. Webhook Handler (DSTS side)

```javascript
// functions/webhooks/trust-iai.js
export async function onRequestPost(context) {
  const { verification_id, status, trust_score, entity_id } = await context.request.json();
  // Map entity_id -> DSTS user/story/sponsor
  // Update verified_identities.trust_score, status, expires_at
  // Notify user via email
  return new Response('OK', { status: 200 });
}
```

### 5.5. UI Spec

- Mọi trang profile hiển thị `trust.iai.one` verified seal nếu có.
- Link "Xem báo cáo xác minh" dẫn về `trust.iai.one` report URL.
- Nếu verification expired, hiển thị cảnh báo vàng + CTA renew.

---

## VIII. LAYER 6 — GLOBAL VIETNAMESE MAP

### 6.1. Mục tiêu
Tạo **lợi thế cạnh tranh lớn**: một bản đồ tương tác toàn cầu của người Việt thành công đã xác thực.

### 6.2. Entity Types trên Map

| Type | Icon | Verified Requirement |
|---|---|---|
| Creator | 🌟 | Verified Creator |
| Mentor | 🎓 | Verified Mentor |
| Doanh nhân | 🏢 | Verified Sponsor OR Business proof |
| Nhà khoa học | 🔬 | Academic credential verified |
| Người cống hiến | 🌱 | Contribution proof + peer endorsement |
| Cộng đồng | 🏠 | Community org verified |

### 6.3. Map Features

| Feature | Mô tả |
|---|---|
| Filter | Theo type, country, city, industry, trust score |
| Search | Tên, tổ chức, thành tựu |
| Profile Card | Click marker → card với avatar, badge, 1-line bio, link profile |
| Clustering | Nhiều người ở cùng city → cluster, zoom in → tách |
| Timeline Layer | Hiển thị migration/achievement theo thời gian |
| Contribution Heatmap | Mật độ người Việt có đóng góp theo region |

### 6.4. Tech Stack

- **Frontend:** Mapbox GL JS hoặc Leaflet (tuỳ budget)
- **Tile server:** Cloudflare Pages (static vector tiles) hoặc Mapbox
- **Data:** D1 `verified_identities` + `legacy_items` (nếu có location)
- **API:** `/api/map/entities?type=creator&country=US&limit=100`
- **Privacy:** Location là city-level, không exact home address trừ khi user opt-in.

### 6.5. Data Model (bổ sung location)

```sql
-- migrations/0017_global_map.sql
ALTER TABLE verified_identities ADD COLUMN display_location TEXT;
ALTER TABLE verified_identities ADD COLUMN display_lat REAL;
ALTER TABLE verified_identities ADD COLUMN display_lon REAL;
ALTER TABLE verified_identities ADD COLUMN map_visible INTEGER DEFAULT 1;

CREATE INDEX idx_map_location ON verified_identities(display_lat, display_lon, role, map_visible, status);
```

---

## IX. INTEGRATION — 6 LAYER VỚI HỆ THỐNG HIỆN TẠI

### 9.1. Kiến trúc tổng thể mở rộng

```text
duongsaotoasang.com (đã có)
  ├─ / (homepage)
  ├─ /about, /program, /contact, /donate, /terms, /privacy, /refund
  ├─ /posts, /content, /scripts, /events, /talkshows
  ├─ /club/* (Club public pages)
  ├─ /account/* (Account settings)
  ├─ /creator/* (Creator dashboard — MỞ RỘNG Layer 3)
  ├─ /admin/* (Admin panel)
  ├─ /app/* (PWA mobile app)
  │
  ├─ [NEW] /verify/* (Layer 1 — Verified Identity apply + profile)
  ├─ [NEW] /legacy/* (Layer 2 — Digital Legacy timeline + archive)
  ├─ [NEW] /sponsor/* (Layer 4 — Sponsor portal + dashboard)
  ├─ [NEW] /sponsors (Layer 4 — Public sponsor wall)
  ├─ [NEW] /map (Layer 6 — Global Vietnamese Map)
  └─ [NEW] /trust (Layer 5 — Trust.iai.one landing + status)

API (đã có + mở rộng)
  ├─ /api/content, /api/contents, /api/search
  ├─ /api/club/*, /api/wallet/*, /api/referrals/*
  ├─ [NEW] /api/verify/* (Layer 1 — Trust Score, Evidence Pack)
  ├─ [NEW] /api/legacy/* (Layer 2 — Archive, upload, timeline)
  ├─ [NEW] /api/analytics/* (Layer 3 — Creator dashboard data)
  ├─ [NEW] /api/sponsor/* (Layer 4 — Campaign, impact report)
  ├─ [NEW] /api/map/* (Layer 6 — Geo entity query)
  └─ [NEW] /webhooks/trust-iai (Layer 5 — trust.iai.one callback)
```

### 9.2. Auth & Permission Matrix

| Route/Layer | Public | Member | Creator | Mentor | Sponsor | Admin |
|---|---|---|---|---|---|---|
| /map, /sponsors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /verify/{id} (public profile) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /legacy/{id} (public items) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /creator/dashboard (Layer 3) | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| /sponsor/portal (Layer 4) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| /apply/verified-* (Layer 1) | ✅ form | ✅ | ✅ | ✅ | ✅ | ✅ |
| /admin/verify-review | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| /admin/sponsor-review | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| /api/verify/{id} (public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /api/analytics/{id} (own) | ❌ | ❌ | ✅ own | ❌ | ❌ | ✅ |
| /api/sponsor/* (own) | ❌ | ❌ | ❌ | ❌ | ✅ own | ✅ |
| /api/map/* | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /api/legacy/* (public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /api/legacy/upload | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |

---

## X. ROADMAP 4 PHASE — 88 → 95–100

### Phase A — FOUNDATION (Tuần 1–4): Layer 1 + Layer 2 schema
**Mục tiêu điểm:** 88 → 91

| Ticket | Layer | Việc | Owner | DoD |
|---|---|---|---|---|
| A1 | L1 | Migration `0013_verified_identity.sql` + API `/api/verify/*` | Backend | Smoke test 200 |
| A2 | L1 | Badge component + public profile page `/verify/{id}` | Frontend | Visual QA |
| A3 | L1 | Apply forms: `/apply/verified-creator`, `/apply/verified-mentor` | Frontend | Form submit → D1 |
| A4 | L1 | Admin review panel `/admin/verify-review` | Admin | Approve/revoke flow |
| A5 | L2 | Migration `0014_legacy_system.sql` + R2 bucket setup | Backend | R2 upload test PASS |
| A6 | L2 | Legacy player UI + timeline component | Frontend | Video playback, scroll timeline |
| A7 | L2 | Family tree encryption spec + private view | Backend | Encrypt before D1 insert |
| A8 | Gap | Stripe/PayPal donation flow thật | Payment | E2E test 1 USD |
| A9 | Gap | GA4 + Sentry + UptimeRobot | Ops | Dashboard live |

### Phase B — ECONOMY (Tuần 5–8): Layer 3 + Layer 4
**Mục tiêu điểm:** 91 → 95

| Ticket | Layer | Việc | Owner | DoD |
|---|---|---|---|---|
| B1 | L3 | Migration `0015_creator_analytics.sql` + daily rollup job | Backend | Data đúng 7 ngày |
| B2 | L3 | Creator Dashboard UI `/creator/dashboard` | Frontend | 8 metrics render |
| B3 | L3 | Talk show performance table + charts | Frontend | Chart.js/any chart lib |
| B4 | L4 | Migration `0016_sponsor_system.sql` | Backend | Smoke test |
| B5 | L4 | Sponsor Portal UI `/sponsor/portal` | Frontend | Registration form |
| B6 | L4 | Sponsor Dashboard `/sponsor/dashboard` | Frontend | Campaign list, budget |
| B7 | L4 | Public Sponsor Wall `/sponsors` | Frontend | Grid + filter |
| B8 | L4 | Impact Report template + auto-generate | Backend | JSON output đúng schema |
| B9 | Gap | Entity SEO: Wikidata, LinkedIn, GBP | SEO | Entity live + sameAs |
| B10 | Gap | i18n full EN/VI switcher | Frontend | 80% UI bilingual |

### Phase C — TRUST (Tuần 9–12): Layer 5 + Layer 6
**Mục tiêu điểm:** 95 → 98

| Ticket | Layer | Việc | Owner | DoD |
|---|---|---|---|---|
| C1 | L5 | trust.iai.one API integration | Backend | Webhook receive → D1 update |
| C2 | L5 | Verified seal UI trên mọi profile | Frontend | Seal render + link report |
| C3 | L5 | Expired verification alert + renew CTA | Frontend | Alert banner |
| C4 | L6 | Migration `0017_global_map.sql` | Backend | Geo index query < 200ms |
| C5 | L6 | Map frontend `/map` | Frontend | Mapbox/Leaflet render |
| C6 | L6 | Marker clustering + profile card | Frontend | Cluster + card popup |
| C7 | L6 | Filter sidebar (type, country, trust score) | Frontend | URL state sync |
| C8 | Gap | Security audit (pen-test) | Security | Report PASS |
| C9 | Gap | Performance budget + CLS tối ưu | Frontend | Lighthouse > 90 |

### Phase D — LOCK (Tuần 13–16): Polish + Ops + Legal final
**Mục tiêu điểm:** 98 → 100

| Ticket | Layer | Việc | Owner | DoD |
|---|---|---|---|---|
| D1 | All | Legal final sign-off: Verified Identity Policy, Sponsor Terms, Legacy Privacy | Legal | Founder ký |
| D2 | All | Backup + DR test weekly | Ops | GH Actions cron |
| D3 | All | WPAS/Brandpro adoption: 12-step deploy, Brand Guardian appoint | Ops | Release report mẫu |
| D4 | All | Trademark filing (VN + US) | Legal | Mã đơn |
| D5 | All | Defensive domains + monitoring | Ops | Domain owned, monitor live |
| D6 | All | Final Lighthouse audit: 4 trục > 90 | QA | Report |
| D7 | All | Accessibility audit WCAG 2.1 AA | QA | axe DevTools PASS |
| D8 | All | Pen-test + CSP hardening | Security | Report PASS |

---

## XI. CHECKLIST DEFINITION OF DONE (DoD)

### DoD Phase A (Foundation)
- [ ] Migration `0013` + `0014` chạy clean trên D1 staging
- [ ] `/api/verify/*` smoke test 200
- [ ] `/verify/{id}` badge render đúng 5 role
- [ ] `/apply/verified-*` form submit → D1 pending
- [ ] `/admin/verify-review` approve → status approved
- [ ] R2 upload test: video 10MB, audio 5MB, photo 2MB
- [ ] Legacy player: video playback + transcript toggle
- [ ] Stripe/PayPal: E2E 1 USD test PASS
- [ ] GA4 event tracking trên CTA chính
- [ ] Sentry error logging nhận được test error

### DoD Phase B (Economy)
- [ ] Creator Dashboard render 8 metrics với real data
- [ ] Talk show performance chart render 30d data
- [ ] Sponsor Portal registration → D1
- [ ] Sponsor Dashboard hiển thị campaign + budget
- [ ] `/sponsors` public wall: grid + filter + 3 campaign types
- [ ] Impact Report auto-generate JSON đúng schema
- [ ] Entity SEO: Wikidata item created, LinkedIn company page live
- [ ] i18n switcher hoạt động trên 80% UI

### DoD Phase C (Trust)
- [ ] trust.iai.one webhook: verification approved → DSTS badge update
- [ ] Verified seal hiển thị trên mọi profile card
- [ ] Expired verification: alert + renew CTA
- [ ] `/map` render với > 50 verified entities
- [ ] Map filter: type, country, trust score hoạt động
- [ ] Clustering: zoom out → cluster, zoom in → tách
- [ ] Security pen-test report: no critical
- [ ] Lighthouse: 4 trục > 90

### DoD Phase D (Lock)
- [ ] Legal docs ký bởi Founder
- [ ] Backup/DR test: restore từ backup < 30 phút
- [ ] WPAS 12-step applied cho deploy cuối
- [ ] Trademark application submitted
- [ ] Defensive domains owned
- [ ] Lighthouse final > 90
- [ ] Accessibility WCAG 2.1 AA PASS
- [ ] Pen-test PASS

---

## XII. EVIDENCE INVENTORY

| File / Evidence | Loại | Trạng thái | Độ tin cậy |
|---|---|---|---|
| `docs/AUDIT_BAO_CAO_CHI_TIET_THEO_TONG_KE_HOACH_2026-06-03.md` | Audit | Text report | Medium |
| `docs/STATE_REPORT_2026-05-12.md` | State | curl + view-source | High |
| `docs/STATE_REPORT_2026-05-14.md` | State | curl + view-source | High |
| `docs/STATE_REPORT_2026-05-15.md` | State | curl + view-source | High |
| `docs/MASTER_PLAN_v2.md` | Plan | Text spec | Medium |
| `docs/dsts-master-plan-v1.2-DRAFT.md` | Plan | Text spec | Medium |
| `RUNBOOK.md` | Ops | Procedure | High |
| `tests/sprint-0-smoke-test-pass.log` | Test | Command output | High |
| `docs/DSTS_CLUB_PWA_MASTER_HANDOFF_INDEX_2026.md` | Product spec | Handoff | High |
| `_redirects` | Config | File static | High |
| `migrations/*.sql` | Schema | SQL file | High |
| Cloudflare Pages deploy log | Deploy | Wrangler output | High |
| `DSTS_MASTER_PLAN_v3.0_95_100_ROADMAP.md` | **This file** | Plan v3.0 | — |

---

## XIII. KẾT LUẬN

**Điểm tổng thể hiện tại: 88/100**
**Mục tiêu: 95–100 trong 16 tuần (4 Phase)**

DSTS đã có **nền tảng mạnh**: Story Library, Mentor Network, Dream Nurture, Club, PWA, Content, Legal framework. Nhưng để lên 95–100, **không cần thêm landing page nữa**. Mà cần xây **6 Layer chiến lược**:

1. **Verified Identity** — biến DSTS thành hệ thống danh tính đáng tin cậy
2. **Digital Legacy** — lưu giữ hàng chục năm, không chỉ content
3. **Creator Economy Dashboard** — minh bạch 100% giá trị creator tạo ra
4. **Sponsor Ecosystem** — minh bạch từng đồng tài trợ
5. **Trust Layer** — tích hợp trust.iai.one, điều làm DSTS khác biệt
6. **Global Vietnamese Map** — lợi thế cạnh tranh toàn cầu

**Nguyên tắc khóa cứng:**
- Verification không bao giờ là hình thức
- Không lưu trữ dữ liệu cá nhân nhạy cảm không mã hóa
- Creator Economy minh bạch 100%

**Hành động khẩn cấp (72 giờ):**
1. Founder duyệt Master Plan v3.0 này
2. Assign Owner cho từng Phase (Backend, Frontend, Legal, Ops)
3. Tạo ticket Phase A-1 đến A-9
4. Setup R2 bucket + trust.iai.one API key (nếu có)

**Muốn lên 95/100:** Hoàn thành Phase A + B (8 tuần).
**Muốn lên 100/100:** Hoàn thành Phase A + B + C + D (16 tuần).

---

## XIII. DEPLOY LIVE STATUS UPDATE (2026-06-15)

### 13.1. Kết luận
Website đã được khôi phục và deploy live thành công. Tuy nhiên, chưa thể tuyên bố toàn bộ repo đạt 100% QA.

### 13.2. Đã hoàn thành

- **Custom domain:** [duongsaotoasang.com](https://duongsaotoasang.com)
  - Cloudflare Pages API: `active / active / active`
- **Project đúng:** `duongsaotoasang-com-v2`
- **Account đúng:** `62d57eaa548617aeecac766e5a1cb98e`
- **Deployment:** [cf0905e7.pages.dev](https://cf0905e7.duongsaotoasang-com-v2-dd2.pages.dev)
- **Full smoke test trên Pages:** **PASS**
- **12 route production trọng yếu đều trả `200`**, gồm `/posts`, `/content`, `/about`, `/program`, `/donate`, `/transparency`, `/scripts`, `/api/search`, sitemap và robots.
- **HTTPS homepage trả `200`**, HSTS và security headers hoạt động.
- **Khôi phục 49 Cloudflare Pages Functions** đã bị commit trước xóa nhầm.
- **Functions syntax:** `49/49 PASS`
- **Webhook behavior:** `6 tests / 18 assertions PASS`
- **Commit đã push:** `3f3fda2 fix(deploy): restore Pages Functions for public routes`
- **`main` đã đồng bộ `origin/main`**

### 13.3. Nguyên nhân gốc đã xử lý

1. Project Pages đúng chưa tồn tại trong account.
2. Commit `8a83f4f` xóa toàn bộ `functions/`, làm hỏng API và route động.
3. Local có cấu hình D1 sai, database không tồn tại.
4. Một số file bị iCloud/File Provider để ở trạng thái chưa tải, khiến deploy treo.
5. Deploy trực tiếp cả workspace chứa nhiều file nội bộ; đã chuyển sang runtime artifact sạch.

### 13.4. Hạng mục còn mở

1. **Cache rule custom domain**

   Asset đúng checksum nhưng zone rule đang ép:

   ```text
   Cache-Control: public, max-age=14400
   ```

   Trong khi cấu hình Pages yêu cầu tối đa 300 giây. Website vẫn hoạt động, nhưng `HEADERS_QA` chưa đạt.

   File `~/.dsts-secrets/cf-zone-id` hiện chứa nhầm token 53 ký tự. Zone ID thật là:

   ```text
   551f3742f1ab3f8babd106ffa1abde8c
   ```

   Token Wrangler không có quyền `Zone → Cache Purge → Edit`, nên không thể purge bằng API hiện tại.

2. **Strict QA toàn repo chưa đạt**

   Nhiều trang mới thuộc Club/Admin/Creator/English còn thiếu:

   - Nội dung tối thiểu
   - Meta description, canonical, robots
   - OG/Twitter metadata
   - JSON-LD
   - Cấu trúc accessibility
   - Route `club.html`

3. **`/dream-nurture` thiếu robots/OG metadata** và câu disclosure bắt buộc.

4. **`robots.txt` thực tế cho phép public site**; gate đang hiểu nhầm các `Disallow` dành riêng cho AI crawlers.

5. **Payment gateway trước đó trả `403 API_KEY_INVALID`**. Donation đang "TẠM ĐÓNG", chưa phải lỗi deploy website.

6. **D1 chưa bind** vì account không có database DSTS hợp lệ và đã chạm giới hạn database.

7. **Các HTML đang chỉnh dở vẫn giữ nguyên trong working tree**, không bị stage hoặc ghi đè.

### 13.5. Đánh giá cuối
Deploy live và public core đã phục hồi. Phần Club/Admin/English và cache policy vẫn cần một sprint QA riêng trước khi công bố "toàn bộ dự án hoàn tất".

---

**Báo cáo này dựa trên audit thực tế repo-side và production đến 2026-06-15.**
**Mọi claim về "đã có" đều có bằng chứng trong repo hoặc production.**
**Mọi claim về "cần xây" đều là spec chưa implement.**
