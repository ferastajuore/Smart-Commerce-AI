// Central tenant-scoping WHERE filter for all Prisma queries.
// Ref: ARCHITECTURE.md §7 (every tenant-owned table includes workspaceId),
// CODING_STANDARDS.md §4 (every data-access function accepts workspaceId as first parameter),
// SECURITY.md §5.2 (mandatory tenant filtering)
//
// Every tenant-scoped data-access function in modules/*/data/ uses this helper
// to construct the WHERE filter. This is the single point of change for future
// additions (soft delete, archivedAt, row status, etc.) — new tenant-level
// query constraints are added here, not scattered across individual query files.
//
// This helper is a strongly typed generic that preserves Prisma type inference,
// so callers get full autocomplete and type checking on additional filter fields.
//
// The generic parameter T captures the caller's filter shape, ensuring TypeScript
// validates the filter fields against the model's WhereInput type at the call site.

/**
 * Creates a tenant-scoped WHERE filter for Prisma queries.
 *
 * Always includes `workspaceId` as a required, non-optional string — never
 * derived from client input, always session-derived (ARCHITECTURE.md §7).
 * The `workspaceId` is applied last to prevent callers from accidentally
 * overriding it via the `filters` parameter.
 *
 * @param workspaceId - Session-derived workspace identifier (mandatory, first param)
 * @param filters - Optional additional Prisma-compatible where-clause filters
 * @returns A merged where clause with workspaceId guaranteed present
 *
 * @example
 * // Simple tenant-scoped query
 * const products = await prisma.product.findMany({
 *   where: tenantWhere(workspaceId),
 * });
 *
 * @example
 * // Tenant-scoped query with additional filters
 * const activeProducts = await prisma.product.findMany({
 *   where: tenantWhere(workspaceId, { status: "ACTIVE" }),
 * });
 *
 * @example
 * // Single record lookup — uses findFirst, NOT findUnique
 * const workspace = await prisma.workspace.findFirst({
 *   where: tenantWhere(workspaceId),
 * });
 */
export function tenantWhere<T>(
  workspaceId: string,
  filters?: T,
): T & { workspaceId: string } {
  // The spread operator merges filters first, then workspaceId is applied last
  // to guarantee it cannot be overridden by the caller.
  return { ...filters, workspaceId } as T & { workspaceId: string };
}
