import { FastifyInstance } from "fastify";
import { wsManager } from "../websocket/websocket-manager";
import { db } from "../../db";
import { userMembership } from "../../db/schema/user-membership.schema";
import { user } from "../../db/schema/user.schema";
import { washingStation } from "../../db/schema/washing-station.schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const licensePlateScanSchema = z.object({
  licensePlate: z.string().min(1),
  washingStationId: z.string().min(1),
});

type LicensePlateScanRequest = z.infer<typeof licensePlateScanSchema>;

export async function websocketRoutes(server: FastifyInstance) {
  // WebSocket connection endpoint
  server.get("/ws", { websocket: true }, (connection, req) => {
    console.log("🔌 WebSocket connection attempt:", {
      url: req.url,
      ip: req.ip,
      userAgent: req.headers["user-agent"]?.substring(0, 50),
    });

    // Extract user ID from JWT token - get from query params since headers are not easily accessible
    const query = req.query as { token?: string };
    const token = query.token;

    if (!token) {
      console.log("❌ No token provided, closing connection");
      connection.close(1008, "Unauthorized - No token provided");
      return;
    }

    try {
      const decoded = server.jwt.verify(token) as { id: string };
      const userId = decoded.id;
      console.log("✅ WebSocket authenticated for user:", userId);

      // Add client to WebSocket manager
      wsManager.addClient(userId, connection);
      console.log("📝 Added client to WebSocket manager");

      // Send welcome message
      const welcomeMessage = {
        type: "connected",
        message: "WebSocket connection established",
        timestamp: new Date().toISOString(),
      };
      connection.send(JSON.stringify(welcomeMessage));
      console.log("📤 Sent welcome message:", welcomeMessage);

      // Handle incoming messages
      connection.on("message", (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());

          // Handle ping messages
          if (data.type === "ping") {
            connection.send(
              JSON.stringify({
                type: "pong",
                timestamp: new Date().toISOString(),
              })
            );
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });
    } catch (error) {
      console.error("❌ Invalid JWT token:", error);
      connection.close(1008, "Unauthorized - Invalid token");
    }

    // Handle connection close
    connection.on("close", (code, reason) => {
      console.log("🔌 WebSocket connection closed:", {
        code,
        reason: reason?.toString(),
      });
    });

    connection.on("error", (error) => {
      console.error("🔌 WebSocket connection error:", error);
    });
  });

  // Manual trigger endpoint for license plate scanning
  server.post<{ Body: LicensePlateScanRequest }>(
    "/v1/license-plate-scan",
    async (request, reply) => {
      try {
        const { licensePlate, washingStationId } = licensePlateScanSchema.parse(
          request.body
        );

        // Find the washing station
        const station = await db.query.washingStation.findFirst({
          where: eq(washingStation.id, washingStationId),
        });

        if (!station) {
          return reply
            .status(404)
            .send({ message: "Washing station not found" });
        }

        // Find user membership by license plate
        const membership = await db.query.userMembership.findFirst({
          where: and(
            eq(userMembership.licensePlate, licensePlate),
            eq(userMembership.isActive, true)
          ),
          with: {
            user: true,
            membership: true,
          },
        });

        if (!membership || !membership.user) {
          return reply.status(404).send({
            message: "No active membership found for this license plate",
          });
        }

        // Check if membership is still valid
        const now = new Date();
        if (membership.expiresAt < now) {
          return reply.status(400).send({
            message: "Membership has expired",
          });
        }

        // Create notification message
        const notification = {
          type: "license_plate_scanned",
          data: {
            licensePlate,
            washingStation: {
              id: station.id,
              name: station.name,
              address: station.address,
            },
            membership: {
              id: membership.membership?.id,
              name: membership.membership?.name,
            },
            scannedAt: new Date().toISOString(),
          },
          message: `Your license plate ${licensePlate} was scanned at ${station.name}. Would you like to start a wash?`,
        };

        // Send notification to the user
        const sent = wsManager.sendToUser(membership.userId!, notification);

        if (sent) {
          return reply.status(200).send({
            message: "Notification sent successfully",
            userId: membership.userId,
            userConnected: true,
          });
        } else {
          return reply.status(200).send({
            message: "User not connected to WebSocket",
            userId: membership.userId,
            userConnected: false,
          });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: "Invalid request data",
            errors: error.errors,
          });
        }

        console.error("Error processing license plate scan:", error);
        return reply.status(500).send({
          message: "Internal server error",
        });
      }
    }
  );

  // Get connected users (for debugging)
  server.get("/v1/websocket/connected-users", async (request, reply) => {
    const connectedUsers = wsManager.getConnectedUsers();
    return reply.status(200).send({
      connectedUsers,
      count: connectedUsers.length,
    });
  });

  // Test notification endpoint (for debugging)
  server.post("/v1/websocket/test-notification", async (request, reply) => {
    const { userId, message } = request.body as {
      userId: string;
      message: string;
    };

    const testNotification = {
      type: "test_notification",
      data: {
        message,
        timestamp: new Date().toISOString(),
      },
    };

    const sent = wsManager.sendToUser(userId, testNotification);

    return reply.status(200).send({
      sent,
      userConnected: wsManager.isUserConnected(userId),
    });
  });
}
