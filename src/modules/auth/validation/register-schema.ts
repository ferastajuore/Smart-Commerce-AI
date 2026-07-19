// Registration validation schema
// Ref: CODING_STANDARDS.md §7 (every Server Action validates input with Zod),
// API.md §9 (registerStore endpoint),
// PRD.md REG-1 (new user registers a Store by providing business details)

import { z } from "zod";

export const registerStoreSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    businessName: z
      .string()
      .min(1, "Business name is required")
      .max(200, "Business name is too long"),
    contactEmail: z
      .string()
      .min(1, "Contact email is required")
      .email("Please enter a valid contact email address"),
    contactPhone: z
      .string()
      .min(1, "Contact phone is required")
      .max(50, "Phone number is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterStoreInput = z.infer<typeof registerStoreSchema>;
