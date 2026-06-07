# DSTS CLUB — DEV EXECUTION PHASES & DEFINITION OF DONE 2026

## 1. Execution principles

Do not rebuild DSTS from scratch. Add Club as controlled product layer. Web-first, PWA-first. Payment must use verified payment lane. Points never credited until payment status is confirmed. No cash-out. No native checkout until legal/store policy lock. All sensitive actions audited. No “done” without test evidence.

## 2. Phase 0 — Planning lock

Deliverables: Founder approval, legal review for points/referral, payment lane owner assigned, data model approved, route map approved, PWA scope approved.

DoD: all plan files accepted or accepted with notes, open questions logged, no critical legal blocker.

## 3. Phase 1 — Web Club MVP

### Issue 01 — Add Club routes

Files: `/club.html`, `/club-creators.html`, `/club-creator-detail.html`, `/_redirects`.

Routes: `/club`, `/club/creators`, `/club/{creator}`.

DoD: routes return 200, no broken links, public/paid badges visible, login CTA works.

### Issue 02 — Membership packages UI

Build Member/Circle/Inner Circle cards. DoD: pricing, benefits, points/month, legal disclaimer visible.

### Issue 03 — Creator profile

Build public profile, public content, paid preview, talk show calendar, membership CTA, rewards CTA.

### Issue 04 — Basic account app shell

Routes: `/app`, `/app/home`, `/app/club`, `/app/talkshows`, `/app/wallet`, `/app/profile`.

DoD: bottom nav, hamburger drawer, no full public footer, no duplicate disclosure, login gate works.

### Issue 05 — Wallet display

Build balance, pending, ledger, points disclaimer.

### Issue 06 — Referral center

Build referral link, referral stats, pending/earned/clawed back.

### Issue 07 — Reward catalog static

Build digital, event, experience categories. Redeem disabled if not ready.

### Issue 08 — Talk show calendar

Build access levels: Public Talk, Members Talk, Circle Session, Inner Circle Live.

## 4. Phase 2 — Payment + automation

Build subscription billing, point purchase, reward redemption, referral tracking, payment confirmation, order states, webhook verification, email notification.

DoD: paid status only from verified webhook/manual finance approval, points credited only after paid, idempotency works, refund/chargeback reversal rules exist, audit logs exist.

## 5. Phase 3 — Creator dashboard

Routes: `/creator/dashboard`, `/creator/posts`, `/creator/talkshows`, `/creator/members`, `/creator/revenue`, `/creator/payouts`, `/creator/points`.

DoD: creator sees own club only, drafts posts, schedules talk show request, revenue estimate, payout request threshold/hold, Creator Points visible.

## 6. Phase 4 — PWA polish

Files: `/manifest.webmanifest`, `/service-worker.js`, `/offline.html`, `/assets/icons/*`.

DoD: Add to Home Screen works where supported, offline page works, app shell cached, no sensitive payment/admin data cached, mobile app shell feels native enough.

## 7. Phase 5 — Native app roadmap start

Do not start until PWA stable, API stable, store policy reviewed, privacy policy updated, account deletion flow ready, push notification plan ready.

## 8. QA checklist

Functional: public club loads, creator page loads, membership cards load, login gate works, app shell loads, wallet loads, rewards load, referral link copies, talk show calendar loads.

Security: guest cannot view paid, member cannot view Circle-only, Circle cannot view Inner-only, admin routes protected, creator cannot edit another creator, points cannot be adjusted client-side, payment status not trusted from URL.

UX: mobile 320/375/414/768 pass, hamburger visible, bottom nav usable, touch targets safe, no footer duplication, empty/error states friendly.

Legal: points disclaimer visible, referral terms visible, membership terms visible, no cash-out text, no investment language, no guaranteed meet language.

Performance: JS minimal, images lazy, reduced motion, first load acceptable.

## 9. Smoke test URLs

```bash
urls=(
"https://duongsaotoasang.com/club"
"https://duongsaotoasang.com/club/creators"
"https://duongsaotoasang.com/app"
"https://duongsaotoasang.com/app/wallet"
"https://duongsaotoasang.com/rewards"
"https://duongsaotoasang.com/points"
)

for url in "${urls[@]}"; do
  echo "$url"
  curl -I -L "$url" | head -n 1
done
```

## 10. Founder gate

Founder must approve screenshots mobile home, wallet, creator page, membership packages, talk show calendar, hamburger menu, evidence no duplicate footer, no cash-out language, route smoke test pass.

## 11. Suggested branches

`feature/dsts-club-public-mvp`, `feature/dsts-club-app-shell`, `feature/dsts-club-wallet-points`, `feature/dsts-club-referrals-rewards`, `feature/dsts-club-creator-dashboard`, `feature/dsts-club-pwa`.

## 12. Suggested commits

`feat: add DSTS Club public routes and membership packages`  
`feat: add mobile web app shell for DSTS Club`  
`feat: add Star Points wallet and rewards catalog`  
`feat: add referral center and anti-abuse states`  
`feat: add creator dashboard foundation`  
`feat: add PWA manifest service worker and offline shell`  
`docs: add DSTS Club legal and product specifications`
