'use client';

import { useBatchCount } from './BatchCountContext';

export function ShopCTAButton() {
  const { filteredCount } = useBatchCount();
  const label = filteredCount === 1 ? 'Build Your Bag' : 'Shop current coffee';

  return (
    <a
      href="#our-coffee"
      className="inline-flex items-center rounded-full bg-[#6b3e26] px-5 py-2.5 text-base font-medium text-white"
    >
      {label}
    </a>
  );
}
