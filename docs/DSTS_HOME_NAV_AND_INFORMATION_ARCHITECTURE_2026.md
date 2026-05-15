# DSTS_HOME_NAV_AND_INFORMATION_ARCHITECTURE_2026.md

**Version:** 1.0  
**Date:** 2026-05-15  
**Status:** Active IA spec — overrides ad-hoc nav decisions  
**Scope:** duongsaotoasang.com — homepage + top nav + footer + route hierarchy  
**Audience:** Founder, Content, Design, Dev, Legal, SEO  
**Companion:** `DSTS_PUBLIC_SITE_REWRITE_SCOPE_2026.md`, `DSTS_PUBLIC_CLAIM_REGISTER_2026.md`

---

# 1. PURPOSE

Khoá information architecture (IA) của DSTS public site theo 5-lane legal architecture. Mục tiêu:

- Visitor mới hiểu DSTS là gì trong 10 giây
- Không trộn commercial / nonprofit / investment / community / media
- Top nav clean ≤ 8 mục
- Mỗi route biết lane + entity operator + claim register

---

# 2. CURRENT STATE (2026-05-15 audit)

Public top nav hiện tại có gì → đối chiếu với 5-lane rules.

| Route | Lane | Entity | Public? | Issue (if any) |
|-------|------|--------|---------|----------------|
| `/` | Cross-cutting | Việt Can JSC (host) | ✅ | Cần re-check claim mix |
| `/about` | Identity | All | ✅ | OK |
| `/program` | A — Commercial | Việt Can JSC | ✅ | Cần làm rõ commercial lane |
| `/scripts` | A — Commercial | Việt Can JSC | ✅ | OK |
| `/posts` | C — Media/IP | Việt Can JSC | ✅ | OK |
| `/events` | A — Commercial (mostly) | Việt Can JSC | ✅ | OK |
| `/donate` | B — Nonprofit | Foundation (preparing) | ✅ | Hiện status: TẠM ĐÓNG (correct) |
| `/transparency` | Cross-cutting | All | ✅ | OK |
| `/legal` | Cross-cutting | All | ✅ | OK |
| `/contact` | Cross-cutting | All | ✅ | OK |
| `/support` | Cross-cutting | All | ✅ | OK |
| `/terms` | Cross-cutting | All | ✅ | OK |
| `/privacy` | Cross-cutting | All | ✅ | OK |
| `/refund` | A — Commercial | Việt Can JSC | ✅ | OK |
| `/dream-nurture` | B — Nonprofit (preparing) | Foundation | ✅ | Roadmap only ✅ |
| `/ndnum` | B — Nonprofit (preparing) | Foundation | ✅ | Alias of `/dream-nurture` ✅ |
| `/movement` | Cross-cutting | All | ✅ | Movement Portal hub |
| `/movement/sponsors` | A + B mixed | Both | ✅ | ⚠️ Cần label rõ commercial vs nonprofit sponsor tiers |
| `/movement/events` | A — Commercial | Việt Can JSC | ✅ | OK |
| `/movement/gala-2026` | A — Commercial (when ready) | Việt Can JSC | ✅ noindex | Updated 2026-05-15 ✅ |
| `/movement/tour-2026-2027` | A — Commercial | Việt Can JSC + local partners | ✅ | OK |
| `/movement/diaspora-map` | D — Community | All | ✅ | OK |
| `/movement/press` | C — Media/IP | All | ✅ | OK |
| `/movement/partners` | Cross-cutting | All | ✅ | OK |
| `/scripts/{slug}` × 9 | A — Commercial | Việt Can JSC | ✅ | OK |
| `/payment-confirmation` | A — Commercial | Việt Can JSC | ✅ | OK |

---

# 3. TARGET TOP NAV (RECOMMENDED ≤ 8)

## 3.1 Top primary nav (always visible)

```
About | Programs | Scripts | Events | Posts | Transparency | Support | Contact
```

- **About** → `/about` — Identity, entity disclosure, team
- **Programs** → `/program` — All commercial programs catalogue (Lane A)
- **Scripts** → `/scripts` — Script Journey catalogue (Lane A)
- **Events** → `/events` — Calendar (Lane A + cross)
- **Posts** → `/posts` — Content library (Lane C — Media/IP)
- **Transparency** → `/transparency` — Operations + financial transparency (Cross)
- **Support** → `/support` — Help docs (Cross)
- **Contact** → `/contact` — Inquiry-first (Cross)

## 3.2 Footer (separated by lane)

```
LANE A — Commercial:    Programs | Scripts | Events | Refund Policy
LANE B — Nonprofit:     Dream Nurture (NDNUM) | Donate (preparing) | Support Interest
LANE C — Media/IP:      Posts | Press | Diaspora Stories
LANE D — Community:     Diaspora Map | Movement Portal | Partners
ENTITY DISCLOSURE:      [C-002 wording]
LEGAL:                  Terms | Privacy | Refund | Legal
COPYRIGHT + CONTACT
```

## 3.3 Submenu / mega-nav (optional, deferred Phase 1.2)

Khi launch Movement Portal Phase 1.2 (T10/2026), thêm mega-nav cho `Programs` dropdown:

```
Programs
├─ Foundation Briefing
├─ Creative Circle
├─ Showcase Series
├─ Tour 2026-2027
├─ Workshops
└─ Custom Programs
```

---

# 4. HOMEPAGE STRUCTURE (8 SECTIONS)

Theo `DSTS_PUBLIC_SITE_REWRITE_SCOPE_2026.md` Mục 7.3:

## Section 1 — Hero
- Tagline VI/EN
- 1 primary CTA: "Discover DSTS" → `/about`
- Background: cinematic, dark gold theme
- **KHÔNG có:** Donate Now, Sign up, Investment

## Section 2 — What DSTS Does
- 3-paragraph narrative
- Brief: creative + community + journey + diaspora
- **KHÔNG mention:** fame promise, income promise, child intake

## Section 3 — Core Program Families
- 4 cards (Lane A): Programs · Scripts · Events · Tour
- 1 separator
- 1 card (Lane B preparing): Dream Nurture (NDNUM)
- Each card → respective landing page

## Section 4 — Stories & Real People
- Carousel of Posts (Lane C — Media/IP)
- Human-centered, evidence-based
- **KHÔNG có:** child testimonial, fame story, before/after income claim

## Section 5 — Events / Programs / Pathways
- Upcoming events list
- "Get notified" form (newsletter only, không sponsor inquiry)

## Section 6 — Transparency
- 4-bar status indicator: Lane A · Lane B · Lane C · Lane D status
- Link → `/transparency` full page
- "What we share / What we don't share yet" frame

## Section 7 — Support / Sponsor / Partner Interest
- 4 inquiry cards: Sponsor · Partner · Volunteer · Press
- **Inquiry-first.** Không public payment, không account creation.
- Form → `/contact?topic=sponsor` etc.

## Section 8 — Footer (per Section 3.2 above)

---

# 5. ROUTE HIERARCHY

```
/                                Homepage
├── /about                       Identity + team + entity
├── /transparency                Operations transparency report
├── /support                     Help / FAQ
├── /contact                     Inquiry-first (no public form, manual contact)
│
├── LANE A — COMMERCIAL (Việt Can Star JSC + Viet Can New Corp)
│   ├── /program                 Commercial programs catalogue
│   ├── /scripts                 Script Journey hub
│   │   ├── /scripts/rising-entrepreneur
│   │   ├── /scripts/global-artist
│   │   ├── /scripts/singing-icon
│   │   ├── /scripts/cinematic-actor
│   │   ├── /scripts/the-thinker
│   │   ├── /scripts/creative-leader
│   │   ├── /scripts/cultural-ambassador
│   │   ├── /scripts/dsts-legacy
│   │   └── /scripts/global-story
│   ├── /events                  Upcoming events (commercial)
│   ├── /movement/events         Movement Portal events
│   ├── /movement/tour-2026-2027 Tour roadmap
│   ├── /movement/gala-2026      Gala status (noindex placeholder)
│   ├── /payment-confirmation    Post-payment receipt
│   ├── /refund                  Refund policy
│   └── /terms                   T&C (commercial focus)
│
├── LANE B — NONPROFIT (Angel Edu Tam Foundation / fiscal sponsor)
│   ├── /dream-nurture           NDNUM landing (roadmap only)
│   ├── /ndnum                   Alias of above
│   ├── /donate                  Donate status (TẠM ĐÓNG / preparing)
│   └── /transparency/impact     Impact reports (Q2/2026+)
│
├── LANE C — MEDIA/IP (Việt Can JSC + Viet Can New Corp)
│   ├── /posts                   Content library
│   ├── /content?slug=...        Content detail
│   ├── /movement/press          Press kit
│   └── /rss.xml                 Content feed
│
├── LANE D — COMMUNITY (cross-cutting host: Việt Can JSC)
│   ├── /movement                Movement Portal hub
│   ├── /movement/diaspora-map   Diaspora map (privacy-aware)
│   ├── /movement/partners       Partner page
│   └── /movement/sponsors       Sponsor readiness hub
│
├── LANE E — INVESTMENT (gated, no public surface)
│   └── (no public routes — 🔴 BLOCKED Y1-Y2)
│
├── LEGAL & TECHNICAL
│   ├── /legal                   Legal hub
│   ├── /privacy                 Privacy policy
│   ├── /terms                   T&C
│   ├── /refund                  Refund policy
│   ├── /robots.txt              SEO directives
│   ├── /sitemap.xml             Sitemap
│   └── /og.png                  Open Graph image
│
└── API (internal — no public nav)
    ├── /api/content
    ├── /api/contents
    ├── /api/search
    ├── /api/donate/create       (Lane B, when active)
    ├── /api/donate/webhook      (Lane B webhook from pay.iai.one)
    └── /api/newsletter/subscribe (when active)
```

---

# 6. SEO & SITEMAP RULES

## 6.1 Indexable (default `index,follow`)
- All Lane A routes (commercial programs visible to SEO)
- All Lane C routes (content)
- `/`, `/about`, `/transparency`, `/contact`, `/support`
- `/dream-nurture`, `/ndnum` (Lane B preparing, but indexable to communicate vision)
- `/legal`, `/terms`, `/privacy`, `/refund`

## 6.2 Noindex (no sitemap entry)
- `/movement/gala-2026` — placeholder, status pending
- `/movement/sponsors/:tier` — detail pages, not ready
- `/movement/events/:slug` — detail pages, not ready
- `/payment-confirmation` — transactional
- Any 404 catch page

## 6.3 Canonical
- Mỗi route MUST có `<link rel="canonical">` self-reference
- Cross-domain canonical KHÔNG dùng (DSTS không alias domain khác)

---

# 7. ENTITY DISCLOSURE FOOTER (MANDATORY)

Mỗi page MUST có footer block:

```html
<footer>
  <!-- Entity disclosure (claim C-002) -->
  <p class="entity-disclosure">
    Đường Sao Tỏa Sáng được vận hành bởi
    <strong>Công ty Cổ phần Giải trí Ngôi Sao Việt Can</strong> (Việt Nam) cho
    hoạt động thương mại và <strong>Viet Can New Corp</strong> (Hoa Kỳ) cho hoạt
    động quốc tế. Hoạt động phi lợi nhuận triển khai qua
    <strong>Angel Edu Tam Foundation</strong> khi đủ điều kiện pháp lý.
  </p>
  
  <!-- Lane separator -->
  <nav aria-label="Footer navigation by lane">
    <section><h3>Commercial</h3><ul>...</ul></section>
    <section><h3>Nonprofit</h3><ul>...</ul></section>
    <section><h3>Content</h3><ul>...</ul></section>
    <section><h3>Community</h3><ul>...</ul></section>
  </nav>
  
  <!-- Legal links -->
  <nav aria-label="Legal links">
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a>
    <a href="/refund">Refund</a>
    <a href="/legal">Legal</a>
  </nav>
  
  <!-- Copyright -->
  <p class="copyright">
    © 2026 Đường Sao Tỏa Sáng. All rights reserved.
  </p>
</footer>
```

---

# 8. PAGE-LEVEL DISCLAIMERS

Mỗi page có disclaimer riêng tuỳ lane.

| Page | Required disclaimer |
|------|---------------------|
| `/program/*`, `/scripts/*`, `/events/*` | C-100 (commercial) + C-801 (no outcome promise) |
| `/donate` | C-200 (donate preparing) + C-800 (not investment) |
| `/dream-nurture`, `/ndnum` | C-101 (NDNUM preparing) + C-400 (child safety commitment) + C-800 (not investment) + C-802 (not fundraising platform) |
| `/movement/sponsors` | Section: "Commercial sponsor" + Section: "NDNUM sponsor" separated, no checkout yet |
| `/transparency` | C-201 (first report Q2/2026 after audit) |
| `/contact` | "Inquiry-first, no automated processing" |
| All pages | C-002 (entity disclosure in footer) + C-800 (not investment) |

---

# 9. SOCIAL META (per page)

Mỗi route MUST có:

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Đường Sao Tỏa Sáng">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://duongsaotoasang.com/...">
<meta property="og:image" content="https://duongsaotoasang.com/og.png">
<meta name="twitter:card" content="summary_large_image">
```

QA gate `social-metadata-qa.mjs` already enforces.

---

# 10. STRUCTURED DATA (per page type)

| Page type | Schema.org type |
|-----------|-----------------|
| `/` | `Organization` + `WebSite` |
| `/about` | `Organization` + `Person` (Founder) |
| `/posts` | `ItemList` + items `BlogPosting` |
| `/content?slug=` | `BlogPosting` or `Article` |
| `/events` | `ItemList` + items `Event` |
| `/scripts/{slug}` | `Course` + `Product` |
| `/movement/sponsors` | `WebPage` (sponsor program) |
| `/dream-nurture` | `WebPage` + `NGO` reference |
| `/transparency` | `WebPage` + `AnnualReport` ref |

QA gate `structured-data-qa.mjs` already enforces presence (34 entities current).

---

# 11. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile S | 375px | Single column, hamburger menu |
| Mobile L | 480px | Larger touch targets |
| Tablet | 768px | 2-column grids |
| Desktop S | 1024px | Top nav visible (no hamburger) |
| Desktop M | 1280px | Full mega-nav (Phase 1.2) |
| Desktop L | 1440px | Wide hero, content max 1200px |

---

# 12. ACCESSIBILITY GUARANTEES

- WCAG 2.1 AA compliant
- Skip-to-content link mọi page
- Color contrast ≥ 4.5:1 cho text
- `aria-current` cho active nav
- `aria-label` cho all icon-only buttons
- Focus-visible styles
- Reduced motion respected (`prefers-reduced-motion`)

QA gate `accessibility-qa.mjs` already enforces (35 pages pass).

---

# 13. PERFORMANCE BUDGETS

| Asset | Max size | Cache |
|-------|----------|-------|
| HTML page | 50KB | max-age=0, must-revalidate |
| Critical CSS (`app.css`, `tokens.css`) | 30KB each | max-age=300 |
| Main JS (`app-v5.js`) | 50KB | max-age=300 |
| Hero image | 200KB (WebP) | max-age=86400 |
| OG image (`og.png`) | 150KB | max-age=300 |
| Total page weight (initial load) | < 500KB | — |

QA gate `public-asset-budget-qa.mjs` enforces 146 files / 2.78MB total.

---

# 14. CHANGES FROM CURRENT STATE

| Change | Priority | Impact |
|--------|----------|--------|
| Add entity disclosure footer to all pages | P0 | High — Legal claim C-002 mandatory |
| Separate Lane A vs Lane B in sponsor pages | P1 | Medium — clarity |
| Add per-lane footer columns | P1 | Medium — visual lane separation |
| Add structured data NGO ref to NDNUM page | P2 | Low — SEO improvement |
| Add mega-nav for Programs (T10/2026) | P3 | Defer to Phase 1.2 |

---

# 15. IMPLEMENTATION ORDER

1. ✅ Audit current routes (Mục 2 above) — DONE 2026-05-15
2. ⏳ Update `<footer>` partial mọi page với entity disclosure (P0)
3. ⏳ Update `/movement/sponsors` separate Lane A vs Lane B sections (P1)
4. ⏳ Add `<aria-current>` cho active nav links (P1)
5. ⏳ Verify mọi page có canonical + og + structured data (QA gates đã pass)
6. ⏳ Defer mega-nav until Phase 1.2 (T10/2026)
7. ⏳ Annual IA review (next: 2027-05-15)

---

# 16. SIGN-OFF

- [ ] Founder — approve nav structure
- [ ] Legal Counsel — verify entity disclosure wording compliant VN + US
- [ ] Design — confirm visual hierarchy + responsive specs
- [ ] Dev — confirm route hierarchy matches `functions/sitemap.xml.js` + `_redirects`
- [ ] SEO — verify indexable / noindex split

---

# 17. CROSS-REFERENCES

- `DSTS_PUBLIC_SITE_REWRITE_SCOPE_2026.md` — rewrite scope (5-lane principles)
- `DSTS_LEGAL_LANE_ARCHITECTURE_AND_NDNUM_SAFE_LAUNCH_PLAN_2026.md` — 5-lane architecture
- `DSTS_ENTITY_AND_LANE_MAP_2026.md` — entity per lane
- `DSTS_PUBLIC_CLAIM_REGISTER_2026.md` — claim registry
- `scripts/smoke-test.sh` — route smoke test
- `scripts/sprint-0-release-gate.mjs` — full release gate
- `_redirects` — Cloudflare Pages route rules

---

# 18. FINAL DIRECTIVE

Top nav ≤ 8 mục. Footer phân lane rõ. Mọi route biết entity + lane. Mọi claim trong registry. Mọi disclaimer ở đúng page. Không có ngoại lệ.
