/**
 * Sam's Hardware useBrands Hook
 * 
 * React hook for fetching product brands.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { WooCommerceDataProvider } from '../../adapters/catalog/woocommerce';

export interface Brand {
  id: string;
  name: string;
  slug?: string;
}

export interface UseBrandsReturn {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
}

export function useBrands(): UseBrandsReturn {
  const provider = useMemo(() => WooCommerceDataProvider, []);
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (provider.getBrands) {
        const data = await provider.getBrands();
        setBrands(data);
      } else {
        setBrands([]);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch brands');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, [provider]);
  
  return { brands, loading, error, fetchBrands };
}

export default useBrands;
