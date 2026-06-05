import { PAYFAST_CONFIG, WOOCOMMERCE_CONFIG } from '../../utils/constants';

export type ShopPaymentProviderName = 'payfast' | 'mock' | 'paygate';

export interface ShopConfig {
  paymentProvider: ShopPaymentProviderName;
  currency: string;
  wooCommerce: {
    baseUrl: string;
    apiVersion: string; // Changed from consumerKey/Secret to apiVersion
    productsPerPage: number;
  };
  payfast: {
    // SECURITY UPDATE: No more secrets in frontend config
    // All PayFast secrets are now handled by WordPress backend
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
    testMode: boolean;
  };
}

export const ShopConfigFromExisting = (): ShopConfig => {
  return {
    paymentProvider: 'payfast',
    currency: 'ZAR',
    wooCommerce: {
      baseUrl: WOOCOMMERCE_CONFIG.BASE_URL,
      apiVersion: WOOCOMMERCE_CONFIG.API_VERSION, // WordPress secure endpoint
      productsPerPage: WOOCOMMERCE_CONFIG.PRODUCTS_PER_PAGE,
    },
    payfast: {
      // SECURITY: No more merchant credentials in frontend
      // WordPress backend handles all PayFast secrets securely
      returnUrl: PAYFAST_CONFIG.RETURN_URL,
      cancelUrl: PAYFAST_CONFIG.CANCEL_URL,
      notifyUrl: PAYFAST_CONFIG.NOTIFY_URL,
      testMode: PAYFAST_CONFIG.TEST_MODE,
    },
  };
};


