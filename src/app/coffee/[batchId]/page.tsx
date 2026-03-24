import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GrindSelectorGrid } from '@/app/components/GrindSelectorGrid';
import { fetchBatchById } from '@/app/lib/api';
import {
  getDaysOld,
  getFreshnessState,
  getFreshnessBadgeLabel,
  getDiscountedPrice,
} from '@/app/lib/freshness';

interface BatchPageParams {
  batchId: string;
}

export default async function BatchPage({ params }: { params: Promise<BatchPageParams> }) {
  const { batchId } = await params;

  const batch = await fetchBatchById(batchId);
  if (!batch) notFound();

  const daysOld = getDaysOld(batch.roastDate);
  const freshnessState = getFreshnessState(daysOld);
  const badgeLabel = getFreshnessBadgeLabel(freshnessState);
  const discountedPrice = getDiscountedPrice(batch.basePrice, daysOld);
  const isDiscounted = freshnessState !== 'fresh';

  const roastDateFormatted = new Date(batch.roastDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const badgeStyles = {
    fresh:     'bg-[#e8f5e9] text-[#2e7d32]',
    value:     'bg-[#fff8e1] text-[#f57c00]',
    clearance: 'bg-[#f5f0eb] text-[#7a6a5a]',
  } as const;

  return (
    <div className="min-h-screen bg-[#f4ede4] text-[#2a2a2a]">
      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-24 pt-6 sm:px-8 md:px-10">
        {/* Header (shared shell) */}
        <section aria-label="Site header">
          <div className="flex items-center justify-between border-b border-[#e3d7c5] pb-4">
            <Link href="/#our-coffee">
              <Image
                src="/crown-logo.png"
                alt="Café Reyna"
                width={105}
                height={35}
                className="h-[35px] w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              className="rounded-full border border-[#cdbda7] px-4 py-1 text-base"
            >
              Cart
            </button>
          </div>
        </section>

        {/* Batch Hero / Intro Band */}
        <section
          aria-label="Selected batch hero"
          className="space-y-4 border-b border-[#e3d7c5] pb-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
            Current Roast Batch
          </p>
          <h1 className="text-2xl font-semibold">
            <span className="font-mono">{batch.batchCode}</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#4a4037]">
            {batch.farmName} · {batch.origin}
          </p>
        </section>

        {/* Two-column layout: origin + selections / summary */}
        <section
          aria-label="Batch builder layout"
          className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]"
        >
          {/* Left column: origin + selections + roast batch panel */}
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
                    className="h-10 w-10 border-r border-[#e3d7c5]"
                  >
                    -
                  </button>
                  <span className="px-6">1 bag</span>
                  <button
                    type="button"
                    className="h-10 w-10 border-l border-[#e3d7c5]"
                  >
                    +
                  </button>
                </div>
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
              <p>Grind: (to be selected)</p>
              <p>Quantity: 1 × 12oz bag</p>
            </div>
            <div className="space-y-2 border-t border-[#e3d7c5] pt-4 text-base">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                Pricing
              </p>
              <p className="text-lg font-semibold">
                ${discountedPrice.toFixed(2)}{' '}
                {isDiscounted && (
                  <span className="ml-1 text-sm font-normal text-[#7a6a5a] line-through">
                    ${batch.basePrice.toFixed(2)}
                  </span>
                )}
                <span className="ml-1 text-sm font-normal text-[#4a4037]">each</span>
              </p>
              {isDiscounted && (
                <p className="text-xs text-[#6b5a4a]">{badgeLabel}</p>
              )}
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-full bg-[#6b3e26] px-5 py-2.5 text-base font-medium text-white"
            >
              Add to cart
            </button>
          </aside>
        </section>

        {/* Footer */}
        <section aria-label="Site footer" className="mt-8">
          <footer className="space-y-4 border-t border-[#e3d7c5] pt-4 text-xs text-[#6b5a4a]">
            <p>© {new Date().getFullYear()} Café Reyna. All rights reserved.</p>
          </footer>
        </section>
      </main>
    </div>
  );
}
