// registerStore Server Action
// Ref: API.md §9 (registerStore endpoint),
// PRD.md REG-1 (new user registers a Store by providing business details),
// PRD.md REG-4 (automatic 14-day trial on successful registration),
// PRD.md REG-5 (each Store may receive exactly one free trial, ever),
// AGENTS.md §10 Rule 11 (every new Store receives exactly one 14-day free trial),
// SECURITY.md §9 (rate limiting on registerStore),
// ARCHITECTURE.md §5 (Auth Module handles registration)
//
// Phone verification (PRD.md REG-2) is DEFERRED to a future milestone.
// The implementation is structured so phone verification can be integrated
// later without refactoring — the registration flow creates the trial
// immediately, and a future phone verification step can gate trial
// activation by changing the Workspace status.
//
// Facebook Page connection requirement (PRD.md REG-3) is enforced at the
// business-rule level via isMessengerConnected(). The actual connection
// mechanism is implemented in Milestone 9.

"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

import {
  registerStoreSchema,
  type RegisterStoreInput,
} from "../validation/register-schema";
import { findUserByEmail } from "../services/find-user-by-email";
import { createRegistration } from "../data/create-registration";
import { findStarterPlan } from "../data/find-starter-plan";
import { recordAuditEntry } from "@/modules/audit-log/services/record-audit-entry";
import {
  checkRateLimit,
  AuthRateLimits,
} from "@/shared/rate-limit/rate-limiter";
import { BCRYPT_WORK_FACTOR } from "@/lib/auth";

export type RegisterStoreResult =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

/**
 * Registers a new Store Owner and creates their Workspace with an
 * automatic 14-day trial.
 *
 * Security measures applied:
 * - Input validation via Zod schema (CODING_STANDARDS.md §7)
 * - Rate limiting per IP (SECURITY.md §9)
 * - One-trial-ever enforcement: email uniqueness check (PRD.md REG-5)
 * - Password hashing with bcrypt (SECURITY.md §4.1)
 * - Atomic transaction: User + Workspace + Subscription (API.md §9)
 * - Audit log entry for the registration (AGENTS.md §10 Rule 6)
 *
 * @param _prevState - Previous form state (React useActionState pattern)
 * @param formData - Raw form data containing registration fields
 * @returns Result with redirect path on success, or error message
 */
export async function registerStore(
  _prevState: RegisterStoreResult | null,
  formData: FormData,
): Promise<RegisterStoreResult> {
  // Validate input shape via Zod
  // Ref: CODING_STANDARDS.md §7
  const raw: RegisterStoreInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    businessName: String(formData.get("businessName") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
  };

  const parsed = registerStoreSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  const { email, password, businessName, contactEmail, contactPhone } =
    parsed.data;

  // Rate limiting: per IP
  // Ref: SECURITY.md §9 (per IP, coarse-grained for registration)
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = `register:${ip}`;
  const rateLimitResult = checkRateLimit(
    rateLimitKey,
    AuthRateLimits.register,
  );

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: "Too many registration attempts. Please try again later.",
    };
  }

  // One-trial-ever enforcement (PRD.md REG-5, AGENTS.md §10 Rule 11)
  // If an account with this email already exists, reject — each email
  // maps to exactly one user, and each user maps to exactly one Workspace.
  // A second registration attempt with the same email would receive a
  // second trial, violating the one-trial-ever rule.
  // NOTE: Full abuse detection (different emails, same person) is
  // explicitly deferred per Updated Project Decisions — this is the
  // current enforcement level.
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  // Find the STARTER subscription plan for trial assignment
  // Ref: AGENTS.md §12 (default plan is Starter)
  const starterPlan = await findStarterPlan();
  if (!starterPlan) {
    // The STARTER plan should exist in the database (seeded or created by Admin).
    // If it doesn't, this is an unexpected infrastructure failure.
    // Ref: AGENTS.md §10 (log unexpected failures)
    console.error(
      "[Registration] STARTER subscription plan not found in database.",
    );
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }

  // Calculate 14-day trial end date
  // Ref: PRD.md REG-4 (14-day free trial on successful registration)
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  // Hash password before storage
  // Ref: SECURITY.md §4.1 (bcrypt with fixed work factor)
  const passwordHash = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  try {
    // Create User + Workspace + Subscription in a single transaction
    // Ref: API.md §9 (registerStore creates User + Workspace in one transaction)
    const { user, workspace } = await createRegistration({
      email,
      passwordHash,
      phone: contactPhone,
      businessName,
      contactEmail,
      contactPhone,
      trialEndsAt,
      starterPlanId: starterPlan.id,
    });

    // Audit log the registration
    // Ref: AGENTS.md §10 Rule 6 (every important state-changing action
    // creates an Audit Log entry)
    await recordAuditEntry({
      workspaceId: workspace.id,
      actorId: user.id,
      action: "WORKSPACE_REGISTERED",
      entity: "Workspace",
      entityId: workspace.id,
      newState: {
        businessName,
        status: "TRIAL",
        trialEndsAt: trialEndsAt.toISOString(),
      },
    });
  } catch (error) {
    // Unexpected failure during registration
    // Ref: AGENTS.md §10 (log unexpected failures, never silently ignore)
    console.error("[Registration] Transaction failed:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }

  // Sign in the newly registered user
  // Ref: SECURITY.md §4.2 (session established via NextAuth JWT)
  const signInResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (signInResult?.error) {
    // Account was created successfully but auto sign-in failed.
    // Redirect to login — the user can sign in with their new credentials.
    // Ref: AGENTS.md §10 (deterministic errors, never silent failures)
    redirect("/login");
  }

  redirect("/stores/dashboard");
}
