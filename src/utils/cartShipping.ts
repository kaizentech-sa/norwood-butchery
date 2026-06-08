import { SHIPPING_CONFIG } from 'shop/utils/constants';
import { storage } from 'shop/utils/helpers';

export type ShippingType = 'standard' | 'express';

const SHIPPING_STORAGE_KEY = 'norwood_cart_shipping_type';

export const getSavedShippingType = (): ShippingType => {
    const saved = storage.get(SHIPPING_STORAGE_KEY);
    return saved === 'express' ? 'express' : 'standard';
};

export const saveShippingType = (type: ShippingType) => {
    storage.set(SHIPPING_STORAGE_KEY, type);
};

export const getShippingPrice = (subtotal: number, type: ShippingType): number => {
    if (subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) return 0;

    return type === 'express'
        ? SHIPPING_CONFIG.DEFAULT_RATES.express.price
        : SHIPPING_CONFIG.DEFAULT_RATES.standard.price;
};

export const getShippingMethod = (subtotal: number, type: ShippingType) => {
    const rate =
        type === 'express'
            ? SHIPPING_CONFIG.DEFAULT_RATES.express
            : SHIPPING_CONFIG.DEFAULT_RATES.standard;

    return {
        methodId: type,
        methodTitle: rate.name,
        total: getShippingPrice(subtotal, type),
    };
};
