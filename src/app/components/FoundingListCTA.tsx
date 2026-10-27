'use client';

import { openSubscribePopup } from './SubscribePopup';

/**
 * Pre-launch stand-in for price + add-to-cart: a "Coming soon" note and a
 * button that reopens the founding-list signup popup.
 */
export function FoundingListCTA({ variant = 'card' }: { variant?: 'card' | 'panel' }) {
  const rounded = variant === 'panel' ? 'rounded-full px-5' : 'rounded-md';
  return (
    <div className="space-y-3">
      <div>
        <p className="text-base font-semibold text-[#2a2a2a]">Coming soon</p>
        <p className="mt-0.5 text-xs text-[#7a6a5a]">
          Orders open once our state permit comes through.
        </p>
      </div>
      <button
        type="button"
        onClick={openSubscribePopup}
        className={`block w-full cursor-pointer ${rounded} bg-[#6b3e26] py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-[#56311f]`}
      >
        Join the founding list
      </button>
    </div>
  );
}
