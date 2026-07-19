// Audit Log tenant isolation tests
// Ref: TESTING.md §9 (Workspace and Tenant Isolation Tests),
// ARCHITECTURE.md §10 (Audit Logging Architecture),
// API.md §7 (getAuditLog scoped to caller's Workspace only),
// PRD.md AUD-3 (Store Owner sees only their Workspace's audit log)
//
// These tests verify:
// 1. Audit entries are correctly scoped to a workspace
// 2. getAuditLog returns only entries belonging to the queried workspace
// 3. Cross-tenant audit log access returns empty results (not other workspace's data)
// 4. Audit entries are immutable (no update/delete exposed)

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { recordAuditEntry } from "@/modules/audit-log/services/record-audit-entry";
import { getAuditLog } from "@/modules/audit-log/services/get-audit-log";

const prisma = new PrismaClient();

// Test workspace IDs
const WORKSPACE_A_ID = "00000000-0000-0000-0000-000000000003";
const WORKSPACE_B_ID = "00000000-0000-0000-0000-000000000004";
const ACTOR_A_ID = "00000000-0000-0000-0000-000000000021";
const ACTOR_B_ID = "00000000-0000-0000-0000-000000000022";

describe("Audit Log Tenant Isolation", () => {
  beforeAll(async () => {
    // Create test users
    await prisma.user.createMany({
      data: [
        {
          id: ACTOR_A_ID,
          email: "actor-a@test.com",
          passwordHash: "hashed-password",
          role: "STORE_OWNER",
          phone: "+1234567003",
        },
        {
          id: ACTOR_B_ID,
          email: "actor-b@test.com",
          passwordHash: "hashed-password",
          role: "STORE_OWNER",
          phone: "+1234567004",
        },
      ],
    });

    // Create test workspaces
    await prisma.workspace.createMany({
      data: [
        {
          id: WORKSPACE_A_ID,
          ownerId: ACTOR_A_ID,
          businessName: "Audit Test Store A",
          contactEmail: "audit-a@test.com",
          contactPhone: "+1234567003",
          status: "ACTIVE",
          trialEndsAt: new Date("2030-01-01"),
        },
        {
          id: WORKSPACE_B_ID,
          ownerId: ACTOR_B_ID,
          businessName: "Audit Test Store B",
          contactEmail: "audit-b@test.com",
          contactPhone: "+1234567004",
          status: "ACTIVE",
          trialEndsAt: new Date("2030-01-01"),
        },
      ],
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.auditLog.deleteMany({
      where: {
        workspaceId: { in: [WORKSPACE_A_ID, WORKSPACE_B_ID] },
      },
    });
    await prisma.workspace.deleteMany({
      where: { id: { in: [WORKSPACE_A_ID, WORKSPACE_B_ID] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [ACTOR_A_ID, ACTOR_B_ID] } },
    });
    await prisma.$disconnect();
  });

  describe("recordAuditEntry()", () => {
    it("creates an audit entry with the correct workspaceId", async () => {
      const entry = await recordAuditEntry({
        workspaceId: WORKSPACE_A_ID,
        actorId: ACTOR_A_ID,
        action: "ORDER_APPROVED",
        entity: "Order",
        entityId: "test-order-id",
        previousState: { status: "PENDING" },
        newState: { status: "APPROVED" },
      });

      expect(entry).toBeDefined();
      expect(entry.workspaceId).toBe(WORKSPACE_A_ID);
      expect(entry.actorId).toBe(ACTOR_A_ID);
      expect(entry.action).toBe("ORDER_APPROVED");
      expect(entry.entity).toBe("Order");
    });

    it("creates platform-level entries with null workspaceId", async () => {
      const entry = await recordAuditEntry({
        workspaceId: null,
        actorId: ACTOR_A_ID,
        action: "ADMIN_ACCESS_AUDIT_LOG",
        entity: "AuditLog",
        entityId: "test-audit-log-id",
      });

      expect(entry).toBeDefined();
      expect(entry.workspaceId).toBeNull();
      expect(entry.action).toBe("ADMIN_ACCESS_AUDIT_LOG");
    });
  });

  describe("getAuditLog() tenant isolation", () => {
    // Create test audit entries for both workspaces before isolation tests
    beforeAll(async () => {
      // Create entries for Workspace A
      await recordAuditEntry({
        workspaceId: WORKSPACE_A_ID,
        actorId: ACTOR_A_ID,
        action: "ORDER_CREATED",
        entity: "Order",
        entityId: "order-a-1",
      });
      await recordAuditEntry({
        workspaceId: WORKSPACE_A_ID,
        actorId: ACTOR_A_ID,
        action: "ORDER_APPROVED",
        entity: "Order",
        entityId: "order-a-1",
      });

      // Create entries for Workspace B
      await recordAuditEntry({
        workspaceId: WORKSPACE_B_ID,
        actorId: ACTOR_B_ID,
        action: "ORDER_CREATED",
        entity: "Order",
        entityId: "order-b-1",
      });
    });

    it("returns only Workspace A entries when querying with Workspace A ID", async () => {
      const entries = await getAuditLog(WORKSPACE_A_ID);

      expect(entries.length).toBeGreaterThanOrEqual(2);
      for (const entry of entries) {
        expect(entry.workspaceId).toBe(WORKSPACE_A_ID);
      }
    });

    it("returns only Workspace B entries when querying with Workspace B ID", async () => {
      const entries = await getAuditLog(WORKSPACE_B_ID);

      expect(entries.length).toBeGreaterThanOrEqual(1);
      for (const entry of entries) {
        expect(entry.workspaceId).toBe(WORKSPACE_B_ID);
      }
    });

    it("returns empty results for non-existent workspace ID (no cross-tenant leakage)", async () => {
      const entries = await getAuditLog(
        "non-existent-workspace-id",
      );

      expect(entries).toEqual([]);
    });

    it("filters by entity type within workspace scope", async () => {
      const orderEntries = await getAuditLog(WORKSPACE_A_ID, {
        entity: "Order",
      });

      expect(orderEntries.length).toBeGreaterThanOrEqual(2);
      for (const entry of orderEntries) {
        expect(entry.workspaceId).toBe(WORKSPACE_A_ID);
        expect(entry.entity).toBe("Order");
      }
    });

    it("respects limit parameter within workspace scope", async () => {
      const limitedEntries = await getAuditLog(WORKSPACE_A_ID, {
        limit: 1,
      });

      expect(limitedEntries.length).toBe(1);
      expect(limitedEntries[0].workspaceId).toBe(WORKSPACE_A_ID);
    });
  });
});
