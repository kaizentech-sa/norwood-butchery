/**
 * Sam's Hardware Shop Provider
 * 
 * React context provider that makes shop functionality available throughout the app.
 * Provides cart state, product fetching, and checkout functionality.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCart, UseCartReturn } from './hooks/useCart';
import { useCheckout, UseCheckoutReturn } from './hooks/useCheckout';
import { useProducts, UseProductsReturn } from './hooks/useProducts';
import { useCategories, UseCategoriesReturn } from './hooks/useCategories';
import { useBrands, UseBrandsReturn } from './hooks/useBrands';
import { storage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import type { ShippingAddress } from './ports';

// ============================================================================
// Context Types
// ============================================================================

export interface ShopContextValue {
  // Cart
  cart: UseCartReturn;
  
  // Products (lazy loaded)
  products: UseProductsReturn;
  
  // Categories (lazy loaded)
  categories: UseCategoriesReturn;
  
  // Brands (lazy loaded)
  brands: UseBrandsReturn;
  
  // Checkout
  checkout: UseCheckoutReturn;
  
  // Shipping address
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress | null) => void;
  
  // Billing address
  billingAddress: ShippingAddress | null;
  setBillingAddress: (address: ShippingAddress | null) => void;
  
  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Initialization state
  isInitialized: boolean;
}

// ============================================================================
// Context Creation
// ============================================================================

const ShopContext = createContext<ShopContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

interface ShopProviderProps {
  children: ReactNode;
}

export function ShopProvider({ children }: ShopProviderProps) {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null);
  const [billingAddress, setBillingAddressState] = useState<ShippingAddress | null>(null);
  
  // Hooks
  const cart = useCart();
  const products = useProducts();
  const categories = useCategories();
  const brands = useBrands();
  const checkout = useCheckout();
  
  // Load saved addresses on mount
  useEffect(() => {
    const savedShipping = storage.get(STORAGE_KEYS.SHIPPING_ADDRESS);
    const savedBilling = storage.get(STORAGE_KEYS.BILLING_ADDRESS);
    
    if (savedShipping) setShippingAddressState(savedShipping);
    if (savedBilling) setBillingAddressState(savedBilling);
    
    setIsInitialized(true);
  }, []);
  
  // Address setters with persistence
  const setShippingAddress = (address: ShippingAddress | null) => {
    setShippingAddressState(address);
    if (address) {
      storage.set(STORAGE_KEYS.SHIPPING_ADDRESS, address);
    } else {
      storage.remove(STORAGE_KEYS.SHIPPING_ADDRESS);
    }
  };
  
  const setBillingAddress = (address: ShippingAddress | null) => {
    setBillingAddressState(address);
    if (address) {
      storage.set(STORAGE_KEYS.BILLING_ADDRESS, address);
    } else {
      storage.remove(STORAGE_KEYS.BILLING_ADDRESS);
    }
  };
  
  const value: ShopContextValue = {
    cart,
    products,
    categories,
    brands,
    checkout,
    shippingAddress,
    setShippingAddress,
    billingAddress,
    setBillingAddress,
    isCartOpen,
    setIsCartOpen,
    isInitialized,
  };
  
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

// ============================================================================
// Hook to use Shop Context
// ============================================================================

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  
  return context;
}

// ============================================================================
// Exports
// ============================================================================

export { ShopContext };
export default ShopProvider;
