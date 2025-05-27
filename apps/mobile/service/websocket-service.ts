import "react-native-url-polyfill/auto";

export type WebSocketNotification = {
  type: string;
  data: unknown;
  message?: string;
  timestamp?: string;
};

export type LicensePlateScannedData = {
  licensePlate: string;
  washingStation: {
    id: string;
    name: string;
    address: string;
  };
  membership: {
    id: string;
    name: string;
  };
  scannedAt: string;
};

export class WebSocketService {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map();
  private isConnecting = false;

  constructor(token: string | null) {
    this.token = token;
  }

  connect() {
    if (!this.token || this.isConnecting) {
      console.log("WebSocket connect skipped:", {
        hasToken: !!this.token,
        isConnecting: this.isConnecting,
      });
      return;
    }

    this.isConnecting = true;

    try {
      // Determine the correct WebSocket URL based on the environment
      const getWebSocketUrl = () => {
        // For Expo development, use the same host as the API calls
        // This will automatically use the correct IP address
        if (typeof window !== "undefined" && window.location) {
          // Web environment
          const protocol =
            window.location.protocol === "https:" ? "wss:" : "ws:";
          return `${protocol}//${window.location.hostname}:3000/ws`;
        } else {
          return `ws://${process.env.EXPO_PUBLIC_API_URL}:3000/ws`;
        }
      };

      const wsUrl = `${getWebSocketUrl()}?token=${encodeURIComponent(this.token)}`;
      console.log("WebSocket connecting to:", wsUrl.substring(0, 50) + "...");
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("✅ WebSocket connected successfully");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.emit("connected", { connected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const notification: WebSocketNotification = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", notification);
          this.emit(notification.type, notification.data);
          this.emit("notification", notification);
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("❌ WebSocket disconnected:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        this.isConnecting = false;
        this.ws = null;
        this.emit("disconnected", { connected: false });

        // Attempt to reconnect if not a manual close
        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          console.log("🔄 Scheduling reconnect...");
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.isConnecting = false;
        this.emit("error", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.isConnecting = false;
      this.emit("error", error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000
    );

    console.log(
      `Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect();
      }
    }, delay);
  }

  send(message: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  // Send ping to keep connection alive
  ping() {
    this.send({ type: "ping", timestamp: new Date().toISOString() });
  }

  // Event listener management
  on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: unknown) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: unknown) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `Error in WebSocket event listener for ${event}:`,
            error
          );
        }
      });
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getToken(): string | null {
    return this.token;
  }

  updateToken(token: string | null) {
    console.log("🔄 updateToken called:", {
      wasConnected: this.isConnected(),
      oldToken: !!this.token,
      newToken: !!token,
      tokensEqual: this.token === token,
    });

    const wasConnected = this.isConnected();

    // Don't disconnect if the token is the same
    if (this.token === token) {
      console.log("✅ Token unchanged, keeping connection");
      return;
    }

    this.token = token;

    if (wasConnected) {
      console.log("🔌 Disconnecting to update token");
      this.disconnect();
      if (token) {
        console.log("🔌 Reconnecting with new token in 100ms");
        setTimeout(() => this.connect(), 100);
      }
    }
  }
}

// Singleton instance
let wsService: WebSocketService | null = null;

export const getWebSocketService = (token: string | null): WebSocketService => {
  console.log("🔧 getWebSocketService called:", {
    hasExistingService: !!wsService,
    isConnected: wsService?.isConnected(),
    hasToken: !!token,
  });

  if (!wsService) {
    console.log("🆕 Creating new WebSocket service (first time)");
    wsService = new WebSocketService(token);
  } else if (!wsService.isConnected() && token) {
    console.log("🔄 Updating token and connecting existing service");
    wsService.updateToken(token);
    if (!wsService.isConnected()) {
      wsService.connect();
    }
  } else if (wsService.getToken() !== token) {
    console.log("🔄 Updating existing WebSocket service token");
    wsService.updateToken(token);
  } else {
    console.log("✅ Reusing existing WebSocket service");
  }
  return wsService;
};
