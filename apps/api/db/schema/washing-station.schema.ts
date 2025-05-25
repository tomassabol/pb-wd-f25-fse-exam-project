import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  real,
  boolean,
  integer,
  json,
} from "drizzle-orm/pg-core";

export const washingStation = pgTable("washing_station", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  type: text("type", { enum: ["manual", "automatic"] })
    .array()
    .notNull(),
  address: text("address").notNull(),
  coordinate: json("coordinate")
    .$type<{ latitude: number; longitude: number }>()
    .notNull(),
  rating: real("rating").notNull().default(0),
  openHours: text("open_hours").notNull(),
  averageWaitTime: integer("average_wait_time").notNull().default(0),
  isPremium: boolean("is_premium").notNull().default(false),
  imageUrl: text("image_url"),
  phone: text("phone"),
  description: text("description"),
  services: text("services").array().notNull().default([]),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export type WashingStation = typeof washingStation.$inferSelect;
export type NewWashingStation = typeof washingStation.$inferInsert;
