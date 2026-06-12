# DSTS Club + PWA — Master Handoff Index 2026
**Project:** duongsaotoasang.com  
**Date:** 2026-06-07  
**Status:** Ready for dev implementation  
**Owner:** DSTS Tech Lead → AI Dev / Team Dev  
**Bundle:** DSTS Club Plan Bundle (8 files) + PWA Implementation Spec v1.1

---

## 1. Cách dùng bộ tài liệu này

### 1.1 Cho Founder / Product Owner
1. Đọc `00_DSTS_CLUB_MASTER_INDEX_2026.md` — tổng quan, founder decisions đã chốt
2. Đọc `01_DSTS_CLUB_CREATOR_FAN_MEMBERSHIP_MASTER_PLAN_2026.md` — chiến lược sản phẩm
3. Duyệt scope, giá, điểm, revenue split trước khi dev bắt đầu

### 1.2 Cho Tech Lead / Dev Team
1. Đọc `00_DSTS_CLUB_MASTER_INDEX_2026.md` — kiến trúc tổng thể
2. Đọc `04_DSTS_CLUB_WEB_PWA_MOBILE_BROWSER_APP_SPEC_2026.md` — PWA product spec
3. Đọc `DSTS_PWA_APP_DEV_HANDOFF_SPEC_2026_v1.1.md` — **implementation chi tiết frontend/PWA**
4. Đọc `06_DSTS_CLUB_DATA_MODEL_API_CONTRACT_2026.md` — schema, API, permission
5. Đọc `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md` — phase dev, tickets, DoD
6. Đọc `07_DSTS_CLUB_TERMS_POLICY_LEGAL_REQUIREMENTS_2026.md` — legal constraints

### 1.3 Cho Legal / Payment
1. Đọc `02_DSTS_CLUB_POINTS_WALLET_REFERRAL_REWARDS_SPEC_2026.md` — kinh tế điểm, legal
2. Đọc `03_DSTS_CLUB_REVENUE_SHARE_CREATOR_PAYOUT_SPEC_2026.md` — payout, tax
3. Đọc `07_DSTS_CLUB_TERMS_POLICY_LEGAL_REQUIREMENTS_2026.md` — terms, policy

### 1.4 Cho QA / Test
1. Đọc `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md` — QA checklist, smoke test
2. Đọc `DSTS_PWA_APP_DEV_HANDOFF_SPEC_2026_v1.1.md` §6 — Quality Gate, mobile test

---

## 2. File structure — nơi tìm file nào

### 2.1 Club Bundle (source of truth cho product/legal/economy)
```
/Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com/docs/DSTS_CLUB_CREATOR_FAN_MEMBERSHIP_APP_MASTER_PLAN_2026/
├── 00_DSTS_CLUB_MASTER_INDEX_2026.md
├── 01_DSTS_CLUB_CREATOR_FAN_MEMBERSHIP_MASTER_PLAN_2026.md
├── 02_DSTS_CLUB_POINTS_WALLET_REFERRAL_REWARDS_SPEC_2026.md
├── 03_DSTS_CLUB_REVENUE_SHARE_CREATOR_PAYOUT_SPEC_2026.md
├── 04_DSTS_CLUB_WEB_PWA_MOBILE_BROWSER_APP_SPEC_2026.md
├── 05_DSTS_CLUB_NATIVE_APP_IOS_ANDROID_ROADMAP_2026.md
├── 06_DSTS_CLUB_DATA_MODEL_API_CONTRACT_2026.md
├── 07_DSTS_CLUB_TERMS_POLICY_LEGAL_REQUIREMENTS_2026.md
├── 08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md
└── README_DSTS_CLUB_PLAN_BUNDLE.md
```

### 2.2 PWA Implementation Spec (chi tiết frontend)
```
/Users/tranhatam/Documents/Devnewproject/
├── DSTS_PWA_APP_DEV_HANDOFF_SPEC_2026_v1.1.md          ← FRONTEND/PWA IMPLEMENTATION
└── DSTS_PWA_APP_DEV_HANDOFF_SPEC_2026.md               ← v1.0 (deprecated, dùng v1.1)
```

### 2.3 Audit & Plans hiện có (context)
```
/Users/tranhatam/Documents/Devnewproject/duongsaotoasang.com/docs/
├── DSTS_PWA_MOBILE_PLAN_2026.md                        ← PWA plan cũ (đã tích hợp vào v1.1)
├── AUDIT_DSTS_2026-06-07.md                            ← Audit DSTS hiện tại
└── DSTS_CLUB_*.md                                      ← Các file Club khác (backup)
```

---

## 3. Mapping: Product Spec → Implementation Spec

| Product Spec (Club bundle) | Implementation Spec (v1.1) | Notes |
|----------------------------|---------------------------|-------|
| `04_..._WEB_PWA_MOBILE_BROWSER_APP_SPEC_2026.md` §4 Route kiến trúc | v1.1 §2.4 Router (path-based) | Đổi sang `/app/home`, `/app/club`... |
| `04_...` §5 Bottom tabs MVP | v1.1 §2.1 Bottom Navigation (Club-first) | Home/Club/Talk Shows/Rewards/Profile |
| `04_...` §8 Service worker strategy | v1.1 §3.3 Service Worker (versioned + safe cache) | Thêm PRIVATE_API blacklist, versioned cache |
| `04_...` §14 Footer duplication prevention | v1.1 §1.6 Footer trong app view | Ẩn hoàn toàn footer trong /app/ |
| `08_...` §3 Phase 1 Issue 04 — Basic account app shell | v1.1 §1 PHASE 1 — Mobile App Shell | Chi tiết CSS, header, hamburger, bottom nav |
| `08_...` §6 Phase 4 — PWA polish | v1.1 §3 PHASE 3 — PWA Foundation | Manifest, SW, icons, offline, install |
| `08_...` §8 QA checklist | v1.1 §6 PHASE 6 — Quality Gate | Lighthouse, mobile test, smoke test |

---

## 4. Founder decisions đã chốt (từ `00_DSTS_CLUB_MASTER_INDEX_2026.md`)

1. Tên chính: **DSTS Club**
2. Tên chiến lược: **Club of Influence, Wisdom, Contribution and Access**
3. 3 gói: **Member / Circle / Inner Circle**
4. Giá launch: **99K / 299K / 990K VND** hoặc **5 / 15 / 49 USD**
5. Star Points là điểm nội bộ, **không quy đổi tiền mặt** trong phase đầu
6. 1 điểm = 1.000 VND giá mua cơ sở
7. Creator cũng có Creator Contribution Points
8. Referral points: pending → earned → clawed_back
9. Reward shop: 3 tầng (digital / event / experience)
10. Direct Experience: apply-only, không public bán đại trà
11. Membership pool: 50 / 30 / 20
12. Talk show split: 60 / 40
13. Premium experience split: 70 / 30
14. Tất cả split tính trên **net revenue** sau phí payment, refund, chargeback, tax
15. Mobile app phase đầu là **PWA/mobile-browser app** sau login
16. Native app phase 1: engagement-first, chưa ưu tiên checkout trong app

---

## 5. Không được làm trong phase đầu (từ `00_DSTS_CLUB_MASTER_INDEX_2026.md`)

- Không gọi Star Points là tiền
- Không cho cash-out điểm
- Không gọi điểm là token, coin, crypto, chứng khoán, tài sản đầu tư
- Không public claim "kiếm tiền dễ dàng"
- Không cam kết creator có doanh thu
- Không cam kết fan chắc chắn gặp riêng nếu gói không ghi rõ
- Không dùng referral như mô hình đa cấp tài chính
- Không mở in-app checkout iOS/Android trước khi legal/app-store review xong
- Không dùng nội dung paid mà không có content license policy
- Không mở chức năng DM riêng fan ↔ creator nếu chưa có moderation

---

## 6. Kiến trúc tổng thể (từ `00_DSTS_CLUB_MASTER_INDEX_2026.md`)

```
duongsaotoasang.com
  ├─ /club                          ← Public Club page
  ├─ /club/creators                 ← Public creator list
  ├─ /club/{creator}                ← Public creator profile
  ├─ /club/{creator}/talkshows      ← Public talk show calendar
  ├─ /club/{creator}/membership     ← Public membership packages
  ├─ /club/{creator}/rewards        ← Public reward catalog
  ├─ /account                       ← Account settings (public)
  ├─ /account/wallet                 ← Wallet page (public)
  ├─ /account/referrals             ← Referral center (public)
  ├─ /account/rewards               ← Rewards catalog (public)
  ├─ /creator/dashboard             ← Creator dashboard (protected)
  ├─ /admin                         ← Admin panel (protected)
  └─ /app                           ← Mobile web app shell (protected, PWA)
      ├─ /app/home                  ← Feed, updates
      ├─ /app/club                  ← Club list, joined clubs
      ├─ /app/talkshows             ← Talk show calendar
      ├─ /app/rewards               ← Reward catalog
      ├─ /app/profile               ← Account, membership, wallet, referrals
      ├─ /app/wallet                ← Star Points wallet
      ├─ /app/referrals             ← Referral center
      ├─ /app/tickets               ← Talk show/event tickets
      ├─ /app/library               → Paid content library
      └─ /app/support               → Support, FAQ
```

---

## 7. Gate trước khi dev (từ `00_DSTS_CLUB_MASTER_INDEX_2026.md`)

- [ ] Founder duyệt giá, tên, điểm, revenue split
- [ ] Legal duyệt Points & Rewards Policy
- [ ] Payment owner duyệt payment lane
- [ ] Product owner duyệt scope PWA
- [ ] Tech lead duyệt schema/API
- [ ] No code claim "done" without smoke test, screenshots, route evidence

---

## 8. Điểm chất lượng — v1.1 PWA Spec

| Metric | v1.0 | v1.1 | Target |
|--------|------|------|--------|
| Route defaults | ❌ thiếu | ✅ `/app` → `/app/index.html` 200 | 100% |
| Auth safety | ⚠️ localStorage | ✅ HttpOnly cookie note | 100% |
| SW cache safety | ⚠️ cache all API | ✅ PRIVATE_API blacklist | 100% |
| Logout cache clear | ❌ thiếu | ✅ message SW clear user cache | 100% |
| Bottom nav | ⚠️ generic | ✅ Club-first 5 tabs | 100% |
| Wallet screens | ❌ thiếu | ✅ Profile + hamburger access | 100% |
| iOS install | ❌ thiếu | ✅ manual guide | 100% |
| Security headers | ❌ thiếu | ✅ CSP, X-Frame, Referrer | 100% |
| Production Safety | ❌ thiếu | ✅ Addendum §12 | 100% |
| **Total** | **85/100** | **96/100** | **100%** (sau auth thật + QA) |

---

## 9. Phase dev — tóm tắt (từ `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md`)

| Phase | Mục tiêu | DoD |
|-------|---------|-----|
| **Phase 0** | Planning lock | Founder/legal/payment/product/tech lead duyệt |
| **Phase 1** | Web Club MVP | Routes, membership UI, creator profile, app shell, wallet, referral, reward catalog, talk show calendar |
| **Phase 2** | Payment + automation | Subscription billing, point purchase, reward redemption, referral tracking, payment confirmation, webhook, email |
| **Phase 3** | Creator dashboard | Creator routes, posts, talk show request, revenue estimate, payout request, Creator Points |
| **Phase 4** | PWA polish | Manifest, SW, offline, icons, Add to Home Screen, mobile QA |
| **Phase 5** | Native app roadmap start | KHÔNG bắt đầu cho đến PWA stable, API stable, store policy reviewed |

---

## 10. Smoke test URLs (từ `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md`)

```bash
urls=(
"https://duongsaotoasang.com/club"
"https://duongsaotoasang.com/club/creators"
"https://duongsaotoasang.com/app"
"https://duongsaotoasang.com/app/home"
"https://duongsaotoasang.com/app/club"
"https://duongsaotoasang.com/app/wallet"
"https://duongsaotoasang.com/app/rewards"
"https://duongsaotoasang.com/rewards"
"https://duongsaotoasang.com/points"
"https://duongsaotoasang.com/offline.html"
"https://duongsaotoasang.com/manifest.webmanifest"
"https://duongsaotoasang.com/service-worker.js"
)
for url in "${urls[@]}"; do echo "$url"; curl -I -L "$url" | head -n 1; done
```

---

## 11. Suggested branches (từ `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md`)

- `feature/dsts-club-public-mvp`
- `feature/dsts-club-app-shell`
- `feature/dsts-club-wallet-points`
- `feature/dsts-club-referrals-rewards`
- `feature/dsts-club-creator-dashboard`
- `feature/dsts-club-pwa`

---

## 12. Suggested commits (từ `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md`)

```
feat: add DSTS Club public routes and membership packages
feat: add mobile web app shell for DSTS Club
feat: add Star Points wallet and rewards catalog
feat: add referral center and anti-abuse states
feat: add creator dashboard foundation
feat: add PWA manifest service worker and offline shell
docs: add DSTS Club legal and product specifications
```

---

## 13. Conflict resolution

Khi có xung đột giữa các file:

| Priority | Source of truth | Scope |
|----------|-----------------|-------|
| 1 | `00_DSTS_CLUB_MASTER_INDEX_2026.md` | Founder decisions, architecture, gate |
| 2 | `01_DSTS_CLUB_CREATOR_FAN_MEMBERSHIP_MASTER_PLAN_2026.md` | Product strategy, scope |
| 3 | `02_DSTS_CLUB_POINTS_WALLET_REFERRAL_REWARDS_SPEC_2026.md` | Economy, points, referral legal |
| 4 | `03_DSTS_CLUB_REVENUE_SHARE_CREATOR_PAYOUT_SPEC_2026.md` | Revenue split, payout, tax |
| 5 | `04_DSTS_CLUB_WEB_PWA_MOBILE_BROWSER_APP_SPEC_2026.md` | PWA product spec |
| 6 | `06_DSTS_CLUB_DATA_MODEL_API_CONTRACT_2026.md` | Schema, API, permission |
| 7 | `07_DSTS_CLUB_TERMS_POLICY_LEGAL_REQUIREMENTS_2026.md` | Terms, policy, legal |
| 8 | `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md` | Phase dev, tickets, DoD, QA |
| 9 | `DSTS_PWA_APP_DEV_HANDOFF_SPEC_2026_v1.1.md` | Frontend/PWA implementation chi tiết |

**Ví dụ:** Nếu `04_...` nói "bottom nav 5 tab" nhưng `v1.1` nói "bottom nav 5 tab Club-first" → `v1.1` thắng về implementation chi tiết, nhưng cấu trúc tổng thể vẫn theo `04_...`.

---

## 14. Trạng thái hiện tại

| Item | Trạng thái | Note |
|------|-----------|------|
| Club bundle (8 files) | ✅ Đã chốt | Founder decisions đã lock |
| PWA v1.1 spec | ✅ Đã hoàn thiện | 96/100, ready for dev |
| Auth backend | ⚠️ Chưa có | MVP dùng localStorage giả (v1.1 §4.1) |
| Payment lane | ⚠️ Chưa lock | Sử dụng pay.iai.one hiện tại |
| Custom domain | ⚠️ Chưa map | duongsaotoasang.com → Cloudflare Pages |
| Native app | ❌ Chưa bắt đầu | Phase 5, PWA stable trước |

---

## 15. Việc tiếp theo (Action items)

### 15.1 Trước khi dev bắt đầu
- [ ] Founder duyệt `00_DSTS_CLUB_MASTER_INDEX_2026.md`
- [ ] Legal duyệt `02_DSTS_CLUB_POINTS_WALLET_REFERRAL_REWARDS_SPEC_2026.md`
- [ ] Payment owner duyệt payment lane (pay.iai.one)
- [ ] Tech lead duyệt `06_DSTS_CLUB_DATA_MODEL_API_CONTRACT_2026.md`
- [ ] Product owner duyệt `DSTS_PWA_APP_DEV_HANDOFF_SPEC_2026_v1.1.md`

### 15.2 Sau khi duyệt
- [ ] Chuyển `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md` thành GitHub Issues
- [ ] Tạo branch `feature/dsts-club-public-mvp`
- [ ] Bắt đầu Phase 1 — Web Club MVP

### 15.3 Sau Phase 1
- [ ] Smoke test URLs (§10)
- [ ] Mobile QA (320/360/390/414/430)
- [ ] Founder approval screenshots
- [ ] Merge main → deploy preview

### 15.4 Sau Phase 4 (PWA)
- [ ] Lighthouse PWA ≥ 90
- [ ] Test thật iPhone Safari + Android Chrome
- [ ] Custom domain mapping
- [ ] Deploy production

---

## 16. Contact & Escalation

| Role | Contact |
|------|---------|
| Tech Lead | tranhatam |
| Product Owner | (TBD) |
| Legal | (TBD) |
| Payment Owner | (TBD) |
| QA | (TBD) |

---

**END OF MASTER HANDOFF INDEX**
