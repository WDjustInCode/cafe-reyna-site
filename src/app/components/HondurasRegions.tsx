'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const regions = [
  {
    name: 'Copán',
    filterKey: 'Copán',
    bean: '/copan.svg',
    elevation: '1,000–1,500m',
    profile: 'Chocolate, caramel, soft citrus',
    description:
      'Located in western Honduras near Guatemala, Copán produces balanced coffees with smooth body and classic sweetness. An approachable profile with comforting chocolate notes and gentle citrus brightness.',
    highlight: false,
  },
  {
    name: 'Montecillos',
    bean: '/montecillos.svg',
    elevation: '1,200–1,700m',
    profile: 'Bright acidity, red fruit, floral',
    description:
      'Home to Marcala, Montecillos is one of Honduras\u2019 most recognized coffee regions. High elevations and cooler temperatures help produce vibrant, layered coffees with elegant fruit and floral character.',
    highlight: false,
  },
  {
    name: 'Opalaca',
    bean: '/Opalaca.svg',
    elevation: '1,400–1,800m',
    profile: 'Crisp, citrus, light body',
    description:
      'This mountainous region is known for clean cups, lively acidity, and delicate structure. Coffees from Opalaca often feel refined and high-toned, with citrus-driven clarity.',
    highlight: false,
  },
  {
    name: 'Comayagua',
    bean: '/comayagua.svg',
    elevation: '1,100–1,600m',
    profile: 'Sweet, nutty, mild fruit',
    description:
      'Comayagua produces smooth, versatile coffees with balanced sweetness and soft fruit notes. Its profile lands in a comfortable middle ground that works well across roast styles.',
    highlight: false,
  },
  {
    name: 'El Paraíso',
    filterKey: 'El Paraiso',
    bean: '/el paraiso.svg',
    elevation: '1,200–1,600m',
    profile: 'Bright, tropical fruit, sweet finish',
    description:
      'Bordering Nicaragua, El Paraíso benefits from warm days and cool nights that support pronounced sweetness and lively fruit character. Coffees here show a vivid and energetic cup profile.',
    highlight: false,
  },
  {
    name: 'Agalta',
    bean: '/agalta.svg',
    elevation: '1,200–1,700m',
    profile: 'Deep body, cocoa, spice',
    description:
      'Agalta, in eastern Honduras, is known for fuller-bodied coffees with richer cocoa depth and rustic spice notes. It brings a bolder, more grounded expression of Honduran coffee.',
    highlight: false,
  },
];

interface HondurasRegionsProps {
  regionInventory?: Record<string, number>;
}

export function HondurasRegions({ regionInventory }: HondurasRegionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeRegion = searchParams.get('region') ?? '';

  function handleRegionClick(filterKey: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeRegion === filterKey) {
      params.delete('region');
    } else {
      params.set('region', filterKey);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <section
      id="honduras-regions"
      aria-label="Honduras coffee regions"
      className="space-y-14"
    >
      {/* Intro Band */}
      <header className="space-y-3 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
          The Origin
        </p>
        <h2 className="text-2xl font-semibold">
          The Coffee Regions of Honduras
        </h2>
        <p className="text-base leading-[1.7] text-[#4a4037]">
          Honduras is one of the most diverse coffee-producing countries in the
          world. From high-altitude mountain farms to humid forest
          microclimates, each region expresses a distinct cup shaped by
          elevation, terrain, climate, and local tradition.
        </p>
      </header>

      {/* Map + Framing Copy */}
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
        <div className="w-full md:w-[55%]">
          <Image
            src="/honduras-regions.svg"
            alt="Map of Honduras coffee-growing regions"
            width={800}
            height={508}
            className="w-full h-auto"
            priority={false}
          />
        </div>
        <div className="flex flex-col gap-6 md:w-[45%]">
          <p className="text-base leading-[1.7] text-[#4a4037] italic border-l-2 border-[#cdbda7] pl-4">
            From western highlands to eastern mountain ranges, Honduran coffee
            grows across a remarkably varied landscape.
          </p>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
              Featured Regions
            </p>
            <ul className="space-y-1.5 text-base text-[#4a4037]">
              {regions.map((r) => (
                <li key={r.name} className="flex items-center gap-2">
                  <Image
                    src={r.bean}
                    alt={`${r.name} region`}
                    width={18}
                    height={19}
                    className="shrink-0"
                  />
                  <span className={r.highlight ? 'font-medium text-[#2a2a2a]' : ''}>
                    {r.name}
                    {r.highlight && (
                      <span className="ml-2 text-xs text-[#7a6a5a] font-normal">
                        Includes Marcala
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Region Card Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => {
          const key = region.filterKey ?? region.name;
          const selected = activeRegion === key;
          const lbs = regionInventory ? (regionInventory[key] ?? 0) : null;
          const hasInventory = lbs === null || lbs > 0;
          return (
          <button
            key={region.name}
            onClick={() => hasInventory && handleRegionClick(key)}
            disabled={!hasInventory}
            aria-disabled={!hasInventory}
            className={[
              'flex flex-col gap-3 rounded-lg border p-5 text-left transition-all duration-200',
              !hasInventory
                ? 'cursor-not-allowed opacity-75 border-[#e3d7c5] bg-transparent'
                : selected
                  ? 'cursor-pointer border-2 border-[#6b3e26] bg-[#f5ede0] shadow-none'
                  : 'cursor-pointer border-[#e3d7c5] bg-[#faf6f0] hover:-translate-y-0.5',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-[#2a2a2a]">
                {region.name}
              </h3>
              {lbs !== null && (
                <span className="relative shrink-0 group/lbs">
                  <span className="rounded-full border border-[#e3d7c5] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#7a6a5a]">
                    {lbs} lbs
                  </span>
                  <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-max max-w-[160px] rounded bg-[#2a2a2a] px-2 py-1 text-[11px] leading-tight text-white opacity-0 transition-opacity group-hover/lbs:opacity-100">
                    Coffee on hand from this region
                  </span>
                </span>
              )}
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#7a6a5a]">
              {region.elevation}
            </p>
            <p className="text-sm font-medium text-[#6b3e26]">
              {region.profile}
            </p>
            <p className="text-sm leading-[1.7] text-[#4a4037]">
              {region.description}
            </p>
          </button>
          );
        })}
      </div>

      {/* Closing Statement */}
      <div className="border-t border-[#e3d7c5] pt-10">
        <p className="mx-auto max-w-3xl text-base leading-[1.8] text-[#4a4037] md:text-center">
          We source our coffee from regions like Marcala in Montecillos, where
          altitude, climate, and tradition come together to produce exceptional
          beans. Every bag reflects not just a roast, but an origin story.
        </p>
      </div>
    </section>
  );
}
