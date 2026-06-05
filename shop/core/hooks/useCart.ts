/**
 * Sam's Hardware useCart Hook
 * 
 * React hook for managing shopping cart state with persistence.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { storage, calculateCartTotal, calculateCartItemCount, generateCartItemKey } from '../../utils/helpers';
import { STORAGE_KEYS, SHOP_CONFIG } from '../../utils/constants';
import type { CartItem, Product } from '../ports';

export interface UseCartReturn {
  items: CartItem[];
  itemCount: number;
  total: number;
  initialized: boolean;
  addItem: (product: Product, quantity?: number, variationId?: number, variation?: Record<string, string>) => boolean;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  isInCart: (productId: number, variationId?: number) => boolean;
  getItemQuantity: (productId: number, variationId?: number) => number;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get(STORAGE_KEYS.CART);
    let rawItems: any[] = [];
    if (savedCart) {
      if (Array.isArray(savedCart)) {
        rawItems = savedCart;
      } else if (typeof savedCart === 'object' && Array.isArray((savedCart as any).items)) {
        rawItems = (savedCart as any).items;
      }
    }
    if (rawItems.length > 0) {
      const sanitized = rawItems.map((item: any) => {
        const rawQty = Number(item?.quantity);
        const quantity = Math.min(
          Math.max(isNaN(rawQty) ? 1 : rawQty, 1),
          SHOP_CONFIG.MAX_QUANTITY_PER_ITEM
        );
        const priceSource = item?.salePrice !== undefined && item?.salePrice !== null
          ? Number(item.salePrice)
          : Number(item?.price);
        const price = isNaN(priceSource) ? 0 : priceSource;
        const regularPriceNum = Number(item?.regularPrice);
        const regularPrice = isNaN(regularPriceNum) ? 0 : regularPriceNum;
        const salePrice =
          item?.salePrice !== undefined && item?.salePrice !== null
            ? Number(item.salePrice)
            : undefined;
        const image =
          typeof item?.image === 'string'
            ? item.image
            : (item?.image && typeof item.image === 'object' && (item.image as any).src)
              ? (item.image as any).src
              : SHOP_CONFIG.PLACEHOLDER_IMAGE;
        return {
          ...item,
          quantity,
          price,
          regularPrice,
          salePrice,
          image,
        };
      });
      setItems(sanitized);
    }
    setInitialized(true);
  }, []);
  
  // Save cart to localStorage when items change
  useEffect(() => {
    if (initialized) {
      storage.set(STORAGE_KEYS.CART, items);
    }
  }, [items, initialized]);
  
  const itemCount = calculateCartItemCount(items);
  const total = calculateCartTotal(items);
  
  const addItem = useCallback((
    product: Product, 
    quantity: number = 1, 
    variationId?: number, 
    variation?: Record<string, string>
  ): boolean => {
    quantity = Math.max(1, Math.min(Number(quantity) || 1, SHOP_CONFIG.MAX_QUANTITY_PER_ITEM));
    
    // Determine effective details (handle variations)
    let effectiveStockStatus = product.stockStatus;
    let effectiveStockQuantity = product.stockQuantity;
    let variationObj: any = null;

    if (variationId && product.variations) {
      variationObj = product.variations.find(v => v.id === variationId);
      if (variationObj) {
        effectiveStockStatus = variationObj.stockStatus;
        effectiveStockQuantity = variationObj.stockQuantity;
      }
    }

    // Validate stock
    if (effectiveStockStatus === 'outofstock') {
      return false;
    }
    
    // Check max quantity
    if (quantity > SHOP_CONFIG.MAX_QUANTITY_PER_ITEM) {
      quantity = SHOP_CONFIG.MAX_QUANTITY_PER_ITEM;
    }
    
    setItems(currentItems => {
      const itemKey = generateCartItemKey(product.id, variationId, variation);
      const existingIndex = currentItems.findIndex(item => 
        generateCartItemKey(item.productId, item.variationId, item.variation) === itemKey
      );
      
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...currentItems];
        const existingItem = newItems[existingIndex];
        let newQuantity = existingItem.quantity + quantity;
        
        // Check stock quantity if managed
        // Only enforce stock limit if stock is positive and backorders are not allowed
        if (effectiveStockQuantity !== undefined && 
            effectiveStockQuantity > 0 && 
            effectiveStockStatus !== 'onbackorder' && 
            newQuantity > effectiveStockQuantity) {
          newQuantity = effectiveStockQuantity;
        }
        
        // Check sold individually
        if (product.soldIndividually) {
          newQuantity = 1;
        }
        
        newItems[existingIndex] = {
          ...existingItem,
          quantity: Math.min(newQuantity, SHOP_CONFIG.MAX_QUANTITY_PER_ITEM),
          stockStatus: effectiveStockStatus, // Update stock status in case it changed
          stockQuantity: effectiveStockQuantity, // Update stock quantity
        };
        storage.set(STORAGE_KEYS.CART, newItems);
        return newItems;
      } else {
        // Add new item
        let finalQuantity = quantity;
        
        // Check stock quantity if managed
        // Only enforce stock limit if stock is positive and backorders are not allowed
        if (effectiveStockQuantity !== undefined && 
            effectiveStockQuantity > 0 && 
            effectiveStockStatus !== 'onbackorder' && 
            finalQuantity > effectiveStockQuantity) {
          finalQuantity = effectiveStockQuantity;
        }
        
        // Check sold individually
        if (product.soldIndividually) {
          finalQuantity = 1;
        }

        // Determine item details
        let price = Number(product.salePrice ?? product.price ?? product.regularPrice) || 0;
        let regularPrice = Number(product.regularPrice) || 0;
        let salePrice = product.salePrice !== undefined ? Number(product.salePrice) : undefined;
        let image = (typeof product.images?.[0] === 'string' 
          ? product.images?.[0] 
          : (product.images?.[0] as any)?.src) || SHOP_CONFIG.PLACEHOLDER_IMAGE;

        if (variationObj) {
          price = Number(variationObj.salePrice ?? variationObj.price ?? variationObj.regularPrice) || 0;
          regularPrice = Number(variationObj.regularPrice) || 0;
          salePrice = variationObj.salePrice !== undefined ? Number(variationObj.salePrice) : undefined;
          if (variationObj.image?.src) {
            image = variationObj.image.src;
          }
        }
        
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price,
          regularPrice,
          salePrice,
          quantity: Math.min(finalQuantity, SHOP_CONFIG.MAX_QUANTITY_PER_ITEM),
          image,
          variationId,
          variation,
          stockStatus: effectiveStockStatus,
          stockQuantity: effectiveStockQuantity,
          soldIndividually: product.soldIndividually,
        };
        const newItems = [...currentItems, newItem];
        storage.set(STORAGE_KEYS.CART, newItems);
        return newItems;
      }
    });
    
    return true;
  }, []);
  
  const removeItem = useCallback((productId: number, variationId?: number) => {
    setItems(currentItems => {
      const filtered = currentItems.filter(item => {
        if (variationId) {
          return !(item.productId === productId && item.variationId === variationId);
        }
        return item.productId !== productId;
      });
      storage.set(STORAGE_KEYS.CART, filtered);
      return filtered;
    });
  }, []);
  
  const updateQuantity = useCallback((productId: number, quantity: number, variationId?: number) => {
    quantity = Math.max(1, Math.min(Number(quantity) || 1, SHOP_CONFIG.MAX_QUANTITY_PER_ITEM));
    if (quantity <= 0) {
      removeItem(productId, variationId);
      return;
    }
    
    setItems(currentItems => {
      const mapped = currentItems.map(item => {
        const isMatch = variationId 
          ? (item.productId === productId && item.variationId === variationId)
          : item.productId === productId;
        
        if (isMatch) {
          let newQuantity = quantity;
          
          // Check stock quantity if managed
          // Only enforce stock limit if stock is positive and backorders are not allowed
          if (item.stockQuantity !== undefined && 
              item.stockQuantity > 0 && 
              item.stockStatus !== 'onbackorder' && 
              newQuantity > item.stockQuantity) {
            newQuantity = item.stockQuantity;
          }
          
          // Check sold individually
          if (item.soldIndividually) {
            newQuantity = 1;
          }
          
          return {
            ...item,
            quantity: Math.min(newQuantity, SHOP_CONFIG.MAX_QUANTITY_PER_ITEM),
          };
        }
        return item;
      });
      storage.set(STORAGE_KEYS.CART, mapped);
      return mapped;
    });
  }, [removeItem]);
  
  const clearCart = useCallback(() => {
    setItems([]);
    storage.remove(STORAGE_KEYS.CART);
  }, []);
  
  const isInCart = useCallback((productId: number, variationId?: number): boolean => {
    return items.some(item => {
      if (variationId) {
        return item.productId === productId && item.variationId === variationId;
      }
      return item.productId === productId;
    });
  }, [items]);
  
  const getItemQuantity = useCallback((productId: number, variationId?: number): number => {
    const item = items.find(item => {
      if (variationId) {
        return item.productId === productId && item.variationId === variationId;
      }
      return item.productId === productId;
    });
    return item?.quantity || 0;
  }, [items]);
  
  return {
    items,
    itemCount,
    total,
    initialized,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}

export default useCart;
