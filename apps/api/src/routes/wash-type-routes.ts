import { db } from "db";
import { type FastifyInstance } from "fastify";

export async function washTypeRoutes(server: FastifyInstance) {
  server.get("/v1/wash-types", async (request, reply) => {
    const washTypes = await db.query.washType.findMany();
    return reply.status(200).send(washTypes);
  });
}
