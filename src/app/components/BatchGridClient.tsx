'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { BatchCardViewModel } from '@/app/lib/types';
import { BatchCard } from './BatchCard';
import { useBatchCount } from './BatchCountContext';

type DateSort = 'desc' | 'asc';

function stripDiacritics(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeFilter(s: string) {
  return stripDiacritics(s).toLowerCase();
}

const KNOWN_VARIETALS = [
  'Catuai', 'Bourbon', 'Caturra', 'Lempira',
  'IHCAFE 90', 'Pacas', 'Typica', 'Parainema',
];

// URL-synced filter keys
type UrlFilterKey = 'process' | 'region' | 'roast' | 'varietal';

// Local-only filter state (not in URL)
interface LocalFilters {
  farm: string;
  lot: string;
  notes: string[];
  dateSort: DateSort;
}

const defaultLocalFilters: LocalFilters = {
  farm: '',
  lot: '',
  notes: [],
  dateSort: 'desc',
};

const FILTER_STORAGE_KEY = 'cafe-reyna-batch-filters';
const URL_FILTER_KEYS: UrlFilterKey[] = ['process', 'region', 'roast', 'varietal'];

function SelectFilter({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const sizerRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (sizerRef.current) setWidth(sizerRef.current.offsetWidth + 24);
  }, [value, placeholder]);

  return (
    <div className="relative inline-block">
      {/* Hidden sizer span — measures rendered text width */}
      <span
        ref={sizerRef}
        aria-hidden
        className="invisible absolute whitespace-nowrap px-2.5 py-1.5 text-sm"
      >
        {value || placeholder}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={width ? { width } : undefined}
        className="rounded-md border border-[#e3d7c5] bg-transparent px-2.5 py-1.5 text-sm text-[#2a2a2a] focus:border-[#6b3e26] focus:outline-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function BatchGridClient({ batches }: { batches: BatchCardViewModel[] }) {
  const { setFilteredCount } = useBatchCount();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasRestoredRef = useRef(false);

  // URL-derived filters — read directly from searchParams, no state copy needed.
  // External selectors (ProcessCard, RoastGrindSelector, HondurasRegions) update the URL
  // and this component re-renders with the new values automatically.
  const urlProcess = searchParams.get('process') ?? '';
  const urlRegion = searchParams.get('region') ?? '';
  const urlRoast = searchParams.get('roast') ?? '';
  const urlVarietal = searchParams.get('varietal') ?? '';

  // Local-only filters (not controlled by URL)
  const [localFilters, setLocalFilters] = useState<LocalFilters>(defaultLocalFilters);

  // Restore filters from sessionStorage on mount (e.g. navigating back from detail page)
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const hasUrlFilters = URL_FILTER_KEYS.some(k => searchParams.get(k));
    if (hasUrlFilters) return;
    try {
      const raw = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (!raw) return;
      const { urlFilters, localFilters: savedLocal } = JSON.parse(raw) as {
        urlFilters: Record<string, string>;
        localFilters: LocalFilters;
      };
      const params = new URLSearchParams();
      URL_FILTER_KEYS.forEach(k => { if (urlFilters[k]) params.set(k, urlFilters[k]); });
      const qs = params.toString();
      if (qs) router.replace(`${pathname}?${qs}`, { scroll: false });
      setLocalFilters(savedLocal);
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save all filters to sessionStorage whenever they change
  useEffect(() => {
    try {
      const urlFilters = Object.fromEntries(
        URL_FILTER_KEYS.map(k => [k, searchParams.get(k) ?? ''])
      );
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({ urlFilters, localFilters }));
    } catch { /* ignore */ }
  }, [searchParams, localFilters]);

  // Combined filter object for filter logic and display
  const filters = useMemo(() => ({
    farm: localFilters.farm,
    lot: localFilters.lot,
    notes: localFilters.notes,
    dateSort: localFilters.dateSort,
    process: urlProcess,
    region: urlRegion,
    roast: urlRoast,
    varietal: urlVarietal,
  }), [localFilters, urlProcess, urlRegion, urlRoast, urlVarietal]);

  // Write a URL-synced filter param directly (no state round-trip)
  function setUrlFilter(key: UrlFilterKey, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setLocalFilter<K extends keyof LocalFilters>(key: K, value: LocalFilters[K]) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearAllFilters() {
    try { sessionStorage.removeItem(FILTER_STORAGE_KEY); } catch { /* ignore */ }
    setLocalFilters(defaultLocalFilters);
    const params = new URLSearchParams(searchParams.toString());
    URL_FILTER_KEYS.forEach(k => params.delete(k));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleNote(note: string) {
    setLocalFilters((prev) => ({
      ...prev,
      notes: prev.notes.includes(note)
        ? prev.notes.filter((n) => n !== note)
        : [...prev.notes, note],
    }));
  }

  const options = useMemo(
    () => ({
      farms: [...new Set(batches.map((b) => b.farmName))].sort(),
      regions: [...new Set(batches.map((b) => b.origin))].sort(),
      lots: [...new Set(batches.map((b) => b.lotCode))].sort(),
      varietals: [...new Set([...KNOWN_VARIETALS, ...batches.map((b) => b.varietal)])].sort(),
      processes: [...new Set(batches.map((b) => b.process))].sort(),
      roasts: [...new Set(batches.map((b) => b.roastLevel))].sort(),
      notes: [...new Set(batches.flatMap((b) => b.notes))].sort(),
    }),
    [batches],
  );

  const filtered = useMemo(() => {
    let result = [...batches];
    if (filters.farm) result = result.filter((b) => b.farmName === filters.farm);
    if (filters.region) result = result.filter((b) => normalizeFilter(b.origin) === normalizeFilter(filters.region));
    if (filters.lot) result = result.filter((b) => b.lotCode === filters.lot);
    if (filters.varietal) result = result.filter((b) => b.varietal.toLowerCase() === filters.varietal.toLowerCase());
    if (filters.process) result = result.filter((b) => b.process.toLowerCase() === filters.process.toLowerCase());
    if (filters.roast) result = result.filter((b) => (b.roastLevel ?? '').toLowerCase() === filters.roast.toLowerCase());
    if (filters.notes.length > 0) {
      result = result.filter((b) => filters.notes.some((n) => b.notes.includes(n)));
    }
    if (filters.dateSort === 'asc') {
      result.sort((a, b) => new Date(a.roastDate).getTime() - new Date(b.roastDate).getTime());
    }
    return result;
  }, [batches, filters]);

  useEffect(() => {
    setFilteredCount(filtered.length);
  }, [filtered.length, setFilteredCount]);

  const isFiltered =
    filters.farm ||
    filters.region ||
    filters.lot ||
    filters.varietal ||
    filters.process ||
    filters.roast ||
    filters.notes.length > 0 ||
    filters.dateSort !== 'desc';

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] px-4 py-3">
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-2">
          <SelectFilter
            placeholder="All Farms"
            value={filters.farm}
            options={options.farms}
            onChange={(v) => setLocalFilter('farm', v)}
          />
          <SelectFilter
            placeholder="All Regions"
            value={filters.region}
            options={options.regions}
            onChange={(v) => setUrlFilter('region', v)}
          />
          <SelectFilter
            placeholder="All Lots"
            value={filters.lot}
            options={options.lots}
            onChange={(v) => setLocalFilter('lot', v)}
          />
          <SelectFilter
            placeholder="All Varietals"
            value={filters.varietal}
            options={options.varietals}
            onChange={(v) => setUrlFilter('varietal', v)}
          />
          <SelectFilter
            placeholder="All Processes"
            value={filters.process}
            options={options.processes}
            onChange={(v) => setUrlFilter('process', v)}
          />
          <SelectFilter
            placeholder="All Roasts"
            value={filters.roast}
            options={options.roasts}
            onChange={(v) => setUrlFilter('roast', v)}
          />

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-[#e3d7c5]" />

          {/* Date sort */}
          <button
            onClick={() => setLocalFilter('dateSort', filters.dateSort === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 rounded-md border border-[#e3d7c5] bg-transparent px-2.5 py-1.5 text-sm text-[#4a4037] hover:border-[#6b3e26] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d={filters.dateSort === 'desc' ? 'M6 2v8M3 7l3 3 3-3' : 'M6 10V2M3 5l3-3 3 3'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{filters.dateSort === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          {/* Clear */}
          {isFiltered && (
            <button
              onClick={clearAllFilters}
              className="ml-auto rounded-md border border-[#e3d7c5] bg-transparent px-2.5 py-1.5 text-sm text-[#4a4037] hover:border-[#6b3e26] transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Notes pills */}
        {options.notes.length > 0 && (
          <>
            <div className="my-3 border-t border-[#e3d7c5]" />
            <div className="flex flex-wrap gap-2">
              {options.notes.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleNote(note)}
                  className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                    filters.notes.includes(note)
                      ? 'border-[#6b3e26] bg-[#6b3e26] text-white'
                      : 'border-[#e3d7c5] bg-transparent text-[#4a4037] hover:border-[#6b3e26]'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] px-8 py-10 text-center">
          <p className="text-base text-[#4a4037]">No batches match your filters.</p>
          <button
            onClick={clearAllFilters}
            className="mt-3 text-sm text-[#6b3e26] underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((vm) => (
            <BatchCard key={vm.batchId} vm={vm} />
          ))}
        </div>
      )}
    </div>
  );
}
