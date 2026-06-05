/**
 * Sam's Hardware Shop Framework
 * 
 * Public entry point - exports all shop functionality.
 */

// Core Provider
export { ShopProvider, useShop, ShopContext } from './core/ShopProvider';

// Configuration
export { ShopConfigFromExisting, type ShopConfig, type ShopPaymentProviderName } from './core/config/ShopConfig';

// Types/Interfaces
export * from './core/ports';

// Hooks
export { useCart, type UseCartReturn } from './core/hooks/useCart';
export { useProducts, type UseProductsReturn } from './core/hooks/useProducts';
export { useCheckout, type UseCheckoutReturn, type CheckoutFormData, type ShippingMethod } from './core/hooks/useCheckout';
export { useCategories, type UseCategoriesReturn, type Category } from './core/hooks/useCategories';
export { useBrands, type UseBrandsReturn, type Brand } from './core/hooks/useBrands';

// Utilities
export * from './utils/helpers';
export * from './utils/constants';

// Adapters
export { WooCommerceDataProvider } from './adapters/catalog/woocommerce';
