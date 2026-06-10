import { Link } from 'react-router-dom';
import { formatPrice } from 'shop/utils/helpers';
import './CartCost.css';

type props = {
    subtotal: number;
};

export const CartCost = ({ subtotal }: props) => {
    return (
        <aside className="cart-order-summary">
            <h2 className="cos-title">Order Summary</h2>

            <div className="cos-rows">
                <div className="cos-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cos-row">
                    <span>Delivery</span>
                    <span className="cos-shipping-note">Calculated at checkout</span>
                </div>
            </div>

            <div className="cos-divider" />

            <div className="cos-total-row">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="cos-tax-note">Tax included where applicable</p>

            <Link to="/billing" className="button cos-checkout-btn">
                Proceed to Checkout
            </Link>

            <p className="cos-secure-note">Secure checkout powered by PayFast</p>
            <div className="cos-payment-badges" aria-hidden="true">
                <span>VISA</span>
                <span>MASTERCARD</span>
                <span>EFT</span>
            </div>
        </aside>
    );
};
