// Test setup file
// Ref: TESTING.md §5 (integration tests run against isolated test database),
// TESTING.md §14 (CI testing requirements)
//
// Sets up the Prisma client for integration tests. Unit tests that don't
// need a database are not affected by this setup.

import "dotenv/config";
import { afterAll } from "vitest";
import { createTestPrismaClient } from "./helpers/create-test-prisma-client";

// Only initialize Prisma if a DATABASE_URL is available.
// Pure unit tests (e.g., tenant-where tests) don't need a database.
// Ref: TESTING.md §5
if (process.env.DATABASE_URL) {
  const prisma = createTestPrismaClient();

  // Make prisma available globally for integration tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).__PRISMA__ = prisma;

  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });
}

export {};
