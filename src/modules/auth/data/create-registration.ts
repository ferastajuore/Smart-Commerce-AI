// Create registration transaction — Auth Module data layer
// Ref: ARCHITECTURE.md §5 (Auth Module handles registration),
// DATABASE.md §4.1 (User), §4.2 (Workspace), §4.4 (Subscription),
// API.md §9 (registerStore creates User + Workspace in one transaction),
// PRD.md REG-1 (new user registers a Store), REG-4 (automatic 14-day trial)
//
// Creates User (STORE_OWNER), Workspace (TRIAL), and Subscription (TRIALING)
// in a single database transaction. If any step fails, the entire
// registration is rolled back — no partial state is ever observable.

import { prisma } from "@/lib/prisma";

export interface CreateRegistrationInput {
  email: string;
  passwordHash: string;
  phone: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  trialEndsAt: Date;
  starterPlanId: string;
}

/**
 * Creates a new Store Owner registration in a single atomic transaction.
 *
 * The transaction creates:
 * 1. User (role: STORE_OWNER) — DATABASE.md §4.1
 * 2. Workspace (status: TRIAL, trialEndsAt: now + 14 days) — DATABASE.md §4.2
 * 3. Subscription (status: TRIALING, plan: STARTER) — DATABASE.md §4.4
 *
 * Ref: API.md §9 (registerStore creates User + Workspace in one transaction),
 * PRD.md REG-4 (automatic 14-day trial on successful registration)
 *
 * @param input - Registration data including hashed password and plan ID
 * @returns The created User, Workspace, and Subscription records
 */
export async function createRegistration(input: CreateRegistrationInput) {
  return prisma.$transaction(async (tx) => {
    // Step 1: Create User with STORE_OWNER role
    // DATABASE.md §4.1 — phone is required for STORE_OWNER
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: "STORE_OWNER",
        phone: input.phone,
      },
    });

    // Step 2: Create Workspace with TRIAL status
    // DATABASE.md §4.2 — status defaults to TRIAL, trialEndsAt set to 14 days
    // AGENTS.md §10 Rule 11: every new Store receives exactly one 14-day free trial
    const workspace = await tx.workspace.create({
      data: {
        ownerId: user.id,
        businessName: input.businessName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        status: "TRIAL",
        trialEndsAt: input.trialEndsAt,
      },
    });

    // Step 3: Create Subscription with TRIALING status on STARTER plan
    // DATABASE.md §4.4 — billing period is one month from now
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const subscription = await tx.subscription.create({
      data: {
        workspaceId: workspace.id,
        planId: input.starterPlanId,
        status: "TRIALING",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        aiConversationsUsed: 0,
      },
    });

    return { user, workspace, subscription };
  });
}
