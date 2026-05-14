# 00_DSTS_MASTER_INDEX_2026

> 📝 **DRAFT v1.5.19** — 2026-05-14 (supersedes v1.5.18)
> Bản đồ master cho cả ecosystem DSTS. Gom toàn bộ Drive cũ + kế hoạch mới thành 1 chỉ mục chính thức.
> **Đối tượng dùng:** dev, content, legal, product, founder — cùng một bản truth.
> **v1.5.19 changes:** Wire API surface QA into the release gate for preview and production so list/search cannot expose full content bodies.
> **v1.5.18 changes:** Add public flow safety QA so public pages cannot reopen excluded email/payment/auth/register flows outside the whitelisted posts search.
> **v1.5.17 changes:** Add social metadata QA for OG/Twitter share previews and complete missing Twitter images on trust/legal pages.
> **v1.5.16 changes:** Add accessibility QA to prevent empty `href="#"`, broken in-page fragments, duplicate IDs, missing main landmarks, unlabeled buttons/links, and images without `alt`.
> **v1.5.15 changes:** Add public asset budget QA to cap tracked HTML/CSS/JS/PNG size, block source maps/runtime junk, and keep retired app assets out of deploy source.
> **v1.5.14 changes:** Add structured data QA and JSON-LD WebPage coverage for legal/trust pages so schema.org data cannot drift to `.html`, preview, or wrong-project URLs.
> **v1.5.13 changes:** Add local HTML structure QA to lock one `h1`, metadata, clean canonical URLs, and no legacy loading placeholders across tracked public HTML.
> **v1.5.12 changes:** Harden Sprint 0 release gate with tracked source hygiene, wrangler project identity, critical syntax checks, and optional deploy-bundle dry run.
> **v1.5.11 changes:** Add Sprint 0 release gate script that returns PASS, FAIL, or BLOCKED_EXTERNAL for automation loops.
> **v1.5.10 changes:** Add Cloudflare custom-domain fix packet with exact purge URLs, dashboard checks, API template, and post-fix verification commands.
> **v1.5.9 changes:** Extend `headers-qa` and runbook to assert retired `/assets/app.js` returns 404/no-store, making custom-domain stale cache visible in one command.
> **v1.5.8 changes:** Retire legacy `assets/app.js` from deploy source and add QA/deploy guards so it cannot return.
> **v1.5.7 changes:** Add `_redirects` and `_routes.json` validation to `content-qa` to prevent routing regressions and wrong-project/catch-all rules.
> **v1.5.6 changes:** Add `_headers` origin-policy validation to `content-qa` to prevent referrer/cache regressions while custom-domain override remains external.
> **v1.5.5 changes:** Add robots policy checks to content QA, SEO route QA, and smoke content checks.
> **v1.5.4 changes:** Add shared RSS feed helper, generate static `rss.xml` from 24 fallback posts, and make RSS drift fail `content-qa`.
> **v1.5.3 changes:** Add shared public route manifest, sync static `sitemap.xml` from 24 fallback posts, and make sitemap drift fail `content-qa`.
> **v1.5.2 changes:** Add public design token file `tokens.css`, wire `app.css` to import it, and add token CSS to header/smoke QA.
> **v1.5 changes:** Sprint 0 execution status added — route/API/content/SEO production pass; `/content` without slug redirects to `/posts`; custom-domain header/cache remains BLOCKED_EXTERNAL in Cloudflare zone rules.
> **v1.4 changes:** Wave 3 done — 7 NDNUM spec con DRAFT v1.0 filed (W3.1-W3.7).
> **v1.3 changes:** Wave 2 — thêm 4 spec mới (UI Mockup, Sponsors API, Events API, Sponsor Agreement) + upgrade 7 Layer 1 spec lên v1.0-DEV-READY + reserve `_redirects` Movement portal.
> **v1.2 changes:** Wave 1 sync timeline (chèn Phase 0B), fix A7 status, thêm 7 NDNUM spec con TBD.

**Founder:** Trần Hà Tâm
**Phiên bản:** v1.5.19 (master index — pending re-lock)
**Ngày phát hành:** 2026-05-14
**Nguyên tắc:** Mọi tài liệu mới về DSTS phải được index ở đây. Không có file ngoài index.

---

## 0. MỤC LỤC

- [1. Tóm tắt 1 phút](#1-tóm-tắt-1-phút)
- [2. Bản đồ ecosystem DSTS](#2-bản-đồ-ecosystem-dsts)
- [3. Trạng thái 3 Layer](#3-trạng-thái-3-layer)
- [4. Index tài liệu — Drive cũ (Layer A)](#4-index-tài-liệu--drive-cũ-layer-a)
- [5. Index tài liệu — Kế hoạch mới (Layer 0-2)](#5-index-tài-liệu--kế-hoạch-mới-layer-0-2)
- [6. Index file team dev cần tạo tiếp](#6-index-file-team-dev-cần-tạo-tiếp)
- [7. Trang chủ phải công bố gì](#7-trang-chủ-phải-công-bố-gì)
- [8. Owner & trách nhiệm](#8-owner--trách-nhiệm)
- [9. Quy ước version & cập nhật](#9-quy-ước-version--cập-nhật)

---

## 1. Tóm tắt 1 phút

DSTS không phải là 1 dự án — là **3 layer chồng lên nhau**:

```
LAYER 2 — Star Journey OS               (Tháng 1/2027+)
  Hệ sản phẩm tự động cá nhân hóa hành trình tỏa sáng
  ↑
LAYER 1 — Movement Portal               (Tháng 9-12/2026)
  Sponsorship + Tour 33+ quốc gia + Diaspora Map
  ↑
PHASE 0B — Legal + Child Safety Lock    (Tháng 6-8/2026)
  Pháp nhân + Legal Counsel + CSO + 7 NDNUM spec con + NDNUM v1.2-LOCKED
  Blocker cho Layer 1 public surface (xem NDNUM Mục XI)
  ↑
LAYER 0 — Foundation Stabilization      (4 tuần — đang chạy)
  Site từ 45/100 → 100/100. Sprint 0-4.
  ↑
LAYER A — Vision gốc Drive (2024-2025)
  Star Path Light Up + Phía Sau Màn Nhung 2026 + 100M USD/năm
```

**Quy tắc Founder Lock 2026-05-12:** Layer 0 phải xong trước. Layer 1, 2 chỉ note vào và **công bố trên trang chủ** dưới dạng Roadmap 2026-2027. Không build trước khi Sprint 0 pass.

---

## 2. Bản đồ ecosystem DSTS

```
muonnoi.org                          ← Root platform (Layer xã hội Muôn Nơi)
   ↓
nguoiviet.muonnoi.org                ← Cộng đồng người Việt toàn cầu
   ↓
duongsaotoasang.com                  ← DSTS (chính)
   ├── Layer 0: Web nội dung + 9 Script Journey      (đang sửa, Sprint 0)
   ├── Phase 0B: Legal + Child Safety Lock            (Tháng 6-8/2026)
   ├── Layer 1: Movement Portal                       (Tháng 9-12/2026)
   │     ├── /movement/sponsors (13 gói tài trợ)
   │     ├── /movement/events (Tour 33+ quốc gia)
   │     ├── /movement/diaspora-map
   │     └── /movement/showcase
   └── Layer 2: Star Journey OS                       (Tháng 1/2027+)
         ├── /journey/assessment
         ├── /journey/products (Free Profile → Elite 25k)
         └── /journey/dashboard
   ↓
phiasaumannhung.com                  ← Chương trình đầu tiên (có thể merge về duongsaotoasang/events/)
   ↓
Angel Edu Tam Foundation (US 501c3)  ← Legal entity (chờ xác minh)
Thanh Tam Foundation Việt Nam        ← Legal entity (chờ xác minh)
```

---

## 3. Trạng thái 3 Layer

| Layer | Trạng thái | Điểm | Owner | Deadline |
|---|---|---|---|---|
| **Layer 0 — Foundation** | 🟢 Route/API/content/SEO pass; 🟠 header/cache blocked external | 45/100 → 90+/100 repo-side | Tech Lead | 2026-06-09 |
| **Phase 0B — Legal + Child Safety Lock** | 🔴 Chưa start (chặn Layer 1) | n/a | Founder + Legal + CSO | 2026-08-31 |
| **Layer 1 — Movement Portal** | 🔵 Spec đang viết | n/a | Founder + Claude | 2026-12-31 |
| **Layer 2 — Star Journey OS** | 🔵 Spec đang viết | n/a | Founder + Claude | 2027-04-30 |
| **Layer A — Drive vision gốc** | ✅ Đã có tài liệu | n/a | Founder | — |

**Quy tắc gate:**
- Layer 0 phải đạt 100/100 trước khi mở Phase 0B
- Phase 0B phải hoàn tất (pháp nhân + Legal + CSO + 7 NDNUM spec con + NDNUM v1.2-LOCKED) trước khi mở Layer 1 public surface
- Layer 1 phải đạt KPI (5 gói tài trợ đầu tiên) trước khi mở Layer 2
- Mọi spec Layer 1, 2 viết song song trong khi Layer 0 chạy — nhưng không deploy

---

## 4. Index tài liệu — Drive cũ (Layer A)

📂 **Folder gốc:** [DSTS Drive](https://drive.google.com/drive/folders/1_kOEbkhpmvybGQOAf6msEKBfXcFXFYs0)

### 4.1 Vision tổng thể

| # | Tài liệu | Drive | Status | Nội dung cốt lõi |
|---|---|---|---|---|
| A1 | Chương trình Star Path Light Up | [link](https://docs.google.com/document/d/1xxQFic5L75IKtdsoDwoojRMcZStW0DzNULI3erbGapY/edit) | ✅ Done 2024-08 | Vision gốc: gây quỹ phi lợi nhuận cho trẻ em + 10 gói tài trợ 9k-999k USD |
| A2 | Chi tiết bổ sung hoàn thiện | [link](https://docs.google.com/document/d/14yc0E3SZSs2pkbL9O83LRg7SMswjsfto9VSKPXz9VvM/edit) | ✅ Done 2024-08 | Plan tour 5 giai đoạn (2024-2026) |
| A3 | TỔNG KẾ HOẠCH NHIỀU QUỐC GIA | [link](https://docs.google.com/document/d/1bqRMqImg212T5oLptbT0VTVW5dEqmxCCsT9DGeX-jFI/edit) | ✅ Done 2024-08 | Tour 3 năm (2025-2027): Á → Mỹ → Âu → Úc |
| A4 | THƯƠNG HIỆU, LOGO, SLOGAN | [link](https://docs.google.com/document/d/1odatH0p_6Ehu2vSj6fdORv6LwyYG7N_xzih8LRiqkS8/edit) | ✅ Done 2024-08 | 10 brand ideas + 10 gói tài trợ 25k-1M USD + 20 cuộc thi |
| A5 | Chi tiết kế hoạch thực hiện | [link](https://docs.google.com/document/d/1YuPjfgkyazzIkqFA8E7RhCtxEWY4ZOGbEk9fytgpBsk/edit) | ✅ Done 2024-08 | Chiến lược xin tài trợ chi tiết |

### 4.2 Chương trình đầu tiên — Phía Sau Màn Nhung 2026

📂 **Sub-folder:** [DSTS ĐẦU TIÊN NHÌN RA THẾ GIỚI](https://drive.google.com/drive/folders/1BPO6EB_h_z0acjk-bXxb3viO9-aSNiSy)

| # | Tài liệu | Drive | Status | Nội dung |
|---|---|---|---|---|
| A6 | **TỔNG THỂ TẦM NHÌN CHIẾN LƯỢC NỘI BỘ** | [link](https://docs.google.com/document/d/15r2CesJlC6SGPynAG1ENwizKnkHN2ZRTIlpvLKmxI8U/edit) | ✅ Done 2025-08 | **Mục tiêu 100M USD/năm**, lộ trình 2025-2030 |
| A7 | KẾ HOẠCH DỰ KIẾN VÀ TÊN CHƯƠNG TRÌNH ĐẦU TIÊN | [link](https://docs.google.com/document/d/1yrKhNeDdUCW6cLpjPoeYJwJikMquqoWFRlh0N7kK1xQ/edit) | ⚠️ **Founder TBD** | Sự kiện dự kiến 2026-01-22 — **đã qua**, cần Founder xác nhận: (a) completed (b) postponed (c) cancelled (d) merged. **Chặn Wave 2 Tour Calendar lock + chặn Layer 1 Gala route public.** |
| A8 | SPONSORSHIP "PHÍA SAU MÀN NHUNG 2026" | [link](https://docs.google.com/document/d/1jdLyFk54tK6SzZjuVoMAExK76oyliOTfGqBvo42Xo-U/edit) | ✅ Done 2025-10 | 13 gói tài trợ 1k-100k USD chi tiết |
| A9 | CÁC GÓI TÀI TRỢ DỰ KIẾN | [link](https://docs.google.com/document/d/1bFCrsGIpJWvPeVORQHM3TPDTiwHvisx7weHU34d--24/edit) | ✅ Done 2025-10 | Sponsorship deck 39KB đầy đủ |
| A10 | DANH SÁCH BTC VÀ KHÁCH MỜI | [sheet](https://docs.google.com/spreadsheets/d/12smOrZDphwooxsWTn-ApCnDWRJalPzmtuOfB4zR1fl4/edit) | ⚠️ Cần update | Roster team + khách mời |
| A11 | Web: Phiasaumannhung.com | [link](https://docs.google.com/document/d/19mcSOFKvu4AUJ_o5DBx4DPBdulyIrS44vD3mgooqt3g/edit) | ⚠️ Cần quyết định | Landing riêng — merge về `/events/` hay giữ domain riêng? |
| A12 | PDF Phia Sau Man Nhung Event Bau Show | [drive](https://drive.google.com/file/d/1fiXS5HPKfo3m6A4Bq8TjFUOx73jkBKJf/view) | ✅ Done 2025-09 | Tài liệu sản xuất event 13MB |
| A13 | Design resources | [folder](https://drive.google.com/drive/folders/1Xhvvy57COlv4ncVuWZCA1SsL0Wh4cP8G) | ✅ Available | Asset thiết kế |

### 4.3 Note 1 dòng

| # | Tài liệu | Drive | Status |
|---|---|---|---|
| A14 | Web tạo kịch bản (1KB note) | [link](https://docs.google.com/document/d/121pxEpu8TiAEjWCh4OzoS8dRpfZQv_5JHAOkKU0pcas/edit) | 📝 Note ngắn về kinh doanh kịch bản |

---

## 5. Index tài liệu — Kế hoạch mới (Layer 0-2)

### 5.1 Layer 0 — Foundation (Sprint 0-4, ĐANG CHẠY)

| # | File | Purpose | Status | Owner |
|---|---|---|---|---|
| 5.1.1 | `dsts-master-plan-v1.2-DRAFT.md` | Master plan v1.2-DRAFT — chèn Phase 0B, dịch Tầng 3+4 lùi 2 tháng | 📝 DRAFT 2026-05-13 — pending re-lock | Founder + Claude |
| 5.1.2 | `DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md` | 9 GitHub Issues cho Sprint 0 | 🔒 Locked 2026-05-12 | Tech Lead |
| 5.1.3 | `dsts-bug-report.md` | Audit ban đầu 2026-05-12 | ✅ Reference | AI Assistant |
| 5.1.4 | `GAP_ANALYSIS_V2_vs_v1.md` | Gap analysis từ Drive/V2 so với plan v1 | ✅ Reference | AI Assistant |
| 5.1.5 | `dsts-master-plan-v1.1-LOCKED.md` *(archived)* | Master plan v1.1 — superseded bởi v1.2-DRAFT | 🗄️ Archive (renamed → v1.2-DRAFT) | — |
| 5.1.6 | `STATE_REPORT_2026-05-14.md` | Sprint 0 execution status: route/API/content/SEO pass; Cloudflare custom-domain header/cache blocked external | 🟢 Current status | Codex |
| 5.1.7 | `CLOUDFLARE_CUSTOM_DOMAIN_FIX_PACKET_2026-05-14.md` | Exact Cloudflare zone/cache/header fix packet: purge URLs, dashboard checks, API template, post-fix verification | 🟠 BLOCKED_EXTERNAL handoff | Cloudflare admin |

### 5.2 Layer 1 — Movement Portal (Spec đang viết song song)

| # | File | Purpose | Status | Owner |
|---|---|---|---|---|
| 5.2.1 | `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` | Spec chi tiết Movement Portal | 🟢 DEV-READY v1.0 (Wave 2) | Founder + Claude |
| 5.2.2 | `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` | Tracker 13 gói tài trợ + flow xác nhận | 🟢 DEV-READY v1.0 (Wave 2) | Founder + Claude |
| 5.2.3 | `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` | Runbook tổ chức event | 🟢 DEV-READY v1.0.1 (Wave 2) | Founder + Operations |
| 5.2.4 | `DSTS_TOUR_CALENDAR_2026_2027.md` | Tour 33+ quốc gia, lịch chi tiết | 🟢 DEV-READY v1.0.1 (Wave 2) | Founder + Operations |
| 5.2.5 | `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` | 10 route wireframe + 8 component + responsive + a11y + i18n | 🟢 DEV-READY v1.0 (Wave 2) | Frontend Lead + Founder |
| 5.2.6 | `DSTS_MOVEMENT_SPONSORS_API_CONTRACT.md` | 6 endpoint sponsor + D1 schema + migration `0006_sponsors.sql` | 🟢 DEV-READY v1.0 (Wave 2) | Tech Lead + Founder |
| 5.2.7 | `DSTS_MOVEMENT_EVENTS_API_CONTRACT.md` | 6 endpoint event + D1 schema + migration `0007_events.sql` + child safety enforcement | 🟢 DEV-READY v1.0 (Wave 2) | Tech Lead + Operations |

### 5.3 Layer 2 — Star Journey OS (Spec đang viết song song)

| # | File | Purpose | Status | Owner |
|---|---|---|---|---|
| 5.3.1 | `DSTS_LAYER_2_STAR_JOURNEY_OS_SPEC.md` | Spec Star Journey OS tổng thể | 🟡 TBD | Founder + Claude |
| 5.3.2 | `DSTS_STAR_JOURNEY_PRODUCT_CATALOG.md` | 14 sản phẩm (Free Profile → Elite 25k) | 🟡 TBD | Product |
| 5.3.3 | `DSTS_AUTOMATION_ENGINE_SPEC.md` | 8 AI prompt engine | 🟡 TBD | Tech Lead + AI |
| 5.3.4 | `DSTS_DATABASE_SCHEMA_PRODUCTS_JOURNEYS.md` | Schema D1: 22 bảng | 🟡 TBD | Tech Lead |
| 5.3.5 | `DSTS_API_CONTRACT_PRODUCTS_ASSESSMENT_DASHBOARD.md` | 18+ API endpoints | 🟡 TBD | Tech Lead |
| 5.3.6 | `DSTS_FRONTEND_ROUTE_AND_SCREEN_MAP.md` | Route map + screen mockup | 🟡 TBD | Frontend + Design |
| 5.3.7 | `DSTS_MUONNOI_INTEGRATION_ARCHITECTURE.md` | SSO + profile sync với Muôn Nơi | 🟡 TBD | Tech Lead |
| 5.3.8 | `DSTS_ADMIN_CMS_OPERATIONS_SPEC.md` | Admin CMS cho founder | 🟡 TBD | Tech Lead + Operations |

### 5.4 Cross-cutting

| # | File | Purpose | Status | Owner |
|---|---|---|---|---|
| 5.4.1 | `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md` | Quy tắc privacy + trust + minh bạch | 🟢 DEV-READY v1.0 (Wave 2) | Legal + Founder |
| 5.4.2 | `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` | Flow thanh toán + membership + sponsor | 🟢 DEV-READY v1.0 (Wave 2) | Tech Lead + Legal |
| 5.4.3 | `DSTS_RELEASE_QA_100_SCORE_CHECKLIST.md` | Checklist QA tổng cho mọi release | 🟢 DEV-READY v1.0 (Wave 2) | Tech Lead + QA |
| 5.4.4 | `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md` | Boilerplate hợp đồng tài trợ 13 tier — chờ Legal Counsel adapt | 🟡 DRAFT v1.0-LEGAL-PENDING (Wave 2) | Legal + Founder |

### 5.5 NDNUM — Nuôi Dưỡng Những Ước Mơ (Phase 0B)

| # | File | Purpose | Status | Owner |
|---|---|---|---|---|
| 5.5.0 | `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` | Vision tổng + 5 Tầng + 12 quy tắc Tầng 1 + 3-lane firewall | 🟡 DRAFT v1.1-REVIEWED (78→92/100) | Founder + Claude |
| 5.5.1 | `NDNUM_CHILD_SAFETY_POLICY.md` | 12 quy tắc deep dive + CSO role + incident A/B/C/D + 4 appendices (VN/US/AU/UK reporting) | 🟡 DRAFT v1.0 (Wave 3 — chờ CSO co-review) | CSO + Founder |
| 5.5.2 | `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` | COPPA 5 VPC methods + NĐ 56/2017 + 10-step flow + consent template VI/EN + D1 schema `0008` + 5 API endpoints | 🟡 DRAFT v1.0 (Wave 3 — chờ Legal Counsel review) | Legal + Tech |
| 5.5.3 | `NDNUM_MENTOR_SCREENING_AND_TRAINING.md` | 5 role + hiring funnel JD + background check 4 countries + 40h curriculum + compensation Y1 | 🟡 DRAFT v1.0 (Wave 3 — chờ CSO + HR review) | HR + CSO |
| 5.5.4 | `NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md` | Pháp nhân 3 options + fiscal sponsor + 3-lane firewall + tax + AML/KYC + D&O insurance | 🟡 DRAFT v1.0 (Wave 3 — 3 Founder decisions pending: FD-1, FD-2, FD-4) | Legal + CFO |
| 5.5.5 | `NDNUM_SPONSOR_A_DREAM_FULFILLMENT_FLOW.md` | Flow $120 + cohort $50K + annual $250K + Coordinator workload + communication protocol + D1 schema | 🟡 DRAFT v1.0 (Wave 3 — chờ Coordinator hire + Phase 0B) | Operations |
| 5.5.6 | `NDNUM_IMPACT_MEASUREMENT_FRAMEWORK.md` | Logic Model + Theory of Change + SDQ tool + k-anonymity ≥5 + D1 schema `0009` + external validation | 🟡 DRAFT v1.0 (Wave 3 — chờ M&E Specialist hire) | M&E Specialist |
| 5.5.7 | `NDNUM_PUBLIC_LANDING_PAGE_SCOPE.md` | `/dream-nurture` scope: hero + 5 Tầng + CTA allow/ban list + acceptance criteria. KHÔNG nhận đăng ký trẻ em trước Q1/2027 | 🟡 DRAFT v1.0 (Wave 3 — chờ Phase 0B lock) | Founder + Frontend |

---

## 6. Index file team dev cần tạo tiếp

Theo thứ tự ưu tiên:

```text
✅ Sprint 0 repo-side done:
  1. _redirects
  2. 404.html
  3. /data/posts.json
  4. /data/content.json
  5. posts.html (fallback)
  6. content.html (fallback 5 states)
  7. contact.html manual-only
  8. donate.html closed/pending
  9. transparency.html
  10. legal.html + /terms + /privacy + /support
  11. index.html CTA cleanup + roadmap
  12. scripts/smoke-test.sh + link/SEO/header/API QA

🟠 Sprint 0 blocked external:
  13. Cloudflare custom-domain header/cache override for duongsaotoasang.com
  13b. CLOUDFLARE_CUSTOM_DOMAIN_FIX_PACKET_2026-05-14.md ✅ admin handoff added 2026-05-14

🟡 Sprint 1-4 — 3 tuần tiếp:
  13. sitemap.xml ✅ static + dynamic sitemap synced 2026-05-14
  14. rss.xml ✅ static + dynamic RSS synced 2026-05-14
  15. robots.txt ✅ crawler policy QA added 2026-05-14
  16. _headers ✅ origin header policy QA added 2026-05-14
  16b. _redirects + _routes.json ✅ routing config QA added 2026-05-14
  17. tokens.css ✅ design tokens added 2026-05-14
  18. assets/app.js retirement ✅ legacy asset removed + deploy guard 2026-05-14
  19. RUNBOOK.md ✅ repo runbook added 2026-05-14
  20. scripts/sprint-0-release-gate.mjs ✅ PASS/FAIL/BLOCKED_EXTERNAL + source hygiene gate added 2026-05-14
  21. scripts/html-structure-qa.mjs ✅ local HTML structure gate added 2026-05-14
  22. scripts/structured-data-qa.mjs ✅ JSON-LD structured data gate added 2026-05-14
  23. scripts/public-asset-budget-qa.mjs ✅ public asset budget gate added 2026-05-14
  24. scripts/accessibility-qa.mjs ✅ accessibility/semantic HTML gate added 2026-05-14
  25. scripts/social-metadata-qa.mjs ✅ OG/Twitter metadata gate added 2026-05-14
  26. scripts/public-flow-safety-qa.mjs ✅ excluded-lane public flow safety gate added 2026-05-14
  27. scripts/api-surface-qa.mjs ✅ preview/production API surface gate wired into release gate 2026-05-14

🔴 Phase 0B (Tháng 6-8/2026):
  20a. 7 NDNUM spec con (Child Safety, Consent, Mentor Screening, Legal Entity, Sponsor Fulfillment, Impact, Landing Page)
  20b. NDNUM v1.2-LOCKED bump
  20c. Pháp nhân Lane B registered + bank account
  20d. Legal Counsel + CSO hired

🔵 Sau Phase 0B — Layer 1 (Tháng 9-12/2026):
  21. /movement/sponsors landing page
  22. /movement/events calendar
  23. /movement/diaspora-map
  24. Sponsorship form + manual confirmation flow
  25. Pitch Deck PDF (song ngữ)
  26. Press Kit

🔵 Sau Layer 1 — Layer 2 (Tháng 1/2027+):
  27. /journey/assessment (12-24 câu hỏi)
  28. /journey/dashboard
  29. /journey/products
  30. D1 schema + migration
  31. API endpoints (18+)
  32. SSO Muôn Nơi bridge
```

---

## 7. Trang chủ phải công bố gì

> Quy tắc Founder Lock 2026-05-12: *"Với tất cả các kịch bản nổi tiếng, note vào, sẽ triển khai những giai đoạn tiếp theo, cũng cần công bố đầy đủ trên trang chủ."*

### 7.1 Hiện đã có (giữ nguyên)
- Hero + 3 pillar
- Định hướng lõi
- Chuỗi chương trình
- Liên kết hệ sinh thái
- Bản đồ nền tảng (9 link)
- Định hướng mới
- 3 nhân vật (Nghệ sĩ + Doanh nhân + Ngôi sao tài năng)
- Kịch bản nổi bật: Rising Entrepreneur
- 4 giai đoạn phát triển
- Nội dung nổi bật
- Điểm chạm cuối

### 7.2 Cần BỔ SUNG trên trang chủ (Sprint 1)

#### Block A — "9 Kịch bản nổi tiếng đã có"
Hiển thị grid 9 Script Journey với link sang detail:
- The Rising Entrepreneur — Doanh nhân — 25,000 USD
- The Global Artist — Nghệ sĩ — 20,000 USD
- The Singing Icon — Âm nhạc
- The Cinematic Actor — Điện ảnh
- The Thinker — Tri thức
- The Creative Leader — Lãnh đạo
- The Cultural Ambassador — Văn hóa
- The DSTS Legacy — Di sản
- The Global Story — Câu chuyện toàn cầu

#### Block B — "Roadmap 2026-2027"
Timeline visual + mô tả ngắn:

```
🟢 Đang chạy (Tháng 5-6/2026)
   Layer 0 — Foundation
   Cứu site, hoàn thiện trust, legal, SEO

🔴 Quý 3/2026 (Tháng 6-8/2026)
   Phase 0B — Legal + Child Safety Lock (NDNUM blocker)
   - 7 NDNUM spec con LOCKED
   - Pháp nhân Lane B registered + bank
   - Legal Counsel + CSO hired
   - NDNUM v1.2-LOCKED

🟠 Quý 4/2026 (Tháng 9-12/2026)
   Layer 1 — Movement Portal
   - Sponsorship Portal (13 gói tài trợ)
   - Tour Calendar 33+ quốc gia (Phase 1 SEA)
   - Diaspora Map (Bản đồ Người Việt tỏa sáng)
   - Press Kit + Pitch Deck

🔵 Quý 1/2027 trở đi (Tháng 1/2027+)
   Layer 2 — Star Journey OS
   - Free Star Profile
   - Star Map Assessment
   - 7/30/90-Day Journey
   - Verified Star Circle
   - Elite 5-Year Star Journey
```

#### Block C — "Đơn vị tổ chức"
Sau khi xác minh pháp lý xong (chờ founder), hiển thị:
- Angel Edu Tam Foundation Inc (US 501c3) — chờ xác minh
- Thanh Tam Foundation Việt Nam — chờ xác minh
- Cộng đồng Người Việt Muôn Nơi

Trước khi xác minh xong, dùng:
> "Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý."

#### Block D — "Tầm nhìn 100M USD/năm" (giai đoạn 2)
**KHÔNG hiển thị Sprint 0.** Chờ Layer 1 sẵn sàng mới công bố để tránh hứa hẹn chưa có nền tảng.

---

## 8. Owner & trách nhiệm

| Role | Owner | Trách nhiệm |
|---|---|---|
| **Founder** | Trần Hà Tâm | Phê duyệt mọi gate, lock plan, quyết strategic |
| **Tech Lead** | TBD (cần chỉ định) | Triển khai Sprint 0-4, review code, deploy |
| **Frontend Dev** | TBD | HTML/CSS/JS, responsive, accessibility |
| **Content Writer** | TBD | Viết nội dung about/program/donate/transparency, legal |
| **Legal Advisor** | TBD | Soạn + review Terms/Refund/Privacy |
| **Designer** | TBD (Sprint 3) | Design tokens, skeleton, polish |
| **Operations** | TBD | Tour calendar, BTC, sự kiện |
| **AI Assistant** | Codex/Claude | Spec, plan, docs, gap analysis |

**Quy ước chỉ định:** Trong Sprint 0, founder phải chốt ít nhất Tech Lead + Content Writer. Các role khác có thể chỉ định dần.

---

## 9. Quy ước version & cập nhật

### Versioning
- Master Plan: `v1.1-LOCKED` → bump `v1.2` khi có thay đổi lớn
- Index này (Master Index): `v1.0` → bump khi thêm/sửa tài liệu trong index
- Mỗi tài liệu spec: tự version riêng (v1.0, v1.1, ...)

### Quy tắc thêm tài liệu mới
1. Tạo file trong repo `docs/dsts/`
2. Add entry vào Mục 4 hoặc 5 của index này
3. PR vào `main` với label `docs/index`
4. Founder review + merge

### Quy tắc sửa tài liệu locked
1. Mở PR riêng — không sửa trực tiếp `main`
2. Bump version (v1.1-LOCKED → v1.2-DRAFT)
3. Founder review + lock lại

### Conflict resolution
Nếu có conflict giữa Drive cũ (Layer A) và Plan mới (Layer 0-2):
- **Vision** → Drive ưu tiên (lõi do founder viết)
- **Tactical execution** → Plan mới ưu tiên (cập nhật theo public site hiện tại)
- **Pháp lý** → Legal advisor quyết, founder ký duyệt cuối

---

## 10. Lịch sử thay đổi

| Phiên bản | Ngày | Thay đổi | Approver |
|---|---|---|---|
| v1.0 | 2026-05-12 | Tạo Master Index ban đầu, gom Drive + Plan mới | Trần Hà Tâm |
| v1.1 | 2026-05-13 | Cập nhật trạng thái Batch 1 + Batch 2: 7/15 spec đã có DRAFT v1.0 | Trần Hà Tâm |
| v1.2 | 2026-05-13 | Wave 1 patch: sync timeline (chèn Phase 0B, dịch Layer 1 → Tháng 9-12/2026), fix A7 status (Founder TBD), thêm 7 NDNUM spec con TBD Mục 5.5 + Sponsor Agreement Mục 5.4.4. Counts: 7 Layer 1 DRAFT + 4 cross-cutting (3 DRAFT + 1 TBD) + 7 NDNUM TBD + 1 NDNUM v1.1 DRAFT + 4 Layer 2 TBD = 12 DRAFT + 12 TBD (24 total) | Trần Hà Tâm |
| v1.3 | 2026-05-13 | Wave 2 done — UNBLOCK DEV LAYER 1: thêm 3 spec mới (5.2.5 UI Mockup, 5.2.6 Sponsors API, 5.2.7 Events API) + upgrade 5.2.1-5.2.4 + 5.4.1-5.4.3 lên DEV-READY v1.0 + 5.4.4 Sponsor Agreement Template DRAFT-LEGAL-PENDING + reserve `_redirects` Movement portal routes. Counts: 11 DEV-READY + 1 LEGAL-PENDING + 8 TBD (7 NDNUM + 1 NDNUM v1.1 + 4 Layer 2 - tổng 20 entry trong Master Index). Dev có thể bắt tay code Layer 1 ngay khi Layer 0 Sprint 0 done | Trần Hà Tâm |
| v1.4 | 2026-05-13 | Wave 3 done — 7 NDNUM spec con DRAFT v1.0 filed (5.5.1-5.5.7): Child Safety Policy, Parent/Guardian Consent Flow, Mentor Screening & Training, Legal Entity & Money Lane Map, Sponsor-a-Dream Fulfillment, Impact Measurement Framework, Public Landing Page Scope. Counts updated: 11 DEV-READY + 8 DRAFT (1 LEGAL-PENDING + 7 NDNUM con) + 1 NDNUM v1.1-REVIEWED + 4 Layer 2 TBD. NDNUM spec con chờ Legal/CSO co-review trước khi lock v1.0-LOCKED. 3 Founder decisions pending (FD-1 pháp nhân, FD-2 fiscal sponsor, FD-4 Investment Lane Y1) | Claude Code |
| v1.5 | 2026-05-14 | Add `STATE_REPORT_2026-05-14.md`. Sprint 0 route/API/content/SEO now pass on preview + production spot checks. `/content` without slug redirects to `/posts` via Pages middleware. Known remaining failure is production custom-domain header/cache override outside repo: `referrer-policy=same-origin` and static asset `max-age=14400` despite repo `_headers` and preview using stricter values. | Codex |
| v1.5.1 | 2026-05-14 | Add root `RUNBOOK.md` for deploy, rollback, incident response, owner matrix, production verification, data safety, and Cloudflare custom-domain header/cache blocker. | Codex |
| v1.5.2 | 2026-05-14 | Add root `tokens.css`, import it from `app.css`, cache it through `_headers`, and include token CSS in smoke/header QA. | Codex |
| v1.5.3 | 2026-05-14 | Add shared public route manifest `functions/_lib/public-routes.js`, generate static `sitemap.xml` from the same route list + 24 fallback posts, and make `content-qa` fail on sitemap drift/noindex leakage. | Codex |
| v1.5.4 | 2026-05-14 | Add shared RSS feed helper `functions/_lib/feed-utils.js`, generate static `rss.xml` from 24 fallback posts, and make `content-qa` fail on RSS drift/noindex leakage. | Codex |
| v1.5.5 | 2026-05-14 | Add `robots.txt` validation to `content-qa`, `seo-route-qa`, and smoke content checks so crawler policy cannot drift to preview/wrong-project URLs or block public routes. | Codex |
| v1.5.6 | 2026-05-14 | Add `_headers` origin-policy validation to `content-qa` so repo-side referrer/cache rules cannot drift to the current custom-domain override values. | Codex |
| v1.5.7 | 2026-05-14 | Add `_redirects` and `_routes.json` validation to `content-qa` so public route normalization, Movement placeholders, and Pages Functions routing cannot drift back to broken catch-all behavior. | Codex |
| v1.5.8 | 2026-05-14 | Remove retired `assets/app.js`, remove its special `_headers` block, and add `content-qa` + clean deploy guard so legacy app shell assets cannot re-enter the deploy bundle. | Codex |
| v1.5.9 | 2026-05-14 | Extend `headers-qa` and `RUNBOOK.md` preview/production verification so retired `/assets/app.js` must return 404/no-store on preview and stale production cache is reported as an explicit custom-domain blocker. | Codex |
| v1.5.10 | 2026-05-14 | Add Cloudflare custom-domain fix packet documenting correct Pages project, stale cache evidence, exact purge URLs, dashboard rule checks, API purge template, and post-fix verification commands. | Codex |
| v1.5.11 | 2026-05-14 | Add `scripts/sprint-0-release-gate.mjs`, a compact automation gate that runs content QA, preview/prod SEO/header checks, and exits `0` ready, `1` hard fail, or `2` known Cloudflare `BLOCKED_EXTERNAL`. | Codex |
| v1.5.12 | 2026-05-14 | Harden `scripts/sprint-0-release-gate.mjs` with tracked-source junk checks, `wrangler.toml` project identity, critical Function/API syntax checks, `git diff --check`, and optional `RUN_DEPLOY_DRY_RUN=1` deploy-bundle verification. | Codex |
| v1.5.13 | 2026-05-14 | Add `scripts/html-structure-qa.mjs` and wire it into the release gate so public HTML cannot regress on one `h1`, metadata, canonical cleanliness, or legacy loading placeholders. | Codex |
| v1.5.14 | 2026-05-14 | Add `scripts/structured-data-qa.mjs`, fix `content.html` schema URL, and add WebPage JSON-LD to legal/trust pages so structured data is parseable, schema.org-based, and clean-URL safe. | Codex |
| v1.5.15 | 2026-05-14 | Add `scripts/public-asset-budget-qa.mjs` and wire it into the release gate so HTML/CSS/JS/PNG size budgets, source-map bans, and retired app asset bans are enforced before deploy. | Codex |
| v1.5.16 | 2026-05-14 | Add `scripts/accessibility-qa.mjs`, fix 404 language links away from `href="#"`, and wire accessibility/semantic checks into the release gate. | Codex |
| v1.5.17 | 2026-05-14 | Add `scripts/social-metadata-qa.mjs`, complete missing Twitter image metadata on legal/trust pages, and wire OG/Twitter checks into the release gate. | Codex |
| v1.5.18 | 2026-05-14 | Add `scripts/public-flow-safety-qa.mjs` and wire it into the release gate so public pages cannot reopen email/payment/auth/register flows outside the whitelisted posts search. | Codex |
| v1.5.19 | 2026-05-14 | Wire `scripts/api-surface-qa.mjs` into the release gate for preview and production so API list/search stay metadata-only while detail and 404 contracts remain verified. | Codex |

---

## 11. Quy chiếu nhanh

### Tôi là Tech Lead, bắt đầu từ đâu?
1. Đọc `dsts-master-plan-v1.2-DRAFT.md` (toàn cảnh, Mục I-VIII vẫn áp dụng từ v1.1-LOCKED)
2. Đọc `DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md` (9 issues của em)
3. Setup branch `sprint-0/stop-the-bleeding`
4. Bắt tay Issue 01 → 09 theo thứ tự
5. Sau Sprint 0 done → đọc 7 Layer 1 spec + chờ Wave 2 (UI Mockup + Sponsors API + Events API + Sponsor Agreement) trước khi kickoff Layer 1 Tháng 9/2026

### Tôi là Content Writer, bắt đầu từ đâu?
1. Đọc Mục 7 của index này (trang chủ phải công bố gì)
2. Phối hợp Tech Lead về nội dung `about.html`, `program.html`, `donate.html`, `transparency.html`, `legal.html`
3. Soạn 6 bài cho `/data/posts.json` (cần cho Issue 03)
4. Soạn 3 bài có body đầy đủ cho `/data/content.json` (cần cho Issue 04)

### Tôi là Legal Advisor, bắt đầu từ đâu?
1. Đọc Mục 7 + Mục 8 của index này
2. Soạn 3 section trong `legal.html`: Terms, Refund, Privacy
3. Xác minh pháp nhân: Angel Edu Tam Foundation Inc + Thanh Tam Foundation VN
4. Trả lời founder về câu chữ legal entity disclosure cuối cùng

### Tôi là Operations, bắt đầu từ đâu?
1. Đọc tài liệu A6, A7, A8, A12 trong Drive (sub-folder Phía Sau Màn Nhung)
2. Xác nhận trạng thái sự kiện 22/01/2026 (đã chạy? đã dời? đã hủy?)
3. Cập nhật `DSTS_TOUR_CALENDAR_2026_2027.md` (khi Claude tạo)

### Tôi là Founder, bắt đầu từ đâu?
1. Re-lock `dsts-master-plan-v1.2-DRAFT.md` sau khi NDNUM v1.2-LOCKED (Wave 3)
2. Chỉ định Tech Lead + Content Writer
3. Trả lời 6 câu trong `GAP_ANALYSIS_V2_vs_v1.md` Mục VI để AI Assistant finalize Layer 1/2 spec
4. Trả lời **6 NDNUM decisions** trong `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục XVI (chặn Phase 0B + Wave 3)
5. Xác nhận trạng thái A7 sự kiện 2026-01-22 (chặn Wave 2 Tour Calendar lock)
6. Review + ký Gate 3 sau khi Sprint 0 hoàn thành

---

## 12. Kết luận

DSTS không phải web đơn lẻ — là **hệ sinh thái 3 layer** với:
- Vision Drive (Layer A) ✅ đã có
- Foundation Plan (Layer 0) 🔒 đã lock, đang chạy Sprint 0
- Movement Portal (Layer 1) 🟡 spec đang viết
- Star Journey OS (Layer 2) 🟡 spec đang viết

**Trang chủ phải nói rõ cả 3 layer** để cộng đồng + nhà tài trợ biết DSTS đang đi đâu.

**Founder lock 2026-05-12:** Sprint 0 trước, không mở rộng. Mọi tài liệu mới index ở đây.

---

*Tài liệu Master Index v1.0. Mọi sửa đổi phải qua PR + founder approve. Mọi tài liệu mới phải được thêm vào Mục 4 hoặc 5.*
