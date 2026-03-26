import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import type { BatchCardViewModel } from '@/app/lib/types';
import {
  getDaysOld,
  getFilledSegments,
  getFreshnessState,
  getFreshnessBadgeLabel,
  getDiscountedPrice,
  getStockStatus,
  type FreshnessState,
  type StockStatus,
} from '@/app/lib/freshness';

function FreshnessMeter({ daysOld }: { daysOld: number }) {
  const filled = getFilledSegments(daysOld);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[2px]">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="h-[6px] w-[12px] rounded-sm"
            style={{ backgroundColor: i < filled ? '#6b3e26' : '#e3d7c5' }}
          />
        ))}
      </div>
      <span className="text-xs text-[#7a6a5a]">{daysOld}d</span>
    </div>
  );
}

function MetaCell({ icon, label, value, iconSize = 'w-8 h-8' }: { icon: string; label: string; value: React.ReactNode; iconSize?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${iconSize} shrink-0`}>
        <Image src={icon} alt="" fill className="opacity-80 object-contain" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7a6a5a]">{label}</p>
        <p className="mt-0.5 text-base capitalize text-[#2a2a2a]">{value}</p>
      </div>
    </div>
  );
}

const farmImageClass: Record<string, string> = {
  '4': 'object-cover scale-[1.15] transition-transform duration-500 ease-out group-hover:scale-[1.25]',
  '5': 'object-cover scale-[1.15] transition-transform duration-500 ease-out group-hover:scale-[1.25]',
};

const badgeStyles: Record<FreshnessState, string> = {
  fresh: 'bg-[#e8f5e9] text-[#2e7d32]',
  value: 'bg-[#fff8e1] text-[#f57c00]',
  clearance: 'bg-[#f5f0eb] text-[#7a6a5a]',
};

const stockBadgeStyles: Record<StockStatus, string> = {
  low: 'bg-[#fdecea] text-[#c62828]',
  'selling-fast': 'bg-[#fff3e0] text-[#e65100]',
  available: '',
};

export function BatchCard({ vm }: { vm: BatchCardViewModel }) {
  const daysOld = getDaysOld(vm.roastDate);
  const state = getFreshnessState(daysOld);
  const badgeLabel = getFreshnessBadgeLabel(state);
  const price = getDiscountedPrice(vm.basePrice, daysOld);
  const stockStatus = getStockStatus(vm.remainingWeightLb);
  const roastDateFormatted = new Date(vm.roastDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group flex flex-col rounded-[10px] border border-[#e3d7c5] bg-[#f8f2e8] overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#d4c3ad]">
      {/* Farm image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden">
        <Image
          src={`/farm${vm.farmId}.jpg`}
          alt={vm.farmName}
          fill
          className={farmImageClass[vm.farmId] ?? 'object-cover transition-transform duration-500 ease-out group-hover:scale-105'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-col flex-1 p-7">
      {/* Identity */}
      <header className="mb-4 space-y-0.5">
        <h3 className="normal-case text-xl font-semibold leading-tight text-[#2a2a2a]">
          {vm.farmName}
        </h3>
        <p className="text-base text-[#2a2a2a]"><span className="text-[#7a6a5a]">Batch</span> <span className="font-mono">{vm.batchCode}</span></p>
        <p className="text-base text-[#4a4037]"><span className="text-[#7a6a5a]">Region</span> {vm.origin}</p>
      </header>

      {/* Two-column metadata + notes */}
      <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <MetaCell icon="/farm-lot.svg" label="Lot" value={vm.lotCode} />
        <MetaCell icon="/process.svg" label="Process" value={vm.process} />
        <MetaCell icon="/coffee-plant-grid.svg" label="Varietal" value={vm.varietal} />
        <MetaCell icon="/roast.svg" label="Roast" value={vm.roastLevel} />
        <MetaCell icon="/calendar.svg" label="Roast Date" value={<span className="normal-case">{roastDateFormatted}</span>} iconSize="w-[26px] h-[26px]" />
        <MetaCell
          icon="/elevation.svg"
          label="Elevation"
          value={vm.elevation != null ? `${vm.elevation.toLocaleString()} m` : '—'}
        />
      </div>

      {/* Tasting notes pills */}
      {vm.notes.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-[#7a6a5a]">Notes</p>
          <div className="flex flex-wrap gap-1.5">
            {vm.notes.map((note) => (
              <span
                key={note}
                className="rounded-full border border-[#e3d7c5] bg-transparent px-2.5 py-0.5 text-xs capitalize text-[#4a4037]"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Freshness — single column */}
      <div className="mb-6 space-y-2">
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-[#7a6a5a]">
            Freshness
          </p>
          <FreshnessMeter daysOld={daysOld} />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${badgeStyles[state]}`}>
            {badgeLabel}
          </span>
          {stockStatus !== 'available' && (
            <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${stockBadgeStyles[stockStatus]}`}>
              {stockStatus === 'low' ? 'Almost Gone' : 'Selling Fast'}
            </span>
          )}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="mt-auto space-y-3">
        <p className="text-base font-semibold text-[#2a2a2a]">
          ${price.toFixed(2)}{' '}
          {state !== 'fresh' && (
            <span className="ml-1 text-xs font-normal text-[#7a6a5a] line-through">
              ${vm.basePrice.toFixed(2)}
            </span>
          )}
        </p>
        <Link
          href={`/coffee/${vm.batchId}`}
          className="block w-full rounded-md bg-[#6b3e26] py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-[#56311f]"
        >
          Build Your Bag
        </Link>
      </div>
      </div>
    </article>
  );
}
