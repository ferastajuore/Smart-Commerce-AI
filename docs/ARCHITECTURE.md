# ARCHITECTURE.md

## Smart Commerce AI — System Architecture (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md
**Read By:** DATABASE.md, API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md, DEPLOYMENT.md

---

## 1. Purpose

This document defines the technical system design that satisfies every functional and non-functional requirement in PRD.md without violating any principle in AGENTS.md. It answers **how** the platform is built, structured, and connected — not what it does (PRD.md) or why (PROJECT_BRIEF.md).

Every architectural decision in this document must be traceable to a requirement in PRD.md or a principle in AGENTS.md. Where a decision is not directly traceable, it is flagged as an explicit engineering judgment call rather than presented as inherited authority.

---

## 2. Architectural Goals

Derived directly from AGENTS.md Section 6 and Section 14, translated into system design goals:

| Goal                               | Architectural Consequence                                                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform as Single Source of Truth | All business state lives in one relational database owned by the platform. No external system (n8n, AI provider) holds authoritative state.                                                                        |
| AI Assists, Never Decides          | The AI communicates with the platform only through a constrained, read-mostly service boundary. It cannot call any write operation that mutates Inventory, Orders (beyond proposing one), or any protected entity. |
| n8n Is Temporary                   | All automation-layer communication passes through an internal **Integration Layer** with a stable contract. n8n is a client of this contract, not a dependency woven into core logic.                              |
| Human Approval Gate                | Order approval is a single, centrally enforced state transition in the application layer — never bypassable via any entry point, including direct AI-originated calls.                                             |
| Workspace/Store Isolation          | Every data access path is tenant-scoped by Workspace ID at the query layer, not merely at the UI layer.                                                                                                            |
| MVP Discipline                     | The architecture supports exactly the modules in PRD.md Section 6 — nothing is pre-built for deferred modules, though schema and service boundaries avoid decisions that would force a breaking rewrite later.     |

---

## 3. Architecture Style

Smart Commerce AI MVP uses a **modular monolith**, not microservices.

**Why a monolith for MVP:**

- The team is small (founder-driven, per AGENTS.md Section 16) — microservices introduce operational overhead (service discovery, distributed tracing, network failure handling) with no corresponding benefit at this scale.
- PRD.md's modules (Products, Inventory, Orders, Subscriptions, etc.) are tightly related and mostly transactional against the same tenant — splitting them into services would mean distributed transactions for what is fundamentally one workflow (Order approval → Inventory decrement → Audit Log).
- Next.js 15 with Server Actions (per the confirmed stack) is naturally suited to a monolith: one deployable unit, one database connection pool, one codebase to reason about.

**Why "modular" and not just "monolith":**

- AGENTS.md Section 14 (Extensibility Principle) requires that future modules — and eventually, the removal of n8n — not force a rewrite. This is achieved through **internal module boundaries** (clear service/interface separation between Products, Inventory, Orders, Subscriptions, Integration Layer, Admin) even though they all run in one process and share one database in MVP.
- Each module owns its own logic and only exposes a defined internal interface to other modules — no module reaches directly into another module's data access layer. This is the mechanism that makes a later extraction into a separate service (if ever needed) a boundary-respecting move, not an untangling exercise.

This decision may be revisited in ROADMAP.md once the platform passes the ~50-Store threshold referenced in AGENTS.md Section 13, which is the same threshold at which n8n is expected to be reconsidered.

---

## 4. High-Level System Diagram (Conceptual)

```
                         ┌─────────────────────────────┐
                         │        Facebook Messenger    │
                         └──────────────┬───────────────┘
                                        │ webhook events
                                        ▼
                         ┌─────────────────────────────┐
                         │     n8n (Automation Layer)   │
                         │  - relays messages            │
                         │  - calls AI provider          │
                         │  - calls platform Integration │
                         │    Layer only                 │
                         └──────────────┬───────────────┘
                                        │ defined contract (Integration Layer API)
                                        ▼
        ┌───────────────────────────────────────────────────────────┐
        │                Smart Commerce AI Platform                  │
        │                  (Next.js 15 Modular Monolith)              │
        │                                                               │
        │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
        │  │  Auth Module   │  │ Store Module  │  │ Subscription   │   │
        │  └───────────────┘  └───────────────┘  │    Module      │   │
        │                                          └───────────────┘   │
        │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
        │  │ Products       │  │ Inventory      │  │ Orders         │   │
        │  │ Module         │  │ Module         │  │ Module         │   │
        │  └───────────────┘  └───────────────┘  └───────────────┘   │
        │                                                               │
        │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
        │  │ Integration    │  │ Audit Log      │  │ Admin Module   │   │
        │  │ Layer          │  │ Module         │  │                │   │
        │  └───────────────┘  └───────────────┘  └───────────────┘   │
        │                                                               │
        └───────────────────────────┬───────────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  PostgreSQL (Prisma) │
                         │  Single DB, tenant-   │
                         │  scoped via Workspace │
                         │  ID on every table    │
                         └─────────────────────┘
```

This diagram is conceptual, not a deployment diagram (see DEPLOYMENT.md for infrastructure topology).

---

## 5. Module Boundaries

Each module below corresponds to a PRD.md module (Section 6) or a cross-cutting concern required to support them. Modules communicate through defined internal interfaces (service functions), never by directly querying another module's tables.

| Module                  | Owns                                                                              | Exposes To Other Modules                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Auth Module**         | User identity, sessions, credentials, role (Store Owner / Platform Administrator) | `getCurrentUser()`, `requireStoreOwner()`, `requireAdmin()`                                    |
| **Store Module**        | Workspace/Store entity, registration, profile, trial state                        | `getStoreById()`, `isStoreActive()`                                                            |
| **Subscription Module** | Plans, Store's current plan, AI conversation usage counters, billing state        | `getSubscriptionStatus()`, `canConsumeAiConversation()`, `recordAiConversationUsage()`         |
| **Products Module**     | Product catalog                                                                   | `getProduct()`, `listProducts()`, `isProductActive()`                                          |
| **Inventory Module**    | Stock quantities                                                                  | `getStockLevel()`, `decrementStock()` (callable only by Orders Module on approval)             |
| **Orders Module**       | Order lifecycle (Pending → Approved/Rejected)                                     | `createPendingOrder()`, `approveOrder()`, `rejectOrder()`, `getOrder()`                        |
| **Integration Layer**   | Contract exposed to n8n; translates external events into internal module calls    | `checkAvailability()`, `proposeOrder()` — nothing else is reachable from outside the platform  |
| **Audit Log Module**    | Write-once record of significant actions                                          | `recordAuditEntry()`, `getAuditLog()` — called by every other module on state-changing actions |
| **Admin Module**        | Platform-wide views, plan management, cross-Store operational visibility          | Admin-only, never called by Store-facing modules                                               |

**Rule enforced by this boundary design (traces to AGENTS.md Section 10):** the Integration Layer is the *only* module reachable by n8n. n8n never calls the Orders Module, Inventory Module, or database directly — it can only call `checkAvailability()` and `proposeOrder()`, both of which are read/propose operations, never write/approve operations. This is the concrete implementation of "AI never writes directly to the database" and "n8n is automation only."

---

## 6. The Integration Abstraction Layer (Detailed)

This section formalizes the requirement flagged in AGENTS.md Section 13.

### 6.1 Why It Exists

n8n is explicitly temporary (AGENTS.md Section 13; PRD.md N8N-1 through N8N-4). If core business modules called n8n-specific concepts directly, replacing n8n later would require touching Orders, Inventory, and Products logic — a rewrite, not a swap. The Integration Layer exists specifically to prevent that.

### 6.2 Contract Shape

The Integration Layer exposes exactly two capabilities to any external automation system (n8n today, something else later):

1. **`checkAvailability(storeId, productQuery)`** — a read-only lookup against Products/Inventory, scoped to the calling Store, returning availability and price information the AI needs to answer a customer.
2. **`proposeOrder(storeId, orderDraft)`** — creates an Order in **Pending** status via the Orders Module. This is a create-only operation; it never accepts an "approved" state as input, regardless of what the caller sends. Approval is only ever performed by an authenticated Store Owner action inside the platform (PRD.md ORD-4).

No other platform capability is reachable from outside the platform boundary. This is a deliberate, minimal surface — not because more isn't technically possible, but because every additional exposed capability is a potential violation of "AI never writes directly to the database" (AGENTS.md Section 10, Rule 2).

### 6.3 Replaceability

Because n8n only ever calls these two functions over a defined contract (implemented as authenticated internal API routes, see API.md), replacing n8n means pointing a different automation system at the same two endpoints. No change is required in Orders, Inventory, Products, or any core module. This satisfies the Extensibility Principle (AGENTS.md Section 14) directly for the one component known in advance to be replaced.

### 6.4 AI Output Validation at This Boundary

Per AGENTS.md Section 11 ("AI Output Validation") and PRD.md NFR-2, every payload arriving at `proposeOrder()` is treated as untrusted input regardless of source. The Integration Layer validates structure (via Zod schemas, per the confirmed stack) and re-verifies product existence and availability against the platform's own current state before creating the Pending Order — it never trusts availability data the AI or n8n claims to already know, even if that data originated from an earlier `checkAvailability()` call. This closes the gap between "what the AI believed was true" and "what is true right now," which matters because conversation and order confirmation are not atomic in time.

---

## 7. Tenant Isolation Architecture

Per AGENTS.md Section 10, Rule 5, and PRD.md NFR-1: every tenant-owned table includes a `workspaceId` column, and every data access path enforces scoping at the application/service layer — not merely trusted to be applied ad hoc in each query.

**Mechanism:**

- All Prisma queries against tenant-owned models are issued through module-level data-access functions that require a `workspaceId` parameter as a non-optional argument. There is no code path in the Products, Inventory, or Orders modules that queries without an explicit Workspace scope.
- The Auth Module resolves the current session's Workspace ID once, at the start of a request, and this value is threaded through to every module call in that request — it is never re-derived or trusted from client-supplied input (e.g., never taken from a request body or URL parameter alone without cross-checking against the authenticated session).
- The Admin Module is the sole exception, and it uses a separate, explicitly named data-access path (not the same functions Store-facing modules use) so that cross-tenant queries are visually and structurally distinct in the codebase — a reviewer or future agent should never be able to mistake an Admin query for a Store-scoped one.

**Consequence for CODING_STANDARDS.md:** any data-access function touching a tenant-owned model must be flagged in code review if it lacks a `workspaceId` parameter. This is called out here so CODING_STANDARDS.md and SECURITY.md can define the concrete linting/review mechanism later.

---

## 8. The Human Approval Gate (Detailed)

Per PRD.md ORD-4/ORD-5/ORD-6 and AGENTS.md Section 6, Order approval is architecturally treated as a **single controlled state transition**, implemented once in the Orders Module, and called from exactly one entry point: an authenticated Store Owner action.

**Design constraints:**

- `approveOrder()` and `rejectOrder()` are not reachable from the Integration Layer, from any AI-facing code path, or from any Admin action. Only a Store Owner session, scoped to the Order's own Workspace, can invoke them.
- Approval and the resulting Inventory decrement happen inside a single database transaction. Either both succeed (Order becomes Approved, Inventory decreases, Audit Log entry is written) or neither does. This prevents the specific failure mode of an Order showing Approved while stock was never actually decremented, or vice versa.
- No other code path in the system is permitted to decrement Inventory. `decrementStock()` in the Inventory Module is intentionally not exported for general use — it exists to be called only by the Orders Module's approval transaction. This is the architectural enforcement of PRD.md INV-3.

---

## 9. AI Conversation Metering Architecture

Per PRD.md SUB-2/SUB-4/SUB-5, AI Conversations are the only metered resource. This requires the Subscription Module to sit in the request path of every AI-facing interaction.

**Flow:**

1. Before the Integration Layer processes an inbound conversation event, it calls `canConsumeAiConversation(storeId)` on the Subscription Module.
2. If the Store is within its monthly allowance, the conversation proceeds and usage is recorded via `recordAiConversationUsage(storeId)`.
3. If the Store has exhausted its allowance, the Integration Layer returns a defined "limit reached" response rather than silently failing — this is surfaced to the Store Owner per PRD.md SUB-5, not just logged internally.

**Why this lives in the Subscription Module and not the Integration Layer itself:** usage counting is a billing concern, not an automation concern. Keeping it in the Subscription Module means the same enforcement applies regardless of which automation system calls in — consistent with the Integration Layer's replaceability goal (Section 6.3).

---

## 10. Audit Logging Architecture

Per AGENTS.md Section 10, Rule 6, and PRD.md AUD-1/AUD-2, Audit Log writes are not something each module remembers to do independently — that pattern invites the exact "hidden assumption" AGENTS.md Section 10 calls an implementation defect.

**Mechanism:**

- The Audit Log Module exposes a single `recordAuditEntry()` function accepting the standardized fields defined in AGENTS.md Section 10, Rule 6 (timestamp, actor, action, entity, entity ID, previous state, new state, optional reason).
- State-changing operations in other modules (Order approval/rejection, manual Inventory adjustment, Subscription changes, Settings changes, Messenger connection changes) call this function as part of the same transaction that performs the state change — not as a fire-and-forget side effect afterward. This guarantees the Audit Log cannot drift out of sync with actual state changes (e.g., an Order approved but not logged due to an unrelated failure after the fact).
- Audit Log entries are immutable once written — no module exposes an update or delete path for existing entries, consistent with an audit trail's purpose.

---

## 11. Data Flow: Core Workflow (Traced Through the Architecture)

This walks the PROJECT_BRIEF.md Section 10 workflow through the modules defined above, to make the architecture's coherence with the product requirement explicit:

1. Customer messages the Store's Facebook Page.
2. n8n receives the webhook, forwards the message to the AI provider.
3. AI determines it needs product availability and calls the Integration Layer's `checkAvailability()`.
4. Integration Layer calls the Products and Inventory Modules (tenant-scoped to the Store owning the connected Page) and returns availability.
5. AI relays availability to the customer via n8n/Messenger.
6. Customer confirms purchase intent.
7. n8n calls the Integration Layer's `proposeOrder()`.
8. Integration Layer validates the payload (Section 6.4), calls the Subscription Module to confirm AI conversation allowance was already accounted for, then calls the Orders Module's `createPendingOrder()`.
9. Orders Module creates the Order (status: Pending) and writes an Audit Log entry.
10. Store Owner sees the Pending Order in their dashboard and calls `approveOrder()` or `rejectOrder()`.
11. If approved: Orders Module, in one transaction, updates Order status, calls Inventory Module's `decrementStock()`, and writes an Audit Log entry (Section 8).
12. If rejected: Orders Module updates Order status and writes an Audit Log entry; Inventory is untouched.

Every step above maps to a module boundary defined in Section 5 — there is no step where n8n or the AI reaches past the Integration Layer into internal modules.

---

## 12. Technology Stack Mapping

Restating the confirmed stack from PROJECT_BRIEF.md Section 16, mapped to architectural role:

| Layer                       | Technology             | Architectural Role                                                                                                                     |
| --------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| UI + Application Layer      | Next.js 15, TypeScript | Renders `/stores/*` and `/admin/*`, hosts Server Actions that implement module logic                                                   |
| Business Logic Execution    | Next.js Server Actions | Where module functions (createPendingOrder, approveOrder, etc.) execute — server-side only, never exposed as client-trusted logic      |
| Data Access                 | Prisma ORM             | Single typed data-access layer; tenant scoping (Section 7) is enforced in the functions that wrap Prisma calls, not in Prisma itself   |
| Data Storage                | PostgreSQL             | Single relational database; source of truth per the Platform-as-Single-Source-of-Truth principle                                       |
| Automation/External Trigger | n8n                    | External client of the Integration Layer only (Section 6)                                                                              |
| Auth                        | NextAuth               | Session and credential management for both Store Owner and Platform Administrator, with role-distinct session handling (PRD.md AUTH-4) |
| Validation                  | Zod, React Hook Form   | Input validation at both UI and Integration Layer boundaries (Section 6.4) — especially critical for AI-originated payloads            |
| Hosting                     | VPS                    | See DEPLOYMENT.md for topology; architecture here assumes a single-region deployment appropriate to MVP scale                          |

No component of this stack is treated as a permanent architectural commitment beyond n8n's explicitly temporary status — but only n8n has a documented replacement trigger (the ~50-Store threshold). Other components are assumed stable for MVP and are revisited only through deliberate future decisions, per AGENTS.md Section 4.

---

## 13. Cross-Cutting Concerns Deferred to Other Documents

To avoid duplicating content that belongs elsewhere in the dependency chain (AGENTS.md Section 3):

| Concern                                                                                 | Addressed In                                                            |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Table-level schema, relationships, field types                                          | DATABASE.md                                                             |
| Concrete API routes, request/response contracts                                         | API.md                                                                  |
| Codebase folder/module file organization                                                | FOLDER_STRUCTURE.md                                                     |
| Naming conventions, code style                                                          | CODING_STANDARDS.md (must apply AGENTS.md Section 11 Naming Principles) |
| Authentication implementation detail, authorization enforcement mechanics, threat model | SECURITY.md                                                             |
| Infrastructure topology, environments, CI/CD                                            | DEPLOYMENT.md                                                           |
| Test strategy per module                                                                | TESTING.md                                                              |

This document defines the shape of the system; it deliberately stops short of implementation-level specification that belongs to the documents above.

---

## 14. Extensibility: How This Architecture Accommodates Future Modules

Per AGENTS.md Section 14, without implementing any of the following, this architecture's module-boundary design accommodates them as follows:

| Future Module                                   | Why the Current Architecture Doesn't Block It                                                                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multi-user Workspaces                           | Auth Module already separates "user" from "role" conceptually; introducing a Store-scoped role join table does not require restructuring the Store or Order modules.                                                |
| Customers CRM                                   | Order already carries customer data (PRD.md ORD-3); a future Customers Module can be introduced as a new module that Orders references, without changing how Orders are created or approved.                        |
| Reports & Analytics                             | Dashboard's simple counters (Section 9, PRD.md DASH-1/2) are read queries against existing modules; a future Reports Module can be added as a new read-only consumer of the same data without touching write paths. |
| Additional Channels (WhatsApp, Instagram, etc.) | The Integration Layer's contract (`checkAvailability`, `proposeOrder`) is channel-agnostic already — a new channel is a new external caller of the same two functions, not a new code path in core modules.         |
| n8n Replacement                                 | Covered in full in Section 6.3.                                                                                                                                                                                     |

This section exists specifically so ARCHITECTURE.md itself demonstrates compliance with the "don't block the door, but don't build the room" standard set in AGENTS.md Section 14, rather than leaving that claim unverified.

---

## 15. Architectural Risks and Mitigations

| Risk                                                                                                                                                                | Mitigation                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modular monolith boundaries erode over time as modules are added under time pressure                                                                                | Module boundary rules (Section 5) should be enforced via code review discipline now, and can be formalized further in CODING_STANDARDS.md (e.g., import restrictions between module folders).                                                          |
| A future engineer bypasses the Integration Layer and calls Orders/Inventory directly from automation code "just this once"                                          | The architectural rule that only the Integration Layer is reachable externally must be treated as a hard boundary, not a convention — SECURITY.md should define how this is enforced at the network/route level, not just the code-organization level. |
| Tenant scoping is forgotten on a new query as the schema grows                                                                                                      | Section 7's requirement that data-access functions take `workspaceId` as a non-optional parameter is a structural safeguard, not just a guideline; CODING_STANDARDS.md should define lint/review enforcement.                                          |
| The single-transaction approval guarantee (Section 8) is weakened by future performance optimization (e.g., moving Inventory decrement to an async job "for speed") | Any future proposal to make Order approval and Inventory decrement non-atomic must be treated as a violation of AGENTS.md Section 6 and requires an explicit, documented decision — not a silent optimization.                                         |

---

## 16. Cross References

- **PROJECT_BRIEF.md** — origin of the Core Workflow (Section 10) traced in Section 11 of this document.
- **AGENTS.md** — origin of every non-negotiable principle this architecture is designed to enforce structurally, not just describe (Sections 6, 10, 13, 14).
- **PRD.md** — origin of every functional and non-functional requirement this architecture satisfies; Section 5–11 of this document map directly to PRD.md Section 7–8.
- Downstream: DATABASE.md must model entities consistent with the module boundaries in Section 5 (one set of tables per module's ownership, tenant-scoped per Section 7). API.md must expose the Integration Layer contract defined in Section 6 as concrete routes. SECURITY.md must formalize the enforcement mechanisms flagged as risks in Section 15.
