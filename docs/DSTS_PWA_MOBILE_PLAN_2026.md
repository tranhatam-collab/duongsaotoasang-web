# DSTS Mobile PWA Plan 2026
## Không làm app native — Dùng trình duyệt như app thật

---

## Nguyên tắc

> Không xây app Android/iOS riêng. DSTS chạy trên trình duyệt di động, được "phản chiếu" (PWA) lên màn hình chính như app thật.

| Tiêu chí | Cách làm |
|----------|----------|
| Cài đặt | User "Add to Home Screen" từ Safari/Chrome |
| Biểu tượng | DSTS logo 192x192 / 512x512, không dùng icon generic |
| Splash screen | Màu nền `#0b111d` + logo giữa màn hình |
| Offline | Cache trang chủ + bài viết đã đọc |
| Push notification | Dùng Web Push API (không dùng Firebase Cloud Messaging nếu không cần) |
| Định hướng | Portrait chính, landscape hỗ trợ |
| Theme | `theme-color: #0b111d` đã có |

---

## Phase 1: PWA Foundation (2 tuần)

### 1.1 Web App Manifest
```json
{
  "name": "Đường Sao Tỏa Sáng",
  "short_name": "DSTS",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#0b111d",
  "theme_color": "#0b111d",
  "orientation": "portrait",
  "icons": [
    { "src": "/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "shortcuts": [
    { "name": "Bài viết", "short_name": "Bài", "url": "/posts", "icons": [{ "src": "/assets/icons/posts-96.png", "sizes": "96x96" }] },
    { "name": "Sự kiện", "short_name": "Event", "url": "/events", "icons": [{ "src": "/assets/icons/events-96.png", "sizes": "96x96" }] },
    { "name": "Liên hệ", "short_name": "Contact", "url": "/contact", "icons": [{ "src": "/assets/icons/contact-96.png", "sizes": "96x96" }] }
  ]
}
```

### 1.2 Service Worker (sw.js)
- Precache: `/`, `/app.css`, `/app.js`, `/assets/icons/*`
- Runtime cache: `/api/contents?type=post` (Network First, cache 24h)
- Offline fallback: Hiển thị trang chủ với thông báo "Bạn đang offline"
- Cache strategy: Stale-while-revalidate cho static assets

### 1.3 Icons & Splash
- Tạo icon 192x192, 512x512 từ `logo-mark.svg`
- Tạo splash screen 1170x2532 (iPhone 14 Pro Max) và 1080x1920 (Android)
- Màu nền splash: `#0b111d`, logo vàng `#e0c896` ở giữa

### 1.4 HTML Updates
- Thêm `<link rel="manifest" href="/manifest.json">`
- Thêm `<meta name="apple-mobile-web-app-capable" content="yes">`
- Thêm `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- Thêm `<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">`

---

## Phase 2: Mobile UX Polish (2 tuần)

### 2.1 Touch & Gesture
- Swipe left/right giữa bài viết liên tiếp
- Pull-to-refresh cho `/posts`, `/events`
- Bottom sheet cho menu scripts (thay dropdown desktop)
- Long-press để copy link bài viết

### 2.2 Bottom Navigation (Mobile Only)
```
[Trang chủ] [Bài viết] [Sự kiện] [Kịch bản] [Menu]
```
- Hiện ở màn hình < 760px
- Ẩn top navigation khi scroll xuống, hiện khi scroll lên
- Active state theo trang hiện tại

### 2.3 Viewport & Safe Area
- `env(safe-area-inset-bottom)` cho iPhone X+
- Bottom nav padding đủ để tránh notch
- `max-width: 100vw` strict — không có element nào overflow

### 2.4 Performance
- Target: LCP < 2.5s trên 4G
- Lazy load images below fold
- Preconnect `https://duongsaotoasang.com`
- DNS-prefetch external domains (`pay.iai.one`, `mail.iai.one`)

---

## Phase 3: Offline & Engagement (2 tuần)

### 3.1 Offline Features
- Đọc bài viết đã cache khi không có mạng
- Bookmark bài viết vào IndexedDB (không dùng localStorage cho > 5MB)
- Sync form đã nhập khi online lại (background sync API)

### 3.2 Push Notifications
- Đăng ký nhận thông báo: sự kiện mới, bài viết mới
- Tần suất: Tối đa 1 thông báo/tuần (tránh spam)
- Nội dung: Tiếng Việt, không dùng tiếng Anh khi user chọn VI
- Unsubscribe dễ dàng trong `/settings` (tương lai)

### 3.3 Background Fetch
- Tự động tải trước 3 bài viết mới nhất khi WiFi
- Không fetch khi mobile data (save data mode)

---

## Phase 4: App-like Behaviors (2 tuần)

### 4.1 Install Prompt
- Hiển thị banner "Thêm vào màn hình chính" sau 2 lần visit
- Không hiển thị nếu user đã install hoặc đã từ chối
- Custom UI: Nút "Cài đặt DSTS" trong `/about` hoặc footer

### 4.2 Share Sheet
- `navigator.share()` cho bài viết (nếu supported)
- Fallback: Copy link + toast notification

### 4.3 Deep Linking
- URL scheme: `https://duongsaotoasang.com/content?slug=xxx`
- PWA mở đúng bài viết khi click link từ ngoài
- Không mở browser mới — dùng scope của PWA

### 4.4 Standalone Mode Detection
```js
if (window.matchMedia('(display-mode: standalone)').matches) {
  // Ẩn "Add to Home Screen" banner
  // Hiện bottom nav nếu chưa có
}
```

---

## Phase 5: Testing & Launch (1 tuần)

### 5.1 Test Matrix
| Device | Trình duyệt | Kiểm tra |
|--------|-------------|----------|
| iPhone 14 Pro | Safari 17 | Install, offline, splash, bottom nav |
| iPhone 14 Pro | Chrome iOS | Manifest, icons |
| Samsung S23 | Chrome 120 | Install prompt, service worker, push |
| Samsung S23 | Samsung Internet | Splash, icons |
| Xiaomi Redmi | Chrome 118 | Performance trên thiết bị yếu |

### 5.2 Lighthouse Targets
| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| PWA | 100 |

### 5.3 Launch Checklist
- [ ] Manifest valid (test qua https://manifest-validator.appspot.com)
- [ ] Service Worker hoạt động offline
- [ ] Icons hiển thị đúng trên iOS/Android
- [ ] Splash screen không bị crop
- [ ] Bottom nav không che nội dung
- [ ] Form submit hoạt động offline (queue + sync)
- [ ] Push notification test thành công

---

## Không làm (Out of Scope)

| Không làm | Lý do |
|-----------|-------|
| App Store / Play Store | PWA đủ, không mất phí review |
| React Native / Flutter | Overhead, không cần native API |
| In-app purchase | Dùng pay.iai.one web payment |
| Background location | Không cần, không thu thập vị trí |
| Bluetooth / NFC | Không có use case |
| Camera access | Không cần trong scope hiện tại |

---

## Timeline

| Phase | Thời gian | Sprint |
|-------|-----------|--------|
| P1: Manifest + SW + Icons | Tuần 1-2 | Sprint 6 |
| P2: Mobile UX + Bottom Nav | Tuần 3-4 | Sprint 7 |
| P3: Offline + Push | Tuần 5-6 | Sprint 8 |
| P4: App-like + Install | Tuần 7-8 | Sprint 9 |
| P5: Test + Launch | Tuần 9 | Sprint 10 |

**Tổng: ~9 tuần (2 tháng)**

---

## Files cần tạo/sửa

### Mới
- `/manifest.json`
- `/sw.js`
- `/assets/icons/icon-192.png`
- `/assets/icons/icon-512.png`
- `/assets/icons/icon-maskable-512.png`
- `/assets/icons/splash-1170x2532.png`
- `/assets/icons/splash-1080x1920.png`

### Sửa
- `/index.html` — Thêm manifest, apple-touch-icon, theme-color meta
- `/app.css` — Bottom nav styles, safe-area padding
- `/assets/app-v5.js` — Service Worker registration, offline detection, install prompt
- `/_headers` — Cache headers cho sw.js, manifest.json

---

## Success Criteria

1. User cài đặt PWA từ Safari/Chrome trong < 3 bước
2. PWA chạy standalone (không có browser chrome)
3. Offline: trang chủ + 3 bài viết gần nhất load được
4. Lighthouse PWA score = 100
5. Không có scroll horizontal trên mobile (< 480px)
6. Bottom nav touch target ≥ 48x48px
7. Font size không nhỏ hơn 14px bất kỳ chỗ nào

---

*Plan created: 2026-06-07*
*Owner: DSTS Tech Team*
