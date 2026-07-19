# SECURITY.md

## Smart Commerce AI — Security Architecture (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DATABASE.md, API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md
**Read By:** DEPLOYMENT.md, TESTING.md

---

## 1. Purpose

This document defines the concrete security mechanisms that enforce the boundaries described throughout the preceding documents — Workspace/Store isolation (ARCHITECTURE.md §7), the Human Approval Gate (ARCHITECTURE.md §8), the Integration Layer's minimal surface (ARCHITECTURE.md §6), and Security by Default (AGENTS.md §10). Where prior documents established *that* a boundary must exist, this document establishes *how* it is technically enforced, verified, and monitored.

This document does not redefine business rules (AGENTS.md, PRD.md) or module responsibilities (ARCHITECTURE.md) — it defines the security controls that protect them from being bypassed, accidentally or maliciously.

---

## 2. Security Principles (Restated for This Domain)

Directly from AGENTS.md Section 10 ("Security by Default"), applied to this system specifically:

- **Security takes precedence over convenience.** Where a security control adds friction (e.g., re-validating a session on every Server Action rather than trusting a cached role), the control wins.
- **Least privilege.** No credential, session, or service account has more access than its specific function requires. The Integration Layer credential in particular (Section 6) is scoped to exactly two operations per Workspace (ARCHITECTURE.md §6.2) — nothing more.
- **Secure by default.** A new module, route, or field is private/inaccessible until deliberately exposed — never the reverse.
- **Explicit authorization for sensitive operations.** Order approval, subscription changes, and Administrator actions each require a freshly-verified session in the correct scope, not merely "a valid cookie exists."

---

## 3. Threat Model Summary

| Actor                                                | Primary Risk                                                                                                                   | Primary Mitigation                                                                                                                                                                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Malicious or careless End Customer (via Messenger)   | Attempts to manipulate the AI into creating fraudulent or oversized Orders                                                     | AI Output Validation (Section 8); server-side re-verification of price/stock (API.md §5.2); Human Approval Gate means no Order self-executes regardless of input                                                                        |
| Compromised or misused Integration Layer credential  | Unauthorized `proposeOrder`/`checkAvailability` calls against one Workspace                                                    | Credential scoped to a single Workspace (Section 6); rate limiting (Section 9); rotation support (Section 6.3)                                                                                                                          |
| Malicious Store Owner (against their own data)       | Not a meaningful threat model — a Store Owner acting within their own Workspace is operating within their legitimate authority | N/A — this is expected platform usage, not an attack                                                                                                                                                                                    |
| Store Owner attempting to access another Workspace   | Cross-tenant data access via a manipulated request (e.g., altered URL/ID)                                                      | Session-derived `workspaceId` never trusted from client input (Section 4); `NOT_FOUND` (not `FORBIDDEN`) responses prevent existence-confirmation (API.md §9)                                                                           |
| Compromised Platform Administrator account           | Broad platform visibility, but explicitly cannot read/write Store-level Products, Inventory, or Orders (PRD.md ADM-5)          | Structural boundary (ARCHITECTURE.md §7); strong authentication requirements for this role (Section 5)                                                                                                                                  |
| External attacker probing public surface             | Credential stuffing, brute force, injection, exposed secrets                                                                   | Rate limiting (Section 9), password hashing (Section 5), input validation (Section 8), secrets management (Section 10)                                                                                                                  |
| Compromised n8n instance or its eventual replacement | Same as "compromised Integration Layer credential" above, since n8n has no access beyond that credential                       | Same mitigations — this is precisely why the Integration Layer's minimal surface (ARCHITECTURE.md §6.2) exists: a fully compromised automation layer still cannot approve Orders, modify Inventory directly, or reach another Workspace |

This threat model is scoped to MVP. It does not attempt to address advanced persistent threats, nation-state actors, or physical security — those are disproportionate to a single-VPS MVP serving early-stage SMB customers, consistent with MVP Discipline (AGENTS.md §9).

---

## 4. Authentication

### 4.1 Credential Storage

- Passwords are never stored in plaintext or reversibly encrypted. `User.passwordHash` (DATABASE.md §4.1) is generated using a modern, salted hashing algorithm suited to password storage (bcrypt or argon2, with a work factor tuned to balance login latency against brute-force resistance). Concrete library/parameter choice is fixed once in `lib/auth.ts` (FOLDER_STRUCTURE.md §6) and never duplicated elsewhere.
- The `pageAccessTokenEncrypted` field (DATABASE.md §4.5) and the Integration Layer credential (Section 6 below) are encrypted at rest using a symmetric encryption key held outside the application code and outside version control (Section 10).

### 4.2 Session Management

- Sessions are managed by NextAuth (ARCHITECTURE.md §12), using secure, HTTP-only, same-site cookies. Session tokens are never exposed to client-side JavaScript.
- A session encodes exactly one `role` (`STORE_OWNER` or `PLATFORM_ADMIN`) and, for `STORE_OWNER`, the associated `workspaceId` — resolved once at login and re-verified against the database on each sensitive action rather than trusted indefinitely from the token alone, so a Workspace status change (e.g., `SUSPENDED`) takes effect without waiting for token expiry.
- Sessions have a defined expiry and require re-authentication after inactivity; exact duration is a product/UX tradeoff to be tuned during MVP but must be finite in all cases — an indefinitely valid session is a Security by Default violation.

### 4.3 Role Separation Enforcement

Per FOLDER_STRUCTURE.md Section 4, `app/stores/layout.tsx` and `app/admin/layout.tsx` each independently verify the session's `role` before rendering anything beneath them. This check happens at the layout level (server-side, on every request) — not once at login and cached client-side, and not left to individual pages to remember to check. A `STORE_OWNER` session hitting any `/admin/*` route receives an `UNAUTHORIZED`/redirect response before any Admin module code executes.

### 4.4 Phone Verification (REG-2)

Phone verification uses an external SMS/OTP provider, accessed through an abstracted interface (consistent with the Integration Abstraction principle applied generally, AGENTS.md §13) rather than a hardcoded vendor integration inside the Auth Module's core logic. OTP codes are short-lived, single-use, and rate-limited per phone number and per requesting IP to prevent enumeration or SMS-bombing abuse.

### 4.5 Platform Administrator Provisioning

Per API.md Section 8, Administrator accounts are not self-service. They are provisioned directly (e.g., via a controlled seed script or a manual database action performed by an existing Administrator through the Admin Module), never through the public `registerStore` flow. Given the elevated cross-platform visibility this role carries (Section 3), Administrator accounts should additionally require multi-factor authentication before general availability — flagged here as a requirement to implement before the Admin Console is exposed beyond the founder's own use, even if MVP's very first version launches with a single trusted Administrator account.

---

## 5. Authorization

### 5.1 Two-Layer Enforcement

Authorization is enforced at two independent layers, deliberately redundant with each other so that a failure in one does not silently become a breach:

1. **Routing layer** — `app/stores/layout.tsx` / `app/admin/layout.tsx` (Section 4.3) block mismatched roles before any page renders.
2. **Service layer** — every module's `services/` and `actions/` functions independently verify the caller's authority (correct role, correct Workspace ownership) before executing, per CODING_STANDARDS.md Section 4's tenant-scoping convention. A service function is never written to assume "the routing layer already checked this" as its sole guarantee.

This redundancy exists because Section 3's threat model includes the possibility of a future engineer adding a new entry point (a new Server Action, a new route) that bypasses the routing-layer check by omission — the service layer is the backstop that still holds even then.

### 5.2 Tenant Isolation Enforcement

Directly implementing ARCHITECTURE.md Section 7 and CODING_STANDARDS.md Section 4 at the security-control level:

- Every tenant-scoped query is issued with `workspaceId` as a mandatory, session-derived parameter (never client-supplied) — this is the primary defense against cross-tenant data access.
- As defense-in-depth beyond the application-layer check, database-level row access should additionally be constrained: at minimum, every Prisma query against a tenant-owned table includes the `workspaceId` filter (enforced by the CODING_STANDARDS.md §4 convention and lint-adjacent review discipline); Postgres Row-Level Security is noted here as a future-hardening option once the platform's operational maturity justifies the added complexity, but is not required for MVP given the single-application-layer access pattern (no direct external DB access exists in MVP per Section 10).
- Any endpoint or Server Action returning "not found" for a cross-tenant access attempt (rather than "forbidden") per API.md Section 9 is a deliberate anti-enumeration control — reviewed as part of this section, not left to API.md alone.

### 5.3 Administrator Boundary Enforcement

Per PRD.md ADM-5 and ARCHITECTURE.md Section 7, the Admin Module's data-access path (`modules/admin/data/`, FOLDER_STRUCTURE.md §5) is the only code permitted to issue cross-tenant queries, and even it never queries Product, Inventory, or Order tables directly — only Workspace-level metadata (status, subscription, trial state). This is enforced the same way as any other module boundary (CODING_STANDARDS.md §3's lint rule), with the specific addition that any pull request touching `modules/admin/data/` requires explicit review attention to confirm it has not begun querying operational tables (Product/Inventory/Order), since this is the one place in the codebase where such a query would be syntactically possible without tripping the standard tenant-scoping convention.

---

## 6. Integration Layer Credential Security

Expanding on API.md Section 5.3.

- Each Workspace's Messenger connection is issued a distinct, randomly generated credential (not derived from any predictable value like the Workspace ID itself) used to authenticate `/api/integration/v1/*` requests.
- Credentials are stored hashed (not reversibly encrypted) where the application only ever needs to verify a presented credential against a stored hash — following the same principle as password storage (Section 4.1) wherever verification-only access is sufficient.
- Credentials are rotatable: a Store Owner reconnecting their Messenger Page (MSG-3) or an Administrator investigating a suspected compromise can invalidate the existing credential and issue a new one without data loss, consistent with MSG-3's requirement that reconnection not be destructive to Store data.
- A compromised credential's blast radius is bounded to exactly one Workspace's `checkAvailability` and create-only `proposeOrder` capability (Section 3) — this bound is the direct security payoff of ARCHITECTURE.md Section 6.2's minimal-surface design, and is called out here so its security value is explicit, not just an architectural side effect.

---

## 7. Transport and Network Security

- All traffic to the platform (Store Owner UI, Administrator UI, Integration Layer API, Messenger webhook receipt) is served over HTTPS only; HTTP requests are redirected, never served.
- Webhook endpoints receiving events from Facebook Messenger (via the automation layer) verify the request's authenticity using Facebook's provided signature-verification mechanism before any processing occurs — an unsigned or invalidly signed webhook payload is rejected before it reaches any module logic.
- Database access (PostgreSQL) is not exposed to the public internet; it is reachable only from the application server itself, consistent with the single-VPS MVP topology to be detailed in DEPLOYMENT.md.

---

## 8. Input Validation and AI Output Validation

Directly implementing AGENTS.md Section 10's "AI Output Validation" rule and ARCHITECTURE.md Section 6.4, from a security control perspective rather than an architectural one:

- Every payload crossing the Integration Layer boundary (`/api/integration/v1/*`) is validated against a Zod schema (CODING_STANDARDS.md §7) before any module logic runs — malformed, oversized, or unexpected-shape payloads are rejected with `VALIDATION_ERROR` (API.md §9) rather than partially processed.
- **AI-originated content is treated as adversarial input, not merely untrusted input.** This distinction matters for security specifically: an AI conversation can be steered by an End Customer's messages, so the platform must assume a sufficiently motivated End Customer could attempt to manipulate the AI into proposing a fraudulent-looking Order (extreme quantities, mismatched pricing intent). This is why every price and stock figure in `proposeOrder` is re-derived from the platform's own current data (API.md §5.2, steps 1–3) and never accepted as a value the caller supplies — this is a security control, not merely a data-integrity one.
- All user-supplied and AI-relayed text fields (Product names, Order notes, customer name/phone) are treated as data, never as executable content — no field from these sources is ever interpolated into a raw SQL query (Prisma's parameterized queries prevent this by default and must not be bypassed via raw query escapes without explicit security review) or rendered without appropriate escaping in any UI context, preventing injection and stored XSS respectively.

---

## 9. Rate Limiting and Abuse Prevention

Expanding on API.md Section 10 from a security-specific angle:

| Surface                 | Limit Basis               | Purpose                                                                                                                                                                                                 |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/integration/v1/*` | Per Workspace credential  | Prevents a single compromised or misbehaving credential from degrading platform-wide performance or running up AI-conversation costs beyond the Subscription Module's own metering (ARCHITECTURE.md §9) |
| `login`                 | Per account + per IP      | Brute-force credential guessing prevention                                                                                                                                                              |
| `requestPasswordReset`  | Per account + per IP      | Prevents password-reset abuse as a user-enumeration or harassment vector                                                                                                                                |                                                                                |
| `registerStore`         | Per IP, coarse-grained    | Basic friction against automated mass trial creation, acknowledged as incomplete per PRD.md REG-5's explicit deferral of full abuse detection                                                           |

Rate limit violations return a deterministic, structured error (consistent with AGENTS.md's Error Handling Principles) rather than silently dropping requests — a caller should always be able to distinguish "you are rate limited" from "the service is broken."

---

## 10. Secrets Management

- No secret (database credentials, NextAuth secret, encryption keys, SMS/OTP provider credentials, Facebook App credentials) is ever committed to version control. `.env.example` (FOLDER_STRUCTURE.md §8) documents required variable names only, never values.
- Production secrets are managed as environment variables injected at deploy time on the VPS, with access restricted to the deployment process itself — concrete mechanism (e.g., a secrets file with restricted filesystem permissions, or a secrets manager if adopted) is finalized in DEPLOYMENT.md, but the principle that secrets never enter the application repository is fixed here and does not change based on deployment tooling choice.
- The symmetric key used to encrypt `pageAccessTokenEncrypted` (Section 4.1) and any Integration Layer credential hashing salt/pepper are themselves treated as the highest-sensitivity secrets in the system, since their compromise would affect every Workspace simultaneously — this asymmetry (one compromised Workspace credential vs. one compromised platform-wide encryption key) is why key storage deserves the most restrictive access of any secret in the system.

---

## 11. Audit Logging as a Security Control

The Audit Log (DATABASE.md §4.10, ARCHITECTURE.md §10) is not only a business-traceability feature — it is this platform's primary security-incident forensic tool. From a security standpoint:

- Audit Log entries are immutable (ARCHITECTURE.md §10) specifically so they remain trustworthy evidence even if an attacker gains some level of access — an attacker able to alter their own audit trail would defeat the control's purpose.
- Authentication events with security relevance (failed login attempts beyond a threshold, password resets, Administrator credential provisioning, Integration Layer credential rotation) should be captured in the Audit Log or an equivalent security event log, even where they don't map to a PRD.md-defined business action — this is flagged here as a security-specific extension of the Audit Log's use, to be finalized alongside DEPLOYMENT.md's monitoring setup.
- Platform Administrator access to cross-Workspace Audit Logs (AUD-4, PRD.md) is itself the kind of sensitive operation that should be logged when exercised — an Administrator viewing another Workspace's audit trail is a security-relevant event in its own right.

---

## 12. Data Protection

- Personally identifiable End Customer data (name, phone, Messenger identifier — DATABASE.md §4.8) is minimized to exactly what PRD.md ORD-3 requires for order fulfillment; no additional customer profiling data is collected, consistent with the absence of a Customers/CRM module in MVP (DATABASE.md §8).
- Store Owner and Administrator personal data (email, phone, password hash) is stored only as needed for authentication and account recovery (Section 4).
- Data belonging to a Workspace remains accessible to that Workspace even in a `RESTRICTED` state (PRD.md SUB-7) — restriction limits automation/write capability, never data availability to its rightful owner, consistent with not treating trial expiration as a data-loss event.
- Data deletion (e.g., a Store Owner closing their account, a regulatory deletion request) is not fully specified in MVP scope; this is flagged as a gap for a future revision of this document rather than silently assumed to be "just delete the rows," since Order/Audit Log retention may have legitimate reasons to outlive an account closure — this decision should be made explicitly, not by default, per AGENTS.md Section 4.

---

## 13. Security Review Checklist (For Every Pull Request)

Derived from this document, for use until TESTING.md and DEPLOYMENT.md formalize automated checks:

- Does every new tenant-scoped data-access function take `workspaceId` as a mandatory, session-derived first parameter (Section 5.2, CODING_STANDARDS.md §4)?
- Does every new `/api/integration/v1/*` field or new module input have a Zod schema validating it before use (Section 8)?
- Does any new code path reach `decrementStock`, `approveOrder`, or `rejectOrder` from anywhere other than their documented restricted callers (ARCHITECTURE.md §8, CODING_STANDARDS.md §3)?
- Does any new Admin Module query touch Product, Inventory, or Order tables directly (Section 5.3)?
- Is any secret, credential, or key referenced by value anywhere in the diff (Section 10)?
- Does any new state-changing action fail to write an Audit Log entry (Section 11, AGENTS.md §10 Rule 6)?

---

## 14. What This Document Deliberately Defers

- **Concrete infrastructure hardening** (firewall rules, VPS OS hardening, network segmentation) — belongs to DEPLOYMENT.md.
- **Security test cases and penetration-testing scope** — belongs to TESTING.md.
- **Incident response process** (who is notified, how a breach is handled operationally) — not yet defined; flagged as a gap appropriate for a founder-driven MVP stage but one that should be addressed explicitly before the platform scales past its earliest customers, consistent with AGENTS.md Section 16's expectation that governance documents evolve deliberately.

---

## 15. Cross References

- **AGENTS.md** — Section 10's Security by Default, AI Output Validation, and Audit Log requirements are the direct source of Sections 2, 8, and 11 of this document.
- **ARCHITECTURE.md** — Section 6 (Integration Abstraction Layer), Section 7 (Tenant Isolation), and Section 8 (Human Approval Gate) are the architectural guarantees this document supplies concrete enforcement mechanisms for, in Sections 5, 6, and 5.1/5.3 respectively.
- **API.md** — Section 4 (Authentication & Session Boundaries), Section 5.3 (Credential Scope), and Section 9 (Error codes, `NOT_FOUND` vs `FORBIDDEN`) are expanded into concrete mechanisms in Sections 4, 6, and 5.2 of this document.
- **CODING_STANDARDS.md** — Section 3 (import boundary enforcement) and Section 4 (tenant scoping convention) are the code-level mechanisms this document treats as security controls, not merely style rules.
- Downstream: DEPLOYMENT.md must implement the network/secrets/infrastructure requirements referenced in Sections 7, 9, and 10. TESTING.md must define how the Security Review Checklist (Section 13) becomes verifiable through automated or manual test coverage.