# SDLC Workflow (Multi-Role)

Use this doc with **Claude** (copy to Custom Instructions / Projects) or **@ mention** in chat.
For Cursor, see .cursor/rules/sdlc-workflow.mdc

## Trigger and orchestration

- **When the user sends an idea, feature request, or requirement:** Start the pipeline and run it **continuously through deployment** (Phase 1 → 2 → … → 7). Do not handle everything in one main-agent response.
- **Memory requirement:** Before executing any new action, recall relevant memories (project context, user preferences, past decisions) to ensure continuity and avoid repeating mistakes.
- **One role per phase:** Execute each phase as that role only; write artifacts to the right folder; then continue to the next phase. In Cursor there is one agent — it simulates the pipeline by adopting one role per phase in sequence.
- **Do not stop** after PO or any single phase unless the user explicitly asks to stop. Run through to Deploy.

## Flow

```
User Request → PO → Business BA → Design (if app/web) → Architect → Technical BA → QE (docs) → Dev → QE (testing + UAT) → [bug-fix loop until 0 bugs] → Security + PE audit → [fix → retest → re-audit loop until 0 issues] → Deploy → Maintenance
```

## Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories, feasibility assessment |
| 2 | Business BA | FRS, NFR, process flows |
| 3 | Design (if app/web) | Design specs + wireframes; PO+BA review until approved |
| 4 | Architect | ADRs, system diagrams, security by design |
| 5 | Technical BA | API specs, tech breakdown |
| 6 | QE (docs) | Test plan, test cases |
| 7 | Dev | Code, unit tests (≥90%), security shift-left |
| 8 | QE (testing + UAT) | Automation, UAT; **bug-fix loop** (QE finds bugs → Dev fix → QE retest) until 0 open bugs |
| 9 | Security + PE | Audit; **fix → retest → re-audit loop** (Dev fix → QE retest → re-audit) until 0 issues; sign-off → Deploy |
| 10 | Deploy | Docker Compose + K8s |
| 11 | Maintenance | Monitoring, bug fixes, patches, dependency updates |

**Sub-agents**: Each role runs as a sub-agent. See docs/sdlc/agents/

## Phase Details

### Phase 1: PO
- Feasibility study (technical, operational, economic), epic brief, user stories, acceptance criteria
- Output: `docs/sdlc/po/{epic-slug}/` — **one folder per epic**; do not put all epics in one file

### Phase 2: Business BA
- Functional requirements (FR), **non-functional requirements (NFR)** (performance, scalability, availability, security, usability), process flows, use cases
- Output: `docs/sdlc/ba/business/{epic-slug}/` — **one folder per epic** (same slug as PO); do not merge into one file

### Phase 3: Design (optional — app/web only)
- Create design specs (Markdown) + optional HTML wireframes based on idea + PO + BA docs. **Design before Architect so UX drives tech.** **Anti AI pattern**: designs must NOT look AI-generated — prioritize unique, human-feeling aesthetics.
- Output: `docs/sdlc/design/{epic-slug}/` — design-spec.md + optional wireframes/
- **PO + Business BA review**: Both check design vs epic/FRS; if not aligned → feedback → redesign loop until approved
- When approved → handoff to Architect

### Phase 4: Architect
- System context, container diagram, ADRs, tech stack, **security by design** (threat model, auth architecture, encryption, secrets mgmt). **Engineering principles**: SOLID, DRY, KISS, SoC, High Availability, CQRS, Zero Trust, EDA, Statelessness, Backing Services, Config, Logging & Tracing, Monitoring & Alerting. Input: Business BA (FR + NFR) + Design (if app/web)
- Output: `docs/sdlc/architecture/`

### Phase 5: Technical BA
- API specs, DB schema, team breakdown. Input: Architect + Design (if app/web)
- Output: `docs/sdlc/ba/technical/`

### Phase 5a: QE (Docs)
- Test plan, test cases
- Output: `docs/sdlc/qe/{epic-slug}/` — **one folder per epic**; do not put all epics in one file
- **After docs phase → Dev team runs implementation immediately** (no extra gate)

### Phase 5b: Dev Teams
- **Tech Lead (15+ yrs)**: Tech stack, review & merge, **security review (Shift Left)**: OWASP check, dependency audit, SAST in CI. Output: `docs/sdlc/dev/tech-lead/`
- **Implementation roles** (all Senior 10+ yrs; use only what applies): Senior Dev, Senior Frontend, Senior Backend, Senior Mobile, Senior Embedded, Senior Data/ML, Senior Platform → `docs/sdlc/dev/{role}/`. See `implementation-roles.template.md`.
- **Requirement**: Unit Test coverage **≥ 90%** (TDD/BDD); Clean Code, SOLID, DRY, KISS, SoC, POLS; security practices (input validation, no hardcoded secrets)
- **Then**: QE starts testing phase

### Phase 6: QE (Testing — automation + UAT) → bug-fix loop
- **QE Lead (15+ yrs automation)**: Test strategy, framework choice, automation architecture; review test code. Output per epic: `docs/sdlc/qe/{epic-slug}/`
- **Senior QE (10+ yrs)**: Write automation tests per QE Lead's strategy. Output per epic: `docs/sdlc/qe/{epic-slug}/`
- **UAT (User Acceptance Testing)**: Verify implementation against original user stories and acceptance criteria from PO; confirm business requirements are met from end-user perspective. Output: `qe/{epic-slug}/uat-results.md`
- **Bug-fix loop**: If QE finds bugs or test failures → **Dev fixes** → **QE retests**. **Repeat until all tests pass and UAT approved (0 open bugs).** Only then → handoff to Security + PE
- **Handoff to Security + Principle Engineer** (only after 0 open bugs)

### Phase 7: Security + Principle Engineer (audit → fix → retest loop)
- **Security team**: Audit security risk (OWASP, auth, secrets, infra). Output: `docs/sdlc/security/`
- **Principle Engineer**: Audit logic, architecture alignment, correctness. Output: `docs/sdlc/principle-engineer/`
- **Fix → retest → re-audit loop**: If issues/vulnerabilities found → **Dev fixes** → **QE retests** (verify fix, no regression) → **Security + PE re-audit**. **Repeat until 0 issues/vulnerabilities remain.** Sign-off → **Handoff to Deploy**

### Phase 8: Deploy
- After Security + Principle Engineer sign-off → deploy with **Docker Compose** (local/staging) and **Kubernetes** (production)
- Output: `docs/sdlc/deploy/` — docker-compose.yml, k8s/

### Phase 9: Maintenance
- **Monitoring**: Health checks, error tracking, alerting, SLA dashboards
- **Bug fixes**: Triage, fix, test, deploy per severity
- **Dependency updates**: Regular security patches, library upgrades
- **Performance tuning**: Monitor vs NFR targets; optimize bottlenecks
- **Feature iteration**: Small enhancements from feedback; significant scope → new PO epic
- Output: `docs/sdlc/maintenance/` — runbooks, incident logs

See [reference.md](./reference.md) for templates.
