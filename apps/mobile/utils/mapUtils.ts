import { Linking, Platform, Alert } from "react-native";
import { Coordinate } from "@/types/station";

/**
 * Opens the device's default map application with directions to the specified location
 * @param destination The destination coordinates
 * @param destinationName Optional name for the destination
 */
export async function openMapsWithDirections({
  destination,
  destinationName,
}: {
  destination: Coordinate;
  destinationName?: string;
}): Promise<void> {
  const { latitude, longitude } = destination;
  const label = destinationName
    ? encodeURIComponent(destinationName)
    : "Destination";

  let url: string;

  if (Platform.OS === "ios") {
    // For iOS, use Apple Maps
    url = `maps://app?daddr=${latitude},${longitude}&dirflg=d`;

    // Alternative URL with label
    if (destinationName) {
      url = `maps://app?daddr=${latitude},${longitude}&q=${label}`;
    }
  } else {
    // For Android, use Google Maps
    url = `google.navigation:q=${latitude},${longitude}`;

    // Alternative URL for Google Maps app
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${label}`;

    // Try Google Maps app first, fallback to web
    const canOpenGoogleMaps = await Linking.canOpenURL(
      "google.navigation:q=0,0"
    );
    if (canOpenGoogleMaps) {
      url = `google.navigation:q=${latitude},${longitude}`;
    } else {
      url = googleMapsUrl;
    }
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback to web-based maps
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error("Error opening maps:", error);
    Alert.alert(
      "Error",
      "Unable to open maps application. Please check if you have a maps app installed.",
      [{ text: "OK" }]
    );
  }
}

/**
 * Opens the device's map application to show a specific location (without directions)
 * @param location The location coordinates
 * @param locationName Optional name for the location
 */
export async function openMapsWithLocation(
  location: Coordinate,
  locationName?: string
): Promise<void> {
  const { latitude, longitude } = location;
  const label = locationName ? encodeURIComponent(locationName) : "Location";

  let url: string;

  if (Platform.OS === "ios") {
    // For iOS, use Apple Maps
    url = `maps://app?ll=${latitude},${longitude}&q=${label}`;
  } else {
    // For Android, use Google Maps
    url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback to web-based maps
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error("Error opening maps:", error);
    Alert.alert(
      "Error",
      "Unable to open maps application. Please check if you have a maps app installed.",
      [{ text: "OK" }]
    );
  }
}
