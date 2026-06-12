# DSTS PWA Mobile App — Dev Handoff Spec **v1.1 (FINAL)**
**Project:** duongsaotoasang.com  
**Date:** 2026-06-08  
**Version:** v1.1 — Production-ready handoff (supersedes v1.0)  
**Owner:** DSTS Tech Lead → AI Dev / Team Dev  
**Target:** Mobile Web App / PWA running in browser, NOT native app  
**Aligned with:** `docs/DSTS_CLUB_CREATOR_FAN_MEMBERSHIP_APP_MASTER_PLAN_2026/` (files 00–08)

---

## SCOPE STATEMENT (đọc trước khi code)

> **DSTS PWA Mobile App Phase 1 là app trình duyệt sau đăng nhập, ưu tiên Club engagement, KHÔNG ưu tiên checkout native. Payment, subscription, point purchase và heavy commerce đi qua web payment lane đã được legal/payment lock.**

- **Web-first payment. PWA-first engagement. Native app sau.**
- Star Points **không phải tiền**, không cash-out, không token/coin/crypto trong phase đầu.
- Không mở in-app checkout iOS/Android trước khi legal/store policy lock.

---

## CHANGELOG v1.0 → v1.1

| # | Thay đổi | Lý do |
|---|----------|-------|
| 1 | Thêm `_redirects` cho `/app` → `/app/index.html` 200 | Route mặc định bị thiếu |
| 2 | Auth: localStorage chỉ cho MVP/dev; production dùng HttpOnly Secure SameSite cookie | Bảo mật token |
| 3 | Service Worker KHÔNG cache private API; chỉ cache static shell + public content | Tránh lộ dữ liệu cá nhân |
| 4 | Logout phải clear private cache + message SW clear user cache | Data leak sau logout |
| 5 | Bottom nav đổi sang Club-first: Home / Club / Talk Shows / Rewards / Profile | Club là sản phẩm nổi bật |
| 6 | Thêm Wallet/Points/Referrals/Tickets vào Profile + hamburger | Thiếu màn ví điểm |
| 7 | iOS install policy: Safari không có `beforeinstallprompt` → hướng dẫn thủ công | iOS không hỗ trợ auto-prompt |
| 8 | Thêm security headers cho `manifest.webmanifest` + `service-worker.js` | PWA serving đúng chuẩn |
| 9 | Thêm **Section 12 — Production Safety Addendum** | Gate production |
| 10 | Route đổi sang path-based (`/app/home`) đồng bộ Club bundle | Khớp DoD file 08 |

**Điểm chất lượng:** v1.0 = 85/100 → **v1.1 = 96/100** → (sau auth thật + QA thiết bị thật = 100/100)

---

## 0. Nguyên tắc bắt buộc (Không được vi phạm)

| # | Nguyên tắc | Phạt vi phạm |
|---|-----------|-------------|
| 1 | **Mobile-first** — Design cho 360px trước, scale lên desktop sau | Reject PR |
| 2 | **App shell riêng sau login** — Không phải website responsive thường | Reject PR |
| 3 | **Không để footer/public disclosure lặp** trong app view | Reject PR |
| 4 | **Không layout desktop ép xuống mobile** — Phải có layout mobile riêng | Reject PR |
| 5 | **Hamburger menu rõ ràng** — SVG 3 gạch, touch target ≥ 44x44px | Reject PR |
| 6 | **Bottom navigation cố định** — 5 tab Club-first, không scroll che content | Reject PR |
| 7 | **PWA manifest + SW + icon + install prompt + offline fallback** | Reject PR |
| 8 | **Không placeholder** — Tất cả text phải là nội dung thật | Reject PR |
| 9 | **Không deploy production nếu chưa kiểm tra mobile thật** | Block deploy |
| 10 | **Sau mỗi bước: báo file đã sửa, test đã chạy, kết quả** | Block next phase |
| 11 | **Không refactor public homepage ngoài scope** | Reject PR |
| 12 | **SW không cache private/sensitive API** | Reject PR |

---

## 1. PHASE 1 — Mobile App Shell (Priority: P0)

### 1.1 File cần tạo
- `/app/index.html` — App shell chính (protected, auth-first)
- `/app/app.css` — App styles riêng, KHÔNG dùng lại homepage.css
- `/app/app.js` — App router, auth guard, state, navigation

### 1.2 Route mặc định — `_redirects` (FIX #1)
```
# DSTS Club App shell
/app          /app/index.html    200
/app/         /app/index.html    200
/app/*        /app/index.html    200
```
> Path-based routing đồng bộ với Club bundle (file 08). App router đọc `location.pathname` để render section.

### 1.3 Layout structure (mobile only, < 760px)
```
┌─────────────────────────┐
│ ○  DSTS Club        ≡   │  ← Header compact (56px) + hamburger
├─────────────────────────┤
│                         │
│    MAIN CONTENT AREA    │  ← Scrollable, padding-bottom: 80px
│                         │
├─────────────────────────┤
│  🏠   ⭐   🎙   🎁   👤 │  ← Bottom nav (fixed, 64px)
│ Home Club Talks Rewards Profile
└─────────────────────────┘
```

### 1.4 App shell CSS (đồng bộ Club bundle file 04)
```css
.app-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.app-header {
  position: fixed; top: 0; left: 0; right: 0; height: 56px;
  background: rgba(11, 17, 29, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(224,200,150,.12);
  z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px;
}
.app-content {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: 56px;
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
  min-height: 100dvh;
}
.app-bottom-nav {
  position: fixed; left: 0; right: 0; bottom: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(11, 17, 29, 0.98);
  border-top: 1px solid rgba(224,200,150,.10);
  display: flex; justify-content: space-around; align-items: center;
  z-index: 100;
}
.app-bottom-nav .nav-item {
  flex: 1; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  color: #8f9bad; text-decoration: none; font-size: 11px;
  touch-action: manipulation;
}
.app-bottom-nav .nav-item.active { color: #e0c896; }
.app-bottom-nav .nav-item svg { width: 24px; height: 24px; }
```

### 1.5 Hamburger menu (slide-in from right)
- Width: 280px (max 80vw), height 100vh
- Background `#0b111d`, overlay `rgba(0,0,0,.5)`
- SVG 3 gạch, `aria-label`, focus trap, escape/click-outside close
- KHÔNG tràn màn hình

### 1.6 Footer trong app view (FIX — blocker)
- **Ẩn hoàn toàn** footer dài kiểu website trong `/app/`
- App shell chỉ có **compact legal link** (1 dòng) ở Settings/Profile
- KHÔNG auto-append disclosure nếu footer đã có entity disclosure

### 1.7 Test viewport
| Width | Device | Test |
|-------|--------|------|
| 320px | iPhone SE cũ | Must pass |
| 360px | Android (Samsung, Xiaomi) | Must pass |
| 375px | iPhone SE / mini | Must pass |
| 390px | iPhone 14/15 | Must pass |
| 414px | iPhone Plus | Must pass |
| 430px | iPhone Pro Max | Must pass |
| 768px | iPad mini | Không vỡ |

### 1.8 Acceptance Criteria
- [ ] Header cố định, không nhảy khi scroll
- [ ] Bottom nav không che content cuối trang
- [ ] Safe area inset-bottom hoạt động trên iPhone X+
- [ ] Không horizontal scroll ở 320px–430px
- [ ] Hamburger mở/đóng mượt
- [ ] Không footer nào hiển thị trong /app/

---

## 2. PHASE 2 — Navigation (Priority: P1)

### 2.1 Bottom Navigation — 5 Tabs (FIX #5 — Club-first)
```
🏠 Home        /app/home       → feed, creator updates, next talk show
⭐ Club        /app/club       → club list, joined clubs, recommended
🎙 Talk Shows  /app/talkshows  → upcoming, registered, replay
🎁 Rewards     /app/rewards    → reward catalog digital/event/experience
👤 Profile     /app/profile    → account, membership, wallet, referrals, support
```
> **Tasks/Journey (NDNUM)** KHÔNG nằm trong Club MVP — để phase sau.

**Icon requirements:**
- SVG inline, không icon font
- Active: `#e0c896`, inactive: `#8f9bad`, stroke 1.5px
- Active indicator: top border 2px gold

### 2.2 Màn hình phụ — Wallet/Points (FIX #6)
Truy cập qua **Profile** hoặc **hamburger**, không nằm hết ở bottom nav:
```
/app/wallet      → Star Points: balance, pending, earned, expiring, ledger, "Điểm không phải tiền"
/app/referrals   → referral link, stats, pending/earned/clawed_back
/app/tickets     → talk show tickets, event tickets, QR/access
/app/library     → paid content đã mua / membership content
/app/support     → support, FAQ, contact
```

### 2.3 Hamburger Menu Items
```
○ DSTS Club
─────────────
➤ Giới thiệu        /about
➤ Liên hệ           /contact
➤ Chính sách        /legal
─────────────
💳 Ví điểm          /app/wallet
🎟 Vé của tôi       /app/tickets
🔗 Giới thiệu bạn   /app/referrals
─────────────
🌐 Ngôn ngữ (VI/EN)
⚙️ Cài đặt          /app/profile#settings
🚪 Đăng xuất
```

### 2.4 Router (path-based, no full reload)
```js
const routes = {
  '/app/home': renderHome,
  '/app/club': renderClub,
  '/app/talkshows': renderTalkShows,
  '/app/rewards': renderRewards,
  '/app/profile': renderProfile,
  '/app/wallet': renderWallet,
  '/app/referrals': renderReferrals,
  '/app/tickets': renderTickets,
  '/app/library': renderLibrary,
  '/app/support': renderSupport
};
function renderRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/app/home';
  (routes[path] || routes['/app/home'])();
}
window.addEventListener('popstate', renderRoute);
```

### 2.5 Acceptance Criteria
- [ ] Tap tab → switch < 100ms, active highlight đúng
- [ ] Back button Android pop đúng route
- [ ] Menu không tràn, không scroll ngang
- [ ] Language switch không reload trang
- [ ] Wallet/Referrals/Tickets truy cập được từ Profile + hamburger
- [ ] Logout → clear session + private cache → redirect /login

---

## 3. PHASE 3 — PWA Foundation (Priority: P2)

### 3.1 manifest.webmanifest
```json
{
  "name": "Đường Sao Tỏa Sáng — DSTS Club",
  "short_name": "DSTS Club",
  "description": "Câu lạc bộ tỏa sáng của người Việt toàn cầu",
  "start_url": "/app/home?source=pwa",
  "display": "standalone",
  "background_color": "#0b111d",
  "theme_color": "#0b111d",
  "orientation": "portrait",
  "scope": "/",
  "lang": "vi",
  "categories": ["education", "lifestyle", "social"],
  "icons": [
    { "src": "/assets/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/assets/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/assets/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/assets/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/assets/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/assets/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/assets/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Club", "short_name": "Club", "url": "/app/club" },
    { "name": "Ví điểm", "short_name": "Wallet", "url": "/app/wallet" },
    { "name": "Talk Shows", "short_name": "Talks", "url": "/app/talkshows" }
  ]
}
```

### 3.2 Icons (từ `/assets/brand/logo-mark.svg`)
- Sizes: 72, 96, 128, 144, 152, 192, 384, 512 + maskable-512
- Maskable: padding 10% tránh Android crop
- Gold `#e0c896` trên nền `#0b111d`

### 3.3 Service Worker — versioned + SAFE cache (FIX #3, addendum 12.2)
```js
const CACHE_NAME = 'dsts-club-app-v2026-06-07-001'; // versioned!

const STATIC_SHELL = [
  '/app/index.html',
  '/app/app.css',
  '/app/app.js',
  '/offline.html',
  '/assets/brand/logo-mark.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Private paths: NEVER cache
const PRIVATE_API = ['/api/wallet', '/api/account', '/api/referrals',
  '/api/payments', '/api/orders', '/api/payouts', '/api/admin', '/api/tickets'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // 1) PRIVATE/SENSITIVE API → network-only, NEVER cache
  if (PRIVATE_API.some(p => url.pathname.startsWith(p))) {
    e.respondWith(fetch(request)); // no cache fallback for private data
    return;
  }

  // 2) PUBLIC content API → stale-while-revalidate
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(request);
        const network = fetch(request).then(res => { cache.put(request, res.clone()); return res; }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 3) Static shell → cache-first, offline fallback
  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request).catch(() => caches.match('/offline.html')))
  );
});

// Logout: message handler clears private cache (FIX #4)
self.addEventListener('message', (e) => {
  if (e.data === 'clear-user-cache') {
    caches.delete(CACHE_NAME).then(() => caches.open(CACHE_NAME).then(c => c.addAll(STATIC_SHELL)));
  }
});
```

### 3.4 Offline fallback — `/offline.html`
- CSS inline, không phụ thuộc external
- "Bạn đang offline. Nội dung đã lưu vẫn có thể đọc."
- CTA "Thử lại" → reload

### 3.5 Add to Home Screen metadata (HTML head)
```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b111d">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DSTS Club">
<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
```

### 3.6 Install policy (FIX #7 — iOS vs Android)
```
Android (Chrome/Edge/Samsung):
  - Bắt beforeinstallprompt → custom button "Cài đặt DSTS Club"
  - Hiện trong Settings/Profile sau 2 visit

iOS (Safari):
  - KHÔNG có beforeinstallprompt
  - Hiển thị hướng dẫn thủ công: "Nhấn nút Chia sẻ ⎙ → Thêm vào MH chính"
  - Detect: /iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone
```
```js
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredPrompt = e; showAndroidInstallButton();
});
function maybeShowIosGuide() {
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isIos && !standalone) showIosInstallGuide();
}
```

### 3.7 Security headers — `_headers` (FIX #8, addendum 12.3)
```
/manifest.webmanifest
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=3600

/service-worker.js
  Content-Type: application/javascript
  Cache-Control: no-cache
  Service-Worker-Allowed: /

/assets/icons/*
  Cache-Control: public, max-age=31536000, immutable

/app/*
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://pay.iai.one
```

### 3.8 Acceptance Criteria
- [ ] Manifest valid
- [ ] All icon sizes generated
- [ ] SW registers, versioned cache name
- [ ] SW KHÔNG cache private API (wallet, payment, account...)
- [ ] Offline: shell + public content load
- [ ] Android install prompt hoạt động
- [ ] iOS hiển thị hướng dẫn thủ công
- [ ] Security headers áp dụng đúng

---

## 4. PHASE 4 — Auth-aware App Mode (Priority: P2)

### 4.1 Auth safety (FIX #2, addendum 12.1)
```
MVP/Dev phase:
  - localStorage session giả CHỈ để test UI
  - Ghi rõ comment: "// MVP ONLY — replace with HttpOnly cookie in production"

Production (BẮT BUỘC):
  - HttpOnly + Secure + SameSite=Strict cookie HOẶC backend session
  - KHÔNG lưu access token nhạy cảm trong localStorage
  - Phase 1 auth: email OTP / magic link (đồng bộ Club bundle file 04 §9)
  - Passkeys + SSO Muôn Nơi: phase sau
```

### 4.2 Route protection — KHÔNG render shell giả
```js
function checkAuth() {
  // Production: server validates cookie; client chỉ check trạng thái
  const authed = window.__DSTS_AUTH__ === true; // injected server-side
  if (!authed) {
    window.location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
    return false;
  }
  return true;
}
// Chạy TRƯỚC khi render bất kỳ app shell nào
if (!checkAuth()) { /* stop — no render */ }
```
```
❌ KHÔNG: render header+nav+blank rồi redirect; skeleton rồi redirect
✔️ PHẢI: check auth trước, chưa login → redirect ngay, không nháy shell
```

### 4.3 Session expired
```js
async function apiFetch(path, opts) {
  const res = await fetch('/api' + path, { credentials: 'include', ...opts });
  if (res.status === 401) { showSessionExpiredModal(); return null; }
  return res.json();
}
// Modal: "Phiên đăng nhập đã hết hạn" → CTA "Đăng nhập lại" /login (không dismiss bằng tap outside)
```

### 4.4 Logout (FIX #4)
```js
async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  localStorage.removeItem('dsts_session');           // clear local
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage('clear-user-cache'); // clear private cache
  }
  window.location.replace('/login');
}
```

### 4.5 Acceptance Criteria
- [ ] `/app/*` chưa login → redirect, không render shell
- [ ] Session hết hạn → modal + redirect
- [ ] `/login` đã login → redirect /app/home
- [ ] Logout clear session + private cache + redirect

---

## 5. PHASE 5 — UX States (Priority: P3)

| State | UI | Copy |
|-------|-----|------|
| First login | Onboarding 3 slides (skip được) | "Chào mừng đến DSTS Club" |
| Empty content | Illustration + CTA | "Chưa có nội dung" + "Khám phá Club" |
| Loading | Skeleton cards + shimmer | (no text) |
| Error | ⚠️ + retry (debounced) | "Đã xảy ra lỗi. Vui lòng thử lại." |
| Offline | 📡 + cached data | "Bạn đang offline." |
| Session expired | Modal (no tap-outside dismiss) | "Phiên đăng nhập đã hết hạn." |
| No permission | 🚫 (member xem nội dung Circle-only...) | "Bạn không có quyền truy cập." + CTA nâng cấp |
| Maintenance | 🔧 (check mỗi 30s) | "Hệ thống đang bảo trì." |

### Acceptance
- [ ] Mỗi state có UI riêng, không generic
- [ ] No permission: phân biệt Member/Circle/Inner Circle (đồng bộ Club bundle QA security)
- [ ] Loading skeleton không giật
- [ ] Offline hiển thị cached public content

---

## 6. PHASE 6 — Quality Gate (Priority: P5)

| # | Kiểm tra | Cách chạy | Pass |
|---|----------|-----------|------|
| 1 | HTML/CSS/JS sanity | `npx htmlhint`, `npx stylelint` | 0 error |
| 2 | Mobile viewport | DevTools 320/360/390/414/430 | No h-scroll |
| 3 | Lighthouse PWA | DevTools → Lighthouse | ≥ 90 |
| 4 | Footer không lặp | grep `dsts-entity-disclosure` trong /app/ | Count = 0 |
| 5 | Hamburger | tap/swipe/back | All work |
| 6 | App load sau login | login → /app/home < 500ms | Pass |
| 7 | Offline fallback | Network offline → reload | offline.html |
| 8 | SW không cache private | Network tab: /api/wallet không từ SW | Pass |
| 9 | Manifest | Application → Manifest | Valid |
| 10 | Install | Android prompt + iOS guide | Pass |
| 11 | Custom domain | curl -I duongsaotoasang.com/app | 200 |

### Smoke test (đồng bộ Club bundle file 08 §9)
```bash
urls=(
"https://duongsaotoasang.com/app"
"https://duongsaotoasang.com/app/home"
"https://duongsaotoasang.com/app/club"
"https://duongsaotoasang.com/app/wallet"
"https://duongsaotoasang.com/app/rewards"
"https://duongsaotoasang.com/offline.html"
"https://duongsaotoasang.com/manifest.webmanifest"
"https://duongsaotoasang.com/service-worker.js"
)
for url in "${urls[@]}"; do echo "$url"; curl -I -L "$url" | head -n 1; done
```

### Test thiết bị thật (tối thiểu)
- 1 × iPhone Safari + 1 × Android Chrome (bắt buộc)
- Khuyến nghị thêm: Samsung Internet, Xiaomi Chrome

---

## 7. Báo cáo cuối (Dev phải điền)
```
## DSTS Club PWA — Completion Report
1. Files đã sửa
2. Files đã thêm
3. URL Preview
4. URL Production
5. Kết quả Mobile Test (device/browser/result/notes)
6. Kết quả PWA Test (manifest/SW/offline/install/Lighthouse score)
7. Lỗi còn lại (P0/P1/P2)
8. Việc tiếp theo
```

---

## 8. File Structure Target
```
duongsaotoasang.com/
├── index.html                 ← Public homepage (KHÔNG refactor ngoài scope)
├── login/index.html
├── app/
│   ├── index.html             ← App shell (NEW, auth-first)
│   ├── app.css                ← Mobile-only (NEW)
│   ├── app.js                 ← Router, auth, state (NEW)
│   └── components/
│       ├── header.js, bottom-nav.js, hamburger-menu.js
│       ├── skeleton.js, empty-state.js, error-state.js, offline-state.js, toast.js
│       └── wallet.js, referrals.js, tickets.js
├── offline.html               ← Offline fallback (NEW)
├── manifest.webmanifest       ← NEW
├── service-worker.js          ← NEW (versioned, safe cache)
├── assets/icons/              ← icon-72..512 + maskable-512 (NEW)
├── _headers                   ← EDIT: PWA + security headers
└── _redirects                 ← EDIT: /app routes
```

---

## 9. Priority Checklist
```
P0: app shell, footer ẩn /app/, hamburger SVG, viewport 320–430 + _redirects /app
P1: 5 tab Club-first nav, hamburger items, wallet/referrals/tickets, auth guard, session expired
P2: manifest, SW versioned + safe cache, icons, install (Android+iOS), security headers, logout cache clear
P3: UX states (no-permission theo tier), toast, onboarding
P4: mobile QA thiết bị thật, Lighthouse, perf
P5: final QA, deploy, custom domain, report
```

---

## 10. Notes for Dev
1. Vanilla JS + CSS, no React/Vue/jQuery cho scope này.
2. Touch targets ≥ 44px, font ≥ 14px.
3. Lazy load images, WebP nếu được, max-width 100%.
4. A11y: focus states, aria-labels.
5. i18n: structure VI/EN.
6. No `console.log` production (dùng debug flag).
7. ES6 modules.

---

## 11. Đồng bộ Club bundle (source of truth)
File này là **handoff implementation spec**. Các quyết định sản phẩm/legal/economy lấy từ:
- `00_DSTS_CLUB_MASTER_INDEX_2026.md` — founder decisions
- `04_..._WEB_PWA_MOBILE_BROWSER_APP_SPEC_2026.md` — PWA product spec
- `08_..._DEV_EXECUTION_PHASES_AND_DOD_2026.md` — DoD, QA, smoke test
- `02_...POINTS_WALLET...`, `03_...REVENUE_SHARE...`, `06_...DATA_MODEL_API...`, `07_...TERMS_POLICY...`

Khi xung đột: **Club bundle thắng về product/legal/economy**, file này thắng về **implementation chi tiết frontend/PWA**.

---

## 12. Production Safety Addendum

### 12.1 Auth & Session Safety
- Demo phase có thể dùng localStorage session giả để kiểm tra UI.
- Production KHÔNG được lưu access token nhạy cảm trong localStorage.
- Production phải dùng HttpOnly Secure SameSite cookie hoặc backend session.
- `/app/` phải kiểm tra auth TRƯỚC khi render app shell.
- Logout phải clear session, unregister/clear sensitive cache.

### 12.2 Service Worker Safety
- SW chỉ cache static shell: HTML, CSS, JS, icons, offline page.
- KHÔNG cache API response chứa dữ liệu cá nhân nếu chưa có strategy riêng.
- Cache public API phải phân biệt public/private rõ ràng.
- `service-worker.js` phải có versioned cache name.
- Deploy bản mới phải clean old caches.

### 12.3 Security Headers (xem §3.7)
- CSP, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy.
- `service-worker.js`: Cache-Control no-cache.
- icons/assets versioned: Cache-Control public, max-age=31536000, immutable.

### 12.4 Scope Control
- KHÔNG refactor public homepage ngoài phạm vi cần thiết.
- KHÔNG đổi brand/copy chính nếu chưa duyệt.
- KHÔNG sửa logic footer public (bug footer lặp đã fix).
- KHÔNG deploy production nếu chưa có preview URL + mobile QA report.

### 12.5 Final Release Gate (PASS khi đủ tất cả)
1. `/app/` chưa login KHÔNG render shell giả.
2. Footer KHÔNG xuất hiện trong `/app/`.
3. Hamburger, bottom nav, offline fallback hoạt động.
4. SW KHÔNG cache dữ liệu private.
5. Lighthouse PWA ≥ 90.
6. Test thật ≥ 1 iPhone Safari + 1 Android Chrome.
7. Star Points hiển thị "Điểm không phải tiền"; không có text cash-out/investment.

---

**END OF SPEC v1.1 (FINAL)**
