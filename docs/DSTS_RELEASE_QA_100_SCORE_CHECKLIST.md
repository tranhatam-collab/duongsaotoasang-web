# DSTS_RELEASE_QA_100_SCORE_CHECKLIST — v1.0

> **Mã tài liệu:** `DSTS_RELEASE_QA_100_SCORE_CHECKLIST_2026-05-13`
> **Trạng thái:** 🟢 ACTIVE — dùng cho mọi PR/release từ Sprint 0 trở đi
> **Owner R:** Tech Lead + QA · **Approver A:** Founder (Gate 3) · **Áp cho:** Mọi PR merge `main`
> **Tham chiếu:**
> - `dsts-master-plan-v1.1-LOCKED.md` (Mục III rubric 8 trụ + Mục VII checklist nghiệm thu)
> - `DSTS_PRIVACY_TRUST_TRANSPARENCY_RULES.md`
> - `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md`

---

## 0. MỤC LỤC

1. Quy tắc dùng checklist
2. PR-level checklist (chạy với mọi PR)
3. Sprint-level checklist (chạy cuối mỗi sprint)
4. Release-level checklist (chạy trước public launch)
5. Manifesto Compliance Linter (auto-check copy)
6. Smoke test script
7. Lighthouse audit target
8. Accessibility audit (WCAG 2.1 AA)
9. Cross-browser + device matrix
10. Rollback plan
11. Post-release monitoring

---

## 1. QUY TẮC DÙNG CHECKLIST

### Khi nào dùng

- **PR-level** (Mục 2): mỗi PR mở phải copy template vào PR description + tick
- **Sprint-level** (Mục 3): Tech Lead chạy cuối Sprint 0, 1, 2, 3, 4 trước Gate 3
- **Release-level** (Mục 4): Founder chạy trước "PUBLIC LAUNCH READY" Sprint 4 Gate

### Cách tick

- ✅ Pass — có evidence (screenshot, curl output, log)
- ❌ Fail — phải fix trước merge
- ⚪ N/A — giải thích lý do trong PR comment

### Quy ước severity

- 🔴 **Critical** — block merge, không thương lượng
- 🟠 **Major** — block release, có thể merge nếu có Issue follow-up
- 🟡 **Minor** — log trong backlog, không block

---

## 2. PR-LEVEL CHECKLIST

Copy template này vào PR description:

```markdown
## PR Checklist (Auto-run on every PR)

### 🔴 Critical (must pass)
- [ ] Branch tên đúng format `sprint-N/issue-NN-slug`
- [ ] Commit message format `[sprint-N][#issue] description`
- [ ] PR title format `[Sprint N][Issue NN] Title`
- [ ] PR description ref `Closes #issue-number`
- [ ] DoD từ issue tick đủ (paste vào PR)
- [ ] Không commit credential (.env, secrets, .pem, .key)
- [ ] Không add file > 1MB không cần thiết (vd zip, mp4)
- [ ] No `console.log()` còn trong production code
- [ ] No commented-out code block > 5 dòng
- [ ] No TODO/FIXME mới không có Issue ref

### 🟠 Major (should pass)
- [ ] Đã chạy `./scripts/smoke-test.sh https://preview-deploy-url` local
- [ ] Đã test trên Chrome desktop + iPhone Safari
- [ ] Đã test với network throttle 3G (mobile)
- [ ] Lighthouse Mobile screenshot paste vào PR (cho UX change)
- [ ] Manifesto Compliance: copy không hứa kết quả
- [ ] Privacy: không thu thập PII mới không có lý do
- [ ] Accessibility: heading order đúng, alt text cho ảnh, contrast ≥ 4.5:1

### 🟡 Minor (nice to have)
- [ ] Có screenshot before/after cho UI change
- [ ] Có brief 1-line explanation cho code phức tạp
- [ ] Update CHANGELOG nếu là user-facing change
```

---

## 3. SPRINT-LEVEL CHECKLIST

### Sprint 0 — Stop the Bleeding (Gate target: ≥ 63/100)

```markdown
## Sprint 0 Gate Checklist

### Routing (Tầng 1+2)
- [ ] 🔴 Smoke test pass 100% URL (≥ 22/24 expected 200/404)
- [ ] 🔴 Không URL redirect loop
- [ ] 🔴 /404 random URL → render 404.html brand-aligned
- [ ] 🔴 Mọi route chính có canonical đúng URL của chính nó

### Content fallback (Tầng 3)
- [ ] 🔴 /posts có fallback từ /data/posts.json
- [ ] 🔴 /content?slug=... có fallback từ /data/content.json
- [ ] 🔴 Disable network → /posts vẫn render
- [ ] 🔴 Timeout 5s → fallback trigger
- [ ] 🔴 Slug không tồn tại → not-found page
- [ ] 🔴 /content (no slug) → redirect /posts

### Trust pages (Tầng 4 minimal)
- [ ] 🔴 /donate có 8 mục bắt buộc
- [ ] 🔴 /transparency có 4 báo cáo + nguyên tắc
- [ ] 🟠 /legal có 4 section (Terms + Privacy + Refund + Payment)
- [ ] 🔴 Footer mọi trang có legal disclosure (placeholder OK)

### Manifesto compliance
- [ ] 🟠 Không câu hứa kết quả trên Sprint 0 trang mới
- [ ] 🟠 Reviews mẫu có nhãn "Đánh giá minh họa"
- [ ] 🟠 Payment disclaimer trên /scripts/* (Issue 08)

### Smoke + score
- [ ] 🔴 Điểm rubric tổng ≥ 63 (xác minh bằng bằng chứng từng trụ)
- [ ] 🔴 Founder QA pass trên iPhone + Android
- [ ] 🔴 Founder ký "OK Sprint 0" trong PR comment

### Artifacts
- [ ] _artifacts/sprint-0-final-smoke.txt (smoke test output)
- [ ] _artifacts/sprint-0-lighthouse.json (Lighthouse mobile)
- [ ] _artifacts/sprint-0-screenshots/ (5+ screenshot)
```

### Sprint 1 — Trust & Finish Core (Gate target: ≥ 85)

```markdown
## Sprint 1 Gate Checklist

### Donate flow
- [ ] 🔴 /donate có đủ 8 mục (mục tiêu, hình thức, cách xác nhận, refund, sử dụng quỹ, liên hệ, trạng thái, báo cáo)
- [ ] 🔴 Trạng thái rõ "đang chuẩn bị" hoặc "đã mở"
- [ ] 🟠 Test payment confirmation flow bằng giao dịch thử / manual confirmation pass
- [ ] 🔴 Tax receipt template ready (PDF mẫu)

### Transparency
- [ ] 🔴 /transparency có báo cáo Q1/2026 (kể cả "Báo cáo khởi tạo")
- [ ] 🔴 Lịch update định kỳ rõ
- [ ] 🟠 Donor wall (anonymous opt) ready

### Legal pages
- [ ] 🔴 /legal#terms công bố + có ngày cập nhật
- [ ] 🔴 /legal#refund công bố
- [ ] 🔴 /legal#privacy + cookie banner
- [ ] 🟠 GDPR cookie banner test (EU IP)
- [ ] 🟠 Founder + Legal sign off Terms/Refund/Privacy text

### Contact form
- [ ] 🔴 /contact form gửi email về inbox founder
- [ ] 🔴 Auto-reply user
- [ ] 🟠 Cloudflare Turnstile bot protection
- [ ] 🟠 Spam test pass

### Footer + script disclaimer
- [ ] 🔴 Footer thống nhất 100% trang
- [ ] 🔴 9 trang /scripts/* có payment disclaimer
- [ ] 🔴 Reviews mẫu trên scripts có nhãn "Đánh giá minh họa"
```

### Sprint 2 — SEO & Standardize (Gate target: ≥ 95)

```markdown
## Sprint 2 Gate Checklist

### SEO meta
- [ ] 🔴 100% trang có canonical đúng URL của mình
- [ ] 🔴 100% trang có title (50-60 ký tự) + description (150-160) riêng
- [ ] 🔴 100% trang có đúng 1 <h1>
- [ ] 🔴 OG tag + Twitter Card đúng từng trang
- [ ] 🟠 OG image render đúng trên Facebook Debugger

### Sitemap + Robots
- [ ] 🔴 sitemap.xml mở 200, ≥ 25 URL
- [ ] 🔴 robots.txt có "Sitemap:" dòng
- [ ] 🔴 Submit GSC + Bing Webmaster
- [ ] 🟠 GSC verified, sitemap submitted no error

### Schema.org
- [ ] 🔴 Organization schema trên /
- [ ] 🔴 Article schema trên /content
- [ ] 🔴 Event schema trên /events
- [ ] 🔴 Service schema trên /scripts/*
- [ ] 🔴 Rich Results Test pass cho ≥ 4 type

### SSR / Pre-render
- [ ] 🔴 curl /content?slug=... → thấy text bài viết HTML thật
- [ ] 🔴 curl /posts → thấy list bài HTML thật
- [ ] 🟠 Google bot crawl test (Mobile-Friendly Test)
```

### Sprint 3 — Polish & Performance (Gate target: ≥ 98)

```markdown
## Sprint 3 Gate Checklist

### Design tokens
- [ ] 🔴 tokens.css export đầy đủ color/spacing/typography/radius/shadow
- [ ] 🟠 Figma sync với tokens.css
- [ ] 🟠 KHÔNG hard-code color trong component CSS

### Loading + Skeleton
- [ ] 🔴 Loading skeleton component reusable
- [ ] 🔴 Áp dụng /posts /content /scripts list
- [ ] 🔴 KHÔNG còn text "Đang tải..." trên trang nào

### Image optimization
- [ ] 🔴 100% ảnh > 10KB convert WebP + fallback
- [ ] 🔴 100% ảnh có loading="lazy" (trừ above-fold)
- [ ] 🟠 100% ảnh có srcset responsive
- [ ] 🔴 Lighthouse Performance Mobile ≥ 90

### Mobile audit
- [ ] 🔴 Test 6 breakpoint pass: 320, 375, 414, 768, 1024, 1920
- [ ] 🔴 Tap target ≥ 48×48px
- [ ] 🔴 Không horizontal scroll trên 320px
- [ ] 🔴 Font ≥ 16px (không zoom forced)

### Accessibility WCAG 2.1 AA
- [ ] 🔴 axe DevTools: 0 critical issue
- [ ] 🔴 Keyboard navigation toàn site (Tab, Enter, Esc)
- [ ] 🔴 Alt text mọi ảnh có ý nghĩa
- [ ] 🔴 Contrast ratio ≥ 4.5:1 cho text thường, ≥ 3:1 large text
- [ ] 🟠 Screen reader test (VoiceOver iOS hoặc TalkBack)
```

### Sprint 4 — Launch Readiness (Gate target: 100)

```markdown
## Sprint 4 Gate Checklist — FINAL

### Ecosystem
- [ ] 🔴 nguoiviet.muonnoi.org trả 200 (hoặc landing bridge nếu chưa fix 502)
- [ ] 🔴 Footer ecosystem map có IAI.ONE, vetuonglai, visamuonnoi, phuongdong
- [ ] 🟠 Cross-link UTM tracking

### Analytics + Error
- [ ] 🔴 GA4 hoặc Plausible đang chạy + verify event
- [ ] 🔴 Sentry capture lỗi JS thật (test bằng throw lỗi)
- [ ] 🟠 Funnel cho 3 CTA chính: /scripts, /donate, /contact

### Uptime + Runbook
- [ ] 🔴 UptimeRobot ping 5 URL × 5 phút
- [ ] 🔴 RUNBOOK.md trong repo có rollback + restore + owner matrix
- [ ] 🟠 Test rollback flow (revert commit + redeploy)

### Backup
- [ ] 🔴 GitHub Actions weekly backup chạy lần đầu thành công
- [ ] 🟠 D1 export backup offsite (R2 hoặc S3)

### Founder QA — 5 thiết bị
- [ ] 🔴 MacBook Chrome
- [ ] 🔴 MacBook Safari
- [ ] 🔴 iPhone Safari (iOS gần nhất)
- [ ] 🔴 Android Chrome (Pixel hoặc Samsung)
- [ ] 🔴 iPad Safari
- [ ] 🔴 Desktop Windows Chrome

### Lighthouse final
- [ ] 🔴 Performance ≥ 95
- [ ] 🔴 Accessibility ≥ 95
- [ ] 🔴 Best Practices ≥ 95
- [ ] 🔴 SEO ≥ 95

### Sign-off
- [ ] 🔴 Founder ký "PUBLIC LAUNCH READY" 🚀
- [ ] 🔴 Tech Lead countersign
- [ ] 🔴 Legal Counsel ký Terms/Refund/Privacy final
- [ ] 🟠 Pháp nhân xác minh (hoặc dùng câu placeholder)

### Artifacts FINAL
- [ ] _artifacts/sprint-4-lighthouse-final.json (4 trục ≥ 95)
- [ ] _artifacts/sprint-4-smoke-final.txt
- [ ] _artifacts/sprint-4-founder-qa-screenshots/ (5 thiết bị)
- [ ] _artifacts/sprint-4-runbook-test.md
```

---

## 4. RELEASE-LEVEL CHECKLIST (PUBLIC LAUNCH)

```markdown
## Public Launch Day Checklist (T-1, T-0, T+1)

### T-1 (1 ngày trước launch)
- [ ] All Sprint 4 gates pass
- [ ] Stripe Lane A + B configured + test
- [ ] DNS check: duongsaotoasang.com → CF Pages
- [ ] SSL cert valid > 30 ngày
- [ ] Backup snapshot trước launch
- [ ] PR / press release ready (nếu có)
- [ ] Social media post draft
- [ ] Founder check email + Zalo SLA 24h

### T-0 (launch day)
- [ ] Final smoke test pass
- [ ] Monitor Sentry + UptimeRobot real-time
- [ ] Founder online 4-8 giờ đầu để handle inquiry
- [ ] Announce social media (post pre-draft)
- [ ] Submit Google + Bing index request
- [ ] Notify ecosystem partners (Muôn Nơi, IAI.ONE)

### T+1 (1 ngày sau)
- [ ] Review traffic + funnel GA4
- [ ] Review error log Sentry
- [ ] Review feedback inbox
- [ ] Post-mortem nếu có issue critical
- [ ] Update RUNBOOK với learning
```

---

## 5. MANIFESTO COMPLIANCE LINTER (auto-check copy)

Script Node `scripts/manifesto-lint.js` chạy trên CI:

```javascript
// scripts/manifesto-lint.js
const BANNED_PHRASES = [
  // Hứa kết quả
  /giúp\s+bạn\s+nổi\s+tiếng/i,
  /trở\s+thành\s+ngôi\s+sao/i,
  /đảm\s+bảo\s+thành\s+công/i,
  /cam\s+kết\s+(doanh\s+thu|thu\s+nhập|kết\s+quả|nổi\s+tiếng)/i,
  /(make\s+you\s+famous|guaranteed\s+success|earn\s+\$)/i,

  // Fake scarcity
  /chỉ\s+còn\s+\d+\s+(chỗ|slot|spot)/i,
  /sale\s+ends?\s+in\s+\d+/i,

  // Tour/retreat/course (per Manifesto rule 3)
  /khóa\s+học\s+làm\s+sao\s+thành\s+sao/i,
  /(course|training|coaching|talent\s+management)\s+to\s+(stardom|fame)/i,
];

const REQUIRED_PHRASES = {
  // Trên /scripts/* phải có disclaimer
  'scripts/': [
    /quy\s+trình\s+xác\s+nhận\s+thủ\s+công/i,
    /không\s+cam\s+kết.*?(nổi\s+tiếng|doanh\s+thu|thành\s+công|kết\s+quả\s+truyền\s+thông)/i,
  ],
  // Reviews mẫu phải có label
  'review-sample': [/đánh\s+giá\s+minh\s+họa/i],
};

// Run:
// $ node scripts/manifesto-lint.js
// Output: pass/fail + line numbers
```

CI integration: GitHub Action chạy lint trên mọi PR mở.

---

## 6. SMOKE TEST SCRIPT

`scripts/smoke-test.sh`:

```bash
#!/usr/bin/env bash
# scripts/smoke-test.sh — DSTS production smoke test
# Usage: ./scripts/smoke-test.sh [base_url]
# Default: https://duongsaotoasang.com

set -uo pipefail

BASE="${1:-https://duongsaotoasang.com}"
FAILED=0

# Format: "URL EXPECTED_STATUS"
URLS=(
  "/                                              200"
  "/about                                         200"
  "/program                                       200"
  "/programs                                      301"
  "/contact                                       200"
  "/scripts                                       200"
  "/scripts/rising-entrepreneur                   200"
  "/scripts/global-artist                         200"
  "/scripts/singing-icon                          200"
  "/scripts/cinematic-actor                       200"
  "/scripts/the-thinker                           200"
  "/scripts/creative-leader                       200"
  "/scripts/cultural-ambassador                   200"
  "/scripts/dsts-legacy                           200"
  "/scripts/global-story                          200"
  "/posts                                         200"
  "/events                                        200"
  "/donate                                        200"
  "/transparency                                  200"
  "/legal                                         200"
  "/terms                                         302"
  "/refund                                        302"
  "/privacy                                       302"
  "/content?slug=sang-tao-khong-bat-dau-tu-tham-vong  200"
  "/sitemap.xml                                   200"
  "/robots.txt                                    200"
  "/xyz-random-not-exist                          404"
)

printf "\n=== DSTS Smoke Test ===\n"
printf "Base URL: %s\n\n" "$BASE"
printf "%-60s %-7s %-7s %s\n" "URL" "EXPECT" "ACTUAL" "RESULT"
printf "%s\n" "$(printf -- '-%.0s' {1..90})"

for entry in "${URLS[@]}"; do
  url=$(echo "$entry" | awk '{print $1}')
  expect=$(echo "$entry" | awk '{print $NF}')
  actual=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${url}")
  if [ "$actual" = "$expect" ]; then
    result="✅ PASS"
  else
    result="❌ FAIL"
    FAILED=$((FAILED + 1))
  fi
  printf "%-60s %-7s %-7s %s\n" "$url" "$expect" "$actual" "$result"
done

echo ""
if [ "$FAILED" -gt 0 ]; then
  echo "❌ ${FAILED} URL failed smoke test."
  exit 1
else
  echo "✅ All ${#URLS[@]} smoke tests passed."
  exit 0
fi
```

---

## 7. LIGHTHOUSE AUDIT TARGET

Run with Chrome DevTools Lighthouse hoặc CLI:

```bash
npx lighthouse https://duongsaotoasang.com \
  --output html \
  --output json \
  --output-path ./lighthouse-report \
  --form-factor=mobile \
  --throttling-method=devtools
```

### Target scores

| Trục | Sprint 0 | Sprint 3 | Sprint 4 |
|---|---|---|---|
| Performance | ≥ 70 | ≥ 90 | ≥ 95 |
| Accessibility | ≥ 85 | ≥ 95 | ≥ 95 |
| Best Practices | ≥ 85 | ≥ 95 | ≥ 95 |
| SEO | ≥ 80 | ≥ 95 | ≥ 95 |

### Common fixes

- Performance: image WebP + lazy + preload critical, defer JS, prevent render-blocking CSS
- Accessibility: alt text, label form, contrast, ARIA
- Best Practices: HTTPS, no console error, deprecated API
- SEO: meta description, hreflang, canonical, robots, structured data

---

## 8. ACCESSIBILITY AUDIT (WCAG 2.1 AA)

### Tools

- axe DevTools (free Chrome ext)
- WAVE (free Chrome ext)
- Lighthouse Accessibility
- macOS VoiceOver (Cmd+F5)
- Android TalkBack

### Manual checks (mỗi sprint)

- [ ] Tab order logical (visual + DOM order match)
- [ ] Focus indicator visible (outline)
- [ ] Skip-link "Bỏ qua nội dung điều hướng" hoạt động
- [ ] Form có `<label>` + `aria-describedby` cho error
- [ ] Image có `alt` (decorative: `alt=""`)
- [ ] Icon-only button có `aria-label`
- [ ] Heading hierarchy đúng (h1 → h2 → h3, không skip)
- [ ] Color không phải duy nhất cách truyền thông tin
- [ ] Hover state cũng có focus state
- [ ] Animation respect `prefers-reduced-motion`

---

## 9. CROSS-BROWSER + DEVICE MATRIX

| Browser | Mobile | Desktop |
|---|---|---|
| Chrome | ✅ test mỗi sprint | ✅ test mỗi sprint |
| Safari | ✅ test mỗi sprint (iOS) | ✅ test mỗi sprint (macOS) |
| Firefox | ⚪ Sprint 3 only | ✅ test mỗi sprint |
| Edge | ⚪ Sprint 3 only | ✅ test mỗi sprint |
| Samsung Internet | ⚪ Sprint 3 only | – |
| Opera | – | ⚪ Sprint 4 only |

| Device | Sprint 0 | Sprint 1-2 | Sprint 3-4 |
|---|---|---|---|
| iPhone 13/14/15 Safari | ✅ | ✅ | ✅ |
| Android (Pixel 6+) Chrome | ✅ | ✅ | ✅ |
| iPad Safari | – | – | ✅ |
| MacBook 13" Chrome+Safari | ✅ | ✅ | ✅ |
| Desktop Windows | – | ⚪ | ✅ |
| 320px small phone | ⚪ | ✅ | ✅ |
| 4K monitor | – | – | ✅ |

---

## 10. ROLLBACK PLAN

Khi release fail:

### Immediate (5-10 phút)

```bash
# Revert latest commit
git revert HEAD --no-edit
git push origin main

# OR force deploy previous version trên Cloudflare Pages
wrangler pages deployment list --project-name duongsaotoasang-com-v2
wrangler pages deployment retry <previous-deployment-id>
```

### Communication (15-30 phút)

- Founder notify team qua Telegram/Slack
- Update status page nếu có
- Email user nếu major issue (data loss, payment fail)

### Investigation (1-24 giờ)

- Pull error log Sentry
- Pull Cloudflare logs
- Reproduce locally
- Root cause analysis → file vào `_artifacts/incident-<date>.md`

### Fix-forward

- Branch `hotfix/<issue>`
- Fix + test thoroughly
- PR review tight (Founder + Tech Lead)
- Deploy + monitor 24h

---

## 11. POST-RELEASE MONITORING

### Daily (Week 1 sau launch)

- [ ] Sentry error count
- [ ] UptimeRobot status
- [ ] GA4 traffic + bounce rate
- [ ] Search Console index status
- [ ] Inbox + Zalo SLA 24h

### Weekly (Week 2+)

- [ ] Lighthouse score check (regression?)
- [ ] Backup verify
- [ ] Security headers test (securityheaders.com)
- [ ] SSL cert expiry check
- [ ] DNS health
- [ ] Refund rate < 5%
- [ ] NPS từ T3+T4 user ≥ 50

### Monthly

- [ ] Brandpro Quarterly Audit prep (chia ra hàng tháng)
- [ ] Privacy + GDPR compliance review
- [ ] Manifesto Compliance Lint full
- [ ] Budget reconciliation

---

## CHANGELOG

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | 2026-05-13 | Claude + Founder | Tạo lần đầu — PR/Sprint/Release 3 level checklist + smoke + lighthouse + manifesto lint |

---

## APPROVAL

- [ ] Founder review
- [ ] Tech Lead review (Mục 5, 6, 10)
- [ ] QA Lead review (Mục 7, 8, 9)
- [ ] Legal review (Mục 5 banned phrases)

**Ký:** _______________________ **Ngày:** _______________________

---

*File này là master QA checklist. Mỗi PR/Sprint/Release phải pass checklist tương ứng. Failed checklist = không merge / không launch. Tích lũy artifacts vào `_artifacts/`.*

---

## DEV-READY — Implementation hooks (Wave 2, 2026-05-13)

### GitHub PR template

Tạo file `.github/PULL_REQUEST_TEMPLATE.md` (dev cần tạo) với content:

```markdown
## Mục đích
<!-- 1-2 câu mô tả mục đích PR này -->

## Liên quan
- Issue: #
- Spec reference: docs/...
- Sprint: 0 | 1 | 2 | 3 | 4 | Layer 1.x | Layer 2.x

## Checklist (per `DSTS_RELEASE_QA_100_SCORE_CHECKLIST.md`)

### Code
- [ ] Lint pass (no error)
- [ ] Type check pass (nếu TypeScript)
- [ ] Unit test pass
- [ ] No console.log production code
- [ ] No hardcoded secret (API key, password)

### Routing & Content
- [ ] Không trang public hiển thị "Đang tải..." mãi mãi
- [ ] Mọi route mới có fallback + 404-safe
- [ ] `_redirects` rule sync với file mới/đổi tên

### Privacy & Compliance
- [ ] Không thu PII không cần
- [ ] Nếu thu PII → có Privacy Notice + audit log
- [ ] Nếu liên quan trẻ em (children_participation): CSO sign-off
- [ ] Nếu liên quan payment: Legal sign-off

### Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Bundle size diff < 50KB hoặc justified
- [ ] Image optimized (< 200KB cover, WebP preferred)

### Accessibility (WCAG 2.1 AA)
- [ ] axe DevTools: 0 critical issue
- [ ] Keyboard navigation pass
- [ ] Color contrast ≥ 4.5:1

### SEO
- [ ] Meta title + description
- [ ] OG image dimension đúng (1200x630)
- [ ] H1 unique per page

### Documentation
- [ ] Spec file (nếu có) đã update với section liên quan
- [ ] CHANGELOG entry trong file đã update

## Screenshots (nếu UI change)
<!-- Paste screenshot mobile S, tablet, desktop -->

## Smoke test
<!-- Bash command hoặc step để verify PR -->
```

### Lighthouse target metrics

| Metric | Target | Block merge if |
|---|---|---|
| Performance | ≥ 90 | < 80 |
| Accessibility | ≥ 95 | < 90 |
| Best Practices | ≥ 95 | < 90 |
| SEO | ≥ 95 | < 90 |
| LCP (Largest Contentful Paint) | < 2.5s | > 4s |
| CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| FID (First Input Delay) | < 100ms | > 300ms |

### Performance budget per route

| Route | JS bundle | CSS | Image total |
|---|---|---|---|
| `/` | < 100KB | < 50KB | < 500KB |
| `/movement` | < 150KB | < 60KB | < 800KB |
| `/movement/sponsors` | < 200KB | < 60KB | < 1MB |
| `/movement/events/:slug` | < 200KB | < 60KB | < 1MB |
| `/movement/diaspora-map` | < 400KB (mapbox heavy) | < 80KB | < 2MB |

### CHANGELOG entry

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 (ACTIVE) | 2026-05-13 | Codex + Founder | Master QA checklist |
| v1.0-DEV-READY | 2026-05-13 | Claude + Founder | Wave 2 W2.T6: append GitHub PR template + Lighthouse target + performance budget per route |
