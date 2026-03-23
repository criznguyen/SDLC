# Sub-Agents

Every role in the SDLC runs as a **sub-agent**. Each phase is assigned to a corresponding sub-agent.

| Role | Sub-agent | Input | Output |
|------|-----------|--------|--------|
| PO | po | User request | docs/sdlc/po/{epic-slug}/ (one folder per epic) |
| Business BA | business-ba | docs/sdlc/po/{epic-slug}/ | docs/sdlc/ba/business/{epic-slug}/ (one folder per epic) |
| Design (if app/web) | design | docs/sdlc/po + docs/sdlc/ba/business/ | docs/sdlc/design/{epic-slug}/; PO+BA review until approved |
| Architect | architect | docs/sdlc/ba/business/ + design (if any) | docs/sdlc/architecture/ |
| Technical BA | technical-ba | docs/sdlc/architecture/ + design (if any) | docs/sdlc/ba/technical/ |
| QE (docs) | qe-docs | docs/sdlc/ba/technical/ (+ design if any) | docs/sdlc/qe/{epic-slug}/ (one folder per epic) |
| Tech Lead | tech-lead | Technical spec | Review, merge, docs/sdlc/dev/tech-lead/ |
| Senior Dev | senior-dev | Spec + test plan | After docs → run implementation immediately. Code, unit tests (≥90%) |
| Senior Frontend | frontend | UI spec, API contract | Web UI, docs/sdlc/dev/frontend/ |
| Senior Backend | backend | API spec, DB schema | API, services, docs/sdlc/dev/backend/ |
| Senior Mobile | mobile | API contract, design | App (iOS/Android), docs/sdlc/dev/mobile/ |
| Senior Embedded | embedded | HW/spec, interfaces | Firmware, IoT, docs/sdlc/dev/embedded/ |
| Senior Data/ML | data-ml | Data spec, models | ETL, models, docs/sdlc/dev/data-ml/ |
| Senior Platform | platform | Infra spec | CI/CD, observability, docs/sdlc/dev/platform/ |
| QE Lead | qe-lead | Test plan | 15+ yrs automation: strategy, framework, review → docs/sdlc/qe/{epic-slug}/ |
| Senior QE | senior-qe | Test plan + framework | Automation tests → docs/sdlc/qe/{epic-slug}/ |
| Security | security | Code, infra | Security audit → docs/sdlc/security/; fix → retest → re-audit loop until 0 issues |
| Principle Engineer | principle-engineer | Code, architecture | Logic audit → docs/sdlc/principle-engineer/; fix → retest → re-audit loop until 0 issues |
| Deploy | deploy | Security + PE sign-off (after 0 issues) | Docker Compose + K8s, docs/sdlc/deploy/ |
| Maintenance | maintenance | Live application | Monitoring, bug fixes, patches, docs/sdlc/maintenance/ |

Orchestrator: run each sub-agent in order; hand off output → input of the next sub-agent.

**Trigger:** On user idea/request, run the full pipeline (see docs/sdlc/ORCHESTRATION.md). One role per phase; single agent simulates by switching role each phase. Do not stop after one phase until Deploy unless the user asks.
