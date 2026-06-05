// Product variation interface
export interface ProductVariation {
  id: number;
  sku: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  attributes: Record<string, string>; // e.g., { 'Weight': '2.27kg' }
  image?: string;
  displayName: string; // e.g., "2.27kg"
  description?: string;
  weight?: string;
  soldIndividually?: boolean; // NEW: Sold individually flag for variations
}

// Enhanced product interface with variation support
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: 'simple' | 'variable' | 'grouped' | 'external'; // NEW: Product type
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  description: string;
  shortDescription: string;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  brand?: string;
  variations?: ProductVariation[]; // NEW: Variation details
  variationAttributes?: Record<string, string[]>; // NEW: Attributes for selectors
  upsellIds?: number[]; // NEW: Manually linked upsell products
  relatedIds?: number[]; // NEW: Related products (max 8)
  crossSellIds?: number[]; // NEW: Cross-sell products
  soldIndividually?: boolean; // NEW: Sold individually flag
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Price validation interfaces
export interface PriceValidation {
  productId: number;
  variationId?: number;
  cartPrice: number;
  currentPrice: number;
  priceChanged: boolean;
  priceDifference: number;
}

export interface PriceValidationResponse {
  success: boolean;
  validations: PriceValidation[];
}

