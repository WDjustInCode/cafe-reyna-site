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
          src="/mobile-hero.jpg"
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

      <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-10 md:px-10 lg:px-15 2xl:px-35">
        <div className="hero-card-enter w-[90%] rounded-[32px] bg-[#f5ebdc] p-8 xlg:p-10 shadow-[0_20px_60px_rgba(24,16,8,0.75)] backdrop-blur-sm md:w-[45vw] lg:w-[43vw] 2xl:w-[40vw] sm:max-w-2xl md:rounded-[40px]">
          <div className="space-y-2 lg:space-y-3 xl:space-y-4 2xl:space-y-5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#a88a64] sm:text-[clamp(0.59rem,0.8vw,0.75rem)]">
              100% Arabica · Organic · Fresh Roast
            </p>
            <h1 className="text-[1.65rem] font-semibold leading-snug tracking-wide text-[#3a2b1c] sm:text-[clamp(1rem,2.7vw,2.5rem)]">
              Awaken your senses with Honduran{' '}
              <span className="whitespace-nowrap">single-origin</span> coffee
            </h1>
            <p className="text-sm leading-relaxed text-[#5b4733] sm:text-[clamp(0.75rem,1.4vw,1rem)] md:hidden lg:block">
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
                className="rounded-full bg-[#6b3e26] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#5a341f] sm:text-[clamp(0.75rem,1.2vw,1rem)]"
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
                className="rounded-full border border-[#cdbda7] px-6 py-2.5 text-sm text-[#4a3a29] hover:bg-white/60 sm:text-[clamp(0.75rem,1.2vw,1rem)]"
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
