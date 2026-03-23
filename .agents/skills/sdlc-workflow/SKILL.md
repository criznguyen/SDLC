---
name: sdlc-workflow
description: Multi-role SDLC workflow from user requirements through PO, Business BA, Architect, Technical BA, Dev teams, and QE. Use when user sends an idea, feature request, or requirement — trigger full pipeline through deployment. Use when user mentions SDLC, requirements, PO, BA, Architect, technical spec, phased development, or handoff between roles.
---

# SDLC Workflow (Multi-Role)

Sequential workflow; **each role runs as a sub-agent**. Each phase produces docs/artifacts for the next. After completion → deploy with **Docker Compose** and **K8s** (docs/sdlc/deploy/).

## Trigger and orchestration (mandatory)

**When the user sends an idea, feature request, or new requirement:**
1. **Trigger the pipeline** and run it **continuously through deployment** (Phase 1 → 2 → … → 7).
2. **One role per phase.** For each phase, act **only** as that role (e.g. only PO in phase 1, only Business BA in phase 2). Produce that phase's outputs into the correct folder, then **continue to the next phase** without waiting for the user.
3. **Run in order:** PO → Business BA → **Design (if app/web, PO+BA review loop)** → Architect → Technical BA → QE (docs) → Dev → QE (testing + UAT) → **Security + Principle Engineer audit → fix loop until all issues resolved** → Deploy → Maintenance. Do not stop after one phase unless the user explicitly asks to stop.

**Note:** In Cursor and similar tools there is a single agent per conversation. "Sub-agent" means **one role per phase** — the same agent must adopt exactly one role per phase and run phases in sequence (do not mix roles in one step). If the platform later supports spawning separate agents per phase, use that; otherwise this single agent simulates the pipeline by switching role each phase.

**Sub-agent specs**: docs/sdlc/agents/

## Flow Overview

```
User Request → PO → Business BA → Design (if app/web) → Architect → Technical BA → QE (docs) → Dev → QE (testing + UAT) → Security + PE audit → [fix loop until no issues] → Deploy → Maintenance
```

**Determine current phase** before acting. If user sent an idea, assume Phase 0 and start from Phase 1.

---

## Phase 0: User Request / Discovery

**Trigger**: New feature request, bug report, or requirement from stakeholder.
**Output**: Initial request logged, ready for PO.

## Phase 1: PO (Product Owner)

**Role**: Prioritize, clarify business value, create product docs.
**Deliverables**: Epic/Feature brief, user stories, acceptance criteria, priority, dependencies.
**Output**: `docs/sdlc/po/{epic-slug}/` — **one folder per epic** (e.g. `po/job-scheduler-event-bus/epic-brief.md`). Do not put all epics in one file. **Handoff to Business BA.**

## Phase 2: Business BA (Business Analyst)

**Role**: Break down from business perspective.
**Deliverables**: Business process flows, functional requirements, use cases, glossary.
**Output**: `docs/sdlc/ba/business/{epic-slug}/` — **one folder per epic** (same slug as PO). Do not merge all epics into one file. **Handoff to Design (if app/web) or Architect.**

## Phase 3: Design (optional — app/web only)

**When:** Project has UI (web, mobile app). Skip for API-only, library, CLI, data/ML, platform without UI.

**Role**: Create UI/UX design specs (Markdown) and optional HTML wireframes from idea + PO + Business BA docs. Design **before** Architect so UX drives technical decisions.
**Output**: `docs/sdlc/design/{epic-slug}/` — design-spec.md + optional wireframes/.

**Review loop:**
1. **PO review**: Design aligns with epic brief, user stories, acceptance criteria?
2. **Business BA review**: Design matches functional requirements, process flows?
3. **If not approved**: Capture feedback → redesign → repeat until PO and BA approve.
4. **If approved** → **Handoff to Architect.**

## Phase 4: Architect

**Role**: Design system architecture and technology choices.
**Deliverables**: System context, container diagram, ADRs, tech stack, cross-cutting concerns.
**Input**: Business BA + Design (if app/web) — design informs architecture.
**Output**: `docs/sdlc/architecture/` — **Handoff to Technical BA.**

## Phase 5: Technical BA

**Role**: Translate business + architecture + design into implementable specs.
**Deliverables**: API specs, DB schema, team breakdown, acceptance criteria per ticket.
**Input**: Architect + Design (if app/web) — design informs API/screen contracts.
**Output**: `docs/sdlc/ba/technical/` — **Handoff to QE + Dev.**

## Phase 5a: QE (Docs phase)

**Role**: Create test plan, test cases before Dev implements.
**Deliverables**: Test plan, test cases.
**Output**: `docs/sdlc/qe/{epic-slug}/` — **one folder per epic** (same slug as PO/BA). Test plan, test cases inside. Do not put all epics in one file. After docs phase → **Dev team runs implementation immediately** (no extra gate).

## Phase 5b: Dev Teams

**Trigger**: After docs are done (Technical BA + QE docs). **Dev runs implementation immediately.**

**Roles** (vary by project — use only what applies; see `docs/sdlc/dev/implementation-roles.template.md`). All implementation roles are **Senior (10+ yrs)**:
- **Tech Lead (15+ yrs)**: Tech stack, review & merge. Docs: `docs/sdlc/dev/tech-lead/`
- **Senior Developer (10+ yrs)**: Implement per spec (generic). Docs: `docs/sdlc/dev/senior-developer/`
- **Senior Frontend (10+ yrs)**: Web UI. Docs: `docs/sdlc/dev/frontend/`
- **Senior Backend (10+ yrs)**: API, services. Docs: `docs/sdlc/dev/backend/`
- **Senior Mobile (10+ yrs)**: iOS/Android/cross-platform. Docs: `docs/sdlc/dev/mobile/`
- **Senior Embedded (10+ yrs)**: Firmware, IoT. Docs: `docs/sdlc/dev/embedded/`
- **Senior Data/ML (10+ yrs)**: ETL, models. Docs: `docs/sdlc/dev/data-ml/`
- **Senior Platform (10+ yrs)**: Infra, CI/CD. Docs: `docs/sdlc/dev/platform/`

**Requirements**: Unit Test coverage **≥ 90%**.

**Output**: Code + unit tests. **Handoff to QE (testing + UAT).**

## Phase 6: QE (Testing phase — automation)

**Trigger**: After Dev completes unit tests.
**Role**: Write and run **automation tests**, sign-off.

**Roles**:
- **QE Lead (15+ yrs automation)**: Test strategy, framework choice, automation architecture, review test code. Output per epic: `docs/sdlc/qe/{epic-slug}/`
- **Senior QE (10+ yrs)**: Write automation tests per QE Lead's strategy. Output per epic: `docs/sdlc/qe/{epic-slug}/` (e.g. automation/ or test files there)

**Output**: Automation tests, test report. **Handoff to Security + Principle Engineer.**

## Phase 8: Security + Principle Engineer (audit → fix loop)

**Trigger**: After QE testing sign-off.
**Roles** (can run in parallel):
- **Security team**: Audit security risk (OWASP, auth, secrets, infra). Output: `docs/sdlc/security/`
- **Principle Engineer**: Audit logic, architecture alignment, correctness. Output: `docs/sdlc/principle-engineer/`

**Fix loop**: If issues found → **Dev fixes** → re-audit by Security + Principle Engineer. **Repeat until all issues resolved.** Only when sign-off → **Handoff to Deploy.**

## Phase 9: Deploy

**Trigger**: After Security + Principle Engineer sign-off.
**Role**: Deploy with **Docker Compose** (local/staging) and **Kubernetes** (production).
**Output**: `docs/sdlc/deploy/` — docker-compose.yml, k8s manifests.

## Quick Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Design (if app/web) | Design specs + wireframes; PO+BA review until approved |
| 4 | Architect | ADRs, system diagrams |
| 5 | Technical BA | API specs, tech breakdown |
| 6 | QE (docs) | Test plan, test cases |
| 7 | Dev | Code, unit tests (≥90%) |
| 8 | QE (testing + UAT) | QE Lead (15+ yrs automation) + Senior QE (10+ yrs), automation, UAT, sign-off |
| 9 | Security + Principle Engineer | Security + logic audit; fix loop until all issues resolved; sign-off → Deploy |
| 10 | Deploy | Docker Compose + K8s |
| 11 | Maintenance | Monitoring, bug fixes, patches, dependency updates |

**Sub-agents**: Each role = one sub-agent. Design before Architect (UX drives tech). See docs/sdlc/agents/
See reference.md for templates.
