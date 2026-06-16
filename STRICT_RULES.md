# BỘ QUY TẮC NGHIÊM NGẶT — ĐƯỜNG SAO TỎA SÁNG (DSTS)

> **CẢNH BÁO:** Bất kỳ AI, developer, designer, hay team dev nào làm việc với dự án này **BUỘC PHẢI ĐỌC** bộ quy tắc này trước khi bắt đầu. Vi phạm quy tắc sẽ bị reject.

---

## 1. NGUYÊN TẮC SỐ 1: KHÔNG CHỮ TIẾNG ANH TRONG NỘI DUNG TIẾNG VIỆT

### 1.1 Quy tắc cứng
- **KHÔNG ĐƯỢC** có bất kỳ chữ, từ, câu tiếng Anh nào trong nội dung tiếng Việt
- **Ngoại lệ duy nhất:** Technical term không có từ tương đương trong tiếng Việt (ví dụ: "API", "SDK", "CLI", "JSON", "SVG")
- **Technical term phải được:** 
  - Viết hoa đúng chuẩn (không viết thường như "api", "sdk")
  - Có giải thích tiếng Việt lần đầu xuất hiện
  - Có glossary tại cuối trang hoặc trong footer

### 1.2 Ví dụ sai vs đúng

| Sai ❌ | Đúng ✅ | Lý do |
|-------|--------|-------|
| "Click here" | "Nhấn vào đây" | Có từ tiếng Việt tương đương |
| "Submit form" | "Gửi biểu mẫu" | Có từ tiếng Việt tương đương |
| "Loading..." | "Đang tải..." | Có từ tiếng Việt tương đương |
| "Sign up" | "Đăng ký" | Có từ tiếng Việt tương đương |
| "Login" | "Đăng nhập" | Có từ tiếng Việt tương đương |
| "Dashboard" | "Bảng điều khiển" | Có từ tiếng Việt tương đương |
| "Settings" | "Cài đặt" | Có từ tiếng Việt tương đương |
| "Privacy Policy" | "Chính sách quyền riêng tư" | Có từ tiếng Việt tương đương |
| "Terms of Service" | "Điều khoản dịch vụ" | Có từ tiếng Việt tương đương |
| "API endpoint" | "API endpoint (điểm kết nối API)" | Technical term có giải thích |
| "SDK integration" | "SDK integration (tích hợp SDK)" | Technical term có giải thích |

### 1.3 SEO & Hreflang
- Mỗi trang phải có 2 version: `/vi/...` cho tiếng Việt và `/en/...` cho tiếng Anh
- Meta tags phải đúng ngôn ngữ tương ứng
- Hreflang phải được set đúng trong `<head>`:
  ```html
  <link rel="alternate" hreflang="vi" href="https://duongsaotoasang.com/vi/..." />
  <link rel="alternate" hreflang="en" href="https://duongsaotoasang.com/en/..." />
  <link rel="alternate" hreflang="x-default" href="https://duongsaotoasang.com/vi/..." />
  ```

### 1.4 Audit checklist
- [ ] Kiểm tra từng trang không có từ tiếng Anh không cần thiết
- [ ] Kiểm tra meta description, meta title, OG tags
- [ ] Kiểm tra alt text của hình ảnh
- [ ] Kiểm tra placeholder text trong form
- [ ] Kiểm tra error message, success message
- [ ] Kiểm tra navigation menu
- [ ] Kiểm tra footer
- [ ] Kiểm tra glossary nếu có technical term

---

## 2. NGUYÊN TẮC SỐ 2: HÌNH ẢNH MINH HỌA PHẢI ĐẸP & CHÂN THẬT

### 2.1 Quy tắc cứng
- **KHÔNG ĐƯỢC** dùng hình ảnh trống (placeholder, gray box, loading skeleton)
- **KHÔNG ĐƯỢC** dùng hình ảnh giống nhau cho nhiều bài/nội dung khác nhau
- **MỖI BÀI, MỖI NỘI DUNG** phải có hình ảnh minh họa riêng biệt, đẹp, chân thật
- Hình ảnh phải tuân theo bộ nhận diện thương hiệu Brandpro-all

### 2.2 Spec hình ảnh
- **Format:** PNG, JPG, WebP (ưu tiên WebP cho performance)
- **Kích thước:**
  - Hero image: 1920×1080px (landscape)
  - Card image: 800×600px (landscape)
  - Avatar: 400×400px (square)
  - Thumbnail: 600×400px (landscape)
- **File size:** < 500KB per image (compress nếu cần)
- **Alt text:** Phải viết bằng tiếng Việt, mô tả chi tiết hình ảnh

### 2.3 Style hình ảnh
- **Photography:** Natural light, candid, documentary style
- **Illustration:** Flat vector, warm tone, không quá cartoon
- **Color treatment:** Warm filter, desaturated nhẹ, duotone (primary + secondary)
- **Không được dùng:**
  - Stock photo quá generic
  - Hình ảnh có watermark
  - Hình ảnh blur, low resolution
  - Hình ảnh không liên quan đến nội dung

### 2.4 Audit checklist
- [ ] Kiểm tra từng trang không có hình ảnh trống
- [ ] Kiểm tra không có hình ảnh trùng lặp
- [ ] Kiểm tra kích thước và file size
- [ ] Kiểm tra alt text bằng tiếng Việt
- [ ] Kiểm tra style phù hợp với brand
- [ ] Kiểm tra contrast và accessibility

---

## 3. NGUYÊN TẮC SỐ 3: CHÂN TRANG PHẢI NHẤT QUÁN

### 3.1 Quy tắc cứng
- **MỌI TRANG** phải có footer nhất quán
- Footer phải có **cùng cấu trúc, cùng style, cùng nội dung** trên mọi trang
- Footer phải tuân theo bộ nhận diện thương hiệu Brandpro-all

### 3.2 Cấu trúc footer bắt buộc
```
Footer DSTS (4 cột):

Cột 1 — Brand:
- Logo DSTS
- Tagline: "Kế hoạch phát triển nền tảng tỏa sáng của người Việt toàn cầu"
- Copyright: "© 2026 Duong Sao Toa Sang."

Cột 2 — Điều hướng:
- Giới thiệu
- Chương trình
- Bài viết
- Sự kiện
- Câu chuyện
- Mentor

Cột 3 — Pháp lý:
- Điều khoản
- Quyền riêng tư
- Hoàn tiền
- Hỗ trợ

Cột 4 — Liên hệ:
- Email: contact@duongsaotoasang.com
- Địa chỉ: Lầu 23, 76A Lê Lai, P.Bến Thành, Q.1, TP. Hồ Chí Minh
- MST: 0315462505
- Công ty: CÔNG TY CỔ PHẦN GIẢI TRÍ NGÔI SAO VIỆT CAN
```

### 3.3 Style footer
- Background: `#1a1a1a` (dark gray)
- Text: `#ffffff` (white)
- Link: `#e0e0e0` (light gray) → hover: `#ffffff`
- Spacing: 48px padding top/bottom, 24px column gap
- Border top: 1px solid `#333333`

### 3.4 Audit checklist
- [ ] Kiểm tra mọi trang có footer
- [ ] Kiểm tra footer có cùng cấu trúc
- [ ] Kiểm tra footer có cùng style
- [ ] Kiểm tra link hoạt động
- [ ] Kiểm tra responsive (mobile)

---

## 4. NGUYÊN TẮC SỐ 4: MENU PHẢI CÂN ĐỐI

### 4.1 Quy tắc cứng — Desktop
- **6 MỤC CHÍNH** trong navigation menu
- **MỤC MỞ RỘNG** (dropdown) cho submenu
- Menu phải cân đối, đẹp mắt, tuân theo design system

### 4.2 Cấu trúc menu desktop
```
Navigation Desktop (6 mục chính):

1. Trang chủ (/)
2. Giới thiệu (/about)
3. Chương trình (/programs)
4. Bài viết (/posts)
5. Sự kiện (/events)
6. Hệ sinh thái ▾ (dropdown)
   - Kịch bản (/scripts)
   - Gây quỹ (/donate)
   - Minh bạch (/transparency)
   - Pháp lý (/legal)
   - Hỗ trợ (/support)
   - Liên hệ (/contact)
```

### 4.3 Style menu desktop
- Background: `#ffffff` (white)
- Text: `#1a1a1a` (dark gray) → hover: `#e63946` (primary red)
- Border bottom: 2px solid `#e63946` khi active
- Spacing: 16px padding left/right, 12px padding top/bottom
- Font: 16px, weight 600

### 4.4 Quy tắc cứng — Mobile
- **Mobile view PHẢI CHIẾU Y như app mobile thật**
- **KHÔNG PHẢI** web mobile thông thường
- Navigation phải giống bottom tab bar của app native

### 4.5 Cấu trúc menu mobile (Bottom Tab Bar)
```
Bottom Tab Bar Mobile (5 icon):

1. Trang chủ (icon: home)
2. Chương trình (icon: grid)
3. Bài viết (icon: book)
4. Tài khoản (icon: user)
5. Menu (icon: menu) → mở drawer
```

### 4.6 Style menu mobile
- Background: `#ffffff` (white)
- Border top: 1px solid `#e0e0e0`
- Icon: 24×24px, `#666666` → active: `#e63946`
- Label: 12px, `#666666` → active: `#e63946`
- Height: 64px (safe area)

### 4.7 Audit checklist
- [ ] Kiểm tra desktop menu có 6 mục chính
- [ ] Kiểm tra dropdown hoạt động
- [ ] Kiểm tra style menu desktop
- [ ] Kiểm tra mobile menu giống app mobile
- [ ] Kiểm tra bottom tab bar hoạt động
- [ ] Kiểm tra responsive transition

---

## 5. NGUYÊN TẮC SỐ 5: APP PHẢI HOÀN THIỆN SAU ĐĂNG NHẬP

### 5.1 Quy tắc cứng
- **Sau khi đăng nhập, user phải dùng được như app thật**
- **KHÔNG ĐƯỢC** có trang "đang phát triển", "coming soon", "placeholder"
- **MỌI FEATURE** phải hoạt động hoặc có thông báo rõ ràng

### 5.2 Flow sau đăng nhập
```
1. Onboarding (nếu là user mới)
   - Chào mừng bằng tiếng Việt
   - Giới thiệu 3 tính năng chính
   - CTA: "Bắt đầu khám phá"

2. Dashboard (trang chính sau đăng nhập)
   - Hồ sơ người dùng (avatar, tên, role)
   - Thống kê nhanh (nếu có)
   - Navigation đến các feature
   - Notifications

3. Feature navigation
   - Mọi feature trong menu phải hoạt động
   - Nếu feature chưa sẵn sàng → thông báo rõ: "Tính năng này đang phát triển. Sẽ có trong tháng 7/2026."
   - Không được redirect về 404 hoặc trang trống
```

### 5.3 UI sau đăng nhập
- **Header:** Avatar user, tên, notification bell, logout
- **Navigation:** Sidebar hoặc bottom tab (mobile)
- **Content:** Không placeholder, không loading vô hạn
- **Error:** Error message bằng tiếng Việt, có giải pháp

### 5.4 Audit checklist
- [ ] Kiểm tra flow đăng nhập hoàn chỉnh
- [ ] Kiểm tra dashboard hoạt động
- [ ] Kiểm tra mọi feature trong menu
- [ ] Kiểm tra không có trang trống
- [ ] Kiểm tra error message bằng tiếng Việt
- [ ] Kiểm tra mobile app-like experience

---

## 6. NGUYÊN TẮC SỐ 6: TUÂN THỦ BRANDPRO-ALL

### 6.1 Quy tắc cứng
- **MỌI ASSET** phải tuân theo bộ nhận diện thương hiệu Brandpro-all
- Design tokens, color palette, typography phải lock theo spec
- Không được deviate khỏi brand guidelines

### 6.2 Brandpro-all reference
- **Verbal Identity:** File 06 — Voice, tone, naming convention
- **Visual Identity:** File 07 — Logo, color, typography, design tokens
- **Bilingual Messaging:** File 09 — Transcreation, không translation
- **Product Brand System:** File 16 — Feature naming, UI copy, onboarding

### 6.3 Design tokens (excerpt)
```json
{
  "color": {
    "primary": {
      "500": "#e63946",
      "400": "#f55a6b",
      "600": "#c72c3a"
    },
    "surface": {
      "100": "#f8f9fa",
      "200": "#ffffff",
      "300": "#e0e0e0"
    },
    "text": {
      "primary": "#1a1a1a",
      "secondary": "#666666"
    }
  },
  "type": {
    "heading": {
      "h1": "32px / 700 / 40px",
      "h2": "24px / 600 / 32px",
      "h3": "20px / 600 / 28px"
    },
    "body": {
      "m": "16px / 400 / 24px",
      "s": "14px / 400 / 20px"
    }
  },
  "space": {
    "4": "16px",
    "6": "24px",
    "8": "32px",
    "12": "48px"
  }
}
```

### 6.4 Audit checklist
- [ ] Kiểm tra color palette đúng spec
- [ ] Kiểm tra typography đúng spec
- [ ] Kiểm tra spacing đúng spec
- [ ] Kiểm tra logo usage đúng spec
- [ ] Kiểm tra icon style nhất quán

---

## 7. QUY TRÌNH AUDIT & QA

### 7.1 Pre-commit checklist
Trước khi commit code, developer phải:
- [ ] Chạy QA script: `node scripts/strict-rules-qa.mjs`
- [ ] Fix tất cả lỗi báo cáo
- [ ] Manual review checklist ở trên
- [ ] Lấy approval từ reviewer

### 7.2 Pre-deploy checklist
Trước khi deploy production:
- [ ] Chạy full QA suite (20 scripts)
- [ ] Smoke test trên staging
- [ ] Manual test trên mobile (iOS + Android)
- [ ] Manual test trên desktop (Chrome + Safari + Firefox)
- [ ] Lấy final approval từ founder

### 7.3 Quarterly audit
Mỗi quý:
- [ ] Audit toàn bộ content tiếng Việt
- [ ] Audit toàn bộ hình ảnh
- [ ] Audit toàn bộ footer consistency
- [ ] Audit toàn bộ menu consistency
- [ ] Audit toàn bộ app-like experience
- [ ] Cập nhật STRICT_RULES.md nếu cần

---

## 8. CONSEQUENCES

### 8.1 Vi phạm quy tắc
- **Lần 1:** Warning + yêu cầu fix trong 24h
- **Lần 2:** Block access + training lại
- **Lần 3:** Remove khỏi project

### 8.2 Exception process
Nếu cần exception:
1. Viết issue giải thích lý do
2. Lấy approval từ founder
3. Document exception trong file EXCEPTIONS.md
4. Review lại sau 1 tháng

---

## 9. CONTACT & SUPPORT

- **Brand Guardian:** [Tên người phụ trách]
- **Tech Lead:** [Tên người phụ trách]
- **Founder Approval:** [Tên người phụ trách]

---

**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-16  
**Người duyệt:** [Founder]  
**Ngày duyệt:** 2026-06-16

---

**LƯU Ý QUAN TRỌNG:** Bộ quy tắc này là **SỰ THẬT** cho dự án. Không được bỏ qua, không được làm lơ, không được "sẽ fix sau". Mọi commit, mọi deploy, mọi content phải tuân thủ.
