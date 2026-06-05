import { Link } from 'react-router-dom';
import { formatPrice } from 'shop/utils/helpers';
import type { Product } from 'shop/core/ports';
import './EcommerceProductCard.css';

type props = {
    product: Product;
    onAddToCart: (product: Product) => void;
};

export const EcommerceProductCard = ({ product, onAddToCart }: props) => {
    const imageUrl = product.images?.[0];
    const isOnSale =
        product.onSale &&
        product.salePrice !== undefined &&
        product.salePrice < product.regularPrice;
    const isOutOfStock = product.stockStatus === 'outofstock';
    const hasVariations =
        product.type === 'variable' ||
        product.hasVariations ||
        (product.variations && product.variations.length > 0);

    return (
        <article className="ecommerce-product-card">
            <Link to={`/product/${product.id}`} className="ecommerce-product-link">
                <div className="ecommerce-product-image-wrap">
                    {isOnSale && <span className="ecommerce-product-badge">Sale</span>}
                    <div className="ecommerce-product-image-frame">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="ecommerce-product-image"
                            />
                        ) : (
                            <div className="ecommerce-product-image-placeholder">No image</div>
                        )}
                    </div>
                </div>

                <div className="ecommerce-product-body">
                    {product.categories?.[0] && (
                        <span className="ecommerce-product-category">
                            {product.categories[0]}
                        </span>
                    )}
                    <h2 className="ecommerce-product-title">{product.name}</h2>
                    <div className="ecommerce-product-price">
                        {isOnSale && (
                            <span className="ecommerce-product-price-old">
                                {formatPrice(product.regularPrice)}
                            </span>
                        )}
                        <span className="ecommerce-product-price-current">
                            {isOnSale
                                ? formatPrice(product.salePrice)
                                : formatPrice(product.price)}
                        </span>
                    </div>
                </div>
            </Link>

            <button
                type="button"
                className="ecommerce-product-btn"
                disabled={isOutOfStock}
                onClick={() => onAddToCart(product)}
            >
                {isOutOfStock
                    ? 'Out of stock'
                    : hasVariations
                      ? 'Select options'
                      : 'Add to cart'}
            </button>
        </article>
    );
};
