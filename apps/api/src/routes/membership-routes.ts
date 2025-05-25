import { FastifyInstance } from "fastify";
import { db } from "../../db/index";

export async function membershipRoutes(server: FastifyInstance) {
  server.get("/v1/memberships", async (request, reply) => {
    const memberships = await db.query.membership.findMany();
    return reply.status(200).send(memberships);
  });
}
