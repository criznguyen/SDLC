# QE (Quality Engineering)

**One folder per epic/feature.** Do not put all epics in one file.

- Use the same epic/feature slug as PO and Business BA: `docs/sdlc/qe/{epic-slug}/`
- Inside that folder: `test-plan.md`, `test-cases.md` (Phase 5a), and for Phase 6: automation notes, framework decision for that epic, etc.

## Detailed tasks (Docs phase — Phase 5a)

- [ ] **Read packed inputs**: `ba/technical.packed.md` + `design/{epic-slug}.packed.md` (if app/web) — do NOT load individual files
- [ ] **Test plan**: Scope (unit, integration, E2E), coverage goals, risks
- [ ] **Test cases**: TC-001, TC-002... — precondition, steps, expected, links to AC
- [ ] **Pack output**: `sdlc-workflow pack docs/sdlc/qe/{epic-slug}/` → `qe/{epic-slug}.packed.md`
- [ ] **Handoff to Dev**: Pass `qe/{epic-slug}.packed.md` → Dev runs implementation

## Detailed tasks (Testing phase — Phase 6)

- [ ] **QE Lead**: Test strategy, framework, review test code
- [ ] **Senior QE**: Write automation tests per test plan
- [ ] **UAT (User Acceptance Testing)**: Verify against original user stories and acceptance criteria from PO; confirm business requirements are met from end-user perspective. Document UAT results in `qe/{epic-slug}/uat-results.md`
- [ ] **Bug-fix loop**: If bugs or test failures found → **Dev fixes** → **QE retests**. **Repeat until all tests pass and UAT approved (0 open bugs)**. Only then → handoff to Security + PE
- [ ] **Sign-off**: Regression pass, coverage met, UAT approved, 0 open bugs → release readiness in `qe/{epic-slug}/`

Example:
```
docs/sdlc/qe/
  job-scheduler-event-bus/
    test-plan.md
    test-cases.md
    automation/   (Phase 6: Senior QE output)
  user-auth/
    test-plan.md
    test-cases.md
```

Two phases:
1. **Docs phase** — Test plan, test cases per epic in `qe/{epic-slug}/`. Done → **Dev runs implementation immediately**.
2. **Testing phase** — After Dev completes unit tests: QE Lead (15+ yrs automation: strategy, framework, review) + Senior QE (automation) + **UAT** (verify against user stories/AC) output to the same `qe/{epic-slug}/` (or subfolders there).

Use test-case.template.md for test cases.
