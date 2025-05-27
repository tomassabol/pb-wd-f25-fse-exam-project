import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import websocket from "@fastify/websocket";
import { authMiddleware } from "./middleware/auth-middleware";
import { membershipRoutes } from "./routes/membership-routes";
import { washingStationRoutes } from "./routes/washing-stations-routes";
import { washTypeRoutes } from "./routes/wash-type-routes";
import { authRoutes } from "./routes/auth-routes";
import { initAuth } from "./auth";
import { carWashRoutes } from "./routes/car-wash-routes";
import { websocketRoutes } from "./routes/websocket-routes";
import { wsManager } from "./websocket/websocket-manager";

const server = Fastify({
  logger: true,
  trustProxy: true,
});

async function startServer() {
  await server.register(cors, { origin: true });
  await server.register(websocket);

  await initAuth(server);

  const publicRoutes = [
    "/v1/auth/login",
    "/v1/auth/register",
    "/status",
    "/ws",
    "/v1/license-plate-scan",
  ];

  server.addHook("onRequest", async (request, reply) => {
    // Skip token verification for WebSocket upgrades
    if (request.headers.upgrade === "websocket") {
      return;
    }

    if (publicRoutes.includes(request.url)) {
      return;
    }

    return server.verifyToken(request, reply);
  });

  server.get("/health", async () => {
    return { status: "ok" };
  });

  // Apply global authentication middleware
  server.addHook("preHandler", authMiddleware);

  // Register all routes
  server.register(authRoutes);
  server.register(membershipRoutes);
  server.register(washingStationRoutes);
  server.register(washTypeRoutes);
  server.register(carWashRoutes);
  server.register(websocketRoutes);

  // Start WebSocket manager cleanup and ping
  wsManager.startCleanup();
  wsManager.startPing();

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

void startServer();
