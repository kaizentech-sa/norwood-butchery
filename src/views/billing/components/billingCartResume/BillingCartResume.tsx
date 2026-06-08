import type { CartItem } from 'shop/core/ports';
import { BillingProductCard } from '../billingProductCard/BillingProductCard';
import './BillingCartResume.css';

type props = {
    items: CartItem[];
};

export const BillingCartResume = ({ items }: props) => {
    return (
        <div className="billing-cart-resume">
            {items.map((item) => {
                const displayName =
                    item.variation && Object.keys(item.variation).length > 0
                        ? `${item.name} (${Object.values(item.variation).join(', ')})`
                        : item.name;

                return (
                    <BillingProductCard
                        key={`${item.productId}-${item.variationId || 'base'}`}
                        name={displayName}
                        price={item.price}
                        image={item.image}
                        quantity={item.quantity}
                    />
                );
            })}
        </div>
    );
};
