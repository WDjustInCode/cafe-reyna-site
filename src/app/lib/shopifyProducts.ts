/**
 * Explicit RoastBatch → Shopify product mapping.
 *
 * Stand-in for the planned `RoastBatchVariantMap` table. Keyed by the
 * MockAPI `roastBatch.id` (NOT batch_code — batches 1 and 2 share the code
 * `LA_2609_L1_B1`). The mock API's own `shopify_variant_id` values
 * ("1", "2", "3") are placeholders and are ignored.
 *
 * A batch that is not listed here has no Shopify product and renders a
 * disabled "Coming soon" state instead of Add to cart.
 *
 * Variant IDs were verified against the Storefront API (store
 * cafe-reyna.myshopify.com). When a new batch gets a Shopify product, add
 * its variant GID + handle here.
 */
export interface ShopifyProductRef {
  handle: string;
  variantId: string;
}

export const BATCH_SHOPIFY_MAP: Record<string, ShopifyProductRef> = {
  // Los Arroyos · Washed · Dark (LA_2609_L1_B1, dark)
  '2': {
    handle: 'montecillos-washed-catuai-dark-12oz',
    variantId: 'gid://shopify/ProductVariant/52479745425717',
  },
  // Finca Deborah · Red Honey · Medium (FD_2609_L1_B1)
  '3': {
    handle: 'montecillos-red-honey-catuai-medium-12oz',
    variantId: 'gid://shopify/ProductVariant/52487123927349',
  },
  // '1' — Los Arroyos · Washed · Medium: no Shopify product yet → "Coming soon"
};

export function getShopifyRefForBatch(batchId: string): ShopifyProductRef | null {
  return BATCH_SHOPIFY_MAP[batchId] ?? null;
}
