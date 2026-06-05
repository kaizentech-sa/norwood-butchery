/**
 * Sam's Hardware E-commerce Utility Functions
 * 
 * Common helper functions for the shop functionality.
 */

import { WOOCOMMERCE_CONFIG, STORAGE_KEYS } from './constants';
import type { Product, CartItem } from '../core/ports';

/**
 * Format a price value with currency symbol
 * @param price - The price value
 * @param showCurrency - Whether to show the currency symbol
 * @returns Formatted price string
 */
export function formatPrice(price: number | string | undefined | null, showCurrency: boolean = true): string {
  if (price === undefined || price === null) {
    return showCurrency ? `${WOOCOMMERCE_CONFIG.CURRENCY_SYMBOL}0.00` : '0.00';
  }
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return showCurrency ? `${WOOCOMMERCE_CONFIG.CURRENCY_SYMBOL}0.00` : '0.00';
  }
  
  const formatted = numericPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return showCurrency ? `${WOOCOMMERCE_CONFIG.CURRENCY_SYMBOL}${formatted}` : formatted;
}

/**
 * Local storage helper functions with SSR safety
 */
export const storage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      // Only clear our keys, not all localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Check if a product is in stock
 * @param product - The product to check
 * @param quantity - Required quantity (default: 1)
 * @returns Whether the product is in stock
 */
export function isProductInStock(product: Product, quantity: number = 1): boolean {
  if (!product) return false;
  
  // Check stock status
  if (product.stockStatus === 'outofstock') return false;
  
  // If stock is managed, check quantity
  if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
    return product.stockQuantity >= quantity;
  }
  
  // If not managed, assume in stock based on status
  return product.stockStatus === 'instock' || product.stockStatus === 'onbackorder';
}

/**
 * Calculate cart total
 * @param items - Cart items
 * @returns Total price
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = Number(item.salePrice ?? item.price ?? item.regularPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return total + (price * qty);
  }, 0);
}

/**
 * Calculate cart item count
 * @param items - Cart items
 * @returns Total item count
 */
export function calculateCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
}

/**
 * Validate checkout form fields
 * @param data - Form data object
 * @returns Object with isValid boolean and errors object
 */
export function validateCheckoutForm(data: Record<string, any>): { 
  isValid: boolean; 
  errors: Record<string, string> 
} {
  const errors: Record<string, string> = {};
  
  const isCollect = data.deliveryMethod === 'collect';

  // Required fields
  const requiredFields = [
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone number' },
    ...(isCollect
      ? []
      : [
          { key: 'address', label: 'Street address' },
          { key: 'city', label: 'City' },
          { key: 'state', label: 'Province/State' },
          { key: 'postcode', label: 'Postal code' },
          { key: 'country', label: 'Country' },
        ]),
  ];

  if (isCollect && !data.pickupBranch) {
    errors.pickupBranch = 'Please select a pickup branch';
  }
  
  requiredFields.forEach(({ key, label }) => {
    if (!data[key] || data[key].trim() === '') {
      errors[key] = `${label} is required`;
    }
  });
  
  // Email validation
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Phone validation (basic)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  // Postal code validation for South Africa
  if (data.country === 'ZA' && data.postcode && !isValidSAPostcode(data.postcode)) {
    errors.postcode = 'Please enter a valid South African postal code';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Should have at least 10 digits
  return cleaned.replace(/\+/g, '').length >= 10;
}

/**
 * Validate South African postal code
 */
export function isValidSAPostcode(postcode: string): boolean {
  // South African postal codes are 4 digits
  return /^\d{4}$/.test(postcode);
}

/**
 * Transform WooCommerce product response to our Product interface
 */
export function transformWooCommerceProduct(wooProduct: any): Product {
  return {
    id: wooProduct.id,
    name: wooProduct.name,
    slug: wooProduct.slug,
    permalink: wooProduct.permalink,
    type: wooProduct.type,
    description: wooProduct.description || '',
    shortDescription: wooProduct.short_description || '',
    sku: wooProduct.sku,
    price: parseFloat(wooProduct.price) || 0,
    regularPrice: parseFloat(wooProduct.regular_price) || 0,
    salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : undefined,
    onSale: wooProduct.on_sale || false,
    stockStatus: wooProduct.stock_status || 'instock',
    stockQuantity: wooProduct.stock_quantity,
    images: Array.isArray(wooProduct.images) 
      ? wooProduct.images.map((img: any) => img.src || img)
      : [],
    categories: Array.isArray(wooProduct.categories)
      ? wooProduct.categories.map((cat: any) => cat.name || cat)
      : [],
    tags: Array.isArray(wooProduct.tags)
      ? wooProduct.tags.map((tag: any) => tag.name || tag)
      : [],
    tagSlugs: Array.isArray(wooProduct.tags)
      ? wooProduct.tags.map((tag: any) => tag.slug || tag)
      : [],
    brand: wooProduct.brand,
    hasVariations: wooProduct.type === 'variable' || wooProduct.has_variations,
    variations: wooProduct.variations,
    variationAttributes: wooProduct.variation_attributes,
    defaultAttributes: wooProduct.default_attributes,
    soldIndividually: wooProduct.sold_individually || false,
  };
}

/**
 * Generate a unique cart item key
 */
export function generateCartItemKey(productId: number, variationId?: number, variation?: Record<string, string>): string {
  let key = `product_${productId}`;
  
  if (variationId) {
    key += `_variation_${variationId}`;
  }
  
  if (variation && Object.keys(variation).length > 0) {
    const sortedKeys = Object.keys(variation).sort();
    const variationString = sortedKeys.map(k => `${k}:${variation[k]}`).join('_');
    key += `_${variationString}`;
  }
  
  return key;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  // Server-side fallback
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get discount percentage
 */
export function getDiscountPercentage(regularPrice: number, salePrice: number): number {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

