# FOLDER_STRUCTURE.md

## Smart Commerce AI — Codebase Organization (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DATABASE.md, API.md
**Read By:** CODING_STANDARDS.md, SECURITY.md, DEPLOYMENT.md, TESTING.md

---

## 1. Purpose

This document defines how the codebase is physically organized so that the module boundaries established in ARCHITECTURE.md Section 5 are visible and enforceable in the file system — not just described in prose. A future engineer or AI agent should be able to infer the module boundary rules from the folder structure alone, without re-reading ARCHITECTURE.md.

This document does not define code style, naming conventions inside files, or testing conventions — those belong to CODING_STANDARDS.md and TESTING.md. It defines **where things live and why**, and **which folders are allowed to import from which other folders.**

---

## 2. Guiding Constraint: Structure Must Enforce ARCHITECTURE.md

Per ARCHITECTURE.md Section 15 (Architectural Risks), the single greatest risk to a modular monolith is boundary erosion over time. This document's central purpose is to make that erosion structurally difficult — a module reaching into another module's internals should require an obviously wrong import path, not just violate an unwritten convention.

Concretely, this means:

- Each module from ARCHITECTURE.md Section 5 (Auth, Store, Subscription, Products, Inventory, Orders, Integration Layer, Audit Log, Admin) maps to exactly one folder.
- A module's internal data-access code (its Prisma queries) is never imported directly by another module — only its exposed service functions are.
- The route structure (`/stores/*` vs `/admin/*` vs `/api/integration/*`) mirrors the consumer partition defined in API.md Section 2, so the routing layer itself reflects the security boundary rather than relying on scattered checks.

---

## 3. Top-Level Structure

```
smart-commerce-ai/
├── src/
│   ├── app/                      # Next.js 15 App Router — routes only, no business logic
│   ├── modules/                  # One folder per ARCHITECTURE.md module — all business logic lives here
│   ├── shared/                   # Cross-module utilities with no business logic of their own
│   ├── lib/                      # Framework/infrastructure wiring (Prisma client, NextAuth config, etc.)
│   └── types/                    # Shared TypeScript types not owned by a single module
├── prisma/
│   ├── schema.prisma              # Implements DATABASE.md exactly
│   └── migrations/
├── public/
└── (config files — see Section 8)
```

**Why `app/` contains no business logic:** per ARCHITECTURE.md Section 12, Server Actions execute business logic, but the *logic itself* lives in `modules/`, not in the route files. Route files under `app/` call into `modules/` — they are the thinnest possible layer, responsible only for wiring a request/session to the correct module function. This keeps the module boundary meaningful even though Next.js physically requires route-related files to live under `app/`.

---

## 4. `src/app/` — Routes Only

```
src/app/
├── (auth)/
│   ├── login/
│   ├── register/                  # Store Registration (REG-1)
│   └── verify-phone/               # REG-2
│
├── stores/
│   ├── layout.tsx                  # Enforces STORE_OWNER session (AUTH-3, AUTH-4)
│   ├── dashboard/
│   ├── products/
│   ├── inventory/
│   ├── orders/
│   ├── subscription/
│   └── settings/
│
├── admin/
│   ├── layout.tsx                  # Enforces PLATFORM_ADMIN session (AUTH-3, AUTH-4)
│   ├── stores/                     # ADM-1
│   ├── statistics/                 # ADM-2
│   ├── plans/                      # ADM-3
│   └── settings/                   # ADM-4
│
└── api/
    └── integration/
        └── v1/
            ├── availability/
            │   └── route.ts        # API.md §5.1
            └── orders/
                └── route.ts        # API.md §5.2
```

**Structural rule enforced here:** `app/stores/` and `app/admin/` each have their own `layout.tsx` responsible for session-type enforcement (API.md Section 4). This means the *routing layer itself* refuses a mismatched session before any page or Server Action runs — consistent with AGENTS.md's Security by Default principle. A Store Owner session physically cannot render anything under `app/admin/`, and vice versa, regardless of what any individual page does or forgets to check.

**Why `api/integration/v1/` is the only folder under `api/`:** per API.md Section 2 and Section 11, this is the sole externally reachable HTTP surface. There is no `api/stores/` or `api/admin/` folder — Store Owner and Administrator operations are Server Actions colocated with their pages (Section 5), not separate REST routes. If a future engineer creates a new folder under `api/`, that is an architecturally significant decision requiring explicit review against API.md Section 11 ("What This API Deliberately Does Not Expose") — not a routine addition.

---

## 5. `src/modules/` — Business Logic, One Folder Per Module

This is the direct file-system expression of ARCHITECTURE.md Section 5.

```
src/modules/
├── auth/
│   ├── data/                       # Prisma queries — private to this module
│   ├── services/                   # getCurrentUser(), requireStoreOwner(), requireAdmin()
│   ├── actions/                    # Server Actions: login, logout, registerStore
│   └── types.ts
│
├── store/
│   ├── data/
│   ├── services/                   # getStoreById(), isStoreActive()
│   ├── actions/                    # updateStoreProfile, connectMessengerPage, disconnectMessengerPage
│   └── types.ts
│
├── subscription/
│   ├── data/
│   ├── services/                   # getSubscriptionStatus(), canConsumeAiConversation(), recordAiConversationUsage()
│   ├── actions/                    # changePlan
│   └── types.ts
│
├── products/
│   ├── data/
│   ├── services/                   # getProduct(), listProducts(), isProductActive()
│   ├── actions/                    # createProduct, updateProduct, deactivateProduct, deleteProduct
│   └── types.ts
│
├── inventory/
│   ├── data/
│   ├── services/                   # getStockLevel(); decrementStock() — NOT exported outside this module (see §5.1)
│   ├── actions/                    # adjustStockManually
│   └── types.ts
│
├── orders/
│   ├── data/
│   ├── services/                   # createPendingOrder(), approveOrder(), rejectOrder(), getOrder()
│   ├── actions/                    # listOrders, getOrder, approveOrder, rejectOrder
│   └── types.ts
│
├── integration/
│   ├── services/                   # checkAvailability(), proposeOrder() — the ONLY module callable from api/integration/v1
│   ├── validation/                 # Zod schemas for inbound payloads (API.md §5, §6.4 in ARCHITECTURE.md)
│   └── types.ts
│
├── audit-log/
│   ├── data/
│   ├── services/                   # recordAuditEntry(), getAuditLog() — no update/delete exposed, ever
│   └── types.ts
│
└── admin/
    ├── data/                       # Explicitly separate cross-tenant data-access path (ARCHITECTURE.md §7)
    ├── services/                   # listStores(), getPlatformStatistics()
    ├── actions/                    # createSubscriptionPlan, updateSubscriptionPlan, updatePlatformSettings
    └── types.ts
```

### 5.1 The Import Boundary Rule

This is the single most important rule in this document:

> **A module's `data/` folder is never imported by any other module.** Other modules may only import from another module's `services/` (or, where relevant, `actions/`) — never reach past that into `data/`.

This directly implements ARCHITECTURE.md Section 5's requirement that modules "communicate through defined internal interfaces... never by directly querying another module's tables."

**Concrete consequence:** `modules/orders/services/` is the only place allowed to import `modules/inventory/services/decrementStock`. `decrementStock` itself is written such that it is only ever called from `orders/services/approveOrder()` — this is the file-system-level enforcement of the Human Approval Gate (ARCHITECTURE.md §8): if a future engineer tries to call `decrementStock` from anywhere else, the import itself is the point where a code reviewer (or a lint rule, see Section 7) can catch the violation before it ships.

**Import direction summary:**

| From                            | May Import                                                                                                                             | Must Not Import                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `app/**`                        | Any module's `actions/` or `services/`                                                                                                 | Any module's `data/` directly                                           |
| `modules/*/actions/`            | Its own module's `services/`; other modules' `services/` only where ARCHITECTURE.md §5 explicitly names a cross-module call            | Any module's `data/` other than its own                                 |
| `modules/*/services/`           | Its own module's `data/`; other modules' `services/` only where explicitly named in ARCHITECTURE.md §5                                 | Any other module's `data/`                                              |
| `modules/integration/services/` | `products/services`, `inventory/services`, `orders/services`, `subscription/services` (exactly the calls named in ARCHITECTURE.md §11) | Nothing beyond those named services                                     |
| `modules/admin/data/`           | Cross-tenant queries, by design                                                                                                        | N/A — this is the deliberate, documented exception (ARCHITECTURE.md §7) |

---

## 6. `src/shared/` and `src/lib/`

```
src/shared/
├── ui/                              # Reusable, business-logic-free UI components
├── validation/                      # Generic Zod helpers not specific to one module
└── errors/                          # Shared error shape/types (API.md §9 — error codes, response structure)

src/lib/
├── prisma.ts                        # Single Prisma client instance
├── auth.ts                          # NextAuth configuration
└── env.ts                           # Environment variable validation/access
```

**Why these are separate from `modules/`:** `shared/` and `lib/` contain no business logic and no knowledge of Products, Orders, or any domain concept — they are infrastructure and generic utility. If a file in `shared/` starts referencing a domain concept (e.g., a helper that knows what an Order is), that is a signal it belongs in a module instead, not here. This distinction matters for the Naming Principles and "no implicit behavior" rules in AGENTS.md Section 10 — `shared/` should never quietly become a dumping ground where business rules hide from module ownership.

---

## 7. Enforcement Mechanism

Per ARCHITECTURE.md Section 15's identified risk ("module boundaries erode over time... under time pressure"), this structure is not treated as a convention enforced only by code review memory. Concretely:

- ESLint's `no-restricted-imports` (or an equivalent import-boundary plugin) is configured so that any file under `modules/<x>/` importing from `modules/<y>/data/` for any `y ≠ x` fails the build, not just the review.
- This lint configuration is itself a project asset that must be kept in sync with this document — if a new module is added, its import rules are added here and in the lint config in the same change.

The exact lint rule configuration and CI enforcement point are defined in CODING_STANDARDS.md and DEPLOYMENT.md respectively; this document establishes *what* must be enforced, those documents establish *how*.

---

## 8. Root-Level Configuration Files

```
smart-commerce-ai/
├── .env.example
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.ts                 # Includes the import-boundary rule from Section 7
├── package.json
└── prisma/
    └── schema.prisma
```

Environment-specific configuration (production secrets, VPS-specific values) is not committed to the repository — see DEPLOYMENT.md for environment/secret management strategy. `.env.example` documents required variables without values.

---

## 9. Mapping Table: ARCHITECTURE.md Modules → Folders

| ARCHITECTURE.md Module | Folder                  | Externally Reachable Via                                                                                                   |
| ---------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Auth Module            | `modules/auth/`         | Session middleware in `app/(auth)/`, `app/stores/layout.tsx`, `app/admin/layout.tsx`                                       |
| Store Module           | `modules/store/`        | `app/stores/settings/`                                                                                                     |
| Subscription Module    | `modules/subscription/` | `app/stores/subscription/`, `app/admin/plans/`, called internally by `integration`                                         |
| Products Module        | `modules/products/`     | `app/stores/products/`, called internally by `integration`                                                                 |
| Inventory Module       | `modules/inventory/`    | `app/stores/inventory/`; `decrementStock` reachable only from `modules/orders/services/`                                   |
| Orders Module          | `modules/orders/`       | `app/stores/orders/`, called internally by `integration` (create-only)                                                     |
| Integration Layer      | `modules/integration/`  | `app/api/integration/v1/*` — the sole externally reachable module                                                          |
| Audit Log Module       | `modules/audit-log/`    | Called internally by every state-changing module; read exposed via `app/stores/settings/` (AUD-3) and `app/admin/` (AUD-4) |
| Admin Module           | `modules/admin/`        | `app/admin/*` exclusively                                                                                                  |

This table exists so a future engineer or AI agent can go from "which ARCHITECTURE.md module handles X" directly to "which folder do I open" without cross-referencing multiple documents.

---

## 10. What Is Deliberately Not Introduced Yet

Consistent with MVP Discipline (AGENTS.md §9) and the Extensibility Principle (AGENTS.md §14):

- No `modules/customers/` — customer data lives inside `modules/orders/` per DATABASE.md §4.8, with no separate module folder until the future CRM module is decided.
- No `modules/reports/` — dashboard statistics are simple service calls within `modules/store/` or a lightweight `modules/dashboard/` reading from existing modules' `services/`, not a dedicated analytics module.
- No `modules/team/` — no folder exists for roles beyond `STORE_OWNER`/`PLATFORM_ADMIN` until Multi-user Workspaces is decided.
- No `app/api/stores/` or `app/api/admin/` — Store and Admin operations are Server Actions, not REST endpoints, per API.md Section 6/7.

When any of these future modules is greenlit, it is added as a new sibling folder under `modules/`, following the exact same `data/services/actions/types.ts` shape already established — this structure is the template, not a one-off decision made per module.

---

## 11. Cross References

- **ARCHITECTURE.md** — Section 5 (Module Boundaries) is implemented directly as the folder structure in Section 5 of this document; Section 6 (Integration Abstraction Layer) is implemented as `modules/integration/` and `app/api/integration/v1/`; Section 7 (Tenant Isolation) is reflected in the `admin/data/` exception noted in Section 5.1.
- **API.md** — Section 2 (API Consumers) and Section 6/7 (Server Actions by module) map directly to the `app/stores/`, `app/admin/`, and `app/api/integration/v1/` folders in Section 4.
- **AGENTS.md** — Section 10 (no implicit behavior, no business logic in SQL) underlies the strict `data/` vs `services/` separation within each module folder.
- Downstream: CODING_STANDARDS.md must define the concrete lint rule referenced in Section 7 and file-level naming conventions within each module folder. SECURITY.md must define how `app/stores/layout.tsx` and `app/admin/layout.tsx` enforce session-type separation at a mechanism level. DEPLOYMENT.md must define how the ESLint import-boundary check participates in CI.