export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        attributes: Array<{ key: string; value: string }>;
        merchandise: { id: string };
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
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        attributes { key value }
        merchandise {
          ... on ProductVariant { id }
        }
      }
    }
  }`;

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token ?? '',
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
  grindType: string,
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
              { key: 'Grind Preference', value: grindType },
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
  grindType: string,
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
            { key: 'Grind Preference', value: grindType },
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
