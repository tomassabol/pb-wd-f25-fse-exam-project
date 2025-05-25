import { Coordinate } from "@/types/station";

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate (user location)
 * @param coord2 Second coordinate (station location)
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Default location (Copenhagen center) used as fallback
 */
export const DEFAULT_LOCATION: Coordinate = {
  latitude: 55.6761,
  longitude: 12.5683,
};
