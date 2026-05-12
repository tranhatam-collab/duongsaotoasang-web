# DSTS — SPRINT 0 TICKETS (Stop the bleeding)

> **Sprint:** 0 · **Duration:** 3 ngày (D1–D3 sau khi founder ký)
> **Mục tiêu:** 38 → ≥ 63 điểm. Không URL nào public còn 404 nhầm hay stuck "Đang tải".
> **Brandpro overlay:** Phase 1 — Forensics (smoke test toàn site, log evidence).
> **Owner R / Approver A:** Tech Lead / Founder.

---

## TICKET S0-T1 — `_redirects` chuẩn hóa clean URL

**Type:** Bug / Routing · **Risk Tier:** T2 · **Effort:** 2h
**Trụ:** 1 (Technical) · **Điểm:** +5

### Vấn đề hiện tại

```bash
$ curl -sI https://duongsaotoasang.com/about | grep -i location
location: https://duongsaotoasang.com/content
```

Cả `/about`, `/program`, `/contact` đều redirect về `/content` (đều trả về template `content.html`).

### Yêu cầu sửa

Cập nhật file `_redirects` ở root project:

```
# Clean URLs cho trang static thật
/about         /about.html         200
/program       /program.html       200
/contact       /contact.html       200
/donate        /donate.html        200
/transparency  /transparency.html  200
/terms         /terms.html         200
/refund        /refund.html        200
/privacy       /privacy.html       200
/scripts       /scripts.html       200
/posts         /posts.html         200
/events        /events.html        200

# Force clean URL — 301 .html về clean URL
/about.html         /about         301
/program.html       /program       301
/contact.html       /contact       301
/donate.html        /donate        301
/transparency.html  /transparency  301
/terms.html         /terms         301
/refund.html        /refund        301
/privacy.html       /privacy       301
/scripts.html       /scripts       301
/posts.html         /posts         301
/events.html        /events        301

# Content detail (giữ query string)
/content       /content.html       200

# Fallback 404
/*             /404.html           404
```

### DoD (Definition of Done)

- [ ] Curl `/about` `/program` `/contact` trả HTTP 200 với content riêng (không phải template content.html)
- [ ] Curl `/about.html` redirect 301 → `/about`
- [ ] URL không tồn tại (`/xyzabc`) → 404 + page brand-aligned
- [ ] PR comment paste output của `scripts/smoke.sh` chứng minh pass

### Dependencies
- Phải hoàn thành S0-T2 (tạo file `about.html` v.v.) trước khi rules redirect hoạt động đúng.

---

## TICKET S0-T2 — Tạo 5 trang static thật

**Type:** Feature / Content · **Risk Tier:** T2 · **Effort:** 1 ngày (Content + Dev)
**Trụ:** 2 (Content & UX) + 3 (SEO) · **Điểm:** +6

### Yêu cầu

Tạo 5 file HTML thật ở root (cùng cấp index.html):

1. `about.html`
2. `program.html`
3. `contact.html`
4. `donate.html` (placeholder hợp pháp đầy đủ)
5. `transparency.html` (placeholder hợp pháp đầy đủ)

### Cấu trúc bắt buộc mỗi trang

```
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>[Tên trang] | Đường Sao Tỏa Sáng</title>
  <meta name="description" content="[150-160 ký tự riêng từng trang]">
  <link rel="canonical" href="https://duongsaotoasang.com/[slug]">
  <link rel="stylesheet" href="/app.css">

  <!-- OG -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:url" content="https://duongsaotoasang.com/[slug]">
  <meta property="og:image" content="https://duongsaotoasang.com/og.png">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <!-- ... -->
</head>
<body class="homepage">
  <a class="skip-link" href="#mainContent">Bỏ qua nội dung điều hướng</a>
  <div id="siteHeader" class="home-nav-accent"></div>

  <main class="wrap" id="mainContent">
    <!-- HERO -->
    <section class="hero reveal" aria-labelledby="pageTitle">
      <div class="hero-shell">
        <div class="hero-copy">
          <div class="eyebrow">[BREADCRUMB]</div>
          <h1 id="pageTitle">[Tiêu đề trang]</h1>
          <p class="lead">[Mô tả 200-300 từ]</p>
        </div>
      </div>
    </section>

    <!-- 3 SECTION CONTENT -->
    <section class="section reveal">...</section>
    <section class="section reveal">...</section>
    <section class="section reveal">...</section>

    <!-- CTA -->
    <section class="section reveal">
      <a class="btn primary" href="/contact">[CTA]</a>
    </section>
  </main>

  <div id="siteFooter"></div>
  <script src="/assets/app-v4.js"></script>
</body>
</html>
```

### Nội dung mỗi trang (founder duyệt)

**`/about` (Giới thiệu DSTS):**
- Hero: "Đường Sao Tỏa Sáng — Hành trình tỏa sáng của Người Việt Nam trên toàn cầu"
- Section 1: Câu chuyện ra đời (200 từ)
- Section 2: Sứ mệnh + Tầm nhìn (Brandpro 05.B+C)
- Section 3: 3 giá trị cốt lõi (Brandpro 05.D)
- CTA: Khám phá chương trình

**`/program` (Chương trình DSTS):**
- Hero: "8 chuỗi chương trình tôn vinh người Việt"
- Section 1: Tổng quan 8 chuỗi (Rising Entrepreneur, Global Artist, Singing Icon, Cinematic Actor, The Thinker, Creative Leader, Cultural Ambassador, DSTS Legacy)
- Section 2: Quy trình tham gia
- Section 3: Tiêu chí lựa chọn
- CTA: Xem kịch bản chi tiết

**`/contact` (Liên hệ):**
- Hero: "Liên hệ với Đường Sao Tỏa Sáng"
- Section 1: Form contact (name, email, message, Turnstile)
- Section 2: Thông tin liên hệ trực tiếp (email, Zalo, thời gian phản hồi)
- Section 3: FAQ ngắn (5 câu)
- CTA: Gửi tin nhắn

**`/donate` (Đóng góp — bắt buộc Brandpro 11 + DSTS Trust):**

8 mục bắt buộc (sẽ hoàn thiện ở Sprint 1, ở Sprint 0 dùng placeholder hợp pháp):
1. Mục tiêu quỹ
2. Hình thức đóng góp (PayPal, bank, QR)
3. Cách xác nhận
4. Chính sách hoàn tiền (link `/refund`)
5. Điều khoản sử dụng quỹ
6. Liên hệ xác minh
7. Trạng thái quỹ hiện tại
8. Báo cáo định kỳ (link `/transparency`)

CẤM: nút "Donate Now" hoạt động thật ở Sprint 0 (chỉ enable sau khi /terms /refund /privacy hoàn thành Sprint 1).

**`/transparency` (Minh bạch):**
- Hero: "Cam kết minh bạch"
- Section 1: Nguyên tắc công bố
- Section 2: Báo cáo khởi tạo Q1/2026 (placeholder, sẽ thay sau)
- Section 3: Lịch cập nhật định kỳ (hàng quý)
- CTA: Đăng ký nhận báo cáo qua email

### DoD

- [ ] 5 file HTML tồn tại ở root
- [ ] Curl từng URL trả 200 với title + canonical + nội dung riêng
- [ ] Mỗi trang ≥ 300 từ nội dung thật (không lorem ipsum)
- [ ] Mỗi trang có ít nhất 1 CTA rõ ràng
- [ ] Footer thống nhất với homepage
- [ ] Mobile responsive 320–1920px
- [ ] Founder ký duyệt nội dung từng trang

---

## TICKET S0-T3 — `/content?slug=` xử lý đủ 5 state + fallback hard-coded

**Type:** Bug · **Risk Tier:** T2 · **Effort:** 4h
**Trụ:** 1 (Technical) + 2 (Content) · **Điểm:** +5

### Vấn đề hiện tại

```html
<h1 class="article-title" id="pageTitle">Đang tải nội dung...</h1>
```

Trang đứng yên ở "Đang tải nội dung..." mãi mãi khi API fail hoặc slug không tồn tại.

### Yêu cầu sửa

Update `content.html` + `assets/app-v4.js`:

```javascript
// assets/app-v4.js — bổ sung
DSTS.loadContent = async function (slug) {
  if (!slug) { window.location.replace('/posts'); return; }

  showSkeleton('.content-body'); // S0-T5: skeleton tạm cho Sprint 0

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`, { signal: ctrl.signal });
    clearTimeout(timeout);

    if (res.status === 404) return renderNotFound(slug);
    if (!res.ok) throw new Error('API_FAIL');

    const data = await res.json();
    if (!data || !data.body) return renderFallbackBySlug(slug);

    renderArticle(data);
  } catch (err) {
    console.error('[DSTS][content]', err);
    renderFallbackBySlug(slug);
  }
};

DSTS.fallbackPosts = {
  'sang-tao-khong-bat-dau-tu-tham-vong': {
    title: 'Sáng tạo không bắt đầu từ tham vọng',
    excerpt: 'Một góc nhìn khác về sáng tạo của người Việt toàn cầu.',
    body: '<p>...</p><p>...</p>', // ≥ 800 từ nội dung thật
    cover_url: '/assets/covers/sang-tao.webp',
    created_at: '2026-04-15'
  },
  // 5 bài mẫu khác — xem `data/posts.json`
};

function renderFallbackBySlug(slug) {
  const data = DSTS.fallbackPosts[slug];
  if (!data) return renderNotFound(slug);
  renderArticle({ ...data, __source: 'fallback' });
}

function renderNotFound(slug) {
  document.getElementById('pageTitle').textContent = 'Không tìm thấy bài viết';
  document.querySelector('.content-body').innerHTML = `
    <p>Bài viết "${escapeHTML(slug)}" không tồn tại hoặc đã bị xoá.</p>
    <p><a class="btn primary" href="/posts">Quay lại thư viện</a></p>
  `;
}
```

Tạo file `data/posts.json` với 6 bài mẫu nội dung thật:
- `sang-tao-khong-bat-dau-tu-tham-vong`
- `nguoi-viet-toan-cau-va-can-cuoc-van-hoa`
- `khoanh-khac-toa-sang-cua-mot-the-he`
- `hanh-trinh-tu-vietnam-ra-the-gioi`
- `nghe-thuat-song-cua-doanh-nhan-viet`
- `tam-the-cua-mot-cong-dan-toan-cau`

### DoD

- [ ] `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` render bài đầy đủ ≥ 800 từ
- [ ] Force API fail (disable Network trong DevTools) → vẫn render bài từ fallback
- [ ] `/content?slug=khong-ton-tai-xyz` → trang "Không tìm thấy" + CTA
- [ ] `/content` không có slug → redirect `/posts`
- [ ] Timeout 5s → fallback trigger (test bằng API mock chậm)
- [ ] Console không có error chưa handle

---

## TICKET S0-T4 — `404.html` brand-aligned

**Type:** Feature · **Risk Tier:** T1 · **Effort:** 2h
**Trụ:** 1 · **Điểm:** +2

### Yêu cầu

Trang `404.html` hiện đã tồn tại nhưng cần đảm bảo:
- Title: "Không tìm thấy trang | Đường Sao Tỏa Sáng"
- Hero brand-aligned (giống style homepage)
- 3 CTA: Về trang chủ / Khám phá chương trình / Xem kịch bản
- Header + Footer thống nhất
- noindex meta để Google không index

```html
<meta name="robots" content="noindex,follow">
```

### DoD

- [ ] Truy cập URL bất kỳ không tồn tại → render `404.html`
- [ ] Visual nhất quán brand (color, font, header, footer)
- [ ] 3 CTA hoạt động
- [ ] `<meta name="robots" content="noindex,follow">` có

---

## TICKET S0-T5 — Loading skeleton thay "Đang tải..."

**Type:** Enhancement · **Risk Tier:** T1 · **Effort:** 3h
**Trụ:** 5 (Design) · **Điểm:** Sprint 3 thực sự — Sprint 0 chỉ cần MVP

### Yêu cầu MVP (Sprint 0)

Thêm CSS skeleton vào `app.css`:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.10) 50%,
    rgba(255,255,255,0.04) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-line { height: 14px; margin: 8px 0; }
.skeleton-title { height: 28px; width: 60%; }
.skeleton-card { height: 200px; }

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

Helper JS:

```javascript
DSTS.showSkeleton = function (selector, type = 'article') {
  const el = document.querySelector(selector);
  if (!el) return;
  const templates = {
    article: `
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-line" style="width:80%"></div>
      <div class="skeleton skeleton-line" style="width:95%"></div>
      <div class="skeleton skeleton-line" style="width:70%"></div>
    `,
    card: `<div class="skeleton skeleton-card"></div>`,
  };
  el.innerHTML = templates[type] || templates.article;
};
```

### DoD

- [ ] CSS skeleton có trong `app.css`
- [ ] `DSTS.showSkeleton()` hoạt động
- [ ] `/content?slug=...` lúc loading hiển thị skeleton (không phải text "Đang tải...")

---

## TICKET S0-T6 — Smoke test crawler `scripts/smoke.sh`

**Type:** DevOps · **Risk Tier:** T1 · **Effort:** 1h
**Trụ:** 1 + 8 (Ops) · **Điểm:** +3

### Yêu cầu

Tạo `scripts/smoke.sh`:

```bash
#!/usr/bin/env bash
# scripts/smoke.sh — DSTS production smoke test
# Usage: ./scripts/smoke.sh [base_url]
# Default base_url: https://duongsaotoasang.com

set -uo pipefail

BASE="${1:-https://duongsaotoasang.com}"
FAILED=0

# Pairs: URL EXPECTED_STATUS
URLS=(
  "/                                              200"
  "/about                                         200"
  "/program                                       200"
  "/contact                                       200"
  "/scripts                                       200"
  "/scripts/rising-entrepreneur                   200"
  "/scripts/global-artist                         200"
  "/scripts/singing-icon                          200"
  "/scripts/cinematic-actor                       200"
  "/scripts/the-thinker                           200"
  "/scripts/creative-leader                       200"
  "/scripts/cultural-ambassador                   200"
  "/scripts/dsts-legacy                           200"
  "/scripts/global-story                          200"
  "/posts                                         200"
  "/events                                        200"
  "/donate                                        200"
  "/transparency                                  200"
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong  200"
  "/sitemap.xml                                   200"
  "/robots.txt                                    200"
  "/non-existent-xyz-abc                          404"
)

printf "%-60s %-6s %-6s %s\n" "URL" "EXPECT" "ACTUAL" "RESULT"
printf "%s\n" "$(printf -- '-%.0s' {1..90})"

for entry in "${URLS[@]}"; do
  url=$(echo "$entry" | awk '{print $1}')
  expect=$(echo "$entry" | awk '{print $NF}')
  actual=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${url}")
  if [ "$actual" = "$expect" ]; then
    result="✅ PASS"
  else
    result="❌ FAIL"
    FAILED=$((FAILED + 1))
  fi
  printf "%-60s %-6s %-6s %s\n" "$url" "$expect" "$actual" "$result"
done

echo ""
if [ "$FAILED" -gt 0 ]; then
  echo "❌ ${FAILED} URL failed smoke test."
  exit 1
else
  echo "✅ All smoke tests passed."
  exit 0
fi
```

### DoD

- [ ] File `scripts/smoke.sh` checked in, executable
- [ ] Chạy local: `./scripts/smoke.sh` → 100% pass
- [ ] Output paste vào PR description
- [ ] Bonus: thêm GitHub Action chạy mỗi lần push lên `main`

---

## GATE SPRINT 0 — Founder QA

Trước khi merge `main` và tính điểm Sprint 0:

### Smoke test
- [ ] `./scripts/smoke.sh https://duongsaotoasang.com` → 100% pass

### Manual check
- [ ] Click thử 100% link từ homepage → không gãy
- [ ] `/about` `/program` `/contact` mỗi trang có nội dung riêng + title riêng + canonical đúng
- [ ] `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` render bài viết có nội dung
- [ ] `/donate` `/transparency` hiển thị placeholder hợp pháp đầy đủ
- [ ] `/404` (URL không tồn tại) trả `404.html` brand-aligned
- [ ] Mobile test (iPhone, Android) → không vỡ layout

### Founder approval
- [ ] Nội dung 5 trang static ký duyệt
- [ ] PR có comment paste smoke test output + lighthouse mobile screenshot
- [ ] Founder ký "OK Sprint 0" → tech lead merge `main` → deploy production

**Sau merge:** Chạy lại smoke test trên production, screenshot lưu `_artifacts/sprint-0-final-smoke.txt`.

**Điểm sau Sprint 0:** 38 → **63** (Trụ 1 +13, Trụ 2 +6, Trụ 8 +3, Trụ 3 +3).

---

*Mọi vấn đề phát sinh trong Sprint 0 phải log vào `_artifacts/sprint-0-issues.md` và ghi vào Brandpro Risk Register (file 14.C). Không giấu lỗi.*
