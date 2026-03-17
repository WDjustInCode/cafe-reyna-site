'use client';

import Image from 'next/image';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

function useSectionScrollProgress() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el || typeof window === 'undefined') return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }

      const traveled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      setProgress(traveled / totalScrollable);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return { containerRef, progress };
}

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

type ParallaxLayerProps = {
  src: string;
  alt: string;
  from: number;
  to: number;
  progress: number;
  zIndex: number;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
};

function ParallaxLayer({
  src,
  alt,
  from,
  to,
  progress,
  zIndex,
  imageClassName,
  imageStyle,
}: ParallaxLayerProps) {
  const translateY = from + (to - from) * progress;

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: 'transform 0.1s linear',
        zIndex,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={imageClassName ?? 'object-cover'}
        style={imageStyle}
      />
    </div>
  );
}

export function ParallaxHero() {
  const { containerRef, progress } = useSectionScrollProgress();

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const landscapeProgress = Math.min(
    Math.max((clampedProgress - 0.15) / 0.85, 0),
    1,
  );

  const layerTransforms = [
    { from: 0, to: 0 }, // sky, static
    { from: 680, to: 0 }, // distant mountains just peeking at very bottom
    { from: 1020, to: 0 },
    { from: 1480, to: 0 },
    { from: 1820, to: 0 },
    { from: 2160, to: 0 }, // closest foreground travels the furthest
  ];

  const logoPhase = Math.min(clampedProgress / 0.4, 1);
  const logoBaseOffset = -40;
  const logoTranslateY = logoBaseOffset + -260 * logoPhase;
  const logoOpacity = Math.max(0, 1 - logoPhase * 1.2);

  const cardPhase = Math.min(Math.max((clampedProgress - 0.55) / 0.45, 0), 1);
  const cardOpacity = cardPhase;
  const cardTranslateY = 80 * (1 - cardPhase);

  return (
    <section
      id="hero"
      aria-label="Café Reyna hero"
      className="relative w-full"
    >
      <div ref={containerRef} className="relative h-[260vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#b4d7ff]">
          <div className="absolute inset-0">
            <ParallaxLayer
              src="/hero image layer 0 (base).png"
              alt="Sky over Honduran mountains"
              from={layerTransforms[0].from}
              to={layerTransforms[0].to}
              progress={clampedProgress}
              zIndex={0}
              imageClassName="object-cover object-top"
            />
            <ParallaxLayer
              src="/hero image layer 1.png"
              alt="Distant mountain range"
              from={layerTransforms[1].from}
              to={layerTransforms[1].to}
              progress={landscapeProgress}
              zIndex={1}
              imageClassName="object-cover"
              imageStyle={{ objectPosition: 'center 30%' }}
            />
            <ParallaxLayer
              src="/hero image layer 2.png"
              alt="Midground mountains"
              from={layerTransforms[2].from}
              to={layerTransforms[2].to}
              progress={landscapeProgress}
              zIndex={2}
              imageClassName="object-cover object-bottom"
            />
            <ParallaxLayer
              src="/hero image layer 3.png"
              alt="Village and coffee plants"
              from={layerTransforms[3].from}
              to={layerTransforms[3].to}
              progress={landscapeProgress}
              zIndex={3}
              imageClassName="object-cover object-bottom"
            />
            <ParallaxLayer
              src="/hero image layer 4.png"
              alt="Closer foreground coffee plants"
              from={layerTransforms[4].from}
              to={layerTransforms[4].to}
              progress={landscapeProgress}
              zIndex={4}
              imageClassName="object-cover object-bottom"
            />
            <ParallaxLayer
              src="/hero image layer 5A.png"
              alt="Front coffee plants and rocks"
              from={layerTransforms[5].from}
              to={layerTransforms[5].to}
              progress={landscapeProgress}
              zIndex={5}
              imageClassName="object-cover object-bottom"
            />
          </div>

          <div className="pointer-events-none relative z-[35] flex h-full flex-col items-center justify-center">
            <Image
              src="/cafe-reyna-combination-mark.png"
              alt="Café Reyna logo"
              width={640}
              height={360}
              priority
              className="w-[70%] max-w-2xl"
              style={{
                transform: `translateY(${logoTranslateY}px)`,
                opacity: logoOpacity,
                transition: 'transform 0.1s linear, opacity 0.1s linear',
              }}
            />
            <button
              type="button"
              aria-label="Scroll to bottom of hero"
              className="pointer-events-auto mt-[100px] flex shrink-0 cursor-pointer transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-[#6b3e26]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{
                transform: `translateY(${logoTranslateY}px)`,
                opacity: logoOpacity,
                transition: 'transform 0.1s linear, opacity 0.1s linear',
              }}
              onClick={() => {
                const el = containerRef.current;
                if (el) {
                  const top = el.offsetTop + el.offsetHeight - window.innerHeight;
                  smoothScrollTo(top, 2200);
                }
              }}
            >
              <Image
                src="/down-arrow.png"
                alt=""
                width={48}
                height={56}
                className="animate-bean-pulse h-12 w-10 object-contain"
              />
            </button>
          </div>

          <div
            className="pointer-events-none absolute mx-auto max-w-7xl inset-0 z-30 flex items-center justify-start px-6 sm:px-8 md:px-10"
            style={{
              opacity: cardOpacity,
              transform: `translateY(${cardTranslateY}px)`,
              transition: 'transform 0.12s ease-out, opacity 0.12s ease-out',
            }}
          >
            <div className="pointer-events-auto w-full max-w-3xl rounded-[40px] bg-[#f5ebdc] pt-10 px-8 pb-5 shadow-[0_40px_120px_rgba(24,16,8,0.55)] lg:pt-12 lg:px-12 lg:pb-6">
              <div className="space-y-6">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a88a64]">
                  100% Arabica • Organic • Fresh Roast Batches
                </p>
                <h1 className="text-3xl font-semibold leading-tight text-[#3a2b1c] sm:text-4xl md:text-5xl">
                  Awaken your senses with Honduran single-origin coffee
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-[#5b4733] sm:text-base">
                  Sourced from friend & family farms in Honduras. Roasted in
                  small, transparent batches so every bag you brew tastes like
                  a morning in the village.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-full bg-[#6b3e26] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#5a341f]"
                  >
                    Shop Roasts
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[#cdbda7] px-6 py-2.5 text-sm text-[#4a3a29] hover:bg-white/60"
                  >
                    Learn More
                  </button>
                </div>
                <nav className="mt-10 w-full">
                  <div className="flex w-full items-center justify-evenly text-xs uppercase tracking-[0.25em] text-[#5a341f]">
                    <span>Home</span>
                    <span className="select-none text-base leading-none text-[#5a341f]/50">|</span>
                    <span>Products</span>
                    <span className="select-none text-base leading-none text-[#5a341f]/50">|</span>
                    <span>About</span>
                    <span className="select-none text-base leading-none text-[#5a341f]/50">|</span>
                    <span>Contact</span>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div id="hero-bottom" className="absolute bottom-0 left-0 right-0 h-px" aria-hidden="true" />
      </div>
    </section>
  );
}

