/**
 * Sam's Hardware BobGo Shipping Service
 * 
 * Handles shipping rate calculations through the WordPress backend.
 * BobGo API keys are stored server-side for security.
 */

import { API_CONFIG, SHIPPING_CONFIG } from '../../shop/utils/constants';
import type {
  ShippingAddress,
  ShippingItem,
  ShippingRate,
  ShippingRatesRequest,
  ShippingRatesResponse,
  BobGoAddress,
  BobGoItem,
} from '../types/shipping';

// ============================================================================
// Address Transformation
// ============================================================================

/**
 * Transform our address format to BobGo format
 */
function transformToBobGoAddress(address: ShippingAddress): BobGoAddress {
  return {
    street_address: address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ''),
    local_area: address.suburb,
    city: address.city,
    zone: address.state,
    country: address.country || 'ZA',
    code: address.postcode,
    company: address.company,
  };
}

/**
 * Transform cart items to BobGo parcel format
 */
function transformToBobGoItems(items: ShippingItem[]): BobGoItem[] {
  return items.map(item => ({
    sku: String(item.productId),
    description: item.name,
    quantity: item.quantity,
    value: item.price * item.quantity,
    weight: item.weight,
    length: item.dimensions?.length,
    width: item.dimensions?.width,
    height: item.dimensions?.height,
  }));
}

// ============================================================================
// BobGo Service Class
// ============================================================================

export class BobGoService {
  /**
   * Get shipping rates for checkout
   */
  async getCheckoutRates(request: ShippingRatesRequest): Promise<ShippingRatesResponse> {
    // Check if BobGo is enabled
    if (!SHIPPING_CONFIG.BOBGO_ENABLED) {
      return this.getFallbackRates(request.items);
    }
    
    try {
      const payload = {
        collection_address: request.origin ? transformToBobGoAddress(request.origin) : undefined,
        delivery_address: transformToBobGoAddress(request.destination),
        parcels: transformToBobGoItems(request.items),
      };
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_CONFIG.API_KEY,
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        // Return fallback rates on error
        return this.getFallbackRates(request.items, data.error || 'Shipping service unavailable');
      }
      
      // Transform rates to our format
      const rates = this.transformRatesToShippingOptions(data.rates || []);
      
      return {
        success: true,
        rates,
        message: data.message,
      };
    } catch (error: any) {
      console.error('BobGo shipping error:', error);
      return this.getFallbackRates(request.items, error.message);
    }
  }
  
  /**
   * Transform BobGo rates to our ShippingRate format
   */
  private transformRatesToShippingOptions(bobGoRates: any[]): ShippingRate[] {
    return bobGoRates.map((rate, index) => ({
      serviceName: rate.service_name || rate.serviceName || 'Shipping',
      serviceCode: rate.service_code || rate.serviceCode || `rate_${index}`,
      carrierCode: rate.carrier_code || rate.carrierCode,
      price: parseFloat(rate.rate || rate.price) || 0,
      currency: rate.rate_currency || rate.currency || 'ZAR',
      deliveryTime: this.formatDeliveryTime(rate),
      description: rate.carrier_name || rate.description,
      isDefault: index === 0,
    }));
  }
  
  /**
   * Format delivery time from BobGo response
   */
  private formatDeliveryTime(rate: any): string {
    if (rate.delivery_time || rate.deliveryTime) {
      return rate.delivery_time || rate.deliveryTime;
    }
    
    if (rate.min_delivery_days !== undefined && rate.max_delivery_days !== undefined) {
      if (rate.min_delivery_days === rate.max_delivery_days) {
        return `${rate.min_delivery_days} business day${rate.min_delivery_days !== 1 ? 's' : ''}`;
      }
      return `${rate.min_delivery_days}-${rate.max_delivery_days} business days`;
    }
    
    if (rate.delivery_date_from && rate.delivery_date_to) {
      const from = new Date(rate.delivery_date_from);
      const to = new Date(rate.delivery_date_to);
      return `${from.toLocaleDateString('en-ZA')} - ${to.toLocaleDateString('en-ZA')}`;
    }
    
    return 'Varies';
  }
  
  /**
   * Get fallback/default shipping rates
   */
  private getFallbackRates(items: ShippingItem[], errorMessage?: string): ShippingRatesResponse {
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Check for free shipping threshold
    if (cartTotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) {
      return {
        success: true,
        rates: [{
          serviceName: 'Free Shipping',
          serviceCode: 'free_shipping',
          price: 0,
          currency: 'ZAR',
          deliveryTime: SHIPPING_CONFIG.DEFAULT_RATES.standard.deliveryTime,
          description: `Free shipping on orders over R${SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD}`,
          isDefault: true,
        }],
        message: errorMessage ? `Using default rates: ${errorMessage}` : 'Free shipping available',
      };
    }
    
    // Return default rates
    return {
      success: true,
      rates: [
        {
          serviceName: SHIPPING_CONFIG.DEFAULT_RATES.standard.name,
          serviceCode: 'standard',
          price: SHIPPING_CONFIG.DEFAULT_RATES.standard.price,
          currency: 'ZAR',
          deliveryTime: SHIPPING_CONFIG.DEFAULT_RATES.standard.deliveryTime,
          description: 'Standard delivery service',
          isDefault: true,
        },
        {
          serviceName: SHIPPING_CONFIG.DEFAULT_RATES.express.name,
          serviceCode: 'express',
          price: SHIPPING_CONFIG.DEFAULT_RATES.express.price,
          currency: 'ZAR',
          deliveryTime: SHIPPING_CONFIG.DEFAULT_RATES.express.deliveryTime,
          description: 'Express delivery service',
        },
      ],
      message: errorMessage || 'Shipping rates calculated',
    };
  }
  
  /**
   * Get the default shipping option
   */
  getDefaultShippingOption(rates: ShippingRate[]): ShippingRate | null {
    if (!rates || rates.length === 0) return null;
    return rates.find(r => r.isDefault) || rates[0];
  }
  
  /**
   * Validate a delivery address
   */
  validateDeliveryAddress(address: ShippingAddress): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!address.firstName?.trim()) errors.push('First name is required');
    if (!address.lastName?.trim()) errors.push('Last name is required');
    if (!address.addressLine1?.trim()) errors.push('Street address is required');
    if (!address.city?.trim()) errors.push('City is required');
    if (!address.state?.trim()) errors.push('Province/State is required');
    if (!address.postcode?.trim()) errors.push('Postal code is required');
    
    // South African postal code validation
    if (address.country === 'ZA' || !address.country) {
      if (address.postcode && !/^\d{4}$/.test(address.postcode)) {
        errors.push('Please enter a valid 4-digit postal code');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const bobGoService = new BobGoService();
export default bobGoService;
