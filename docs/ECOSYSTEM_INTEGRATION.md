# DSTS ↔ MUÔN NƠI — ECOSYSTEM INTEGRATION SPEC

> **Mục đích:** Chi tiết kỹ thuật + brand cho 6 điểm tích hợp giữa DSTS (`duongsaotoasang.com`) và hệ Muôn Nơi (`muonnoi.org` + 14 sub-module).
> **Tham chiếu:** PRODUCT_STRATEGY_v1.md Mục VI · NVMN Master Plan · Muôn Nơi v2.0 Brand
> **Đối tác kỹ thuật cần ký MOU:** Founder + muonnoi.org tech team
> **Status:** DRAFT v1.0 — chờ Founder + Muôn Nơi tech lead duyệt

---

## I. HIỆN TRẠNG HỆ MUÔN NƠI (2026-05-12)

Live trên Cloudflare Pages (kiểm chứng curl):

| Module | URL | Status | Vai trò |
|---|---|---|---|
| Trung tâm | muonnoi.org | ✅ 200 | Hạ tầng số cho đời sống thật |
| Work quest | lamviec.muonnoi.org | ✅ 200 | Hành trình làm việc |
| Travel quest | dulich.muonnoi.org | ⚠️ chưa live | Du lịch thật (kế hoạch) |
| Learning quest | hoctap.muonnoi.org | ⚠️ chưa live | Học tập (kế hoạch) |
| Community quest | congdong.muonnoi.org | ⚠️ chưa live | Cộng đồng (kế hoạch) |
| Vietnamese Global | nguoiviet.muonnoi.org | ⚠️ đang dev | Đang chuyển từ Wix sang CF Pages |
| App / Social | app.muonnoi.org | ⚠️ chưa live | Social core (tương lai SSO) |
| AI | ai.muonnoi.org | ⚠️ chưa live | AI workflow |
| Docs | docs.muonnoi.org | ⚠️ chưa live | Vận hành |
| API | api.muonnoi.org | ⚠️ chưa live | Payment + auth + email |

→ Muôn Nơi đang **giai đoạn build**. DSTS có thể đi song song + hoặc đi trước, không chờ.

---

## II. SÁU ĐIỂM TÍCH HỢP — CHI TIẾT KỸ THUẬT

### TÍCH HỢP 1 — CROSS-LINK + UTM TRACKING (P0, sẵn sàng triển khai ngay)

**Mục tiêu:** Đo lường flow giữa hai nhánh, không phụ thuộc tech của bên kia.

**Triển khai (DSTS phía):**

1. Footer DSTS thêm block ecosystem map:

```html
<div class="footer-ecosystem">
  <p class="footer-eyebrow">Một nhánh hành trình của hệ Muôn Nơi</p>
  <nav class="footer-eco-links">
    <a href="https://muonnoi.org/?utm_source=dsts&utm_medium=footer&utm_campaign=ecosystem">muonnoi.org</a>
    <a href="https://nguoiviet.muonnoi.org/?utm_source=dsts&utm_medium=footer&utm_campaign=ecosystem">nguoiviet.muonnoi.org</a>
    <a href="https://lamviec.muonnoi.org/?utm_source=dsts&utm_medium=footer&utm_campaign=ecosystem">lamviec.muonnoi.org</a>
    <!-- thêm khi live: dulich, hoctap, congdong, app, ai -->
  </nav>
</div>
```

2. Mọi CTA "Khám phá tiếp" trong content có UTM:

```html
<a class="btn" href="https://nguoiviet.muonnoi.org/journeys/?utm_source=dsts&utm_medium=cta&utm_campaign=bridge-to-muonnoi">
  Xem hành trình ở Người Việt Muôn Nơi
</a>
```

3. Track ở GA4 DSTS: tạo Custom Dimension `referral_destination` để biết trang nào trên DSTS dẫn traffic ra Muôn Nơi nhiều nhất.

**Triển khai (Muôn Nơi phía — đề xuất):**

Footer Muôn Nơi nếu OK có thể thêm link tới DSTS với UTM ngược lại:

```html
<a href="https://duongsaotoasang.com/?utm_source=muonnoi&utm_medium=footer&utm_campaign=partner-link">
  Đường Sao Tỏa Sáng — Hành trình tỏa sáng của người Việt toàn cầu
</a>
```

**DoD:**
- [ ] Footer DSTS có ecosystem map + UTM
- [ ] GA4 DSTS track destination
- [ ] Báo cáo monthly chia sẻ giữa hai team

**Effort:** 2h dev · Sprint 1.

---

### TÍCH HỢP 2 — BRIDGE PAGES (P1, Sprint 2-3)

**Mục tiêu:** Người dùng có thể chuyển dịch giữa hai nhánh **mượt mà**, có context carry over.

**Hai trang bridge cần xây:**

#### Bridge DSTS → NVMN: `/bridge-to-muonnoi`

```
Tiêu đề: "Cần quay trở về với chính mình?"

Mô tả:
"Có lúc, một người Việt đã tỏa sáng cũng cần một khoảng lặng để nhìn rõ
mình đang đứng vững ở đâu, mắc kẹt ở điều gì, còn lại điều gì khi không
còn sân khấu. Đó là lúc nhánh Người Việt Muôn Nơi mở cửa."

Card 1: "Hành trình Đà Lạt Pilot" (link tới /journeys/dalat ở NVMN)
Card 2: "Tuyên ngôn Người Việt Muôn Nơi" (link tới /manifesto)
Card 3: "Bắt đầu intake" (link tới /start với context DSTS carry over)

CTA chính: "Chuyển sang Người Việt Muôn Nơi"
URL: https://nguoiviet.muonnoi.org/start/?from=dsts&archetype=<user-archetype>&star-mark-count=<n>

Note: Khi user click, DSTS gửi POST async tới muonnoi API (nếu có) để
notify "user X đang chuyển sang", giúp NVMN intake biết context.
```

#### Bridge NVMN → DSTS: `/bridge-from-muonnoi` (DSTS sẽ host)

```
Tiêu đề: "Sẵn sàng tỏa sáng ra ngoài?"

Mô tả:
"Sau khi đã quay trở về với chính mình ở NVMN, có người Việt muốn bước
ra để tỏa sáng — như một nghệ sĩ, doanh nhân, lãnh đạo hay người tư tưởng.
DSTS đồng hành với hành trình đó, có cấu trúc, có bằng chứng, không lời hứa."

Card 1: "Bài kiểm 9 archetype (3 phút)" → /quiz
Card 2: "Câu chuyện ngôi sao Việt thật" → /posts
Card 3: "Script Journey 1:1" → /scripts

URL nhận từ NVMN: https://duongsaotoasang.com/bridge-from-muonnoi?from=nvmn&receipts=<n>&stage=<current-stage>
```

**Carry-over context (qua URL parameter):**

| Param | Mô tả | Ai gửi |
|---|---|---|
| `from` | "dsts" hoặc "nvmn" | Trang gốc |
| `archetype` | DSTS archetype (rising-entrepreneur...) | DSTS |
| `star-mark-count` | Số Star Mark đã có | DSTS |
| `receipts` | Số Receipt NVMN đã có | NVMN |
| `stage` | Giai đoạn NVMN (1-7) | NVMN |
| `consent` | "share-profile" (chỉ khi user opt-in) | Cả hai |

**Privacy:**
- Chỉ chuyển dữ liệu **không nhạy cảm** qua URL (không email, không tên)
- User phải opt-in tại bridge page với checkbox "Cho phép gửi context của tôi sang [bên kia]"
- Compliant GDPR + Vietnam data privacy

**DoD:**
- [ ] 2 bridge page live, mỗi trang ≥ 400 từ nội dung thật
- [ ] Carry-over working (test E2E)
- [ ] Privacy consent checkbox bắt buộc tick

**Effort:** 1 ngày dev + 0.5 ngày content.

---

### TÍCH HỢP 3 — RECEIPT SCHEMA CHUNG (P1, Sprint 3-4)

**Mục tiêu:** Star Mark (DSTS) và Receipt (NVMN) cùng schema base, dễ sync sau này.

#### Schema chuẩn (đề xuất, song phương ký)

```typescript
// shared/types/credibility-mark.ts
interface CredibilityMark {
  // Base fields (shared)
  id: string;                    // ulid hoặc uuid v4
  type: "star-mark" | "receipt"; // DSTS = star-mark, NVMN = receipt
  source: "dsts" | "nvmn";
  user_id: string;               // user id cùng namespace (xem Tích hợp 4)
  title: string;                 // ≤ 200 ký tự, sự thật về một bước cụ thể
  date: string;                  // ISO 8601, ngày bước đó xảy ra (không phải ngày ghi)
  evidence: Array<{
    type: "url" | "file" | "witness";
    value: string;
    description?: string;
  }>;
  verified_by: {
    role: "founder" | "local-host" | "star-council" | "self-attested";
    name: string;
    org: "dsts" | "nvmn" | "muonnoi";
  };
  verified_at: string;           // ISO 8601, ngày verify
  visibility: "public" | "private" | "shared-ecosystem";
  ecosystem_share: boolean;      // user opt-in cho phép hiện trên hệ chung

  // DSTS-specific
  archetype?: "rising-entrepreneur" | "global-artist" | "singing-icon"
            | "cinematic-actor" | "the-thinker" | "creative-leader"
            | "cultural-ambassador" | "dsts-legacy" | "global-story";
  milestone_type?: string;       // first-pitch, first-album, first-show...
  impact_metric?: {              // optional, có thể null
    views?: number;
    audience?: number;
    revenue_usd?: number;
    media_coverage?: string[];
  };

  // NVMN-specific
  stage?: 1 | 2 | 3 | 4 | 5 | 6 | 7;  // theo 7-stage journey model
  location?: string;             // "Đà Lạt, VN" — môi trường thật
  duration_days?: number;
  local_host_id?: string;

  // Cross-link (nếu có)
  linked_to?: string;            // id của mark khác (DSTS user ref NVMN receipt or vice versa)
}
```

#### Storage

- **DSTS:** lưu vào D1 `cf-d1-dsts-content-prod` table `star_marks`
- **NVMN:** lưu vào D1 NVMN riêng table `receipts`
- **Shared view:** `quests.muonnoi.org` (khi live) có query API lấy cả 2 cho user profile

#### Sync rule

1. **No automatic sync.** User phải opt-in cho từng mark riêng (`ecosystem_share: true`).
2. **One-way visibility:** chỉ hiển thị cross-platform, KHÔNG copy data. Mỗi side giữ data của mình.
3. **API contract** (đề xuất):
   - DSTS expose: `GET https://api.duongsaotoasang.com/v1/star-marks?user_id=...&ecosystem=true`
   - NVMN expose: `GET https://api.muonnoi.org/v1/receipts?user_id=...&ecosystem=true`
   - Authentication: HMAC ký bằng shared secret (rotate 6 tháng)

**DoD:**
- [ ] Schema lock + 2 team review
- [ ] DSTS D1 table `star_marks` migration created
- [ ] API endpoint `/v1/star-marks` live trên DSTS
- [ ] Test sync khi NVMN endpoint live

**Effort:** 3 ngày dev + 0.5 ngày negotiation 2 team.

---

### TÍCH HỢP 4 — SSO (P2, Sprint 5+, đợi muonnoi build)

**Mục tiêu:** Một tài khoản dùng cho cả NVMN + DSTS + (tương lai) các module Muôn Nơi khác.

**Hai option:**

#### Option A: app.muonnoi.org làm OAuth provider (chuẩn dài hạn)

```
DSTS user click "Continue with Muôn Nơi" trên /signin
  → Redirect tới https://app.muonnoi.org/oauth/authorize?client_id=dsts&redirect_uri=...
  → User login Muôn Nơi (nếu chưa)
  → Muôn Nơi cấp authorization code
  → DSTS exchange code → access token
  → DSTS create/link user trong D1 với muonnoi_user_id
  → User vào dashboard DSTS với SSO session
```

**Yêu cầu từ Muôn Nơi:**
- OAuth 2.0 server với scope: `profile`, `email`, `archetype` (nếu user share)
- Refresh token, revoke endpoint
- App registration cho DSTS (client_id + client_secret)

**Timeline:** Khi app.muonnoi.org live (chưa biết khi nào).

#### Option B: DSTS độc lập với link option (ngắn hạn — recommend cho năm 1)

```
DSTS có auth riêng (email + magic link hoặc passkey)
User vào /settings/integrations
  → Connect with Muôn Nơi: nhập muonnoi_user_id (paste từ Muôn Nơi profile)
  → DSTS gửi verification request → Muôn Nơi (qua API integration 3)
  → Khi verified, user có badge "Connected to Muôn Nơi" trên Star Showcase
```

**Lợi ích Option B:**
- DSTS không phụ thuộc muonnoi build SSO
- User vẫn có cảm giác kết nối
- Khi SSO ready, migrate dễ dàng (mỗi user đã có muonnoi_user_id)

**Recommendation:** **Year 1 = Option B**, Year 2+ = Option A khi muonnoi sẵn sàng.

**Effort:** Option B = 4 ngày dev · Option A = 2 tuần dev + tích hợp.

---

### TÍCH HỢP 5 — VISUAL LANGUAGE (P1, Sprint 3)

**Mục tiêu:** Hai brand "cùng họ nhưng khác sắc" — user nhận ra là cùng ecosystem, nhưng cảm nhận được vai trò khác nhau.

#### Brand parallel matrix

| Yếu tố | NVMN (muonnoi.org v2.0) | DSTS |
|---|---|---|
| **Tagline** | "Đi xa để quay trở về" | "Hành trình tỏa sáng của Người Việt Nam trên toàn cầu" |
| **Mood** | Lắng, sâu, thật, không drama | Trang nghiêm, tỏa sáng, không phô trương |
| **Primary color** | Azure #3B7EFF (blue trí tuệ) | Star Gold #d8bc77 (vàng sao) |
| **Secondary** | Whisper #7FE0E5 (teal sương) | Aurora Blue #7AA8FF (xanh trời) |
| **Verification color** | Gold #D4AF37 | Light Gold #f5e7c7 |
| **Substrate** | Dark deep #0A0E1A | Dark ink #0b111d |
| **Typography** | Be Vietnam Pro | Inter |
| **Logo motif** | Vòng tròn Muôn Nơi (circle) | Ngôi sao 7 cánh (đặc thù VN) |
| **Photo style** | Documentary thật, no filter, ánh sáng tự nhiên | Cinematic, có lighting design, vẫn không filter quá đà |
| **Iconography** | Line icon mảnh, geometric | Star icon + line, có pha-le-thic |
| **Motion** | Subtle, slow ease | Slightly more energetic, vẫn restrained |

#### Shared design tokens (đề xuất file `_shared/brand-vfa-tokens.css`)

```css
:root {
  /* Shared (cùng VFA ecosystem) */
  --vfa-dark-deep: #0A0E1A;
  --vfa-dark-ink: #0b111d;
  --vfa-text-primary: #f5e7c7;
  --vfa-text-muted: #94a3b8;
  --vfa-radius-sm: 14px;
  --vfa-radius-md: 18px;
  --vfa-radius-lg: 28px;
  --vfa-shadow-soft: 0 18px 60px rgba(0,0,0,.26);
  --vfa-shadow-lift: 0 24px 80px rgba(0,0,0,.45);

  /* NVMN-specific */
  --nvmn-azure: #3B7EFF;
  --nvmn-whisper: #7FE0E5;
  --nvmn-verify-gold: #D4AF37;

  /* DSTS-specific */
  --dsts-star-gold: #d8bc77;
  --dsts-aurora-blue: #7AA8FF;
  --dsts-light-gold: #f5e7c7;
}
```

#### Footer pattern thống nhất

Cả NVMN và DSTS dùng cùng cấu trúc footer 4 cột:

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Brand block  │ Quick nav    │ Ecosystem    │ Legal        │
│              │              │              │              │
│ Logo + name  │ Trang chính  │ muonnoi.org  │ Terms        │
│ Tagline      │ Manifesto    │ NVMN/DSTS    │ Privacy      │
│ © year       │ Posts/Stars  │ Other quests │ Refund       │
│              │ Contact      │              │ Contact      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**DoD:**
- [ ] Shared `brand-vfa-tokens.css` agreed
- [ ] DSTS adopt token cho mọi component mới (Sprint 3)
- [ ] NVMN adopt token khi live
- [ ] Visual audit: 1 user nhìn vào 2 site đoán được "cùng ecosystem"

**Effort:** 1 ngày token + 2 ngày refactor + design review.

---

### TÍCH HỢP 6 — DATA + LEGAL FRAMEWORK (P0 ngay từ đầu)

**Mục tiêu:** Đảm bảo mọi data sharing tuân thủ legal framework.

#### Data Processing Agreement (DPA) — Founder ký song phương

DSTS và Muôn Nơi cần DPA xác định:

1. **Data controller / processor** — ai làm gì với data của user?
   - DSTS = controller cho dsts.com user data
   - Muôn Nơi = controller cho muonnoi.org user data
   - Khi user opt-in share, mỗi bên là processor cho data nhận về
   
2. **Purpose limitation** — chỉ dùng cho mục đích đã công bố

3. **Retention** — bao lâu giữ data?
   - Active: vô hạn (user own account)
   - Deleted account: xoá hard sau 30 ngày
   - Audit log: 7 năm (legal requirement)

4. **Sub-processor list** — Cloudflare, Stripe, Resend, etc. (cả hai bên cùng list)

5. **Breach notification** — < 72h thông báo nhau

6. **User rights:**
   - Right to access (export JSON)
   - Right to rectification
   - Right to erasure (cascade delete)
   - Right to portability (Star Marks + Receipts export)

#### Manifesto compliance check

Mọi sản phẩm DSTS phải qua **Manifesto Compliance Linter** trước khi launch:

| Check | Pass criteria |
|---|---|
| Không hứa kết quả ("sẽ thành sao", "sẽ giàu") | Grep regex từ banlist |
| Không gọi là "course" / "training" / "coaching" | Replace bằng "Script Journey" |
| Không có dark pattern UI | Visual + a11y audit |
| Reviews có nhãn nếu sample | Mandatory data-attribute |
| Pricing minh bạch | No hidden fee |
| Refund policy linked | Link check |

Linter = script Node + manual review trước mỗi sprint release.

**DoD:**
- [ ] DPA draft v1 (founder + lawyer review)
- [ ] Manifesto Compliance Linter v1 chạy được
- [ ] Privacy policy DSTS update với cross-share clause

**Effort:** 1 tuần legal + 2 ngày dev linter.

---

## III. ROADMAP TÍCH HỢP — 6 THÁNG

| Tháng | Tích hợp | Milestone |
|---|---|---|
| M1 (now) | 1 (UTM) + 6 (DPA) | Footer ecosystem map live · DPA draft v1 |
| M2 | 2 (Bridge pages) | 2 bridge page live + carry-over test |
| M3 | 5 (Visual) | brand-vfa-tokens.css adopted |
| M4 | 3 (Receipt schema) | Schema lock + DSTS endpoint live |
| M5 | 4 Option B (Manual link) | Connect-with-Muôn-Nơi feature |
| M6 | Review + iterate | Quarterly audit join NVMN team |
| M7+ | 4 Option A (SSO) | Khi muonnoi sẵn sàng |

---

## IV. RISKS & MITIGATIONS

| Rủi ro | P×I | Mitigation |
|---|---|---|
| Muôn Nơi không kịp build SSO | High × Med | Option B độc lập, không block DSTS |
| Schema disagreement giữa 2 team | Med × High | Founder làm tiebreaker, lock schema v1 sớm |
| User confused — "tôi là DSTS hay NVMN?" | Med × Med | Bridge pages explain clearly; mỗi brand giữ identity riêng |
| Brand dilution nếu trông quá giống nhau | Low × High | Visual matrix Mục 5 đảm bảo "cùng họ nhưng khác sắc" |
| Cross-leak data trái phép | Low × Critical | DPA + opt-in mandatory + audit log |
| Founder không có thời gian align 2 team | Med × Med | Monthly sync 1h, founder kiêm "ecosystem PM" 6 tháng đầu |

---

## V. APPROVAL CHECKLIST

### Founder (DSTS phía)
- [ ] Đồng ý 6 integration points (Mục II)
- [ ] Đồng ý DSTS độc lập domain, không trở thành sub của muonnoi (giữ duongsaotoasang.com)
- [ ] Đồng ý DSTS Option B SSO năm 1, Option A năm 2
- [ ] Đồng ý shared design token approach
- [ ] Đồng ý DPA template (sau khi luật sư duyệt)
- [ ] Chỉ định "Ecosystem PM" — founder kiêm 6 tháng đầu

### Muôn Nơi Tech Lead (phía bên kia)
- [ ] Confirm OAuth roadmap cho app.muonnoi.org (timeline ước)
- [ ] Confirm Receipt schema agreement
- [ ] Confirm willingness to cross-link UTM track
- [ ] Sign DPA khi legal duyệt
- [ ] Tham gia monthly sync với DSTS team

### Legal (cả hai bên)
- [ ] DPA template duyệt
- [ ] Privacy policy align
- [ ] Cross-share consent flow audit

**Ký Founder:** _______________________ **Ngày:** _______________________
**Ký Muôn Nơi Tech Lead:** _______________________ **Ngày:** _______________________

---

*Spec này là source of truth cho mọi điểm tích hợp DSTS ↔ Muôn Nơi. Mọi thay đổi phải bump version + sync hai team. Mọi PR liên quan integration phải ref file này trong description.*
