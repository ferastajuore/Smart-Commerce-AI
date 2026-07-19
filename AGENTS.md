# AI Operating Rules

## Source of Truth

The docs/ directory and AGENTS.md are the only source of truth.

If they conflict, follow the documented dependency order inside docs/.

Never rely on assumptions.

Never contradict the documentation.


## Before every task

1. Read the relevant docs.
2. Validate the request.
3. Refuse features outside MVP.
4. Never change architecture without approval.
5. Never rename folders or conventions.
6. Never work on more than one milestone at a time.
7. Never continue to the next milestone without explicit approval.
8. Always identify the current milestone before implementation.

## Planning Rules

Before writing any code:

1. Identify the current milestone.
2. Read only the documentation required for that milestone.
3. Produce a short implementation plan.
4. Wait for approval if the scope is unclear.


### Skills — ALWAYS READ BEFORE WRITING UI

- Read frontend-design skill before any UI work
- Read heroui-react skill before any HeroUI component
- Read vercel-react-best-practices skill before any Next.js code
- Read nextjs-best-practices skill before any Next.js code
Read ai-sdk skill before implementing AI features.

### Error Rules

- NEVER skip an error
- NEVER move to next task if current task has errors
- Fix ALL TypeScript errors before finishing
- Run npm run lint.
- Run npm run type-check (if available).
- Run npm run build.

- All commands must pass successfully before a task is considered complete.

## Development Rules

- Follow CODING_STANDARDS.md
- Follow ARCHITECTURE.md
- Follow DATABASE.md
- Follow TASKS.md
- Follow ROADMAP.md
- Follow DESIGN.md
- Follow API.md
- Follow SECURITY.md

## Design & coding Rules

- Follow file DESIGN.md to take colors and use it 
- ALL fonts → Tajawal
- ALL numbers → toLocaleString('en-US')
- ALL dates → format(date, 'dd MMM yyyy') from date-fns

### Font
- Use Tajawal font for ALL text across the entire project

## After Every Task

1. Run a complete verification.
2. Run npm run lint.
3. Run npm run type-check (if available).
4. Run npm run build.
5. Fix every error before considering the task complete.
6. Verify compliance with all relevant documentation.
7. Mark the completed task in TASKS.md.
8. Stop and wait for approval.

## Architect Authority

If the Architect agent is active,
its execution plan and verification process take precedence.

The Architect must review every milestone before it is considered complete.

If the Architect rejects an implementation,
do not continue until the issues are resolved.

If anything is unclear, stop immediately, explain the issue, and ask for clarification instead of making assumptions.

The Architect is responsible for planning, verification, and milestone approval.

Its decisions override implementation decisions.


## Scope Rules

Only modify files required for the current task.

Never refactor unrelated code.

Never rename files unless documentation requires it.

Never modify generated files unless explicitly required.

Never introduce new dependencies without justification.


## Documentation Rules

Whenever implementation changes affect documentation,
update the relevant documentation before finishing the task.

Documentation must always reflect the current implementation.

Never create new documentation files unless explicitly requested.


## Final Rule

If anything is unclear, stop immediately, explain the issue, and ask for clarification instead of making assumptions.