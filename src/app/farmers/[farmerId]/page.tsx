import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchFarmerPageData } from '../../lib/api';
import type { ApiAward, FarmSectionViewModel, LotCardViewModel } from '../../lib/types';

interface FarmerPageProps {
  params: Promise<{ farmerId: string }>;
}

export async function generateMetadata({ params }: FarmerPageProps): Promise<Metadata> {
  const { farmerId } = await params;
  const farmers = await fetchFarmerPageData().catch(() => []);
  const farmer = farmers.find((f) => f.farmerId === farmerId);
  return {
    title: farmer ? `${farmer.farmerName} — Café Reyna` : 'Farmer — Café Reyna',
    description: farmer?.story ?? 'Meet the farmers behind Café Reyna.',
  };
}

const farmImageScale: Record<string, string> = {
  '4': 'scale-[1.15] hover:scale-[1.25]',
  '5': 'scale-[1.15] hover:scale-[1.25]',
};

function AwardsTable({ awards }: { awards: ApiAward[] }) {
  return (
    <div className="border-t border-[#e3d7c5] pt-4">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">Awards</p>
      <table className="w-full text-xs text-[#2a2a2a]">
        <thead>
          <tr className="border-b border-[#e3d7c5] text-[11px] uppercase tracking-[0.12em] text-[#7a6a5a]">
            <th className="pb-1.5 pr-4 text-left font-medium">Title</th>
            <th className="pb-1.5 pr-4 text-left font-medium">Place / Score</th>
            <th className="pb-1.5 text-left font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {awards.map((award, i) => (
            <tr key={i} className="border-b border-[#e3d7c5]/60 last:border-0">
              <td className="py-2 pr-4 leading-snug">{award.title}</td>
              <td className="py-2 pr-4 leading-snug text-[#4a4037]">{award.place_or_score}</td>
              <td className="py-2 leading-snug text-[#7a6a5a]">{award.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LotCard({ lot }: { lot: LotCardViewModel }) {
  return (
    <article className="space-y-3 rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] p-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">Lot</p>
        <p className="text-base font-semibold text-[#2a2a2a]">{lot.lotCode}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">Varietal</p>
          <p className="mt-0.5 text-sm capitalize text-[#2a2a2a]">{lot.varietal}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">Process</p>
          <p className="mt-0.5 text-sm capitalize text-[#2a2a2a]">{lot.process}</p>
        </div>
      </div>
      {lot.hasAwards && <AwardsTable awards={lot.awards} />}
    </article>
  );
}

function FarmSection({ farm }: { farm: FarmSectionViewModel }) {
  const scaleClass = farmImageScale[farm.farmId] ?? 'hover:scale-105';

  return (
    <div className="space-y-6 border-t border-[#e3d7c5] pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative h-32 w-40 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={`/farm${farm.farmId}.jpg`}
            alt={farm.farmName}
            fill
            className={`object-cover transition-transform duration-500 ${scaleClass}`}
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">Farm</p>
          <h3 className="text-xl font-semibold">{farm.farmName}</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-sm text-[#4a4037]">
            {farm.region && <span>{farm.region}</span>}
            {farm.elevationM != null && (
              <span>{farm.elevationM.toLocaleString()} m elevation</span>
            )}
          </div>
        </div>
      </div>

      {farm.lots.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farm.lots.map((lot) => (
            <LotCard key={lot.lotId} lot={lot} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#7a6a5a]">No active lots on record for this farm.</p>
      )}
    </div>
  );
}

export default async function FarmerPage({ params }: FarmerPageProps) {
  const { farmerId } = await params;

  let farmer;
  try {
    const farmers = await fetchFarmerPageData();
    farmer = farmers.find((f) => f.farmerId === farmerId);
  } catch {
    farmer = undefined;
  }

  return (
    <div className="min-h-screen bg-[#f4ede4] text-[#2a2a2a]">
      <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-24 pt-6 sm:px-8 md:px-10">
        {/* Header */}
        <header>
          <div className="flex items-center justify-between border-b border-[#e3d7c5] pb-4">
            <Link href="/#our-farmers">
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
              className="cursor-pointer rounded-full border border-[#cdbda7] px-4 py-1 text-base"
            >
              Cart
            </button>
          </div>
        </header>

        {!farmer ? (
          <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] px-8 py-10 text-center">
            <p className="text-base text-[#4a4037]">Farmer profile not found.</p>
          </div>
        ) : (
          <section aria-label={farmer.farmerName} className="space-y-12">
            {/* Portrait + bio */}
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
              {farmer.hasPortrait && farmer.portraitSrc && (
                <div className="relative aspect-[3/4] w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl md:w-[320px]">
                  <Image
                    src={farmer.portraitSrc}
                    alt={farmer.farmerName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-3 pt-2">
                {farmer.location && (
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
                    {farmer.location}
                  </p>
                )}
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {farmer.farmerName}
                </h1>
                {farmer.story && (
                  <p className="max-w-2xl text-base leading-[1.7] text-[#4a4037]">
                    {farmer.story}
                  </p>
                )}
              </div>
            </div>

            {/* Farms */}
            <div className="space-y-10">
              {farmer.farms.map((farm) => (
                <FarmSection key={farm.farmId} farm={farm} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-[#e3d7c5] pt-4 text-xs text-[#6b5a4a]">
          <p>© {new Date().getFullYear()} Café Reyna. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
