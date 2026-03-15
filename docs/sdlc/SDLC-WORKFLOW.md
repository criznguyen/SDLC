# SDLC Workflow (Multi-Role)

Use this doc with **Claude** (copy to Custom Instructions / Projects) or **@ mention** in chat.
For Cursor, see .cursor/rules/sdlc-workflow.mdc

## Flow

```
User Request → PO → Business BA → Architect → Technical BA → QE (docs) → Dev → QE (testing) → Deploy
```

## Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Architect | ADRs, system diagrams |
| 4 | Technical BA | API specs, tech breakdown |
| 5a | QE (docs) | Test plan, test cases |
| 5b | Dev | Code, unit tests (≥90%) |
| 6 | QE (testing) | Automation + manual, sign-off |
| 7 | Ops | Deploy, monitor |

## Phase Details

### Phase 1: PO
- Epic brief, user stories, acceptance criteria
- Output: `docs/sdlc/po/`

### Phase 2: Business BA
- Functional requirements, process flows, use cases
- Output: `docs/sdlc/ba/business/`

### Phase 3: Architect
- System context, container diagram, ADRs, tech stack
- Output: `docs/sdlc/architecture/`

### Phase 4: Technical BA
- API specs, DB schema, team breakdown
- Output: `docs/sdlc/ba/technical/`

### Phase 5a: QE (Docs)
- Test plan, test cases — **before Dev implements**
- Output: `docs/sdlc/qe/`
- **Then**: Dev team starts implementation

### Phase 5b: Dev Teams
- **Tech Lead (15+ yrs)**: Tech stack, libraries; review & merge. Output: `docs/sdlc/dev/tech-lead/`
- **Senior Developer (10+ yrs)**: Implement features. Output: `docs/sdlc/dev/senior-developer/`
- **Requirement**: Unit Test coverage **≥ 90%**
- **Then**: QE starts testing phase

### Phase 6: QE (Testing)
- After Dev unit tests complete: automation tests + manual tests, sign-off

### Phase 7: Deploy
- Release, monitor

See [reference.md](./reference.md) for templates.
