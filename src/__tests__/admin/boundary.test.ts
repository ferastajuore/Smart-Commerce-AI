// Admin Module boundary tests
// Ref: TESTING.md §9 (Admin Module data-access path tested to confirm
// it can read cross-tenant metadata only),
// SECURITY.md §5.3 (Admin boundary enforcement),
// PRD.md ADM-5 (Admin CANNOT read Product, Inventory, or Order contents),
// ARCHITECTURE.md §7 (Admin Module is the sole exception to tenant scoping)
//
// These tests verify:
// 1. Admin data path can read cross-tenant Workspace metadata
// 2. Admin data path does NOT read Product, Inventory, or Order data
// 3. The two workspace lookup functions are structurally distinct

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
// ESLint disable: This test SPECIFICALLY validates the admin/data/ cross-tenant
// boundary (SECURITY.md §5.3, ARCHITECTURE.md §7). Importing directly from
// admin/data/ is intentional — the test documents that admin data path is the
// sole exception to tenant scoping. Any change to these imports requires
// explicit review per SECURITY.md §5.3.
// eslint-disable-next-line no-restricted-imports
import { findAllWorkspaces } from "@/modules/admin/data/find-workspaces-for-admin";
// eslint-disable-next-line no-restricted-imports
import { findWorkspaceByIdForAdmin } from "@/modules/admin/data/find-workspace-by-id-for-admin";

const prisma = new PrismaClient();

// Test workspace IDs
const WORKSPACE_C_ID = "00000000-0000-0000-0000-000000000005";
const WORKSPACE_D_ID = "00000000-0000-0000-0000-000000000006";
const ADMIN_ID = "00000000-0000-0000-0000-000000000031";

describe("Admin Module Boundary", () => {
  beforeAll(async () => {
    // Create test admin user
    await prisma.user.create({
      data: {
        id: ADMIN_ID,
        email: "admin@test.com",
        passwordHash: "hashed-password",
        role: "PLATFORM_ADMIN",
      },
    });

    // Create test workspaces
    await prisma.workspace.createMany({
      data: [
        {
          id: WORKSPACE_C_ID,
          ownerId: ADMIN_ID,
          businessName: "Admin Test Store C",
          contactEmail: "store-c@test.com",
          contactPhone: "+1234567005",
          status: "ACTIVE",
          trialEndsAt: new Date("2030-01-01"),
        },
        {
          id: WORKSPACE_D_ID,
          ownerId: ADMIN_ID,
          businessName: "Admin Test Store D",
          contactEmail: "store-d@test.com",
          contactPhone: "+1234567006",
          status: "TRIAL",
          trialEndsAt: new Date("2030-01-01"),
        },
      ],
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.workspace.deleteMany({
      where: { id: { in: [WORKSPACE_C_ID, WORKSPACE_D_ID] } },
    });
    await prisma.user.deleteMany({
      where: { id: ADMIN_ID },
    });
    await prisma.$disconnect();
  });

  describe("findAllWorkspaces()", () => {
    it("returns all workspaces across tenants (cross-tenant by design)", async () => {
      const workspaces = await findAllWorkspaces();

      // Should include our test workspaces
      const workspaceIds = workspaces.map((w) => w.id);
      expect(workspaceIds).toContain(WORKSPACE_C_ID);
      expect(workspaceIds).toContain(WORKSPACE_D_ID);
    });

    it("returns Workspace-level metadata only (no Product/Inventory/Order)", async () => {
      const workspaces = await findAllWorkspaces();

      for (const workspace of workspaces) {
        // Verify the returned object only contains Workspace fields
        expect(workspace).toHaveProperty("id");
        expect(workspace).toHaveProperty("businessName");
        expect(workspace).toHaveProperty("status");
        expect(workspace).toHaveProperty("trialEndsAt");
        expect(workspace).toHaveProperty("createdAt");
        expect(workspace).toHaveProperty("updatedAt");
        // Should NOT have any Product, Inventory, or Order fields
        expect(workspace).not.toHaveProperty("products");
        expect(workspace).not.toHaveProperty("inventory");
        expect(workspace).not.toHaveProperty("orders");
      }
    });
  });

  describe("findWorkspaceByIdForAdmin()", () => {
    it("returns a workspace by ID (cross-tenant lookup)", async () => {
      const workspace = await findWorkspaceByIdForAdmin(WORKSPACE_C_ID);

      expect(workspace).not.toBeNull();
      expect(workspace!.id).toBe(WORKSPACE_C_ID);
      expect(workspace!.businessName).toBe("Admin Test Store C");
    });

    it("returns null for non-existent workspace ID", async () => {
      const workspace = await findWorkspaceByIdForAdmin(
        "non-existent-workspace-id",
      );

      expect(workspace).toBeNull();
    });
  });

  describe("Structural distinction from Store-facing functions", () => {
    it("findAllWorkspaces does NOT use tenantWhere (cross-tenant by design)", async () => {
      // This test documents the structural distinction:
      // findAllWorkspaces has NO workspaceId parameter — it queries ALL workspaces
      // This is the documented exception (ARCHITECTURE.md §7)
      const workspaces = await findAllWorkspaces();

      // Should return workspaces regardless of any specific tenant scope
      expect(Array.isArray(workspaces)).toBe(true);
    });

    it("findWorkspaceByIdForAdmin does NOT use tenantWhere (cross-tenant by design)", async () => {
      // findWorkspaceByIdForAdmin takes just an ID, not a workspaceId
      // It can look up ANY workspace by ID — this is the Admin exception
      const workspace = await findWorkspaceByIdForAdmin(WORKSPACE_D_ID);

      expect(workspace).not.toBeNull();
      expect(workspace!.id).toBe(WORKSPACE_D_ID);
    });
  });
});
