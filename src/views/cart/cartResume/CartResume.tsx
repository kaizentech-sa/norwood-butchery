import { Link } from 'react-router-dom';
import { ReactComponent as GobackIcon } from 'assets/icons/go-back.svg';
import { useShop } from 'shop/core/ShopProvider';
import type { CartItem } from 'shop/core/ports';
import { CartResumeItem } from '../cartResumeItem/CartResumeItem';
import './CartResume.css';

type props = {
    items: CartItem[];
};

export const CartResume = ({ items }: props) => {
    const { cart } = useShop();

    return (
        <div className="cart-table">
            <div className="cart-table-header" aria-hidden="true">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
            </div>

            <div className="cart-table-body">
                {items.map((item) => (
                    <CartResumeItem
                        key={`${item.productId}-${item.variationId || 'base'}`}
                        item={item}
                    />
                ))}
            </div>

            <div className="cart-table-footer">
                <Link to="/shop/all" className="button cart-continue-btn">
                    <GobackIcon className="cart-continue-icon" />
                    Continue Shopping
                </Link>
                <button
                    type="button"
                    className="cart-clear-btn"
                    onClick={() => cart.clearCart()}
                >
                    Clear Cart
                </button>
            </div>
        </div>
    );
};
