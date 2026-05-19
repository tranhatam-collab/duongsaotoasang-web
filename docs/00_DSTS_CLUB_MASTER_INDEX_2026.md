# 00_DSTS_MASTER_INDEX_2026.md

## Mục đích
Đây là file chỉ mục tổng để team dev, content, legal và ops biết thứ tự đọc và áp dụng bộ DSTS Club.

## Layer structure

### Layer 1 — Strategic and product docs
1. `DSTS_CLUB_MASTER_PRODUCT_PLAN_2026.md`
2. `DSTS_CLUB_WEB_APP_INFORMATION_ARCHITECTURE_2026.md`
3. `DSTS_CLUB_PRICING_POINTS_AND_REVENUE_SYSTEM_2026.md`
4. `DSTS_CLUB_CREATOR_PAYOUT_AND_PARTNER_MODEL_2026.md`
5. `DSTS_CLUB_TERMS_POLICY_MATRIX_2026.md`
6. `DSTS_CLUB_DATABASE_AND_API_SPEC_2026.md`
7. `DSTS_CLUB_DEV_ROADMAP_2026.md`

### Layer 2 — Build kickoff docs
8. `DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md`
9. `0007_club_phase1.sql`

## Cách đọc đúng

### Founder / PM
Đọc theo thứ tự:
1 → 2 → 3 → 4 → 5 → 7 → 8

### Dev lead
Đọc theo thứ tự:
8 → 6 → 2 → 7 → 9

### Legal / policy
Đọc theo thứ tự:
5 → 3 → 4 → 8

### Content team
Đọc theo thứ tự:
1 → 2 → 5

## Trạng thái bộ tài liệu
- 7 file `DSTS_CLUB_*_2026.md` = outline cấp cao + master direction
- `DSTS_CLUB_DEV_KICKOFF_PROMPT_2026.md` = sprint build prompt thực thi cho Phase 1
- `0007_club_phase1.sql` = migration khởi động cho subset Phase 1

## Cảnh báo bắt buộc
Bộ 7 file chiến lược **không đủ** để build toàn bộ hệ Club trong một lệnh production-grade.
Phase 1 phải đi theo kickoff prompt, build subset khả thi trước, rồi mới Wave 2 chi tiết.

## Dependencies không được bỏ qua
1. Donation Layer 0 phải go-live trước
2. pay.iai.one cần contract lane riêng cho DSTS Club
3. Legal counsel chưa sign-off thì không public checkout
4. App phase 1 không ưu tiên checkout trong app
