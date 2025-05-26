import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import { authMiddleware } from "./middleware/auth-middleware";
import { membershipRoutes } from "./routes/membership-routes";
import { washingStationRoutes } from "./routes/washing-stations-routes";
import { washTypeRoutes } from "./routes/wash-type-routes";
import { authRoutes } from "./routes/auth-routes";
import { initAuth } from "./auth";
import { carWashRoutes } from "./routes/car-wash-routes";

const server = Fastify({
  logger: true,
  trustProxy: true,
});

async function startServer() {
  await server.register(cors, { origin: true });

  await initAuth(server);

  const publicRoutes = ["/v1/auth/login", "/v1/auth/register", "/status"];

  server.addHook("onRequest", async (request, reply) => {
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

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

void startServer();
