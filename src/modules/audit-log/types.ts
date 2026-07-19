// Audit Log module types
// Ref: ARCHITECTURE.md §10 (Audit Logging Architecture),
// AGENTS.md §10 Rule 6 (every important action is audited),
// DATABASE.md §4.10 (AuditLog entity)
//
// The action and entity fields are free-text strings (not enums)
// per DATABASE.md §4.10 — new action types don't require a migration.

/**
 * Standardized audit action vocabulary.
 * Not an exhaustive enum — new actions are added as string literals
 * per DATABASE.md §4.10's rationale (avoiding migration for new action types).
 * Ref: AGENTS.md §10 Rule 6
 */
export type AuditAction =
  | "ORDER_CREATED"
  | "ORDER_APPROVED"
  | "ORDER_REJECTED"
  | "INVENTORY_ADJUSTED"
  | "SUBSCRIPTION_CHANGED"
  | "SETTINGS_CHANGED"
  | "MESSENGER_CONNECTED"
  | "MESSENGER_DISCONNECTED"
  | "WORKSPACE_REGISTERED"
  | "WORKSPACE_SUSPENDED"
  | "ADMIN_ACCESS_AUDIT_LOG";

/**
 * Entity types that can appear in the AuditLog.entity field.
 * Derived from ARCHITECTURE.md §5 module ownership.
 */
export type AuditEntity =
  | "Order"
  | "Product"
  | "Inventory"
  | "Subscription"
  | "SubscriptionPlan"
  | "Workspace"
  | "MessengerConnection"
  | "PlatformSettings";

/**
 * Input parameters for creating an audit log entry.
 * Ref: AGENTS.md §10 Rule 6 (timestamp, actor, action, entity, entity ID,
 * previous state, new state, optional reason)
 */
export interface CreateAuditEntryInput {
  workspaceId?: string | null;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  reason?: string | null;
}

/**
 * Filters for querying audit log entries.
 * Ref: API.md §7 (getAuditLog — scoped to Workspace), PRD.md AUD-3
 */
export interface AuditLogFilters {
  entity?: string;
  entityId?: string;
  limit?: number;
}
