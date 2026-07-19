// Create audit entry — Audit Log Module data layer
// Ref: ARCHITECTURE.md §10 (Audit Logging Architecture),
// AGENTS.md §10 Rule 6 (every important action is audited),
// DATABASE.md §4.10 (AuditLog entity structure)
//
// Audit log entries are write-once — no update or delete operations
// are ever exposed (ARCHITECTURE.md §10).

import { prisma } from "@/lib/prisma";
import type { AuditLog, Prisma } from "@prisma/client";
import type { CreateAuditEntryInput } from "../types";

/**
 * Creates an immutable audit log entry.
 *
 * Called as part of the same transaction that performs the state change,
 * never as a fire-and-forget side effect (ARCHITECTURE.md §10).
 *
 * @param input - The audit entry data (workspaceId may be null for platform-level entries)
 * @returns The created AuditLog record
 */
export async function createAuditEntry(
  input: CreateAuditEntryInput,
): Promise<AuditLog> {
  return prisma.auditLog.create({
    data: {
      workspaceId: input.workspaceId ?? null,
      actorId: input.actorId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      previousState: input.previousState as Prisma.InputJsonValue | undefined,
      newState: input.newState as Prisma.InputJsonValue | undefined,
      reason: input.reason ?? undefined,
    },
  });
}
