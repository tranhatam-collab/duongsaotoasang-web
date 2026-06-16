# 🔐 PRODUCTION SECRETS CONFIGURATION GUIDE

**Ngày tạo:** 2026-06-16  
**Mục đích:** Hướng dẫn cấu hình tất cả production secrets cho DSTS

---

## I. TỔNG QUAN SECRETS CẦN CẤU HÌNH

### Required Secrets (Critical)
1. `PAY_IAI_ONE_API_KEY` - Payment gateway API key
2. `PAY_DSTS_HMAC` - Payment HMAC signature
3. `MAIL_API_KEY` - Email service API key
4. `MAIL_API_WORKSPACE_ID` - Email service workspace ID
5. `POLL_TOKEN` - Donation poll authentication token
6. `TRUST_IAI_ONE_API_KEY` - Trust verification API key
7. `TRUST_IAI_ONE_WEBHOOK_SECRET` - Trust webhook secret
8. `NGUOIVIET_CLIENT_ID` - NguoiViet OAuth client ID
9. `NGUOIVIET_CLIENT_SECRET` - NguoiViet OAuth client secret
10. `NGUOVIET_WEBHOOK_SECRET` - NguoiViet webhook secret

### Optional Secrets (Enhanced Features)
11. `SEED_TOKEN` - Database seeding token
12. `BACKUP_TOKEN` - Backup API authentication token
13. `ALERT_WEBHOOK_URL` - Alert notification webhook URL
14. `SLACK_WEBHOOK_URL` - Slack notifications webhook URL

---

## II. CÁCH CẤU HÌNH SECRETS

### Method 1: Using Wrangler CLI (Recommended)

```bash
# Set each secret individually
wrangler pages secret put PAY_IAI_ONE_API_KEY --project-name duongsaotoasang-com-v2
wrangler pages secret put PAY_DSTS_HMAC --project-name duongsaotoasang-com-v2
wrangler pages secret put MAIL_API_KEY --project-name duongsaotoasang-com-v2
wrangler pages secret put MAIL_API_WORKSPACE_ID --project-name duongsaotoasang-com-v2
wrangler pages secret put POLL_TOKEN --project-name duongsaotoasang-com-v2
wrangler pages secret put TRUST_IAI_ONE_API_KEY --project-name duongsaotoasang-com-v2
wrangler pages secret put TRUST_IAI_ONE_WEBHOOK_SECRET --project-name duongsaotoasang-com-v2
wrangler pages secret put NGUOIVIET_CLIENT_ID --project-name duongsaotoasang-com-v2
wrangler pages secret put NGUOIVIET_CLIENT_SECRET --project-name duongsaotoasang-com-v2
wrangler pages secret put NGUOVIET_WEBHOOK_SECRET --project-name duongsaotoasang-com-v2
```

### Method 2: Using Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select `duongsaotoasang-com-v2`
4. Go to Settings → Environment Variables
5. Add each secret with its value

### Method 3: Using GitHub Actions Secrets

```yaml
# In .github/workflows/deploy-v3.yml
env:
  PAY_IAI_ONE_API_KEY: ${{ secrets.PAY_IAI_ONE_API_KEY }}
  PAY_DSTS_HMAC: ${{ secrets.PAY_DSTS_HMAC }}
  MAIL_API_KEY: ${{ secrets.MAIL_API_KEY }}
  MAIL_API_WORKSPACE_ID: ${{ secrets.MAIL_API_WORKSPACE_ID }}
  POLL_TOKEN: ${{ secrets.POLL_TOKEN }}
  TRUST_IAI_ONE_API_KEY: ${{ secrets.TRUST_IAI_ONE_API_KEY }}
  TRUST_IAI_ONE_WEBHOOK_SECRET: ${{ secrets.TRUST_IAI_ONE_WEBHOOK_SECRET }}
  NGUOIVIET_CLIENT_ID: ${{ secrets.NGUOIVIET_CLIENT_ID }}
  NGUOVIET_CLIENT_SECRET: ${{ secrets.NGUOVIET_CLIENT_SECRET }}
  NGUOVIET_WEBHOOK_SECRET: ${{ secrets.NGUOVIET_WEBHOOK_SECRET }}
```

---

## III. CHI TIẾT TỪNG SECRET

### 1. PAY_IAI_ONE_API_KEY
- **Nguồn:** Team Pay (tenant: dsts, site: duongsaotoasang)
- **Mô tả:** API key cho payment gateway pay.iai.one
- **Cách lấy:** Contact Team Pay hoặc login vào pay.iai.one dashboard
- **Độ ưu tiên:** 🔴 CRITICAL

### 2. PAY_DSTS_HMAC
- **Nguồn:** Generate mới
- **Mô tả:** HMAC signature cho payment verification
- **Cách tạo:** `openssl rand -hex 32`
- **Độ ưu tiên:** 🔴 CRITICAL

### 3. MAIL_API_KEY
- **Nguồn:** mail.iai.one
- **Mô tả:** API key cho email service
- **Cách lấy:** Login vào mail.iai.one dashboard
- **Độ ưu tiên:** 🔴 CRITICAL

### 4. MAIL_API_WORKSPACE_ID
- **Nguồn:** mail.iai.one
- **Mô tả:** Workspace ID cho email service
- **Cách lấy:** Login vào mail.iai.one dashboard
- **Độ ưu tiên:** 🔴 CRITICAL

### 5. POLL_TOKEN
- **Nguồn:** Generate mới
- **Mô tả:** Authentication token cho POST /api/donate/poll
- **Cách tạo:** `openssl rand -hex 32`
- **Độ ưu tiên:** 🔴 CRITICAL

### 6. TRUST_IAI_ONE_API_KEY
- **Nguồn:** trust.iai.one
- **Mô tả:** API key cho trust verification service
- **Cách lấy:** Contact trust.iai.one team hoặc login vào dashboard
- **Độ ưu tiên:** 🔴 CRITICAL

### 7. TRUST_IAI_ONE_WEBHOOK_SECRET
- **Nguồn:** trust.iai.one
- **Mô tả:** Secret cho webhook signature verification
- **Cách lấy:** Contact trust.iai.one team hoặc generate trong dashboard
- **Độ ưu tiên:** 🔴 CRITICAL

### 8. NGUOIVIET_CLIENT_ID
- **Nguồn:** NguoiViet.muonnoi.org
- **Mô tả:** OAuth 2.0 client ID cho NguoiViet integration
- **Cách lấy:** Contact NguoiViet team hoặc register OAuth app
- **Độ ưu tiên:** 🟡 HIGH

### 9. NGUOVIET_CLIENT_SECRET
- **Nguồn:** NguoiViet.muonnoi.org
- **Mô tả:** OAuth 2.0 client secret cho NguoiViet integration
- **Cách lấy:** Contact NguoiViet team hoặc register OAuth app
- **Độ ưu tiên:** 🟡 HIGH

### 10. NGUOVIET_WEBHOOK_SECRET
- **Nguồn:** NguoiViet.muonnoi.org
- **Mô tả:** Secret cho NguoiViet webhook signature verification
- **Cách lấy:** Contact NguoiViet team hoặc generate trong dashboard
- **Độ ưu tiên:** 🟡 HIGH

### 11. SEED_TOKEN
- **Nguồn:** Generate mới
- **Mô tả:** Authentication token cho database seeding
- **Cách tạo:** `openssl rand -hex 32`
- **Độ ưu tiên:** 🟢 LOW

### 12. BACKUP_TOKEN
- **Nguồn:** Generate mới
- **Mô tả:** Authentication token cho backup API
- **Cách tạo:** `openssl rand -hex 32`
- **Độ ưu tiên:** 🟢 LOW

### 13. ALERT_WEBHOOK_URL
- **Nguồn:** Configure webhook URL
- **Mô tả:** Webhook URL cho alert notifications
- **Cách tạo:** Configure trong alert service (Slack, Discord, etc.)
- **Độ ưu tiên:** 🟢 LOW

### 14. SLACK_WEBHOOK_URL
- **Nguồn:** Slack
- **Mô tả:** Webhook URL cho Slack notifications
- **Cách tạo:** Create incoming webhook trong Slack
- **Độ ưu tiên:** 🟢 LOW

---

## IV. VERIFICATION SCRIPT

Sau khi cấu hình secrets, chạy script này để verify:

```bash
#!/bin/bash
# verify-secrets.sh

echo "Verifying DSTS production secrets..."

# Test health check
HEALTH_CHECK=$(curl -s https://duongsaotoasang.com/api/monitoring/health)
echo "Health Check: $HEALTH_CHECK"

# Test trust.iai.ONE integration
TRUST_TEST=$(curl -s https://duongsaotoasang.com/api/trust-iai/verify)
echo "Trust.iai.ONE: $TRUST_TEST"

# Test NguoiViet integration
NGUOIVIET_TEST=$(curl -s https://duongsaotoasang.com/api/nguoiviet/auth)
echo "NguoiViet: $NGUOIVIET_TEST"

echo "Verification complete!"
```

---

## V. SECURITY BEST PRACTICES

1. **Never commit secrets to git** - Luôn sử dụng environment variables
2. **Rotate secrets regularly** - Đổi secrets định kỳ (3-6 tháng)
3. **Use strong secrets** - Tối thiểu 32 characters, mix uppercase, lowercase, numbers, symbols
4. **Limit access** - Chỉ cho phép team cần thiết access
5. **Monitor usage** - Theo dõi usage của secrets để detect unauthorized access
6. **Backup secrets** - Lưu trữ secrets ở secure location (password manager)
7. **Document rotation** - Document khi nào secrets được rotate

---

## VI. TROUBLESHOOTING

### Issue: Health check shows "degraded"
**Solution:** Check which secrets are missing and configure them

### Issue: Trust.iai.ONE integration not working
**Solution:** Verify TRUST_IAI_ONE_API_KEY and TRUST_IAI_ONE_WEBHOOK_SECRET

### Issue: NguoiViet integration not working
**Solution:** Verify NGUOIVIET_CLIENT_ID, NGUOIVIET_CLIENT_SECRET, NGUOVIET_WEBHOOK_SECRET

### Issue: Email not sending
**Solution:** Verify MAIL_API_KEY and MAIL_API_WORKSPACE_ID

### Issue: Payment not working
**Solution:** Verify PAY_IAI_ONE_API_KEY and PAY_DSTS_HMAC

---

## VII. CONTACT INFORMATION

**For API Keys:**
- Team Pay: contact@pay.iai.one
- Trust.iai.ONE: contact@trust.iai.one
- NguoiViet: contact@nguoiviet.muonnoi.org
- Mail.iai.ONE: contact@mail.iai.one

**For Technical Support:**
- DSTS Support: support@duongsaotoasang.com

---

**Production Secrets Configuration Guide completed.**  
**Ngày:** 2026-06-16  
**Trạng thái:** ✅ **READY FOR PRODUCTION CONFIGURATION**
