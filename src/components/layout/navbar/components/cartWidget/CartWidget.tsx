import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { useShop } from 'shop/core/ShopProvider';
import './CartWidget.css';

export const CartWidget = () => {
    const { cart } = useShop();

    return (
        <button className="navbar-link cart-btn" type="button">
            <CartIcon className="cart-icon" />
            <span className="cart-items-amount">{cart.itemCount}</span>
        </button>
    );
};
