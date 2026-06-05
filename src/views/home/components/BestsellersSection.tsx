import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as AwardIcon } from 'assets/icons/award.svg';
import { EcommerceProductCard } from 'components/common/ecommerceProductCard/EcommerceProductCard';
import { useShop } from 'shop/core/ShopProvider';
import { useProducts } from 'shop/core/hooks/useProducts';
import type { Product } from 'shop/core/ports';
import './BestsellersSection.css';

const BESTSELLER_TAG = 'bestseller';
const BESTSELLERS_LIMIT = 8;

export const BestsellersSection = () => {
    const navigate = useNavigate();
    const { cart } = useShop();
    const { products, loading, error, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts({
            tag: BESTSELLER_TAG,
            perPage: BESTSELLERS_LIMIT,
            page: 1,
        });
    }, [fetchProducts]);

    const handleAddToCart = (product: Product) => {
        const hasVariations =
            product.type === 'variable' ||
            product.hasVariations ||
            (product.variations && product.variations.length > 0);

        if (hasVariations) {
            navigate(`/product/${product.id}`);
            return;
        }

        cart.addItem(product);
    };

    return (
        <section className="bestsellers-section">
            <div className="bs-title">
                <AwardIcon className="award-icon" />
                <h2>Our Bestsellers</h2>
            </div>

            {loading && <p className="bs-status">Loading bestsellers...</p>}

            {error && (
                <p className="bs-status bs-status-error" role="alert">
                    Failed to load bestsellers: {error}
                </p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="bs-status">No bestseller products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="ecommerce-product-grid bs-product-grid">
                    {products.map((product) => (
                        <EcommerceProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            )}

            <Link className="button bs-btn" to="/shop/all">
                View All Products
            </Link>
        </section>
    );
};
