## SDLC Workflow

**Trigger:** When the user sends an **idea**, **feature request**, or **requirement**, run the full pipeline (Phase 1 → 7) in sequence. One role (sub-agent) per phase; produce outputs then continue to the next. Do not stop after one phase until deployment unless the user asks to stop.

**Memory requirement:** Before executing any new action, recall relevant memories (project context, user preferences, past decisions) to ensure continuity and avoid repeating mistakes.

When working on requirements, features, or handoffs, follow these phases:

1. **PO** — PRD, user stories → docs/sdlc/po/{epic-slug}/ (one folder per epic)
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/{epic-slug}/ (one folder per epic)
3. **Design (if app/web)** — Design specs + wireframes → docs/sdlc/design/{epic-slug}/; **PO + BA review** until approved
4. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
5. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
6. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/{epic-slug}/ (one folder per epic)
7. **Dev** — After docs phase → **run implementation immediately**. Tech Lead + Senior Dev → docs/sdlc/dev/{role}/
8. **QE (testing + UAT)** — QE Lead (15+ yrs automation) + Senior QE (10+ yrs) + UAT → docs/sdlc/qe/{epic-slug}/ (same folder per epic)
9. **Security + Principle Engineer** — Security + logic audit; **fix loop** (Dev fixes → re-audit) until all issues resolved; sign-off before Deploy
10. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/
11. **Maintenance** — Monitoring, bug fixes, patches, dependency updates → docs/sdlc/maintenance/

Design before Architect (UX drives tech). After the docs phase, the Dev team runs implementation immediately. See docs/sdlc/agents/
