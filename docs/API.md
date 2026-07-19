# API.md

## Smart Commerce AI — API Design (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DATABASE.md
**Read By:** FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md, TESTING.md

---

## 1. Purpose

This document defines the concrete API surface that implements the module contracts described in ARCHITECTURE.md Section 5 and Section 6, against the data model defined in DATABASE.md. It specifies routes, authentication requirements, request/response shapes, and error behavior — not UI implementation (FOLDER_STRUCTURE.md, CODING_STANDARDS.md) and not infrastructure (DEPLOYMENT.md).

Every endpoint in this document maps to a module boundary already defined in ARCHITECTURE.md Section 5. No endpoint is introduced here that wasn't implied by that module design — this document makes the internal contracts concrete, it does not invent new capability.

---

## 2. API Consumers

There are exactly three classes of caller in MVP, and the API surface is partitioned around them. This partition is itself a security boundary, not just an organizational convenience.

| Consumer | Access Path | Authentication |
|---|---|---|
| **Store Owner (browser)** | `/stores/*` UI, backed by Server Actions | Session-based (NextAuth), Workspace-scoped |
| **Platform Administrator (browser)** | `/admin/*` UI, backed by Server Actions | Session-based (NextAuth), Admin-scoped, structurally separate from Store sessions |
| **Automation Layer (n8n, or its future replacement)** | `POST /api/integration/*` | Service-to-service credential (API key or signed token), never a user session |

No other caller type exists. There is no public, unauthenticated API surface in MVP — the platform does not expose data to anyone who isn't an authenticated Store Owner, an authenticated Administrator, or the automation layer acting under its own dedicated credential.

---

## 3. API Design Principles

Restated from AGENTS.md and ARCHITECTURE.md, applied specifically to API design:

- **Server Actions for UI-driven operations.** Since the stack is Next.js 15 with Server Actions (ARCHITECTURE.md §12), most Store Owner and Administrator interactions are implemented as Server Actions, not hand-rolled REST endpoints — they run server-side, are called directly from React components, and never expose a separate public HTTP contract that a browser session doesn't already imply.
- **Explicit HTTP routes only where a non-browser caller needs them.** The Automation Layer is not a browser session and cannot invoke a Server Action — it needs real HTTP endpoints. This is why `/api/integration/*` exists as actual routes while Store/Admin operations mostly do not need equivalent public routes.
- **The Integration Layer contract is the only externally reachable surface (ARCHITECTURE.md §6).** `/api/integration/*` exposes exactly `checkAvailability` and `proposeOrder` — nothing else. This is enforced here as a routing-level fact: no other `/api/*` route exists for external callers to reach Orders, Inventory, or Products directly.
- **Every tenant-scoped operation resolves Workspace ID from the authenticated session or credential — never from a client-supplied field alone.** A request body may reference a `workspaceId`-shaped value (e.g., which Page a webhook event belongs to), but the API always cross-checks it against the authenticated context before acting, per ARCHITECTURE.md §7.
- **API Stability (AGENTS.md §10).** All routes are versioned under `/api/v1/` for external-facing surfaces (`/api/integration/`). Server Actions are not versioned the same way since they are not a public contract, but breaking changes to their input/output shapes are still documented in change notes per the same principle.
- **Errors are deterministic and structured (AGENTS.md §10, Error Handling Principles).** No endpoint fails silently; every failure returns a structured, predictable error (Section 9).
- **AI-originated input is never trusted (AGENTS.md §11).** Every field arriving through `/api/integration/*` is validated with Zod before touching any module logic, regardless of what the Automation Layer or AI claims is true.

---

## 4. API Input Validation Strategy

All external and user-provided input must pass schema validation before reaching module logic.

Validation boundaries:

| Boundary                                  | Validation                                                    |
| ----------------------------------------- | ------------------------------------------------------------- |
| Integration API (`/api/integration/v1/*`) | Zod schema validation is required before any module call      |
| Store Owner Server Actions                | Zod validation for all form and user-provided input           |
| Administrator Server Actions              | Zod validation for all administrative input                   |
| Database Layer                            | Prisma schema and database constraints protect data integrity |

Rules:

- Validation failures return the standard `VALIDATION_ERROR` response format defined in Section 9.
- Validation checks input shape, required fields, and basic data constraints only.
- Business rules remain inside application modules and are never moved into validation schemas.
- AI-generated payloads are always treated as untrusted input and must pass the same validation path as any other external input.

---

## 5. Authentication & Session Boundaries

| Boundary | Mechanism | Notes |
|---|---|---|
| Store Owner session | NextAuth session cookie, `role = STORE_OWNER` | Resolves to exactly one `workspaceId` (PRD.md AUTH-2); every Server Action under `/stores/*` derives Workspace scope from this session, never from a URL or form parameter |
| Administrator session | NextAuth session cookie, `role = PLATFORM_ADMIN` | Structurally cannot resolve to a `workspaceId` for Store-scoped actions; Admin Server Actions use a separate data-access path (ARCHITECTURE.md §7) |
| Integration Layer credential | Long-lived API key issued per Workspace (or per platform-level automation deployment — see Section 5.3), sent as a bearer token on every `/api/integration/*` request | Not a user session; identifies which Workspace's Messenger connection the request belongs to, resolved server-side, never inferred from an unauthenticated body field alone |

A session or credential belonging to one boundary is never valid against a route belonging to another. This is enforced at the routing layer (middleware checks role/credential type before any module logic runs), not left to individual endpoint implementations to check ad hoc — consistent with AGENTS.md's Security by Default principle ("every feature should be secure by default").

---

## 6. Integration Layer API (`/api/integration/v1/*`)

This is the only surface reachable by the Automation Layer. It implements exactly the contract defined in ARCHITECTURE.md Section 6.

### 6.1 `POST /api/integration/v1/availability`

Corresponds to `checkAvailability()`.

**Authentication:** Integration Layer credential, resolved to a Workspace.

**Request body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `query` | String | Yes | Free-text or product-name-like query from the AI's understanding of the conversation |
| `conversationId` | String | Yes | Automation layer's own conversation/thread identifier, stored for traceability, not used for authorization |

**Response (200):**

| Field | Type | Notes |
|---|---|---|
| `matches` | Array of `{ productId, name, price, inStock, quantityAvailable }` | `quantityAvailable` reflects live Inventory at query time — this is a read, not a reservation (Section 5.4 explains why) |

**Behavior notes:**

- Before executing the lookup, the platform calls the Subscription Module's `canConsumeAiConversation()` (ARCHITECTURE.md §9). If the Workspace has exhausted its monthly AI conversation allowance, this endpoint returns a `402`-style structured error (Section 9) rather than partial or degraded results — the Store Owner must be clearly informed (PRD.md SUB-5), not silently short-changed.
- This endpoint is read-only. It cannot reserve stock. See Section 5.4 for why no reservation mechanism exists in MVP.

### 6.2 `POST /api/integration/v1/orders`

Corresponds to `proposeOrder()`.

**Authentication:** Integration Layer credential, resolved to a Workspace.

**Request body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `conversationId` | String | Yes | Same identifier as above, for traceability |
| `customer` | `{ name?, phone?, messengerId }` | `messengerId` required, others optional | Matches `Order.customerName/customerPhone/customerMessengerId` (DATABASE.md §4.8) |
| `items` | Array of `{ productId, quantity }` | Yes, at least one item | No price is accepted from the caller — price is always re-derived server-side |

**Response (201):**

| Field | Type | Notes |
|---|---|---|
| `orderId` | UUID | |
| `status` | `"PENDING"` | Always `PENDING` — this endpoint cannot create an Order in any other status, structurally, regardless of what a caller sends (ARCHITECTURE.md §6.2) |
| `totalAmount` | Decimal | Computed server-side from current Product prices |

**Validation and integrity behavior (ARCHITECTURE.md §6.4):**

1. Every `productId` is re-verified to exist, belong to the calling Workspace, and be `ACTIVE`.
2. Every `quantity` is re-checked against current `Inventory.quantity` — if insufficient stock exists at the moment of order creation (even if `checkAvailability` earlier said otherwise), the request fails with a structured error (Section 9) rather than creating an Order the Store Owner cannot actually fulfill.
3. `unitPriceAtOrder` on each resulting `OrderItem` is set from the Product's current price — never from any price the caller supplies.
4. The resulting `Order` and its `OrderItem`s are created in a single transaction, followed by an `AuditLog` entry (`action: ORDER_CREATED`), consistent with ARCHITECTURE.md §10.
5. This endpoint never accepts or interprets an "approved" field. There is no code path from this endpoint to `approveOrder()`.

### 6.3 Integration Layer Credential Scope

Each Workspace's Messenger connection (DATABASE.md §4.5) is associated with a distinct credential used to authenticate calls to this API on that Workspace's behalf. A single leaked or misused credential exposes at most one Workspace's availability data and order-creation capability — never another Workspace's, consistent with the Workspace/Store Isolation principle. Credential issuance and rotation mechanics are defined in SECURITY.md.

### 6.4 Why No Stock Reservation Mechanism Exists in MVP

A natural question: should `checkAvailability` temporarily reserve stock so two simultaneous customers don't both get told an item is available? This is deliberately **not implemented in MVP.** Reasoning: reservation systems introduce timeout logic, release-on-abandonment logic, and a new class of state (reserved vs. available vs. sold) that isn't required by any PRD.md requirement and would work against MVP Discipline (AGENTS.md §9). Instead, the re-verification step in Section 5.2 (step 2) is the platform's actual safeguard — if two customers both attempt to order the last unit, the second `proposeOrder()` call (or, failing that, the second approval attempt) will find insufficient stock and fail deterministically rather than silently overselling. This is flagged here explicitly so a future engineer doesn't mistake the absence of reservation logic for an oversight.

---

## 7. Store Owner Operations (`/stores/*`, Server Actions)

These are not public HTTP routes; they are Server Actions invoked from the `/stores/*` UI, scoped to the authenticated Store Owner's Workspace. Listed here by module for completeness and traceability to PRD.md, since ARCHITECTURE.md Section 13 defers exact API shape to this document.

| Module | Action | PRD Reference | Notes |
|---|---|---|---|
| Store | `updateStoreProfile` | SET-1 | |
| Store | `connectMessengerPage`, `disconnectMessengerPage` | SET-2, MSG-2/3 | Reconnection must not delete existing Store data (MSG-3) |
| Subscription | `getSubscriptionStatus` | SUB-4 | Returns current plan, usage, trial/billing state |
| Subscription | `changePlan` | SUB-1 | Initiates a plan change; billing mechanics defined in DEPLOYMENT.md/SECURITY.md as relevant to payment processing |
| Products | `createProduct`, `updateProduct`, `deactivateProduct`, `deleteProduct` | PROD-1 through PROD-5 | `deleteProduct` enforces PROD-4 by checking for referencing non-terminal Orders before calling the database (which additionally guarantees this via Restrict-on-delete, DATABASE.md §4.9) |
| Inventory | `getStockLevel`, `adjustStockManually` | INV-1, INV-5 | Manual adjustment writes an `AuditLog` entry (`action: INVENTORY_ADJUSTED`) |
| Orders | `listOrders`, `getOrder`, `approveOrder`, `rejectOrder` | ORD-4 through ORD-9 | `approveOrder`/`rejectOrder` are the only entry points to these state transitions system-wide (ARCHITECTURE.md §8) |
| Dashboard | `getDashboardStats` | DASH-1, DASH-2 | Live counts, not cached snapshots, per DATABASE.md §8 |
| Audit Log | `getAuditLog` | AUD-3 | Scoped to the caller's own Workspace only |

Every action in this table resolves `workspaceId` from the authenticated session (Section 4) — none accept a `workspaceId` as caller-supplied input.

---

## 8. Platform Administrator Operations (`/admin/*`, Server Actions)

| Module | Action | PRD Reference | Notes |
|---|---|---|---|
| Admin | `listStores`, `getStoreSummary` | ADM-1 | Returns subscription/trial state; does not return Products, Inventory, or Order contents (ADM-5) |
| Admin | `getPlatformStatistics` | ADM-2 | Aggregate counts (active Stores, trials, subscriptions by plan, conversion rate) |
| Admin | `createSubscriptionPlan`, `updateSubscriptionPlan`, `deactivateSubscriptionPlan` | ADM-3 | Maps directly to `SubscriptionPlan` (DATABASE.md §4.3) |
| Admin | `updatePlatformSettings` | ADM-4 | |
| Admin | `getAuditLog` (cross-Workspace) | AUD-4 | Uses the explicitly separate Admin data-access path (ARCHITECTURE.md §7) — structurally distinct from `getAuditLog` in Section 6, never the same function with a bypassed check |

**Hard boundary (PRD.md ADM-5, restated as an API-level fact):** there is no Administrator action anywhere in this API that reads or writes a specific Workspace's Products, Inventory, or Orders. If a future requirement needs this (e.g., for support purposes), it requires a new, explicitly-scoped, audited capability — not a relaxation of an existing one.

---

## 9. Authentication Endpoints

| Endpoint / Action | Purpose | Notes |
|---|---|---|
| `registerStore` | Creates `User` (role: `STORE_OWNER`) + `Workspace` in one transaction | Implements REG-1; trial fields set per REG-4 |
| `login` / `logout` | NextAuth-backed session management | Applies to both roles; role is resolved from `User.role` and determines which route tree the session is valid for (Section 4) |
| `requestPasswordReset` / `resetPassword` | Account recovery | PRD.md AUTH-5, applies to both roles |

Registration for a Platform Administrator account is **not** a self-service endpoint — Administrator accounts are provisioned directly (mechanism defined in SECURITY.md/DEPLOYMENT.md), consistent with the role being fully separated from public signup (AGENTS.md §8).

---

## 10. Error Handling & Response Structure

Per AGENTS.md's Error Handling Principles (fail loudly, deterministic errors, never silently ignore business errors), every API response — Server Action or HTTP route — follows a consistent structure.

**Success shape (HTTP routes):**
```
{ "data": { ... } }
```

**Error shape (HTTP routes and Server Action error returns):**
```
{
  "error": {
    "status": "STATUS_ERROR"
    "code": "STRING_ERROR_CODE",
    "message": "Human-readable explanation",
    "details": { }
  }
}
```

**Standard error codes used across the API:**

| Code | Meaning | Example Trigger |
|---|---|---|
| `UNAUTHORIZED` | No valid session/credential | Missing or invalid Integration Layer token |
| `FORBIDDEN` | Valid identity, wrong scope | Store Owner session attempting an Admin action |
| `NOT_FOUND` | Entity doesn't exist or isn't visible to this caller | Requesting an Order belonging to another Workspace — deliberately returned as `NOT_FOUND`, not `FORBIDDEN`, so tenant isolation never confirms *existence* of another Workspace's data (a `FORBIDDEN` response would leak that the record exists) |
| `VALIDATION_ERROR` | Request body fails schema validation | Malformed `proposeOrder` payload |
| `INSUFFICIENT_STOCK` | Requested quantity exceeds current Inventory | Step 2 of Section 5.2 |
| `AI_CONVERSATION_LIMIT_REACHED` | Workspace has exhausted its monthly allowance | Section 5.1 behavior notes |
| `CONFLICT` | Action invalid given current state | Attempting to approve an already-Approved or Rejected Order |
| `INTERNAL_ERROR` | Unexpected failure | Logged per AGENTS.md's "log unexpected failures" — never returned with implementation detail (e.g., raw stack traces) to the caller |

This table exists so API.md and TESTING.md (later) share one vocabulary — test cases can be written directly against these codes.

---

## 11. Rate Limiting & Abuse Considerations

- `/api/integration/v1/*` is the only surface exposed to a caller outside the platform's own session system, and is therefore the primary rate-limiting target. Limits are enforced per Workspace credential, layered on top of (not a replacement for) the AI conversation metering already described in Section 5.1 — metering is a billing concern, rate limiting is an abuse/availability concern, and the two serve different purposes even though both throttle the same endpoints.
- Authentication endpoints (`login`, `requestPasswordReset`) require basic abuse protection (attempt throttling) consistent with standard practice; detailed thresholds and mechanisms belong to SECURITY.md.
- Full abuse-detection strategy for trial creation (REG-5) is explicitly deferred to a future version per the Updated Project Decisions — this document does not introduce a fraud-detection mechanism not yet decided upon.

---

## 12. What This API Deliberately Does Not Expose

Consistent with MVP Discipline (AGENTS.md §9) and the Integration Layer's minimal surface (ARCHITECTURE.md §6.2):

- No endpoint allows the Automation Layer to read or write Orders beyond creating a Pending one.
- No endpoint allows any caller to modify Inventory directly outside `adjustStockManually` (Store Owner only) and the approval transaction (Section 6).
- No public, unauthenticated endpoint exists anywhere in the system.
- No endpoint returns data belonging to a Workspace other than the caller's authenticated one, except the explicitly separate Admin surface (Section 7), which itself never returns Product/Inventory/Order contents.
- No Customer-management endpoints exist (no `listCustomers`, no `getCustomerHistory`) — consistent with DATABASE.md §8; customer data is only ever accessed as a field on an `Order`.

---

## 13. Cross References

- **ARCHITECTURE.md** — Section 5 (Module Boundaries) and Section 6 (Integration Abstraction Layer) define the contracts made concrete as routes in Section 5 of this document. Section 7 (Tenant Isolation) and Section 8 (Human Approval Gate) govern the authentication/scoping rules in Section 4 and Section 6 here.
- **DATABASE.md** — every request/response field in this document maps to a field defined in DATABASE.md Section 4; no API shape introduces a field without a corresponding schema field.
- **PRD.md** — every Server Action listed in Section 6 and Section 7 traces to a specific functional requirement, cited inline.
- **AGENTS.md** — Section 10's Error Handling Principles, API Stability rule, and AI Output Validation rule directly shaped Section 9, Section 3, and Section 5.2 respectively.
- Downstream: FOLDER_STRUCTURE.md must organize code so that Server Actions and `/api/integration/v1/*` routes reflect the module boundaries used throughout this document. SECURITY.md must formalize credential issuance/rotation (Section 5.3), password hashing, and rate-limiting thresholds (Section 10) only referenced here at the policy level. TESTING.md should use the error code vocabulary in Section 9 directly.