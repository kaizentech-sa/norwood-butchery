import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactComponent as GobackIcon } from 'assets/icons/go-back.svg';
import { ViewHeader } from 'components/common/viewHeader/ViewHeader';
import { ProductDetail } from './components/productDetail/ProductDetail';
import { Loader } from 'components/common/loader/Loader';
import { WooCommerceDataProvider } from 'shop/adapters/catalog/woocommerce';
import type { Product } from 'shop/core/ports';
import './ProductDetailContainer.css';

export const ProductDetailContainer = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { productID } = useParams();

    useEffect(() => {
        const id = Number(productID);

        if (!productID || Number.isNaN(id)) {
            setProduct(null);
            setError('Invalid product');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        WooCommerceDataProvider.getProduct(id)
            .then((data) => {
                setProduct(data);
                setError(null);
            })
            .catch((err: Error) => {
                setProduct(null);
                setError(err?.message || 'Product not found');
            })
            .finally(() => setLoading(false));
    }, [productID]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productID]);

    return (
        <div className="product-detail">
            <ViewHeader title="Product Detail" />

            {loading && (
                <div className="loader-error">
                    <Loader />
                </div>
            )}

            {error && !loading && (
                <div className="product-detail-error">
                    <p>{error}</p>
                    <Link className="button" to="/shop/all">
                        Back to Shop
                    </Link>
                </div>
            )}

            {product && !loading && !error && (
                <div className="product-detail-gotoshop">
                    <Link to="/shop/all">
                        <button type="button" className="gotoshop-btn">
                            <GobackIcon className="goback-icon" />
                            <span>Back to Shop</span>
                        </button>
                    </Link>
                    <ProductDetail product={product} />
                </div>
            )}
        </div>
    );
};
