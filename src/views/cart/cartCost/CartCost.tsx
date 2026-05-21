import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from 'contexts/CartContext';
import './CartCost.css';

export const CartCost = () => {
    const { expressShipping, setExpressShipping, getSubtotal, getTotal } = useContext(CartContext);

    return (
        <section className="cart-cost">
            <h3 className="cc-title">Cart Total</h3>

            <div className="cc-summary">
                <div className="ccs-item">
                    <span>Subtotal</span>
                    <span>R {getSubtotal().toFixed(2)}</span>
                </div>

                <div className="ccs-item ccs-shipping">
                    <span>Delivery</span>
                    <div className="ccss-options">
                        <label className="ccsso-item">
                            <input
                                type="radio"
                                name="shipping_option"
                                checked={!expressShipping}
                                onChange={() => setExpressShipping(false)}
                            />
                            <span className="ccss-label">Standard (2–4 days)</span>
                            <span className="ccss-price">R 80.00</span>
                        </label>
                        <label className="ccsso-item">
                            <input
                                type="radio"
                                name="shipping_option"
                                checked={expressShipping}
                                onChange={() => setExpressShipping(true)}
                            />
                            <span className="ccss-label">Express (Next day)</span>
                            <span className="ccss-price">R 150.00</span>
                        </label>
                    </div>
                </div>

                <div className="ccs-item ccs-total">
                    <span>Total <small>(incl. 15% VAT)</small></span>
                    <span>R {getTotal().toFixed(2)}</span>
                </div>
            </div>

            <Link to='/billing' className="button cc-finish-buying-btn">
                Proceed to Checkout
            </Link>
        </section>
    );
};
