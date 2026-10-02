# aiSTART Design System — MASTER

Single source of truth for the aiSTART website (`index.html` + `css/styles.css` + `js/main.js`).
All tokens live in the `:root` block titled **"aiSTART DESIGN SYSTEM — tokens"** at the top of the first `<style>`. Shared components live in the last block, **"DESIGN SYSTEM — shared components"**. New pages should use these and nothing else.

## 1. Colour

| Role | Token | Value | Use |
|---|---|---|---|
| Primary | `--teal` | #008080 | Buttons, links, active states, key icons |
| Primary (dark) | `--teal-dk` | #006B6B | Text on teal tint, hover |
| Primary | `--navy` | #1A3847 | Headings, body ink, dark panels |
| Primary (deep) | `--deep` | #10222C | Text on orange |
| Secondary | `--orange` | #F49E58 | Accents only: dots, stars, CTA on dark |
| Secondary | `--terra` | #E86849 | Accents only: highlight bars, shapes |
| Accessible ink | `--orange-ink` / `--terra-ink` | #8A4A1E / #B8452C | Text in orange/terracotta (≥4.5:1) |
| Tints | `--teal-tint` `--navy-tint` `--orange-tint` `--terra-tint` | | Panel backgrounds, icon tiles |
| Neutrals | `--mid` (body-2), `--soft-ink` (meta), `--sand` (soft bg), `--line` (warm rules), `--line-soft` / `--line-cool` (UI rules), `--surface-2/3` | | |

**Rule:** primary colours (teal, navy) carry large surfaces; secondary (orange, terracotta) appear only as small accents.

## 2. Typography

One family: **Plus Jakarta Sans** (400–800).

| Token | Size | Use |
|---|---|---|
| `--fs-display` | clamp(40–68px) | Home hero only |
| `--fs-h1` | clamp(36–56px) | Page heroes |
| `--fs-h2` | clamp(28–42px) | Section headings |
| `--fs-row` | clamp(28–40px) | Headings in image+text rows |
| `--fs-statement` | clamp(22–32px) | Pull statements, mission |
| `--fs-stat` / `--fs-stat-sm` | | Big numbers |
| `--fs-3xl` 28 · `--fs-2xl` 24 · `--fs-xl` 20 · `--fs-lg` 18 | | Card titles, leads |
| `--fs-md` 16 | | Body |
| `--fs-base` 14 · `--fs-sm` 13 · `--fs-xs` 12 | | Secondary text, labels (12px minimum) |

Weights: 800 headings · 700 labels/buttons · 600 UI · 400/500 body. Headings use `text-wrap: balance`.
Exception: text inside product mockups (`.mock`, `.mk-*`) may go to 9–11px because it depicts a UI screenshot.

## 3. Radius

`--r-xs` 8 · `--r-sm` 12 · `--r-md` 16 · `--r-lg` 24 (cards, tiles, mockups) · `--r-xl` 32 (panels, sections) · `--r-pill` 999 (buttons, chips, pills).

## 4. Elevation

`--sh-sm` (hover/lift, chips) · `--sh-md` (floating cards) · `--sh-lg` (hero mockups, featured). Prefer tint + no shadow for in-flow panels.

## 5. Motion

`--ease` (default, gentle) · `--ease-out` (reveals) · `--dur-fast` .2s (colour) · `--dur` .35s (hover lift) · `--dur-slow` .6s (reveals). Everything respects `prefers-reduced-motion`.

## 6. Spacing & layout

`--sp-1…9` = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px. Section padding 72–80px desktop, 56px mobile. Container 1160px.
Breakpoints: **600 · 700 · 800 · 900 · 1000** (+ nav 920/921).

## 7. Components

| Component | Class | Notes |
|---|---|---|
| Label | `.tag` / `.eyebrow` | One style: teal-tint pill, 13px/700. On dark sections: orange. No `#`. |
| Status pill | `.stage` | Orange-tint, 12px/600 — plan tiers, stages |
| Button | `.btn`, `.btn.primary`, `.btn.sm` | Pill, ≥44px tall, arrow chip on primary |
| Hero | `section[id$="-hero"]` | Centered text + wide `.hero-shot` (mockup or photo collage) |
| Image+text row | `.frow` (home) / `.split` (inner) | Media in a tinted panel; alternate sides |
| List item | `.grid > .card` (inner pages) | No box: icon tile + title + text over a thin top rule |
| Tinted panel | `.panel`, `.rollout`, `.dpanel`, `.why` | Tint background, `--r-xl`, no border |
| Icon tile | `.ico`, `.mf-ico`, `.uc-ico`, `.r-ico` | 40–48px, `--r-sm`, tinted, line icon (Lucide-style SVG) |
| Mockup | `.mock` + `.mk-bar` | Illustrative product screen; placeholder data |
| Numbered flow | `.flow6`, `.ro-steps`, `.vsteps`, `.levels` | Icon/number + title + text |
| FAQ | `.acc` | Sand → teal-tint when open, + rotates to × |
| Doc row | `.docrow`, `.ldoc` | File icon + title + reference meta |
| Dark CTA | `.s.dark` | Rounded navy banner, orange primary button |
| Section header | `.sh` + `.hlw` | Centered: pill label, h2 with one highlighted phrase (`<em class="hlw">`), short lead |
| Hero meta line | `.hero-meta` | 2–3 facts with teal/orange/terracotta dots under the hero CTAs |
| Timeline steps | `.tl` (`--n` = steps) | Numbered dots on a dashed line + sand cards with an orange time chip |
| Program cards | `.nc-grid > .nc` | White cards with a "01 — Label" pill on the top edge, icon tile, title, text |
| Benefit grid | `.bn > .bn-grid` (`.three`) | Teal-tint band with white icon + label tiles |
| Use-case cards | `.uc4` | 2×2 large pastel cards (teal, orange, terracotta, navy tints) |
| Impact stats | `.impact` | Big-number cards in sand |
| Intro-call card | `.cc` | Sand panel: text + CTAs left, team card with checklist right |
| Story timeline | `.story-tl` | Year pill on a dashed vertical line + sand milestone card (About) |
| Recognition strip | `.recog` | 3 tinted badges: icon, name, short label |
| Story tags / featured | `.st-tags`, `.st-feat` | Topic chips on news cards; orange "Featured" badge on the cover |
| Newsletter strip | `.nl` + `[data-nl]` | Teal-tint panel, email + Subscribe, inline status message |
| Prompt library | `.pl-grid > .pl-col > .pl-card` | Grouped prompt cards with a Copy button (`.pl-copy`), rules box `.pl-rules` |
| Feature carousel | `[data-fc]` `.fc-groups > .fcg` → `.fc-tabs` → `.fc-slide[data-g]` | 4 group cards (2×2 on mobile) each listing its features; picking a group shows only its feature pills and slides; arrows move through all features; the counter shows position within the group; inactive slides are `inert`; deep links like `#/platform/assessments` open their slide |
| Grade coverflow | `[data-gx]` `.gx-stage > .gx-card` | One large active card in the centre, with the neighbouring cards smaller and faded behind it (after ZoomSphere "functions"). All cards share one palette: a white card with a thin border, a teal-tint art area on top whose placeholder layers animate in when the card becomes active, and a teal stage pill. There is no per-stage colour. Side cards turn sand-coloured and fade. Navigate with the arrows beside the heading, swipe, the arrow keys, clicking a side card, or the grade pills. The active slide is announced in a polite live region. |

## 8. Accessibility baseline

Focus ring on every control (teal, orange on dark) · skip link · touch targets ≥44px · text contrast ≥4.5:1 · decorative SVG `aria-hidden` · mockups `role="img"` with `aria-label` · reduced-motion respected.

## Known debt

The stylesheet still stacks historical "UI LAYER" blocks. They now all read from these tokens, but a future clean-up should merge them into one ordered stylesheet (tokens → base → components → pages) and remove the ~30 remaining `!important`s.

## CTA rule

One primary action across the site: **Book a Demo** (→ `#/demo`). It appears in the hero and in the final dark CTA, and it's the only solid button on a page. Context comes from two things instead of from different labels:
- a supporting line under the final CTA button (`.cta-note`), written for that page;
- `data-focus` on the link (general · curriculum · platform · plans · rollout · training · partnership), which pre-selects "What should we focus on?" in the form. On Pricing, `data-tier` also pre-selects the plan.

Secondary actions are text links (`a.more`). Exceptions, because they lead somewhere different: Log In (Students), Share aiSTART With Your School (Parents, email), Request Our Security & Privacy Pack (Trust, document).

## Demo form

Step 1 has three required fields: work email, school or organization, and role, plus a privacy notice. Context from the clicked CTA (`#focus`, `#plan`) goes in hidden fields and shows as a teal "We'll focus on…" line. Step 2 appears on the success screen and is optional: name, country, number of students, and what to cover. It can be skipped.

## SPA routing and accessibility

On every route change, `route()`:
1. shows the page and updates `document.title` ("Page · aiSTART");
2. moves focus to the page `h1`, or to the deep-link section's first heading (`tabindex="-1"`, no visible ring, `preventScroll`);
3. announces the page name, or "Page, Section", in the `#route-live` polite live region;
4. sets `aria-current="page"` on every header, nav, and footer link that points to the current page.
On first load there is no focus move or announcement unless the URL is a deep link.

## Card system (after the Sept 2026 audit)

Use one style per purpose, and don't add new card styles.
| Purpose | Component | Used on |
|---|---|---|
| A list of points or steps | **Plain card**: sand, `--r-lg`, no shadow; small teal label or number, then title and text (`.hw-grid`, `.nc`, `.bn-grid li`, `.ro-card`) | Platform How it works, Teachers flow, Leaders control, Curriculum included and delivery, Platform setup, Home rollout |
| Audiences and roles | **Sticky notes** (`.uc4.notes`) | Platform Roles, About Why we exist |
| Features with a screenshot | **Feature rows** (`.frow`) / **Get-to-know cards** (`.gtk`) | Home capabilities, Services included |
| One signature interaction per page | Feature row carousel (`[data-fr]`), grade coverflow (`[data-gx]`), expanding panels (`.aud`), file stack (`.xfiles`) | Platform, Curriculum, Home, Services |

Internal notes (`.note`) are hidden on the site. Add `?notes` to the URL to show them for review.
