'use client';

import { useEffect } from 'react';
import { useCart } from './CartContext';

const GRIND_LABELS: Record<string, string> = {
  'whole-bean': 'Whole Bean',
  'espresso': 'Espresso',
  'moka-pot': 'Moka Pot',
  'drip': 'Drip',
  'pour-over': 'Pour Over',
  'french-press': 'French Press',
};

export function CartDrawer() {
  const { isCartOpen, closeCart, cartLines, itemCount, isLoading, updateItem, removeItem, checkout } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = cartLines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[#f4ede4] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3d7c5] px-6 py-4">
          <h2 className="text-sm font-semibold text-[#2a2a2a]">
            Your Cart {itemCount > 0 && <span className="ml-1 text-[#7a6a5a]">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="cursor-pointer text-[#7a6a5a] hover:text-[#2a2a2a]"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartLines.length === 0 ? (
            <p className="mt-8 text-center text-sm text-[#7a6a5a]">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cartLines.map((line) => (
                <li
                  key={line.lineId}
                  className="flex items-start gap-4 rounded-xl border border-[#e3d7c5] bg-white/40 p-4"
                >
                  <div className="flex-1 space-y-0.5">
                    <p className="font-mono text-sm font-semibold text-[#2a2a2a]">
                      {line.batchCode || '12oz Bag'}
                    </p>
                    <p className="text-xs text-[#7a6a5a]">
                      {GRIND_LABELS[line.grindType] ?? line.grindType}
                    </p>
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] text-sm">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={isLoading}
                        onClick={() => {
                          if (line.quantity <= 1) {
                            removeItem(line.lineId);
                          } else {
                            updateItem(line.lineId, line.quantity - 1);
                          }
                        }}
                        className="h-8 w-8 border-r border-[#e3d7c5] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {line.quantity <= 1 ? '✕' : '−'}
                      </button>
                      <span className="px-3">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={isLoading}
                        onClick={() => updateItem(line.lineId, line.quantity + 1)}
                        className="h-8 w-8 border-l border-[#e3d7c5] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartLines.length > 0 && (
          <div className="space-y-3 border-t border-[#e3d7c5] px-6 py-4">
            <div className="flex items-center justify-between text-sm text-[#4a4037]">
              <span>Total bags</span>
              <span className="font-semibold">{subtotal}</span>
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={isLoading}
              className="w-full cursor-pointer rounded-full bg-[#6b3e26] px-5 py-3 text-base font-medium text-white hover:bg-[#56311f] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
