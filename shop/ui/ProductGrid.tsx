/**
 * Sam's Hardware Product Grid Component
 * 
 * A responsive grid layout for displaying products.
 */

'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';
import type { Product } from '../core/ports';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  columns?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  loading = false,
  error = null,
  onAddToCart,
  onQuickView,
  columns = 4,
  className = '',
  emptyMessage = 'No products found',
}: ProductGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="te-panel-dark min-h-[200px] flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-te-white/80 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="te-button-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="te-panel min-h-[200px] flex items-center justify-center p-8">
        <p className="text-te-grey">{emptyMessage}</p>
      </div>
    );
  }
  
  // Grid column classes
  const columnClasses = {
    2: 'grid-cols-2 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
  
  return (
    <div className={`grid ${columnClasses[columns]} gap-3 sm:gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
