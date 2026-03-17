# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js on localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured yet.

## Architecture

This is a **Next.js 16 / React 19** site for Café Reyna, a Honduran specialty coffee brand. It uses **Tailwind CSS v4**, TypeScript, and the React Compiler (`reactCompiler: true` in `next.config.ts`).

### Pages

- `src/app/page.tsx` — Homepage. All sections are rendered inline (no sub-components except `ParallaxHero`). Section order: Header, How Our Coffee Works, Current Coffee (batch cards — placeholder), Washed vs Honey, Roast & Grind, Bulk Orders, Why Café Reyna, Final CTA, Footer.
- `src/app/coffee/[batchId]/page.tsx` — Batch detail / "Build Your Bag" page. Receives `batchId` from the URL. Two-column layout: origin block + grind/quantity selectors (left), sticky order summary panel (right). Currently uses placeholder data.

### Components

- `src/app/components/ParallaxHero.tsx` — Client component. Multi-layer scroll-driven parallax using 6 PNG layers (`/hero image layer 0 (base).png` through `layer 5A.png`). A `useSectionScrollProgress` hook tracks scroll position within a tall (`h-[260vh]`) sticky container. Logo fades out and a CTA card fades in on scroll. Motion is pure `translateY` interpolation + `requestAnimationFrame`—no animation library.

### Styling

- `globals.css` uses **Tailwind v4** (`@import "tailwindcss"`) with `@theme inline` for CSS variable tokens.
- Headings use **Copperplate** (`font-family: "copperplate"`) loaded from Adobe Fonts via Typekit (`zgl0jvg.css` in `layout.tsx`). Body uses Geist Sans/Mono via `next/font/google`.
- Custom animation: `animate-bean-pulse` (defined in `globals.css`) — used on the hero scroll-down arrow.
- Core color palette: warm paper `#f4ede4` background, coffee-brown `#6b3e26` for primary CTAs, muted border `#e3d7c5`, body text `#2a2a2a` / `#4a4037`.

### Business & Data Model

The spec files in the repo root are key references for planned implementation:

- `content-architecture-spec.md` — Full section spec, freshness pricing model, batch card wireframe, component map, and data model shapes.
- `cafe_reyna_homepage_ui_spec.md` — Visual/CSS implementation guide per section.
- `cafe_reyna_shopify_mapping.md` — Commerce architecture spec.

Customers purchase **Roast Batches**, choosing only grind type and quantity. The supply chain hierarchy is:

```
Farmer → Farm → Lot → RoastBatch → 12oz Retail Bags
```

**Freshness-based pricing** (computed from `roast_date`):
- 0–14 days: base price
- 14–28 days: 20% off
- 28–56 days: 50% off
- 56+ days: hidden/removed

**Commerce split:** Shopify owns Customer, Order, Cart, Checkout, Payment. The custom app owns the Farmer → Farm → Lot → RoastBatch traceability hierarchy. Shopify variants map back to internal `RoastBatch` records via a `RoastBatchVariantMap` table (one Shopify product per RoastBatch, one Shopify variant per grind type). Pricing is controlled by the custom app and pushed to Shopify based on roast age.
