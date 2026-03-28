'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createCartWithItem, addCartItem, updateCartItem, removeCartItem, getCart } from '@/app/lib/shopify';
import type { ShopifyCart } from '@/app/lib/shopify';

const CART_STORAGE_KEY = 'cafe-reyna-cart';

export interface CartLine {
  lineId: string;
  variantId: string;
  quantity: number;
  batchCode: string;
  grindType: string;
}

interface CartContextValue {
  itemCount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  cartLines: CartLine[];
  variantQuantities: Record<string, number>;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity: number, grindType: string, batchCode: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function parseLines(cart: ShopifyCart): CartLine[] {
  return cart.lines.edges.map(({ node }) => {
    const attrs = Object.fromEntries(node.attributes.map((a) => [a.key, a.value]));
    return {
      lineId: node.id,
      variantId: node.merchandise.id,
      quantity: node.quantity,
      batchCode: attrs['Batch Code'] ?? '',
      grindType: attrs['Grind Preference'] ?? '',
    };
  });
}

function buildVariantQuantities(lines: CartLine[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const line of lines) {
    map[line.variantId] = (map[line.variantId] ?? 0) + line.quantity;
  }
  return map;
}

function applyCart(
  cart: ShopifyCart,
  setters: {
    setCartId: (id: string) => void;
    setCheckoutUrl: (url: string) => void;
    setItemCount: (n: number) => void;
    setCartLines: (lines: CartLine[]) => void;
    setVariantQuantities: (q: Record<string, number>) => void;
  },
) {
  const lines = parseLines(cart);
  setters.setCartId(cart.id);
  setters.setCheckoutUrl(cart.checkoutUrl);
  setters.setItemCount(cart.totalQuantity);
  setters.setCartLines(lines);
  setters.setVariantQuantities(buildVariantQuantities(lines));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const setters = { setCartId, setCheckoutUrl, setItemCount, setCartLines, setVariantQuantities };

  useEffect(() => {
    const storedId = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedId) return;
    getCart(storedId)
      .then((cart) => {
        if (cart) {
          applyCart(cart, setters);
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      })
      .catch(() => localStorage.removeItem(CART_STORAGE_KEY));
  }, []);

  async function addItem(variantId: string, quantity: number, grindType: string, batchCode: string) {
    setIsLoading(true);
    try {
      let cart;
      if (cartId) {
        cart = await addCartItem(cartId, variantId, quantity, grindType, batchCode);
      } else {
        cart = await createCartWithItem(variantId, quantity, grindType, batchCode);
        localStorage.setItem(CART_STORAGE_KEY, cart.id);
      }
      applyCart(cart, setters);
    } catch (err) {
      console.error('Cart error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateItem(lineId: string, quantity: number) {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const cart = await updateCartItem(cartId, lineId, quantity);
      applyCart(cart, setters);
    } catch (err) {
      console.error('Cart update error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeItem(lineId: string) {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const cart = await removeCartItem(cartId, lineId);
      applyCart(cart, setters);
    } catch (err) {
      console.error('Cart remove error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function checkout() {
    if (checkoutUrl) window.location.href = checkoutUrl;
  }

  return (
    <CartContext.Provider value={{
      itemCount, isLoading, isCartOpen, cartLines, variantQuantities,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addItem, updateItem, removeItem, checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export function CartButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="relative cursor-pointer rounded-lg border border-[#cdbda7] px-4 py-1 text-base"
    >
      Cart
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#6b3e26] text-[10px] font-medium leading-none text-white">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
