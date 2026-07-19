// getStoreById — Store Module service
// Ref: ARCHITECTURE.md §5 (exposes getStoreById),
// DATABASE.md §4.2 (Workspace entity),
// API.md §10 (NOT_FOUND for cross-tenant access attempts),
// SECURITY.md §5.2 (anti-enumeration: cross-tenant by ID returns NOT_FOUND)
//
// Returns the Workspace (Store) profile for the given workspaceId.
// Cross-tenant access attempts return NOT_FOUND, not FORBIDDEN —
// this prevents confirming the existence of another Workspace's data.

import { findWorkspaceById } from "../data/find-workspace-by-id";
import { AppError } from "@/shared/errors/app-error";
import type { Workspace } from "@prisma/client";

/**
 * Retrieves a Store (Workspace) by its tenant-scoped ID.
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @returns The Workspace record
 * @throws AppError NOT_FOUND if no workspace exists for this workspaceId
 */
export async function getStoreById(
  workspaceId: string,
): Promise<Workspace> {
  const workspace = await findWorkspaceById(workspaceId);

  if (!workspace) {
    // SECURITY.md §5.2: return NOT_FOUND (not FORBIDDEN) for
    // cross-tenant access attempts — prevents existence confirmation.
    throw new AppError(404, "NOT_FOUND", "Store not found");
  }

  return workspace;
}
