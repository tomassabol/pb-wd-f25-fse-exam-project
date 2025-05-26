import { isStationOpen } from "./lib/is-station-open";
import { db } from "db";
import { eq, inArray, and, arrayContains, SQL } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { washingStation } from "db/schema/washing-station.schema";
import { userWashingStation } from "db/schema/user-washing-station.schema";

export const getWashingStationByIdSchema = z.object({
  id: z.string(),
});

export const getWashingStationsFiltersSchema = z.object({
  type: z.enum(["manual", "automatic"]).optional(),
  isOpen: z.coerce.boolean().optional(),
  isPremium: z.coerce.boolean().optional(),
  limit: z.coerce.number().optional(),
  favorite: z.coerce.boolean().optional(),
});

export async function washingStationRoutes(server: FastifyInstance) {
  server.get("/v1/washing-stations", async (request, reply) => {
    try {
      const { type, isOpen, isPremium, limit, favorite } =
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

      const userFavorites = await db.query.userWashingStation.findMany({
        where: eq(userWashingStation.userId, request.user.id),
      });

      const favoriteStationIds = new Set(
        userFavorites.map((fav) => fav.washingStationId)
      );

      if (isOpen) {
        washingStations = washingStations.filter(isStationOpen);
      }

      if (favorite) {
        washingStations = washingStations.filter((station) =>
          favoriteStationIds.has(station.id)
        );
      }

      return reply.status(200).send(
        washingStations.map((station) => ({
          ...station,
          isOpen: isStationOpen(station),
          isFavorite: favoriteStationIds.has(station.id),
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
      const userFavorites = await db.query.userWashingStation.findMany({
        where: eq(userWashingStation.userId, request.user.id),
      });
      const favoriteStationIds = new Set(
        userFavorites.map((fav) => fav.washingStationId)
      );

      if (!station) {
        return reply.status(404).send({ message: "Washing station not found" });
      }

      return reply.status(200).send({
        ...station,
        isFavorite: favoriteStationIds.has(station.id),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: "Invalid id" });
      }
      throw error;
    }
  });

  server.get("/v1/washing-stations/favorite", async (request, reply) => {
    const favoriteWashingStations = await db.query.userWashingStation.findMany({
      where: eq(userWashingStation.userId, request.user.id),
      with: {
        washingStation: true,
      },
    });

    return reply.status(200).send(
      favoriteWashingStations.map((userWashingStation) => ({
        ...userWashingStation.washingStation,
        isFavorite: true,
      }))
    );
  });

  server.post("/v1/washing-stations/:id/favorite", async (request, reply) => {
    const { id } = getWashingStationByIdSchema.parse(request.params);

    await db.transaction(async (tx) => {
      const station = await tx.query.washingStation.findFirst({
        where: eq(washingStation.id, id),
      });

      if (!station) {
        return reply.status(404).send({ message: "Washing station not found" });
      }

      // Check if the washing station is already in favorites
      const existingFavorite = await tx.query.userWashingStation.findFirst({
        where: and(
          eq(userWashingStation.userId, request.user.id),
          eq(userWashingStation.washingStationId, id)
        ),
      });

      if (existingFavorite) {
        return reply
          .status(400)
          .send({ message: "Washing station is already in favorites" });
      }

      await tx.insert(userWashingStation).values({
        userId: request.user.id,
        washingStationId: id,
      });
    });

    return reply
      .status(200)
      .send({ message: "Washing station added to favorites" });
  });

  server.delete("/v1/washing-stations/:id/favorite", async (request, reply) => {
    const { id } = getWashingStationByIdSchema.parse(request.params);

    const deleted = await db
      .delete(userWashingStation)
      .where(
        and(
          eq(userWashingStation.userId, request.user.id),
          eq(userWashingStation.washingStationId, id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return reply.status(404).send({ message: "Washing station not found" });
    }

    return reply
      .status(200)
      .send({ message: "Washing station removed from favorites" });
  });
}
