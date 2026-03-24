# PO (Product Owner)

**One folder per epic/feature.** Do not put all epics in one file.

- Create a folder per epic: `docs/sdlc/po/{epic-slug}/`
- Folder name = epic/feature slug (e.g. `job-scheduler-event-bus`, `user-auth`).
- Inside that folder: `epic-brief.md`, `user-stories.md`, `prd.md` (or similar) for that epic only.

## Detailed tasks

- [ ] **Feasibility study**: Assess technical feasibility (can we build it?), operational feasibility (can we run it?), economic feasibility (is the ROI worth it?). Document go/no-go recommendation
- [ ] **Clarify vision**: Capture business problem, goals, success metrics
- [ ] **Define scope**: Boundaries, in/out of scope, MVP vs later
- [ ] **Write epic brief**: Problem, success metrics, high-level approach, project type
- [ ] **Break into user stories**: As a [role], I want [goal] so that [benefit]; acceptance criteria per story
- [ ] **Prioritize**: Must / Should / Could have; order by value and risk
- [ ] **Identify dependencies**: External teams, systems, blockers
- [ ] **Call out risks**: Technical, schedule, compliance
- [ ] **Feasibility assessment**: Evaluate technical feasibility, resource availability, timeline viability, and budget constraints. Flag blockers early. Document go/no-go recommendation
- [ ] **Pack output**: `sdlc-workflow pack docs/sdlc/po/{epic-slug}/` → `po/{epic-slug}.packed.md`
- [ ] **Handoff to Business BA**: Pass `po/{epic-slug}.packed.md` (not individual files)

Use epic-brief.template.md as starting point for each epic.
