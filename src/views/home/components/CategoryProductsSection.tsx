import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EcommerceProductCard } from 'components/common/ecommerceProductCard/EcommerceProductCard';
import { useShop } from 'shop/core/ShopProvider';
import { useProducts } from 'shop/core/hooks/useProducts';
import type { Product } from 'shop/core/ports';
import './CategoryProductsSection.css';

type props = {
    categorySlug: string;
    title: string;
    limit?: number;
    viewAllLabel?: string;
};

export const CategoryProductsSection = ({
    categorySlug,
    title,
    limit = 4,
    viewAllLabel = 'View All',
}: props) => {
    const navigate = useNavigate();
    const { cart, categories } = useShop();
    const { fetchCategories } = categories;
    const { products, loading, error, fetchProducts } = useProducts();

    const categoryId = useMemo(() => {
        const match = categories.categories.find(
            (item) => item.slug === categorySlug || String(item.id) === categorySlug
        );
        return match?.id;
    }, [categories.categories, categorySlug]);

    useEffect(() => {
        fetchCategories({ hideEmpty: true });
    }, [fetchCategories]);

    useEffect(() => {
        if (!categoryId) return;

        fetchProducts({
            categoryId,
            perPage: limit,
            page: 1,
        });
    }, [categoryId, limit, fetchProducts]);

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
        <section className="category-products-section">
            <div className="cps-title">
                <h2>{title}</h2>
            </div>

            {loading && <p className="cps-status">Loading products...</p>}

            {error && (
                <p className="cps-status cps-status-error" role="alert">
                    Failed to load products: {error}
                </p>
            )}

            {!loading && !error && categoryId && products.length === 0 && (
                <p className="cps-status">No products found in this category.</p>
            )}

            {!loading && !error && !categoryId && categories.categories.length > 0 && (
                <p className="cps-status">Category not found.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="ecommerce-product-grid cps-product-grid">
                    {products.map((product) => (
                        <EcommerceProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            )}

            <Link className="button cps-btn" to={`/shop/${categorySlug}`}>
                {viewAllLabel}
            </Link>
        </section>
    );
};
