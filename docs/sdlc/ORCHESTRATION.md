# Pipeline orchestration

## Trigger

When the user sends an **idea**, **feature request**, or **requirement** (e.g. "I want a login page", "We need an API for X"):

1. **Trigger the full pipeline** and run **Phase 1 → 2 → … → 11 in sequence**.
2. **One role per phase:** For each phase, act only as that role, write outputs to the correct `docs/sdlc/...` folder, then **continue to the next phase** without asking the user to "run next step".
3. **Run through to Maintenance.** Do not stop after PO, BA, or Dev unless the user explicitly says to stop.

## How it runs (Cursor and similar)

There is **one agent** per conversation. It simulates the pipeline by **adopting one role per phase** in order: Phase 1 as PO only → Phase 2 as Business BA only → … → Phase 11 as Maintenance. Do not mix roles in one step. If the tool later supports separate agents per phase, use that; otherwise this single-agent simulation is correct.

## Checklist per run

- [ ] Phase 1 PO: artifacts in `docs/sdlc/po/{epic-slug}/` (one folder per epic)
- [ ] Phase 2 Business BA: `docs/sdlc/ba/business/{epic-slug}/` (one folder per epic)
- [ ] Phase 3 Design (if app/web): design specs + wireframes in `docs/sdlc/design/{epic-slug}/`; PO+BA review until approved
- [ ] Phase 4 Architect: `docs/sdlc/architecture/`
- [ ] Phase 5 Technical BA: `docs/sdlc/ba/technical/`
- [ ] Phase 6 QE docs: `docs/sdlc/qe/{epic-slug}/` (one folder per epic)
- [ ] Phase 7 Dev: code + unit tests, `docs/sdlc/dev/`
- [ ] Phase 8 QE testing + UAT: automation, UAT; **bug-fix loop** (bugs → Dev fix → QE retest) until 0 open bugs → `docs/sdlc/qe/{epic-slug}/`
- [ ] Phase 9 Security + Principle Engineer: audit → **fix → retest → re-audit loop** until 0 issues/vulnerabilities; sign-off → `docs/sdlc/security/`, `docs/sdlc/principle-engineer/`
- [ ] Phase 10 Deploy: `docs/sdlc/deploy/`, Docker Compose + K8s
- [ ] Phase 11 Maintenance: monitoring, bug fixes, patches, dependency updates → `docs/sdlc/maintenance/`
