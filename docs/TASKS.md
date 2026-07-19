# TASKS.md

## Smart Commerce AI — MVP Execution Plan

**Version:** 1.0.0
**Status:** M1 Complete, M2 Complete, M3 Complete, M4 Complete
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DB.md, API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md, DEPLOYMENT.md, TESTING.md
**Read By:** ROADMAP.md

---

## 1. Purpose

This document breaks the MVP defined across the preceding documents into an ordered sequence of executable milestones. It answers **what gets built, in what order, and how each unit of work is known to be done** — not what the product does (PRD.md), how it's designed (ARCHITECTURE.md), or how it's tested in general (TESTING.md).

Every task in this document maps to a requirement or mechanism already established in a prior document. This document introduces no new features, architecture, or scope — it sequences existing decisions into buildable work. Where a task references a PRD.md requirement ID, a DB.md entity, an API.md action, or a TESTING.md test category, that reference is the traceability link back to the source of truth, per AGENTS.md Section 11's requirement that every rule be documented and traceable.

---

## 2. How to Read This Document

Each milestone follows the same structure:

- **Purpose** — why this milestone exists and what it unblocks.
- **Implementation Tasks** — a checklist of concrete work items.
- **Dependencies** — which prior milestones must be complete first.
- **Completion Criteria** — the observable conditions that must be true before the milestone is considered done, including the relevant TESTING.md coverage.

Milestones are ordered to respect real build dependencies (e.g., the database must exist before any module can persist data; Authentication must exist before tenant isolation can be enforced). Within a milestone, tasks are listed roughly in build order but are not strictly sequential unless a dependency is noted.

**MVP Discipline applies to this document as much as any other:** no task below implements a deferred module (AGENTS.md §9) — Customers CRM, Reports & Analytics, Team Members, additional channels, product images, mobile apps, or AI analytics. If a task appears to require one of these, it is a signal the task is out of scope, not a reason to add a "small" version of it.

---

## Milestone 1: Project Setup & Foundation

**Purpose:** Establish the codebase skeleton exactly as FOLDER_STRUCTURE.md and CODING_STANDARDS.md define it, so every subsequent milestone has a correct place to put its code from day one.

**Implementation Tasks:**

- [x] Initialize the Next.js 15 project with the App Router (ARCHITECTURE.md §12, FOLDER_STRUCTURE.md §3)
- [x] Configure TypeScript in strict mode (CODING_STANDARDS.md)
- [x] Create the top-level `src/app/`, `src/modules/`, `src/shared/`, `src/lib/`, `src/types/` structure (FOLDER_STRUCTURE.md §3)
- [x] Create the empty per-module folder skeleton (`data/`, `services/`, `actions/`, `types.ts`) for every module named in ARCHITECTURE.md Section 5 (FOLDER_STRUCTURE.md §5)
- [x] Set up Tailwind CSS and HeroUI (PROJECT_BRIEF.md §16)
- [x] Configure ESLint, including the `no-restricted-imports` module-boundary rule (FOLDER_STRUCTURE.md §7, CODING_STANDARDS.md §3)
- [x] Configure Prettier/format checking (CODING_STANDARDS.md §11)
- [x] Set up `lib/prisma.ts`, `lib/auth.ts` (empty NextAuth config placeholder), `lib/env.ts` for environment variable validation (FOLDER_STRUCTURE.md §6)
- [x] Create `.env.example` documenting required variable names only, no values (FOLDER_STRUCTURE.md §8, SECURITY.md §10)
- [x] Initialize the Git repository and connect it to CI (DEPLOYMENT.md §6)
- [x] Configure the CI pipeline to run type-check, lint, and format as blocking gates (DEPLOYMENT.md §6)
- [x] Set up the local development database (PostgreSQL, per DEPLOYMENT.md §3)

**Dependencies:** None — this is the starting milestone.

**Completion Criteria:**

- The project builds and runs locally with no business logic implemented.
- CI runs and blocks on type-check, lint, and format failures (DEPLOYMENT.md §6).
- The folder structure matches FOLDER_STRUCTURE.md Section 3 and Section 5 exactly, including empty module folders.
- A test file placed in each module's designated folder is discoverable by the test runner (unblocks TESTING.md Section 4 work in later milestones).

---

## Milestone 2: Database Implementation

**Purpose:** Implement the schema defined in DB.md exactly, establishing the single source of truth every module will read from and write to.

**Implementation Tasks:**

- [x] Write `prisma/schema.prisma` implementing every entity in DB.md Section 4: `User`, `Workspace`, `SubscriptionPlan`, `Subscription`, `MessengerConnection`, `Product`, `Inventory`, `Order`, `OrderItem`, `AuditLog`
- [x] Implement every enumeration exactly as DB.md Section 7 defines it (`UserRole`, `WorkspaceStatus`, `SubscriptionPlanName`, `SubscriptionStatus`, `MessengerConnectionStatus`, `ProductStatus`, `OrderStatus`)
- [x] Implement all relationships per DB.md Section 5
- [x] Implement indexing per DB.md Section 6, including the `workspaceId` unique/lookup indexes on `Subscription` and `MessengerConnection`
- [x] Implement database-level integrity constraints named in DB.md Section 9 (e.g., `Inventory.quantity >= 0` CHECK constraint, `OrderItem.productId` Restrict-on-delete foreign key)
- [x] Generate and commit the initial Prisma migration (DEPLOYMENT.md §7.2)
- [x] Write a seed script for local/test data (at minimum: one Workspace, one Store Owner, one Product with Inventory) — used by integration tests (TESTING.md §5) and local development
- [x] Verify no business logic is expressed in the schema (no triggers, stored procedures, or computed columns encoding a decision), per CODING_STANDARDS.md Section 5 and DB.md Section 9

**Dependencies:** Milestone 1 (project skeleton, Prisma configured).

**Completion Criteria:**

- `prisma migrate deploy` runs cleanly against a fresh database.
- Every entity, relationship, enum, and constraint in DB.md is present and matches the document exactly — reviewed field-by-field against DB.md Section 4.
- The seed script produces data usable by later milestones' integration tests.
- No schema element encodes business logic (verified against DB.md §9's integrity-vs-logic table).

---

## Milestone 3: Authentication & Authorization

**Purpose:** Implement the Auth Module (ARCHITECTURE.md §5) so that every subsequent milestone has a working, correctly role-separated session system to build on.

**Implementation Tasks:**

- [x] Configure NextAuth with credential-based (email/password) authentication (PRD.md AUTH-1, ARCHITECTURE.md §12)
- [x] Implement password hashing per SECURITY.md Section 4.1 (bcrypt or argon2, work factor fixed once in `lib/auth.ts`)
- [x] Implement `modules/auth/services/getCurrentUser()`, `requireStoreOwner()`, `requireAdmin()` (ARCHITECTURE.md §5)
- [x] Implement session encoding of exactly one `role` and, for `STORE_OWNER`, the associated `workspaceId` (SECURITY.md §4.2)
- [x] Implement session re-verification against the database on sensitive actions rather than trusting the token indefinitely (SECURITY.md §4.2)
- [x] Implement `app/stores/layout.tsx` enforcing `STORE_OWNER` session (PRD.md AUTH-3/AUTH-4, FOLDER_STRUCTURE.md §4)
- [x] Implement `app/admin/layout.tsx` enforcing `PLATFORM_ADMIN` session (PRD.md AUTH-3/AUTH-4, FOLDER_STRUCTURE.md §4)
- [x] Implement `login`, `logout` Server Actions (API.md §9)
- [x] Implement `requestPasswordReset`, `resetPassword` Server Actions (PRD.md AUTH-5)
- [x] Implement rate limiting on `login` and `requestPasswordReset` (SECURITY.md §9)
- [x] Implement Platform Administrator provisioning via a controlled seed script, not a public endpoint (SECURITY.md §4.5, API.md §9)
- [x] Define session expiry and inactivity timeout (finite in all cases per SECURITY.md §4.2)

**Dependencies:** Milestone 2 (User table exists).

**Completion Criteria:**

- A `STORE_OWNER` session cannot render anything under `/admin/*`, and a `PLATFORM_ADMIN` session cannot render anything under `/stores/*` — verified by TESTING.md Section 8's test cases.
- Passwords are never stored in plaintext or reversibly encrypted (verified by inspection and test).
- All TESTING.md Section 8 (Authentication and Session Security Tests) test cases pass.
- No Administrator account can be created through a public-facing flow.

---

## Milestone 4: Workspace and Tenant Isolation

**Purpose:** Implement the Store Module and the tenant-scoping mechanism that every other tenant-owned module depends on, per ARCHITECTURE.md Section 7 — the platform's most safety-critical structural guarantee.

**Implementation Tasks:**

- [x] Implement the `Workspace` entity's service layer: `getStoreById()`, `isStoreActive()` (ARCHITECTURE.md §5)
- [x] Implement the convention that every tenant-scoped data-access function takes `workspaceId` as a mandatory, non-optional, session-derived first parameter (ARCHITECTURE.md §7, CODING_STANDARDS.md §4)
- [x] Implement the Auth Module's single-resolution-per-request pattern for `workspaceId`, threaded through to all module calls rather than re-derived from client input (ARCHITECTURE.md §7)
- [x] Implement `NOT_FOUND` (not `FORBIDDEN`) responses for any cross-tenant access attempt by ID (API.md §10, SECURITY.md §5.2)
- [x] Configure the ESLint rule (or documented review checklist item) flagging any tenant-owned data-access function missing a `workspaceId` parameter (ARCHITECTURE.md §7, FOLDER_STRUCTURE.md §7)
- [x] Set up the explicitly separate `modules/admin/data/` path as the sole exception to standard tenant scoping (ARCHITECTURE.md §7, SECURITY.md §5.3)

**Dependencies:** Milestone 2 (Workspace table), Milestone 3 (session provides `role`/`workspaceId`).

**Completion Criteria:**

- [x] All TESTING.md Section 9 (Workspace and Tenant Isolation Tests) test cases pass for every tenant-owned entity that exists at this point in the build. (Unit tests pass; integration tests require DATABASE_URL for PostgreSQL)
- [x] A cross-tenant access attempt returns `NOT_FOUND`, verified by test, not just by code inspection.
- [x] No tenant-scoped function in the codebase omits `workspaceId` as a parameter.

---

## Milestone 5: Store Management

**Purpose:** Implement Store Registration and Store Profile/Settings, giving a Store Owner a functioning account and Workspace to operate within.

**Implementation Tasks:**

- [ ] Implement `registerStore` Server Action: creates `User` (role `STORE_OWNER`) and `Workspace` in one transaction (API.md §9, PRD.md REG-1)
- [ ] Implement phone verification (`verifyPhone`) gating trial activation (PRD.md REG-2)
- [ ] Implement the one-trial-ever business rule (PRD.md REG-5, AGENTS.md §10 Rule 11)
- [ ] Implement automatic 14-day trial assignment on successful registration and verification (PRD.md REG-4)
- [ ] Implement `updateStoreProfile` Server Action (PRD.md SET-1)
- [ ] Implement Store Registration requiring a connected Facebook Page before serving customers (PRD.md REG-3) — connection mechanics implemented in Milestone 9, gated here at the business-rule level
- [ ] Implement the `RESTRICTED` Workspace status behavior: read access to data preserved, automation disabled, no data loss (PRD.md SUB-7)

**Dependencies:** Milestone 3 (Auth), Milestone 4 (tenant isolation).

**Completion Criteria:**

- A new Store Owner can register, verify their phone, and receive an active 14-day trial.
- A second registration attempt tied to the same Store cannot receive a second trial.
- `registerStore` integration test from TESTING.md Section 5 passes.
- Store profile updates are correctly scoped to the authenticated Workspace.

---

## Milestone 6: Product Management

**Purpose:** Implement the Products Module — the foundation both Inventory and Orders depend on.

**Implementation Tasks:**

- [ ] Implement `Product` data-access layer scoped by `workspaceId` (DB.md §4.6)
- [ ] Implement `modules/products/services/`: `getProduct()`, `listProducts()`, `isProductActive()` (ARCHITECTURE.md §5)
- [ ] Implement `createProduct`, `updateProduct`, `deactivateProduct`, `deleteProduct` Server Actions (API.md §7, PRD.md PROD-1 through PROD-5)
- [ ] Implement the minimum Product fields: name, price, status (PRD.md PROD-2)
- [ ] Implement the `deleteProduct` guard preventing deletion while referenced by a non-terminal Order (PRD.md PROD-4), backed by the database's Restrict-on-delete constraint (DB.md §4.9) as defense-in-depth
- [ ] Confirm no Product usage limit exists tied to subscription plan anywhere in this module (PRD.md PROD-5, AGENTS.md §10 Rule 9)
- [ ] Build the `/stores/products` UI (list, create, edit, deactivate/delete)

**Dependencies:** Milestone 4 (tenant isolation), Milestone 5 (a Workspace must exist to own Products).

**Completion Criteria:**

- A Store Owner can create, edit, deactivate, and delete Products scoped to their own Workspace only.
- Attempting to delete a Product referenced by a non-terminal Order fails with `CONFLICT`, verified by test.
- Product creation is never blocked by subscription plan, verified by test across all three plans.

---

## Milestone 7: Inventory Management

**Purpose:** Implement the Inventory Module, the mechanism that gives the AI accurate stock information and enforces the platform's core no-overselling guarantee.

**Implementation Tasks:**

- [ ] Implement `Inventory` data-access layer scoped by `workspaceId`, linked one-to-one (or as DB.md §4.7 defines) to `Product` (DB.md §4.7)
- [ ] Implement `modules/inventory/services/`: `getStockLevel()` (exported, general use) and `decrementStock()` (exported, but callable only by `orders/services/approveOrder()` — ARCHITECTURE.md §5)
- [ ] Implement `adjustStockManually` Server Action, writing an `INVENTORY_ADJUSTED` Audit Log entry (API.md §7, PRD.md INV-5)
- [ ] Implement the read-only `getStockLevel()` path used by the Integration Layer for `checkAvailability()` (PRD.md INV-2)
- [ ] Confirm `decrementStock()` is not imported anywhere outside `modules/orders/services/` — enforced via the import-boundary lint rule (FOLDER_STRUCTURE.md §5.1)
- [ ] Confirm no Inventory quantity limit exists tied to subscription plan (PRD.md INV-4)
- [ ] Build the `/stores/inventory` UI (view stock, manual adjustment)

**Dependencies:** Milestone 6 (Products must exist for Inventory to attach to).

**Completion Criteria:**

- Inventory quantity can only be decremented through `approveOrder()` — verified by an import-boundary test and a runtime test attempting to call `decrementStock()` from an unauthorized path.
- Manual stock adjustment writes a correct `AuditLog` entry, verified by test.
- `Inventory.quantity` never goes negative, verified against the DB.md §9 CHECK constraint and an application-layer test.

---

## Milestone 8: Order Management

**Purpose:** Implement the Orders Module's core lifecycle — creation, listing, and retrieval — as the foundation the Human Approval Gate (Milestone 11) builds its approval/rejection transition on top of.

**Implementation Tasks:**

- [ ] Implement `Order` and `OrderItem` data-access layer scoped by `workspaceId` (DB.md §4.8, §4.9)
- [ ] Implement `modules/orders/services/`: `createPendingOrder()`, `getOrder()` (ARCHITECTURE.md §5)
- [ ] Implement `createPendingOrder()` always producing `PENDING` status regardless of caller input (ARCHITECTURE.md §6.2, PRD.md ORD-2)
- [ ] Implement customer data capture on the Order itself (name, phone/Messenger identifier) — no separate Customer entity (PRD.md ORD-3, DB.md §8)
- [ ] Implement server-side re-derivation of `unitPriceAtOrder` from the Product's current price, never from caller input (API.md §6.2 Step 3)
- [ ] Implement `listOrders`, `getOrder` Server Actions, scoped to the authenticated Workspace (API.md §7, PRD.md ORD-7)
- [ ] Confirm no Order-count limit exists tied to subscription plan (PRD.md ORD-8)
- [ ] Build the `/stores/orders` UI (list, detail view) — approve/reject actions built in Milestone 11

**Dependencies:** Milestone 6 (Products), Milestone 7 (Inventory), Milestone 4 (tenant isolation).

**Completion Criteria:**

- `createPendingOrder()` always results in a `PENDING` Order with server-derived pricing, verified by test.
- Orders are visible only within their owning Workspace, verified by TESTING.md Section 9's isolation tests.
- Order creation is never blocked by subscription plan.

---

## Milestone 9: Integration Layer / Messenger

**Purpose:** Implement the Integration Layer (ARCHITECTURE.md §6) and Messenger connection management — the platform's only externally reachable HTTP surface and the channel through which the Core Workflow (PROJECT_BRIEF.md §10) begins.

**Implementation Tasks:**

- [ ] Implement `MessengerConnection` data-access layer scoped by `workspaceId` (DB.md §4.5)
- [ ] Implement `connectMessengerPage`, `disconnectMessengerPage` Server Actions, non-destructive to existing Store data (PRD.md MSG-3, API.md §7)
- [ ] Implement Messenger connection health detection and display (connected/disconnected/error) (PRD.md MSG-2)
- [ ] Implement encrypted-at-rest storage of `pageAccessTokenEncrypted` using a symmetric key held outside application code (SECURITY.md §4.1)
- [ ] Implement `POST /api/integration/v1/availability` per API.md Section 6.1, including the `canConsumeAiConversation()` pre-check (ARCHITECTURE.md §9)
- [ ] Implement `POST /api/integration/v1/orders` per API.md Section 6.2, including all five validation/integrity behaviors listed there (re-verify product existence/Workspace ownership/active status, re-check stock, re-derive price, single transaction, no "approved" input path)
- [ ] Implement Integration Layer credential issuance, hashed storage, and rotation (SECURITY.md §6)
- [ ] Implement per-credential rate limiting on `/api/integration/v1/*` (SECURITY.md §9, API.md §11)
- [ ] Implement Facebook webhook signature verification before any processing (SECURITY.md §7)
- [ ] Implement Zod validation schemas for every Integration Layer request under `modules/integration/validation/` (CODING_STANDARDS.md §7)
- [ ] Implement N8N-3's degraded-service visibility: a failed/delayed automation-layer interaction is surfaced to the Store Owner, never silently swallowed (PRD.md N8N-3)
- [ ] Confirm the Integration Layer exposes exactly `checkAvailability()` and `proposeOrder()` and nothing else (ARCHITECTURE.md §6.2)

**Dependencies:** Milestone 5 (Store/Workspace), Milestone 6 (Products), Milestone 7 (Inventory), Milestone 8 (Orders — create-only path).

**Completion Criteria:**

- All TESTING.md Section 6 (API and Integration Layer Testing) test cases pass.
- No code path from `/api/integration/v1/*` reaches `approveOrder()`, `rejectOrder()`, or any Inventory-writing function other than through `createPendingOrder()`.
- A compromised or leaked credential's blast radius is provably limited to one Workspace's `checkAvailability`/create-only `proposeOrder` capability, verified by test.

---

## Milestone 10: AI Workflow Validation

**Purpose:** Verify and harden the boundary between AI/automation-originated content and platform business logic, per AGENTS.md's AI Output Validation rule and ARCHITECTURE.md Section 6.4 — treated as its own milestone because it is a cross-cutting correctness concern layered on top of Milestone 9's plumbing, not a new module.

**Implementation Tasks:**

- [ ] Implement and test the stale-availability-data scenario: a `checkAvailability()` result is never trusted as still-true at `proposeOrder()` time (API.md §6.4)
- [ ] Implement and test adversarial payload handling: extreme quantities, mismatched price intent, malformed customer data (SECURITY.md §8)
- [ ] Confirm every price and stock figure used in Order creation is re-derived from the platform's own current data, never accepted as a caller-supplied value (SECURITY.md §8)
- [ ] Confirm all AI-relayed text fields (Product names, Order notes, customer name/phone) are treated as data only — never interpolated into raw SQL, never rendered unescaped in any UI context (SECURITY.md §8)
- [ ] Document, in code comments per CODING_STANDARDS.md Section 9, the specific PRD.md/ARCHITECTURE.md requirement each validation rule in `modules/integration/validation/` implements

**Dependencies:** Milestone 9 (Integration Layer must exist to validate).

**Completion Criteria:**

- All TESTING.md Section 11 (Integration Layer and AI Output Validation Tests) test cases pass.
- No test payload, however adversarial, can cause a price, quantity, or approval state to be accepted from the caller rather than the platform's own current data.

---

## Milestone 11: Human Approval Gate

**Purpose:** Implement `approveOrder()` and `rejectOrder()` as the single, centrally enforced state transition described in ARCHITECTURE.md Section 8 — the platform's central trust mechanism per PROJECT_BRIEF.md Section 20.

**Implementation Tasks:**

- [ ] Implement `approveOrder()` in `modules/orders/services/`, reachable only from an authenticated Store Owner action scoped to the Order's own Workspace (ARCHITECTURE.md §8)
- [ ] Implement `rejectOrder()` with the same reachability constraint
- [ ] Implement the single-transaction guarantee: Order status update, `decrementStock()` call, and `AuditLog` write succeed or fail together (ARCHITECTURE.md §8)
- [ ] Implement `rejectOrder()`'s no-side-effect guarantee: Order status changes, Inventory is provably untouched (PRD.md ORD-6)
- [ ] Implement `CONFLICT` handling for approving/rejecting an Order not in `PENDING` status
- [ ] Implement concurrent-approval handling so two simultaneous approval attempts on the same Order cannot both succeed
- [ ] Build the `/stores/orders` approve/reject UI actions (completing Milestone 8's UI)
- [ ] Confirm `approveOrder()`/`rejectOrder()` are not importable from `modules/integration/`, any AI-facing code path, or `modules/admin/` (ARCHITECTURE.md §8, verified via FOLDER_STRUCTURE.md §7's lint rule)

**Dependencies:** Milestone 8 (Orders exist in `PENDING` state), Milestone 7 (Inventory to decrement), Milestone 3 (Store Owner authentication).

**Completion Criteria:**

- All TESTING.md Section 10 (Human Approval Gate Tests) test cases pass, including the simulated mid-transaction failure and concurrent-approval cases.
- No Order can ever reach `APPROVED` status without inventory being decremented in the same transaction, verified by test.
- No code path outside an authenticated Store Owner action can invoke `approveOrder()` or `rejectOrder()`, verified by both a lint check and a runtime test.

---

## Milestone 12: Subscription Module

**Purpose:** Implement plan management, trial state, and AI conversation metering — the platform's only metered resource (AGENTS.md §12).

**Implementation Tasks:**

- [ ] Implement `SubscriptionPlan` and `Subscription` data-access layers (DB.md §4.3, §4.4)
- [ ] Seed the three MVP plans: Starter ($15/mo), Business ($35/mo), Pro ($85/mo) with their AI conversation allowances (AGENTS.md §12, PRD.md SUB-1)
- [ ] Implement `modules/subscription/services/`: `getSubscriptionStatus()`, `canConsumeAiConversation()`, `recordAiConversationUsage()` (ARCHITECTURE.md §5)
- [ ] Implement `changePlan` Server Action (PRD.md SUB-1, API.md §7)
- [ ] Implement usage-limit notification when a Store approaches/reaches its monthly AI conversation allowance (PRD.md SUB-5)
- [ ] Implement trial-to-`RESTRICTED` transition on expiry without conversion (PRD.md SUB-7, DB.md `WorkspaceStatus`)
- [ ] Confirm Products, Inventory, and Orders are never plan-limited anywhere in this module or any module that reads from it (PRD.md SUB-3, AGENTS.md §10 Rule 9)
- [ ] Build the `/stores/subscription` UI (current plan, usage against limit, trial/billing status)

**Dependencies:** Milestone 5 (Workspace/trial exists), Milestone 9 (metering hooks into `checkAvailability`/`proposeOrder`).

**Completion Criteria:**

- `canConsumeAiConversation()` correctly blocks Integration Layer requests once a Workspace's monthly allowance is exhausted, returning `AI_CONVERSATION_LIMIT_REACHED` (verified against TESTING.md §6).
- A Store Owner can see their current plan, usage, and trial/billing status at all times.
- Trial expiration results in `RESTRICTED` status with data preserved, never data loss, verified by test.

---

## Milestone 13: Admin Module

**Purpose:** Implement the Platform Administrator's tools to run the platform as a business, fully separated from Store-level operational data per PRD.md ADM-5 — the platform's second-most safety-critical isolation boundary after Milestone 4.

**Implementation Tasks:**

- [ ] Implement the explicitly separate `modules/admin/data/` cross-tenant query path (ARCHITECTURE.md §7, SECURITY.md §5.3)
- [ ] Implement `listStores`, `getStoreSummary` (PRD.md ADM-1) — Workspace-level metadata only, never Product/Inventory/Order contents
- [ ] Implement `getPlatformStatistics` (PRD.md ADM-2): total Stores, active trials, active subscriptions by plan, conversion rate
- [ ] Implement `createSubscriptionPlan`, `updateSubscriptionPlan`, `deactivateSubscriptionPlan` (PRD.md ADM-3)
- [ ] Implement `updatePlatformSettings` (PRD.md ADM-4)
- [ ] Implement cross-Workspace `getAuditLog()` using the Admin data-access path, structurally distinct from the Store-facing `getAuditLog()` (PRD.md AUD-4, SECURITY.md §5.3)
- [ ] Implement logging of Administrator access to cross-Workspace Audit Logs as itself a security-relevant event (SECURITY.md §11)
- [ ] Build the `/admin/*` UI: Stores list, Statistics, Plans, Settings
- [ ] Add the required review-attention flag on any pull request touching `modules/admin/data/` to CONTRIBUTING/PR-template guidance (SECURITY.md §5.3)

**Dependencies:** Milestone 3 (Admin auth), Milestone 4 (isolation pattern to deliberately except from), Milestone 12 (Subscription Plans to manage).

**Completion Criteria:**

- All TESTING.md Section 9's Admin-boundary test cases pass: no Admin action reads or writes a specific Workspace's Products, Inventory, or Orders.
- Platform statistics and Store list render correctly across multiple seeded Workspaces.
- Administrator access to cross-Workspace Audit Logs itself produces a logged event.

---

## Milestone 14: Security Implementation

**Purpose:** Close out the concrete security mechanisms named throughout SECURITY.md that are not already fully implemented as a side effect of Milestones 3–13, and verify the platform against the Security Review Checklist as a whole.

**Implementation Tasks:**

- [ ] Implement HTTPS-only enforcement and HTTP-to-HTTPS redirection at the reverse proxy (SECURITY.md §7, DEPLOYMENT.md §5)
- [ ] Implement rate limiting across all surfaces named in SECURITY.md Section 9 (`/api/integration/v1/*`, `login`, `requestPasswordReset`, `verifyPhone`, `registerStore`)
- [ ] Implement secrets management per SECURITY.md Section 10 / DEPLOYMENT.md Section 9 (no secret in version control, restricted-permission environment file in production)
- [ ] Implement Audit Log capture of security-relevant authentication events beyond standard business actions (failed logins beyond a threshold, password resets, Administrator provisioning, credential rotation) (SECURITY.md §11)
- [ ] Verify parameterized queries are used exclusively — no raw SQL string interpolation of user/AI-supplied fields (SECURITY.md §8)
- [ ] Verify all user-facing rendering of Product names, Order notes, and customer data is properly escaped (SECURITY.md §8, XSS prevention)
- [ ] Run the full Security Review Checklist (SECURITY.md §13) against the completed codebase and resolve every open item
- [ ] Document any deferred security item (e.g., Postgres Row-Level Security, formal incident response process) explicitly as a gap per SECURITY.md Sections 5.2 and 14

**Dependencies:** Milestones 3–13 (this milestone verifies and hardens what they built; it does not build new business features).

**Completion Criteria:**

- Every item on the SECURITY.md Section 13 checklist is resolved or explicitly deferred with documentation.
- All TESTING.md Sections 8, 9, 10, and 11 (security-relevant test categories) pass in full.
- No secret value exists anywhere in the repository history.

---

## Milestone 15: Deployment Setup

**Purpose:** Stand up the production environment per DEPLOYMENT.md and confirm the platform can be released, monitored, and recovered.

**Implementation Tasks:**

- [ ] Provision the production VPS per DEPLOYMENT.md Section 4's topology
- [ ] Configure the reverse proxy with automated TLS certificate issuance/renewal (DEPLOYMENT.md §5)
- [ ] Configure VPS firewall rules (default-deny inbound, explicit allow for HTTPS and administrative SSH) (DEPLOYMENT.md §5)
- [ ] Configure key-based-only SSH access (DEPLOYMENT.md §5)
- [ ] Set up the production PostgreSQL instance, not publicly exposed (DEPLOYMENT.md §4, SECURITY.md §7)
- [ ] Set up n8n (co-located or separate host per DEPLOYMENT.md §4), configured to call only `/api/integration/v1/*`
- [ ] Implement the full release process: CI gates → clean build → `prisma migrate deploy` → health check → traffic cutover (DEPLOYMENT.md §7.1)
- [ ] Implement rollback capability for both application builds and (where safe) migrations (DEPLOYMENT.md §7.3)
- [ ] Configure automated, off-host database backups on at least a daily schedule (DEPLOYMENT.md §8)
- [ ] Perform and document at least one test backup restoration (DEPLOYMENT.md §8)
- [ ] Configure production secrets injection per DEPLOYMENT.md Section 9
- [ ] Configure centralized error logging and basic infrastructure health monitoring/alerting (DEPLOYMENT.md §10)
- [ ] Perform the first production deployment and verify the Core Workflow (PROJECT_BRIEF.md §10) end-to-end against a real (test) Facebook Page

**Dependencies:** Milestone 14 (security hardening complete before production exposure).

**Completion Criteria:**

- The application is reachable over HTTPS only, with all Section 5/DEPLOYMENT.md §5 controls verified.
- A full release (including a migration) has been performed successfully at least once using the documented process.
- A backup has been restored successfully at least once, proving the recovery procedure works, not just exists.
- Monitoring alerts fire correctly when manually tested (e.g., a simulated application error reaches the centralized log).

---

## Milestone 16: Testing Infrastructure

**Purpose:** Ensure the automated test suite described in TESTING.md is fully wired into CI as a blocking gate, closing the loop between "tests exist" and "tests are enforced." While individual test cases are written throughout Milestones 2–14 alongside their corresponding features, this milestone ensures the suite as a whole is complete, reliable, and enforced.

**Implementation Tasks:**

- [ ] Set up the test runner and configuration for unit, integration, and API/contract tests (TESTING.md §3)
- [ ] Set up the ephemeral/reset test database strategy for integration and API tests (TESTING.md §14, DEPLOYMENT.md §3)
- [ ] Wire the full automated test suite into CI as a blocking gate on every pull request (DEPLOYMENT.md §6, TESTING.md §14)
- [ ] Audit test coverage against every test case explicitly enumerated in TESTING.md Sections 6, 8, 9, 10, 11, and 12 — confirm each has a corresponding implemented test, not just a planned one
- [ ] Confirm the import-boundary lint rule (FOLDER_STRUCTURE.md §7) is enforced in CI as a build-failing check
- [ ] Document, in the repository, which TESTING.md Section 13 items remain explicitly deferred (no E2E browser automation, no load testing, no formal penetration test, no coverage-percentage target) so this is visible to future contributors rather than assumed

**Dependencies:** Milestones 2–14 (features and their accompanying tests must exist before this milestone can audit and enforce them); Milestone 1 (CI pipeline must exist).

**Completion Criteria:**

- CI fails a pull request that breaks any test in the suite — verified by intentionally introducing a failing test and confirming the pipeline blocks it.
- Every test case explicitly named in TESTING.md Sections 6–12 has a corresponding, passing, implemented test.
- The list of deliberately deferred testing scope (TESTING.md §13) is documented and visible in the repository, not only in this document series.

---

## 3. Milestone Sequencing Summary

```
M1 Project Setup
  └─▶ M2 Database
        └─▶ M3 Auth ──▶ M4 Tenant Isolation
                              ├─▶ M5 Store Management
                              │      ├─▶ M6 Products ──▶ M7 Inventory ──▶ M8 Orders
                              │      │                                        ├─▶ M9 Integration Layer/Messenger ──▶ M10 AI Workflow Validation
                              │      │                                        └─▶ M11 Human Approval Gate
                              │      └─▶ M12 Subscription
                              └─▶ M13 Admin Module
                                         └─▶ M14 Security Implementation
                                                └─▶ M15 Deployment Setup
        (M16 Testing Infrastructure runs continuously alongside M2–M14, finalized after M14)
```

This diagram is a build-order guide, not a rigid waterfall — where CODING_STANDARDS.md and TESTING.md require tests alongside a feature (which they do throughout), those tests are written within the same milestone as the feature, not deferred wholesale to Milestone 16.

---

## 4. What This Document Deliberately Does Not Cover

- **Task-level time estimates or sprint assignment** — this is an execution-order document, not a project-management schedule; effort estimation is a founder/team planning decision outside this document series.
- **Feature work belonging to any deferred module** (Customers CRM, Reports, Team Members, additional channels, etc.) — per AGENTS.md Section 9, these have no tasks anywhere in this document, not even as stubs.
- **Post-MVP scaling work** (the ~50-Store n8n/topology reconsideration, staging environment introduction) — belongs to ROADMAP.md.

---

## 5. Cross References

- **PRD.md** — every task in Milestones 5–13 traces to a specific functional requirement ID cited inline; this document is PRD.md's requirements broken into build order.
- **ARCHITECTURE.md** — Section 5's module boundaries define the milestone-to-module mapping used throughout (Milestones 5–13 correspond directly to ARCHITECTURE.md's named modules).
- **DB.md** — Milestone 2 implements every entity in DB.md Section 4 exactly; no task introduces a field or table not already defined there.
- **API.md** — every Server Action and route referenced in Milestones 5–13 corresponds to an entry in API.md Sections 6–9.
- **SECURITY.md** — Milestone 14 closes out every mechanism SECURITY.md defines that isn't already implemented as a side effect of earlier milestones.
- **DEPLOYMENT.md** — Milestone 15 implements DEPLOYMENT.md's topology, release process, backup, and monitoring sections directly.
- **TESTING.md** — Milestone 16 and the completion criteria throughout this document reference TESTING.md's test categories directly as the definition of "done."
- Downstream: ROADMAP.md must sequence this document's milestones against calendar phases and mark which milestones constitute the MVP release boundary versus post-MVP scaling work.

## Definition of Done

Before marking any task as completed:

- Code is implemented
- Tests are added
- Type check passes
- Lint passes
- Security impact reviewed