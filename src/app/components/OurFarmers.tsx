import Image from 'next/image';
import Link from 'next/link';
import { fetchFarmers } from '../lib/api';

const FARMER_IMAGE_COUNT = 3;

export async function OurFarmers() {
  let farmers;
  try {
    farmers = await fetchFarmers();
  } catch {
    return null;
  }

  if (!farmers.length) return null;

  return (
    <section id="our-farmers" aria-label="Our farmers" className="space-y-16">
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
          Our Farmers
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          The people behind every cup
        </h2>
        <p className="text-base leading-[1.7] text-[#4a4037]">
          Café Reyna sources directly from friend and family-owned farms in
          Honduras. Every batch traces back to one of these growers.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {farmers.map((farmer) => {
          const imageNum = parseInt(farmer.id, 10);
          const hasImage = imageNum >= 1 && imageNum <= FARMER_IMAGE_COUNT;
          const location = [farmer.region, farmer.country]
            .filter(Boolean)
            .join(', ');

          return (
            <Link key={farmer.id} href={`/farmers/${farmer.id}`} className="group flex flex-col gap-4">
              {hasImage && (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={`/farmer${imageNum}.jpg`}
                    alt={farmer.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{farmer.name}</h3>
                {location && (
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#7a6a5a]">
                    {location}
                  </p>
                )}
                {farmer.story && (
                  <p className="pt-1 text-base leading-[1.7] text-[#4a4037]">
                    {farmer.story}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
