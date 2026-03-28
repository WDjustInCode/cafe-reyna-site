# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js on localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 16.1.6 / React 19.2.3** with React Compiler (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** — uses `@import "tailwindcss"` in globals.css, not the v3 config plugin
- **TypeScript 5** with strict mode; path alias `@/*` → `./src/*`
- **No animation library** — motion is pure `requestAnimationFrame` / CSS transforms

---

## Architecture

Café Reyna is a Honduran specialty coffee brand. Customers buy **Roast Batches**, choosing only grind type and quantity. The supply chain hierarchy is:

```
Farmer → Farm → Lot → RoastBatch → 12oz Retail Bags
```

**Commerce split:** Shopify owns Customer, Order, Cart, Checkout, Payment. The custom app owns the Farmer → Farm → Lot → RoastBatch traceability hierarchy. Shopify variants map to internal `RoastBatch` records via a `RoastBatchVariantMap` table (one Shopify product per RoastBatch, one Shopify variant per grind type). Pricing is controlled by the custom app and pushed to Shopify based on roast age.

---

## Pages

### `src/app/page.tsx` — Homepage (Server Component)
Wraps everything in `BatchCountProvider`. Section render order:
1. `StickyHeader`
2. `ParallaxHero`
3. How We Operate (inline — 4 step icons with labels)
4. `BatchGrid` (wrapped in Suspense with `BatchGridSkeleton` fallback) — "Our Coffee" section
5. `OurFarmers` (wrapped in Suspense with null fallback)
6. `HondurasRegions` (wrapped in Suspense with null fallback)
7. `HonduranVarietals` (wrapped in Suspense with null fallback)
8. Process comparison — `ProcessCard` trio (Washed, Honey, Natural)
9. `RoastGrindSelector`
10. `WhyReyna`
11. Final CTA (inline)
12. Footer (inline)

### `src/app/coffee/[batchId]/page.tsx` — Batch Detail / "Build Your Bag" (Server Component)
Fetches batch by ID via `fetchBatchById`; returns 404 if not found. Computes freshness state, badge label, discounted price, and roast date string server-side, then passes all as props to `BatchBuilderClient`. Header row includes logo link and `CartButton`.

### `src/app/farmers/[farmerId]/page.tsx` — Farmer Profile (Server Component)
Fetches `fetchFarmerPageData()` and finds the farmer by ID. Displays farmer portrait, story, farms, and lots with an awards table. Uses inline sub-components: `AwardsTable`, `LotCard`, `FarmSection`. Generates metadata dynamically. Header uses real `CartButton` + `HamburgerMenu` (was a placeholder button before).

---

## Components

### Client Components

**`ParallaxHero.tsx`** — Multi-layer scroll-driven parallax.
- Custom hook `useSectionScrollProgress()` returns `{ containerRef, progress: 0–1 }` by tracking scroll within the `h-[260vh]` sticky container.
- Utility `smoothScrollTo(targetTop, durationMs)` uses ease-out RAF animation.
- `ParallaxLayer` sub-component takes `from/to` translateY values and interpolates from `progress`.
- 6 layers (sky is static; layers 1–5 stagger `from` values from 680–2160px).
- `landscapeProgress` clamps `progress` to 0.15–0.85 range for slower motion.
- Logo fades out + slides up during progress 0–0.4; CTA card fades in during 0.55–1.0.
- Background: `#b4d7ff`. Container: `h-[260vh]` outer + `sticky top-0 h-screen` inner.
- Hero layer assets: `/hero image layer 0 (base).png` through `layer 5A.png` in `/public`.

**`StickyHeader.tsx`** — Fixed header that only appears when scrolling **upward** past the hero (260vh). Uses passive scroll + resize listeners. Shows logo, nav links, cart button, and `HamburgerMenu` (mobile only).

**`HamburgerMenu.tsx`** — Mobile-only (`md:hidden`) animated hamburger nav. Accepts optional `basePath` prop (default `''`) to prefix anchor hrefs (use `"/"` on non-homepage pages). Three-bar icon animates to ✕ on open. Dropdown slides in via `max-height` transition with `bg-[#f4ede4]/95` + backdrop blur. Links: Our Coffee, How It Works, Bulk Orders, Why Café Reyna.

**`BatchGridClient.tsx`** — All batch filtering and sorting logic.
- URL-synced filters (shareable): `process`, `region`, `roast`, `varietal` via searchParams.
- Local-only filters (sessionStorage): `farm`, `lot`, `notes`, `dateSort`.
- Inline `SelectFilter` sub-component for dynamically sized dropdowns.
- Updates `filteredCount` via `useBatchCount` context on filter change.
- Region values with diacritics (e.g. "El Paraíso") are matched case-insensitively via `stripDiacritics`.

**`RoastGrindSelector.tsx`** — Homepage roast + grind selector. Roast (Medium/Dark) updates URL; grind stored in sessionStorage under key `cafe-reyna-grind`. 2×2 visual toggle grid.

**`GrindSelectorGrid.tsx`** — Grind-only selector on batch detail page. 6 options in 3-col grid. Persists selection to sessionStorage (`cafe-reyna-grind`).

**`ProcessCard.tsx`** — Card button for process comparison (Washed / Honey / Natural). Large image with gradient overlay, selection badge, inventory lbs display. Clicking updates `process` URL param.

**`HondurasRegions.tsx`** — 6 region cards (Copán, Montecillos, Opalaca, Comayagua, El Paraíso, Agalta). Each has name, bean icon, elevation, flavor profile, description, inventory lbs. Region cards update `region` URL filter. Includes `honduras-regions.svg` map.

**`HonduranVarietals.tsx`** — Full-width dark section with responsive background images. Mobile (< 768px): `varietal.jpg`; desktop (768px+): `varietal-bg.jpg`. Implemented via two absolutely-positioned `div`s toggled with `block md:hidden` / `hidden md:block`. 8 varietals (Catuai, Bourbon, Caturra, Lempira, IHCAFE 90, Pacas, Typica, Parainema). Each shows name, description, common regions, flavor expressions, inventory lbs. Clicking updates `varietal` URL filter.

**`ShopCTAButton.tsx`** — Reads `filteredCount` from `useBatchCount`. Shows "Build Your Bag" if count is 1, otherwise "Shop current coffee". Links to `#our-coffee`.

**`BatchCountContext.tsx`** — Context + provider + hook.
- `BatchCountProvider`: wraps page, holds `filteredCount` state, initialized with total batch count.
- `useBatchCount()`: returns `{ filteredCount, setFilteredCount }`.

**`CartContext.tsx`** — Shopify cart state provider.
- `CartProvider`: wraps root layout; persists `cartId` to localStorage (`cafe-reyna-cart`). On mount, rehydrates from localStorage via `getCart`.
- `CartLine` interface: `{ lineId, variantId, quantity, batchCode, grindType }`.
- `useCart()`: returns `{ itemCount, isLoading, isCartOpen, cartLines, variantQuantities, openCart, closeCart, addItem, updateItem, removeItem, checkout }`.
- `CartButton`: pill button with item count badge (capped at "9+"). Opens the cart drawer.
- `variantQuantities`: `Record<variantId, totalQuantity>` — used by `BatchBuilderClient` to track per-variant cart totals for stock-limit enforcement.

**`CartDrawer.tsx`** — Slide-in cart panel (right side, fixed, z-50). Locks body scroll when open. Shows line items with inline quantity steppers (decrement to 1 removes the line, ✕ icon at qty 1). Footer shows total bag count and Checkout button that redirects to Shopify checkout URL.

**`BatchBuilderClient.tsx`** — Client component for the batch detail two-column layout.
- Props: `batch`, `daysOld`, `freshnessState`, `badgeLabel`, `discountedPrice`, `isDiscounted`, `roastDateFormatted` (all computed server-side).
- Left column: origin block, `GrindSelectorGrid`, quantity stepper, roast batch info panel.
- Right column: order summary aside with live quantity × price calculation and Add to Cart button.
- Stock enforcement: `stockMax = floor(remainingWeightLb / 0.75)`. Compares against `variantQuantities` from cart to prevent over-adding. Shows "Max quantity in cart" or "Coming Soon" (when `shopifyVariantId` is null) states.
- Reads grind from sessionStorage on add-to-cart.

### Server Components

**`BatchGrid.tsx`** — Async server component. Accepts prefetched batches or fetches them. Handles error/empty states. Delegates rendering to `BatchGridClient`.

**`BatchCard.tsx`** — Single batch card.
- Inline `FreshnessMeter` sub-function (10-segment progress bar).
- Inline `MetaCell` sub-component for metadata display with icons.
- Header identity block: farm name (h3) → Batch `{batchCode}` in Geist Mono → Region `{origin}`.
- MetaCell grid: Lot (`farm-lot.svg`), Process, Varietal, Roast, Roast Date, Elevation.
- Farm images `farm1.jpg`–`farm6.jpg` map to farm IDs 1–6.
- Farms 4 and 5 use `scale-[1.15]` base zoom to compensate for white borders.
- Hover: `translateY(-4px)` + border color shift.

**`BatchGridSkeleton.tsx`** — Suspense fallback. 3 pulse-animated skeleton cards. Inline `SkeletonCard` sub-component.

**`OurFarmers.tsx`** — Fetches farmers from API. Grid of farmer cards (3 cols desktop). Full-bleed `aspect-[3/4]` portrait cards with gradient overlay (`from-black/70 via-black/30 to-black/10`); name, location, and story snippet are overlaid at bottom. Hover scales image and deepens overlay. Farmer images `farmer1.jpg`–`farmer3.jpg`. Links to `/farmers/[farmerId]`.

**`WhyReyna.tsx`** — 4-column benefit cards: Origin-focused, Fresh roast batches, Traceable lots, Brew-method aware. Each with icon + title + description.

---

## Data & API

### `src/app/lib/types.ts` — Interfaces

```ts
ApiFarm       { id, name, region?, elevation_m, farmer_id }
ApiAward      { title, place_or_score, description? }
ApiLot        { id, farm_id, lot_code, process, varietal, arrival_date, notes[], awards? }
ApiRoastBatch { id, lot_id, location_id, batch_code, roast_level, roast_date (Unix secs),
                roasted_weight_lb, remaining_roasted_weight_lb, note, basePrice, status,
                created_at, shopify_variant_id? }
ApiFarmer     { id, name, region?, country?, story?, photo-url?, created-at? }

// View models
BatchCardViewModel    { batchId, batchCode, farmId, farmName, lotCode, origin, process, varietal,
                        roastLevel, roastDate, notes[], basePrice, remainingWeightLb, elevation|null,
                        shopifyVariantId: string|null }
FarmerPageViewModel   { farmerId, farmerName, location, story|null, hasPortrait, portraitSrc|null, farms[] }
FarmSectionViewModel  { farmId, farmName, region|null, elevationM|null, lots[] }
LotCardViewModel      { lotId, lotCode, varietal, process, awards, hasAwards }

// Type aliases
FreshnessState = 'fresh' | 'value' | 'clearance'
StockStatus    = 'low' | 'selling-fast' | 'available'
```

### `src/app/lib/freshness.ts` — Pure freshness utilities

- `getDaysOld(roastDateIso)` — days between roast date and today (midnight-adjusted)
- `isVisible(daysOld)` — true if daysOld < 56
- `getFilledSegments(daysOld)` — 0–10 segments for the freshness meter
- `getFreshnessState(daysOld)` → `'fresh' | 'value' | 'clearance'`
- `getFreshnessBadgeLabel(state)` → `"Fresh Roast"` / `"Great Value · 10% Off"` / `"Roast Clearance · 40% Off"`
- `getStockStatus(remainingLb)` → `'low' | 'selling-fast' | 'available'`
- `getDiscountedPrice(basePrice, daysOld)` → full / 90% / 70% of base

### Freshness pricing

| Days since roast | Badge label | Price |
|---|---|---|
| 0–14 | Fresh Roast | 100% |
| 14–28 | Great Value · 10% Off | 90% |
| 28–56 | Roast Clearance · 40% Off | 70% |
| 56+ | Hidden / removed | — |

> Note: The spec files say "20% off" and "50% off" but the **actual code** uses 10% and 30% discounts (90% and 70% of base price).

### `src/app/lib/shopify.ts` — Shopify Storefront API

Uses `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` env vars. API version: `2025-01`. All cart mutations attach `Grind Preference` and `Batch Code` as line item attributes.

Exports:
- `ShopifyCart` interface
- `createCartWithItem(variantId, quantity, grindType, batchCode)` — `cartCreate` mutation
- `addCartItem(cartId, variantId, quantity, grindType, batchCode)` — `cartLinesAdd` mutation
- `updateCartItem(cartId, lineId, quantity)` — `cartLinesUpdate` mutation
- `removeCartItem(cartId, lineId)` — `cartLinesRemove` mutation
- `getCart(cartId)` — `cart` query, returns `ShopifyCart | null`

### `src/app/lib/api.ts` — Data fetching

**MockAPI.io base URL:** `https://69b80a0effbcd02860970059.mockapi.io`
- Endpoints: `/farm`, `/lot`, `/roastBatch`, `/farmers`
- `roast_date` is a **Unix timestamp in seconds** — multiply by 1000 before `new Date()`
- `basePrice` is camelCase on `ApiRoastBatch`

Exports:
- `fetchJson<T>(url)` — generic fetch with error handling
- `fetchFarmers()` — ISR 300s
- `fetchFarmerPageData()` — builds `FarmerPageViewModel[]`, ISR 300s
- `fetchProcessInventory()` — `Record<string, number>` (lbs by process), ISR 300s
- `fetchVarietalInventory()` — `Record<string, number>` (lbs by varietal), ISR 300s
- `fetchRegionInventory()` — `Record<string, number>` (lbs by region, joins farm+lot), ISR 300s
- `fetchAllBatchViewModels()` — joins farm+lot+batch, filters 56+ day old & zero inventory, sorts `roast_date DESC`, **no ISR** (cache: 'no-store')
- `fetchBatchById(batchId)` — returns `BatchCardViewModel | null`

---

## Styling

- **Tailwind v4** — `@import "tailwindcss"` at top of `globals.css`; do NOT use v3 plugin syntax
- **Headings (h1–h6)** — Copperplate, uppercase, 500 weight, `#6a4322` brown, line-height 1.05
- **Body** — Geist Sans (next/font/google); Geist Mono for batch codes
- **Adobe Typekit** — Copperplate loaded via `zgl0jvg.css` in `layout.tsx`
- **Custom animations** — `animate-bean-pulse` (keyframes in globals.css): opacity + scale, 2s infinite; used on hero scroll-down arrow. `hero-card-enter` (keyframes in globals.css): fade + translateY(20px→0), 0.6s ease-out with 0.15s delay; applied via `.hero-card-enter` class
- **Hex colors in className** — extensive use of `bg-[#f4ede4]`, `text-[#6b3e26]`, etc.

### Color palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#f4ede4` | Page background (warm paper) |
| Primary CTA | `#6b3e26` | Buttons, CTAs |
| Primary CTA hover | `#56311f` | Button hover state |
| Heading | `#6a4322` | h1–h6 text |
| Body text | `#2a2a2a` | Primary text |
| Secondary text | `#4a4037` | Subheadings, labels |
| Label text | `#7a6a5a` | Muted metadata |
| Border | `#e3d7c5` | Card / section borders |
| Fresh badge | bg `#e8f5e9` / text `#2e7d32` | 0–14d |
| Value badge | bg `#fff8e1` / text `#f57c00` | 14–28d |
| Clearance badge | bg `#f5f0eb` / text `#7a6a5a` | 28–56d |

---

## Public Assets

### Hero layers (7 PNG)
`/hero image layer 0 (base).png` through `layer 5A.png`

### Farm images (6 JPG)
`farm1.jpg`–`farm6.jpg` — map to farm IDs 1–6 in `BatchCard`. Farms 4 & 5 use `scale-[1.15]` to compensate for white borders.

### Farmer portraits (3 JPG)
`farmer1.jpg`–`farmer3.jpg` — used in `OurFarmers` and farmer profile page

### Region SVGs (6)
`copan.svg`, `montecillos.svg`, `Opalaca.svg`, `comayagua.svg`, `el paraiso.svg`, `agalta.svg`

### Process images (3 JPEG)
`wash-process.jpeg`, `honey-process.jpeg`, `natrural-process.jpeg`

### Mobile images
`mobile-hero.jpg` — hero background for mobile viewports
`varietal.jpg` — varietals section background for mobile (< 768px)
`mobile-varietal-bg.jpg` — alternate mobile varietal bg (not currently used)

### Other SVGs
`honduras-regions.svg` (map), `varietal-bg.jpg` (varietals section background, desktop 768px+), `calendar.svg`, `elevation.svg`, `process.svg`, `roast.svg`, `coffee-plant.svg`, `coffee-plant-grid.svg`, `origin_1.svg`, `fresh_1.svg`, `trace_1.svg`, `drip_1.svg`, `farm-lot.svg` (lot icon in BatchCard metadata grid)

### Reference PNGs
`locationResource.png`, `roastbatchresource.png` — spec/design references only

---

## State Management

| State | Mechanism | Scope |
|---|---|---|
| Filtered batch count | `BatchCountContext` (React context) | Page-wide |
| Cart | `CartContext` (React context) + localStorage (`cafe-reyna-cart`) | App-wide / persistent |
| Grind selection | sessionStorage (`cafe-reyna-grind`) | Session |
| URL filters (process, region, roast, varietal) | URL searchParams | Shareable |
| Local filters (farm, lot, notes, dateSort) | sessionStorage in `BatchGridClient` | Session |

`BatchCountProvider` wraps the entire homepage. `BatchGridClient` calls `setFilteredCount` after every filter change. `ShopCTAButton` reads `filteredCount` to customize its label.

`CartProvider` wraps the root layout (`layout.tsx`) so cart state is available on all pages. `CartDrawer` is also rendered at root level. Cart ID is persisted to localStorage; on mount `CartProvider` rehydrates from Shopify via `getCart`.

---

## Spec Files (root)

- `content-architecture-spec.md` — Full section spec, freshness model, batch card wireframe, component map, data model shapes
- `cafe_reyna_homepage_ui_spec.md` — Visual/CSS guide per section (color codes, spacing, typography)
- `cafe_reyna_shopify_mapping.md` — Commerce architecture and Shopify integration plan
- `cafe_reyna_honduras_region_section_final_design.md` — Region section final design reference
- `honduran-varietals-section-option-a.md` — Varietals section design option

> The spec files are the source of truth for **planned** behavior. Where the code differs (e.g. freshness discount percentages), trust the code.

---

## Not Yet Implemented

- Checkout flow and payment (cart exists; checkout redirects to Shopify via `checkoutUrl`)
- Customer authentication
- Bulk orders section (referenced in spec)
- `RoastBatchVariantMap` table for Shopify variant mapping (currently `shopify_variant_id` stored directly on `ApiRoastBatch`)
- Farmer CMS / content management
- Pricing display in CartDrawer (Shopify price data not yet fetched into cart lines)
