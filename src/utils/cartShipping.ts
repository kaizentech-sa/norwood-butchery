import { storage } from 'shop/utils/helpers';
import { STORAGE_KEYS } from 'shop/utils/constants';
import type { SavedDeliverySelection } from 'shipping/types/delivery';

export const getSavedDeliverySelection = (): SavedDeliverySelection | null => {
    return storage.get(STORAGE_KEYS.DELIVERY_SELECTION) as SavedDeliverySelection | null;
};

export const getDeliveryCost = (): number => {
    const saved = getSavedDeliverySelection();
    return saved?.cost ?? 0;
};

export const getDeliveryMethod = () => {
    const saved = getSavedDeliverySelection();
    if (!saved) return null;

    return {
        methodId: `ktdo_${saved.optionId}`,
        methodTitle: saved.optionName,
        total: saved.cost,
        optionId: saved.optionId,
        lat: saved.lat,
        lng: saved.lng,
        distanceKm: saved.distanceKm,
    };
};
