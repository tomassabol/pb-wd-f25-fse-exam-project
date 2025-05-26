import { z } from "zod";

export const createUserMembershipSchema = z.object({
  licensePlate: z.string(),
});

export type CreateUserMembershipRequest = z.infer<
  typeof createUserMembershipSchema
>;
