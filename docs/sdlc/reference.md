# SDLC Workflow — Reference

Templates and examples. Use `*.template.md` as starting points.
Templates are written for all project types: web, mobile, API-only, library/SDK, CLI, data/ML, platform/infra.
Sub-agents: docs/sdlc/agents/
Deploy: docs/sdlc/deploy/ (Docker Compose + K8s)

## Folder structure: one per epic/feature

- **PO**: `docs/sdlc/po/{epic-slug}/` — one folder per epic. Files: epic-brief.md, user-stories.md. Do not put all epics in one file.
- **Business BA**: `docs/sdlc/ba/business/{epic-slug}/` — same slug as PO. Files: functional-requirements.md, process-flows.md. Do not merge all epics into one file.
- **Design (if app/web)**: `docs/sdlc/design/{epic-slug}/` — design specs (Markdown) + optional HTML wireframes; PO+BA review until approved.
- **QE**: `docs/sdlc/qe/{epic-slug}/` — same slug as PO/BA. Files: test-plan.md, test-cases.md, automation. Do not put all epics in one file.
- **Security**: `docs/sdlc/security/` — security audit; fix → retest → re-audit loop until 0 issues
- **Principle Engineer**: `docs/sdlc/principle-engineer/` — logic audit; fix → retest → re-audit loop until 0 issues
- **Maintenance**: `docs/sdlc/maintenance/` — monitoring, bug fixes, patches, runbooks
