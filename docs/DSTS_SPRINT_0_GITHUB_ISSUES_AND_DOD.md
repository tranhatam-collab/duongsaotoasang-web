# DSTS — SPRINT 0 — GITHUB ISSUES & DOD

> 🔒 **FOUNDER LOCKED** — 2026-05-12
> Bàn giao team DEV. 9 issues. Tổng effort ~20h. Mục tiêu: 45 → min 63 / target 70.

**Sprint:** 0 — Stop the Bleeding
**Thời gian:** 3 ngày (Ngày 1–3 của Master Plan v1.1-LOCKED)
**Branch chuẩn:** `sprint-0/stop-the-bleeding`
**Base:** `main`
**PR target:** `main`
**Reviewer bắt buộc:** Tech Lead → Founder QA (Gate 3)

---

## QUY ƯỚC CHUNG CHO MỌI ISSUE

### Labels GitHub
- `sprint-0`
- `priority/P0`
- `type/bug` hoặc `type/feature` hoặc `type/infra`
- `area/routing` | `area/content` | `area/legal` | `area/seo` | `area/testing`

### Owner / approver / risk tier
- **Owner R:** người chịu trách nhiệm triển khai issue, chỉ một người/role đứng chính.
- **Approver A:** người được quyền đóng issue sau khi DoD pass.
- **T1:** Tech Lead approve được nếu smoke/local evidence đủ.
- **T2:** cần Founder QA vì ảnh hưởng public UX, trust hoặc nội dung chính.
- **T3:** cần Founder + Legal/Compliance review vì liên quan thanh toán, refund, privacy hoặc claim pháp lý.

### Branch naming
```
sprint-0/<issue-number>-<short-slug>
```
Ví dụ: `sprint-0/01-fix-routing`, `sprint-0/04-content-fallback`

### Commit message format
```
[sprint-0][#<issue>] <short description>

<body>
```

### PR template
```markdown
## Issue
Closes #<issue-number>

## Changes
- ...

## DoD checklist
- [ ] (paste DoD từ issue, tick từng dòng)

## Test evidence
- Screenshot / curl output / Lighthouse JSON

## Founder QA notes
- (chỉ Tech Lead điền sau Gate 2)
```

---

## 📋 BẢNG TỔNG QUAN 9 ISSUES

| # | Title | Files chính | Effort | Day | Owner R / Approver A | Risk | Depends on |
|---|---|---|---|---|---|---|---|
| 01 | Fix routing + `_redirects` | `_redirects` | 2h | 1 | Tech Lead / Founder | T2 | — |
| 02 | Build designed 404 page | `404.html` | 1.5h | 1 | Frontend Dev / Tech Lead | T1 | 01 |
| 03 | Build posts fallback | `posts.html`, `/data/posts.json` | 3h | 1 | Frontend Dev / Tech Lead | T2 | 01 |
| 04 | Build content fallback 5 states | `content.html`, `/data/content.json` | 3h | 1 | Frontend Dev / Tech Lead | T2 | 01, 03 |
| 05 | Build contact page | `contact.html`, `/api/contact` | 2h | 1 | Tech Lead / Founder | T2 | 01 |
| 06 | Build donate page | `donate.html` | 2h | 1 | Content + Frontend / Founder | T3 | 01 |
| 07 | Build transparency page | `transparency.html` | 1.5h | 1 | Content Writer / Founder | T2 | 01 |
| 08 | Add legal + payment disclaimer | `legal.html`, `scripts/*.html` | 3h | 2 | Legal + Content / Founder + Legal | T3 | 01 |
| 09 | Smoke test script | `scripts/smoke-test.sh` | 1h | 3 | Tech Lead / Founder | T1 | tất cả |

**Tổng:** ~19h (~3 ngày × 1 dev full-time, hoặc 2 ngày × 2 dev).

**Note bundled (KHÔNG cần issue riêng):**
- `about.html` và `program.html` đã có template — chỉ cần routing đúng (Issue 01). Nếu nội dung trống, content writer fill song song.
- `events.html` và `scripts.html` đang hoạt động — không thuộc scope Sprint 0.

### Dependency graph
```text
Day 1                         Day 2                         Day 3
─────                         ─────                         ─────

Issue 01 Routing ───────┬──→ Issue 02 404 ───────────────┐
                        ├──→ Issue 03 Posts fallback ────┤
                        ├──→ Issue 04 Content fallback ──┤
                        ├──→ Issue 05 Contact ───────────┤
                        ├──→ Issue 06 Donate ───────┐    │
                        └──→ Issue 07 Transparency ──┤    │
                                                     │    │
Issue 08 Legal + payment disclaimer ────────────────┘    │
                                                          ▼
                                                   Issue 09 Smoke
                                                          ▼
                                                   Founder QA Gate
```

---

# 🎫 ISSUE 01 — Fix routing + `_redirects`

**Labels:** `sprint-0` `priority/P0` `type/infra` `area/routing`
**Effort:** 2h
**Assignee:** Tech Lead hoặc Senior Dev

### Mục tiêu
Mọi URL public phải trả `200`, `301` hoặc `404` đúng nghĩa. Không redirect sai sang `/content`.

### Tasks
- [ ] Tạo/cập nhật file `_redirects` ở root project (Cloudflare Pages)
- [ ] Verify deploy preview thấy file `_redirects` đã được Cloudflare đọc
- [ ] Sửa các route hiện đang redirect nhầm về `/content`

### File `_redirects` cần đạt
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

# Catch-all → 404 (Issue 02)
/*                               /404.html                             404
```

### Definition of Done
- [ ] File `_redirects` đã commit và deploy
- [ ] `curl -I https://duongsaotoasang.com/about` → `200`
- [ ] `curl -I https://duongsaotoasang.com/program` → `200`
- [ ] `curl -I https://duongsaotoasang.com/programs` → `301` (redirect về `/program`)
- [ ] `curl -I https://duongsaotoasang.com/posts` → `200`
- [ ] `curl -I https://duongsaotoasang.com/content` → `200`
- [ ] `curl -I https://duongsaotoasang.com/events` → `200`
- [ ] `curl -I https://duongsaotoasang.com/scripts` → `200`
- [ ] `curl -I https://duongsaotoasang.com/donate` → `200`
- [ ] `curl -I https://duongsaotoasang.com/transparency` → `200`
- [ ] `curl -I https://duongsaotoasang.com/legal` → `200`
- [ ] `curl -I https://duongsaotoasang.com/terms` → `302` về `/legal#terms`
- [ ] `curl -I https://duongsaotoasang.com/refund` → `302` về `/legal#refund`
- [ ] `curl -I https://duongsaotoasang.com/privacy` → `302` về `/legal#privacy`
- [ ] `curl -I https://duongsaotoasang.com/contact` → `200`
- [ ] `curl -I https://duongsaotoasang.com/payment-confirmation` → `302` về `/contact?type=payment-confirmation`
- [ ] Không URL nào redirect loop (max 1 hop)
- [ ] Test với cả `www.` và non-`www.` (nếu có cả hai)

---

# 🎫 ISSUE 02 — Build designed 404 page

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/routing`
**Effort:** 1.5h
**Depends on:** Issue 01

### Mục tiêu
Khi user truy cập URL không tồn tại, hiển thị trang 404 có thiết kế, không phải trang trắng default Cloudflare.

### Tasks
- [ ] Tạo `404.html` ở root
- [ ] Header + footer thống nhất với toàn site
- [ ] Hero: tiêu đề + mô tả + ảnh/icon
- [ ] CTA chính: "Về trang chủ" + CTA phụ: "Thư viện bài viết"
- [ ] Search box (tùy chọn)
- [ ] Meta noindex (để Google không index trang 404)

### HTML mẫu
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Không tìm thấy trang | DSTS</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://duongsaotoasang.com/404">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <!-- header chung -->
  <main class="page-404">
    <section class="hero-404">
      <h1>404 — Không tìm thấy trang</h1>
      <p>Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.</p>
      <div class="cta-group">
        <a class="btn-primary" href="/">← Về trang chủ</a>
        <a class="btn-secondary" href="/posts">Thư viện bài viết</a>
      </div>
    </section>
  </main>
  <!-- footer chung -->
</body>
</html>
```

### Definition of Done
- [ ] `https://duongsaotoasang.com/random-url-xyz` → render `404.html`
- [ ] HTTP status thật sự là `404` (curl `-I` xác nhận)
- [ ] Có CTA về home + thư viện bài viết
- [ ] Header + footer thống nhất với các trang khác
- [ ] Mobile 375px không vỡ
- [ ] `<meta name="robots" content="noindex">` có mặt
- [ ] Lighthouse SEO ≥ 80 (404 không cần ≥ 90)

---

# 🎫 ISSUE 03 — Build posts fallback

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/content`
**Effort:** 3h
**Depends on:** Issue 01

### Mục tiêu
`/posts` hiển thị danh sách bài viết hoặc fallback. Không loading vĩnh viễn.

### Tasks
- [ ] Sửa `posts.html` — JS loader với AbortController + timeout 5s
- [ ] Tạo `/data/posts.json` với tối thiểu 6 bài thật
- [ ] Thêm loading skeleton thay text "Đang tải bài viết..."
- [ ] Empty state đẹp khi cả API + fallback đều fail
- [ ] Mỗi card link sang `/content?slug=...` chuẩn

### Code mẫu
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
    console.error('[DSTS] posts', err);
    renderFallbackPosts();
  }
}

async function renderFallbackPosts() {
  try {
    const r = await fetch('/data/posts.json');
    renderPosts(await r.json(), { __source: 'fallback' });
  } catch {
    document.getElementById('posts-root').innerHTML = `
      <p class="empty-state">
        Tạm thời chưa tải được danh sách.
        <a href="javascript:location.reload()">Thử lại</a>
      </p>
    `;
  }
}
```

### Schema `/data/posts.json`
```json
[
  {
    "slug": "sang-tao-khong-bat-dau-tu-tham-vong",
    "title": "Sáng tạo không bắt đầu từ tham vọng",
    "excerpt": "Khi tham vọng đứng trước sáng tạo, mọi thứ trở thành biểu diễn...",
    "cover": "/assets/posts/sang-tao.webp",
    "tags": ["nhận thức", "sáng tạo"],
    "publishedAt": "2026-04-01",
    "readingTime": 7
  }
]
```

### Definition of Done
- [ ] `/posts` luôn hiển thị card (thật hoặc fallback)
- [ ] Mỗi card có: cover, title, excerpt, tags, ngày, link đúng `/content?slug=...`
- [ ] Disable network trong DevTools → vẫn render fallback
- [ ] API trả `[]` rỗng → render fallback
- [ ] API trả `500` → render fallback
- [ ] Loading skeleton hiển thị < 100ms, KHÔNG flash text "Đang tải..."
- [ ] `/data/posts.json` có tối thiểu 6 bài
- [ ] Console không có error đỏ ngoài log warning có ý

---

# 🎫 ISSUE 04 — Build content fallback 5 states

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/content`
**Effort:** 3h
**Depends on:** Issue 01, Issue 03

### Mục tiêu
`/content?slug=...` xử lý đủ **5 trạng thái**: loading, success, empty, error, not found. Không loading vĩnh viễn.

### 5 trạng thái cần hỗ trợ
| State | Trigger | Render |
|---|---|---|
| 1. Loading | Đang fetch | Skeleton |
| 2. Success | API trả data có body | `renderArticle(data)` |
| 3. Empty/Not in API | API 404 hoặc body rỗng | Fallback theo slug từ `/data/content.json` |
| 4. No slug | `?slug=` thiếu hoặc rỗng | Redirect `/posts` |
| 5. Error | Network/timeout/parse error | Fallback theo slug từ `/data/content.json` |
| 5b. Slug không có cả ở fallback | Cả API lẫn fallback miss | `renderNotFound(slug)` (đẹp, có CTA) |

### Code mẫu
```javascript
async function loadContent() {
  const slug = new URLSearchParams(location.search).get('slug');
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
    console.error('[DSTS] content', err);
    renderFallbackBySlug(slug);
  }
}

async function renderFallbackBySlug(slug) {
  try {
    const r = await fetch('/data/content.json');
    const local = await r.json();
    const article = local.find(a => a.slug === slug);
    if (article) renderArticle({ ...article, __source: 'fallback' });
    else renderNotFound(slug);
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

### Schema `/data/content.json`
```json
[
  {
    "slug": "sang-tao-khong-bat-dau-tu-tham-vong",
    "title": "Sáng tạo không bắt đầu từ tham vọng",
    "body": "<p>Nội dung HTML đầy đủ của bài viết...</p>",
    "cover": "/assets/posts/sang-tao.webp",
    "author": "Trần Hà Tâm",
    "publishedAt": "2026-04-01",
    "readingTime": 7,
    "tags": ["nhận thức", "sáng tạo"]
  }
]
```

### Definition of Done
- [ ] `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` render bài viết đầy đủ
- [ ] `/content?slug=bai-khong-ton-tai` render trang "Không tìm thấy" đẹp, KHÔNG đứng loading
- [ ] `/content` (không có slug) redirect `/posts`
- [ ] Disable network → fallback chạy
- [ ] API timeout > 5s → fallback chạy
- [ ] Loading skeleton hiển thị < 100ms
- [ ] `/data/content.json` có tối thiểu 3 bài có body đầy đủ (HTML)
- [ ] Console clean

---

# 🎫 ISSUE 05 — Build contact page

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/content`
**Effort:** 2h
**Depends on:** Issue 01

### Mục tiêu
`/contact` có nội dung thật + form gửi email được. Đây là kênh duy nhất user xác nhận thanh toán + khiếu nại, không được phép gãy.

### Tasks
- [ ] Tạo `contact.html` với hero + form + thông tin phụ
- [ ] Form fields: name, email, type (dropdown), message
- [ ] Type dropdown: "Tài trợ", "Đề xuất chương trình", "Hợp tác", "Xác nhận thanh toán", "Khác"
- [ ] Cloudflare Turnstile chống bot
- [ ] Submit endpoint: `/api/contact` (hoặc Cloudflare Worker/Function)
- [ ] Auto-reply user + gửi email founder (lưu vào TODO nếu chưa có)
- [ ] Thông tin phụ visible: email, Zalo, SLA phản hồi (24-48h)
- [ ] URL `?type=payment-confirmation` mặc định chọn dropdown đúng

### Definition of Done
- [ ] `/contact` trả 200
- [ ] Form fields đầy đủ + validation client-side
- [ ] Turnstile widget hiển thị
- [ ] Submit form → nhận response success/error rõ ràng
- [ ] Submit form → có email vào inbox founder (test với email thật)
- [ ] User nhận auto-reply (test với email thật)
- [ ] `/contact?type=payment-confirmation` → dropdown auto-select "Xác nhận thanh toán"
- [ ] Có email + Zalo + SLA visible
- [ ] Meta title + description riêng
- [ ] Canonical đúng
- [ ] Đúng 1 `<h1>`
- [ ] Mobile 375px không vỡ

---

# 🎫 ISSUE 06 — Build donate page

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/content` `area/legal`
**Effort:** 2h
**Depends on:** Issue 01

### Mục tiêu
`/donate` có đủ **8 mục bắt buộc** + ít nhất 1 phương thức donate hoạt động (manual confirmation ở Sprint 0).

### 8 mục bắt buộc
1. **Mục tiêu đóng góp** — quỹ dùng cho gì (học bổng, trẻ em, nghệ sĩ, cộng đồng)
2. **Hình thức đóng góp** — bank transfer, QR, PayPal (khi có), Stripe (khi có)
3. **Cách xác nhận** — sau chuyển khoản, gửi xác nhận qua `/contact?type=payment-confirmation`
4. **Chính sách hoàn tiền** — link `/legal#refund`
5. **Điều khoản sử dụng quỹ** — quỹ dùng đúng mục đích, có báo cáo
6. **Liên hệ xác minh** — email + Zalo
7. **Trạng thái** — đang mở / tạm đóng (đặt biến config)
8. **Báo cáo định kỳ** — link `/transparency`

### Tasks
- [ ] Tạo `donate.html` với 8 section
- [ ] Section "Hình thức": hiển thị QR + bank info (placeholder cho đến khi founder cung cấp)
- [ ] Section "Trạng thái": badge "Đang mở" hoặc "Tạm đóng"
- [ ] CTA: "Gửi xác nhận đóng góp" → `/contact?type=payment-confirmation`
- [ ] Link `/legal#refund` + `/transparency` đúng

### Definition of Done
- [ ] `/donate` trả 200
- [ ] Có đủ 8 mục, mỗi mục có heading rõ
- [ ] Section "Hình thức" có ít nhất 1 phương thức visible (QR hoặc bank info)
- [ ] CTA xác nhận đóng góp dẫn đúng về `/contact?type=payment-confirmation`
- [ ] Link `/legal#refund` và `/transparency` không gãy
- [ ] Trạng thái rõ ràng
- [ ] Meta title + description riêng
- [ ] Canonical đúng
- [ ] Đúng 1 `<h1>`
- [ ] Mobile 375px không vỡ

---

# 🎫 ISSUE 07 — Build transparency page

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/content` `area/legal`
**Effort:** 1.5h
**Depends on:** Issue 01

### Mục tiêu
`/transparency` có nội dung báo cáo mẫu — kể cả "Báo cáo khởi tạo Q2/2026" — không placeholder rỗng.

### Tasks
- [ ] Tạo `transparency.html`
- [ ] Section 1: Nguyên tắc minh bạch
- [ ] Section 2: Báo cáo khởi tạo Q2/2026 (mẫu, nội dung do content writer fill)
- [ ] Section 3: Lịch cập nhật (hằng tháng / quý)
- [ ] Section 4: Liên hệ xác minh
- [ ] Mỗi báo cáo có: ngày, mô tả, link xem chi tiết (PDF hoặc page riêng — placeholder OK)

### Nội dung mẫu Section 2 — Báo cáo khởi tạo Q2/2026
```markdown
## Báo cáo khởi tạo Q2/2026 (2026-04-01 → 2026-06-30)

**Trạng thái:** Báo cáo khởi tạo
**Cập nhật cuối:** 2026-05-12

### Tổng quan
- Số lượng người tham gia: [đang cập nhật]
- Quỹ đã tiếp nhận: [chưa kích hoạt nhận đóng góp công khai]
- Sự kiện đã tổ chức: [đang cập nhật]

### Nguyên tắc sử dụng quỹ
- 70% cho dự án trực tiếp (trẻ em, học bổng, nghệ sĩ, cộng đồng)
- 20% cho vận hành nền tảng
- 10% cho dự phòng

### Tài liệu liên quan
- Chính sách quỹ
- Đơn vị kiểm toán (sẽ công bố sau)
```

### Definition of Done
- [ ] `/transparency` trả 200
- [ ] Có ít nhất 1 báo cáo có nội dung (không trống)
- [ ] Có nguyên tắc minh bạch rõ ràng
- [ ] Có lịch cập nhật
- [ ] Link liên hệ xác minh đúng
- [ ] Meta + canonical + 1 `<h1>` đúng
- [ ] Mobile không vỡ

---

# 🎫 ISSUE 08 — Add legal + payment disclaimer

**Labels:** `sprint-0` `priority/P0` `type/feature` `area/legal`
**Effort:** 3h
**Depends on:** Issue 01

### Mục tiêu
Bảo vệ founder và user khỏi rủi ro pháp lý. Có disclaimer trên mọi trang giá cao. Có `/legal` gộp Terms + Refund + Privacy.

### Tasks

#### Phần 1: Tạo `legal.html`
- [ ] 3 section với anchor: `#terms`, `#refund`, `#privacy`
- [ ] Mỗi section có ngày cập nhật + version (v1.0 - 2026-05-12)
- [ ] Header nav cho phép jump nhanh
- [ ] Nội dung do content writer / legal advisor fill (placeholder text OK ở Sprint 0, hoàn thiện ở Sprint 1)

#### Phần 2: Thêm disclaimer vào tất cả 9 trang scripts
Files cần sửa:
- `scripts/rising-entrepreneur.html`
- `scripts/global-artist.html`
- `scripts/singing-icon.html`
- `scripts/cinematic-actor.html`
- `scripts/the-thinker.html`
- `scripts/creative-leader.html`
- `scripts/cultural-ambassador.html`
- `scripts/dsts-legacy.html`
- `scripts/global-story.html`

Paste block disclaimer ngay phía trên block thanh toán (trước "Tham gia hành trình"):

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

#### Phần 3: Gắn nhãn review mẫu
Trên mọi block reviews tĩnh của `/scripts/*`, thêm badge:

```html
<div class="reviews-disclaimer">
  <span class="badge badge-warning">Đánh giá minh họa</span>
  <span>Chưa phải phản hồi khách hàng thật.</span>
</div>
```

#### Phần 4: Sửa nút "Gửi xác nhận thanh toán"
Đổi từ `/contact` thuần → `/contact?type=payment-confirmation` (để Issue 05 auto-select dropdown).

#### Phần 5: Footer disclosure
Thêm vào footer chung:
```html
<p class="entity-disclosure">
  Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý.
</p>
```

### Definition of Done
- [ ] `/legal` trả 200
- [ ] `/legal#terms`, `/legal#refund`, `/legal#privacy` scroll đúng anchor
- [ ] Cả 9 trang `/scripts/*` có disclaimer block visible
- [ ] Cả 9 trang reviews có nhãn "Đánh giá minh họa"
- [ ] Nút thanh toán dẫn về `/contact?type=payment-confirmation`
- [ ] Footer disclosure xuất hiện ở mọi trang
- [ ] Mỗi section có ngày cập nhật + version

---

# 🎫 ISSUE 09 — Smoke test script

**Labels:** `sprint-0` `priority/P0` `type/testing` `area/testing`
**Effort:** 1h
**Depends on:** Tất cả issues khác

### Mục tiêu
Tự động kiểm tra mọi URL chính trả status đúng. Chạy local + CI. Đây là **gate cuối cùng** trước khi xin Founder QA.

### Tasks
- [ ] Tạo `scripts/smoke-test.sh`
- [ ] Chạy local pass tất cả URL
- [ ] (Optional Sprint 0, bắt buộc Sprint 2) Setup GitHub Actions workflow

### File `scripts/smoke-test.sh`
```bash
#!/bin/bash
set -e

BASE="${BASE_URL:-https://duongsaotoasang.com}"

urls=(
  "/"
  "/about"
  "/program"
  "/posts"
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong"
  "/events"
  "/scripts"
  "/donate"
  "/transparency"
  "/legal"
  "/terms"
  "/refund"
  "/privacy"
  "/contact"
  "/payment-confirmation"
  "/scripts/rising-entrepreneur"
  "/scripts/global-artist"
  "/scripts/singing-icon"
  "/scripts/cinematic-actor"
  "/scripts/the-thinker"
  "/scripts/creative-leader"
  "/scripts/cultural-ambassador"
  "/scripts/dsts-legacy"
  "/scripts/global-story"
)

failed=0
echo "=== DSTS Sprint 0 Smoke Test ==="
echo "Base: $BASE"
echo ""

for path in "${urls[@]}"; do
  status=$(curl -o /dev/null -s -L -w "%{http_code}" "${BASE}${path}")
  if [[ "$status" =~ ^(200|301)$ ]]; then
    echo "✅ $status  ${path}"
  else
    echo "❌ $status  ${path}"
    failed=$((failed + 1))
  fi
done

# 404 test
status_404=$(curl -o /dev/null -s -w "%{http_code}" "${BASE}/random-unknown-url-xyz-12345")
if [[ "$status_404" == "404" ]]; then
  echo "✅ 404  /random-unknown-url-xyz (correct)"
else
  echo "❌ Expected 404 for unknown URL, got: $status_404"
  failed=$((failed + 1))
fi

echo ""
if [[ $failed -gt 0 ]]; then
  echo "💥 $failed test(s) failed"
  exit 1
fi

echo "🎉 All smoke tests passed"
```

### Definition of Done
- [ ] Script `chmod +x` và chạy local OK
- [ ] Pass 100% URL list
- [ ] Test URL random → trả `404`
- [ ] Không redirect loop
- [ ] Lưu output cuối cùng vào file `tests/sprint-0-smoke-test-pass.log` để bằng chứng
- [ ] (Optional) GitHub Actions workflow `.github/workflows/smoke-test.yml` chạy on push

---

## ✅ GATE PHÊ DUYỆT SPRINT 0 — FOUNDER QA

Trước khi merge `main`, Tech Lead bàn giao cho founder. Anh Tâm tự test trên ≥ 2 thiết bị thật:

### Manual test
- [ ] Mở `https://duongsaotoasang.com/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → thấy bài viết (KHÔNG đứng "Đang tải...")
- [ ] Mở `/posts` → danh sách card
- [ ] Mở `/about`, `/program`, `/contact`, `/donate`, `/transparency`, `/legal` → mỗi trang nội dung riêng
- [ ] Click 100% link homepage → không trang nào lỗi
- [ ] Test URL random `/asdfasdf` → trả 404 đẹp
- [ ] Test gửi form `/contact` → nhận email
- [ ] Disclaimer payment hiển thị trên cả 9 trang scripts
- [ ] Mobile iPhone test pass

### Automated test
- [ ] Smoke test bash trả 0 lỗi
- [ ] Lighthouse mỗi trang ≥ 70 cho cả 4 mục (tạm thời, đạt ≥ 90 ở Sprint 3)

### Rubric check
- [ ] Tự chấm rubric 8 trụ ≥ 63 (tối thiểu) / 70 (target)
- [ ] Founder ký OK → merge → mở Sprint 1

---

## RISK & ESCALATION

| Rủi ro | Mức | Cách xử lý trong Sprint 0 |
|---|---|---|
| Cloudflare Pages không đọc `_redirects` đúng vì cache/deploy sai project | High | Deploy đúng `duongsaotoasang-com-v2`, verify bằng `curl -I`, không dùng project `duongsaotoasang-web` |
| `/content` hoặc `/posts` API lỗi kéo dài | High | Fallback tĩnh `/data/content.json` và `/data/posts.json` là bắt buộc; API fail không được chặn render |
| Contact email/Turnstile chưa kịp hoàn thiện trong 3 ngày | Medium | Form vẫn phải có validation + error state; nếu email chưa live, fallback sang mailto/manual contact và log blocker vào PR |
| Legal entity chưa xác minh | High | Dùng đúng placeholder: "Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý." Không hardcode tên pháp nhân |
| Payment processor chưa có | High | Chỉ dùng manual confirmation; không bật nút donate/payment tự động trước khi Terms/Refund/Privacy được Founder duyệt |
| Link hệ sinh thái ngoài site bị 502 | Medium | Ẩn link trực tiếp hoặc dẫn qua landing bridge nội bộ; không để homepage trỏ vào domain lỗi |
| Review mẫu bị hiểu là review thật | Medium | Gắn nhãn "Đánh giá minh họa — chưa phải phản hồi khách hàng thật" hoặc ẩn review cho đến khi có dữ liệu xác minh |

**Escalation rule:** Nếu một issue T2/T3 không đạt DoD trong ngày được giao, Tech Lead phải ghi blocker vào PR + báo Founder trong cùng ngày. Không tự giảm DoD để merge.

---

## 📦 BÀN GIAO SAU MERGE

1. Tech Lead merge PR vào `main`
2. Cloudflare Pages auto-deploy production
3. Tech Lead verify smoke test trên production thật (`BASE_URL=https://duongsaotoasang.com bash scripts/smoke-test.sh`)
4. Tech Lead update `dsts-100-progress.md` với điểm rubric mới
5. Bắt đầu plan Sprint 1 theo Master Plan v1.1-LOCKED

---

**Lock 2026-05-12 by Trần Hà Tâm.**
**Branch chuẩn:** `sprint-0/stop-the-bleeding`
**Mọi điều chỉnh kế hoạch:** mở PR riêng vào file Master Plan, bump version v1.2.
