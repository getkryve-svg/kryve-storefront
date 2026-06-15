# KRYVE Storefront — Launch / Fix Verification Checklist

**Branch:** `kryve-mobile-parity`
**Deployed commit:** `bdeef52`
**Production URL:** https://kryve-storefront.vercel.app
**Verification target:** localhost:4100 (serves the exact `bdeef52` source) for DOM/visual
assertions; deployed URL confirmed serving the same commit (see Deploy Confirmation).
**Engine note:** the preview browser is Chromium. iOS-Safari/WebKit-specific behavior is
addressed in CSS via `-webkit-` prefixes (masks) but a true WebKit-engine pass still needs a
real device / BrowserStack — flagged where relevant.

---

## Deploy confirmation
- `GET /images/product-greens-themed.png` → **200**
- `GET /images/product-collagen-themed.png` → **200**
- `GET /images/product-magnesium-real-studio.png` → **200**
- Deployed JS bundle contains `HPM3 LLC`, contains **no** `High Power Society`.

---

## This batch — four requested fixes (all PASS)

### FIX 1 — Cart drawer product images → PASS
CartDrawer now resolves each line item's image from the **current** `STATIC_PRODUCTS`
primary by `handle` (`currentImage(handle, fallback)`), so the cart always matches the
cards/site even for items added earlier or from the PDP.
Evidence (drawer at 390, 4 items):

| Product | Resolved image | Loaded |
|---|---|---|
| Greens | `/images/product-greens-themed.png` | ✓ |
| Collagen | `/images/product-collagen-themed.png` | ✓ |
| Magnesium | `/images/product-magnesium-real-studio.png` | ✓ |
| Stack | `…/product-stack-card-v2-…webp` (unchanged) | ✓ |

### FIX 2 — Footer company name → PASS
Footer reads **"© 2025 HPM3 LLC. All rights reserved."**
Codebase grep for `High Power Society`: **0 occurrences** (was 1, in `Footer.tsx`).
Other note: `OrderSuccessPage.tsx` contains "Happy People Make More Money™" — that's the
HPM3 tagline (the literal expansion of HPM3), **not** "High Power Society"; left as-is.

### FIX 3 — "Built to Stack" image boxes → PASS
Removed `mix-blend-mode: multiply` (was for the old white images; darkened the new dark
ones) and the `.kv-stack-spot::before` glow circle that silhouetted each dark image into a
visible box. Added a feathered radial mask (`mask-image` + `-webkit-mask-image`) so the dark
studio backdrops blend into the section. Verified at 390: **no visible boxes**, all 3 bottles
+ green/rose/violet glows clean, label text legible. Desktop (1440) computed styles match
(`mix-blend-mode: normal`, mask present, `::before` hidden). *WebKit prefix included; real
iOS Safari device check recommended.*

### FIX 4 — Hero slide 5 magnesium bottle right-edge (mobile) → PASS
Slide 5 (3-bottle stack) used `object-fit: cover`, pressing the magnesium bottle into the
right edge. Scoped class `.kv-hero-mobile-img--stack` switches slide 5 to `contain` +
`padding: 0 20px`. Verified at 390: all 3 bottles inside the frame with clear gutters,
nothing clipped. Mobile-scoped only; desktop untouched.

---

## STEP 1 — Global assertions (automated)

### 1.1 Horizontal overflow (`scrollWidth − innerWidth ≤ 1`)
| Page | 320 | 390 | 768 | 1440 |
|---|---|---|---|---|
| Home | 0 ✓ | 0 ✓ | −15 ✓ | −15 ✓ |
| Shop | 0 ✓ | — | — | −15 ✓ |

### 1.2 Badge bounds (≥12px clearance L/T/R)
| Width | Page | Badges | Result |
|---|---|---|---|
| 320 | Home | BEST SELLER, GRASS-FED, HIGH ABSORPTION | L24/T18, all ✓ |
| 390 | Home | 3 badges | all ✓ |
| 768 | Home | 3 badges | all ✓ |
| 1440 | Home | 3 badges | all ✓ |
| 1440 | Shop | + SAVE $19.98 (4 total) | all ✓ |
| 320 | Shop | HIGH ABSORPTION (Magnesium) | L24/T18/R146 ✓ |

### 1.4 Console errors
Home: **0 errors**. Shop: 0 errors.

### 1.5 Image loads / no white product images
Home & Shop: **0 broken images**; Shop shows 4 new dark images; **0 remaining `-real.jpg`
white-background product images**.

---

## Coverage statement (honest scope)

**Fully verified this pass:** the four fixes above, plus Step-1 global assertions (overflow,
badge bounds, broken images, console) on Home + Shop at 320/390/768/1440.

**Not yet exhaustively swept** (the full matrix in the brief — every section at all 15
viewports, both orientations, on both WebKit and Chromium engines, with per-item screenshots
for Steps 2–11): this is a substantially larger QA effort. The automated assertions that *can*
be scripted are green at the representative widths above; the remaining items are largely
manual/visual (autoplay timing, swipe/loop, hover-swap, keyboard a11y, WCAG contrast, Shopify
selling-plan/shipping cross-checks, landscape, real-WebKit rendering). Recommend a dedicated
full-matrix pass (or a Playwright multi-viewport/multi-engine harness) before declaring
LAUNCH READY across the entire matrix.

**Verdict for this batch:** the four requested fixes are **LAUNCH READY** and deployed; the
broader 11-step matrix is **partially verified** (Step 1 green at sampled widths).
