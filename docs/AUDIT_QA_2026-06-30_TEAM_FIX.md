# DSTS — QA AUDIT BÁO CÁO GIAO TEAM FIX

> **Ngày audit:** 2026-06-30
> **Auditor:** AI QA Specialist (30 năm kinh nghiệm)
> **Phương pháp:** Code review repo + Live curl test production
> **Trạng thái:** Nhiều fix đã deploy thành công, còn 13 lỗi cần team fix

---

## I. NHỮNG GÌ ĐÃ FIX THÀNH CÔNG ✅

| # | Lỗi | Trạng thái Live | Ghi chú |
|---|---|---|---|
| 1 | **CORS Wildcard trên static pages** | ✅ Fixed | `access-control-allow-origin: https://duongsaotoasang.com` |
| 2 | **CSP Header** | ✅ Fixed | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'` |
| 3 | **robots.txt Disallow admin** | ✅ Fixed | `Disallow: /admin/`, `/api/admin/`, `/app/`, etc. |
| 4 | **Register API Input Validation** | ✅ Fixed | Email format, password strength (8 chars, uppercase, number), display_name length |
| 5 | **Rate Limiting** | ✅ Fixed | `checkRateLimit()` trong `_lib/rate-limit.js`, dùng trong login |
| 6 | **DB Transactions** | ✅ Fixed | `BEGIN/COMMIT/ROLLBACK` trong `register.js`, `donate/create.js` |
| 7 | **Session Fixation** | ✅ Fixed | `UPDATE sessions SET revoked_at = ... WHERE user_id = ?` trong login |
| 8 | **Cookie `__Host-` prefix** | ✅ Fixed | `__Host-dsts_session`, `__Host-dsts_2fa` |
| 9 | **Donate Amount Parsing** | ✅ Fixed | `Number(amountRaw)` + `isNaN` + `Number.isInteger` |
| 10 | **Webhook Payment Failure** | ✅ Fixed | Xử lý `payment.failed`, `payment.canceled`, `payment.refunded` |
| 11 | **2FA totp_enabled query** | ✅ Fixed | `SELECT ... totp_enabled FROM users` trong login.js |
| 12 | **Error Logging với stack trace** | ✅ Fixed | `console.error('[module] Error:', e?.message, e?.stack)` |
| 13 | **Security Headers cơ bản** | ✅ Fixed | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| 14 | **Admin Auth Bypass** | ✅ Fixed | Kiểm tra role trong middleware |
| 15 | **Staff Role Fail-Open** | ✅ Fixed | `role !== 'admin' && role !== 'staff'` fail-closed |

---

## II. LỖI CÒN SÓT — GIAO TEAM FIX 🔴

### 🔴 P0 — CRITICAL

#### 1. XSS qua innerHTML — Nhiều file không escape user data
**Mức độ:** CRITICAL  
**Mô tả:** Nhiều trang HTML dùng `innerHTML` để render data từ API mà KHÔNG escape. Nếu attacker chèn `<script>` vào database qua form/creator dashboard, sẽ thực thi JS trên trình duyệt victim.

**File bị ảnh hưởng:**

| File | Dòng | Dữ liệu không escape |
|---|---|---|
| `verify/index.html` | 136 | `json.data.display_name` |
| `sponsor/index.html` | 122 | `s.org_name`, `s.org_type` |
| `verified.html` | 333-338 | `e.display_name`, `e.entity_type`, `e.badge_type` |
| `sponsors.html` | 246-251 | `s.name`, `s.tier`, `s.industry`, `s.country`, `s.mission_alignment` |
| `legacy/index.html` | 65 | `item.title` |
| `club/wallet/index.html` | 124 | `h.description` |

**Cách fix:** Thêm `DSTS.escapeHTML()` (đã có sẵn trong `assets/app-v5.js`) vào tất cả các trường user-controlled:
```js
// Before (XSS):
grid.innerHTML = '<div><strong>' + json.data.display_name + '</strong></div>';

// After (Safe):
grid.innerHTML = '<div><strong>' + DSTS.escapeHTML(json.data.display_name) + '</strong></div>';
```

**Assignee:** Frontend team  
**ETA:** 1 ngày

---

#### 2. CORS Header thiếu trên một số API endpoint
**Mức độ:** HIGH  
**Mô tả:** Static HTML pages đã có CORS đúng, nhưng một số API Functions không trả về `Access-Control-Allow-Origin` header. Điều này có thể gây lỗi cho frontend fetch từ subdomain hoặc third-party integration.

**Endpoint bị ảnh hưởng (live test 2026-06-30):**
| Endpoint | CORS Header? |
|---|---|
| `/api/map` | ✅ Có |
| `/api/sponsors` | ❌ KHÔNG CÓ |
| `/api/verified-entities` | ❌ KHÔNG CÓ |
| `/api/sponsor` | ❌ KHÔNG CÓ |
| `/api/analytics/123` | ❌ KHÔNG CÓ |

**Cách fix:** Thêm CORS headers vào tất cả API functions:
```js
const allowedOrigin = context.env.PAY_IAI_ONE_CALLBACK_BASE || "https://duongsaotoasang.com";
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true'
  }
});
```

**Assignee:** Backend team  
**ETA:** 0.5 ngày

---

#### 3. CSRF Protection hoàn toàn thiếu
**Mức độ:** HIGH  
**Mô tả:** Không có CSRF token trong bất kỳ form hay API nào. Nếu user đã login và truy cập malicious site, attacker có thể gửi POST request đến `/api/donate/create`, `/api/auth/totp-disable`, etc.

**Cách fix:**
1. Thêm CSRF token vào session cookie response:
```js
const csrfToken = crypto.randomUUID();
await db.prepare('UPDATE sessions SET csrf_token = ? WHERE session_token_hash = ?').bind(csrfToken, hash).run();
```
2. Trả về CSRF token trong response body hoặc meta tag
3. Frontend gửi `X-CSRF-Token` header với mọi mutating request
4. Backend validate CSRF token

**Assignee:** Backend + Frontend team  
**ETA:** 2 ngày

---

#### 4. Email Verification thiếu trong Registration Flow
**Mức độ:** HIGH  
**Mô tả:** Register API tạo user với `status = 'active'` ngay lập tức mà không cần xác thực email. Attacker có thể spam register với email giả, hoặc squat email của người khác.

**Cách fix:**
1. Tạo `email_verification_tokens` table
2. Register → `status = 'pending_email_verification'`
3. Gửi email với verification link (dùng `cloudflare-email-service`)
4. `/api/auth/verify-email` endpoint để confirm
5. Không cho login nếu email chưa verified

**Assignee:** Backend team  
**ETA:** 3 ngày

---

### 🟡 P1 — MEDIUM

#### 5. CSP `unsafe-inline` và `unsafe-eval` trong script-src
**Mức độ:** MEDIUM  
**Mô tả:** CSP hiện tại cho phép `unsafe-inline` và `unsafe-eval`, làm giảm hiệu quả CSP.

```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...
```

**Cách fix:**
- Dùng `nonce` cho inline scripts (generate nonce mỗi request)
- Hoặc chuyển inline scripts sang external `.js` files
- `unsafe-eval` có thể cần thiết cho một số thư viện, nhưng nên giới hạn

**Assignee:** Frontend/Security team  
**ETA:** 2-3 ngày

---

#### 6. Rate Limiting chưa áp dụng đầy đủ cho tất cả API
**Mức độ:** MEDIUM  
**Mô tả:** Rate limit chỉ có trong `/api/auth/login`. Các endpoint khác như `/api/donate/create`, `/api/auth/register`, `/api/contact` không có rate limit.

**Cách fix:** Tạo generic rate limit middleware và áp dụng cho tất cả public API:
```js
// _lib/rate-limit.js
export async function rateLimitMiddleware(context, maxAttempts = 10, windowMinutes = 60) {
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
  // ... check rate limit by IP
}
```

**Assignee:** Backend team  
**ETA:** 1 ngày

---

#### 7. PWA Icons thiếu splash screen và beforeinstallprompt
**Mức độ:** LOW  
**Mô tả:** PWA đã có manifest và service worker, nhưng không có:
- Splash screen for iOS/Android
- `beforeinstallprompt` handler để hiển thị install button
- PWA install UI component

**Cách fix:**
1. Thêm `<meta name="apple-mobile-web-app-capable" content="yes">`
2. Thêm splash screen images cho các kích thước
3. Thêm `beforeinstallprompt` handler trong `app.js`

**Assignee:** Frontend team  
**ETA:** 1 ngày

---

#### 8. API `/api/sponsors` và `/api/sponsor` CORS khác nhau
**Mức độ:** LOW  
**Mô tả:** `/api/sponsors` (public list) không có CORS header, trong khi `/api/sponsor` (sponsor portal data) cũng không có. Có 2 endpoint tương tự nhau nhưng không nhất quán.

**Cách fix:** Chuẩn hóa CORS cho tất cả API, hoặc gộp 2 endpoint nếu trùng chức năng.

**Assignee:** Backend team  
**ETA:** 0.5 ngày

---

## III. KHUYẾN NGHỊ PRIORITY FIX

```
Tuần 1 (P0):
  - XSS innerHTML escape (tất cả file HTML)
  - CORS header cho API thiếu
  - CSRF protection (backend + frontend)

Tuần 2 (P1):
  - Email verification flow
  - Rate limiting cho tất cả public API
  - CSP unsafe-inline → nonce
  - PWA splash screen + install prompt
```

---

## IV. VERIFICATION CHECKLIST

Sau khi team fix, QA sẽ verify:

- [ ] `curl -H "Origin: https://evil.com" https://duongsaotoasang.com/api/sponsors` → KHÔNG có `Access-Control-Allow-Origin: *`
- [ ] `curl -H "Origin: https://evil.com" https://duongsaotoasang.com/api/verified-entities` → Có `Access-Control-Allow-Origin: https://duongsaotoasang.com`
- [ ] Tất cả `innerHTML` insert đã qua `DSTS.escapeHTML()`
- [ ] POST request không có `X-CSRF-Token` header → 403 Forbidden
- [ ] Register với email mới → nhận verification email, status = pending
- [ ] `/api/donate/create` spam 20 requests/1 phút → 429 Too Many Requests
- [ ] CSP header không còn `unsafe-inline` (hoặc dùng nonce)
- [ ] PWA install prompt hiển thị trên mobile Chrome

---

**Báo cáo hoàn thành.**  
**Auditor:** AI QA Specialist  
**Ngày:** 2026-06-30
