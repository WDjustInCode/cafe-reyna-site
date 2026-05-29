'use client';

import Image from 'next/image';

function smoothScrollTo(targetTop: number, durationMs: number) {
  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / durationMs, 1);
    const eased = 1 - (1 - t) * (1 - t);
    window.scrollTo(0, startTop + distance * eased);
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export function ParallaxHero() {
  return (
    <section id="hero" aria-label="Café Reyna hero" className="relative w-full">
      <div className="md:hidden">
        <Image
          src="/hero-mobile.png"
          alt="Honduran coffee landscape"
          width={771}
          height={991}
          priority
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>
      <div className="hidden md:block">
        <Image
          src="/hero-2.png.jpg"
          alt="Honduran coffee landscape"
          width={2091}
          height={887}
          priority
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>

      {/* Mobile gradient: top-down */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#000]/65 via-[#000]/30 to-transparent md:hidden" />
      {/* Desktop gradient: left-to-right */}
      <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-[#000]/50 from-0% to-transparent to-60%" />

      <div className="absolute inset-0 flex items-start md:items-center justify-center md:justify-start pt-8 sm:pt-12 md:pt-2 px-6 sm:px-10 md:px-20 lg:px-30 xl:px-40 2xl:px-50">
        <div className="hero-card-enter w-[90%] rounded-none bg-transparent p-0 md:w-[55vw] lg:w-[45vw] 2xl:w-[40vw] sm:max-w-2xl text-center md:text-left">
          <div className="space-y-2 lg:space-y-2 xl:space-y-4 2xl:space-y-5">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-[#f5ebdc] sm:text-[clamp(0.59rem,0.8vw,0.75rem)]">
              100% Arabica · Organic · Fresh Roast
            </p>
            <h1 className="heading-hero leading-snug tracking-wide text-[#f5ebdc]">
              Honduran{' '}
              <span className="whitespace-nowrap">single-origin</span> <br />coffee
            </h1>
            <p className="sm:text-lg leading-relaxed text-[#f5ebdc]/90 md:hidden lg:block lg:w-[35vw]">
              Sourced from friend &amp; family farms in Honduras. Roasted in
              small, transparent batched. Priced by freshness.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
              <a
                href="#our-coffee"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('our-coffee');
                  if (el) smoothScrollTo(el.offsetTop, 900);
                }}
                className="rounded-full bg-[#f5ebdc] px-6 py-2.5 text-sm sm:text-[clamp(0.75rem,1.2vw,1rem)] font-medium text-[#3a2b1c] shadow-sm hover:bg-white"
              >
                Shop Coffee
              </a>
              <a
                href="#how-our-coffee-works"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('how-our-coffee-works');
                  if (el) smoothScrollTo(el.offsetTop, 900);
                }}
                className="rounded-full border border-[#f5ebdc] px-6 py-2.5 text-sm text-[#f5ebdc] hover:bg-white/20 sm:text-[clamp(0.75rem,1.2vw,1rem)]"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
