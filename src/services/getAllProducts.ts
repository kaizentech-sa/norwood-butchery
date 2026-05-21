import { PRODUCTS } from 'data/products';
import { Product } from 'interfaces/product';

export const getAllProducts = (): Promise<Product[]> =>
    Promise.resolve(PRODUCTS);
