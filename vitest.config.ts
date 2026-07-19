// Vitest configuration
// Ref: TESTING.md §3 (test levels), TESTING.md §14 (CI testing requirements)
//
// Test files are colocated in src/__tests__/ following the module structure.
// Path aliases match tsconfig.json for consistent imports.

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Run tests from src/__tests__/ directory
    include: ["src/__tests__/**/*.test.ts"],
    // Use Node environment for server-side tests (Prisma, Server Actions)
    environment: "node",
    // Setup file for test database and Prisma client
    setupFiles: ["src/__tests__/setup.ts"],
    // Test timeout — integration tests may need more time for DB operations
    testTimeout: 30000,
    // Coverage configuration
    coverage: {
      provider: "v8",
      include: [
        "src/shared/tenant/**/*.ts",
        "src/modules/store/**/*.ts",
        "src/modules/audit-log/**/*.ts",
        "src/modules/admin/**/*.ts",
      ],
    },
  },
});
