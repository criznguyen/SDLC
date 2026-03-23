## SDLC Workflow

**Trigger on idea:** When the user sends an idea, feature request, or requirement, run the pipeline continuously: Phase 1 (PO) → 2 → … → Deploy → Maintenance. One role per phase (single agent = switch role each phase). Do not stop after one phase unless the user asks.

**Memory requirement:** Before executing any new action, recall relevant memories (project context, user preferences, past decisions) to ensure continuity and avoid repeating mistakes.

1. **PO** — PRD, user stories, feasibility assessment → docs/sdlc/po/{epic-slug}/ (one folder per epic)
2. **Business BA** — FRS, NFR, process flows → docs/sdlc/ba/business/{epic-slug}/ (one folder per epic)
3. **Design (if app/web)** — Design specs + wireframes (**Anti AI**: no AI-looking designs) → docs/sdlc/design/{epic-slug}/; **PO + BA review** until approved
4. **Architect** — ADRs, diagrams, security by design, engineering principles (SOLID, DRY, KISS, CQRS, Zero Trust, EDA, HA) → docs/sdlc/architecture/
5. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
6. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/{epic-slug}/ (one folder per epic)
7. **Dev** — After docs phase → **run implementation immediately**. Tech Lead (highest model: planning, logic, review) + Senior Dev (cost-efficient model: code execution) → docs/sdlc/dev/{role}/. Clean Code, SOLID, DRY, KISS, TDD/BDD. Security shift-left: OWASP checks, dependency audit in CI
8. **QE (testing + UAT)** — QE Lead (highest model: strategy, review) + Senior QE (cost-efficient model: test execution) + UAT; **bug-fix loop** (bugs → Dev fix → QE retest) until 0 bugs → docs/sdlc/qe/{epic-slug}/
9. **Security + Principle Engineer** — Security + logic audit; **fix → retest → re-audit loop** (Dev fixes → QE retests → re-audit) until 0 issues; sign-off before Deploy
10. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/
11. **Maintenance** — Monitoring, bug fixes, patches, dependency updates → docs/sdlc/maintenance/

Design before Architect (UX drives tech). After the docs phase, Dev runs implementation immediately. See docs/sdlc/agents/
