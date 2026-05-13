# NDNUM — Scope Trang Landing `/dream-nurture`

> **Mã tài liệu:** `NDNUM_PUBLIC_LANDING_PAGE_SCOPE_v1.0`
> **Trạng thái:** 🟡 DRAFT v1.0
> **Phiên bản:** v1.0-DRAFT
> **Ngày:** 2026-05-13
> **Owner:** Founder + Frontend Tech Lead
> **Phụ thuộc:** Phase 0B legal lock trước khi build
> **Tham chiếu:**
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` (program spec đầy đủ)
> - `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` (route `/dream-nurture`)
> - `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` Mục 4 (route architecture)

---

## MỤC LỤC

1. [Overview & Ràng buộc](#1)
2. [Mục tiêu trang](#2)
3. [Sections nội dung](#3)
4. [CTA được phép & bị cấm](#4)
5. [Yêu cầu dữ liệu & backend](#5)
6. [SEO & i18n](#6)
7. [Accessibility & Performance](#7)
8. [Acceptance Criteria](#8)
9. [DEV-READY — Implementation hooks](#9)

---

<a name="1"></a>
## 1. OVERVIEW & RÀNG BUỘC

### 1.1 Route & Vị trí

| Thuộc tính | Giá trị |
|---|---|
| Route | `/dream-nurture` |
| Tên trang (VI) | Nuôi Dưỡng Những Ước Mơ |
| Tên trang (EN) | Dream Nurture — DSTS Child Mentoring |
| Layer | Layer 1 (Movement Portal, Phase 1.2) |
| Launch gate | **Phase 0B legal lock PHẢI hoàn thành trước** |
| Earliest launch | Q4/2026 (sau Phase 0B T6-8/2026) |
| First cohort open | Q1/2027 |

### 1.2 Ràng buộc cứng trước khi build

- [ ] Phase 0B legal lock hoàn tất (CSO hired + Legal counsel signed)
- [ ] `NDNUM_CHILD_SAFETY_POLICY.md` v1.0 đã có CSO review
- [ ] `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` v1.0 đã có Legal review
- [ ] Pháp nhân Option A/B/C đã chọn (NDNUM Mục XVI Decision #1)
- [ ] `/api/newsletter/subscribe` endpoint đã live (Layer 0 scope)

### 1.3 Ngôn ngữ

- Tiếng Việt là primary (VI)
- Tiếng Anh là secondary (EN toggle, hoặc song ngữ inline cho các block ngắn)
- URL: `/dream-nurture` (EN slug, tương thích SEO diaspora)

---

<a name="2"></a>
## 2. MỤC TIÊU TRANG

| Mục tiêu | KPI | Ưu tiên |
|---|---|---|
| Communicate NDNUM vision cho potential supporters/mentors | Bounce rate < 60%, avg. time > 2 phút | P0 |
| Build waitlist email list | Email sign-up conversion ≥ 3% unique visitor | P0 |
| Build membership funnel | Click-through to `/membership` ≥ 1% | P1 |
| Build general fund donation | Click-through to `/donate` ≥ 1% | P1 |
| Communicate Phase 0B status (legal in progress) | 0 complaint "you misled me" from future donors | P0 |

**Mục tiêu KHÔNG phải:**
- Bán program membership trực tiếp trên trang này (Q1/2027)
- Nhận đăng ký tham gia của trẻ em (Q1/2027 earliest, sau Phase 0B)
- Thể hiện tên/ảnh trẻ em cụ thể nào

---

<a name="3"></a>
## 3. SECTIONS NỘI DUNG

### 3.1 Section 1 — Hero

**Component:** `MovementHeroProps` (xem `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md`)

| Element | VI | EN |
|---|---|---|
| Headline | Nuôi Dưỡng Những Ước Mơ | Dream Nurture — Dream Nurture Journey |
| Subheadline | Chương trình nuôi dưỡng tài năng trẻ Việt Nam toàn cầu | A long-term mentoring program for Vietnamese youth worldwide |
| Badge | Đang chuẩn bị · Phase 0B | Building · Phase 0B |
| Background | Dark gradient matching site palette (#0b111d) | - |
| CTA | [Đăng ký nhận tin] → email capture scroll-down | - |

**Quy tắc:** Không dùng ảnh trẻ em thật trên hero. Dùng illustration hoặc abstract art.

---

### 3.2 Section 2 — What is NDNUM (3-paragraph narrative)

**Mục tiêu:** Người đọc hiểu NDNUM trong 90 giây.

**Paragraph 1 — Problem:**
Hàng triệu trẻ em Việt — tại Việt Nam và cộng đồng diaspora toàn cầu — không thiếu tài năng nhưng thiếu hệ thống nâng đỡ liên tục, có trách nhiệm và an toàn.

**Paragraph 2 — Solution:**
NDNUM (Nuôi Dưỡng Những Ước Mơ) là chương trình mentoring dài hạn lấy cảm hứng từ mô hình Friends of the Children — với mentor có lương, background check, theo dõi trẻ từ tiểu học đến hết phổ thông, và guardian-first architecture bảo vệ quyền riêng tư của trẻ.

**Paragraph 3 — North Star:**
Đến năm 2030, NDNUM đặt mục tiêu đồng hành với 5,000 trẻ em, đào tạo 500 mentor và điều phối viên, với tổng ngân sách vận hành $100M — xây dựng từ nền tảng minh bạch, pháp lý rõ ràng và cộng đồng tin tưởng.

---

### 3.3 Section 3 — 5 Tầng Pyramid

**Dạng:** Visual pyramid (inline SVG hoặc CSS-drawn), responsive

| Tầng | Tên (VI) | Tên (EN) | Tuổi |
|---|---|---|---|
| Tầng 5 | Di Sản | Legacy | Alumni 18+ |
| Tầng 4 | Người Dẫn Đường | Guide | 40+ |
| Tầng 3 | Người Đang Tỏa Sáng | Rising Star | 25-50 |
| Tầng 2 | Bước Vào Đời | Stepping Up | 13-25 |
| **Tầng 1** | **Mầm Sáng** | **Dream Seed** | **5-12** ← guardian-first |

Mỗi tầng: icon nhỏ + 1 câu mô tả vai trò.

**Quy tắc:** Tầng 1 phải có badge "🔒 Guardian-first — bảo vệ quyền riêng tư" rõ ràng. Không ghi "đăng ký ngay".

---

### 3.4 Section 4 — 2030 North Star

**Dạng:** 2-column card grid (metrics + narrative)

| Năm | Ngân sách | Số trẻ em | Số mentor/coordinator |
|---|---|---|---|
| Y1 (2027) | $100K–500K | 20 (cohort thử nghiệm) | 5 coordinators |
| Y3 (2029) | $1M–3M | 200 | 40 |
| Y5 (2031) | $5M–10M | 1,000 | 200 |
| Y10 (2036) | $100M | 5,000 | 1,000 |

**Lưu ý:** Ghi rõ "Đây là mục tiêu — không phải cam kết. Kết quả thực tế sẽ được công bố minh bạch mỗi quý."

---

### 3.5 Section 5 — Program Phase Roadmap

**Dạng:** Horizontal timeline (responsive → vertical trên mobile)

```
Phase 0A          Phase 0B               Phase 1              Phase 2
(Đã xong)     (T6–8/2026)           (T9–12/2026)          (Q1/2027)
━━━━━━━━━━●━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━●
  Foundation    Legal + Child         Movement             First Cohort
  + Spec con     Safety Lock           Portal               Opens
                CSO + Legal          Sponsors +         20 trẻ đầu tiên
                                      Events              (apply-only)
```

**Quy tắc:** Phase 0B phải có "đang trong giai đoạn này" indicator. Phase 2 "First Cohort" phải ghi "Q1/2027 — apply process TBD".

---

### 3.6 Section 6 — Who We Are

**Dạng:** Founder bio card + "team being assembled" placeholder

- **Founder:** Trần Hà Tâm — bio 2-3 câu (anh tự viết), ảnh (nếu approve)
- **Team:** "Chúng tôi đang tuyển dụng Child Safety Officer, Program Coordinators, và Legal Counsel. [Xem cơ hội →]" (link đến `/ndnum/careers` khi có)
- **Advisory board:** "Đang xây dựng" — không list placeholder names

---

### 3.7 Section 7 — How to Support (3 CTA cards)

| Card | CTA Label | Link | Lane |
|---|---|---|---|
| Ủng hộ chương trình | Donate to General Fund | `/donate.html` | Lane B |
| Trở thành thành viên | Join Membership | `/membership` | Lane B membership |
| Nhận cập nhật | Đăng ký nhận tin | email capture (inline form) | Newsletter |

**Giao diện:** 3 card ngang (flex, responsive → stack mobile), mỗi card có icon, tiêu đề, 1-2 câu mô tả, CTA button.

**Quy tắc card ủng hộ:** Phải ghi "Quyên góp vào quỹ chung — không earmark cho trẻ em cụ thể. Mọi chi tiêu công khai tại `/transparency`."

---

### 3.8 Section 8 — Phase Status Banner

**Vị trí:** Dưới hero hoặc trên footer — nổi bật

**Nội dung:**

```
⚠️ Đang chuẩn bị hạ tầng pháp lý và an toàn trẻ em (Phase 0B)
NDNUM dự kiến mở cohort đầu tiên Q1/2027 sau khi:
✓ Hoàn tất đăng ký pháp nhân  ✓ Thuê Child Safety Officer
✓ Legal Counsel ký off  ✓ Hệ thống consent Guardian-first live

Để bảo vệ quyền lợi của trẻ em và người ủng hộ,
chúng tôi KHÔNG nhận đăng ký tham gia cho đến khi đủ điều kiện.
```

**Màu:** Amber/gold border, transparent background — không dùng màu đỏ (không phải error, là thông tin minh bạch).

---

### 3.9 Section 9 — FAQ

**6 câu hỏi:**

**Q1: NDNUM là gì?**
Chương trình mentoring dài hạn cho trẻ em Việt 5-12 tuổi (Mầm Sáng), lấy cảm hứng từ Friends of the Children. Mentor có lương, background check, theo dõi trẻ theo năm.

**Q2: Con tôi có thể tham gia không?**
Cohort đầu tiên dự kiến Q1/2027. Hiện tại, đăng ký email để nhận thông báo khi mở apply.

**Q3: Khi nào NDNUM mở?**
Sau khi Phase 0B hoàn tất (dự kiến T8/2026): đăng ký pháp nhân, thuê CSO, Legal counsel ký off, hệ thống consent live.

**Q4: Quyên góp hoạt động như thế nào?**
Donate vào General Fund (Lane B) — không earmark cho trẻ cụ thể. Chi tiêu công khai tại `/transparency/impact` mỗi quý.

**Q5: Quyên góp có được khấu trừ thuế không?**
Tùy quốc gia và tình trạng pháp nhân. Sau khi hoàn tất đăng ký pháp nhân (Decision #1 — Option A 501c3 hoặc B Hội VHNT VN), chúng tôi sẽ cập nhật cụ thể.

**Q6: Bạn bảo vệ dữ liệu trẻ em như thế nào?**
Guardian-first architecture: trẻ em không có account public. Child profile chỉ tồn tại nội bộ, gắn vào tài khoản phụ huynh. Tuân thủ COPPA (US), Luật Trẻ em VN 2016, NĐ 13/2023. Xem `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` hoặc `/legal.html` để biết thêm.

**UI:** Accordion collapse/expand, SEO-friendly (h3 + p, không dùng JS-only).

---

### 3.10 Section 10 — Footer links

```
© 2026 Đường Sao Tỏa Sáng (DSTS)
Trang chủ · Manifesto · Chính sách bảo mật · Liên hệ
```

---

<a name="4"></a>
## 4. CTA ĐƯỢC PHÉP & BỊ CẤM

### ✅ CTA được phép

| CTA | Destination | Điều kiện |
|---|---|---|
| Email sign-up (newsletter) | `/api/newsletter/subscribe` | Luôn được |
| Donate to General Fund | `/donate.html` | Luôn được |
| Join Membership | `/membership` | Khi `/membership` live |
| Learn about DSTS | `/` hoặc `/about.html` | Luôn được |
| View careers | `/ndnum/careers` | Khi page live |

### ❌ CTA bị cấm (TUYỆT ĐỐI KHÔNG đưa vào page)

| CTA bị cấm | Lý do | Mở được khi nào |
|---|---|---|
| "Đăng ký cho con tham gia" | Phase 0B chưa xong, CSO/Legal chưa sign | Q1/2027 sau Phase 0B + W3.6 locked |
| "Đăng ký làm mentor/coordinator" | Hiring process chưa chính thức | Sau Phase 0B + W3.4 locked |
| "Sponsor một trẻ em cụ thể" | Không có Coordinator-mediated flow | Sau W3.2 locked + Coordinator hired |
| "Ủng hộ cho em [tên]" | Không được tiết lộ identity trẻ | Never |
| "Chương trình đảm bảo..." | No outcome guarantees per Manifesto | Never |

---

<a name="5"></a>
## 5. YÊU CẦU DỮ LIỆU & BACKEND

### 5.1 Email sign-up

**Endpoint:** `POST /api/newsletter/subscribe`

```json
Request: { "email": "user@example.com", "source": "ndnum_landing" }
Response: { "ok": true, "message": "Subscribed" }
```

- Không cần D1 schema mới nếu dùng Resend audience list
- Nếu lưu local: thêm column `source TEXT` vào `newsletter_subscribers` (nếu table tồn tại)
- Fallback: nếu endpoint chưa live, hiển thị "Đăng ký thành công — chúng tôi sẽ liên hệ sớm" (client-side only + log error)

### 5.2 Không cần schema mới

Page này là static content. Không có D1 read/write ngoài email subscribe.

### 5.3 Trang là static HTML (Layer 1 bundle)

- Build như file `.html` trong Movement Portal bundle
- Không cần SSR
- Newsletter form: progressive enhancement (works without JS → graceful degradation)

---

<a name="6"></a>
## 6. SEO & i18n

### 6.1 Meta tags

```html
<title>Nuôi Dưỡng Những Ước Mơ — DSTS Child Mentoring Program | Đường Sao Tỏa Sáng</title>
<meta name="description"
  content="Chương trình nuôi dưỡng tài năng trẻ Việt Nam toàn cầu — guardian-first, mentor có lương, theo dõi K-12. Cohort đầu tiên Q1/2027.">
<meta property="og:title" content="NDNUM — Dream Nurture | Đường Sao Tỏa Sáng">
<meta property="og:description"
  content="Long-term mentoring for Vietnamese youth. Guardian-first. Salaried mentors. First cohort Q1/2027.">
<meta property="og:image" content="https://duongsaotoasang.com/og-ndnum.png"> <!-- create placeholder -->
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://duongsaotoasang.com/dream-nurture">
```

### 6.2 hreflang

```html
<link rel="alternate" hreflang="vi" href="https://duongsaotoasang.com/dream-nurture">
<link rel="alternate" hreflang="en" href="https://duongsaotoasang.com/dream-nurture?lang=en">
```

### 6.3 Structured data

```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Nuôi Dưỡng Những Ước Mơ (NDNUM)",
  "alternateName": "Dream Nurture",
  "description": "Long-term mentoring program for Vietnamese youth worldwide",
  "url": "https://duongsaotoasang.com/dream-nurture",
  "parentOrganization": { "@type": "Organization", "name": "Đường Sao Tỏa Sáng" }
}
```

### 6.4 i18n strategy

- Inline bilingual cho block ngắn (badge, CTA, disclaimer)
- Section heading: VI primary / EN secondary (smaller font, muted color)
- Toggle: `/dream-nurture?lang=en` sets `lang` query param, JS switches visible text
- SSR fallback: default VI (anh có thể override bằng `Accept-Language` header sau)

### 6.5 Keywords

- Primary: "nuôi dưỡng ước mơ trẻ em Việt", "NDNUM DSTS", "chương trình mentoring trẻ em Việt Nam"
- English: "Vietnamese youth mentoring program", "DSTS Dream Nurture", "Vietnamese diaspora children program"

---

<a name="7"></a>
## 7. ACCESSIBILITY & PERFORMANCE

### 7.1 WCAG 2.1 AA — checklist tối thiểu

- [ ] Heading hierarchy: `h1` (page title) → `h2` (section) → `h3` (FAQ questions)
- [ ] Color contrast ≥ 4.5:1 cho body text (gold #e0c896 trên #0b111d = 8.3:1 ✅)
- [ ] Keyboard navigation: pyramid, accordion FAQ, all CTAs
- [ ] `alt` text cho mọi img (nếu có)
- [ ] Form label liên kết với input
- [ ] `aria-expanded` cho accordion FAQ
- [ ] Skip link nếu có navigation header

### 7.2 Performance budget

| Metric | Target | Block deploy if |
|---|---|---|
| LCP | < 2.5s | > 4s |
| CLS | < 0.1 | > 0.25 |
| JS bundle | < 30KB (page mostly static) | > 100KB |
| CSS | < 20KB (reuse app.css) | > 60KB |
| Image total | < 400KB | > 1MB |
| Lighthouse Performance | ≥ 90 | < 80 |
| Lighthouse A11y | ≥ 95 | < 90 |

### 7.3 Mobile-first

- 320px: single column, CTA buttons full-width
- 375px: standard phone
- 768px: tablet — 2-column cards
- 1024px+: desktop — 3-column cards, pyramid wider

---

<a name="8"></a>
## 8. ACCEPTANCE CRITERIA

### 8.1 Content gate (trước khi publish)

- [ ] Phase Status Banner hiển thị rõ "Phase 0B đang tiến hành, Q1/2027 earliest cohort"
- [ ] Không có CTA "đăng ký con" (search `đăng ký.*con` trên HTML — phải 0 kết quả)
- [ ] Disclaimer legal rõ ràng: "NDNUM đang trong giai đoạn chuẩn bị pháp lý. Quyên góp vào General Fund — không earmark."
- [ ] 5 Tầng Pyramid hiển thị đúng, Tầng 1 có badge guardian-first
- [ ] Email sign-up form hoạt động (hoặc graceful degradation nếu endpoint chưa live)
- [ ] FAQ accordion: 6 câu hỏi, tất cả expand/collapse

### 8.2 Technical gate

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] axe DevTools: 0 critical issue
- [ ] `<title>` + `<meta description>` + `og:image` đều có
- [ ] Canonical URL đúng
- [ ] Mobile 375px không có horizontal scroll

### 8.3 Legal gate (trước launch, không block build)

- [ ] Phase 0B legal lock hoàn tất
- [ ] `NDNUM_CHILD_SAFETY_POLICY.md` có CSO review signature
- [ ] Disclaimer text được Legal Counsel approve

---

<a name="9"></a>
## 9. DEV-READY — IMPLEMENTATION HOOKS

### 9.1 File cần tạo

```
dream-nurture.html          ← static HTML page
og-ndnum.png                ← OG image 1200×630 (brand team)
```

### 9.2 Files cần đọc trước khi build

```
docs/dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md  ← program spec
docs/DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md               ← component specs
docs/DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md        ← privacy language
movement/coming-soon.html                            ← visual style reference (palette, CSS vars)
```

### 9.3 _redirects (thêm khi page live)

```
# Uncomment when dream-nurture.html built:
# /dream-nurture  /dream-nurture.html  200
# /ndnum          /dream-nurture.html  200
```

### 9.4 API endpoint cần

```
POST /api/newsletter/subscribe  ← Layer 0 scope (có thể dùng Resend audience list, không cần D1)
```

### 9.5 Dependencies

| Phụ thuộc | Status | Owner |
|---|---|---|
| Phase 0B legal lock | ⏳ Pending | Founder |
| `/api/newsletter/subscribe` | ⏳ Layer 0 backlog | Tech Lead |
| OG image `og-ndnum.png` | ⏳ Pending | Brand/Design |
| `NDNUM_CHILD_SAFETY_POLICY.md` CSO review | ⏳ Wave 3 → Phase 0B | CSO hire |

---

## CHANGELOG

| Phiên bản | Ngày | Tác giả | Ghi chú |
|---|---|---|---|
| v1.0-DRAFT | 2026-05-13 | Claude + Founder | Wave 3 W3.1 — initial scope spec |
