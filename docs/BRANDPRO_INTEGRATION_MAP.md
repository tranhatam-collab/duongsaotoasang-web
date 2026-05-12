# DSTS × BRANDPRO — INTEGRATION MAP

> **Mục tiêu:** Mỗi file trong Brandpro kit (16 file gốc + 14 artefact) ánh xạ vào một deliverable cụ thể trong DSTS Master Plan v2.0.
> **Nguồn Brandpro:** `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/`
> **Phương pháp:** Fork kit-v1.1 thành `Brandpro-Forks/duongsaotoasang/` (tuân thủ APPLY-NEW-BRAND.md), không sửa kit gốc.

---

## I. CẤU TRÚC FORK BRANDPRO CHO DSTS

```
Brandpro-Forks/duongsaotoasang/
├── 00-FORK-README.md            ← tóm tắt fork cho DSTS
├── _kit-v1.1/                   ← snapshot kit gốc (để dev kit thay đổi sau này không ảnh hưởng fork)
├── _inputs/                     ← input thô từ founder (audio, scribble, decisions)
│   ├── 01-founder-brief.md
│   ├── 02-existing-assets-inventory.md
│   └── 03-decisions-log.md
├── _filled/                     ← bản hoàn chỉnh từng file
│   ├── 01-Master-Plan-DSTS.md   ← link đến docs/MASTER_PLAN_v2.md
│   ├── 02-Brand-Forensics-DSTS.md
│   ├── 03-Risk-Matrix-DSTS.md
│   ├── ...
│   └── 15-Application-Playbook-DSTS.md
├── assets/
│   ├── logo/
│   ├── color-palette/
│   ├── typography/
│   ├── photography/
│   └── icons/
└── country-packs/
    ├── vi/                      ← Vietnam pack (primary)
    └── en/                      ← English pack (Tháng 5-6 roadmap)
```

---

## II. MAPPING TABLE — 16 FILE BRANDPRO ↔ DSTS DELIVERABLE

| # | Brandpro file | Sprint / Phase áp dụng | DSTS deliverable | Owner |
|---|---|---|---|---|
| 00 | README | Pre-launch | — (reference) | – |
| 01 | Master-Plan | Pre-Sprint 0 | `docs/MASTER_PLAN_v2.md` (file này đã refactor theo Brandpro template) | Founder + Tech Lead |
| 02 | Brand-Forensics | Sprint 4 (post-100) | `_filled/02-Brand-Forensics-DSTS.md` — audit domain + TM + SERP + social trước khi register TM | Brand Strategist |
| 03 | Risk-Matrix | Sprint 4 (post-100) | `_filled/03-Risk-Matrix-DSTS.md` — gắn vào Brandpro Phase 5 Gate | Brand Strategist + Legal |
| 04 | Naming-Strategy | Đã lock (Founder duyệt) | `_filled/04-Naming-Strategy-DSTS.md` — đã chọn "Đường Sao Tỏa Sáng / DSTS" từ trước, ghi nhận decision + collision strategy | Founder |
| 05 | Brand-Pillars | Sprint 0 (`/about` content) + Sprint 4 (lock) | Section "Sứ mệnh / Tầm nhìn / Giá trị cốt lõi" trên `/about` + file `_filled/05-Brand-Pillars-DSTS.md` | Founder + Content Writer |
| 06 | Verbal-Identity | Sprint 1 (Terms + Refund + Privacy giọng văn) + Sprint 3 (microcopy site) | `_filled/06-Verbal-Identity-DSTS.md` + style guide trong repo `docs/STYLE_GUIDE.md` | Content Writer |
| 07 | Visual-Identity-Spec | Sprint 3 (`tokens.css`) | `assets/css/tokens.css` + `_filled/07-Visual-Identity-DSTS.md` + Figma library | Designer |
| 08 | Brand-Book-Outline | Sprint 3 (bonus) + Sprint 4 (lock) | `_artifacts/brand-book-v1.pdf` (10–20 trang tóm tắt cho Sprint 3) → full 60 trang sau Sprint 4 | Designer |
| 09 | Bilingual-Messaging | Sprint 2 (EN setup hreflang) + Roadmap Tháng 5-6 (full EN) | `country-packs/en/messaging-matrix.csv` | Content Writer + Translator |
| 10 | SEO-Entity-Plan | **Sprint 2 (toàn bộ)** | `docs/SEO_ENTITY_PLAN.md` + Wikidata + LinkedIn verified + GBP placeholder + Schema.org JSON-LD on-page | SEO Specialist |
| 11 | Legal-Defense | Sprint 1 (Terms+Refund+Privacy) + Sprint 4 (TM filing) | `/terms` `/refund` `/privacy` + trademark applications (`_artifacts/trademark-applications.md`) + 5 defensive domains | Content Writer + Legal |
| 12 | Governance | Sprint 4 + post-100 vĩnh viễn | Brand Guardian charter + Asset Hub Notion + Approval workflow + Quarterly audit cadence | Founder → Brand Guardian |
| 13 | Briefs-Templates | Pre-Sprint 0 (template cho mọi sprint sau) | `_artifacts/templates/` (creative-brief, copy-brief, design-brief, web-brief, photo-brief) | Tech Lead seed, mọi người dùng |
| 14 | Trackers | Sprint 4 setup + vĩnh viễn | 5 tracker `_artifacts/trackers/*.csv` (Budget, Risk, Content Calendar, Asset Version, KPI) | Project Manager / Founder |
| 15 | Application-Playbook | — (reference cách áp kit) | Link reference trong `docs/MASTER_PLAN_v2.md` | – |

---

## III. ÁP BRANDPRO VÀO TỪNG SPRINT

### Sprint 0 — Brandpro touchpoints

- **File 13 (Briefs):** Tech Lead seed `_artifacts/templates/web-brief.md` cho từng ticket
- **File 14 (Trackers):** Khởi tạo Risk Register draft với 8 rủi ro đã liệt kê trong Master Plan Mục VII
- **Pre-fill artefact:** `_filled/04-Naming-Strategy-DSTS.md` ghi decision đã làm — DSTS đã chọn tên + đã có domain → khoá ngay không thay đổi.

### Sprint 1 — Brandpro touchpoints

- **File 06 (Verbal-Identity):** Áp voice/tone DSTS lên 3 trang policy `/terms` `/refund` `/privacy`
  - DSTS voice draft: **Trang nghiêm + Truyền cảm hứng + Có học** (3 trục trên 4 trục Brandpro 06.B)
  - DSTS tone for legal pages: **Formal + Empathetic** (không cứng nhắc kiểu hợp đồng)
- **File 11 (Legal-Defense):** 3 trang policy này là output bắt buộc của Phase 5

### Sprint 2 — Brandpro touchpoints (MAJOR)

- **File 10 (SEO-Entity-Plan) — full implementation:**
  - 10.B Entity SEO: Tạo Wikidata entry "Đường Sao Tỏa Sáng" với 8 property (P31 instance of, P17 country, P571 inception, P159 headquarters, P856 official website, P1448 official name, P127 owned by, P361 part of)
  - 10.C Schema.org JSON-LD: Organization (homepage), Article (posts), Event (events), Service (scripts)
  - 10.D hreflang: setup chuẩn `<link rel="alternate" hreflang="vi" href="..." />` cho VI hiện tại, placeholder cho EN
  - 10.E Technical SEO: clean URL, canonical đúng, redirect chain ≤ 1
  - 10.F Content pillar plan: 10 pillar topic cho 90 ngày đầu (e.g., "Người Việt tỏa sáng", "Script Journey", "Cộng đồng toàn cầu", v.v.)

### Sprint 3 — Brandpro touchpoints

- **File 07 (Visual-Identity-Spec):**
  - 07.B Logo system: lock 4 variant (primary, mark-only, white, dark)
  - 07.C Color system: 1 primary (gold #d8bc77) + 1 secondary + 5 neutral + 3 semantic → export `tokens.css`
  - 07.D Typography: Inter primary + Lora secondary (đề xuất) → export font scale
  - 07.G Motion principles: easing chuẩn (ease-out 0.24s standard)
- **File 08 (Brand-Book-Outline):** Brand Book v1 PDF — 10 trang summary đầu tiên trước, full 60 trang sau Sprint 4

### Sprint 4 — Brandpro touchpoints (PHASE 5 — BIG ONE)

Sau khi web đạt 100/100, **mở Brandpro Phase 5 (Defense + Governance)**:

#### File 02 + 03 — Forensics & Risk Matrix
- Domain sweep: kiểm tra TLD `.com`, `.vn`, `.org`, `.net`, `.io`, `.app`, `.global` cho "duongsaotoasang" + "dsts" + biến thể có gạch nối
- SERP fingerprint VI + EN + CN cho keyword "đường sao toả sáng", "DSTS", "Vietnamese star journey"
- Trademark check: WIPO + USPTO + IPVN class 41 (giáo dục) + 35 (advertising) + 45 (legal/social)
- Social handle audit 15 platform: FB, IG, TikTok, YouTube, LinkedIn, Twitter, Threads, Behance, Spotify, Apple Podcasts, SoundCloud, Medium, Substack, WeChat, Telegram
- Phonetic clash test: đọc "Đường Sao Tỏa Sáng" cho người Anh + Trung + Pháp nghe — kiểm tra có hiểu nhầm
- Output: `_filled/02-Brand-Forensics-DSTS.md` + `_filled/03-Risk-Matrix-DSTS.md`

#### File 11 — Legal Defense
- **Trademark filing:**
  - IPVN class 41 (giáo dục, đào tạo, biểu diễn nghệ thuật) — bắt buộc
  - IPVN class 35 (advertising, business management) — nếu sau này bán dịch vụ marketing
  - USPTO class 41 — chuẩn bị cho expansion
- **Defensive domain** (≥ 5 TLD):
  - `duongsaotoasang.vn` (bắt buộc giữ)
  - `duongsaotoasang.org`
  - `dsts.vn`
  - `dsts.global`
  - `duongsaotoa.com` (typo defensive)
- **Monitoring:** đăng ký Google Alert "Đường Sao Tỏa Sáng" + UltraDNS WHOIS watch

#### File 12 — Governance
- **Brand Guardian appointment:**
  - 3 tháng đầu: Founder kiêm
  - Sau 3 tháng: tuyển 1 person (part-time hoặc fulltime) hoặc thuê agency
  - Charter ký: định nghĩa quyền duyệt, lương, KPI (file 12.B.2)
- **Asset Hub Notion:**
  - 3 lớp permission (Owner, Editor, Viewer)
  - Cấu trúc thư mục chuẩn (12.C.1)
  - Sync với Figma + GitHub
- **Approval Workflow:**
  - T1 Low: Tech Lead self-approve
  - T2 Medium: Founder approve
  - T3 High: Founder + Legal + Brand Guardian approve
  - Form submission template (12.D.3)
  - Approval log (12.D.4)

#### File 14 — Trackers (5 tracker bắt buộc)
1. **Budget Tracker** (`_artifacts/trackers/budget.csv`) — actual vs planned spend mỗi tuần
2. **Risk Register** (`_artifacts/trackers/risk-register.csv`) — 8 rủi ro Master Plan + risk phát sinh
3. **Content Calendar** (`_artifacts/trackers/content-calendar.csv`) — 90 ngày đầu, cadence 2 bài/tuần
4. **Asset Version Log** (`_artifacts/trackers/asset-version-log.csv`) — mọi asset có version + naming convention chuẩn
5. **KPI Scorecard** (`_artifacts/trackers/kpi-scorecard.csv`) — 15 brand metric chuẩn Brandpro 14.F.2

---

## IV. BRANDPRO QUARTERLY AUDIT (sau Sprint 4 — vĩnh viễn)

Theo file 12.E, mỗi quý audit 20 touchpoint chuẩn:

| # | Touchpoint | Owner audit | Cadence |
|---|---|---|---|
| 1 | Website homepage | Brand Guardian | Quý |
| 2 | Website footer (legal entity, policy links) | Brand Guardian | Quý |
| 3 | Email signature (founder, team) | Brand Guardian | Quý |
| 4 | Social media bio (5 platform) | Brand Guardian | Quý |
| 5 | Logo files (Asset Hub + bên thứ 3) | Designer | Quý |
| 6 | Business card design | Designer | Quý |
| 7 | Pitch deck template | Content Writer | Quý |
| 8 | Sales presentation | Content Writer | Quý |
| 9 | Customer-facing email template | Content Writer | Quý |
| 10 | Press release template | Content Writer | Quý |
| 11 | Event banner (online + offline) | Designer | Quý |
| 12 | Photography style (Instagram, website) | Designer | Quý |
| 13 | Video opening / closing | Designer | Quý |
| 14 | Podcast intro | Content Writer | Quý |
| 15 | Newsletter design | Designer | Quý |
| 16 | Receipt / invoice template | Ops | Quý |
| 17 | Terms / Privacy / Refund (legal version) | Legal | Quý |
| 18 | Schema.org JSON-LD on-page | SEO | Quý |
| 19 | Wikidata entry up-to-date | SEO | Quý |
| 20 | Trademark renewal / new class filing | Legal | Năm |

Mỗi touchpoint chấm theo Brandpro 12.E.3 rubric (5 trục × 1–5 điểm):
- Logo accurate?
- Color accurate?
- Typography accurate?
- Voice/Tone accurate?
- Legal disclosure correct?

Score tổng / 100. ≥ 80 = Pass. < 80 = Brand Guardian phải fix trong sprint kế.

---

## V. DSTS ↔ HỆ SINH THÁI VFA — BRANDPRO BILINGUAL

DSTS không đứng một mình. Là 1 trong các property của:
- **VIET CAN NEW CORP / VFA** (parent legal entity)
- **IAI.ONE** (AI infrastructure)
- **Người Việt Muôn Nơi** (community platform)
- **Phương Đông** (super app)

Brandpro file 09 (Bilingual-Messaging) áp cho cả hệ sinh thái:
- Mỗi property có **brand-of-its-own**, nhưng share core values: "Tỏa sáng", "Cộng đồng", "Toàn cầu", "Tri thức"
- Cross-link footer phải có UTM tracking để đo flow giữa các property
- Naming convention chung (Brandpro 06.D):
  - VI: tiêu đề viết hoa từ đầu chữ ("Đường Sao Tỏa Sáng" không phải "ĐƯỜNG SAO TỎA SÁNG")
  - EN: title case ("The Shining Path" không phải "THE SHINING PATH")
- Style guide chung trong `Brandpro-Forks/_shared/vfa-house-style.md` (đề xuất tạo sau Sprint 4)

---

## VI. PHÊ DUYỆT FOUNDER (FORK BRANDPRO)

Trước khi spin up fork `Brandpro-Forks/duongsaotoasang/`:

- [ ] Đồng ý fork từ kit-v1.1 (không sửa kit gốc)
- [ ] Đồng ý file 04 (Naming) lock — không đổi tên "Đường Sao Tỏa Sáng"
- [ ] Đồng ý 5 trục voice DSTS draft (trang nghiêm + truyền cảm hứng + có học + bilingual + ecosystem)
- [ ] Đồng ý 4 sprint áp Brandpro song song với 4 sprint kỹ thuật web
- [ ] Đồng ý mở Brandpro Phase 5 sau khi web đạt 100/100
- [ ] Đồng ý quarterly audit 20 touchpoint sau khi launch
- [ ] Chỉ định Brand Guardian (founder kiêm 3 tháng đầu)
- [ ] Chỉ định Brand Strategist cho fork (có thể là content writer kiêm)

**Ký:** _______________________
**Ngày:** _______________________

---

*File này là cầu nối giữa Brandpro kit gốc và DSTS Master Plan v2.0. Mỗi lần Brandpro update kit lên v1.2, v2.0..., team kiểm tra delta và cập nhật fork. Mỗi lần DSTS update sprint deliverable, đối chiếu lại mapping table II để đảm bảo Brandpro file tương ứng được update song song.*
