# DSTS CLUB — DATA MODEL & API CONTRACT 2026

## 1. Core entities

```text
users
creators
clubs
club_memberships
club_posts
club_media
club_talkshows
club_tickets
subscriptions
orders
payments
wallets
point_ledger
point_packages
point_expiry_rules
creator_point_ledger
creator_levels
reward_catalog
reward_redemptions
referral_links
referral_events
creator_revenue_shares
creator_payouts
content_access_logs
reports
moderation_cases
notifications
audit_logs
campaigns
sponsor_campaigns
creator_contracts
eligibility_rules
app_store_purchase_locks
```

## 2. User roles

guest, member, creator, creator_manager, moderator, support, finance_admin, club_admin, super_admin.

## 3. Entitlement model

Every paid access must be entitlement-based. Sources: active subscription, purchased ticket, reward redemption, admin grant, creator comp, sponsor pass, event invite, legacy access.

## 4. Membership states

none, trial, active, past_due, cancel_scheduled, cancelled, expired, refunded, blocked.

## 5. Creator states

applied, reviewing, approved, active, paused, suspended, terminated.

## 6. Content access levels

public, member, circle, inner_circle, ticketed, reward_only, invite_only, admin_only.

## 7. Wallet model

Wallet stores available, pending, lifetime, status. No balance update without ledger.

## 8. API endpoints

Public:

```text
GET /api/clubs
GET /api/clubs/:slug
GET /api/clubs/:slug/public-posts
GET /api/talkshows/public
GET /api/rewards/public
```

Member:

```text
GET /api/me
GET /api/me/subscriptions
GET /api/me/wallet
GET /api/me/points
GET /api/me/referrals
GET /api/me/rewards
GET /api/me/tickets
GET /api/me/notifications
```

Club:

```text
GET /api/clubs/:slug/posts
POST /api/clubs/:slug/subscribe
GET /api/clubs/:slug/talkshows
POST /api/talkshows/:id/register
POST /api/talkshows/:id/ask-question
```

Points:

```text
POST /api/points/purchase
GET /api/points/packages
GET /api/points/ledger
POST /api/rewards/redeem
GET /api/rewards/redemptions
```

Referral:

```text
POST /api/referrals/create
GET /api/referrals/me
POST /api/referrals/claim
```

Creator:

```text
GET /api/creator/dashboard
POST /api/creator/posts
GET /api/creator/posts
POST /api/creator/talkshows
GET /api/creator/members
GET /api/creator/revenue
GET /api/creator/payouts
GET /api/creator/points
POST /api/creator/payouts/request
```

Admin:

```text
GET /api/admin/clubs
POST /api/admin/clubs
GET /api/admin/creators
POST /api/admin/creators/:id/approve
POST /api/admin/creators/:id/suspend
GET /api/admin/content
POST /api/admin/content/:id/moderate
GET /api/admin/subscriptions
GET /api/admin/points
POST /api/admin/points/adjust
GET /api/admin/rewards
POST /api/admin/rewards
GET /api/admin/referrals
GET /api/admin/talkshows
GET /api/admin/payouts
POST /api/admin/payouts/:id/approve
POST /api/admin/payouts/:id/hold
GET /api/admin/moderation
GET /api/admin/reports
```

## 9. Access-control rules

Guest can view public. Member can view access level <= tier. Circle can view Member + Circle. Inner Circle can view all non-invite content. Ticketed requires ticket entitlement. Reward-only requires reward redemption. Invite-only requires explicit entitlement. Creator can manage own content only. Admin actions require audit log.

## 10. Payment status rules

Payment states: created, pending, paid, failed, expired, refunded, chargeback, cancelled.

Rules: never mark paid from return URL. Paid status only from verified provider webhook or manual finance approval. Idempotency required. Order ID required. Audit log required. Points credited only after paid.

## 11. Moderation

Report types: copyright, harassment, spam, fraud, misleading_claim, privacy, unsafe_meetup, payment_issue, other.

States: open, reviewing, action_taken, dismissed, escalated, closed.

## 12. Audit logs

Every sensitive action logs actor_id, actor_role, action, resource_type, resource_id, before/after if applicable, IP/user agent if allowed, timestamp, risk flag.
