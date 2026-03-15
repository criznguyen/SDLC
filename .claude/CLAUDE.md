## SDLC Workflow

1. **PO** — PRD, user stories → docs/sdlc/po/
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/
3. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
4. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
5. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/
6. **Dev** — After QE docs: Tech Lead (15+ yrs, tech stack, review & merge) + Senior Dev (10+ yrs, implement, Unit Test ≥90%) → docs/sdlc/dev/{role}/
7. **QE (testing)** — After Dev unit tests: automation + manual, sign-off
8. **Deploy** — Release, monitor

Flow: ... → Technical BA → QE docs → Dev → QE testing → Deploy
Ask "Which phase are we in?" if unclear.
