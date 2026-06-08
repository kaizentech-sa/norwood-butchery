/**
 * Sam's Hardware useCheckout Hook
 * 
 * React hook for managing the checkout process.
 */

'use client';

import { useState, useCallback } from 'react';
import { createOrder, validateCartStock } from '../../../services/orders';
import { processPayment } from '../../../services/payfast';
import type { CartItem } from '../ports';
import type { PickupBranchId } from '../../utils/store';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  useSameAddress: boolean;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostcode?: string;
  shippingCountry?: string;
  customerNote?: string;
  deliveryMethod?: 'collect' | 'shipping';
  pickupBranch?: PickupBranchId | null;
}

export interface ShippingMethod {
  methodId: string;
  methodTitle: string;
  total: number;
}

export interface UseCheckoutReturn {
  loading: boolean;
  error: string | null;
  stockErrors: Array<{ productId: number; name?: string; error: string }>;
  orderId: number | null;
  orderNumber: string | null;
  validateStock: (items: CartItem[]) => Promise<boolean>;
  processCheckout: (
    items: CartItem[],
    formData: CheckoutFormData,
    shippingMethod?: ShippingMethod
  ) => Promise<boolean>;
  clearError: () => void;
}

export function useCheckout(): UseCheckoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<Array<{ productId: number; name?: string; error: string }>>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  const validateStock = useCallback(async (items: CartItem[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setStockErrors([]);
    
    try {
      const result = await validateCartStock(items);
      
      if (!result.valid) {
        setStockErrors(result.errors);
        setError('Some items in your cart are no longer available');
        return false;
      }
      
      return true;
    } catch (e: any) {
      setError(e?.message || 'Failed to validate cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const processCheckout = useCallback(async (
    items: CartItem[],
    formData: CheckoutFormData,
    shippingMethod?: ShippingMethod
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setStockErrors([]);
    
    try {
      // Step 1: Create the order
      const orderResult = await createOrder(items, {
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
        },
        shipping: formData.useSameAddress ? undefined : {
          firstName: formData.shippingFirstName || formData.firstName,
          lastName: formData.shippingLastName || formData.lastName,
          address: formData.shippingAddress || formData.address,
          city: formData.shippingCity || formData.city,
          state: formData.shippingState || formData.state,
          postcode: formData.shippingPostcode || formData.postcode,
          country: formData.shippingCountry || formData.country,
        },
        shippingMethod,
        customerNote: formData.customerNote,
        useSameAddress: formData.useSameAddress,
        deliveryMethod: formData.deliveryMethod,
        pickupBranch: formData.pickupBranch ?? undefined,
      });
      
      if (!orderResult.success) {
        if (orderResult.stockErrors) {
          setStockErrors(orderResult.stockErrors);
        }
        setError(orderResult.error || 'Failed to create order');
        return false;
      }
      
      setOrderId(orderResult.orderId!);
      setOrderNumber(orderResult.orderNumber!);
      
      // Step 2: Calculate total
      const cartTotal = items.reduce((total, item) => {
        const price = Number(item.salePrice ?? item.price ?? item.regularPrice) || 0;
        return total + (price * item.quantity);
      }, 0);
      
      const shippingCost = shippingMethod?.total || 0;
      const totalAmount = cartTotal + shippingCost;
      
      // Step 3: Process payment
      const paymentResult = await processPayment(
        orderResult.orderId!,
        orderResult.orderNumber!,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        totalAmount,
        `Norwood Butchery Order #${orderResult.orderNumber}`
      );
      
      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment processing failed');
        return false;
      }
      
      // Payment form submitted - user will be redirected to PayFast
      return true;
      
    } catch (e: any) {
      setError(e?.message || 'Checkout failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
    setStockErrors([]);
  }, []);
  
  return {
    loading,
    error,
    stockErrors,
    orderId,
    orderNumber,
    validateStock,
    processCheckout,
    clearError,
  };
}

export default useCheckout;
