import { Suspense } from 'react';
import Image from 'next/image';
import { ParallaxHero } from './components/ParallaxHero';
import { StickyHeader } from './components/StickyHeader';
import { ProcessCard } from './components/ProcessCard';
import { BatchGrid } from './components/BatchGrid';
import { BatchGridSkeleton } from './components/BatchGridSkeleton';
import { RoastGrindSelector } from './components/RoastGrindSelector';
import { HondurasRegions } from './components/HondurasRegions';
import { HonduranVarietals } from './components/HonduranVarietals';
import { OurFarmers } from './components/OurFarmers';
import { WhyReyna } from './components/WhyReyna';
import { fetchAllBatchViewModels, fetchRegionInventory, fetchVarietalInventory, fetchProcessInventory } from './lib/api';
import { BatchCountProvider } from './components/BatchCountContext';
import { ShopCTAButton } from './components/ShopCTAButton';
import { CartButton } from './components/CartContext';

export default async function Home() {
  const [batches, regionInventory, varietalInventory, processInventory] = await Promise.all([
    fetchAllBatchViewModels().catch(() => []),
    fetchRegionInventory().catch(() => ({})),
    fetchVarietalInventory().catch(() => ({})),
    fetchProcessInventory().catch(() => ({})),
  ]);

  return (
    <BatchCountProvider initialCount={batches.length}>
    <div className="min-h-screen bg-[#f4ede4] text-[#2a2a2a]">
      <StickyHeader />
      <ParallaxHero />

      <main className="mx-auto flex max-w-7xl flex-col gap-80 px-6 pb-24 pt-6 sm:px-8 md:px-10">
        {/* 1. Header (always visible after hero) */}
        <section id="header" aria-label="Site header">
          <div className="flex items-center justify-between border-b border-[#e3d7c5] pb-4">
            <a href="#header">
              <Image
                src="/crown-logo.png"
                alt="Café Reyna"
                width={105}
                height={35}
                className="h-[35px] w-auto object-contain"
              />
            </a>
            <nav className="hidden gap-8 text-base md:flex">
              <a href="#our-coffee">Our Coffee</a>
              <a href="#how-our-coffee-works">How It Works</a>
              <a href="#bulk-orders">Bulk Orders</a>
              <a href="#why-cafe-reyna">Why Café Reyna</a>
            </nav>
            <CartButton />
          </div>
        </section>

        {/* 2. How We Operate */}
        <section
          id="how-our-coffee-works"
          aria-label="How our coffee works"
          className="space-y-16"
        >
          <header className="space-y-3 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
              How We Operate
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              From Honduran farms to your cup
            </h2>
            <p className="text-base leading-[1.7] text-[#4a4037]">
              A simple, traceable path from farmer to roast batch to the bag on
              your counter—always tied to a specific roast date and freshness
              window.
            </p>
          </header>
          <div className="grid gap-x-12 gap-y-14 md:grid-cols-4 md:gap-x-16">
            <div className="flex flex-col gap-6">
              <Image
                src="/farm-lot.svg"
                alt="Farm and lot: coffee plant and house"
                width={120}
                height={120}
                className="h-24 w-24 object-contain text-[#2a2a2a] md:h-28 md:w-28"
              />
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
                  Step 01
                </div>
                <h3 className="text-base font-semibold">Farm &amp; Lot</h3>
              </div>
              <p className="text-base leading-[1.7] text-[#4a4037]">
                Sourced directly from friend and family-owned farms in Honduras, each lot is
                tracked from harvest to ensure origin integrity.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <Image
                src="/roaster.svg"
                alt="Coffee roaster"
                width={120}
                height={120}
                className="h-24 w-24 object-contain text-[#2a2a2a] md:h-28 md:w-28"
              />
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
                  Step 02
                </div>
                <h3 className="text-base font-semibold">Roast Batch</h3>
              </div>
              <p className="text-base leading-[1.7] text-[#4a4037]">
                Small-batch roasted to perfection, with each batch assigned a
                unique ID for full transparency.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <Image
                src="/fresh-price.svg"
                alt="Freshness-based pricing"
                width={120}
                height={120}
                className="h-24 w-24 object-contain text-[#2a2a2a] md:h-28 md:w-28"
              />
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
                  Step 03
                </div>
                <h3 className="text-base font-semibold">
                  Freshness-Based Pricing
                </h3>
              </div>
              <p className="text-base leading-[1.7] text-[#4a4037]">
                Pricing adjusts based on roast date to reward freshness, ensuring
                you get the best value for peak flavor.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <Image
                src="/brew.svg"
                alt="Brew method"
                width={120}
                height={120}
                className="h-24 w-24 object-contain text-[#2a2a2a] md:h-28 md:w-28"
              />
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
                  Step 04
                </div>
                <h3 className="text-base font-semibold">Your Brew Method</h3>
              </div>
              <p className="text-base leading-[1.7] text-[#4a4037]">
                Finally, choose the grind that matches your favorite brew method,
                or keep the beans whole if you love to grind fresh at home.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Our Coffee */}
        <section
          id="our-coffee"
          aria-label="Our coffee"
          className="space-y-8"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Our Coffee
            </p>
            <h2 className="text-2xl font-semibold">Freshly roasted batches</h2>
            <p className="max-w-2xl text-base leading-relaxed text-[#4a4037]">
              Browse our latest roast batches, each tied to a specific farm,
              lot, and roast date. Pricing adjusts based on freshness.
            </p>
          </header>
          <Suspense fallback={<BatchGridSkeleton />}>
            <BatchGrid batches={batches} />
          </Suspense>
        </section>

        {/* 5. Our Farmers */}
        <Suspense fallback={null}>
          <OurFarmers />
        </Suspense>

        {/* 6. Honduras Regions */}
        <Suspense fallback={null}>
          <HondurasRegions regionInventory={regionInventory} />
        </Suspense>

        {/* 6. Honduran Varietals */}
        <Suspense fallback={null}>
          <HonduranVarietals varietalInventory={varietalInventory} />
        </Suspense>

        {/* 7. Process Comparison */}
        <section
          id="washed-vs-honey"
          aria-label="Coffee processing methods"
          className="space-y-8"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Process
            </p>
            <h2 className="text-2xl font-semibold">Wash, honey, and natural</h2>
            <p className="max-w-2xl text-base leading-relaxed text-[#4a4037]">
              Each process shapes the flavor of the cup differently. Select one below to filter
              the batch grid above by processing method.
            </p>
          </header>
          <Suspense fallback={null}>
            {(() => {
              function processLbs(key: string) {
                const entry = Object.entries(processInventory).find(([k]) => k.startsWith(key));
                return entry ? entry[1] : 0;
              }
              return (
                <div className="grid gap-6 md:grid-cols-3">
                  <ProcessCard
                    process="wash"
                    title="Wash"
                    lbs={processLbs('wash')}
                    description="The fruit is fully removed before drying, yielding a clean, bright cup with crisp acidity and clear origin character."
                    imageSrc="/wash-process.jpeg"
                    imageAlt="Wash process"
                  />
                  <ProcessCard
                    process="honey"
                    title="Honey"
                    lbs={processLbs('honey')}
                    description="Skin removed but some fruit mucilage left on during drying, producing a balanced cup with gentle sweetness and body."
                    imageSrc="/honey-process.jpeg"
                    imageAlt="Honey process"
                  />
                  <ProcessCard
                    process="natural"
                    title="Natural"
                    lbs={processLbs('natural')}
                    description="The whole cherry dries intact, imparting bold fruit-forward flavors, rich body, and a naturally sweet finish."
                    imageSrc="/natrural-process.jpeg"
                    imageAlt="Natural process"
                  />
                </div>
              );
            })()}
          </Suspense>
        </section>

        {/* 6. Roast + Grind */}
        <section
          id="roast-and-grind"
          aria-label="Roast and grind options"
          className="space-y-3"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
            Roast &amp; Grind
          </p>
          <Suspense fallback={null}>
            <RoastGrindSelector />
          </Suspense>
        </section>

        {/* 8. Why Café Reyna */}
        <WhyReyna />

        {/* 9. Final CTA */}
        <section
          id="final-cta"
          aria-label="Final call to action"
          className="space-y-6 rounded-3xl border border-[#e3d7c5] bg-[#efe5d8] px-6 py-10 text-center"
        >
          <h2 className="text-2xl font-semibold">
            Ready for your next roast?
          </h2>
          <p className="text-base leading-relaxed text-[#4a4037]">
            Explore current roast batches or learn more about the farms behind
            Café Reyna.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <ShopCTAButton />
            <a
              href="#our-farmers"
              className="rounded-full border border-[#cdbda7] px-5 py-2.5 text-base"
            >
              Meet the farmers
            </a>
          </div>
        </section>

        {/* 10. Footer */}
        <section id="footer" aria-label="Site footer" className="mt-8">
          <footer className="space-y-6 border-t border-[#e3d7c5] pt-6 text-base">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="font-medium">Café Reyna</div>
              <nav className="flex flex-wrap gap-4">
                <a href="#hero">Home</a>
                <a href="#our-coffee">Coffee</a>
                <a href="#why-cafe-reyna">About</a>
                <a href="#bulk-orders">Contact</a>
              </nav>
            </div>
            <div className="flex flex-col gap-2 border-t border-[#e3d7c5] pt-4 text-xs text-[#6b5a4a] md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} Café Reyna. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#">Instagram</a>
                <a href="#">Email</a>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
    </BatchCountProvider>
  );
}
