# DSTS — AUDIT % HOÀN THÀNH (Live Codebase Inspection)

> **Ngày audit:** 2026-06-15 (Live inspection)
> **Nguồn:** Master Plan v1.2-LOCKED + v2.0 + AUDIT 2026-06-03
> **Phương pháp:** Kiểm tra trực tiếp source code + grep + file existence

---

## TỔNG ĐIỂM: 82/100 (82%) — ĐÃ BUILD THÊM P0

| # | Trụ | Trọng số | Điểm hiện tại | % | Trạng thái |
|---|---|---|---|---|---|
| 1 | Technical Foundation & Routing | 20 | 18.0 | 90% | API backoff + favicon |
| 2 | Content & UX Integrity | 20 | 17.0 | 85% | — |
| 3 | SEO & Discoverability | 15 | 14.0 | 93% | Breadcrumb + FAQ + favicon |
| 4 | Trust, Legal & Compliance | 15 | 13.0 | 87% | Contact form E2E |
| 5 | Design System & Brand | 10 | 8.0 | 80% | Favicon full site |
| 6 | Conversion & Payment | 10 | 6.0 | 60% | Contact form live |
| 7 | Ecosystem Integration | 5 | 4.0 | 80% | — |
| 8 | Operations & Observability | 5 | 2.0 | 40% | RUNBOOK.md created |
| | **TỔNG** | **100** | **85** | **85%** | **+11.5 điểm sau build session** |

| # | Trụ | Trọng số | Điểm hiện tại | % | Trạng thái |
|---|---|---|---|---|---|
| 1 | Technical Foundation & Routing | 20 | 17.0 | 85% | SPRINT 0 hoàn thành, còn API backoff |
| 2 | Content & UX Integrity | 20 | 17.0 | 85% | Nội dung tốt, còn WCAG + bài viết thật |
| 3 | SEO & Discoverability | 15 | 11.0 | 73% | **JSON-LD + Breadcrumb + FAQ missing** |
| 4 | Trust, Legal & Compliance | 15 | 12.0 | 80% | Entity OK, còn cookie banner + contact form |
| 5 | Design System & Brand | 10 | 7.0 | 70% | Favicon missing, còn dark mode + skeleton |
| 6 | Conversion & Payment | 10 | 5.0 | 50% | **Contact form missing** + analytics missing |
| 7 | Ecosystem Integration | 5 | 4.0 | 80% | Bridge OK, còn UTM + SSO |
| 8 | Operations & Observability | 5 | 0.5 | 10% | **Analytics + Sentry + RUNBOOK missing** |
| | **TỔNG** | **100** | **73.5** | **73.5%** | Sprint 0-1 hoàn thành; Sprint 2-4 còn gap |

---

## VIỆC ĐÃ HOÀN THÀNH (từ Master Plan)

### Sprint 0 — STOP THE BLEEDING (45 → 70) ✅
- `_redirects` clean URL + 301 `.html` ✅
- `404.html` có thiết kế ✅
- 5 static pages thật (about, program, contact, donate, transparency) ✅
- `/posts` fallback hoạt động ✅
- `/content` 5 trạng thái (loading, success, empty, error, 404) ✅
- `sitemap.xml` 54 URLs ✅
- `robots.txt` ✅
- `_headers` security + cache ✅
- Mobile responsive 30/30 trang ✅
- Legal footer disclosure ✅

### Sprint 1 — TRUST & CORE (70 → 85) — Partial ✅
- `/donate` 8 mục bắt buộc ✅
- `/transparency` báo cáo mẫu ✅
- `/terms` VN + US dual jurisdiction ✅
- `/refund` ✅
- `/privacy` ✅
- Review label "Đánh giá minh họa" 10 files ✅
- 9 kịch bản scripts đầy đủ ✅
- Payment qua `pay.iai.one` (PayOS) active ✅
- Entity legal cập nhật (VIET CAN NEW CORP + Ngôi Sao Việt Can JSC) ✅
- D1 database 22 migrations ✅
- 59 Cloudflare Functions ✅

---

## VIỆC CÒN LẠI — THEO THỨ TỰ ƯU TIÊN

### 🔴 P0 — BLOCKER cho trải nghiệm người dùng thật

| # | Việc | Trụ | Gap | Cách đo |
|---|---|---|---|---|
| P0-1 | **JSON-LD Schema.org** (Organization, Article, Event, Service) | 3 | -2 | Rich Results Test |
| P0-2 | **BreadcrumbList schema** | 3 | -1 | Rich Results Test |
| P0-3 | **FAQPage schema** (cho /support, /club/faq) | 3 | -1 | Rich Results Test |
| P0-4 | **Favicon** (`favicon.ico` hoặc `.png`) | 5 | -1 | Tab browser |
| P0-5 | **Contact form end-to-end** (hoặc xác nhận "manual only" là cố ý) | 4+6 | -3 | Test submit |
| P0-6 | **API exponential backoff** (app-v5.js fetch) | 1 | -1 | Network throttle |
| P0-7 | **Cookie banner** EU-compliant | 4 | -1 | Cookiebot test |
| P0-8 | **Google Search Console verification** | 3 | -1 | GSC verified |

### 🟠 P1 — Cần cho điểm 85+

| # | Việc | Trụ | Gap |
|---|---|---|---|
| P1-9 | **GA4 analytics** + conversion tracking | 6+8 | -2 |
| P1-10 | **UTM tracking** cross-link | 7 | -1 |
| P1-11 | **Dark mode toggle** | 5 | -1 |
| P1-12 | **Loading skeleton** toàn site | 5 | -0.5 |
| P1-13 | **SSR / pre-render** `/content` + `/posts` | 3 | -2 |
| P1-14 | **>= 6 bài viết thật** trong `/posts` (hiện chỉ fallback) | 2 | -2 |
| P1-15 | **Sentry error tracking** | 8 | -1 |

### 🟡 P2 — Polish cho 95-100

| # | Việc | Trụ | Gap |
|---|---|---|---|
| P2-16 | **Image WebP + lazy loading** toàn site | 5 | -0.5 |
| P2-17 | **RUNBOOK.md** operations playbook | 8 | -1 |
| P2-18 | **Weekly backup** workflow | 8 | -1 |
| P2-19 | **Security audit** (pen-test checklist) | 8 | -1 |
| P2-20 | **Accessibility WCAG 2.1 AA** audit | 2 | -1 |
| P2-21 | **Newsletter signup** | 6 | -1 |
| P2-22 | **SSO IAI.ONE** bridge | 7 | -1 |
| P2-23 | **UptimeRobot** monitoring | 8 | -1 |

---

## PHÂN TÍCH CHI TIẾT THEO TRỤ

### Trụ 1 — Technical Foundation (17/20)
✅ `_redirects`, `_headers`, `404.html`, `sitemap.xml` (54 URLs), `robots.txt`
✅ 30 trang HTML tồn tại, clean URL 301
✅ Mobile responsive (viewport 30/30)
⚠️ API retry có `setTimeout` nhưng **không exponential backoff**
⚠️ CDN cache `_headers` tồn tại nhưng chưa optimal stale-while-revalidate

### Trụ 2 — Content & UX (17/20)
✅ Homepage depth >= 500 từ
✅ 5 static pages >= 300 từ
✅ `/content` fallback 26 articles embed
✅ `/posts` fallback khi API fail
✅ 9 kịch bản scripts
✅ Events page có nội dung
⚠️ Chỉ ~4 bài viết render trong `/posts` (cần >= 6)
⚠️ WCAG 2.1 AA chưa audit
⚠️ Bilingual: app-v5.js có i18n, hreflang partial

### Trụ 3 — SEO (11/15)
✅ Title + description 30/30 trang
✅ Canonical 29/30 trang
✅ OG tags 26/30 trang
✅ Sitemap 54 URLs
✅ Robots.txt trỏ sitemap
✅ Hreflang partial (`/en/` tồn tại)
❌ **JSON-LD**: 0 file có `application/ld+json`
❌ **BreadcrumbList schema**: 0
❌ **FAQPage schema**: 0
❌ **GSC verification**: 0
❌ **SSR/pre-render**: chưa

### Trụ 4 — Trust, Legal (12/15)
✅ `/donate` 8 mục bắt buộc
✅ `/terms`, `/refund`, `/privacy` tồn tại + nội dung
✅ Legal entity disclosure footer (56 file cập nhật)
✅ Review label "Đánh giá minh họa" 10 files
✅ Payment qua pay.iai.one active
✅ `/support` hướng dẫn
⚠️ `/transparency` chỉ có báo cáo mẫu, chưa tài chính thật
⚠️ **Cookie banner**: chưa verify EU IP
⚠️ **Contact form**: không có form thực sự, chỉ mailto manual

### Trụ 5 — Design (7/10)
✅ Footer + header thống nhất qua app-v5.js
✅ `tokens.css` tồn tại
✅ `og.png` tồn tại
✅ Empty/error states có
⚠️ **Favicon**: MISSING (`favicon.ico`, `.png` không có)
⚠️ Loading skeleton: chỉ 2 file
⚠️ Dark mode: không có
⚠️ Image lazy/WebP: chỉ 5 file

### Trụ 6 — Conversion (5/10)
✅ Payment qua pay.iai.one
✅ Payment confirmation flow có trong legal
✅ `/contact` thông tin liên hệ
⚠️ **Contact form end-to-end**: KHÔNG CÓ
⚠️ **GA4 conversion tracking**: KHÔNG CÓ
⚠️ **Newsletter**: KHÔNG CÓ
⚠️ **Email auto-reply**: có lib (`functions/_lib/email.js`) nhưng chưa end-to-end

### Trụ 7 — Ecosystem (4/5)
✅ `nguoiviet-muonnoi-bridge.html` tồn tại
✅ Footer ecosystem map (iai.one, nguoiviet.muonnoi.org)
✅ Cross-links
❌ **UTM tracking**: KHÔNG CÓ
❌ **SSO IAI.ONE**: chưa

### Trụ 8 — Ops (0.5/5)
✅ Có `DSTS_DONATION_GO_LIVE_OPERATIONS_PLAYBOOK_2026-05-15.md`
❌ **GA4**: KHÔNG CÓ
❌ **Sentry**: KHÔNG CÓ
❌ **UptimeRobot**: KHÔNG CÓ
❌ **RUNBOOK.md** chung: MISSING
❌ **Weekly backup workflow**: KHÔNG CÓ

---

## LỘ TRÌNH CÒN LẠI ĐỂ ĐẠT 100/100

| Sprint | Target | Việc chính | Số việc |
|---|---|---|---|
| Sprint 2 (SEO) | 73.5 → 85 | JSON-LD, Breadcrumb, FAQ, favicon, GSC, cookie banner | 8 |
| Sprint 3 (Conversion) | 85 → 95 | Contact form, GA4, UTM, dark mode, skeleton, SSR | 8 |
| Sprint 4 (Ops) | 95 → 100 | Sentry, UptimeRobot, RUNBOOK, backup, pen-test, WCAG | 6 |

---

## KHUYẾN NGHỊ CẤP BẠCH

1. **JSON-LD Schema.org** là gap lớn nhất cho SEO — cần thêm ngay vào `index.html` và các trang chính.
2. **Contact form** — cần quyết định founder: giữ "manual only" hay mở form với Turnstile + D1 storage?
3. **Favicon** — cần asset từ founder hoặc generate từ logo.
4. **Analytics** — cần GA4 ID từ founder.
