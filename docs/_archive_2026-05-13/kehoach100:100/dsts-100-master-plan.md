# DSTS — KẾ HOẠCH HOÀN THIỆN TOÀN BỘ WEBSITE — CHUẨN 100/100

**Founder:** Trần Hà Tâm
**Ngày phát hành:** 12/05/2026
**Phiên bản:** v1.0 (master plan)
**Tình trạng hiện tại:** ~45/100 (theo audit gần nhất)
**Mục tiêu:** Đạt 100/100 trong 5 sprint (4–6 tuần) trước khi mở campaign public chính thức
**Nguyên tắc bất biến:** *"Không bao giờ để một trang công khai hiện 'Đang tải...' mãi mãi."*

---

## I. HỆ THỐNG CHẤM ĐIỂM 100/100 — RUBRIC CHÍNH THỨC

Điểm 100 được chia thành **8 trụ** để đo bằng chứng khách quan, không cảm tính. Mỗi trụ có sub-criteria và cách đo cụ thể.

| # | Trụ chấm điểm | Trọng số | Hiện tại | Mục tiêu |
|---|---|---|---|---|
| 1 | Technical Foundation & Routing | 20đ | 5 | 20 |
| 2 | Content & UX Integrity | 20đ | 8 | 20 |
| 3 | SEO & Discoverability | 15đ | 3 | 15 |
| 4 | Trust, Legal & Compliance | 15đ | 2 | 15 |
| 5 | Design System & Brand | 10đ | 7 | 10 |
| 6 | Conversion & Payment | 10đ | 4 | 10 |
| 7 | Ecosystem Integration | 5đ | 2 | 5 |
| 8 | Operations & Observability | 5đ | 1 | 5 |
| | **TỔNG** | **100đ** | **~32** | **100** |

> *(Hiện tại em ước lượng lại ~32/100 chứ không phải 45 — vì khi gộp đủ 8 trụ thì các trụ legal, ops, observability gần như chưa có gì.)*

---

### Trụ 1 — Technical Foundation & Routing (20đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| Tất cả route public trả 200 / 301 / 404 đúng nghĩa | 5 | Smoke test 100% URL trên sitemap |
| `/content?slug=` xử lý đủ 5 trạng thái (loading, success, empty, error, not found) | 3 | Test thủ công 5 case |
| `/posts` có fallback local hoạt động khi API fail | 2 | Disable network → vẫn render |
| Mọi dynamic page có timeout < 5s, không loading vĩnh viễn | 3 | Lighthouse + manual stopwatch |
| URL clean (không `.html`) thống nhất + 301 cũ về mới | 2 | Crawl toàn site → 0 URL `.html` lộ ra |
| `_redirects` + `_headers` + `404.html` đầy đủ | 2 | Đọc cấu hình Cloudflare Pages |
| Mobile responsive 100% (320px – 1920px) | 3 | DevTools toolbar test 6 breakpoint |

### Trụ 2 — Content & UX Integrity (20đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| Mọi trang trong nav có nội dung thật (không placeholder rỗng) | 4 | Audit từng trang |
| Mọi link trên homepage trả 200 + đến đúng đích | 3 | Crawler |
| Mọi CTA dẫn đến next step rõ ràng | 2 | UX walkthrough |
| Có ≥ 6 bài viết thật trong `/posts` | 3 | Đếm |
| Có ≥ 9 kịch bản với detail đầy đủ (hiện đang OK) | 2 | Đếm |
| Có ≥ 3 sự kiện cụ thể với ngày/giờ/địa điểm | 2 | Đếm |
| Có nội dung mẫu trên mọi list khi API rỗng | 2 | Force API empty → kiểm tra |
| Accessibility WCAG 2.1 AA pass | 2 | axe DevTools |

### Trụ 3 — SEO & Discoverability (15đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| `sitemap.xml` đầy đủ + auto generate | 2 | Truy cập + đếm URL |
| `robots.txt` đúng cú pháp + cho phép crawl | 1 | Truy cập |
| Mỗi trang có canonical đúng URL của chính nó | 3 | View source mỗi page |
| Mỗi trang có meta title + description riêng | 2 | View source |
| OG tags + Twitter Card đúng từng trang | 2 | OG debugger |
| Schema.org JSON-LD (Article, Event, Organization) | 2 | Google Rich Results Test |
| SSR / pre-render cho `/content` và `/posts` | 2 | View source → thấy nội dung |
| Submit + index trên Google Search Console | 1 | Console verified |

### Trụ 4 — Trust, Legal & Compliance (15đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| Trang `/donate` có nội dung đầy đủ 8 mục bắt buộc | 3 | Checklist |
| Trang `/transparency` có ít nhất 1 báo cáo mẫu | 2 | Checklist |
| Terms of Service công bố | 2 | URL `/terms` 200 |
| Refund Policy công bố | 2 | URL `/refund` 200 |
| Privacy Policy + cookie banner | 2 | URL `/privacy` 200 |
| Legal entity disclosure (VFA / VIET CAN NEW CORP) trong footer | 1 | Đọc footer |
| Reviews mẫu được gắn nhãn "Đánh giá minh họa" | 1 | Đọc trang script |
| Có kênh khiếu nại / hỗ trợ rõ ràng | 2 | `/contact` có form + email + phone |

### Trụ 5 — Design System & Brand (10đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| Footer + Header thống nhất toàn site | 2 | Visual review |
| Color tokens + typography tokens được export | 2 | CSS file `tokens.css` |
| Logo + favicon + OG image chuẩn | 1 | View favicon, OG |
| Empty states + Error states có design thống nhất | 2 | Visual review |
| Loading skeleton thay text "Đang tải..." | 1 | Network throttle test |
| Image optimization (WebP, lazy load, responsive) | 2 | Lighthouse |

### Trụ 6 — Conversion & Payment (10đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| `/contact` có form hoạt động (gửi email được) | 2 | Test gửi |
| Có ít nhất 1 payment confirmation flow | 3 | E2E thử |
| Order ID / mã giao dịch tự động sinh | 2 | Test |
| Email tự động sau khi user gửi form | 1 | Test inbox |
| CTA chính trên homepage có conversion tracking | 1 | GA4 / Plausible event |
| Newsletter subscribe hoạt động | 1 | Test gửi |

### Trụ 7 — Ecosystem Integration (5đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| Link `nguoiviet.muonnoi.org` trả 200 (fix 502) | 2 | Curl |
| SSO / shared auth với IAI.ONE (nếu khả thi giai đoạn này) | 1 | Đăng nhập thử |
| Footer có map các site trong hệ sinh thái VFA | 1 | Footer review |
| Cross-link giữa DSTS ↔ Người Việt Muôn Nơi có UTM tracking | 1 | URL query |

### Trụ 8 — Operations & Observability (5đ)

| Sub-criteria | Điểm | Cách đo |
|---|---|---|
| Analytics gắn (GA4 hoặc Plausible) | 1 | Inspect script |
| Error logging (Sentry hoặc tương đương) | 1 | Inspect script |
| Uptime monitoring (UptimeRobot / Better Stack) | 1 | Dashboard có |
| Backup data + content tự động hằng tuần | 1 | Script `cron` |
| Runbook xử lý sự cố cho team | 1 | File `RUNBOOK.md` |

---

## II. KẾ HOẠCH 5 SPRINT — TỪ 32 → 100

### 🚨 SPRINT 0 — STOP THE BLEEDING (Ngày 1–3, **mục tiêu +25đ**)

**Tinh thần:** Sửa chết trang. Không một URL public nào được phép trả 404, redirect sai, hoặc loading vĩnh viễn sau sprint này.

**Deliverables bắt buộc:**

1. **Sửa routing toàn site** (Trụ 1 — +8đ)
   - File `_redirects` chuẩn hóa cho Cloudflare Pages:
     ```
     /about         /about.html         200
     /program       /program.html       200
     /programs      /program            301
     /contact       /contact.html       200
     /posts         /posts.html         200
     /scripts       /scripts.html       200
     /events        /events.html        200
     /donate        /donate.html        200
     /transparency  /transparency.html  200
     /content       /content.html       200
     /*             /404.html           404
     ```
   - Tạo `404.html` design đúng brand.

2. **Sửa `/content?slug=` xử lý đủ 5 trạng thái** (Trụ 1 — +3đ)
   ```javascript
   async function loadContent(slug) {
     if (!slug) { location.href = '/posts'; return; }
     showSkeleton();
     try {
       const ctrl = new AbortController();
       const t = setTimeout(() => ctrl.abort(), 5000);
       const res = await fetch(`/api/content?slug=${slug}`, { signal: ctrl.signal });
       clearTimeout(t);
       if (res.status === 404) return renderNotFound(slug);
       if (!res.ok) throw new Error('API_FAIL');
       const data = await res.json();
       if (!data || !data.body) return renderFallbackBySlug(slug);
       renderArticle(data);
     } catch (e) {
       console.error('[DSTS]', e);
       renderFallbackBySlug(slug);
     }
   }
   ```

3. **Sửa `/posts` có fallback** (Trụ 2 — +3đ)
   - File `/data/posts.json` với tối thiểu 6 bài mẫu thật.
   - `posts.js` luôn render fallback khi API fail / rỗng.

4. **Dựng `/donate`, `/transparency`, `/about`, `/program`, `/contact`** (Trụ 2 + 4 — +8đ)
   - Mỗi trang tối thiểu phải có:
     - Hero section
     - Mô tả 200–400 từ
     - Ít nhất 3 sub-section
     - CTA rõ ràng
     - Footer thống nhất
   - **Không được phép** chỉ là placeholder "Coming soon".

5. **Smoke test toàn bộ route** (Trụ 1 — +3đ)
   - Script bash crawl 100% URL, log status code, fail nếu có URL ≠ 200/301/intentional-404.

**Gate phê duyệt Sprint 0 (founder review):**
- [ ] Demo `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → bài viết thật hoặc fallback có chữ.
- [ ] Demo `/posts` → danh sách card.
- [ ] Click thử 100% link từ homepage → không trang nào lỗi.
- [ ] Founder bấm OK → mở Sprint 1.

**Điểm sau Sprint 0:** ~32 → ~57

---

### 🟠 SPRINT 1 — RESTORE TRUST & FINISH CORE (Ngày 4–7, **mục tiêu +15đ**)

**Tinh thần:** Trang đã chạy, giờ đảm bảo nội dung thật, niềm tin thật, không có gì gây hiểu lầm.

**Deliverables:**

1. **Hoàn thiện `/donate`** (Trụ 4 — +3đ)
   - 8 mục bắt buộc: mục tiêu, hình thức đóng góp, cách xác nhận, chính sách hoàn tiền, điều khoản sử dụng quỹ, liên hệ xác minh, trạng thái, báo cáo định kỳ.
   - Có ít nhất 1 phương thức donate hoạt động (PayPal button hoặc QR + form xác nhận).

2. **Hoàn thiện `/transparency`** (Trụ 4 — +2đ)
   - Báo cáo mẫu Q1/2026 (kể cả là "Báo cáo khởi tạo").
   - Nguyên tắc công bố.
   - Lịch cập nhật.

3. **Trang `/terms`, `/refund`, `/privacy`** (Trụ 4 — +6đ)
   - Soạn theo chuẩn pháp lý Việt Nam + US (vì có flow thu USD).
   - Link từ footer của mọi trang.
   - Có ngày cập nhật + version.

4. **Gắn nhãn review mẫu** (Trụ 4 — +1đ)
   - Trên `/scripts/*`, thêm badge "Đánh giá minh họa — chưa phải phản hồi khách hàng thật" trên block reviews.
   - Hoặc ẩn toàn bộ reviews cho đến khi có D1 storage thật.

5. **Sửa `/contact` thành form hoạt động** (Trụ 6 — +2đ)
   - Tích hợp Cloudflare Turnstile chống bot.
   - Email gửi về inbox founder + auto-reply cho user.
   - Hiển thị thông tin liên hệ phụ: email, Zalo, thời gian phản hồi.

6. **Footer thống nhất** (Trụ 5 — +1đ)
   - Component duy nhất dùng cho mọi trang.
   - Bao gồm: copyright, legal entity (VIET CAN NEW CORP / VFA), 3 link policy, social, ecosystem map.

**Gate phê duyệt Sprint 1:**
- [ ] Founder đọc + ký duyệt nội dung Terms/Refund/Privacy.
- [ ] Test gửi form `/contact` → có email về.
- [ ] Test donate thử với 1 USD → flow xác nhận chạy.

**Điểm sau Sprint 1:** ~57 → ~72

---

### 🟡 SPRINT 2 — STANDARDIZE & SEO (Ngày 8–14, **mục tiêu +13đ**)

**Tinh thần:** Site chạy, có nội dung thật, giờ phải để Google tìm thấy + chuẩn hóa cấu trúc.

**Deliverables:**

1. **Canonical + Meta tags chuẩn từng trang** (Trụ 3 — +5đ)
   - Component meta-head dùng chung, nhận props per page.
   - Audit 100% trang bằng tool (Screaming Frog).
   - Mỗi trang có title duy nhất 50–60 ký tự, description 150–160 ký tự.

2. **Sitemap.xml + Robots.txt** (Trụ 3 — +3đ)
   - Script tự generate sitemap từ list route + posts + scripts + events.
   - Submit lên Google Search Console + Bing Webmaster.

3. **Schema.org JSON-LD** (Trụ 3 — +2đ)
   - Organization schema trên trang chủ.
   - Article schema cho từng bài posts.
   - Event schema cho events.
   - Product/Service schema cho scripts cao cấp.

4. **SSR hoặc pre-render `/content` và `/posts`** (Trụ 3 — +2đ)
   - Build time pre-render top 20 bài hot.
   - Hoặc Cloudflare Workers SSR fetch nội dung server-side.
   - View-source → phải thấy text bài viết, không phải "Đang tải...".

5. **Clean URL canonicalization** (Trụ 1 — +1đ)
   - 301 redirect mọi URL `.html` về clean URL.
   - Update internal link toàn site.

**Gate phê duyệt Sprint 2:**
- [ ] Google Search Console verified + sitemap submitted.
- [ ] Rich Results Test pass cho 1 article + 1 event + organization.
- [ ] Curl trang `/content?slug=...` từ server → thấy nội dung HTML thật.

**Điểm sau Sprint 2:** ~72 → ~85

---

### 🟢 SPRINT 3 — POLISH, DESIGN & PERFORMANCE (Ngày 15–21, **mục tiêu +10đ**)

**Tinh thần:** Site đã đầy đủ, giờ làm cho đẹp, nhanh, mượt, ai vào cũng tin.

**Deliverables:**

1. **Design system tokenized** (Trụ 5 — +3đ)
   - `tokens.css` export biến: color, spacing, typography, radius, shadow.
   - Audit đồng bộ với hệ thống IAI.ONE đã làm.

2. **Loading skeleton thay "Đang tải..."** (Trụ 5 — +1đ)
   - Component `<Skeleton>` reusable.
   - Áp dụng cho list, card, article body.

3. **Image optimization** (Trụ 5 — +2đ)
   - Convert tất cả PNG/JPG → WebP + fallback.
   - Lazy load với `loading="lazy"`.
   - Responsive `srcset` cho hero images.
   - Lighthouse Performance ≥ 90.

4. **Mobile audit toàn site** (Trụ 1 — +2đ)
   - Test 6 breakpoint: 320, 375, 414, 768, 1024, 1920.
   - Tap target ≥ 48×48px.
   - Không scroll ngang trên 320px.

5. **Accessibility WCAG AA pass** (Trụ 2 — +2đ)
   - axe DevTools: 0 critical issue.
   - Keyboard navigation đầy đủ.
   - Alt text mọi ảnh.
   - Contrast ratio ≥ 4.5:1.

**Gate phê duyệt Sprint 3:**
- [ ] Lighthouse 4 mục đều ≥ 90 (Performance, Accessibility, Best Practices, SEO).
- [ ] Founder test trên iPhone + Android thật, không thấy bug visual.

**Điểm sau Sprint 3:** ~85 → ~95

---

### 🏁 SPRINT 4 — LAUNCH READINESS & ECOSYSTEM (Ngày 22–28, **mục tiêu +5đ**)

**Tinh thần:** Đủ chuẩn để mở campaign, có observability, có kết nối hệ sinh thái.

**Deliverables:**

1. **Fix link `nguoiviet.muonnoi.org`** (Trụ 7 — +2đ)
   - Sửa 502 trên domain đích, hoặc nếu chưa kịp thì ẩn link và thay bằng landing trung gian `/nguoiviet-muonnoi-bridge`.

2. **Analytics + Error logging** (Trụ 8 — +2đ)
   - GA4 hoặc Plausible.
   - Sentry (free tier đủ).
   - Funnel tracking cho 3 CTA chính: Xem chương trình, Xem kịch bản, Donate.

3. **Uptime monitoring + Runbook** (Trụ 8 — +2đ)
   - UptimeRobot ping 5 URL chính mỗi 5 phút.
   - File `RUNBOOK.md` cho team: cách rollback, cách restore, người chịu trách nhiệm.

4. **Footer ecosystem map** (Trụ 7 — +1đ)
   - Hiển thị các site VFA: IAI.ONE, vetuonglai, visamuonnoi, phuongdong, nguoiviet.muonnoi.

5. **Backup tự động** (Trụ 8 — +1đ)
   - GitHub Actions chạy hàng tuần backup content + data.

**Gate phê duyệt Sprint 4 (FINAL):**
- [ ] Founder review tổng thể trên 5 thiết bị: MacBook, iPhone, Android, iPad, Desktop Windows.
- [ ] Smoke test 100% URL pass.
- [ ] Lighthouse 4 mục ≥ 95.
- [ ] Founder ký công bố "PUBLIC LAUNCH READY".

**Điểm sau Sprint 4:** ~95 → **100/100** ✅

---

## III. CHECKLIST NGHIỆM THU CUỐI 100/100

Trước khi ký kết "đạt 100/100", team dev phải tự pass toàn bộ checklist sau:

### 🔬 Smoke Test (10 phút)
- [ ] `/` trả 200 + hiển thị đầy đủ block
- [ ] `/about` trả 200 + nội dung riêng + canonical đúng
- [ ] `/program` trả 200 + nội dung riêng + canonical đúng
- [ ] `/scripts` trả 200 + danh sách 9 kịch bản
- [ ] `/scripts/rising-entrepreneur` trả 200 + nội dung đầy đủ
- [ ] `/scripts/global-artist`, `/singing-icon`, `/cinematic-actor`, `/the-thinker`, `/creative-leader`, `/cultural-ambassador`, `/dsts-legacy`, `/global-story` đều trả 200
- [ ] `/posts` trả 200 + danh sách bài viết hoặc fallback
- [ ] `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → render bài viết
- [ ] `/events` trả 200 + sự kiện có ngày/giờ/địa điểm
- [ ] `/donate` trả 200 + flow donate hoạt động
- [ ] `/transparency` trả 200 + báo cáo có nội dung
- [ ] `/contact` trả 200 + form gửi được email
- [ ] `/terms`, `/refund`, `/privacy` đều trả 200
- [ ] `/404` (URL không tồn tại) → trả 404 + trang đẹp + CTA về home

### 🔍 SEO Audit
- [ ] `sitemap.xml` truy cập được, liệt kê ≥ 25 URL
- [ ] `robots.txt` truy cập được, có dòng `Sitemap:`
- [ ] Google Search Console verified
- [ ] Submit sitemap, không có lỗi
- [ ] Rich Results Test pass cho Article + Event + Organization
- [ ] 100% trang có canonical đúng URL của chính nó
- [ ] 100% trang có title + description riêng
- [ ] OG Debugger pass cho 5 trang chính

### ⚖️ Legal & Trust
- [ ] Terms of Service công bố + có ngày cập nhật
- [ ] Refund Policy công bố
- [ ] Privacy Policy + cookie banner GDPR-compliant
- [ ] Legal entity (VIET CAN NEW CORP / VFA) trong footer mọi trang
- [ ] Reviews mẫu được gắn nhãn rõ ràng hoặc đã thay bằng review thật
- [ ] Trang `/donate` có policy hoàn tiền + xác nhận
- [ ] `/transparency` có ít nhất 1 báo cáo mẫu

### 🎨 Design & Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Test trên iPhone 12 + Pixel 6 + iPad → không vỡ
- [ ] Test trên Chrome, Safari, Firefox, Edge → không vỡ
- [ ] Dark mode hoặc light mode chuẩn theo brand

### 💰 Conversion
- [ ] CTA "Xem chương trình" có GA event
- [ ] CTA "Xem kịch bản" có GA event
- [ ] Form `/contact` gửi được email + auto-reply
- [ ] Flow donate hoạt động end-to-end với 1 USD test
- [ ] Newsletter subscribe nếu có → confirm email gửi đến

### 🔧 Ops
- [ ] GA4 hoặc Plausible đang chạy
- [ ] Sentry capture được lỗi JS
- [ ] UptimeRobot ping 5 URL mỗi 5 phút
- [ ] `RUNBOOK.md` checked-in repo
- [ ] Backup hằng tuần đang chạy

### 🌐 Ecosystem
- [ ] Link `nguoiviet.muonnoi.org` trả 200
- [ ] Footer map đầy đủ các site VFA
- [ ] UTM tracking cho cross-site link

---

## IV. NGUYÊN TẮC BẤT BIẾN — KHÔNG ĐƯỢC VI PHẠM

Đây là các rule team dev phải tuân thủ vĩnh viễn, kể cả sau khi đạt 100/100:

1. **"Không bao giờ để một trang public hiện 'Đang tải...' mãi mãi"** — Mọi trang dynamic phải có timeout < 5s và fallback bắt buộc.

2. **"Không bao giờ có link gãy trên homepage"** — CI/CD phải có job link-check, fail nếu có link 404.

3. **"Không bao giờ duplicate canonical"** — Mỗi URL có 1 và chỉ 1 canonical trỏ về chính nó.

4. **"Không bao giờ commit credential vào repo"** — Secret manager bắt buộc.

5. **"Không bao giờ deploy thẳng lên `main` khi chưa qua PR review"** — Founder hoặc tech lead duyệt.

6. **"Mọi nội dung hiển thị giá tiền > 1,000 USD phải có Terms + Refund đi kèm"** — Bắt buộc trong cùng trang hoặc footer.

7. **"Reviews tĩnh phải có nhãn 'Đánh giá minh họa'"** — Đến khi có D1 storage thật.

---

## V. CƠ CẤU PHÊ DUYỆT — APPROVAL GATES

Workflow chuẩn anh Tâm hay dùng. Mỗi sprint phải qua 3 gate:

```
┌─────────────────────┐
│ GATE 1: PRE-SPRINT  │  Founder duyệt scope sprint + deliverables
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ DEV THỰC THI        │  Team dev triển khai trên branch riêng
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ GATE 2: PR REVIEW   │  Tech lead review code + test
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ GATE 3: FOUNDER QA  │  Anh Tâm test thật + ký duyệt
└──────────┬──────────┘
           ▼
       MERGE MAIN
```

**Không sprint nào được skip gate.** Đặc biệt Gate 3 — anh Tâm phải tự test trên ít nhất 2 thiết bị.

---

## VI. TIMELINE TỔNG THỂ

```
Tuần 1  ████████░░░░░░░░░░░░░░░░░░░░  Sprint 0 + Sprint 1
Tuần 2  ░░░░░░░░████████░░░░░░░░░░░░  Sprint 2
Tuần 3  ░░░░░░░░░░░░░░░░████████░░░░  Sprint 3
Tuần 4  ░░░░░░░░░░░░░░░░░░░░░░░░████  Sprint 4 + Final QA
Tuần 5  PUBLIC LAUNCH READY 🚀
```

**Tổng thời gian:** 4 tuần làm việc tập trung (28 ngày).
**Buffer:** +1 tuần dự phòng cho phát sinh.
**Public launch:** Cuối tuần 5.

---

## VII. ƯỚC LƯỢNG NGUỒN LỰC

| Vai trò | Effort | Ghi chú |
|---|---|---|
| Full-stack dev | 1 người × 4 tuần full-time | Hoặc 2 người × 2 tuần |
| UI/UX designer | 1 người × 1 tuần | Sprint 3 chính |
| Content writer | 1 người × 1 tuần | Sprint 1 (terms, posts) |
| QA tester | 1 người × 3 ngày | Cuối mỗi sprint |
| Founder review | 30 phút × mỗi sprint gate | Anh Tâm |

---

## VIII. RỦI RO & GIẢM THIỂU

| Rủi ro | Xác suất | Giảm thiểu |
|---|---|---|
| API content backend chưa sẵn sàng | Cao | Dùng JSON tĩnh tạm thời, gắn flag `__source=fallback` để track |
| `nguoiviet.muonnoi.org` không fix kịp | Trung | Tách ra thành sprint riêng, ẩn link tạm |
| Founder review chậm gây block | Trung | Đặt SLA review tối đa 24h, có deputy reviewer |
| Lighthouse perf không đạt 90 trên mobile | Trung | Sprint 3 dành riêng cho perf, có buffer |
| Legal Terms/Refund cần luật sư duyệt | Thấp-Trung | Soạn draft sớm từ Sprint 1, gửi luật sư song song |

---

## IX. SAU 100/100 — ROADMAP DÀI HẠN

Đạt 100/100 không phải đích cuối, mà là **trạng thái sẵn sàng launch**. Sau đó là các tầng mở rộng:

### Tầng 2 (Tháng 2)
- CMS admin riêng (Notion API hoặc Sanity)
- Member system: đăng ký, login, profile
- Newsletter automation
- Blog editor cho founder

### Tầng 3 (Tháng 3–4)
- Community forum
- Event registration với payment
- Membership tier (free / premium / patron)
- Tích hợp SSO với IAI.ONE

### Tầng 4 (Tháng 5–6)
- Mobile app (React Native hoặc PWA)
- API public cho ecosystem partners
- Analytics dashboard riêng cho founder
- Multi-language (Việt / Anh)

### Tầng 5 (Tháng 7+)
- DSTS thành nền tảng vận hành thật: script journey với CRM, contract, milestone tracking.
- Tích hợp với Phuong Dong super app.
- Cross-promote với Người Việt Muôn Nơi.

---

## X. KẾT LUẬN

Hiện tại site ở ~32/100. Đạt 100/100 đòi hỏi **4 tuần làm việc kỷ luật**, không phải bằng cách thêm tính năng mới, mà bằng cách:

1. **Sửa cho không gãy** (Sprint 0)
2. **Bổ sung nội dung & niềm tin** (Sprint 1)
3. **Chuẩn hóa & SEO** (Sprint 2)
4. **Polish & Performance** (Sprint 3)
5. **Launch-ready & Ops** (Sprint 4)

Mỗi sprint có gate phê duyệt rõ ràng, mỗi deliverable đo được. Không có cảm tính, không có "gần xong", chỉ có pass hoặc fail.

**Khi đạt 100/100:** Site sẵn sàng cho campaign public chính thức, sẵn sàng nhận donate, sẵn sàng đón traffic SEO, sẵn sàng cho phép founder mời 9 doanh nhân đầu tiên vào Script Journey.

---

## 🔐 PHÊ DUYỆT FOUNDER

Trước khi team dev bắt đầu Sprint 0, anh Tâm cần ký xác nhận:

- [ ] Đồng ý với rubric 100/100 ở Mục I
- [ ] Đồng ý timeline 4 tuần ở Mục VI
- [ ] Đồng ý nguồn lực phân bổ ở Mục VII
- [ ] Đồng ý gate phê duyệt 3 bước ở Mục V
- [ ] Đồng ý nguyên tắc bất biến ở Mục IV
- [ ] Chỉ định Tech Lead chịu trách nhiệm chính
- [ ] Chỉ định người soạn Terms/Refund/Privacy
- [ ] Chỉ định designer cho Sprint 3
- [ ] Chỉ định ngân sách (nếu có) cho tools: Sentry, UptimeRobot, monitoring

**Ký:** _______________________
**Ngày:** _______________________

---

*Tài liệu này là master plan v1.0. Mọi điều chỉnh phải qua founder phê duyệt và update version. Mọi sprint deliverable phải đối chiếu lại tài liệu này trước khi báo "xong".*
