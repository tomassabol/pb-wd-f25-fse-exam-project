import { isStationOpen } from "./lib/is-station-open";
import { db } from "db";
import { eq, inArray, and, arrayContains, SQL } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { washingStation } from "db/schema/washing-station.schema";

export const getWashingStationByIdSchema = z.object({
  id: z.string(),
});

export const getWashingStationsFiltersSchema = z.object({
  type: z.enum(["manual", "automatic"]).optional(),
  isOpen: z.coerce.boolean().optional(),
  isPremium: z.coerce.boolean().optional(),
  limit: z.coerce.number().optional(),
});

export async function washingStationRoutes(server: FastifyInstance) {
  server.get("/v1/washing-stations", async (request, reply) => {
    try {
      const { type, isOpen, isPremium, limit } =
        getWashingStationsFiltersSchema.parse(request.query);

      const conditions: SQL[] = [];

      if (isPremium !== undefined) {
        conditions.push(eq(washingStation.isPremium, isPremium));
      }

      if (type) {
        conditions.push(arrayContains(washingStation.type, [type]));
      }

      let washingStations =
        (await db.query.washingStation.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          limit: limit ?? undefined,
        })) ?? [];

      if (isOpen) {
        washingStations = washingStations.filter(isStationOpen);
      }

      return reply.status(200).send(
        washingStations.map((station) => ({
          ...station,
          isOpen: isStationOpen(station),
        }))
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ message: "Invalid query parameters", errors: error.errors });
      }
      console.error("Error fetching washing stations:", error);
      throw error;
    }
  });

  server.get("/v1/washing-stations/:id", async (request, reply) => {
    try {
      const { id } = getWashingStationByIdSchema.parse(request.params);
      const station = await db.query.washingStation.findFirst({
        where: eq(washingStation.id, id),
      });

      if (!station) {
        return reply.status(404).send({ message: "Washing station not found" });
      }

      return reply.status(200).send(station);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: "Invalid id" });
      }
      throw error;
    }
  });
}
