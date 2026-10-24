// Freshness schedule (days since roast):
//   0–29 full price · 30–59 15% off · 60–89 30% off (clearance) · 90+ removed
const VALUE_DAYS = 30;
const CLEARANCE_DAYS = 60;
const MAX_DAYS = 90;

export function getDaysOld(roastDateIso: string): number {
  const roastDate = new Date(roastDateIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  roastDate.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - roastDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function isVisible(daysOld: number): boolean {
  return daysOld < MAX_DAYS;
}

export function getFilledSegments(daysOld: number): number {
  const percentRemaining = Math.max(0, (MAX_DAYS - daysOld) / MAX_DAYS);
  return Math.round(percentRemaining * 10);
}

export type FreshnessState = 'fresh' | 'value' | 'clearance';

export function getFreshnessState(daysOld: number): FreshnessState {
  if (daysOld < VALUE_DAYS) return 'fresh';
  if (daysOld < CLEARANCE_DAYS) return 'value';
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

export function getDiscountedPrice(basePrice: number, daysOld: number): number {
  if (daysOld < VALUE_DAYS) return basePrice;
  if (daysOld < CLEARANCE_DAYS) return basePrice * 0.85;
  return basePrice * 0.7;
}
