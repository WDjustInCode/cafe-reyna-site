'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const GRINDS = ['Whole Bean', 'Espresso', 'Pour Over', 'Drip', 'French Press', 'Cold Brew'] as const;
const ROASTS = ['Medium', 'Dark'] as const;
const GRIND_STORAGE_KEY = 'cafe-reyna-grind';

function toKey(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function RoastGrindSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedRoast = searchParams.get('roast') ?? '';
  const [selectedGrind, setSelectedGrind] = useState('');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(GRIND_STORAGE_KEY);
      if (saved) setSelectedGrind(saved);
    } catch { /* ignore */ }
  }, []);

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

  const toggleGrind = (grind: string) => {
    const key = toKey(grind);
    const next = selectedGrind === key ? '' : key;
    setSelectedGrind(next);
    try {
      if (next) sessionStorage.setItem(GRIND_STORAGE_KEY, next);
      else sessionStorage.removeItem(GRIND_STORAGE_KEY);
    } catch { /* ignore */ }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Choose how you brew</h2>
        <p className="max-w-md text-base leading-relaxed text-[#4a4037]">
          Every batch is roasted with home brewing in mind. We grind to match your
          brew method, or ship whole bean if you prefer.
        </p>
      </div>
      <div className="space-y-4">
        {/* Roast */}
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

        <div className="border-t border-[#e3d7c5]" />

        {/* Grind */}
        <div className="grid grid-cols-2 gap-3">
          {GRINDS.map((grind) => {
            const isSelected = selectedGrind === toKey(grind);
            return (
              <button
                key={grind}
                type="button"
                onClick={() => toggleGrind(grind)}
                className={`rounded-lg border px-3 py-3 text-base text-left transition-colors ${
                  isSelected
                    ? 'border-[#6b3e26] bg-[#6b3e26] text-white'
                    : 'border-[#e3d7c5] bg-[#f8f2e8] text-[#2a2a2a] hover:border-[#6b3e26]'
                }`}
              >
                {grind}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
