# CHƯƠNG TRÌNH "NUÔI DƯỠNG NHỮNG ƯỚC MƠ" — v1.2-LOCKED

> 🔒 **LOCKED (doc scope)** — 2026-05-13
> Cấu trúc chương trình đã khóa. 7 spec con DRAFT v1.0 đã file (Wave 3).
> Co-review bởi Legal Counsel VN + US + CSO bắt buộc trước khi nâng lên v2.0-LEGAL-LOCKED.
> 3 Founder decisions còn pending: FD-1 (pháp nhân), FD-2 (fiscal sponsor), FD-4 (Investment Lane Y1).

**Tên đầy đủ:** Nuôi Dưỡng Những Ước Mơ — Dream Nurture Journey
**Tên ngắn:** **NDNUM** (nội bộ) · **Dream Nurture** (quốc tế)
**Đơn vị tổ chức:** *(xem Mục X + NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md — chờ Founder Decision FD-1)*
**Founder:** Trần Hà Tâm
**Phiên bản:** v1.2-LOCKED (doc scope)
**Ngày phát hành:** 2026-05-13
**Trạng thái:** Cấu trúc locked. Chờ Legal Counsel + CSO co-review trước v2.0-LEGAL-LOCKED.

---

## 🔧 CHANGELOG

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.2-LOCKED | 2026-05-13 | 7 spec con DRAFT v1.0 filed (Wave 3). Doc scope locked. Pending: Legal/CSO co-review + 3 Founder decisions (FD-1, FD-2, FD-4). |
| v1.1-REVIEWED | 2026-05-13 | Apply 7 sửa từ review. Chèn Phase 0B. Thêm 7 spec con TBD (Mục XV). |
| v1.0 | 2026-05-12 | Tạo ban đầu. |

### Chi tiết v1.0 → v1.1-REVIEWED

| # | Sửa | Trước (v1.0) | Sau (v1.1-REVIEWED) |
|---|---|---|---|
| 1 | Pháp lý VN | "Thanh Tam Foundation đăng ký theo Luật Tổ chức từ thiện 2013" | Đối chiếu Nghị định 03/2026/NĐ-CP (hiệu lực 01/03/2026), placeholder cho đến khi xác minh |
| 2 | Tầng 1 architecture | Trẻ em tự đi qua product engine | **Guardian-first flow** — phụ huynh là chủ tài khoản, trẻ em chỉ có child profile nội bộ |
| 3 | "Dream Buddy 30 phút/tháng" | Mâu thuẫn với "không 1:1" | **Không 1:1 dưới mọi hình thức** — luôn có phụ huynh hoặc điều phối viên |
| 4 | Ghi âm | "Ghi âm 1 năm" mặc định | **Log session mặc định, chỉ ghi âm khi có consent rõ ràng** |
| 5 | 3 dòng tiền | Tách chiến lược | **Legal firewall** — 3 lane không cross-subsidize, có pháp lý + KYC riêng |
| 6 | KPI tài chính | 100M Year 3 | Year 1: 100k-500k, Y2: 1-3M, Y3: 5-10M, **2030 North Star 100M** |
| 7 | Membership tier | 5 tier (free→49 USD) | **4 tier ban đầu** (free, 9, 29, 99/năm, Patron apply-only) |

**Thêm:**
- Phase 0B (Legal + Child Safety Lock) **trước** Phase 1
- 7 spec con bắt buộc (Mục XV)
- Friends of the Children benchmark (mentor có lương, theo trẻ K-12, không phải volunteer cảm hứng)

---

## MỤC LỤC

- [I. Tại sao chương trình này tồn tại](#i)
- [II. 5 Tầng đối tượng — không giới hạn tuổi](#ii)
- [III. Mô hình "Tỏa sáng kép"](#iii)
- [IV. Kiến trúc Tầng 1 — Guardian-first Flow](#iv)
- [V. Mô hình mentor — chuyên nghiệp có lương + tình nguyện viên](#v)
- [VI. Sản phẩm cho từng tầng (đã chỉnh)](#vi)
- [VII. 3 dòng tiền với LEGAL FIREWALL](#vii)
- [VIII. Kịch bản có thể bán / sáng tạo / đóng góp](#viii)
- [IX. Mô hình DSTS × Muôn Nơi](#ix)
- [X. Pháp lý — đối chiếu Nghị định 03/2026/NĐ-CP](#x)
- [XI. Roadmap 5 giai đoạn (đã chèn 0B legal lock)](#xi)
- [XII. KPI realistic (đã hạ về thực tế)](#xii)
- [XIII. Bảo vệ trẻ em — chuẩn cứng](#xiii)
- [XIV. Risk register + 12 nguyên tắc bất biến](#xiv)
- [XV. 7 spec con bắt buộc](#xv)
- [XVI. Founder approval gates](#xvi)

---

## I. TẠI SAO CHƯƠNG TRÌNH NÀY TỒN TẠI

*(Giữ nguyên Mục I của v1.0 — vision không thay đổi)*

### I.1 Vấn đề thật
- Trẻ em Việt thiếu người định hướng, sinh viên thiếu mentor, người trưởng thành lạc lối, người đã thành công thiếu kênh trao đi
- Chương trình hiện có hoặc quá ngắn hoặc quá hẹp hoặc quá đắt
- Diaspora Việt thiếu nền tảng tỏa sáng đúng giá trị

### I.2 Giải pháp NDNUM
Một chương trình duy nhất, vận hành liên tục, 5 lớp đối tượng, ai cũng tìm được vị trí. Mỗi người vừa nhận vừa cho.

### I.3 Khác biệt cốt lõi
**Không bán hào quang. Không cam kết nổi tiếng. Cam kết hành trình có hệ thống, có minh chứng, có cộng đồng.**

---

## II. 5 TẦNG ĐỐI TƯỢNG

*(Giữ định nghĩa 5 tầng, nhưng cập nhật Tầng 1 theo Mục IV)*

| Tầng | Tên | Tuổi | Pháp lý đặc biệt |
|---|---|---|---|
| 1 | **Mầm Sáng** | 5-12 | **Guardian-first**, COPPA, Luật Trẻ em VN |
| 2A | Bước Vào Đời — học sinh | 13-17 | Vẫn cần consent phụ huynh, opt-in profile public |
| 2B | Bước Vào Đời — sinh viên | 18-22 | Tự chủ, ký hợp đồng được |
| 2C | Bước Vào Đời — mới đi làm | 22-25 | Tự chủ, có thể nhận đầu tư |
| 3 | Người Đang Tỏa Sáng | 25-50 | Khách hàng Script Journey |
| 4 | Người Đã Thành Công | 40+ | Sponsor, mentor, Legacy |
| 5 | Cộng Đồng Tỏa Sáng | mọi tuổi | Fan, supporter, có membership |

---

## III. MÔ HÌNH "TỎA SÁNG KÉP"

*(Giữ nguyên — đây là DNA cốt lõi không thay đổi)*

```
Tầng 4 → cho tiền + mentor time → Tầng 3
Tầng 3 → mentor time + mua product → Tầng 2
Tầng 2 → mentor time + nội dung → Tầng 1
Tầng 1 → cảm hứng + câu chuyện → toàn hệ
Tầng 5 → traffic + share + donate nhỏ → toàn hệ
```

**Nguyên tắc:** Mọi người đều có vai trò cho đi. Tỏa sáng = được nhìn thấy đúng giá trị (không phải nổi tiếng). Vận hành 365 ngày.

---

## IV. KIẾN TRÚC TẦNG 1 — GUARDIAN-FIRST FLOW 🔧 SỬA CHÍNH

Đây là **sửa kiến trúc lớn nhất** so với v1.0.

### IV.1 Nguyên tắc nền

> **Trẻ em không có tài khoản trên hệ thống. Phụ huynh/người giám hộ là chủ tài khoản. Trẻ em chỉ có child profile nội bộ, gắn vào tài khoản phụ huynh.**

### IV.2 Cấu trúc dữ liệu

```
Account (phụ huynh hoặc người giám hộ)
   ↓
   ├── Profile phụ huynh (public OK, opt-in)
   ├── Child Profile #1 (INTERNAL ONLY, không public)
   │     ├── Tên trẻ (chỉ tên đầu, không họ đầy đủ public)
   │     ├── Tuổi
   │     ├── Vùng (tỉnh/thành, không địa chỉ chi tiết)
   │     ├── Sở thích / ước mơ
   │     └── Mentor coordinator được phân
   └── Child Profile #2 (nếu có nhiều con)
```

### IV.3 Quy tắc cứng

| Quy tắc | Mô tả |
|---|---|
| 1. Không tài khoản trẻ em | Trẻ <13 không có account riêng. Trẻ 13-17 có account "thiếu niên" với supervisor là phụ huynh |
| 2. Không public child profile | Child profile **không bao giờ** hiển thị public, không trên Diaspora Map, không trên showcase |
| 3. Không DM giữa adult và trẻ em | Hệ thống KHÔNG có chat 1:1 giữa adult mentor và trẻ em. Mọi tin nhắn đều qua điều phối viên hoặc phụ huynh |
| 4. Không comment công khai | Trẻ em không tham gia comment công khai. Mọi feedback đi qua phụ huynh |
| 5. Không thu thập dữ liệu quá mức | Chỉ thu thập dữ liệu **cần thiết** để vận hành chương trình. Không thu thập số điện thoại trẻ em, email cá nhân của trẻ em |
| 6. Verifiable parental consent | Theo COPPA: phụ huynh phải xác minh consent qua **một trong các cách**: ký fax, email + credit card check, video xác thực, hoặc gặp trực tiếp |
| 7. Quyền rút bất kỳ lúc nào | Phụ huynh có thể rút child profile và xóa toàn bộ dữ liệu, không cần lý do |

### IV.4 Luồng đăng ký Tầng 1

```
1. Phụ huynh tạo Account trên Muôn Nơi (qua SSO)
   ↓
2. Phụ huynh điền form "Đăng ký con tham gia Mầm Sáng"
   ↓
3. Hệ thống gửi email xác minh + đường dẫn ký consent COPPA
   ↓
4. Phụ huynh ký consent (verifiable)
   ↓
5. Child profile được tạo trong account phụ huynh
   ↓
6. Điều phối viên (staff DSTS có lương + background check) liên hệ phụ huynh
   ↓
7. Phụ huynh chọn nhóm phù hợp (online class, trại hè, hộp ước mơ)
   ↓
8. Tham gia → mọi tương tác đều có điều phối viên hoặc phụ huynh
```

---

## V. MÔ HÌNH MENTOR — CHUYÊN NGHIỆP + TÌNH NGUYỆN 🔧 SỬA CHÍNH

### V.1 Bài học từ Friends of the Children
**Friends of the Children (FOTC)** thành công 30 năm vì:
- Mentor là **nhân viên có lương** (salaried "Friend"), không phải volunteer cảm hứng
- Theo trẻ từ mẫu giáo đến tốt nghiệp THPT (12.5+ năm)
- Pass background check nghiêm, training liên tục
- Kết quả: 83% youth tốt nghiệp THPT/GED, 92% vào học sau phổ thông, 93% không dính tư pháp vị thành niên

**v1.0 sai ở chỗ:** Coi "Dream Buddy" là volunteer Tầng 4 gọi 30 phút/tháng. Đây là mô hình **không bền vững** và **không an toàn**.

### V.2 Cấu trúc mentor mới

| Vai trò | Loại | Có lương? | Trách nhiệm | Background check? |
|---|---|---|---|---|
| **Mentor Coordinator** (Tầng 1) | Nhân viên DSTS | ✅ Có | Tổ chức nhóm, supervise mọi tương tác trẻ em, là người duy nhất trực tiếp với trẻ em | ✅ Bắt buộc, 6 tháng update |
| **Lead Mentor Tầng 2A** | Sinh viên năm cuối có lương part-time | ✅ Có (stipend) | Dẫn câu lạc bộ teen, có supervisor | ✅ Bắt buộc |
| **Peer Mentor Tầng 2B** | Sinh viên năm cuối / mới đi làm | Volunteer + tín chỉ | 1:1 với sinh viên (KHÔNG phải trẻ em) | ✅ Bắt buộc |
| **Master Mentor Tầng 3** | Doanh nhân/nghệ sĩ Tầng 3-4 | Volunteer | 1:1 với founder/artist trẻ Tầng 2C-3 | ✅ Bắt buộc |
| **Patron Donor** Tầng 4 | Người bảo trợ | Volunteer | Đóng góp tài chính, **không tiếp xúc trẻ em trực tiếp**, nhận báo cáo từ Coordinator | ✅ Optional cho donor |

### V.3 Nguyên tắc 1:1

| Quan hệ | 1:1 cho phép? |
|---|---|
| Mentor Coordinator ↔ trẻ em | ✅ Có (nhưng có log + có supervisor) |
| Adult Mentor ↔ trẻ em | ❌ **Không** dưới mọi hình thức |
| Peer Mentor Tầng 2 ↔ sinh viên Tầng 2 | ✅ Có (cùng độ tuổi, qua nền tảng) |
| Master Mentor Tầng 4 ↔ founder Tầng 2C-3 | ✅ Có (cùng adult, có hợp đồng) |
| Patron Donor Tầng 4 ↔ trẻ em được bảo trợ | ❌ **Không trực tiếp** — chỉ qua thư/báo cáo do Coordinator chuyển |

### V.4 "Báo cáo Sponsor" — replace "Dream Buddy gọi 30 phút"

Thay vì sponsor gọi trực tiếp trẻ, model mới:

- Sponsor Tầng 4 đóng 120 USD/năm cho 1 trẻ Mầm Sáng
- **2 lần/năm**, sponsor nhận **báo cáo có chữ ký**:
  - Thư từ trẻ em (qua phụ huynh duyệt)
  - Ảnh nhóm hoạt động (không ảnh cá nhân trẻ rõ mặt nếu phụ huynh không opt-in)
  - Tiến độ học tập + sở thích phát triển
  - Báo cáo từ Mentor Coordinator (1 trang)
- Sponsor có thể viết thư động viên → **Coordinator review → chuyển đến phụ huynh → phụ huynh đưa cho trẻ**
- Không có video call. Không có chat. Không có gặp trực tiếp một mình.

---

## VI. SẢN PHẨM CHO TỪNG TẦNG (ĐÃ CHỈNH)

### Tầng 1 — Mầm Sáng (đã chỉnh theo Mục IV + V)

| Sản phẩm | Format | Tài chính | Số lượng Y1 |
|---|---|---|---|
| Hộp Ước Mơ | Gửi tận nhà qua phụ huynh | 100% miễn phí, tài trợ | 200 (giảm từ 1,000) |
| Lớp Mầm Sáng online | Online, có Coordinator | Miễn phí | 5 lớp × 10 em = 50 |
| Trại hè Đường Sao | Offline, có phụ huynh đi cùng hoặc supervised | Miễn phí | 1 trại × 30 em |

### Tầng 2A — Học sinh 13-17

| Sản phẩm | Format | Tài chính |
|---|---|---|
| Bản đồ Tỏa Sáng teen | 24 câu hỏi online, **cần consent phụ huynh** | Miễn phí |
| Câu lạc bộ Trẻ Tỏa Sáng | Buổi online tháng, có Lead Mentor có lương | Miễn phí |
| Học bổng Mầm Sao | 50 suất/năm | Tài trợ |

### Tầng 2B — Sinh viên 18-22

| Sản phẩm | Format | Giá Y1 |
|---|---|---|
| 90 day Bước Vào Đời | Lộ trình + Peer Mentor 1:1 | 49 USD (hoặc scholarship) |
| Cuộc thi Sáng tạo Trẻ Việt | 4 mùa/năm | Free, giải 5,000 USD |
| Internship Hệ Sinh Thái | 3 tháng có lương | 12 chỗ Y1 (giảm từ 24) |

### Tầng 2C — Mới đi làm 22-25

| Sản phẩm | Format | Giá Y1 |
|---|---|---|
| Founder Trẻ | 6 tháng coaching nhóm + 1:1 | 999 USD |
| Artist Trẻ | Tương tự | 999 USD |
| Quỹ Bệ Phóng | Seed 5k-25k USD/startup | 3 startup Y1 (giảm từ 12) — chờ legal counsel |

### Tầng 3 — 9 Script Journey (giữ nguyên)
- 7 Day Starter: 29 USD
- 30 Day Clarity: 199 USD
- 9 Script cơ bản: 999 USD
- 9 Script cao cấp: 10-30k USD
- Verified Star Circle: 49 USD/tháng

### Tầng 4 — Bảo trợ + Legacy

| Sản phẩm | Giá | Y1 |
|---|---|---|
| Bảo trợ 1 Mầm Sáng | 120 USD/năm | 50 sponsor |
| Bảo trợ 1 Sinh viên | 600 USD/năm | 20 |
| Bảo trợ 1 Founder Trẻ | 5,000 USD | 5 |
| Family Office Fund | 50-500k/năm | 1-2 |
| Legacy Archive | 25,000 USD | 3-5 |
| Legacy Foundation | 100k+ USD | 1 |

### Tầng 5 — Membership 🔧 SỬA: chỉ 4 tier ban đầu

| Tier | Giá | Quyền lợi |
|---|---|---|
| **Free Supporter** | 0 | Newsletter weekly, podcast, YouTube |
| **9 USD/tháng** | $108/năm | Premium newsletter, behind-the-scenes |
| **29 USD/tháng** | $348/năm | Premium + cộng đồng Discord/Zalo, monthly Q&A |
| **99 USD/năm** | $99/năm | Annual plan, save vs monthly |
| **Patron** | Apply-only | Curated, có gặp founder, không phải mua được |

*(Bỏ tier 19 USD và 49 USD của v1.0 — đơn giản hóa)*

---

## VII. 3 DÒNG TIỀN VỚI LEGAL FIREWALL 🔧 SỬA CHÍNH

### VII.1 Nguyên tắc Firewall

```
┌─────────────────────────────────────────────────────┐
│             NONPROFIT LANE                          │
│  Donate · Sponsor · Grant · Child/Youth Program     │
│  Pháp nhân: Angel Edu Tam Foundation Inc (US 501c3) │
│  + Quỹ VN (theo Nghị định 03/2026/NĐ-CP)            │
│  KHÔNG cross với 2 lane khác                        │
└─────────────────────────────────────────────────────┘
                       │
                  NO CROSS
                       │
┌─────────────────────────────────────────────────────┐
│             COMMERCIAL LANE                         │
│  Script Journey · Membership · Content Product      │
│  Pháp nhân: Công ty TNHH/CP riêng (chờ thành lập)   │
│  Có hóa đơn VAT, đóng thuế đầy đủ                   │
│  KHÔNG nhận donate                                  │
└─────────────────────────────────────────────────────┘
                       │
                  NO CROSS
                       │
┌─────────────────────────────────────────────────────┐
│             INVESTMENT LANE                         │
│  Quỹ Bệ Phóng                                       │
│  Pháp nhân: Quỹ đầu tư riêng (chờ legal counsel)    │
│  Yêu cầu: KYC, investor qualification, securities   │
│  CHỈ mở khi có legal lock đầy đủ                    │
│  KHÔNG mời đầu tư public trước legal                │
└─────────────────────────────────────────────────────┘
```

### VII.2 Quy tắc cứng

| Quy tắc | Hậu quả nếu vi phạm |
|---|---|
| Donor không bao giờ nghĩ họ đang đầu tư | Bị kiện lừa đảo |
| Khách mua product không nghĩ tiền tự thành từ thiện | Vi phạm thuế |
| Quỹ Bệ Phóng không xuất hiện như "lời mời đầu tư public" trước khi có giấy phép | Vi phạm luật chứng khoán |
| Mỗi giao dịch có hóa đơn / receipt rõ ràng vào đúng lane | Audit fail |

### VII.3 Khi nào mỗi lane mở

| Lane | Điều kiện mở |
|---|---|
| Nonprofit Lane | Sau khi có ít nhất 1 pháp nhân nonprofit chính thức (US 501c3 hoặc VN quỹ theo NĐ 03/2026) |
| Commercial Lane | Sau khi có công ty đăng ký + tài khoản business + cổng thanh toán Stripe/PayPal hoặc tương đương |
| Investment Lane | Sau khi có legal counsel chuyên về securities + KYC framework + investor qualification process |

**Y1 đề xuất:** Mở Nonprofit Lane + Commercial Lane. **Đóng** Investment Lane cho đến cuối Y1 hoặc Y2.

---

## VIII. KỊCH BẢN CÓ THỂ BÁN / SÁNG TẠO / ĐÓNG GÓP

*(Giữ nguyên Mục VI của v1.0 — chiến lược kịch bản → 7 dạng tài sản không thay đổi)*

Bổ sung:
- Kịch bản về trẻ em **chỉ phát hành sau khi có legal review** về sử dụng câu chuyện trẻ em (consent + anonymization)
- DSTS Press làm publisher chính thức, có ISBN, có hợp đồng tác quyền

---

## IX. MÔ HÌNH DSTS × MUÔN NƠI

*(Giữ nguyên Mục VII của v1.0)*

Bổ sung:
- **Muôn Nơi privacy-first** áp dụng triệt để cho Tầng 1 — trẻ em không bao giờ có public profile, không xuất hiện trên feed, không có map opt-in
- **App Muôn Nơi** mở rộng để hỗ trợ child profile internal-only (cần build feature riêng cho phụ huynh)

---

## X. PHÁP LÝ — ĐỐI CHIẾU NGHỊ ĐỊNH 03/2026/NĐ-CP 🔧 SỬA CHÍNH

### X.1 Câu pháp lý chính thức (placeholder)

> *"Pháp nhân tại Việt Nam sẽ được xác minh theo quy định hiện hành về quỹ xã hội, quỹ từ thiện, doanh nghiệp xã hội hoặc đơn vị vận hành phù hợp. Không công bố tên pháp nhân cho đến khi có hồ sơ pháp lý chính thức."*

### X.2 Đối chiếu Nghị định 03/2026/NĐ-CP

Nghị định 03/2026/NĐ-CP (ban hành 09/01/2026, hiệu lực **01/03/2026**) thay thế NĐ 93/2019 và NĐ 136/2024. Đây là khung pháp lý quan trọng cho NDNUM nếu lập quỹ tại VN.

**Các điểm chính cần tuân thủ:**

| Yêu cầu | Áp dụng cho NDNUM |
|---|---|
| Quỹ có tư cách pháp nhân, con dấu, tài khoản riêng | Bắt buộc nếu lập quỹ VN |
| Trụ sở trên lãnh thổ VN, có giấy tờ chứng minh quyền sử dụng | Bắt buộc |
| Hoạt động không vì mục tiêu lợi nhuận | Phù hợp Tầng 1 + Tầng 2 |
| Tài sản không phân chia | OK |
| **Công khai cả "đầu vào" và "đầu ra" trước 31/3 hằng năm** | Bắt buộc — phải có trang `/transparency` với báo cáo này |
| Báo cáo tài chính hàng quý + hằng năm | Bắt buộc |
| Báo cáo kiểm toán (nếu có) | Khuyến nghị |
| Không nhận tiền gửi, cho vay, góp vốn đầu tư | **Quan trọng** — quỹ nonprofit không được làm Investment Lane |
| Cá nhân/tổ chức nước ngoài được góp tài sản cùng VN để thành lập quỹ | Phù hợp diaspora model |
| Ký kết hợp đồng nước ngoài phải gửi bản sao cho cơ quan quản lý trong 7 ngày | Bắt buộc |

### X.3 Lộ trình pháp lý đề xuất

```
Tháng 6-7/2026 (sau Layer 0 DSTS):
  ├─ Thuê legal counsel chuyên về quỹ xã hội + nonprofit US
  ├─ Quyết định pháp nhân chính:
  │    Option A: Quỹ tại VN theo NĐ 03/2026 (mất 3-6 tháng)
  │    Option B: Quỹ US 501c3 + chi nhánh đại diện VN
  │    Option C: Cả 2 (recommend cho diaspora model)
  └─ Soạn điều lệ + hồ sơ thành lập

Tháng 8-12/2026:
  ├─ Nộp hồ sơ thành lập quỹ
  ├─ Đăng ký công ty Commercial Lane (riêng)
  └─ Defer Investment Lane sang Y2

Tháng 1-3/2027:
  ├─ Quỹ được cấp phép
  ├─ Mở tài khoản, kế toán
  └─ Báo cáo công khai đầu tiên trước 31/3/2027 (nếu thành lập Y1)
```

### X.4 Pháp nhân quốc tế

- **Angel Edu Tam Foundation Inc** — US 501c3 — **cần verify với IRS xem đã active chưa** (anh Tâm xác nhận status)
- Nếu chưa active, dùng fiscal sponsor (như Open Collective hoặc Tides Foundation) cho Y1 trong khi chờ pháp nhân chính

---

## XI. ROADMAP 5 GIAI ĐOẠN (CHÈN PHASE 0B) 🔧 SỬA

### Phase 0A — DSTS Layer 0 hoàn thành (Tháng 5-6/2026)
- DSTS từ 45/100 → 100/100 theo Master Plan v1.1-LOCKED
- **Không động đến NDNUM** cho đến khi Layer 0 pass

### Phase 0B — Legal + Child Safety Lock (Tháng 6-8/2026) 🆕
**Sửa quan trọng:** Phase này **chèn vào trước Phase 1** để đảm bảo pháp lý sẵn sàng.

- Lock 7 spec con (xem Mục XV)
- Thuê legal counsel VN + US
- Quyết định pháp nhân
- Soạn child safety policy + parent consent flow
- Train child safety officer (CSO) đầu tiên
- Recruit + screen 5 Mentor Coordinator có lương
- Setup 3 lane financial firewall (chỉ mở Nonprofit + Commercial, đóng Investment)

**KPI:** Pháp lý xong (hoặc đang nộp hồ sơ), CSO trained, 5 Coordinator hired.

### Phase 0C — Landing page chỉ vision (Tháng 8/2026)
- Public `/dream-nurture` trên DSTS hub
- **Chỉ công bố tầm nhìn + roadmap, KHÔNG nhận đăng ký trẻ em**
- Mở email subscribe + newsletter
- Mở Tier 5 (Free Supporter, 9 USD/tháng, 29, 99/năm)

### Phase 1 — Pilot người lớn trước (Tháng 9-12/2026) 🔧 SỬA
**Nguyên tắc:** Pilot Tầng 3-4-5 trước, **chưa nhận trẻ em**.

- Bán 9 Script Journey cho 5-10 khách Tầng 3 đầu
- Mở sponsor Tầng 4 (donate trước, chưa kết nối trẻ em)
- Mở Founder Trẻ / Artist Trẻ cho Tầng 2C (adult)
- Build cộng đồng Tầng 5 → 5,000 subscriber
- **Sự kiện flagship #1**: Đêm "Nuôi Dưỡng Những Ước Mơ" — nối tiếp Phía Sau Màn Nhung

### Phase 2 — Pilot trẻ em supervised (Q1-Q2/2027) 🆕
**Sau khi pháp lý + child safety lock + 5 Coordinator ready:**

- Pilot **20 trẻ** (không phải 200 như v1.0) — Tầng 1
- Tất cả offline, có phụ huynh đồng ý + có Coordinator supervise
- 1 trại hè × 30 trẻ
- 100 sinh viên Tầng 2B (đã pilot ở Phase 1, mở rộng)
- 30 sinh viên Tầng 2A scholarship

**KPI Q2/2027:** 20 trẻ tham gia, 0 incident, 100% phụ huynh ký consent.

### Phase 3 — Dashboard + Assessment + Reports (Q3-Q4/2027)
- Build Star Map Assessment thật
- Build dashboard cá nhân cho Tầng 2-3
- Báo cáo công khai đầu tiên (theo NĐ 03/2026 nếu quỹ VN đã active)
- Mở rộng: 100 trẻ Tầng 1, 500 sinh viên Tầng 2, 50 khách Tầng 3, 30 sponsor Tầng 4

### Phase 4 — Mở rộng VN (2028)
- 30 thành phố VN
- 500 trẻ, 2,000 sinh viên, 200 khách Tầng 3, 100 sponsor
- Tour 10 thành phố
- Mở Investment Lane (Quỹ Bệ Phóng) — chỉ khi đã có legal counsel + KYC framework

### Phase 5 — Quốc tế (2029-2030)
- Diaspora 7 nước
- Franchise quốc tế
- World Tour Gala

---

## XII. KPI REALISTIC 🔧 SỬA CHÍNH

### Year 1 (2026 cuối + 2027 đầu)
- Newsletter: 1,000 → 5,000 subscriber
- Tầng 1: **20 trẻ** (giảm từ 200)
- Tầng 2: 100 sinh viên paid + 30 scholarship
- Tầng 3: 5-10 khách Script
- Tầng 4: 10-20 sponsor (donate 1,000-10,000 USD/người)
- Tầng 5: 200 paid membership
- **Doanh thu tổng: 100,000 - 500,000 USD** (giảm mạnh từ vision 5M Y1)

### Year 2 (2027)
- Newsletter: 50,000 subscriber
- Tầng 1: 200 trẻ
- Tầng 2: 1,000 sinh viên
- Tầng 3: 50-100 khách Script
- Tầng 4: 50 sponsor + 1-2 Family Office Fund
- Tầng 5: 2,000 paid membership
- **Doanh thu: 1 - 3 triệu USD**

### Year 3 (2028)
- Newsletter: 200,000 subscriber
- Tầng 1: 1,000 trẻ
- Tầng 2: 5,000 sinh viên
- Tầng 3: 300 khách Script
- Tầng 4: 200 sponsor + 5 Family Office
- Tầng 5: 10,000 paid membership
- **Doanh thu: 5 - 10 triệu USD**

### 2029-2030 North Star
- 1M fan toàn cầu
- 10,000 trẻ
- 30,000 sinh viên
- 2,000 Tầng 3
- 1,000 Tầng 4
- **Mục tiêu 100M USD/năm ecosystem value** — đây là North Star, **không phải projection chính** để show ngoài

### Context (so với thị trường)
Giving USA 2024: tổng charitable giving tại Mỹ ~592 tỷ USD. NDNUM Y3 ở mức 5-10M = ~0.0017% thị trường Mỹ. Realistic.

---

## XIII. BẢO VỆ TRẺ EM — CHUẨN CỨNG 🔧 SỬA CHÍNH

### XIII.1 Tuân thủ pháp lý
- **COPPA** (US Children's Online Privacy Protection Act) — verifiable parental consent
- **GDPR-K** (EU) — nếu có user EU
- **Luật Trẻ em Việt Nam 2016** Điều 33-46 — quyền tham gia + bảo vệ
- **Nghị định 56/2017/NĐ-CP** quy định chi tiết Luật Trẻ em

### XIII.2 12 quy tắc cứng

1. Không tài khoản trẻ em <13 — phụ huynh là chủ
2. Không public child profile
3. Không 1:1 giữa adult mentor và trẻ em
4. Không DM giữa adult và trẻ em
5. Không comment công khai từ trẻ em
6. Background check mọi staff + mentor tiếp xúc trẻ em
7. Mentor có lương (Coordinator), không phải volunteer cảm hứng
8. **Log session** mọi tương tác (có timestamp + người tham gia)
9. **Ghi âm/video CHỈ khi có consent rõ ràng** của phụ huynh — không mặc định
10. Data retention rõ ràng: log 1 năm, xóa khi yêu cầu
11. Phụ huynh rút bất kỳ lúc nào, không cần lý do, xóa toàn bộ dữ liệu
12. Child Safety Officer độc lập, có quyền dừng chương trình nếu phát hiện vi phạm

### XIII.3 Child Safety Officer (CSO)
- Full-time hoặc part-time chuyên trách
- Không trực thuộc CEO — báo cáo thẳng cho Board
- Có training về child protection (IICRC hoặc tương đương)
- Quyền lực:
  - Đình chỉ bất kỳ mentor nào
  - Dừng bất kỳ event nào nếu thấy rủi ro
  - Whistleblow lên Board mà không qua CEO
- Hợp đồng minimum 2 năm

### XIII.4 Incident reporting
- Hotline 24/7 cho phụ huynh
- Email + form online
- Mọi incident được CSO investigate trong 48h
- Báo cáo Board hằng quý

---

## XIV. RISK REGISTER + 12 NGUYÊN TẮC BẤT BIẾN

### Risk register (cập nhật từ v1.0)

| Risk | Xác suất | Tác động | Mitigation |
|---|---|---|---|
| Trẻ em bị tổn hại | Thấp | Catastrophic | **12 quy tắc Mục XIII**, CSO độc lập, no 1:1 |
| Sponsor hiểu nhầm là đầu tư | Trung | Cao | Legal firewall + hợp đồng + disclaimer |
| Nhân vật tỏa sáng scandal | Trung | Cao | Vetting + "đình chỉ tỏa sáng" trong hợp đồng |
| Quỹ bị lạm dụng | Thấp | Catastrophic | Audit + đa chữ ký + công khai NĐ 03/2026 |
| Bị copycat | Cao | Trung | Trademark + founder public |
| Khách Tầng 3 không đạt kết quả → kiện | Trung | Trung | Disclaimer cứng, không hứa hẹn |
| Mentor bỏ giữa chừng | Cao | Trung | Hợp đồng có lương 1 năm minimum |
| Chính trị nhạy cảm diaspora | Trung | Cao | Trung lập, không gắn phe |
| Tăng trưởng quá nhanh chất lượng giảm | Cao | Cao | **Cap số trẻ Y1 ở 20, không 200** |
| Founder cá nhân quá tải | Cao | Cao | Phân quyền, có Program Director + COO |
| **🆕 Vi phạm NĐ 03/2026 (không công khai trước 31/3)** | Trung | Cao | Setup báo cáo từ Tháng 1 hằng năm |
| **🆕 Vi phạm COPPA (US)** | Trung | Cao | Legal review + verifiable consent flow |

### 12 nguyên tắc bất biến

1-7: Kế thừa DSTS Master Plan v1.1-LOCKED
8. **Không bao giờ public thông tin trẻ em** mà không có consent
9. **Không bao giờ cam kết kết quả**
10. **Không cross-subsidize** giữa 3 lane
11. **Mọi staff/mentor tiếp xúc trẻ em** phải pass background check
12. **Sponsor nhận báo cáo qua Coordinator**, không tiếp xúc trẻ trực tiếp

---

## XV. 7 SPEC CON BẮT BUỘC 🆕

Sau khi anh Tâm lock v1.1, em sẽ viết 7 spec con (gắn vào Master Index Mục 5.4):

| # | File | Mục đích | Trạng thái | Owner |
|---|---|---|---|---|
| 1 | `NDNUM_CHILD_SAFETY_POLICY.md` | 12 quy tắc deep dive + CSO role + incident A/B/C/D + 4 appendices (VN/US/AU/UK) | 🟡 DRAFT v1.0 — chờ CSO co-review | CSO + Founder |
| 2 | `NDNUM_PARENT_GUARDIAN_CONSENT_FLOW.md` | COPPA 5 VPC + NĐ 56/2017 + 10-step flow + consent template VI/EN + D1 schema `0008` + 5 API | 🟡 DRAFT v1.0 — chờ Legal Counsel review | Legal + Tech |
| 3 | `NDNUM_MENTOR_SCREENING_AND_TRAINING.md` | 5 role + hiring funnel + background check 4 countries + 40h curriculum + compensation Y1 | 🟡 DRAFT v1.0 — chờ CSO + HR review | HR + CSO |
| 4 | `NDNUM_LEGAL_ENTITY_AND_MONEY_LANE_MAP.md` | Pháp nhân 3 options + fiscal sponsor + 3-lane firewall + tax + AML + D&O | 🟡 DRAFT v1.0 — 3 Founder decisions pending | Legal + CFO |
| 5 | `NDNUM_SPONSOR_A_DREAM_FULFILLMENT_FLOW.md` | Flow $120/$50K/$250K + Coordinator workload + communication protocol + D1 schema | 🟡 DRAFT v1.0 — chờ Phase 0B + Coordinator hire | Operations |
| 6 | `NDNUM_IMPACT_MEASUREMENT_FRAMEWORK.md` | Logic Model + SDQ + k-anonymity ≥5 + D1 schema `0009` + external validation | 🟡 DRAFT v1.0 — chờ M&E Specialist hire | M&E Specialist |
| 7 | `NDNUM_PUBLIC_LANDING_PAGE_SCOPE.md` | `/dream-nurture` scope: hero + 5 Tầng + CTA allow/ban + acceptance criteria | 🟡 DRAFT v1.0 — chờ Phase 0B lock | Founder + Frontend |

**Tất cả 7 file phải được Legal Counsel + CSO co-review và lock trước khi mở Phase 1 (nhận trẻ em Q1/2027).**

---

## XVI. FOUNDER APPROVAL GATES

### Phê duyệt cho v1.1-REVIEWED

```text
[ ] Đồng ý 7 sửa changelog (Mục đầu file)
[ ] Đồng ý Guardian-first flow cho Tầng 1 (Mục IV)
[ ] Đồng ý mentor có lương model (Mục V)
[ ] Đồng ý product catalog cập nhật (Mục VI)
[ ] Đồng ý Legal Firewall 3 lane (Mục VII)
[ ] Đồng ý placeholder pháp lý + đối chiếu NĐ 03/2026 (Mục X)
[ ] Đồng ý chèn Phase 0B vào Roadmap (Mục XI)
[ ] Đồng ý KPI realistic (Mục XII)
[ ] Đồng ý 12 quy tắc child safety (Mục XIII)
[ ] Đồng ý 7 spec con bắt buộc (Mục XV)
```

### Decisions cần chốt (mới)

```text
[ ] Pháp nhân Option A (VN only) / B (US only) / C (cả 2 — recommend)?
[ ] Angel Edu Tam Foundation Inc — đã active với IRS hay chưa?
[ ] Có dùng fiscal sponsor (Open Collective / Tides) cho Y1 không?
[ ] Investment Lane (Quỹ Bệ Phóng) — đóng Y1, mở Y2 — OK chứ?
[ ] Cap Y1 trẻ em ở 20 — OK chứ? (v1.0 là 200)
[ ] Phase 0B (legal + child safety lock) bao lâu? 2 tháng đủ không?
```

### Nhân sự cần chỉ định (cập nhật)

```text
[ ] Program Director NDNUM (full-time)
[ ] Child Safety Officer (CSO) — báo cáo Board, không thuộc CEO
[ ] CFO (3 lane, không thể quản tay)
[ ] Legal Counsel VN + US
[ ] Mentor Coordinator (5 người Y1, có lương)
[ ] Content Lead (newsletter + podcast)
[ ] M&E Specialist (Impact Measurement)
```

---

## XVII. TÓM TẮT v1.1-REVIEWED

**Định vị:** *Nuôi Dưỡng Những Ước Mơ là chuỗi sản phẩm + hành trình kết nối, hỗ trợ, tỏa sáng cho mọi người Việt — từ trẻ em vừa biết mơ đến doanh nhân muốn để lại di sản. Vận hành liên tục. Vừa gây quỹ phi lợi nhuận, vừa kinh doanh kịch bản, vừa kêu gọi đầu tư.*

**Khác biệt cốt lõi:** Tỏa sáng kép — mọi người vừa nhận vừa cho.

**Kiến trúc đã sửa từ v1.0:**
- Tầng 1 đi qua **guardian-first flow**, không 1:1 với adult mentor
- Mentor là nhân viên có lương (Friends of the Children model)
- 3 dòng tiền có **legal firewall** cứng
- KPI realistic: Y1 100k-500k, Y2 1-3M, Y3 5-10M, 2030 North Star 100M
- **Phase 0B** chèn vào trước Phase 1 để legal + child safety lock

**Điểm sau v1.1-REVIEWED:** ~92/100. Để lên 100/100 cần:
1. Anh lock v1.1
2. Em viết 7 spec con
3. Legal counsel review
4. CSO lock child safety policy
5. Pháp nhân status được xác nhận

---

*Tài liệu v1.2-LOCKED (doc scope). Cấu trúc chương trình đã khóa — không thay đổi nếu không có Founder approve.*
*Để nâng lên v2.0-LEGAL-LOCKED: 7 spec con phải được Legal Counsel + CSO co-review và sign-off.*
*Đã cập nhật Master Index `00_DSTS_MASTER_INDEX_2026.md` Mục 5.5 (v1.4).*
*Phụ thuộc: DSTS Master Plan v1.2-DRAFT (sẽ re-lock sau NDNUM v2.0) + Layer 0 Foundation Sprint 0 pass.*
