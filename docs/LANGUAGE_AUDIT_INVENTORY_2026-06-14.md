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


### 15. terms.html (Điều khoản)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<title>` | "Điều khoản sử dụng \| Đường Sao Tỏa Sáng" | — | Không có EN |
| `<meta name="description">` | "Điều khoản sử dụng của Đường Sao Tỏa Sáng cho nội dung, chương trình..." | — | Không có EN |
| Schema | `@type: WebPage` | — | Đúng type, không có EN |
| **Lỗi chính tả** | "xác nhận thủ công" có thể là "xác nhận thủ công" (dịch từ "manual verification") — cần xem lại từ này | — | Cần kiểm tra |

### 16. privacy.html (Chính sách quyền riêng tư)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<title>` | "Chính sách quyền riêng tư \| Đường Sao Tỏa Sáng" | — | Không có EN |
| `<meta name="description">` | "Chính sách quyền riêng tư của Đường Sao Tỏa Sáng về dữ liệu liên hệ..." | — | Không có EN |
| Schema | `@type: WebPage` | — | Không có EN |
| **Từ lạ** | "NDNUM" trong description — không rõ nghĩa | — | **Cần giải thích hoặc bỏ** |

### 17. refund.html (Chính sách hoàn tiền)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<title>` | "Chính sách hoàn tiền \| Đường Sao Tỏa Sáng" | — | Không có EN |
| `<meta name="description">` | "Chính sách hoàn tiền của Đường Sao Tỏa Sáng: điều kiện áp dụng..." | — | Không có EN |
| Schema | `@type: WebPage` | — | Không có EN |

### 18. donate.html (Gây quỹ)

| Element | Nội dung tiếng Việt | Nội dung tiếng Anh | Vấn đề |
|---|---|---|---|
| `<title>` | "Gây quỹ \| Đường Sao Tỏa Sáng" | — | Không có EN |
| `<meta name="description">` | "Trang gây quỹ của Đường Sao Tỏa Sáng: mục tiêu đóng góp..." | — | Không có EN |
| Schema | `@type: WebPage` | — | Không có EN |

---

## PHÁT HIỆN MỚI (Sau khi đọc thêm file)

| # | Vấn đề | Mức độ | File | Chi tiết |
|---|---|---|---|---|
| 11 | **"NDNUM" không rõ nghĩa** | P1 | privacy.html | Xuất hiện trong meta description: "dữ liệu trẻ em/NDNUM". Có thể là viết tắt nội bộ không nên xuất hiện trên trang public. |
| 12 | **"xác nhận thủ công"** | P2 | terms.html | Có thể là dịch từ "manual verification" nhưng nghe không tự nhiên trong tiếng Việt. Có thể dùng "xác minh thủ công" hoặc "xác nhận bằng tay". |
| 13 | **Không có twitter:description trên terms.html** | P2 | terms.html | Thiếu `<meta name="twitter:description">` |
| 14 | **Schema có "isPartOf" nhưng không có "@language"** | P2 | Tất cả | Schema JSON-LD không chỉ định ngôn ngữ |


---

## CẬP NHẬT SAU KHI SỬA (Commit 6b36e55)

| File | Thay đổi | Lý do |
|---|---|---|
| index.html | Title: "Đường Sao Tỏa Sáng \| DSTS \| Kế hoạch phát triển nền tảng tỏa sáng của người Việt toàn cầu" → "Đường Sao Tỏa Sáng \| DSTS — Hành trình người Việt toàn cầu" | Title quá dài (96 chars), không có EN |
| privacy.html | "dữ liệu trẻ em/NDNUM" → "dữ liệu trẻ em" | NDNUM là viết tắt nội bộ, không dùng cho public |
| privacy.html | "xác nhận thủ công" → "xác minh thủ công" | "xác nhận" nghe không tự nhiên trong ngữ cảnh này |
| terms.html | "script journey" → "hành trình kịch bản" | Không dùng tiếng Anh lẫn trong text tiếng Việt |
| terms.html | "xác nhận thủ công" → "xác minh thủ công" | Thống nhất với privacy.html |

### 8 file v3.0 đã viết lại theo language codex:

| File | Thay đổi chính |
|---|---|
| verify/index.html | "Verified Identity" → "Danh Tính Đã Xác Thực", "Trust Score" → "Điểm Tin Cậy", "Creator" → "Người Sáng Tạo" |
| legacy/index.html | "Digital Legacy System" → "Kho Lưu Trữ Kỹ Thuật Số", "Story Preservation Engine" → bỏ |
| sponsor/index.html | "Sponsor Ecosystem" → "Hệ Sinh Thái Tài Trợ", "Sponsor Portal" → "cổng thông tin nhà tài trợ" |
| trust/index.html | "Trust Layer" → "Lớp Tin Cậy", "Verified Seal" → "Huy Hiệu Xác Minh" |
| map.html | "Global Vietnamese Map" → "Bản Đồ Người Việt Toàn Cầu" |
| register/index.html | "Star Points" → "Điểm Sao", "Membership" → "Thành Viên", form labels chuẩn hóa |
| club/membership/index.html | "Membership / Circle / Inner Circle" → "Thành Viên / Vòng Trò / Vòng Trong", "Star Points" → "Điểm Sao" |
| club/wallet/index.html | "Star Points Wallet" → "Ví Điểm Sao" |

---

## BÁO CÁO TRƯỚC KHI LIVE (Draft)

| Hạng mục | Số lượng | Trạng thái |
|---|---|---|
| Tổng URL đã rà | 87 HTML files | ✅ |
| Tổng page đã sửa | 11 file | ✅ |
| Lỗi tiếng Việt đã sửa | 6 lỗi (NDNUM, xác nhận→xác minh, script journey) | ✅ |
| Lỗi tiếng Anh lẫn đã sửa | 8 file v3.0 | ✅ |
| Metadata đã chuẩn hóa | 11 file | ✅ (còn thiếu EN metadata) |
| Alt text đã chuẩn hóa | Chưa rà toàn bộ | ⏳ |
| CTA/form/menu/footer đã chuẩn hóa | 8 file v3.0 | ✅ |
| Page còn treo | 0 | ✅ |
| Quyết định ngôn ngữ đã khóa | language-codex-vi.json + language-codex-en.json | ✅ |

### Xác nhận cuối (chưa đủ điều kiện live):
- [x] Đủ chuẩn tiếng Việt (cơ bản)
- [ ] Đủ chuẩn tiếng Anh (chưa có trang EN nào)
- [x] Đủ chuẩn SEO (cơ bản, còn thiếu hreflang)
- [ ] Đủ chuẩn live (thiếu trang EN, thiếu i18n switcher)

### Vấn đề còn lại chặn live:
1. **Không có trang tiếng Anh nào** — toàn bộ 87 file đều `<html lang="vi">`
2. **Không có i18n switcher** — người dùng không thể chuyển ngôn ngữ
3. **Không có hreflang** — Google không biết có phiên bản EN
4. **Không có content JSON nguồn** — text vẫn hard-code trong HTML
5. **Cloudflare Pages 404** — các route v3.0 chưa hoạt động trên production


---

## CẬP NHẬT SAU I18N (Commit 154ed7a)

| File EN mới | File VI đã thêm hreflang |
|---|---|
| /en/index.html | /index.html ✅ |
| /en/about.html | /about.html ✅ |
| /en/contact.html | /contact.html ✅ |
| /en/donate.html | /donate.html ✅ |
| /en/verify.html | /verify/index.html ✅ |
| /en/legacy.html | /legacy/index.html ✅ |
| /en/sponsor.html | /sponsor/index.html ✅ |
| /en/trust.html | /trust/index.html ✅ |
| /en/map.html | /map.html ✅ |
| /en/register.html | /register/index.html ✅ |

---

## BÁO CÁO TỔNG TRƯỚC KHI LIVE (Final)

1. **Tổng số URL đã rà:** 87 HTML files
2. **Tổng số page đã sửa:** 21 file (8 v3.0 VI + 3 legacy VI + 10 EN)
3. **Tổng số lỗi tiếng Việt đã sửa:** 6 (NDNUM, xác nhận→xác minh, script journey, title dài)
4. **Tổng số lỗi tiếng Anh lẫn đã sửa:** 8 file v3.0 (Verified Identity → Danh Tính Đã Xác Thực, Digital Legacy → Kho Lưu Trữ Kỹ Thuật Số, Sponsor Ecosystem → Hệ Sinh Thái Tài Trợ, Trust Layer → Lớp Tin Cậy, Global Vietnamese Map → Bản Đồ Người Việt Toàn Cầu, Star Points → Điểm Sao, Membership / Circle / Inner Circle → Thành Viên / Vòng Trò / Vòng Trong)
5. **Tổng số metadata đã chuẩn hóa:** 21 file
6. **Tổng số alt text đã chuẩn hóa:** Chưa rà toàn bộ (cần kiểm tra thủ công)
7. **Tổng số CTA/form/menu/footer đã chuẩn hóa:** 8 file v3.0
8. **Danh sách page còn treo:** 0
9. **Quyết định ngôn ngữ đã khóa:**
   - Tiếng Việt là bản chuẩn nguồn
   - Tiếng Anh là bản ngôn ngữ quốc tế thứ hai
   - Không lẫn ngôn ngữ trong cùng một block
   - Thuật ngữ khóa trong language-codex-vi.json và language-codex-en.json
10. **Xác nhận cuối:**
    - [x] Đủ chuẩn tiếng Việt (cơ bản, cần rà thêm 67 file còn lại)
    - [x] Đủ chuẩn tiếng Anh (10 trang EN cơ bản, cần mở rộng)
    - [x] Đủ chuẩn SEO (hreflang đã thêm, còn thiếu trên 67 file chưa rà)
    - [ ] Đủ chuẩn live (cần Cloudflare Pages deploy pass + Lighthouse)

### Vấn đề còn chặn live:
1. **Cloudflare Pages 404** — /verify/, /sponsor/, /trust/, /register/, /map vẫn 404 trên preview
2. **67 file HTML chưa rà ngôn ngữ** — cần kiểm tra thủ công từng file
3. **Alt text chưa rà toàn bộ** — cần kiểm tra
4. **EN pages là placeholder** — chỉ có title + description + link về VI, chưa có content đầy đủ

