# DSTS — SPRINT 0 GITHUB ISSUES + DOD

> **Tham chiếu:** MASTER_PLAN_v1.1_FINAL.md Mục IV Sprint 0
> **Mục tiêu:** Cứu site khỏi lỗi chết trong 3 ngày. **45 → min 63, target 70**.
> **Tinh thần:** *"Không làm thêm trang đẹp nữa trước. Khóa routing + content fallback + contact/donate/transparency."*
> **Trạng thái:** 🔒 Founder Lock — bám đúng 9 issue dưới, không mở rộng scope.

## QUY ƯỚC TICKET

- **Owner R / Approver A:** mỗi issue có 1 R duy nhất + 1 A duy nhất.
- **Risk Tier T1/T2/T3:** T1 self-approve PR, T2 cần Founder, T3 cần Founder + Legal.
- **DoD:** Definition of Done — mọi tiêu chí phải pass trước khi đóng issue.
- **Branch:** `sprint-0/issue-<NN>-<slug>` (vd `sprint-0/issue-01-redirects`).
- **PR title:** `[Sprint 0][Issue NN] <Title>`.
- **Labels:** `sprint-0`, `P0`/`P1`, `tier-T1`/`T2`/`T3`.

---

## ISSUE 01 — Fix routing + `_redirects` final

**Labels:** `sprint-0`, `P0`, `tier-T2` · **Owner R:** Tech Lead · **Approver A:** Founder · **Effort:** 2h · **Day:** 1

### Mô tả

Cloudflare Pages tự strip `.html` khỏi URL. `_redirects` cũ có rule `/about → /about.html 200` tạo redirect loop. Phải simplify để chỉ giữ:
- Legacy 301 (`.html` → clean URL)
- Special redirect (`/programs` → `/program`)
- KHÔNG có rewrite rule trùng với native behavior

### Files

```
_redirects
```

### DoD

```
[ ] Curl /about, /program, /contact, /donate, /transparency, /legal, /posts, /events, /scripts → tất cả trả 200
[ ] Curl /about.html → 301 redirect đến /about
[ ] Curl /programs → 301 redirect đến /program
[ ] Curl /xyz-random-not-exist → 404 (rơi vào 404.html)
[ ] Curl /scripts/rising-entrepreneur.html → 301 đến /scripts/rising-entrepreneur
[ ] Không còn redirect loop bất kỳ URL nào (test bằng curl -L)
[ ] PR ref dòng V.1 trong MASTER_PLAN_v1.1_FINAL.md
```

---

## ISSUE 02 — Build designed `404.html`

**Labels:** `sprint-0`, `P0`, `tier-T1` · **Owner R:** Tech Lead · **Approver A:** Founder · **Effort:** 2h · **Day:** 1

### Mô tả

URL không tồn tại phải trả về `404.html` brand-aligned, không phải Cloudflare 404 mặc định.

### Files

```
404.html
```

### DoD

```
[ ] Title: "Không tìm thấy trang | Đường Sao Tỏa Sáng"
[ ] <meta name="robots" content="noindex,follow">
[ ] Hero brand-aligned (cùng style homepage)
[ ] 3 CTA: Về trang chủ / Khám phá chương trình / Xem kịch bản
[ ] Header + Footer thống nhất với các trang khác
[ ] Mobile responsive (test 320/375/768)
[ ] Curl bất kỳ URL random → return content của 404.html
```

---

## ISSUE 03 — Build `/posts` fallback

**Labels:** `sprint-0`, `P0`, `tier-T2` · **Owner R:** Tech Lead · **Approver A:** Founder · **Effort:** 3h · **Day:** 1

### Mô tả

`/posts` đứng yên ở "Đang tải bài viết..." khi API rỗng/lỗi. Phải có fallback từ `/data/posts.json` (≥ 6 bài mẫu).

### Files

```
posts.html
data/posts.json (mới)
assets/app-v5.js (update loadPosts function)
```

### DoD

```
[ ] /data/posts.json có ≥ 6 bài mẫu với đủ field (slug, title, excerpt, cover, tags, publishedAt, readingTime)
[ ] loadPosts() có timeout 5s, AbortController
[ ] API trả lỗi → render fallback từ /data/posts.json
[ ] API trả mảng rỗng → render fallback
[ ] Mỗi card link đúng /content?slug=<slug>
[ ] Loading skeleton thay text "Đang tải bài viết..."
[ ] Empty state có CTA "Thử lại" + link /posts
[ ] Test disable network → /posts vẫn render
[ ] PR ref dòng V.4 + V.6 trong MASTER_PLAN_v1.1_FINAL.md
```

---

## ISSUE 04 — Build `/content` fallback 5 states

**Labels:** `sprint-0`, `P0`, `tier-T2` · **Owner R:** Tech Lead · **Approver A:** Founder · **Effort:** 4h · **Day:** 1

### Mô tả

`/content?slug=...` stuck "Đang tải nội dung..." mãi mãi. Phải xử lý đủ 5 trạng thái: loading, success, empty, error, not found.

### Files

```
content.html
data/content.json (mới)
assets/app-v5.js (update loadContent function)
```

### DoD

```
[ ] /data/content.json có ≥ 3 bài (bao gồm slug "sang-tao-khong-bat-dau-tu-tham-vong" để pass Founder test)
[ ] State 1 - Loading: hiển thị skeleton (không phải text "Đang tải...")
[ ] State 2 - Success: render bài đầy đủ
[ ] State 3 - Empty (API trả null/empty body): fallback từ /data/content.json
[ ] State 4 - Error (API fail / timeout 5s): fallback từ /data/content.json
[ ] State 5 - Not Found (slug không có ở API và fallback): trang "Không tìm thấy" với CTA về /posts
[ ] /content (không có slug) → redirect /posts
[ ] AbortController timeout 5s bắt buộc
[ ] Founder demo /content?slug=sang-tao-khong-bat-dau-tu-tham-vong → bài viết render thành công
[ ] PR ref dòng V.3 trong MASTER_PLAN_v1.1_FINAL.md
```

---

## ISSUE 05 — Build `/contact` page (form hoạt động)

**Labels:** `sprint-0`, `P0`, `tier-T2` · **Owner R:** Tech Lead · **Approver A:** Founder · **Effort:** 4h · **Day:** 1-2

### Mô tả

`/contact` hiện đã tồn tại nhưng form chưa gửi được email. Thêm form với Cloudflare Turnstile + Resend (hoặc Cloudflare Email Workers).

### Files

```
contact.html
functions/api/contact.js (mới)
```

### DoD

```
[ ] Form có 3 trường: tên, email, message + Turnstile widget
[ ] Submit → POST /api/contact
[ ] Cloudflare Worker verify Turnstile token
[ ] Gửi email về inbox founder (qua Resend hoặc MailChannels)
[ ] Auto-reply email cho user
[ ] Hiển thị success message inline (không redirect)
[ ] Error state nếu Turnstile fail
[ ] Thông tin phụ trên trang: email, Zalo, SLA phản hồi
[ ] Test gửi thử → email đến founder + auto-reply user
```

---

## ISSUE 06 — Build `/donate` page

**Labels:** `sprint-0`, `P0`, `tier-T2` · **Owner R:** Content Writer + Tech Lead · **Approver A:** Founder · **Effort:** 3h · **Day:** 2

### Mô tả

`/donate` phải có đủ 8 mục bắt buộc (vì site đang chưa có payment processor thật, mọi flow dùng manual confirmation).

### Files

```
donate.html
```

### DoD

```
[ ] 8 mục bắt buộc:
    1. Mục tiêu quỹ
    2. Hình thức đóng góp (bank transfer + QR + PayPal placeholder)
    3. Cách xác nhận (manual qua /contact)
    4. Chính sách hoàn tiền (link /refund)
    5. Điều khoản sử dụng quỹ
    6. Liên hệ xác minh
    7. Trạng thái quỹ ("đang chuẩn bị, chưa mở nhận đại chúng")
    8. Báo cáo định kỳ (link /transparency)
[ ] Title + canonical đúng /donate
[ ] CTA "Liên hệ xác minh" link đến /contact
[ ] KHÔNG có nút "Donate Now" hoạt động (chờ payment processor)
[ ] Câu disclaimer rõ: "Test payment confirmation flow bằng giao dịch thử / manual confirmation"
```

---

## ISSUE 07 — Build `/transparency` page

**Labels:** `sprint-0`, `P0`, `tier-T2` · **Owner R:** Content Writer · **Approver A:** Founder · **Effort:** 2h · **Day:** 2

### Mô tả

`/transparency` phải có nội dung công bố nguyên tắc + báo cáo khởi tạo Q1/2026.

### Files

```
transparency.html
```

### DoD

```
[ ] Title + canonical đúng /transparency
[ ] 4 báo cáo:
    1. Báo cáo dòng tiền (placeholder, công bố khi có)
    2. Báo cáo hoạt động (placeholder)
    3. Báo cáo dự án (placeholder)
    4. Nguyên tắc công bố
[ ] Trạng thái: "khung báo cáo đã mở, số liệu thật đang chuẩn bị"
[ ] CTA đăng ký nhận báo cáo qua email (link /contact)
[ ] Lịch cập nhật định kỳ (hàng quý)
```

---

## ISSUE 08 — Add legal/payment disclaimer

**Labels:** `sprint-0`, `P1`, `tier-T3` · **Owner R:** Content Writer · **Approver A:** Founder + Legal · **Effort:** 4h · **Day:** 2-3

### Mô tả

Tạo `legal.html` + thêm payment disclaimer chuẩn vào mọi trang `/scripts/*`. Khi chưa xác minh pháp nhân, dùng câu thay thế: *"Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý."*

### Files

```
legal.html (đã có, refactor)
scripts/rising-entrepreneur.html (và 8 trang scripts khác)
```

### DoD

```
[ ] legal.html có 4 section: Điều khoản sử dụng, Quyền riêng tư, Hoàn tiền, Xác nhận thanh toán
[ ] Mỗi /scripts/* có block .payment-disclaimer (HTML mẫu V.5 trong MASTER_PLAN_v1.1)
[ ] Disclaimer ghi rõ: "không cam kết nổi tiếng, doanh thu, thành công hay kết quả truyền thông"
[ ] Disclaimer link đến /terms, /refund, /privacy (có thể là same-page anchor trong legal.html nếu chưa tách)
[ ] Footer mọi trang: dùng "Đơn vị vận hành sẽ được công bố sau khi hoàn tất xác minh pháp lý" (cho đến khi xác minh VIET CAN NEW CORP / VFA)
[ ] Founder + Legal review trước merge (Risk Tier T3)
```

---

## ISSUE 09 — Smoke test script + GitHub Action

**Labels:** `sprint-0`, `P0`, `tier-T1` · **Owner R:** Tech Lead · **Approver A:** Founder · **Effort:** 2h · **Day:** 3

### Mô tả

Bash script crawl 100% URL chính, log status code, fail nếu có URL ≠ expected. Plus GitHub Action chạy mỗi push lên `main`.

### Files

```
scripts/smoke.sh (mới)
.github/workflows/smoke-test.yml (mới)
```

### DoD

```
[ ] scripts/smoke.sh executable, test 24+ URL
[ ] Mỗi URL có expected status (200 hoặc 404 intentional)
[ ] Output table pass/fail từng URL với màu (✅ ❌)
[ ] Exit 0 nếu all pass, exit 1 nếu có fail
[ ] GitHub Action workflow chạy sau mỗi push lên main
[ ] Action ping production URL (sau 60s để wait Cloudflare deploy)
[ ] Failure notification gửi về email founder (qua GitHub default)
[ ] Output sample paste vào PR description
```

---

## GATE TỔNG SPRINT 0 — Founder QA

Trước khi merge `main` và chuyển sang Sprint 1:

### Smoke test
- [ ] `./scripts/smoke.sh https://duongsaotoasang.com` → 100% pass (≥ 22/24 URL)

### Manual demo (Founder thực hiện)
- [ ] Mở `/content?slug=sang-tao-khong-bat-dau-tu-tham-vong` → bài viết hiện ra (không "Đang tải...")
- [ ] Mở `/posts` → danh sách bài mẫu hiện ra
- [ ] Mở `/about`, `/program`, `/contact` → mỗi trang nội dung riêng + title riêng
- [ ] Mở `/donate`, `/transparency`, `/legal` → đầy đủ 8 mục / 4 báo cáo / 4 section
- [ ] Click thử 100% link từ homepage → không gãy
- [ ] Submit form `/contact` thử → có email về inbox founder
- [ ] Mở `/404-test-random` → 404.html brand-aligned
- [ ] Mở trên iPhone + Android → không vỡ layout

### Điểm số sau Sprint 0
- [ ] Đạt **tối thiểu 63/100** (gate PASS)
- [ ] Mục tiêu **70/100** (gate EXCELLENT)

### Approval
- [ ] PR description paste smoke test output + screenshot Lighthouse mobile
- [ ] Founder ký "OK Sprint 0" trong PR comment
- [ ] Tech Lead merge `main` → deploy production
- [ ] Sau merge, chạy lại smoke test → lưu `_artifacts/sprint-0-final-smoke.txt`

---

## DEPENDENCY GRAPH

```
Day 1                          Day 2                     Day 3
─────                          ─────                     ─────

Issue 01 _redirects ──┐
                      │
Issue 02 404.html ────┤
                      │
Issue 03 /posts ──────┼─→ Issue 05 /contact ──┐
                      │                       │
Issue 04 /content ────┘                       ├─→ Issue 08 legal ──┐
                                              │                    │
Issue 06 /donate ─────────────────────────────┤                    │
                                              │                    │
Issue 07 /transparency ───────────────────────┘                    │
                                                                   │
                                              Issue 09 smoke ──────┴─→ GATE
                                              (sau khi tất cả issue khác done)
```

---

## RISK & ESCALATION

| Rủi ro | P×I | Mitigation |
|---|---|---|
| Resend free tier hết quota khi test contact | Med × Low | Dùng Cloudflare MailChannels (free) thay backup |
| Founder không có thời gian QA cuối ngày 3 | Med × High | SLA QA tối đa 24h, có deputy reviewer là Tech Lead |
| Legal entity chưa verify kịp ngày 2 | High × Med | Dùng câu thay thế "Đơn vị vận hành sẽ công bố sau xác minh pháp lý" |
| Cloudflare cache redirect cũ vẫn còn | Med × Med | Force purge qua dashboard hoặc rename file v6 |
| Test data /data/posts.json + /data/content.json chưa đủ chất lượng | Low × Med | Founder + Content Writer review trước Day 1 end |

---

## NEXT STEP

Sau Gate Sprint 0 pass:
- Em (Claude) tách Sprint 1 thành tickets tương tự (Trust + Legal hoàn chỉnh)
- Tech Lead tiếp tục
- Founder review từng PR

🔒 **Lock:** Không mở rộng scope sang Star Journey OS, AI automation, Star Score, etc. cho đến khi Sprint 0 pass. Bất kỳ idea mới ghi vào backlog, không add vào Sprint 0.

---

*Tài liệu Sprint 0 Issues + DoD này là source of truth cho tuần đầu. Mọi commit/PR trong Sprint 0 phải ref issue number. Sau khi Sprint 0 pass, archive file này vào `_artifacts/sprint-0-archived.md` cùng final smoke output.*
