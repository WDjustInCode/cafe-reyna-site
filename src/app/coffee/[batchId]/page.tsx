import Image from 'next/image';

interface BatchPageParams {
  batchId: string;
}

interface BatchPageProps {
  params: Promise<BatchPageParams>;
}

export default async function BatchPage({ params }: BatchPageProps) {
  const { batchId } = await params;

  return (
    <div className="min-h-screen bg-[#f4ede4] text-[#2a2a2a]">
      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-24 pt-6 sm:px-8 md:px-10">
        {/* Header (shared shell) */}
        <section aria-label="Site header">
          <div className="flex items-center justify-between border-b border-[#e3d7c5] pb-4">
            <Image
            src="/crown-logo.png"
            alt="Café Reyna"
            width={105}
            height={35}
            className="h-[35px] w-auto object-contain"
          />
            <button
              type="button"
              className="rounded-full border border-[#cdbda7] px-4 py-1 text-sm"
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
            Batch <span className="font-mono">{batchId}</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#4a4037]">
            Origin-first batch detail page. This section will introduce the
            specific farm, lot, and roast batch you&apos;re buying from.
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
                <h2 className="mt-2 text-xl font-semibold">Farm name</h2>
                <p className="mt-1 text-sm text-[#4a4037]">Lot code • Origin</p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                      Process
                    </div>
                    <p className="mt-1">Washed / Honey</p>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                      Roast
                    </div>
                    <p className="mt-1">Roast level</p>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                      Flavor Notes
                    </div>
                    <p className="mt-1">
                      Cocoa • Citrus • Honey (placeholder notes)
                    </p>
                  </div>
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
                    <h3 className="mt-1 text-sm font-semibold">
                      Choose how you brew.
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    "Whole Bean",
                    "Espresso",
                    "Pour Over",
                    "Drip",
                    "French Press",
                    "Cold Brew",
                  ].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="flex min-h-20 flex-col justify-center rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] px-3 py-2 text-left text-sm"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity control */}
              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                  Quantity
                </p>
                <div className="inline-flex items-center rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] text-sm">
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
                <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] p-4 text-sm">
                  <p className="font-medium">Current batch placeholder</p>
                  <p className="mt-1 text-[#4a4037]">
                    Roasted on [date] • [age] days • Freshness badge.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right column: summary */}
          <aside
            aria-label="Order summary"
            className="space-y-4 rounded-2xl border border-[#e3d7c5] bg-[#f8f2e8] p-5"
          >
            <div className="space-y-2 text-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                Coffee
              </p>
              <p className="font-semibold">Batch {batchId}</p>
              <p className="text-[#4a4037]">Farm • Lot • Origin placeholder</p>
            </div>
            <div className="space-y-2 border-t border-[#e3d7c5] pt-4 text-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                Selections
              </p>
              <p>Grind: (to be selected)</p>
              <p>Quantity: 1 × 12oz bag</p>
            </div>
            <div className="space-y-2 border-t border-[#e3d7c5] pt-4 text-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                Pricing
              </p>
              <p className="text-lg font-semibold">$16.00 each</p>
              <p className="text-xs text-[#6b5a4a]">
                Freshness-based discounts will display here.
              </p>
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-full bg-[#6b3e26] px-5 py-2.5 text-sm font-medium text-white"
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

