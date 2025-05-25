import { WashingStation } from "../../api/db/schema/washing-station.schema";
import { Station } from "@/types/station";

export function transformWashingStationToStation(
  washingStation: WashingStation,
  userLocation?: { latitude: number; longitude: number }
): Station {
  // Calculate distance if user location is provided
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        washingStation.coordinate.latitude,
        washingStation.coordinate.longitude
      )
    : 0;

  // Determine if station is currently open (simplified logic)
  const isOpen = isStationOpen(washingStation.openHours);

  return {
    id: washingStation.id,
    name: washingStation.name,
    type: washingStation.type,
    address: washingStation.address,
    coordinate: washingStation.coordinate,
    rating: washingStation.rating,
    distance,
    isOpen,
    hours: washingStation.openHours,
    waitTime: washingStation.averageWaitTime,
    isFavorite: false, // This would need to come from user preferences
    isPremium: washingStation.isPremium,
    imageUrl:
      washingStation.imageUrl ||
      "https://images.pexels.com/photos/6873028/pexels-photo-6873028.jpeg",
    phone: washingStation.phone || "",
    description: washingStation.description || "",
    services: washingStation.services,
  };
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Simple function to check if station is open (you might want to enhance this)
function isStationOpen(openHours: string): boolean {
  // This is a simplified implementation
  // You might want to parse the openHours string and check against current time
  const now = new Date();
  const currentHour = now.getHours();

  // Assuming most stations are open between 6 AM and 11 PM
  // You should implement proper parsing of the openHours string
  return currentHour >= 6 && currentHour <= 23;
}

export function transformWashingStationsToStations(
  washingStations: WashingStation[],
  userLocation?: { latitude: number; longitude: number }
): Station[] {
  return washingStations.map((station) =>
    transformWashingStationToStation(station, userLocation)
  );
}
