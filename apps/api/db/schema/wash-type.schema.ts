import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { carWash } from "./wash.schema";

export const washType = pgTable("wash_type", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  description: text("description").notNull(),
  includedFeatures: text("included_features").array().notNull().default([]),
  excludedFeatures: text("excluded_features").array().notNull().default([]),
  price: bigint("price", { mode: "number" }).notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export type WashType = typeof washType.$inferSelect;
export type NewWashType = typeof washType.$inferInsert;

export const washTypeRelations = relations(washType, ({ many }) => ({
  washes: many(carWash),
}));
