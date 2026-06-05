import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useShop } from 'shop/core/ShopProvider';
import { formatPrice } from 'shop/utils/helpers';
import type { Product } from 'shop/core/ports';
import './Shop.css';

type PriceSort = 'default' | 'price-asc' | 'price-desc';

export const Shop = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { products, categories, cart } = useShop();
    const { fetchCategories } = categories;
    const { fetchProducts, products: productList, loading, error } = products;

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [priceSort, setPriceSort] = useState<PriceSort>('default');

    const activeCategory = category || 'all';

    const categoryId = useMemo(() => {
        if (activeCategory === 'all') return undefined;
        const match = categories.categories.find(
            (item) => item.slug === activeCategory || String(item.id) === activeCategory
        );
        return match?.id;
    }, [activeCategory, categories.categories]);

    const sortParams = useMemo(() => {
        if (priceSort === 'price-asc') {
            return { orderBy: 'price' as const, order: 'asc' as const };
        }
        if (priceSort === 'price-desc') {
            return { orderBy: 'price' as const, order: 'desc' as const };
        }
        return {};
    }, [priceSort]);

    useEffect(() => {
        fetchCategories({ hideEmpty: true });
    }, [fetchCategories]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
        }, 400);

        return () => window.clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts({
            categoryId,
            search: debouncedSearch || undefined,
            perPage: 12,
            page: 1,
            ...sortParams,
        });
    }, [categoryId, debouncedSearch, sortParams, fetchProducts]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCategoryChange = (slug: string) => {
        navigate(`/shop/${slug}`);
    };

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

    const categoryOptions = [
        { slug: 'all', label: 'All Categories' },
        ...categories.categories.map((item) => ({
            slug: item.slug || String(item.id),
            label: item.name,
        })),
    ];

    return (
        <div className="shop">
            <div className="shop-banner"></div>

            <section className="shop-main">
                <div className="sm-header">
                    <div className="smh-line"></div>
                    <h1>Shop</h1>
                    <div className="smh-line"></div>
                </div>

                <div className="shop-toolbar">
                    <label className="shop-search">
                        <span className="shop-toolbar-label">Search</span>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search products..."
                            aria-label="Search products"
                        />
                    </label>

                    <label className="shop-category-select">
                        <span className="shop-toolbar-label">Category</span>
                        <select
                            value={activeCategory}
                            onChange={(event) => handleCategoryChange(event.target.value)}
                            aria-label="Filter by category"
                        >
                            {categoryOptions.map((item) => (
                                <option key={item.slug} value={item.slug}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="shop-sort-select">
                        <span className="shop-toolbar-label">Sort by price</span>
                        <select
                            value={priceSort}
                            onChange={(event) => setPriceSort(event.target.value as PriceSort)}
                            aria-label="Sort by price"
                        >
                            <option value="default">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </label>
                </div>

                {loading && <p className="shop-status">Loading products...</p>}

                {error && (
                    <p className="shop-status shop-status-error" role="alert">
                        Failed to load products: {error}
                    </p>
                )}

                {!loading && !error && productList.length === 0 && (
                    <p className="shop-status">No products found.</p>
                )}

                <div className="ecommerce-product-grid">
                    {productList.map((product) => {
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
                            <article key={product.id} className="ecommerce-product-card">
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
                                    onClick={() => handleAddToCart(product)}
                                >
                                    {isOutOfStock
                                        ? 'Out of stock'
                                        : hasVariations
                                          ? 'Select options'
                                          : 'Add to cart'}
                                </button>
                            </article>
                        );
                    })}
                </div>
            </section>

            <h3 className="shop-legend">
                “All our meat cuts are of the highest quality, ensuring that all our customers are satisfied.”
            </h3>
        </div>
    );
};
