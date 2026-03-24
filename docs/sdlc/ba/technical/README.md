# Technical BA

API/interface specs, DB schema, team breakdown.
Templates support: HTTP API, library/SDK, CLI, and all project types (see api-spec and team-breakdown).

## Detailed tasks

- [ ] **Read packed inputs**: `architecture.packed.md` + `design/{epic-slug}.packed.md` (if app/web) — do NOT load individual files
- [ ] **API/interface spec**: For each endpoint/class/command: purpose, request/response, contract (OpenAPI, TS types, CLI help)
- [ ] **DB schema**: Tables, columns, indexes, constraints; migrations approach
- [ ] **Team breakdown**: Map scope to teams (Backend, Frontend, Mobile, etc.) per project type; dependencies
- [ ] **Trace to FRs**: Map technical specs to functional requirements
- [ ] **Pack output**: `sdlc-workflow pack docs/sdlc/ba/technical/` → `ba/technical.packed.md`
- [ ] **Handoff to QE + Dev**: Pass `ba/technical.packed.md`
