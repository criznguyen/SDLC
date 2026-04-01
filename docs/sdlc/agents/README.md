# Sub-Agents

Every role in the SDLC runs as a **sub-agent**. Each phase is assigned to a corresponding sub-agent.
**Role badges are mandatory** — every artifact must identify which `[ROLE]` produced it.

---

## 🚦 Parallel vs Sequential Orchestrator Rules

**The cardinal rule:** If two workstreams do NOT depend on each other's output, they MUST run in parallel.

### Sequential (mandatory — dependency chain)

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 Technical BA
```

Each phase's output is the next phase's input. Skipping or reordering causes rework.

### Parallel: Track A — Implementation + Test Plan

> **Spawn immediately when Technical BA completes.** Do NOT wait for one to finish before starting the other.

```
Technical BA complete
    ├──→ [DEV] implementation (all roles in parallel)
    └──→ [QE] test plan + test cases
              ↓ (both run simultaneously)
         Both complete → Phase 8
```

**Within `[DEV]` implementation — all roles run in parallel:**

```
[FE] builds UI      ←→ [BE] builds API     ←→ [MOBILE] builds app
[EMB] builds fw    ←→ [DATA] builds ETL   ←→ [PLATFORM] builds infra
```

Frontend does NOT wait for backend. Backend does NOT wait for frontend. They coordinate via API contract from Technical BA.

### Parallel: Track B — Quality Gates

> **Spawn immediately when `[DEV]` implementation is complete.** All three agents audit the same artifact simultaneously. Do NOT wait for one to finish before starting another.

```
[DEV] code complete
    ├──→ [QE] executes test suites
    ├──→ [SEC] security audit          ← ALL RUNNING IN PARALLEL
    └──→ [PERF] performance audit
              ↓ Merge gate (sequential)
         ✅ QUALITY GATE PASSED
```

### When to merge back to sequential

| Situation | Action |
|-----------|--------|
| `[DEV]` (5b) AND `[QE]` (5a) both complete | Merge → spawn Phase 8 |
| `[QE]` + `[SEC]` + `[PERF]` all report | Merge gate → assess findings |
| Critical/High issues found | Sequential: `[DEV]` fix → `[QE]` retest → re-audit |

---

## 🔁 Remediation Loop (All Issues Must Have Issue ID)

When `[QE]`, `[SEC]`, or `[PERF]` find issues during Phase 8 audits:

| Issue Type | → Responsible |
|------------|--------------|
| Logic / business bug | `[BA]` re-analysis → `[DEV]` fix |
| Architectural flaw | `[SA]` ADR revision → `[DEV]` fix |
| UI/UX usability issue | `[UX]` spec update → `[DEV]` fix |
| Security vulnerability | `[SEC]` guidance → `[DEV]` fix |
| Performance bottleneck | `[PERF]` guidance → `[SA]` / `[DEV]` |
| Missing test coverage | `[QE]` additional test cases |

**Rules:**
- Every issue **must** have an Issue ID: `SEC-001`, `PERF-003`, `QE-007`, etc.
- Track cycle count: `🔁 CYCLE 1` → `🔁 CYCLE 2` → `🔁 CYCLE 3`
- **Max 3 cycles per issue** — escalate if unresolved after 3 loops
- After fixes: `[DEV]` fix → `[QE]` retests → `[SEC]` / `[PERF]` re-audit
- Only proceed when **all Critical + High issues = RESOLVED**

---

## Role Sub-Agent Table

| Role Badge | Sub-agent | When spawned | Parallel with |
|-------------|-----------|-------------|---------------|
| `[PO]` | po | On user request | — |
| `[BA]` | business-ba | After `[PO]` complete | — |
| `[UX]` | design | After `[BA]` complete (if app/web) | — |
| `[SA]` | architect | After `[UX]` / `[BA]` complete | — |
| `[BA]` | technical-ba | After `[SA]` complete | — |
| **`[QE]`** | qe-docs | **Immediately after Technical BA** | **⚡ `[DEV]` (5b)** |
| **`[DEV]`** | senior-dev | **Immediately after Technical BA** | **⚡ `[QE]` (5a)** |
| **`[FE]`** | frontend | **Immediately after Technical BA** | **⚡ All other `[DEV]` roles** |
| **`[BE]`** | backend | **Immediately after Technical BA** | **⚡ All other `[DEV]` roles** |
| **`[MOBILE]`** | mobile | **Immediately after Technical BA** | **⚡ All other `[DEV]` roles** |
| **`[EMB]`** | embedded | **Immediately after Technical BA** | **⚡ All other `[DEV]` roles** |
| **`[DATA]`** | data-ml | **Immediately after Technical BA** | **⚡ All other `[DEV]` roles** |
| **`[PLATFORM]`** | platform | **Immediately after Technical BA** | **⚡ All other `[DEV]` roles** |
| **`[QE]`** | qe-lead | **Immediately after `[DEV]` complete** | **⚡ `[SEC]` + `[PERF]`** |
| **`[SEC]`** | security | **Immediately after `[DEV]` complete** | **⚡ `[QE]` + `[PERF]`** |
| **`[PERF]`** | performance | **Immediately after `[DEV]` complete** | **⚡ `[QE]` + `[SEC]`** |
| `[PE]` | principle-engineer | After `[SEC]`/`[PERF]` complete | — |
| `[OPS]` | deploy | After all Phase 8 audits pass | — |
| `[OPS]` | maintenance | After deploy | — |

---

## Quality Standards Per Role

| Role Badge | Mandatory Standard |
|------------|--------------------|
| `[PO]` | Every requirement traces to a business KPI |
| `[BA]` | Every user story has Gherkin AC + edge case |
| `[UX]` | Every screen addresses WCAG 2.1 AA + mobile-first |
| `[SA]` | Every ADR has rationale + trade-off documented |
| `[DEV]` | Every function: docstring + error handling + unit test (100%) |
| `[QE]` | 100% branch coverage; every happy path + ≥3 negative paths |
| `[SEC]` | Zero Critical; High must have mitigation or accepted-risk doc |
| `[PERF]` | p95 < 500ms for API; DB queries must have execution plan review |
| `[OPS]` | All secrets in Vault/SSM; no hardcoded credentials; IaC passes tfsec |

---

## Response Format (Mandatory)

Every agent response MUST follow this structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 APEX — [PHASE NAME] | [ROLE BADGE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INPUT RECEIVED
[What was received from previous phase or business]

🔄 PROCESSING
[Current role's analysis/work — detailed, professional, complete]

📤 OUTPUT ARTIFACT: [Artifact Name]
[Full artifact content — never abbreviated, never "..." placeholders]

🚦 GATE STATUS
[ ] Pending review     [✅] Approved     [🔴] Blocked — reason: ...

⏭️ NEXT ACTION
[What triggers next, which role activates, what they need]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Orchestrator Instructions

**Trigger:** On user idea/request, run the full pipeline.
**Parallel by default:** When Technical BA is complete, spawn BOTH `[DEV]` (5b) AND `[QE]` (5a) simultaneously.
**Parallel Phase 8:** When `[DEV]` is complete, spawn `[QE]` + `[SEC]` + `[PERF]` simultaneously.
**Sequential only when required:** Merge gate, remediation loop, phase gates.
**Do not stop** after one phase until Deploy unless the user explicitly asks.
**⚠️ Self-correction:** If upstream output is incomplete/inconsistent, STOP, flag upstream gap, re-execute affected phase, resume.
**Role badges are mandatory** on every artifact.

See docs/sdlc/SDLC-WORKFLOW.md for full phase details and parallel execution diagrams.
