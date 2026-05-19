# DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md

## Mục đích
Đây là file kickoff thực thi cho **Phase 1 — Web Club MVP** của DSTS Club trên `duongsaotoasang.com`.

7 file `DSTS_CLUB_*_2026.md` là outline cấp cao. File này biến outline thành sprint build đầu tiên có thể làm được thật, trong 1–2 tuần, không ôm toàn bộ hệ thống Club ngay từ đầu.

## Trạng thái hiện tại
- 7 file chiến lược = outline
- Chưa đủ để build toàn bộ hệ Club production-grade một lần
- Phase 1 phải là một **subset khả thi**, có thể lên preview nhanh, audit nhanh, rồi mới mở tiếp Phase 2+

## Nguyên tắc triển khai
1. Không build toàn bộ economy của Club trong Phase 1
2. Không chạm ngay billing, payout, point purchase, reward redemption automation
3. Không làm app mobile trong Phase 1
4. Không mở public pricing checkout cho đến khi legal/pay lane pass
5. Phase 1 chỉ build:
   - public club shell
   - creator public profile
   - paid content gating shell
   - talk show calendar
   - reward catalog tĩnh
   - waitlist / lead capture
   - nền dữ liệu đầu tiên

## Branch strategy
- Repo: `duongsaotoasang.com`
- Base branch: `main`
- Working branch: `layer-3/club-phase1-foundation`

Không commit thẳng vào `main`.

## Dependencies không được bypass
1. Donation Layer 0 phải go-live trước
2. pay.iai.one phải có contract lane riêng cho DSTS Club
3. Legal counsel chưa sign-off 16 tài liệu policy thì không public checkout
4. Creator revenue share / payout mới là outline, chưa được coi là live-ready
5. App DSTS chưa được gắn checkout flow trong sprint này

## Scope Phase 1 — build được ngay

### Public routes bắt buộc
1. `/club`
2. `/club/join`
3. `/club/creators`
4. `/club/{creator}`
5. `/club/{creator}/public`
6. `/club/{creator}/talkshows`
7. `/club/{creator}/membership`
8. `/club/{creator}/rewards`
9. `/club/faq`
10. `/club/legal`

### Account shell routes
11. `/account/library`
12. `/account/calendar`
13. `/account/wallet`

### Admin / creator routes chỉ cần skeleton
- `/creator/dashboard`
- `/admin/clubs`

## Phase 1 features phải có
### 1. Club landing page
- Hero
- Club positioning
- 3 packages summary
- featured creators
- upcoming talk shows
- reward overview
- CTA join / waitlist

### 2. Creator public profile
- avatar / hero image
- title / role
- short bio
- public content grid
- upcoming talk shows
- membership CTA
- rewards teaser

### 3. Paid content gate shell
- content card có access state
- free / member / circle / inner circle badges
- locked cards hiển thị teaser + CTA
- chưa cần entitlement engine hoàn chỉnh, nhưng phải có gating logic mô phỏng rõ ràng

### 4. Talk show calendar
- upcoming
- past
- replay-eligible flag
- access level
- timezone display
- status badge

### 5. Reward catalog static
- 3 nhóm: digital / event / experience
- hiển thị point cost
- redemption status = `coming_soon` ở Phase 1

### 6. Waitlist and lead capture
- join waitlist
- creator interest
- sponsor interest
- talk show reminder signup

## D1 schema Phase 1 — concrete subset
Tạo 6 bảng đầu tiên:
- `creators`
- `creator_profiles`
- `club_posts`
- `club_talkshows`
- `reward_catalog`
- `club_waitlist`

## D1 migration file
Tạo file:
- `database/0007_club_phase1.sql`

Migration tạo 6 bảng trên + index tối thiểu:
- `creators.slug`
- `club_posts.creator_id`
- `club_posts.visibility_tier`
- `club_talkshows.creator_id`
- `club_talkshows.starts_at`
- `reward_catalog.slug`
- `club_waitlist.interest_type`

## API contract Phase 1 — chỉ 6 endpoint
1. `GET /api/clubs`
2. `GET /api/clubs/:slug`
3. `GET /api/clubs/:slug/posts`
4. `GET /api/talkshows`
5. `GET /api/rewards/catalog`
6. `POST /api/clubs/waitlist`

## Response rules
- JSON only
- luôn có `ok`, `data`, `error`
- mọi endpoint POST phải support validation rõ
- không silent fail
- không HTML response trong API

## Acceptance criteria — 10 checkbox bắt buộc
- [ ] 10 public routes render đúng
- [ ] 3 account shell routes render đúng
- [ ] 6 API endpoints trả đúng JSON envelope
- [ ] `0007_club_phase1.sql` chạy sạch trên staging
- [ ] tạo được ít nhất 2 creator demo records
- [ ] tạo được ít nhất 4 post demo
- [ ] tạo được ít nhất 3 talk show demo
- [ ] tạo được ít nhất 6 reward demo
- [ ] waitlist form ghi được vào D1
- [ ] preview smoke 24h không lỗi P0/P1

## Explicit defer list — KHÔNG làm trong Phase 1
- subscription billing thật
- point purchase thật
- reward redemption automation
- creator payout engine
- referral ledger thật
- event QR check-in thật
- app iOS / Android
- livestream room
- sponsor dashboard
- multi-creator bundles

## 6 câu hỏi Founder phải khóa trước sprint start
1. Có seed demo creator nào đầu tiên?
2. Creator public page có dùng tên thật ngay không?
3. Talk show demo có public thật hay chỉ preview?
4. Reward catalog phase 1 có hiển thị point cost thật ngay không?
5. Waitlist data đi vào DB nào và ai là owner xử lý?
6. Club page đặt nổi bật ở homepage duongsaotoasang.com ở mức nào?

## Estimate trung thực
- 1 dev: khoảng 70–80 giờ
- 2 dev: khoảng 35–45 giờ
- 1 tuần nếu có 2 dev full focus
- 2 tuần nếu 1 dev làm sạch + có QA

## Kết luận
Sprint này chỉ được hiểu là:

> **Phase 1 Web Club MVP foundation**

Không được hiểu là:
- hoàn thành toàn bộ club economy
- hoàn thành payout
- hoàn thành mobile app
- hoàn thành reward system production-grade
- hoàn thành legal/payment rollout
