# SDLC Workflow (Multi-Role)

Use this doc with **Claude** (copy to Custom Instructions / Projects) or **@ mention** in chat.
For Cursor, see .cursor/rules/sdlc-workflow.mdc

## Flow

```
User Request → PO → Business BA → Architect → Technical BA → Dev Teams → QE → Deploy
```

## Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Architect | ADRs, system diagrams |
| 4 | Technical BA | API specs, tech breakdown |
| 5 | Dev Teams | Code, tests |
| 6 | QE | Test plan, sign-off |
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

### Phase 5: Dev Teams
- Backend, Frontend, Mobile — implement per spec

### Phase 6: QE
- Test plan, test cases, sign-off
- Output: `docs/sdlc/qe/`

See [reference.md](./reference.md) for templates.
