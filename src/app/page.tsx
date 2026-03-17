import Image from 'next/image';
import { ParallaxHero } from './components/ParallaxHero';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4ede4] text-[#2a2a2a]">
      <ParallaxHero />

      <main className="mx-auto flex max-w-7xl flex-col gap-80 px-6 pb-24 pt-6 sm:px-8 md:px-10">
        {/* 1. Header (appears after hero scroll) */}
        <section id="header" aria-label="Site header">
          <div className="flex items-center justify-between border-b border-[#e3d7c5] pb-4">
            <Image
              src="/crown-logo.png"
              alt="Café Reyna"
              width={105}
              height={35}
              className="h-[35px] w-auto object-contain"
            />
            <nav className="hidden gap-8 text-sm md:flex">
              <a href="#current-coffee">Current Coffee</a>
              <a href="#how-our-coffee-works">How It Works</a>
              <a href="#bulk-orders">Bulk Orders</a>
              <a href="#why-cafe-reyna">Why Café Reyna</a>
            </nav>
            <button
              type="button"
              className="rounded-full border border-[#cdbda7] px-4 py-1 text-sm"
            >
              Cart
            </button>
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
            <p className="text-sm leading-[1.7] text-[#4a4037]">
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
              <p className="text-sm leading-[1.7] text-[#4a4037]">
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
              <p className="text-sm leading-[1.7] text-[#4a4037]">
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
              <p className="text-sm leading-[1.7] text-[#4a4037]">
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
              <p className="text-sm leading-[1.7] text-[#4a4037]">
                Finally, choose the grind that matches your favorite brew method,
                or keep the beans whole if you love to grind fresh at home.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Current Coffee Available */}
        <section
          id="current-coffee"
          aria-label="Current coffee available"
          className="space-y-8"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Current Roasts
            </p>
            <h2 className="text-2xl font-semibold">Freshly roasted batches</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-[#4a4037]">
              Browse our latest roast batches, each tied to a specific farm,
              lot, and roast date. Pricing adjusts based on freshness.
            </p>
          </header>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] p-5">
              <h3 className="text-sm font-semibold">Batch card placeholder</h3>
            </article>
            <article className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] p-5">
              <h3 className="text-sm font-semibold">Batch card placeholder</h3>
            </article>
            <article className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] p-5">
              <h3 className="text-sm font-semibold">Batch card placeholder</h3>
            </article>
          </div>
        </section>

        {/* 5. Washed vs Honey */}
        <section
          id="washed-vs-honey"
          aria-label="Washed versus honey processed coffee"
          className="space-y-8"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Process
            </p>
            <h2 className="text-2xl font-semibold">Washed vs honey.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#e7dccd] bg-white/40 p-5">
              <h3 className="text-sm font-semibold">Washed</h3>
            </div>
            <div className="rounded-xl border border-[#e7dccd] bg-white/40 p-5">
              <h3 className="text-sm font-semibold">Honey</h3>
            </div>
          </div>
        </section>

        {/* 6. Roast + Grind */}
        <section
          id="roast-and-grind"
          aria-label="Roast and grind options"
          className="space-y-8"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Roast &amp; Grind
            </p>
            <h2 className="text-2xl font-semibold">Choose how you brew.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="max-w-md text-sm leading-relaxed text-[#4a4037]">
                Every batch is roasted with home brewing in mind. We grind to
                match your brew method, or ship whole bean if you prefer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-3 text-sm">
                Whole Bean
              </div>
              <div className="rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-3 text-sm">
                Espresso
              </div>
              <div className="rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-3 text-sm">
                Pour Over
              </div>
              <div className="rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-3 text-sm">
                Drip
              </div>
              <div className="rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-3 text-sm">
                French Press
              </div>
              <div className="rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-3 text-sm">
                Cold Brew
              </div>
            </div>
          </div>
        </section>

        {/* 7. Bulk Orders */}
        <section
          id="bulk-orders"
          aria-label="Bulk orders"
          className="space-y-6"
        >
          <div className="rounded-2xl border border-[#e3d7c5] bg-[#efe1cf] p-6 md:flex md:items-center md:justify-between md:gap-10">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
                Bulk Orders
              </p>
              <h2 className="text-xl font-semibold">
                Coffee for the office, café, or events.
              </h2>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex items-center rounded-full bg-[#6b3e26] px-5 py-2.5 text-sm font-medium text-white md:mt-0"
            >
              Get in touch
            </button>
          </div>
        </section>

        {/* 8. Why Café Reyna */}
        <section
          id="why-cafe-reyna"
          aria-label="Why Café Reyna"
          className="space-y-8"
        >
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Why Café Reyna
            </p>
            <h2 className="text-2xl font-semibold">
              Origin-first, freshness-driven coffee.
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Origin-focused</h3>
            </div>
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Fresh roast batches</h3>
            </div>
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Traceable lots</h3>
            </div>
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Brew-method aware</h3>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <section
          id="final-cta"
          aria-label="Final call to action"
          className="space-y-6 rounded-3xl border border-[#e3d7c5] bg-[#efe5d8] px-6 py-10 text-center"
        >
          <h2 className="text-2xl font-semibold">
            Ready for your next roast?
          </h2>
          <p className="text-sm leading-relaxed text-[#4a4037]">
            Explore current roast batches or learn more about the farms behind
            Café Reyna.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              className="rounded-full bg-[#6b3e26] px-5 py-2.5 text-sm font-medium text-white"
            >
              Shop current coffee
            </button>
            <button
              type="button"
              className="rounded-full border border-[#cdbda7] px-5 py-2.5 text-sm"
            >
              Meet the farmers
            </button>
          </div>
        </section>

        {/* 10. Footer */}
        <section id="footer" aria-label="Site footer" className="mt-8">
          <footer className="space-y-6 border-t border-[#e3d7c5] pt-6 text-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="font-medium">Café Reyna</div>
              <nav className="flex flex-wrap gap-4">
                <a href="#hero">Home</a>
                <a href="#current-coffee">Coffee</a>
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
  );
}
