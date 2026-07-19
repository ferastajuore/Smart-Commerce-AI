// Find workspace by owner ID — Auth Module data layer
// Ref: ARCHITECTURE.md §5 (Auth Module resolves workspaceId once per request),
// SECURITY.md §4.2 (session encodes workspaceId for STORE_OWNER),
// DATABASE.md §4.2 (Workspace.ownerId is unique)
//
// Used during login to resolve the Store Owner's workspaceId for session encoding.

import { prisma } from "@/lib/prisma";
import type { Workspace } from "@prisma/client";

export async function findWorkspaceByOwnerId(
  ownerId: string,
): Promise<Workspace | null> {
  return prisma.workspace.findUnique({
    where: { ownerId },
  });
}
