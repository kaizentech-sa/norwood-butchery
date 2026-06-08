import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as ErrorIcon } from 'assets/icons/error.svg';
import { ReactComponent as GobackIcon } from 'assets/icons/go-back.svg';
import { ViewHeader } from 'components/common/viewHeader/ViewHeader';
import { Loader } from 'components/common/loader/Loader';
import { useShop } from 'shop/core/ShopProvider';
import { CartResume } from './cartResume/CartResume';
import { CartCost } from './cartCost/CartCost';
import './Cart.css';

export const Cart = () => {
    const { cart } = useShop();
    const { items, itemCount, initialized } = cart;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!initialized) {
        return (
            <div className="cart">
                <ViewHeader title="Cart" />
                <div className="loader-error">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="cart">
            <ViewHeader title="Cart" />

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
                    <Link to="/shop/all">
                        <button type="button" className="gotoshop-btn">
                            <GobackIcon className="goback-icon" />
                            <span>Shop</span>
                        </button>
                    </Link>

                    <CartResume items={items} />
                    <CartCost subtotal={cart.total} />
                </section>
            )}
        </div>
    );
};
