# DSTS Club — CONTINUOUS DEV PLAN 2026-05-19 (Phase 1→5)

**Tổng effort web:** 620–880h ≈ 3–4 tháng với 2 dev fulltime
**Repo:** `duongsaotoasang.com` branch `main` → feature branches `layer-3/club-phaseN-*`
**Stack:** Vanilla JS/HTML, Cloudflare Pages Functions, D1 SQLite

---

## TRẠNG THÁI HIỆN TẠI (Pre-flight check)

| Item | Status |
|---|---|
| Lane B VND donation LIVE | ✅ commit `302b748`, smoke 200 + PayOS URL |
| D1 migration `0007_club_phase1.sql` applied remote | ✅ 6 tables exist |
| Seed demo data in D1 remote | ✅ 2 creator + 4 post + 3 talkshow + 6 reward |
| Cloudflare Pages project | ✅ `duongsaotoasang-com-v2` |
| Code patterns (donate flow) production-tested | ✅ |
| 11 source docs committed | ✅ |

---

## PHASE 1 — Web Club MVP (1–2 tuần, 70–80h, KHÔNG block)

### Sprint 1.1 — 4 API endpoints (~16h)
**Branch:** `layer-3/club-phase1-foundation`

| # | Endpoint | File | Key detail |
|---|---|---|---|
| 1 | `GET /api/clubs` | `functions/api/clubs/index.js` | Public list active creators, JOIN creator_profiles for bio/avatar |
| 2 | `GET /api/clubs/:slug` | `functions/api/clubs/[slug].js` | 2-step: get creator → get profile. 404 if not active/draft |
| 3 | `GET /api/clubs/:slug/posts` | `functions/api/clubs/[slug]/posts.js` | `?visibility=public|member|circle|inner_circle`. Locked tiers: NO body_html |
| 4 | `POST /api/clubs/waitlist` | `functions/api/clubs/waitlist.js` | Email regex, interest_type whitelist 6 values, idempotency-key replay |

**Code patterns bắt buộc (copy từ donate flow):**
- `errorJson(code, message, status)` helper
- Idempotency-key replay guard
- Validation strict + bounded input
- Audit log D1 INSERT OR IGNORE
- JSON envelope `{ok, data, error}`

### Sprint 1.2 — Talkshows + Rewards API (~6h)
**Branch:** `layer-3/club-phase1-foundation` (cùng branch 1.1)

| # | Endpoint | File | Key detail |
|---|---|---|---|
| 5 | `GET /api/talkshows` | `functions/api/talkshows.js` | `?upcoming=true&visibility=public`. JOIN creators for slug. LIMIT 50 |
| 6 | `GET /api/rewards/catalog` | `functions/api/rewards/catalog.js` | `?category=digital\|event\|experience`. Order: digital→event→experience, points ASC |

### Sprint 1.3 — 10 public HTML routes (~32h)
**Branch:** `layer-3/club-phase1-routes-public`

Mỗi route = 1 file HTML, inline CSS, fetch JS-side, C-002 footer.

| # | Route | File | Sections |
|---|---|---|---|
| 1 | `/club` | `club.html` | Hero "DSTS Club" → 3-tier cards → featured creators (fetch API) → talkshows → rewards preview → waitlist CTA |
| 2 | `/club/join` | `club/join.html` | Form waitlist: email, full_name, phone, interest_type select, creator_slug dropdown, notes. Star Points disclaimer. |
| 3 | `/club/levels` | `club/levels.html` | 3-tier detail cards. Star Points disclaimer. "Phase 1 waitlist only" notice. |
| 4 | `/club/faq` | `club/faq.html` | 10–15 Q&A from product plan. |
| 5 | `/club/legal` | `club/legal.html` | 16 legal doc list (all DRAFT). Star Points disclaimer. 11 mandatory legal locks. |
| 6 | `/club/creators` | `club/creators.html` | Grid fetch `/api/clubs`, render cards. |
| 7 | `/club/{creator}` | `club/creator.html` | Dynamic via `_redirects` + `?slug=` param. Hero → bio → public posts → talkshows → social links. |
| 8 | `/club/{creator}/public` | `club/creator-public.html` | Creator posts list visibility=public. |
| 9 | `/club/{creator}/talkshows` | `club/creator-talkshows.html` | Filter by creator_slug. "coming_soon" status. |
| 10 | `/club/{creator}/membership` | `club/creator-membership.html` | 3-tier card, CTA waitlist with creator_slug preset. Star Points disclaimer. |
| 11 | `/club/{creator}/rewards` | `club/creator-rewards.html` | Fetch catalog, filter, "coming_soon" status. Star Points disclaimer. |

### Sprint 1.4 — 3 account shell routes (~6h)
**Branch:** `layer-3/club-phase1-routes-account`

| Route | File | Note |
|---|---|---|
| `/account/library` | `account/library.html` | Placeholder "Đăng nhập sẽ mở Phase 2" |
| `/account/calendar` | `account/calendar.html` | Placeholder |
| `/account/wallet` | `account/wallet.html` | Placeholder + Star Points disclaimer |

### Sprint 1.5 — _redirects + QA gates (~4h)
**Branch:** `layer-3/club-phase1-qa-gates`

**`_redirects` additions:** 14 Club routes + dynamic param routing.

**New QA gate:** `scripts/club-phase1-qa.mjs` checks:
- 14 Club HTML files exist
- Star Points disclaimer on 7 mandatory pages
- C-002 footer on ALL 14 pages
- No forbidden phrases: "đầu tư", "lãi suất", "lợi nhuận cam kết", "rút tiền", "đổi USD"

**Integration:** Add to `scripts/sprint-0-release-gate.mjs`:
- club-phase1-qa
- syntax check all 6 API files

**Update existing QA:** claim-register-qa, public-flow-safety-qa, content-qa, html-structure-qa, seo-route-qa.

### Sprint 1.6 — Smoke + Deploy (~4h)
Merge all Phase 1 branches → PR → `main`. Pre-merge:
- [ ] `sprint-0-release-gate.mjs` PASS local
- [ ] 6 API 200 on local dev
- [ ] 14 routes render on local dev
- [ ] Manual deploy preview (NOT main)
- [ ] `BASE_URL=<preview> sprint-0-release-gate.mjs` PASS
- [ ] Founder smoke 24h
- [ ] Founder approve → merge → deploy production

### Phase 1 Acceptance (10 checkbox cứng)
- [ ] 10 public routes render
- [ ] 3 account shell routes render
- [ ] 6 API endpoints JSON envelope correct
- [ ] Migration clean on D1 remote
- [ ] Seed: ≥2 creator, 4 post, 3 talkshow, 6 reward
- [ ] Waitlist POST → D1 row created
- [ ] Star Points disclaimer on 7 mandatory pages
- [ ] C-002 footer on ALL 14 pages
- [ ] Release gate PASS or BLOCKED_EXTERNAL (headers only)
- [ ] Founder smoke 24h preview: no P0/P1

---

## PHASE 2 — Payment + Automation (4–6 tuần, 200–300h)

**⚠️ Block by:** pay.iai.one Club contract `(dsts, duongsaotoasang-club, payos)` + Legal Counsel sign-off 16 docs.

### Sprint 2.1 — Subscription Billing (~80h)
**Branch:** `layer-3/club-phase2-billing`

New tables (migration `0008`): `subscriptions`, `subscription_events`, `subscription_renewal_log`

**API endpoints:**
| Endpoint | Desc |
|---|---|
| `POST /api/clubs/subscribe` | Create subscription → pay.iai.one checkout. Idempotency-key replay |
| `GET /api/me/subscriptions` | List user subscriptions. Auth required |
| `POST /api/clubs/subscription/cancel` | Cancel at period end. Graceful |
| `POST /api/clubs/subscription/webhook` | HMAC fail-closed. Update status, write audit row |

**HTML:**
- `/club/{creator}/checkout` — subscription checkout flow
- `/account/subscriptions` — manage subscriptions

**Email automation:**
- `sendAndLogClubReceipt` in `functions/_lib/email.js`
- Templates: subscription confirm, renewal reminder, cancel confirm
- Table: `club_email_dispatches`

**3 pricing tiers:**
- Member: 99K VND / 5 USD — 100 pts/month
- Circle: 299K VND / 15 USD — 400 pts/month
- Inner Circle: 990K VND / 49 USD — 1500 pts/month

**Revenue split:** 50/30/20 (platform/creator pool/growth) on net revenue

### Sprint 2.2 — Point Purchase + Reward Redemption (~60h)
**Branch:** `layer-3/club-phase2-points`

New tables (migration `0009`): `point_ledger`, `point_packages`, `reward_redemptions`

**API endpoints:**
| Endpoint | Desc |
|---|---|
| `POST /api/points/purchase` | Buy point package → pay.iai.one checkout. Replay guard |
| `GET /api/me/points` | Balance + ledger history |
| `POST /api/rewards/redeem` | Redeem points for reward. Idempotent. Stock check |
| `GET /api/rewards/catalog/:slug` | Single reward detail |

**HTML:**
- `/points/purchase` — point package selection
- `/account/points` — balance, ledger, redeem history
- `/account/rewards` — full reward catalog + redeem CTA

**Anti-fraud:** Purchase replay guard. Redeem idempotency. Inventory check for limited items.

### Sprint 2.3 — Referral Ledger (~40h)
**Branch:** `layer-3/club-phase2-referral`

New tables (migration `0010`): `referral_links`, `referral_events`, `referral_clawback_log`

**State machine:** `pending → earned → clawed_back`

**API endpoints:**
| Endpoint | Desc |
|---|---|
| `POST /api/referrals/create` | Generate referral link |
| `GET /api/referrals/me` | List referrals + rewards |
| `POST /api/admin/referrals/clawback` | Admin: clawback on refund/fraud within 30 days |

**HTML:**
- `/account/referrals` — referral dashboard

**Referral rewards:**
- Member purchase: 20 pts
- Circle purchase: 75 pts
- Inner Circle purchase: 250 pts
- Retention bonus: +50% at 2mo, +100% at 3mo

### Sprint 2.4 — Email Automation (~20h)
Same branch as billing or point.

- `sendAndLogClubReceipt` canonical helper (copy `sendAndLogDonationReceipt` pattern)
- Templates: subscription, point, reward, referral confirmation
- Table: `club_email_dispatches` (audit log)

### Phase 2 Acceptance
- [ ] Subscription billing e2e: create → pay.iai.one checkout → webhook → D1 row status=active
- [ ] Points purchase: buy → ledger credit → balance reflect
- [ ] Reward redeem: points deducted → redemption row → (if digital) unlock
- [ ] Referral create → share → convert → reward earned
- [ ] Clawback on refund/fraud within 30 days
- [ ] Email confirmations sent (or skipped_no_provider audit row)
- [ ] HMAC fail-closed for all webhooks (T1+T2 verified)
- [ ] No forbidden wording on public surface
- [ ] Release gate PASS
- [ ] Founder smoke 24h

---

## PHASE 3 — Creator Dashboard (3–4 tuần, 150–200h)

**⚠️ Block by:** Creator KYC + signed agreement. Auth system prerequisite (Phase 2.1 login).

**Branch:** `layer-3/club-phase3-creator-dashboard`

**Scope:** Auth middleware → 11 creator routes → content management → payout engine.

### Sprint 3.1 — Auth + Creator Shell (~40h)
**Branch:** `layer-3/club-phase3-auth`

- Auth system: email OTP or Google OAuth (cho Phase 3)
- `_middleware.js` creator route guard
- `/creator/dashboard` — metrics overview
- `/creator/settings` — profile, bank info, payout method

### Sprint 3.2 — Post Editor + Talkshow Scheduler (~50h)
**Branch:** `layer-3/club-phase3-content`

- `/creator/posts` — CRUD + markdown editor + R2 media upload
- `/creator/talkshows` — CRUD + datetime picker + capacity
- `/creator/profile` — hero image, bio, social links

### Sprint 3.3 — Members + Revenue + Payout (~60h)
**Branch:** `layer-3/club-phase3-revenue`

- `/creator/members` — read-only list Phase 3, full export Phase 4
- `/creator/revenue` — dashboard: gross revenue, fees, refunds, net revenue, pool formula, event revenue
- `/creator/points` — creator contribution points ledger
- `/creator/payouts` — request payout (manual review, auto Phase 4)
- `/creator/reports` — content performance, member growth

**Revenue split enforcement:**
- Membership: 50% platform, 30% creator pool, 20% growth fund
- Talk shows: 60% creator, 40% platform
- Premium experiences: 70% creator, 30% platform
- All on net revenue (after fees, refunds, chargebacks, tax, event costs)

### Phase 3 Acceptance
- [ ] Auth guard: unauthenticated → redirect /account/login
- [ ] Post created → D1 row → rendered on creator profile
- [ ] Talkshow scheduled → D1 row → appears in `/club/{creator}/talkshows`
- [ ] Revenue dashboard shows correct split calculations
- [ ] Payout request → D1 row → admin pending state
- [ ] Creator points ledger accurate
- [ ] No forbidden legal wording
- [ ] Release gate PASS
- [ ] Founder smoke 24h

---

## PHASE 4 — Mobile App MVP (8–12 tuần, 400–500h, TEAM RIÊNG)

**⚠️ Block by:** Mobile team hired. App Store + Google Play approval.

**Branch:** `layer-3/club-phase4-mobile-app`
**Stack:** React Native hoặc Flutter (mobile lead chọn)

**App MVP tabs (12):**
| Tab | Phase 1 scope | Defer |
|---|---|---|
| Home | News feed, featured content | |
| Club | Creator grid, tier info | |
| Creators | Profile list, search | |
| Talk Shows | Calendar, reminder | Sign-up inside app |
| Library | View purchased content | |
| Wallet | Balance display | Purchase points/membership |
| Rewards | Catalog browse | Redeem inside app |
| Referral | Link generate, share | |
| Events | QR ticket viewer | Check-in logic |
| Profile | Edit, settings | |
| Support | Contact, FAQ | |

**Hard constraint:** App Phase 1 = engagement-first. NO in-app purchase. NO checkout. Web remains the payment channel. (`DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md` §"App phase 1 is engagement-first")

### Phase 4 Acceptance
- [ ] iOS TestFlight build available
- [ ] Android APK available
- [ ] 12 tabs render with API data
- [ ] Wallet balance readable (read-only)
- [ ] Reward catalog browsable (read-only)
- [ ] QR ticket viewer works
- [ ] Push notifications for talkshow reminders
- [ ] App Store review passed (or in progress)
- [ ] No in-app purchase flow present
- [ ] Founder smoke 48h

---

## PHASE 5 — Advanced Ecosystem (4–6 tuần, 200–300h)

**⚠️ Block by:** Phase 1-4 done.

**Branch:** `layer-3/club-phase5-advanced`

### Sprint 5.1 — Livestream + Check-in (~80h)
- WebRTC livestream room with recording
- Offline QR check-in system
- VIP meet scheduling

### Sprint 5.2 — Multi-creator Bundles (~40h)
- Bundle creation (multiple creators, combined price)
- Revenue split across creators per bundle
- `/clubs/bundles` route

### Sprint 5.3 — Ecosystem Sync (~40h)
- Người Việt Muôn Nơi profile sync
- DSTS showcase sync
- Chapter leader tools

### Sprint 5.4 — Sponsor Dashboard (~40h)
- Sponsor campaign CRUD
- Campaign performance dashboard
- `/admin/sponsors` route

### Phase 5 Acceptance
- [ ] Livestream room: host starts → viewers join → recording saved
- [ ] QR check-in: scan → attendee verified → event capacity tracked
- [ ] Multi-creator bundle: created → purchased → revenue split correctly
- [ ] Ecosystem sync: profile data flows between DSTS + NVMN
- [ ] Sponsor campaign: create → approve → display → report
- [ ] Release gate PASS
- [ ] Founder smoke 48h

---

## PHASE 2-5 MILESTONE GATING

Mỗi phase chỉ kickoff khi:
1. **Phase trước** acceptance criteria ALL PASS
2. **Founder smoke + sign-off**
3. **Auditor (Claude)** verify regression: không vi phạm legal lock
4. **Dependencies clear:**
   - Phase 2: pay.iai.one Club contract + Legal Counsel
   - Phase 3: Auth system + Creator KYC
   - Phase 4: Mobile team + App Store
   - Phase 5: Phase 1-4 done

---

## QA GATES PER PHASE

| Phase | QA script | File |
|---|---|---|
| 1 | `scripts/club-phase1-qa.mjs` | Star Points absent, C-002 absent, forbidden phrases |
| 2 | `scripts/club-billing-qa.mjs` | HMAC fail-closed broken, audit row missing |
| 2 | `scripts/club-points-policy-qa.mjs` | Forbidden words ("đầu tư", "lãi suất", "rút tiền") |
| 3 | `scripts/club-creator-payout-qa.mjs` | Revenue share calc error, payout without signed contract |
| 4 | (mobile team riêng) | App Store + Play Store review |
| 5 | `scripts/club-livestream-qa.mjs` | Webhook signature, capacity overflow |

Mỗi phase QA script phải được tích hợp vào `scripts/sprint-0-release-gate.mjs`.

---

## AUDITOR PROTOCOL (Claude)

**Vai trò:** Verify mỗi milestone. KHÔNG code.

**Khi team paste output:**
1. `git log --oneline -N` + `git diff main..feature-branch --stat`
2. Em verify:
   - Migration sạch (idempotent, FK, index)
   - API endpoint khớp pattern donate flow (idempotency, validation, audit)
   - HTML route có C-002 footer
   - Star Points disclaimer trên route bắt buộc
   - QA gate integrated into release-gate
   - Acceptance criteria checkbox kèm evidence
3. Verdict: **APPROVE** / **REJECT** + file:line reason
4. REJECT → team fix → re-verify

**Em audit mỗi milestone, KHÔNG audit từng commit.**

---

## RESPONSIBILITY SPLIT

| Task | Owner |
|---|---|
| pay.iai.one Club contract setup | Founder + ops |
| Legal Counsel sign-off 16 docs | Founder |
| Creator KYC + signed agreement | Founder |
| Cloudflare Pages secrets ops | Founder |
| D1 schema + API code | Dev team |
| HTML routes + UX | Dev team |
| QA scripts | Dev team |
| Wording on public surface | Founder veto |
| Pricing + point cost | Founder veto |
| Audit verification | Claude |

---

## DEFER LIST (KHÔNG làm Phase 1)

| Item | Defer to |
|---|---|
| Subscription billing thật | Phase 2.1 |
| Point purchase | Phase 2.2 |
| Reward redemption automation | Phase 2.2 |
| Creator payout engine | Phase 3 |
| Referral ledger thật | Phase 2.3 |
| Auth/login system | Phase 3 (prerequisite by Phase 2.1 subscription) |
| iOS/Android app | Phase 4 |
| Livestream room | Phase 5 |
| Sponsor dashboard | Phase 5 |
| Multi-creator bundles | Phase 5 |
| Event QR check-in | Phase 5 |

---

## TIMELINE THỰC TẾ

| Phase | Effort | Calendar (2 dev fulltime) | Block bởi |
|---|---|---|---|
| Phase 1 | 70–80h | **1–2 tuần** | (none — bắt tay ngay) |
| Phase 2 | 200–300h | **4–6 tuần** | pay.iai.one Club contract + Legal Counsel |
| Phase 3 | 150–200h | **3–4 tuần** | Creator KYC + signed agreement |
| Phase 4 | 400–500h | **8–12 tuần** | Mobile team + App Store |
| Phase 5 | 200–300h | **4–6 tuần** | Phase 1-4 done |

**Total web** (1-3+5): 620–880h ≈ **3–4 tháng với 2 dev fulltime**.

---

## LỆNH DUY NHẤT GIAO TEAM DEV

```
DSTS Club Phase 1-5 — Continuous execution plan

Repo: github.com/tranhatam-collab/duongsaotoasang-web
Branch base: main (Lane B VND LIVE, ready)

Bước 1 — Đọc (theo thứ tự):
  docs/00_DSTS_CLUB_MASTER_INDEX_2026.md
  docs/DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md
  docs/DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md
  docs/DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md
  docs/DSTS_CLUB_CREATOR_PAYOUT_AND_PARTNER_MODEL_2026.md
  docs/DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md
  docs/DSTS_CLUB_DATABASE_AND_API_SPEC_2026.md
  docs/DSTS_CLUB_DEV_ROADMAP_2026.md
  docs/DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md
  docs/DSTS_CLUB_FULL_DEV_PLAN_2026-05-19.md  ← CODE SKELETON CHI TIẾT

Bước 2 — Bắt tay Phase 1:
  git checkout main && git pull
  git checkout -b layer-3/club-phase1-foundation
  wrangler d1 execute cf-d1-dsts-content-prod --remote \
    --command "SELECT name FROM sqlite_master WHERE type='table' AND (name LIKE 'club_%' OR name LIKE 'creator%' OR name = 'reward_catalog')"
  # Expect: 6 tables (creators, creator_profiles, club_posts, club_talkshows, reward_catalog, club_waitlist)
  
  # Làm theo docs/DSTS_CLUB_FULL_DEV_PLAN_2026-05-19.md §6 (Sprint 1.1 → 1.6)
  # Code patterns: copy from functions/api/donate/*.js (idempotency, validation, errorJson, audit log)

Bước 3 — Báo cáo:
  Mỗi sprint slice done → paste output cho anh Tâm
  → Anh Tâm forward Claude audit
  → APPROVE → sprint next; REJECT → fix theo file:line

Bước 4 — Block:
  Phase 1: KHÔNG block gì
  Phase 2: chờ pay.iai.one Club contract + Legal Counsel sign-off
  Phase 3: chờ Auth system + Creator KYC
  Phase 4: chờ Mobile team
  Phase 5: chờ Phase 1-4 done

Câu hỏi business → hỏi anh Tâm
Câu hỏi technical → paste cho anh Tâm forward Claude
```

---

## END STATE

Khi Phase 5 done:
- 45 web routes (public/member/creator/admin)
- 38 D1 tables
- 25 API endpoints
- Mobile app iOS + Android (12 tabs, engagement-first)
- Livestream + check-in + multi-creator bundles + sponsor campaigns
- Legal compliance with 16 signed docs + 11 mandatory locks
- All QA gates integrated + passing
