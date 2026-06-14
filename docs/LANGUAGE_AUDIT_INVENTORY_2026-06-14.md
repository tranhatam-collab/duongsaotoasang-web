# DSTS — LANGUAGE AUDIT INVENTORY
> Ngày audit: 2026-06-14
> Auditor: Devin (AI Agent)
> Scope: Toàn bộ HTML files, metadata, text nodes, alt text, form labels, CTA
> Phương pháp: Manual review từng file + automated extraction

---

## PHÁT HIỆN TỔNG QUAN (Trước khi rà chi tiết)

| # | Vấn đề | Mức độ | Ví dụ | File |
|---|---|---|---|---|
| 1 | **Không có bản tiếng Anh nào** | P0 | Mọi file đều `<html lang="vi">`, không có `/en/` route, không có i18n switcher | Tất cả |
| 2 | **Không có content JSON nguồn** | P0 | Text hard-code trực tiếp trong HTML, không có `/content/vi.json` hay `/content/en.json` | Tất cả |
| 3 | **Title dài > 60 ký tự** | P1 | "Đường Sao Tỏa Sáng \| DSTS \| Kế hoạch phát triển nền tảng tỏa sáng của người Việt toàn cầu" = 96 chars | index.html |
| 4 | **Meta description trùng nhau** | P1 | `og:description` và `twitter:description` giống hệt `meta description` trên nhiều page | about.html, program.html |
| 5 | **Schema type không phù hợp** | P2 | `program.html` dùng `@type: Event` cho một trang chương trình tổng quát (không phải sự kiện đơn lẻ) | program.html |
| 6 | **DOCTYPE không thống nhất** | P3 | `index.html` dùng `<!doctype html>`, `about.html` dùng `<!DOCTYPE html>` | Toàn site |
| 7 | **Không có `hreflang`** | P2 | Không có `<link rel="alternate" hreflang="en">` trên bất kỳ trang nào | Tất cả |
| 8 | **Không có English metadata** | P0 | Không có `<meta name="description" lang="en">` hay title tiếng Anh | Tất cả |
| 9 | **Image alt text thiếu hoặc generic** | P2 | `og.png` không có alt text mô tả; nhiều ảnh có thể thiếu alt | Tất cả |
| 10 | **H1 không thống nhất** | P2 | Một số trang có H1 rõ, một số không có hoặc dùng H2 làm heading chính | Cần rà |

---

## INVENTORY THEO FILE

### 1. index.html (Trang chủ)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | **Không có EN** |
| `<title>` | "Đường Sao Tỏa Sáng \| DSTS \| Kế hoạch phát triển nền tảng tỏa sáng của người Việt toàn cầu" | — | **Dài 96 chars**, không có EN |
| `<meta name="description">` | "Đường Sao Tỏa Sáng (DSTS) là nền tảng nội dung, chương trình và cộng đồng..." | — | Không có EN |
| `<meta property="og:title">` | Giống title | — | Không có EN |
| `<meta property="og:description">` | "DSTS công bố rõ lộ trình phát triển: Foundation, Movement Portal và Star Journey OS..." | — | Không có EN |
| `keywords` | "Đường Sao Tỏa Sáng, DSTS, người Việt muôn nơi..." | — | Không có EN |
| Schema | `@type: Organization`, `name: Đường Sao Tỏa Sáng`, `description: Nền tảng nội dung...` | — | Không có `@language`, không có EN |
| H1 | Cần kiểm tra body | — | Cần rà |
| CTA | Cần kiểm tra body | — | Cần rà |

### 2. about.html (Giới thiệu)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Giới thiệu DSTS \| Tầm nhìn, sứ mệnh, triết lý nền tảng" | — | Không có EN |
| `<meta name="description">` | "Tìm hiểu tầm nhìn, sứ mệnh, triết lý nền tảng, lịch sử hình thành..." | — | Không có EN |
| `keywords` | "Đường Sao Tỏa Sáng, DSTS, về chúng tôi, tầm nhìn, sứ mệnh..." | — | Không có EN |
| Schema | `@type: Organization`, `name: Đường Sao Tỏa Sáng`, `foundingDate: 2026` | — | Không có EN |
| DOCTYPE | `<!DOCTYPE html>` (uppercase) | — | Không thống nhất với index.html |

### 3. program.html (Chương trình)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Chương trình \| Trí tuệ, nghệ thuật, giáo dục - Đường Sao Tỏa Sáng" | — | Không có EN |
| `<meta name="description">` | "Khám phá các chương trình của DSTS bao gồm trí tuệ, nghệ thuật, giáo dục..." | — | Không có EN |
| Schema | `@type: Event` | — | **Sai type** — đây là trang chương trình tổng quát, không phải event đơn lẻ |

### 4. contact.html (Liên hệ)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Liên hệ \| Đường Sao Tỏa Sáng - Kết nối cộng đồng người Việt" | — | Không có EN |
| `<meta name="description">` | "Liên hệ với Đường Sao Tỏa Sáng để tìm hiểu thêm về các chương trình, sự kiện..." | — | Không có EN |
| Schema | `@type: ContactPage` | — | Đúng type, nhưng không có EN |

### 5. mentor-network.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Mentor Network — Mạng lưới người hướng dẫn đã xác thực \| DSTS" | — | Không có EN |
| `<meta name="description">` | "Mentor Network của DSTS: người hướng dẫn đã xác thực trong nghệ thuật, kinh doanh..." | — | Không có EN |
| Schema | Không có schema JSON-LD | — | **Thiếu schema** |

### 6. dream-nurture.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Dream Nurture — Nuôi dưỡng ước mơ an toàn \| DSTS" | — | Không có EN |
| `<meta name="description">` | "Dream Nurture của DSTS: chương trình nuôi dưỡng ước mơ với legal framework..." | — | Không có EN |
| Schema | Không có schema JSON-LD | — | **Thiếu schema** |

### 7. verify/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Xác thực Danh tính — Verified Identity \| DSTS" | — | Tiếng Anh lẫn trong title ("Verified Identity") |
| `<meta name="description">` | "Hệ thống xác thực danh tính của DSTS: Verified Creator, Verified Mentor..." | — | Tiếng Anh lẫn trong description |
| Schema | Không có | — | Thiếu |

### 8. legacy/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Digital Legacy System — Lưu giữ hành trình \| DSTS" | — | Tiếng Anh lẫn trong title |
| `<meta name="description">` | "Story Preservation Engine của DSTS: lưu giữ video, audio, tài liệu, ảnh..." | — | Không có EN, tiếng Anh lẫn |
| Schema | Không có | — | Thiếu |

### 9. sponsor/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Sponsor Ecosystem — Đồng hành cùng DSTS" | — | Tiếng Anh lẫn trong title |
| `<meta name="description">` | "Sponsor Ecosystem của DSTS: Sponsor Portal, Dashboard, Impact Reports..." | — | Tiếng Anh lẫn trong description |
| Schema | Không có | — | Thiếu |

### 10. trust/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Trust Layer — Xác minh độc lập \| DSTS" | — | Tiếng Anh lẫn trong title |
| `<meta name="description">` | "Trust Layer của DSTS tích hợp trust.iai.one — nền tảng xác minh độc lập..." | — | Tiếng Anh lẫn trong description |
| Schema | Không có | — | Thiếu |

### 11. map.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Global Vietnamese Map — Bản đồ người Việt toàn cầu \| DSTS" | — | Tiếng Anh lẫn trong title |
| `<meta name="description">` | "Bản đồ tương tác toàn cầu của người Việt thành công đã xác thực..." | — | Không có EN |
| Schema | Không có | — | Thiếu |

### 12. register/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Đăng ký — Tạo tài khoản DSTS" | — | Không có EN |
| `<meta name="description">` | "Đăng ký tài khoản DSTS để tham gia Club, tích điểm Star Points..." | — | Không có EN |
| Form labels | "Email", "Mật khẩu", "Tên hiển thị", "Vai trò dự định" | — | Không có EN |
| Placeholders | "you@example.com", "Ít nhất 8 ký tự", "Tên bạn muốn hiển thị" | — | EN placeholder lẫn trong VI form |
| Checkbox | "Tôi đồng ý với Điều khoản và Chính sách bảo mật" | — | Không có EN |
| Schema | Không có | — | Thiếu |

### 13. club/membership/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Tham gia DSTS Club — Membership \| DSTS" | — | Tiếng Anh lẫn trong title |
| `<meta name="description">` | "Đăng ký thành viên DSTS Club: 3 gói Membership / Circle / Inner Circle..." | — | Tiếng Anh lẫn trong description |
| Schema | Không có | — | Thiếu |

### 14. club/wallet/index.html (Mới tạo — v3.0)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<html lang>` | `vi` | — | Không có EN |
| `<title>` | "Ví Star Points — DSTS Club Wallet" | — | Tiếng Anh lẫn trong title |
| `<meta name="description">` | "Quản lý Star Points trong DSTS Club. Xem số dư, lịch sử giao dịch..." | — | Không có EN |
| Schema | Không có | — | Thiếu |

---

## TỔNG KẾT SỐ LƯỢNG

| Hạng mục | Số lượng | Lỗi chính |
|---|---|---|
| Tổng file HTML | 87 | — |
| File có `<html lang="vi">` | 87 (100%) | — |
| File có `<html lang="en">` | 0 (0%) | **P0 — Không có trang tiếng Anh** |
| File có `hreflang` | 0 | **P0 — Không có hreflang** |
| File có title EN riêng | 0 | **P0** |
| File có meta description EN riêng | 0 | **P0** |
| File có schema JSON-LD | ~10 (ước tính) | Thiếu trên file mới |
| File có OG image cụ thể (không phải og.png chung) | 0 | **P1 — Dùng chung og.png** |
| File có alt text chi tiết cho ảnh | Cần rà | **P2** |
| Title dài > 60 chars | ít nhất 5 | **P1** |
| Lẫn tiếng Anh trong title/description tiếng Việt | 8 file mới | **P1 — "Verified Identity", "Digital Legacy", "Sponsor Ecosystem"...** |

---

## DANH SÁCH QUYẾT ĐỊNH NGÔN NGỮ CẦN KHÓA

1. **Tên thương hiệu:** "Đường Sao Tỏa Sáng" (VI) / "Path of Shining Stars" (EN) — hay giữ nguyên "DSTS"?
2. **Tên chương trình:** "Dream Nurture" có nên giữ nguyên tiếng Anh hay dịch thành "Nuôi Dưỡng Ước Mơ"?
3. **Tên tính năng:** "Star Points", "Verified Identity", "Trust Layer" — có nên dùng tiếng Việt hay giữ tiếng Anh?
4. **CTA chuẩn:** "Tham gia" / "Join" hay "Đăng ký" / "Sign up"?
5. **Menu chuẩn:** "Về chúng tôi" / "About" hay "Giới thiệu" / "About us"?

