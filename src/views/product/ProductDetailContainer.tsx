import { useEffect, useState } from 'react';
// Router
import { Link, useNavigate, useParams } from 'react-router-dom';
// Icons
import { ReactComponent as GobackIcon } from 'assets/icons/go-back.svg';
// Components
import { ViewHeader } from 'components/common/viewHeader/ViewHeader';
import { ProductDetail } from './components/productDetail/ProductDetail';
import { Loader } from 'components/common/loader/Loader';
// Data
import { PRODUCTS } from 'data/products';
// Interfaces
import { Product } from 'interfaces/product';
// Utils
import { isObjEmpty } from 'utils/emptyObject';
// Styles
import './ProductDetailContainer.css';


export const ProductDetailContainer = () => {

    const [product, setProduct] = useState<Product>({} as Product);
    const [loading, setLoading] = useState<boolean>(true);

    const { productID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const found = PRODUCTS.find(p => p.id === productID);
        if (found) {
            setProduct(found);
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [productID, navigate]);

    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <div className="product-detail">

            <ViewHeader title={'Product Detail'} />

            {loading && <div className="loader-error"><Loader /></div>}


            {!isObjEmpty(product) && (
                <div className="product-detail-gotoshop">
                    <Link to={`/shop/all`}>
                        <button className="gotoshop-btn">
                            <GobackIcon className="goback-icon" />
                            <span>Back to Shop</span>
                        </button>
                    </Link>
                    <ProductDetail product={product} />
                </div>
            )}

        </div>
    )
}
