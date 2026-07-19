import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Prisma 7 requires the datasource URL to be configured here,
  // not in schema.prisma. Ref: FOLDER_STRUCTURE.md §8
  datasource: {
    url: env("DATABASE_URL"),
  },
  // Seed command for local development and integration tests.
  // Ref: TASKS.md Milestone 2 — "Write a seed script for local/test data"
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
});
