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

    const isOnSale =
        item.salePrice !== undefined &&
        item.regularPrice > 0 &&
        item.salePrice < item.regularPrice;

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
        <div className="cart-table-row">
            <div className="ctr-product">
                <div className="ctr-image">
                    <img src={item.image} alt={item.name} />
                </div>
                <span className="ctr-name">{displayName}</span>
            </div>

            <div className="ctr-price">
                <span className="ctr-price-current">{formatPrice(item.price)}</span>
                {isOnSale && (
                    <span className="ctr-price-old">{formatPrice(item.regularPrice)}</span>
                )}
            </div>

            <div className="ctr-quantity">
                <div className="ctr-qty-control">
                    <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                    >
                        <MinusIcon className="ctr-qty-icon" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={item.quantity >= maxStock}
                        aria-label="Increase quantity"
                    >
                        <PlusIcon className="ctr-qty-icon" />
                    </button>
                </div>
            </div>

            <div className="ctr-total">
                <span className="ctr-line-total">{formatPrice(lineTotal)}</span>
                <button
                    type="button"
                    onClick={() => cart.removeItem(item.productId, item.variationId)}
                    className="ctr-remove"
                    aria-label={`Remove ${item.name}`}
                >
                    <DeleteIcon className="ctr-remove-icon" />
                </button>
            </div>
        </div>
    );
};
