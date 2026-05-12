# DSTS — MASTER PLAN v2.0 (Brandpro-Integrated)

> **Founder:** Trần Hà Tâm · **Brand:** Đường Sao Tỏa Sáng (DSTS)
> **Phát hành:** 2026-05-12 · **Thay thế:** `dsts-100-master-plan.md` v1.0
> **Domain chính:** https://duongsaotoasang.com
> **Hệ sinh thái:** IAI.ONE · Người Việt Muôn Nơi · Phương Đông · VIET CAN NEW CORP / VFA
> **Mục tiêu:** Đạt 100/100 trong 4–6 tuần + đạt chuẩn Brandpro Phase 5 (Gate 5: TM filed + Brand Guardian appointed).

---

## 0. NGUYÊN TẮC NỀN TẢNG (BẤT BIẾN)

Brandpro 5 nguyên tắc + DSTS 7 nguyên tắc bất biến. **Không bao giờ vi phạm**, kể cả sau khi đạt 100/100.

### Brandpro 5 (kế thừa từ kit gốc)
1. **Logic trước Mỹ thuật** — chiến lược (tên, định vị, va chạm) phải xong trước khi vẽ logo.
2. **Một sự thật duy nhất** — tên brand chỉ có một cách viết, mọi điểm chạm phải nhất quán.
3. **Dạy lại cho cả người và máy** — entity SEO không kém phần quan trọng so với visual identity.
4. **Song ngữ là transcreation** — mỗi ngôn ngữ một bộ messaging riêng dựa trên cùng pillar.
5. **Brand book chỉ có giá trị nếu được enforce** — governance là phần dài hạn nhất.

### DSTS 7 (đặc thù sản phẩm web)
1. **Không bao giờ để trang public hiện "Đang tải…" mãi mãi** — timeout < 5s + fallback bắt buộc.
2. **Không bao giờ có link gãy trên homepage** — CI/CD link-check.
3. **Không bao giờ duplicate canonical** — 1 URL = 1 canonical trỏ về chính nó.
4. **Không bao giờ commit credential vào repo** — secret manager bắt buộc.
5. **Không deploy thẳng lên `main` khi chưa qua PR review** — tech lead + founder duyệt.
6. **Mọi giá > 1,000 USD phải có Terms + Refund đi kèm** — bắt buộc cùng trang hoặc footer.
7. **Reviews tĩnh phải có nhãn "Đánh giá minh họa"** — đến khi có D1 storage thật.

---

## I. HỆ THỐNG CHẤM ĐIỂM 100/100 — RUBRIC v2

Giữ 8 trụ kỹ thuật, **bổ sung Brandpro layer** để đo cả thương hiệu, không chỉ web.

| # | Trụ | Trọng | Đo bằng | Hiện tại | Mục tiêu | Brandpro file |
|---|---|---|---|---|---|---|
| 1 | Technical & Routing | 20 | Smoke test 100% URL | 8 | 20 | – |
| 2 | Content & UX Integrity | 20 | Audit + lighthouse a11y | 11 | 20 | 06, 09 |
| 3 | SEO & Discoverability | 15 | GSC + Rich Results | 5 | 15 | **10** (Entity SEO) |
| 4 | Trust, Legal & Compliance | 15 | Checklist 8 trang policy | 1 | 15 | **11** (Legal Defense) |
| 5 | Design System & Brand | 10 | Tokens + Lighthouse | 7 | 10 | **07, 08** (Visual + Book) |
| 6 | Conversion & Payment | 10 | E2E test | 3 | 10 | – |
| 7 | Ecosystem Integration | 5 | Curl + UTM | 2 | 5 | 09 (Bilingual) |
| 8 | Operations & Observability | 5 | Dashboard + runbook | 1 | 5 | **12** (Governance) |
| | **TỔNG WEB** | **100** | | **38** | **100** | |
| – | **+ Brandpro Phase 5** | (bonus) | TM filed + Guardian | – | – | 04, 11, 12 |

Sau khi đạt 100/100 web, mở thêm **Brandpro Phase Gate 5** (Trademark + Brand Guardian + Asset Hub) để khoá thương hiệu dài hạn.

### Sub-criteria chi tiết — Trụ 1 (Technical)

| Sub | Điểm | Đo |
|---|---|---|
| 100% URL public trả 200/301/404 đúng nghĩa | 5 | `scripts/smoke.sh` log |
| `/content?slug=` xử lý đủ 5 state (loading, success, empty, error, 404) | 3 | E2E manual + Playwright |
| `/posts` fallback hoạt động khi API fail | 2 | Network throttle test |
| Mọi dynamic page timeout < 5s | 3 | Lighthouse + stopwatch |
| Clean URL toàn site, 301 từ `.html` về clean | 2 | Crawler 0 file `.html` lộ |
| `_redirects` + `_headers` + `404.html` đầy đủ | 2 | Đọc Cloudflare Pages config |
| Mobile responsive 320–1920px | 3 | 6 breakpoint test |

### Sub-criteria chi tiết — Trụ 2 (Content & UX)

| Sub | Điểm | Đo |
|---|---|---|
| Mọi trang trong nav có nội dung thật (không placeholder) | 4 | Audit thủ công |
| 100% link homepage trả 200 đến đúng đích | 3 | Crawler |
| Mọi CTA dẫn đến next step rõ ràng | 2 | UX walkthrough |
| ≥ 6 bài viết thật trong `/posts` | 3 | Đếm |
| ≥ 9 kịch bản với detail đầy đủ | 2 | Đếm |
| ≥ 3 sự kiện cụ thể ngày/giờ/địa điểm | 2 | Đếm |
| Nội dung mẫu trên mọi list khi API rỗng | 2 | Force API empty |
| Accessibility WCAG 2.1 AA pass | 2 | axe DevTools |

### Sub-criteria chi tiết — Trụ 3 (SEO + Brandpro Entity SEO)

| Sub | Điểm | Đo |
|---|---|---|
| `sitemap.xml` đầy đủ + hreflang VI/EN (Brandpro 10.D) | 2 | Truy cập + count |
| `robots.txt` đúng + có dòng Sitemap | 1 | Truy cập |
| Mỗi trang canonical đúng URL của chính nó | 3 | View source |
| Title 50–60 ký tự + description 150–160, riêng từng trang | 2 | View source |
| OG + Twitter Card đúng từng trang | 2 | OG Debugger |
| Schema.org JSON-LD (Article, Event, Organization) – Brandpro 10.C | 2 | Rich Results Test |
| SSR / pre-render `/content` + `/posts` | 2 | Curl thấy nội dung HTML |
| Entity SEO setup (Wikidata, GBP, LinkedIn) – Brandpro 10.B | 1 | Live + sameAs |

### Sub-criteria chi tiết — Trụ 4 (Trust + Brandpro Legal Defense)

| Sub | Điểm | Đo |
|---|---|---|
| `/donate` 8 mục bắt buộc | 3 | Checklist 8 mục |
| `/transparency` ≥ 1 báo cáo mẫu | 2 | Đọc |
| `/terms` (VN + US dual jurisdiction) | 2 | URL 200 |
| `/refund` công bố | 2 | URL 200 |
| `/privacy` + cookie banner | 2 | URL 200 + banner test |
| Legal entity disclosure trong footer (VIET CAN NEW CORP / VFA) | 1 | Footer |
| Reviews mẫu gắn nhãn "Đánh giá minh họa" | 1 | Scripts page |
| Kênh khiếu nại / hỗ trợ rõ (email + phone + form) | 2 | `/contact` |

### Sub-criteria chi tiết — Trụ 5 (Design + Brandpro Visual)

| Sub | Điểm | Đo |
|---|---|---|
| Footer + Header thống nhất toàn site | 2 | Visual review |
| Color + typography tokens (Brandpro 07.C+D) | 2 | File `tokens.css` |
| Logo + favicon + OG image chuẩn (Brandpro 07.B) | 1 | View |
| Empty + Error states design thống nhất | 2 | Visual review |
| Loading skeleton thay text "Đang tải…" | 1 | Network throttle |
| Image optimization (WebP, lazy, srcset) | 2 | Lighthouse |

### Sub-criteria chi tiết — Trụ 6 (Conversion)

| Sub | Điểm | Đo |
|---|---|---|
| `/contact` form gửi được email | 2 | Test gửi |
| ≥ 1 payment confirmation flow hoạt động | 3 | E2E thử 1 USD |
| Order ID / mã giao dịch tự sinh | 2 | Test |
| Email tự động sau form submit | 1 | Test inbox |
| CTA chính có GA event tracking | 1 | GA4/Plausible |
| Newsletter subscribe | 1 | Test |

### Sub-criteria chi tiết — Trụ 7 (Ecosystem)

| Sub | Điểm | Đo |
|---|---|---|
| Link `nguoiviet.muonnoi.org` trả 200 (fix 502) | 2 | Curl |
| SSO / shared auth với IAI.ONE (nếu khả thi) | 1 | Đăng nhập thử |
| Footer map các site VFA | 1 | Footer |
| Cross-link UTM tracking | 1 | URL query |

### Sub-criteria chi tiết — Trụ 8 (Ops + Brandpro Governance)

| Sub | Điểm | Đo |
|---|---|---|
| GA4 / Plausible gắn | 1 | Inspect |
| Sentry error logging | 1 | Inspect |
| UptimeRobot ping 5 URL / 5 phút | 1 | Dashboard |
| Backup hàng tuần (GH Actions) | 1 | Cron log |
| `RUNBOOK.md` cho team (Brandpro 12.D approval workflow) | 1 | Repo check |

---

## II. KẾ HOẠCH 5 SPRINT — TỪ 38 → 100 + BRANDPRO P5

Mỗi sprint bám 1 **Brandpro Phase**. Giữ tên kỹ thuật (Sprint 0–4) + tag Brandpro để team Brand+Dev nói chung 1 ngôn ngữ.

### 🚨 SPRINT 0 — STOP THE BLEEDING (3 ngày, +25đ)
**Brandpro overlay:** Phase 1 — Forensics tự động trên web (smoke test toàn site, ghi đầy đủ vào `_artifacts/`).
**Owner R:** Tech Lead · **Approver A:** Founder.

**Deliverables**

| # | Việc | Trụ | Điểm | DoD (Definition of Done) |
|---|---|---|---|---|
| S0-T1 | `_redirects` chuẩn hóa clean URL → file thật (KHÔNG về `/content`) | 1 | +5 | Curl `/about` `/program` `/contact` trả 200 với title riêng |
| S0-T2 | Tạo file thật `about.html`, `program.html`, `contact.html` (đủ hero + 3 section + footer) | 2 | +6 | Canonical đúng URL của chính nó, title riêng, ≥ 300 từ |
| S0-T3 | Dựng `donate.html` + `transparency.html` placeholder hợp pháp | 2,4 | +4 | URL 200, không "coming soon" rỗng |
| S0-T4 | `/content?slug=` xử lý đủ 5 state + có 6 bài mẫu fallback hard-coded | 1 | +5 | Disable network → vẫn render bài mẫu |
| S0-T5 | `404.html` đẹp + brand-aligned | 1 | +2 | URL không tồn tại trả 404 + UI thân thiện |
| S0-T6 | `scripts/smoke.sh` crawler 100% URL log status code | 1,8 | +3 | Output table pass/fail từng URL |

**Gate phê duyệt Sprint 0 (Brandpro Gate 1 equivalent):**
- [ ] `smoke.sh` pass 100% (0 URL non-intentional 404/500)
- [ ] 6 trang core (`/`, `/about`, `/program`, `/contact`, `/scripts`, `/posts`) có canonical đúng
- [ ] `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` render bài viết hoặc fallback có nội dung
- [ ] Founder click thử 100% link homepage → không gãy

**Điểm sau Sprint 0:** 38 → **63**

---

### 🟠 SPRINT 1 — RESTORE TRUST & FINISH CORE (4 ngày, +15đ)
**Brandpro overlay:** Phase 5 (Legal Defense) on-page + Phase 4 (Verbal/Voice).
**Owner R:** Content writer + Tech Lead · **Approver A:** Founder + Legal (nếu có).

**Deliverables**

| # | Việc | Trụ | Điểm | DoD |
|---|---|---|---|---|
| S1-T1 | Hoàn thiện `/donate` 8 mục bắt buộc + ≥ 1 phương thức thật (PayPal/QR + xác nhận) | 4,6 | +3 | Checklist 8 mục pass |
| S1-T2 | `/transparency` báo cáo mẫu Q1/2026 + nguyên tắc + lịch | 4 | +2 | URL 200 + content thật |
| S1-T3 | Soạn `/terms`, `/refund`, `/privacy` (VN + US dual) | 4 | +6 | URL 200 + có ngày cập nhật + version |
| S1-T4 | Gắn nhãn "Đánh giá minh họa" lên toàn bộ reviews tĩnh | 4 | +1 | Visual review |
| S1-T5 | `/contact` form hoạt động + Cloudflare Turnstile | 6 | +2 | Test gửi → email về inbox + auto-reply user |
| S1-T6 | Footer thống nhất (legal entity + 3 policy link + social + ecosystem) | 5 | +1 | Component duy nhất reuse mọi trang |

**Gate Sprint 1:**
- [ ] Founder ký nội dung Terms/Refund/Privacy
- [ ] Test gửi `/contact` → email về
- [ ] Test donate flow 1 USD → xác nhận chạy
- [ ] Footer audit thống nhất 100% trang

**Điểm sau Sprint 1:** 63 → **78**

---

### 🟡 SPRINT 2 — STANDARDIZE & SEO (7 ngày, +12đ)
**Brandpro overlay:** Phase 4 — Localization & SEO. Áp **toàn bộ file 10 (SEO Entity Plan)**.
**Owner R:** SEO + Tech Lead · **Approver A:** Founder.

**Deliverables**

| # | Việc | Trụ | Điểm | DoD |
|---|---|---|---|---|
| S2-T1 | Component meta-head chung, audit 100% trang | 3 | +5 | Screaming Frog 0 warning canonical |
| S2-T2 | `sitemap.xml` auto-generate (script Node hoặc CF Worker) + `robots.txt` link sitemap | 3 | +1 | Truy cập + count ≥ 25 URL |
| S2-T3 | Schema.org JSON-LD (Organization homepage, Article posts, Event events, Service scripts) | 3 | +2 | Rich Results Test pass tất cả |
| S2-T4 | SSR / pre-render `/content` + `/posts` (Cloudflare Pages Functions hoặc static prebuild) | 3 | +2 | Curl thấy nội dung HTML thật |
| S2-T5 | Clean URL canonicalization (301 `.html` → clean, audit toàn site) | 1 | +1 | Crawler 0 file `.html` lộ ra |
| S2-T6 | **Brandpro Entity SEO** — đăng Wikidata + LinkedIn Company verified + GBP placeholder | 3 | +1 | Live + sameAs trong Organization schema |

**Gate Sprint 2:**
- [ ] Google Search Console verified + sitemap submitted
- [ ] Rich Results Test pass cho ≥ 3 page type
- [ ] Curl `/content?slug=...` từ server → thấy nội dung HTML thật (không "Đang tải…")
- [ ] Wikidata entry cho "Đường Sao Tỏa Sáng" tạo xong (có thể chờ approve)

**Điểm sau Sprint 2:** 78 → **90**

---

### 🟢 SPRINT 3 — POLISH, DESIGN & PERFORMANCE (7 ngày, +7đ)
**Brandpro overlay:** Phase 3 — Identity Implementation. Áp **file 07 (Visual) + 08 (Brand Book)** vào web.
**Owner R:** Designer + Tech Lead · **Approver A:** Founder.

**Deliverables**

| # | Việc | Trụ | Điểm | DoD |
|---|---|---|---|---|
| S3-T1 | `tokens.css` export biến color/spacing/typography/radius/shadow (Brandpro 07.C+D) | 5 | +3 | File CSS variables + Figma sync |
| S3-T2 | Component `<Skeleton>` reusable thay "Đang tải…" | 5 | +1 | Áp dụng list/card/article |
| S3-T3 | Image optimization WebP + lazy + srcset | 5 | +2 | Lighthouse Performance ≥ 90 |
| S3-T4 | Mobile audit 6 breakpoint (320/375/414/768/1024/1920) | 1 | +2 | Tap target ≥ 48×48 |
| S3-T5 | WCAG 2.1 AA pass | 2 | +2 | axe DevTools 0 critical |
| S3-T6 | **Brandpro file 08** — Brand Book v1 PDF (10 trang tóm tắt logo/color/voice) | 5 | bonus | PDF lưu `_artifacts/` |

**Gate Sprint 3:**
- [ ] Lighthouse 4 trục ≥ 90 (Perf, A11y, BP, SEO)
- [ ] Founder test iPhone + Android thật, không bug visual
- [ ] Brand Book v1 PDF đã được founder duyệt

**Điểm sau Sprint 3:** 90 → **97**

---

### 🏁 SPRINT 4 — LAUNCH READINESS & ECOSYSTEM (7 ngày, +3đ + Brandpro P5)
**Brandpro overlay:** Phase 5 — Defense & Governance. Áp **file 11 + 12 + 14**.
**Owner R:** Ops Lead + Tech Lead · **Approver A:** Founder + Legal.

**Deliverables (WEB)**

| # | Việc | Trụ | Điểm | DoD |
|---|---|---|---|---|
| S4-T1 | Fix link `nguoiviet.muonnoi.org` (sửa 502 hoặc landing bridge) | 7 | +2 | Curl 200 |
| S4-T2 | GA4/Plausible + Sentry + UptimeRobot | 8 | +2 | Dashboard 3 tool có metric |
| S4-T3 | `RUNBOOK.md` (rollback, restore, owner matrix) | 8 | +1 | File check-in |
| S4-T4 | Footer ecosystem map (IAI.ONE, vetuonglai, visamuonnoi, phuongdong, nguoiviet) | 7 | +1 | Visual + UTM tracking |

**Deliverables (BRANDPRO — sau khi đạt 100/100 web)**

| # | Việc | File | DoD |
|---|---|---|---|
| BP-T1 | Risk Matrix (Brandpro 03) — domain sweep + TM check class 41/42/45 | 03 | Bảng audit duyệt |
| BP-T2 | Trademark filing — IPVN class 41 (giáo dục) + class 35 (advertising) | 11 | Application number |
| BP-T3 | Defensive domain registration (≥ 5 TLD biến thể) | 11 | Domain owned |
| BP-T4 | Brand Guardian charter + appointment (Brandpro 12.B) | 12 | Charter ký |
| BP-T5 | Asset Hub Notion setup (Brandpro 12.C — 3 lớp permission) | 12 | Notion workspace live |
| BP-T6 | 5 Trackers (Budget, Risk, Content Calendar, Asset Version, KPI) | 14 | Notion/Sheet templates |

**Gate Sprint 4 (FINAL — Brandpro Gate 5):**
- [ ] Founder review trên 5 thiết bị: MacBook + iPhone + Android + iPad + Desktop Windows
- [ ] Smoke test 100% URL pass
- [ ] Lighthouse 4 trục ≥ 95
- [ ] Trademark application filed
- [ ] Brand Guardian appointed (charter ký)
- [ ] Founder ký công bố **"PUBLIC LAUNCH + BRAND LOCK"** (cả web 100/100 + Brandpro Phase 5 đóng)

**Điểm sau Sprint 4:** 97 → **100/100** ✅ + Brandpro Gate 5 đóng.

---

## III. TIMELINE TỔNG THỂ

```
Tuần 1 (D1-D7)   Sprint 0 (3d) + Sprint 1 (4d)   → 38 → 78
Tuần 2 (D8-D14)  Sprint 2 (7d)                    → 78 → 90
Tuần 3 (D15-D21) Sprint 3 (7d)                    → 90 → 97
Tuần 4 (D22-D28) Sprint 4 (7d) + Brandpro P5     → 97 → 100 + Brand Lock
Tuần 5+          PUBLIC LAUNCH 🚀
```

**Buffer:** +1 tuần dự phòng (Brandpro recommendation cho SME).

---

## IV. RACI MATRIX

Theo Brandpro Master Plan format. Owner duy nhất (R), Approver duy nhất (A), Consulted (C), Informed (I).

| Deliverable | R | A | C | I |
|---|---|---|---|---|
| Routing fix (S0) | Tech Lead | Founder | – | All team |
| Content pages /about /program /contact (S0) | Content Writer | Founder | Tech Lead | – |
| Donate flow (S1) | Tech Lead | Founder | Legal | Content |
| Terms/Refund/Privacy (S1) | Content Writer | Legal + Founder | Tech Lead | – |
| SEO + Schema (S2) | SEO | Founder | Content | Tech Lead |
| Entity SEO Wikidata/GBP (S2) | SEO | Founder | – | – |
| Design tokens (S3) | Designer | Founder | Tech Lead | – |
| Brand Book v1 PDF (S3) | Designer | Founder | Content | All |
| GA4/Sentry/Uptime (S4) | Ops | Founder | Tech Lead | – |
| Trademark filing (S4) | Legal | Founder | – | All |
| Brand Guardian appointment (S4) | Founder | Founder | Legal | All |
| Asset Hub Notion (S4) | Ops | Founder | Designer | All |

---

## V. CƠ CẤU PHÊ DUYỆT — 3 GATE × 5 SPRINT

Workflow approval-before-execution chuẩn anh Tâm hay dùng. Bổ sung **Brandpro Risk Classification** từ file 12.D.

```
┌──────────────────────────┐
│ GATE 1: PRE-SPRINT       │  Founder duyệt scope + DoD + Risk tier
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ DEV THỰC THI             │  Branch riêng, không commit thẳng main
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ GATE 2: PR REVIEW        │  Tech Lead review code + test
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ GATE 3: FOUNDER QA       │  Anh Tâm test thật ≥ 2 thiết bị
└────────────┬─────────────┘
             ▼
        MERGE MAIN
```

### Brandpro Risk Tier (áp cho từng deliverable)

| Tier | Tiêu chí | Approval cần |
|---|---|---|
| **T1 — Low** | Sửa typo, đổi màu, sửa link nội bộ | Tech Lead duyệt PR đủ |
| **T2 — Medium** | Đổi copy hero, đổi cấu trúc trang, đổi nav | Tech Lead + Founder |
| **T3 — High** | Đổi tên brand, đổi logo, sửa Terms/Refund, sửa giá | Founder + Legal + Brand Guardian (sau khi có) |

Mọi deliverable Sprint 0–4 default = T2. Riêng Terms/Refund/Privacy = T3.

---

## VI. NGUỒN LỰC & NGÂN SÁCH (3 mức Brandpro)

| Vai trò | Effort | Lean | Standard | Premium |
|---|---|---|---|---|
| Full-stack dev | 4 tuần FT | 1 người | 1 người + 1 senior advisor | 2 người |
| Designer | 1 tuần | Founder DIY + Figma free | 1 designer mid | 1 designer senior |
| Content writer | 1 tuần | Founder + AI assist | 1 writer | 1 writer + 1 editor |
| QA tester | 3 ngày | Founder + bạn bè | 1 QA freelance | 1 QA agency |
| Legal | 5 ngày part-time | DIY template + AI | 1 luật sư VN | 1 luật sư VN + 1 US |
| **Tools** | | | | |
| Sentry | 1 năm | Free tier | Team tier | Business |
| UptimeRobot | 1 năm | Free | Paid | Better Stack |
| Plausible/GA4 | 1 năm | GA4 free | Plausible | Plausible + Mixpanel |
| Trademark VN (class 41) | – | ~3tr | ~3tr | ~3tr |
| Trademark US (class 41) | – | – | ~25M ($1000) | ~50M ($2000) |
| Defensive domain (5 TLD) | – | ~2tr | ~5tr | ~10tr |
| **TỔNG ước lượng** | | **15–25tr** | **80–150tr** | **300–500tr** |

DSTS đề xuất chạy **Standard tier** vì có doanh thu kỳ vọng từ Script Journey 25K USD.

---

## VII. RỦI RO & GIẢM THIỂU

| Rủi ro | Xác suất | Tác động | Giảm thiểu |
|---|---|---|---|
| API content backend chưa sẵn | Cao | Cao | JSON tĩnh tạm, flag `__source=fallback` để track |
| `nguoiviet.muonnoi.org` 502 không fix kịp | Trung | Trung | Sprint 4 dedicated, fallback landing |
| Founder review chậm block sprint | Trung | Cao | SLA review 24h, deputy reviewer |
| Lighthouse perf < 90 trên mobile | Trung | Trung | Sprint 3 dedicated, image optim aggressive |
| Legal Terms cần luật sư duyệt | Thấp-Trung | Trung | Draft sớm Sprint 1, luật sư song song |
| Trademark bị tên gần trùng từ chối | Thấp | Cao | Phase 1 Brandpro Risk Matrix tìm trước |
| Cloudflare Pages deploy vào sai project (đã xảy ra) | Đã giải quyết | Cao | Doc rõ project = `duongsaotoasang-com-v2`, không deploy `duongsaotoasang-web` |
| Brand Guardian không tìm được người phù hợp | Trung | Cao | Founder kiêm nhiệm 3 tháng đầu, tuyển song song |

---

## VIII. ROADMAP SAU 100/100 + BRANDPRO P5

### Tháng 2 — CMS + Member
- CMS admin (Notion API hoặc Sanity)
- Member system: đăng ký + login + profile
- Newsletter automation
- Blog editor cho founder

### Tháng 3–4 — Community + Membership
- Community forum
- Event registration với payment
- Membership tier (free / premium / patron)
- SSO với IAI.ONE

### Tháng 5–6 — Mobile + API + Bilingual
- Mobile app PWA
- API public cho ecosystem partners
- Analytics dashboard founder
- **EN locale hoàn chỉnh** (Brandpro file 09 + hreflang đầy đủ)

### Tháng 7+ — Platform
- Script Journey CRM (contract, milestone, payment tracking)
- Tích hợp Phương Đông super app
- Cross-promote Người Việt Muôn Nơi
- **Brandpro Quarterly Audit** lần 1 (20 touchpoint check — file 12.E)

---

## IX. CHECKLIST NGHIỆM THU 100/100 (GATE 3 SPRINT 4)

Trước khi ký "đạt 100/100 + Brand Lock", team dev + brand owner phải pass toàn bộ:

### A. Smoke Test (10 phút)
- [ ] `/` 200 + đầy đủ block
- [ ] `/about` `/program` `/contact` 200 + nội dung riêng + canonical đúng
- [ ] `/scripts` 200 + 9 kịch bản
- [ ] 9 trang `/scripts/*` 200 + nội dung đủ
- [ ] `/posts` 200 + danh sách hoặc fallback
- [ ] `/content?slug=…` render bài viết (không "Đang tải…")
- [ ] `/events` 200 + sự kiện có ngày/giờ/địa điểm
- [ ] `/donate` 200 + flow donate hoạt động
- [ ] `/transparency` 200 + báo cáo nội dung
- [ ] `/terms` `/refund` `/privacy` 200
- [ ] URL không tồn tại → `/404.html` đẹp + CTA

### B. SEO Audit
- [ ] `sitemap.xml` ≥ 25 URL
- [ ] `robots.txt` có dòng `Sitemap:`
- [ ] GSC verified + sitemap submitted no error
- [ ] Rich Results Test pass Article + Event + Organization
- [ ] 100% trang canonical đúng URL của chính nó
- [ ] 100% trang title + description riêng
- [ ] OG Debugger pass 5 trang chính
- [ ] **Wikidata entry created** (Brandpro 10.B.4)

### C. Legal & Trust
- [ ] Terms công bố + ngày cập nhật + version
- [ ] Refund Policy công bố
- [ ] Privacy + cookie banner GDPR
- [ ] Legal entity trong footer mọi trang
- [ ] Reviews mẫu gắn nhãn hoặc đã thay bằng review thật
- [ ] `/donate` có policy hoàn tiền + xác nhận
- [ ] `/transparency` có ≥ 1 báo cáo mẫu
- [ ] **Trademark application filed** (Brandpro 11)
- [ ] **≥ 5 defensive domain registered** (Brandpro 11)

### D. Design & Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Test iPhone 12 + Pixel 6 + iPad không vỡ
- [ ] Test Chrome/Safari/Firefox/Edge không vỡ
- [ ] **Brand Book v1 PDF lưu Asset Hub** (Brandpro 08)
- [ ] **`tokens.css` export đồng bộ Figma** (Brandpro 07)

### E. Conversion
- [ ] CTA chính có GA event
- [ ] `/contact` form gửi được email + auto-reply
- [ ] Donate flow E2E với 1 USD test
- [ ] Newsletter subscribe (nếu có) → confirm email

### F. Ops & Governance
- [ ] GA4/Plausible đang chạy
- [ ] Sentry capture lỗi JS
- [ ] UptimeRobot ping 5 URL / 5 phút
- [ ] `RUNBOOK.md` check-in repo
- [ ] Backup tuần đang chạy
- [ ] **Brand Guardian appointed + charter ký** (Brandpro 12.B)
- [ ] **Asset Hub Notion live + permission matrix** (Brandpro 12.C)
- [ ] **5 Trackers setup** (Brandpro 14)

### G. Ecosystem
- [ ] `nguoiviet.muonnoi.org` 200
- [ ] Footer map đầy đủ VFA sites
- [ ] UTM tracking cross-site

---

## X. CẤU TRÚC TÀI LIỆU BÀN GIAO (FILES)

Sau Sprint 4, repo phải có cấu trúc tài liệu sau (theo Brandpro standard):

```
docs/
├── MASTER_PLAN_v2.md                ← file này
├── STATE_REPORT_2026-05-12.md       ← baseline đo trước Sprint 0
├── SPRINT_0_TICKETS.md              ← ticket detail Sprint 0
├── SPRINT_1_TICKETS.md
├── SPRINT_2_TICKETS.md
├── SPRINT_3_TICKETS.md
├── SPRINT_4_TICKETS.md
├── BRANDPRO_INTEGRATION_MAP.md      ← mapping Brandpro 16 file ↔ DSTS deliverable
├── RUNBOOK.md                       ← rollback + on-call (Sprint 4)
├── CHANGELOG.md                     ← lịch sử version
└── _artifacts/
    ├── smoke-test-baseline.csv
    ├── lighthouse-baseline.json
    ├── lighthouse-final.json
    ├── brand-book-v1.pdf            ← Brandpro 08
    ├── brand-pillars-card.pdf       ← Brandpro 05
    ├── risk-matrix-v1.md            ← Brandpro 03
    ├── trademark-applications.md    ← Brandpro 11
    ├── asset-hub-permission-matrix.md ← Brandpro 12
    └── trackers/
        ├── budget.csv               ← Brandpro 14.B
        ├── risk-register.csv        ← Brandpro 14.C
        ├── content-calendar.csv     ← Brandpro 14.D
        ├── asset-version-log.csv    ← Brandpro 14.E
        └── kpi-scorecard.csv        ← Brandpro 14.F
```

---

## XI. PHÊ DUYỆT FOUNDER (ký trước khi team bắt đầu Sprint 0)

- [ ] Đồng ý rubric 100/100 Mục I (8 trụ kỹ thuật + Brandpro layer)
- [ ] Đồng ý timeline 4 tuần + 1 tuần buffer Mục III
- [ ] Đồng ý 3 gate Mục V + Brandpro Risk Tier
- [ ] Đồng ý ngân sách **Standard tier** (~80–150tr) Mục VI
- [ ] Đồng ý nguyên tắc bất biến Mục 0 (5 Brandpro + 7 DSTS)
- [ ] Chỉ định **Tech Lead** chịu trách nhiệm 4 tuần
- [ ] Chỉ định **Content Writer** soạn Terms/Refund/Privacy
- [ ] Chỉ định **Designer** Sprint 3 + Brand Book v1
- [ ] Chỉ định **SEO Specialist** Sprint 2 + Entity SEO
- [ ] Chỉ định **Brand Guardian** (founder kiêm 3 tháng đầu hoặc tuyển)
- [ ] Chỉ định **Legal Counsel** cho Terms + Trademark
- [ ] Đồng ý dùng project Cloudflare Pages chính = `duongsaotoasang-com-v2` (không phải `duongsaotoasang-web`)

**Ký:** _______________________
**Ngày:** _______________________
**Version:** v2.0 (Brandpro-integrated)

---

## XII. CHANGELOG

| Version | Ngày | Tác giả | Thay đổi |
|---|---|---|---|
| v1.0 | 2026-05-12 | Cốc Cốc team | Master plan ban đầu — 8 trụ, 5 sprint, rubric 100/100 |
| v2.0 | 2026-05-12 | Claude (DSTS Tech Co-Pilot) | Tích hợp Brandpro 5-phase + 16 file kit + Brandpro Risk Tier + Trackers + Asset Hub. Re-baseline điểm hiện tại từ 32 → 38 sau evidence audit. Bổ sung Brandpro Phase 5 (Trademark + Brand Guardian) làm Gate cuối |

---

*Tài liệu master plan v2.0 này là bản thay thế cho v1.0. Mọi điều chỉnh phải qua founder phê duyệt và bump version (v2.1, v2.2…). Mọi sprint deliverable phải đối chiếu lại tài liệu này + Brandpro kit gốc trước khi báo "xong". Mỗi sprint hoàn thành sẽ có một commit `docs: lock sprint N` với version bump trong CHANGELOG.*
