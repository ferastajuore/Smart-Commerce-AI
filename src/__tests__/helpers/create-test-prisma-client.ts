// Shared Prisma client factory for integration tests
// Ref: TESTING.md §5 (integration tests run against isolated test database)
//
// Prisma 7 requires the PrismaPg adapter to be explicitly passed.
// This helper mirrors src/lib/prisma.ts's adapter setup so that
// integration tests connect to the database correctly.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function createTestPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}
