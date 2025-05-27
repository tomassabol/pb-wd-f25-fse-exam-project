import { bigint, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { washingStation } from "./washing-station.schema";
import { washType } from "./wash-type.schema";
import { relations } from "drizzle-orm";
import { user } from "./user.schema";
import { membership } from "./membership.schema";

export const carWash = pgTable(
  "car_wash",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    licensePlate: text("license_plate").notNull(),
    washingStationId: text("washing_station_id")
      .references(() => washingStation.id)
      .notNull(),
    washTypeId: text("wash_type_id")
      .references(() => washType.id)
      .notNull(),
    userId: text("user_id").references(() => user.id),
    paymentMethod: text("payment_method", {
      enum: ["membership", "card", "mobile_pay"],
    }).notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: text("currency").notNull(),
    membershipId: text("membership_id").references(() => membership.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    washTypeIdIdx: index("car_wash_wash_type_id_idx").on(table.washTypeId),
    washingStationIdIdx: index("car_wash_washing_station_id_idx").on(
      table.washingStationId
    ),
    userIdIdx: index("car_wash_user_id_idx").on(table.userId),
    licensePlateIdx: index("car_wash_license_plate_idx").on(table.licensePlate),
  })
);

export const carWashRelations = relations(carWash, ({ one }) => ({
  washingStation: one(washingStation, {
    fields: [carWash.washingStationId],
    references: [washingStation.id],
  }),
  washType: one(washType, {
    fields: [carWash.washTypeId],
    references: [washType.id],
  }),
  user: one(user, {
    fields: [carWash.userId],
    references: [user.id],
  }),
  membership: one(membership, {
    fields: [carWash.membershipId],
    references: [membership.id],
  }),
}));

export type CarWash = typeof carWash.$inferSelect;
export type NewCarWash = typeof carWash.$inferInsert;
