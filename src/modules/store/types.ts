// Store module types
// Ref: ARCHITECTURE.md §5 (Store Module owns Workspace/Store entity),
// DATABASE.md §4.2 (Workspace entity), §7 (WorkspaceStatus enum)
//
// The Store module is a business service over the existing Workspace entity.
// It does NOT define a new database model — it operates on Workspace directly.

import type { Workspace, WorkspaceStatus } from "@prisma/client";

/**
 * Store profile data returned to the Store Owner.
 * Derived from the Workspace entity — no separate Store model exists.
 * Ref: DATABASE.md §4.2
 */
export type StoreProfile = Pick<
  Workspace,
  | "id"
  | "businessName"
  | "contactEmail"
  | "contactPhone"
  | "status"
  | "trialEndsAt"
  | "createdAt"
  | "updatedAt"
>;

/**
 * Input data for updating a Store profile.
 * Ref: API.md §7 (updateStoreProfile), PRD.md SET-1
 */
export interface UpdateStoreProfileInput {
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

/**
 * Workspace status values that indicate an active/functional store.
 * In these statuses, automation (Integration Layer) is enabled.
 * Ref: DATABASE.md §4.2 (WorkspaceStatus), PRD.md SUB-7
 */
export const ACTIVE_WORKSPACE_STATUSES: WorkspaceStatus[] = [
  "TRIAL",
  "ACTIVE",
];

/**
 * Workspace status values where the Store Owner retains read access to data.
 * RESTRICTED: trial expired without conversion — data access preserved,
 * automation disabled, no data loss (PRD.md SUB-7, SECURITY.md §12).
 * SUSPENDED: full lockout — no access at all.
 * Ref: DATABASE.md §4.2 (WorkspaceStatus), PRD.md SUB-7
 */
export const DATA_ACCESSIBLE_STATUSES: WorkspaceStatus[] = [
  "TRIAL",
  "ACTIVE",
  "RESTRICTED",
];
