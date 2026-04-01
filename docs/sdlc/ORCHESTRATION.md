# Pipeline Orchestration

## Trigger

When the user sends an **idea**, **feature request**, or **requirement**:

1. **Trigger the full pipeline** and run continuously through deployment.
2. **One role per phase** — adopt only the specified `[ROLE]` badge per phase.
3. **Run through to Maintenance.** Do not stop after PO, BA, or Dev unless the user explicitly says to stop.

---

## 🚦 The Orchestrator's Most Important Rule

> **Parallel by default. Sequential only when required.**

Before running any two workstreams, ask: "Does workstream B depend on workstream A's output?"
- **Yes** → Run sequentially (A first, then B)
- **No** → **Run in parallel immediately**

---

## Execution Map

```
PHASE 0 → PHASE 1 → PHASE 2 → PHASE 3 → PHASE 4 → PHASE 5 (Technical BA)
                                                     │
                                    ┌────────────────┴────────────────┐
                                    │  TECHNICAL BA COMPLETE          │
                                    │  Spawn Track A immediately       │
                                    └─────────────────────────────────┘
                                                         │
                     ┌────────────────────────────────────┼────────────────────────────────────┐
                     │                                    │                                    │
                     ↓                                    ↓
            ┌─────────────────┐               ┌─────────────────┐
            │  TRACK A1       │               │  TRACK A2       │
            │  [DEV]          │               │  [QE]           │
            │  Implementation │               │  Test Plan      │
            │  ⚡ PARALLEL    │               │  ⚡ PARALLEL     │
            │  All roles:     │               │                 │
            │  FE/BE/MOBILE/ │               │                 │
            │  EMB/DATA/      │               │                 │
            │  PLATFORM       │               │                 │
            └─────────────────┘               └─────────────────┘
                              │                        │
                              └───────────┬────────────┘
                                          ↓
                              ┌─────────────────────┐
                              │  BOTH TRACKS COMPLETE│
                              └──────────┬──────────┘
                                         │
                        ┌────────────────┼────────────────┐
                        │  Spawn Track B immediately      │
                        └─────────────────────────────────┘
                                         │
          ┌────────────────────────────────┼────────────────────────────────┐
          │                                │                                │
          ↓                                ↓                                ↓
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│  TRACK B1       │             │  TRACK B2       │             │  TRACK B3       │
│  [QE]           │             │  [SEC]          │             │  [PERF]         │
│  Test Execution │             │  Security Audit │             │  Perf Audit     │
│  ⚡ PARALLEL    │             │  ⚡ PARALLEL    │             │  ⚡ PARALLEL    │
└─────────────────┘             └─────────────────┘             └─────────────────┘
          │                                │                                │
          └────────────────────────────────┼────────────────────────────────┘
                                           ↓
                              ┌─────────────────────┐
                              │  MERGE GATE         │
                              │  (sequential)       │
                              └──────────┬──────────┘
                                         │
                            IF Critical/High found:
                              → 🔁 REMEDIATION LOOP
                              → [DEV] fix → [QE] retest → re-audit
                              → Max 3 cycles
                            ELSE:
                              → ✅ QUALITY GATE PASSED
                                         │
                                         ↓
                              [OPS] Deploy → Maintenance
```

---

## Checklist Per Run

### Sequential phases

- [ ] Phase 0 Discovery: raw request captured
- [ ] Phase 1 `[PO]`: artifacts in `docs/sdlc/po/{epic-slug}/` (one folder per epic)
- [ ] Phase 2 `[BA]`: `docs/sdlc/ba/business/{epic-slug}/` (one folder per epic)
- [ ] Phase 3 `[UX]` (if app/web): design specs + wireframes in `docs/sdlc/design/{epic-slug}/`; `[PO]`+`[BA]` review until approved
- [ ] Phase 4 `[SA]`: `docs/sdlc/architecture/`
- [ ] Phase 5 Technical `[BA]`: `docs/sdlc/ba/technical/`

### ⚡ Parallel Track A (spawn immediately after Phase 5)

- [ ] **Spawn `[DEV]` (5b)** — implementation (all roles: `[FE]`/`[BE]`/`[MOBILE]`/`[EMB]`/`[DATA]`/`[PLATFORM]`)
- [ ] **Spawn `[QE]` (5a)** — test plan + test cases in parallel
- [ ] **Do NOT wait** for one to finish before starting the other

### ⚡ Parallel Track B (spawn when `[DEV]` is complete)

- [ ] **Spawn `[QE]`** — test execution, bug reports
- [ ] **Spawn `[SEC]`** — security audit, OWASP, STRIDE, CVE
- [ ] **Spawn `[PERF]`** — performance audit, latency, N+1, k6
- [ ] **All three run simultaneously** — merge gate only after all complete

### Post-merge

- [ ] Phase 9 `[OPS]`: `docs/sdlc/deploy/` — Docker Compose + K8s + IaC
- [ ] Phase 10: Project Completion Package → `SHIPPED ✅`
- [ ] Phase 11 Maintenance: monitoring, bug fixes, patches

---

## Coordination Rules

### How it runs (Cursor and similar)

There is **one agent** per conversation. It simulates the pipeline by **adopting one role per phase** in order for sequential phases, and **spawning parallel workstreams** for Track A and Track B.

When the agent reaches "Technical BA complete":
- It becomes `[DEV]` (spawning all implementation roles as parallel tasks)
- AND simultaneously becomes `[QE]` (spawning test plan writing as parallel task)
- When both complete → becomes `[QE]` + `[SEC]` + `[PERF]` simultaneously for Phase 8 audits

### When parallel, when sequential

| Decision point | Question | Answer |
|---------------|----------|--------|
| Phase 1 after Phase 0? | Does Phase 1 need Phase 0 output? | **Yes → Sequential** |
| `[DEV]` (5b) + `[QE]` (5a)? | Does `[DEV]` need QE docs to start? | **No → Parallel** |
| `[FE]` + `[BE]`? | Does frontend need backend API done first? | **No → Parallel** (coordinate via API contract) |
| Phase 8 audits? | Do `[QE]`/`[SEC]`/`[PERF]` depend on each other? | **No → Parallel** |
| Remediation loop? | Must issues be fixed before re-audit? | **Yes → Sequential** |
| Merge gate? | Must all audits report before gate? | **Yes → Sequential** |

### Spawning parallel agents in Claude Code

```markdown
# Example: spawning Track A in parallel
When Technical BA is complete, spawn the following agents simultaneously:

Agent 1 — [DEV] Backend:
  Role: Senior Backend Developer (10+ yrs)
  Task: Implement API endpoints, services, DB layer per Technical BA spec
  Output: docs/sdlc/dev/backend/

Agent 2 — [DEV] Frontend:
  Role: Senior Frontend Developer (10+ yrs)
  Task: Implement UI components per Design spec + API contract
  Output: docs/sdlc/dev/frontend/

Agent 3 — [QE]:
  Role: Senior QA Engineer (10+ yrs)
  Task: Write test plan + test cases per Technical BA spec
  Output: docs/sdlc/qe/{epic-slug}/

All three agents run in parallel. Do not wait for one to finish before starting the others.
```

```markdown
# Example: spawning Track B in parallel
When [DEV] implementation is complete, spawn the following agents simultaneously:

Agent 1 — [QE]:
  Role: QE Lead (15+ yrs automation)
  Task: Execute all test suites, report bugs, enforce 100% coverage gate
  Output: docs/sdlc/qe/{epic-slug}/test-execution-report.md

Agent 2 — [SEC]:
  Role: Security Auditor
  Task: OWASP Top 10, STRIDE threat model, CVE scan, compliance review
  Output: docs/sdlc/security/security-assessment-report.md

Agent 3 — [PERF]:
  Role: Performance Auditor
  Task: Latency benchmarks (p95<500ms), N+1 detection, k6 load test
  Output: docs/sdlc/security/performance-assessment-report.md

All three agents run in parallel on the same artifact. Merge gate activates after all three report.
```
