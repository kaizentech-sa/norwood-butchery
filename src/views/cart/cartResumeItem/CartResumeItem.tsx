import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/x.svg';
import { useShop } from 'shop/core/ShopProvider';
import { formatPrice } from 'shop/utils/helpers';
import { SHOP_CONFIG } from 'shop/utils/constants';
import type { CartItem } from 'shop/core/ports';
import './CartResumeItem.css';

type props = {
    item: CartItem;
};

export const CartResumeItem = ({ item }: props) => {
    const { cart } = useShop();

    const lineTotal = item.price * item.quantity;
    const maxStock =
        item.stockStatus === 'outofstock'
            ? 0
            : item.stockQuantity !== undefined && item.stockQuantity > 0
              ? item.stockQuantity
              : SHOP_CONFIG.MAX_QUANTITY_PER_ITEM;

    const remainingStock = Math.max(0, maxStock - item.quantity);

    const displayName =
        item.variation && Object.keys(item.variation).length > 0
            ? `${item.name} (${Object.values(item.variation).join(', ')})`
            : item.name;

    const handleIncrease = () => {
        if (item.quantity < maxStock) {
            cart.updateQuantity(item.productId, item.quantity + 1, item.variationId);
        }
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            cart.updateQuantity(item.productId, item.quantity - 1, item.variationId);
        }
    };

    return (
        <div className="cart-resume-item">
            <div className="cri-img-np">
                <div className="cri-img">
                    <img src={item.image} alt={item.name} />
                </div>

                <div className="cri-name-price">
                    <h4>{displayName}</h4>
                    <span>{formatPrice(item.price)}</span>
                </div>
            </div>

            <div className="cri-controls-tp">
                <div className="cri-controls">
                    <div className="icc-buttons">
                        <button type="button" onClick={handleDecrease} disabled={item.quantity <= 1}>
                            <MinusIcon className="mp-icon" />
                        </button>
                        <span className="cric-item-amount">{item.quantity}</span>
                        <button
                            type="button"
                            onClick={handleIncrease}
                            disabled={item.quantity >= maxStock}
                        >
                            <PlusIcon className="mp-icon" />
                        </button>
                    </div>
                    <span className="crib-stock">
                        {remainingStock > 0 ? `Stock: ${remainingStock}` : 'No stock'}
                    </span>
                </div>

                <span className="cri-total-price">{formatPrice(lineTotal)}</span>
            </div>

            <button
                type="button"
                onClick={() => cart.removeItem(item.productId, item.variationId)}
                className="cri-delete"
                aria-label={`Remove ${item.name}`}
            >
                <DeleteIcon className="close-icon" />
            </button>
        </div>
    );
};
