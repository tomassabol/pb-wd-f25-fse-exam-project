import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { membership } from "./membership.schema";
import { user } from "./user.schema";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const userMembership = pgTable(
  "user_membership",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("user_id").references(() => user.id),
    membershipId: text("membership_id").references(() => membership.id),
    licensePlate: text("license_plate"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    expiresAtIndex: index("expires_at_index").on(t.expiresAt),
    userIdIndex: index("user_id_index").on(t.userId),
    membershipIdIndex: index("membership_id_index").on(t.membershipId),
    licensePlateIndex: index("license_plate_index").on(t.licensePlate),
  })
);

export const userMembershipRelations = relations(userMembership, ({ one }) => ({
  user: one(user, {
    fields: [userMembership.userId],
    references: [user.id],
  }),
  membership: one(membership, {
    fields: [userMembership.membershipId],
    references: [membership.id],
  }),
}));

export type UserMembership = typeof userMembership.$inferSelect;
export type NewUserMembership = typeof userMembership.$inferInsert;
