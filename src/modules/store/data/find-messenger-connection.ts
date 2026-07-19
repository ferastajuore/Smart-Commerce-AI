// Find messenger connection by workspace ID — Store Module data layer
// Ref: ARCHITECTURE.md §5 (Store Module owns MessengerConnection),
// DATABASE.md §4.5 (MessengerConnection entity),
// CODING_STANDARDS.md §4 (workspaceId as mandatory first parameter),
// SECURITY.md §5.2 (tenant-scoped queries)
//
// Used to check whether a Store has a connected Facebook Page
// before serving customers (PRD.md REG-3).

import { prisma } from "@/lib/prisma";
import type { MessengerConnection } from "@prisma/client";

/**
 * Finds a MessengerConnection by workspace ID.
 *
 * Used by the business-rule gate that requires a connected
 * Facebook Page before serving customers (PRD.md REG-3).
 * Connection mechanics are implemented in Milestone 9.
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @returns The MessengerConnection if found, null otherwise
 */
export async function findMessengerConnection(
  workspaceId: string,
): Promise<MessengerConnection | null> {
  return prisma.messengerConnection.findUnique({
    where: { workspaceId },
  });
}
