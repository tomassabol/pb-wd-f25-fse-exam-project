import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
