// Find user by email — Auth Module data layer
// Ref: ARCHITECTURE.md §5 (Auth Module owns identity),
// DATABASE.md §4.1 (User entity)
//
// Used during login to locate the user account.

import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function findUserByEmail(
  email: string,
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}
