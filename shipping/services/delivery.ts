import { API_CONFIG } from '../../shop/utils/constants';
import type {
  DeliveryCalculateRequest,
  DeliveryCalculateResponse,
  DeliveryOptionsResponse,
} from '../types/delivery';

export class DeliveryService {
  async getOptions(): Promise<DeliveryOptionsResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery/options`, {
        method: 'GET',
        headers: {
          'X-API-Key': API_CONFIG.API_KEY,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          store: null,
          options: [],
          pricing: null,
        };
      }

      return {
        success: data.success ?? true,
        store: data.store ?? null,
        options: (data.options ?? []).filter((o: { enabled?: boolean }) => o.enabled !== false),
        pricing: data.pricing ?? null,
      };
    } catch (error) {
      console.error('Delivery options error:', error);
      return {
        success: false,
        store: null,
        options: [],
        pricing: null,
      };
    }
  }

  async calculateCost(request: DeliveryCalculateRequest): Promise<DeliveryCalculateResponse> {
    try {
      const body: Record<string, unknown> = {
        option_id: request.optionId,
        cart_subtotal: request.cartSubtotal,
      };

      if (request.lat != null && request.lng != null) {
        body.lat = request.lat;
        body.lng = request.lng;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_CONFIG.API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return {
        success: data.success ?? false,
        available: data.available ?? false,
        optionId: data.option_id,
        cost: parseFloat(data.cost) || 0,
        costFormatted: data.cost_formatted,
        distanceKm: data.distance_km ?? null,
        message: data.message,
      };
    } catch (error: unknown) {
      console.error('Delivery calculate error:', error);
      return {
        success: false,
        available: false,
        cost: 0,
        message: error instanceof Error ? error.message : 'Failed to calculate delivery',
      };
    }
  }
}

export const deliveryService = new DeliveryService();
export default deliveryService;
