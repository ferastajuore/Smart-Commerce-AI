# ROADMAP.md

## Smart Commerce AI — Product & Platform Roadmap (MVP Evolution)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DB.md, API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md, DEPLOYMENT.md, TESTING.md, TASKS.md
**Read By:** All future documents in this series (per AGENTS.md Section 3, this document sits at the end of the current chain)

---

## 1. Purpose

This document sequences the MVP build (TASKS.md) and its post-launch evolution into calendar-oriented phases, and states explicitly what triggers the platform to move beyond MVP Discipline (AGENTS.md §9) into its Future Vision (PROJECT_BRIEF.md §18). It answers **when things happen and what condition justifies moving to the next phase** — not what gets built (TASKS.md), how it's designed (ARCHITECTURE.md), or how it's verified (TESTING.md).

This document introduces no new features. Every capability named in a phase below already exists as a requirement in PRD.md or a deferred item named in AGENTS.md Section 9/Section 14, DB.md Section 8, ARCHITECTURE.md, or SECURITY.md/DEPLOYMENT.md's explicit deferral sections. Where this document names a future capability, it is restating a deferral already made elsewhere, with a phase and trigger attached — never inventing a new one.

---

## 2. How Phases Relate to Milestones

TASKS.md's sixteen milestones are the unit of execution; this document's five phases are the unit of business sequencing. The mapping is direct:

| Phase                           | TASKS.md Milestones                                                 |
| ------------------------------- | ------------------------------------------------------------------- |
| Phase 1: Foundation             | M1–M5                                                               |
| Phase 2: Core Commerce Features | M6–M8, M12                                                          |
| Phase 3: AI Integration         | M9–M11                                                              |
| Phase 4: Production Readiness   | M13–M16                                                             |
| Phase 5: Post-MVP Scaling       | Not in TASKS.md — begins only after Phase 4's exit criteria are met |

Phases 1–4 together constitute the MVP as scoped by AGENTS.md Section 9 and PRD.md. Phase 5 is explicitly **outside** the MVP and is not built until the MVP has validated demand, per PROJECT_BRIEF.md Section 20's stated MVP goal.

---

## Phase 1: Foundation

**Goals:** Establish a correctly structured, secure-by-default codebase and a functioning account/tenant model — the prerequisite for every commerce feature that follows. No commerce capability (Products, Inventory, Orders) is usable yet; this phase is purely structural.

**Included Capabilities:**

- Project skeleton matching FOLDER_STRUCTURE.md exactly (TASKS.md M1)
- Full database schema per DB.md (TASKS.md M2)
- Authentication and role-separated sessions, Store Owner and Platform Administrator (TASKS.md M3)
- Tenant/Workspace isolation mechanism (TASKS.md M4)
- Store Registration, phone verification, trial assignment (TASKS.md M5)

**Deferred Items:** Every commerce and AI capability — Products, Inventory, Orders, Messenger, Subscriptions, Admin Console — is deferred to Phases 2–3. This phase deliberately produces a platform with accounts but nothing to sell yet.

**Exit Criteria:**

- A Store Owner can register, verify their phone, and receive an active trial, scoped to a fully isolated Workspace.
- A Platform Administrator account exists and is provably separated from Store Owner access, per TESTING.md Section 8.
- All TESTING.md Section 9 (Tenant Isolation) test cases pass for every entity that exists at this point.
- CI enforces type-check, lint, format, and import-boundary gates (DEPLOYMENT.md §6).

---

## Phase 2: Core Commerce Features

**Goals:** Give the Store Owner a fully functioning manual operation — the ability to define what they sell, track what's in stock, and manage orders — independent of any AI or Messenger automation. This validates the platform's Single Source of Truth value on its own, per ARCHITECTURE.md Section 2's Platform-as-Single-Source-of-Truth goal, before automation is layered on top.

**Included Capabilities:**

- Products Module: create, edit, deactivate, delete (TASKS.md M6, PRD.md PROD-1–5)
- Inventory Module: stock tracking, manual adjustment (TASKS.md M7, PRD.md INV-1, INV-4, INV-5)
- Orders Module: creation (manually seedable for this phase, since Messenger integration doesn't exist yet), listing, retrieval (TASKS.md M8, PRD.md ORD-1–3, ORD-7, ORD-8)
- Subscription Module: plans, trial state, billing status visibility (TASKS.md M12, PRD.md SUB-1, SUB-3, SUB-4, SUB-7) — included here rather than Phase 3 because it gates no AI behavior yet but must exist before real Store Owners can be onboarded commercially
- Dashboard: simple counters (product count, inventory count, order count, order status breakdown) (PRD.md DASH-1, DASH-2)

**Deferred Items:**

- Order approval/rejection (the Human Approval Gate) is intentionally **not** included in this phase's exit criteria in its automated form — Orders can be created and listed, but the approve/reject transition (TASKS.md M11) is built in Phase 3 alongside the Integration Layer it primarily protects, since the Gate's real-world purpose is defending against AI-originated Orders (ARCHITECTURE.md §8). It may be implemented early if convenient, but is not a Phase 2 exit requirement.
- Messenger connection and any AI-facing capability — Phase 3.
- Admin Console — Phase 4.
- Everything named in AGENTS.md Section 9 as excluded from MVP (Customers CRM, Reports & Analytics, Team Members, additional channels, Product Images, etc.) remains excluded here and in every subsequent phase.

**Exit Criteria:**

- A Store Owner can fully manage Products and Inventory without needing developer intervention.
- Dashboard counters reflect live data accurately.
- Subscription plan assignment and trial-to-restricted transition work correctly, verified by test.
- No Product, Inventory, or Order capability is gated by subscription plan (PRD.md PROD-5, INV-4, ORD-8), verified by test.

---

## Phase 3: AI Integration

**Goals:** Connect the platform to its primary channel and enforce the platform's central trust mechanism — the Human Approval Gate — completing the Core Workflow described in PROJECT_BRIEF.md Section 10 end-to-end for the first time.

**Included Capabilities:**

- Facebook Messenger connection management (TASKS.md M9, PRD.md MSG-1–4)
- Integration Layer: `checkAvailability()` and `proposeOrder()` via `/api/integration/v1/*` (TASKS.md M9, ARCHITECTURE.md §6, API.md §6)
- n8n automation layer wired to the Integration Layer contract only (PRD.md N8N-1–4)
- AI Output Validation and adversarial-input hardening (TASKS.md M10, ARCHITECTURE.md §6.4, SECURITY.md §8)
- Human Approval Gate: `approveOrder()`/`rejectOrder()` as the single, centrally enforced transition (TASKS.md M11, ARCHITECTURE.md §8)
- AI conversation metering (`canConsumeAiConversation()`, usage notification) (PRD.md SUB-2, SUB-5, ARCHITECTURE.md §9)

**Deferred Items:**

- Any channel beyond Facebook Messenger (WhatsApp, Instagram, etc.) — explicitly out of MVP scope (PROJECT_BRIEF.md §9), not merely deferred to a later MVP phase but to Phase 5's Future Vision at the earliest.
- Stock reservation during conversation — deliberately not implemented at all in MVP; the re-verification step at order-proposal time is the platform's permanent safeguard for this scope, per API.md Section 6.4, not a temporary gap.
- n8n replacement — not evaluated until the ~50-active-Store threshold (AGENTS.md §13), which is a Phase 5 concern.

**Exit Criteria:**

- The full Core Workflow (PROJECT_BRIEF.md §10) executes successfully against a real, test Facebook Page: a message arrives, the AI checks availability, a customer confirms, a Pending Order is created, the Store Owner approves it, and Inventory decreases correctly.
- No Order can ever bypass the approval gate, and no automation-layer call can ever write to Inventory or approve an Order directly — verified by all TESTING.md Section 10 (Human Approval Gate) and Section 11 (Integration Layer/AI Output Validation) test cases.
- A Workspace that exhausts its AI conversation allowance is clearly notified and gracefully blocked, not silently degraded (PRD.md SUB-5).
- Messenger disconnection is clearly surfaced to the Store Owner and does not corrupt or lose Store data on reconnection (PRD.md MSG-2, MSG-3).

---

## Phase 4: Production Readiness

**Goals:** Complete the remaining platform-operator capability, close out every deferred security and testing item that is in-scope for MVP, and stand up a production environment capable of serving real, paying Stores.

**Included Capabilities:**

- Admin Console: Store list, platform statistics, Subscription Plan management, platform settings, cross-Workspace Audit Log access (TASKS.md M13, PRD.md ADM-1–5)
- Full Security Implementation closeout against the SECURITY.md Section 13 checklist (TASKS.md M14)
- Full Testing Infrastructure closeout — every TESTING.md-enumerated test case implemented and enforced in CI (TASKS.md M16)
- Production Deployment Setup: VPS provisioning, TLS, firewall rules, backups, monitoring, first production release (TASKS.md M15, DEPLOYMENT.md)

**Deferred Items:**

- Staging environment — explicitly deferred past MVP per DEPLOYMENT.md Section 3, to be revisited once production incident cost justifies the added infrastructure.
- Formal penetration testing and incident response process — explicitly flagged as gaps in SECURITY.md Section 14 and TESTING.md Section 13, appropriate to schedule once the platform has paying customers, not before.
- End-to-end browser automation and load/performance testing — explicitly deferred in TESTING.md Section 13.
- A numeric test-coverage target — explicitly not mandated in TESTING.md Section 13; revisited only if test-quality drift becomes an observed problem.

**Exit Criteria:**

- Every item on the SECURITY.md Section 13 Security Review Checklist is resolved or explicitly documented as a deferred gap.
- The full automated test suite passes in CI as a blocking gate, with every test case named in TESTING.md Sections 6–12 implemented.
- The production VPS is live, reachable only over HTTPS, with automated backups tested via at least one successful restoration.
- A Platform Administrator can view Store list, platform statistics, and manage Subscription Plans, with ADM-5's isolation guarantee verified by test.
- **This is the MVP release boundary.** Completion of Phase 4 constitutes "the MVP" as scoped by AGENTS.md Section 9 and PRD.md in full. Phase 5 begins only after this boundary is crossed and real usage data exists.

---

## Phase 5: Post-MVP Scaling

**Goals:** This phase is intentionally **not specified in implementation detail** by this document. Per PROJECT_BRIEF.md Section 20, the MVP's objective is to validate demand and establish a scalable technical foundation — not to pre-build the next phase speculatively. This phase exists in ROADMAP.md only to name the triggers and candidate directions already flagged as deferred throughout the prior documents, so a future revision of this document (or a new ROADMAP.md version) has a documented starting point rather than a blank page.

**Included Capabilities (trigger-gated, not scheduled):**

| Candidate Capability                                                                   | Trigger                                                                                                                      | Source                                        |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| n8n replacement or internal automation service                                         | ~50 active Stores                                                                                                            | AGENTS.md §6, §13; ARCHITECTURE.md §3, §6.3   |
| Multi-host / horizontal scaling, staging environment                                   | ~50 active Stores, or a production incident whose cost exceeds staging's setup cost                                          | ARCHITECTURE.md §3; DEPLOYMENT.md §3, §4, §12 |
| Multi-user Workspaces (Sales Employee, Inventory Employee roles)                       | Explicit founder decision once single-owner-per-Store proves limiting                                                        | PROJECT_BRIEF.md §7, §18; AGENTS.md §8, §14   |
| Customers CRM module                                                                   | Explicit founder decision once Order-embedded customer data proves insufficient                                              | PROJECT_BRIEF.md §18; AGENTS.md §9; DB.md §8  |
| Reports & Analytics module                                                             | Explicit founder decision once Dashboard counters prove insufficient, or query performance at scale requires pre-aggregation | PROJECT_BRIEF.md §18; AGENTS.md §9; DB.md §8  |
| Additional channels (WhatsApp, Instagram, TikTok, Telegram, Snapchat, YouTube)         | Explicit founder decision, validated demand per channel                                                                      | PROJECT_BRIEF.md §9, §18; ARCHITECTURE.md §14 |
| Online Payments, Shipping Integration, POS, Accounting, Supplier Management            | Explicit founder decision                                                                                                    | PROJECT_BRIEF.md §9, §18                      |
| Ecommerce Website Builder, Mobile Applications                                         | Explicit founder decision                                                                                                    | PROJECT_BRIEF.md §18                          |
| AI Sales Assistant, AI Analytics                                                       | Explicit founder decision                                                                                                    | PROJECT_BRIEF.md §18                          |
| Formal penetration testing, incident response process                                  | Paying customer base established                                                                                             | SECURITY.md §14                               |
| Postgres Row-Level Security (defense-in-depth beyond application-layer tenant scoping) | Platform operational maturity justifies the added complexity                                                                 | SECURITY.md §5.2                              |
| Data deletion / account closure policy                                                 | Explicit founder decision, ideally before first customer offboarding request                                                 | SECURITY.md §12                               |

**Deferred Items:** By definition, everything in this phase is deferred — that is what distinguishes Phase 5 from Phases 1–4. Nothing in this phase is designed, scheduled, or built as part of the current MVP effort.

**Exit Criteria:** Not applicable. Phase 5 has no single exit condition; each candidate capability above has its own independent trigger, and each becomes its own future initiative — governed by its own PRD.md-equivalent revision — once triggered. Per AGENTS.md Section 4, no AI agent or engineer may begin implementing any Phase 5 item without an explicit, documented founder decision authorizing that specific item; the presence of a capability in this table is a record of the deferral, not a green light.

---

## 3. Governing Constraint: The ~50-Store Threshold

Several Phase 5 triggers reference the same ~50-active-Store threshold (AGENTS.md §6, §13; ARCHITECTURE.md §3). This is called out once, here, because it is the single most load-bearing number in this roadmap:

- It is the point at which n8n is expected to be reconsidered (AGENTS.md §13).
- It is the same point ARCHITECTURE.md Section 3 names for revisiting the modular-monolith/single-VPS decision.
- It is not a hard deadline or a guarantee — it is the threshold at which the operational assumptions baked into Phases 1–4 (single VPS, n8n as automation layer, no staging environment) are expected to start showing strain, and therefore the point at which they should be deliberately re-evaluated rather than left to degrade silently.

No document in this series treats this number as precise or contractual. It is a planning signal, not a trigger that fires automatically.

---

## 4. What This Document Deliberately Does Not Cover

- **Specific calendar dates or sprint-level scheduling** — this document sequences phases by exit criteria, not by date, consistent with a founder-driven team's need for flexibility over a fixed schedule.
- **Feature-level specification for any Phase 5 capability** — per Section 2's stated purpose, this document names triggers and sources, not designs; a Phase 5 capability's actual PRD, architecture, and data model are future documents in their own right, produced only once that capability is explicitly greenlit.
- **Pricing or business-model changes** — the plan structure (AGENTS.md §12) is treated as stable through Phase 4; any change to it is a founder decision outside this document's scope.

---

## 5. Cross References

- **PROJECT_BRIEF.md** — Section 18 (Future Vision) and Section 20 (MVP Goal) are the direct source of Phase 5's trigger-gated, non-implemented framing, and of the "validate demand first" principle governing every exit criterion in Phases 1–4.
- **AGENTS.md** — Section 6 (MVP Discipline, ~50-Store threshold), Section 9 (MVP Scope Boundaries), and Section 14 (Extensibility Principle) are the direct source of every item in Phase 5's candidate table and the "don't build the room" restraint applied throughout this document.
- **ARCHITECTURE.md** — Section 3's modular-monolith revisit trigger and Section 6.3's n8n-replacement trigger are restated in Section 3 of this document as the governing ~50-Store threshold.
- **TASKS.md** — Section 2's phase-to-milestone mapping is the direct sequencing link between this document and TASKS.md's sixteen milestones; this document adds no execution detail TASKS.md doesn't already own.
- **TESTING.md** — Section 13's explicitly deferred testing scope is restated as Phase 4's deferred items and is not scheduled for a future phase without an explicit future decision.
- **SECURITY.md** — Section 14's deferred security items (incident response, penetration testing) and Section 5.2/Section 12's flagged gaps (Row-Level Security, data deletion policy) are restated as Phase 5 candidates with their originating sections cited.
- **DEPLOYMENT.md** — Section 3's no-staging-environment decision and Section 12's topology-revisit deferral are restated as Phase 4 deferred items and Phase 5 candidates respectively.
- This document is the terminal document in the current AGENTS.md Section 3 hierarchy. Any future capability greenlit from Phase 5 begins a new cycle through that same hierarchy — a new or revised PRD.md section, followed by the corresponding downstream documents — rather than being appended directly here.