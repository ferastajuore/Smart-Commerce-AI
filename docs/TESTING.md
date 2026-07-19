# TESTING.md

## Smart Commerce AI — Testing Strategy (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DB.md, API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md, DEPLOYMENT.md
**Read By:** TASKS.md, ROADMAP.md

---

## 1. Purpose

This document defines how Smart Commerce AI verifies that the system does what PRD.md, ARCHITECTURE.md, and SECURITY.md say it must do. It answers **how correctness and safety are proven**, not what correct behavior is (PRD.md), how the system is structured (ARCHITECTURE.md), or how CI enforces gates operationally (DEPLOYMENT.md Section 6).

Every document in this series has deferred a concrete testing obligation here:

- CODING_STANDARDS.md Section 12: "Testing conventions... belongs to TESTING.md."
- SECURITY.md Section 14: "Security test cases and penetration-testing scope — belongs to TESTING.md."
- DEPLOYMENT.md Section 6: the CI test gate is defined here, not there.
- DEPLOYMENT.md Section 12: "Concrete test strategy, coverage expectations, and what blocks a merge as a 'failing test' — belongs to TESTING.md."

This document resolves each of those deferrals. Where a testing decision is not yet made (e.g., a specific coverage percentage), it is flagged explicitly as a gap per AGENTS.md Section 4, not silently assumed.

---

## 2. Testing Philosophy

Restating AGENTS.md Section 11's Behavioral Rules for Engineering Agents in testing terms:

- **Every business rule must be testable, not just documented.** AGENTS.md Section 11 states that hidden assumptions are implementation defects. A business rule with no corresponding test is, for the purposes of this document, treated the same way — undiscoverable correctness is not correctness.
- **Tests verify boundaries, not implementation detail.** Consistent with ARCHITECTURE.md's modular monolith design (Section 3, Section 5), tests target the behavior exposed by a module's `services/`/`actions/` functions — not the internal shape of a Prisma query or a private helper. This keeps tests resilient to refactors that don't change behavior, and fragile to the ones that do.
- **The non-negotiable rules get the most test weight.** AGENTS.md Section 10's eleven Business Rules — the Human Approval Gate, tenant isolation, AI never writing directly, audit logging on every state change — are the platform's core trust guarantees per PROJECT_BRIEF.md Section 20. Test coverage is prioritized toward these rules first, ahead of UI polish or edge-case completeness elsewhere.
- **A failing test blocks a merge; it is never a suggestion.** Per DEPLOYMENT.md Section 6, this is enforced as a CI gate, matching the same discipline already applied to lint and type checks.
- **MVP Discipline applies to testing too.** This document does not mandate a coverage percentage, a specific testing framework beyond what's implied by the confirmed stack, or exhaustive UI/E2E automation for a founder-driven MVP team. Effort is proportional to risk, per Section 3.

---

## 3. Test Levels and Where Effort Goes

| Test Level                 | What It Verifies                                                                                                    | Priority in MVP                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests                 | A single module function's logic in isolation (Section 4)                                                           | High — cheapest to write, fastest to run, covers business-rule logic directly                                                                             |
| Integration tests          | Multiple modules or a module + database working together (Section 5)                                                | High — this is where the Human Approval Gate, tenant isolation, and Audit Log guarantees are actually proven                                              |
| API / contract tests       | The `/api/integration/v1/*` surface behaves exactly as API.md specifies, against untrusted-shaped input (Section 6) | High — this is the platform's only externally reachable HTTP surface (FOLDER_STRUCTURE.md §4) and its primary adversarial-input boundary (SECURITY.md §8) |
| Server Action tests        | Store Owner and Administrator-facing business operations (Section 7)                                                | High — this is where most PRD.md functional requirements are actually exercised                                                                           |
| End-to-end (browser) tests | Full user flows through the UI                                                                                      | **Deferred.** Not included in MVP test scope — see Section 13                                                                                             |

**Why no end-to-end browser automation in MVP:** consistent with MVP Discipline (AGENTS.md §9) and DEPLOYMENT.md Section 3's no-staging-environment decision, maintaining a browser-automation suite (tooling, flaky-test triage, CI runtime) is a cost disproportionate to a founder-driven team's current capacity. Integration and Server Action tests already exercise real business logic against a real database; what they don't cover is rendering and client-side interaction, which is verified manually before each release in MVP. This is flagged as a gap to close as the team grows, not a permanent decision.

---

## 4. Unit Testing Strategy

**Scope:** Pure or near-pure logic inside a single module's `services/` layer (FOLDER_STRUCTURE.md §5) — functions that make a business decision but do not themselves require a live database to verify (e.g., price total calculation, subscription usage threshold logic, validation-schema edge cases).

**Requirements:**

- Every function in `modules/*/services/` that encodes a business rule from PRD.md or AGENTS.md Section 10 has at least one unit test covering its primary path and its primary failure path (per CODING_STANDARDS.md Section 6's `AppError` convention).
- Unit tests do not hit a real database. Where a function necessarily touches `data/`, it is either tested at the integration level instead (Section 5) or the pure decision logic is factored out and tested separately — this mirrors CODING_STANDARDS.md Section 5's data-integrity-vs-business-logic distinction applied to test design.
- Zod schemas under `modules/integration/validation/` (CODING_STANDARDS.md §7) are unit tested directly against both valid and adversarial payload shapes, since this is the platform's primary untrusted-input boundary (SECURITY.md §8).

**Out of scope for unit tests:** anything requiring tenant scoping, a database transaction, or cross-module interaction — those are integration-level concerns (Section 5).

---

## 5. Integration Testing Strategy

**Scope:** A module's `services/`/`actions/` functions exercised against a real (test) PostgreSQL database, including cross-module calls explicitly permitted by ARCHITECTURE.md Section 5's boundary table.

**Requirements:**

- Integration tests run against an isolated test database, never against the production or local-development database — matching DEPLOYMENT.md Section 3's environment separation principle applied to testing.
- Each test run begins from a known schema state (migrations applied per DEPLOYMENT.md Section 7.2) and known seed data, and cleans up after itself, so tests are independent of execution order and repeatable.
- The following business-critical flows are integration-tested end-to-end at the module level, because they cross module boundaries and cannot be proven correct by unit tests alone:
  - `createPendingOrder()` → Order created in `PENDING` status, Audit Log entry written (ORD-2, ORD-9, ARCHITECTURE.md §11 step 9).
  - `approveOrder()` → Order status transitions to `APPROVED`, `decrementStock()` executes, Audit Log entry written, all inside one transaction (ORD-5, ARCHITECTURE.md §8).
  - `rejectOrder()` → Order status transitions to `REJECTED`, Inventory is unchanged, Audit Log entry written (ORD-6).
  - `adjustStockManually()` → Inventory quantity changes, Audit Log entry written (INV-5).
  - `canConsumeAiConversation()` / `recordAiConversationUsage()` → usage correctly tracked against the Workspace's plan limit (SUB-2, SUB-4, ARCHITECTURE.md §9).
  - `registerStore()` → `User` and `Workspace` created in one transaction with correct initial trial state (REG-1, REG-4, API.md §9).
- Tenant-scoped data-access functions (any function taking `workspaceId`, per ARCHITECTURE.md §7 and CODING_STANDARDS.md §4) are integration tested to confirm they return **only** data belonging to the given Workspace — this is the concrete verification of Section 9's isolation requirement, not just a code-review convention.

---

## 6. API and Integration Layer Testing

**Scope:** `/api/integration/v1/availability` and `/api/integration/v1/orders` (API.md Section 6) — the platform's only externally reachable HTTP surface.

Per SECURITY.md Section 8, AI-originated content is treated as adversarial input, not merely untrusted input. Testing at this boundary must reflect that:

| Test Case                                                             | Verifies                                                                                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Valid `availability` request                                          | Returns correct `matches` with live `quantityAvailable` (API.md §6.1)                                                                 |
| Valid `orders` request                                                | Creates an Order in `PENDING` status only, with server-derived `totalAmount` (API.md §6.2)                                            |
| `orders` request with a caller-supplied price                         | Price is ignored; `unitPriceAtOrder` is always re-derived server-side (API.md §6.2, Step 3)                                           |
| `orders` request with a caller-supplied `"approved"` field or status  | Rejected or ignored — this endpoint has no code path to `approveOrder()` (API.md §6.2, Step 5; ARCHITECTURE.md §6.2)                  |
| `orders` request for a quantity exceeding current stock               | Fails with `INSUFFICIENT_STOCK`, even if an earlier `availability` call reported the item in stock (API.md §6.2, Step 2; API.md §6.4) |
| `orders` request referencing a `productId` from a different Workspace | Fails with `NOT_FOUND`, never `FORBIDDEN` (API.md §10; SECURITY.md §5.2)                                                              |
| Request with missing/invalid Integration Layer credential             | Fails with `UNAUTHORIZED` (API.md §10)                                                                                                |
| Malformed or oversized payload                                        | Fails with `VALIDATION_ERROR` before any module logic runs (SECURITY.md §8)                                                           |
| Workspace has exhausted its monthly AI conversation allowance         | `availability` and `orders` both fail with `AI_CONVERSATION_LIMIT_REACHED`, not degraded/partial results (API.md §6.1; PRD.md SUB-5)  |
| Credential scoped to Workspace A used against Workspace B's data      | Fails — credential scope is Workspace-bound and never leaks cross-tenant access (SECURITY.md §6)                                      |

These cases are the direct test-level implementation of API.md Section 9's shared error-code vocabulary — every code in that table has at least one corresponding test case here or in Section 7.

---

## 7. Server Actions Testing

**Scope:** Store Owner (`/stores/*`) and Platform Administrator (`/admin/*`) Server Actions listed in API.md Sections 7 and 8.

**Requirements:**

- Every Server Action is tested for its authenticated, correctly-scoped success path, matching its PRD.md requirement reference (API.md §7/§8 tables).
- Every Server Action is tested for its `CONFLICT` paths where state matters — e.g., approving an already-`APPROVED` Order, deleting a `Product` referenced by a non-terminal Order (PROD-4).
- Every Server Action that mutates state is tested to confirm it produces the correct Audit Log entry as part of the same transaction (Section 10, ARCHITECTURE.md §10) — not merely that the primary state change occurred.
- Admin-only Server Actions (API.md §8) are tested to confirm they never return Product, Inventory, or Order contents for any Workspace (ADM-5) — this is tested explicitly, not assumed from the absence of such a code path, since ADM-5 is a hard product guarantee.

---

## 8. Authentication and Session Security Tests

Directly verifies SECURITY.md Sections 4 and 5.

| Test Case                                                                                | Verifies                                                                                                                                                               |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login with correct credentials                                                           | Session established with correct `role` and, for `STORE_OWNER`, correct `workspaceId` (SECURITY.md §4.2)                                                               |
| Login with incorrect credentials                                                         | Fails without revealing whether the email exists (standard anti-enumeration practice)                                                                                  |
| `STORE_OWNER` session requesting `/admin/*`                                              | Blocked at the layout level before any Admin module code executes (SECURITY.md §4.3, FOLDER_STRUCTURE.md §4)                                                           |
| `PLATFORM_ADMIN` session requesting `/stores/*`                                          | Blocked at the layout level, symmetric to the above                                                                                                                    |
| A Workspace transitions to `SUSPENDED` mid-session                                       | The next sensitive action re-verifies status against the database and is denied, not trusted from the token alone (SECURITY.md §4.2)                                   |
| Session with no re-verification on a sensitive action                                    | Not permitted — every sensitive action independently checks authority per SECURITY.md §5.1, tested by confirming a request cannot succeed on routing-layer trust alone |
| Password reset flow                                                                      | Completes correctly and does not leak account existence (AUTH-5)                                                                                                       |
| OTP verification (REG-2)                                                                 | Rejects expired, reused, or excessive attempts, consistent with SECURITY.md §4.4's rate-limiting requirement                                                           |
| Rate-limited endpoints (`login`, `requestPasswordReset`, `verifyPhone`, `registerStore`) | Return a deterministic rate-limit error rather than silently dropping requests, per SECURITY.md §9                                                                     |

---

## 9. Workspace and Tenant Isolation Tests

This is the single most important test category in the suite, per Section 2's priority principle and AGENTS.md Section 10, Rule 5 ("Missing tenant scoping is considered a critical security defect").

**Requirements:**

- For every tenant-owned entity (Product, Inventory, Order, MessengerConnection, Subscription, AuditLog — DB.md Section 4), an isolation test exists that: creates data in two distinct Workspaces, authenticates as a Store Owner of Workspace A, and asserts that no read or write operation can access or affect Workspace B's data.
- Cross-tenant access attempts against an entity by ID (e.g., requesting another Workspace's Order) return `NOT_FOUND`, never `FORBIDDEN` — tested explicitly, since this is a deliberate anti-enumeration control (API.md §10, SECURITY.md §5.2), not an incidental error-code choice.
- The Admin Module's data-access path (`modules/admin/data/`) is tested to confirm it can read cross-tenant **metadata only** (Workspace status, subscription, trial state) and cannot read Product, Inventory, or Order contents (SECURITY.md §5.3, PRD.md ADM-5) — any pull request touching this path requires this test suite to pass without exception, consistent with SECURITY.md's explicit call-out of this boundary as review-sensitive.
- A regression test exists asserting that every tenant-scoped data-access function signature requires `workspaceId` as a parameter — implemented as a static/lint-adjacent check where feasible (FOLDER_STRUCTURE.md §7) and backed by the runtime tests above.

---

## 10. Human Approval Gate Tests

Directly verifies ARCHITECTURE.md Section 8 and PRD.md ORD-4 through ORD-9 — PROJECT_BRIEF.md Section 20's central trust mechanism.

| Test Case                                                                                                                         | Verifies                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `proposeOrder()` via the Integration Layer                                                                                        | Order is always created as `PENDING`, never any other status, regardless of payload content (ARCHITECTURE.md §6.2)                                                  |
| Attempt to call `approveOrder()`/`rejectOrder()` from a non-Store-Owner context (e.g., simulated Integration Layer or Admin call) | Fails — these functions are reachable only from an authenticated Store Owner action scoped to the Order's own Workspace (ARCHITECTURE.md §8)                        |
| `approveOrder()` success path                                                                                                     | Order becomes `APPROVED`, `Inventory.quantity` decreases by exactly the ordered quantity, Audit Log entry written — all three, or none, in one transaction          |
| Simulated failure mid-transaction (e.g., forced error after status update, before Inventory decrement)                            | The entire transaction rolls back — no partial state (Approved-but-not-decremented) is ever observable                                                              |
| `rejectOrder()` success path                                                                                                      | Order becomes `REJECTED`, Inventory is provably unchanged, Audit Log entry written                                                                                  |
| Two concurrent `approveOrder()` calls against the same Order                                                                      | Only one succeeds; the second fails deterministically (`CONFLICT`), never double-decrementing Inventory                                                             |
| Approving an Order whose quantity now exceeds current stock (stock changed since the Order was proposed)                          | Fails with `INSUFFICIENT_STOCK` rather than allowing Inventory to go negative (DB.md §9's CHECK constraint as a backstop, application logic as the primary control) |
| `decrementStock()` called from any code path other than `orders/services/approveOrder()`                                          | Not reachable — verified as an import-boundary/lint test (FOLDER_STRUCTURE.md §5.1) backed by a runtime assertion that no other caller exists in the codebase       |

---

## 11. Integration Layer and AI Output Validation Tests

Directly verifies ARCHITECTURE.md Section 6.4 and AGENTS.md's AI Output Validation rule (Section 11): all AI-generated output is untrusted input and must be validated before affecting business workflows.

- Every field accepted by `/api/integration/v1/*` is tested against its Zod schema with: valid input, missing required fields, wrong types, oversized strings/arrays, and unexpected extra fields — confirming rejection with `VALIDATION_ERROR` in every invalid case (SECURITY.md §8).
- A specific test class exists for **stale-data manipulation**: an `availability` check returns a result, the underlying stock is then changed (simulating a second concurrent sale), and the subsequent `proposeOrder()` call using the original availability data is verified to be re-checked against current state rather than trusted (API.md §6.4).
- A specific test class exists for **adversarial quantity/price manipulation**: payloads simulating a manipulated AI conversation (extreme quantities, a supplied price different from the Product's actual price) are verified to never influence the resulting Order's `unitPriceAtOrder` or bypass stock re-verification (SECURITY.md §8).
- Failures in the automation layer (a malformed or unreachable n8n call) are tested to confirm existing Store data remains fully accessible via `/stores/*` regardless of automation-layer health (PRD.md NFR-3) — this is tested by simulating the automation layer as unavailable and confirming the Store Owner-facing application is unaffected.

---

## 12. Audit Log Testing

Directly verifies ARCHITECTURE.md Section 10 and PRD.md AUD-1 through AUD-4.

- Every state-changing action named in AGENTS.md Section 10, Rule 6 (Order approval/rejection, Inventory manual adjustment, Subscription change, Settings change, Messenger connection change) is tested to confirm it produces exactly one Audit Log entry with all required fields (timestamp, actor, action, entity, entity ID, previous state, new state, optional reason).
- A test confirms Audit Log entries are immutable — no exposed function can update or delete an existing entry (ARCHITECTURE.md §10).
- A test confirms a Store Owner's `getAuditLog()` returns only their own Workspace's entries (AUD-3), and a separate test confirms the Administrator's cross-Workspace `getAuditLog()` (AUD-4) uses the explicitly separate Admin data-access path rather than a parameterized version of the Store-facing function (SECURITY.md §5.3).
- A test confirms that a simulated failure during a state-changing operation (e.g., a forced error immediately after the primary state change) results in **neither** the state change nor the Audit Log entry persisting — proving they are written in the same transaction, not as a fire-and-forget side effect (ARCHITECTURE.md §10).

---

## 13. What This Document Deliberately Defers

Consistent with MVP Discipline (AGENTS.md §9):

- **End-to-end browser automation** — not included in MVP scope (Section 3); manual verification substitutes for now, to be revisited per Section 15.3 of ROADMAP.md.
- **Load and performance testing** — no defined performance target exists yet in any prior document; this is flagged as a gap, not silently assumed to be "fine," and should be addressed once real usage data exists (consistent with DEPLOYMENT.md Section 10's lightweight-monitoring-first approach).
- **Formal penetration testing** — SECURITY.md Section 14 defers "security test cases and penetration-testing scope" to this document; this document defines functional security test cases (Sections 8–11) but does not define a formal third-party penetration test process, which is flagged as appropriate to schedule once the platform has paying customers, not before.
- **A numeric code-coverage target** — no specific percentage is mandated. Coverage is directed by risk (Section 2), not a blanket metric; introducing a coverage-percentage gate is a future decision to be made explicitly if test-quality drift becomes a real observed problem, not a default assumption.
- **Automated accessibility testing** — not addressed in any prior document; flagged as an explicit gap for a future revision.

---

## 14. CI Testing Requirements

Implements the "Automated tests" gate referenced in DEPLOYMENT.md Section 6.

- The full automated test suite (unit, integration, API/contract, Server Action) runs on every pull request targeting the production branch, and a failing test blocks merge — no exceptions, matching the discipline already applied to lint, type-check, and format gates (DEPLOYMENT.md §6).
- Integration and API tests run against an ephemeral or reset test database per DEPLOYMENT.md's environment-separation principle (Section 3) — never against any shared persistent state that could let one test run's leftover data mask a failure in the next.
- Until this document's suite reaches full coverage of Sections 9–12 (tenant isolation, Human Approval Gate, Integration Layer validation, Audit Log), the Security Review Checklist (SECURITY.md §13) continues to apply as manual review discipline alongside CI, per DEPLOYMENT.md Section 6's interim-substitute note — the two are complementary during MVP build-out, not sequential.
- A pull request that touches `modules/orders/services/`, `modules/inventory/services/decrementStock`, `modules/admin/data/`, or `modules/integration/validation/` requires the corresponding test sections above (10, 9, 11) to be present and passing — these are the highest-risk boundaries in the system per Section 2 and SECURITY.md's threat model (Section 3), and are treated with proportionally higher review scrutiny.

---

## 15. Cross References

- **AGENTS.md** — Section 10's Business Rules and Section 11's Behavioral Rules are the direct source of Section 2's prioritization and the specific test requirements in Sections 9–12.
- **ARCHITECTURE.md** — Section 6 (Integration Abstraction Layer), Section 7 (Tenant Isolation), Section 8 (Human Approval Gate), and Section 10 (Audit Logging) are verified concretely by Sections 11, 9, 10, and 12 of this document respectively.
- **API.md** — Section 6's endpoint contracts and Section 10's error-code vocabulary are the direct source of Section 6's test-case table; every error code in API.md Section 10 has a corresponding test case here.
- **SECURITY.md** — Section 13's Security Review Checklist and Section 8's AI Output Validation requirements are made verifiable through Sections 9, 11, and 14 of this document; Section 14's deferral of "security test cases" to this document is resolved in Sections 8–11.
- **DEPLOYMENT.md** — Section 6's CI gate table references this document's suite directly; Section 12's deferral of "concrete test strategy" is resolved in Sections 3–7 and Section 14 of this document.
- **CODING_STANDARDS.md** — Section 12's deferral of "testing conventions" is resolved here; Section 6's `AppError` convention is the direct basis for the failure-path test requirement in Section 4.
- Downstream: TASKS.md must break this document's test requirements into concrete implementation work per milestone. ROADMAP.md must schedule the deferred items in Section 13 against the appropriate future phase.