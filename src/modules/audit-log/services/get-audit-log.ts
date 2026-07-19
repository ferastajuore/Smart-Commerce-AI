// getAuditLog — Audit Log Module service
// Ref: ARCHITECTURE.md §10 (Audit Logging Architecture),
// API.md §7 (getAuditLog — scoped to the caller's own Workspace only),
// PRD.md AUD-3 (Store Owner sees only their Workspace's audit log)
//
// This is the Store-facing audit log query. It is structurally distinct
// from the Admin Module's cross-Workspace getAuditLog (SECURITY.md §5.3,
// PRD.md AUD-4) — the two must never be the same function with a bypassed check.

import { getAuditEntries } from "../data/get-audit-entries";
import type { AuditLog } from "@prisma/client";
import type { AuditLogFilters } from "../types";

/**
 * Retrieves the audit log for a specific Workspace.
 *
 * Returns only entries belonging to the given workspaceId,
 * ordered by most recent first.
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @param filters - Optional filters (entity, entityId, limit)
 * @returns Array of AuditLog entries, newest first
 */
export async function getAuditLog(
  workspaceId: string,
  filters?: AuditLogFilters,
): Promise<AuditLog[]> {
  return getAuditEntries(workspaceId, filters);
}
