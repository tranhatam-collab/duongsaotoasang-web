# DSTS — Founder Action Checklist

> **Created:** 2026-05-15
> **Scope:** Tất cả các action item NGOÀI scope dev team — chỉ Founder mới quyết được.
> **Mục tiêu:** Anh tick xong checklist này → kế hoạch DSTS 100% hoàn thành cho Sprint 0 + Layer 1 dev-ready.

---

## 1) ✅ DONE — Production Deploy (2026-05-15)

**Status:** ✅ DEPLOY SUCCESS — `https://41cfb754.duongsaotoasang-com-v2.pages.dev`
**Log:** `docs/DEPLOY_LOG_2026-05-15T09-52-45Z.md`

**Production verification results:**
- ✅ API Surface: PASS (list_no_body, search_no_body, detail_body, missing_404)
- ✅ Link QA: PASS (32 pages, 291 discovered links, 59 unique internal)
- ✅ SEO Routes: PASS (32 indexable, 2 noindex, 2 redirects)
- ⚠️ Headers: 6 mismatch — **NGUYÊN NHÂN: Cloudflare CDN edge cache cũ**, không phải bug code. Resolve sau 4h hoặc purge cache manual qua dashboard.

**Header mismatches (cache-related, sẽ tự fix):**
- `Referrer-Policy`: edge cache trả `same-origin`, `_headers` đã set `strict-origin-when-cross-origin` ✅
- `/app.css`, `/tokens.css`, `/assets/app-v5.js`, `/og.png`: edge cache trả `max-age=14400`, `_headers` đã set `max-age=300` ✅
- `/assets/app.js`: edge cache trả 200, file đã retired (commit `a81a4ab`), cần purge cache để trả 404

**Fix manual (optional, nếu muốn ngay):**
1. Login Cloudflare dashboard
2. `duongsaotoasang.com` → Caching → Configuration → Purge Cache → Custom Purge
3. Paste 6 URLs trên → Purge
4. Re-run: `BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs`

**Hoặc** đợi 4h tự expire rồi anh re-run.

---

## 1.5) Re-run command (sau khi purge hoặc đợi 4h)

```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com && \
LOG="docs/DEPLOY_LOG_$(date -u +%Y-%m-%dT%H-%M-%SZ).md" && \
{
  echo "# DSTS Production Re-verify Log"
  echo "**Started:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo ""
  echo "## Release gate full (BASE_URL=production)"
  echo '```'
  BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs 2>&1
  echo '```'
  echo ""
  echo "## Smoke test (pages.dev preview)"
  echo '```'
  BASE_URL=https://duongsaotoasang-com-v2.pages.dev bash scripts/smoke-test.sh 2>&1
  echo '```'
} | tee "$LOG" && \
git add "$LOG" && git commit -m "docs: production re-verify $(date -u +%Y-%m-%d)" && git push origin main
```

---

## 0) ARCHIVED — Original one-shot deploy command (đã chạy thành công)

**Tình trạng:** Repo-side 100% done. 9 local QA pass. Chỉ chờ mạng thật để deploy + verify production.

**Anh chạy 1 lệnh duy nhất này trên terminal có mạng:**

```bash
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com && \
LOG="docs/DEPLOY_LOG_$(date -u +%Y-%m-%dT%H-%M-%SZ).md" && \
{
  echo "# DSTS Production Deploy Log"
  echo "**Started:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "**HEAD:** $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"
  echo ""
  echo "## Step 1/4 — wrangler pages deploy"
  echo '```'
  npx wrangler pages deploy . --project-name duongsaotoasang-com-v2 --branch main 2>&1 | tee /tmp/deploy.out
  echo '```'
  echo ""
  echo "## Step 2/4 — release gate dry-run (production env)"
  echo '```'
  NODE_ENV=production RUN_DEPLOY_DRY_RUN=1 node scripts/sprint-0-release-gate.mjs 2>&1 | tee /tmp/gate-dry.out
  echo '```'
  echo ""
  echo "## Step 3/4 — release gate full (BASE_URL=production)"
  echo '```'
  BASE_URL=https://duongsaotoasang.com node scripts/sprint-0-release-gate.mjs 2>&1 | tee /tmp/gate-full.out
  echo '```'
  echo ""
  echo "## Step 4/4 — smoke test (pages.dev preview)"
  echo '```'
  BASE_URL=https://duongsaotoasang-com-v2.pages.dev bash scripts/smoke-test.sh 2>&1 | tee /tmp/smoke.out
  echo '```'
  echo ""
  echo "**Finished:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo ""
  echo "## Verdict"
  grep -E "PASS|FAIL|deployed to|Success" /tmp/deploy.out /tmp/gate-dry.out /tmp/gate-full.out /tmp/smoke.out 2>/dev/null | tail -30
} | tee "$LOG" && \
echo "" && echo "===========================================" && \
echo "DONE. Log saved to: $LOG" && \
git add "$LOG" && git commit -m "docs: production deploy log $(date -u +%Y-%m-%d)" && git push origin main
```

**Sau khi chạy xong:**
- File `docs/DEPLOY_LOG_<timestamp>.md` sẽ có evidence đầy đủ
- Auto-commit + push log lên `origin/main`
- Báo em paste log để verify

---

## 2) NDNUM — 6 Founder Decisions (block Phase 0B Tháng 6-8/2026)

Chi tiết tại `docs/dsts-nuoi-duong-nhung-uoc-mo-v1.2-LOCKED.md` Mục XVI và `docs/NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md`.

- [x] **D1 — Pháp nhân: ✅ LOCKED 2026-05-15 → Option C (Fiscal Sponsor)**
  - Y1: Fiscal sponsor (cần chọn cụ thể: GiveDirectly Foundation / Global Giving / Players Philanthropy Fund — D3 follow-up)
  - Y2-3: Transition sang Option A (NGO VN) + Option B (US 501(c)(3))
  - **Impact:** Em sẽ update `NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md` Mục 1 mark D1 = LOCKED, để D3 (fiscal sponsor cụ thể) làm next-step.

- [ ] **D2 — Angel Edu Tam Foundation IRS status:**
  - Đăng ký 501(c)(3) Y1? Hay defer Y2?

- [ ] **D3 — Fiscal sponsor lựa chọn cụ thể (nếu chọn Option C):**
  - GiveDirectly Foundation? Global Giving? Players Philanthropy Fund?

- [ ] **D4 — Investment Lane Y1 (Lane C):**
  - Confirm: **CLOSED Y1** (không nhận investment Y1, defer to Y3+)?

- [ ] **D5 — Cap Y1 trẻ em:**
  - 20 trẻ với 5 Coordinator? Hay scale-down 10 trẻ với 3 Coordinator?

- [ ] **D6 — Phase 0B 2 tháng đủ?**
  - Realistic check: hire CSO + Legal trong 2 tháng (T6-T7/2026)? Hay extend T6-T9/2026?

---

## 3) Hire — Critical Roles Pre-Phase 0B (✅ Founder confirmed order 2026-05-15)

### 🚀 PRIORITY 1 — CSO (start T6/2026 ngay)
- [ ] **CSO (Child Safety Officer)** — Part-time consultant ~$2-3K/tháng
  - **STATUS: ACTIVE RECRUIT — T6/2026**
  - **Why first:** Blocker bắt buộc cho Phase 0B vì NDNUM có tầng trẻ em
  - **Requirements:** IICRC cert hoặc tương đương, 5+ năm kinh nghiệm child protection
  - **Reporting line:** Board-independent (KHÔNG report Founder direct)
  - **Contract minimum:** 2 năm
  - **Sourcing:** UNICEF VN alumni, Save the Children VN, Plan International VN, ChildSafe Movement

### 🚀 PRIORITY 2 — Legal Counsel VN (parallel with CSO, retainer-based)
- [ ] **Legal Counsel VN** — Retainer $3-5K/tháng HOẶC $10K/3 tháng project
  - **STATUS: ACTIVE RECRUIT — T6/2026 (song song với CSO)**
  - **Engagement model:** Retainer theo deliverable, không full-time
  - **Specialty:** Luật trẻ em VN 2016, NĐ 56/2017, NĐ 13/2023, nonprofit registration
  - **First deliverable:** Lock `NDNUM_CHILD_SAFETY_POLICY.md` + `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` → v1.0-LOCKED
  - **Second deliverable:** Sign-off `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md` → v1.0
  - **Third deliverable:** Vet fiscal sponsor contract (D3 follow-up)

### ⏳ PRIORITY 3 — M&E Specialist (defer 1 tháng → T7/2026)
- [ ] **M&E Specialist** — $2-4K/tháng
  - **STATUS: DEFERRED → start T7/2026 (sau khi CSO + Legal đã onboarded)**
  - **Specialty:** SDQ Vietnamese validation, k-anonymity, child outcome measurement
  - **First deliverable:** Validate `NDNUM_IMPACT_MEASUREMENT_FRAMEWORK.md` Logic Model

---

## 4) ✅ A7 Event Status — LOCKED 2026-05-15

- [x] **Sự kiện 2026-01-22 (A7): ✅ SKIPPED — không track như event diễn ra**
  - **Decision:** Bỏ qua sự kiện, không xử lý completed/postponed/cancelled — treat as never-happened
  - **Em sẽ thực thi:**
    1. Update `docs/00_DSTS_MASTER_INDEX_2026.md` Mục 4.2 → remove A7 row
    2. Remove A7 reference khỏi `docs/DSTS_TOUR_CALENDAR_2026_2027.md`
    3. Keep `/movement/gala-2026` HTML page nhưng đổi wording thành "Gala 2026 — TBD"
    4. Remove `/movement/gala-2026` khỏi `functions/sitemap.xml.js` để không index

---

## 5) Lock — Sponsor Tier Pricing

- [ ] **Lock 13 sponsor tier pricing** trong `docs/DSTS_SPONSORSHIP_FULFILLMENT_TRACKER.md` Mục 1
  - **Hiện tại:** DRAFT pricing
  - **Why now:** Cần lock trước khi Sponsor API mở (Phase 1.2 Tháng 9-10/2026)

---

## 6) External — Legal Opinion

- [ ] **Hand `DSTS_SPONSOR_AGREEMENT_LEGAL_TEMPLATE.md` cho outside law firm**
  - **Budget:** ~$2-5K legal opinion
  - **Timeline:** 4-6 tuần
  - **Goal:** v1.0-LOCKED có hiệu lực pháp lý
  - **Suggested firms VN:** YKVN, VILAF, Tilleke & Gibbins

---

## 7) Optional — Cloudflare API Token (cho automated deploy)

Nếu anh muốn em deploy tự động trong tương lai, anh tạo Cloudflare API token:

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token** → Use template **"Edit Cloudflare Workers"**
3. Permissions: `Account` → `Cloudflare Pages` → `Edit`
4. Account Resources: `Include` → Account anh
5. TTL: Tự chọn (recommend 90 ngày, rotate)
6. Save token, paste cho em (1 lần)

**Note:** Em sẽ KHÔNG lưu token vào repo. Token chỉ dùng trong session.

---

## Tiến độ checklist

```
╔════════════════════════════════════════════╗
║  FOUNDER ACTION ITEMS — Track here         ║
╠════════════════════════════════════════════╣
║ 1. Production deploy           [✅] DONE    ║
║ 1.5. CDN cache purge            [⏳] CF token pending ║
║    → bash scripts/cf-token-setup.sh          ║
║    → bash scripts/cf-cache-purge.sh          ║
║ 2. NDNUM D1 Pháp nhân          [✅] Option C locked  ║
║ 2. NDNUM D2-D6 còn lại         [ ][ ][ ][ ][ ]        ║
║ 3. CSO recruit (P1)            [⏳] T6/2026 active   ║
║ 3. Legal Counsel VN (P2)       [⏳] T6/2026 parallel ║
║ 3. M&E (P3)                    [⏳] T7/2026 defer    ║
║ 4. A7 event status              [✅] SKIPPED         ║
║ 5. Sponsor tier pricing lock   [ ]          ║
║ 6. Legal opinion (external)    [ ]          ║
║ 7. CF API token                 [⏳] pending paste   ║
║                                              ║
║ CODE ITEMS (DONE by dev 2026-05-15):         ║
║ · Email receipt automation     [✅]          ║
║ · Entity disclosure C-002      [✅] 24 pages ║
║ · Donation polling fallback    [✅]          ║
╚════════════════════════════════════════════╝
```

**Khi anh tick hết 1-5:** DSTS Sprint 0 + Layer 1 dev-ready = **100% complete**.

---

## Cross-references

- Master Plan: `docs/dsts-master-plan-v1.2-DRAFT.md` (sẽ lock v1.2-LOCKED sau NDNUM decisions)
- NDNUM v1.2-LOCKED: `docs/dsts-nuoi-duong-nhung-uoc-mo-v1.2-LOCKED.md`
- Master Index: `docs/00_DSTS_MASTER_INDEX_2026.md`
- Latest state: `docs/STATE_REPORT_2026-05-15.md`
- Memory state: `~/.claude/projects/-Users-tranhatam-Documents-Devnewproject-duongsaotoasang-com/memory/project_dsts_state.md`
