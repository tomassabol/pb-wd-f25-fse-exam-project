import { type FastifyInstance } from "fastify";
import { db } from "../../db/index";
import { eq, and } from "drizzle-orm";
import { userMembership, membership } from "../../db/schema";
import { validateBody } from "../middleware/validation-middleware";
import {
  createUserMembershipSchema,
  type CreateUserMembershipRequest,
} from "./lib/membership.schemas";

export async function membershipRoutes(server: FastifyInstance) {
  server.get("/v1/memberships", async (request, reply) => {
    const memberships = await db.query.membership.findMany();
    return reply.status(200).send(memberships);
  });

  server.get("/v1/user-memberships", async (request, reply) => {
    const userMemberships = await db.query.userMembership.findMany({
      where: eq(userMembership.userId, request.user.id),
      with: {
        membership: true,
      },
    });

    return reply.status(200).send(userMemberships);
  });

  server.post<{ Body: CreateUserMembershipRequest }>(
    "/v1/user-memberships/:membershipId",
    { preHandler: validateBody(createUserMembershipSchema) },
    async (request, reply) => {
      const { licensePlate } = request.body;
      const { membershipId } = request.params as { membershipId: string };

      const membershipRecord = await db.query.membership.findFirst({
        where: eq(membership.id, membershipId),
      });

      if (!membershipRecord) {
        return reply.status(404).send({ message: "Membership not found" });
      }

      const existingUserMembership = await db.query.userMembership.findFirst({
        where: and(
          eq(userMembership.userId, request.user.id),
          eq(userMembership.membershipId, membershipId)
        ),
      });

      if (existingUserMembership) {
        return reply.status(400).send({
          message: "User already has a membership for this membership",
        });
      }

      const licensePlateMembershipRecord =
        await db.query.userMembership.findFirst({
          where: eq(userMembership.licensePlate, licensePlate),
        });

      if (licensePlateMembershipRecord) {
        return reply.status(400).send({
          message: "Membership already exists for this license plate",
        });
      }

      const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      );

      const [userMembershipRecord] = await db
        .insert(userMembership)
        .values({
          userId: request.user.id,
          membershipId,
          licensePlate,
          expiresAt,
        })
        .returning();

      return reply.status(201).send(userMembershipRecord);
    }
  );

  server.delete(
    "/v1/user-memberships/:userMembershipId",
    async (request, reply) => {
      const { userMembershipId } = request.params as {
        userMembershipId: string;
      };

      const existingUserMembership = await db.query.userMembership.findFirst({
        where: and(
          eq(userMembership.id, userMembershipId),
          eq(userMembership.userId, request.user.id)
        ),
      });

      if (!existingUserMembership) {
        return reply.status(404).send({
          message:
            "User membership not found or you don't have permission to delete it",
        });
      }

      const updatedUserMembership = await db
        .update(userMembership)
        .set({ isActive: false })
        .where(eq(userMembership.id, userMembershipId))
        .returning();

      return reply.status(200).send({
        message: "Membership cancelled successfully",
      });
    }
  );
}
