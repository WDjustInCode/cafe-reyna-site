// Single switch for whether the shop is open.
//
// Pre-launch (default): no prices, stock, buy buttons, or cart anywhere on the
// site. Batch cards are built from the roast_batch metaobjects and point
// visitors at the founding-list signup instead.
//
// Launch day: set NEXT_PUBLIC_SALES_OPEN=true in Vercel and redeploy. The
// product-based data path, prices, cart, and checkout all come back.
export const SALES_OPEN = process.env.NEXT_PUBLIC_SALES_OPEN === 'true';
