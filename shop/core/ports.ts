/**
 * Sam's Hardware Shop Ports (Interfaces)
 * 
 * Defines the contracts for data providers, payment providers, and core types.
 * This enables dependency injection and makes the shop framework portable.
 */

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  type?: 'simple' | 'variable' | 'grouped' | 'external';
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  images: string[];
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  categories: string[];
  tags?: string[];
  tagSlugs?: string[];
  brand?: string;
  slug: string;
  permalink: string;
  hasVariations?: boolean;
  soldIndividually?: boolean;
  variations?: ProductVariation[];
  variationAttributes?: Record<string, string[]>;
  defaultAttributes?: Record<string, string>;
  sku?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
}

export interface ProductVariation {
  id: number;
  sku?: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  attributes: Record<string, string>;
  image?: { src: string };
  soldIndividually?: boolean;
}

export interface ProductQuery {
  page?: number;
  perPage?: number;
  categoryId?: number | number[];
  search?: string;
  orderBy?: 'date' | 'price' | 'name' | 'popularity';
  order?: 'asc' | 'desc';
  featured?: boolean;
  brand?: string | string[];
  tag?: string;
  onSale?: boolean;
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartItem {
  id?: string; // Optional unique identifier for cart operations
  productId: number;
  name: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  quantity: number;
  image: string;
  variationId?: number;
  variation?: Record<string, string>;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  soldIndividually?: boolean;
}

// ============================================================================
// Category & Brand Types
// ============================================================================

export interface Category {
  id: number;
  name: string;
  parent?: number;
  slug?: string;
  count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderAddress {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderLineItem {
  productId: number;
  quantity: number;
  variationId?: number;
  variation?: Record<string, string>;
}

export interface ShippingLine {
  methodId: string;
  methodTitle: string;
  total: number;
}

export interface OrderPayload {
  lineItems: OrderLineItem[];
  billing: OrderAddress;
  shipping?: Omit<OrderAddress, 'email' | 'phone'>;
  shippingLines?: ShippingLine[];
  customerNote?: string;
  paymentMethod?: string;
  paymentMethodTitle?: string;
}

export interface OrderResult {
  success: boolean;
  orderId?: number;
  orderNumber?: string;
  error?: string;
}

// ============================================================================
// Data Provider Interface
// ============================================================================

export interface ShopDataProvider {
  getProducts(query?: ProductQuery): Promise<{
    data: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
  
  getProduct(id: number, params?: any): Promise<Product>;
  
  getCategories(params?: { hideEmpty?: boolean }): Promise<Category[]>;
  
  createOrder(payload: any): Promise<OrderResult>;
  
  getBrands?(): Promise<Brand[]>;
  
  getLinkedProducts?(productId: number): Promise<{
    upsells: Product[];
    crossSells: Product[];
    totalUpsells: number;
    totalCrossSells: number;
  }>;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentStartRequest {
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
}

export interface PaymentStartResult {
  method: 'form-post' | 'redirect-url';
  url: string;
  fields?: Record<string, string>;
}

export interface PaymentProvider {
  startPayment(req: PaymentStartRequest): Promise<PaymentStartResult>;
}

// ============================================================================
// Shipping Types
// ============================================================================

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
}

export interface ShippingRate {
  serviceName: string;
  serviceCode: string;
  price: number;
  currency: string;
  deliveryTime?: string;
  description?: string;
}
