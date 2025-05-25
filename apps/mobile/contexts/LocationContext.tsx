import React, { createContext, useContext, useState, useEffect } from "react";
import * as Location from "expo-location";
import { Coordinate } from "@/types/station";
import { DEFAULT_LOCATION } from "@/utils/locationUtils";

interface LocationContextType {
  userLocation: Coordinate | null;
  isLocationLoading: boolean;
  locationError: string | null;
  hasLocationPermission: boolean;
  requestLocationPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      setHasLocationPermission(granted);

      if (!granted) {
        setLocationError("Location permission denied");
        // Use default location as fallback
        setUserLocation(DEFAULT_LOCATION);
      }

      return granted;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setLocationError("Failed to request location permission");
      setUserLocation(DEFAULT_LOCATION);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    if (!hasLocationPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 100,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      setLocationError("Failed to get current location");
      // Use default location as fallback
      setUserLocation(DEFAULT_LOCATION);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const refreshLocation = async (): Promise<void> => {
    await getCurrentLocation();
  };

  useEffect(() => {
    // Check permission status on mount
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      const granted = status === "granted";
      setHasLocationPermission(granted);

      if (granted) {
        getCurrentLocation();
      } else {
        // Use default location if no permission
        setUserLocation(DEFAULT_LOCATION);
      }
    });
  }, []);

  const value: LocationContextType = {
    userLocation,
    isLocationLoading,
    locationError,
    hasLocationPermission,
    requestLocationPermission,
    refreshLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
