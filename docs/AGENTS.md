# AGENTS.md

## Smart Commerce AI — Engineering & AI Agent Governance Document

**Version:** 1.0.0
**Status:** MVP
**Depends On:** PROJECT_BRIEF.md
**Read By:** All future documents in this series (PRD.md → ROADMAP.md), all human engineers, and all AI coding/engineering agents (e.g., Claude Code, Cursor, Copilot, or any LLM-based contributor) working on this codebase.

---

## 1. Purpose

This document defines how any agent — human or AI — must think, decide, and act while contributing to Smart Commerce AI. It exists because this project will be built with heavy AI assistance (documentation, code generation, refactoring), and AI agents do not retain context between sessions the way a human engineer retains institutional knowledge. AGENTS.md is the substitute for that institutional memory.

Every subsequent document (PRD, ARCHITECTURE, DATABASE, API, etc.) inherits the rules defined here. If a future document appears to contradict this one, this document wins, and the conflict must be flagged rather than silently resolved.

AGENTS.md answers one question above all others: **"When a rule is unclear or a decision must be made, what would a Smart Commerce AI engineer do?"**

---

## 2. Scope & Audience

This document applies to:

- Any AI agent generating code, documentation, database migrations, or configuration for this project.
- Any human engineer joining the project who needs the fastest possible path to correct context.
- Any future automated tooling (CI agents, code review bots) that need to validate contributions against project intent.

This document does **not** describe product features (see PRD.md) or system design (see ARCHITECTURE.md). It describes **behavior, boundaries, and decision-making authority.**

---

## 3. Document Hierarchy & Dependencies

Smart Commerce AI's documentation forms a strict dependency chain. No document may contradict a document above it in this list:

| Order | Document                      | Defines                                               |
| ----- | ----------------------------- | ----------------------------------------------------- |
| 0     | PROJECT_BRIEF.md              | Business vision, problem, MVP scope (source of truth) |
| 1     | **AGENTS.md** (this document) | Behavioral rules for all contributors, human or AI    |
| 2     | PRD.md                        | Product requirements derived from the brief           |
| 3     | ARCHITECTURE.md               | System design implementing the PRD                    |
| 4     | DATABASE.md                   | Data model implementing the architecture              |
| 5     | API.md                        | Contracts implementing the data model                 |
| 6     | FOLDER_STRUCTURE.md           | Codebase organization implementing the architecture   |
| 7     | CODING_STANDARDS.md           | Implementation conventions                            |
| 8     | SECURITY.md                   | Security controls across all layers                   |
| 9     | DEPLOYMENT.md                 | Release and infrastructure process                    |
| 10    | TESTING.md                    | Verification strategy                                 |
| 11    | TASKS.md                      | Actionable work breakdown                             |
| 12    | ROADMAP.md                    | Sequencing and future phases                          |

If any future document requires a decision not covered by a document above it in the chain, the correct action is to **document the gap explicitly**, not to invent a resolution silently.

---

## 4. Decision Authority

- PROJECT_BRIEF.md is the highest business authority.
- AGENTS.md is the highest engineering and behavioral authority.
- Explicit written founder decisions override undocumented assumptions.
- AI agents must never invent new business policies.
- If no documented decision exists, stop and request clarification instead of making assumptions.

---

## 5. Project Identity

**Name:** Smart Commerce AI
**Category:** Multi-tenant SaaS — Social Commerce Management Platform
**Phase 1 Market:** Libya
**Primary Channel (MVP):** Facebook Messenger
**Core Value Proposition:** Centralize inventory, orders, and AI-assisted customer conversation for small/medium businesses selling through social media, while keeping a human in the approval loop for every order.

Smart Commerce AI is **not** an e-commerce website builder, **not** a POS system, and **not** a general-purpose chatbot platform. It is an operational control layer that sits between a business's social selling activity and its inventory truth.

---

## 6. Core Principles (Non-Negotiable)

These principles override convenience, speed, or any individual document's suggestions. Any agent proposing a design that violates one of these must stop and flag the conflict rather than proceed.

| Principle                                 | Meaning                                                                                                                                                                                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Platform as Single Source of Truth**    | All business data and logic live inside Smart Commerce AI. No external tool (n8n, AI provider) is authoritative for any business fact.                                                                                                              |
| **AI Assists, Never Decides**             | The AI can converse, check availability, and propose an order. It cannot approve orders, modify inventory, delete records, or execute business logic.                                                                                               |
| **n8n Is Automation Only, and Temporary** | n8n moves events between Messenger, the AI, and the platform. It must never contain business rules, validation logic, or persistent state. It is expected to be replaced once the platform reaches roughly 50 active Stores.                        |
| **Human Approval Gate for Inventory**     | Inventory quantities change only when a Store Owner approves an order. Nothing in the system may bypass this gate, including AI-originated actions.                                                                                                 |
| **Workspace/Store Isolation**             | Every Store's data is fully isolated from every other Store. No cross-Store data access, querying, or leakage is acceptable under any circumstance, including for the Platform Administrator except through explicitly designed admin-scoped views. |
| **Every Important Action Is Audited**     | State-changing actions (order approval/rejection, inventory changes, subscription changes, settings changes) must produce an Audit Log entry. This is a design requirement, not an optional enhancement.                                            |
| **MVP Discipline**                        | Nothing outside the defined MVP scope (Section 10) is implemented, even if it seems small, easy, or "worth adding while we're here."                                                                                                                |

---

## 7. Terminology Standard

Two terms refer to the same tenant entity in this system. Both are used deliberately, in different contexts, and neither replaces the other:

| Term          | Used For                                                                                           | Example                                                        |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Workspace** | Technical/data-modeling context — schema, internal architecture references, tenant-isolation logic | "Each Workspace has isolated Products, Inventory, and Orders." |
| **Store**     | Product/UI-facing context — anything a Store Owner sees or interacts with                          | "The Store dashboard shows order count and inventory count."   |

Written as a pair — **Workspace/Store** — when a document needs to make explicit that both terms describe the same entity, particularly in cross-referencing sections.

All future documents must follow this convention. Do not silently standardize on one term across the whole codebase; the distinction between technical and product-facing language is intentional and must be preserved.

---

## 8. MVP Roles

Smart Commerce AI has exactly two roles in MVP. No additional roles, permission levels, or team structures exist yet.

| Role                       | Access Path | Authority                                                                                                                                                                                                                                    |
| -------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Platform Administrator** | `/admin/*`  | Manages Stores, Subscriptions, Subscription Plans, Platform Settings, System Configuration, and views Platform Statistics. Fully separated from Store-level access — an Administrator does not operate inside a Store's day-to-day workflow. |
| **Store Owner**            | `/stores/*` | The sole user inside a Store during MVP. Full control over that Store's Products, Inventory, Orders, Settings, and Messenger connection.                                                                                                     |

There is no Sales Employee, Inventory Employee, or Team Member role in MVP. Any design that assumes multiple users per Store is out of scope and belongs to a future "Multi-user Workspaces" module (see Section 13).

Agents must resist the temptation to "future-proof" by building permission granularity now. The correct future-proofing is a data model that does not need to be restructured later — not a permissions system that goes unused today.

*Route verification: `/stores/*` is confirmed as the current, intentional route for Store Owner access, consistent with the Updated Project Decisions document. No change applied.*

---

## 9. MVP Scope Boundaries

### Included

Authentication, Store Registration, Subscription Management, Dashboard (simple statistics), Products, Inventory, Orders, Facebook Messenger Integration, n8n Integration, Settings, Audit Logs.

### Explicitly Excluded from MVP

| Excluded Now                                                                        | Deferred To                         |
| ----------------------------------------------------------------------------------- | ----------------------------------- |
| Customers (dedicated CRM module)                                                    | Future CRM module                   |
| Reports (analytics/trends)                                                          | Future Reports & Analytics module   |
| Team Members / Sales & Inventory Employee roles                                     | Future Multi-user Workspaces module |
| WhatsApp, Instagram, TikTok, Telegram, Snapchat, YouTube                            | Future Omnichannel expansion        |
| E-commerce website, POS, Accounting, Supplier Management, Shipping, Online Payments | Future modules                      |
| Product Images                                                                      | Future release                      |
| Mobile Applications                                                                 | Future release                      |
| AI Analytics                                                                        | Future release                      |

A critical nuance: excluding the **Customers module** does not mean excluding customer data. Orders still carry customer information (name, phone, Messenger identifier). What is excluded is a dedicated customer management interface, history view, or CRM-style entity relationships. Any agent designing the data model must keep this distinction precise — see DATABASE.md when it is produced.

Similarly, excluding the **Reports module** does not mean the Dashboard is empty. The Dashboard shows simple counters (order count, product count, inventory count) — operational visibility without analytics.

---

## 10. Business Rules (Non-Negotiable)

These rules originate from PROJECT_BRIEF.md and the subsequent decisions document. They apply across every layer of the system and must be enforced in the architecture, not merely described in the UI.

1. Inventory decreases only after an order is approved by the Store Owner.
2. The AI never writes directly to the database or any persistent business record.
3. n8n is responsible only for automation and message relay — never business logic.
4. Business logic always resides inside the platform, never in an external tool.
5. Every Workspace/Store owns fully isolated data; no cross-tenant access. Every database query involving tenant-owned data must always be scoped by Workspace ID. Missing tenant scoping is considered a critical security defect.
6. Every important state-changing action creates an Audit Log entry. Every Audit Log entry should include:
   - Timestamp
   - Actor
   - Action
   - Entity
   - Entity ID
   - Previous State (when applicable)
   - New State (when applicable)
   - Optional Reason
7. A deleted Product cannot exist in an active (non-terminal) Order.
8. Every Order belongs to exactly one Workspace/Store.
9. Products, Inventory, and Orders are never usage-limited by subscription plan.
10. The only metered resource across subscription plans is **Monthly AI Conversations**.
11. Every new Store receives exactly one 14-day free trial, contingent on a connected real Facebook Page and phone verification.

---

## 11. Behavioral Rules for Engineering Agents

Any agent — human or AI — contributing to this project must follow these operating rules:

- **Never invent business logic that isn't grounded in PROJECT_BRIEF.md or a subsequent written decision.** If a gap exists, name the gap explicitly and propose an option rather than quietly deciding.
- **Never expand MVP scope** to include a deferred module, even partially, even as a "small addition." If a feature appears in Section 9's exclusion table, it does not appear in any MVP-stage design, schema, or interface — not even as an empty stub, unless explicitly required for forward-compatibility (see Section 13).
- **Never hardcode a specific AI provider or n8n-specific behavior into core business logic.** All external integrations are called through an abstraction; the platform's logic must not know or care whether the automation layer is n8n or a future internal service.
- **Never bypass the human approval gate** for inventory changes, regardless of how confident an AI-originated suggestion is.
- **Never treat "Workspace" and "Store" as an invitation to merge terminology.** Use each in its correct context per Section 7.
- **Never introduce implicit behavior.** Every business rule must be:
  - documented,
  - traceable,
  - testable.
  Hidden assumptions are considered implementation defects.
- **Business logic must never live inside SQL or database procedures.** The database protects data integrity through constraints. Business behavior belongs to the application layer.
- **When uncertain, escalate rather than assume.** A wrong assumption compounds across every downstream document; a flagged question does not.
- **Every document produced must cross-reference the documents it depends on**, so a reader can trace any decision back to its origin in PROJECT_BRIEF.md or this document.

### Naming Principles

- Use singular names for entities.
- Use plural names only for collections.
- Avoid abbreviations unless universally accepted.
- Use consistent terminology across documentation, APIs, database, and code.

### API Stability

Public APIs should remain backward compatible within the same major version whenever reasonably possible. Breaking API changes require explicit documentation.

### Error Handling Principles

- Fail loudly.
- Never silently ignore business errors.
- Return deterministic errors.
- Log unexpected failures.
- Never hide infrastructure failures from system logs.

### Security by Default

- Security takes precedence over convenience.
- Apply the principle of least privilege.
- Every feature should be secure by default.
- Sensitive operations require explicit authorization.

### AI Output Validation

All AI-generated output is considered untrusted input. AI responses must always be validated before affecting business workflows or persistent data.

---

## 12. Subscription & Billing Philosophy

| Plan     | Price     | Primary Differentiator                                                           |
| -------- | --------- | -------------------------------------------------------------------------------- |
| Starter  | $15/month | One connected Facebook Page, limited monthly AI conversations, basic dashboard   |
| Business | $35/month | Higher AI conversation limit, better support, priority access to future features |
| Pro      | $85/month | Highest AI conversation limit, priority support, early feature access            |

The billing model exists to reflect actual operational cost. AI conversations are the one resource with a direct, variable cost to the platform; Products, Inventory, and Orders have effectively no marginal cost and are therefore never restricted. Any future plan design must preserve this principle unless a new deliberate decision states otherwise.

---

## 13. Integration Abstraction Principle

n8n is explicitly a transitional tool, expected to be phased out once the platform reaches approximately 50 active Stores. This has a direct architectural consequence that every future document must respect:

- Messenger, AI, and any future channel integrations must be accessed through internal service interfaces defined by the platform — not referenced by n8n-specific concepts in core business code.
- The platform's business logic should be able to answer "did an automation layer fail to deliver a message" without knowing whether that automation layer is n8n or its eventual replacement.
- Replacing n8n in the future should be an integration-layer swap, not a rewrite of Orders, Inventory, or Products logic.

ARCHITECTURE.md must formalize this as a distinct architectural layer.

---

## 14. Extensibility Principle

The platform must be architected so that the following future modules can be added without major refactoring, while none of them are implemented in MVP:

Companies, Multi-user Workspaces, Customers CRM, Reports & Analytics, WhatsApp, Instagram, TikTok, Telegram, Snapchat, Ecommerce Website, Shipping, Payments, AI Analytics.

The practical implication for this document series: schema and architecture decisions should avoid choices that would force a breaking migration later (for example, assuming exactly one channel per Store forever, or exactly one user per Store forever at the database level) — without building speculative infrastructure for features that don't exist yet. The standard to apply is **"don't block the door, but don't build the room."**

---

## 15. Best Practices for Contributors

- Treat PROJECT_BRIEF.md and this document as authoritative over general SaaS conventions when the two conflict.
- Prefer explicit, named business rules over implicit assumptions baked into code or schema.
- Prefer simple, boring solutions appropriate to MVP scale over sophisticated architecture the project doesn't yet need.
- Keep every integration point (Messenger, AI, future channels) behind a clear interface boundary.
- Write every document assuming the next engineer or agent has zero prior context beyond the documents that precede it in the dependency chain.

---

## 16. Future Considerations

As the platform grows past MVP, this document itself will need revision to introduce:

- Additional roles once Multi-user Workspaces ships.
- Expanded behavioral rules once multiple AI-originated actions exist beyond conversation handling.
- Formal contribution guidelines once the team grows beyond a single founder-driven engineering process.

These are noted here so future agents understand that AGENTS.md is expected to evolve, but only through deliberate revision — never through silent drift introduced by any single document downstream.

---

## 17. Cross References

- **PROJECT_BRIEF.md** — origin of vision, problem statement, and MVP objectives.
- **Updated Project Decisions (MVP)** — origin of role simplification, scope reduction, subscription plan definitions, and the n8n-temporary principle.
- Downstream: every document from PRD.md onward inherits the principles, terminology, and behavioral rules defined here.

---

### Summary of changes applied in this revision

- Inserted new **Section 4 — Decision Authority** (all subsequent sections renumbered accordingly, content unchanged otherwise).
- Added **"Never introduce implicit behavior"** rule to Behavioral Rules for Engineering Agents.
- Added **Naming Principles** subsection to Behavioral Rules for Engineering Agents.
- Added **"Business logic must never live inside SQL or database procedures"** rule to Behavioral Rules for Engineering Agents.
- Expanded the Audit Log rule (Business Rules) with required entry fields.
- Strengthened the Workspace Isolation rule (Business Rules) with mandatory tenant-scoping language.
- Added **API Stability** subsection.
- Added **Error Handling Principles** subsection.
- Added **Security by Default** subsection.
- Added **AI Output Validation** rule.
- Verified the Store Owner route (`/stores/*`) against project decisions — confirmed correct, no change made.

No existing content, wording, principles, or structure outside these insertions was altered.

## Bug Handling Rules

Critical bugs:
- Fix immediately
- Add regression test

Business logic bugs:
- Add failing test first
- Then fix the code