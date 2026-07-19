# DATABASE.md

## Smart Commerce AI — Database Design (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md
**Read By:** API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md, TESTING.md

---

## 1. Purpose

This document defines the relational data model that implements the module boundaries described in ARCHITECTURE.md and satisfies every functional requirement in PRD.md. It specifies entities, fields, types, relationships, constraints, and indexes — not application logic, not API contracts, and not code.

Per AGENTS.md Section 10, **business logic must never live inside SQL or database procedures.** Every constraint defined in this document exists solely to protect data integrity (uniqueness, referential integrity, required presence) — never to enforce business rules like "inventory only decreases on approval." That rule lives in the Orders Module's application logic (ARCHITECTURE.md Section 8); the database only guarantees that the data resulting from that logic remains structurally consistent.

---

## 2. Design Principles Applied

This schema is governed by rules already established upstream; this document does not reinterpret them, only applies them:

| Principle                                          | Source                                   | Application Here                                                                                                                                                                                                                   |
| -------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant isolation via Workspace ID                  | AGENTS.md §10 Rule 5; ARCHITECTURE.md §7 | Every tenant-owned table carries a `workspaceId` foreign key and is indexed on it.                                                                                                                                                 |
| Singular entity names, plural only for collections | AGENTS.md §11                            | Tables are named `Product`, `Order`, `Workspace` — never `Products`, `Orders`.                                                                                                                                                     |
| No business logic in the database                  | AGENTS.md §10                            | No triggers, no stored procedures, no computed business state at the DB layer.                                                                                                                                                     |
| Audit Log structure                                | AGENTS.md §10 Rule 6; PRD.md AUD-2       | `AuditLog` table fields match the mandated structure exactly.                                                                                                                                                                      |
| Workspace/Store terminology                        | AGENTS.md §7                             | The table is named `Workspace` (technical context); this document refers to it as Workspace throughout, consistent with schema-level usage.                                                                                        |
| MVP Discipline / no premature modules              | AGENTS.md §9, §14                        | No tables for Customers (as a standalone entity), Reports, Team Members, or additional channels. Forward-compatibility is achieved through field choices (e.g., a `channel` field with one current value), not speculative tables. |

---

## 3. Entity-Relationship Overview

```
User (1) ──owns── (1) Workspace
                        │
                        ├──(1)── Subscription ──(*)── SubscriptionPlan
                        │
                        ├──(1)── MessengerConnection
                        │
                        ├──(*)── Product ──(1)── Inventory
                        │
                        ├──(*)── Order ──(*)── OrderItem ──(1)── Product
                        │
                        └──(*)── AuditLog

PlatformAdministrator is a User with role = PLATFORM_ADMIN and no owned Workspace relationship.
```

Every entity below the `Workspace` line in this diagram is tenant-owned and carries `workspaceId`. `User`, `SubscriptionPlan`, and `AuditLog` (for platform-level entries) are the only entities not strictly single-tenant.

---

## 4. Entity Definitions

### 4.1 User

Represents both Store Owners and Platform Administrators. A single table with a role discriminator, per ARCHITECTURE.md Section 12 (Auth Module owns identity for both roles).

| Field             | Type                                  | Constraints                                               | Notes                                                                 |
| ----------------- | ------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| `id`              | UUID                                  | Primary Key                                               |                                                                       |
| `email`           | String                                | Unique, Required                                          | Login identifier                                                      |
| `passwordHash`    | String                                | Required                                                  | Never store plaintext; hashing algorithm defined in SECURITY.md       |
| `role`            | Enum: `STORE_OWNER`, `PLATFORM_ADMIN` | Required                                                  | Determines route access (`/stores/*` vs `/admin/*`) per PRD.md AUTH-3 |
| `phone`           | String                                | Required for `STORE_OWNER`, nullable for `PLATFORM_ADMIN` | Used for REG-2 phone verification                                     |
| `createdAt`       | DateTime                              | Required, default: now                                    |                                                                       |
| `updatedAt`       | DateTime                              | Required, auto-updated                                    |                                                                       |

**Business rule enforced in application layer, not here:** a `STORE_OWNER` User is associated with exactly one Workspace in MVP (PRD.md AUTH-2). This is expressed as a one-to-one relationship at the schema level (see `Workspace.ownerId`) but the *prohibition* on a User owning more than one Workspace is an application-layer rule, since the schema alone (a foreign key on `Workspace`) cannot express "and never a second one" without a uniqueness constraint — which is applied below.

---

### 4.2 Workspace

The core tenant entity. Referred to as "Store" in all product-facing contexts (AGENTS.md Section 7); named `Workspace` here per the technical-context naming convention.

| Field             | Type                                               | Constraints                               | Notes                                                                                                             |
| ----------------- | -------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `id`              | UUID                                               | Primary Key                               | This is the `workspaceId` referenced by every tenant-owned table                                                  |
| `ownerId`         | UUID                                               | Foreign Key → `User.id`, Unique, Required | Enforces one Workspace per Store Owner in MVP (PRD.md AUTH-2)                                                     |
| `businessName`    | String                                             | Required                                  | REG-1                                                                                                             |
| `contactEmail`    | String                                             | Required                                  |                                                                                                                   |
| `contactPhone`    | String                                             | Required                                  | Mirrors owner phone at registration time; may diverge later as a business contact number                          |
| `status`          | Enum: `TRIAL`, `ACTIVE`, `RESTRICTED`, `SUSPENDED` | Required, default: `TRIAL`                | `RESTRICTED` reflects PRD.md SUB-7 (trial expired without conversion — read access retained, automation disabled) |
| `trialEndsAt`     | DateTime                                           | Required                                  | Set at registration per REG-4 (14 days)                                                                           |
| `createdAt`       | DateTime                                           | Required, default: now                    |                                                                                                                   |
| `updatedAt`       | DateTime                                           | Required, auto-updated                    |                                                                                                                   |

**Note:** Phone verification is not part of the MVP. Workspace activation depends on the registration flow and subscription status, not on OTP verification.

---

### 4.3 SubscriptionPlan

Platform-level catalog of plans, managed by the Platform Administrator (PRD.md ADM-3). Not tenant-owned — this table has no `workspaceId`.

| Field                        | Type                               | Constraints             | Notes                                                                      |
| ---------------------------- | ---------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `id`                         | UUID                               | Primary Key             |                                                                            |
| `name`                       | Enum: `STARTER`, `BUSINESS`, `PRO` | Required, Unique        | Matches Updated Project Decisions §5                                       |
| `priceUsd`                   | Decimal                            | Required                | 15.00 / 35.00 / 85.00 at MVP launch, editable by Administrator (ADM-3)     |
| `monthlyAiConversationLimit` | Integer                            | Required                | The one metered resource (AGENTS.md §12)                                   |
| `isActive`                   | Boolean                            | Required, default: true | Allows retiring a plan without deleting historical Subscription references |
| `createdAt`                  | DateTime                           | Required, default: now  |                                                                            |
| `updatedAt`                  | DateTime                           | Required, auto-updated  |                                                                            |

**Why no limits on Products, Inventory, or Orders exist as fields here:** per AGENTS.md §10 Rule 9 and PRD.md SUB-3, these are never limited by plan — there is deliberately no schema field for them, so a future engineer cannot "accidentally" wire up a limit that contradicts an explicit business rule.

---

### 4.4 Subscription

The join between a Workspace and its current plan, plus usage tracking. One-to-one with Workspace in MVP (no plan history table yet — see Section 8).

| Field                 | Type                                              | Constraints                                    | Notes                                                                          |
| --------------------- | ------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `id`                  | UUID                                              | Primary Key                                    |                                                                                |
| `workspaceId`         | UUID                                              | Foreign Key → `Workspace.id`, Unique, Required | Tenant-owned, one Subscription per Workspace                                   |
| `planId`              | UUID                                              | Foreign Key → `SubscriptionPlan.id`, Required  |                                                                                |
| `status`              | Enum: `TRIALING`, `ACTIVE`, `PAST_DUE`, `EXPIRED` | Required                                       | Drives Workspace-level access alongside `Workspace.status`                     |
| `currentPeriodStart`  | DateTime                                          | Required                                       | Start of current monthly billing/usage cycle                                   |
| `currentPeriodEnd`    | DateTime                                          | Required                                       | Used to reset `aiConversationsUsed`                                            |
| `aiConversationsUsed` | Integer                                           | Required, default: 0                           | Incremented by the Subscription Module (ARCHITECTURE.md §9), never decremented |
| `createdAt`           | DateTime                                          | Required, default: now                         |                                                                                |
| `updatedAt`           | DateTime                                          | Required, auto-updated                         |                                                                                |

**Constraint note:** `aiConversationsUsed` must never exceed `SubscriptionPlan.monthlyAiConversationLimit` as a matter of application logic (ARCHITECTURE.md §9 step 1–3). This is intentionally not enforced as a database CHECK constraint referencing another table, since Postgres cannot express a cross-table CHECK — the enforcement point is `canConsumeAiConversation()` in the Subscription Module, not the schema.

---

### 4.5 MessengerConnection

One connected Facebook Page per Workspace in MVP (PRD.md MSG-1).

| Field                      | Type                                       | Constraints                                    | Notes                                                          |
| -------------------------- | ------------------------------------------ | ---------------------------------------------- | -------------------------------------------------------------- |
| `id`                       | UUID                                       | Primary Key                                    |                                                                |
| `workspaceId`              | UUID                                       | Foreign Key → `Workspace.id`, Unique, Required | One connection per Workspace in MVP                            |
| `pageId`                   | String                                     | Required                                       | Facebook Page identifier                                       |
| `pageAccessTokenEncrypted` | String                                     | Required                                       | Encrypted at rest; encryption mechanism defined in SECURITY.md |
| `status`                   | Enum: `CONNECTED`, `DISCONNECTED`, `ERROR` | Required, default: `DISCONNECTED`              | Drives PRD.md MSG-2 visibility                                 |
| `connectedAt`              | DateTime                                   | Nullable                                       | Null until first successful connection                         |
| `lastVerifiedAt`           | DateTime                                   | Nullable                                       | Updated by a health-check process; consumed by MSG-2           |
| `createdAt`                | DateTime                                   | Required, default: now                         |                                                                |
| `updatedAt`                | DateTime                                   | Required, auto-updated                         |                                                                |

**Forward-compatibility note (not an MVP feature):** the `Unique` constraint on `workspaceId` is what currently enforces "one Page per Store." When multi-channel support is introduced post-MVP, this constraint is what will be relaxed (or the table restructured toward a `Channel` abstraction) — flagged here so a future engineer understands this is a deliberate MVP-scoped constraint, not an accidental one.

---

### 4.6 Product

| Field         | Type                       | Constraints                                     | Notes                                                                                           |
| ------------- | -------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `id`          | UUID                       | Primary Key                                     |                                                                                                 |
| `workspaceId` | UUID                       | Foreign Key → `Workspace.id`, Required, Indexed | Tenant-owned                                                                                    |
| `name`        | String                     | Required                                        | PRD.md PROD-2
| `sku` | String | Required, Unique per Workspace | Stock Keeping Unit used for inventory management and product lookup |                                                                                   |
| `price`       | Decimal                    | Required                                        |                                                                                                 |
| `status`      | Enum: `ACTIVE`, `INACTIVE` | Required, default: `ACTIVE`                     | Deactivation path used instead of deletion when an active Order references the Product (PROD-4) |
| `createdAt`   | DateTime                   | Required, default: now                          |                                                                                                 |
| `updatedAt`   | DateTime                   | Required, auto-updated                          |                                                                                                 |

No `imageUrl` field exists — Product Images are explicitly out of MVP scope (PRD.md PROD-3).

**Deletion rule (PRD.md PROD-4):** enforced at the application layer by checking for referencing `OrderItem` rows in a non-terminal Order before allowing a hard delete; the database enforces only that an `OrderItem.productId` foreign key cannot be orphaned (see Section 4.9 on delete behavior), which is a data-integrity guarantee, not the business rule itself.

---

### 4.7 Inventory

Modeled as a distinct table from `Product`, mirroring the distinct Inventory Module boundary in ARCHITECTURE.md Section 5 — Products and Inventory are owned by different modules even though they are one-to-one in MVP.

| Field         | Type     | Constraints                                     | Notes                                                                                                                                                       |
| ------------- | -------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | UUID     | Primary Key                                     |                                                                                                                                                             |
| `workspaceId` | UUID     | Foreign Key → `Workspace.id`, Required, Indexed | Tenant-owned; duplicated from Product for direct scoping without a join, consistent with ARCHITECTURE.md §7 (every tenant-owned table scoped independently) |
| `productId`   | UUID     | Foreign Key → `Product.id`, Unique, Required    | One Inventory record per Product in MVP                                                                                                                     |
| `quantity`    | Integer  | Required, default: 0                            | Must never go below 0 — enforced as a CHECK constraint (data integrity, not business logic — see note below)                                                |
| `updatedAt`   | DateTime | Required, auto-updated                          |                                                                                                                                                             |

**Why a `quantity >= 0` CHECK constraint is acceptable here despite "no business logic in the database" (AGENTS.md §10):** this is a data-integrity guarantee (a negative stock count is not a valid state under any business rule, current or future), not a business rule about *when* or *why* quantity changes. The distinction: the database prevents an impossible value; the application decides whether decrementing is currently allowed (only via `Orders` approval, per ARCHITECTURE.md §8).

---

### 4.8 Order

| Field                 | Type                                    | Constraints                                     | Notes                                                                                                                                                |
| --------------------- | --------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | UUID                                    | Primary Key                                     |                                                                                                                                                      |
| `workspaceId`         | UUID                                    | Foreign Key → `Workspace.id`, Required, Indexed | Tenant-owned; enforces PRD.md ORD-7                                                                                                                  |
| `status`              | Enum: `PENDING`, `APPROVED`, `REJECTED` | Required, default: `PENDING`                    | ORD-2                                                                                                                                                |
| `customerName`        | String                                  | Nullable                                        | Captured from the Messenger conversation; nullable because not every conversation yields a full name before confirmation                             |
| `customerPhone`       | String                                  | Nullable                                        |                                                                                                                                                      |
| `customerAddress` | String | Nullable | Delivery address provided by the customer |
| `customerMessengerId` | String                                  | Required                                        | The one identifier guaranteed to exist for any Messenger-originated Order; used to route confirmation messages back                                  |
| `totalAmount`         | Decimal                                 | Required                                        | Computed at creation from `OrderItem` lines, stored (not recalculated live) so historical Orders remain accurate even if Product prices change later |
| `decidedByUserId`     | UUID                                    | Foreign Key → `User.id`, Nullable               | Set on approval or rejection; nullable while `PENDING`                                                                                               |
| `decidedAt`           | DateTime                                | Nullable                                        | Set on approval or rejection                                                                                                                         |
| `createdAt`           | DateTime                                | Required, default: now                          |                                                                                                                                                      |
| `updatedAt`           | DateTime                                | Required, auto-updated                          |                                                                                                                                                      |

**On the absence of a `Customer` foreign key (PRD.md ORD-3):** per the Updated Project Decisions, there is no standalone `Customer` entity in MVP. Customer identity is embedded directly on the `Order` as `customerName`, `customerPhone`, and `customerMessengerId`. This is a deliberate denormalization: two Orders from the same real-world customer will not be linked to each other in MVP. This is acceptable because there is no product requirement (PRD.md Section 9 explicitly excludes Customers/CRM) asking for cross-Order customer history yet. When a future Customers/CRM module is introduced, these three fields become the seed data for a new `Customer` entity and a `customerId` foreign key is added to `Order` — this is an additive migration, not a breaking one, satisfying AGENTS.md Section 14.

---

### 4.9 OrderItem

Line items of an Order, with price snapshotting.

| Field              | Type    | Constraints                                                  | Notes                                                                                                                     |
| ------------------ | ------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `id`               | UUID    | Primary Key                                                  |                                                                                                                           |
| `orderId`          | UUID    | Foreign Key → `Order.id`, Required, Indexed                  |                                                                                                                           |
| `productId`        | UUID    | Foreign Key → `Product.id`, Required, **Restrict on Delete** | Prevents a Product from being hard-deleted while referenced — this is the schema-level backstop for PRD.md PROD-4         |
| `quantity`         | Integer | Required                                                     | Must be > 0 (CHECK constraint)                                                                                            |
| `unitPriceAtOrder` | Decimal | Required                                                     | Snapshot of `Product.price` at the moment of order creation — protects historical Order accuracy from later price changes |

**Why price is snapshotted rather than referencing `Product.price` live:** an Order that showed a different total than what the customer agreed to (because the Store Owner changed a price before approval) would violate the trust the Human Approval Gate is meant to protect (ARCHITECTURE.md §8). Snapshotting is a data-integrity decision that supports a business principle, not a business rule implemented in the schema itself.

---

### 4.10 AuditLog

Structure matches AGENTS.md Section 10, Rule 6 exactly — this table does not reinterpret that structure.

| Field           | Type     | Constraints                                     | Notes                                                                                                                                                                                  |
| --------------- | -------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | UUID     | Primary Key                                     |                                                                                                                                                                                        |
| `workspaceId`   | UUID     | Foreign Key → `Workspace.id`, Nullable, Indexed | Nullable to allow platform-level entries (e.g., Administrator actions not tied to a single Workspace)                                                                                  |
| `actorId`       | UUID     | Foreign Key → `User.id`, Required               | The "Actor" field                                                                                                                                                                      |
| `action`        | String   | Required                                        | e.g., `ORDER_APPROVED`, `INVENTORY_ADJUSTED`, `SUBSCRIPTION_CHANGED` — controlled vocabulary defined in application code, not a DB enum, so new action types don't require a migration |
| `entity`        | String   | Required                                        | e.g., `Order`, `Product`, `Subscription`                                                                                                                                               |
| `entityId`      | UUID     | Required                                        | The affected record's ID                                                                                                                                                               |
| `previousState` | JSON     | Nullable                                        | Captured only "when applicable," per AGENTS.md §10 Rule 6                                                                                                                              |
| `newState`      | JSON     | Nullable                                        | Same                                                                                                                                                                                   |
| `reason`        | String   | Nullable                                        | Optional, per AGENTS.md §10 Rule 6                                                                                                                                                     |
| `createdAt`     | DateTime | Required, default: now                          | The "Timestamp" field                                                                                                                                                                  |

**Immutability:** no application code path exposes an update or delete operation against this table (ARCHITECTURE.md §10). This is an application-layer guarantee; the schema itself does not need a special mechanism to enforce it in MVP, though SECURITY.md may choose to formalize this further (e.g., restricted database role permissions).

**Why `action` and `entity` are free-text strings, not enums:** an enum would need a migration every time a new auditable action type is introduced across any module — this would work against the Extensibility Principle (AGENTS.md §14) more than it protects data integrity. The tradeoff (looser typing) is acceptable because this table is written-to, not queried for business logic.

---

## 5. Relationships Summary

| Relationship                    | Cardinality         | Enforcement                                           |
| ------------------------------- | ------------------- | ----------------------------------------------------- |
| User → Workspace (as owner)     | 1 : 1               | `Workspace.ownerId` unique foreign key                |
| Workspace → Subscription        | 1 : 1               | `Subscription.workspaceId` unique foreign key         |
| SubscriptionPlan → Subscription | 1 : many            | `Subscription.planId` foreign key                     |
| Workspace → MessengerConnection | 1 : 1               | `MessengerConnection.workspaceId` unique foreign key  |
| Workspace → Product             | 1 : many            | `Product.workspaceId` foreign key                     |
| Product → Inventory             | 1 : 1               | `Inventory.productId` unique foreign key              |
| Workspace → Order               | 1 : many            | `Order.workspaceId` foreign key                       |
| Order → OrderItem               | 1 : many            | `OrderItem.orderId` foreign key                       |
| Product → OrderItem             | 1 : many            | `OrderItem.productId` foreign key, restrict on delete |
| Workspace → AuditLog            | 1 : many (optional) | `AuditLog.workspaceId` nullable foreign key           |
| User → AuditLog (as actor)      | 1 : many            | `AuditLog.actorId` foreign key                        |

---

## 6. Indexing Strategy

Per ARCHITECTURE.md Section 7, every tenant-owned table is indexed on `workspaceId` as a baseline — this is the index that makes tenant-scoped queries (the only kind Store-facing modules issue) performant as data grows.

| Table                 | Indexes                                                         | Reason                                                                                                               |
| --------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Workspace`           | `ownerId` (unique)                                              | Fast lookup from an authenticated User session                                                                       |
| `Product`             | `workspaceId`; composite `(workspaceId, status)`                | Listing active Products for a Store is the most frequent Product query (Integration Layer's `checkAvailability`)     |
| `Inventory`           | `workspaceId`; `productId` (unique)                             | Direct stock lookup by Product                                                                                       |
| `Order`               | `workspaceId`; composite `(workspaceId, status)`                | Dashboard counts by status (PRD.md DASH-2) and the Store Owner's Pending Order queue are the dominant query patterns |
| `OrderItem`           | `orderId`                                                       | Fetching all lines for a given Order                                                                                 |
| `AuditLog`            | `workspaceId`; `entityId`; composite `(workspaceId, createdAt)` | Store-scoped Audit Log view (AUD-3) ordered by recency                                                               |
| `Subscription`        | `workspaceId` (unique)                                          | Already covered by the unique constraint; explicit index not additionally required                                   |
| `MessengerConnection` | `workspaceId` (unique)                                          | Connection lookup during webhook handling                                                                            |

---

## 7. Enumerations Reference

Centralizing enum values here so API.md and CODING_STANDARDS.md reference the same source rather than redefining them:

| Enum                        | Values                                       |
| --------------------------- | -------------------------------------------- |
| `UserRole`                  | `STORE_OWNER`, `PLATFORM_ADMIN`              |
| `WorkspaceStatus`           | `TRIAL`, `ACTIVE`, `RESTRICTED`, `SUSPENDED` |
| `SubscriptionPlanName`      | `STARTER`, `BUSINESS`, `PRO`                 |
| `SubscriptionStatus`        | `TRIALING`, `ACTIVE`, `PAST_DUE`, `EXPIRED`  |
| `MessengerConnectionStatus` | `CONNECTED`, `DISCONNECTED`, `ERROR`         |
| `ProductStatus`             | `ACTIVE`, `INACTIVE`                         |
| `OrderStatus`               | `PENDING`, `APPROVED`, `REJECTED`            |

---

## 8. Deliberate Omissions (MVP Discipline Applied to Schema)

Consistent with AGENTS.md Section 9 and Section 14 ("don't block the door, but don't build the room"), the following are intentionally **not** modeled, with the reasoning made explicit so no future agent mistakes the omission for an oversight:

| Not Modeled                                         | Why Not Now                                                                                                                                                            | What Would Trigger Adding It                                                                                                        |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Customer` entity                                   | No CRM module in MVP (PRD.md Section 9); customer data lives on `Order` instead (Section 4.8)                                                                          | Introduction of the future Customers/CRM module                                                                                     |
| `TeamMember` / `Role` join table                    | Single Store Owner per Workspace in MVP (PRD.md AUTH-2)                                                                                                                | Introduction of the future Multi-user Workspaces module                                                                             |
| `Channel` entity (abstracted beyond Messenger)      | Only one channel exists in MVP; `MessengerConnection` is channel-specific by design for now                                                                            | Introduction of a second channel post-MVP                                                                                           |
| `SubscriptionPlanHistory` / plan-change audit table | A Workspace has exactly one current Subscription in MVP; historical plan changes are not yet a product requirement beyond what `AuditLog` already captures generically | A future billing requirement to query plan-change history structurally rather than via generic Audit Log entries                    |
| `Report` / aggregated snapshot tables               | Dashboard counters (PRD.md DASH-1/2) are computed via live queries against existing tables, not pre-aggregated                                                         | Query performance at a scale where live counts become slow, or the future Reports & Analytics module requiring historical snapshots |

---

## 9. Data Integrity vs. Business Logic — Applied Examples

To make the AGENTS.md Section 10 boundary concrete for this schema specifically:

| Rule                                                                                                             | Enforced By Database (Integrity)                          | Enforced By Application (Business Logic)                                                                |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Inventory cannot go negative                                                                                     | `Inventory.quantity >= 0` CHECK constraint                | —                                                                                                       |
| Inventory only decreases on Order approval                                                                       | —                                                         | Orders Module's `approveOrder()` transaction (ARCHITECTURE.md §8)                                       |
| A Product referenced by an OrderItem cannot be hard-deleted                                                      | `OrderItem.productId` foreign key with Restrict-on-delete | —                                                                                                       |
| A Product cannot be *soft*-deleted (deactivated) while in an active Order in a way that misleads the Store Owner | —                                                         | Products Module checks for non-terminal referencing Orders before allowing deactivation (PRD.md PROD-4) |
| Every Workspace has at most one Subscription                                                                     | `Subscription.workspaceId` unique constraint              | —                                                                                                       |
| A Workspace cannot consume more AI conversations than its plan allows                                            | —                                                         | Subscription Module's `canConsumeAiConversation()` (ARCHITECTURE.md §9)                                 |
| Every state change produces an Audit Log entry                                                                   | —                                                         | Each module calls `recordAuditEntry()` within its own transaction (ARCHITECTURE.md §10)                 |

This table exists specifically to make the boundary auditable — a reviewer can check any future schema change against this pattern before approving it.

---

## 10. Cross References

- **AGENTS.md** — Section 10 (Naming Principles, no business logic in SQL, Audit Log structure) and Section 11 (Naming Principles) govern every naming and constraint decision in this document.
- **PRD.md** — every entity and field traces to a functional requirement in Section 7 (Products, Inventory, Orders, Subscription Management, Audit Logs modules).
- **ARCHITECTURE.md** — Section 5 (Module Boundaries), Section 7 (Tenant Isolation), and Section 8 (Human Approval Gate) directly shaped the table separation (e.g., `Product` vs. `Inventory` as distinct tables) and constraint placement in this document.
- Downstream: API.md must expose endpoints whose request/response shapes are consistent with the field names and types defined here. FOLDER_STRUCTURE.md and CODING_STANDARDS.md must reflect the module-aligned, tenant-scoped data-access pattern this schema assumes.