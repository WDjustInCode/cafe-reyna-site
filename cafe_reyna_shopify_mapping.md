# Café Reyna: RoastBatch ↔ Shopify Mapping

## Recommended system boundary

Use **Shopify as the commerce system of record** for:

- Customer
- Order
- OrderItem / Line Item
- Cart
- Checkout
- Payment
- Fulfillment status

Use your **custom application/database** for:

- Farmer
- Farm
- Lot
- Location
- LotInventory
- RoastBatch
- InventoryMovement

That gives you a clean split:

- **Shopify** = commerce
- **Your app** = coffee operations, traceability, freshness, and inventory

---

## Why Shopify should own Customer / Order / OrderItem

Shopify already handles:

- customer accounts
- order creation
- line items
- taxes
- discounts
- checkout
- payment capture
- refund flows
- shipping and fulfillment workflows

If you duplicate those tables in your own database as primary records, you create:

- duplicate sources of truth
- sync risk
- more backend maintenance
- more reconciliation work

So the right move is:

- let Shopify own commerce entities
- let your custom system own coffee-specific operational entities

---

## Core mapping idea

A customer does **not** buy a generic coffee product.

They are really buying a specific:

- RoastBatch
- with a chosen grind type
- in a certain quantity

Shopify does not naturally understand your internal traceability hierarchy:

- Farmer → Farm → Lot → RoastBatch

So you need a mapping layer between **Shopify products/variants** and **your RoastBatch records**.

---

## Best practical approach

### Shopify product
Create a Shopify product representing the current sellable coffee offering for a specific roast batch.

Example Shopify product title:

`La Esperanza – Lot LE-2026-01 – Medium Roast`

### Shopify variants
Use Shopify variants for the **grind type**.

Example variants:

- Whole Bean
- Espresso
- Pour Over
- Drip
- French Press
- Cold Brew

That means:

- **RoastBatch** determines origin, process, roast level, and freshness
- **Shopify Variant** determines grind type

This is the cleanest v1 model.

---

## Recommended mapping structure

### Internal object

```text
RoastBatch
---------
id
lot_id
location_id
batch_code
roast_level
roast_date
roasted_weight_lb
remaining_roasted_weight_lb
status
shopify_product_id
```

### Variant mapping object

You should add a dedicated mapping table/object for Shopify variants.

```text
RoastBatchVariantMap
--------------------
id
batch_id
grind_type
shopify_product_id
shopify_variant_id
active
created_at
updated_at
```

This lets one RoastBatch map to multiple Shopify variants.

---

## Why a separate mapping object is better

You could store Shopify IDs directly on the RoastBatch, but that only works for the product-level mapping.

Because each batch has multiple grind variants, a separate mapping object is cleaner.

It supports:

- one RoastBatch → many Shopify variants
- re-publishing a batch if needed
- disabling specific grind options
- auditability when syncing

---

## Example mapping

### Internal RoastBatch

```json
{
  "id": "batch_LE0612A",
  "lot_id": "lot_LE_2026_01",
  "location_id": "roaster_a",
  "batch_code": "LE-0612-A",
  "roast_level": "medium",
  "roast_date": "2026-06-12",
  "remaining_roasted_weight_lb": 32
}
```

### Shopify product

```json
{
  "id": "gid://shopify/Product/123456",
  "title": "La Esperanza – Lot LE-2026-01 – Medium Roast"
}
```

### Variant mappings

```json
[
  {
    "batch_id": "batch_LE0612A",
    "grind_type": "whole_bean",
    "shopify_product_id": "gid://shopify/Product/123456",
    "shopify_variant_id": "gid://shopify/ProductVariant/111"
  },
  {
    "batch_id": "batch_LE0612A",
    "grind_type": "espresso",
    "shopify_product_id": "gid://shopify/Product/123456",
    "shopify_variant_id": "gid://shopify/ProductVariant/112"
  },
  {
    "batch_id": "batch_LE0612A",
    "grind_type": "pour_over",
    "shopify_product_id": "gid://shopify/Product/123456",
    "shopify_variant_id": "gid://shopify/ProductVariant/113"
  }
]
```

---

## How the storefront works

### On your site
Your site should display current coffee using your **custom RoastBatch data**, not by blindly listing Shopify catalog data.

That means the homepage and builder page read from your DB:

- Farm
- Lot
- RoastBatch
- freshness
- roast age
- batch availability

### Add to cart flow
When the customer chooses a grind and quantity:

1. user selects RoastBatch in your UI
2. user selects grind type
3. your app looks up the correct `shopify_variant_id`
4. your app adds that Shopify variant to cart

So Shopify carting happens with variants, but the UX is powered by your batch model.

---

## Inventory sync model

### Source of truth for roasted inventory
Your **custom DB** should remain the source of truth for:

- `remaining_roasted_weight_lb`
- freshness status
- hide/remove after 56 days

Shopify should **not** be the operational inventory authority for roast freshness logic.

### Why
Because Shopify inventory is SKU-centric, but your real business logic is batch-centric and time-sensitive.

You need your own logic to answer:

- Is this batch older than 56 days?
- Should this batch be discounted 20% or 50%?
- Is there enough roasted inventory left in this batch?
- Which roaster produced this batch?

Those are operational questions, not standard catalog questions.

---

## Recommended sync workflow

### When a RoastBatch is created
1. create RoastBatch in your DB
2. create or publish corresponding Shopify product
3. create Shopify variants for each allowed grind type
4. store mappings in `RoastBatchVariantMap`

### When the batch ages
Your app recalculates freshness-based pricing and updates Shopify variant prices.

### When the batch sells
On Shopify order creation / payment success:
1. receive webhook
2. inspect line items
3. map `shopify_variant_id` back to `batch_id`
4. decrement `remaining_roasted_weight_lb` based on quantity sold
5. if batch inventory reaches threshold/zero, unpublish or deactivate variants

### When batch exceeds 56 days
Your app should:
- unpublish product from Shopify or
- set all variants unavailable

Your DB decides when that happens.

---

## How to decrement inventory correctly

Each 12 oz bag = `0.75 lb roasted`

So if an order line item has:

- variant = pour_over
- quantity = 2

Then decrement:

`2 × 0.75 = 1.5 lb`

from:

`RoastBatch.remaining_roasted_weight_lb`

That means Shopify quantity sold should be translated into roasted weight consumed in your DB.

---

## Recommended webhook handling

Use Shopify webhooks for:

- order created
- order paid
- order cancelled
- refund created
- fulfillment events if relevant

### Minimal v1 workflow

#### order paid
- decrement batch inventory

#### order cancelled / refunded
- restore batch inventory if appropriate

---

## Suggested custom operational reference table

Even though Shopify owns the order, you should keep a lightweight operational mirror for traceability.

```text
ShopifyBatchSale
----------------
id
shopify_order_id
shopify_line_item_id
batch_id
grind_type
quantity
roasted_weight_lb
created_at
```

This is **not** your source of truth for orders.

It is just a reconciliation log so you can answer:

- which Shopify order consumed this batch
- how much roasted coffee was deducted
- what grind type was sold
- how much of a batch was consumed over time

This will be extremely useful later.

---

## Final recommended data model

### Shopify owns
- Customer
- Order
- OrderItem / Line Item
- Cart
- Checkout
- Payment
- Fulfillment

### Your custom system owns
- Farmer
- Farm
- Lot
- Location
- LotInventory
- RoastBatch
- RoastBatchVariantMap
- ShopifyBatchSale
- InventoryMovement

---

## Final relationship map

```text
Farmer
  └ Farm
      └ Lot
          ├ LotInventory → Location
          └ RoastBatch → Location
                └ RoastBatchVariantMap → Shopify ProductVariant
                └ ShopifyBatchSale → Shopify Order / Line Item
```

---

## Best v1 implementation choice

For Café Reyna, I would implement:

- **one Shopify product per RoastBatch**
- **one Shopify variant per grind type**
- **pricing controlled by your app based on roast age**
- **Shopify webhooks to decrement internal batch inventory**

That gives you:

- clean storefront UX
- clean operational model
- no duplicate order system
- full freshness control
- full traceability

---

## Short answer

Yes, Shopify should usually track:

- Customer
- Order
- OrderItem

And your app should map Shopify variants back to your internal RoastBatch records using a dedicated mapping table.

That is the cleanest architecture for Café Reyna.
