'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const ROASTS = ['Medium', 'Dark'] as const;

function toKey(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function RoastGrindSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedRoast = searchParams.get('roast') ?? '';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggleRoast = (roast: string) => {
    const key = toKey(roast);
    updateParam('roast', selectedRoast === key ? '' : key);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <h2>Choose your roast</h2>
        <p className="max-w-md text-base leading-relaxed text-[#4a4037]">
          All coffee ships whole bean — grind fresh at home for the best cup.
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {ROASTS.map((roast) => {
            const isSelected = selectedRoast === toKey(roast);
            return (
              <button
                key={roast}
                type="button"
                onClick={() => toggleRoast(roast)}
                className={`rounded-lg border px-3 py-3 text-base text-left transition-colors ${
                  isSelected
                    ? 'border-[#6b3e26] bg-[#6b3e26] text-white'
                    : 'border-[#e3d7c5] bg-[#f8f2e8] text-[#2a2a2a] hover:border-[#6b3e26]'
                }`}
              >
                {roast}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
