// Seed script for local/test data
// Ref: TASKS.md Milestone 2 — creates baseline data for integration tests and local development
//
// Creates:
// - Three SubscriptionPlans (Starter, Business, Pro) — platform-level catalog
// - One Store Owner User
// - One Workspace (with trial subscription)
// - One Product with Inventory
// - One Platform Administrator

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // --- Subscription Plans (DATABASE.md §4.3, AGENTS.md §12) ---
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { name: "STARTER" },
    update: {},
    create: {
      name: "STARTER",
      priceUsd: new Prisma.Decimal("15.00"),
      monthlyAiConversationLimit: 100,
      isActive: true,
    },
  });

  const businessPlan = await prisma.subscriptionPlan.upsert({
    where: { name: "BUSINESS" },
    update: {},
    create: {
      name: "BUSINESS",
      priceUsd: new Prisma.Decimal("35.00"),
      monthlyAiConversationLimit: 500,
      isActive: true,
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { name: "PRO" },
    update: {},
    create: {
      name: "PRO",
      priceUsd: new Prisma.Decimal("85.00"),
      monthlyAiConversationLimit: 2000,
      isActive: true,
    },
  });

  console.log("  Subscription plans created:", {
    starter: starterPlan.id,
    business: businessPlan.id,
    pro: proPlan.id,
  });

  // --- Store Owner User (DATABASE.md §4.1) ---
  const storeOwner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      passwordHash: "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012", // placeholder — real hashing in M3
      role: "STORE_OWNER",
      phone: "+218911234567",
    },
  });

  console.log("  Store Owner created:", storeOwner.id);

  // --- Workspace (DATABASE.md §4.2) ---
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const workspace = await prisma.workspace.upsert({
    where: { ownerId: storeOwner.id },
    update: {},
    create: {
      ownerId: storeOwner.id,
      businessName: "Test Store",
      contactEmail: "owner@example.com",
      contactPhone: "+218911234567",
      status: "TRIAL",
      trialEndsAt,
    },
  });

  console.log("  Workspace created:", workspace.id);

  // --- Subscription (DATABASE.md §4.4) ---
  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const subscription = await prisma.subscription.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      planId: starterPlan.id,
      status: "TRIALING",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      aiConversationsUsed: 0,
    },
  });

  console.log("  Subscription created:", subscription.id);

  // --- Product (DATABASE.md §4.6) ---
  // Unique constraint: @@unique([workspaceId, sku])
  const product = await prisma.product.upsert({
    where: { workspaceId_sku: { workspaceId: workspace.id, sku: "TEST-001" } },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: "Test Product",
      sku: "TEST-001",
      price: new Prisma.Decimal("25.00"),
      status: "ACTIVE",
    },
  });

  console.log("  Product created:", product.id);

  // --- Inventory (DATABASE.md §4.7) ---
  // Unique constraint on productId
  const inventory = await prisma.inventory.upsert({
    where: { productId: product.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      productId: product.id,
      quantity: 100,
    },
  });

  console.log("  Inventory created:", inventory.id);

  // --- Platform Administrator (DATABASE.md §4.1) ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012", // placeholder — real provisioning in M3
      role: "PLATFORM_ADMIN",
      phone: null,
    },
  });

  console.log("  Platform Administrator created:", admin.id);

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
