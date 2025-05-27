import { WebSocket } from "ws";

interface ClientConnection {
  userId: string;
  socket: any; // Fastify WebSocket connection
  lastPing: Date;
}

export class WebSocketManager {
  private clients: Map<string, ClientConnection> = new Map();

  addClient(userId: string, socket: any) {
    // Remove existing connection for this user if any
    this.removeClient(userId);

    const connection: ClientConnection = {
      userId,
      socket,
      lastPing: new Date(),
    };

    this.clients.set(userId, connection);

    // Set up ping/pong for connection health
    socket.on("pong", () => {
      const client = this.clients.get(userId);
      if (client) {
        client.lastPing = new Date();
      }
    });

    socket.on("close", () => {
      this.removeClient(userId);
    });

    socket.on("error", () => {
      this.removeClient(userId);
    });

    console.log(`WebSocket client connected: ${userId}`);
  }

  removeClient(userId: string) {
    const client = this.clients.get(userId);
    if (client) {
      try {
        client.socket.close();
      } catch (error) {
        // Socket might already be closed
      }
      this.clients.delete(userId);
      console.log(`WebSocket client disconnected: ${userId}`);
    }
  }

  sendToUser(userId: string, message: any) {
    console.log("Sending message to user:", userId);
    console.log("Message:", message);
    console.log("Clients:", this.clients);
    const client = this.clients.get(userId);
    if (client && client.socket.readyState === WebSocket.OPEN) {
      try {
        client.socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error(`Failed to send message to user ${userId}:`, error);
        this.removeClient(userId);
        return false;
      }
    }
    return false;
  }

  broadcast(message: any) {
    let sentCount = 0;
    for (const [userId, client] of this.clients) {
      if (this.sendToUser(userId, message)) {
        sentCount++;
      }
    }
    return sentCount;
  }

  getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  isUserConnected(userId: string): boolean {
    return this.clients.has(userId);
  }

  // Clean up stale connections
  cleanup() {
    const now = new Date();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [userId, client] of this.clients) {
      if (now.getTime() - client.lastPing.getTime() > staleThreshold) {
        this.removeClient(userId);
      }
    }
  }

  // Start periodic cleanup
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, 60000); // Run every minute
  }

  // Send ping to all clients
  pingAll() {
    for (const [userId, client] of this.clients) {
      if (client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.ping();
        } catch (error) {
          this.removeClient(userId);
        }
      } else {
        this.removeClient(userId);
      }
    }
  }

  // Start periodic ping
  startPing() {
    setInterval(() => {
      this.pingAll();
    }, 30000); // Ping every 30 seconds
  }
}

export const wsManager = new WebSocketManager();
