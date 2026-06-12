# DSTS PWA Mobile App — Dev Handoff Spec
**Project:** duongsaotoasang.com  
**Date:** 2026-06-07  
**Owner:** DSTS Tech Lead → AI Dev / Team Dev  
**Status:** Ready for implementation  
**Target:** Mobile Web App / PWA running in browser, NOT native app

---

## 0. Nguyên tắc bắt buộc (Không được vi phạm)

| # | Nguyên tắc | Phạt vi phạm |
|---|-----------|-------------|
| 1 | **Mobile-first** — Design cho 360px trước, scale lên desktop sau | Reject PR |
| 2 | **App shell riêng sau login** — Không phải website responsive thường | Reject PR |
| 3 | **Không để footer/public disclosure lặp** trong app view | Reject PR |
| 4 | **Không layout desktop ép xuống mobile** — Phải có layout mobile riêng | Reject PR |
| 5 | **Hamburger menu rõ ràng** — SVG 3 gạch, touch target ≥ 44x44px | Reject PR |
| 6 | **Bottom navigation cố định** — 5 tab chính, không scroll che content | Reject PR |
| 7 | **PWA manifest + SW + icon + install prompt + offline fallback** | Reject PR |
| 8 | **Không placeholder** — Tất cả text phải là nội dung thật | Reject PR |
| 9 | **Không deploy production nếu chưa kiểm tra mobile thật** | Block deploy |
| 10 | **Sau mỗi bước: báo file đã sửa, test đã chạy, kết quả** | Block next phase |

---

## 1. PHASE 1 — Mobile App Shell (Priority: P0)

### 1.1 Mục tiêu
Tạo layout sau login dạng app — không phải website responsive.

### 1.2 File cần tạo
- `/app/index.html` — App shell chính (protected)
- `/app/app.css` — App styles riêng, không dùng lại homepage.css
- `/app/app.js` — App router, state, navigation

### 1.3 Layout structure (mobile only, < 760px)
```
┌─────────────────────────┐
│ ○  Đường Sao Tỏa Sáng   │  ← Header compact (56px)
│    ≡                    │  ← Hamburger right
├─────────────────────────┤
│                         │
│    MAIN CONTENT AREA    │  ← Scrollable, padding-bottom: 80px
│                         │
│                         │
├─────────────────────────┤
│  🏠  📚  ✅  👤  ⚙️   │  ← Bottom nav (fixed, 64px)
│  Home Content Tasks Profile Settings
└─────────────────────────┘
```

### 1.4 Header compact
```css
.app-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 56px;
  background: rgba(11, 17, 29, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(224,200,150,.12);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.app-header .brand {
  font-size: 16px;
  font-weight: 700;
  color: #f7ead0;
}
.app-header .hamburger {
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(224,200,150,.12);
  background: rgba(255,255,255,.04);
  color: #f8fafc;
}
```

### 1.5 Hamburger menu (slide-in from right)
- Width: 280px (max 80vw)
- Background: `#0b111d` với gradient gold subtle
- Items: Giới thiệu, Liên hệ, Chính sách, Đăng xuất
- Overlay: rgba(0,0,0,.5) behind menu
- Close: tap overlay hoặc swipe right
- Transition: transform 0.3s ease

### 1.6 Main content area
```css
.app-main {
  padding-top: 56px;   /* header height */
  padding-bottom: 64px; /* bottom nav height */
  min-height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

### 1.7 Bottom navigation (fixed)
```css
.app-bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 64px;
  background: rgba(11, 17, 29, 0.98);
  border-top: 1px solid rgba(224,200,150,.10);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}
.app-bottom-nav .nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  color: #8f9bad;
  text-decoration: none;
  font-size: 11px;
  touch-action: manipulation;
}
.app-bottom-nav .nav-item.active {
  color: #e0c896;
}
.app-bottom-nav .nav-item svg {
  width: 24px; height: 24px;
}
```

### 1.8 Footer trong app view
- **Ẩn hoàn toàn** — Không có footer trong `/app/`
- Disclosure thuộc về public pages, không phải app experience
- Nếu cần legal link: đặt trong Settings tab hoặc hamburger menu

### 1.9 Test viewport
| Width | Device | Test |
|-------|--------|------|
| 360px | Android (Samsung, Xiaomi) | Must pass |
| 390px | iPhone 14/15 | Must pass |
| 430px | iPhone 14/15 Pro Max | Must pass |
| 375px | iPhone SE | Must pass |
| 768px | iPad mini | Không làm tablet-specific, nhưng không vỡ |

### 1.10 Acceptance Criteria
- [ ] Header cố định, không nhảy khi scroll
- [ ] Bottom nav không che content cuối trang
- [ ] Safe area inset-bottom hoạt động trên iPhone X+
- [ ] Không có horizontal scroll ở 360px
- [ ] Hamburger mở/đóng mượt, không lag
- [ ] Không có footer nào hiển thị trong /app/

---

## 2. PHASE 2 — Navigation (Priority: P1)

### 2.1 Bottom Navigation — 5 Tabs

```
Tab 1: 🏠 Trang chủ     → /app/#home
Tab 2: 📚 Bài học       → /app/#content
Tab 3: ✅ Nhiệm vụ      → /app/#tasks
Tab 4: 👤 Hồ sơ         → /app/#profile
Tab 5: ⚙️ Cài đặt       → /app/#settings
```

**Icon requirements:**
- Dùng SVG inline, không dùng icon font (tránh FOIT)
- Stroke width: 1.5px
- Active: color `#e0c896`, inactive: `#8f9bad`
- Active indicator: dot hoặc top border 2px gold

### 2.2 Hamburger Menu Items
```
┌─────────────────────┐
│  ○ Đường Sao Tỏa Sáng │
│                     │
│  ➤ Giới thiệu      │
│  ➤ Liên hệ         │
│  ➤ Chính sách      │
│  ─────────────────  │
│  🌐 Ngôn ngữ (VI/EN)│
│  ─────────────────  │
│  🚪 Đăng xuất      │
└─────────────────────┘
```

**Behavior:**
- Tap outside → close
- Swipe right on menu → close
- Back button (Android) → close menu, không back ra trang trước
- Menu không tràn màn hình: max-width 80vw, height 100vh

### 2.3 Routing (hash-based, no page reload)
```js
// App router
const routes = {
  'home': () => renderHome(),
  'content': () => renderContent(),
  'tasks': () => renderTasks(),
  'profile': () => renderProfile(),
  'settings': () => renderSettings()
};

function navigateTo(hash) {
  window.location.hash = hash;
  renderRoute(hash);
}
```

### 2.4 Acceptance Criteria
- [ ] Tap tab → switch route instantly (< 100ms)
- [ ] Active tab highlighted đúng
- [ ] Back button Android hoạt động đúng (pop hash state)
- [ ] Menu không bị tràn, không có scroll ngang
- [ ] Language switch trong menu hoạt động, không reload trang
- [ ] Logout: clear session, redirect /login

---

## 3. PHASE 3 — PWA Foundation (Priority: P2)

### 3.1 manifest.webmanifest
```json
{
  "name": "Đường Sao Tỏa Sáng",
  "short_name": "DSTS",
  "description": "Nền tảng tỏa sáng của người Việt toàn cầu",
  "start_url": "/app/?source=pwa",
  "display": "standalone",
  "background_color": "#0b111d",
  "theme_color": "#0b111d",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    { "src": "/assets/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/assets/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/assets/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/assets/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/assets/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/assets/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "shortcuts": [
    { "name": "Bài viết", "short_name": "Bài", "url": "/app/#content", "icons": [{ "src": "/assets/icons/shortcut-content-96.png", "sizes": "96x96" }] },
    { "name": "Nhiệm vụ", "short_name": "Tasks", "url": "/app/#tasks", "icons": [{ "src": "/assets/icons/shortcut-tasks-96.png", "sizes": "96x96" }] }
  ],
  "categories": ["education", "lifestyle"],
  "lang": "vi"
}
```

### 3.2 Icons đủ size
- **Source:** `/assets/brand/logo-mark.svg`
- **Tool:** Sharp/ImageMagick hoặc online converter
- **Sizes:** 72, 96, 128, 144, 152, 192, 384, 512
- **Maskable:** Có padding 10% để Android adaptive icon không crop
- **Format:** PNG với transparency
- **Color:** Gold `#e0c896` trên nền `#0b111d`

### 3.3 Service Worker (service-worker.js)
```js
const CACHE_NAME = 'dsts-app-v1';
const STATIC_ASSETS = [
  '/',
  '/app/',
  '/app/index.html',
  '/app/app.css',
  '/app/app.js',
  '/assets/brand/logo-mark.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install: precache shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  );
  self.clients.claim();
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  
  if (request.method !== 'GET') return;
  
  // API: network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Static: cache first
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return res;
      });
    })
  );
});
```

### 3.4 Offline fallback page
- File: `/offline/index.html`
- Nội dung: "Bạn đang offline. Một số nội dung vẫn có thể đọc được."
- CTA: "Thử lại" — reload page
- Style: Dùng CSS inline để không phụ thuộc external file
- Hiển thị cached content nếu có

### 3.5 Add to Home Screen metadata (HTML `<head>`)
```html
<!-- PWA -->
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b111d">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DSTS">
<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
<meta name="msapplication-TileImage" content="/assets/icons/icon-144.png">
<meta name="msapplication-TileColor" content="#0b111d">
```

### 3.6 Install Prompt
```js
// In app.js
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show custom install button (e.g., in Settings tab)
  showInstallButton();
});

async function promptInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    hideInstallButton();
  }
  deferredPrompt = null;
}
```

### 3.7 Acceptance Criteria
- [ ] Manifest valid (test: https://manifest-validator.appspot.com)
- [ ] All icon sizes generated từ logo-mark.svg
- [ ] Service Worker registers successfully
- [ ] Offline: trang chủ và /app/ vẫn load
- [ ] API calls cache và trả về khi offline
- [ ] Install prompt hoạt động trên Chrome Android
- [ ] Safari iOS: Add to Home Screen hiển thị icon đúng
- [ ] Theme color đúng brand (`#0b111d`)

---

## 4. PHASE 4 — Auth-aware App Mode (Priority: P2)

### 4.1 Route protection
```js
// Pseudocode
const PUBLIC_ROUTES = ['/', '/login', '/about', '/contact', '/legal', '/terms'];
const APP_ROUTES = ['/app/*'];

function checkAuth() {
  const session = localStorage.getItem('dsts_session');
  const token = session ? JSON.parse(session).token : null;
  
  if (!token || isTokenExpired(token)) {
    redirect('/login?redirect=' + encodeURIComponent(window.location.pathname));
    return false;
  }
  return true;
}

// On /app/ load
if (!checkAuth()) {
  // DO NOT render app shell
  // DO NOT show blank page
  // Redirect immediately
}
```

### 4.2 Login flow
1. User visits `/` → public homepage
2. Tap "Đăng nhập" → `/login/`
3. Login success → redirect `/app/#home`
4. Set session: `localStorage.setItem('dsts_session', JSON.stringify({token, expires}))`

### 4.3 Session expired handling
```js
// API interceptor
async function apiFetch(path) {
  try {
    const res = await fetch('/api' + path, { headers: { Authorization: `Bearer ${token}` }});
    if (res.status === 401) {
      showSessionExpiredModal();
      return null;
    }
    return res.json();
  } catch (err) {
    showOfflineToast();
    return null;
  }
}

function showSessionExpiredModal() {
  // Modal: "Phiên đăng nhập đã hết hạn"
  // CTA primary: "Đăng nhập lại" → redirect /login
  // CTA secondary: "Đóng" → không làm gì (sẽ lại hết hạn khi call API)
}
```

### 4.4 Không render app shell giả
```
❌ KHÔNG ĐƯỢC:
   - Hiện header + sidebar + blank content rồi redirect
   - Hiện skeleton rồi redirect
   - Hiện "Loading..." 3 giây rồi redirect

✔️ PHẢI LÀM:
   - Kiểm tra auth trước khi render bất kỳ gì
   - Nếu chưa login → redirect ngay lập tức
   - Nếu session hết hạn → redirect /login với message
```

### 4.5 Acceptance Criteria
- [ ] `/app/` chưa login → redirect /login (no render)
- [ ] `/app/` session hết hạn → modal + redirect
- [ ] `/login` đã login → redirect /app/#home
- [ ] Token refresh: tự động trước khi hết hạn 5 phút
- [ ] Logout: clear storage + redirect / + không cache app shell

---

## 5. PHASE 5 — UX States (Priority: P3)

Mỗi state phải có UI riêng, không dùng generic "Loading..."

### 5.1 State definitions

| State | UI | Copy |
|-------|-----|------|
| **First login** | Welcome screen + onboarding slides (3 slides) | "Chào mừng đến DSTS" → "Khám phá nội dung" → "Bắt đầu hành trình" |
| **Empty content** | Illustration + text + CTA | "Chưa có nội dung nào" + "Khám phá ngay" |
| **Loading** | Skeleton cards (3 cards) + shimmer effect | Không có text |
| **Error** | Icon ⚠️ + message + retry button | "Đã xảy ra lỗi. Vui lòng thử lại." |
| **Offline** | Icon 📡 + message | "Bạn đang offline. Nội dung đã lưu vẫn có thể đọc." |
| **Session expired** | Modal overlay | "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." |
| **No permission** | Icon 🚫 + message | "Bạn không có quyền truy cập nội dung này." |
| **Maintenance** | Icon 🔧 + message | "Hệ thống đang bảo trì. Vui lòng quay lại sau." |

### 5.2 Skeleton component
```html
<div class="skeleton-card">
  <div class="skeleton-image"></div>
  <div class="skeleton-title"></div>
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
</div>
```
```css
.skeleton-card > * {
  background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 5.3 Toast notifications
```
Position: top: 64px (below header), center horizontally
Duration: 3 seconds
Types: success (gold), error (red), info (blue)
Animation: slide down + fade in, fade out
```

### 5.4 Acceptance Criteria
- [ ] Mỗi state có UI riêng, không generic text
- [ ] First login: có thể skip onboarding
- [ ] Empty state: có CTA rõ ràng
- [ ] Loading: skeleton không nháy, không giật
- [ ] Error: có retry button, retry có debounce
- [ ] Offline: hiển thị cached data nếu có
- [ ] Session expired: modal không bị dismiss bằng tap outside
- [ ] Maintenance: check mỗi 30s, tự động recovery

---

## 6. PHASE 6 — Quality Gate (Priority: P5)

### 6.1 Kiểm tra trước deploy

| # | Kiểm tra | Cách chạy | Pass |
|---|----------|-----------|------|
| 1 | HTML/CSS/JS sanity | `npx htmlhint /app/*.html`, `npx stylelint /app/*.css` | 0 error |
| 2 | Mobile viewport | DevTools → iPhone 14 Pro (390x844) | No horizontal scroll |
| 3 | Lighthouse PWA | Chrome DevTools → Lighthouse → PWA | Score ≥ 90 |
| 4 | Footer không lặp | Search `dsts-entity-disclosure` trong /app/ | Count = 0 |
| 5 | Hamburger hoạt động | Tap, swipe, back button | All work |
| 6 | App load sau login | Login → redirect /app/ → render < 500ms | Pass |
| 7 | Offline fallback | DevTools → Network → Offline → reload | Offline page |
| 8 | Service worker | DevTools → Application → SW | Active, no errors |
| 9 | Manifest | DevTools → Application → Manifest | All fields valid |
| 10 | Install prompt | Chrome Android / Safari iOS | Prompt hoạt động |

### 6.2 Test thiết bị thật
| Device | Browser | Tests |
|--------|---------|-------|
| iPhone 14 Pro | Safari | Install, offline, splash, nav |
| iPhone 14 Pro | Chrome iOS | Manifest, icons |
| Samsung S23 | Chrome | Install, SW, push, auth |
| Xiaomi Redmi | Chrome | Performance, memory |

### 6.3 Performance targets
| Metric | Target | Tool |
|--------|--------|------|
| FCP | < 1.8s | Lighthouse |
| LCP | < 2.5s | Lighthouse |
| TTI | < 3.5s | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Total JS | < 150KB (gzipped) | Network panel |
| Image sizes | < 500KB total | Network panel |

---

## 7. Báo cáo cuối (Mẫu dev phải điền)

```
## DSTS PWA Mobile App — Completion Report

### 1. Files đã sửa
- (List each file with brief description)

### 2. Files đã thêm
- (List each new file)

### 3. URL Preview
- https://[preview-id].duongsaotoasang-com-v2.pages.dev

### 4. URL Production
- https://duongsaotoasang.com (nếu đã deploy)

### 5. Kết quả Mobile Test
| Device | Browser | Result | Notes |
|--------|---------|--------|-------|
| iPhone 14 Pro | Safari | ✅/❌ | |
| Samsung S23 | Chrome | ✅/❌ | |
| ... | ... | ... | |

### 6. Kết quả PWA Test
| Check | Result | Score |
|-------|--------|-------|
| Manifest valid | ✅/❌ | |
| SW active | ✅/❌ | |
| Offline works | ✅/❌ | |
| Install prompt | ✅/❌ | |
| Lighthouse PWA | ✅/❌ | [score]/100 |

### 7. Lỗi còn lại
- (List with priority P0/P1/P2)

### 8. Việc tiếp theo
- (List next steps)
```

---

## 8. File Structure Target

```
duongsaotoasang.com/
├── index.html                 ← Public homepage (existing)
├── login/
│   └── index.html             ← Login page (new or existing)
├── app/
│   ├── index.html             ← App shell (NEW)
│   ├── app.css                ← App styles (NEW)
│   ├── app.js                 ← App router, auth, state (NEW)
│   └── components/
│       ├── header.js          ← Compact header (NEW)
│       ├── bottom-nav.js      ← Bottom navigation (NEW)
│       ├── hamburger-menu.js  ← Slide-in menu (NEW)
│       ├── skeleton.js        ← Loading skeletons (NEW)
│       ├── empty-state.js     ← Empty content UI (NEW)
│       ├── error-state.js     ← Error UI (NEW)
│       ├── offline-state.js   ← Offline UI (NEW)
│       └── toast.js           ← Toast notifications (NEW)
├── offline/
│   └── index.html             ← Offline fallback (NEW)
├── manifest.webmanifest       ← PWA manifest (NEW)
├── service-worker.js          ← Service Worker (NEW)
├── assets/
│   ├── brand/
│   │   └── logo-mark.svg      ← Existing
│   └── icons/
│       ├── icon-72.png        ← NEW
│       ├── icon-96.png        ← NEW
│       ├── icon-128.png       ← NEW
│       ├── icon-144.png       ← NEW
│       ├── icon-152.png       ← NEW
│       ├── icon-192.png       ← NEW
│       ├── icon-384.png       ← NEW
│       ├── icon-512.png       ← NEW
│       └── icon-maskable-512.png ← NEW
├── _headers                   ← Edit: add cache headers for SW
└── _redirects                 ← Edit: add /app/ routes
```

---

## 9. Priority Checklist

```
P0 (Làm ngay — Blocker):
  □ App shell structure: header, bottom nav, main area
  □ Footer ẩn trong /app/
  □ Hamburger SVG rõ ràng
  □ Mobile viewport: 360px–430px pass

P1 (Sprint 1):
  □ 5 tab bottom navigation
  □ Hamburger menu với đầy đủ items
  □ Auth check trước render app shell
  □ Session expired handling

P2 (Sprint 2):
  □ manifest.webmanifest
  □ Service worker + offline fallback
  □ App icons đủ size
  □ Install prompt

P3 (Sprint 3):
  □ All UX states (loading, error, offline, empty...)
  □ Toast notifications
  □ First login onboarding

P4 (Sprint 4):
  □ Mobile QA trên thiết bị thật
  □ Lighthouse audit
  □ Performance optimization
  □ Bug fixes

P5 (Release):
  □ Final QA pass
  □ Deploy to production
  □ Custom domain mapping
  □ Report completion
```

---

## 10. Notes for Dev

1. **Không dùng framework lớn** — React, Vue, Angular không cần thiết cho scope này. Vanilla JS + CSS modules đủ.
2. **No jQuery** — Dùng native APIs.
3. **CSS Grid/Flexbox** — Không dùng float.
4. **Touch targets** — Tất cả interactive elements ≥ 44x44px.
5. **Font size** — Không nhỏ hơn 14px bất kỳ chỗ nào.
6. **Images** — Lazy load, WebP nếu có thể, max-width 100%.
7. **A11y** — Focus states rõ ràng, aria-labels đầy đủ.
8. **i18n** — Chuẩn bị structure cho VI/EN, dùng data attributes hoặc JSON.
9. **No console.log** trong production — Dùng debug flag.
10. **ES6 modules** — Không dùng global scope nếu không cần.

---

## 11. Contact & Escalation

| Role | Contact |
|------|---------|
| Tech Lead | tranhatam |
| Design | (TBD) |
| QA | (TBD) |

---

**END OF SPEC**
