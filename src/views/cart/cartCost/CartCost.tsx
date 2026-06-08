import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from 'shop/utils/helpers';
import { SHIPPING_CONFIG } from 'shop/utils/constants';
import {
    getSavedShippingType,
    getShippingPrice,
    saveShippingType,
    type ShippingType,
} from 'utils/cartShipping';
import './CartCost.css';

type props = {
    subtotal: number;
};

export const CartCost = ({ subtotal }: props) => {
    const [shippingType, setShippingType] = useState<ShippingType>(getSavedShippingType);

    useEffect(() => {
        saveShippingType(shippingType);
    }, [shippingType]);

    const shippingPrice = getShippingPrice(subtotal, shippingType);
    const total = subtotal + shippingPrice;
    const freeShipping = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD;

    return (
        <section className="cart-cost">
            <h3 className="cc-title">Cart Total</h3>

            <div className="cc-summary">
                <div className="ccs-item">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="ccs-item ccs-shipping">
                    <span>Delivery</span>
                    <div className="ccss-options">
                        <label className="ccsso-item">
                            <input
                                type="radio"
                                name="shipping_option"
                                checked={shippingType === 'standard'}
                                onChange={() => setShippingType('standard')}
                            />
                            <span className="ccss-label">
                                {SHIPPING_CONFIG.DEFAULT_RATES.standard.name} (
                                {SHIPPING_CONFIG.DEFAULT_RATES.standard.deliveryTime})
                            </span>
                            <span className="ccss-price">
                                {freeShipping ? 'Free' : formatPrice(SHIPPING_CONFIG.DEFAULT_RATES.standard.price)}
                            </span>
                        </label>
                        <label className="ccsso-item">
                            <input
                                type="radio"
                                name="shipping_option"
                                checked={shippingType === 'express'}
                                onChange={() => setShippingType('express')}
                            />
                            <span className="ccss-label">
                                {SHIPPING_CONFIG.DEFAULT_RATES.express.name} (
                                {SHIPPING_CONFIG.DEFAULT_RATES.express.deliveryTime})
                            </span>
                            <span className="ccss-price">
                                {freeShipping ? 'Free' : formatPrice(SHIPPING_CONFIG.DEFAULT_RATES.express.price)}
                            </span>
                        </label>
                    </div>
                </div>

                {freeShipping && (
                    <p className="cc-free-shipping">
                        Free delivery on orders over {formatPrice(SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD)}
                    </p>
                )}

                <div className="ccs-item ccs-total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            <Link to="/billing" className="button cc-finish-buying-btn">
                Proceed to Checkout
            </Link>
        </section>
    );
};
