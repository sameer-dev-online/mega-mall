import { z } from "zod";

export const preferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "private"]),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
});