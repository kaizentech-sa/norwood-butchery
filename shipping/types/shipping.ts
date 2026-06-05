/**
 * Sam's Hardware Shipping Types
 * 
 * TypeScript interfaces for shipping functionality.
 */

// ============================================================================
// Address Types
// ============================================================================

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  suburb?: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface BobGoAddress {
  street_address: string;
  local_area?: string;
  city: string;
  zone: string;
  country: string;
  code: string;
  company?: string;
}

// ============================================================================
// Item Types
// ============================================================================

export interface ShippingItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
}

export interface BobGoItem {
  sku?: string;
  description: string;
  quantity: number;
  value: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

// ============================================================================
// Shipping Rate Types
// ============================================================================

export interface ShippingRate {
  serviceName: string;
  serviceCode: string;
  carrierCode?: string;
  price: number;
  currency: string;
  deliveryTime?: string;
  description?: string;
  isDefault?: boolean;
}

export interface BobGoRate {
  service_name: string;
  service_code: string;
  carrier_code?: string;
  carrier_name?: string;
  rate: number;
  rate_currency: string;
  delivery_date_from?: string;
  delivery_date_to?: string;
  min_delivery_days?: number;
  max_delivery_days?: number;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface ShippingRatesRequest {
  origin?: ShippingAddress;
  destination: ShippingAddress;
  items: ShippingItem[];
  currency?: string;
}

export interface BobGoRatesRequest {
  collection_address: BobGoAddress;
  delivery_address: BobGoAddress;
  parcels: BobGoItem[];
}

export interface ShippingRatesResponse {
  success: boolean;
  rates: ShippingRate[];
  error?: string;
  message?: string;
}

// ============================================================================
// Cart Item with Shipping
// ============================================================================

export interface CartItemWithShipping {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
}

// ============================================================================
// Selected Shipping
// ============================================================================

export interface SelectedShipping {
  rate: ShippingRate;
  selectedAt: string;
}
