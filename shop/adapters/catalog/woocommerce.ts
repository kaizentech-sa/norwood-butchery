/**
 * Sam's Hardware WooCommerce Adapter
 * 
 * Implements ShopDataProvider interface using WooCommerce backend.
 */

import { WooCommerceDataProvider as Provider } from '../../../services/woocommerce';
import type { ShopDataProvider } from '../../core/ports';

export const WooCommerceDataProvider: ShopDataProvider = Provider;

export default WooCommerceDataProvider;
