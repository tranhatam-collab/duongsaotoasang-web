# BÁO CÁO LỖI TOÀN BỘ — duongsaotoasang.com
**Người kiểm tra:** Trần Hà Tâm (Founder, DSTS)
**Ngày:** 12/05/2026
**Mục tiêu:** Bàn giao team dev để khắc phục dứt điểm trước khi đẩy nội dung thật và làm SEO.
**Phương pháp kiểm tra:** Fetch trực tiếp từng URL public, đối chiếu render text, meta tags, canonical, link điều hướng và 404.

---

## 🔴 PHẦN A — LỖI NGHIÊM TRỌNG (P0 — phải sửa trước khi mở public)

### A1. URL gốc của bài viết KHÔNG hiển thị nội dung — `?slug=` không hoạt động

**URL test:** `https://duongsaotoasang.com/content?slug=sang-tao-khong-bat-dau-tu-tham-vong`

**Hiện trạng:** Trang load lên template `content.html` rồi đứng yên ở trạng thái loading:

```
NỘI DUNG CHI TIẾT
# Đang tải nội dung...
Xin chờ trong giây lát.
![]()         ← thẻ <img> trống, không có src, sẽ ra icon broken image
Đang tải nội dung...
```

**Nguyên nhân nghi ngờ:**
- File `content.html` đang dùng client-side JS để đọc query param `?slug=...`, gọi API lấy bài viết, rồi inject vào DOM.
- API hoặc không tồn tại, hoặc trả 404, hoặc trả rỗng, hoặc fetch bị lỗi CORS/network.
- KHÔNG có error handler — JS không hiển thị nội dung mẫu fallback dù chính trang chủ tuyên bố rõ: *"Khi dữ liệu thật chưa sẵn sàng, hệ thống sẽ hiện nội dung mẫu tương ứng"*. Đây là vi phạm chính nguyên tắc do founder đặt ra.

**Yêu cầu sửa:**
1. Kiểm tra endpoint API thật sự đang gọi (mở DevTools → Network → xem request).
2. Đảm bảo có ít nhất 1 bài viết với slug `sang-tao-khong-bat-dau-tu-tham-vong` trong nguồn dữ liệu (D1 / CMS / JSON tĩnh).
3. Thêm fallback: nếu API fail hoặc slug không tồn tại → hiển thị nội dung mẫu hoặc redirect về `/posts` với toast báo lỗi, KHÔNG để trang đứng yên ở "Đang tải".
4. Thẻ `<img>` trống `![]()` phải bị xóa hoặc thay bằng placeholder hợp lệ.
5. Thêm SSR / pre-render cho trang `content.html` để Google bot crawl được nội dung — hiện tại Google chỉ thấy "Đang tải nội dung..." không có gì khác → bài viết KHÔNG BAO GIỜ index được.

---

### A2. Routing bị hỏng — nhiều trang khác nhau cùng trả về `content.html` rỗng

Đây là lỗi **nghiêm trọng nhất**. Các URL sau ĐÁNG LẼ phải hiển thị trang riêng nhưng đều rơi xuống cùng một template `content.html` đang stuck loading:

| URL | Tình trạng | Đáng lẽ phải hiển thị |
|---|---|---|
| `/program` | ❌ Trả về `content.html` stuck loading | Trang chuỗi chương trình (đã link từ homepage) |
| `/about` | ❌ Trả về `content.html` stuck loading | Trang giới thiệu, tầm nhìn, sứ mệnh |
| `/contact` | ❌ Trả về `content.html` stuck loading | Trang liên hệ chính thức |
| `/content.html` | ❌ Stuck loading | Lẽ ra phải redirect về `/posts` nếu không có slug |

**Bằng chứng:** Meta canonical của cả ba URL trên đều ghi `https://duongsaotoasang.com/content.html` — nghĩa là server đang phục vụ đúng file `content.html` cho cả ba route này.

**Nguyên nhân nghi ngờ:** SPA routing hoặc rewrite rule của Cloudflare Pages / hosting đang catch-all về `content.html` thay vì 404 hoặc đúng file tương ứng. Hoặc các file `program.html`, `about.html`, `contact.html` không tồn tại và rewrite fallback đang sai.

**Yêu cầu sửa:**
1. Tạo (hoặc kiểm tra) các file thật:
   - `/program.html` hoặc `/program/index.html` với nội dung trang chương trình.
   - `/about.html` hoặc `/about/index.html` với nội dung trang giới thiệu.
   - `/contact.html` hoặc `/contact/index.html` với nội dung trang liên hệ + form.
2. Sửa cấu hình rewrite (Cloudflare `_redirects` hoặc `wrangler.toml` hoặc `next.config`) để mỗi clean URL trỏ đúng file của nó.
3. Đặt rule 404 thật — nếu route không tồn tại phải trả về trang 404 đẹp, KHÔNG trả nhầm `content.html`.
4. **Quan trọng cho SEO:** Hiện tại `/program`, `/about`, `/contact` đều khai canonical là `/content.html` → Google sẽ thấy 3 trang trùng lặp 100% với content.html → bị phạt duplicate content nặng. Phải sửa canonical về đúng URL của từng trang ngay.

---

### A3. Trang 404 hoàn toàn — `/donate` và `/transparency` không tồn tại

Hai trang này được link rõ ràng từ **homepage** trong block "BẢN ĐỒ NỀN TẢNG" như hai trụ cốt lõi:

> **Gây quỹ** — Cơ chế đóng góp minh bạch cho các dự án...
> **Minh bạch** — Báo cáo dòng lực, tiến độ triển khai...

Nhưng khi click:
- `https://duongsaotoasang.com/donate` → **HTTP 404**
- `https://duongsaotoasang.com/transparency` → **HTTP 404**

**Hậu quả:**
- Người dùng click từ trang chủ → bị bật 404 → mất niềm tin nền tảng.
- Đặc biệt nguy hiểm với trang **donate**: founder đang định mở gây quỹ, link gãy = không thu được tiền + ảnh hưởng uy tín.
- Trang **transparency** gãy đi ngược với chính thông điệp "minh bạch" của thương hiệu.

**Yêu cầu sửa:**
1. Dựng ngay 2 trang `/donate` và `/transparency` ít nhất ở mức placeholder có nội dung mẫu đầy đủ (như đúng nguyên tắc founder đã đặt: *"không để bất kỳ trang nào rơi vào trạng thái trống"*).
2. Trong lúc chờ nội dung thật, đặt khung skeleton: tiêu đề, mô tả, "Sắp ra mắt", CTA email subscribe.
3. Hoặc tạm thời redirect 301 về một trang chờ chung kèm form email — KHÔNG để 404.

---

### A4. Trang `/posts` (Thư viện bài viết) stuck loading mãi mãi

**URL:** `https://duongsaotoasang.com/posts`

**Hiện trạng:** Header và mô tả hiển thị OK, nhưng phần danh sách bài viết đứng ở:
```
DANH SÁCH BÀI VIẾT
## Thư viện bài viết
...
Đang tải bài viết...
```

**Cùng vấn đề với A1:**
- Trang dùng JS gọi API danh sách bài viết.
- API hỏng, trả rỗng, hoặc fetch lỗi.
- Không có fallback hiển thị nội dung mẫu.
- Search box hiện ra nhưng vô dụng vì không có dữ liệu để search.

**Yêu cầu sửa:**
1. Đảm bảo API list bài viết có hoạt động (nếu chưa thì làm endpoint trả mảng `[]` để JS handle được state empty).
2. Khi API fail hoặc trả rỗng → bắt buộc hiển thị 3–6 card bài viết mẫu (đúng nguyên tắc founder đã ghi trên chính trang đó).
3. Khi user đang chờ API > 3 giây → hiển thị skeleton loader (xám lượn sóng) thay vì text "Đang tải bài viết..." trơ trọi.
4. Phải có error state: "Không tải được danh sách. Thử lại?" + nút retry.

---

## 🟠 PHẦN B — LỖI QUAN TRỌNG (P1 — sửa ngay sau P0)

### B1. Canonical URL sai trên hàng loạt trang

Như đã nêu ở A2, các trang `/program`, `/about`, `/contact`, `/content` đều có canonical trỏ về `https://duongsaotoasang.com/content.html`.

**Tác hại SEO:**
- Google sẽ chỉ index 1 URL (`content.html`) và bỏ qua tất cả các URL còn lại.
- Toàn bộ traffic SEO của các trang quan trọng (chương trình, giới thiệu, liên hệ) sẽ bị mất.
- Khi share link `/about` lên mạng xã hội, OG tag cũng trỏ về `content.html` → preview hiển thị sai.

**Yêu cầu sửa:** Mỗi trang phải tự khai canonical đúng với chính URL của nó. Đây phải là bước review bắt buộc khi tạo trang mới.

---

### B2. URL không nhất quán — chỗ dùng `.html`, chỗ không

Quan sát:
- `/posts`, `/events`, `/scripts`, `/about`, `/contact`, `/program`, `/donate`, `/transparency` → clean URL (không `.html`).
- `/scripts/rising-entrepreneur.html`, `/scripts/global-artist.html`, ... → có `.html`.
- Trong nút "Quay lại thư viện Scripts" của trang script detail → link trỏ về `/scripts.html` (có `.html`), nhưng homepage trỏ `/scripts` (không `.html`).

**Vấn đề:**
- Cùng nội dung có thể truy cập bằng 2 URL khác nhau (`/scripts` và `/scripts.html`) → duplicate content.
- Người dùng và bot bị confuse.
- Link nội bộ có thể bị gãy nếu refactor.

**Yêu cầu sửa:**
1. Chọn 1 chuẩn duy nhất — đề xuất: **clean URL không `.html`** vì hiện đại, SEO tốt hơn, dễ refactor.
2. Setup 301 redirect từ `.html` → clean URL (Cloudflare `_redirects` rất đơn giản).
3. Sửa toàn bộ link nội bộ trong source về clean URL.

---

### B3. Khu vực "Nội dung nổi bật" trên homepage không có dữ liệu

Trên trang chủ có block:
```
NỘI DUNG NỔI BẬT
## Bài viết và hồ sơ nổi bật
Khu vực này ưu tiên lấy dữ liệu từ API nội bộ. Nếu API lỗi hoặc chưa có nội dung thật,
hệ thống vẫn phải hiển thị đầy đủ nội dung mẫu để website luôn dùng được ngay.
[Xem tất cả bài viết]
```

**Hiện trạng:** Block này chỉ hiển thị tiêu đề + mô tả + nút CTA. KHÔNG có card bài viết nào — kể cả nội dung mẫu.

**Vi phạm chính nguyên tắc founder đặt ra ngay trong block này.**

**Yêu cầu sửa:** Render fallback 3 card mẫu (tiêu đề, ảnh thumbnail, mô tả, link sang `/content?slug=...`) ngay cả khi API rỗng.

---

### B4. Hệ thống chưa có Sitemap và Robots

Test:
- `https://duongsaotoasang.com/sitemap.xml` → không truy cập được.

**Hậu quả:** Google không biết đường crawl, các trang con sẽ không bao giờ được index nhanh.

**Yêu cầu sửa:**
1. Tạo `sitemap.xml` liệt kê tất cả URL chính (`/`, `/about`, `/program`, `/scripts`, `/scripts/*`, `/posts`, `/events`, `/donate`, `/transparency`, `/contact`).
2. Tạo `robots.txt` cho phép crawl + trỏ về sitemap.
3. Submit sitemap qua Google Search Console.

---

### B5. Trang không index trên Google

Khi search `site:duongsaotoasang.com` → **không có kết quả nào** xuất hiện.

**Nguyên nhân tổng hợp:** A1 + A2 + B1 + B4 + thiếu SSR cho content/posts.

Sau khi sửa các lỗi trên, cần:
1. Submit lại sitemap.
2. Yêu cầu Google index lại trang chủ và các trang đã sửa.
3. Theo dõi Search Console 1–2 tuần.

---

## 🟡 PHẦN C — LỖI TRUNG BÌNH (P2 — sửa khi có thời gian)

### C1. Card kịch bản trên `/scripts` rendered concat không space

Khi đọc raw text của `/scripts`, các card kịch bản hiển thị dưới dạng:
```
Doanh nhânThe Rising EntrepreneurHành trình của doanh nhân Việt...Kịch bản sân khấu·2025
```

Các trường (category badge, title, description, type, year) bị concat sát nhau không khoảng trắng. Trên giao diện CSS có thể trông OK (nhờ block layout), nhưng:
- **Accessibility:** Screen reader sẽ đọc thành 1 dòng dính liền → người khiếm thị không hiểu.
- **SEO:** Google bot đọc text thuần → ranking giảm vì nội dung dính cục.
- **Copy text:** User copy text từ card sẽ ra một mớ dính.

**Yêu cầu sửa:** Thêm space hoặc dấu phân cách giữa các trường, hoặc gói trong các `<span>` riêng có aria-label rõ ràng. Test bằng cách disable CSS xem text có đọc được không.

---

### C2. Thẻ ảnh trống trên trang content

Trong template `content.html` có dòng `![]()` — tức `<img src="" alt="">` không có nguồn.

**Yêu cầu sửa:**
- Khi không có ảnh: ẩn hoàn toàn thẻ `<img>` bằng JS, hoặc render placeholder SVG hợp lệ.
- Không bao giờ để `src=""` — browser sẽ gửi request về chính trang hiện tại làm tốn tài nguyên + log lỗi.

---

### C3. QR thanh toán 25,000 USD và 20,000 USD đặt hardcode

Trên trang `/scripts/rising-entrepreneur.html` và `/scripts/global-artist.html`:
- Hiển thị QR ảnh tĩnh `/assets/qr-payment.png`.
- Số tiền lớn (25k USD / 20k USD) nhưng không có flow xác nhận đơn hàng, không có ID giao dịch, không có hệ thống ghi nhận.

**Rủi ro:**
- Người dùng quét QR → chuyển khoản → không có cách track ai đã trả, đã trả bao nhiêu, cho gói nào.
- Phụ thuộc 100% vào việc user "gửi xác nhận qua trang liên hệ" — mà trang `/contact` thì **đang gãy** (A2).
- Không an toàn cho founder và khách hàng.

**Yêu cầu sửa:**
1. Trước mắt: ít nhất phải đảm bảo `/contact` hoạt động (sửa A2 xong).
2. Trung hạn: tích hợp PayPal subscription / Stripe / cổng nội địa với webhook → tự ghi nhận đơn hàng, gắn `order_id` vào nội dung chuyển khoản hiển thị riêng cho từng phiên user.
3. Thêm bảng admin xem ai đã đặt gói nào, ngày nào, đã verify chưa.

*(Đây là quyết định business của founder, dev cứ chuẩn bị tích hợp trước.)*

---

### C4. Footer trùng nội dung giữa các trang

Các trang `/scripts`, `/events`, `/scripts/rising-entrepreneur.html` đều có footer:
```
© Đường Sao Tỏa Sáng
Kết nối cộng đồng người Việt muôn nơi.
```

Còn homepage thì có footer khác:
```
Đường Sao Tỏa Sáng · DSTS
Hành trình tỏa sáng của người Việt Nam trên toàn cầu.
© 2026 Duong Sao Toa Sang.
Built with nguoiviet.muonnoi.org.
```

**Yêu cầu sửa:** Đồng bộ footer giữa tất cả các trang. Đặt thành 1 component dùng chung. Bổ sung link nhanh, social media, copyright year tự update.

---

### C5. Thiếu header navigation rõ ràng

Khi đọc raw text các trang, không thấy block navigation tổng quát (Trang chủ / Giới thiệu / Chương trình / Kịch bản / Sự kiện / Bài viết / Liên hệ).

Chỉ thấy "Bỏ qua nội dung điều hướng" → tức có nav nhưng chỉ hiển thị bằng icon hoặc hamburger, không có text accessible.

**Yêu cầu sửa:**
1. Render nav text accessible cho cả desktop và mobile.
2. Đảm bảo screen reader đọc được tên các mục menu.
3. Có sticky header để user luôn truy cập được menu khi cuộn dài.

---

## 🟢 PHẦN D — NHỮNG GÌ ĐANG HOẠT ĐỘNG TỐT

Để team dev không tốn công sửa nhầm, đây là các phần hiện đang **OK**:

| Trang | Tình trạng |
|---|---|
| `/` (Homepage) | ✅ Hiển thị đầy đủ nội dung tĩnh, các link điều hướng đúng |
| `/scripts` | ✅ Render danh sách 9 kịch bản đầy đủ |
| `/scripts/rising-entrepreneur.html` | ✅ Render đủ nội dung, lộ trình, gói thanh toán |
| `/scripts/global-artist.html` | ✅ Render đủ nội dung |
| `/events` | ✅ Render đầy đủ các chuỗi sự kiện |

(Lưu ý: "OK" ở đây chỉ là về mặt render — vẫn cần audit thêm về styling, mobile responsive, performance.)

---

## 📋 THỨ TỰ ƯU TIÊN SỬA

### Sprint 1 (1–2 ngày) — Stop the bleeding
1. **A2** — Sửa routing để `/program`, `/about`, `/contact` trỏ đúng file (chặn duplicate canonical).
2. **A3** — Dựng 2 trang `/donate` và `/transparency` ít nhất ở mức placeholder.
3. **A1, A4** — Sửa fallback content cho `/content?slug=...` và `/posts` (kể cả khi API chưa sẵn).

### Sprint 2 (3–5 ngày) — SEO + cấu trúc
4. **B1** — Sửa canonical cho từng trang về đúng URL của nó.
5. **B2** — Chuẩn hóa URL không `.html` + setup 301.
6. **B4** — Tạo `sitemap.xml` + `robots.txt`.
7. **B3** — Render fallback 3 card mẫu ở block "Nội dung nổi bật" trang chủ.

### Sprint 3 (1 tuần) — Hoàn thiện
8. **C1** — Sửa render card scripts có spacing.
9. **C2** — Xử lý ảnh trống.
10. **C4, C5** — Đồng bộ footer + nav rõ ràng.
11. **C3** — Bắt đầu tích hợp cổng thanh toán thật cho scripts cao cấp.

### Sprint 4 (sau khi public) — SEO push
12. Submit lại sitemap qua Google Search Console.
13. Request indexing tất cả URL chính.
14. Audit Lighthouse, fix performance + accessibility tới >= 90 mỗi mục.

---

## ✅ CHECKLIST NGHIỆM THU

Trước khi báo "đã xong", team dev phải tự test:

- [ ] Mở `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → thấy bài viết thật HOẶC fallback có nội dung, KHÔNG đứng "Đang tải...".
- [ ] Mở `/program`, `/about`, `/contact` → mỗi trang có nội dung riêng, canonical đúng.
- [ ] Mở `/donate` và `/transparency` → có nội dung (dù placeholder), KHÔNG 404.
- [ ] Mở `/posts` → thấy danh sách bài viết hoặc card mẫu, KHÔNG đứng loading.
- [ ] View-source mỗi trang → meta canonical, og:url, og:title đều đúng với URL hiện tại.
- [ ] `sitemap.xml` truy cập được + liệt kê đầy đủ.
- [ ] `robots.txt` truy cập được.
- [ ] Click thử mọi link từ homepage → không link nào gãy hoặc redirect sai.
- [ ] Test trên mobile (375px width) → nav + content đều usable.
- [ ] Test Lighthouse → SEO >= 90.

---

**Liên hệ founder để clarify nếu có chỗ chưa rõ.**
**Founder yêu cầu:** đẩy fix lên branch riêng → PR → review trước khi merge `main`.
