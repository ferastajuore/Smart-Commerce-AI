// isStoreActive — Store Module service
// Ref: ARCHITECTURE.md §5 (exposes isStoreActive),
// DATABASE.md §4.2 (WorkspaceStatus enum: TRIAL, ACTIVE, RESTRICTED, SUSPENDED),
// PRD.md SUB-7 (RESTRICTED = read access preserved, automation disabled)
//
// Determines whether a Store (Workspace) is in an active/functional state.
// TRIAL and ACTIVE are considered active; RESTRICTED and SUSPENDED are not.

import { findWorkspaceById } from "../data/find-workspace-by-id";
import { ACTIVE_WORKSPACE_STATUSES } from "../types";

/**
 * Checks whether a Store (Workspace) is currently active.
 *
 * A workspace is active if its status is TRIAL or ACTIVE.
 * RESTRICTED (trial expired without conversion) and SUSPENDED
 * are considered inactive for automation purposes.
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @returns true if the workspace exists and is in an active status, false otherwise
 */
export async function isStoreActive(
  workspaceId: string,
): Promise<boolean> {
  const workspace = await findWorkspaceById(workspaceId);

  if (!workspace) {
    return false;
  }

  return ACTIVE_WORKSPACE_STATUSES.includes(workspace.status);
}
