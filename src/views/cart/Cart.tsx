import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as ErrorIcon } from 'assets/icons/error.svg';
import { Loader } from 'components/common/loader/Loader';
import { useShop } from 'shop/core/ShopProvider';
import { formatPrice } from 'shop/utils/helpers';
import { SHIPPING_CONFIG } from 'shop/utils/constants';
import { CartResume } from './cartResume/CartResume';
import { CartCost } from './cartCost/CartCost';
import './Cart.css';

export const Cart = () => {
    const { cart } = useShop();
    const { items, itemCount, initialized, total } = cart;

    const freeShipping = total >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD;
    const amountToFreeShipping = SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - total;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!initialized) {
        return (
            <div className="cart">
                <div className="loader-error">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="cart">
            {itemCount === 0 ? (
                <div className="loader-error">
                    <div className="cart-empty">
                        <ErrorIcon style={{ width: '32px' }} />
                        <h3 className="error-title">Your cart is empty — add some products to continue</h3>
                        <Link to="/shop/all" className="error-btn">
                            Go to Shop
                        </Link>
                    </div>
                </div>
            ) : (
                <section className="cart-main">
                    <header className="cart-page-header">
                        <h1>Shopping Cart</h1>
                        <p className="cart-item-count">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                        {!freeShipping && amountToFreeShipping > 0 && (
                            <p className="cart-free-shipping-banner">
                                {formatPrice(amountToFreeShipping)} away from free shipping!
                            </p>
                        )}
                    </header>

                    <div className="cart-layout">
                        <div className="cart-layout-items">
                            <CartResume items={items} />
                        </div>
                        <div className="cart-layout-summary">
                            <CartCost subtotal={total} />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
