# Café Reyna Homepage UI Implementation Spec

## Screen-level developer handoff

This spec describes:

-   what each section should visually look like
-   how to compose the layout
-   what the background should be
-   what the foreground elements should be
-   how the section should feel
-   what to avoid
-   how it should adapt responsively

This is written so you can implement it directly in Next.js.

------------------------------------------------------------------------

# 1. Overall page treatment

The homepage should **not** read as white-background ecommerce.\
The site should feel like a **premium coffee brand built from the visual
world of the label**.

## Global page background

Use a warm paper tone as the base background for the whole page.

Recommended page background:

``` css
background: #f4ede4;
color: #2a2a2a;
```

Do not use a pure white page background except for small interior
surfaces if needed.

## Global visual language

Across the page, use these recurring ideas:

-   warm cream/paper background
-   coffee-brown typography
-   muted earthy borders
-   occasional soft color fields drawn from the label
-   section separators that feel organic, not rigid
-   minimal shadows
-   editorial spacing
-   restrained motion

## Avoid

Do not build this like:

-   white background + standard nav + bag image
-   dark luxury coffee site
-   generic Shopify card grid
-   lots of floating shadows
-   hard black UI framing

------------------------------------------------------------------------

# 2. Header

## Visual role

The header should feel quiet and editorial, not app-like.

## Background

Header background should match the page background, but slightly more
opaque/settled if used over a visually rich hero.

Recommended:

``` css
background: rgba(244, 237, 228, 0.9);
backdrop-filter: blur(6px);
border-bottom: 1px solid #e3d7c5;
```

If you do not want blur, use a solid cream header.

## Height

``` css
height: 72px;
```

## Layout

-   logo aligned left
-   nav centered or center-right
-   cart right aligned
-   max content width 1200px
-   24px horizontal page padding

## Typography

Nav text should be understated:

-   15px
-   medium weight
-   normal letter spacing
-   coffee-brown or deep neutral

## Hover behavior

Hover should only slightly darken text or add a subtle
underline/border-bottom.

Do not use loud button-like nav items.

------------------------------------------------------------------------

# 3. Hero section

## Hero purpose

The hero should immediately communicate:

-   origin
-   craft
-   warmth
-   visual connection to the label

The hero should feel like the **bag label has expanded into an
atmospheric brand scene**.

## Hero section background

The hero background should not be plain cream and not plain white.

It should be a **layered composition** with 3 visual layers.

### Layer 1: base background color

``` css
background: #f4ede4;
```

### Layer 2: soft color wash inspired by the label

Add large blurred organic shapes using colors pulled from the label:

-   muted sky blue
-   muted green
-   muted clay red / terracotta
-   soft warm tan

Example implementation:

``` css
.hero-bg-blue {
  position: absolute;
  top: 40px;
  right: 80px;
  width: 420px;
  height: 320px;
  background: rgba(207, 230, 243, 0.5);
  filter: blur(70px);
  border-radius: 999px;
}
```

### Layer 3: subtle paper grain / texture

Add a very light paper texture across the hero background.

Implementation options:

-   low-opacity noise PNG
-   CSS noise overlay
-   extremely subtle repeating texture

Opacity around:

    0.03 – 0.06

------------------------------------------------------------------------

## Hero foreground layout

Desktop grid:

``` css
display: grid;
grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
gap: 64px;
align-items: center;
min-height: calc(100vh - 72px);
padding-top: 56px;
padding-bottom: 72px;
position: relative;
overflow: hidden;
```

The hero should feel generous in height.

------------------------------------------------------------------------

## Left column content

Contains:

-   eyebrow
-   headline
-   supporting paragraph
-   CTA row
-   supporting attributes

### Eyebrow

Example:

    Marcala, Honduras

Style:

-   12--13px uppercase
-   letter spaced
-   muted brown
-   margin-bottom: 16px

### Headline

Example:

    Single-Origin Honduran Coffee from Marcala

Style:

-   48--56px desktop
-   serif
-   line-height: 1.1--1.2
-   deep coffee-brown

### Supporting paragraph

``` css
max-width: 520px;
margin-top: 20px;
font-size: 18px;
line-height: 1.6;
color: #4a4037;
```

### CTA row

``` css
display: flex;
gap: 16px;
margin-top: 32px;
flex-wrap: wrap;
```

Primary + secondary buttons.

### Supporting attributes

Example:

    Washed & Honey Processed • Medium & Dark Roast • Ground for Your Brew Method

Style:

-   14px
-   muted
-   margin-top: 24px

------------------------------------------------------------------------

## Right column

Contains the **product vignette**.

### Main element

Large upright coffee bag with label.

### Background treatment

Behind bag:

-   soft oval shape
-   blurred color wash
-   optional faint oval border

### Bag sizing

Desktop:

    360–420px width

### Shadow

``` css
box-shadow: 0 20px 50px rgba(55, 38, 20, 0.12);
```

------------------------------------------------------------------------

## Hero bottom transition

Use one of:

-   soft gradient fade
-   subtle horizon line
-   gentle shape divider

Avoid hard SVG diagonals.

------------------------------------------------------------------------

## Mobile hero behavior

Stack:

1.  text
2.  bag

Headline:

    32–38px

Supporting text:

    16px

Maintain background atmosphere.

------------------------------------------------------------------------

# 4. How Our Coffee Works

## Visual role

Editorial explanation band.

## Background

Wrap content in a soft paper panel:

``` css
background: rgba(255,255,255,0.25);
border: 1px solid #e7dccd;
border-radius: 12px;
padding: 40px;
```

## Layout

Desktop grid:

``` css
grid-template-columns: repeat(4, 1fr);
gap: 32px;
```

Each step contains:

-   step number
-   title
-   short explanation

------------------------------------------------------------------------

## Freshness pricing display

Visual mini-timeline:

-   Fresh Roast --- 0--14 days --- Base Price
-   Great Value --- 14--28 days --- 20% Off
-   Roast Clearance --- 28--56 days --- 50% Off
-   Removed --- 56+ days

------------------------------------------------------------------------

# 5. Current Coffee Available

Primary shopping section.

## Section intro

Left aligned editorial intro.

``` css
max-width: 640px;
margin-bottom: 40px;
```

## Grid

``` css
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 32px 32px;
align-items: start;
```

------------------------------------------------------------------------

# 6. Batch Card Design

## Card surface

``` css
background: #f8f2e8;
border: 1px solid #e3d7c5;
border-radius: 10px;
padding: 28px;
display: flex;
flex-direction: column;
min-height: 100%;
position: relative;
```

Optional highlight gradient:

``` css
linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0))
```

------------------------------------------------------------------------

## Card structure

Five blocks:

1.  Identity
2.  Metadata
3.  Flavor notes
4.  Freshness block
5.  CTA

CTA aligned bottom using:

    margin-top: auto

------------------------------------------------------------------------

## Freshness meter

Segmented bar:

-   10 segments
-   10--14px width
-   6px height
-   2px gaps

Example structure:

``` jsx
<div className="freshness-block">
  <div className="micro-label">Freshness</div>
  <div className="meter-row">
    <div className="meter">{segments}</div>
    <div className="age">9 days</div>
  </div>
  <div className="badge fresh">Fresh Roast</div>
</div>
```

------------------------------------------------------------------------

## CTA button

Label:

    Build Your Bag

Style:

-   full width
-   coffee brown background
-   white text
-   medium radius

Hover:

-   slight lift
-   darker border

------------------------------------------------------------------------

# 7. Washed vs Honey

Educational comparison section.

## Background

``` css
background: rgba(255,255,255,0.22);
border: 1px solid #e7dccd;
border-radius: 12px;
padding: 40px;
```

## Layout

Two columns:

-   Washed
-   Honey

Optional vertical divider.

Each column:

-   title
-   descriptor
-   3 bullet characteristics

------------------------------------------------------------------------

# 8. Roast + Grind

## Layout

Desktop two-column:

-   left: explanation
-   right: grind grid

## Grind grid

2x3 tiles:

-   Whole Bean
-   Espresso
-   Pour Over
-   Drip
-   French Press
-   Cold Brew

Tiles styled similarly to batch cards but flatter.

------------------------------------------------------------------------

# 9. Bulk Orders

Secondary conversion path.

## Background

Warm tan framed panel.

Two-column layout:

-   left: text
-   right: CTA

------------------------------------------------------------------------

# 10. Why Café Reyna

Trust-building section.

## Layout

Desktop:

``` css
grid-template-columns: repeat(4, 1fr);
gap: 28px;
```

Tablet:

    2 columns

Mobile:

    1 column

Each block:

-   icon or label
-   title
-   short explanation

------------------------------------------------------------------------

# 11. Final CTA

Atmospheric closing invitation.

## Background

-   deeper cream
-   blurred color fields
-   optional horizon detail

## Layout

Center aligned:

-   headline
-   subhead
-   two buttons

Primary:

    Shop Current Coffee

Secondary:

    Meet the Farmers

------------------------------------------------------------------------

# 12. Footer

## Background

``` css
background: #efe5d8;
border-top: 1px solid #e3d7c5;
```

## Layout

Two tiers:

-   brand + nav
-   legal / social

------------------------------------------------------------------------

# 13. Build Your Bag Page

Product editorial layout with buying panel.

------------------------------------------------------------------------

# 14. Builder Page Composition

Two-column desktop layout.

``` css
display: grid;
grid-template-columns: minmax(0, 1fr) 360px;
gap: 56px;
align-items: start;
```

Page background:

``` css
background: #f4ede4;
```

------------------------------------------------------------------------

# 15. Origin Block

Panel styling:

``` css
background: rgba(255,255,255,0.2);
border: 1px solid #e7dccd;
border-radius: 12px;
padding: 32px;
```

Content:

-   farm name
-   lot code
-   origin
-   process
-   roast
-   flavor notes

------------------------------------------------------------------------

# 16. Selection Area

32--40px spacing between groups.

## Grind grid

Desktop:

    3 columns

Mobile:

    2 columns

Tile styling:

``` css
background: #f8f2e8;
border: 1px solid #e3d7c5;
border-radius: 8px;
padding: 16px;
min-height: 88px;
display: flex;
flex-direction: column;
justify-content: center;
```

### Selected state

``` css
border-color: #6b3e26;
background: #f1e8dc;
box-shadow: inset 0 0 0 1px rgba(107,62,38,0.08);
```

------------------------------------------------------------------------

# 17. Quantity Control

Refined quantity selector.

``` css
display: inline-flex;
align-items: center;
border: 1px solid #e3d7c5;
border-radius: 8px;
overflow: hidden;
background: #f8f2e8;
```

Buttons:

    40px minimum

Center text medium weight.

------------------------------------------------------------------------

# 18. Summary Panel

Premium order ticket style.

``` css
background: #f8f2e8;
border: 1px solid #e3d7c5;
border-radius: 12px;
padding: 24px;
position: sticky;
top: 104px;
```

### Internal groups

1.  coffee identity
2.  roast batch
3.  selections
4.  pricing + CTA

Spacing:

    20–24px

------------------------------------------------------------------------

## Price block example

    $12.80 each
    was $16.00
    20% Off

CTA full width.

------------------------------------------------------------------------

# 19. Mobile Builder Behavior

Order:

1.  origin block
2.  selections
3.  summary
4.  add to cart

Sticky summary removed.

------------------------------------------------------------------------

# 20. Required UI States

## Batch cards

-   fresh
-   20% off
-   50% off
-   unavailable

## Grind tiles

-   default
-   hover
-   selected
-   disabled

## CTA

-   default
-   hover
-   disabled
-   loading

## Page states

-   loading grid
-   no coffee available
-   data error

------------------------------------------------------------------------

# 21. Empty States

## Batch grid empty

Centered panel:

    No current roast batches are available right now.
    Check back soon or contact us about upcoming availability.

## Builder unavailable

Disable:

-   grind selection
-   quantity

Replace CTA with unavailable message.

------------------------------------------------------------------------

# 22. Visual Implementation Rule

When coding a section ask:

> If images fail to load, does this still feel like a designed specialty
> coffee brand page?

If not, improve:

-   background treatment
-   spacing
-   typography hierarchy
-   surface contrast

------------------------------------------------------------------------

# 23. Hero Implementation Standard

The hero should NOT be:

-   white background
-   bag + text

Instead:

-   warm cream full-width hero
-   layered atmospheric background blurs
-   subtle paper texture
-   serif headline left
-   product vignette right
-   gentle section transition

------------------------------------------------------------------------

# 24. Next Artifact Recommendation

Next best artifact:

**Section-by-section implementation blueprint including:**

-   DOM/component structure
-   class structure
-   Tailwind tokens
-   layout pseudo-code

For:

-   Hero
-   Batch grid
-   Builder page
