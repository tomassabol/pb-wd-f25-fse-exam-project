import assert from "assert";
import { db } from "../../db";
import { type FastifyInstance } from "fastify";
import { carWash, userMembership } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { validateBody } from "../middleware/validation-middleware";
import {
  createCarWashSchema,
  type CreateCarWashRequest,
} from "./lib/car-wash.schemas";

export async function carWashRoutes(fastify: FastifyInstance) {
  fastify.get("/v1/car-wash", async (request, reply) => {
    const carWashes = await db.query.carWash.findMany({
      where: eq(carWash.userId, request.user.id),
      with: {
        washingStation: true,
        washType: true,
        membership: true,
      },
    });
    return reply.status(200).send(carWashes);
  });

  fastify.get("/v1/car-wash/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const washRecord = await db.query.carWash.findFirst({
      where: and(eq(carWash.id, id), eq(carWash.userId, request.user.id)),
      with: {
        washingStation: true,
        washType: true,
        membership: true,
      },
    });

    if (!washRecord) {
      return reply.status(404).send({ message: "Car wash not found" });
    }

    console.log(washRecord);

    return reply.status(200).send(washRecord);
  });

  fastify.post<{ Body: CreateCarWashRequest }>(
    "/v1/car-wash",
    {
      preHandler: validateBody(createCarWashSchema),
    },
    async (request, reply) => {
      const {
        licensePlate,
        washingStationId,
        washTypeId,
        paymentMethod,
        amount,
        currency,
        membershipId = null,
      } = request.body as unknown as CreateCarWashRequest;

      if (paymentMethod === "membership" && !membershipId) {
        return reply.status(400).send({
          message: "Membership ID is required for this payment method",
        });
      }

      if (paymentMethod === "membership") {
        assert(
          typeof membershipId === "string",
          "Membership ID is required for this payment method"
        );
        const membership = await db.query.userMembership.findFirst({
          where: and(
            eq(userMembership.userId, request.user.id),
            eq(userMembership.membershipId, membershipId)
          ),
        });

        if (!membership) {
          return reply.status(400).send({ message: "Membership not found" });
        }
      }

      const [washRecord] = await db
        .insert(carWash)
        .values({
          licensePlate: licensePlate,
          washingStationId,
          washTypeId,
          paymentMethod,
          amount,
          currency,
          membershipId,
          userId: request.user.id,
        })
        .returning();

      if (!washRecord) {
        return reply.status(400).send({ message: "Failed to create car wash" });
      }

      return reply.status(201).send(washRecord);
    }
  );
}
