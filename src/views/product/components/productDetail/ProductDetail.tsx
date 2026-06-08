import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ItemCount } from '../itemCount/ItemCount';
import { useShop } from 'shop/core/ShopProvider';
import { formatPrice, stripHtml } from 'shop/utils/helpers';
import { noStockToast } from 'utils/toasts';
import { SHOP_CONFIG } from 'shop/utils/constants';
import type { Product, ProductVariation } from 'shop/core/ports';
import './ProductDetail.css';

type props = {
    product: Product;
};

const findMatchingVariation = (
    variations: ProductVariation[] | undefined,
    selected: Record<string, string>
): ProductVariation | null => {
    if (!variations?.length || Object.keys(selected).length === 0) return null;

    return (
        variations.find((variation) =>
            Object.entries(selected).every(([key, value]) => {
                const direct = variation.attributes[key];
                if (direct === value) return true;

                const normalizedKey = key.toLowerCase();
                const matchKey = Object.keys(variation.attributes).find(
                    (attrKey) =>
                        attrKey.toLowerCase() === normalizedKey ||
                        attrKey.toLowerCase().endsWith(normalizedKey)
                );

                return matchKey ? variation.attributes[matchKey] === value : false;
            })
        ) ?? null
    );
};

export const ProductDetail = ({ product }: props) => {
    const { cart } = useShop();
    const [addedToCart, setAddedToCart] = useState({ isAdded: false, amount: 0 });
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

    const hasVariations =
        product.type === 'variable' ||
        product.hasVariations ||
        (product.variations && product.variations.length > 0);

    const attributeOptions = product.variationAttributes || {};

    useEffect(() => {
        if (product.defaultAttributes && Object.keys(product.defaultAttributes).length > 0) {
            setSelectedAttributes(product.defaultAttributes);
            return;
        }

        if (!hasVariations) {
            setSelectedAttributes({});
            return;
        }

        const defaults: Record<string, string> = {};
        const options = product.variationAttributes || {};
        Object.entries(options).forEach(([key, values]) => {
            if (values[0]) defaults[key] = values[0];
        });
        setSelectedAttributes(defaults);
    }, [product.id, product.defaultAttributes, product.variationAttributes, hasVariations]);

    const selectedVariation = useMemo(
        () => findMatchingVariation(product.variations, selectedAttributes),
        [product.variations, selectedAttributes]
    );

    const displayPrice = selectedVariation
        ? selectedVariation.onSale && selectedVariation.salePrice
            ? selectedVariation.salePrice
            : selectedVariation.price
        : product.onSale && product.salePrice
          ? product.salePrice
          : product.price;

    const displayRegularPrice = selectedVariation
        ? selectedVariation.regularPrice
        : product.regularPrice;

    const isOnSale = selectedVariation
        ? selectedVariation.onSale &&
          selectedVariation.salePrice !== undefined &&
          selectedVariation.salePrice < selectedVariation.regularPrice
        : product.onSale &&
          product.salePrice !== undefined &&
          product.salePrice < product.regularPrice;

    const stockStatus = selectedVariation?.stockStatus ?? product.stockStatus;
    const stockQuantity = selectedVariation?.stockQuantity ?? product.stockQuantity;
    const availableStock =
        stockStatus === 'outofstock'
            ? 0
            : stockQuantity !== undefined && stockQuantity > 0
              ? stockQuantity
              : SHOP_CONFIG.MAX_QUANTITY_PER_ITEM;

    const imageUrl =
        selectedVariation?.image?.src ||
        product.images?.[0] ||
        SHOP_CONFIG.PLACEHOLDER_IMAGE;

    const description = stripHtml(product.description || product.shortDescription || '');
    const canAddToCart = !hasVariations || Boolean(selectedVariation);

    const handleAttributeChange = (attribute: string, value: string) => {
        setSelectedAttributes((current) => ({
            ...current,
            [attribute]: value,
        }));
        setAddedToCart({ isAdded: false, amount: 0 });
    };

    const onAdd = (amount: number) => {
        if (!canAddToCart) return;

        const added = cart.addItem(
            product,
            amount,
            selectedVariation?.id,
            selectedVariation?.attributes
        );

        if (added) {
            setAddedToCart({ isAdded: true, amount });
        } else {
            noStockToast(product.name);
        }
    };

    return (
        <div className="product-detail-card">
            <div className="pdc-main">
                <div className="pdcm-img">
                    <img src={imageUrl} alt={product.name} />
                </div>

                <div className="pdcm-data">
                    {product.categories?.[0] && (
                        <span className="pdcm-category">{product.categories[0]}</span>
                    )}
                    <h3>{product.name}</h3>

                    <div className="pdcm-price">
                        {isOnSale && (
                            <span className="pdcm-price-old">{formatPrice(displayRegularPrice)}</span>
                        )}
                        <span className="pdcm-price-current">{formatPrice(displayPrice)}</span>
                    </div>

                    <hr />

                    {hasVariations && Object.keys(attributeOptions).length > 0 && (
                        <div className="pdcm-variations">
                            {Object.entries(attributeOptions).map(([attribute, options]) => (
                                <label key={attribute} className="pdcm-variation-field">
                                    <span>{attribute}</span>
                                    <select
                                        value={selectedAttributes[attribute] || ''}
                                        onChange={(event) =>
                                            handleAttributeChange(attribute, event.target.value)
                                        }
                                    >
                                        {options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ))}
                        </div>
                    )}

                    {hasVariations && !selectedVariation && (
                        <p className="pdcm-variation-hint">Please select all options.</p>
                    )}

                    {addedToCart.isAdded ? (
                        <div className="finish-buying">
                            <span className="fb-info">
                                {`x${addedToCart.amount} ${product.name} added to cart`}
                            </span>
                            <div className="fb-buttons">
                                <Link to="/cart" className="button fb-btn">
                                    Finish Buying
                                </Link>
                                <Link to="/shop/all" className="button fb-continue-shopping-btn">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    ) : canAddToCart ? (
                        <ItemCount stock={availableStock} initial={1} onAdd={onAdd} />
                    ) : (
                        <button type="button" className="button-disabled add-to-cart-btn" disabled>
                            Select Options
                        </button>
                    )}
                </div>
            </div>

            {description && (
                <div className="pdc-description">
                    <h4>Description</h4>
                    <p>{description}</p>
                </div>
            )}
        </div>
    );
};
