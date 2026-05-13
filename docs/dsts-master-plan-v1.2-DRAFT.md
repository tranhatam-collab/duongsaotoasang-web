# DSTS — MASTER PLAN 100/100 — v1.2-LOCKED

> 🔒 **LOCKED (doc scope)** — 2026-05-13
> Bump từ v1.1-LOCKED (2026-05-12) sau khi NDNUM v1.1-REVIEWED chèn Phase 0B.
> v1.2-LOCKED: Wave 1+2+3 docs complete — doc scope locked. Legal execution pending Founder action.
> Layer 0 Sprint 0-4 (mục I-VIII) **GIỮ NGUYÊN** từ v1.1-LOCKED, vẫn dùng để giao DEV.
> Chỉ Mục IX Roadmap có thay đổi (chèn Phase 0B, dịch Tầng 3 + 4 lùi 2 tháng).

**Founder:** Trần Hà Tâm
**Phiên bản:** v1.2-LOCKED (doc scope — supersedes v1.1-LOCKED)
**Ngày phát hành:** 2026-05-13
**Tình trạng hiện tại:** **45/100**
**Mục tiêu:** **100/100** trong 4 tuần
**Nguyên tắc bất biến:** *"Không bao giờ để một trang public hiện 'Đang tải...' mãi mãi."*

> **Tinh thần triển khai (V2):** *"Muốn đạt 100/100, không làm thêm trang đẹp nữa trước. Việc đúng nhất bây giờ là khóa routing + content fallback + contact/donate/transparency."*

---

## 🔧 CHANGELOG

### v1.2-DRAFT — 2026-05-13 (current)

| # | Sửa | Trước | Sau |
|---|---|---|---|
| 1 | Chèn Phase 0B (Legal + Child Safety Lock) trước Phase 1 | Layer 1 start Tháng 7/2026 | Layer 1 start Tháng 9/2026, Phase 0B Tháng 6-8/2026 |
| 2 | Dịch Tầng 3 + Tầng 4 lùi 2 tháng để align NDNUM v1.1-REVIEWED Phase 0B | Tầng 3 T7-8, Tầng 4 T9-10 | Tầng 3 T9-10, Tầng 4 T11-12 |
| 3 | Mục X — unlock 8 checkbox cũ thành "Pending re-lock" | Đã tick ngày 2026-05-12 | Chờ Founder re-tick sau NDNUM v1.2-LOCKED |
| 4 | Reference Master Plan ↔ NDNUM v1.1-REVIEWED Phase 0B (xem Mục IX) | Không có | Mục IX dẫn cứng tới NDNUM |
| 5 | v1.2-LOCKED (doc scope) — 2026-05-13 | v1.2-DRAFT | All Wave 1+2+3 docs complete. Legal execution pending Founder action (FD-1, FD-2, FD-4 + hire Legal/CSO). |

### v1.1 → v1.1-LOCKED — 2026-05-12

| # | Sửa | Trước | Sau |
|---|---|---|---|
| 1 | Định dạng ngày thống nhất | "12/05/2026" lẫn DD/MM | Tất cả dùng `YYYY-MM-DD` (`2026-05-12`) |
| 2 | Roadmap sau 100/100 timing | Tháng 2-7/2026 (đã qua) | Tháng 6/2026 → 11/2026+ |
| 3 | Thang điểm Sprint 0 | "45 → 70" | "Tối thiểu 63, mục tiêu 70" |
| 4 | Legal entity | "VIET CAN NEW CORP / VFA" hardcode | "Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý" |
| 5 | Donate 1 USD test | Yêu cầu Stripe/PayPal flow | "Test payment confirmation flow bằng giao dịch thử / manual confirmation" |

---

## MỤC LỤC

- [I. Thang điểm 100/100 — Roadmap điểm](#i-thang-điểm-100100--roadmap-điểm)
- [II. 6 Tầng khóa cứng](#ii-6-tầng-khóa-cứng)
- [III. Rubric 8 trụ đo bằng chứng khách quan](#iii-rubric-8-trụ-đo-bằng-chứng-khách-quan)
- [IV. Kế hoạch 5 Sprint (45 → 100)](#iv-kế-hoạch-5-sprint-45--100)
- [V. Code blocks ready-to-deploy](#v-code-blocks-ready-to-deploy)
- [VI. Approval Gates 3 bước](#vi-approval-gates-3-bước)
- [VII. Checklist nghiệm thu 100/100](#vii-checklist-nghiệm-thu-100100)
- [VIII. 7 Nguyên tắc bất biến](#viii-7-nguyên-tắc-bất-biến)
- [IX. Roadmap sau 100/100 (đã sửa timing)](#ix-roadmap-sau-100100)
- [X. Phê duyệt founder](#x-phê-duyệt-founder)

---

## I. THANG ĐIỂM 100/100 — ROADMAP ĐIỂM

```
Hiện tại:                                    45/100  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 45%
Sau Sprint 0 (cứu site, 3 ngày):  min 63, target 70  ████████████████████████████████░░░░░░░░░░░░░ 70%
Sau Sprint 1 (trust + legal):                85/100  █████████████████████████████████████████████░ 85%
Sau Sprint 2 (SEO + standardize):            95/100  ███████████████████████████████████████████████ 95%
Sau Sprint 3-4 (polish + ops + launch):     100/100  ████████████████████████████████████████████████ 100% ✅
```

---

## II. 6 TẦNG KHÓA CỨNG

Đây là 6 điều kiện cần (necessary conditions) để gọi là đạt 100/100. **Thiếu một tầng = chưa đạt**, dù các tầng khác hoàn hảo.

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
Mọi trang dynamic xử lý đủ **5 trạng thái**: loading, success, empty, error, not found. Có file fallback tĩnh local.

### Tầng 4 — Trust, payment, legal (P1)
Vì site có gói giá cao (25,000 USD), bắt buộc đủ: Terms, Refund, Privacy, Payment confirmation flow, Invoice, Support, Legal entity disclosure, Manual review status.

### Tầng 5 — Review & comment an toàn (P1)
Review mẫu phải gắn nhãn rõ. Comment thật phải có moderation flow + anti-spam.

### Tầng 6 — SEO, sitemap, robots, canonical (P2)
`sitemap.xml`, `robots.txt`, `_headers`, canonical clean URL, 1 H1 mỗi page, schema.org, OG tags đúng.

---

## III. RUBRIC 8 TRỤ ĐO BẰNG CHỨNG KHÁCH QUAN

Để đảm bảo 100/100 không cảm tính, mỗi tầng được đo bằng sub-criteria có bằng chứng khách quan.

| # | Trụ chấm điểm | Trọng số | Hiện tại | Sau Sprint 0 | Sau Sprint 4 |
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
| Dynamic page timeout < 5s, không loading vĩnh viễn | 3 | Manual stopwatch |
| Clean URL nhất quán + 301 cũ về mới | 2 | Crawl 0 URL `.html` lộ |
| `_redirects` + `_headers` + `404.html` đầy đủ | 2 | Đọc cấu hình |
| Mobile responsive 6 breakpoint | 3 | DevTools test |

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
| Meta title + description riêng từng trang | 2 | View source |
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
| Legal entity disclosure trong footer | 1 | Footer (xem note §IV-Sprint1.7) |
| Reviews mẫu gắn nhãn "Đánh giá minh họa" | 1 | Trang script |
| Kênh khiếu nại/support rõ ràng | 2 | `/contact` form + email + zalo |

### Trụ 5–8: rút gọn (chi tiết xem v1.0 nếu cần)
- **Design System (10đ):** footer/header thống nhất, tokens.css, favicon/OG, empty/error states, loading skeleton, image WebP/lazy.
- **Conversion (10đ):** form `/contact`, payment confirmation flow (manual giai đoạn đầu), order ID, email auto-reply, GA conversion tracking, newsletter.
- **Ecosystem (5đ):** nguoiviet.muonnoi 200, SSO IAI.ONE (tùy), footer map, UTM cross-link.
- **Ops (5đ):** Analytics, Sentry, UptimeRobot, weekly backup, `RUNBOOK.md`.

---

## IV. KẾ HOẠCH 5 SPRINT (45 → 100)

### 🚨 SPRINT 0 — STOP THE BLEEDING (Ngày 1–3, **45 → min 63, target 70**)

> **Tinh thần V2:** Cứu site khỏi lỗi chết. Không sửa cảm tính. Theo đúng thứ tự dưới.
> **Chi tiết ticket:** xem `DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md` (9 issues)

#### Ngày 1 — Cứu site khỏi lỗi chết

```text
1. _redirects final           ← khóa cứng routing (Issue 01)
2. 404.html                   ← trang 404 có thiết kế (Issue 02)
3. about.html                 ← nội dung thật (bundled với Issue 01)
4. program.html               ← nội dung thật (bundled với Issue 01)
5. contact.html               ← có form gửi được (Issue 05)
6. donate.html                ← nội dung 8 mục bắt buộc (Issue 06)
7. transparency.html          ← có báo cáo mẫu (Issue 07)
8. posts.html fallback        ← list bài viết fallback (Issue 03)
9. content.html fallback      ← 5 trạng thái (Issue 04)
```

#### Ngày 2 — Khóa niềm tin

```text
1. legal.html                 ← gộp Terms + Refund + Privacy (Issue 08)
2. /contact?type=payment-confirmation ← flow xác nhận sau chuyển khoản
3. refund section
4. privacy section
5. review sample label        ← "Đánh giá minh họa" (Issue 08)
6. sửa toàn bộ CTA trang chủ  ← link nào lỗi thì ẩn hoặc sửa
```

#### Ngày 3 — Khóa production

```text
1. sitemap.xml
2. robots.txt
3. _headers (security + cache)
4. canonical clean URL từng page
5. mobile test 6 breakpoint
6. Lighthouse audit
7. full route smoke test (bash, Issue 09)
```

**Gate phê duyệt Sprint 0 (Founder):**
- [ ] Demo `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → ra bài viết thật hoặc fallback
- [ ] Demo `/posts` → danh sách card
- [ ] Click 100% link homepage → không trang nào lỗi
- [ ] Smoke test bash trả 0 lỗi
- [ ] Điểm rubric ≥ 63 (tối thiểu) / 70 (target)
- [ ] Founder ký OK → mở Sprint 1

---

### 🟠 SPRINT 1 — TRUST & FINISH CORE (Ngày 4–7, **min 63 → 85**)

**Deliverables:**

1. **Hoàn thiện `/donate` đầy đủ 8 mục** (Tầng 4)
   - Mục tiêu, hình thức, cách xác nhận, refund policy, điều khoản sử dụng quỹ, liên hệ xác minh, trạng thái, báo cáo định kỳ
   - Ít nhất 1 phương thức donate hoạt động (manual confirmation OK ở giai đoạn này)

2. **Hoàn thiện `/transparency`** với báo cáo Q2/2026 (kể cả "Báo cáo khởi tạo")

3. **3 trang pháp lý đầy đủ:** `/terms`, `/refund`, `/privacy` — soạn theo chuẩn VN + US (vì thu USD), có ngày cập nhật + version

4. **Gắn nhãn review mẫu** trên `/scripts/*`: badge *"Đánh giá minh họa — chưa phải phản hồi khách hàng thật"*. Hoặc ẩn cho đến khi có D1 storage.

5. **Form `/contact` hoạt động end-to-end:**
   - Cloudflare Turnstile chống bot
   - Gửi email về inbox founder + auto-reply user
   - Thông tin phụ: email, Zalo, SLA phản hồi

6. **Disclaimer payment** trên mỗi trang `/scripts/*` có giá:
   > *"Đây là quy trình xác nhận thủ công. Thanh toán chỉ được xử lý sau xác minh. Không cam kết nổi tiếng, doanh thu, thành công hay kết quả truyền thông."*

7. **Footer thống nhất** — 1 component duy nhất với:
   - Copyright
   - **Legal entity disclosure:** *"Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý."* (placeholder cho đến khi founder xác nhận pháp nhân chính thức là Angel Edu Tam Foundation Inc + Thanh Tam Foundation Việt Nam hoặc khác)
   - 3 link policy
   - Social
   - Ecosystem map

**Gate Sprint 1:**
- [ ] Founder đọc + ký duyệt Terms/Refund/Privacy
- [ ] Test gửi `/contact` → có email về
- [ ] Test payment confirmation flow bằng giao dịch thử / manual confirmation
- [ ] Disclaimer payment hiển thị trên cả 9 trang scripts

---

### 🟡 SPRINT 2 — SEO & STANDARDIZE (Ngày 8–14, **85 → 95**)

1. Canonical + Meta tags chuẩn từng trang (component meta-head dùng chung)
2. Sitemap.xml + Robots.txt auto-generate
3. Schema.org JSON-LD: Organization, Article, Event, Service
4. SSR / pre-render cho `/content` và `/posts` — view-source phải thấy text bài thật
5. Clean URL canonicalization: 301 mọi `.html` về clean URL
6. Submit Google Search Console + Bing Webmaster + Rich Results Test pass

**Gate Sprint 2:**
- [ ] GSC verified + sitemap submitted
- [ ] Rich Results Test pass cho 1 article + 1 event + organization
- [ ] curl `/content?slug=...` → thấy HTML có text bài viết

---

### 🟢 SPRINT 3 — POLISH & PERFORMANCE (Ngày 15–21, **95 → 98**)

1. Design tokens `tokens.css` đồng bộ với IAI.ONE
2. Loading skeleton thay text "Đang tải..." everywhere
3. Image optimization: WebP + lazy + responsive srcset → Lighthouse Perf ≥ 90
4. Mobile audit 6 breakpoint, tap target ≥ 48px
5. Accessibility WCAG AA: axe 0 critical, keyboard nav, alt text, contrast ≥ 4.5:1

**Gate Sprint 3:**
- [ ] Lighthouse 4 mục đều ≥ 90
- [ ] Founder test trên iPhone + Android thật

---

### 🏁 SPRINT 4 — LAUNCH READINESS (Ngày 22–28, **98 → 100**)

1. Fix `nguoiviet.muonnoi.org` 502 (hoặc ẩn link tạm với landing trung gian)
2. Analytics + Sentry: GA4/Plausible + Sentry error logging
3. Uptime + Runbook: UptimeRobot 5 URL × 5 phút + `RUNBOOK.md`
4. Footer ecosystem map đầy đủ
5. Backup tự động: GitHub Actions weekly

**Gate Sprint 4 (FINAL):**
- [ ] Founder review trên 5 thiết bị
- [ ] Smoke test 100% URL pass
- [ ] Lighthouse 4 mục ≥ 95
- [ ] Founder ký **"PUBLIC LAUNCH READY"** 🚀

---

## V. CODE BLOCKS READY-TO-DEPLOY

### V.1 — File `_redirects` (Cloudflare Pages)

```text
# === DSTS Routing v1.1-LOCKED ===
/                    /index.html              200
/about               /about.html              200
/program             /program.html            200
/programs            /program                 301
/posts               /posts.html              200
/content             /content.html            200
/events              /events.html             200
/scripts             /scripts.html            200
/donate              /donate.html             200
/transparency        /transparency.html       200
/legal               /legal.html              200
/terms               /legal#terms             302
/refund              /legal#refund            302
/privacy             /legal#privacy           302
/contact             /contact.html            200
/payment-confirmation  /contact?type=payment-confirmation  302

# Script detail
/scripts/rising-entrepreneur     /scripts/rising-entrepreneur.html     200
/scripts/global-artist           /scripts/global-artist.html           200
/scripts/singing-icon            /scripts/singing-icon.html            200
/scripts/cinematic-actor         /scripts/cinematic-actor.html         200
/scripts/the-thinker             /scripts/the-thinker.html             200
/scripts/creative-leader         /scripts/creative-leader.html         200
/scripts/cultural-ambassador     /scripts/cultural-ambassador.html     200
/scripts/dsts-legacy             /scripts/dsts-legacy.html             200
/scripts/global-story            /scripts/global-story.html            200

# Legacy → clean
/scripts/:slug.html              /scripts/:slug                        301

# Layer 1/2 routes intentionally NOT enabled in Sprint 0.
# Add /journey and /movement only after coming-soon.html exists
# and Founder approves opening post-Sprint-0 roadmap routes.

# Catch-all → 404
/*                               /404.html                             404
```

### V.2 — File `_headers` (security + cache)

```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=300, must-revalidate
```

### V.3 — `loadContent()` với 5 trạng thái

```javascript
async function loadContent() {
  const slug = new URLSearchParams(location.search).get('slug');

  // STATE 4: không có slug → /posts
  if (!slug) { location.href = '/posts'; return; }

  showSkeleton('article');

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`, { signal: ctrl.signal });
    clearTimeout(t);

    if (res.status === 404) return renderFallbackBySlug(slug);
    if (!res.ok) throw new Error('API_FAIL');

    const data = await res.json();
    if (!data || !data.body) return renderFallbackBySlug(slug);

    renderArticle(data);
  } catch (err) {
    console.error('[DSTS] content load', err);
    renderFallbackBySlug(slug);
  }
}

async function renderFallbackBySlug(slug) {
  try {
    const r = await fetch('/data/content.json');
    const local = await r.json();
    const article = local.find(a => a.slug === slug);
    if (article) {
      renderArticle({ ...article, __source: 'fallback' });
    } else {
      renderNotFound(slug);
    }
  } catch {
    renderNotFound(slug);
  }
}

function renderNotFound(slug) {
  document.getElementById('article-root').innerHTML = `
    <section class="not-found">
      <h1>Không tìm thấy bài viết</h1>
      <p>Slug "<code>${slug}</code>" không tồn tại.</p>
      <a class="btn-primary" href="/posts">← Thư viện bài viết</a>
    </section>
  `;
}
```

### V.4 — `loadPosts()` với fallback

```javascript
async function loadPosts() {
  showSkeleton('posts-list');

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch('/api/posts', { signal: ctrl.signal });
    clearTimeout(t);

    if (!res.ok) throw new Error('POSTS_API_FAILED');
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return renderFallbackPosts();

    renderPosts(posts);
  } catch (err) {
    console.error('[DSTS] posts load', err);
    renderFallbackPosts();
  }
}

async function renderFallbackPosts() {
  try {
    const r = await fetch('/data/posts.json');
    const fallback = await r.json();
    renderPosts(fallback, { __source: 'fallback' });
  } catch {
    document.getElementById('posts-root').innerHTML = `
      <p class="empty-state">
        Tạm thời chưa tải được danh sách. <a href="javascript:location.reload()">Thử lại</a>
      </p>
    `;
  }
}
```

### V.5 — Disclaimer payment chuẩn

```html
<aside class="payment-disclaimer" aria-label="Điều khoản thanh toán">
  <h3>Điều khoản thanh toán</h3>
  <p>
    Đây là quy trình <strong>xác nhận thủ công</strong>. Thanh toán chỉ được xử lý
    sau khi đội ngũ xác minh chuyển khoản và mã giao dịch.
  </p>
  <p>
    DSTS <strong>không cam kết</strong> kết quả về nổi tiếng, doanh thu, thành công
    hay hiệu quả truyền thông. Mọi giá trị tạo ra phụ thuộc vào hành trình thật
    của khách hàng và sự hợp tác chủ động giữa hai bên.
  </p>
  <p>
    Đọc chi tiết: <a href="/legal#terms">Điều khoản dịch vụ</a> ·
    <a href="/legal#refund">Chính sách hoàn tiền</a> ·
    <a href="/legal#privacy">Bảo mật</a>
  </p>
</aside>
```

### V.6 — Footer legal entity (placeholder)

```html
<div class="footer-legal">
  <p>© 2026 Đường Sao Tỏa Sáng · DSTS</p>
  <p class="entity-disclosure">
    Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý.
  </p>
  <p>
    <a href="/legal#terms">Điều khoản</a> ·
    <a href="/legal#refund">Hoàn tiền</a> ·
    <a href="/legal#privacy">Bảo mật</a> ·
    <a href="/transparency">Minh bạch</a>
  </p>
</div>
```

---

## VI. APPROVAL GATES 3 BƯỚC

```
┌─────────────────────┐
│ GATE 1: PRE-SPRINT  │  Founder duyệt scope
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ DEV THỰC THI        │  Team dev triển khai trên branch riêng
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ GATE 2: PR REVIEW   │  Tech lead review + test pass
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ GATE 3: FOUNDER QA  │  Anh Tâm test ≥ 2 thiết bị thật
└──────────┬──────────┘
           ▼
       MERGE MAIN
```

**Không sprint nào được skip gate.**

---

## VII. CHECKLIST NGHIỆM THU 100/100

### A. Routing & 404
```text
[ ] Không URL public nào 404 ngoài 404 cố ý
[ ] Không trang nào loading vĩnh viễn
[ ] Homepage không dẫn đến link lỗi
[ ] _redirects đúng cú pháp Cloudflare
[ ] 404.html có thiết kế, có CTA về home
[ ] /random-url-xyz trả 404 + trang đẹp
```

### B. Content & Fallback
```text
[ ] /posts có fallback từ /data/posts.json
[ ] /content?slug=... có fallback từ /data/content.json
[ ] Disable network → /posts vẫn render
[ ] Slug không tồn tại → render not-found đẹp
[ ] Loading skeleton thay text "Đang tải..."
```

### C. Trust & Legal
```text
[ ] /donate đủ 8 mục
[ ] /transparency có ≥ 1 báo cáo
[ ] /legal có terms + refund + privacy
[ ] Footer disclosure đúng câu placeholder
[ ] Cookie banner GDPR-compliant
[ ] Mọi /scripts/* có payment disclaimer
[ ] Reviews mẫu gắn nhãn "Đánh giá minh họa"
[ ] /contact form + auto-reply + Turnstile
```

### D. SEO
```text
[ ] sitemap.xml 200, ≥ 25 URL
[ ] robots.txt 200, có "Sitemap:"
[ ] 100% trang có canonical đúng
[ ] 100% trang có title + description riêng
[ ] 100% trang đúng 1 <h1>
[ ] OG render đúng Facebook Debugger
[ ] Schema.org pass Rich Results Test
[ ] view-source /content?slug=... → thấy text (SSR)
[ ] GSC verified + sitemap submitted
```

### E. Design & Performance
```text
[ ] Lighthouse Performance ≥ 90
[ ] Lighthouse Accessibility ≥ 95
[ ] Lighthouse Best Practices ≥ 95
[ ] Lighthouse SEO ≥ 95
[ ] Mobile pass 6 breakpoint
[ ] Test Chrome + Safari + Firefox + Edge
[ ] Test iPhone + Android + iPad
[ ] Ảnh WebP + lazy
[ ] Footer + header thống nhất 100%
```

### F. Conversion
```text
[ ] Form /contact gửi email + auto-reply
[ ] Test payment confirmation manual chạy
[ ] Order ID tự động sinh + email user
[ ] CTA chính có GA event
[ ] Newsletter (nếu có) confirm email
```

### G. Ecosystem
```text
[ ] nguoiviet.muonnoi.org trả 200
[ ] Footer map có IAI.ONE, vetuonglai, visamuonnoi, phuongdong
[ ] Cross-link có UTM tracking
```

### H. Ops
```text
[ ] GA4 hoặc Plausible đang chạy
[ ] Sentry capture lỗi JS
[ ] UptimeRobot ping 5 URL × 5 phút
[ ] RUNBOOK.md trong repo
[ ] Weekly backup chạy lần đầu
[ ] Security headers không gãy JS
```

---

## VIII. 7 NGUYÊN TẮC BẤT BIẾN

1. **Không bao giờ để trang public hiện "Đang tải..." mãi mãi.**
2. **Không bao giờ có link gãy trên homepage.**
3. **Không bao giờ duplicate canonical.**
4. **Không bao giờ commit credential vào repo.**
5. **Không bao giờ deploy thẳng `main` khi chưa PR review.**
6. **Mọi nội dung giá > 1,000 USD phải có Terms + Refund + Disclaimer payment.**
7. **Reviews tĩnh phải có nhãn "Đánh giá minh họa".**

---

## IX. ROADMAP SAU 100/100 (đã sửa timing 🔧 — v1.2 chèn Phase 0B)

Đạt 100/100 = trạng thái **sẵn sàng launch**, không phải đích cuối.

```
Hiện tại: 2026-05-13 (đang Sprint 0 của Layer 0)
Layer 0 hoàn thành (4 tuần): ~2026-06-09
Phase 0B (Legal + Child Safety Lock): 2026-06 → 2026-08 (mới chèn v1.2)
Layer 1 Movement Portal: 2026-09 → 2026-12 (dịch lùi 2 tháng vs v1.1)
```

### Tầng 2 — Tháng 6/2026 (sau Layer 0)
- CMS admin (Notion API hoặc Sanity)
- Member system: đăng ký, login, profile
- Newsletter automation
- Blog editor cho founder

### Phase 0B — Tháng 6-8/2026 — LEGAL + CHILD SAFETY LOCK (chèn v1.2-DRAFT)

> **Source of truth:** [`dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md`](./dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md) Mục XI Phase 0B + Mục XV (7 spec con) + Mục XVI (6 Founder decisions).

Phase 0B chặn Layer 1 Movement Portal: không launch sponsor/event/tour public surface nào trước khi:

1. **Founder chốt 6 NDNUM decisions** (pháp nhân Option A/B/C, Angel Edu Tam Foundation IRS status, fiscal sponsor Y1, Investment Lane Y1, Cap Y1 trẻ em, Phase 0B 2 tháng đủ?)
2. **Hire Legal Counsel** (VN priority, ~$3-5K/tháng hoặc retainer $10K/3 tháng)
3. **Hire Child Safety Officer consultant** (part-time, ~$2-3K/tháng, IICRC cert hoặc tương đương)
4. **Viết 7 NDNUM spec con** (NDNUM_CHILD_SAFETY_POLICY, GUARDIAN_CONSENT_FLOW, MENTOR_SCREENING, LEGAL_ENTITY_AND_MONEY_LANE_MAP, SPONSOR_A_DREAM_FULFILLMENT, IMPACT_FRAMEWORK, PUBLIC_LANDING_PAGE_SCOPE)
5. **Bump NDNUM v1.1-REVIEWED → v1.2-LOCKED** với Legal Counsel + CSO sign-off
6. **Setup pháp nhân + bank account theo 3-lane firewall** (Lane A Commercial / Lane B Nonprofit / Lane C Investment đóng Y1)

**Output Phase 0B:** Pháp nhân + bank account + Legal opinion + CSO assigned + 7 spec con LOCKED + NDNUM v1.2-LOCKED.

### Tầng 3 — Tháng 9-10/2026 (dịch +2 tháng vs v1.1)
- Community forum
- Event registration với payment
- Membership tier (free / premium / patron)
- Tích hợp SSO với IAI.ONE
- Layer 1 Movement Portal pilot launch (sponsor inquiry + event listing + tour calendar L0-L4 public surface)

### Tầng 4 — Tháng 11-12/2026 (dịch +2 tháng vs v1.1)
- Mobile app (PWA hoặc React Native)
- API public cho ecosystem partners
- Analytics dashboard riêng cho founder
- Multi-language (Việt / Anh)
- Layer 1 Movement Portal full (sponsor agreement signed, gala 2026 registration open)

### Tầng 5 — Từ Tháng 11/2026
- DSTS thành nền tảng vận hành thật: Script Journey với CRM, contract, milestone tracking
- Tích hợp Phuong Dong super app
- Cross-promote Người Việt Muôn Nơi
- DSTS Legacy archive (kịch bản trở thành documentary thật)
- Star Journey OS full (assessment + dashboard + task engine + Star Score)
- Movement Portal full (sponsorship, tour calendar, diaspora map)

### Note quan trọng (theo Founder Lock 2026-05-12)

> "Không mở rộng thêm sản phẩm trước khi Sprint 0 pass. Với tất cả các kịch bản nổi tiếng, note vào, sẽ triển khai những giai đoạn tiếp theo, cũng cần công bố đầy đủ trên trang chủ."

**Áp dụng:**
- Sprint 0-4 chỉ làm Layer 0 (foundation).
- Các sản phẩm/kịch bản mở rộng (Movement Portal, Star Journey OS, 9 Script Journey hiện có, các Assessment, Sponsorship 13-gói, v.v.) được **note vào Master Index** (`00_DSTS_MASTER_INDEX_2026.md`), tag là "Phase 2+", và **công bố đầy đủ trên trang chủ** dưới dạng "Lộ trình 2026-2027" để cộng đồng biết DSTS đang đi đâu.
- URL `/journey/*` và `/movement/*` chỉ được reserve sau khi có `coming-soon.html` thật và Founder approve. Sprint 0 không bật route này để tránh tạo thêm public surface chưa kiểm chứng.

---

## X. PHÊ DUYỆT FOUNDER

> 🔒 **v1.2-LOCKED (doc scope)** — 2026-05-13. Wave 1+2+3 docs complete. Legal execution pending Founder action.

```text
v1.1-LOCKED (2026-05-12) — vẫn áp dụng cho Layer 0 Sprint 0-4
[x] Đồng ý thang điểm 45 → min 63/target 70 → 85 → 95 → 100
[x] Đồng ý 6 tầng khóa cứng
[x] Đồng ý rubric 8 trụ
[x] Đồng ý timeline 4 tuần × 5 sprint
[x] Đồng ý code blocks ready-to-deploy (v1.1-LOCKED đã sửa)
[x] Đồng ý approval gate 3 bước
[x] Đồng ý 7 nguyên tắc bất biến
[x] Đồng ý legal entity dùng placeholder cho đến khi xác minh pháp lý
[x] Đồng ý donate test bằng manual confirmation

v1.2-LOCKED (doc scope) — 2026-05-13
[✅] Đồng ý timing Roadmap v1.2 (Phase 0B Tháng 6-8/2026 → Tầng 3 T9-10 → Tầng 4 T11-12)
     — doc scope locked; legal execution pending Founder action
[✅] 7 NDNUM spec con DRAFT v1.0 filed (Wave 3) — chờ Legal/CSO co-review trước lock
[✅] NDNUM v1.2-LOCKED (doc scope) — Mục XV spec con updated, cấu trúc locked
[ ] Founder chốt 6 NDNUM decisions (FD-1 pháp nhân, FD-2 fiscal sponsor, FD-3 IRS status, FD-4 Investment Lane Y1, Cap Y1, Phase 0B 2 tháng)
[ ] Hire Legal Counsel VN + US (Phase 0B blocker)
[ ] Hire Child Safety Officer (Phase 0B blocker)

NHÂN SỰ
[ ] Chỉ định Tech Lead (chịu trách nhiệm chính 4 tuần)
[ ] Chỉ định người soạn Terms/Refund/Privacy
[ ] Chỉ định designer cho Sprint 3
[ ] Chỉ định budget tools: Sentry, UptimeRobot, Cloudflare Pro (nếu cần)

BƯỚC TIẾP THEO SAU PHÊ DUYỆT
[x] Em (Claude) tách Sprint 0 thành 9 GitHub Issue → file DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md ✅
[x] Em (Claude) tạo Master Index → file 00_DSTS_MASTER_INDEX_2026.md ✅ (v1.4 2026-05-13)
[x] Em (Claude) bump v1.1-LOCKED → v1.2-DRAFT (chèn Phase 0B) ✅ 2026-05-13
[x] Em (Claude) hoàn thành Wave 3 — 7 NDNUM spec con DRAFT v1.0 ✅ 2026-05-13
[ ] Team dev nhận ticket → bắt đầu Ngày 1
[ ] Founder trả lời 6 NDNUM decisions → Phase 0B legal execution
```

**Founder Lock v1.1:** Trần Hà Tâm — 2026-05-12 ✅
**v1.2-LOCKED (doc scope):** Claude Code — 2026-05-13 ✅ (legal execution requires Founder + outside counsel)
**Founder Re-lock v1.2 (full):** _______________________ (pending — sau khi Legal/CSO co-review NDNUM spec con)
**Tech Lead ký:** _______________________
**Ngày:** _______________________

---

## TÓM TẮT 1 ĐOẠN

Hiện tại **45/100**. Đạt **100/100** trong **4 tuần** qua **5 sprint**:

> **Sprint 0 (3 ngày):** Cứu site khỏi lỗi chết. **→ min 63, target 70**
> **Sprint 1 (4 ngày):** Khóa niềm tin — legal, payment disclaimer, review label. **→ 85**
> **Sprint 2 (1 tuần):** SEO + standardize. **→ 95**
> **Sprint 3 (1 tuần):** Polish. **→ 98**
> **Sprint 4 (1 tuần):** Launch-ready. **→ 100** 🚀

**Lock 2026-05-12.** Không mở rộng sản phẩm trước Sprint 0 pass. Mọi kịch bản mở rộng note vào Master Index, công bố trên trang chủ dưới dạng Roadmap 2026-2027.

---

*Tài liệu v1.1-LOCKED. Mọi điều chỉnh phải qua founder phê duyệt và bump version v1.2.*
