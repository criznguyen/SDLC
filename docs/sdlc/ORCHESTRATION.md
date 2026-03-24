# Pipeline orchestration

## Trigger

When the user sends an **idea**, **feature request**, or **requirement** (e.g. "I want a login page", "We need an API for X"):

1. **Trigger the full pipeline** and run **Phase 1 → 2 → … → 11 in sequence**.
2. **One role per phase:** For each phase, act only as that role, write outputs to the correct `docs/sdlc/...` folder, then **continue to the next phase** without asking the user to "run next step".
3. **Run through to Maintenance.** Do not stop after PO, BA, or Dev unless the user explicitly says to stop.

## How it runs (Cursor and similar)

There is **one agent** per conversation. It simulates the pipeline by **adopting one role per phase** in order: Phase 1 as PO only → Phase 2 as Business BA only → … → Phase 11 as Maintenance. Do not mix roles in one step. If the tool later supports separate agents per phase, use that; otherwise this single-agent simulation is correct.

## DocPack Protocol (Context Optimization)

Each phase **packs** its output and the next phase **reads packed files** instead of loading all individual docs. This reduces agent context usage by ~50%.

**Rule: Pack after write, read packed before work.**

```
Phase N completes → sdlc-workflow pack docs/sdlc/{phase-folder}/ → {phase-folder}.packed.md
Phase N+1 starts  → read {previous-phase}.packed.md (NOT individual files)
```

**Per-phase pack/unpack flow:**
1. Phase completes → write docs to folder as normal
2. Run `sdlc-workflow pack docs/sdlc/{folder}/` → creates `{folder}.packed.md` in same parent
3. Next phase reads ONLY the `.packed.md` file(s) from previous phases
4. If a phase needs to edit a previous phase's doc → `sdlc-workflow unpack` → edit → re-pack

**What to pack:** Each epic folder and each phase folder gets its own `.packed.md`.
**What NOT to pack:** Code files, Docker/K8s configs, HTML wireframes — only `.md` docs.

## Checklist per run

- [ ] Phase 1 PO: artifacts in `docs/sdlc/po/{epic-slug}/` → **pack** → `po/{epic-slug}.packed.md`
- [ ] Phase 2 Business BA: `docs/sdlc/ba/business/{epic-slug}/` → **pack** → `ba/business/{epic-slug}.packed.md`
- [ ] Phase 3 Design (if app/web): `docs/sdlc/design/{epic-slug}/` → **pack** → `design/{epic-slug}.packed.md`; PO+BA review (read packed)
- [ ] Phase 4 Architect: `docs/sdlc/architecture/` → **pack** → `architecture.packed.md`
- [ ] Phase 5 Technical BA: `docs/sdlc/ba/technical/` → **pack** → `ba/technical.packed.md`
- [ ] Phase 6 QE docs: `docs/sdlc/qe/{epic-slug}/` → **pack** → `qe/{epic-slug}.packed.md`
- [ ] Phase 7 Dev: code + unit tests; read `*.packed.md` for specs — `docs/sdlc/dev/`
- [ ] Phase 8 QE testing + UAT: read packed specs; **bug-fix loop** until 0 open bugs → `docs/sdlc/qe/{epic-slug}/`
- [ ] Phase 9 Security + PE: read packed specs + code; **fix → retest → re-audit loop** until 0 issues → `docs/sdlc/security/`, `docs/sdlc/principle-engineer/`
- [ ] Phase 10 Deploy: `docs/sdlc/deploy/`, Docker Compose + K8s
- [ ] Phase 11 Maintenance: `docs/sdlc/maintenance/`
