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
- [ ] Nếu liên quan trẻ em (`children_participation=true`): CSO sign-off required
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
- [ ] OG image dimension đúng (1200×630)
- [ ] H1 unique per page

### Documentation
- [ ] Spec file (nếu có) đã update với section liên quan
- [ ] CHANGELOG entry trong file đã update

### Migration (nếu có D1 schema change)
- [ ] `migrations/000N_name.sql` added
- [ ] Tested locally: `npx wrangler d1 migrations apply duongsaotoasang-com --local`
- [ ] Rollback SQL documented below
- [ ] Remote apply command: `npx wrangler d1 migrations apply duongsaotoasang-com --remote`

### Child Safety (điền nếu `children_participation=true`)
- [ ] `NDNUM_CHILD_REGISTRATION_ENABLED` env gate tested (returns 503 when false)
- [ ] Guardian fields (`guardian_name`, `guardian_consent_signed`) validated
- [ ] Self-register-as-minor rejection tested
- [ ] CSO sign-off received (email/Slack confirmation)
- [ ] No child PII in logs

## Smoke test
<!-- Paste curl command hoặc step để verify PR — ví dụ:
curl -X POST https://staging.duongsaotoasang.com/api/movement/sponsors/inquiry \
  -H "Content-Type: application/json" \
  -d '{"tier_slug":"star","name":"Test","email":"test@x.com","company":"Co"}' | jq .
-->

## Screenshots (nếu UI change)
<!-- Mobile 375px | Tablet 768px | Desktop 1440px -->

## Rollback plan (nếu migration)
<!-- SQL để rollback migration nếu cần:
DROP TABLE IF EXISTS new_table;
-->
