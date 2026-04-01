## SDLC Workflow

**Trigger:** When the user sends an **idea**, **feature request**, or **requirement**, run the full pipeline continuously through deployment. Do not stop after one phase unless the user asks.

**Memory requirement:** Before executing any new action, recall relevant memories (project context, user preferences, past decisions) to ensure continuity and avoid repeating mistakes.

**Parallel by default, sequential only when required:** If two workstreams do not depend on each other's output, they MUST run in parallel.

### Sequential (dependency chain)

```
Phase 0 → Phase 1 [PO] → Phase 2 [BA] → Phase 3 [UX] → Phase 4 [SA] → Phase 5 Technical [BA]
```

### ⚡ Parallel Track A (spawn immediately after Technical BA)

> `[DEV]` implementation AND `[QE]` test plan run simultaneously. Do NOT wait for one to finish before starting the other.

```
Technical BA complete
    ├──→ [DEV] implementation (all roles: [FE]/[BE]/[MOBILE]/[EMB]/[DATA]/[PLATFORM])
    └──→ [QE] test plan + test cases
              ↓
         Both complete → Phase 8
```

### ⚡ Parallel Track B (spawn when [DEV] is complete)

> `[QE]` + `[SEC]` + `[PERF]` audit the same artifact simultaneously.

```
[DEV] complete
    ├──→ [QE] test execution
    ├──→ [SEC] security audit          ← ALL IN PARALLEL
    └──→ [PERF] performance audit
              ↓ Merge gate (sequential)
         ✅ QUALITY GATE PASSED → [OPS] Deploy
```

### Phase sequence (with parallel tracks)

1. **Phase 1** `[PO]` — PRD, user stories, feasibility → `docs/sdlc/po/{epic-slug}/`
2. **Phase 2** `[BA]` — FRS, NFR, Gherkin, process flows → `docs/sdlc/ba/business/{epic-slug}/`
3. **Phase 3** `[UX]` (if app/web) — Design specs + wireframes → `docs/sdlc/design/{epic-slug}/`; `[PO]`+`[BA]` review until approved
4. **Phase 4** `[SA]` — ADRs, C4 diagrams, security by design → `docs/sdlc/architecture/`
5. **Phase 5** Technical `[BA]` — API specs (OpenAPI 3.x), team breakdown → `docs/sdlc/ba/technical/`
6. **⚡ Phase 5a** `[QE]` + **⚡ Phase 5b** `[DEV]` — run in parallel after Technical BA
   - `[QE]`: test plan + test cases → `docs/sdlc/qe/{epic-slug}/`
   - `[DEV]`: code + unit tests (100%) → `docs/sdlc/dev/{role}/`
7. **⚡ Phase 8** `[QE]` + `[SEC]` + `[PERF]` — run in parallel after `[DEV]` complete
   - Bug-fix loop → `[DEV]` fixes → `[QE]` retests → repeat until 0 open bugs
   - 🔁 Remediation loop until 0 Critical/High issues
8. **Phase 9** `[OPS]` — Docker Compose + K8s + IaC → `docs/sdlc/deploy/`
9. **Phase 10** — Project Completion Package → `SHIPPED ✅`
10. **Phase 11** Maintenance — monitoring, bug fixes, patches → `docs/sdlc/maintenance/`

### Quality standards

| Role | Standard |
|------|----------|
| `[PO]` | Every requirement traces to a business KPI |
| `[BA]` | Every user story has Gherkin AC + edge case |
| `[SA]` | Every ADR has rationale + trade-off |
| `[UX]` | Every screen: WCAG 2.1 AA + mobile-first |
| `[DEV]` | Every function: docstring + error handling + unit test (100%) |
| `[QE]` | 100% branch coverage; ≥3 negative paths per happy path |
| `[SEC]` | Zero Critical; High must have mitigation or accepted-risk doc |
| `[PERF]` | p95 < 500ms for API; no N+1 queries |
| `[OPS]` | Secrets in Vault/SSM; no hardcoded credentials; IaC passes tfsec |

### Remediation loop

Every issue must have an Issue ID (e.g. `SEC-001`). Track cycle: 🔁 CYCLE 1 → 🔁 CYCLE 2 → 🔁 CYCLE 3. Max 3 cycles per issue.

Design before Architect (UX drives tech). See docs/sdlc/SDLC-WORKFLOW.md and docs/sdlc/agents/
