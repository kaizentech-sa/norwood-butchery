export interface DeliveryStore {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  description?: string;
}

export interface DeliveryPricing {
  per_km_rate?: number;
  minimum_fee?: number;
  maximum_distance_km?: number;
  free_delivery_threshold?: number;
}

export interface DeliveryOptionsResponse {
  success: boolean;
  store: DeliveryStore | null;
  options: DeliveryOption[];
  pricing: DeliveryPricing | null;
}

export interface DeliveryCalculateRequest {
  optionId: string;
  lat?: number;
  lng?: number;
  cartSubtotal: number;
}

export interface DeliveryCalculateResponse {
  success: boolean;
  available: boolean;
  optionId?: string;
  cost: number;
  costFormatted?: string;
  distanceKm?: number | null;
  message?: string;
}

export interface DeliveryAddress {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
}

export interface SavedDeliverySelection {
  optionId: string;
  optionName: string;
  optionType: string;
  cost: number;
  distanceKm?: number | null;
  lat?: number;
  lng?: number;
  address: DeliveryAddress;
  calculatedAt: string;
}
