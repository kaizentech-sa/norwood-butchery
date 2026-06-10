import { useEffect } from 'react';
import type { DeliveryAddress } from 'shipping/types/delivery';
import type { UseDeliveryReturn } from 'shipping/hooks/useDelivery';
import './DeliveryOptionsSection.css';

type Props = {
    subtotal: number;
    billingAddress: DeliveryAddress;
    delivery: UseDeliveryReturn;
};

export const DeliveryOptionsSection = ({ subtotal, billingAddress, delivery }: Props) => {
    const {
        options,
        store,
        selectedOption,
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
    } = delivery;

    const needsAddress = selectedOption?.type === 'per_km';

    useEffect(() => {
        setAddress(billingAddress);
    }, [billingAddress, setAddress]);

    useEffect(() => {
        if (!selectedOption || selectedOption.type === 'per_km') return;
        calculateDelivery(subtotal);
    }, [selectedOption?.id, subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loadingOptions || options.length === 0) return null;

    const hasBillingAddress =
        billingAddress.address.trim() &&
        billingAddress.city.trim() &&
        billingAddress.postcode.trim() &&
        billingAddress.state.trim();

    return (
        <section className="delivery-options-section">
            <h3 className="delivery-options-title">Delivery</h3>

            {store && (
                <p className="delivery-store-note">
                    Delivering from {store.name || store.address || 'our store'}
                </p>
            )}

            <div className="delivery-options-list" role="radiogroup" aria-label="Delivery options">
                {options.map((option) => (
                    <label key={option.id} className="delivery-option">
                        <input
                            type="radio"
                            name="delivery-option"
                            value={option.id}
                            checked={selectedOption?.id === option.id}
                            onChange={() => selectOption(option)}
                        />
                        <span className="delivery-option-label">
                            <span className="delivery-option-name">{option.name}</span>
                            {option.description && (
                                <span className="delivery-option-desc">{option.description}</span>
                            )}
                        </span>
                    </label>
                ))}
            </div>

            {needsAddress && (
                <div className="delivery-calculate-block">
                    <p className="delivery-address-hint">
                        {hasBillingAddress
                            ? 'Your delivery address above will be used to calculate distance and cost'
                            : 'Complete your delivery address above, then calculate delivery'}
                    </p>
                    <button
                        type="button"
                        className="button delivery-calculate-btn"
                        onClick={() => calculateDelivery(subtotal)}
                        disabled={calculating || !hasBillingAddress}
                    >
                        {calculating ? 'Calculating...' : 'Calculate delivery'}
                    </button>
                </div>
            )}

            {error && (
                <p className="delivery-error" role="alert">
                    {error}
                </p>
            )}
            {message && !error && <p className="delivery-message">{message}</p>}

            {distanceKm != null && distanceKm > 0 && (
                <p className="delivery-distance">
                    Distance from store: <strong>{distanceKm.toFixed(1)} km</strong>
                </p>
            )}

            {isCalculated && (
                <p className="delivery-cost-result">
                    Delivery cost: <strong>{cost === 0 ? 'Free' : `R${cost.toFixed(2)}`}</strong>
                </p>
            )}
        </section>
    );
};
