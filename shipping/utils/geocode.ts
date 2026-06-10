import type { DeliveryAddress } from '../types/delivery';

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName?: string;
}

/**
 * Geocode a South African address using OpenStreetMap Nominatim.
 */
export async function geocodeAddress(address: DeliveryAddress): Promise<GeocodeResult | null> {
  const parts = [
    address.address,
    address.city,
    address.state,
    address.postcode,
    address.country || 'South Africa',
  ].filter(Boolean);

  if (parts.length < 2) return null;

  const query = encodeURIComponent(parts.join(', '));
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=za`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
    },
  });

  if (!response.ok) return null;

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;

  const hit = results[0];
  const lat = parseFloat(hit.lat);
  const lng = parseFloat(hit.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    displayName: hit.display_name,
  };
}

/**
 * Haversine distance in kilometres between two coordinates.
 */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
