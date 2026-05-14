# DSTS Documentation Index

> **Project:** Đường Sao Tỏa Sáng (DSTS) + NDNUM (Nuôi Dưỡng Những Ước Mơ)
> **Domain:** https://duongsaotoasang.com
> **Cloudflare Pages project:** `duongsaotoasang-com-v2` (KHÔNG phải `duongsaotoasang-web`)
> **GitHub repo:** `tranhatam-collab/duongsaotoasang-web` (branch `main`)
> **Owner:** Trần Hà Tâm · **Stack:** Static HTML + Cloudflare Pages + D1 + Functions + pay.iai.one

---

## 🧭 Bản đồ tài liệu hiện tại (2026-05-14)

Project hiện chia làm 3 nhóm:

- **LOCKED / CURRENT** (source of truth, không sửa direct nếu không bump version):
  - Sprint 0 + 9 GitHub Issues (`DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md`)
  - Master Plan v1.1 (rename → v1.2-DRAFT — Mục I-VIII vẫn LOCKED, Mục IX Roadmap đã update)
  - Sprint 0 execution status (`STATE_REPORT_2026-05-14.md`)

- **DRAFT** (đang chỉnh, gần sẵn sàng):
  - Master Plan v1.2-DRAFT (pending re-lock sau NDNUM v1.2)
  - Master Index v1.5.5 (pending re-lock)
  - NDNUM v1.1-REVIEWED + 7 NDNUM spec con DRAFT v1.0
  - Layer 1 DSTS spec DEV-READY v1.0 nhưng chưa mở public interactive flows

- **TBD** (chưa start, đợi unblock):
  - 4 Layer 2 spec (Star Journey OS, Product Catalog, Automation Engine, DB Schema)
  - Phase 0B legal/CSO co-review và Founder decisions

**Source of truth duy nhất** cho mỗi nhóm:
- Master plan → `dsts-master-plan-v1.2-DRAFT.md`
- Index toàn hệ → `00_DSTS_MASTER_INDEX_2026.md`
- NDNUM nonprofit → `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md`

Mọi file trong `_archive_2026-05-13/` **KHÔNG dùng làm reference**.

---

## 📋 Hướng đọc theo role

### Bạn là Tech Lead Layer 0 (Sprint 0 đang chạy)
1. Đọc `dsts-master-plan-v1.2-DRAFT.md` Mục I-VIII (vẫn áp dụng từ v1.1-LOCKED)
2. Đọc `DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md` — 9 issue chi tiết với DoD
3. Đọc `STATE_REPORT_2026-05-12-EOD.md` — hiểu baseline 45/100
4. Setup branch `sprint-0/stop-the-bleeding` + bắt Issue 01 → 09
5. Mỗi sprint xong, đọc `_artifacts/*` + chấm gate

### Bạn là Tech Lead Layer 1 (Movement Portal, kickoff Tháng 9/2026)
1. Đọc `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` — route map + screen mockup
2. Đọc `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` — 13 gói tài trợ + flow
3. Đọc `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` — event lifecycle
4. Đọc `DSTS_TOUR_CALENDAR_2026_2027.md` — tour 33+ country
5. **Chờ Wave 2 docs** (UI Mockup, Sponsors API Contract, Events API Contract, Sponsor Agreement Template) trước khi kickoff dev sprint
6. Reference code: `functions/api/donate/create.js` + `webhook.js` (pattern auth + idempotency cho Sponsors/Events API)

### Bạn là Founder
1. Re-lock `dsts-master-plan-v1.2-DRAFT.md` sau khi NDNUM v1.2-LOCKED
2. Trả lời **6 NDNUM decisions** trong `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục XVI
3. Xác nhận status A7 sự kiện 2026-01-22 (completed/postponed/cancelled/merged) — chặn Layer 1 Gala route
4. Lock 13 sponsor tier pricing trong `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` Mục 1
5. Hire Legal Counsel VN + Child Safety Officer cho Phase 0B

### Bạn là Operations NDNUM (Nonprofit child mentoring)
1. Đọc `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` toàn bộ
2. Đặc biệt Mục IV (Guardian-first), Mục V (Friends of the Children model), Mục XIII (12 quy tắc cứng)
3. Wave 3 sẽ viết 7 spec con (xem Mục XV trong file)
4. Phase 0B (Tháng 6-8/2026) bị chặn cho đến khi Founder trả lời 6 decisions + hire CSO

### Bạn là Legal Counsel
1. Đọc `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục X + XV + XVI
2. Đọc `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md`
3. Đọc `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` Mục 1-4
4. Chờ Wave 2 `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md` để adapt
5. Wave 3: co-author `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` + `NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md`

### Bạn là Designer
1. Đọc Brandpro file gốc `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/07-Visual-Identity-Spec.md`
2. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III (Sprint 3 touchpoints)
3. Wave 2: `DSTS_MOVEMENT_UI_ROUTES_MOCKUP.md` sẽ ra mắt — 10 route Movement Portal cần wireframe

### Bạn là Content Writer / Brand Strategist
1. Đọc Brandpro file gốc `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/05-Brand-Pillars.md` + `06-Verbal-Identity.md`
2. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III
3. Sprint 1 deliverable: `/terms` `/refund` `/privacy` đầy đủ + style guide
4. Wave 3: viết landing page `/dream-nurture` theo `NDNUM_PUBLIC_LANDING_PAGE_SCOPE.md`

### Bạn là SEO Specialist
1. Đọc Brandpro file gốc `/Users/tranhatam/Documents/Devnewproject/Brandpro-all/kit-v1.1/10-SEO-Entity-Plan.md`
2. Đọc `BRANDPRO_INTEGRATION_MAP.md` Mục III (Sprint 2 — Major)
3. Sprint 2 deliverable: Schema.org + Wikidata + Entity SEO full

---

## 📁 File trong thư mục này (sau Wave 3 + Sprint 0 execution)

### Index + Master plan
| File | Mục đích | Status |
|---|---|---|
| `README.md` | Index file này | 📝 Wave 1 — 2026-05-13 |
| `00_DSTS_MASTER_INDEX_2026.md` | Master index 3 Layer + Phase 0B + NDNUM | 📝 DRAFT v1.5.5 — pending re-lock |
| `dsts-master-plan-v1.2-DRAFT.md` | Master plan v1.2 — chèn Phase 0B | 📝 DRAFT — pending re-lock |
| `MASTER_PLAN_v1.1_FINAL.md` | Master plan v1.1 (legacy reference) | 🗄️ Archive ref |
| `MASTER_PLAN_v2.md` | Master plan v2 với Brandpro Phase 5 | ✅ Reference |
| `PRODUCT_STRATEGY_v1.md` | Chiến lược sản phẩm v1 | ✅ Reference |

### Layer 0 Sprint 0 (đang chạy)
| File | Mục đích | Status |
|---|---|---|
| `DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md` | 9 GitHub Issue + DoD | 🔒 Locked 2026-05-12 |
| `SPRINT_0_TICKETS.md` | 6 ticket chi tiết Sprint 0 | ✅ Reference |
| `STATE_REPORT_2026-05-14.md` | Current Sprint 0 execution status + Cloudflare external blocker | 🟢 Current |
| `../RUNBOOK.md` | Public-site deploy, rollback, verification, and incident response | 🟢 Current |
| `../tokens.css` | Public design tokens: color, spacing, typography, radius, shadow | 🟢 Current |
| `../functions/_lib/public-routes.js` | Shared indexable/noindex/redirect route manifest for sitemap + SEO QA | 🟢 Current |
| `../functions/_lib/feed-utils.js` | Shared RSS feed builder for dynamic function + static `rss.xml` | 🟢 Current |
| `../sitemap.xml` | Static sitemap generated from route manifest + 24 fallback posts | 🟢 Current |
| `../rss.xml` | Static RSS feed generated from 24 fallback posts | 🟢 Current |
| `../robots.txt` | Static crawler policy validated by content + SEO QA | 🟢 Current |
| `STATE_REPORT_2026-05-12-EOD.md` | Baseline 45/100 | ✅ Reference |
| `STATE_REPORT_2026-05-12.md` | Báo cáo trạng thái morning | ✅ Reference |
| `dsts-bug-report.md` | Bug report audit ban đầu | ✅ Reference |
| `GAP_ANALYSIS_V2_vs_v1.md` | Gap analysis V2 vs V1 | ✅ Reference |
| `dsts-100-master-plan.md` | Master plan v1.0 (legacy) | 🗄️ Archive ref |

### Layer 1 Movement Portal (kickoff Tháng 9/2026)
| File | Mục đích | Status |
|---|---|---|
| `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` | Spec Movement Portal | 🟡 DRAFT v1.0 — Wave 1 patch |
| `DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` | 13 gói tài trợ + flow xác nhận | 🟡 DRAFT v1.0 |
| `DSTS_EVENT_SHOWCASE_OPERATIONS_RUNBOOK.md` | Event lifecycle 10 stage | 🟡 DRAFT v1.0.1 — Wave 1 patch |
| `DSTS_TOUR_CALENDAR_2026_2027.md` | Tour 33+ country | 🟡 DRAFT v1.0.1 — Wave 1 patch |
| `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md` | Quy tắc privacy + trust | 🟡 DRAFT v1.0 |
| `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` | Flow thanh toán + membership | 🟡 DRAFT v1.0 |
| `DSTS_RELEASE_QA_100_SCORE_CHECKLIST.md` | QA checklist | 🟡 DRAFT v1.0 |

### NDNUM (Phase 0B — Tháng 6-8/2026)
| File | Mục đích | Status |
|---|---|---|
| `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` | NDNUM nonprofit v1.1-REVIEWED (78→92/100) | 🟡 DRAFT — Wave 3 lock thành v1.2 |

### Brand & Integration
| File | Mục đích |
|---|---|
| `BRANDPRO_INTEGRATION_MAP.md` | Mapping Brandpro 16 file ↔ DSTS sprint |
| `ECOSYSTEM_INTEGRATION.md` | Bản đồ ecosystem (Muonnoi/Nguoiviet/DSTS/Phuong Dong) |

### Archive (KHÔNG dùng làm reference)
- `_archive_2026-05-13/` — 4 folder duplicate snapshot pre-Wave 1 (xem `_archive_2026-05-13/README.md`)
- `_artifacts/` — smoke test artifacts

---

## 🚦 Trạng thái dự án (cập nhật 2026-05-14)

### Layer 0 — Foundation (đang chạy, deadline 2026-06-09)

| Sprint | Trạng thái | Điểm trước | Điểm sau | Gate |
|---|---|---|---|---|
| Baseline | ✅ | 0 | 45 | Audit `STATE_REPORT_2026-05-12.md` |
| Sprint 0 | 🟢 Repo-side route/API/content/SEO pass; 🟠 custom-domain header/cache blocked external | 45 | 90+ repo-side | Pending Cloudflare zone fix |
| Sprint 1 | – | 70 | 85 | – |
| Sprint 2 | – | 85 | 95 | – |
| Sprint 3 | – | 95 | 98 | – |
| Sprint 4 + Brandpro P5 | – | 98 | **100 + Brand Lock** | – |

### Phase 0B — Legal + Child Safety Lock (mới chèn, Tháng 6-8/2026)

- ⏳ Chặn bởi: Founder 6 NDNUM decisions + hire Legal Counsel + hire CSO
- 7 NDNUM spec con sẽ viết trong Wave 3

### Layer 1 — Movement Portal (kickoff Tháng 9/2026)

- 7 spec DEV-READY v1.0/v1.0.1
- UI Mockup, Sponsors API, Events API, Sponsor Agreement đã có
- Public Movement surfaces hiện chỉ read-only/no sensitive flows

### Current external blocker

- Cloudflare custom domain `duongsaotoasang.com` đang override `referrer-policy` và static asset cache TTL.
- Repo `_headers` đúng và preview deploy áp dụng đúng.
- Xem `STATE_REPORT_2026-05-14.md` để biết lệnh verify và owner action.

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
| pay.iai.one donation gateway | https://pay.iai.one (api key via Cloudflare env vars) |

---

## ⚠️ Lưu ý quan trọng cho team

1. **KHÔNG deploy vào project `duongsaotoasang-web`** (đó là project rỗng, không có custom domain). Project đúng là `duongsaotoasang-com-v2`.
2. **KHÔNG sửa kit Brandpro gốc** (`kit-v1.1/`). Mọi customization phải qua fork (xem `BRANDPRO_INTEGRATION_MAP.md`).
3. **KHÔNG commit secret** (API key, D1 binding token). Dùng Cloudflare Pages env vars hoặc `.dev.vars` local.
4. **KHÔNG skip gate** — mỗi sprint phải qua 3 gate (pre-sprint, PR review, founder QA).
5. **KHÔNG sửa `wrangler.toml` D1 binding** mà không báo founder — đã từng gây 5 deployment failure liên tiếp.
6. **KHÔNG dùng file trong `_archive_2026-05-13/` làm reference** — đó là snapshot pre-Wave 1, có thể chứa version cũ.
7. **KHÔNG launch Movement Portal hoặc Young Star Showcase trước Phase 0B legal lock done** (Tháng 8/2026 sớm nhất).

---

## 📞 Liên hệ

- **Founder:** Trần Hà Tâm (final approver mọi T2/T3 deliverable)
- **Brand Guardian:** Chưa có — Founder kiêm 3 tháng đầu (theo Master Plan v2 Mục XI)
- **Tech Lead:** Chỉ định trước Sprint 0 (founder ký checklist)
- **Legal Counsel:** Phải hire trước Phase 0B (Tháng 6/2026)
- **Child Safety Officer:** Phải hire trước Phase 0B (Tháng 6/2026)
- **Cloudflare Account:** `Tranhatam@gmail.com` (account_id `f3f9e76222dcb488d5e303e29e8ba192`)

---

*Documentation maintained theo Brandpro standard. Mỗi commit thay đổi file trong `docs/` phải bump version trong CHANGELOG của file đó (Brandpro 14.E asset version log convention).*
