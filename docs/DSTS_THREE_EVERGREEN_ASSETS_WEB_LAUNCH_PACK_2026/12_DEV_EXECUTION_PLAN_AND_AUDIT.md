# 12 — DEV EXECUTION PLAN & AUDIT (Handoff to Dev Model)

> **Status:** APPROVED FOR NEXT DEV MODEL EXECUTION
>
> This file is the single source of truth for the next dev model. Execute tasks in order.
> Do not expand scope beyond what is listed here. All paths are relative to repo root
> `duongsaotoasang.com/`.

---

## A. AUDIT — Current state vs Launch Pack (as of this handoff)

| # | Launch Pack requirement | Source spec | Current state | Action |
|---|---|---|---|---|
| 1 | `/story-library` page (Asset #1) | `04_ARTICLE_01...` | `story-library.html` **exists** (474 l) | VERIFY only — confirm legal copy + 3-pillar cross-links present |
| 2 | `/mentor-network` page (Asset #2) | `05_ARTICLE_02...` | **MISSING** | **CREATE** |
| 3 | `/dream-nurture` page (Asset #3) | `06_ARTICLE_03...` | `dream-nurture.html` **exists** (647 l) | EDIT — add cross-pillar links block |
| 4 | Homepage 3-pillar links | `03_HOMEPAGE...`, `10_SEO...` | only `/dream-nurture` (`v11`) | **EDIT** `index.html` — add `v12` (story), `v13` (mentor) + i18n |
| 5 | Nav items "Câu chuyện" + "Mentor" | `02_PUBLIC_SITE_ROUTE_MAP...` | not in `app-v5.js` | **EDIT** `assets/app-v5.js` — add 2 links + i18n keys (vi/en) |
| 6 | Legacy 301 redirects | `02_...`, `09_DEV...` | only `/ndnum`, `/dream-nurture.html` | **EDIT** `_redirects` — add 6 rules |
| 7 | `sitemap.xml` story + mentor | `10_SEO...` | only `/dream-nurture` | **EDIT** — add 2 `<url>` blocks |
| 8 | Deploy + smoke test | `11_FINAL...` | not done | **RUN** after 1–7 |

**Routing facts (verified, do NOT regress):**
- Cloudflare Pages auto-serves `foo.html` at clean URL `/foo`. **Never** add a `200` rewrite for a static `.html` that resolves to its own clean URL — it causes infinite loops.
- `_routes.json` already excludes `/club`, `/club/*`, `/account`, `/account/*` from Functions. New root pages (`/story-library`, `/mentor-network`) need **no** `_routes.json` change.
- New pages are root-level static HTML, same as `dream-nurture.html`. No Functions involved.

**Canonical template:** `story-library.html` is the reference pattern — self-contained
HTML, `<link rel="stylesheet" href="/app.css">`, inline `<style>` block with the
DSTS token vars, site chrome mounted via `assets/app-v5.js`, JSON-LD, hreflang vi/en.
Build `mentor-network.html` to match this structure exactly.

---

## B. TASK 1 — Create `mentor-network.html` (Asset #2)

**Content source:** `docs/DSTS_THREE_EVERGREEN_ASSETS_WEB_LAUNCH_PACK_2026/05_ARTICLE_02_VERIFIED_MENTOR_NETWORK.md` (full content, top to bottom). If dev model cannot access this path, use the Launch Pack ZIP or the docs folder directly.

**Head / SEO (from `10_SEO_META_SCHEMA_AND_INTERNAL_LINKING.md`):**
- `<title>`: `Mạng Lưới Mentor Và Người Thành Công Đã Xác Thực | Đường Sao Tỏa Sáng`
- `<meta name="description">`: mentor network = verified adults/successful people who guide the Vietnamese community; clear verification standards; group + adult (18+) formats only in the initial phase.
- `<link rel="canonical" href="https://duongsaotoasang.com/mentor-network">`
- hreflang vi + `?lang=en`, OG + Twitter cards, `og:image` = `/og.png`.
- JSON-LD `@type: "CollectionPage"` (mirror story-library), `name` = "Mạng Lưới Mentor Đã Xác Thực", `alternateName` = "Verified Mentor Network".

**Required content sections (Vietnamese, logically consistent with article):**
1. Hero — H1 + lead defining the mentor network as a *verified* network, not an open marketplace.
2. Triết lý — vì sao mentor phải được xác thực (trust-first).
3. Tiêu chuẩn mentor DSTS — verification criteria.
4. Các nhóm mentor (categories) — business, art, academic, community, etc.
5. Mô hình triển khai an toàn — **adults / 18+ only** initially; group mentoring; NO 1:1 child matching.
6. Giá trị (business value) — Mentor Circle formats for adults (link conceptually to `07_BUSINESS_PRODUCTS...`).
7. FAQ.
8. Cross-pillar links block (see Task 5 shared component).

**MANDATORY legal safety block (from `09_DEV...` + `08_CHILD_AND_FAMILY...`):**
Render a visible notice card stating:
> Trong giai đoạn hiện tại, mạng lưới mentor chỉ áp dụng cho **người trưởng thành (18+)** và theo
> hình thức nhóm. DSTS **không** thực hiện ghép mentor 1:1 cho trẻ em. Mọi hoạt động liên quan đến
> trẻ em sẽ chỉ mở sau khi hoàn tất các cổng an toàn (Child Safety Officer + Legal Counsel).

**Acceptance:** page renders at `/mentor-network`, chrome + footer mount, legal block visible, no child-intake CTA, no Star-Points-as-money language.

---

## C. TASK 2 — Verify `story-library.html`

Confirm (edit only if missing):
- Legal safety copy block present (verification standard; consent; no exploitation of children).
- Cross-pillar links block present (Task 5).
- No child-intake CTA.

---

## D. TASK 3 — Edit `dream-nurture.html`

Add the shared **cross-pillar links block** (Task 5) near the page end, before footer.
Do not alter existing guardian-first / child-safety-first copy.

---

## E. TASK 4 — Homepage `index.html` (3-pillar links)

**Location:** vision-links section, after the `/dream-nurture` anchor (currently `v11`, ~line 988–991).

Add two anchors mirroring the existing pattern:
```html
<a class="vision-link" href="/story-library">
  <b id="v12t">Thư viện câu chuyện</b>
  <span id="v12d">Bộ nhớ sống của người Việt toàn cầu — bài viết, phỏng vấn, audio, video và hồ sơ di sản, có chuẩn xác thực rõ ràng.</span>
</a>
<a class="vision-link" href="/mentor-network">
  <b id="v13t">Mạng lưới mentor</b>
  <span id="v13d">Mạng lưới mentor và người thành công đã xác thực, đồng hành cùng cộng đồng theo hình thức nhóm và dành cho người trưởng thành (18+) trong giai đoạn đầu.</span>
</a>
```

**i18n — add to BOTH language objects** (vi ~line 1291, en ~line 1421):
- vi: `v12t`/`v12d` (above), `v13t`/`v13d` (above).
- en: `v12t`: "Story Library" / `v12d`: "A living memory of global Vietnamese people…"; `v13t`: "Mentor Network" / `v13d`: "A verified network of mentors and accomplished people, group-format and adults-only (18+) in the initial phase."

**i18n key registry:** add `"v12t","v12d","v13t","v13d"` to the keys array at ~line 1532 (the list currently ending `…"v10t","v10d"`). Without this the language toggle won't update the new nodes.

---

## F. TASK 5 — Nav in `assets/app-v5.js` + shared cross-pillar block

**Nav (mountSiteChrome):**
- Add i18n keys to `t.vi`: `stories: "Câu chuyện"`, `mentors: "Mentor"`.
- Add to `t.en`: `stories: "Stories"`, `mentors: "Mentors"`.
- Add two `<a>` entries in the `site-menu` markup linking to `/story-library` and `/mentor-network`, placed logically near `program`/`posts`.

**Cross-pillar links block (reused on all 3 asset pages):** a small section linking the
three pillars to each other (Story ⇄ Mentor ⇄ Dream Nurture) so each page reinforces
the legacy loop described in `01_MASTER_STRATEGIC_BLUEPRINT.md`. Each link must point to
a real, live route.

---

## G. TASK 6 — `_redirects` (append, do NOT add 200 self-loops)

Add **7** **301** legacy redirects (clean URL targets). **CRITICAL:** do NOT add any `200` rewrite for `.html` files that resolve to their own clean URL — use only `301` legacy redirects.
```
/stories                          /story-library                   301
/global-vietnamese-stories        /story-library                   301
/story-library.html               /story-library                   301
/mentors                          /mentor-network                  301
/mentor-network.html              /mentor-network                  301
/nuoi-duong-nhung-uoc-mo          /dream-nurture                   301
/dreams                           /dream-nurture                   301
```
(`/dream-nurture.html` and `/ndnum` already redirect — leave as-is.)

---

## H. TASK 7 — `sitemap.xml`

Add two `<url>` blocks (priority `0.8`, mirror the existing `/dream-nurture` entry):
```xml
<url><loc>https://duongsaotoasang.com/story-library</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://duongsaotoasang.com/mentor-network</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
```

---

## I. TASK 8 — Deploy & smoke test

```bash
# from repo root
npx wrangler pages deploy . --project-name=duongsaotoasang-com
```
Verify (expect 200 final, no loop):
```bash
for u in / /story-library /mentor-network /dream-nurture \
         /stories /mentors /nuoi-duong-nhung-uoc-mo /dreams \
         /story-library.html /mentor-network.html; do
  echo "== $u =="; curl -sI -L "https://duongsaotoasang.com$u" | grep -E "HTTP|location"
done
```
- `/story-library`, `/mentor-network`, `/dream-nurture` → `200`.
- legacy paths → `301` then `200`.
- `.html` → `301` to clean URL then `200`.

---

## J. Acceptance criteria (gate — from `11_FINAL_FOUNDER_REVIEW_CHECKLIST.md`)
- [ ] All 3 pillar pages live, chrome + footer mount, mobile-clean (320–430px).
- [ ] Homepage links to all 3 pillars; language toggle updates new nodes.
- [ ] Nav shows Câu chuyện + Mentor in both languages.
- [ ] Each asset page has the mandatory legal safety block.
- [ ] NO child intake / child profile / child payment / 1:1 child mentor matching anywhere.
- [ ] NO Star-Points-as-money or cash-out language.
- [ ] Redirects + sitemap updated; no redirect loops.

## K. Forbidden (hard constraints)
- No scope beyond the 8 tasks above.
- No `200` rewrite in `_redirects` for a static page at its own clean URL.
- No opening of child intake / profile / payment / child mentor matching in this phase.
- No Star Points as money / cash-out.
