// Find workspace by ID — Store Module data layer
// Ref: ARCHITECTURE.md §5 (Store Module owns Workspace entity),
// DATABASE.md §4.2 (Workspace entity — id IS the workspaceId),
// CODING_STANDARDS.md §4 (workspaceId as mandatory first parameter),
// SECURITY.md §5.2 (tenant-scoped queries)
//
// For the Workspace entity, the primary key `id` IS the workspaceId
// referenced by every tenant-owned table (DATABASE.md §4.2).
// We use findUnique with { id: workspaceId } because the Workspace's
// own id is the tenant identifier — there is no separate workspaceId
// foreign key on the Workspace table itself.

import { prisma } from "@/lib/prisma";
import type { Workspace } from "@prisma/client";

/**
 * Finds a Workspace by its ID, scoped to the given workspaceId.
 *
 * For the Workspace entity, `id` IS the workspaceId (DATABASE.md §4.2).
 * Uses findUnique with { id: workspaceId } — the Workspace's own primary
 * key serves as the tenant identifier.
 *
 * SECURITY NOTE: Cross-tenant access attempts return null (→ NOT_FOUND),
 * never FORBIDDEN (API.md §10, SECURITY.md §5.2).
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @returns The Workspace if found, null otherwise
 */
export async function findWorkspaceById(
  workspaceId: string,
): Promise<Workspace | null> {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
}
