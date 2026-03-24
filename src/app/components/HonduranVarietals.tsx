'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Varietal {
  name: string;
  description: string;
  commonIn: string;
  oftenExpresses: string;
}

const VARIETALS: Varietal[] = [
  {
    name: 'Catuai',
    description: 'A widely grown Honduran varietal known for balance, sweetness, and dependable cup quality.',
    commonIn: 'Copán, Montecillos, Opalaca, Comayagua, El Paraíso, Agalta',
    oftenExpresses: 'chocolate, citrus, soft fruit, caramel',
  },
  {
    name: 'Bourbon',
    description: 'A classic Arabica varietal valued for sweetness, depth, and a rounded cup.',
    commonIn: 'Copán, Montecillos, parts of Comayagua',
    oftenExpresses: 'caramel, red fruit, cocoa',
  },
  {
    name: 'Caturra',
    description: 'A compact Bourbon mutation often associated with brightness, clarity, and a clean structure.',
    commonIn: 'Montecillos, Comayagua, El Paraíso',
    oftenExpresses: 'citrus, brown sugar, clean acidity',
  },
  {
    name: 'Lempira',
    description: 'A Honduras-developed hybrid widely planted for resilience, consistency, and approachable cup character.',
    commonIn: 'Opalaca, Comayagua, Agalta, El Paraíso',
    oftenExpresses: 'cocoa, nuts, mild fruit',
  },
  {
    name: 'IHCAFE 90',
    description: 'A varietal developed in Honduras and commonly grown for strong performance and balanced cup structure.',
    commonIn: 'multiple Honduran growing regions',
    oftenExpresses: 'sweetness, light fruit, chocolate, balanced body',
  },
  {
    name: 'Pacas',
    description: 'A Bourbon-related varietal that can produce a sweet, approachable, and elegant cup.',
    commonIn: 'Copán, Montecillos, western Honduras',
    oftenExpresses: 'caramel, stone fruit, soft acidity',
  },
  {
    name: 'Typica',
    description: "One of coffee's oldest varietals, prized for delicacy and a refined, understated profile.",
    commonIn: 'smaller quantities in higher-elevation areas',
    oftenExpresses: 'floral tones, citrus, gentle sweetness',
  },
  {
    name: 'Parainema',
    description: 'A more modern Honduran varietal known for distinctive fruit-forward character and lively complexity.',
    commonIn: 'El Paraíso, Agalta, eastern Honduras',
    oftenExpresses: 'tropical fruit, spice, lively acidity',
  },
];

interface HonduranVarietalsProps {
  varietalInventory?: Record<string, number>;
}

export function HonduranVarietals({ varietalInventory }: HonduranVarietalsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedVarietal = searchParams.get('varietal') ?? '';

  function handleVarietalClick(name: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedVarietal.toLowerCase() === name.toLowerCase()) {
      params.delete('varietal');
    } else {
      params.set('varietal', name);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }

  return (
    <section
      aria-label="Common varietals across Honduras"
      className="relative overflow-hidden py-20 sm:py-24 bg-cover bg-center"
      style={{
        backgroundImage: "url('/varietal-bg.jpg')",
        marginLeft: 'calc(-50vw + 50%)',
        width: '100vw',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-black/40 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 md:px-10">
        {/* Intro row: text left, SVG right on md+; SVG below text on mobile */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <header className="space-y-3 md:max-w-[70%]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f4ede4]/60">
              Honduran Coffee
            </p>
            <h2 className="text-2xl font-semibold text-[#f4ede4]!" >Common Varietals Across Honduras</h2>
            <p className="max-w-2xl text-base leading-relaxed text-[#f4ede4]/80">
              Honduran coffee is shaped not only by region, altitude, and processing, but also by varietal.
              These are some of the coffee plant varieties most commonly grown across the country&rsquo;s major
              producing regions, each contributing its own character to the cup.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-[#f4ede4]/80">
              Select a varietal below to filter the batch grid by plant variety.
            </p>
          </header>
          <div className="flex flex-1 justify-center">
            <Image
              src="/coffee-plant.svg"
              alt="Coffee plant illustration"
              width={200}
              height={220}
              className="opacity-80"
            />
          </div>
        </div>

        {/* Varietal grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VARIETALS.map((v) => {
            const isSelected = selectedVarietal.toLowerCase() === v.name.toLowerCase();
            const lbs = varietalInventory
              ? Object.entries(varietalInventory).find(([k]) => k.toLowerCase() === v.name.toLowerCase())?.[1] ?? 0
              : null;
            const hasInventory = lbs === null || lbs > 0;
            return (
              <button
                key={v.name}
                onClick={() => hasInventory && handleVarietalClick(v.name)}
                disabled={!hasInventory}
                aria-disabled={!hasInventory}
                className={[
                  'flex flex-col justify-start rounded-[10px] border p-6 text-left transition-all duration-200 ease-out',
                  !hasInventory
                    ? 'cursor-not-allowed opacity-40 border-white/15 bg-white/5 backdrop-blur-sm'
                    : isSelected
                      ? 'cursor-pointer border-2 border-[#f4ede4]/70 bg-white/25 backdrop-blur-md shadow-none'
                      : 'cursor-pointer border border-white/20 bg-white/10 backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/15 hover:border-white/30',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl text-[#f4ede4]!">{v.name}</h3>
                  {lbs !== null && (
                    <span className="relative shrink-0 group/lbs">
                      <span className="rounded-full border border-white/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#f4ede4]/60">
                        {lbs} lbs
                      </span>
                      <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-max max-w-[160px] rounded bg-[#2a2a2a] px-2 py-1 text-[11px] leading-tight text-white opacity-0 transition-opacity group-hover/lbs:opacity-100">
                        Coffee on hand from this varietal
                      </span>
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#f4ede4]/75">{v.description}</p>
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f4ede4]/50">
                      Common in
                    </span>
                    <p className="mt-0.5 text-sm text-[#f4ede4]/70">{v.commonIn}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f4ede4]/50">
                      Often expresses
                    </span>
                    <p className="mt-0.5 text-sm text-[#f4ede4]/70">{v.oftenExpresses}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Closing note */}
        <p className="mt-8 text-sm italic text-[#f4ede4]/50">
          Varietal presence varies by farm, lot, and harvest, and flavor expression can shift significantly from one region to another.
        </p>
      </div>
    </section>
  );
}
