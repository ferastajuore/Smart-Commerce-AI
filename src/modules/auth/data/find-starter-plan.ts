// Find STARTER subscription plan — Auth Module data layer
// Ref: ARCHITECTURE.md §5 (Auth Module handles registration),
// DATABASE.md §4.3 (SubscriptionPlan entity),
// AGENTS.md §12 (subscription plans: Starter $15/mo, Business $35/mo, Pro $85/mo)
//
// Used during registration to assign the default trial plan.
// The STARTER plan is the default plan for all new trial subscriptions.

import { prisma } from "@/lib/prisma";
import type { SubscriptionPlan } from "@prisma/client";

/**
 * Finds the STARTER subscription plan for trial assignment.
 *
 * The STARTER plan is the default plan assigned to all new Stores
 * during registration (AGENTS.md §12, PRD.md SUB-1).
 *
 * @returns The STARTER SubscriptionPlan if it exists, null otherwise
 */
export async function findStarterPlan(): Promise<SubscriptionPlan | null> {
  return prisma.subscriptionPlan.findUnique({
    where: { name: "STARTER" },
  });
}
