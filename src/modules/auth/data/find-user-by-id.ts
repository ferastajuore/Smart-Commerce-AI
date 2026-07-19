// Find user by ID — Auth Module data layer
// Ref: ARCHITECTURE.md §5 (Auth Module owns identity),
// SECURITY.md §4.2 (session re-verification against database)
//
// Used to re-verify the user still exists and hasn't been
// suspended or had their role changed, on each sensitive action.

import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
