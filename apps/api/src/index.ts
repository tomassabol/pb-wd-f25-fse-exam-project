import Fastify from "fastify";
import cors from "@fastify/cors";
import { authMiddleware } from "./middleware/auth-middleware";

const server = Fastify({
  logger: true,
  trustProxy: true,
});

async function startServer() {
  await server.register(cors, { origin: true });

  server.addHook("preHandler", authMiddleware);

  server.get("/health", async () => {
    return { status: "ok" };
  });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

void startServer();
