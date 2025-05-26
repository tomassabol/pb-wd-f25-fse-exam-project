import { z } from "zod";

export const createCarWashSchema = z.object({
  licensePlate: z.string().min(1),
  washingStationId: z.string().min(1),
  washTypeId: z.string().min(1),
  paymentMethod: z.enum(["membership", "card", "mobile_pay"]),
  amount: z.number(),
  currency: z.string().min(1),
  membershipId: z.string().min(1).optional(),
});

export type CreateCarWashRequest = z.infer<typeof createCarWashSchema>;
