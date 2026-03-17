# Café Reyna Storefront Design & Implementation Spec

**Version:** v1 Launch\
**Scope:** Homepage + Batch Cards + Batch Detail / Builder

------------------------------------------------------------------------

## 1. Core Business Model

### Supply Chain Model

    Farmer
      └ Farm
          └ Lot (green coffee shipment)
              └ Roast Batch
                  └ Retail Bags

### Definitions

**Farm**\
physical coffee farm

**Lot**\
shipment of green coffee from a farm\
one farm may produce multiple lots per year

**Roast Batch**\
roasting session using beans from a lot\
determines roast level and roast date

**Retail Bags**\
12oz retail product created from a roast batch

------------------------------------------------------------------------

## 2. Storefront Product Model

Customers purchase **Roast Batches**, not lots.

Batch cards display **origin-first storytelling**, but the purchasable
object is the **batch**.

### Customer Flow

    Browse Batch
    → Select Grind
    → Select Quantity
    → Add to Cart

### Batch already defines

-   Farm
-   Lot
-   Process
-   Roast
-   Roast Date
-   Price tier

### User chooses only

-   Grind
-   Quantity

------------------------------------------------------------------------

## 3. Freshness Pricing Model

Freshness is determined by:

`roast_date`

### Pricing rules

  Roast Age     Price
  ------------- ------------
  0--14 days    base price
  14--28 days   20% off
  28--56 days   50% off
  \>56 days     removed

### Pseudocode

``` js
daysOld = today - roast_date

if(daysOld < 14)
  price = basePrice

else if(daysOld < 28)
  price = basePrice * 0.8

else if(daysOld < 56)
  price = basePrice * 0.5

else
  hidden = true
```

------------------------------------------------------------------------

## 4. Homepage Layout

Section order:

1.  Header
2.  Hero
3.  How Our Coffee Works
4.  Current Coffee Available
5.  Washed vs Honey
6.  Roast + Grind
7.  Bulk Orders
8.  Why Café Reyna
9.  Final CTA
10. Footer

------------------------------------------------------------------------

## 5. Current Coffee Available Section

### Purpose

Primary shopping entry.

Displays **Roast Batch Cards**.

### Ordering

Sort batches by:

`roast_date DESC`

Newest batches appear first.

------------------------------------------------------------------------

## 6. Batch Card UI Specification

### Card Dimensions

Desktop:

-   width: **340px**
-   padding: **28px**
-   border radius: **8px**

### Grid

-   desktop: **3 columns**
-   tablet: **2 columns**
-   mobile: **1 column**

### Spacing

-   row gap: **40px**
-   column gap: **32px**

------------------------------------------------------------------------

## 7. Batch Card Information Hierarchy

Display fields in this exact order:

1.  Farm Name
2.  Lot Code
3.  Origin
4.  Process
5.  Roast
6.  Flavor Notes
7.  Roast Date
8.  Freshness Meter
9.  Freshness Badge
10. CTA

------------------------------------------------------------------------

## 8. Batch Card Wireframe

    ┌────────────────────────────────────┐
    │ La Esperanza                       │
    │ Lot LE-2026-01                     │
    │ Marcala, Honduras                  │
    │                                    │
    │ Process                            │
    │ Washed                             │
    │                                    │
    │ Roast                              │
    │ Medium                             │
    │                                    │
    │ Notes                              │
    │ Cocoa • Citrus • Honey             │
    │                                    │
    │ Roast Date                         │
    │ June 12                            │
    │                                    │
    │ Freshness                          │
    │ [■■■■■■■■□□]  9 days               │
    │ Fresh Roast                        │
    │                                    │
    │ [ Build Your Bag ]                 │
    └────────────────────────────────────┘

------------------------------------------------------------------------

## 9. Freshness Meter Specification

Meter represents freshness relative to **56 day lifespan**.

### Calculation

    maxDays = 56
    percentRemaining = (56 - daysOld) / 56

### Visual representation

10 segments:

    [■■■■■■■■□□]

Segment calculation:

    filledSegments = Math.round(percentRemaining * 10)

------------------------------------------------------------------------

## 10. Freshness Badge Logic

Badge based on roast age.

  Age           Badge
  ------------- -------------
  0--14 days    Fresh Roast
  14--28 days   20% Off
  28--56 days   50% Off

Recommended labels:

  State   Label
  ------- ---------------------------
  fresh   Fresh Roast
  mid     Great Value • 20% Off
  old     Roast Clearance • 50% Off

------------------------------------------------------------------------

## 11. Batch Card Styling

Background:

    background: #F4EDE4;

Border:

    border: 1px solid #e3d7c5;

Radius:

    border-radius: 8px;

Padding:

    padding: 28px;

------------------------------------------------------------------------

## 12. Typography

### Farm Name

-   serif
-   weight: medium
-   size: 20--24px

Examples:

-   Playfair
-   Canela
-   Cormorant

### Metadata

-   sans-serif
-   size: 14--16px

Examples:

-   Inter
-   Source Sans

------------------------------------------------------------------------

## 13. Micro Labels

Use editorial labels for fields:

-   Process
-   Roast
-   Notes
-   Roast Date
-   Freshness

Style:

    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7a6a5a;

------------------------------------------------------------------------

## 14. Card Hover Behavior

    .card:hover {
     transform: translateY(-4px);
     border-color: #d4c3ad;
    }

Transition:

    transition: 0.2s ease;

No large shadows.

------------------------------------------------------------------------

## 15. CTA Button

Primary action:

**Build Your Bag**

Style:

    background: #6B3E26;
    color: white;
    padding: 10px 18px;
    border-radius: 6px;

Hover:

    background: #56311f;

------------------------------------------------------------------------

## 16. Batch Detail / Builder Page

Two column layout.

Left: origin + selections\
Right: order summary

------------------------------------------------------------------------

## 17. Batch Detail Origin Block

    La Esperanza
    Lot LE-2026-01
    Marcala, Honduras

    Process
    Washed

    Roast
    Medium

    Flavor Notes
    Cocoa • Citrus • Honey

------------------------------------------------------------------------

## 18. Builder Controls

Selections required:

-   Grind
-   Quantity

### Grind Options

-   Whole Bean
-   Espresso
-   Pour Over
-   Drip
-   French Press
-   Cold Brew

Display as **card grid**.

------------------------------------------------------------------------

## 19. Quantity Control

    [-] 1 [+]

Product unit:

**12 oz bags**

------------------------------------------------------------------------

## 20. Order Summary Panel

    Coffee
    La Esperanza
    Lot LE-2026-01

    Process
    Washed

    Roast
    Medium

    Grind
    Pour Over

    Quantity
    2 Bags

    Price
    $16.00 each

    [ Add to Cart ]

------------------------------------------------------------------------

## 21. Roast Batch Panel

Display freshness.

    Current Roast Batch
    0612-A

    Roasted June 12
    Age: 9 days

    Fresh Roast

------------------------------------------------------------------------

## 22. Mobile Layout

Batch cards:

-   single column
-   full width

Builder order:

1.  Origin block
2.  Selections
3.  Summary
4.  Add to Cart

Summary collapses under selections.

------------------------------------------------------------------------

## 23. API Data Model

### Farmers

``` json
{
  "id": "cec01",
  "name": "Cecilia",
  "region": "Marcala"
}
```

### Farms

``` json
{
  "id": "farm01",
  "farmer_id": "cec01",
  "name": "La Esperanza",
  "elevation": 1700
}
```

### Lots

``` json
{
  "id": "LE-2026-01",
  "farm_id": "farm01",
  "process": "washed",
  "arrival_date": "2026-02-04"
}
```

### Roast Batches

``` json
{
  "id": "0612-A",
  "lot_id": "LE-2026-01",
  "roast_level": "medium",
  "roast_date": "2026-06-12",
  "inventory": 42
}
```

------------------------------------------------------------------------

## 24. Recommended Tech Stack

### Frontend

-   Next.js
-   React
-   Tailwind
-   Framer Motion

### Commerce

Shopify Storefront API

### Inventory / roasting data

-   Postgres
-   Supabase
-   or small internal service

------------------------------------------------------------------------

## 25. Developer Component Map

    Header
    Hero

    HowCoffeeWorks

    BatchGrid
      BatchCard

    ProcessExplainer

    RoastGrindSection

    BulkOrdersSection

    WhyReyna

    Footer

### Batch Card Component

    BatchCard
      FarmHeader
      OriginMeta
      ProcessRoast
      FlavorNotes
      RoastDate
      FreshnessMeter
      FreshnessBadge
      CTA

------------------------------------------------------------------------

## 26. Success Criteria

Site should feel like:

-   specialty coffee roaster
-   origin-focused brand
-   fresh roasting operation
-   premium product

NOT like:

-   generic Shopify coffee store
-   commodity ecommerce grid
-   discount-driven retail

------------------------------------------------------------------------

## Final Note

This design deliberately emphasizes:

-   origin
-   freshness
-   roast batches
-   traceability

because those are the true differentiators of **Café Reyna**.
