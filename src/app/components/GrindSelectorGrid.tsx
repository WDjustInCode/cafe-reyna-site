'use client';

import { useState } from 'react';

const GRINDS = ['Whole Bean', 'Espresso', 'Pour Over', 'Drip', 'French Press', 'Cold Brew'] as const;
const GRIND_STORAGE_KEY = 'cafe-reyna-grind';

function toKey(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function GrindSelectorGrid() {
  const [selected, setSelected] = useState(() => {
    if (typeof window === 'undefined') return 'whole-bean';
    try { return sessionStorage.getItem(GRIND_STORAGE_KEY) ?? 'whole-bean'; } catch { return 'whole-bean'; }
  });

  const handleSelect = (grind: string) => {
    const key = toKey(grind);
    const next = selected === key ? '' : key;
    setSelected(next);
    try {
      if (next) sessionStorage.setItem(GRIND_STORAGE_KEY, next);
      else sessionStorage.removeItem(GRIND_STORAGE_KEY);
    } catch { /* ignore */ }
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {GRINDS.map((grind) => {
        const isSelected = selected === toKey(grind);
        return (
          <button
            key={grind}
            type="button"
            onClick={() => handleSelect(grind)}
            className={`flex min-h-20 flex-col justify-center rounded-lg border px-3 py-2 text-left text-base transition-colors ${
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
  );
}
