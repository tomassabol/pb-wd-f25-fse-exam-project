import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({
  logger: true,
});

// Register CORS
await server.register(cors, {
  origin: true, // In production, replace with your Expo app's URL
});

// Health check route
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
