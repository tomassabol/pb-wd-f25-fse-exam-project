import { type FastifyReply, type FastifyRequest } from "fastify";
import { env } from "../env";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/health", "/v1/auth/login", "/v1/auth/register"];

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Skip authentication for public routes
  if (PUBLIC_ROUTES.some((route) => request.url.startsWith(route))) {
    return;
  }

  // Check for API key first (legacy support)
  const apiKey = request.headers["x-api-key"];
  if (apiKey && apiKey === env.API_KEY) {
    return;
  }

  // Check for JWT token
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      await request.jwtVerify();
      return;
    } catch (err) {
      return reply.status(401).send({
        error: "Invalid token",
        message: "The provided JWT token is invalid or expired",
      });
    }
  }

  // No valid authentication found
  return reply.status(401).send({
    error: "Authentication required",
    message: "Please provide a valid API key or JWT token",
  });
};
