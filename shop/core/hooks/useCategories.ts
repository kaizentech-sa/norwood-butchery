/**
 * Sam's Hardware useCategories Hook
 * 
 * React hook for fetching product categories.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { WooCommerceDataProvider } from '../../adapters/catalog/woocommerce';

export interface Category {
  id: number;
  name: string;
  parent?: number;
  slug?: string;
  count?: number;
  image?: { src: string; alt?: string } | null;
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: (params?: { hideEmpty?: boolean }) => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const provider = useMemo(() => WooCommerceDataProvider, []);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCategories = useCallback(async (params?: { hideEmpty?: boolean }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await provider.getCategories(params);
      setCategories(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [provider]);
  
  return { categories, loading, error, fetchCategories };
}

export default useCategories;
