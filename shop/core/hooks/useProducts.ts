/**
 * Sam's Hardware useProducts Hook
 * 
 * React hook for fetching and managing product data with filtering and pagination.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { WooCommerceDataProvider } from '../../adapters/catalog/woocommerce';
import type { Product, ProductQuery } from '../ports';

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProducts(initialQuery?: ProductQuery): UseProductsReturn {
  const provider = useMemo(() => WooCommerceDataProvider, []);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState<ProductQuery | undefined>(initialQuery);
  
  const fetchProducts = useCallback(async (query?: ProductQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await provider.getProducts(query);
      setProducts(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setLastQuery(query);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [provider]);
  
  const refetch = useCallback(async () => {
    await fetchProducts(lastQuery);
  }, [fetchProducts, lastQuery]);
  
  return {
    products,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    fetchProducts,
    refetch,
  };
}

export default useProducts;
