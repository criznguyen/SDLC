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
    console.log("  Installs for: Cursor, Claude, Antigravity, Codex.");
    process.exit(1);
  }

  console.log("Scaffolding SDLC workflow...\n");

  try {
    const home = homedir();
    await scaffold(cwd);
    await installCursorSkill(home);
    await installClaudeSkill(cwd);
    await installAgentsMd(cwd);
    await installCodexSkill(home);
    console.log("\nDone.");
    console.log("  - Project: docs/sdlc/, .cursor/rules/, .claude/, AGENTS.md, .agents/skills/");
    console.log("  - Cursor: ~/.cursor/skills/sdlc-workflow/");
    console.log("  - Codex: ~/.codex/AGENTS.md, ~/.agents/skills/sdlc-workflow/");
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

async function installAgentsMd(cwd) {
  const agentsPath = join(cwd, "AGENTS.md");
  const content = AGENTS_MD_CONTENT;
  if (existsSync(agentsPath)) {
    const existing = await readFile(agentsPath, "utf8");
    if (existing.includes("## SDLC Workflow")) {
      console.log("  + AGENTS.md (SDLC section already present)");
      return;
    }
    await writeFile(agentsPath, existing.trimEnd() + "\n\n" + content, "utf8");
  } else {
    await writeFile(agentsPath, content, "utf8");
  }
  console.log("  + AGENTS.md (Antigravity, Codex project)");

  const codexSkillDir = join(cwd, ".agents", "skills", "sdlc-workflow");
  await mkdir(codexSkillDir, { recursive: true });
  await writeFile(join(codexSkillDir, "SKILL.md"), CURSOR_SKILL_MD, "utf8");
  await writeFile(join(codexSkillDir, "reference.md"), CURSOR_REFERENCE_MD, "utf8");
  console.log("  + .agents/skills/sdlc-workflow/ (Codex repo skill)");
}

async function installCodexSkill(home) {
  const codexDir = join(home, ".codex");
  const codexAgentsPath = join(codexDir, "AGENTS.md");
  const sdlcContent = CLAUDE_SDLC_CONTENT;
  await mkdir(codexDir, { recursive: true });
  if (existsSync(codexAgentsPath)) {
    const existing = await readFile(codexAgentsPath, "utf8");
    if (existing.includes("## SDLC Workflow")) {
      console.log("  + ~/.codex/AGENTS.md (SDLC section already present)");
    } else {
      await writeFile(
        codexAgentsPath,
        existing.trimEnd() + "\n\n" + sdlcContent,
        "utf8"
      );
      console.log("  + ~/.codex/AGENTS.md (Codex global)");
    }
  } else {
    await writeFile(codexAgentsPath, sdlcContent, "utf8");
    console.log("  + ~/.codex/AGENTS.md (Codex global)");
  }

  const agentsSkillDir = join(home, ".agents", "skills", "sdlc-workflow");
  await mkdir(agentsSkillDir, { recursive: true });
  await writeFile(join(agentsSkillDir, "SKILL.md"), CURSOR_SKILL_MD, "utf8");
  await writeFile(join(agentsSkillDir, "reference.md"), CURSOR_REFERENCE_MD, "utf8");
  console.log("  + ~/.agents/skills/sdlc-workflow/ (Codex global skill)");
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
    join(base, "qe", "qe-lead"),
    join(base, "qe", "senior-qe"),
    join(base, "dev", "tech-lead"),
    join(base, "dev", "senior-developer"),
    join(base, "agents"),
    join(base, "deploy"),
    join(base, "deploy", "k8s"),
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
    ["qe/qe-lead/README.md", QE_LEAD_README],
    ["qe/senior-qe/README.md", QE_SENIOR_README],
    ["dev/tech-lead/README.md", DEV_TECH_LEAD_README],
    ["dev/senior-developer/README.md", DEV_SENIOR_README],
    ["agents/README.md", AGENTS_README],
    ["deploy/README.md", DEPLOY_README],
    ["deploy/docker-compose.yml.template", DOCKER_COMPOSE_TEMPLATE],
    ["deploy/k8s/deployment.yaml.template", K8S_DEPLOYMENT_TEMPLATE],
    ["deploy/k8s/service.yaml.template", K8S_SERVICE_TEMPLATE],
    ["deploy/k8s/ingress.yaml.template", K8S_INGRESS_TEMPLATE],
  ];

  for (const [rel, content] of files) {
    const path = join(base, rel);
    await writeFile(path, content, "utf8");
    console.log("  + docs/sdlc/" + rel);
  }
}

const CURSOR_RULE_CONTENT = `---
description: SDLC multi-role workflow (PO → BA → Architect → Tech BA → QE docs → Dev → QE testing)
alwaysApply: false
globs: docs/sdlc/**/*, **/*.md
---

# SDLC Workflow

1. **PO** — PRD, user stories → docs/sdlc/po/
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/
3. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
4. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
5. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/
6. **Dev** — After docs phase → **run implementation immediately**. Tech Lead (review, merge) + Senior Dev (implement, ≥90% unit test) → docs/sdlc/dev/{role}/
7. **QE (testing)** — QE Lead (test framework, review) + Senior QE (10+ yrs, automation) → docs/sdlc/qe/{role}/
8. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/

**Each role runs as a sub-agent.** See docs/sdlc/agents/
Full workflow: docs/sdlc/SDLC-WORKFLOW.md
`;

const CURSOR_SKILL_MD = `---
name: sdlc-workflow
description: Multi-role SDLC workflow from user requirements through PO, Business BA, Architect, Technical BA, Dev teams, and QE. Use when user mentions SDLC, requirements, PO, BA, Architect, technical spec, phased development, or handoff between roles.
---

# SDLC Workflow (Multi-Role)

Sequential workflow; **each role runs as a sub-agent**. Each phase produces docs/artifacts for the next. After completion → deploy with **Docker Compose** and **K8s** (docs/sdlc/deploy/).

## Flow Overview

\`\`\`
User Request → PO → Business BA → Architect → Technical BA → QE (docs) → Dev → QE (testing) → Deploy (Docker Compose + K8s)
\`\`\`

**Determine current phase** before acting. If unsure, ask: "Which phase are we in?"
**Sub-agent specs**: docs/sdlc/agents/

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
**Output**: \`docs/sdlc/ba/technical/\` — **Handoff to QE + Dev.**

## Phase 5a: QE (Docs phase)

**Role**: Create test plan, test cases before Dev implements.
**Deliverables**: Test plan, test cases.
**Output**: \`docs/sdlc/qe/\` — After docs phase → **Dev team runs implementation immediately** (no extra gate).

## Phase 5b: Dev Teams

**Trigger**: After docs are done (Technical BA + QE docs). **Dev runs implementation immediately.**

**Roles**:
- **Tech Lead (15+ yrs)**: Decide tech stack, libraries; review & merge code. Docs: \`docs/sdlc/dev/tech-lead/\`
- **Senior Developer (10+ yrs)**: Implement features per spec. Docs: \`docs/sdlc/dev/senior-developer/\`

**Requirements**: Unit Test coverage **≥ 90%**.

**Output**: Code + unit tests. **Handoff to QE (testing).**

## Phase 6: QE (Testing phase — automation)

**Trigger**: After Dev completes unit tests.
**Role**: Write and run **automation tests**, sign-off.

**Roles**:
- **QE Lead**: Decide test framework; review test code. Docs: \`docs/sdlc/qe/qe-lead/\`
- **Senior QE (10+ yrs)**: Write automation tests. Docs: \`docs/sdlc/qe/senior-qe/\`

**Output**: Automation tests, test report. **Handoff to Deploy.**

## Phase 7: Deploy

**Trigger**: After QE sign-off.
**Role**: Deploy with **Docker Compose** (local/staging) and **Kubernetes** (production).
**Output**: \`docs/sdlc/deploy/\` — docker-compose.yml, k8s manifests. Deploy right after pipeline completes.

## Quick Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Architect | ADRs, system diagrams |
| 4 | Technical BA | API specs, tech breakdown |
| 5a | QE (docs) | Test plan, test cases |
| 5b | Dev | Code, unit tests (≥90%) |
| 6 | QE (testing) | QE Lead + Senior QE, automation, sign-off |
| 7 | Deploy | Docker Compose + K8s |

**Sub-agents**: Each role = one sub-agent (PO, Business BA, Architect, Technical BA, QE Lead, Senior QE, Tech Lead, Senior Dev). See docs/sdlc/agents/
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

## QE Team
- QE Lead: test framework decision, review test code → docs/sdlc/qe/qe-lead/
- Senior QE (10+ yrs): write automation tests → docs/sdlc/qe/senior-qe/

## Dev Team
- Tech Lead (15+ yrs): tech stack, libraries, review & merge → docs/sdlc/dev/tech-lead/
- Senior Dev (10+ yrs): implement, Unit Test ≥90% → docs/sdlc/dev/senior-developer/

## Sub-agents
Each role = sub-agent. See docs/sdlc/agents/

## Deploy
After completion → Docker Compose + K8s. See docs/sdlc/deploy/
`;

const AGENTS_MD_CONTENT = `## SDLC Workflow

When working on requirements, features, or handoffs, follow these phases:

1. **PO** — PRD, user stories → docs/sdlc/po/
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/
3. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
4. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
5. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/
6. **Dev** — After docs phase → **run implementation immediately**. Tech Lead + Senior Dev → docs/sdlc/dev/{role}/
7. **QE (testing)** — QE Lead + Senior QE (automation)
8. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/

After the docs phase, the Dev team runs implementation immediately. See docs/sdlc/agents/
`;

const CLAUDE_SDLC_CONTENT = `## SDLC Workflow

1. **PO** — PRD, user stories → docs/sdlc/po/
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/
3. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
4. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
5. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/
6. **Dev** — After docs phase → **run implementation immediately**. Tech Lead + Senior Dev → docs/sdlc/dev/{role}/
7. **QE (testing)** — QE Lead + Senior QE (automation)
8. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/

After the docs phase (Technical BA + QE docs), the Dev team runs implementation immediately. See docs/sdlc/agents/
`;

const SDLC_WORKFLOW_MD = `# SDLC Workflow (Multi-Role)

Use this doc with **Claude** (copy to Custom Instructions / Projects) or **@ mention** in chat.
For Cursor, see .cursor/rules/sdlc-workflow.mdc

## Flow

\`\`\`
User Request → PO → Business BA → Architect → Technical BA → QE (docs) → Dev → QE (testing) → Deploy
\`\`\`

## Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Architect | ADRs, system diagrams |
| 4 | Technical BA | API specs, tech breakdown |
| 5a | QE (docs) | Test plan, test cases |
| 5b | Dev | Code, unit tests (≥90%) |
| 6 | QE (testing) | QE Lead + Senior QE, automation, sign-off |
| 7 | Deploy | Docker Compose + K8s |

**Sub-agents**: Each role runs as a sub-agent (PO, Business BA, Architect, Technical BA, QE Lead, Senior QE, Tech Lead, Senior Dev). See docs/sdlc/agents/

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

### Phase 5a: QE (Docs)
- Test plan, test cases
- Output: \`docs/sdlc/qe/\`
- **After docs phase → Dev team runs implementation immediately** (no extra gate)

### Phase 5b: Dev Teams
- **Tech Lead (15+ yrs)**: Tech stack, libraries; review & merge. Output: \`docs/sdlc/dev/tech-lead/\`
- **Senior Developer (10+ yrs)**: Implement features. Output: \`docs/sdlc/dev/senior-developer/\`
- **Requirement**: Unit Test coverage **≥ 90%**
- **Then**: QE starts testing phase

### Phase 6: QE (Testing — automation)
- **QE Lead**: Test framework decision; review test code. Output: \`docs/sdlc/qe/qe-lead/\`
- **Senior QE (10+ yrs)**: Write automation tests. Output: \`docs/sdlc/qe/senior-qe/\`

### Phase 7: Deploy
- After pipeline completes → deploy with **Docker Compose** (local/staging) and **Kubernetes** (production)
- Output: \`docs/sdlc/deploy/\` — docker-compose.yml, k8s/

See [reference.md](./reference.md) for templates.
`;

const REFERENCE_MD = `# SDLC Workflow — Reference

Templates and examples. Use \`*.template.md\` as starting points.
Sub-agents: docs/sdlc/agents/
Deploy: docs/sdlc/deploy/ (Docker Compose + K8s)
`;

const AGENTS_README = `# Sub-Agents

Every role in the SDLC runs as a **sub-agent**. Each phase is assigned to a corresponding sub-agent.

| Role | Sub-agent | Input | Output |
|------|-----------|--------|--------|
| PO | po | User request | docs/sdlc/po/ |
| Business BA | business-ba | docs/sdlc/po/ | docs/sdlc/ba/business/ |
| Architect | architect | docs/sdlc/ba/business/ | docs/sdlc/architecture/ |
| Technical BA | technical-ba | docs/sdlc/architecture/ | docs/sdlc/ba/technical/ |
| QE (docs) | qe-docs | docs/sdlc/ba/technical/ | docs/sdlc/qe/ (test plan) |
| Tech Lead | tech-lead | Technical spec | Review, merge, docs/sdlc/dev/tech-lead/ |
| Senior Dev | senior-dev | Spec + test plan | After docs → run implementation immediately. Code, unit tests (≥90%) |
| QE Lead | qe-lead | Test plan | Test framework, review, docs/sdlc/qe/qe-lead/ |
| Senior QE | senior-qe | Test plan + framework | Automation tests, docs/sdlc/qe/senior-qe/ |
| Deploy | deploy | QE sign-off | Docker Compose + K8s, docs/sdlc/deploy/ |

Orchestrator: run each sub-agent in order; hand off output → input of the next sub-agent.
`;

const DEPLOY_README = `# Deploy

After the pipeline completes (QE sign-off), deploy immediately with:

- **Docker Compose** — local / staging: \`docker compose up -d\`
- **Kubernetes** — production: \`kubectl apply -f k8s/\`

## Files

- \`docker-compose.yml.template\` — copy to \`docker-compose.yml\`, adjust image/env
- \`k8s/deployment.yaml.template\` — Deployment
- \`k8s/service.yaml.template\` — Service
- \`k8s/ingress.yaml.template\` — Ingress (optional)
`;

const DOCKER_COMPOSE_TEMPLATE = `# Copy to docker-compose.yml and adjust image, env, ports
services:
  app:
    image: your-registry/your-app:latest
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
`;

const K8S_DEPLOYMENT_TEMPLATE = `# deployment.yaml - adjust name, image, replicas
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: your-registry/your-app:latest
          ports:
            - containerPort: 8080
`;

const K8S_SERVICE_TEMPLATE = `# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  selector:
    app: app
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
`;

const K8S_INGRESS_TEMPLATE = `# ingress.yaml - optional, adjust host
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app
                port:
                  number: 80
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

Two phases:
1. **Docs phase** — Test plan, test cases. Done → **Dev runs implementation immediately**.
2. **Testing phase** — After Dev completes unit tests: QE team writes automation tests.
   - **QE Lead**: Decide test framework; review test code → docs/sdlc/qe/qe-lead/
   - **Senior QE (10+ yrs)**: Write automation tests → docs/sdlc/qe/senior-qe/

Use test-case.template.md for test cases.
`;

const QE_LEAD_README = `# QE Lead

**Responsibilities**:
- Decide test framework (e.g. Playwright, Cypress, Jest, etc.)
- Review test code
- Ensure automation quality and coverage

**Docs**: Test framework ADR, review checklist.
`;

const QE_SENIOR_README = `# Senior QE (10+ years exp)

**Responsibilities**:
- Write automation tests per test plan
- Implement E2E, integration, regression tests
- Follow QE Lead's framework decisions

**Docs**: Automation test design, framework usage.
`;

const DEV_TECH_LEAD_README = `# Tech Lead (15+ years exp)

**Responsibilities**:
- Decide tech stack, frameworks, libraries
- Review and merge code
- Ensure architecture alignment

**Docs**: ADRs, tech decisions, review checklist.
`;

const DEV_SENIOR_README = `# Senior Developer (10+ years exp)

**Responsibilities**:
- Implement features per Technical BA spec
- Write code with Unit Test coverage **≥ 90%**
- Follow Tech Lead's tech decisions

**Docs**: Implementation notes, API usage.
`;

main();
