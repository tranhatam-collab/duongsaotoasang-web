# DSTS — QA PRODUCTION AUDIT (Bilingual / SEO / UI / A11y)

> **Vai trò:** Senior QA Lead · Content Editor · Frontend Engineer · SEO Auditor
> **Ngày:** 2026-06-15
> **Phạm vi:** CHỈ repo `duongsaotoasang.com` đang mở. Không sửa/deploy/commit/push.
> **Chuẩn tham chiếu:** Brand master `_TEMPLATE-MASTER-v2` (09-Bilingual-Messaging, 06-Verbal-Identity) — chỉ đọc, không sửa.
> **Trạng thái:** BƯỚC 1–3 (Analyze → Audit Report → Fix Plan). Chưa implement. Chờ duyệt.

---

## 0. KIỂM TOÁN BÁO CÁO CŨ

**Kết luận: hai chỉ số 50.35% và 93% KHÔNG mâu thuẫn — chúng đo hai thứ khác nhau.**

| Nguồn | Ý nghĩa | Giá trị |
|---|---|---|
| `AUDIT_100_PERCENT_MASTER_PLAN_2026-06-15.md` dòng 17 | Strategic baseline (Vision/Architecture/Legal…) `88/95` | 93% |
| `AUDIT_100_PERCENT_MASTER_PLAN_2026-06-15.md` dòng 194 | Implementation completion có trọng số (6 Layer) | 50.35% |

→ `93%` = mức trưởng thành chiến lược; `50.35%` = phần code đã build xong. Đây là **hai trục đo hợp lệ**, không phải lỗi mâu thuẫn. Chỉ cần khi đối ngoại ghi rõ nhãn từng trục để tránh hiểu nhầm — **KHÔNG xếp thành P0**.

**Các claim trong report cũ — verify repo-side / hạ tầng:**

| Claim report cũ | Kết quả verify | Đánh giá |
|---|---|---|
| D1 account chạm giới hạn 10 DB | ĐÚNG — account `62d57eaa` = 10/10 full | ✅ Chính xác (vẫn là blocker capacity) |
| Payment trả `403 API_KEY_INVALID` | Code `create-intent.js` hiện gọi canonical `/internal/checkout-session`; probe 403 trước đó gọi endpoint khác. Nguyên nhân **chưa được chứng minh hoàn toàn** | ⚠️ Payment runtime chưa được chứng nhận; cần kiểm credential đúng tenant/site trên endpoint canonical |
| Donation "TẠM ĐÓNG" | **Intentional closed gate** (`donate.html:140`): cổng chủ động đóng cho tới khi đủ payment production + biên nhận + bằng chứng kiểm duyệt — KHÔNG phải chỉ do payment runtime lỗi | ✅ Đúng & có chủ đích |
| Cache rule 14400s thay vì 300s | ĐÚNG (Founder xác minh): asset đúng nhưng TTL bị zone rule ép `14400`; Pages alias dùng `300` | ✅ Là infrastructure blocker |
| GA4 chưa cấu hình | ĐÚNG — `index.html` còn `G-XXXXXXXXXX` placeholder | ✅ Chính xác (P1 analytics) |

**Cập nhật hạ tầng (Founder xác minh 2026-06-15):**
- `duongsaotoasang.com` **đang resolve, HTTPS 200, Pages domain `active`** — KHÔNG còn NXDOMAIN.
- Project `duongsaotoasang-com-v2` **đã hoạt động trong account `62d57eaa`** — KHÔNG còn việc migrate Pages; chỉ còn D1 thiếu capacity.

**Tóm lại:** Report cũ đúng về các blocker hạ tầng (D1, cache TTL, GA4). Report cũ **chưa** chạm tới lớp QA production song ngữ (header coverage `/en/`, SEO meta, hreflang) — đó là phần bổ sung bên dưới.

---

## I. ANALYZE — KIẾN TRÚC HIỆN TRẠNG

| Hạng mục | Thực tế |
|---|---|
| Build tool | Không có (static HTML + Cloudflare Pages Functions). Không có `package.json` build script. |
| File HTML | **107 file thô** → 105 page candidates sau khi loại 2 fragment (`_footer`, …). Bao gồm cả admin/dashboard/internal, KHÔNG phải 107 trang public. |
| Header/nav/menu | Inject bằng JS từ `assets/app-v5.js` vào `<div id="siteHeader">` |
| Mobile menu | CÓ hamburger (`.site-mobile-toggle`, `aria-expanded`, `.site-menu.open`) — **nằm trong app-v5.js**, wiring click đầy đủ |
| Language switcher | Trong header (app-v5.js), dùng cơ chế `?lang=en`. VI runtime đã đúng: `sponsors: "Tài trợ"` (`app-v5.js:122`) |
| i18n | **Kép, mâu thuẫn:** (1) `?lang=en` runtime trong `app-v5.js` (nguồn thật); (2) thư mục tĩnh `/en/` (10 trang). ⚠️ `assets/i18n.js` là **dead code — KHÔNG trang nào import**. |
| SEO meta | Title/description/canonical phủ tốt ở trang chính; OG/hreflang KHÔNG đồng đều |
| Ảnh | Chỉ 4 `<img>` toàn site (chủ yếu SVG/CSS) → alt text rủi ro thấp |

---

## II. AUDIT REPORT — LỖI THEO ƯU TIÊN

### 🔴 P0 — Bilingual/SEO certification blockers (chặn chứng nhận release song ngữ — KHÔNG chặn production hiện tại đang live)

**P0-1 · Hai cơ chế song ngữ xung đột (`?lang=en` vs `/en/`) + logic ngôn ngữ không nhận `/en/`**
- `index.html` hreflang EN → `https://duongsaotoasang.com/en/`
- `legacy.html` hreflang EN → `https://duongsaotoasang.com/legacy?lang=en`
- Header switcher (app-v5.js) dùng `?lang=en`; nhưng tồn tại song song 10 trang tĩnh `/en/`.
- **Lỗi logic (verify thực tế):** `DSTS.getLang()` (`app-v5.js:6-13`) CHỈ trả `"en"` khi có `?lang=en`, KHÔNG đọc pathname `/en/`. `DSTS.withLang()` (`app-v5.js:15-30`) gắn `?lang=en` chứ KHÔNG map sang `/en/`. → Gắn app-v5.js vào trang `/en/*` (không có `?lang=en`) sẽ render **menu VI**. Phải sửa `getLang` nhận `/en/` pathname + `withLang` ánh xạ đúng VI↔`/en/`.
- **Hệ quả SEO:** Google nhận hreflang/canonical mâu thuẫn → duplicate content, alternate sai, loãng index.
- **Phạm vi hreflang:** chỉ áp `vi/en/x-default` cho **10 cặp route có bản dịch thật** (verify: cả 10 trang /en/ đều có cặp VI — `about,contact,donate,index,legacy,map` dạng file phẳng; `register,sponsor,trust,verify` dạng `*/index.html`). Trang VI **chưa có** bản EN thì KHÔNG được tạo alternate EN giả.
- File: `index.html`, `legacy.html`, `assets/app-v5.js`, toàn bộ `en/*.html`.

**P0-2 · 10/10 trang `/en/` KHÔNG có shared header**
- Không trang `/en/` nào load `app-v5.js` → **không nav, không hamburger, không language switcher, không quay lại VI**.
- Vi phạm Brand rule #4 (mỗi ngôn ngữ phải có menu/CTA/metadata riêng & đầy đủ).
- File: `en/index.html`, `en/about.html`, `en/contact.html`, `en/donate.html`, `en/legacy.html`, `en/map.html`, `en/register.html`, `en/sponsor.html`, `en/trust.html`, `en/verify.html`.

**P0-3 · Cache TTL bị zone rule ép `14400` (infrastructure blocker)**
- Founder xác minh: asset đúng nhưng custom domain bị zone rule ép TTL `14400`; Pages alias dùng `300`. Deploy mới có thể không phản ánh kịp do cache 4h.
- Việc: chỉnh zone cache rule về `300` + purge (ngoài repo — DevOps/Dashboard).

### 🟡 P1 — Cao (ảnh hưởng chất lượng/SEO/analytics)

**P1-1 · GA4 placeholder trên production**
- `index.html` còn `gtag/js?id=G-XXXXXXXXXX`. Không có số đo, lộ placeholder ra public. Đây là **P1 analytics, không phải P0 availability**.
- Khuyến nghị: nếu chưa có Measurement ID thật → **gỡ block GTM** tốt hơn giữ placeholder.
- File: `index.html` (+ mọi trang copy cùng block — grep lại khi fix).

**P1-2 · `assets/i18n.js` là dead code, mix ngôn ngữ**
- Khối VI còn `'nav.movement': 'Movement'`, `'nav.sponsors': 'Sponsors'` (`i18n.js:12-13`) — NHƯNG **không trang nào import file này**. Runtime thật là `app-v5.js`, đã dùng đúng VI `sponsors: "Tài trợ"` (`app-v5.js:122`).
- Việc: **xóa hoặc hợp nhất** `i18n.js` dư thừa (không phải dịch lại) để tránh nhầm lẫn nguồn sự thật.

**P1-3 · 9/10 trang `/en/` thiếu OG/Twitter metadata**
- Chỉ `en/index.html` có OG (6) + Twitter (4). 9 trang còn lại = 0/0 → share link xấu, SEO social yếu.
- File: `en/about.html`, `en/contact.html`, `en/donate.html`, `en/legacy.html`, `en/map.html`, `en/register.html`, `en/sponsor.html`, `en/trust.html`, `en/verify.html`.

**P1-4 · 37 trang không có shared header** (ngoài nhóm /en/ ở P0-2)
- Trong đó `refund.html` là **lỗi injection** (có `<div id="siteHeader">` nhưng KHÔNG load `app-v5.js`) — chỉ cần thêm script, không phải thiếu host.
- Public-facing cần header: `map.html`, `mentor-network.html`, `dream-nurture.html`, `refund.html`, `legacy/index.html`.
- Dashboard nội bộ (`creator/*`, `admin/*`, `app/index.html`) có thể dùng chrome riêng nhưng cần nhất quán.

**P1-5 · OG thiếu trên trang public chính**
- `map.html` OG = 0.

**P1-6 · Sentry DSN là placeholder trên production (verify thực tế)**
- `index.html:38`: `dsn: 'https://xxxxxxxxxxxxx@o123456.ingest.sentry.io/123456'` — chắc chắn placeholder, `environment: 'production'`. Không bắt được lỗi thật, lộ chuỗi giả ra public.
- Việc: gỡ block Sentry hoặc thay DSN thật. File: `index.html` (+ trang copy cùng block).

### 🟢 P2 — Trung bình (hoàn thiện)

- **P2-1** Empty-state "Đang cập nhật" ở `map.html`, `verify/index.html`, `transparency.html` — **HỢP LỆ** (trung thực, đúng nguyên tắc brand). KHÔNG phải lỗi placeholder. Chỉ cần backend live là tự đầy. Giữ nguyên, không tính là vi phạm "no placeholder".
- **P2-2** ~~Sentry DSN~~ → đã xác minh là placeholder, nâng lên **P1-6**.
- **P2-3** Chuẩn hóa canonical cho mọi trang `/en/` (đảm bảo trỏ đúng URL EN, không trỏ về VI).
- **P2-4** A11y: kiểm tra focus ring / skip-link / contrast (chưa chạy axe — cần browser test ở Bước 5).

---

## III. FIX PLAN (đề xuất — chờ duyệt mới làm)

> Nguyên tắc: sửa nhóm nhỏ, dễ rollback, không đổi kiến trúc, không xóa feature.

**✅ QUYẾT ĐỊNH KIẾN TRÚC — FOUNDER ĐÃ CHỐT (2026-06-15): PHƯƠNG ÁN A — chuẩn hóa theo `/en/`.**
- Mỗi trang EN là URL riêng (`/en/...`). Header phải render link sang `/en/...` thay vì `?lang=en`.
- Gỡ bỏ dần cơ chế `?lang=en` (`legacy/index.html`, app-v5.js lang switcher) → thay bằng điều hướng `/en/` ↔ root.
- hreflang/canonical: VI trỏ EN→`/en/<page>`, EN trỏ VI→`/<page>`. Hai chiều phải khớp.
- **Khóa rõ (gỡ mâu thuẫn JS):** nội dung + metadata EN phải render **tĩnh** trong HTML; shared navigation được phép **mount bằng `app-v5.js`**, KÈM fallback link VI tĩnh khi JS lỗi. (Không yêu cầu nav hoạt động khi tắt JS, chỉ cần content + meta + 1 link thoát ngôn ngữ tồn tại tĩnh.)

**Route matrix 10 cặp VI↔EN (verify từ `_redirects` + canonical thực tế):**

| VI route live | VI file thật | Canonical VI | EN file |
|---|---|---|---|
| `/` | `index.html` | `/` | `en/index.html` |
| `/about` | `about.html` | `/about` | `en/about.html` |
| `/contact` | `contact.html` | `/contact` | `en/contact.html` |
| `/donate` | `donate.html` | `/donate` | `en/donate.html` |
| `/map` | `map.html` | `/map` ⚠️ `_redirects` đang `/map /map.html 301` — mâu thuẫn canonical | `en/map.html` |
| `/legacy/` | `legacy/index.html` (KHÔNG phải `legacy.html`) | `/legacy/` | `en/legacy.html` |
| `/register` | `register/index.html` | (verify) | `en/register.html` |
| `/sponsor` | `sponsor/index.html` | (verify) | `en/sponsor.html` |
| `/trust` | `trust/index.html` | (verify) | `en/trust.html` |
| `/verify` | `verify/index.html` ⚠️ đang có 2 `hreflang="en"` (dòng 8 `/en/verify`, dòng 20 `/en/verify/`) | (verify) | `en/verify.html` |

**File scope F1:**
```
index.html
about.html
contact.html
donate.html
legacy/index.html
map.html
register/index.html
sponsor/index.html
trust/index.html
verify/index.html
en/*.html
assets/app-v5.js
_redirects
```

| # | Việc | File | Kiểm tra sau sửa |
|---|---|---|---|
| F1 | **[PA A]** (a) Sửa logic ngôn ngữ `app-v5.js`: `getLang()` nhận pathname `/en/`; `withLang()` ánh xạ VI↔`/en/`, KHÔNG tạo link `/en/*` cho trang chưa dịch. (b) hreflang/canonical theo route matrix trên — **dùng `legacy/index.html` (KHÔNG `legacy.html`)**; xóa 1 trong 2 `hreflang="en"` trùng ở `verify/index.html`; thống nhất trailing slash. (c) Sửa `_redirects`: `/map /map.html` đổi `301`→`200` (rewrite) để khớp canonical `/map`. (d) self-ref vi/en + x-default chỉ cho 10 cặp | xem **File scope F1** ở trên (gồm `_redirects`) | Trang `/en/*` render menu EN; 10 cặp đủ 3 hreflang khớp 2 chiều, không trùng, trailing slash nhất quán; `/map` không còn 301-vs-canonical; trang VI chưa dịch KHÔNG có alternate EN |
| F2 | **[PA A]** Mount shared header bằng `app-v5.js` vào 10 trang `/en/` (sau khi F1 sửa getLang nên render EN), KÈM fallback link VI tĩnh trong HTML | `en/*.html` | Mỗi trang EN có nav + hamburger + link về VI; tắt JS vẫn còn link VI tĩnh |
| F3 | (a) GA4: có Measurement ID thật → thay `G-XXXXXXXXXX`; chưa có → **gỡ hẳn block GTM**. (b) Sentry `index.html:38`: thay DSN thật hoặc **gỡ block** (đang là placeholder `xxxx@o123456`) | `index.html` + các trang copy | Không còn placeholder GA4/Sentry trên public |
| F4 | **Xóa hoặc hợp nhất `assets/i18n.js`** (dead code, không trang nào import; runtime thật là app-v5.js) | `assets/i18n.js` | File không còn gây nhầm nguồn sự thật; grep xác nhận không ai import |
| F5 | Bổ sung OG/Twitter cho 9 trang `/en/` + `map.html` | `en/*.html`, `map.html` | Mỗi trang có og:title/description/image/url + twitter card |
| F6 | Thêm header: **`refund.html` = thêm `app-v5.js` (đã có siteHeader — lỗi injection)**; các trang khác (map, mentor-network, dream-nurture, legacy/index) thêm cả host + script | 5 file | Header xuất hiện, responsive |
| F7 | Khi đối ngoại: ghi rõ nhãn 2 trục đo (93% strategic / 50.35% implementation) — KHÔNG ép thành 1 số | `docs/AUDIT_100_PERCENT_*.md` | Mỗi chỉ số có nhãn rõ trục, không trình bày như mâu thuẫn |

---

## IV. RELEASE GATE — QUY TRÌNH KIỂM DUYỆT

**TRẠNG THÁI HIỆN TẠI: 🟡 BILINGUAL RELEASE QUALITY HOLD — Production hiện tại vẫn live**

Production (`duongsaotoasang.com`) đang resolve, HTTPS 200, Pages `active`. Gate này chặn **release thay đổi song ngữ/SEO mới**, KHÔNG chặn site hiện tại. Không được báo "bilingual ready / SEO ready" cho tới khi clear hết:

- [ ] P0-1 hreflang/`?lang` xung đột + getLang không nhận `/en/` — **CHƯA fix**
- [ ] P0-1b `/map /map.html 301` mâu thuẫn canonical `/map` (sửa `_redirects`→200) — **CHƯA fix**
- [ ] P0-1c `verify/index.html` 2 `hreflang="en"` trùng (dòng 8 + 20) — **CHƯA fix**
- [ ] P0-2 trang /en/ không header — **CHƯA fix**
- [ ] P0-3 cache TTL `14400` (infra, ngoài repo) — **CHƯA fix**
- [ ] P1-1 GA4 placeholder — **CHƯA fix**
- [ ] P1-2 `i18n.js` dead code — **CHƯA dọn**
- [ ] P1-3 OG thiếu 9 trang /en/ — **CHƯA fix**
- [ ] P1-6 Sentry DSN placeholder (`index.html:38`) — **CHƯA fix**
- [ ] Payment runtime chưa được chứng nhận (kiểm credential đúng tenant/site trên endpoint canonical) — **CHƯA verify live**
- [ ] Donation gate: là cổng đóng có chủ đích (`donate.html:140`) — chỉ mở khi đủ payment prod + biên nhận + QA proof
- [ ] Chưa chạy browser test (mobile menu mở/đóng, console error, responsive, axe a11y)

**Checklist bắt buộc PASS trước mỗi lần xin live (QA gate):**
1. Build/serve không lỗi (static — kiểm `wrangler pages dev` load được trang chính).
2. Mobile hamburger: mở/đóng được, `aria-expanded` đổi đúng, trên cả VI & EN.
3. Language switcher: VI→EN→VI giữ đúng trang, không 404, không lẫn ngôn ngữ.
4. Mỗi trang: title + description + canonical + OG + hreflang đầy đủ & không trùng.
5. Không còn `G-XXXXXXXXXX` / placeholder / TODO / demo trên trang public.
6. VI có dấu đầy đủ; EN tự nhiên; không trộn 2 ngôn ngữ trong 1 block/menu/CTA.
7. Responsive 360 / 768 / 1280 không vỡ; không console error.
8. Khi đối ngoại: 2 trục đo (93% strategic / 50.35% implementation) ghi rõ nhãn, không trình bày như mâu thuẫn.

---

## V. BÀN GIAO TEAM DEV (sau khi founder duyệt Fix Plan)

**Cơ chế song ngữ đã chốt: PHƯƠNG ÁN A (`/en/`).** Thứ tự thực thi đề xuất: **F4 → F3 → F1 → F2 → F5 → F6 → F7**, mỗi F là 1 commit nhỏ, test theo QA gate Mục IV, rồi mới sang F kế.

> ⚠️ Tôi (QA) KHÔNG implement ở phiên này. File này là báo cáo + kế hoạch + cổng kiểm duyệt. Chờ founder duyệt Fix Plan.
