'use client';

import { useState } from 'react';
import type { BatchCardViewModel } from '@/app/lib/types';
import type { FreshnessState } from '@/app/lib/freshness';
import { GrindSelectorGrid } from './GrindSelectorGrid';
import { useCart } from './CartContext';

interface BatchBuilderClientProps {
  batch: BatchCardViewModel;
  daysOld: number;
  freshnessState: FreshnessState;
  badgeLabel: string;
  discountedPrice: number;
  isDiscounted: boolean;
  roastDateFormatted: string;
}

const badgeStyles = {
  fresh:     'bg-[#e8f5e9] text-[#2e7d32]',
  value:     'bg-[#fff8e1] text-[#f57c00]',
  clearance: 'bg-[#f5f0eb] text-[#7a6a5a]',
} as const;

export function BatchBuilderClient({
  batch,
  daysOld,
  freshnessState,
  badgeLabel,
  discountedPrice,
  isDiscounted,
  roastDateFormatted,
}: BatchBuilderClientProps) {
  const stockMax = Math.max(1, Math.floor(batch.remainingWeightLb / 0.75));
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading, variantQuantities } = useCart();

  const inCart = batch.shopifyVariantId ? (variantQuantities[batch.shopifyVariantId] ?? 0) : 0;
  const canAdd = Math.max(0, stockMax - inCart);
  const maxQty = canAdd;
  const atStockLimit = inCart >= stockMax;

  const handleAddToCart = async () => {
    if (!batch.shopifyVariantId || canAdd === 0) return;
    const safeQty = Math.min(quantity, canAdd);
    let grind = 'whole-bean';
    try { grind = sessionStorage.getItem('cafe-reyna-grind') ?? 'whole-bean'; } catch { /* ignore */ }
    await addItem(batch.shopifyVariantId, safeQty, grind, batch.batchCode);
  };

  return (
    <section
      aria-label="Batch builder layout"
      className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]"
    >
      {/* Left column */}
      <div className="space-y-10">
        {/* Origin Block */}
        <section aria-label="Origin block" className="space-y-4">
          <div className="rounded-2xl border border-[#e7dccd] bg-white/30 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Origin
            </p>
            <h2 className="mt-2 text-xl font-semibold">{batch.farmName}</h2>
            <p className="mt-1 text-base text-[#4a4037]">{batch.lotCode} · {batch.origin}</p>
            <div className="mt-4 grid gap-3 text-base sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                  Process
                </div>
                <p className="mt-1">{batch.process}</p>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                  Roast
                </div>
                <p className="mt-1">{batch.roastLevel}</p>
              </div>
              {batch.varietal && (
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                    Varietal
                  </div>
                  <p className="mt-1">{batch.varietal}</p>
                </div>
              )}
              {batch.elevation != null && (
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                    Elevation
                  </div>
                  <p className="mt-1">{batch.elevation.toLocaleString()} m</p>
                </div>
              )}
              {batch.notes.length > 0 && (
                <div className="sm:col-span-2">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                    Flavor Notes
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {batch.notes.map((note) => (
                      <span
                        key={note}
                        className="rounded-full border border-[#e3d7c5] bg-transparent px-2.5 py-0.5 text-xs capitalize text-[#4a4037]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Selection Area */}
        <section aria-label="Selection controls" className="space-y-8">
          {/* Grind grid */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                  Grind
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  Choose how you brew.
                </h3>
              </div>
            </div>
            <GrindSelectorGrid />
          </div>

          {/* Quantity control */}
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Quantity
            </p>
            <div className="inline-flex items-center rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] text-base">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                disabled={quantity <= 1 || atStockLimit}
                className="h-10 w-10 border-r border-[#e3d7c5] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                -
              </button>
              <span className="px-6">{quantity} {quantity === 1 ? 'bag' : 'bags'}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(q + 1, maxQty))}
                disabled={atStockLimit || quantity >= maxQty}
                className="h-10 w-10 border-l border-[#e3d7c5] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                +
              </button>
            </div>
            {atStockLimit ? (
              <p className="text-xs text-[#7a6a5a]">
                You already have all available bags from this batch in your cart.
              </p>
            ) : quantity >= maxQty && maxQty > 0 ? (
              <p className="text-xs text-[#7a6a5a]">
                That&apos;s all we have available from this batch.
              </p>
            ) : null}
          </div>

          {/* Roast Batch Panel */}
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Roast Batch
            </p>
            <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] p-4 text-base">
              <p className="font-medium">{batch.batchCode}</p>
              <p className="mt-1 text-[#4a4037]">
                Roasted {roastDateFormatted} · {daysOld} days ago
              </p>
              <div className="mt-2">
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${badgeStyles[freshnessState]}`}>
                  {badgeLabel}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right column: summary */}
      <aside
        aria-label="Order summary"
        className="space-y-4 rounded-2xl border border-[#e3d7c5] bg-[#f8f2e8] p-5"
      >
        <div className="space-y-2 text-base">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
            Coffee
          </p>
          <p className="font-semibold">{batch.batchCode}</p>
          <p className="text-[#4a4037]">{batch.farmName} · {batch.lotCode} · {batch.origin}</p>
        </div>
        <div className="space-y-2 border-t border-[#e3d7c5] pt-4 text-base">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
            Selections
          </p>
          <p>Grind: (select above)</p>
          <p>Quantity: {quantity} × 12oz bag{quantity > 1 ? 's' : ''}</p>
        </div>
        <div className="space-y-2 border-t border-[#e3d7c5] pt-4 text-base">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
            Pricing
          </p>
          <p className="text-lg font-semibold">
            ${(discountedPrice * quantity).toFixed(2)}{' '}
            {isDiscounted && (
              <span className="ml-1 text-sm font-normal text-[#7a6a5a] line-through">
                ${(batch.basePrice * quantity).toFixed(2)}
              </span>
            )}
            <span className="ml-1 text-sm font-normal text-[#4a4037]">total</span>
          </p>
          {isDiscounted && (
            <p className="text-xs text-[#6b5a4a]">{badgeLabel}</p>
          )}
        </div>
        {batch.shopifyVariantId === null ? (
          <button
            type="button"
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-full bg-[#c4b49e] px-5 py-2.5 text-base font-medium text-white"
          >
            Coming Soon
          </button>
        ) : atStockLimit ? (
          <button
            type="button"
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-full bg-[#c4b49e] px-5 py-2.5 text-base font-medium text-white"
          >
            Max quantity in cart
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`mt-2 w-full rounded-full px-5 py-2.5 text-base font-medium text-white transition-opacity ${
              isLoading
                ? 'bg-[#6b3e26] opacity-60 cursor-not-allowed'
                : 'cursor-pointer bg-[#6b3e26] hover:bg-[#56311f]'
            }`}
          >
            {isLoading ? 'Adding…' : inCart > 0 ? `${inCart} in cart · Add more` : 'Add to cart'}
          </button>
        )}
      </aside>
    </section>
  );
}
