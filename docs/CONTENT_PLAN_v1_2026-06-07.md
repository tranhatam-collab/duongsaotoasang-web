# KẾ HOẠCH CONTENT — DUONGSAOTOASANG.COM
## Ngày: 2026-06-07 · Theo Master Plan v2.0 (Trụ 2: Content & UX Integrity, 11→20đ)

> **Nguyên tắc:** Long-form, "đọc chậm để sống sâu". Song ngữ là **transcreation** (không dịch máy). Mỗi bài có chiều sâu nhận thức, không placeholder, không jargon.

---

## 1. HIỆN TRẠNG (AUDIT THỰC TẾ)

### Word count các trang (text hiển thị, ước tính)
| Trang | Từ | Đánh giá |
|-------|-----|----------|
| index.html | 6.848 | ✅ Đủ |
| content.html | 23.714 | ✅ Hub đầy đủ |
| posts.html | 3.691 | ⚠️ Listing OK, bài chi tiết stub |
| dream-nurture.html | 2.167 | ✅ |
| events.html | 1.392 | ⚠️ Cần ngày/giờ/địa điểm cụ thể |
| about.html | 1.323 | ✅ |
| legal.html | 1.117 | ✅ |
| contact.html | 1.107 | ✅ |
| program.html | 1.285 | ✅ |
| donate.html | 1.061 | ✅ |
| scripts.html | 1.020 | ⚠️ Cần ≥9 kịch bản detail |
| transparency.html | 868 | ✅ |
| terms.html | 813 | ⚠️ Cần VN+US dual jurisdiction |
| refund.html | 790 | ✅ (mới tạo) |
| privacy.html | 689 | ✅ |
| support.html | 552 | ❌ Mỏng |
| club.html | 486 | ❌ Mỏng nhất |

### Bài viết trong D1 (`migrations/0004_seed.sql`)
8 bài `type='post'` đã seed — **nhưng mỗi bài chỉ ~2 đoạn (~120–180 từ)**, là stub:
1. `hanh-trinh-nhin-lai-chinh-minh` — Hành trình nhìn lại chính mình
2. `sang-tao-khong-bat-dau-tu-tham-vong` — Sáng tạo không bắt đầu từ tham vọng
3. `cong-dong-khong-phai-dam-dong` — Cộng đồng không phải đám đông
4. `mot-doi-song-khong-bi-pha-tan-boi-xa-hoi` — Đời sống không bị phân tán
5. `doc-cham-de-song-sau` — Đọc chậm để sống sâu
6. `khoi-nghiep-tu-noi-song-that` — Khởi nghiệp từ nơi sống thật
7. `vi-sao-con-nguoi-mat-phuong-huong` — Vì sao con người mất phương hướng
8. `duong-di-cua-nhung-nguoi-muon-song-khac` — Đường đi của những người muốn sống khác

> Đạt số lượng (≥6) nhưng **chưa đạt chiều sâu**. Master plan Trụ 1 yêu cầu "bài viết chiều sâu / long-form".

---

## 2. GAP CONTENT THEO MASTER PLAN

| Yêu cầu (Trụ 2) | Mục tiêu | Hiện tại | Gap |
|------------------|----------|----------|-----|
| ≥6 bài viết thật `/posts` | 6+ | 8 stub | Mở rộng 8 bài → long-form |
| ≥9 kịch bản detail đầy đủ | 9 | scripts.html mỏng | Cần ≥9 kịch bản chi tiết |
| ≥3 sự kiện ngày/giờ/địa điểm | 3 | events.html chung chung | Cần 3 event cụ thể |
| Mọi trang nav có content thật | 100% | club/support mỏng | Bổ sung club + support |
| Song ngữ transcreation | VI+EN/bài | EN ngắn | Transcreate EN cho 8 bài |

---

## 3. KẾ HOẠCH SẢN XUẤT CONTENT

### Batch C1 — Mở rộng 8 bài posts thành long-form (P0)
**Target mỗi bài:** 900–1.400 từ VI + transcreation EN, 5–7 đoạn, có:
- Mở bài (vấn đề thật người Việt đang gặp)
- 3–4 luận điểm chính với ví dụ đời sống
- Đoạn chuyển hóa (góc nhìn DSTS)
- Kết + call-to-reflection (không hard-sell)

| Bài | Slug | Góc mở rộng | Effort |
|-----|------|-------------|--------|
| 1 | hanh-trinh-nhin-lai-chinh-minh | Thêm phần "5 dấu hiệu đang sống theo quán tính" | 0.5d |
| 2 | sang-tao-khong-bat-dau-tu-tham-vong | Thêm case "thấy rõ nhu cầu thật" | 0.5d |
| 3 | cong-dong-khong-phai-dam-dong | Thêm "3 tầng tin cậy trong cộng đồng" | 0.5d |
| 4 | mot-doi-song-khong-bi-pha-tan-boi-xa-hoi | Thêm "khung thiết kế đời sống" | 0.5d |
| 5 | doc-cham-de-song-sau | Thêm "phương pháp đọc chậm 4 bước" | 0.5d |
| 6 | khoi-nghiep-tu-noi-song-that | Thêm "khởi nghiệp từ giá trị, không từ nỗi sợ" | 0.5d |
| 7 | vi-sao-con-nguoi-mat-phuong-huong | Thêm "bản đồ phương hướng nội tâm" | 0.5d |
| 8 | duong-di-cua-nhung-nguoi-muon-song-khac | Thêm "chân dung người sống khác" | 0.5d |

**Thực thi:** cập nhật `content_vi` + `content_en` trong seed mới `migrations/0011_posts_longform.sql` (UPSERT theo slug).

### Batch C2 — Thêm 4 bài mới (P1, đạt 12 bài tổng)
| # | Tiêu đề đề xuất | Slug | Chủ đề |
|---|-----------------|------|--------|
| 9 | Sống chậm không phải lười, mà là chọn đúng nhịp | song-cham-khong-phai-luoi | Nhịp sống |
| 10 | Tri thức sống khác gì thông tin | tri-thuc-song-khac-gi-thong-tin | Nhận thức |
| 11 | Khi nào nên rời khỏi điều quen thuộc | khi-nao-nen-roi-dieu-quen-thuoc | Chuyển hóa |
| 12 | Đường Sao Tỏa Sáng và lời mời sống tỉnh thức | loi-moi-song-tinh-thuc | Brand story |

### Batch C3 — Kịch bản (≥9) trong scripts.html (P1)
Mỗi kịch bản cần: bối cảnh, nhân vật, lời thoại/diễn tiến, thông điệp, thời lượng. Bổ sung từ hiện trạng lên ≥9 kịch bản đầy đủ detail.

### Batch C4 — Sự kiện cụ thể (≥3) trong events.html (P1)
Mỗi event cần: **tên · ngày · giờ · địa điểm/online link · mô tả · CTA đăng ký**. Ví dụ khung:
| Event | Ngày | Hình thức |
|-------|------|-----------|
| Buổi đọc chậm cùng DSTS #1 | (cụ thể) | Online Zoom |
| Workshop "Thiết kế đời sống" | (cụ thể) | Offline TP.HCM |
| Talk "Sáng tạo từ sự thấy rõ" | (cụ thể) | Hybrid |

### Batch C5 — Bổ sung trang mỏng (P1)
| Trang | Hiện | Target | Nội dung cần thêm |
|-------|------|--------|-------------------|
| club.html | 486w | ≥800w | Mô tả CLB, quyền lợi thành viên, cách tham gia, FAQ |
| support.html | 552w | ≥800w | Kênh hỗ trợ, FAQ, thời gian phản hồi, escalation |
| terms.html | 813w | bổ sung | VN+US dual jurisdiction (Trụ 4 yêu cầu) |
| events.html | 1.392w | bổ sung | 3 event cụ thể (C4) |

---

## 4. CHECKLIST CHẤT LƯỢNG MỖI BÀI (DoD)
- [ ] VI sạch hoàn toàn, không xen tiếng Anh
- [ ] EN là transcreation (không dịch máy)
- [ ] ≥900 từ (long-form), 5–7 đoạn
- [ ] Có excerpt riêng VI/EN
- [ ] Tags phân loại đúng
- [ ] Không placeholder/jargon nội bộ
- [ ] CTA-to-reflection cuối bài (không hard-sell)
- [ ] `published=1`, `created_at`/`updated_at` đúng

---

## 5. THỨ TỰ THỰC THI
1. **C1** (P0) — Mở rộng 8 bài → long-form qua `0011_posts_longform.sql`
2. **C5 terms** (P0) — VN+US dual jurisdiction
3. **C3 + C4** (P1) — 9 kịch bản + 3 event cụ thể
4. **C2** (P1) — 4 bài mới (→ 12 bài)
5. **C5 club/support** (P1) — bổ sung trang mỏng

**Tổng effort content:** ~6–7 ngày.
**Đóng góp điểm:** Trụ 2 Content 11→20 (+9đ) khi C1+C3+C4+C5 done.

---

*Kế hoạch này grounded trên audit thực tế seed D1 + word count 17 trang. Khi sản xuất, viết vào migration UPSERT + cập nhật HTML trang tĩnh tương ứng.*
