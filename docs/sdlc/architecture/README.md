# Architect

ADRs, system diagrams, tech stack decisions.
Use adr.template.md for new ADRs.

## Detailed tasks

- [ ] **Read packed inputs**: `ba/business/{epic-slug}.packed.md` + `design/{epic-slug}.packed.md` (if app/web) — do NOT load individual files
- [ ] **Context diagram**: System boundary, external actors, integrations
- [ ] **Container diagram**: Main components/services and their responsibilities
- [ ] **Tech stack decisions**: Languages, frameworks, databases; document in ADRs
- [ ] **ADR per decision**: Context, decision, consequences (scope: backend, frontend, mobile, etc.)
- [ ] **Non-functional alignment**: Performance, security, scalability, compliance — reference NFRs from Business BA
- [ ] **Security by design (Shift Left)**: Threat model (STRIDE/attack surface), auth/authz architecture, data encryption at rest/transit, secrets management approach, dependency security policy. Document in ADR
- [ ] **Engineering principles alignment**: Verify architecture follows — SOLID, DRY, KISS, SoC, LoD, CoI, GRASP, High Availability, CQRS (if applicable), Zero Trust, EDA (if applicable), Statelessness, Disposability, Backing Services, Config (externalize), Database Sharding/Partitioning (if applicable), Codebase (single per service), Logging & Tracing, Monitoring & Alerting
- [ ] **Pack output**: `sdlc-workflow pack docs/sdlc/architecture/` → `architecture.packed.md`
- [ ] **Handoff to Technical BA**: Pass `architecture.packed.md`
