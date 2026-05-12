# DSTS — MASTER PLAN 100/100 — v1.1 FINAL (FOUNDER LOCK)

**Founder:** Trần Hà Tâm
**Phiên bản:** v1.1 FINAL (hợp nhất V2 + v1.0, đã áp dụng 5 điểm sửa Founder Lock)
**Ngày phát hành:** 2026-05-12
**Tình trạng hiện tại:** 45/100
**Mục tiêu:** 100/100 trong 4 tuần
**Trạng thái tài liệu:** 🔒 **FOUNDER LOCK** — không mở rộng sản phẩm trước khi Sprint 0 pass.
**Nguyên tắc bất biến:** *"Không bao giờ để một trang public hiện 'Đang tải...' mãi mãi."*

> **Tinh thần triển khai (V2):** *"Muốn đạt 100/100, không làm thêm trang đẹp nữa trước. Việc đúng nhất bây giờ là khóa routing + content fallback + contact/donate/transparency."*

---

## CHANGELOG v1.1 vs v1.0

5 điểm sửa Founder Lock đã áp dụng:

1. ✅ Định dạng ngày thống nhất `YYYY-MM-DD` (2026-05-12) toàn file
2. ✅ Roadmap sau 100/100 cập nhật thời gian thực: Tầng 2 = T6/2026, Tầng 3 = T7-8, Tầng 4 = T9-10, Tầng 5 = T11+
3. ✅ Sprint 0 chốt: **45 → tối thiểu 63, mục tiêu 70**
4. ✅ Legal entity: dùng câu chuẩn *"Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý"* cho đến khi xác minh xong VIET CAN NEW CORP / VFA
5. ✅ Donate test: đổi thành *"Test payment confirmation flow bằng giao dịch thử / manual confirmation"* vì chưa có Stripe/PayPal/Bank flow thật

---

## MỤC LỤC

- [I. Thang điểm 100/100](#i-thang-điểm-100100)
- [II. 6 Tầng khóa cứng](#ii-6-tầng-khóa-cứng)
- [III. Rubric 8 trụ](#iii-rubric-8-trụ)
- [IV. Kế hoạch 5 Sprint](#iv-kế-hoạch-5-sprint)
- [V. Code blocks ready-to-deploy](#v-code-blocks-ready-to-deploy)
- [VI. Approval Gates 3 bước](#vi-approval-gates-3-bước)
- [VII. Checklist nghiệm thu 100/100](#vii-checklist-nghiệm-thu-100100)
- [VIII. 7 Nguyên tắc bất biến](#viii-7-nguyên-tắc-bất-biến)
- [IX. Roadmap sau 100/100](#ix-roadmap-sau-100100)
- [X. Phê duyệt founder](#x-phê-duyệt-founder)

---

## I. THANG ĐIỂM 100/100

```
Hiện tại (2026-05-12):                       45/100  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 45%
Sau Sprint 0 (3 ngày):  min 63, target 70    63-70   ████████████████████████████████░░░░░░░░░░░░ 63-70%
Sau Sprint 1 (4 ngày):  trust + legal        85      █████████████████████████████████████████████░ 85%
Sau Sprint 2 (1 tuần):  SEO + standardize    95      ███████████████████████████████████████████████ 95%
Sau Sprint 3 (1 tuần):  polish + a11y        98      ████████████████████████████████████████████████ 98%
Sau Sprint 4 (1 tuần):  ops + launch         100     ████████████████████████████████████████████████ 100% ✅
```

---

## II. 6 TẦNG KHÓA CỨNG

6 điều kiện cần (necessary conditions) để gọi là đạt 100/100. **Thiếu một tầng = chưa đạt.**

### Tầng 1 — Không còn trang chết (P0)
Mọi URL public phải thuộc 1 trong 3 trạng thái: `200 OK` / `301 redirect đúng` / `404 có thiết kế`.

```
KHÔNG được phép:
✗ 404 trên route công khai chính
✗ Loading vĩnh viễn
✗ Redirect sai sang /content
✗ CTA dẫn vào trang lỗi
```

### Tầng 2 — Routing sạch toàn site (P0)
File `_redirects` chuẩn hóa + `404.html` có thiết kế.

### Tầng 3 — Content system có fallback (P0)
Mọi trang dynamic xử lý đủ **5 trạng thái**: loading, success, empty, error, not found. Có file fallback tĩnh local (`/data/posts.json`, `/data/content.json`).

### Tầng 4 — Trust, payment, legal (P1)
Vì site có gói giá cao (25,000 USD), bắt buộc đủ: Terms, Refund, Privacy, Payment confirmation flow, Invoice, Support, Legal entity disclosure (hoặc câu thay thế xác minh pháp lý), Manual review status.

### Tầng 5 — Review & comment an toàn (P1)
Review mẫu phải gắn nhãn rõ. Comment thật phải có moderation flow + anti-spam.

### Tầng 6 — SEO, sitemap, robots, canonical (P2)
`sitemap.xml`, `robots.txt`, `_headers`, canonical clean URL, 1 H1 mỗi page, schema.org, OG tags đúng.

---

## III. RUBRIC 8 TRỤ

Đo bằng chứng khách quan, không cảm tính.

| # | Trụ | Trọng | Hiện tại | Sau Sprint 0 | Sau Sprint 4 |
|---|---|---|---|---|---|
| 1 | Technical Foundation & Routing | 20đ | 5 | 18 | 20 |
| 2 | Content & UX Integrity | 20đ | 12 | 17 | 20 |
| 3 | SEO & Discoverability | 15đ | 3 | 5 | 15 |
| 4 | Trust, Legal & Compliance | 15đ | 2 | 5 | 15 |
| 5 | Design System & Brand | 10đ | 7 | 8 | 10 |
| 6 | Conversion & Payment | 10đ | 4 | 6 | 10 |
| 7 | Ecosystem Integration | 5đ | 2 | 3 | 5 |
| 8 | Operations & Observability | 5đ | 1 | 1 | 5 |
| | **TỔNG** | **100đ** | **45** | **min 63, target 70** | **100** |

### Trụ 1 — Technical Foundation & Routing (20đ)
| Sub | Đ | Cách đo |
|---|---|---|
| 100% URL public trả 200/301/404 đúng | 5 | Smoke test bash crawler |
| `/content?slug=` xử lý đủ 5 trạng thái | 3 | Test 5 case thủ công |
| `/posts` có fallback hoạt động khi API fail | 2 | Disable network → vẫn render |
| Dynamic page timeout ≤ 5s, không loading vĩnh viễn | 3 | Manual stopwatch |
| Clean URL nhất quán + 301 cũ về mới | 2 | Crawl 0 URL `.html` lộ |
| `_redirects` + `_headers` + `404.html` đầy đủ | 2 | Đọc cấu hình |
| Mobile responsive 6 breakpoint (320/375/414/768/1024/1920) | 3 | DevTools test |

### Trụ 2 — Content & UX Integrity (20đ)
| Sub | Đ | Cách đo |
|---|---|---|
| Mọi trang nav có nội dung thật | 4 | Audit từng trang |
| 100% link homepage 200 + đúng đích | 3 | Link checker |
| Mọi CTA dẫn đến next step rõ | 2 | UX walkthrough |
| ≥ 6 bài viết thật trong `/posts` | 3 | Đếm |
| ≥ 9 kịch bản detail đầy đủ (đang OK) | 2 | Đếm |
| ≥ 3 sự kiện có ngày/giờ/địa điểm | 2 | Đếm |
| Fallback nội dung mẫu khi API rỗng | 2 | Force empty test |
| WCAG 2.1 AA pass | 2 | axe DevTools |

### Trụ 3 — SEO & Discoverability (15đ)
| Sub | Đ | Cách đo |
|---|---|---|
| `sitemap.xml` auto generate | 2 | Truy cập + đếm |
| `robots.txt` đúng + trỏ sitemap | 1 | Truy cập |
| Canonical đúng URL từng trang | 3 | View source |
| Meta title (50-60) + description (150-160) riêng | 2 | View source |
| OG + Twitter Card đúng từng trang | 2 | OG debugger |
| Schema.org JSON-LD (Article, Event, Org, Service) | 2 | Rich Results Test |
| SSR / pre-render cho `/content` và `/posts` | 2 | curl thấy text |
| Submit + index trên Google Search Console | 1 | Console verified |

### Trụ 4 — Trust, Legal & Compliance (15đ)
| Sub | Đ | Cách đo |
|---|---|---|
| `/donate` đầy đủ 8 mục bắt buộc | 3 | Checklist |
| `/transparency` có báo cáo mẫu | 2 | Checklist |
| `/terms` công bố + có ngày | 2 | URL 200 |
| `/refund` công bố | 2 | URL 200 |
| `/privacy` + cookie banner | 2 | URL 200 |
| Legal entity disclosure trong footer (hoặc câu thay thế xác minh pháp lý) | 1 | Footer |
| Reviews mẫu gắn nhãn "Đánh giá minh họa" | 1 | Trang script |
| Kênh khiếu nại/support rõ ràng | 2 | `/contact` form + email + Zalo |

### Trụ 5–8 (rút gọn)

- **Design System (10đ):** footer/header thống nhất, `tokens.css`, favicon/OG, empty/error states, loading skeleton, image WebP/lazy.
- **Conversion (10đ):** form `/contact`, payment confirmation flow, order ID tự động, email auto-reply, GA conversion tracking, newsletter.
- **Ecosystem (5đ):** `nguoiviet.muonnoi` 200, SSO IAI.ONE (tùy), footer map, UTM cross-link.
- **Ops (5đ):** Analytics, Sentry, UptimeRobot, weekly backup, `RUNBOOK.md`.

---

## IV. KẾ HOẠCH 5 SPRINT

### 🚨 SPRINT 0 — STOP THE BLEEDING (3 ngày, 45 → **min 63, target 70**)

> Tinh thần V2: Cứu site khỏi lỗi chết. Không sửa cảm tính.

#### Ngày 1 — Cứu site khỏi lỗi chết

```
1. _redirects final
2. 404.html
3. about.html
4. program.html
5. contact.html
6. donate.html
7. transparency.html
8. posts.html fallback
9. content.html fallback (5 states)
```

#### Ngày 2 — Khóa niềm tin

```
1. legal.html (gộp hoặc tách Terms + Refund + Privacy)
2. payment-confirmation.html
3. refund section
4. privacy section
5. review sample label
6. sửa toàn bộ CTA trang chủ
```

#### Ngày 3 — Khóa production

```
1. sitemap.xml
2. robots.txt
3. _headers (security + cache)
4. canonical clean URL từng page
5. mobile test 6 breakpoint
6. Lighthouse audit
7. full route smoke test
```

**Gate Sprint 0 (Founder):**
- [ ] Demo `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → bài viết thật hoặc fallback
- [ ] Demo `/posts` → danh sách card
- [ ] Click 100% link homepage → không trang nào lỗi
- [ ] Smoke test bash trả 0 lỗi
- [ ] Founder ký OK → mở Sprint 1

---

### 🟠 SPRINT 1 — TRUST & FINISH CORE (4 ngày, → 85)

1. Hoàn thiện `/donate` đầy đủ 8 mục
2. Hoàn thiện `/transparency` báo cáo Q1/2026
3. `/terms`, `/refund`, `/privacy` chuẩn VN + US
4. Gắn nhãn review mẫu trên `/scripts/*`
5. Form `/contact` end-to-end (Turnstile + auto-reply)
6. Disclaimer payment trên mỗi `/scripts/*`:
   > *"Đây là quy trình xác nhận thủ công. Thanh toán chỉ được xử lý sau xác minh. Không cam kết nổi tiếng, doanh thu, thành công hay kết quả truyền thông."*
7. Footer thống nhất

**Gate Sprint 1:**
- [ ] Founder ký Terms/Refund/Privacy
- [ ] Test gửi `/contact` → có email về
- [ ] **Test payment confirmation flow bằng giao dịch thử / manual confirmation** (KHÔNG dùng Stripe/PayPal cho đến khi có)
- [ ] Disclaimer trên cả 9 trang scripts

---

### 🟡 SPRINT 2 — SEO & STANDARDIZE (1 tuần, → 95)

1. Canonical + Meta tags chuẩn từng trang
2. Sitemap.xml + Robots.txt auto-generate
3. Schema.org JSON-LD (Org, Article, Event, Service)
4. SSR / pre-render cho `/content` + `/posts`
5. Clean URL canonicalization
6. Submit Google Search Console + Bing

**Gate:**
- [ ] GSC verified + sitemap submitted
- [ ] Rich Results Test pass
- [ ] curl `/content?slug=...` thấy HTML có text

---

### 🟢 SPRINT 3 — POLISH & PERFORMANCE (1 tuần, → 98)

1. Design tokens `tokens.css`
2. Loading skeleton everywhere
3. Image WebP + lazy + srcset → Lighthouse Perf ≥ 90
4. Mobile audit 6 breakpoint
5. Accessibility WCAG AA

**Gate:**
- [ ] Lighthouse 4 mục ≥ 90
- [ ] Founder test iPhone + Android thật

---

### 🏁 SPRINT 4 — LAUNCH READINESS (1 tuần, → 100)

1. Fix `nguoiviet.muonnoi.org` (502 hoặc ẩn link)
2. Analytics + Sentry
3. UptimeRobot + `RUNBOOK.md`
4. Footer ecosystem map
5. Weekly backup GitHub Actions

**Gate FINAL:**
- [ ] Founder review 5 thiết bị
- [ ] Smoke test 100% URL pass
- [ ] Lighthouse 4 mục ≥ 95
- [ ] Founder ký **"PUBLIC LAUNCH READY"** 🚀

---

## V. CODE BLOCKS READY-TO-DEPLOY

### V.1 — `_redirects` (Cloudflare Pages)

```
# === DSTS Routing v1.1 FINAL ===
# Cloudflare Pages tự strip .html, KHÔNG cần rewrite rule clean URL→.html
# Chỉ cần redirect rules cho legacy + special

# Legacy plural
/programs             /program                         301

# Force clean URL từ .html (cho external link cũ)
/about.html           /about                           301
/program.html         /program                         301
/contact.html         /contact                         301
/donate.html          /donate                          301
/transparency.html    /transparency                    301
/legal.html           /legal                           301
/posts.html           /posts                           301
/events.html          /events                          301
/scripts.html         /scripts                         301
/terms.html           /terms                           301
/refund.html          /refund                          301
/privacy.html         /privacy                         301

# Scripts detail
/scripts/rising-entrepreneur.html     /scripts/rising-entrepreneur     301
/scripts/global-artist.html           /scripts/global-artist           301
/scripts/singing-icon.html            /scripts/singing-icon            301
/scripts/cinematic-actor.html         /scripts/cinematic-actor         301
/scripts/the-thinker.html             /scripts/the-thinker             301
/scripts/creative-leader.html         /scripts/creative-leader         301
/scripts/cultural-ambassador.html     /scripts/cultural-ambassador     301
/scripts/dsts-legacy.html             /scripts/dsts-legacy             301
/scripts/global-story.html            /scripts/global-story            301

# Content
/content.html         /content                         301
```

### V.2 — `_headers` (security + cache)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/*
  Cache-Control: public, max-age=300, must-revalidate

/*.html
  Cache-Control: public, max-age=300, must-revalidate
```

### V.3 — `loadContent()` 5 trạng thái + V.4 `loadPosts()` fallback + V.5 disclaimer payment + V.6 `/data/posts.json` mẫu

(Đã có chi tiết trong Founder Plan — đưa vào DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md)

---

## VI. APPROVAL GATES 3 BƯỚC

```
┌─────────────────────┐
│ GATE 1: PRE-SPRINT  │  Founder duyệt scope + deliverables
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ DEV THỰC THI        │  Branch riêng, không commit thẳng main
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ GATE 2: PR REVIEW   │  Tech Lead review code + test pass
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ GATE 3: FOUNDER QA  │  Anh Tâm test ≥ 2 thiết bị thật
└──────────┬──────────┘
           ▼
       MERGE MAIN
```

---

## VII. CHECKLIST NGHIỆM THU 100/100

### A. Routing & 404 (Tầng 1+2)
```
[ ] Không URL public nào 404 ngoài 404 cố ý
[ ] Không trang nào loading vĩnh viễn
[ ] Homepage không dẫn đến link lỗi
[ ] _redirects đúng cú pháp Cloudflare
[ ] 404.html có thiết kế, có CTA về home
[ ] URL random → 404 + trang đẹp
```

### B. Content & Fallback (Tầng 3)
```
[ ] /posts có fallback từ /data/posts.json
[ ] /content?slug=... có fallback từ /data/content.json
[ ] Disable network → /posts vẫn render
[ ] API trả 500 → /content vẫn render fallback
[ ] Slug không tồn tại → render not-found đẹp, không stuck loading
[ ] Loading skeleton thay text "Đang tải..."
```

### C. Trust & Legal (Tầng 4)
```
[ ] /donate có đủ 8 mục bắt buộc
[ ] /transparency có ≥ 1 báo cáo
[ ] /terms, /refund, /privacy đều 200 + có ngày cập nhật
[ ] Footer mọi trang có legal entity hoặc câu thay thế xác minh pháp lý
[ ] Cookie banner GDPR-compliant
[ ] Mọi /scripts/* có payment disclaimer đầy đủ
[ ] Reviews mẫu được gắn nhãn "Đánh giá minh họa"
[ ] /contact có form gửi email + auto-reply + Turnstile
```

### D. SEO (Tầng 6)
```
[ ] sitemap.xml mở 200, ≥ 25 URL
[ ] robots.txt mở 200, có "Sitemap:"
[ ] 100% trang canonical đúng URL của chính nó
[ ] 100% trang title (50-60) + description (150-160) riêng
[ ] 100% trang đúng 1 thẻ <h1>
[ ] OG image render đúng trên Facebook Debugger
[ ] Schema.org pass Rich Results cho Article + Event + Org + Service
[ ] view-source /content?slug=... thấy text bài viết (SSR)
[ ] GSC verified + sitemap submitted
```

### E. Design & Performance
```
[ ] Lighthouse Performance ≥ 90
[ ] Lighthouse Accessibility ≥ 95
[ ] Lighthouse Best Practices ≥ 95
[ ] Lighthouse SEO ≥ 95
[ ] Mobile 6 breakpoint pass
[ ] Chrome + Safari + Firefox + Edge OK
[ ] iPhone + Android + iPad OK
[ ] Ảnh WebP + lazy load
[ ] Footer + header thống nhất 100% trang
```

### F. Conversion
```
[ ] Form /contact gửi email + auto-reply
[ ] Test payment confirmation flow bằng giao dịch thử / manual confirmation
[ ] Order ID tự động sinh (khi có payment processor)
[ ] CTA chính có GA event
[ ] Newsletter confirm email (nếu có)
```

### G. Ecosystem
```
[ ] nguoiviet.muonnoi.org trả 200
[ ] Footer map có IAI.ONE, vetuonglai, visamuonnoi, phuongdong
[ ] Cross-link UTM tracking
```

### H. Ops
```
[ ] GA4 hoặc Plausible đang chạy
[ ] Sentry capture lỗi JS thật
[ ] UptimeRobot ping 5 URL × 5 phút
[ ] RUNBOOK.md trong repo
[ ] Weekly backup chạy lần đầu thành công
[ ] Security headers không làm gãy JS
```

---

## VIII. 7 NGUYÊN TẮC BẤT BIẾN

1. **Không bao giờ để trang public hiện "Đang tải..." mãi mãi.** Timeout ≤ 5s + fallback bắt buộc.
2. **Không bao giờ có link gãy trên homepage.** CI/CD link-check.
3. **Không bao giờ duplicate canonical.** Mỗi URL có 1 canonical trỏ về chính nó.
4. **Không bao giờ commit credential vào repo.** Secret manager bắt buộc.
5. **Không bao giờ deploy thẳng `main` khi chưa PR review.**
6. **Mọi nội dung hiển thị giá > 1,000 USD phải có Terms + Refund + Disclaimer payment đi kèm.**
7. **Reviews tĩnh phải có nhãn "Đánh giá minh họa"** đến khi có D1 storage thật.

---

## IX. ROADMAP SAU 100/100

Đạt 100/100 = trạng thái **sẵn sàng launch**, không phải đích cuối. Ngày tham chiếu: 2026-05-12. Public launch dự kiến: **2026-06-10** (cuối tuần 5).

### Tầng 2 (Tháng 6/2026)
- CMS admin (Notion API hoặc Sanity)
- Member system: đăng ký, login, profile
- Newsletter automation
- Blog editor cho founder

### Tầng 3 (Tháng 7–8/2026)
- Community forum
- Event registration với payment
- Membership tier (free / premium / patron)
- Tích hợp SSO với IAI.ONE (khi `app.muonnoi.org` ready)

### Tầng 4 (Tháng 9–10/2026)
- Mobile app (PWA hoặc React Native)
- API public cho ecosystem partners
- Analytics dashboard riêng cho founder
- Multi-language (Việt / Anh)

### Tầng 5 (Từ Tháng 11/2026)
- DSTS thành nền tảng vận hành thật: Script Journey với CRM, contract, milestone tracking
- Tích hợp Phương Đông super app
- Cross-promote Người Việt Muôn Nơi
- DSTS Legacy archive

---

## X. PHÊ DUYỆT FOUNDER

Trước khi team dev bắt đầu Sprint 0, anh Tâm cần ký:

```
[ ] Đồng ý thang điểm 45 → 63-70 → 85 → 95 → 98 → 100 ở Mục I
[ ] Đồng ý 6 tầng khóa cứng ở Mục II
[ ] Đồng ý rubric 8 trụ ở Mục III
[ ] Đồng ý timeline 4 tuần × 5 sprint ở Mục IV
[ ] Đồng ý code blocks ready-to-deploy ở Mục V
[ ] Đồng ý approval gate 3 bước ở Mục VI
[ ] Đồng ý 7 nguyên tắc bất biến ở Mục VIII

NHÂN SỰ
[ ] Chỉ định Tech Lead (chịu trách nhiệm 4 tuần)
[ ] Chỉ định người soạn Terms/Refund/Privacy
[ ] Chỉ định designer cho Sprint 3
[ ] Chỉ định budget tools: Sentry, UptimeRobot, Cloudflare Pro (nếu cần)

LEGAL
[ ] Xác minh pháp nhân (VIET CAN NEW CORP / VFA) — hoặc dùng câu thay thế đến khi xác minh xong:
    "Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý."
[ ] Quyết định payment processor (Stripe/PayPal/Bank manual) — Sprint 0/1 vẫn dùng manual confirmation

BƯỚC TIẾP THEO SAU PHÊ DUYỆT
[ ] Em (Claude) đã tách Sprint 0 thành 9 ticket — xem DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md
[ ] Team dev nhận ticket → bắt đầu Ngày 1
```

**Founder ký:** _______________________
**Ngày:** _______________________
**Tech Lead ký:** _______________________
**Ngày:** _______________________

---

## TÓM TẮT 1 ĐOẠN

Hiện tại site **45/100** (2026-05-12). Đạt **100/100** trong **4 tuần** qua **5 sprint**:

> **Sprint 0 (3 ngày):** Cứu site khỏi lỗi chết — routing, fallback, contact/donate/transparency. **→ min 63, target 70**
>
> **Sprint 1 (4 ngày):** Khóa niềm tin — legal, payment disclaimer (manual confirmation), review label. **→ 85**
>
> **Sprint 2 (1 tuần):** SEO + standardize — sitemap, canonical, schema, SSR. **→ 95**
>
> **Sprint 3 (1 tuần):** Polish — tokens, skeleton, image, mobile, a11y. **→ 98**
>
> **Sprint 4 (1 tuần):** Launch-ready — analytics, sentry, uptime, runbook. **→ 100** 🚀

**Nguyên tắc cốt lõi (V2):** *"Không làm thêm trang đẹp nữa trước. Việc đúng nhất là khóa routing + content fallback + contact/donate/transparency."*

---

*Tài liệu v1.1 FINAL. 🔒 Founder Lock — không mở rộng sản phẩm trước khi Sprint 0 pass. Mọi điều chỉnh phải qua founder phê duyệt và bump version v1.2. Mọi sprint deliverable phải đối chiếu lại tài liệu này trước khi báo "xong".*
