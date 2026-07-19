// ESLint Configuration — Smart Commerce AI
// Ref: FOLDER_STRUCTURE.md §7 (enforcement mechanism),
// CODING_STANDARDS.md §3 (module boundary enforcement),
// CODING_STANDARDS.md §4 (tenant scoping convention)
//
// ============================================================================
// TENANT SCOPING CONVENTION (Review Checklist / Lint-Aided Check)
// ============================================================================
// Per ARCHITECTURE.md §7 and CODING_STANDARDS.md §4:
//
// RULE: Every function in modules/*/data/*.ts MUST accept `workspaceId`
// as its FIRST REQUIRED parameter of type `string`.
//
// EXCEPTION: modules/admin/data/ — cross-tenant by design
// (ARCHITECTURE.md §7, SECURITY.md §5.3, FOLDER_STRUCTURE.md §5.1).
//
// REVIEW CHECKLIST (for every PR touching modules/*/data/):
// 1. Does every exported function have `workspaceId: string` as first param?
// 2. Does every Prisma query use tenantWhere() from shared/tenant/?
// 3. Is there any findUnique({ where: { id } }) without tenant scoping?
//    → FORBIDDEN on tenant-owned entities (must use findFirst + tenantWhere)
// 4. Does the Admin data path ONLY query Workspace metadata?
//    → NEVER Product, Inventory, or Order tables (PRD.md ADM-5)
//
// Any function in modules/*/data/ whose first parameter is not workspaceId
// is rejected in review, unless the function is in modules/admin/data/
// or operates on a table without a workspaceId column per DATABASE.md.
// ============================================================================

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Module names matching ARCHITECTURE.md §5 / FOLDER_STRUCTURE.md §5
const MODULES = [
  "auth",
  "store",
  "subscription",
  "products",
  "inventory",
  "orders",
  "integration",
  "audit-log",
  "admin",
];

// Build per-module overrides that ALLOW same-module data/ imports.
// FOLDER_STRUCTURE.md §5.1: "modules/*/services/ may import its own module's data/"
const sameModuleDataOverrides = MODULES.map((mod) => ({
  files: [`src/modules/${mod}/**/*.ts`, `src/modules/${mod}/**/*.tsx`],
  rules: {
    "no-restricted-imports": "off",
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  // Global rule: block cross-module data/ imports
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*/data/*"],
              message:
                "Do not import another module's data/ layer directly. Import from that module's services/ instead.",
            },
          ],
        },
      ],
    },
  },
  // Per-module override: allow same-module data/ imports
  // FOLDER_STRUCTURE.md §5.1: a module's services/ may import its own data/
  ...sameModuleDataOverrides,
]);

export default eslintConfig;
