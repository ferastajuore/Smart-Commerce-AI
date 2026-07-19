# CODING_STANDARDS.md

## Smart Commerce AI — Coding Standards (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DATABASE.md, API.md, FOLDER_STRUCTURE.md
**Read By:** SECURITY.md, DEPLOYMENT.md, TESTING.md

---

## 1. Purpose

This document defines the concrete, implementation-level conventions every contributor — human or AI — must follow when writing code for Smart Commerce AI. It exists to make the principles established in AGENTS.md (Naming Principles, no implicit behavior, no business logic in SQL, Error Handling Principles) and the structural boundaries established in FOLDER_STRUCTURE.md (Section 7's enforcement mechanism) mechanically checkable, not just stated as intent.

This document does not redefine what the modules do (ARCHITECTURE.md), where files live (FOLDER_STRUCTURE.md), or what the API contracts are (API.md). It defines **how code inside those boundaries is written.**

---

## 2. Naming Conventions

Directly implements AGENTS.md Section 11 (Naming Principles): singular entity names, plural only for collections, no abbreviations unless universally accepted, consistent terminology across documentation, APIs, database, and code.

| Concept                     | Convention                                                                  | Example                                | Anti-Pattern                                 |
| --------------------------- | --------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------- |
| Database models (Prisma)    | Singular, PascalCase                                                        | `Product`, `Order`, `Workspace`        | `Products`, `Orders`                         |
| Database columns            | camelCase, matches DATABASE.md exactly                                      | `workspaceId`, `unitPriceAtOrder`      | `workspace_id`, `wsId`                       |
| TypeScript types/interfaces | Singular, PascalCase, matches model name                                    | `Product`, `OrderItem`                 | `IProduct`, `ProductType`                    |
| Arrays/collections in code  | Plural variable name, singular type                                         | `const products: Product[]`            | `const productList: Product[]`               |
| Service functions           | Verb + Noun, matches ARCHITECTURE.md §5 naming exactly                      | `getStockLevel()`, `approveOrder()`    | `stockCheck()`, `doApprove()`                |
| Server Actions              | Same verb-noun convention as services; the action name is what the UI calls | `createProduct`, `adjustStockManually` | `handleCreateProduct`, `productCreateAction` |
| Boolean variables/fields    | `is`/`has`/`can` prefix                                                     | `isActive`, `canConsumeAiConversation` | `active`, `activeFlag`                       |
| Enum values                 | SCREAMING_SNAKE_CASE, matches DATABASE.md §7 exactly                        | `PENDING`, `STORE_OWNER`               | `Pending`, `storeOwner`                      |
| Files                       | kebab-case, one primary export per file where practical                     | `approve-order.ts`                     | `ApproveOrder.ts`, `approveorder.ts`         |
| Folders                     | kebab-case, matches FOLDER_STRUCTURE.md exactly                             | `audit-log/`                           | `auditLog/`, `AuditLog/`                     |

**Abbreviation policy:** only universally accepted abbreviations are permitted — `id`, `url`, `api`, `ui`. Domain-specific abbreviations are prohibited even if they seem obvious in context — write `quantity`, not `qty`; `workspace`, not `ws`; `subscription`, not `sub`. This exists because AGENTS.md Section 11 treats abbreviation drift as exactly the kind of small inconsistency that compounds into confusion across a codebase maintained partly by AI agents without persistent memory of "the obvious shorthand we all use here."

**Cross-document consistency check:** if a term in code doesn't match its spelling/casing in DATABASE.md, API.md, or PRD.md, the code is wrong, not the document — these documents are upstream authority per AGENTS.md Section 4.

---

## 3. Module Boundary Enforcement (Concrete Mechanism)

FOLDER_STRUCTURE.md Section 7 establishes that import boundaries must be enforced by tooling, not memory. This section defines the concrete rule.

```js
// eslint.config.ts (excerpt)
{
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        {
          group: ["@/modules/*/data/*"],
          message: "Do not import another module's data/ layer directly. Import from that module's services/ instead."
        }
      ]
    }]
  }
}
```

This rule applies to every file under `src/modules/`, with an exception carved out only for a module importing its *own* `data/` folder (enforced via a per-module override or a custom rule matching FOLDER_STRUCTURE.md Section 5.1's import table). Any pull request that fails this lint rule is blocked from merging — this is a CI gate (DEPLOYMENT.md), not a review suggestion.

**Additional structural rule:** `modules/inventory/services/decrementStock` and `modules/orders/services/approveOrder`/`rejectOrder` are exported with a naming or comment convention flagging them as **restricted-caller functions** — a leading code comment stating which module(s) may call them, per ARCHITECTURE.md Section 8. Example:

```ts
/**
 * RESTRICTED: only callable from modules/orders/services/approve-order.ts.
 * Enforces the Human Approval Gate (ARCHITECTURE.md §8).
 */
export async function decrementStock(...) { ... }
```

This comment is not a technical enforcement mechanism by itself — it is a reviewer signal. Where feasible, this is reinforced by not exporting the function from the module's public `index.ts` barrel file, so it is syntactically unreachable outside its intended caller rather than merely discouraged.

---

## 4. Tenant Scoping Convention (Concrete Mechanism)

Implements ARCHITECTURE.md Section 7 and DATABASE.md's tenant-isolation design as an enforceable code pattern.

**Rule:** every data-access function in a tenant-owned module's `data/` folder must accept `workspaceId` as its **first parameter**, and must never be callable without it.

```ts
// modules/products/data/get-products.ts

// Correct:
export async function getProducts(workspaceId: string, filters?: ProductFilters) {
  return prisma.product.findMany({ where: { workspaceId, ...filters } });
}

// Prohibited — workspaceId optional or absent:
export async function getProducts(filters?: ProductFilters & { workspaceId?: string }) {
  return prisma.product.findMany({ where: filters });
}
```

**Reviewer checklist (also usable as a lint target where feasible via a custom rule):** any function in `modules/*/data/` whose first parameter is not `workspaceId: string` is rejected in review, unless the function operates on a table without a `workspaceId` column per DATABASE.md (e.g., `SubscriptionPlan`, or `modules/admin/data/` which is the documented exception per FOLDER_STRUCTURE.md §5.1).

**Where `workspaceId` comes from:** per API.md Section 4 and Section 6, `workspaceId` is resolved once per request from the authenticated session, in the relevant `app/*/layout.tsx` or Server Action entry point — never re-read from a client-supplied form field or URL parameter as the source of truth. A Server Action may receive a `workspaceId`-shaped value in its input for defensive validation, but the value actually used in the Prisma query is always the one derived from the session.

---

## 5. Business Logic Placement

Implements AGENTS.md Section 10's rule that business logic never lives in SQL, and DATABASE.md Section 9's data-integrity-vs-business-logic distinction, as a code-level rule.

- **Prisma schema (`schema.prisma`) may only contain:** field types, required/optional, unique constraints, foreign keys, CHECK constraints that protect impossible states (e.g., `quantity >= 0`), and indexes.
- **Prisma schema must never contain:** database triggers, stored procedures, or generated/computed columns that encode a business decision (e.g., a column that automatically flags an Order as "at risk" based on some rule).
- **All conditional business behavior** — "if the Order is Pending, allow approval; otherwise reject with CONFLICT" — lives in a module's `services/` layer, in plain TypeScript, where it is readable, testable in isolation (see TESTING.md), and traceable to a specific PRD.md requirement via a code comment where the rule isn't self-evident.

**Example of the required comment style for a non-obvious business rule:**

```ts
// Orders can only be approved from PENDING status.
// Ref: PRD.md ORD-4, AGENTS.md §10 Rule 1 (human approval gate)
if (order.status !== "PENDING") {
  throw new AppError("CONFLICT", "Order is not in a pending state");
}
```

This traceability requirement exists because AGENTS.md Section 10 treats undocumented business rules as implementation defects — a rule enforced in code with no link back to its origin is exactly the kind of hidden assumption that erodes over time as the team (human or AI) changes.

---

## 6. Error Handling in Code

Implements the Error Handling Principles from AGENTS.md Section 10 and the error shape defined in API.md Section 9.

**A single shared error class is used across all modules:**

```ts
// shared/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,       // matches API.md §9 error codes exactly
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}
```

**Rules:**

- Every module throws `AppError` for expected business-rule failures (insufficient stock, conflicting state, validation failure) — never a raw `Error`, never a silently returned `null` or `false` standing in for a failure a caller must specifically handle.
- Unexpected failures (a database connection error, an unhandled exception) are not caught and suppressed — they propagate to a top-level handler that logs them with full detail (per "log unexpected failures," AGENTS.md §10) and returns a generic `INTERNAL_ERROR` to the caller, never leaking stack traces or internal messages to the client.
- No function returns a "soft failure" value (e.g., `{ success: false }` with no further detail) where a caller might reasonably ignore it. Every failure path either throws `AppError` or is a type-checked, explicitly handled result — never a value a caller can accidentally drop.
- `try/catch` blocks that catch an error and do nothing (or only `console.log`) are prohibited. If a caught error truly doesn't need to propagate, the code must state why in a comment — an empty catch block is always treated as a defect during review, per AGENTS.md's "never silently ignore business errors."

---

## 7. Validation Conventions

- Every Server Action and every `/api/integration/v1/*` route validates its input with a Zod schema before any module logic runs, consistent with API.md Section 9 (`VALIDATION_ERROR`) and ARCHITECTURE.md Section 6.4 (AI output validation).
- Zod schemas for a module's inputs live in that module's dedicated validation/ folder (e.g., modules/products/validation/, modules/orders/validation/), not centralized in one giant schema file — this is consistent with FOLDER_STRUCTURE.md's module boundary philosophy.
- `modules/integration/validation/` holds the schemas specifically for AI/automation-originated payloads, and these are treated with additional scrutiny in review since they represent the platform's primary untrusted-input boundary (AGENTS.md's AI Output Validation rule).

---

## 8. TypeScript Conventions

- `strict` mode is enabled project-wide; `any` is prohibited except in narrowly justified, commented cases (e.g., typing a third-party library's untyped callback) — never as a convenience to skip modeling a type properly.
- Every exported function from a module's `services/` or `actions/` folder has an explicit return type — inferred return types are acceptable for private/internal helpers only.
- Domain types (e.g., `Order`, `Product`) are derived from the Prisma-generated types where possible, not hand-duplicated — this prevents the schema (DATABASE.md) and application types from drifting apart silently.
- Enum values in TypeScript match the Prisma enum exactly (DATABASE.md §7) — no parallel string-literal union is defined that could drift from the schema's actual enum values.

---

## 9. Comments and Documentation in Code

- Code comments explain **why**, not **what** — the code itself should make "what" self-evident through naming (Section 2). A comment restating what a line of code obviously does is discouraged; a comment explaining why a non-obvious business rule exists (Section 5's example) is required.
- Every module's `services/` folder includes a brief file-level or function-level comment linking back to the ARCHITECTURE.md module and PRD.md requirement it implements, so a reader can move from code to specification without searching.
- TODO comments are permitted only when paired with a specific reference (a future module named in AGENTS.md Section 14, or a ROADMAP.md item once that document exists) — a bare `// TODO: fix this later` with no traceable destination is treated the same as an undocumented business rule: a defect, per AGENTS.md's "no implicit behavior."

---

## 10. API Stability in Practice

Implements AGENTS.md's API Stability rule at the code level.

- Any change to a Zod schema under `modules/integration/validation/` that removes a field, changes a field's required/optional status in a breaking way, or changes a response shape under `/api/integration/v1/*` is treated as a breaking change requiring explicit documentation in the pull request description and, once TESTING.md and DEPLOYMENT.md exist, a corresponding versioning decision (e.g., introducing `/api/integration/v2/*` rather than mutating `v1` in place).
- Server Action signatures used by the Store Owner or Administrator UI are not held to the same external-versioning bar (they are not a public contract), but a breaking change to a widely-used Server Action's input/output shape still requires updating every call site in the same change — no partial migrations left for "later."

---

## 11. Formatting and Linting Baseline

- Prettier is the single source of formatting truth — no manual formatting debates in review; if Prettier's output looks wrong, the Prettier config is changed, not the individual file.
- ESLint enforces the import-boundary rule (Section 3), standard TypeScript best practices, and the project's specific prohibitions from this document (`any` usage, empty catch blocks) wherever mechanically detectable.
- A pull request that fails lint or format checks does not merge — this is a CI gate (DEPLOYMENT.md), not a manual review step, so review time is spent on logic and boundary correctness rather than style.

---

## 12. What This Document Deliberately Does Not Cover

- **Testing conventions** (test file naming, coverage expectations, what constitutes a unit vs. integration test) — belongs to TESTING.md.
- **Security-specific implementation** (password hashing algorithm, token encryption mechanics, credential rotation) — belongs to SECURITY.md; this document only requires that such code lives in the correct module/file location per FOLDER_STRUCTURE.md.
- **CI/CD pipeline configuration** (which checks run when, deployment gating) — belongs to DEPLOYMENT.md; this document only defines what those checks must enforce (Sections 3, 11).

---

## 13. Cross References

- **AGENTS.md** — Section 10 (Naming Principles, no implicit behavior, no business logic in SQL, Error Handling Principles, API Stability, AI Output Validation) is the direct source of nearly every rule in this document; this document exists specifically to make those principles mechanically checkable.
- **FOLDER_STRUCTURE.md** — Section 5.1's import boundary table is implemented concretely in Section 3 of this document; Section 7's enforcement requirement is fulfilled by the ESLint configuration described here.
- **DATABASE.md** — Section 9's data-integrity-vs-business-logic distinction is applied as the code-level rule in Section 5.
- **API.md** — Section 9's error code vocabulary is implemented as the shared `AppError` class in Section 6; Section 9's AI-input validation requirement is implemented in Section 7.
- Downstream: SECURITY.md must define the specific cryptographic and authentication mechanisms that live inside the module locations this document assumes. DEPLOYMENT.md must define the CI pipeline that enforces the lint/format/import-boundary gates referenced in Sections 3 and 11. TESTING.md must define how the business-logic placement in Section 5 is verified through tests.
