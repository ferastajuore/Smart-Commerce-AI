// Update Store Profile validation schema
// Ref: CODING_STANDARDS.md §7 (every Server Action validates input with Zod),
// API.md §7 (updateStoreProfile Server Action),
// PRD.md SET-1 (Store Owner can view and edit basic Store profile information)

import { z } from "zod";

export const updateStoreProfileSchema = z.object({
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
});

export type UpdateStoreProfileInput = z.infer<typeof updateStoreProfileSchema>;
