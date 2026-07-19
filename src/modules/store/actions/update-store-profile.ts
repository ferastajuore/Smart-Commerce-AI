// updateStoreProfile Server Action
// Ref: API.md §7 (updateStoreProfile Server Action),
// PRD.md SET-1 (Store Owner can view and edit basic Store profile information),
// ARCHITECTURE.md §5 (Store Module owns Workspace/Store entity),
// CODING_STANDARDS.md §4 (workspaceId derived from authenticated session),
// SECURITY.md §5.1 (service layer independently verifies caller authority),
// AGENTS.md §10 Rule 6 (settings changes produce an Audit Log entry)

"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { requireStoreOwner } from "@/modules/auth/services/require-store-owner";
import { getStoreById } from "../services/get-store-by-id";
import { updateWorkspaceById } from "../data/update-workspace";
import { recordAuditEntry } from "@/modules/audit-log/services/record-audit-entry";
import {
  updateStoreProfileSchema,
  type UpdateStoreProfileInput,
} from "../validation/update-store-profile-schema";
import { handleActionError } from "@/shared/errors/handle-action-error";

export type UpdateStoreProfileResult =
  | { success: true }
  | { success: false; error: string; code: string; status: number };

/**
 * Updates the Store Owner's basic profile information.
 *
 * Scoped to the authenticated Workspace — workspaceId is derived
 * from the session, never from client-supplied input (ARCHITECTURE.md §7).
 *
 * Security measures applied:
 * - Two-layer auth enforcement: requireStoreOwner verifies session + role
 *   (SECURITY.md §5.1)
 * - Session re-validation on every call (SECURITY.md §4.2)
 * - Input validation via Zod schema (CODING_STANDARDS.md §7)
 * - Audit log entry for the settings change (AGENTS.md §10 Rule 6)
 *
 * @param _prevState - Previous form state (React useActionState pattern)
 * @param formData - Raw form data containing profile fields
 * @returns Result indicating success or structured error
 */
export async function updateStoreProfile(
  _prevState: UpdateStoreProfileResult | null,
  formData: FormData,
): Promise<UpdateStoreProfileResult> {
  try {
    // Verify caller is an authenticated Store Owner
    // Ref: SECURITY.md §5.1 (service layer independently verifies authority)
    const session = await getServerSession(authOptions);
    const user = await requireStoreOwner(session, { revalidate: true });

    // requireStoreOwner guarantees workspaceId exists (throws if missing),
    // but TypeScript cannot narrow the SessionUser type through the throw.
    // We assert here for type safety.
    const workspaceId = user.workspaceId as string;

    // Validate input shape
    // Ref: CODING_STANDARDS.md §7
    const raw: UpdateStoreProfileInput = {
      businessName: String(formData.get("businessName") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      contactPhone: String(formData.get("contactPhone") ?? ""),
    };

    const parsed = updateStoreProfileSchema.safeParse(raw);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return {
        success: false,
        error: firstError,
        code: "VALIDATION_ERROR",
        status: 422,
      };
    }

    // Retrieve the current workspace for audit log (previous state)
    // Ref: ARCHITECTURE.md §5 (Store Module exposes getStoreById)
    const workspace = await getStoreById(workspaceId);

    // Update the workspace
    // Ref: DATABASE.md §4.2 (Workspace entity)
    await updateWorkspaceById(workspaceId, parsed.data);

    // Audit log the settings change
    // Ref: AGENTS.md §10 Rule 6 (every important state-changing action
    // creates an Audit Log entry)
    await recordAuditEntry({
      workspaceId,
      actorId: user.id,
      action: "SETTINGS_CHANGED",
      entity: "Workspace",
      entityId: workspace.id,
      previousState: {
        businessName: workspace.businessName,
        contactEmail: workspace.contactEmail,
        contactPhone: workspace.contactPhone,
      },
      newState: parsed.data,
    });

    return { success: true };
  } catch (error) {
    // Ref: AGENTS.md §10 (Error Handling Principles)
    return handleActionError(error);
  }
}
