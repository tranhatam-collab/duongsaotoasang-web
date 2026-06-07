# DSTS Financial Projections — 6 Months, 1 Year, 2 Years

> **Document:** DSTS Financial Projections 2026-2028
> **Date:** 2026-06-10
> **Prepared by:** AI Audit Analysis
> **Status:** 📝 DRAFT — Based on current implementation and roadmap
> **Disclaimer:** These projections are estimates based on available documentation. Actual results may vary significantly.

---

## Executive Summary

**duongsaotoasang.com** is a multi-layered platform with 3 distinct revenue lanes:
- **Lane A (Commercial):** Script Journey coaching, membership, event tickets
- **Lane B (Nonprofit):** Donations, corporate sponsorships, NDNUM child sponsorship
- **Lane C (Investment):** Not active in Year 1-2

**Key Financial Highlights:**

| Period | Revenue (USD) | Expenses (USD) | Net (USD) | Valuation Range |
|---|---|---|---|---|
| **6 Months (Jun-Dec 2026)** | $15,000 - $45,000 | $20,000 - $35,000 | -$5,000 to +$10,000 | $50,000 - $150,000 |
| **1 Year (2026)** | $50,000 - $150,000 | $60,000 - $100,000 | -$10,000 to +$50,000 | $150,000 - $500,000 |
| **2 Years (2026-2027)** | $300,000 - $800,000 | $200,000 - $400,000 | $100,000 - $400,000 | $1M - $3M |

---

## 1. Current Implementation Status (June 2026)

### 1.1 Technical Maturity
- **Layer 0 (Foundation):** 90+/100 complete (repo-side)
- **Blocker:** Cloudflare custom-domain header/cache override (external, not code)
- **Payment Integration:** 80% ready (pay.iai.one for donations)
- **Database:** D1 schema with 10+ migrations deployed
- **API:** Donation create/webhook endpoints functional

### 1.2 Revenue Readiness
| Revenue Stream | Status | Time to Activation |
|---|---|---|
| Donations (Lane B) | 80% ready | 2-4 weeks (secrets + legal) |
| Script Journey (Lane A) | Spec complete | 3-6 months (Layer 2) |
| Sponsorships (Lane B) | Spec complete | 4-6 months (Layer 1) |
| Event Tickets (Lane A) | Spec complete | 4-6 months (Layer 1) |
| Membership (Lane A) | Spec complete | 6-9 months (Layer 2) |

---

## 2. Revenue Projections

### 2.1 6-Month Projection (June - December 2026)

**Assumptions:**
- Layer 0 completes by July 2026
- Donation system activates August 2026
- Phase 0B (Legal) completes August 2026
- Layer 1 (Movement Portal) launches October 2026
- Conservative adoption rates

| Revenue Source | Conservative | Moderate | Aggressive |
|---|---|---|---|
| **Donations (Lane B)** | $5,000 | $10,000 | $20,000 |
| - Individual donations (avg $50) | $3,000 | $6,000 | $12,000 |
| - One-time large donations | $2,000 | $4,000 | $8,000 |
| **Script Journey (Lane A)** | $0 | $5,000 | $15,000 |
| - 1:1 coaching engagements (0-3) | $0 | $5,000 | $15,000 |
| **Sponsorships (Lane B)** | $0 | $5,000 | $10,000 |
| - Early sponsor commitments (0-2) | $0 | $5,000 | $10,000 |
| **TOTAL 6-MONTH REVENUE** | **$5,000** | **$20,000** | **$45,000** |

### 2.2 1-Year Projection (Full Year 2026)

**Assumptions:**
- Layer 1 fully operational by December 2026
- Initial sponsor pipeline activated
- Donation flow stable
- 1-2 Script Journey engagements completed

| Revenue Source | Conservative | Moderate | Aggressive |
|---|---|---|---|
| **Donations (Lane B)** | $15,000 | $30,000 | $60,000 |
| - Monthly recurring donors (20-50) | $5,000 | $10,000 | $20,000 |
| - One-time donations | $10,000 | $20,000 | $40,000 |
| **Script Journey (Lane A)** | $5,000 | $20,000 | $50,000 |
| - 1:1 coaching (1-5 engagements) | $5,000 | $20,000 | $50,000 |
| **Sponsorships (Lane B)** | $10,000 | $40,000 | $100,000 |
| - Corporate sponsors (1-5) | $10,000 | $40,000 | $100,000 |
| **Event Tickets (Lane A)** | $5,000 | $15,000 | $30,000 |
| - Gala/showcase events | $5,000 | $15,000 | $30,000 |
| **Membership (Lane A)** | $0 | $5,000 | $15,000 |
| - Verified Star Circle (0-20 members) | $0 | $5,000 | $15,000 |
| **TOTAL 1-YEAR REVENUE** | **$35,000** | **$110,000** | **$255,000** |

### 2.3 2-Year Projection (2026-2027)

**Assumptions:**
- Layer 2 (Star Journey OS) launches Q2 2027
- Membership scales to 50-200 members
- Sponsorship pipeline matures
- NDNUM child sponsorship program activates
- Tour events generate revenue

| Revenue Source | Conservative | Moderate | Aggressive |
|---|---|---|---|
| **Donations (Lane B)** | $40,000 | $80,000 | $150,000 |
| - Recurring donors (50-150) | $20,000 | $40,000 | $80,000 |
| - One-time donations | $20,000 | $40,000 | $70,000 |
| **Script Journey (Lane A)** | $30,000 | $100,000 | $250,000 |
| - 1:1 coaching (5-20 engagements) | $30,000 | $100,000 | $250,000 |
| **Sponsorships (Lane B)** | $50,000 | $200,000 | $500,000 |
| - Corporate sponsors (5-15) | $50,000 | $200,000 | $500,000 |
| **Event Tickets (Lane A)** | $20,000 | $60,000 | $120,000 |
| - Tour events + galas | $20,000 | $60,000 | $120,000 |
| **Membership (Lane A)** | $10,000 | $50,000 | $150,000 |
| - Verified Star Circle (20-200) | $10,000 | $50,000 | $150,000 |
| **NDNUM Child Sponsorship (Lane B)** | $10,000 | $50,000 | $100,000 |
| - Child sponsors (10-50) | $10,000 | $50,000 | $100,000 |
| **TOTAL 2-YEAR REVENUE** | **$160,000** | **$540,000** | **$1,270,000** |

---

## 3. Expense Projections

### 3.1 Infrastructure Costs (Monthly)

| Service | Cost (USD) | Notes |
|---|---|---|
| Cloudflare Pages | $0 - $20 | Free tier sufficient initially |
| Cloudflare D1 | $0 - $5 | Free tier 5GB storage |
| Cloudflare Functions | $0 - $10 | Free tier 100k requests/day |
| Domain + SSL | $15 - $30 | duongsaotoasang.com |
| Email Service (mail.iai.one) | $10 - $50 | Based on volume |
| Payment Gateway (pay.iai.one) | 1-2% | Transaction fee |
| Monitoring (Sentry/UptimeRobot) | $0 - $20 | Free tiers available |
| **TOTAL INFRASTRUCTURE** | **$25 - $135/month** | **$300 - $1,620/year** |

### 3.2 Development Costs (One-time)

| Phase | Cost (USD) | Notes |
|---|---|---|
| Layer 0 Completion | $2,000 - $5,000 | Sprint 0-4 (4 weeks) |
| Phase 0B Legal Setup | $5,000 - $15,000 | Legal counsel + 501c3 |
| Layer 1 Development | $10,000 - $25,000 | Movement Portal (4 months) |
| Layer 2 Development | $20,000 - $50,000 | Star Journey OS (6 months) |
| Brandpro Integration | $3,000 - $8,000 | Trademark + brand assets |
| **TOTAL DEVELOPMENT** | **$40,000 - $103,000** | Spread over 12-18 months |

### 3.3 Operational Costs (Monthly)

| Category | Cost (USD) | Notes |
|---|---|---|
| Content Creation | $500 - $2,000 | Blog, copy, social media |
| Marketing/Ads | $200 - $1,000 | Social ads, promotion |
| Legal/Accounting | $500 - $1,500 | Ongoing compliance |
| Event Operations | $0 - $5,000 | Variable based on events |
| Staff (part-time) | $1,000 - $3,000 | Coordinator, support |
| **TOTAL OPERATIONAL** | **$2,200 - $12,500/month** | **$26,400 - $150,000/year** |

### 3.4 Total Expense Summary

| Period | Infrastructure | Development | Operational | Total |
|---|---|---|---|---|
| **6 Months** | $150 - $810 | $10,000 - $30,000 | $13,200 - $75,000 | **$13,350 - $105,810** |
| **1 Year** | $300 - $1,620 | $25,000 - $60,000 | $26,400 - $150,000 | **$51,700 - $211,620** |
| **2 Years** | $600 - $3,240 | $40,000 - $103,000 | $52,800 - $300,000 | **$93,400 - $406,240** |

---

## 4. Net Income Projections

### 4.1 6-Month Net (Jun-Dec 2026)

| Scenario | Revenue | Expenses | Net |
|---|---|---|---|
| Conservative | $5,000 | $50,000 | **-$45,000** |
| Moderate | $20,000 | $35,000 | **-$15,000** |
| Aggressive | $45,000 | $20,000 | **+$25,000** |

### 4.2 1-Year Net (2026)

| Scenario | Revenue | Expenses | Net |
|---|---|---|---|
| Conservative | $35,000 | $80,000 | **-$45,000** |
| Moderate | $110,000 | $60,000 | **+$50,000** |
| Aggressive | $255,000 | $52,000 | **+$203,000** |

### 4.3 2-Year Net (2026-2027)

| Scenario | Revenue | Expenses | Net |
|---|---|---|---|
| Conservative | $160,000 | $150,000 | **+$10,000** |
| Moderate | $540,000 | $120,000 | **+$420,000** |
| Aggressive | $1,270,000 | $100,000 | **+$1,170,000** |

---

## 5. Valuation Methodology

### 5.1 Valuation Approaches

**1. Revenue Multiple (SaaS/Platform standard)**
- Conservative: 3x annual revenue
- Moderate: 5x annual revenue
- Aggressive: 8x annual revenue

**2. Asset-Based (Development + IP)**
- Codebase + documentation: $50,000 - $150,000
- Brand + domain: $20,000 - $50,000
- User data (if any): $10,000 - $30,000

**3. Future Potential (Market opportunity)**
- Vietnamese diaspora market: 5M+ globally
- Coaching market TAM: $10B+ globally
- Nonprofit donation market: Significant but regulated

### 5.2 Valuation Ranges

| Period | Conservative | Moderate | Aggressive |
|---|---|---|---|
| **6 Months** | $50,000 - $100,000 | $100,000 - $200,000 | $200,000 - $400,000 |
| **1 Year** | $100,000 - $200,000 | $500,000 - $800,000 | $1M - $2M |
| **2 Years** | $500,000 - $1M | $2M - $4M | $5M - $10M |

**Rationale:**
- **6 Months:** Pre-revenue or early revenue, valued on potential + sunk costs
- **1 Year:** Revenue traction established, valued on revenue multiple
- **2 Years:** Proven business model, valued on growth + market position

---

## 6. Key Risk Factors

### 6.1 Execution Risks
- **Legal Compliance:** Phase 0B (NDNUM child safety) is critical blocker
- **Technical Debt:** Cloudflare custom-domain issue needs resolution
- **Team Scaling:** Need dedicated Tech Lead, Content Writer, Legal Counsel

### 6.2 Market Risks
- **Donation Fatigue:** Economic downturns affect nonprofit revenue
- **Competition:** Coaching market is crowded
- **Regulatory:** Cross-border donations have compliance complexity

### 6.3 Financial Risks
- **Cash Flow:** Development costs front-loaded, revenue back-loaded
- **Payment Gateway:** Dependency on pay.iai.one (single point of failure)
- **Currency:** VND/USD exchange rate fluctuations

---

## 7. Recommendations

### 7.1 Immediate Actions (Next 30 Days)
1. **Resolve Cloudflare Blocker:** Fix custom-domain header/cache issue
2. **Activate Donations:** Set up pay.iai.one secrets + legal disclosure
3. **Complete Layer 0:** Finalize Sprint 0-4 deliverables

### 7.2 Short-Term (3-6 Months)
1. **Phase 0B Execution:** Legal entity + NDNUM compliance
2. **Layer 1 Development:** Movement Portal sponsorship flow
3. **Initial Fundraising:** Target 3-5 early sponsors ($5K-$25K each)

### 7.3 Medium-Term (6-12 Months)
1. **Layer 2 Planning:** Star Journey OS spec + development
2. **Membership Launch:** Verified Star Circle tier
3. **Revenue Diversification:** Reduce dependency on single revenue stream

---

## 8. Sensitivity Analysis

### 8.1 Best Case Scenario
- All blockers resolved by July 2026
- 5 corporate sponsors signed by December 2026 ($200K total)
- 10 Script Journey engagements in Year 1 ($150K)
- **1-Year Net:** +$200K+
- **2-Year Valuation:** $5M+

### 8.2 Worst Case Scenario
- Legal blockers delay to Q4 2026
- Only 1-2 small sponsors ($5K-$10K total)
- No Script Journey engagements in Year 1
- **1-Year Net:** -$50K
- **2-Year Valuation:** $500K

### 8.2 Base Case (Most Likely)
- Layer 0 completes July 2026
- Phase 0B completes August 2026
- Layer 1 launches October 2026
- 3-4 sponsors signed ($50K-$100K)
- 2-3 Script Journey engagements ($30K-$50K)
- **1-Year Net:** +$50K
- **2-Year Valuation:** $2M-$3M

---

## 9. Conclusion

**duongsaotoasang.com** represents a strategically designed multi-layer platform with:
- **Strong technical foundation** (90+/100 completion)
- **Clear revenue model** (3 distinct lanes with firewall separation)
- **Significant market opportunity** (Vietnamese diaspora + coaching)
- **Moderate execution risk** (legal compliance is key dependency)

**Valuation Assessment:**
- **Current (pre-revenue):** $50,000 - $150,000 (asset-based)
- **6 months (early revenue):** $150,000 - $500,000 (potential-based)
- **1 year (proven traction):** $500,000 - $2M (revenue multiple)
- **2 years (scaled):** $2M - $5M (growth + market position)

**Key Success Factors:**
1. Resolve Cloudflare technical blocker immediately
2. Complete Phase 0B legal compliance on schedule
3. Secure 3-5 anchor sponsors in 2026
4. Execute Layer 1-2 development roadmap
5. Maintain financial discipline across 3 revenue lanes

---

## Appendix: Reference Documents

- `00_DSTS_MASTER_INDEX_2026.md` — Overall project roadmap
- `MASTER_PLAN_v2.md` — 100/100 rubric + Brandpro integration
- `DSTS_LAYER_1_MOVEMENT_PORTAL_SPEC.md` — Movement Portal spec
- `DSTS_PAYMENT_MEMBERSHIP_SPONSOR_FLOW.md` — Revenue lane architecture
- `README.md` — Technical architecture
- `RUNBOOK.md` — Operational procedures
- `wrangler.toml` — Infrastructure configuration

---

*This document is a financial projection based on available documentation as of June 2026. Actual results may vary significantly. Projections should be reviewed quarterly and adjusted based on actual performance.*
