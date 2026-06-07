# DSTS CLUB — MASTER INDEX 2026

**Project:** Đường Sao Tỏa Sáng / duongsaotoasang.com  
**Product:** DSTS Club  
**Version:** v1.0 — Founder Review Draft  
**Status:** Pre-dev blueprint, chờ Founder duyệt trước khi chuyển sang ticket dev  
**Primary rule:** Web-first. PWA/mobile-browser app first. Native iOS/Android later.  
**Legal rule:** Star Points không phải tiền, không phải tài sản đầu tư, không có quyền quy đổi thành tiền mặt trong giai đoạn đầu.

## 1. Mục tiêu của bộ tài liệu

Bộ file này khóa toàn bộ kế hoạch DSTS Club để team product/dev/legal/content cùng hiểu một hệ thống:

- Club hai lớp: public + paid.
- 3 gói thành viên: Member / Circle / Inner Circle.
- Người nổi tiếng được hiểu rộng: nghệ sĩ, doanh nhân, chuyên gia, người có trí tuệ, người có cống hiến, nhân vật Người Việt Muôn Nơi.
- Fans trả phí, tích điểm, giới thiệu, đổi đặc quyền.
- Creators cũng tích điểm theo đóng góp.
- Có talk show, reward shop, ví điểm, referral, payout, sponsor, app PWA và roadmap native app.
- Điểm không được thiết kế như tiền, token, investment, crypto hoặc ví điện tử trong phase đầu.

## 2. Bộ file chính

| File | Vai trò |
|---|---|
| `01_DSTS_CLUB_CREATOR_FAN_MEMBERSHIP_MASTER_PLAN_2026.md` | Master plan sản phẩm và chiến lược |
| `02_DSTS_CLUB_POINTS_WALLET_REFERRAL_REWARDS_SPEC_2026.md` | Kinh tế điểm, ví, referral, reward shop |
| `03_DSTS_CLUB_REVENUE_SHARE_CREATOR_PAYOUT_SPEC_2026.md` | Chia doanh thu, creator payout, creator points |
| `04_DSTS_CLUB_WEB_PWA_MOBILE_BROWSER_APP_SPEC_2026.md` | App chạy trực tiếp trên trình duyệt sau đăng nhập, PWA |
| `05_DSTS_CLUB_NATIVE_APP_IOS_ANDROID_ROADMAP_2026.md` | Roadmap native app Android/iOS |
| `06_DSTS_CLUB_DATA_MODEL_API_CONTRACT_2026.md` | Data model, API, permission, access control |
| `07_DSTS_CLUB_TERMS_POLICY_LEGAL_REQUIREMENTS_2026.md` | Bộ điều khoản riêng cho Club |
| `08_DSTS_CLUB_DEV_EXECUTION_PHASES_AND_DOD_2026.md` | Phase dev, tickets, Definition of Done |

## 3. Founder decisions đã chốt trong bản này

1. Tên chính: **DSTS Club**.
2. Tên chiến lược: **Club of Influence, Wisdom, Contribution and Access**.
3. 3 gói: **Member / Circle / Inner Circle**.
4. Giá launch: **99K / 299K / 990K VND mỗi tháng** hoặc **5 / 15 / 49 USD**.
5. Star Points là điểm nội bộ, không quy đổi tiền mặt trong phase đầu.
6. 1 điểm = 1.000 VND giá mua cơ sở.
7. Creator cũng có Creator Contribution Points.
8. Referral points có trạng thái pending → earned → clawed_back.
9. Reward shop chia 3 tầng: digital / event / experience.
10. Direct Experience là apply-only, không public bán đại trà.
11. Membership pool: 50 / 30 / 20.
12. Talk show split: 60 / 40.
13. Premium experience split: 70 / 30.
14. Mọi split tính trên **net revenue** sau phí payment, refund, chargeback, tax, direct event cost nếu có.
15. Mobile app phase đầu là **PWA/mobile-browser app** sau login.
16. Native app phase 1 là engagement-first, chưa ưu tiên checkout trong app.

## 4. Không được làm trong phase đầu

- Không gọi Star Points là tiền.
- Không cho cash-out điểm.
- Không gọi điểm là token, coin, crypto, chứng khoán, tài sản đầu tư.
- Không public claim “kiếm tiền dễ dàng”.
- Không cam kết creator có doanh thu.
- Không cam kết fan chắc chắn gặp riêng nếu gói không ghi rõ.
- Không dùng referral như mô hình đa cấp tài chính.
- Không mở in-app checkout trên iOS/Android trước khi legal/app-store review xong.
- Không dùng nội dung paid mà không có content license policy.
- Không mở chức năng DM riêng fan ↔ creator nếu chưa có moderation.

## 5. Kiến trúc tổng thể

```text
duongsaotoasang.com
  ├─ /club
  ├─ /club/creators
  ├─ /club/{creator}
  ├─ /club/{creator}/talkshows
  ├─ /club/{creator}/membership
  ├─ /club/{creator}/rewards
  ├─ /account
  ├─ /account/wallet
  ├─ /account/referrals
  ├─ /account/rewards
  ├─ /creator/dashboard
  └─ /admin
```

## 6. Gate trước khi dev

- Founder duyệt giá, tên, điểm, revenue split.
- Legal duyệt Points & Rewards Policy.
- Payment owner duyệt payment lane.
- Product owner duyệt scope PWA.
- Tech lead duyệt schema/API.
- No code claim “done” without smoke test, screenshots, and route evidence.
