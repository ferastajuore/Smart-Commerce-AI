// isMessengerConnected — Store Module service
// Ref: ARCHITECTURE.md §5 (Store Module owns MessengerConnection),
// DATABASE.md §4.5 (MessengerConnection entity),
// PRD.md REG-3 (Store cannot serve customers until a connected Page exists),
// PRD.md MSG-2 (connection health detection)
//
// Business-rule gate for the Facebook Page connection requirement.
// Enforces that a Store has an active Messenger connection before
// serving customers via the Integration Layer (Milestone 9).
// The actual connection mechanism is implemented in Milestone 9.

import { findMessengerConnection } from "../data/find-messenger-connection";

/**
 * Checks whether a Store has an active Messenger connection.
 *
 * A Store must have a MessengerConnection with CONNECTED status
 * before it can serve customers via the Integration Layer.
 * Ref: PRD.md REG-3, PRD.md MSG-2
 *
 * This is a business-rule gate only — it does not implement the
 * connection mechanism itself (Milestone 9).
 *
 * @param workspaceId - Mandatory, session-derived workspace identifier
 * @returns true if the workspace has an active Messenger connection
 */
export async function isMessengerConnected(
  workspaceId: string,
): Promise<boolean> {
  const connection = await findMessengerConnection(workspaceId);

  if (!connection) {
    return false;
  }

  return connection.status === "CONNECTED";
}
