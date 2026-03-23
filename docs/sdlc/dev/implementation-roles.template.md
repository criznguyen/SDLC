# Implementation roles by project type

Use only the roles that apply. Remove or ignore the rest. Tech Lead is cross-cutting; add discipline roles as needed.

## Model optimization strategy

| Role | Model tier | Why |
|------|-----------|-----|
| Tech Lead | **Highest** (e.g. Opus) | Planning, logic analysis, architecture decisions, code review |
| All implementation roles | **Cost-efficient** (e.g. Haiku) | Execute code from Tech Lead's detailed specs |

Tech Lead defines all critical steps, logic, and specs first → implementation roles execute them. This maximizes quality on thinking while reducing cost on execution.

## By project type

| Project type        | Roles to use (all Senior 10+ except Tech Lead 15+) |
|---------------------|----------------------------------------------------|
| Web / full-stack    | Tech Lead, Senior Frontend, Senior Backend         |
| Mobile              | Tech Lead, Senior Mobile, Senior Backend           |
| API / backend only  | Tech Lead, Senior Backend                          |
| Library / SDK       | Tech Lead, Senior Dev (or Senior Backend)           |
| CLI / tooling       | Tech Lead, Senior Dev (or Senior Backend)           |
| Data / ML           | Tech Lead, Senior Backend, Senior Data/ML          |
| Embedded / IoT      | Tech Lead, Senior Embedded (+ Senior Backend if needed) |
| Platform / infra    | Tech Lead, Senior Platform (+ Senior Backend if needed) |
| Mixed               | Tech Lead + any of: Senior Frontend, Backend, Mobile, Embedded, Data/ML, Platform |

## Role folders (all implementation roles are Senior 10+ yrs)

- `tech-lead/` — Tech Lead (15+ yrs): tech stack, review & merge (all projects)
- `senior-developer/` — Senior Developer: generic implementation
- `frontend/` — Senior Frontend: Web UI
- `backend/` — Senior Backend: API, services, DB
- `mobile/` — Senior Mobile: iOS, Android, cross-platform
- `embedded/` — Senior Embedded: firmware, IoT
- `data-ml/` — Senior Data/ML: ETL, models, analytics
- `platform/` — Senior Platform: CI/CD, infra, observability
