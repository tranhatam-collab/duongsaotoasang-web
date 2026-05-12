# DSTS Documentation Index

> **Project:** Đường Sao Tỏa Sáng (DSTS)
> **Domain:** https://duongsaotoasang.com
> **Cloudflare Pages project:** `duongsaotoasang-com-v2` (KHÔNG phải `duongsaotoasang-web`)
> **GitHub repo:** `tranhatam-collab/duongsaotoasang-web` (branch `main`)
> **Owner:** Trần Hà Tâm · **Stack:** Static HTML + Cloudflare Pages + D1 + Functions

---

## 📋 Hướng đọc tài liệu

### Bạn là Founder
1. Đọc `MASTER_PLAN_v2.md` (kế hoạch tổng) — đặc biệt Mục I, V, VI, XI
2. Ký checklist Mục XI để cho phép team bắt đầu Sprint 0
3. Mỗi sprint xong, đọc `_artifacts/sprint-N-final-smoke.txt` + chấm gate

### Bạn là Tech Lead
1. Đọc `STATE_REPORT_2026-05-12.md` — hiểu baseline 38/100
2. Đọc `SPRINT_0_TICKETS.md` — 6 ticket chi tiết với DoD
3. Đọc `MASTER_PLAN_v2.md` Mục II–V cho timeline
4. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III để hiểu Brandpro overlay từng sprint
5. Setup `scripts/smoke.sh` + `RUNBOOK.md` ngay từ Sprint 0

### Bạn là Designer
1. Đọc Brandpro file gốc `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/07-Visual-Identity-Spec.md`
2. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III (Sprint 3 touchpoints)
3. Sprint 3 deliverable: `tokens.css` + Brand Book v1 PDF

### Bạn là Content Writer / Brand Strategist
1. Đọc Brandpro file gốc `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/05-Brand-Pillars.md` + `06-Verbal-Identity.md`
2. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III (Sprint 1 + Sprint 3)
3. Sprint 1 deliverable: `/terms` `/refund` `/privacy` đầy đủ + style guide

### Bạn là SEO Specialist
1. Đọc Brandpro file gốc `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/10-SEO-Entity-Plan.md`
2. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III (Sprint 2 — Major)
3. Sprint 2 deliverable: Schema.org + Wikidata + Entity SEO full

---

## 📁 File trong thư mục này

| File | Mục đích | Cập nhật cuối |
|---|---|---|
| `README.md` | Index file này | 2026-05-12 |
| `MASTER_PLAN_v2.md` | Kế hoạch tổng 4 tuần đạt 100/100 + Brandpro Phase 5 | 2026-05-12 |
| `STATE_REPORT_2026-05-12.md` | Báo cáo trạng thái có evidence, baseline 38/100 | 2026-05-12 |
| `SPRINT_0_TICKETS.md` | 6 ticket chi tiết Sprint 0 (3 ngày, +25đ) | 2026-05-12 |
| `BRANDPRO_INTEGRATION_MAP.md` | Mapping Brandpro 16 file ↔ DSTS sprint | 2026-05-12 |
| `dsts-100-master-plan.md` | **(LEGACY v1.0 — tham khảo)** Master plan ban đầu | 2026-05-12 |
| `dsts-bug-report.md` | **(LEGACY v1.0)** Bug report ban đầu | 2026-05-12 |
| `files.zip` | Archive nguồn của 2 file legacy | 2026-05-12 |

### File sẽ thêm khi sprint chạy
| File | Khi tạo |
|---|---|
| `SPRINT_1_TICKETS.md` ... `SPRINT_4_TICKETS.md` | Trước mỗi sprint |
| `RUNBOOK.md` | Sprint 4-T3 |
| `STYLE_GUIDE.md` | Sprint 1 (Brandpro 06) |
| `SEO_ENTITY_PLAN.md` | Sprint 2 (Brandpro 10) |
| `CHANGELOG.md` | Mỗi sprint end |
| `_artifacts/*` | Mỗi sprint final |

---

## 🚦 Trạng thái dự án (cập nhật 2026-05-12)

| Sprint | Trạng thái | Điểm trước | Điểm sau | Gate đóng |
|---|---|---|---|---|
| Baseline | ✅ | 0 | 38 | Audit `STATE_REPORT_2026-05-12.md` |
| Sprint 0 | ⏳ Chờ founder ký | 38 | 63 | Pending |
| Sprint 1 | – | 63 | 78 | – |
| Sprint 2 | – | 78 | 90 | – |
| Sprint 3 | – | 90 | 97 | – |
| Sprint 4 + Brandpro P5 | – | 97 | **100 + Brand Lock** | – |

---

## 🔗 Liên kết quan trọng

| Tên | URL / Đường dẫn |
|---|---|
| Production website | https://duongsaotoasang.com |
| Cloudflare Pages dashboard | https://dash.cloudflare.com/f3f9e76222dcb488d5e303e29e8ba192/pages/view/duongsaotoasang-com-v2 |
| GitHub repo | https://github.com/tranhatam-collab/duongsaotoasang-web |
| Brandpro kit gốc | `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/` |
| Brandpro fork DSTS (sẽ tạo Sprint 4) | `/Users/tranhatam/Documents/Brandpro-Forks/duongsaotoasang/` |
| D1 database (content) | `cf-d1-dsts-content-prod` (uuid `de526895-6824-469b-809c-abcd052d9312`) |

---

## ⚠️ Lưu ý quan trọng cho team

1. **KHÔNG deploy vào project `duongsaotoasang-web`** (đó là project rỗng, không có custom domain). Project đúng là `duongsaotoasang-com-v2`.
2. **KHÔNG sửa kit Brandpro gốc** (`kit-v1.1/`). Mọi customization phải qua fork (xem `BRANDPRO_INTEGRATION_MAP.md`).
3. **KHÔNG commit secret** (API key, D1 binding token). Dùng Cloudflare Pages env vars hoặc `.dev.vars` local.
4. **KHÔNG skip gate** — mỗi sprint phải qua 3 gate (pre-sprint, PR review, founder QA).
5. **KHÔNG sửa `wrangler.toml` D1 binding** mà không báo founder — đã từng gây 5 deployment failure liên tiếp.

---

## 📞 Liên hệ

- **Founder:** Trần Hà Tâm (final approver mọi T2/T3 deliverable)
- **Brand Guardian:** Chưa có — Founder kiêm 3 tháng đầu (theo Master Plan v2 Mục XI)
- **Tech Lead:** Chỉ định trước Sprint 0 (founder ký checklist)
- **Cloudflare Account:** `Tranhatam@gmail.com` (account_id `f3f9e76222dcb488d5e303e29e8ba192`)

---

*Documentation maintained theo Brandpro standard. Mỗi commit thay đổi file trong `docs/` phải bump version trong `CHANGELOG.md` (Brandpro 14.E asset version log convention).*
