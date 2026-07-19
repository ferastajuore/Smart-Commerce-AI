// Get audit entries — Audit Log Module data layer
// Ref: ARCHITECTURE.md §10 (Audit Logging Architecture),
// DATABASE.md §4.10 (AuditLog entity),
// CODING_STANDARDS.md §4 (workspaceId as mandatory first parameter),
// SECURITY.md §5.2 (tenant-scoped queries),
// API.md §7 (getAuditLog — scoped to the caller's own Workspace only),
// PRD.md AUD-3 (Store Owner sees only their Workspace's audit log)
//
// Tenant-scoped reads use findMany with tenantWhere to ensure
// only entries belonging to the given workspaceId are returned.

import { prisma } from "@/lib/prisma";
import { tenantWhere } from "@/shared/tenant/tenant-where";
import type { AuditLog } from "@prisma/client";
import type { AuditLogFilters } from "../types";

/**
 * Retrieves audit log entries scoped to a specific workspace.
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @param filters - Optional filters (entity, entityId, limit)
 * @returns Array of AuditLog entries belonging to this workspace, newest first
 */
export async function getAuditEntries(
  workspaceId: string,
  filters?: AuditLogFilters,
): Promise<AuditLog[]> {
  const where = tenantWhere(workspaceId, {
    ...(filters?.entity && { entity: filters.entity }),
    ...(filters?.entityId && { entityId: filters.entityId }),
  });

  return prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...(filters?.limit && { take: filters.limit }),
  });
}
