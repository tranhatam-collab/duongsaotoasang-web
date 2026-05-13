# DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES — v1.0

> **Mã tài liệu:** `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES_2026-05-13`
> **Trạng thái:** 🟡 DRAFT — chờ Legal Counsel review trước khi áp dụng public
> **Owner R:** Legal Advisor · **Approver A:** Founder + Legal Counsel · **Áp cho:** Layer 0/1/2 (toàn DSTS + NDNUM)
> **Tham chiếu nền tảng:**
> - `dsts-master-plan-v1.1-LOCKED.md` (7 nguyên tắc bất biến)
> - `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` (Guardian-first flow)
> - **Nghị định 03/2026/NĐ-CP** hiệu lực 2026-03-01 (13 nhóm nghĩa vụ minh bạch tổ chức từ thiện)
> - GDPR (EU) · CCPA (California) · COPPA (US, dưới 13 tuổi)
> - Brandpro Manifesto 6 nguyên tắc

---

## 0. MỤC LỤC

1. Khung pháp lý áp dụng
2. Privacy Rules — quyền riêng tư người dùng
3. Trust Rules — không hứa hẹn, không thao túng
4. Transparency Rules — minh bạch theo NĐ 03/2026
5. Special Rules — trẻ em (NDNUM Tầng 1)
6. Special Rules — payment + sponsor
7. Special Rules — public showcase
8. Cookie Policy
9. Data Retention + Right to Erasure
10. Audit + Compliance log
11. Breach response runbook
12. Phụ lục — câu chuẩn copy

---

## 1. KHUNG PHÁP LÝ ÁP DỤNG

| Luật / Quy định | Lãnh thổ | Khi nào áp |
|---|---|---|
| **Nghị định 03/2026/NĐ-CP** (Quản lý hoạt động từ thiện) | Việt Nam | Khi DSTS/NDNUM nhận tiền donate/tài trợ tại VN |
| Luật An toàn thông tin mạng 2015 (sửa đổi 2022) | Việt Nam | Khi xử lý dữ liệu cá nhân VN |
| Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân | Việt Nam | Khi xử lý PII VN |
| **GDPR** (Regulation 2016/679) | EU + EEA | Khi có user EU, cookie banner bắt buộc |
| **CCPA** + CPRA | California, US | Khi có user CA, "Do Not Sell" link |
| **COPPA** | US (trẻ em < 13) | KHÔNG thu thập dữ liệu trẻ < 13 không qua phụ huynh |
| **PIPEDA** | Canada | Khi pháp nhân Canada hoạt động |

**Quy tắc chung:** Khi luật mạnh nhất xung đột với luật yếu, **luôn áp luật mạnh nhất** (vd GDPR cookie consent thay vì opt-out đơn giản).

---

## 2. PRIVACY RULES — QUYỀN RIÊNG TƯ NGƯỜI DÙNG

### 2.1 Nguyên tắc lõi

1. **Privacy-first** — không thu thập dữ liệu khi chưa cần
2. **Purpose-limit** — chỉ dùng cho mục đích đã công bố
3. **Data-minimization** — thu thập tối thiểu, không "phòng hờ"
4. **User-own-data** — user có thể export + xóa bất cứ lúc nào
5. **No-tracking** — không Google Analytics behavioral, không pixel ads, không heatmap
6. **No-third-party-sell** — không bán/cho thuê PII cho bên thứ ba

### 2.2 PII thu thập + lý do

| Field | Khi thu | Mục đích | Retention |
|---|---|---|---|
| Email | Đăng ký, contact form | Liên lạc + auto-reply | Active acc: vô hạn · Deleted: 30 ngày hard delete |
| Tên | Đăng ký | Hiển thị + email | Như trên |
| Quốc gia | Quiz, Star Profile | Phân loại + Diaspora Map (opt-in) | Như trên |
| Tin nhắn contact | Contact form | Trả lời support | Active: 2 năm · Deleted: 30 ngày |
| Payment data | Stripe (khi có) | Stripe xử lý, DSTS KHÔNG lưu card | Stripe TOS |
| IP + User-Agent | Server log | Security + abuse detection | 90 ngày auto-delete |

### 2.3 Cấm tuyệt đối

- ❌ Lưu password plaintext
- ❌ Lưu credit card / CVV
- ❌ Lưu chứng minh nhân dân / passport scan trừ khi pháp luật yêu cầu (vd KYC sponsor ≥ 25K USD)
- ❌ Lưu vị trí GPS chính xác
- ❌ Thu dữ liệu trẻ em < 13 không qua phụ huynh (xem Mục 5)

### 2.4 User rights (GDPR + NĐ 13/2023)

User có quyền (DSTS phải cung cấp trong 30 ngày):

1. **Access** — export toàn bộ dữ liệu cá nhân thành JSON
2. **Rectification** — sửa dữ liệu sai
3. **Erasure** — xóa tài khoản + cascade delete (trừ audit log pháp lý)
4. **Portability** — export định dạng standard (JSON Schema)
5. **Object** — phản đối xử lý (vd tắt email marketing)
6. **Withdraw consent** — rút consent bất cứ lúc nào

Endpoint user-facing: `/account/privacy` (sau Layer 2 ready) hoặc email `privacy@duongsaotoasang.com`.

---

## 3. TRUST RULES — KHÔNG HỨA HẸN, KHÔNG THAO TÚNG

Bám 7 nguyên tắc bất biến từ `dsts-master-plan-v1.1-LOCKED.md` Mục VIII.

### 3.1 Câu KHÔNG được phép xuất hiện

❌ "Chúng tôi giúp bạn nổi tiếng"
❌ "Đảm bảo X triệu doanh thu / năm"
❌ "Trở thành ngôi sao trong 90 ngày"
❌ "Cam kết kết quả truyền thông"
❌ "Bí quyết thành công cho người Việt"

### 3.2 Câu CHUẨN thay thế

✅ "Chúng tôi giúp bạn nhìn rõ điểm sáng của mình, xây lộ trình đúng, hành động đều, tạo hồ sơ có minh chứng và kết nối với cộng đồng phù hợp."

✅ "DSTS không cam kết kết quả về nổi tiếng, doanh thu, thành công hay hiệu quả truyền thông. Mọi giá trị tạo ra phụ thuộc vào hành trình thật của khách hàng."

### 3.3 Dark pattern ban

- ❌ Countdown timer giả ("Chỉ còn 3 phút!")
- ❌ Fake scarcity ("Chỉ còn 2 chỗ" khi thực tế còn nhiều)
- ❌ Pre-checked consent box
- ❌ "Cancel anytime" mà ẩn nút cancel
- ❌ "Free trial" tự chuyển paid không thông báo trước
- ❌ Một trang giá / một trang khác giá (split test giá sai sự thật)

### 3.4 Review label rule

Mọi review/testimonial trên site:
- Nếu review tĩnh (chưa có D1 storage thật): **bắt buộc gắn nhãn "Đánh giá minh họa — chưa phải phản hồi khách hàng thật"**
- Khi có D1 + moderation: hiển thị "Đánh giá khách hàng đã xác minh" + ngày
- KHÔNG bao giờ post review giả

---

## 4. TRANSPARENCY RULES — NĐ 03/2026/NĐ-CP

### 4.1 Tóm tắt NĐ 03/2026

Áp dụng cho tổ chức/cá nhân vận động, tiếp nhận tài sản, thực hiện hoạt động vận động đóng góp tại VN. Yêu cầu công khai **đầu vào + đầu ra** trước **31/03 hàng năm**.

### 4.2 13 nhóm nghĩa vụ minh bạch (DSTS cần đối chiếu)

| # | Nghĩa vụ | DSTS làm gì |
|---|---|---|
| 1 | Công bố mục tiêu vận động | `/donate` + `/transparency` |
| 2 | Công bố tổ chức/cá nhân chịu trách nhiệm | Footer + `/legal#entity` |
| 3 | Công bố hình thức nhận | `/donate` mục Hình thức |
| 4 | Công bố tổng số tiền/tài sản nhận | Báo cáo Q + Annual |
| 5 | Công bố nguồn nhận (anonymous OK) | Tracker public — donors có thể ẩn tên |
| 6 | Công bố mục đích sử dụng | Báo cáo per project |
| 7 | Công bố tiến độ sử dụng | Quarterly milestone report |
| 8 | Công bố số tiền còn lại | Annual financial summary |
| 9 | Công bố chi phí vận hành | Cost breakdown public |
| 10 | Công bố kế hoạch tiếp theo | Roadmap section trong `/transparency` |
| 11 | Lưu trữ chứng từ ≥ 5 năm | Internal D1 + offsite backup |
| 12 | Audit định kỳ | Yearly external audit khi ≥ 100K USD |
| 13 | Báo cáo cơ quan có thẩm quyền | Annual report submit cơ quan VN khi tổ chức VN |

### 4.3 Trang `/transparency` bắt buộc có

- Trạng thái quỹ hiện tại (đang chuẩn bị / đã mở / tạm đóng)
- 4 báo cáo: Dòng tiền · Hoạt động · Dự án · Nguyên tắc công bố
- Lịch update định kỳ (hàng quý + hàng năm)
- Link Annual Report PDF (khi có)
- Email báo cáo: `transparency@duongsaotoasang.com`

---

## 5. SPECIAL RULES — TRẺ EM (NDNUM Tầng 1)

Áp **Guardian-first flow** theo `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục IV.

### 5.1 Quy tắc cứng

1. ❌ **KHÔNG** thu thập PII trẻ em < 13 mà không qua phụ huynh/người giám hộ (COPPA)
2. ❌ **KHÔNG** profile public của trẻ em (kể cả opt-in)
3. ❌ **KHÔNG** 1:1 adult ↔ trẻ em dưới mọi hình thức
4. ❌ **KHÔNG** chat trực tiếp / gọi điện trẻ em qua nền tảng
5. ❌ **KHÔNG** lưu hình ảnh / video trẻ em mà chưa có Media Release Consent ký bởi phụ huynh
6. ✅ Phụ huynh là **chủ tài khoản**, child profile **internal-only**
7. ✅ Mentor Coordinator có lương, **xác minh hồ sơ tư pháp**, được train Child Safety Policy
8. ✅ Mọi interaction qua **Coordinator + supervised group setting** (≥ 3 người lớn)
9. ✅ Phụ huynh có quyền xem **mọi log** liên quan trẻ em mình
10. ✅ Phụ huynh có quyền xóa toàn bộ data trẻ trong **7 ngày** (không phải 30)

### 5.2 Consent flow bắt buộc

```
Phụ huynh đăng ký tài khoản DSTS
  → Verify identity (CMND/passport optional, email + SMS bắt buộc)
  → Đọc + ký 3 consent:
      1. Parent Consent for Child Registration
      2. Photo/Video Media Release (opt-in, có thể từ chối)
      3. Sponsor Communication Consent (nhận báo cáo 2 lần/năm)
  → Tạo child profile internal-only
  → Mentor Coordinator được assign
  → Phụ huynh nhận monthly status report
```

### 5.3 Báo cáo Child Safety Officer

DSTS bắt buộc có **Child Safety Officer (CSO)** độc lập, báo cáo trực tiếp Board (không qua Founder). CSO:
- Audit mọi mentor onboarding
- Audit mọi consent flow
- Audit mọi interaction log hàng quý
- Có quyền dừng program nếu phát hiện vi phạm

---

## 6. SPECIAL RULES — PAYMENT + SPONSOR

### 6.1 Payment disclaimer bắt buộc

Mọi trang có giá > $1,000 USD:

```
Đây là quy trình xác nhận thủ công. Thanh toán chỉ được xử lý
sau khi đội ngũ xác minh chuyển khoản và mã giao dịch.

DSTS không cam kết kết quả về nổi tiếng, doanh thu, thành công
hay hiệu quả truyền thông. Mọi giá trị tạo ra phụ thuộc vào
hành trình thật của khách hàng và sự hợp tác chủ động giữa hai bên.

Đọc chi tiết: /legal#terms · /legal#refund · /legal#privacy
```

### 6.2 KYC khi sponsor ≥ 25K USD

Sponsor ≥ $25K USD/lần phải:
- Verify identity (corp registration hoặc passport scan)
- Source of funds declaration
- Sign Sponsor Agreement (template trong `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md`)
- AML check (anti-money-laundering, basic OFAC list check)

### 6.3 Refund policy gọn

- < 14 ngày từ ngày mua: refund 90% (giữ 10% admin fee), trừ phí Stripe
- 14-30 ngày: refund 50%
- > 30 ngày: case-by-case, không tự động
- T4 Script Journey 1:1: cooling period 14 ngày → refund 90%, sau đó milestone-based (50% nếu cancel sau milestone 1)
- Donate/Sponsor: KHÔNG refund (theo NĐ 03/2026 vì đã ghi vào báo cáo công khai), trừ trường hợp gian lận

---

## 7. SPECIAL RULES — PUBLIC SHOWCASE

Áp khi Layer 2 (Star Showcase) ready.

### 7.1 Opt-in mandatory

Mọi public profile (Star Showcase, Diaspora Map) phải:
- ✅ User opt-in explicit (không pre-checked)
- ✅ Preview trước khi publish
- ✅ Revoke anytime → hide trong 24h
- ❌ Không hiển thị email/phone public mặc định
- ❌ Không indexable Google nếu user chọn "private link only"

### 7.2 Verification

Star Showcase verified phải có:
- ≥ 1 evidence link xác minh (LinkedIn, official site, news article)
- Manual review bởi Star Council (3 tháng đầu Founder kiêm)
- Review hàng năm (annual renewal)

### 7.3 Take-down policy

DSTS có quyền take down profile/content nếu:
- Vi phạm Manifesto (hứa kết quả, fake claim)
- Vi phạm pháp luật VN/US
- Vi phạm bản quyền
- Bị 3+ user report + review xác nhận

Take-down notice gửi user 7 ngày trước (trừ trường hợp khẩn cấp legal).

---

## 8. COOKIE POLICY

### 8.1 3 loại cookie

| Loại | Cần consent? | Mục đích | Sample |
|---|---|---|---|
| Strictly Necessary | KHÔNG | Login session, CSRF | `dsts_session` |
| Functional | Tùy chọn (opt-in) | Theme dark/light, language | `dsts_pref_lang` |
| Analytics | OPT-IN bắt buộc (GDPR) | GA4 hoặc Plausible | `_ga`, `plausible_*` |

DSTS KHÔNG dùng:
- ❌ Marketing cookies (Facebook pixel, Google Ads)
- ❌ Tracking cross-site
- ❌ Fingerprinting

### 8.2 Cookie banner UI

```
[Banner xuất hiện lần đầu]
"Chúng tôi dùng cookie để vận hành site. Cookies phân tích chỉ được
bật khi bạn chọn 'Bật phân tích'."

[Chấp nhận tất cả] [Chỉ cookie cần thiết] [Bật phân tích] [Cài đặt]
```

Không countdown. Không pre-checked. Có thể đổi ý ở `/account/privacy`.

---

## 9. DATA RETENTION + RIGHT TO ERASURE

| Loại data | Active acc | Deleted acc | Pháp lý buộc |
|---|---|---|---|
| User profile + email | Vô hạn | 30 ngày hard delete | – |
| Payment receipt | 7 năm | 7 năm (audit) | NĐ 03/2026 + tax law |
| Audit log | 7 năm | 7 năm | NĐ 03/2026 |
| Server log (IP, UA) | 90 ngày | 90 ngày | – |
| Contact message | 2 năm | 30 ngày | – |
| Star Mark / Receipt | Vô hạn | Anonymize sau 30 ngày | Có thể giữ aggregated stat |
| Cookie | TTL theo loại | – | – |

Cascade delete flow khi user xóa account:
1. User click "Delete my account" trong `/account/privacy`
2. Send confirmation email (link expire 7 ngày)
3. User confirm → soft delete (account inactive)
4. T+30 ngày: hard delete PII, anonymize Star Mark
5. T+7 năm: audit log auto-purge

---

## 10. AUDIT + COMPLIANCE LOG

Mọi action sensitive ghi vào `audit_logs` table:
- Login / logout / failed login
- Password change
- Email change
- Profile public / private toggle
- Star Mark issued / revoked
- Payment success / refund
- Data export request
- Account deletion

Audit log:
- Immutable (append-only)
- Encrypted at rest
- Retained 7 năm
- Accessible by: Founder + CSO + external auditor (yearly)

---

## 11. BREACH RESPONSE RUNBOOK

Khi phát hiện data breach (PII leak, unauthorized access):

### Trong 24 giờ
- [ ] Stop the bleeding — revoke compromised credentials
- [ ] Lock affected accounts
- [ ] Inform Founder + CSO + Legal Counsel
- [ ] Document timeline + scope

### Trong 72 giờ
- [ ] Notify affected users (email)
- [ ] Notify regulator nếu yêu cầu (GDPR Article 33 EU users · NĐ 13/2023 VN)
- [ ] Public statement nếu > 100 users affected

### Trong 30 ngày
- [ ] Root cause analysis report
- [ ] Patch + verify
- [ ] Update privacy policy nếu cần
- [ ] Lessons learned doc trong `_artifacts/breach-<date>.md`

---

## 12. PHỤ LỤC — CÂU CHUẨN COPY

### A. Footer disclosure

```
Đường Sao Tỏa Sáng (DSTS) là một nhánh hành trình trong hệ Muôn Nơi.
Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý.
© 2026 DSTS · /transparency · /legal · /contact
```

### B. Payment disclaimer (đặt trên mọi /scripts/* có giá)

Xem Mục 6.1.

### C. Donate disclaimer (đặt trên /donate)

```
Trạng thái hiện tại: đang chuẩn bị, chưa mở nhận đóng góp đại chúng.

Mọi nguồn lực được công bố minh bạch theo Nghị định 03/2026/NĐ-CP.
Quỹ chỉ mở khi pháp nhân vận hành, quy trình xác nhận, biên nhận
và báo cáo minh bạch đã sẵn sàng đầy đủ.

Liên hệ trước khi đóng góp: /contact
```

### D. Cookie banner

Xem Mục 8.2.

### E. Child program intro (NDNUM landing, khi có)

```
Chương trình Nuôi Dưỡng Những Ước Mơ áp Guardian-first flow.
Phụ huynh là chủ tài khoản. Trẻ em không có public profile.
Không 1:1 giữa adult mentor và trẻ em dưới mọi hình thức.
Phụ huynh có quyền xem mọi log, xóa data trong 7 ngày, rút khỏi
chương trình bất cứ lúc nào.

Đọc đầy đủ Child Safety Policy: /legal#child-safety
```

---

## CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-05-13 | Claude + Founder | Tạo lần đầu, đối chiếu NĐ 03/2026 + GDPR + COPPA + Manifesto |

---

## APPROVAL

- [ ] Founder review toàn bộ
- [ ] Legal Counsel VN review Mục 1, 4, 5, 6, 9
- [ ] Legal Counsel US review Mục 1, 5 (COPPA + CCPA)
- [ ] CSO review Mục 5, 11
- [ ] Tech Lead review Mục 9, 10 (implementation)

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là source of truth cho mọi quyết định liên quan privacy + trust + transparency. Mọi PR thay đổi UX có animation thu PII phải ref file này. Mọi nội dung public phải pass Manifesto Compliance Linter (đề xuất build trong DSTS_RELEASE_QA_100_SCORE_CHECKLIST.md).*

---

## DEV-READY — Implementation hooks (Wave 2, 2026-05-13)

### Component cần build

- **Cookie banner component** (`<CookieConsent>`) — hiển thị khi user load lần đầu, lưu choice vào localStorage + cookie (`dsts_consent`). 3 cấp: analytics, marketing, essential (essential always on).
- **Privacy preference center** (`/account/privacy`) — Wave 3 NDNUM Consent Flow sẽ build full; Wave 2 stub: page render consent status + opt-out

### Audit log table schema (preliminary)

Wave 2 set up minimal table; Wave 3 NDNUM Consent Flow sẽ expand:

```sql
-- migrations/00XX_audit_log.sql (Wave 2 hoặc Phase 1.2)
CREATE TABLE IF NOT EXISTS audit_log (
  id              TEXT PRIMARY KEY,
  user_id         TEXT,
  ip_hash         TEXT NOT NULL,
  event_type      TEXT NOT NULL,
  resource_type   TEXT,
  resource_id     TEXT,
  before_state    TEXT,
  after_state     TEXT,
  metadata        TEXT,
  user_agent      TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
```

### Endpoint stub (Wave 2 stub, Wave 3 full)

- `GET /api/account/privacy/status` — return current consent state
- `POST /api/account/privacy/update` — update consent
- `POST /api/account/privacy/export` — GDPR Article 15 data export
- `POST /api/account/privacy/delete` — GDPR Article 17 data deletion

Full implementation: Wave 3 `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md`.

### Cross-reference

- `dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` Mục IV (guardian-first cho trẻ em < 18)
- Wave 3 `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` sẽ định nghĩa chi tiết consent flow cho child profile

### CHANGELOG entry

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 (DRAFT) | 2026-05-13 | Codex + Founder | Privacy + trust + transparency rules |
| v1.0-DEV-READY | 2026-05-13 | Claude + Founder | Wave 2 W2.T6: append component + audit log schema + endpoint stub |
