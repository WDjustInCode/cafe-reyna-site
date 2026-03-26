import type { ApiAward, ApiFarm, ApiFarmer, ApiLot, ApiRoastBatch, BatchCardViewModel, FarmerPageViewModel, FarmSectionViewModel, LotCardViewModel } from './types';
import { getDaysOld, isVisible } from './freshness';

const BASE = 'https://69b80a0effbcd02860970059.mockapi.io';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed: ${url} — ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchFarmers(): Promise<ApiFarmer[]> {
  const res = await fetch(`${BASE}/farmers`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Fetch failed: /farmers — ${res.status}`);
  return res.json() as Promise<ApiFarmer[]>;
}

export async function fetchFarmerPageData(): Promise<FarmerPageViewModel[]> {
  const isr = { next: { revalidate: 300 } } as const;

  const [farmers, farms, lots] = await Promise.all([
    fetch(`${BASE}/farmers`, isr).then((r) => r.json() as Promise<ApiFarmer[]>),
    fetch(`${BASE}/farm`, isr).then((r) => r.json() as Promise<ApiFarm[]>),
    fetch(`${BASE}/lot`, isr).then((r) => r.json() as Promise<ApiLot[]>),
  ]);

  const lotsByFarmId = new Map<string, ApiLot[]>();
  for (const lot of lots) {
    const existing = lotsByFarmId.get(lot.farm_id) ?? [];
    existing.push(lot);
    lotsByFarmId.set(lot.farm_id, existing);
  }

  const farmsByFarmerId = new Map<string, ApiFarm[]>();
  for (const farm of farms) {
    const existing = farmsByFarmerId.get(farm.farmer_id) ?? [];
    existing.push(farm);
    farmsByFarmerId.set(farm.farmer_id, existing);
  }

  return farmers
    .map((farmer): FarmerPageViewModel => {
      const n = parseInt(farmer.id, 10);
      const hasPortrait = n >= 1 && n <= 3;

      const farmerFarms = farmsByFarmerId.get(farmer.id) ?? [];

      const farmSections: FarmSectionViewModel[] = farmerFarms.map((farm) => {
        const farmLots = lotsByFarmId.get(farm.id) ?? [];
        const lotCards: LotCardViewModel[] = farmLots.map((lot) => {
          const awards: ApiAward[] = Array.isArray(lot.awards) ? lot.awards : [];
          return {
            lotId: lot.id,
            lotCode: lot.lot_code ?? lot.id,
            varietal: lot.varietal,
            process: lot.process,
            awards,
            hasAwards: awards.length > 0,
          };
        });
        return {
          farmId: farm.id,
          farmName: farm.name,
          region: farm.region ?? null,
          elevationM: farm.elevation_m ?? null,
          lots: lotCards,
        };
      });

      return {
        farmerId: farmer.id,
        farmerName: farmer.name,
        location: [farmer.region, farmer.country].filter(Boolean).join(', '),
        story: farmer.story ?? null,
        hasPortrait,
        portraitSrc: hasPortrait ? `/farmer${n}.jpg` : null,
        farms: farmSections,
      };
    })
    .filter((f) => f.farms.length > 0)
    .sort((a, b) => {
      const na = parseInt(a.farmerId, 10);
      const nb = parseInt(b.farmerId, 10);
      if (Number.isNaN(na) && Number.isNaN(nb)) return 0;
      if (Number.isNaN(na)) return 1;
      if (Number.isNaN(nb)) return -1;
      return na - nb;
    });
}

export async function fetchProcessInventory(): Promise<Record<string, number>> {
  const lots = await fetch(`${BASE}/lot`, { next: { revalidate: 300 } }).then(
    (r) => r.json() as Promise<ApiLot[]>,
  );

  const inventory: Record<string, number> = {};
  for (const lot of lots) {
    if (!lot.process) continue;
    const key = lot.process.toLowerCase();
    inventory[key] = (inventory[key] ?? 0) + (lot.remaining_green_weight_lb ?? 0);
  }
  return inventory;
}

export async function fetchVarietalInventory(): Promise<Record<string, number>> {
  const lots = await fetch(`${BASE}/lot`, { next: { revalidate: 300 } }).then(
    (r) => r.json() as Promise<ApiLot[]>,
  );

  const inventory: Record<string, number> = {};
  for (const lot of lots) {
    if (!lot.varietal) continue;
    inventory[lot.varietal] = (inventory[lot.varietal] ?? 0) + (lot.remaining_green_weight_lb ?? 0);
  }
  return inventory;
}

export async function fetchRegionInventory(): Promise<Record<string, number>> {
  const isr = { next: { revalidate: 300 } } as const;
  const [farms, lots] = await Promise.all([
    fetch(`${BASE}/farm`, isr).then((r) => r.json() as Promise<ApiFarm[]>),
    fetch(`${BASE}/lot`, isr).then((r) => r.json() as Promise<ApiLot[]>),
  ]);

  const farmById = new Map(farms.map((f) => [f.id, f]));
  const inventory: Record<string, number> = {};

  for (const lot of lots) {
    const farm = farmById.get(lot.farm_id);
    if (!farm?.region) continue;
    inventory[farm.region] = (inventory[farm.region] ?? 0) + (lot.remaining_green_weight_lb ?? 0);
  }

  return inventory;
}

export async function fetchAllBatchViewModels(): Promise<BatchCardViewModel[]> {
  const [farms, lots, batches] = await Promise.all([
    fetchJson<ApiFarm[]>(`${BASE}/farm`),
    fetchJson<ApiLot[]>(`${BASE}/lot`),
    fetchJson<ApiRoastBatch[]>(`${BASE}/roastBatch`),
  ]);

  const farmById = new Map(farms.map((f) => [f.id, f]));
  const lotById = new Map(lots.map((l) => [l.id, l]));

  return batches
    .flatMap((batch): BatchCardViewModel[] => {
      const lot = lotById.get(batch.lot_id);
      const farm = lot ? farmById.get(lot.farm_id) : undefined;
      if (!lot || !farm) return [];

      return [
        {
          batchId: batch.id,
          batchCode: batch.batch_code,
          farmId: farm.id,
          farmName: farm.name,
          lotCode: lot.lot_code ?? lot.id,
          origin: farm.region ?? 'Honduras',
          process: lot.process,
          varietal: lot.varietal,
          roastLevel: batch.roast_level,
          roastDate: new Date(batch.roast_date * 1000).toISOString(),
          notes: Array.isArray(lot.notes)
            ? lot.notes.map((n: string) => n.trim()).filter(Boolean)
            : [],
          basePrice: batch.basePrice,
          remainingWeightLb: batch.remaining_roasted_weight_lb,
          elevation: farm.elevation_m ?? null,
          shopifyVariantId: batch.shopify_variant_id ?? null,
        },
      ];
    })
    .filter((vm) => isVisible(getDaysOld(vm.roastDate)) && vm.remainingWeightLb > 0)
    .sort((a, b) => new Date(b.roastDate).getTime() - new Date(a.roastDate).getTime());
}

export async function fetchBatchById(batchId: string): Promise<BatchCardViewModel | null> {
  const batches = await fetchAllBatchViewModels();
  return batches.find((vm) => vm.batchId === batchId) ?? null;
}
