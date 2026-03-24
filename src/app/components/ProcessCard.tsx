'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface ProcessCardProps {
  process: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  lbs?: number;
}

export function ProcessCard({ process, title, description, imageSrc, imageAlt, lbs }: ProcessCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = searchParams.get('process')?.toLowerCase() === process.toLowerCase();
  const hasInventory = lbs === undefined || lbs > 0;

  function handleClick() {
    if (!hasInventory) return;
    const params = new URLSearchParams(searchParams.toString());
    if (selected) {
      params.delete('process');
    } else {
      params.set('process', process);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <button
      onClick={handleClick}
      disabled={!hasInventory}
      aria-disabled={!hasInventory}
      className={[
        'group relative overflow-hidden rounded-2xl w-full text-left border-[6px] transition-colors duration-200',
        !hasInventory
          ? 'cursor-not-allowed opacity-75 border-transparent'
          : `cursor-pointer ${selected ? 'border-[#6b3e26]' : 'border-transparent'}`,
      ].join(' ')}
      style={{ minHeight: '360px' }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Selection badge */}
      {selected && (
        <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-sm bg-[#6b3e26]">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
            <path
              d="M1.5 7L6.5 12L16.5 1.5"
              stroke="#f4ede4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="flex items-center justify-between gap-2.5">
          <h3 className="text-lg font-semibold !text-[#e8ddd2]">{title}</h3>
          {lbs !== undefined && (
            <span className="relative group/pill">
              <span className="rounded-full bg-[#f4ede4] px-2.5 py-0.5 text-[11px] font-medium text-[#6b3e26]">
                {lbs} lbs
              </span>
              <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md bg-[#2a2a2a] px-2.5 py-1 text-[11px] text-white opacity-0 transition-opacity duration-150 group-hover/pill:opacity-100">
                Coffee on hand processed this way
                <span className="absolute top-full right-3 -translate-x-1/2 border-4 border-transparent border-t-[#2a2a2a]" />
              </span>
            </span>
          )}
        </div>
        <p className="mt-2 text-base leading-relaxed text-[#e8ddd2]" style={{ minHeight: '70px' }}>
          {description}
        </p>
      </div>
    </button>
  );
}
