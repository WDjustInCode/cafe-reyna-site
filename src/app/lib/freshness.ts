// Freshness schedule, counted in calendar months from the roast date, with
// each step starting at midnight US Eastern (matches the Shopify checkout
// discounts CR Ops schedules):
//   under 1 month   full price
//   1 to 2 months   15% off  ("Great Value")
//   2 to 3 months   30% off  ("Roast Clearance")
//   3 months +      removed from the site
// e.g. roasted 10/14 → 15% from 11/14, 30% from 12/14, removed 1/14.
const VALUE_MONTHS = 1;
const CLEARANCE_MONTHS = 2;
const MAX_MONTHS = 3;
const TIME_ZONE = 'America/New_York';

type YMD = { y: number; m: number; d: number };

/** Roast date as a calendar date. Accepts YYYY-MM-DD or an ISO string (date part is used). */
function roastYmd(roastDate: string): YMD {
  const [y, m, d] = roastDate.slice(0, 10).split('-').map(Number);
  return { y, m, d };
}

/** Today's calendar date in US Eastern, regardless of server/browser time zone. */
function todayYmd(): YMD {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

const toUtcDay = ({ y, m, d }: YMD) => Date.UTC(y, m - 1, d) / 86_400_000;

/** Roast date + n calendar months (day clamped to the month's length). */
function addMonths({ y, m, d }: YMD, n: number): YMD {
  const total = y * 12 + (m - 1) + n;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const lastDay = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  return { y: ny, m: nm, d: Math.min(d, lastDay) };
}

/** Whole calendar months since roasting, as of today in US Eastern. */
export function getMonthsOld(roastDate: string): number {
  const roast = roastYmd(roastDate);
  const today = toUtcDay(todayYmd());
  let months = 0;
  while (months < 120 && toUtcDay(addMonths(roast, months + 1)) <= today) months++;
  return months;
}

export function getDaysOld(roastDate: string): number {
  return Math.max(0, toUtcDay(todayYmd()) - toUtcDay(roastYmd(roastDate)));
}

export function isVisible(roastDate: string): boolean {
  return getMonthsOld(roastDate) < MAX_MONTHS;
}

/** Freshness meter: 10 segments draining over the 3 months a batch is listed. */
export function getFilledSegments(roastDate: string): number {
  const roast = roastYmd(roastDate);
  const span = toUtcDay(addMonths(roast, MAX_MONTHS)) - toUtcDay(roast);
  const percentRemaining = Math.max(0, (span - getDaysOld(roastDate)) / span);
  return Math.round(percentRemaining * 10);
}

export type FreshnessState = 'fresh' | 'value' | 'clearance';

export function getFreshnessState(roastDate: string): FreshnessState {
  const months = getMonthsOld(roastDate);
  if (months < VALUE_MONTHS) return 'fresh';
  if (months < CLEARANCE_MONTHS) return 'value';
  return 'clearance';
}

export function getFreshnessBadgeLabel(state: FreshnessState): string {
  if (state === 'fresh') return 'Fresh Roast';
  if (state === 'value') return 'Great Value · 15% Off';
  return 'Roast Clearance · 30% Off';
}

export type StockStatus = 'low' | 'selling-fast' | 'available';

export function getStockStatus(remainingLb: number): StockStatus {
  if (remainingLb < 5) return 'low';
  if (remainingLb < 15) return 'selling-fast';
  return 'available';
}

export function getDiscountedPrice(basePrice: number, roastDate: string): number {
  const state = getFreshnessState(roastDate);
  if (state === 'fresh') return basePrice;
  if (state === 'value') return basePrice * 0.85;
  return basePrice * 0.7;
}
