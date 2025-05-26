import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { washingStation } from "./washing-station.schema";
import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const userWashingStation = pgTable(
  "user_washing_station",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("user_id").references(() => user.id),
    washingStationId: text("washing_station_id").references(
      () => washingStation.id
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    washingStationIdIdx: index("washing_station_id_idx").on(
      table.washingStationId
    ),
  })
);

export const userWashingStationRelations = relations(
  userWashingStation,
  ({ one }) => ({
    user: one(user, {
      fields: [userWashingStation.userId],
      references: [user.id],
    }),
    washingStation: one(washingStation, {
      fields: [userWashingStation.washingStationId],
      references: [washingStation.id],
    }),
  })
);
