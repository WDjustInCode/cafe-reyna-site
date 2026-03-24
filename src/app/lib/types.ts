export interface ApiFarm {
  id: string;
  name: string;
  region?: string;
  elevation_m: number;
  farmer_id: string;
}

export interface ApiAward {
  title: string;
  place_or_score: string;
  description?: string;
}

export interface ApiLot {
  id: string;
  farm_id: string;
  lot_code: string;
  process: string;
  varietal: string;
  arrival_date: number;
  notes: string[];
  awards?: ApiAward[];
  remaining_green_weight_lb?: number;
}

export interface ApiRoastBatch {
  id: string;
  lot_id: string;
  location_id: string;
  batch_code: string;
  roast_level: string;
  roast_date: number;         // Unix timestamp in seconds
  roasted_weight_lb: number;
  remaining_roasted_weight_lb: number;
  note: string;
  basePrice: number;
  status: string;
  created_at: string;
}

export interface ApiFarmer {
  id: string;
  name: string;
  region?: string;
  country?: string;
  story?: string;
  'photo-url'?: string;
  'created-at'?: string;
}

export interface LotCardViewModel {
  lotId: string;
  lotCode: string;
  varietal: string;
  process: string;
  awards: ApiAward[];
  hasAwards: boolean;
}

export interface FarmSectionViewModel {
  farmId: string;
  farmName: string;
  region: string | null;
  elevationM: number | null;
  lots: LotCardViewModel[];
}

export interface FarmerPageViewModel {
  farmerId: string;
  farmerName: string;
  location: string;
  story: string | null;
  hasPortrait: boolean;
  portraitSrc: string | null;
  farms: FarmSectionViewModel[];
}

export interface BatchCardViewModel {
  batchId: string;
  batchCode: string;
  farmId: string;
  farmName: string;
  lotCode: string;
  origin: string;
  process: string;
  varietal: string;
  roastLevel: string;
  roastDate: string;
  notes: string[];
  basePrice: number;
  remainingWeightLb: number;
  elevation: number | null;
}
