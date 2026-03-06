#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { mkdir, writeFile, readFile, cp } from "node:fs/promises";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const TEMPLATES_DIR = join(PKG_ROOT, "templates");

async function main() {
  const cwd = process.cwd();
  const args = process.argv.slice(2);
  const command = args[0] || "init";

  if (command !== "init") {
    console.log("Usage: npx sdlc-workflow init");
    console.log("  Scaffolds SDLC docs and templates into current project.");
    console.log("  Installs Cursor skill (global) and Claude instructions (project).");
    process.exit(1);
  }

  console.log("Scaffolding SDLC workflow...\n");

  try {
    const home = homedir();
    await scaffold(cwd);
    await installCursorSkill(home);
    await installClaudeSkill(cwd);
    console.log("\nDone.");
    console.log("  - Project: docs/sdlc/, .cursor/rules/, .claude/");
    console.log("  - Cursor skill: ~/.cursor/skills/sdlc-workflow/ (global)");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

async function installCursorSkill(home) {
  const skillDir = join(home, ".cursor", "skills", "sdlc-workflow");
  await mkdir(skillDir, { recursive: true });
  await writeFile(join(skillDir, "SKILL.md"), CURSOR_SKILL_MD, "utf8");
  await writeFile(join(skillDir, "reference.md"), CURSOR_REFERENCE_MD, "utf8");
  console.log("  + ~/.cursor/skills/sdlc-workflow/ (skill installed)");
}

async function installClaudeSkill(cwd) {
  const claudeDir = join(cwd, ".claude");
  await mkdir(claudeDir, { recursive: true });
  const claudeMdPath = join(claudeDir, "CLAUDE.md");
  const sdlcContent = CLAUDE_SDLC_CONTENT;

  if (existsSync(claudeMdPath)) {
    const existing = await readFile(claudeMdPath, "utf8");
    if (existing.includes("## SDLC Workflow")) {
      console.log("  + .claude/CLAUDE.md (SDLC section already present)");
      return;
    }
    await writeFile(
      claudeMdPath,
      existing.trimEnd() + "\n\n" + sdlcContent,
      "utf8"
    );
  } else {
    await writeFile(claudeMdPath, sdlcContent, "utf8");
  }
  console.log("  + .claude/CLAUDE.md (Claude instructions)");
}

async function scaffold(cwd) {
  const templates = join(TEMPLATES_DIR, "project");
  if (!existsSync(templates)) {
    await generateFromInline(cwd);
  } else {
    await cp(templates, join(cwd, "docs", "sdlc"), { recursive: true });
  }

  const cursorRulesDir = join(cwd, ".cursor", "rules");
  await mkdir(cursorRulesDir, { recursive: true });
  await writeFile(
    join(cursorRulesDir, "sdlc-workflow.mdc"),
    CURSOR_RULE_CONTENT
  );
  console.log("  + .cursor/rules/sdlc-workflow.mdc");
}

async function generateFromInline(cwd) {
  const base = join(cwd, "docs", "sdlc");
  const dirs = [
    base,
    join(base, "po"),
    join(base, "ba", "business"),
    join(base, "ba", "technical"),
    join(base, "architecture"),
    join(base, "qe"),
  ];

  for (const d of dirs) {
    await mkdir(d, { recursive: true });
  }

  const files = [
    ["SDLC-WORKFLOW.md", SDLC_WORKFLOW_MD],
    ["reference.md", REFERENCE_MD],
    ["po/epic-brief.template.md", PO_EPIC_TEMPLATE],
    ["po/README.md", PO_README],
    ["ba/business/functional-requirement.template.md", BA_FR_TEMPLATE],
    ["ba/business/README.md", BA_BUSINESS_README],
    ["ba/technical/api-spec.template.md", TECH_API_TEMPLATE],
    ["ba/technical/team-breakdown.template.md", TECH_TEAM_TEMPLATE],
    ["ba/technical/README.md", BA_TECH_README],
    ["architecture/adr.template.md", ARCH_ADR_TEMPLATE],
    ["architecture/README.md", ARCH_README],
    ["qe/test-case.template.md", QE_TC_TEMPLATE],
    ["qe/README.md", QE_README],
  ];

  for (const [rel, content] of files) {
    const path = join(base, rel);
    await writeFile(path, content, "utf8");
    console.log("  + docs/sdlc/" + rel);
  }
}

const CURSOR_RULE_CONTENT = `---
description: SDLC multi-role workflow (PO → BA → Architect → Tech BA → Dev → QE)
alwaysApply: false
globs: docs/sdlc/**/*, **/*.md
---

# SDLC Workflow

When working on requirements or docs, follow the SDLC phases:

1. **PO** — PRD, user stories → docs/sdlc/po/
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/
3. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
4. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
5. **Dev Teams** — Implementation
6. **QE** — Test plan, test cases → docs/sdlc/qe/

Full workflow: docs/sdlc/SDLC-WORKFLOW.md
`;

const CURSOR_SKILL_MD = `---
name: sdlc-workflow
description: Multi-role SDLC workflow from user requirements through PO, Business BA, Architect, Technical BA, Dev teams, and QE. Use when user mentions SDLC, requirements, PO, BA, Architect, technical spec, phased development, yêu cầu, phân rã, kiến trúc, or handoff between roles.
---

# SDLC Workflow (Multi-Role)

Sequential workflow for approaching user requirements. Each phase produces docs/artifacts for the next. Apply when clarifying scope, breaking down features, or handing off between roles.

## Flow Overview

\`\`\`
User Request → PO → Business BA → Architect → Technical BA → Dev Teams → QE → Deploy
\`\`\`

**Determine current phase** before acting. If unsure, ask: "Which phase are we in?"

---

## Phase 0: User Request / Discovery

**Trigger**: New feature request, bug report, or requirement from stakeholder.
**Output**: Initial request logged, ready for PO.

## Phase 1: PO (Product Owner)

**Role**: Prioritize, clarify business value, create product docs.
**Deliverables**: Epic/Feature brief, user stories, acceptance criteria, priority, dependencies.
**Output**: \`docs/sdlc/po/\` — **Handoff to Business BA.**

## Phase 2: Business BA (Business Analyst)

**Role**: Break down from business perspective.
**Deliverables**: Business process flows, functional requirements, use cases, glossary.
**Output**: \`docs/sdlc/ba/business/\` — **Handoff to Architect.**

## Phase 3: Architect

**Role**: Design system architecture and technology choices.
**Deliverables**: System context, container diagram, ADRs, tech stack, cross-cutting concerns.
**Output**: \`docs/sdlc/architecture/\` — **Handoff to Technical BA.**

## Phase 4: Technical BA

**Role**: Translate business + architecture into implementable specs.
**Deliverables**: API specs, DB schema, team breakdown, acceptance criteria per ticket.
**Output**: \`docs/sdlc/ba/technical/\` — **Handoff to Dev Teams.**

## Phase 5: Dev Teams

**Role**: Implement. Backend | Frontend | Mobile | Data / DevOps.
**Output**: Code + tests. **Handoff to QE.**

## Phase 6: QE (Quality Engineering)

**Role**: Test against acceptance criteria; ensure quality.
**Deliverables**: Test plan, test cases, sign-off.
**Output**: Test report. **Handoff to Deploy.**

## Phase 7: Deploy & Maintenance

**Role**: Release, monitor, iterate.

## Quick Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Architect | ADRs, system diagrams |
| 4 | Technical BA | API specs, tech breakdown |
| 5 | Dev Teams | Code, tests |
| 6 | QE | Test plan, sign-off |
| 7 | Ops | Deploy, monitor |

See reference.md for templates.
`;

const CURSOR_REFERENCE_MD = `# SDLC Workflow — Reference

## PO: Epic Brief Template
# Epic: [Name]
## Problem / Success Metrics / User Stories / Acceptance Criteria / Priority

## Business BA: Functional Requirement
FR-001: [Title] — Description, Trigger, Process Flow, Output, Constraints

## Architect: ADR Template
# ADR-001: [Title] — Status, Context, Decision, Consequences

## Technical BA: API Spec
POST /api/v1/[resource] — Purpose, Request, Response, Contract

## QE: Test Case
TC-001: [Scenario] — Precondition, Steps, Expected, Links to AC
`;

const CLAUDE_SDLC_CONTENT = `## SDLC Workflow

When working on requirements, features, or handoffs, follow these phases:

1. **PO** — PRD, user stories → docs/sdlc/po/
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/
3. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
4. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
5. **Dev Teams** — Implementation (Backend, Frontend, Mobile)
6. **QE** — Test plan, test cases → docs/sdlc/qe/
7. **Deploy** — Release, monitor

Flow: User Request → PO → Business BA → Architect → Technical BA → Dev Teams → QE → Deploy
Ask "Which phase are we in?" if unclear.
`;

const SDLC_WORKFLOW_MD = `# SDLC Workflow (Multi-Role)

Use this doc with **Claude** (copy to Custom Instructions / Projects) or **@ mention** in chat.
For Cursor, see .cursor/rules/sdlc-workflow.mdc

## Flow

\`\`\`
User Request → PO → Business BA → Architect → Technical BA → Dev Teams → QE → Deploy
\`\`\`

## Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Architect | ADRs, system diagrams |
| 4 | Technical BA | API specs, tech breakdown |
| 5 | Dev Teams | Code, tests |
| 6 | QE | Test plan, sign-off |
| 7 | Ops | Deploy, monitor |

## Phase Details

### Phase 1: PO
- Epic brief, user stories, acceptance criteria
- Output: \`docs/sdlc/po/\`

### Phase 2: Business BA
- Functional requirements, process flows, use cases
- Output: \`docs/sdlc/ba/business/\`

### Phase 3: Architect
- System context, container diagram, ADRs, tech stack
- Output: \`docs/sdlc/architecture/\`

### Phase 4: Technical BA
- API specs, DB schema, team breakdown
- Output: \`docs/sdlc/ba/technical/\`

### Phase 5: Dev Teams
- Backend, Frontend, Mobile — implement per spec

### Phase 6: QE
- Test plan, test cases, sign-off
- Output: \`docs/sdlc/qe/\`

See [reference.md](./reference.md) for templates.
`;

const REFERENCE_MD = `# SDLC Workflow — Reference

Templates and examples. Use \`*.template.md\` as starting points.
`;

const PO_EPIC_TEMPLATE = `# Epic: [Name]

## Problem
[What problem are we solving?]

## Success Metrics
- [Metric 1]
- [Metric 2]

## User Stories
1. As [persona], I want [action] so that [benefit].
2. ...

## Acceptance Criteria (High-level)
- [ ] Criterion 1
- [ ] Criterion 2

## Priority
Must have / Should have / Could have

## Dependencies & Risks
- ...
`;

const PO_README = `# PO (Product Owner)

Create PRD, epic briefs, user stories here.
Use epic-brief.template.md as starting point.
`;

const BA_FR_TEMPLATE = `## FR-001: [Title]

**Description**: [What the system must do]

**Trigger**: [When does this apply?]

**Process Flow**:
1. Step 1
2. Step 2
3. Step 3

**Output**: [Result]

**Constraints**: [Compliance, SLA, etc.]
`;

const BA_BUSINESS_README = `# Business BA

Functional requirements, process flows, use cases.
Use functional-requirement.template.md for FRS items.
`;

const TECH_API_TEMPLATE = `## POST /api/v1/[resource]

**Purpose**: [One-line]

**Request**:
- Body: JSON schema
- Headers: Auth, Content-Type

**Response**:
- 200: Success payload
- 4xx/5xx: Error format

**Contract**: See OpenAPI spec
`;

const TECH_TEAM_TEMPLATE = `| Team    | Scope                    | Dependencies          |
|---------|--------------------------|------------------------|
| Backend | API, DB, business logic  | Technical spec        |
| Frontend| UI, API integration      | API contract          |
| Mobile  | App UI, API integration  | API contract          |
`;

const BA_TECH_README = `# Technical BA

API specs, DB schema, team breakdown.
Use templates as starting points.
`;

const ARCH_ADR_TEMPLATE = `# ADR-001: [Decision Title]

## Status
Accepted

## Context
[Why we need this decision]

## Decision
[What we decided]

## Consequences
- Positive: ...
- Negative: ...
`;

const ARCH_README = `# Architecture

ADRs, system diagrams, tech stack decisions.
Use adr.template.md for new ADRs.
`;

const QE_TC_TEMPLATE = `## TC-001: [Scenario]

**Precondition**: [State before test]

**Steps**:
1. Action 1
2. Action 2
3. Action 3

**Expected**: [Expected result]

**Links to**: AC-001, Story #42
`;

const QE_README = `# QE (Quality Engineering)

Test plan, test cases, sign-off checklist.
Use test-case.template.md for test cases.
`;

main();
