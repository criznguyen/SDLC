# SDLC Workflow — Reference

## Folder structure: one per epic/feature (PO and Business BA)

- **PO**: `docs/sdlc/po/{epic-slug}/` — one folder per epic. Files: epic-brief.md, user-stories.md. Do not put all epics in one file.
- **Business BA**: `docs/sdlc/ba/business/{epic-slug}/` — same slug as PO. Files: functional-requirements.md, process-flows.md. Do not merge all epics into one file.
- **Design (if app/web)**: `docs/sdlc/design/{epic-slug}/` — same slug as PO/BA. Design specs (Markdown) + optional HTML wireframes; PO+BA review until approved.
- **QE**: `docs/sdlc/qe/{epic-slug}/` — same slug as PO/BA. Files: test-plan.md, test-cases.md, automation artifacts. Do not put all epics in one file.

## PO: Epic Brief Template
# Epic: [Name]
## Problem / Success Metrics / User Stories / Acceptance Criteria / Priority

## Business BA: Functional Requirement
FR-001: [Title] — Description, Trigger, Process Flow, Output, Constraints

## Architect: ADR Template
# ADR-001: [Title] — Status, Context, Decision, Consequences

## Technical BA: API Spec
POST /api/v1/[resource] — Purpose, Request, Response, Contract

## Design (if app/web)
Design specs (Markdown) + optional HTML wireframes from idea + PO + BA (before Architect; UX drives tech). Output: docs/sdlc/design/{epic-slug}/. PO + BA review until approved; loop if not aligned. Handoff to Architect.

## QE: Test Case
TC-001: [Scenario] — Precondition, Steps, Expected, Links to AC

## QE Team (one folder per epic: qe/{epic-slug}/)
- QE Lead (15+ yrs automation): test strategy, framework, automation architecture, review → docs/sdlc/qe/{epic-slug}/
- Senior QE (10+ yrs): write automation tests → docs/sdlc/qe/{epic-slug}/

## Dev Team
- Tech Lead (15+ yrs): tech stack, review & merge → docs/sdlc/dev/tech-lead/
- Senior Dev (10+ yrs): implement, Unit Test ≥90% → docs/sdlc/dev/senior-developer/
- By project (all Senior 10+ yrs): Senior Frontend, Backend, Mobile, Embedded, Data/ML, Platform → docs/sdlc/dev/{role}/

## Security + Principle Engineer (after implementation)
- Security team: audit security risk → docs/sdlc/security/
- Principle Engineer: audit logic, architecture → docs/sdlc/principle-engineer/
- **Fix loop**: If issues → Dev fixes → re-audit; repeat until all resolved. Sign-off → Deploy

## Deploy
After Security + Principle Engineer sign-off → Docker Compose + K8s. See docs/sdlc/deploy/

## Maintenance
After Deploy → ongoing: monitoring, bug fixes, patches, dependency updates, performance tuning. Significant new features → loop back to PO for new epic. See docs/sdlc/maintenance/
