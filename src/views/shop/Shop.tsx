import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EcommerceProductCard } from 'components/common/ecommerceProductCard/EcommerceProductCard';
import { useShop } from 'shop/core/ShopProvider';
import type { Product } from 'shop/core/ports';
import './Shop.css';

type PriceSort = 'default' | 'price-asc' | 'price-desc';

const PRODUCTS_PER_PAGE = 12;

export const Shop = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { products, categories, cart } = useShop();
    const { fetchCategories } = categories;
    const {
        fetchProducts,
        products: productList,
        loading,
        error,
        total,
        totalPages,
        currentPage,
    } = products;

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [priceSort, setPriceSort] = useState<PriceSort>('default');
    const [page, setPage] = useState(1);

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
        setPage(1);
    }, [categoryId, debouncedSearch, priceSort]);

    useEffect(() => {
        fetchProducts({
            categoryId,
            search: debouncedSearch || undefined,
            perPage: PRODUCTS_PER_PAGE,
            page,
            ...sortParams,
        });
    }, [categoryId, debouncedSearch, sortParams, page, fetchProducts]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

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

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
        setPage(nextPage);
    };

    const pageNumbers = useMemo(() => {
        if (totalPages <= 1) return [];

        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }, [page, totalPages]);

    const rangeStart = total === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
    const rangeEnd = Math.min(currentPage * PRODUCTS_PER_PAGE, total);

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
                    {productList.map((product) => (
                        <EcommerceProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>

                {!loading && !error && totalPages > 1 && (
                    <nav className="shop-pagination" aria-label="Product pagination">
                        <p className="shop-pagination-summary">
                            Showing {rangeStart}–{rangeEnd} of {total} products
                        </p>

                        <div className="shop-pagination-controls">
                            <button
                                type="button"
                                className="shop-pagination-btn"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                aria-label="Previous page"
                            >
                                Previous
                            </button>

                            <div className="shop-pagination-pages">
                                {pageNumbers[0] > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            className="shop-pagination-page"
                                            onClick={() => handlePageChange(1)}
                                        >
                                            1
                                        </button>
                                        {pageNumbers[0] > 2 && (
                                            <span className="shop-pagination-ellipsis">…</span>
                                        )}
                                    </>
                                )}

                                {pageNumbers.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        className={`shop-pagination-page${pageNumber === page ? ' active' : ''}`}
                                        onClick={() => handlePageChange(pageNumber)}
                                        aria-current={pageNumber === page ? 'page' : undefined}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                                    <>
                                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                            <span className="shop-pagination-ellipsis">…</span>
                                        )}
                                        <button
                                            type="button"
                                            className="shop-pagination-page"
                                            onClick={() => handlePageChange(totalPages)}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                type="button"
                                className="shop-pagination-btn"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>
                    </nav>
                )}
            </section>

            <h3 className="shop-legend">
                “All our meat cuts are of the highest quality, ensuring that all our customers are satisfied.”
            </h3>
        </div>
    );
};
