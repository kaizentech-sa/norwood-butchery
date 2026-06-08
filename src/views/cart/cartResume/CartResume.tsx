import type { CartItem } from 'shop/core/ports';
import { CartResumeItem } from '../cartResumeItem/CartResumeItem';
import './CartResume.css';

type props = {
    items: CartItem[];
};

export const CartResume = ({ items }: props) => {
    return (
        <div className="cart-resume">
            {items.map((item) => (
                <CartResumeItem key={`${item.productId}-${item.variationId || 'base'}`} item={item} />
            ))}
        </div>
    );
};
