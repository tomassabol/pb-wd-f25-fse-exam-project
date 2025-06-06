import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userMembership } from "./user-membership.schema";
import { carWash } from "./wash.schema";

export const membership = pgTable("membership", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  price: bigint("price", { mode: "number" }).notNull(),
  originalPrice: bigint("originalPrice", { mode: "number" }).notNull(),
  currency: text("currency").notNull(),
  period: text("period").notNull(),
  features: text("features").array().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export type Membership = typeof membership.$inferSelect;
export type NewMembership = typeof membership.$inferInsert;

export const membershipRelations = relations(membership, ({ many }) => ({
  userMemberships: many(userMembership),
  carWashes: many(carWash),
}));
