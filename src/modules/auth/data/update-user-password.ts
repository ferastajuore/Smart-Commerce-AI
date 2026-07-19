// Update user password — Auth Module data layer
// Ref: ARCHITECTURE.md §5 (Auth Module owns identity),
// SECURITY.md §4.1 (password hashing and storage),
// PRD.md AUTH-5 (password reset and account recovery flows)
//
// Updates the user's password hash in the database.
// This is the only data-layer function that modifies user credentials.

import { prisma } from "@/lib/prisma";

/**
 * Updates a user's password hash in the database.
 *
 * @param userId - The ID of the user whose password is being updated
 * @param passwordHash - The bcrypt hash of the new password
 */
export async function updateUserPassword(
  userId: string,
  passwordHash: string,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
