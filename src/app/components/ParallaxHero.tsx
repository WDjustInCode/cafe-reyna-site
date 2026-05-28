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
      <Image
        src="/hero-2.png.jpg"
        alt="Honduran coffee landscape"
        width={2091}
        height={887}
        priority
        sizes="100vw"
        className="w-full h-auto"
      />

      <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-10 md:px-16">
        <div className="hero-card-enter w-full max-w-lg rounded-[32px] bg-[#f5ebdc]/95 px-7 py-9 shadow-[0_40px_120px_rgba(24,16,8,0.55)] backdrop-blur-sm sm:px-9 sm:py-11 md:max-w-xl md:rounded-[40px] md:px-10 md:py-12 lg:max-w-2xl">
          <div className="space-y-5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#a88a64] sm:text-xs">
              100% Arabica · Organic · Fresh Roast Batches
            </p>
            <h1 className="text-[1.65rem] font-semibold leading-snug tracking-wide text-[#3a2b1c] sm:text-[2.1rem] md:text-[2.6rem] lg:text-[3rem]">
              Awaken your senses with Honduran{' '}
              <span className="whitespace-nowrap">single-origin</span> coffee
            </h1>
            <p className="text-sm leading-relaxed text-[#5b4733] sm:text-base">
              Sourced from friend &amp; family farms in Honduras. Roasted in
              small, transparent batches so every bag you brew tastes like a
              morning in the village.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="#our-coffee"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('our-coffee');
                  if (el) smoothScrollTo(el.offsetTop, 900);
                }}
                className="rounded-full bg-[#6b3e26] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#5a341f] sm:text-base"
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
                className="rounded-full border border-[#cdbda7] px-6 py-2.5 text-sm text-[#4a3a29] hover:bg-white/60 sm:text-base"
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
