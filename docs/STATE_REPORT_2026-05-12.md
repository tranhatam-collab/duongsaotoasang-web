# DSTS — BÁO CÁO TRẠNG THÁI THỰC TẾ (Re-audit)

**Domain:** https://duongsaotoasang.com
**Ngày audit:** 2026-05-12 (sau commit `bbb977d`)
**Phương pháp:** Smoke test toàn bộ route + curl HTML + đối chiếu canonical + view-source.
**Cập nhật so với báo cáo cũ `dsts-bug-report.md`:** v1.0 → v1.1 (xác nhận lỗi P0 chưa fix dứt điểm sau Cốc Cốc patch)

---

## I. EVIDENCE — SMOKE TEST HIỆN TRẠNG

| URL | HTTP | Title | Canonical | Trạng thái thực tế |
|---|---|---|---|---|
| `/` | 200 | DSTS \| Hành trình tỏa sáng… | `/` | ✅ OK |
| `/scripts` | 200 | Kịch bản – Thư viện | `/scripts` | ✅ OK |
| `/posts` | 200 | Thư viện bài viết | `/posts` | ✅ OK |
| `/events` | 200 | Sự kiện – Workshop | `/events` | ✅ OK |
| `/scripts/rising-entrepreneur.html` | 308 → `/scripts/rising-entrepreneur` | – | – | ✅ Clean URL OK |
| `/about` | **308 → `/content`** | "Bài viết \| Tri thức sâu sắc" | `/content.html` | 🔴 P0: redirect nhầm về `/content`, canonical sai |
| `/program` | **308 → `/content`** | "Bài viết \| Tri thức sâu sắc" | `/content.html` | 🔴 P0: như trên |
| `/contact` | **308 → `/content`** | "Bài viết \| Tri thức sâu sắc" | `/content.html` | 🔴 P0: như trên |
| `/content` | 200 | – | – | ⚠️ Tồn tại nhưng stuck loading |
| `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` | 200 | – | – | 🔴 P0: `<h1>Đang tải nội dung...</h1>` không render bài thật |
| `/donate` | **404** | – | – | 🔴 P0: thiếu trang quan trọng (donate flow) |
| `/transparency` | **404** | – | – | 🔴 P0: thiếu trang minh bạch |
| `/terms` | **404** | – | – | 🟠 P1: thiếu pháp lý cơ bản |
| `/refund` | **404** | – | – | 🟠 P1: thiếu pháp lý (bắt buộc khi bán 25K USD) |
| `/privacy` | **404** | – | – | 🟠 P1: thiếu pháp lý (GDPR/cookie) |
| `/sitemap.xml` | 200 | – | – | ✅ Có rồi |
| `/robots.txt` | 200 | – | – | ✅ Có rồi |

---

## II. CHẨN ĐOÁN CHÍNH XÁC

### 🔴 P0 chưa giải quyết (sau Cốc Cốc patch `bbb977d`)

**1. Routing `/about`, `/program`, `/contact` vẫn nhập về `/content`**

- Bằng chứng curl: `Location: https://duongsaotoasang.com/content`
- Title 3 trang đều = "Bài viết | Tri thức sâu sắc - Đường Sao Tỏa Sáng" (template `content.html`)
- Canonical 3 trang = `/content.html` → Google sẽ coi 3 URL là duplicate của `/content.html`
- **Hậu quả:** Backlink build cho `/about`, `/program`, `/contact` sẽ chuyển toàn bộ link juice về `content.html`. SEO của 3 trang quan trọng = 0.
- **Fix yêu cầu:** Tạo 3 file thật `about.html`, `program.html`, `contact.html` với nội dung riêng + canonical đúng URL của chính nó.

**2. `/content?slug=...` vẫn stuck loading**

- View-source: `<h1 class="article-title" id="pageTitle">Đang tải nội dung...</h1>`
- Không có nội dung server-rendered → Google bot crawl về thấy "Đang tải" → bài viết KHÔNG BAO GIỜ index.
- **Fix yêu cầu:** Pre-render SSR top 20 slug hot lúc build (Cloudflare Pages Functions hoặc static prebuild).

**3. 5 trang 404**

- `/donate`, `/transparency`, `/terms`, `/refund`, `/privacy`
- Đây là 5 trang BẮT BUỘC trước khi mở campaign donate / bán gói 25K USD.

### 🟢 Đã fix (sau patch `bbb977d`)

- Homepage `/` render full (hero + nav + footer thống nhất).
- `/posts` không stuck "Đang tải bài viết" nữa.
- `/scripts/*` clean URL (không `.html`) hoạt động qua 308.
- `sitemap.xml` + `robots.txt` accessible.
- App.js không còn corrupt (đã rename `app-v4.js`).

---

## III. ĐIỂM HIỆN TẠI THEO RUBRIC 100/100

| Trụ | Trọng số | Hiện tại | Ghi chú |
|---|---|---|---|
| 1. Technical & Routing | 20 | **8** | URL redirect sai 3 trang, content stuck loading, không SSR |
| 2. Content & UX | 20 | **11** | Homepage + scripts + posts OK; còn `/content`, /about, /program, /contact rỗng |
| 3. SEO | 15 | **5** | Có sitemap + robots; chưa có schema event/article, chưa SSR, canonical sai 3 trang |
| 4. Trust & Legal | 15 | **1** | Thiếu donate, transparency, terms, refund, privacy |
| 5. Design & Brand | 10 | **7** | Footer thống nhất, header OK; chưa có design tokens, skeleton |
| 6. Conversion & Payment | 10 | **3** | Contact form không hoạt động, không có order ID, không có analytics event |
| 7. Ecosystem | 5 | **2** | Có link `nguoiviet.muonnoi.org` (cần verify), chưa SSO, chưa map ecosystem |
| 8. Ops & Observability | 5 | **1** | Không có GA4/Sentry/UptimeRobot, không có runbook |
| **TỔNG** | **100** | **38/100** | Cao hơn dự đoán v1.0 (~32) vì đã có sitemap + posts fallback |

**Điểm cần cộng để đạt 100:** **+62 điểm trong 4 tuần**.

---

## IV. ƯU TIÊN FIX (Re-confirmed)

### Khẩn cấp trong 72 giờ (Sprint 0)

1. Tạo `about.html`, `program.html`, `contact.html` thật → chặn duplicate canonical.
2. Tạo `donate.html`, `transparency.html` với nội dung placeholder hợp pháp + CTA contact.
3. SSR / prebuild ít nhất 6 bài viết mẫu cho `/content?slug=*` → server trả HTML có nội dung.
4. `_redirects` chuẩn hóa: clean URL → file thật (KHÔNG redirect về `/content` nữa).

### Quan trọng trong tuần 1 (Sprint 1)

5. Soạn `/terms`, `/refund`, `/privacy` (luật sư duyệt song song nếu cần).
6. Footer disclosure: legal entity (VIET CAN NEW CORP / VFA) + 3 link policy.
7. Reviews trên `/scripts/*` gắn nhãn "Đánh giá minh họa".

### Đầu tư trung hạn (Sprint 2–4)

8. Schema.org JSON-LD (Article + Event + Organization).
9. Canonical đúng từng trang (audit Screaming Frog).
10. Analytics + Sentry + UptimeRobot.
11. Lighthouse ≥ 90 cho cả 4 trục.
12. Brand Guardian (Brandpro Phase 5).

---

*Báo cáo này là baseline để đo điểm cộng từng sprint. Sprint 0 phải đưa từ 38 → ≥ 60. Mỗi gate kiểm chứng bằng smoke test + view-source chứ không dựa lời khai team dev.*
