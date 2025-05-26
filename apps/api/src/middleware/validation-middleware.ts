import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

export function validateBody<T extends z.ZodSchema>(schema: T) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.body);
      // Replace the request body with validated data
      request.body = validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: "Validation failed",
          details: error.errors,
        });
      }
      return reply.status(400).send({
        error: "Invalid request body",
      });
    }
  };
}

export function validateParams<T extends z.ZodSchema>(schema: T) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.params);
      request.params = validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: "Validation failed",
          details: error.errors,
        });
      }
      return reply.status(400).send({
        error: "Invalid request params",
      });
    }
  };
}
