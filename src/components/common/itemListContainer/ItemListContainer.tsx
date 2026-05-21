import React, { useEffect, useState } from 'react';
// Icons
import { ReactComponent as ErrorIcon } from 'assets/icons/error.svg';
// Components
import { Loader } from 'components/common/loader/Loader';
import { ItemList } from './components/itemList/ItemList';
// Data
import { PRODUCTS, BESTSELLERS } from 'data/products';
// Interfaces
import { Product } from 'interfaces/product';
// Styles
import './ItemListContainer.css';


type props = {
    category: string;
    limit: boolean;
}

export const ItemListContainer = ({ category, limit }: props) => {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setProducts([]);
        setLoading(true);
        setError(false);

        try {
            let result: Product[];

            if (limit) {
                result = BESTSELLERS;
            } else if (category === 'all') {
                result = PRODUCTS.filter(p => p.category !== 'other');
            } else if (category === 'bestsellers') {
                result = BESTSELLERS;
            } else {
                result = PRODUCTS.filter(p => p.category === category);
            }

            setProducts(result);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }

    }, [category, limit]);

    return (
        <>
            {loading && <div className="loader-error"><Loader /></div>}

            {error &&
                <div className="loader-error">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', color: '#6b6b6b' }}>
                        <ErrorIcon style={{ width: '32px' }} />
                        <h3 className="error-title">No products available</h3>
                    </div>
                </div>
            }

            {products && <ItemList products={products} />}
        </>
    )
}
