# DSTS Operations Runbook

> **Domain:** https://duongsaotoasang.com
> **Platform:** Cloudflare Pages + Workers + D1
> **Last updated:** 2026-06-15

---

## 1. DEPLOYMENT

### Manual deploy
```bash
cd /path/to/duongsaotoasang.com
npx wrangler pages deploy . --project-name=duongsaotoasang --branch=main
```

### CI/CD
- GitHub Actions: `.github/workflows/deploy-v3.yml`
- Trigger: push to `main`, PR merge
- QA gate: build + link check + migration test

---

## 2. CRITICAL ENVIRONMENT VARIABLES

| Variable | Purpose | Set in |
|---|---|---|
| `D1_DATABASE_ID` | D1 database binding | wrangler.toml / Cloudflare Dashboard |
| `MAIL_API_KEY` | mail.iai.one API | Cloudflare Dashboard |
| `RESEND_API_KEY` | Resend fallback | Cloudflare Dashboard |
| `FOUNDER_EMAIL` | Contact form recipient | Cloudflare Dashboard |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile | Cloudflare Dashboard |

**Never commit secrets to repo.**

---

## 3. D1 DATABASE

### Run migrations
```bash
npx wrangler d1 migrations apply duongsaotoasang-db --local
npx wrangler d1 migrations apply duongsaotoasang-db --remote
```

### Backup
```bash
npx wrangler d1 export duongsaotoasang-db --output ./backups/dsts-$(date +%Y%m%d).sql
```

---

## 4. API ENDPOINTS

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Public contact form |
| `/api/subscribe` | POST | Newsletter signup |
| `/api/payment/create-intent` | POST | Payment intent (PayOS) |
| `/api/content` | GET | Dynamic content by slug |
| `/api/posts` | GET | Post list |

---

## 5. MONITORING & OBSERVABILITY

### Current stack (placeholder)
- **GA4:** Replace `G-XXXXXXX` in `index.html`
- **Sentry:** Replace `SENTRY_DSN` in `index.html`
- **Uptime:** Add site to UptimeRobot (https://uptimerobot.com)

### Health check
```bash
curl -s -o /dev/null -w "%{http_code}" https://duongsaotoasang.com/
```

---

## 6. INCIDENT RESPONSE

| Severity | Response time | Action |
|---|---|---|
| P0 — Site down | 15 min | Check Cloudflare status, rollback deploy |
| P1 — API fail | 30 min | Check Workers logs, D1 status |
| P2 — Content stale | 2 hrs | Verify CMS / fallback content |
| P3 — Cosmetic | 24 hrs | Schedule fix in next deploy |

### Rollback
```bash
git log --oneline -5
git revert HEAD
# OR checkout previous commit and force deploy (emergency only)
```

---

## 7. LEGAL & COMPLIANCE CHECKLIST

- [ ] Entity disclosure footer updated (VIET CAN NEW CORP + Ngôi Sao Việt Can JSC)
- [ ] `/terms` reviewed by legal counsel annually
- [ ] `/privacy` cookie banner active
- [ ] `/donate` PayOS payment link functional
- [ ] `/transparency` report published quarterly

---

## 8. CONTACT

- **Technical:** contact@duongsaotoasang.com
- **Founder:** Trần Hà Tâm
