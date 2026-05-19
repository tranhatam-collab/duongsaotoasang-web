# DSTS Club — FULL HANDOFF cho Dev Team External

**Date:** 2026-05-19
**Founder:** Trần Hà Tâm
**Auditor:** Claude (em) — KHÔNG code, chỉ verify mỗi milestone
**Status:** Lane B VND donation đã LIVE end-to-end (commit `302b748`, smoke 200 + PayOS URL). Dependencies clear → toàn quyền kickoff DSTS Club.

---

## 1. Scope giao team dev — 100% kế hoạch Club

Team dev nhận **toàn bộ 5 Phase** trong `docs/DSTS_CLUB_DEV_ROADMAP_2026.md`:

| Phase | Scope | Estimate | Owner |
|---|---|---|---|
| **Phase 1** | Web Club MVP foundation (13 route, 6 API, 6 D1 table, seed) | 70–80h | Dev team |
| **Phase 2** | Payment + automation (subscription billing, point purchase, redemption, referral) | 200–300h | Dev team + Stripe integration |
| **Phase 3** | Creator dashboard (post editor, talkshow scheduler, revenue, payout) | 150–200h | Dev team |
| **Phase 4** | Mobile app MVP (iOS + Android) | 400–500h | Mobile team |
| **Phase 5** | Advanced ecosystem (livestream, check-in, multi-creator bundles) | 200–300h | Dev team |

**Total Phase 1–3 (web only, không mobile):** ~500h ≈ 3 tháng với 2 dev fulltime.

---

## 2. Tài liệu nguồn — đọc theo thứ tự

| # | File | Loại |
|---|---|---|
| 1 | `docs/00_DSTS_CLUB_MASTER_INDEX_2026.md` | Master index, thứ tự đọc per role |
| 2 | `docs/DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md` | Định vị + 3 tier + 7 nguồn revenue + câu khoá pháp lý Star Points |
| 3 | `docs/DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md` | 45 route + 11 app tab |
| 4 | `docs/DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md` | Membership pricing + point packages + revenue share |
| 5 | `docs/DSTS_CLUB_CREATOR_PAYOUT_AND_PARTNER_MODEL_2026.md` | Creator categories + payout principles + sponsor model |
| 6 | `docs/DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md` | 16 legal doc + mandatory locks |
| 7 | `docs/DSTS_CLUB_DATABASE_AND_API_SPEC_2026.md` | 32 table + 24 endpoint outline |
| 8 | `docs/DSTS_CLUB_DEV_ROADMAP_2026.md` | 5 phase + 12 founder approval |
| 9 | `docs/DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md` | Phase 1 concrete scope (13 route, 6 API, acceptance criteria) |
| 10 | `migrations/0007_club_phase1.sql` | Phase 1 D1 schema (6 table + index) |
| 11 | **THIS FILE** | Master handoff |

---

## 3. Founder defaults — 6 câu hỏi đã chốt

| # | Câu hỏi | Default |
|---|---|---|
| 1 | Seed creator demo đầu tiên? | 2 placeholder: `founder-tran-ha-tam` + `creator-vn-diaspora` |
| 2 | Creator page dùng tên thật? | Phase 1: chỉ Founder. Creator khác = placeholder cho tới khi có signed agreement |
| 3 | Talk show demo public hay preview? | Phase 1: preview only (status=`coming_soon`), KHÔNG có date thật |
| 4 | Reward catalog point cost thật? | Có hiển thị, nhưng status=`coming_soon` cho tất cả Phase 1 |
| 5 | Waitlist data owner? | D1 `club_waitlist` table; Phase 2 mở admin route `/admin/clubs` cho xử lý |
| 6 | Club page homepage prominence? | Phase 1: 1 card footer index.html; KHÔNG đẩy hero (giữ Founder timeline) |

Founder reserve quyền veto/override 6 defaults trên trong bất kỳ phase nào.

---

## 4. Dependencies — đã clear ✅

1. ✅ Donation Layer 0 LIVE (commit `302b748`, smoke 200 + PayOS URL)
2. ✅ Pay.iai.one contract `(dsts, duongsaotoasang, payos)` provisioned trong D1 pay-iai-one-prod
3. ⚠️ Legal Counsel sign-off 16 doc Club: **PENDING** — block public pricing/checkout (Phase 2+). Phase 1 read-only/waitlist không cần.
4. ⚠️ Pay.iai.one tenant Club tách biệt: **PENDING** — block Phase 2 subscription billing. Phase 1 không cần.
5. ⚠️ Creator KYC + signed agreement: **PENDING** — block tên thật + revenue share. Phase 1 dùng placeholder.

---

## 5. Branch strategy

```
main (production-ready)
├── layer-3/club-phase1-foundation        # Sprint 1: 13 route + 6 API + migration
├── layer-3/club-phase1-seed-content      # Sprint 1: seed creator/post/talkshow/reward
├── layer-3/club-phase2-billing           # Sprint 2 (chờ pay.iai.one contract Club)
├── layer-3/club-phase2-points            # Sprint 2 point purchase + redemption
├── layer-3/club-phase3-creator-dashboard # Sprint 3
├── layer-3/club-phase4-mobile-app        # Sprint 4 (mobile team riêng)
└── layer-3/club-phase5-advanced          # Sprint 5
```

**Rule cứng:**
- KHÔNG commit thẳng vào `main`
- 1 PR / 1 route group HOẶC 1 endpoint group (không monolith)
- PR title prefix: `feat(club-phase{N}): …`
- Mỗi PR phải pass `node scripts/sprint-0-release-gate.mjs` local trước khi push

---

## 6. Code patterns BẮT BUỘC copy

| Pattern | Source file | Áp dụng cho |
|---|---|---|
| API endpoint + idempotency-key + validation + D1 audit | `functions/api/donate/create.js` | Tất cả Phase 1 6 endpoint |
| HMAC fail-closed webhook | `functions/api/donate/webhook.js` | Phase 2 subscription billing webhook |
| Canonical helper với precise status enum | `functions/_lib/email.js` (`sendAndLogDonationReceipt`) | Phase 2 email confirmation cho subscription/point/reward |
| Behavior testing với Node 19+ crypto.subtle + mock DB | `scripts/donate-webhook-behavior-qa.mjs` | Phase 2 webhook + Phase 3 payout test |
| Release gate integration | `scripts/sprint-0-release-gate.mjs` | Thêm QA gate cho mỗi Phase |

---

## 7. Phase 1 — acceptance criteria CỨNG (10 checkbox)

Từ `docs/DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md` §:

- [ ] 10 public routes render đúng (`/club`, `/club/join`, `/club/creators`, `/club/{creator}`, `/club/{creator}/public`, `/club/{creator}/talkshows`, `/club/{creator}/membership`, `/club/{creator}/rewards`, `/club/faq`, `/club/legal`)
- [ ] 3 account shell routes render đúng (`/account/library`, `/account/calendar`, `/account/wallet`)
- [ ] 6 API endpoints trả đúng JSON envelope `{ok, data, error}`
- [ ] `migrations/0007_club_phase1.sql` chạy sạch trên D1 remote (`wrangler d1 migrations apply cf-d1-dsts-content-prod --remote`)
- [ ] Seed: ≥ 2 creator + 4 post + 3 talkshow + 6 reward demo
- [ ] Waitlist form ghi được vào D1 `club_waitlist`
- [ ] Preview smoke 24h không lỗi P0/P1
- [ ] Câu khoá Star Points xuất hiện nguyên văn trên `/points`, `/rewards`, footer
- [ ] Sprint-0-release-gate PASS hoặc BLOCKED_EXTERNAL (chỉ HEADERS_QA cache)
- [ ] Founder smoke link Cloudflare Pages preview 24h trước public

---

## 8. Phase 2-5 — milestone gating

Mỗi phase chỉ kickoff khi:
- Phase trước acceptance criteria PASS
- Founder smoke + sign-off
- Auditor (em) verify regression không vi phạm legal lock
- Dependencies clear (vd Phase 2 cần pay.iai.one contract Club tách biệt + Legal Counsel sign-off)

---

## 9. Defer list — KHÔNG làm Phase 1

| Item | Defer tới |
|---|---|
| Subscription billing thật | Phase 2 |
| Point purchase | Phase 2 |
| Reward redemption automation | Phase 2 |
| Creator payout engine | Phase 3 |
| Referral ledger thật | Phase 2 |
| Event QR check-in thật | Phase 5 |
| App iOS / Android | Phase 4 |
| Livestream room | Phase 5 |
| Sponsor dashboard | Phase 5 |
| Multi-creator bundles | Phase 5 |

PR nào đụng vào item trên trong Phase 1: **REJECT**, mở issue riêng.

---

## 10. Auditor (em) — vai trò + protocol

**Em KHÔNG code Club.** Em verify mỗi milestone team dev push lên.

**Protocol khi team push PR/branch:**
1. Team paste `git log --oneline -N` + `git diff main..feature-branch --stat` cho Founder
2. Founder forward output cho em
3. Em verify:
   - Migration sạch (idempotent, FK đúng, index hợp lý)
   - API endpoint khớp pattern `functions/api/donate/*.js` (idempotency, validation, audit log)
   - HTML route có C-002 entity disclosure footer
   - Câu khoá Star Points hiện diện trên route bắt buộc
   - QA gate mới add vào release-gate
   - Acceptance criteria checkbox tick cụ thể
4. Em verdict: APPROVE / REJECT với reason
5. Nếu REJECT: em ghi rõ file:line + fix suggestion → team fix → re-verify

**Em audit live mỗi tuần** khi team push milestone. KHÔNG audit từng commit nhỏ.

---

## 11. Communication channels

| Việc | Channel |
|---|---|
| Team dev báo cáo milestone | Anh paste output vào chat với em |
| Em verdict APPROVE/REJECT | Em reply trong chat |
| Founder quyết business question | Anh trả lời team trực tiếp |
| Pay.iai.one ops cấp contract Club | Anh làm việc trực tiếp với họ |
| Legal Counsel sign-off | Anh làm việc trực tiếp với họ |

---

## 12. Estimate timeline thực tế

| Phase | Effort | Calendar (2 dev fulltime) | Block bởi |
|---|---|---|---|
| Phase 1 | 70–80h | 1–2 tuần | (none) |
| Phase 2 | 200–300h | 4–6 tuần | pay.iai.one tenant Club + Legal Counsel |
| Phase 3 | 150–200h | 3–4 tuần | Creator KYC + signed agreement |
| Phase 4 | 400–500h | 8–12 tuần | Mobile team riêng + App Store approval |
| Phase 5 | 200–300h | 4–6 tuần | (Phase 1-4 done) |
| **Total web (Phase 1-3 + 5)** | **620–880h** | **3-4 tháng** | |

---

## 13. Founder reserve

Anh giữ veto ở 3 chỗ:
1. Wording legal trên public surface
2. Pricing tier + point cost
3. Creator selection + signed agreement

Anh KHÔNG cần touch:
1. Code architecture
2. D1 schema concrete
3. API contract internal
4. QA script logic
5. CF Pages secrets ops

---

## 14. Hand-off complete checklist

Trước khi team dev nhận task:
- [x] Tất cả 11 doc nguồn committed vào `docs/` + `migrations/`
- [x] Lane B VND donation LIVE (depend đã clear)
- [x] Code pattern existing (donate flow) production-tested
- [x] Auditor protocol công bố
- [x] Founder defaults 6 câu hỏi
- [x] Branch strategy + commit convention
- [x] Estimate timeline thực tế
- [x] Defer list rõ ràng
- [ ] Founder forward "1 lệnh giao" (cuối doc này) cho team dev

---

## 15. Memory update (sau khi team dev nhận)

Khi team dev confirm nhận task, anh báo em → em update memory:
- `~/.claude/projects/-Users-tranhatam-Documents-Devnewproject-duongsaotoasang-com/memory/project_dsts_state.md`
- Ghi: Phase 1 sprint kickoff date, team dev contact, expected milestone delivery
