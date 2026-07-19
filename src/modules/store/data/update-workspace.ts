// Update workspace — Store Module data layer
// Ref: ARCHITECTURE.md §5 (Store Module owns Workspace entity),
// DATABASE.md §4.2 (Workspace entity — id IS the workspaceId),
// CODING_STANDARDS.md §4 (workspaceId as mandatory first parameter),
// SECURITY.md §5.2 (tenant-scoped queries),
// API.md §7 (updateStoreProfile), PRD.md SET-1
//
// All workspace updates are scoped to the authenticated workspace.
// Returns null if the workspace is not found within the tenant scope,
// allowing the service layer to throw the appropriate AppError.

import { prisma } from "@/lib/prisma";
import type { Prisma, Workspace } from "@prisma/client";

/**
 * Updates a Workspace's profile fields, scoped to the given workspaceId.
 *
 * For the Workspace entity, `id` IS the workspaceId (DATABASE.md §4.2).
 * First verifies the workspace exists, then performs the update.
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @param data - Fields to update (businessName, contactEmail, contactPhone)
 * @returns The updated Workspace, or null if not found in this tenant scope
 */
export async function updateWorkspaceById(
  workspaceId: string,
  data: Prisma.WorkspaceUpdateInput,
): Promise<Workspace | null> {
  // Verify the workspace exists within the tenant scope before updating.
  // For Workspace, id IS the workspaceId, so findUnique by id is the
  // correct tenant-scoped lookup.
  const existing = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!existing) {
    return null;
  }

  return prisma.workspace.update({
    where: { id: existing.id },
    data,
  });
}
