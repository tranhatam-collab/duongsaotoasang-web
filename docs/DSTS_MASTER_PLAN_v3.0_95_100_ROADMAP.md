# DSTS — MASTER PLAN v3.0 (95–100 Roadmap)

> **Founder:** Trần Hà Tâm · **Brand:** Đường Sao Tỏa Sáng (DSTS)
> **Phiên bản:** v3.0 — 2026-06-11
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
