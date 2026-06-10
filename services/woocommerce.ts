/**
 * Sam's Hardware WooCommerce Service
 * 
 * Handles all communication with the WordPress/WooCommerce backend
 * through our secure custom API endpoints.
 */

import { API_CONFIG, WOOCOMMERCE_CONFIG } from '../shop/utils/constants';
import { transformWooCommerceProduct } from '../shop/utils/helpers';
import type { Product, ProductQuery, ShopDataProvider } from '../shop/core/ports';

// Create configured fetch function with auth headers
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_CONFIG.API_KEY,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `HTTP error ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get products with optional filtering and pagination
 */
export async function getProducts(query: ProductQuery = {}): Promise<{
  data: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const params = new URLSearchParams();
  
  if (query.page) params.append('page', String(query.page));
  if (query.perPage) params.append('per_page', String(query.perPage));
  
  if (query.categoryId) {
    const categoryIds = Array.isArray(query.categoryId) 
      ? query.categoryId.join(',') 
      : String(query.categoryId);
    params.append('category', categoryIds);
  }
  
  if (query.search) params.append('search', query.search);
  if (query.orderBy) params.append('orderby', query.orderBy);
  if (query.order) params.append('order', query.order);
  if (query.featured) params.append('featured', 'true');
  if (query.onSale) params.append('onSale', 'true');
  
  if (query.brand) {
    const brands = Array.isArray(query.brand) 
      ? query.brand.join(',') 
      : query.brand;
    params.append('brand', brands);
  }
  
  if (query.tag) params.append('tag', query.tag);
  
  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiFetch(endpoint);
  
  const perPage = query.perPage || WOOCOMMERCE_CONFIG.PRODUCTS_PER_PAGE;
  
  // Handle different response formats:
  // 1. Oracle Gaming format: { success: true, data: [...], total: X, totalPages: Y }
  // 2. Direct format: { data: [...], total: X, totalPages: Y }
  const responseData = response.success ? response.data : (response.data || response);
  
  // When fetching all products (large perPage), use the actual data length as total
  // This handles cases where the API returns incorrect totals for filtered results
  const productsArray = Array.isArray(responseData) ? responseData : [];
  const responseTotal = response.total;
  
  // If we fetched a large number of products (100+) and got them all, use that as the total
  // Otherwise, trust the API's total count
  const total = (perPage >= 100 && productsArray.length < perPage) 
    ? productsArray.length 
    : (responseTotal ?? productsArray.length);
  
  const calculatedTotalPages = Math.ceil(total / perPage);
  const totalPages = response.totalPages ?? calculatedTotalPages;
  const currentPage = query.page || 1;
  
  return {
    data: productsArray.map(transformWooCommerceProduct),
    total,
    totalPages,
    currentPage,
  };
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: number): Promise<Product> {
  const response = await apiFetch(`/products/${id}`, { cache: 'no-store' });
  
  // Oracle Gaming returns product directly, Sam's Hardware wraps it in {success, data}
  let productData;
  if (response.success && response.data) {
    // Wrapped format (Sam's Hardware)
    productData = response.data;
  } else if (response.id) {
    // Direct format (Oracle Gaming)
    productData = response;
  } else {
    throw new Error('Product not found');
  }
  
  return transformWooCommerceProduct(productData);
}

/**
 * Get all product categories
 */
export async function getCategories(params?: { hideEmpty?: boolean }): Promise<Array<{
  id: number;
  name: string;
  parent?: number;
  slug?: string;
}>> {
  const queryParams = new URLSearchParams();
  if (params?.hideEmpty !== undefined) {
    queryParams.append('hide_empty', String(params.hideEmpty));
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/products/categories${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiFetch(endpoint);
  
  return response.data || [];
}

/**
 * Get all product brands
 */
export async function getBrands(): Promise<Array<{ id: string; name: string }>> {
  const response = await apiFetch('/products/brands');
  return response.data || [];
}

/**
 * Get linked products (upsells and cross-sells)
 */
export async function getLinkedProducts(productId: number): Promise<{
  upsells: Product[];
  crossSells: Product[];
  totalUpsells: number;
  totalCrossSells: number;
}> {
  const response = await apiFetch(`/products/${productId}/linked`);
  
  return {
    upsells: (response.upsells || []).map(transformWooCommerceProduct),
    crossSells: (response.cross_sells || []).map(transformWooCommerceProduct),
    totalUpsells: response.total_upsells || 0,
    totalCrossSells: response.total_cross_sells || 0,
  };
}

/**
 * Create a new order
 */
export async function createOrder(orderData: {
  lineItems: Array<{
    productId: number;
    quantity: number;
    variationId?: number;
    variation?: Record<string, string>;
  }>;
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shippingMethod?: {
    methodId: string;
    methodTitle: string;
    total: number;
  };
  deliveryOption?: {
    optionId: string;
    cost: number;
    lat?: number;
    lng?: number;
  };
  customerNote?: string;
  deliveryMethod?: 'collect' | 'shipping';
  pickupBranch?: string;
}): Promise<{
  success: boolean;
  orderId?: number;
  orderNumber?: string;
  error?: string;
}> {
  const payload = {
    line_items: orderData.lineItems.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      variation_id: item.variationId,
      variation: item.variation,
    })),
    billing: {
      first_name: orderData.billing.firstName,
      last_name: orderData.billing.lastName,
      email: orderData.billing.email,
      phone: orderData.billing.phone,
      address_1: orderData.billing.address,
      city: orderData.billing.city,
      state: orderData.billing.state,
      postcode: orderData.billing.postcode,
      country: orderData.billing.country,
    },
    shipping: orderData.shipping ? {
      first_name: orderData.shipping.firstName,
      last_name: orderData.shipping.lastName,
      address_1: orderData.shipping.address,
      city: orderData.shipping.city,
      state: orderData.shipping.state,
      postcode: orderData.shipping.postcode,
      country: orderData.shipping.country,
    } : undefined,
    shipping_lines: orderData.deliveryOption
      ? undefined
      : orderData.shippingMethod
        ? [{
            method_id: orderData.shippingMethod.methodId,
            method_title: orderData.shippingMethod.methodTitle,
            total: String(orderData.shippingMethod.total),
          }]
        : undefined,
    delivery_option_id: orderData.deliveryOption?.optionId,
    delivery_cost: orderData.deliveryOption?.cost,
    delivery_lat: orderData.deliveryOption?.lat,
    delivery_lng: orderData.deliveryOption?.lng,
    customer_note: orderData.customerNote,
    payment_method: 'payfast',
    payment_method_title: 'PayFast',
    status: 'pending',
    meta_data: [
      ...(orderData.deliveryMethod
        ? [{ key: 'delivery_method', value: orderData.deliveryMethod }]
        : []),
      ...(orderData.pickupBranch
        ? [{ key: 'pickup_branch', value: orderData.pickupBranch }]
        : []),
    ],
  };
  
  const response = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  return {
    success: response.success,
    orderId: response.order_id,
    orderNumber: response.order_number,
    error: response.error,
  };
}

/**
 * Validate stock for cart items
 */
export async function validateStock(items: Array<{
  productId: number;
  quantity: number;
  variationId?: number;
}>): Promise<{
  success: boolean;
  validItems: typeof items;
  errors: Array<{
    productId: number;
    name?: string;
    error: string;
    available?: number;
    requested?: number;
  }>;
}> {
  const response = await apiFetch('/validate-stock', {
    method: 'POST',
    body: JSON.stringify({
      items: items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        variation_id: item.variationId,
      })),
    }),
  });
  
  return {
    success: response.success,
    validItems: response.valid_items || [],
    errors: response.errors || [],
  };
}

/**
 * WooCommerce Data Provider implementation
 * Implements the ShopDataProvider interface for use with shop hooks
 */
export const WooCommerceDataProvider: ShopDataProvider = {
  getProducts,
  getProduct,
  getCategories,
  createOrder,
  getBrands,
  getLinkedProducts,
};

export default WooCommerceDataProvider;
