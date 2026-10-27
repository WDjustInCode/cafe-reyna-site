// Coffee data now lives in Shopify (metaobjects linked to products), read
// through the public Storefront API. MockAPI.io is retired but left intact.
//
//   product ─ bag.current_batch ─▶ roast_batch ─ lot ─▶ coffee_lot ─ farm ─▶ coffee_farm ─ farmers ─▶ coffee_farmer
//                                                         └─ awards ─▶ coffee_award
//
// Price and stock come from the product variant. Stock is shown in pounds
// (bags × 0.75 lb per 12oz bag).
//
// Pre-launch (SALES_OPEN false, see sales.ts) the products are Draft and hidden
// from the Storefront API, so batches are read straight from the roast_batch
// metaobjects instead, with no price, stock, or variant.
import type {
  ApiAward,
  BatchCardViewModel,
  FarmerCardViewModel,
  FarmerPageViewModel,
  FarmSectionViewModel,
  LotCardViewModel,
} from './types';
import { isVisible } from './freshness';
import { storefrontFetch } from './shopify';
import { SALES_OPEN } from './sales';

const BAG_WEIGHT_LB = 0.75;
const ISR = { next: { revalidate: 300 } } as const;

// Farm photos in /public are still numbered (farm1.webp, farm2.webp), and the
// card/farmer-page styling is keyed by that number. Map Shopify farm handles
// onto them until farms get an image field in Shopify.
const FARM_IMAGE_ID: Record<string, string> = {
  'finca-deborah': '1',
  'los-arroyos': '2',
};

// ── Raw Storefront shapes ────────────────────────────────────────────────

interface MetaField {
  key: string;
  value: string | null;
  reference?: Metaobject | null;
  references?: { nodes: Metaobject[] } | null;
}

interface Metaobject {
  id: string;
  handle: string;
  fields: MetaField[];
}

interface ProductNode {
  handle: string;
  availableForSale: boolean;
  variants: {
    nodes: Array<{
      id: string;
      price: { amount: string };
      availableForSale: boolean;
      quantityAvailable?: number | null;
    }>;
  };
  currentBatch: { reference: Metaobject | null } | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function field(mo: Metaobject | null | undefined, key: string): MetaField | undefined {
  return mo?.fields.find((f) => f.key === key);
}

function str(mo: Metaobject | null | undefined, key: string): string | null {
  return field(mo, key)?.value ?? null;
}

function num(mo: Metaobject | null | undefined, key: string): number | null {
  const v = str(mo, key);
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function list(mo: Metaobject | null | undefined, key: string): string[] {
  const v = str(mo, key);
  if (!v) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.map((x) => String(x).trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function ref(mo: Metaobject | null | undefined, key: string): Metaobject | null {
  return field(mo, key)?.reference ?? null;
}

function refs(mo: Metaobject | null | undefined, key: string): Metaobject[] {
  return field(mo, key)?.references?.nodes ?? [];
}

function formatElevation(min: number | null | undefined, max?: number | null): string | null {
  if (min == null) return null;
  const lo = min.toLocaleString();
  if (max != null) return `${lo} – ${max.toLocaleString()} m`;
  return `${lo} m`;
}

/**
 * Shopify date fields are YYYY-MM-DD. Pin to noon UTC so the calendar date is
 * the same on the server (UTC) and in US browsers; freshness.ts reads the
 * date part only.
 */
function dateToIso(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return `${value}T12:00:00.000Z`;
}

/** Same-site photo URLs become relative paths so next/image serves them locally. */
function photoSrc(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/^https?:\/\/(www\.)?cafereyna\.com/, '');
}

function toAward(mo: Metaobject): ApiAward {
  return {
    title: str(mo, 'title') ?? '',
    place_or_score: str(mo, 'place_or_score') ?? '',
    description: str(mo, 'description') ?? undefined,
  };
}

// ── Queries ──────────────────────────────────────────────────────────────

const FIELDS = `fields { key value }`;

const BATCHES_QUERY = `
  query Batches {
    products(first: 100) {
      nodes {
        handle
        availableForSale
        variants(first: 1) {
          nodes { id price { amount } availableForSale QUANTITY }
        }
        currentBatch: metafield(namespace: "bag", key: "current_batch") {
          reference {
            ... on Metaobject {
              id handle
              fields {
                key value
                reference {
                  ... on Metaobject {
                    id handle
                    fields {
                      key value
                      reference { ... on Metaobject { id handle ${FIELDS} } }
                      references(first: 20) { nodes { ... on Metaobject { id handle ${FIELDS} } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

// Pre-launch: same batch → lot → farm shape, read from the metaobjects
// directly (works while the products are Draft).
const BATCH_METAOBJECTS_QUERY = `
  query BatchMetaobjects {
    metaobjects(type: "roast_batch", first: 100) {
      nodes {
        id handle
        fields {
          key value
          reference {
            ... on Metaobject {
              id handle
              fields {
                key value
                reference { ... on Metaobject { id handle ${FIELDS} } }
                references(first: 20) { nodes { ... on Metaobject { id handle ${FIELDS} } } }
              }
            }
          }
        }
      }
    }
  }`;

const FARMERS_QUERY = `
  query Farmers {
    farmers: metaobjects(type: "coffee_farmer", first: 50) { nodes { id handle ${FIELDS} } }
    farms: metaobjects(type: "coffee_farm", first: 50) {
      nodes {
        id handle
        fields {
          key value
          references(first: 20) { nodes { ... on Metaobject { id handle } } }
        }
      }
    }
    lots: metaobjects(type: "coffee_lot", first: 100) {
      nodes {
        id handle
        fields {
          key value
          reference { ... on Metaobject { id handle } }
          references(first: 20) { nodes { ... on Metaobject { id handle ${FIELDS} } } }
        }
      }
    }
  }`;

async function queryBatchProducts(): Promise<ProductNode[]> {
  // quantityAvailable needs the unauthenticated_read_product_inventory scope
  // on the Headless storefront token. Ask for it, and fall back without it.
  try {
    const data = await storefrontFetch<{ products: { nodes: ProductNode[] } }>(
      BATCHES_QUERY.replace('QUANTITY', 'quantityAvailable'),
      undefined,
      ISR,
    );
    return data.products.nodes;
  } catch (err) {
    if (!(err instanceof Error) || !/quantityAvailable/.test(err.message)) throw err;
    const data = await storefrontFetch<{ products: { nodes: ProductNode[] } }>(
      BATCHES_QUERY.replace('QUANTITY', ''),
      undefined,
      ISR,
    );
    return data.products.nodes;
  }
}

// ── Batches ──────────────────────────────────────────────────────────────

interface SalesInfo {
  basePrice: number | null;
  remainingWeightLb: number | null;
  shopifyVariantId: string | null;
  shopifyHandle: string | null;
}

const NO_SALES: SalesInfo = {
  basePrice: null,
  remainingWeightLb: null,
  shopifyVariantId: null,
  shopifyHandle: null,
};

/** roast_batch metaobject (with nested lot and farm) → card view model. */
function toBatchViewModel(
  batch: Metaobject | null | undefined,
  sales: SalesInfo,
): BatchCardViewModel | null {
  const lot = ref(batch, 'lot');
  const farm = ref(lot, 'farm');
  const roastDate = dateToIso(str(batch, 'roast_date'));
  if (!batch || !lot || !farm || !roastDate) return null;

  return {
    batchId: batch.handle,
    batchCode: str(batch, 'batch_code') ?? batch.handle,
    farmId: FARM_IMAGE_ID[farm.handle] ?? farm.handle,
    farmName: str(farm, 'name') ?? '',
    lotCode: str(lot, 'lot_code') ?? lot.handle,
    origin: str(farm, 'region') ?? 'Honduras',
    process: str(lot, 'process') ?? '',
    varietal: list(lot, 'varietals'),
    roastLevel: str(batch, 'roast_level') ?? '',
    roastDate,
    notes: list(lot, 'tasting_notes'),
    elevation: formatElevation(num(farm, 'elevation_m'), num(farm, 'elevation_m_max')),
    ...sales,
  };
}

const newestFirst = (a: BatchCardViewModel, b: BatchCardViewModel) =>
  new Date(b.roastDate).getTime() - new Date(a.roastDate).getTime();

/** Sales open: batches come from the products on sale, with price and stock. */
async function fetchSaleBatchViewModels(): Promise<BatchCardViewModel[]> {
  const products = await queryBatchProducts();

  return products
    .flatMap((product): BatchCardViewModel[] => {
      const variant = product.variants.nodes[0];
      if (!variant || !variant.availableForSale) return [];

      const qty = variant.quantityAvailable;
      const vm = toBatchViewModel(product.currentBatch?.reference, {
        basePrice: Number(variant.price.amount),
        remainingWeightLb: typeof qty === 'number' ? qty * BAG_WEIGHT_LB : null,
        shopifyVariantId: variant.id,
        shopifyHandle: product.handle,
      });
      return vm ? [vm] : [];
    })
    .filter((vm) => isVisible(vm.roastDate) && (vm.remainingWeightLb ?? 1) > 0)
    .sort(newestFirst);
}

/** Pre-launch: batches straight from the roast_batch metaobjects, no sales data. */
async function fetchPrelaunchBatchViewModels(): Promise<BatchCardViewModel[]> {
  const data = await storefrontFetch<{ metaobjects: { nodes: Metaobject[] } }>(
    BATCH_METAOBJECTS_QUERY,
    undefined,
    ISR,
  );
  return data.metaobjects.nodes
    .flatMap((batch) => {
      const vm = toBatchViewModel(batch, NO_SALES);
      return vm ? [vm] : [];
    })
    .filter((vm) => isVisible(vm.roastDate))
    .sort(newestFirst);
}

export function fetchAllBatchViewModels(): Promise<BatchCardViewModel[]> {
  return SALES_OPEN ? fetchSaleBatchViewModels() : fetchPrelaunchBatchViewModels();
}

export async function fetchBatchById(batchId: string): Promise<BatchCardViewModel | null> {
  const batches = await fetchAllBatchViewModels();
  return batches.find((vm) => vm.batchId === batchId) ?? null;
}

// Inventory rollups (lb of roasted coffee on sale) for the home-page sections.
// Returns null when no batch has a known weight (pre-launch, or no inventory
// scope), so the sections stay clickable and hide their lb counts instead of
// looking sold out. Otherwise a batch with unknown stock counts as 0 lb.
type Rollup = (vm: BatchCardViewModel) => string[];

async function rollup(keysFor: Rollup): Promise<Record<string, number> | null> {
  const batches = await fetchAllBatchViewModels();
  const lbUnknown =
    !SALES_OPEN || (batches.length > 0 && batches.every((vm) => vm.remainingWeightLb == null));
  if (lbUnknown) return null;
  const inventory: Record<string, number> = {};
  for (const vm of batches) {
    const lb = vm.remainingWeightLb ?? 0;
    for (const key of keysFor(vm)) inventory[key] = (inventory[key] ?? 0) + lb;
  }
  return inventory;
}

export function fetchProcessInventory(): Promise<Record<string, number> | null> {
  return rollup((vm) => (vm.process ? [vm.process.toLowerCase()] : []));
}

export function fetchVarietalInventory(): Promise<Record<string, number> | null> {
  return rollup((vm) => vm.varietal);
}

export function fetchRegionInventory(): Promise<Record<string, number> | null> {
  return rollup((vm) => (vm.origin ? [vm.origin] : []));
}

// ── Farmers ──────────────────────────────────────────────────────────────

interface FarmerData {
  farmers: { nodes: Metaobject[] };
  farms: { nodes: Metaobject[] };
  lots: { nodes: Metaobject[] };
}

async function queryFarmerData(): Promise<FarmerData> {
  return storefrontFetch<FarmerData>(FARMERS_QUERY, undefined, ISR);
}

function toFarmerCard(mo: Metaobject): FarmerCardViewModel {
  return {
    id: mo.handle,
    name: str(mo, 'name') ?? mo.handle,
    region: str(mo, 'region'),
    country: str(mo, 'country'),
    story: str(mo, 'story'),
    photoSrc: photoSrc(str(mo, 'photo_url')),
  };
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

export async function fetchFarmers(): Promise<FarmerCardViewModel[]> {
  const { farmers } = await queryFarmerData();
  return farmers.nodes.map(toFarmerCard).sort(byName);
}

export async function fetchFarmerPageData(): Promise<FarmerPageViewModel[]> {
  const { farmers, farms, lots } = await queryFarmerData();

  const lotsByFarmId = new Map<string, Metaobject[]>();
  for (const lot of lots.nodes) {
    const farmId = ref(lot, 'farm')?.id;
    if (!farmId) continue;
    lotsByFarmId.set(farmId, [...(lotsByFarmId.get(farmId) ?? []), lot]);
  }

  return farmers.nodes
    .map(toFarmerCard)
    .sort(byName)
    .map((farmer): FarmerPageViewModel => {
      const farmerGid = farmers.nodes.find((f) => f.handle === farmer.id)?.id;
      const farmerFarms = farms.nodes.filter((farm) =>
        refs(farm, 'farmers').some((f) => f.id === farmerGid),
      );

      const farmSections: FarmSectionViewModel[] = farmerFarms.map((farm) => {
        const lotCards: LotCardViewModel[] = (lotsByFarmId.get(farm.id) ?? []).map((lot) => {
          const awards = refs(lot, 'awards').map(toAward);
          return {
            lotId: lot.handle,
            lotCode: str(lot, 'lot_code') ?? lot.handle,
            varietal: list(lot, 'varietals'),
            process: str(lot, 'process') ?? '',
            awards,
            hasAwards: awards.length > 0,
          };
        });
        return {
          farmId: FARM_IMAGE_ID[farm.handle] ?? farm.handle,
          farmName: str(farm, 'name') ?? farm.handle,
          region: str(farm, 'region'),
          elevationM: formatElevation(num(farm, 'elevation_m'), num(farm, 'elevation_m_max')),
          lots: lotCards,
        };
      });

      return {
        farmerId: farmer.id,
        farmerName: farmer.name,
        location: [farmer.region, farmer.country].filter(Boolean).join(', '),
        story: farmer.story,
        hasPortrait: farmer.photoSrc != null,
        portraitSrc: farmer.photoSrc,
        farms: farmSections,
      };
    })
    .filter((f) => f.farms.length > 0);
}
