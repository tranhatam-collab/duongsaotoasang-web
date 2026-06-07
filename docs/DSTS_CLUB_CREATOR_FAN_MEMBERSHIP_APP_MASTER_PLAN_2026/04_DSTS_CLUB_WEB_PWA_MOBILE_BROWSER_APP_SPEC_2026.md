# DSTS CLUB — WEB PWA & MOBILE-BROWSER APP SPEC 2026

## 1. Phán quyết sản phẩm

Bắt buộc thiết kế app di động chạy trực tiếp trên trình duyệt sau khi người dùng đăng nhập.

Tên nội bộ:

```text
DSTS Club Mobile Web App
DSTS Club PWA
```

Định vị:

```text
Web-first payment.
PWA-first mobile experience.
Native app later.
```

## 2. Vì sao PWA trước

PWA giúp chạy ngay trên Safari/Chrome mobile, không cần App Store/Google Play approval, dùng chung tài khoản web, dùng chung payment lane web, dùng chung Club content, wallet, referral, reward, Add to Home Screen, offline/skeleton cache, triển khai nhanh hơn native, giảm rủi ro in-app purchase policy trong phase đầu.

## 3. Mobile app sau login phải có cảm giác như app thật

Sau login, người dùng vào `/app`.

Màn hình phải dùng full viewport layout, bottom tab navigation, app shell, sticky top user bar, card feed, skeleton loading, no footer dài kiểu website, no desktop navigation, no duplicated footer disclosure, hamburger menu cho secondary actions, install prompt nếu PWA supported.

## 4. Route kiến trúc

Public web:

```text
/club
/club/creators
/club/{creator}
/club/{creator}/membership
/club/{creator}/talkshows
/points
/rewards
```

Mobile web app after login:

```text
/app
/app/home
/app/club
/app/creators
/app/talkshows
/app/library
/app/wallet
/app/rewards
/app/referrals
/app/tickets
/app/profile
/app/support
```

## 5. Bottom tabs MVP

1. Home — feed, creator updates, next talk show.
2. Club — club list, joined clubs, recommended clubs.
3. Talk Shows — upcoming, registered, replay.
4. Wallet — Star Points, ledger, packages, warnings.
5. Profile — account, membership, referrals, support.

## 6. App shell CSS

```css
.app-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-content {
  overflow: auto;
  padding-bottom: calc(76px + env(safe-area-inset-bottom));
}

.app-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 7. PWA files bắt buộc

```text
/manifest.webmanifest
/service-worker.js
/offline.html
/assets/icons/icon-192.png
/assets/icons/icon-512.png
/assets/icons/maskable-512.png
```

## 8. Service worker strategy

Static assets: cache-first. HTML app shell: network-first with fallback. Public content: stale-while-revalidate. Authenticated API: network-first, no persistent sensitive cache unless encrypted/approved. Payment/order status: network-only.

Không cache payment status as source of truth, sensitive wallet ledger beyond local display cache, identity documents, creator payout, admin pages.

## 9. Mobile login

States: not_authenticated, authenticating, authenticated, session_expired, blocked, requires_verification.

Supported phase 1: email OTP/magic link. Passkeys later. SSO with Muôn Nơi later.

## 10. Wallet display rules

Wallet screen shows current points balance, pending points, earned points, expiring points if enabled, ledger history, rules link, “Điểm không phải tiền” notice.

## 11. Payment in PWA

PWA can use web payment lane. Points credited only after paid status is confirmed. Payment page clearly shows entity/lane, order ID, payment status only from webhook/provider confirmation, not return URL.

## 12. Notifications

Phase 1: email, in-app, web push where supported. Types: talk show reminder, points earned, reward redeemed, referral pending/earned, membership renewal, creator posted new content, ticket confirmed, policy update.

## 13. Hamburger menu mobile

Hamburger opens secondary actions: account settings, membership, legal, contact/support, language, logout, install app, report issue. Must be SVG, aria-label, escape/click outside close, focus trap if drawer modal.

## 14. Footer duplication prevention

Public site footer = full footer. Authenticated app shell = compact legal link only. No auto-append duplicate disclosure if footer already contains entity disclosure.

## 15. Acceptance criteria

Accepted only if `/app` loads after login, bottom nav works, hamburger works, no duplicated footer, wallet screen shows points + legal notice, talk show calendar works, referral link exists, reward catalog loads, offline page works, Add to Home Screen works where supported, mobile 320/375/414/768 widths pass, no sensitive API cached unsafely.
