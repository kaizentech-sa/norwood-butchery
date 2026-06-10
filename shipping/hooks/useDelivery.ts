'use client';

import { useState, useCallback, useEffect } from 'react';
import { deliveryService } from '../services/delivery';
import { geocodeAddress } from '../utils/geocode';
import { storage } from '../../shop/utils/helpers';
import { STORAGE_KEYS } from '../../shop/utils/constants';
import type {
  DeliveryAddress,
  DeliveryOption,
  DeliveryStore,
  DeliveryPricing,
  SavedDeliverySelection,
} from '../types/delivery';

export interface UseDeliveryReturn {
  options: DeliveryOption[];
  store: DeliveryStore | null;
  pricing: DeliveryPricing | null;
  selectedOption: DeliveryOption | null;
  address: DeliveryAddress;
  cost: number;
  distanceKm: number | null;
  isCalculated: boolean;
  loadingOptions: boolean;
  calculating: boolean;
  error: string | null;
  message: string | null;
  setAddress: (address: Partial<DeliveryAddress>) => void;
  selectOption: (option: DeliveryOption) => void;
  calculateDelivery: (subtotal: number) => Promise<void>;
  clearSelection: () => void;
  getSavedSelection: () => SavedDeliverySelection | null;
}

const emptyAddress: DeliveryAddress = {
  address: '',
  city: '',
  state: '',
  postcode: '',
  country: 'ZA',
};

export function useDelivery(): UseDeliveryReturn {
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [store, setStore] = useState<DeliveryStore | null>(null);
  const [pricing, setPricing] = useState<DeliveryPricing | null>(null);
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);
  const [address, setAddressState] = useState<DeliveryAddress>(emptyAddress);
  const [cost, setCost] = useState(0);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = storage.get(STORAGE_KEYS.DELIVERY_SELECTION) as SavedDeliverySelection | null;
    if (saved?.address) {
      setAddressState(saved.address);
    }
    if (saved?.optionId && saved?.optionName) {
      setSelectedOption({
        id: saved.optionId,
        name: saved.optionName,
        type: saved.optionType,
        enabled: true,
      });
      setCost(saved.cost);
      setDistanceKm(saved.distanceKm ?? null);
      setIsCalculated(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingOptions(true);
      const result = await deliveryService.getOptions();

      if (cancelled) return;

      setStore(result.store);
      setOptions(result.options);
      setPricing(result.pricing);

      if (result.options.length > 0 && !selectedOption) {
        setSelectedOption(result.options[0]);
      }

      setLoadingOptions(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAddress = useCallback((partial: Partial<DeliveryAddress>) => {
    setAddressState((prev) => ({ ...prev, ...partial }));
  }, []);

  const selectOption = useCallback((option: DeliveryOption) => {
    setSelectedOption(option);
    setError(null);
    setMessage(null);
    setIsCalculated(false);
    setCost(0);
    setDistanceKm(null);
  }, []);

  const saveSelection = useCallback((selection: SavedDeliverySelection) => {
    storage.set(STORAGE_KEYS.DELIVERY_SELECTION, selection);
  }, []);

  const calculateDelivery = useCallback(
    async (subtotal: number) => {
      if (!selectedOption) {
        setError('Please select a delivery option');
        return;
      }

      setCalculating(true);
      setError(null);
      setMessage(null);

      try {
        let lat: number | undefined;
        let lng: number | undefined;

        if (selectedOption.type === 'per_km') {
          if (!address.address?.trim() || !address.city?.trim() || !address.postcode?.trim()) {
            setError('Enter your street address, city, and postal code to calculate delivery');
            setCalculating(false);
            return;
          }

          const geocoded = await geocodeAddress(address);
          if (!geocoded) {
            setError('Could not locate your address. Please check the details and try again.');
            setCalculating(false);
            return;
          }

          lat = geocoded.lat;
          lng = geocoded.lng;
        }

        const result = await deliveryService.calculateCost({
          optionId: selectedOption.id,
          lat,
          lng,
          cartSubtotal: subtotal,
        });

        if (!result.success || !result.available) {
          setCost(0);
          setDistanceKm(result.distanceKm ?? null);
          setIsCalculated(false);
          setError(result.message || 'Delivery is not available for this address');
          setCalculating(false);
          return;
        }

        setCost(result.cost);
        setDistanceKm(result.distanceKm ?? null);
        setIsCalculated(true);
        setMessage(result.message || null);

        saveSelection({
          optionId: selectedOption.id,
          optionName: selectedOption.name,
          optionType: selectedOption.type,
          cost: result.cost,
          distanceKm: result.distanceKm ?? null,
          lat,
          lng,
          address,
          calculatedAt: new Date().toISOString(),
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to calculate delivery');
      } finally {
        setCalculating(false);
      }
    },
    [selectedOption, address, saveSelection]
  );

  const clearSelection = useCallback(() => {
    setSelectedOption(null);
    setCost(0);
    setDistanceKm(null);
    setIsCalculated(false);
    setError(null);
    setMessage(null);
    storage.remove(STORAGE_KEYS.DELIVERY_SELECTION);
  }, []);

  const getSavedSelection = useCallback((): SavedDeliverySelection | null => {
    return storage.get(STORAGE_KEYS.DELIVERY_SELECTION) as SavedDeliverySelection | null;
  }, []);

  return {
    options,
    store,
    pricing,
    selectedOption,
    address,
    cost,
    distanceKm,
    isCalculated,
    loadingOptions,
    calculating,
    error,
    message,
    setAddress,
    selectOption,
    calculateDelivery,
    clearSelection,
    getSavedSelection,
  };
}

export default useDelivery;
