import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { userWashingStation } from "./user-washing-station.schema";
import { userMembership } from "./user-membership.schema";
import { carWash } from "./wash.schema";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    fullName: text("full_name").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type UserWithoutPassword = Omit<User, "password">;

export const userRelations = relations(user, ({ many }) => ({
  userWashingStations: many(userWashingStation),
  userMemberships: many(userMembership),
  washes: many(carWash),
}));
