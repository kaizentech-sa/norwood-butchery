/**
 * Sam's Hardware useShipping Hook
 * 
 * React hook for managing shipping rates and options.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { bobGoService } from '../services/bobgo';
import { storage } from '../../shop/utils/helpers';
import { STORAGE_KEYS } from '../../shop/utils/constants';
import type {
  ShippingAddress,
  ShippingItem,
  ShippingRate,
  SelectedShipping,
} from '../types/shipping';

export interface UseShippingReturn {
  rates: ShippingRate[];
  selectedRate: ShippingRate | null;
  loading: boolean;
  error: string | null;
  fetchRates: (destination: ShippingAddress, items: ShippingItem[]) => Promise<void>;
  selectRate: (rate: ShippingRate) => void;
  clearRates: () => void;
  getShippingCost: () => number;
  isAddressValid: (address: ShippingAddress) => { valid: boolean; errors: string[] };
}

export function useShipping(): UseShippingReturn {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load saved shipping selection on mount
  useEffect(() => {
    const saved = storage.get(STORAGE_KEYS.SELECTED_SHIPPING) as SelectedShipping | null;
    if (saved?.rate) {
      setSelectedRate(saved.rate);
    }
  }, []);
  
  /**
   * Fetch shipping rates for given destination and items
   */
  const fetchRates = useCallback(async (
    destination: ShippingAddress,
    items: ShippingItem[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bobGoService.getCheckoutRates({
        destination,
        items,
      });
      
      if (response.success) {
        setRates(response.rates);
        
        // Auto-select default rate if none selected
        if (!selectedRate && response.rates.length > 0) {
          const defaultRate = bobGoService.getDefaultShippingOption(response.rates);
          if (defaultRate) {
            selectRate(defaultRate);
          }
        }
      } else {
        setError(response.error || 'Failed to fetch shipping rates');
        setRates([]);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch shipping rates');
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRate]);
  
  /**
   * Select a shipping rate
   */
  const selectRate = useCallback((rate: ShippingRate) => {
    setSelectedRate(rate);
    storage.set(STORAGE_KEYS.SELECTED_SHIPPING, {
      rate,
      selectedAt: new Date().toISOString(),
    } as SelectedShipping);
  }, []);
  
  /**
   * Clear rates and selection
   */
  const clearRates = useCallback(() => {
    setRates([]);
    setSelectedRate(null);
    setError(null);
    storage.remove(STORAGE_KEYS.SELECTED_SHIPPING);
  }, []);
  
  /**
   * Get the cost of the selected shipping
   */
  const getShippingCost = useCallback((): number => {
    return selectedRate?.price || 0;
  }, [selectedRate]);
  
  /**
   * Validate a shipping address
   */
  const isAddressValid = useCallback((address: ShippingAddress) => {
    return bobGoService.validateDeliveryAddress(address);
  }, []);
  
  return {
    rates,
    selectedRate,
    loading,
    error,
    fetchRates,
    selectRate,
    clearRates,
    getShippingCost,
    isAddressValid,
  };
}

export default useShipping;
