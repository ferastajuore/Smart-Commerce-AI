# DEPLOYMENT.md

## Smart Commerce AI — Release & Infrastructure Process (MVP)

**Version:** 1.0.0
**Status:** MVP Planning
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, DATABASE.md, API.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md, SECURITY.md
**Read By:** TESTING.md, TASKS.md, ROADMAP.md

---

## 1. Purpose

This document defines how Smart Commerce AI is built, deployed, operated, and monitored in its MVP form. It answers **how the system reaches production and stays running** — not what it does (PRD.md), how it is designed (ARCHITECTURE.md), or how it is secured (SECURITY.md). Every infrastructure decision here must implement, not reinterpret, the topology and enforcement mechanisms already established in ARCHITECTURE.md and SECURITY.md.

Where SECURITY.md flagged a concern as "finalized in DEPLOYMENT.md" (Sections 7, 9, 10 of that document), this document is where that concern is resolved concretely. Where this document requires a decision not covered by any document above it in the AGENTS.md Section 3 hierarchy, the gap is flagged explicitly rather than resolved silently, per AGENTS.md Section 4.

---

## 2. Deployment Goals

Derived from AGENTS.md Section 6 and ARCHITECTURE.md Section 2, translated into operational goals:

| Goal | Deployment Consequence |
|---|---|
| MVP Discipline | Infrastructure is exactly as complex as a single-region, single-VPS MVP requires — no orchestration platform, no multi-region setup, no infrastructure built for a scale the platform has not reached. |
| Platform as Single Source of Truth | The database is the only stateful component that matters operationally; backup and recovery strategy (Section 8) is the platform's single highest-priority operational concern. |
| Security by Default | Nothing is reachable from the public internet except what SECURITY.md Section 7 explicitly names; every other port, service, and internal connection is private by default. |
| n8n Is Temporary | n8n is deployed and operated as a replaceable component alongside the platform, never merged into the platform's own deployable unit or database. |
| Founder-Driven Team | The deployment process must be operable by a small team without a dedicated DevOps function — manual steps are acceptable in MVP where automation cost would exceed its benefit, but every manual step is documented so it isn't tribal knowledge. |

---

## 3. Environments

Smart Commerce AI MVP uses exactly two environments. No staging environment exists yet — this is an explicit MVP Discipline decision, not an oversight.

| Environment | Purpose | Data |
|---|---|---|
| **Local Development** | Individual contributor (human or AI agent) development and testing | Local PostgreSQL instance or containerized database; never connects to production data |
| **Production** | The live platform serving real Workspaces | The single source of truth referenced throughout ARCHITECTURE.md and SECURITY.md |

**Why no staging environment in MVP:** a staging environment requires its own database, its own secrets, and its own n8n instance to be meaningful — that is infrastructure cost disproportionate to a founder-driven MVP serving its first customers (SECURITY.md Section 3). This is flagged here as a gap to revisit once the platform has enough paying Workspaces that a production incident carries real business cost, consistent with AGENTS.md Section 4's requirement that scope changes be explicit decisions, not silent expansions. Until then, the safeguards in Section 6 (CI gates) and Section 9 (deploy discipline) substitute for a staging environment's normal role.

---

## 4. Infrastructure Topology

Per ARCHITECTURE.md Section 12 ("Hosting: VPS") and SECURITY.md Section 7, MVP production infrastructure is a **single VPS** running every application component. This is the concrete topology that Section 4's conceptual diagram in ARCHITECTURE.md deferred to this document.

```
                    Internet
                       │
                       │ HTTPS only (Section 5)
                       ▼
            ┌─────────────────────────┐
            │   Reverse Proxy (TLS)    │
            └─────────────┬────────────┘
                           │
                           ▼
            ┌─────────────────────────┐
            │  Next.js 15 Application   │
            │  (Smart Commerce AI —     │
            │   Modular Monolith)       │
            └─────────────┬────────────┘
                           │ local, not public
                           ▼
            ┌─────────────────────────┐
            │   PostgreSQL
            │  (Accessed via Prisma ORM)│
            │   Not exposed publicly    │
            │   (SECURITY.md §7)        │
            └─────────────────────────┘

            ┌─────────────────────────┐
            │   n8n (Automation)        │
            │   Separate process on the │
            │   same VPS, or a separate  │
            │   host — calls the         │
            │   platform only via        │
            │   /api/integration/v1/*    │
            └─────────────────────────┘
```

**Single VPS rationale:** consistent with ARCHITECTURE.md Section 3's modular-monolith reasoning, one deployable application unit does not benefit from being split across multiple hosts at MVP scale — it adds network hops and failure modes without a corresponding benefit. The database is not exposed to the public internet under any circumstance (SECURITY.md Section 7); it is reachable only from the application process on the same host or a private network path.

**n8n's placement is deliberately not fixed as "always co-located":** per ARCHITECTURE.md Section 6.3, n8n is a replaceable external client of the Integration Layer. Whether it runs on the same VPS or a separate host is an operational convenience decision, not an architectural one — either way, it communicates with the platform only through the authenticated `/api/integration/v1/*` contract (API.md), never through direct database or filesystem access. This is called out explicitly so a future engineer does not mistake "runs on the same box today" for "is part of the platform."

**Revisiting this topology:** per ARCHITECTURE.md Section 3, this single-VPS decision is expected to be revisited in ROADMAP.md at the same ~50-active-Store threshold that triggers reconsidering n8n (AGENTS.md Section 6). No horizontal scaling, load balancing, or multi-host application setup is built in advance of that threshold being reached.

---

## 5. Transport, Network, and Access Controls

Implements SECURITY.md Section 7 concretely.

- All public traffic terminates at a reverse proxy configured for HTTPS only; the reverse proxy redirects any HTTP request rather than serving it, consistent with SECURITY.md Section 7's requirement.
- TLS certificates are obtained and renewed through an automated certificate process (e.g., a standard ACME-based issuer) so certificate expiry is never a manual, forgettable task.
- The reverse proxy is the only public entry point. The application process listens on a local/internal port only, never bound directly to a public interface.
- PostgreSQL listens only on a local interface (or a private network interface if the database is ever moved off the application host); no PostgreSQL port is ever opened to the public internet, per SECURITY.md Section 7 and Section 3 (threat model).
- VPS-level firewall rules default-deny inbound traffic and explicitly allow only: HTTPS (443), and SSH access restricted to a known set of administrative sources. No other inbound port is opened without an explicit, documented reason tied to a requirement in this document or SECURITY.md.
- SSH access to the production VPS uses key-based authentication only; password-based SSH login is disabled, consistent with SECURITY.md's Security by Default principle applied at the infrastructure layer.

---

## 6. Continuous Integration (CI) Gates

Implements the CI-gate references made throughout CODING_STANDARDS.md (Sections 3, 11) and FOLDER_STRUCTURE.md (Section 7). Every pull request must pass all of the following before it can merge into the branch that production deploys from:

| Gate | Source of the Requirement | What Blocks the Merge |
|---|---|---|
| TypeScript type check | CODING_STANDARDS.md §9 | Any type error |
| ESLint (including the import-boundary rule) | FOLDER_STRUCTURE.md §7, CODING_STANDARDS.md §3 | Any lint failure, including a module reaching into another module's `data/` folder |
| Format check | CODING_STANDARDS.md §11 | Unformatted code |
| Prisma schema validation | DATABASE.md | A schema that fails to validate or generate against the current migration state |
| Automated tests | TESTING.md (once defined) | Any failing test in the suite TESTING.md establishes |

No pull request merges on the basis of manual review alone if any of the above gates fail — this is the deployment-layer implementation of CODING_STANDARDS.md's repeated statement that these are "CI gates, not review suggestions." Until TESTING.md formally exists, the Security Review Checklist (SECURITY.md Section 13) is applied manually on every pull request as an interim substitute for automated security-relevant test coverage.

---

## 7. Release Process

### 7.1 Build and Deploy Steps

1. A pull request merges into the production branch only after every gate in Section 6 passes.
2. The application is built (`next build`) in a clean environment matching production's Node.js version, never built once on a developer machine and copied to the server.
3. Database migrations (`prisma migrate deploy`) run before the new application version starts serving traffic — never after, to avoid a window where running code expects a schema that does not yet exist.
4. The new application process starts and passes a basic health check (the process responds to requests) before the reverse proxy routes traffic to it.
5. The previous application version remains available to roll back to (Section 7.3) until the new version is confirmed healthy.

### 7.2 Migration Discipline

Per DATABASE.md and CODING_STANDARDS.md's prohibition on business logic in SQL:

- Every schema change is expressed as a Prisma migration file committed to version control (`prisma/migrations/`, FOLDER_STRUCTURE.md §3) — no schema change is ever applied by hand directly against the production database outside this process.
- Migrations that could cause data loss (dropping a column, changing a type destructively) require explicit review attention flagged in the pull request description, consistent with SECURITY.md's principle that sensitive operations require explicit authorization rather than silent execution.
- A migration is written to be applied safely against the existing production data — a migration that would fail or corrupt data against real Workspace records is treated as a defect in the pull request, not an acceptable risk to "fix in production."

### 7.3 Rollback

- Rolling back the application to the previous build is always possible by redeploying the prior build artifact — this requires that build artifacts from recent releases remain available, not only the latest one.
- Rolling back a database migration is not always safe or possible (e.g., a destructive migration cannot be un-run without a backup restore). For this reason, Section 7.2's review discipline on destructive migrations exists specifically to keep rollback realistic — a migration that cannot be safely rolled back is a decision that must be made explicitly, not discovered during an incident.
- If an application rollback and a migration are both required to recover from a bad release, the migration's data-safety is evaluated first — reverting application code against a schema it does not expect is itself a defect-inducing action.

---

## 8. Backup and Recovery

Per Section 2's goal that the database is the platform's single highest-priority operational concern, and consistent with ARCHITECTURE.md's Platform-as-Single-Source-of-Truth principle:

- PostgreSQL is backed up on an automated, recurring schedule (at minimum daily) with backups stored separately from the application VPS itself — a backup that lives only on the same disk as the database it protects does not protect against host failure.
- Backup restoration is a documented, testable procedure, not an assumption. A restoration should be exercised at least once before it is relied upon in an actual incident, consistent with AGENTS.md's general principle that untested assumptions are treated as defects.
- Given PRD.md's Audit Log (AUD-1/AUD-2) and Order history are business-critical and, per SECURITY.md Section 12, not fully specified for deletion/retention in MVP, backup retention defaults to preserving history rather than aggressively pruning it — the specific retention window is a founder decision to be made explicitly (AGENTS.md Section 4), not silently assumed.
- Encrypted secrets (Section 10) required to decrypt `pageAccessTokenEncrypted` and Integration Layer credential material (SECURITY.md Sections 4.1, 6) are backed up with equivalent rigor to the database itself — a restored database without its corresponding encryption key is not a usable recovery.

---

## 9. Secrets and Environment Configuration

Implements SECURITY.md Section 10 concretely, per that section's explicit deferral: "concrete mechanism... is finalized in DEPLOYMENT.md."

- Production environment variables (database connection string, `NEXTAUTH_SECRET`, the symmetric encryption key for `pageAccessTokenEncrypted`, SMS/OTP provider credentials, Facebook App credentials, Integration Layer credential hashing salt/pepper) are injected as environment variables at deploy time on the VPS — never committed to the repository, never present in build logs, never baked into a build artifact.
- `.env.example` (FOLDER_STRUCTURE.md §8) remains the single documented list of required variable names; the production values themselves live only in a restricted-permission environment file on the VPS, readable only by the deployment process and the application's own runtime user — not by every user on the host.
- Access to production secrets is limited to the smallest set of people/processes that need it to deploy or operate the platform, per SECURITY.md's least-privilege principle applied to infrastructure access.
- The symmetric encryption key (SECURITY.md Section 10) is never rotated by simply overwriting the environment variable without a corresponding re-encryption migration of existing `pageAccessTokenEncrypted` values — rotating it carelessly would make existing encrypted data unreadable. This is flagged here as a procedure to be defined explicitly before the first rotation is ever performed, not assumed to be a simple variable swap.

---

## 10. Monitoring and Alerting

Per SECURITY.md Section 11's flag that authentication and security-relevant events should be "captured... to be finalized alongside DEPLOYMENT.md's monitoring setup":

- Application-level errors (unhandled exceptions, `AppError` failures reaching an unexpected code path per CODING_STANDARDS.md §6) are logged centrally, not only to local process output that disappears on restart.
- Basic infrastructure health (VPS uptime, disk usage, database connectivity) is monitored with alerting to the founder/operating team — disk exhaustion on a single-VPS deployment is a realistic MVP-scale risk (e.g., unbounded log growth) and is treated as a Section 2 priority, not an afterthought.
- Security-relevant events named in SECURITY.md Section 11 (repeated failed logins, password resets, Administrator provisioning, Integration Layer credential rotation) flow into the Audit Log or an equivalent security event log, with alerting on abnormal patterns (e.g., a spike in failed logins against one account) rather than silent logging alone.
- Monitoring in MVP is intentionally lightweight — a small set of high-value alerts a founder-driven team can realistically act on, not a full observability platform. This is an explicit MVP Discipline decision (AGENTS.md §6), to be revisited alongside the ~50-Store threshold referenced throughout this document.

---

## 11. Webhook and Integration Layer Operational Concerns

Expanding on SECURITY.md Section 7 and ARCHITECTURE.md Section 6 from a deployment perspective:

- The Facebook Messenger webhook endpoint must remain reachable with high availability, since n8n's ability to relay messages depends on it — this is a direct operational consequence of PRD.md's core workflow (PROJECT_BRIEF.md Section 10) and is treated with the same uptime priority as the Store Owner-facing application.
- Rate limiting configured per SECURITY.md Section 9 is enforced at the application layer; this document's responsibility is only to ensure the infrastructure (reverse proxy, application process) does not silently drop or queue requests in a way that would defeat the ability to distinguish "rate limited" from "service unavailable," per SECURITY.md Section 9's determinism requirement.
- n8n's own operational health (whether co-located or on a separate host, per Section 4) is monitored as a dependency of the Core Workflow, even though n8n itself is explicitly outside the platform's Single Source of Truth boundary — a healthy platform with a failed n8n instance still means no customer conversation reaches the AI, which is a business-relevant outage regardless of which component technically failed.

---

## 12. What This Document Deliberately Defers

- **Concrete test strategy, coverage expectations, and what blocks a merge as a "failing test"** — belongs to TESTING.md; Section 6 references its gate without defining its content.
- **Incident response process** (who is notified, escalation path, post-incident review) — not yet defined, consistent with SECURITY.md Section 14's identical deferral; flagged as a gap appropriate to a founder-driven MVP stage but one to be addressed explicitly before the platform scales past its earliest customers.
- **Staging environment introduction, multi-host topology, horizontal scaling** — deferred to ROADMAP.md at the ~50-Store threshold referenced throughout this document and originating in AGENTS.md Section 6.
- **Specific secrets-manager tooling versus a restricted-permission environment file** — Section 9 fixes the principle (secrets never enter the repository, least-privilege access); the concrete tool is an implementation choice that may evolve without requiring a change to this document's requirements.

---

## 13. Cross References

- **ARCHITECTURE.md** — Section 12 (Technology Stack Mapping) named VPS hosting and deferred topology detail here; Section 3's modular-monolith and n8n-replaceability reasoning is the direct source of Section 4 and Section 11 of this document.
- **SECURITY.md** — Sections 7, 9, 10, and 11 each explicitly deferred a concrete mechanism to this document; Sections 5, 9, 10, and 11 of this document are the resolution of those deferrals.
- **FOLDER_STRUCTURE.md** — Section 7's ESLint enforcement mechanism and Section 8's `.env.example` convention are implemented operationally in Section 6 and Section 9 of this document.
- **CODING_STANDARDS.md** — Section 3 and Section 11's repeated references to "CI gate (DEPLOYMENT.md)" are defined concretely in Section 6 of this document.
- **AGENTS.md** — Section 6's MVP Discipline and the ~50-active-Store n8n replacement threshold are the direct source of Section 3's no-staging-environment decision and Section 4/Section 12's revisit triggers.
- Downstream: TESTING.md must define the test suite referenced as a CI gate in Section 6. TASKS.md must break Sections 6–10 of this document into concrete setup work. ROADMAP.md must schedule the topology and staging-environment revisits flagged in Sections 3, 4, and 12.