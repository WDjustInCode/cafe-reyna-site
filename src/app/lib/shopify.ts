// Storefront API config. NEXT_PUBLIC_* env vars win; the fallbacks keep
// preview deploys working when the vars aren't set on Vercel. The Storefront
// token is a *public* (Headless channel) token, which is safe to ship in
// front-end code.
const DEFAULT_STORE_DOMAIN = 'cafe-reyna.myshopify.com';
const DEFAULT_STOREFRONT_TOKEN = '6fc40354546cbb01bdc86518c612653f';
const API_VERSION = '2026-10';

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || DEFAULT_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || DEFAULT_STOREFRONT_TOKEN;

interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        attributes: Array<{ key: string; value: string }>;
        merchandise: { id: string; product?: { title: string } };
      };
    }>;
  };
}

interface StorefrontResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        attributes { key value }
        merchandise {
          ... on ProductVariant { id product { title } }
        }
      }
    }
  }`;

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Storefront API error: ${res.status}`);

  const json = (await res.json()) as StorefrontResponse<T>;
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

interface CartCreateData {
  cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
}

export async function createCartWithItem(
  variantId: string,
  quantity: number,
  batchCode: string,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<CartCreateData>(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
            attributes: [
              { key: 'Batch Code', value: batchCode },
            ],
          },
        ],
      },
    },
  );
  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data.cartCreate.cart;
}

interface CartLinesAddData {
  cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
}

export async function addCartItem(
  cartId: string,
  variantId: string,
  quantity: number,
  batchCode: string,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<CartLinesAddData>(
    `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
          attributes: [
            { key: 'Batch Code', value: batchCode },
          ],
        },
      ],
    },
  );
  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  return data.cartLinesAdd.cart;
}

interface CartLinesUpdateData {
  cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
}

export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<CartLinesUpdateData>(
    `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }
  return data.cartLinesUpdate.cart;
}

interface CartLinesRemoveData {
  cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
}

export async function removeCartItem(
  cartId: string,
  lineId: string,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<CartLinesRemoveData>(
    `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds: [lineId] },
  );
  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }
  return data.cartLinesRemove.cart;
}

interface CartQueryData {
  cart: ShopifyCart | null;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<CartQueryData>(
    `query getCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }`,
    { cartId },
  );
  return data.cart;
}
