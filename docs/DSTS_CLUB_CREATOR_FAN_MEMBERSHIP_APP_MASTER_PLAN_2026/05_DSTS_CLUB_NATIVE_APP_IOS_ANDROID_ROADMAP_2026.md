# DSTS CLUB — NATIVE APP IOS & ANDROID ROADMAP 2026

## 1. Phán quyết

Native app là hướng đúng, nhưng không phải bước đầu.

```text
Web Club MVP
→ PWA/mobile-browser app after login
→ Native engagement app
→ Native commerce only after legal + store policy lock
```

## 2. App native phase 1: engagement-first

Phase 1 native app không ưu tiên checkout.

Mục tiêu: xem nội dung đã mua, notification, lịch talk show, điểm, vé, referral link, reward catalog, support.

Không ưu tiên: mua điểm trong app, checkout membership trong app, external checkout assumptions trong iOS, complex commerce.

## 3. Native app tabs

Home, Club, Talk Shows, Wallet, Profile. Secondary: Creators, Library, Rewards, Referral, Events/Tickets, Support.

## 4. Core screens

Home: latest updates, joined clubs, upcoming talk show, points snapshot, recommended creators.

Club: my clubs, explore creators, public/paid badges, join CTA where allowed.

Talk Shows: upcoming, registered, replays, access level, add to calendar.

Wallet: points balance, pending/earned, ledger, reward CTA, legal notice.

Profile: account, membership, referral, tickets, legal, support, logout.

## 5. App payment policy strategy

Because Apple/Google app payment rules can change by country, category, and store policy, the team must verify latest official policies before enabling native in-app checkout.

Working rule:

```text
Web-first payment.
Native app phase 1 = consumption + engagement.
Native checkout only after legal and app-store policy review.
```

For digital subscriptions/content consumed in app, teams should assume app-store billing may be required unless a verified exception applies.

Do not place external purchase CTAs in iOS/Android app until legal/app-store review confirms the exact allowed flow for target markets.

## 6. Technical options

Recommendation:

```text
Phase 1: PWA.
Phase 2: React Native/Expo if app needs real native notification, QR, offline media, deep links.
Avoid thin-wrapper only submission unless native value is clear.
```

## 7. Native-only value needed

Push notifications, ticket QR, offline saved replays if licensed, calendar integration, native share sheet, biometric lock, downloaded content rules, event check-in, creator live reminders.

## 8. Mobile app legal requirements

Privacy Policy URL, Terms URL, Support URL, account deletion flow, data deletion request, content moderation/report flow, UGC policy if comments/rooms exist, subscription cancellation instructions, purchase policy depending on platform, age rating, creator content classification.

## 9. Release phases

Phase A: PWA only.  
Phase B: Native prototype internal.  
Phase C: Native MVP stores.  
Phase D: Native commerce review.

## 10. Native app DoD

Login works, joined clubs visible, entitlements sync with web, paid content access correct, unauthorized content blocked, wallet same server balance, push notification works, talk show reminders work, report content works, account deletion request exists, no purchase flow violates store policy, crash reporting enabled, analytics privacy reviewed.
