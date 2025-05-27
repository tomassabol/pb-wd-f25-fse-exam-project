import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useAuth } from "./useAuth";
import { useWash } from "./useWash";
import {
  getWebSocketService,
  WebSocketNotification,
  LicensePlateScannedData,
} from "../service/websocket-service";
import { useRouter } from "expo-router";

export type WebSocketState = {
  connected: boolean;
  connecting: boolean;
  error: any;
};

export function useWebSocket() {
  const { token } = useAuth();
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
  });

  const wsService = getWebSocketService(token);

  useEffect(() => {
    if (!token) {
      setState((prev) => ({ ...prev, connected: false, connecting: false }));
      return;
    }

    setState((prev) => ({ ...prev, connecting: true }));

    const handleConnected = () => {
      setState({ connected: true, connecting: false, error: null });
    };

    const handleDisconnected = () => {
      setState((prev) => ({ ...prev, connected: false, connecting: false }));
    };

    const handleError = (error: any) => {
      setState((prev) => ({ ...prev, error, connecting: false }));
    };

    // Set up event listeners
    wsService.on("connected", handleConnected);
    wsService.on("disconnected", handleDisconnected);
    wsService.on("error", handleError);

    // Connect
    wsService.connect();

    // Cleanup
    return () => {
      wsService.off("connected", handleConnected);
      wsService.off("disconnected", handleDisconnected);
      wsService.off("error", handleError);
    };
  }, [token]);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  const send = useCallback((message: any) => {
    wsService.send(message);
  }, []);

  return {
    ...state,
    disconnect,
    send,
    wsService,
  };
}

export function useLicensePlateNotifications() {
  const { token } = useAuth();
  const { detectLicensePlate, setSelectedStation } = useWash();
  const wsService = getWebSocketService(token);
  const [notifications, setNotifications] = useState<WebSocketNotification[]>(
    []
  );
  const router = useRouter();

  const handleLicensePlateScanned = useCallback(
    (data: any) => {
      console.log("📱 License plate scanned:", data);

      // Update wash context with the scanned license plate and station
      detectLicensePlate(data.licensePlate);
      setSelectedStation(data.washingStation.id);

      // Show alert to user
      Alert.alert(
        "License Plate Scanned",
        `Your license plate ${data.licensePlate} was scanned at ${data.washingStation.name}. Would you like to start a wash?`,
        [
          {
            text: "Not Now",
            style: "cancel",
          },
          {
            text: "Start Wash",
            onPress: () => {
              console.log(
                "🚗 User wants to start wash at:",
                data.washingStation
              );
              // Navigate to wash selector with the station ID
              router.push({
                pathname: "/(modals)/wash-selector",
                params: { stationId: data.washingStation.id },
              });
            },
          },
        ]
      );
    },
    [detectLicensePlate, setSelectedStation, router]
  );

  const handleNotification = useCallback((notification: any) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 49)]); // Keep last 50 notifications
  }, []);

  useEffect(() => {
    if (wsService) {
      wsService.on("license_plate_scanned", handleLicensePlateScanned);
      wsService.on("notification", handleNotification);

      return () => {
        wsService.off("license_plate_scanned", handleLicensePlateScanned);
        wsService.off("notification", handleNotification);
      };
    }
  }, [wsService, handleLicensePlateScanned, handleNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    clearNotifications,
  };
}

export function useWebSocketPing() {
  const { token } = useAuth();
  const wsService = getWebSocketService(token);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !wsService) return;

    const handleConnected = () => setConnected(true);
    const handleDisconnected = () => setConnected(false);

    wsService.on("connected", handleConnected);
    wsService.on("disconnected", handleDisconnected);

    // Set initial state
    setConnected(wsService.isConnected());

    return () => {
      wsService.off("connected", handleConnected);
      wsService.off("disconnected", handleDisconnected);
    };
  }, [token, wsService]);

  useEffect(() => {
    if (!connected || !wsService) return;

    // Send ping every 30 seconds to keep connection alive
    const interval = setInterval(() => {
      if (wsService.isConnected()) {
        wsService.ping();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [connected, wsService]);
}
