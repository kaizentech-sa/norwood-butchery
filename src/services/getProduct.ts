import { PRODUCTS } from 'data/products';
import { Product } from 'interfaces/product';

export const getProduct = (id: string): Promise<Product | undefined> =>
    Promise.resolve(PRODUCTS.find(p => p.id === id));
