// recordAuditEntry — Audit Log Module service
// Ref: ARCHITECTURE.md §10 (Audit Logging Architecture),
// AGENTS.md §10 Rule 6 (every important action is audited),
// DATABASE.md §4.10 (AuditLog entity — immutable once written)
//
// This service wraps the data layer call. Every state-changing module
// calls this function as part of the same transaction that performs
// the state change — never as a fire-and-forget side effect (ARCHITECTURE.md §10).

import { createAuditEntry } from "../data/create-audit-entry";
import type { AuditLog } from "@prisma/client";
import type { CreateAuditEntryInput } from "../types";

/**
 * Records an immutable audit log entry.
 *
 * Must be called within the same transaction as the state change it documents.
 * This guarantees the Audit Log cannot drift out of sync with actual state
 * changes (ARCHITECTURE.md §10).
 *
 * @param input - The audit entry data (workspaceId may be null for platform-level entries)
 * @returns The created AuditLog record
 */
export async function recordAuditEntry(
  input: CreateAuditEntryInput,
): Promise<AuditLog> {
  return createAuditEntry(input);
}
