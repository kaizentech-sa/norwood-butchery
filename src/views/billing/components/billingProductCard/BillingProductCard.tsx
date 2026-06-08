import { formatPrice } from 'shop/utils/helpers';
import './BillingProductCard.css';

type props = {
    name: string;
    price: number;
    image: string;
    quantity: number;
};

export const BillingProductCard = ({ name, price, image, quantity }: props) => {
    return (
        <div className="billing-product-card">
            <div className="bpc-data">
                <img src={image} alt={name} />
                <div className="bpc-data-info">
                    <div>
                        <span className="bdi-name">{name}</span>
                        <span className="bdi-price">{formatPrice(price)}</span>
                    </div>
                    <span className="bdi-amount">Qty: {quantity}</span>
                </div>
            </div>

            <div className="bpc-total">
                <span>{formatPrice(price * quantity)}</span>
            </div>
        </div>
    );
};
