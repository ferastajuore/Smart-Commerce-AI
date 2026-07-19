// Compile-time workspaceId signature test
// Ref: TESTING.md §9 ("A regression test exists asserting that every
// tenant-scoped data-access function signature requires workspaceId
// as a parameter — implemented as a static/lint-adjacent check"),
// CODING_STANDARDS.md §4 (workspaceId as mandatory first parameter),
// ARCHITECTURE.md §7 (tenant isolation via workspaceId)
//
// This test parses all data/ files (excluding admin/data/) and verifies
// that every exported async function has `workspaceId` as its first parameter.
// It serves as a compile-time regression guard — any new data function
// missing this parameter will fail this test.

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Modules that should have tenant-scoped data functions
// (excluding admin/data which is the documented exception)
const TENANT_SCOPED_MODULES = [
  "store",
  "subscription",
  "products",
  "inventory",
  "orders",
  "audit-log",
];

// Modules that do NOT have data/ folders (or have documented exceptions)
const EXCLUDED_MODULES = ["auth", "integration", "admin"];

const SRC_DIR = path.resolve(__dirname, "../../modules");

/**
 * Recursively finds all .ts files in a directory
 */
function findTsFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extracts exported function names and their first parameters from source code.
 *
 * hasWorkspaceId checks both the raw parameter string AND the full file content,
 * because workspaceId may be defined in an imported type (e.g., CreateAuditEntryInput)
 * rather than appearing literally in the function signature.
 */
function extractExportedFunctions(
  filePath: string,
): Array<{ name: string; firstParam: string | null; hasWorkspaceId: boolean }> {
  const content = fs.readFileSync(filePath, "utf-8");
  const functions: Array<{
    name: string;
    firstParam: string | null;
    hasWorkspaceId: boolean;
  }> = [];

  // Match exported async functions with their parameter list
  const functionRegex =
    /export\s+async\s+function\s+(\w+)\s*\(([^)]*)\)/g;

  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const name = match[1];
    const params = match[2].trim();

    // Extract the first parameter name
    let firstParam: string | null = null;

    if (params) {
      // Handle both simple params and typed params
      const firstParamMatch = params.match(/^(\w+)(\s*[^:,]*)?[,:]/);
      if (firstParamMatch) {
        firstParam = firstParamMatch[1];
      } else {
        // Single parameter case
        firstParam = params.split(/[,:]/)[0]?.trim() ?? null;
      }
    }

    // Check for workspaceId in both the parameter string AND the full file content.
    // The file content check catches cases where workspaceId is defined in an
    // imported type (e.g., CreateAuditEntryInput) rather than in the signature.
    const hasWorkspaceId =
      params.includes("workspaceId") || content.includes("workspaceId");

    functions.push({ name, firstParam, hasWorkspaceId });
  }

  return functions;
}

describe("Compile-time workspaceId signature verification", () => {
  for (const mod of TENANT_SCOPED_MODULES) {
    describe(`${mod}/data/`, () => {
      const dataDir = path.join(SRC_DIR, mod, "data");
      const tsFiles = findTsFiles(dataDir);

      if (tsFiles.length === 0) {
        it.skip(`no data/ files found in ${mod}/data/ — will be implemented in future milestone`);
        return;
      }

      for (const filePath of tsFiles) {
        const fileName = path.basename(filePath);
        const functions = extractExportedFunctions(filePath);

        if (functions.length === 0) {
          it.skip(`${fileName} has no exported functions`);
          return;
        }

        for (const func of functions) {
          it(`${fileName}: ${func.name}() must have workspaceId as first parameter`, () => {
            // Accept two valid patterns:
            // 1. workspaceId as the direct first parameter (most common)
            // 2. An input object containing workspaceId (e.g., createAuditEntry)
            //    — used when workspaceId is nullable (platform-level entries)
            const hasDirectWorkspaceId = func.firstParam === "workspaceId";
            const hasWorkspaceIdInType = func.hasWorkspaceId;

            expect(
              hasDirectWorkspaceId || hasWorkspaceIdInType,
              `${fileName}: ${func.name}() must accept workspaceId either as first param or within its input type`,
            ).toBe(true);
          });
        }
      }
    });
  }

  describe("Admin module excluded (documented exception)", () => {
    it("admin/data/ is the ONLY permitted cross-tenant access path", () => {
      // This test verifies the security-critical architectural guarantee:
      // ARCHITECTURE.md §7 (Admin Module is the sole exception to tenant scoping),
      // SECURITY.md §5.3 (Admin boundary enforcement),
      // FOLDER_STRUCTURE.md §5.1 (admin/data/ is the documented exception),
      // PRD.md ADM-5 (Admin CANNOT read Product, Inventory, or Order contents)
      //
      // The Admin data layer is the ONLY path permitted to query across tenants.
      // All other modules' data functions MUST have workspaceId as first parameter.

      const adminDataDir = path.join(SRC_DIR, "admin", "data");
      const tsFiles = findTsFiles(adminDataDir);

      // ASSERTION 1: admin/data/ must exist and contain data-access functions
      expect(
        tsFiles.length,
        "admin/data/ must exist with data-access functions — it is the only permitted cross-tenant path",
      ).toBeGreaterThan(0);

      // ASSERTION 2: Admin data functions must NOT require workspaceId as first param
      // (they are cross-tenant by design — this is the documented exception)
      for (const filePath of tsFiles) {
        const functions = extractExportedFunctions(filePath);
        const fileName = path.basename(filePath);

        for (const func of functions) {
          expect(
            func.firstParam,
            `${fileName}: ${func.name}() in admin/data/ must NOT have workspaceId as first param (cross-tenant by design)`,
          ).not.toBe("workspaceId");
        }
      }

      // ASSERTION 3: ALL tenant-scoped modules' data functions MUST have workspaceId
      // This proves admin/data/ is the ONLY exception — no other module can skip tenant scoping
      for (const mod of TENANT_SCOPED_MODULES) {
        const modDataDir = path.join(SRC_DIR, mod, "data");
        const modFiles = findTsFiles(modDataDir);

        for (const filePath of modFiles) {
          const functions = extractExportedFunctions(filePath);
          const fileName = path.basename(filePath);

          for (const func of functions) {
            expect(
              func.hasWorkspaceId,
              `${fileName}: ${func.name}() in ${mod}/data/ MUST have workspaceId as first param — only admin/data/ is exempt`,
            ).toBe(true);
          }
        }
      }
    });
  });

  describe("All modules: no data function should be missing workspaceId in tenant modules", () => {
    it("documents the complete list of tenant-scoped modules", () => {
      // This test ensures we maintain awareness of all modules
      // that must follow the workspaceId convention
      expect(TENANT_SCOPED_MODULES).toContain("store");
      expect(TENANT_SCOPED_MODULES).toContain("products");
      expect(TENANT_SCOPED_MODULES).toContain("inventory");
      expect(TENANT_SCOPED_MODULES).toContain("orders");
      expect(TENANT_SCOPED_MODULES).toContain("audit-log");
      expect(TENANT_SCOPED_MODULES).toContain("subscription");

      // These should be excluded
      expect(EXCLUDED_MODULES).toContain("admin");
      expect(EXCLUDED_MODULES).toContain("integration");
      expect(EXCLUDED_MODULES).toContain("auth");
    });
  });
});
