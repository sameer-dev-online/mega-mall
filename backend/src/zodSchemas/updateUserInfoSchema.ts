import { z } from "zod";

export const updateUserInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required." }).optional(),

  gender: z
    .enum(['male', 'female', 'other', 'prefer-not-to-say'], {
      errorMap: () => ({ message: "Gender must be 'male', 'female', or 'other'." })
    }).optional(),

  phoneNumber: z
    .string()
    .regex(/^[0-9]{11}$/, {
      message: "Phone number must be exactly 11 digits."
    }).optional(),

 dateOfBirth: z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: "Date of birth must be in MM/DD/YYYY format."
  }).optional(),

  address: z.object({
    street: z
      .string()
      .min(1, { message: "Street is required." }).optional(),

    city: z
      .string()
      .min(1, { message: "City is required." }).optional(),

    state: z
      .string()
      .min(1, { message: "State is required." }).optional(),

    zipCode: z
      .string()
      .min(1, { message: "Zip code is required." }).optional(),

    country: z
      .string()
      .min(1, { message: "Country is required." })
  }).optional()
});

export type UpdateUserInfoType = z.infer<typeof updateUserInfoSchema>;
