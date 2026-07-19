// tenantWhere() helper tests
// Ref: ARCHITECTURE.md §7 (tenant scoping), CODING_STANDARDS.md §4,
// TESTING.md §9 (workspaceId parameter regression tests)
//
// Pure unit tests — no database required.
// Verifies the helper generates correct filter objects and
// that workspaceId cannot be overridden via the filters parameter.

import { describe, it, expect } from "vitest";
import { tenantWhere } from "@/shared/tenant/tenant-where";

describe("tenantWhere()", () => {
  const WORKSPACE_ID = "550e8400-e29b-41d4-a716-446655440000";

  it("returns an object with only workspaceId when no filters provided", () => {
    const result = tenantWhere(WORKSPACE_ID);

    expect(result).toEqual({ workspaceId: WORKSPACE_ID });
  });

  it("merges additional filters with workspaceId", () => {
    const result = tenantWhere(WORKSPACE_ID, { status: "ACTIVE" });

    expect(result).toEqual({
      status: "ACTIVE",
      workspaceId: WORKSPACE_ID,
    });
  });

  it("preserves all provided filter fields", () => {
    const result = tenantWhere(WORKSPACE_ID, {
      status: "ACTIVE",
      name: "Test Product",
      price: { gt: 10 },
    });

    expect(result).toEqual({
      status: "ACTIVE",
      name: "Test Product",
      price: { gt: 10 },
      workspaceId: WORKSPACE_ID,
    });
  });

  it("always includes workspaceId regardless of filters", () => {
    const result = tenantWhere(WORKSPACE_ID, { unrelated: "value" });

    expect(result).toHaveProperty("workspaceId", WORKSPACE_ID);
    expect(result).toHaveProperty("unrelated", "value");
  });

  it("workspaceId cannot be overridden by filters parameter", () => {
    const MALICIOUS_ID = "evil-workspace-id";

    // Even if someone tries to pass workspaceId in filters,
    // the helper applies it last, overriding any filter value
    const result = tenantWhere(WORKSPACE_ID, {
      workspaceId: MALICIOUS_ID,
    });

    // workspaceId is always the session-derived value
    expect(result.workspaceId).toBe(WORKSPACE_ID);
  });

  it("returns a new object (not mutating the filters input)", () => {
    const filters = { status: "ACTIVE" };
    const result = tenantWhere(WORKSPACE_ID, filters);

    expect(result).not.toBe(filters);
    expect(filters).toEqual({ status: "ACTIVE" });
  });

  it("handles empty filters object", () => {
    const result = tenantWhere(WORKSPACE_ID, {});

    expect(result).toEqual({ workspaceId: WORKSPACE_ID });
  });

  it("handles null-like optional filters", () => {
    // Undefined filters should work the same as no filters
    const result = tenantWhere(WORKSPACE_ID, undefined);

    expect(result).toEqual({ workspaceId: WORKSPACE_ID });
  });

  it("handles nested filter objects", () => {
    const result = tenantWhere(WORKSPACE_ID, {
      createdAt: { gte: new Date("2024-01-01") },
      orderItems: { some: { quantity: { gt: 0 } } },
    });

    expect(result).toEqual({
      createdAt: { gte: new Date("2024-01-01") },
      orderItems: { some: { quantity: { gt: 0 } } },
      workspaceId: WORKSPACE_ID,
    });
  });
});
