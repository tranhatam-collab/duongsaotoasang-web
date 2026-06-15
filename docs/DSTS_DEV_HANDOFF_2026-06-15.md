# DSTS — DEV HANDOFF: Launch Readiness Plan

> **Date:** 2026-06-15
> **Status:** LOCKED — Cầm là làm, không còn vòng sửa
> **Branch làm việc:** `OMCODE/dsts-launch-2026-06-15` (không làm trên `main` dirty)
> **QA Gate:** `node scripts/launch-readiness-qa.mjs` phải PASS trước merge
> **Pre-push guard:** `.git/hooks/pre-push` chặn mọi push — Founder bypass: `ALLOW_PUSH=1 git push ...`

---

## I. TỔNG QUAN — 3 TRACK

| Track | Scope | Status | Blockers | Dev cần |
|---|---|---|---|---|
| **A** | Public UI, bilingual, SEO, metadata | 🟢 Ready to implement | None | Frontend |
| **B** | Auth (register/login/session) | 🔴 BLOCKED | P0-SEC-1/2/3/5 + D1 capacity | Backend + Frontend |
| **C** | Real payment (donation/checkout) | 🔴 BLOCKED | P0-SEC-4/5 + Founder credential | Backend + DevOps |

> **Rule:** Track B và C KHÔNG được công bố "live" cho đến khi tất cả gate PASS.

---

## II. KIẾN TRÚC HIỆN TẠI (Đã verify bằng lệnh)

```
Repo: /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
Build: Static HTML + Cloudflare Pages Functions (không có build step)
Functions: 49 files trong functions/
HTML: 107 files, 10 cặp VI↔EN
Auth: register.js (26 dòng), login.js (24 dòng), auth.js (199 dòng)
Webhooks: payment.js (20 dòng), points.js (48), clubs/subscription.js (58), donate.js (122)
DB: wrangler.toml KHÔNG có d1_databases binding → "DB not bound" ở runtime
```

---

## III. TRACK A — PUBLIC UI / BILINGUAL / SEO

### Scope
10 cặp route VI↔EN, shared header, OG metadata, hreflang, cache TTL.

### Task List (thứ tự thực thi)

| # | Task | Files | Verify command |
|---|---|---|---|
| A1 | **Sửa `getLang()` nhận `/en/` pathname** | `assets/app-v5.js` | `node scripts/launch-readiness-qa.mjs` |
| A2 | **Sửa `withLang()` map VI↔`/en/` thay vì `?lang=en`** | `assets/app-v5.js` | `node scripts/launch-readiness-qa.mjs` |
| A3 | **Xóa dead code `assets/i18n.js`** | `assets/i18n.js` | `grep -r "i18n.js" *.html` → 0 match |
| A4 | **Sửa `_redirects`: `/map /map.html` 301→200** | `_redirects` | `node scripts/launch-readiness-qa.mjs` |
| A5 | **Sửa `verify/index.html`: xóa 1 hreflang="en" trùng** | `verify/index.html` | `node scripts/launch-readiness-qa.mjs` |
| A6 | **Mount shared header + app-v5.js vào 10 trang `/en/`** | `en/*.html` | `node scripts/launch-readiness-qa.mjs` |
| A7 | **Thêm OG/Twitter metadata cho 10 trang `/en/` + `map.html`** | `en/*.html`, `map.html` | `node scripts/social-metadata-qa.mjs` |
| A8 | **Thêm self EN hreflang + x-default cho 10 cặp** | `index.html`, `about.html`, ... + `en/*.html` | `node scripts/seo-route-qa.mjs` |
| A9 | **Xử lý GA4/Sentry placeholder** | `index.html` | Không còn `G-XXXXXXXXXX` hoặc `xxxx@o123456` |
| A10 | **Thêm header cho 5 trang thiếu** | `refund.html`, `map.html`, `mentor-network.html`, `dream-nurture.html`, `legacy/index.html` | Visual check |

### Definition of Done (Track A)
- [ ] `node scripts/launch-readiness-qa.mjs` PASS (không còn lỗi Track A)
- [ ] `node scripts/seo-route-qa.mjs` PASS
- [ ] `node scripts/social-metadata-qa.mjs` PASS
- [ ] Mobile hamburger hoạt động trên cả VI và EN
- [ ] Language switcher VI→EN→VI giữ đúng trang, không 404

---

## IV. TRACK B — AUTH (REGISTER / LOGIN / SESSION)

### ⚠️ BLOCKER: P0-SEC-1/2/3/5

| Blocker | Bằng chứng | Fix |
|---|---|---|
| P0-SEC-1: Password plaintext | `register.js:18-19` bind `password` thô vào `password_hash` | PBKDF2-SHA-256 + salt |
| P0-SEC-2: Cookie = user ID | `login.js:18` `dsts_session=${row.id}` | Opaque session token, hash server-side |
| P0-SEC-3: Privilege escalation | `register.js:19` nhận `role` từ client | Ép `role='member'`, bỏ qua client |
| P0-SEC-5: No DB binding | `wrangler.toml` không có `[[d1_databases]]` | Free D1 slot + bind |

### Task List

| # | Task | Files | Verify |
|---|---|---|---|
| B1 | **Tạo migration `0022_auth_sessions.sql`** | `migrations/0022_auth_sessions.sql` | Schema có `password_salt`, `password_iterations`, `sessions` table |
| B2 | **Implement PBKDF2 helper trong `functions/_lib/auth.js`** | `functions/_lib/auth.js` | `node --check functions/_lib/auth.js` |
| B3 | **Rewrite `register.js`: hash password + ép role='member'** | `functions/api/auth/register.js` | `node scripts/auth-behavior-qa.mjs` |
| B4 | **Rewrite `login.js`: compare hash + opaque session** | `functions/api/auth/login.js` | `node scripts/auth-behavior-qa.mjs` |
| B5 | **Tạo `me.js`: read session từ cookie** | `functions/api/auth/me.js` | `node --check functions/api/auth/me.js` |
| B6 | **Tạo `logout.js`: revoke session** | `functions/api/auth/logout.js` | `node --check functions/api/auth/logout.js` |
| B7 | **Wire UI register → `/api/auth/register`** | `register/index.html`, `en/register.html` | Browser test: register → 200 |
| B8 | **Tạo `login/index.html` + `en/login.html`** | `login/index.html`, `en/login.html` | Browser test: login → session cookie |
| B9 | **Xóa fake localStorage auth trong `app/app.js`** | `app/app.js` | Không còn `localStorage.getItem('dsts_session')` |
| B10 | **D1 binding: free slot + bind + migrate** | `wrangler.toml` + Cloudflare Dashboard | `wrangler pages deploy` không lỗi DB |

### Definition of Done (Track B)
- [ ] `node scripts/auth-behavior-qa.mjs` PASS
- [ ] Registration không lưu raw password
- [ ] Login tạo opaque session cookie (HttpOnly, Secure, SameSite=Lax)
- [ ] Client không thể tự assign role admin
- [ ] `/api/auth/me` đọc session từ cookie
- [ ] `/api/auth/logout` revoke session
- [ ] Rate limiting + generic errors
- [ ] Browser test: register, login, me, logout trên desktop + mobile

---

## V. TRACK C — REAL PAYMENT

### ⚠️ BLOCKER: P0-SEC-4/5 + Founder Credential

| Blocker | Bằng chứng | Fix |
|---|---|---|
| P0-SEC-4: Webhook không ký | `webhooks/payment.js` (20 dòng) UPDATE status từ POST bất kỳ | Fail-closed HMAC + replay guard + unknown-id guard |
| P0-SEC-5: No DB binding | `wrangler.toml` không có D1 | Free slot + bind |
| Founder credential | `PAY_IAI_ONE_API_KEY` chưa verify | Founder cung cấp + test 1 giao dịch |
| HMAC registration | Secret chưa register ở cả 2 đầu | Founder/DevOps setup |

### Task List

| # | Task | Files | Verify |
|---|---|---|---|
| C1 | **Rewrite `webhooks/payment.js`: fail-closed HMAC** | `functions/webhooks/payment.js` | `node --check functions/webhooks/payment.js` |
| C2 | **Chống replay: event ID dedup** | `functions/webhooks/payment.js` | QA script |
| C3 | **Unknown-payment guard: không update nếu ID không tồn tại** | `functions/webhooks/payment.js` | QA script |
| C4 | **Đồng bộ 3 webhook khác về fail-closed** | `functions/api/points/webhook.js`, `clubs/subscription/webhook.js`, `donate/webhook.js` | `node --check` cả 3 |
| C5 | **D1 binding + payment migrations** | `wrangler.toml` | Deploy thành công |
| C6 | **Verify production API key với pay.iai.one** | Founder cung cấp | curl test 200 |
| C7 | **Register HMAC secret ở cả 2 đầu** | Founder/DevOps | Webhook test với signature |
| C8 | **1 giao dịch thật được ủy quyền** | Founder approve | Receipt + audit proof |
| C9 | **Mở donate gate: xóa "TẠM ĐÓNG"** | `donate.html` | Browser test flow hoàn chỉnh |

### Definition of Done (Track C)
- [ ] `node scripts/launch-readiness-qa.mjs` PASS (không còn lỗi payment)
- [ ] Webhook reject khi thiếu HMAC secret
- [ ] Webhook reject khi signature sai
- [ ] Webhook reject khi payment ID không tồn tại
- [ ] Webhook reject khi event replay
- [ ] 1 giao dịch thật hoàn thành → receipt + audit log
- [ ] Browser test: checkout → payment → webhook → receipt

---

## VI. INFRASTRUCTURE (DevOps / Founder)

| # | Task | Owner | Verify |
|---|---|---|---|
| I1 | **Free 1 D1 database slot** (account đạt giới hạn 10) | Founder/DevOps | `wrangler d1 list` → < 10 |
| I2 | **Tạo D1 database `dsts-prod`** | Founder/DevOps | `wrangler d1 create dsts-prod` |
| I3 | **Bind D1 vào Pages project** | Founder/DevOps | `wrangler.toml` có `[[d1_databases]]` |
| I4 | **Run migrations `0013` + `0022`** | Dev | `wrangler d1 migrations apply` |
| I5 | **Fix cache TTL: 14400s → 300s** | Founder/DevOps | Zone rule + purge cache |
| I6 | **GA4 Measurement ID (optional)** | Founder | Có ID thật hoặc gỡ block |
| I7 | **Sentry DSN (optional)** | Founder | Có DSN thật hoặc gỡ block |

---

## VII. WORKFLOW GIT

```bash
# 1. Tạo worktree sạch (KHÔNG làm trên main dirty)
cd /Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com
git worktree add /tmp/dsts-launch-20260615 -b OMCODE/dsts-launch-2026-06-15 ae7ed68
cd /tmp/dsts-launch-20260615

# 2. Làm từng task, commit nhỏ
# ... edit files ...
git add -A
git commit -m "A1: fix getLang to recognize /en/ paths"

# 3. Test sau mỗi task
node scripts/launch-readiness-qa.mjs

# 4. Khi xong toàn bộ track, push (cần ALLOW_PUSH=1 vì pre-push hook)
ALLOW_PUSH=1 git push origin OMCODE/dsts-launch-2026-06-15

# 5. Founder review + merge về main
```

---

## VIII. QA COMMANDS (Chạy sau mỗi task)

```bash
# Gate chính
node scripts/launch-readiness-qa.mjs

# Gate phụ
node scripts/sprint-0-release-gate.mjs
node scripts/seo-route-qa.mjs
node scripts/social-metadata-qa.mjs
node scripts/html-structure-qa.mjs
node scripts/accessibility-qa.mjs
node scripts/link-qa.mjs
node scripts/static-page-depth-qa.mjs

# Auth (sau khi implement Track B)
node scripts/auth-behavior-qa.mjs

# Syntax check
node --check functions/api/auth/register.js
node --check functions/api/auth/login.js
node --check functions/api/auth/me.js
node --check functions/api/auth/logout.js
node --check functions/_lib/auth.js
node --check functions/webhooks/payment.js
```

---

## IX. FILE REFERENCES CHÍNH XÁC

| File | Lines | Nội dung chính |
|---|---|---|
| `assets/app-v5.js` | ~150 | getLang(), withLang(), header render |
| `_redirects` | ~20 | Route rules |
| `functions/api/auth/register.js` | 26 | Đăng ký (cần rewrite hoàn toàn) |
| `functions/api/auth/login.js` | 24 | Đăng nhập (cần rewrite hoàn toàn) |
| `functions/_lib/auth.js` | 199 | HMAC verify, JWT decode, KHÔNG có password hash |
| `functions/webhooks/payment.js` | 20 | Webhook không ký (cần rewrite hoàn toàn) |
| `functions/api/donate/webhook.js` | 122 | Có verifyHmac nhưng fail-open |
| `wrangler.toml` | ~30 | KHÔNG có d1_databases |
| `app/app.js` | ~250 | Fake localStorage auth |
| `migrations/0013_ecosystem_layers.sql` | ~380 | Schema 6 Layer đã có |

---

## X. NON-NEGOTIABLE GATES

Không merge về main nếu chưa PASS:

- [ ] `node scripts/launch-readiness-qa.mjs` PASS
- [ ] Passwords are salted and hashed; no plaintext reaches D1
- [ ] Sessions are opaque and server-side; no auth token in localStorage
- [ ] All payment webhooks fail closed when HMAC missing
- [ ] Unknown payment IDs create no state change
- [ ] D1 binding and migrations verified
- [ ] Mobile/desktop browser evidence exists for VI, EN, register, login

---

**Bàn giao này dựa trên lệnh thật chạy 2026-06-15. Không dựa trên báo cáo cũ. Mọi claim đều có bằng chứng trong repo.**
