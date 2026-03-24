# Sub-Agents

Every role in the SDLC runs as a **sub-agent**. Each phase is assigned to a corresponding sub-agent.

## DocPack Rule

**Each sub-agent reads `.packed.md` from previous phases, NOT individual files.** After writing output, pack the folder. This cuts context usage by ~50%.

```
sdlc-workflow pack docs/sdlc/{folder}/     → {folder}.packed.md
sdlc-workflow unpack {folder}.packed.md     → restore individual files
sdlc-workflow inspect {folder}.packed.md    → list contents
```

## Agent I/O Table

| Role | Sub-agent | Input (read `.packed.md`) | Output | Pack |
|------|-----------|---------------------------|--------|------|
| PO | po | User request | po/{epic-slug}/ | `po/{epic-slug}.packed.md` |
| Business BA | business-ba | `po/{epic-slug}.packed.md` | ba/business/{epic-slug}/ | `ba/business/{epic-slug}.packed.md` |
| Design | design | `po/*.packed.md` + `ba/business/*.packed.md` | design/{epic-slug}/ | `design/{epic-slug}.packed.md` |
| Architect | architect | `ba/business/*.packed.md` + `design/*.packed.md` | architecture/ | `architecture.packed.md` |
| Technical BA | technical-ba | `architecture.packed.md` + `design/*.packed.md` | ba/technical/ | `ba/technical.packed.md` |
| QE (docs) | qe-docs | `ba/technical.packed.md` + `design/*.packed.md` | qe/{epic-slug}/ | `qe/{epic-slug}.packed.md` |
| Tech Lead | tech-lead | `ba/technical.packed.md` + `architecture.packed.md` | dev/tech-lead/ | — |
| Senior Dev | senior-dev | `ba/technical.packed.md` + `qe/*.packed.md` | Code + tests | — |
| QE Lead | qe-lead | `qe/{epic-slug}.packed.md` + `ba/technical.packed.md` | qe/{epic-slug}/ | — |
| Senior QE | senior-qe | `qe/{epic-slug}.packed.md` | Automation tests | — |
| Security | security | `architecture.packed.md` + `ba/technical.packed.md` + code | security/ | — |
| Principle Engineer | principle-engineer | `architecture.packed.md` + code | principle-engineer/ | — |
| Deploy | deploy | Sign-off | deploy/ | — |
| Maintenance | maintenance | Live app | maintenance/ | — |

Orchestrator: run each sub-agent in order; hand off `.packed.md` → input of the next sub-agent.

**Trigger:** On user idea/request, run the full pipeline (see docs/sdlc/ORCHESTRATION.md). One role per phase; single agent simulates by switching role each phase. Do not stop after one phase until Deploy unless the user asks.
