# PRD.md

## Smart Commerce AI — Product Requirements Document (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md
**Read By:** ARCHITECTURE.md, DATABASE.md, API.md, and all subsequent documents in this series.

---

## 1. Purpose

This document translates the business vision defined in PROJECT_BRIEF.md and the behavioral/decision-authority rules defined in AGENTS.md into concrete product requirements: what must exist, for whom, and why. It is the bridge between "why we're building this" and "how it will be built." ARCHITECTURE.md and every document after it must be traceable back to a requirement stated here.

This PRD describes **what the product does**, not **how it is technically implemented**. Data models belong to DATABASE.md. System design belongs to ARCHITECTURE.md. This document defines behavior, flows, and acceptance criteria only.

---

## 2. Scope

This PRD covers the MVP exactly as defined in AGENTS.md Section 9 — no more, no less. Every requirement in this document maps to an included MVP module. Every module explicitly excluded from MVP (Customers, Reports, Team Members, additional channels, etc.) is intentionally absent from this document, consistent with the MVP Discipline principle in AGENTS.md Section 6.

Where a requirement has a forward-compatibility implication (per the Extensibility Principle, AGENTS.md Section 14), it is noted — but no future-module behavior is specified here.

---

## 3. Product Summary

Smart Commerce AI is a multi-tenant SaaS platform where a business (**Store**) connects its Facebook Messenger Page, allows an AI agent to handle first-line customer conversation and availability checks, and retains full human control over whether any resulting order is actually fulfilled. The Store Owner manages Products, Inventory, and Orders from a single dashboard. A separate Platform Administrator manages the business of running the platform itself — Stores, Subscriptions, and system configuration — with no visibility into or interference with any Store's operational data beyond what is explicitly designed as admin-scoped.

---

## 4. Personas

### 4.1 Store Owner

A small or medium business owner in Libya selling through Facebook Messenger. Typically not technical. Needs to stop losing track of orders and stock, and wants the AI to handle repetitive customer questions without giving up control over what actually gets sold. In MVP, the Store Owner is the only user of their Store — there is no delegation to staff yet, so every workflow must be usable by one person managing the entire operation.

### 4.2 Platform Administrator

The Smart Commerce AI platform operator (founder, in MVP). Responsible for onboarding health, subscription and billing oversight, and platform-wide configuration. Does not participate in any Store's day-to-day selling workflow. Needs visibility into platform-level metrics (active Stores, trial conversions, subscription distribution) without needing to inspect individual Store data.

### 4.3 End Customer (Non-User)

The Store Owner's customer, messaging via Facebook Messenger. The End Customer never logs into Smart Commerce AI and has no account. They are represented in the system only as data attached to a conversation and, where a purchase intent is confirmed, an Order. This distinction matters: the End Customer is a **data subject**, not a **system user** — this is why there is no Customers module in MVP (AGENTS.md Section 9) even though customer data exists.

---

## 5. Product Principles (Product-Level Restatement)

These restate AGENTS.md Section 6 in product terms, since every feature requirement below must satisfy them:

- The Store Owner always has final say before inventory is committed to a sale.
- The AI is a conversational assistant, not a decision-maker — it can inform and propose, never approve or execute.
- A Store Owner should never need to leave the platform to understand the state of their business (stock, orders, subscription status).
- A Store's data is never visible to another Store, and the Platform Administrator does not casually browse into Store operations.

---

## 6. MVP Modules Overview

| Module                  | Primary User                              | Core Purpose                                             |
| ----------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Authentication          | Store Owner, Platform Administrator       | Secure, role-separated access                            |
| Store Registration      | Store Owner                               | Onboard a new Store and start a trial                    |
| Subscription Management | Store Owner, Platform Administrator       | Handle plan selection, trial, billing state              |
| Dashboard               | Store Owner                               | At-a-glance operational visibility                       |
| Products                | Store Owner                               | Define what is sellable                                  |
| Inventory               | Store Owner                               | Track what is actually in stock                          |
| Orders                  | Store Owner                               | Review and decide on customer purchase requests          |
| Messenger Integration   | Store Owner (setup), End Customer (usage) | Channel through which conversations happen               |
| n8n Integration         | System (invisible to users)               | Automation layer connecting Messenger, AI, and platform  |
| Settings                | Store Owner                               | Configure Store-level preferences                        |
| Audit Logs              | Store Owner, Platform Administrator       | Traceability of significant actions                      |
| Admin Console           | Platform Administrator                    | Platform-wide management, separate from Store operations |

---

## 7. Functional Requirements

### 7.1 Authentication

**Purpose:** Ensure only the correct person can access a given Store or the Admin Console, and that the two access paths never intersect.

| Requirement | Description                                                                                                          | Why                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| AUTH-1      | A user registers and authenticates with email and password (or equivalent credential method defined in SECURITY.md). | Baseline access control; no anonymous access to Store or Admin data.                                                                             |
| AUTH-2      | A Store Owner account is scoped to exactly one Store in MVP.                                                         | MVP has no Multi-user Workspaces (AGENTS.md Section 8); one owner, one Store, keeps the auth model simple and correct for current scope.         |
| AUTH-3      | A Platform Administrator account is entirely separate from Store Owner accounts and cannot access `/stores/*`.       | Enforces the Decision Authority and role-separation principle (AGENTS.md Section 8) — Administrators manage the platform, not individual Stores. |
| AUTH-4      | Session handling must distinguish Store-scoped sessions from Admin-scoped sessions at all times.                     | Prevents accidental privilege bleed between the two route trees (`/stores/*` vs `/admin/*`).                                                     |
| AUTH-5      | Password reset and account recovery flows are available to both roles.                                               | Standard product expectation; account lockout without recovery is a support burden and a trust issue for a paid product.                         |

### 7.2 Store Registration

**Purpose:** Convert a prospective business into an active Store with a running trial.

| Requirement | Description                                                                                          | Why                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| REG-1       | A new user registers a Store by providing business details and creating an owner account.            | This is the entry point to the product; must be low-friction since Store Owners are typically non-technical.                   |
| REG-2       | Store Registration requires phone verification before the trial is considered active.                | Explicit decision (Updated Project Decisions, Section 7) — reduces trial abuse and confirms a reachable real business contact. |
| REG-3       | A Store cannot begin serving customers via Messenger until a real Facebook Page is connected.        | Explicit decision — a Store without a connected Page has nothing to automate, and this also acts as a trial-abuse control.     |
| REG-4       | Upon successful registration and verification, the Store automatically receives a 14-day free trial. | Explicit decision (Updated Project Decisions, Section 7) — removes friction between signup and first value.                    |
| REG-5       | Each Store may receive exactly one free trial, ever.                                                 | Prevents trial abuse via repeated registration; explicit business rule (AGENTS.md Section 10, Rule 11).                        |

### 7.3 Subscription Management

**Purpose:** Let a Store move from trial to a paid plan, and let both the Store Owner and Platform Administrator understand current subscription state.

| Requirement | Description                                                                                                                                                           | Why                                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SUB-1       | Three subscription plans are available: Starter ($15/mo), Business ($35/mo), Pro ($85/mo).                                                                            | Defined pricing structure (Updated Project Decisions, Section 5).                                                                                                                                   |
| SUB-2       | Plans differ primarily in monthly AI Conversation allowance, plus support tier and future-feature access priority.                                                    | Explicit billing philosophy — AI conversations are the only metered resource because they carry real marginal cost (AGENTS.md Section 12).                                                          |
| SUB-3       | Products, Inventory, and Orders are never limited by plan, at any tier.                                                                                               | Explicit and non-negotiable per AGENTS.md Section 10, Rule 9 — this must be enforced as a product guarantee, not just a pricing-page claim.                                                         |
| SUB-4       | A Store Owner can view their current plan, AI conversation usage against their monthly limit, and trial/billing status at any time.                                   | Without this, Store Owners cannot self-manage their subscription, driving avoidable support load.                                                                                                   |
| SUB-5       | When a Store approaches or reaches its monthly AI conversation limit, the Store Owner must be clearly notified.                                                       | Prevents a Store's Messenger automation from silently failing to respond to customers — a direct business risk for the Store Owner.                                                                 |
| SUB-6       | The Platform Administrator can view and manage Subscription Plans (create/edit plan parameters) and view the subscription status of any Store.                        | Required for platform operation — plan configuration and billing oversight are Administrator responsibilities per AGENTS.md Section 8.                                                              |
| SUB-7       | Trial expiration without conversion to a paid plan results in a defined restricted state (read access to data, no active Messenger automation) rather than data loss. | Protects the Store Owner's data and trust, and preserves a path back to conversion — deleting data on trial expiry would be hostile to product-market-fit validation (PROJECT_BRIEF.md Section 20). |

### 7.4 Dashboard

**Purpose:** Give the Store Owner immediate operational awareness without requiring a full Reports module.

| Requirement | Description                                                                                                               | Why                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DASH-1      | The Dashboard displays, at minimum: total product count, total inventory count, and total order count.                    | Explicit scope decision (Updated Project Decisions, Section 2) — simple statistics replace the deferred Reports module.                                                        |
| DASH-2      | The Dashboard displays counts broken down by relevant state where meaningful (e.g., Orders by Pending/Approved/Rejected). | A single flat number is not actionable; state breakdown is the minimum needed for the Store Owner to know what requires attention today, without becoming an analytics module. |
| DASH-3      | The Dashboard does not include trend charts, time-series analysis, or exportable reports in MVP.                          | Explicitly deferred to the future Reports & Analytics module (AGENTS.md Section 9); building this now would violate MVP Discipline.                                            |

### 7.5 Products

**Purpose:** Let the Store Owner define what their business sells, as the foundation for both Inventory and Orders.

| Requirement | Description                                                                                | Why                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PROD-1      | A Store Owner can create, edit, and delete Products belonging to their Store.              | Core catalog management — nothing can be sold or checked for availability without a Product record.                                                              |
| PROD-2      | Each Product has, at minimum: a name, a price, and a status (active/inactive).             | Minimum viable definition needed for the AI to describe and price an item in conversation.                                                                       |
| PROD-3      | Product Images are not supported in MVP.                                                   | Explicit exclusion (PROJECT_BRIEF.md Section 9, reaffirmed in AGENTS.md Section 9) — text-based product description is sufficient to validate the core workflow. |
| PROD-4      | A Product cannot be permanently deleted while it exists in an active (non-terminal) Order. | Enforces AGENTS.md Section 10, Rule 7 — protects order and audit integrity; a Product can instead be deactivated.                                                |
| PROD-5      | The number of Products a Store may create is never limited by subscription plan.           | Explicit billing philosophy (AGENTS.md Section 10, Rule 9).                                                                                                      |

### 7.6 Inventory

**Purpose:** Maintain an accurate, real-time count of stock so the AI never promises what the Store cannot deliver.

| Requirement | Description                                                                                                                | Why                                                                                                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV-1       | Each Product has an associated stock quantity, viewable and editable by the Store Owner.                                   | Directly addresses the core problem in PROJECT_BRIEF.md Section 3 — inventory tracked informally or not at all.                                                                                         |
| INV-2       | The AI can query current stock quantity for a Product through the platform, but cannot modify it.                          | Enforces AGENTS.md Section 6 — AI assists, never decides or writes.                                                                                                                                     |
| INV-3       | Inventory quantity decreases only when an Order is approved by the Store Owner.                                            | Core business rule (PROJECT_BRIEF.md Section 11; AGENTS.md Section 10, Rule 1) — this is the platform's central guarantee against overselling.                                                          |
| INV-4       | Inventory quantity is never limited or gated by subscription plan.                                                         | Explicit billing philosophy (AGENTS.md Section 10, Rule 9).                                                                                                                                             |
| INV-5       | The Store Owner can manually adjust stock quantity outside the order flow (e.g., correcting a count, receiving new stock). | Real-world inventory requires manual correction (damaged goods, restocking, counting errors); without this, Inventory data will drift from reality and undermine the platform's core value proposition. |

### 7.7 Orders

**Purpose:** Capture customer purchase intent from Messenger and route it through a mandatory human approval gate before it affects inventory or is considered final.

| Requirement | Description                                                                                                                                                   | Why                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ORD-1       | An Order is created by the platform when a customer confirms purchase intent during an AI-handled Messenger conversation.                                     | Reflects the Core Workflow defined in PROJECT_BRIEF.md Section 10.                                                                |
| ORD-2       | A newly created Order always starts in **Pending** status.                                                                                                    | Non-negotiable per PROJECT_BRIEF.md Section 10 and AGENTS.md Section 10, Rule 1 — no Order bypasses review.                       |
| ORD-3       | An Order includes the customer information necessary to fulfill it (name, phone or Messenger identifier) even though there is no standalone Customers module. | Explicit clarification from Updated Project Decisions Section 2 — customer data lives on the Order, not in a separate CRM entity. |
| ORD-4       | The Store Owner can review a Pending Order and either **Approve** or **Reject** it.                                                                           | Core human-in-the-loop control defined in PROJECT_BRIEF.md Section 10 — this is the product's central trust mechanism.            |
| ORD-5       | Approving an Order decreases the relevant Inventory quantity and marks the Order as **Approved**.                                                             | PROJECT_BRIEF.md Section 10 workflow; enforced as a business rule in AGENTS.md Section 10, Rule 1.                                |
| ORD-6       | Rejecting an Order leaves Inventory unchanged and marks the Order as **Rejected**.                                                                            | Same source — rejection must have no side effects on stock.                                                                       |
| ORD-7       | Every Order belongs to exactly one Store and is never visible to another Store.                                                                               | AGENTS.md Section 10, Rule 8, and the Workspace/Store Isolation principle (Section 6).                                            |
| ORD-8       | The number of Orders a Store may create is never limited by subscription plan.                                                                                | Explicit billing philosophy (AGENTS.md Section 10, Rule 9).                                                                       |
| ORD-9       | Every Order approval or rejection produces an Audit Log entry.                                                                                                | AGENTS.md Section 10, Rule 6 — Orders are exactly the kind of state-changing action that must be traceable.                       |

### 7.8 Facebook Messenger Integration

**Purpose:** Provide the channel through which End Customers interact and through which the AI operates, without the platform ever depending on Messenger-specific logic in its core business rules.

| Requirement | Description                                                                                                                                | Why                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| MSG-1       | A Store Owner connects exactly one Facebook Page to their Store.                                                                           | Assumption confirmed by MVP scope — one Page per Store keeps identity and routing simple; multi-page support is a future consideration, not a current requirement. |
| MSG-2       | The platform must be able to detect and clearly display Messenger connection health (connected / disconnected / error) to the Store Owner. | If a Page disconnects silently, the Store stops receiving orders without knowing why — a severe, invisible business risk that the product must surface.            |
| MSG-3       | Reconnecting or replacing the connected Page is possible without losing existing Store data (Products, Inventory, Orders, history).        | Page tokens can expire or need reissuing in the real world; this must not be a destructive operation.                                                              |
| MSG-4       | Messenger is the only supported channel in MVP.                                                                                            | Explicit scope boundary (PROJECT_BRIEF.md Section 9; AGENTS.md Section 9) — WhatsApp, Instagram, etc. are future channels.                                         |

### 7.9 n8n Integration (Automation Layer)

**Purpose:** Move messages and events between Messenger, the AI, and the platform — without ever holding business logic.

| Requirement | Description                                                                                                                                                                     | Why                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N8N-1       | The platform exposes a stable interface for the automation layer to call (checking availability, submitting a proposed Order) without exposing internal implementation details. | Enforces the Integration Abstraction Principle (AGENTS.md Section 13) — the platform must not need to change if n8n is replaced.                                                    |
| N8N-2       | The automation layer cannot directly write to Inventory, approve Orders, or delete records under any condition.                                                                 | Same AI/automation boundary as INV-2 and AGENTS.md Section 6 — automation is a relay, not an actor with authority.                                                                  |
| N8N-3       | Failures in the automation layer (e.g., a workflow error, a delayed message) must be visible to the Store Owner as a degraded-service signal, not silently swallowed.           | Directly reflects the Error Handling Principles in AGENTS.md Section 11 — infrastructure failures must never be hidden from logs or, in this case, from the affected Store Owner.   |
| N8N-4       | This module is invisible to the Store Owner as a named tool — the Store Owner interacts with "Messenger automation," not with "n8n" as a concept.                               | Product-level reflection of the temporary nature of n8n (AGENTS.md Section 13) — the product experience must not be coupled to an implementation detail that is expected to change. |

### 7.10 Settings

**Purpose:** Let the Store Owner configure Store-level preferences relevant to MVP scope.

| Requirement | Description                                                                                            | Why                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| SET-1       | The Store Owner can view and edit basic Store profile information (business name, contact details).    | Baseline account management expectation.                                                                                                    |
| SET-2       | The Store Owner can manage the connected Facebook Page from Settings (connect, disconnect, reconnect). | Groups channel configuration in a predictable, discoverable place rather than scattering it across the product.                             |
| SET-3       | The Store Owner can view their current Audit Log from Settings or a dedicated section.                 | Gives the Store Owner direct access to the traceability guaranteed by AGENTS.md Section 6, without requiring platform support intervention. |
| SET-4       | Settings does not include team/user management in MVP.                                                 | Explicit exclusion — no Team Members module exists yet (AGENTS.md Section 8).                                                               |

### 7.11 Audit Logs

**Purpose:** Provide a traceable record of significant state-changing actions, per the non-negotiable Audit principle.

| Requirement | Description                                                                                                                                                                                                | Why                                                                                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUD-1       | Every state-changing action defined as significant (Order approval/rejection, Inventory manual adjustment, Subscription change, Settings change, Messenger connection change) produces an Audit Log entry. | Direct product expression of AGENTS.md Section 6 and Section 10, Rule 6.                                                                                                                        |
| AUD-2       | Each Audit Log entry records: timestamp, actor, action, entity, entity ID, previous state (when applicable), new state (when applicable), and an optional reason.                                          | Matches the exact structure defined in AGENTS.md Section 10, Rule 6 — this document does not redefine it, only confirms the product must expose it.                                             |
| AUD-3       | A Store Owner can view the Audit Log for their own Store only.                                                                                                                                             | Enforces Workspace/Store Isolation (AGENTS.md Section 6) — a Store Owner must never see another Store's audit trail.                                                                            |
| AUD-4       | A Platform Administrator can view Audit Logs across Stores for platform-operation purposes (e.g., investigating a support issue), through an explicitly admin-scoped view.                                 | Matches the isolation exception already defined in AGENTS.md Section 6 — cross-Store visibility exists only for the Administrator, and only through deliberate design, never incidental access. |

### 7.12 Admin Console

**Purpose:** Give the Platform Administrator the tools to run the platform as a business, fully separated from any individual Store's workflow.

| Requirement | Description                                                                                                                                | Why                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADM-1       | The Platform Administrator can view a list of all Stores, their subscription status, and trial state.                                      | Core operational visibility needed to run a subscription business.                                                                                                            |
| ADM-2       | The Platform Administrator can view platform-wide statistics (total Stores, active trials, active subscriptions by plan, conversion rate). | Directly supports the MVP success metrics defined in PROJECT_BRIEF.md Section 17 (e.g., "Customers successfully subscribe after the trial period").                           |
| ADM-3       | The Platform Administrator can manage Subscription Plans (pricing, AI conversation limits per plan).                                       | Required to adjust the business model as real-world usage data comes in during MVP validation.                                                                                |
| ADM-4       | The Platform Administrator can manage Platform Settings and system configuration.                                                          | Baseline platform operability requirement.                                                                                                                                    |
| ADM-5       | The Platform Administrator cannot view or modify a Store's Products, Inventory, or Orders directly.                                        | Enforces the Workspace/Store Isolation principle even against the platform's own operator — Administrator authority is platform-level, not Store-level (AGENTS.md Section 8). |

---

## 8. Non-Functional Requirements

| Requirement | Description                                                                                                                                                                                                                      | Why                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1       | Every request that reads or writes tenant-owned data must be scoped by Workspace/Store ID without exception.                                                                                                                     | Direct product-level consequence of AGENTS.md Section 10, Rule 5 — missing tenant scoping is a critical security defect, not a bug to fix later.              |
| NFR-2       | The AI's output must be validated by the platform before it can influence any business workflow (e.g., before an Order is created from AI-parsed intent).                                                                        | Enforces AI Output Validation (AGENTS.md Section 11) at the product level — a misparsed AI response must never directly become a system action.               |
| NFR-3       | The system must degrade gracefully if the automation layer (n8n or its future replacement) is unavailable — existing Store data (Products, Inventory, Orders) must remain fully accessible even if Messenger automation is down. | Reflects the platform-as-Single-Source-of-Truth principle — the Store Owner's ability to run their business must not depend on the automation layer's uptime. |
| NFR-4       | The product must be usable by a non-technical Store Owner without training.                                                                                                                                                      | Explicit target user profile (Section 4.1) — this is a Libyan SMB owner, not a developer; every MVP flow must be self-explanatory.                            |
| NFR-5       | All state-changing actions must produce deterministic, user-visible outcomes (success or a clear error) — no silent failures.                                                                                                    | Direct product expression of the Error Handling Principles in AGENTS.md Section 11.                                                                           |

---

## 9. Out of Scope for MVP

The following are intentionally not covered by any requirement in this document, consistent with AGENTS.md Section 9:

Customers CRM module, Reports & Analytics module, Team Members / multi-user roles within a Store, WhatsApp, Instagram, TikTok, Telegram, Snapchat, YouTube, E-commerce website, POS, Accounting, Supplier Management, Shipping Integration, Online Payments, Product Images, Mobile Applications, AI Analytics.

Any future requirement in one of these areas belongs to a future revision of this PRD, informed by MVP learnings, not to this document.

---

## 10. Success Criteria (Product-Level)

Restating PROJECT_BRIEF.md Section 17 in terms this PRD can be validated against:

- A Store Owner can go from registration to a connected, functioning Messenger automation without external help.
- A Store Owner can trust the platform's inventory count enough to stop using spreadsheets or paper.
- No Order ever decreases inventory without explicit Store Owner approval — zero exceptions, verifiable via Audit Logs.
- A meaningful share of trial Stores convert to a paid subscription before or at trial expiry.
- The Dashboard alone (without a Reports module) gives a Store Owner enough information to feel in control of daily operations.

---

## 11. Cross References

- **PROJECT_BRIEF.md** — source of the problem statement, core workflow, and business rules restated throughout this document.
- **AGENTS.md** — source of every "Why" justification tied to a non-negotiable principle, business rule, or behavioral rule; this PRD does not redefine those rules, only applies them to product requirements.
- **Updated Project Decisions (MVP)** — source of role simplification, scope reduction, and subscription plan specifics referenced throughout Sections 7.2, 7.3, and 7.6.
- Downstream: ARCHITECTURE.md must design a system capable of satisfying every requirement in Section 7 and Section 8 without violating any principle in AGENTS.md. DATABASE.md must model every entity implied here (Store, Product, Inventory, Order, Subscription, Audit Log) consistent with the Naming Principles defined in AGENTS.md Section 11.