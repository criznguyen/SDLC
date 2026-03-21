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

  if (command === "version" || command === "--version" || command === "-v") {
    const pkg = JSON.parse(await readFile(join(PKG_ROOT, "package.json"), "utf8"));
    console.log(pkg.version);
    process.exit(0);
  }

  if (command !== "init") {
    console.log("Usage: npx sdlc-workflow <command>");
    console.log("");
    console.log("Commands:");
    console.log("  init     Scaffold SDLC docs and templates (Cursor, Claude, Antigravity, Codex)");
    console.log("  version  Print current version");
    console.log("");
    console.log("Examples:");
    console.log("  npx sdlc-workflow init");
    console.log("  npx sdlc-workflow version");
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
    join(base, "design"),
    join(base, "dev", "tech-lead"),
    join(base, "dev", "senior-developer"),
    join(base, "dev", "frontend"),
    join(base, "dev", "backend"),
    join(base, "dev", "mobile"),
    join(base, "dev", "embedded"),
    join(base, "dev", "data-ml"),
    join(base, "dev", "platform"),
    join(base, "security"),
    join(base, "principle-engineer"),
    join(base, "agents"),
    join(base, "deploy"),
    join(base, "deploy", "k8s"),
    join(base, "maintenance"),
  ];

  for (const d of dirs) {
    await mkdir(d, { recursive: true });
  }

  const files = [
    ["SDLC-WORKFLOW.md", SDLC_WORKFLOW_MD],
    ["ORCHESTRATION.md", ORCHESTRATION_MD],
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
    ["design/README.md", DESIGN_README],
    ["design/design-spec.template.md", DESIGN_SPEC_TEMPLATE],
    ["dev/tech-lead/README.md", DEV_TECH_LEAD_README],
    ["dev/senior-developer/README.md", DEV_SENIOR_README],
    ["dev/implementation-roles.template.md", DEV_IMPLEMENTATION_ROLES_TEMPLATE],
    ["dev/frontend/README.md", DEV_FRONTEND_README],
    ["dev/backend/README.md", DEV_BACKEND_README],
    ["dev/mobile/README.md", DEV_MOBILE_README],
    ["dev/embedded/README.md", DEV_EMBEDDED_README],
    ["dev/data-ml/README.md", DEV_DATA_ML_README],
    ["dev/platform/README.md", DEV_PLATFORM_README],
    ["security/README.md", SECURITY_README],
    ["principle-engineer/README.md", PRINCIPLE_ENGINEER_README],
    ["agents/README.md", AGENTS_README],
    ["deploy/README.md", DEPLOY_README],
    ["deploy/docker-compose.yml.template", DOCKER_COMPOSE_TEMPLATE],
    ["deploy/k8s/deployment.yaml.template", K8S_DEPLOYMENT_TEMPLATE],
    ["deploy/k8s/service.yaml.template", K8S_SERVICE_TEMPLATE],
    ["deploy/k8s/ingress.yaml.template", K8S_INGRESS_TEMPLATE],
    ["maintenance/README.md", MAINTENANCE_README],
  ];

  for (const [rel, content] of files) {
    const path = join(base, rel);
    await writeFile(path, content, "utf8");
    console.log("  + docs/sdlc/" + rel);
  }
}

const CURSOR_RULE_CONTENT = `---
description: SDLC multi-role workflow; on idea/request trigger pipeline through deployment (sub-agent per phase)
alwaysApply: false
globs: docs/sdlc/**/*, **/*.md
---

# SDLC Workflow

**On idea/feature request:** Trigger full pipeline (PO → … → Deploy). One role per phase; run phases in sequence. (Single agent = simulate by switching role each phase.) See docs/sdlc/SDLC-WORKFLOW.md and docs/sdlc/agents/.

1. **PO** — PRD, user stories → docs/sdlc/po/{epic-slug}/ (one folder per epic)
2. **Business BA** — FRS, process flows → docs/sdlc/ba/business/{epic-slug}/ (one folder per epic)
3. **Design (if app/web)** — Design specs + wireframes → docs/sdlc/design/{epic-slug}/; **PO + BA review** → loop until approved
4. **Architect** — ADRs, diagrams → docs/sdlc/architecture/
5. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
6. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/{epic-slug}/ (one folder per epic)
7. **Dev** — After docs phase → **run implementation immediately**. Tech Lead + implementation roles → docs/sdlc/dev/{role}/
8. **QE (testing + UAT)** — QE Lead (15+ yrs automation) + Senior QE (10+ yrs) + UAT → docs/sdlc/qe/{epic-slug}/
9. **Security** — Audit security risk → docs/sdlc/security/
10. **Principle Engineer** — Audit logic, architecture → docs/sdlc/principle-engineer/
11. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/ (after Security + PE sign-off; fix loop until no issues)
12. **Maintenance** — Monitoring, bug fixes, patches, dependency updates → docs/sdlc/maintenance/

**Each role runs as a sub-agent.** Design before Architect (UX drives tech). See docs/sdlc/agents/
Full workflow: docs/sdlc/SDLC-WORKFLOW.md
`;

const CURSOR_SKILL_MD = `---
name: sdlc-workflow
description: Multi-role SDLC workflow from user requirements through PO, Business BA, Architect, Technical BA, Dev teams, and QE. Use when user sends an idea, feature request, or requirement — trigger full pipeline through deployment. Use when user mentions SDLC, requirements, PO, BA, Architect, technical spec, phased development, or handoff between roles.
---

# SDLC Workflow (Multi-Role)

Sequential workflow; **each role runs as a sub-agent**. Each phase produces docs/artifacts for the next. After completion → deploy with **Docker Compose** and **K8s** (docs/sdlc/deploy/).

## Trigger and orchestration (mandatory)

**When the user sends an idea, feature request, or new requirement:**
1. **Trigger the pipeline** and run it **continuously through deployment** (Phase 1 → 2 → … → 7).
2. **One role per phase.** For each phase, act **only** as that role (e.g. only PO in phase 1, only Business BA in phase 2). Produce that phase's outputs into the correct folder, then **continue to the next phase** without waiting for the user.
3. **Run in order:** PO → Business BA → **Design (if app/web, PO+BA review loop)** → Architect → Technical BA → QE (docs) → Dev → QE (testing + UAT) → **Security + Principle Engineer audit → fix loop until all issues resolved** → Deploy → Maintenance. Do not stop after one phase unless the user explicitly asks to stop.

**Note:** In Cursor and similar tools there is a single agent per conversation. "Sub-agent" means **one role per phase** — the same agent must adopt exactly one role per phase and run phases in sequence (do not mix roles in one step). If the platform later supports spawning separate agents per phase, use that; otherwise this single agent simulates the pipeline by switching role each phase.

**Sub-agent specs**: docs/sdlc/agents/

## Flow Overview

\`\`\`
User Request → PO → Business BA → Design (if app/web) → Architect → Technical BA → QE (docs) → Dev → QE (testing + UAT) → Security + PE audit → [fix loop until no issues] → Deploy → Maintenance
\`\`\`

**Determine current phase** before acting. If user sent an idea, assume Phase 0 and start from Phase 1.

---

## Phase 0: User Request / Discovery

**Trigger**: New feature request, bug report, or requirement from stakeholder.
**Output**: Initial request logged, ready for PO.

## Phase 1: PO (Product Owner)

**Role**: Prioritize, clarify business value, create product docs.
**Deliverables**: Epic/Feature brief, user stories, acceptance criteria, priority, dependencies.
**Output**: \`docs/sdlc/po/{epic-slug}/\` — **one folder per epic** (e.g. \`po/job-scheduler-event-bus/epic-brief.md\`). Do not put all epics in one file. **Handoff to Business BA.**

## Phase 2: Business BA (Business Analyst)

**Role**: Break down from business perspective.
**Deliverables**: Business process flows, functional requirements, use cases, glossary.
**Output**: \`docs/sdlc/ba/business/{epic-slug}/\` — **one folder per epic** (same slug as PO). Do not merge all epics into one file. **Handoff to Design (if app/web) or Architect.**

## Phase 3: Design (optional — app/web only)

**When:** Project has UI (web, mobile app). Skip for API-only, library, CLI, data/ML, platform without UI.

**Role**: Create UI/UX design specs (Markdown) and optional HTML wireframes from idea + PO + Business BA docs. Design **before** Architect so UX drives technical decisions.
**Output**: \`docs/sdlc/design/{epic-slug}/\` — design-spec.md + optional wireframes/.

**Review loop:**
1. **PO review**: Design aligns with epic brief, user stories, acceptance criteria?
2. **Business BA review**: Design matches functional requirements, process flows?
3. **If not approved**: Capture feedback → redesign → repeat until PO and BA approve.
4. **If approved** → **Handoff to Architect.**

## Phase 4: Architect

**Role**: Design system architecture and technology choices.
**Deliverables**: System context, container diagram, ADRs, tech stack, cross-cutting concerns.
**Input**: Business BA + Design (if app/web) — design informs architecture.
**Output**: \`docs/sdlc/architecture/\` — **Handoff to Technical BA.**

## Phase 5: Technical BA

**Role**: Translate business + architecture + design into implementable specs.
**Deliverables**: API specs, DB schema, team breakdown, acceptance criteria per ticket.
**Input**: Architect + Design (if app/web) — design informs API/screen contracts.
**Output**: \`docs/sdlc/ba/technical/\` — **Handoff to QE + Dev.**

## Phase 5a: QE (Docs phase)

**Role**: Create test plan, test cases before Dev implements.
**Deliverables**: Test plan, test cases.
**Output**: \`docs/sdlc/qe/{epic-slug}/\` — **one folder per epic** (same slug as PO/BA). Test plan, test cases inside. Do not put all epics in one file. After docs phase → **Dev team runs implementation immediately** (no extra gate).

## Phase 5b: Dev Teams

**Trigger**: After docs are done (Technical BA + QE docs). **Dev runs implementation immediately.**

**Roles** (vary by project — use only what applies; see \`docs/sdlc/dev/implementation-roles.template.md\`). All implementation roles are **Senior (10+ yrs)**:
- **Tech Lead (15+ yrs)**: Tech stack, review & merge. Docs: \`docs/sdlc/dev/tech-lead/\`
- **Senior Developer (10+ yrs)**: Implement per spec (generic). Docs: \`docs/sdlc/dev/senior-developer/\`
- **Senior Frontend (10+ yrs)**: Web UI. Docs: \`docs/sdlc/dev/frontend/\`
- **Senior Backend (10+ yrs)**: API, services. Docs: \`docs/sdlc/dev/backend/\`
- **Senior Mobile (10+ yrs)**: iOS/Android/cross-platform. Docs: \`docs/sdlc/dev/mobile/\`
- **Senior Embedded (10+ yrs)**: Firmware, IoT. Docs: \`docs/sdlc/dev/embedded/\`
- **Senior Data/ML (10+ yrs)**: ETL, models. Docs: \`docs/sdlc/dev/data-ml/\`
- **Senior Platform (10+ yrs)**: Infra, CI/CD. Docs: \`docs/sdlc/dev/platform/\`

**Requirements**: Unit Test coverage **≥ 90%**.

**Output**: Code + unit tests. **Handoff to QE (testing + UAT).**

## Phase 6: QE (Testing phase — automation)

**Trigger**: After Dev completes unit tests.
**Role**: Write and run **automation tests**, sign-off.

**Roles**:
- **QE Lead (15+ yrs automation)**: Test strategy, framework choice, automation architecture, review test code. Output per epic: \`docs/sdlc/qe/{epic-slug}/\`
- **Senior QE (10+ yrs)**: Write automation tests per QE Lead's strategy. Output per epic: \`docs/sdlc/qe/{epic-slug}/\` (e.g. automation/ or test files there)

**Output**: Automation tests, test report. **Handoff to Security + Principle Engineer.**

## Phase 8: Security + Principle Engineer (audit → fix loop)

**Trigger**: After QE testing sign-off.
**Roles** (can run in parallel):
- **Security team**: Audit security risk (OWASP, auth, secrets, infra). Output: \`docs/sdlc/security/\`
- **Principle Engineer**: Audit logic, architecture alignment, correctness. Output: \`docs/sdlc/principle-engineer/\`

**Fix loop**: If issues found → **Dev fixes** → re-audit by Security + Principle Engineer. **Repeat until all issues resolved.** Only when sign-off → **Handoff to Deploy.**

## Phase 9: Deploy

**Trigger**: After Security + Principle Engineer sign-off.
**Role**: Deploy with **Docker Compose** (local/staging) and **Kubernetes** (production).
**Output**: \`docs/sdlc/deploy/\` — docker-compose.yml, k8s manifests.

## Quick Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Design (if app/web) | Design specs + wireframes; PO+BA review until approved |
| 4 | Architect | ADRs, system diagrams |
| 5 | Technical BA | API specs, tech breakdown |
| 6 | QE (docs) | Test plan, test cases |
| 7 | Dev | Code, unit tests (≥90%) |
| 8 | QE (testing + UAT) | QE Lead (15+ yrs automation) + Senior QE (10+ yrs), automation, UAT, sign-off |
| 9 | Security + Principle Engineer | Security + logic audit; fix loop until all issues resolved; sign-off → Deploy |
| 10 | Deploy | Docker Compose + K8s |
| 11 | Maintenance | Monitoring, bug fixes, patches, dependency updates |

**Sub-agents**: Each role = one sub-agent. Design before Architect (UX drives tech). See docs/sdlc/agents/
See reference.md for templates.
`;

const CURSOR_REFERENCE_MD = `# SDLC Workflow — Reference

## Folder structure: one per epic/feature (PO and Business BA)

- **PO**: \`docs/sdlc/po/{epic-slug}/\` — one folder per epic. Files: epic-brief.md, user-stories.md. Do not put all epics in one file.
- **Business BA**: \`docs/sdlc/ba/business/{epic-slug}/\` — same slug as PO. Files: functional-requirements.md, process-flows.md. Do not merge all epics into one file.
- **Design (if app/web)**: \`docs/sdlc/design/{epic-slug}/\` — same slug as PO/BA. Design specs (Markdown) + optional HTML wireframes; PO+BA review until approved.
- **QE**: \`docs/sdlc/qe/{epic-slug}/\` — same slug as PO/BA. Files: test-plan.md, test-cases.md, automation artifacts. Do not put all epics in one file.

## PO: Epic Brief Template
# Epic: [Name]
## Problem / Success Metrics / User Stories / Acceptance Criteria / Priority

## Business BA: Functional Requirement
FR-001: [Title] — Description, Trigger, Process Flow, Output, Constraints

## Architect: ADR Template
# ADR-001: [Title] — Status, Context, Decision, Consequences

## Technical BA: API Spec
POST /api/v1/[resource] — Purpose, Request, Response, Contract

## Design (if app/web)
Design specs (Markdown) + optional HTML wireframes from idea + PO + BA (before Architect; UX drives tech). Output: docs/sdlc/design/{epic-slug}/. PO + BA review until approved; loop if not aligned. Handoff to Architect.

## QE: Test Case
TC-001: [Scenario] — Precondition, Steps, Expected, Links to AC

## QE Team (one folder per epic: qe/{epic-slug}/)
- QE Lead (15+ yrs automation): test strategy, framework, automation architecture, review → docs/sdlc/qe/{epic-slug}/
- Senior QE (10+ yrs): write automation tests → docs/sdlc/qe/{epic-slug}/

## Dev Team
- Tech Lead (15+ yrs): tech stack, review & merge → docs/sdlc/dev/tech-lead/
- Senior Dev (10+ yrs): implement, Unit Test ≥90% → docs/sdlc/dev/senior-developer/
- By project (all Senior 10+ yrs): Senior Frontend, Backend, Mobile, Embedded, Data/ML, Platform → docs/sdlc/dev/{role}/

## Security + Principle Engineer (after implementation)
- Security team: audit security risk → docs/sdlc/security/
- Principle Engineer: audit logic, architecture → docs/sdlc/principle-engineer/
- **Fix loop**: If issues → Dev fixes → re-audit; repeat until all resolved. Sign-off → Deploy

## Deploy
After Security + Principle Engineer sign-off → Docker Compose + K8s. See docs/sdlc/deploy/

## Maintenance
After Deploy → ongoing: monitoring, bug fixes, patches, dependency updates, performance tuning. Significant new features → loop back to PO for new epic. See docs/sdlc/maintenance/
`;

const AGENTS_MD_CONTENT = `## SDLC Workflow

**Trigger:** When the user sends an **idea**, **feature request**, or **requirement**, run the full pipeline (Phase 1 → 7) in sequence. One role (sub-agent) per phase; produce outputs then continue to the next. Do not stop after one phase until deployment unless the user asks to stop.

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
`;

const CLAUDE_SDLC_CONTENT = `## SDLC Workflow

**Trigger on idea:** When the user sends an idea, feature request, or requirement, run the pipeline continuously: Phase 1 (PO) → 2 → … → Deploy → Maintenance. One role per phase (single agent = switch role each phase). Do not stop after one phase unless the user asks.

1. **PO** — PRD, user stories, feasibility assessment → docs/sdlc/po/{epic-slug}/ (one folder per epic)
2. **Business BA** — FRS, NFR, process flows → docs/sdlc/ba/business/{epic-slug}/ (one folder per epic)
3. **Design (if app/web)** — Design specs + wireframes → docs/sdlc/design/{epic-slug}/; **PO + BA review** until approved
4. **Architect** — ADRs, diagrams, security by design → docs/sdlc/architecture/
5. **Technical BA** — API specs, team breakdown → docs/sdlc/ba/technical/
6. **QE (docs)** — Test plan, test cases → docs/sdlc/qe/{epic-slug}/ (one folder per epic)
7. **Dev** — After docs phase → **run implementation immediately**. Tech Lead + Senior Dev → docs/sdlc/dev/{role}/. Security shift-left: OWASP checks, dependency audit in CI
8. **QE (testing + UAT)** — QE Lead (15+ yrs automation) + Senior QE (10+ yrs) + UAT → docs/sdlc/qe/{epic-slug}/ (same folder per epic)
9. **Security + Principle Engineer** — Security + logic audit; **fix loop** (Dev fixes → re-audit) until all issues resolved; sign-off before Deploy
10. **Deploy** — Docker Compose + K8s → docs/sdlc/deploy/
11. **Maintenance** — Monitoring, bug fixes, patches, dependency updates → docs/sdlc/maintenance/

Design before Architect (UX drives tech). After the docs phase, Dev runs implementation immediately. See docs/sdlc/agents/
`;

const SDLC_WORKFLOW_MD = `# SDLC Workflow (Multi-Role)

Use this doc with **Claude** (copy to Custom Instructions / Projects) or **@ mention** in chat.
For Cursor, see .cursor/rules/sdlc-workflow.mdc

## Trigger and orchestration

- **When the user sends an idea, feature request, or requirement:** Start the pipeline and run it **continuously through deployment** (Phase 1 → 2 → … → 7). Do not handle everything in one main-agent response.
- **One role per phase:** Execute each phase as that role only; write artifacts to the right folder; then continue to the next phase. In Cursor there is one agent — it simulates the pipeline by adopting one role per phase in sequence.
- **Do not stop** after PO or any single phase unless the user explicitly asks to stop. Run through to Deploy.

## Flow

\`\`\`
User Request → PO → Business BA → Design (if app/web) → Architect → Technical BA → QE (docs) → Dev → QE (testing + UAT) → Security + PE audit → [fix loop] → Deploy → Maintenance
\`\`\`

## Phase Checklist

| Phase | Role | Key Output |
|-------|------|------------|
| 0 | Discovery | Raw request |
| 1 | PO | PRD, user stories |
| 2 | Business BA | FRS, process flows |
| 3 | Design (if app/web) | Design specs + wireframes; PO+BA review until approved |
| 4 | Architect | ADRs, system diagrams |
| 5 | Technical BA | API specs, tech breakdown |
| 6 | QE (docs) | Test plan, test cases |
| 7 | Dev | Code, unit tests (≥90%) |
| 8 | QE (testing + UAT) | QE Lead (15+ yrs automation) + Senior QE (10+ yrs), automation, UAT, sign-off |
| 9 | Security + Principle Engineer | Security + logic audit; fix loop until all issues resolved; sign-off → Deploy |
| 10 | Deploy | Docker Compose + K8s |
| 11 | Maintenance | Monitoring, bug fixes, patches, dependency updates |

**Sub-agents**: Each role runs as a sub-agent. See docs/sdlc/agents/

## Phase Details

### Phase 1: PO
- Feasibility study (technical, operational, economic), epic brief, user stories, acceptance criteria
- Output: \`docs/sdlc/po/{epic-slug}/\` — **one folder per epic**; do not put all epics in one file

### Phase 2: Business BA
- Functional requirements (FR), **non-functional requirements (NFR)** (performance, scalability, availability, security, usability), process flows, use cases
- Output: \`docs/sdlc/ba/business/{epic-slug}/\` — **one folder per epic** (same slug as PO); do not merge into one file

### Phase 3: Design (optional — app/web only)
- Create design specs (Markdown) + optional HTML wireframes based on idea + PO + BA docs. **Design before Architect so UX drives tech.**
- Output: \`docs/sdlc/design/{epic-slug}/\` — design-spec.md + optional wireframes/
- **PO + Business BA review**: Both check design vs epic/FRS; if not aligned → feedback → redesign loop until approved
- When approved → handoff to Architect

### Phase 4: Architect
- System context, container diagram, ADRs, tech stack, **security by design** (threat model, auth architecture, encryption, secrets mgmt). Input: Business BA (FR + NFR) + Design (if app/web)
- Output: \`docs/sdlc/architecture/\`

### Phase 5: Technical BA
- API specs, DB schema, team breakdown. Input: Architect + Design (if app/web)
- Output: \`docs/sdlc/ba/technical/\`

### Phase 5a: QE (Docs)
- Test plan, test cases
- Output: \`docs/sdlc/qe/{epic-slug}/\` — **one folder per epic**; do not put all epics in one file
- **After docs phase → Dev team runs implementation immediately** (no extra gate)

### Phase 5b: Dev Teams
- **Tech Lead (15+ yrs)**: Tech stack, review & merge, **security review (Shift Left)**: OWASP check, dependency audit, SAST in CI. Output: \`docs/sdlc/dev/tech-lead/\`
- **Implementation roles** (all Senior 10+ yrs; use only what applies): Senior Dev, Senior Frontend, Senior Backend, Senior Mobile, Senior Embedded, Senior Data/ML, Senior Platform → \`docs/sdlc/dev/{role}/\`. See \`implementation-roles.template.md\`.
- **Requirement**: Unit Test coverage **≥ 90%**; security practices (input validation, no hardcoded secrets)
- **Then**: QE starts testing phase

### Phase 6: QE (Testing — automation + UAT)
- **QE Lead (15+ yrs automation)**: Test strategy, framework choice, automation architecture; review test code. Output per epic: \`docs/sdlc/qe/{epic-slug}/\`
- **Senior QE (10+ yrs)**: Write automation tests per QE Lead's strategy. Output per epic: \`docs/sdlc/qe/{epic-slug}/\`
- **UAT (User Acceptance Testing)**: Verify implementation against original user stories and acceptance criteria from PO; confirm business requirements are met from end-user perspective. Output: \`qe/{epic-slug}/uat-results.md\`
- **Handoff to Security + Principle Engineer**

### Phase 7: Security + Principle Engineer (audit → fix loop)
- **Security team**: Audit security risk (OWASP, auth, secrets, infra). Output: \`docs/sdlc/security/\`
- **Principle Engineer**: Audit logic, architecture alignment, correctness. Output: \`docs/sdlc/principle-engineer/\`
- **Fix loop**: If issues found → Dev fixes → Security + PE re-audit. **Repeat until all issues resolved.** Sign-off → **Handoff to Deploy**

### Phase 8: Deploy
- After Security + Principle Engineer sign-off → deploy with **Docker Compose** (local/staging) and **Kubernetes** (production)
- Output: \`docs/sdlc/deploy/\` — docker-compose.yml, k8s/

### Phase 9: Maintenance
- **Monitoring**: Health checks, error tracking, alerting, SLA dashboards
- **Bug fixes**: Triage, fix, test, deploy per severity
- **Dependency updates**: Regular security patches, library upgrades
- **Performance tuning**: Monitor vs NFR targets; optimize bottlenecks
- **Feature iteration**: Small enhancements from feedback; significant scope → new PO epic
- Output: \`docs/sdlc/maintenance/\` — runbooks, incident logs

See [reference.md](./reference.md) for templates.
`;

const ORCHESTRATION_MD = `# Pipeline orchestration

## Trigger

When the user sends an **idea**, **feature request**, or **requirement** (e.g. "I want a login page", "We need an API for X"):

1. **Trigger the full pipeline** and run **Phase 1 → 2 → … → 11 in sequence**.
2. **One role per phase:** For each phase, act only as that role, write outputs to the correct \`docs/sdlc/...\` folder, then **continue to the next phase** without asking the user to "run next step".
3. **Run through to Maintenance.** Do not stop after PO, BA, or Dev unless the user explicitly says to stop.

## How it runs (Cursor and similar)

There is **one agent** per conversation. It simulates the pipeline by **adopting one role per phase** in order: Phase 1 as PO only → Phase 2 as Business BA only → … → Phase 11 as Maintenance. Do not mix roles in one step. If the tool later supports separate agents per phase, use that; otherwise this single-agent simulation is correct.

## Checklist per run

- [ ] Phase 1 PO: artifacts in \`docs/sdlc/po/{epic-slug}/\` (one folder per epic)
- [ ] Phase 2 Business BA: \`docs/sdlc/ba/business/{epic-slug}/\` (one folder per epic)
- [ ] Phase 3 Design (if app/web): design specs + wireframes in \`docs/sdlc/design/{epic-slug}/\`; PO+BA review until approved
- [ ] Phase 4 Architect: \`docs/sdlc/architecture/\`
- [ ] Phase 5 Technical BA: \`docs/sdlc/ba/technical/\`
- [ ] Phase 6 QE docs: \`docs/sdlc/qe/{epic-slug}/\` (one folder per epic)
- [ ] Phase 7 Dev: code + unit tests, \`docs/sdlc/dev/\`
- [ ] Phase 8 QE testing + UAT: automation, UAT against user stories, sign-off → \`docs/sdlc/qe/{epic-slug}/\`
- [ ] Phase 9 Security + Principle Engineer: \`docs/sdlc/security/\`, \`docs/sdlc/principle-engineer/\`; fix loop until no issues; sign-off
- [ ] Phase 10 Deploy: \`docs/sdlc/deploy/\`, Docker Compose + K8s
- [ ] Phase 11 Maintenance: monitoring, bug fixes, patches, dependency updates → \`docs/sdlc/maintenance/\`
`;

const REFERENCE_MD = `# SDLC Workflow — Reference

Templates and examples. Use \`*.template.md\` as starting points.
Templates are written for all project types: web, mobile, API-only, library/SDK, CLI, data/ML, platform/infra.
Sub-agents: docs/sdlc/agents/
Deploy: docs/sdlc/deploy/ (Docker Compose + K8s)

## Folder structure: one per epic/feature

- **PO**: \`docs/sdlc/po/{epic-slug}/\` — one folder per epic. Files: epic-brief.md, user-stories.md. Do not put all epics in one file.
- **Business BA**: \`docs/sdlc/ba/business/{epic-slug}/\` — same slug as PO. Files: functional-requirements.md, process-flows.md. Do not merge all epics into one file.
- **Design (if app/web)**: \`docs/sdlc/design/{epic-slug}/\` — design specs (Markdown) + optional HTML wireframes; PO+BA review until approved.
- **QE**: \`docs/sdlc/qe/{epic-slug}/\` — same slug as PO/BA. Files: test-plan.md, test-cases.md, automation. Do not put all epics in one file.
- **Security**: \`docs/sdlc/security/\` — security audit; fix loop until no issues
- **Principle Engineer**: \`docs/sdlc/principle-engineer/\` — logic audit; fix loop until no issues
- **Maintenance**: \`docs/sdlc/maintenance/\` — monitoring, bug fixes, patches, runbooks
`;

const AGENTS_README = `# Sub-Agents

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
| Security | security | Code, infra | Security audit → docs/sdlc/security/; fix loop until no issues |
| Principle Engineer | principle-engineer | Code, architecture | Logic audit → docs/sdlc/principle-engineer/; fix loop until no issues |
| Deploy | deploy | Security + PE sign-off (after fix loop) | Docker Compose + K8s, docs/sdlc/deploy/ |
| Maintenance | maintenance | Live application | Monitoring, bug fixes, patches, docs/sdlc/maintenance/ |

Orchestrator: run each sub-agent in order; hand off output → input of the next sub-agent.

**Trigger:** On user idea/request, run the full pipeline (see docs/sdlc/ORCHESTRATION.md). One role per phase; single agent simulates by switching role each phase. Do not stop after one phase until Deploy unless the user asks.
`;

const SECURITY_README = `# Security Team

**When:** After implementation (Dev) and QE testing. **Before** Deploy.

**Role:** Audit security risk in code, APIs, infra, and configuration. Identify vulnerabilities and recommend mitigations.

**Fix loop:** If issues found → Dev fixes → re-audit. Repeat until all issues resolved; then sign-off to Deploy.

## Detailed tasks

- [ ] **Read implementation**: Code, API specs, infra configs (docker-compose, k8s)
- [ ] **Security audit**: OWASP Top 10, auth/authz, injection, XSS, CSRF, secrets exposure, dependency vulns
- [ ] **Infra/ops security**: Network, TLS, RBAC, secrets management
- [ ] **Report**: Findings, severity, remediation; output to \`docs/sdlc/security/\`
- [ ] **Fix loop**: If critical/high issues found → Dev fixes → re-audit. **Repeat until all issues resolved**; then sign-off to Deploy.
`;

const PRINCIPLE_ENGINEER_README = `# Principle Engineer

**When:** After implementation (Dev) and QE testing. **Before** Deploy.

**Role:** Audit logic, architecture alignment, design decisions, and technical quality. Ensure correctness and consistency with specs.

**Fix loop:** If issues found → Dev fixes → re-audit. Repeat until all issues resolved; then sign-off to Deploy.

## Detailed tasks

- [ ] **Read implementation**: Code, architecture ADRs, Technical BA spec
- [ ] **Logic audit**: Business logic correctness, edge cases, error handling, data flow
- [ ] **Architecture audit**: Alignment with ADRs, patterns, scalability, maintainability
- [ ] **Report**: Findings, recommendations; output to \`docs/sdlc/principle-engineer/\`
- [ ] **Fix loop**: If critical logic/arch issues found → Dev fixes → re-audit. **Repeat until all issues resolved**; then sign-off to Deploy.
`;

const DEPLOY_README = `# Deploy

After the pipeline completes (Security + Principle Engineer sign-off, after fix loop until no issues), deploy immediately with:

**After Deploy → Maintenance phase**: monitoring, bug fixes, patches, dependency updates.

- **Docker Compose** — local / staging: \`docker compose up -d\`
- **Kubernetes** — production: \`kubectl apply -f k8s/\`

## Files

- \`docker-compose.yml.template\` — copy to \`docker-compose.yml\`, adjust image/env
- \`k8s/deployment.yaml.template\` — Deployment
- \`k8s/service.yaml.template\` — Service
- \`k8s/ingress.yaml.template\` — Ingress (optional)
`;

const DOCKER_COMPOSE_TEMPLATE = `# Copy to docker-compose.yml and adjust image, env, ports.
# Single service (API, CLI, app) or add more services (api, worker, frontend, db) as needed.
services:
  app:
    image: your-registry/your-app:latest
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
  # Optional: add worker, frontend, db, etc.
  # worker:
  #   image: your-registry/worker:latest
  #   depends_on: [app]
`;

const K8S_DEPLOYMENT_TEMPLATE = `# deployment.yaml — adjust name, image, replicas. Duplicate for multi-service (api, worker, etc.).
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

## Project type
[Web app | Mobile app | API/backend only | Library/SDK | CLI/tool | Data/ML | Platform/infra | Mixed — pick one or describe]

## Problem
[What problem are we solving?]

## Success Metrics
- [Metric 1]
- [Metric 2]

## User Stories (or equivalent)
- **Web/Mobile**: As [persona], I want [action] so that [benefit].
- **API/Library**: As [consumer/integrator], I need [capability] so that [outcome].
- **CLI/Internal**: As [operator/developer], I run [command/workflow] to [result].
1. ...
2. ...

## Acceptance Criteria (High-level)
- [ ] Criterion 1
- [ ] Criterion 2

## Priority
Must have / Should have / Could have

## Feasibility Assessment
- **Technical**: [Can we build this with current tech/team? Any unknowns?]
- **Operational**: [Can we deploy, run, and support this? Any ops constraints?]
- **Economic**: [ROI justification; cost vs. value]
- **Go / No-go**: [Recommended | Needs further investigation | Not recommended]

## Dependencies & Risks
- ...
`;

const PO_README = `# PO (Product Owner)

**One folder per epic/feature.** Do not put all epics in one file.

- Create a folder per epic: \`docs/sdlc/po/{epic-slug}/\`
- Folder name = epic/feature slug (e.g. \`job-scheduler-event-bus\`, \`user-auth\`).
- Inside that folder: \`epic-brief.md\`, \`user-stories.md\`, \`prd.md\` (or similar) for that epic only.

## Detailed tasks

- [ ] **Feasibility study**: Assess technical feasibility (can we build it?), operational feasibility (can we run it?), economic feasibility (is the ROI worth it?). Document go/no-go recommendation
- [ ] **Clarify vision**: Capture business problem, goals, success metrics
- [ ] **Define scope**: Boundaries, in/out of scope, MVP vs later
- [ ] **Write epic brief**: Problem, success metrics, high-level approach, project type
- [ ] **Break into user stories**: As a [role], I want [goal] so that [benefit]; acceptance criteria per story
- [ ] **Prioritize**: Must / Should / Could have; order by value and risk
- [ ] **Identify dependencies**: External teams, systems, blockers
- [ ] **Call out risks**: Technical, schedule, compliance
- [ ] **Handoff to Business BA**: Deliverables in \`po/{epic-slug}/\`

Use epic-brief.template.md as starting point for each epic.
`;

const BA_FR_TEMPLATE = `## FR-001: [Title]

**Type**: [Feature | API/Contract | Data/Report | Compliance | Non-functional — pick one]

**Description**: [What the system must do]

**Trigger**: [When does this apply? — e.g. user action, API call, schedule, event]

**Process Flow**:
1. Step 1
2. Step 2
3. Step 3

**Output**: [Result]

**Constraints**: [Compliance, SLA, etc.]

---

## NFR-001: [Title]

**Category**: [Performance | Scalability | Availability | Security | Usability | Accessibility | Compliance — pick one]

**Description**: [What quality attribute the system must meet]

**Metric / Target**: [e.g. response time < 200ms p95, 99.9% uptime, WCAG 2.1 AA]

**Measurement**: [How to verify — load test, monitoring, audit]

---
*Use for any project type: product feature (UI/API), library behaviour, CLI behaviour, data pipeline, or platform capability.*
`;

const BA_BUSINESS_README = `# Business BA

**One folder per epic/feature.** Do not put all epics/features in one file.

- Use the same epic/feature slug as PO: \`docs/sdlc/ba/business/{epic-slug}/\`
- Inside that folder: \`functional-requirements.md\`, \`process-flows.md\`, \`use-cases.md\` (or similar) for that epic only.

Example:
\`\`\`
docs/sdlc/ba/business/
  job-scheduler-event-bus/
    functional-requirements.md
    process-flows.md
  user-auth/
    functional-requirements.md
\`\`\`

## Detailed tasks

- [ ] **Read PO outputs**: Epic brief, user stories, acceptance criteria, feasibility assessment
- [ ] **Define functional requirements**: For each requirement: type, description, trigger, process flow, output, constraints (use FR-001, FR-002...)
- [ ] **Define non-functional requirements (NFR)**: Performance (response time, throughput), scalability (load targets), availability (SLA/uptime), security (auth, encryption, compliance), usability, accessibility. Use NFR-001, NFR-002...
- [ ] **Document process flows**: Step-by-step business flows (e.g. BPMN, flowcharts, numbered lists)
- [ ] **Write use cases**: Actor, goal, preconditions, main/alternate flows, postconditions
- [ ] **Maintain glossary**: Business terms, definitions, acronyms
- [ ] **Map to user stories**: Trace FRs + NFRs to user stories / AC
- [ ] **Handoff to Design (if app/web) or Architect**: Deliverables in \`ba/business/{epic-slug}/\`

Use functional-requirement.template.md for FRS items.
`;

const TECH_API_TEMPLATE = `# Interface / contract spec

Use the section that matches your project. Delete the rest.

---

## HTTP API (backend, BFF, webhooks)
### POST /api/v1/[resource]
**Purpose**: [One-line]
**Request**: Body (JSON schema), Headers (Auth, Content-Type)
**Response**: 200 payload, 4xx/5xx error format
**Contract**: OpenAPI spec

### GET /api/v1/[resource] (add other methods as needed)
**Purpose**: ...
**Query params**: ...
**Response**: ...

---

## Library / SDK (public API surface)
### Module/Class: [Name]
**Purpose**: [One-line]
**Input**: [Params, types]
**Output**: [Return type, behaviour]
**Contract**: TS types / JSDoc / docstring

---

## CLI (commands, flags)
### Command: \`[cmd] [sub] [flags]\`
**Purpose**: [One-line]
**Args**: [positional]
**Flags**: [--opt, env vars]
**Exit codes**: 0 success, non-zero errors
**Contract**: \`--help\` output / man page
`;

const TECH_TEAM_TEMPLATE = `# Team breakdown

Use only the rows that apply to your project. Remove or leave blank unused teams.

## By project type

### Web / full‑stack (UI + API)
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Backend  | API, DB, business logic        | Technical spec    |
| Frontend | Web UI, API integration        | API contract      |

### Mobile
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Backend  | API, DB, business logic        | Technical spec    |
| Mobile   | App UI (iOS / Android / cross-platform), API integration | API contract |

### API / backend only (no UI)
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Backend  | API, DB, business logic, workers | Technical spec |

### Library / SDK
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Core     | Library/SDK implementation, public API | Technical spec |
| Bindings | Language bindings, wrappers (optional) | Core API spec |

### CLI / tooling
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| CLI      | CLI app, commands, config     | Technical spec   |

### Data / ML / analytics
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Backend  | APIs, pipelines, storage      | Technical spec   |
| Data/ML  | Models, ETL, analytics, reporting | Data spec, API contract |

### DevOps / platform / infra
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Platform | Infra, CI/CD, observability    | Technical spec   |
| Backend  | APIs, services (if any)       | Technical spec   |

### Mixed (pick and combine)
| Team     | Scope                         | Dependencies     |
|----------|--------------------------------|-------------------|
| Backend  | API, DB, business logic       | Technical spec    |
| Frontend | Web UI, API integration       | API contract      |
| Mobile   | App UI, API integration       | API contract      |
| Data/ML  | Models, ETL, analytics        | Data spec, API    |
| Platform | Infra, CI/CD, deploy         | Technical spec    |
`;

const BA_TECH_README = `# Technical BA

API/interface specs, DB schema, team breakdown.
Templates support: HTTP API, library/SDK, CLI, and all project types (see api-spec and team-breakdown).

## Detailed tasks

- [ ] **Read Architect outputs**: ADRs, context/container diagrams, tech stack
- [ ] **Read Design (if app/web)**: design-spec.md + wireframes — design informs API contracts, screen specs
- [ ] **API/interface spec**: For each endpoint/class/command: purpose, request/response, contract (OpenAPI, TS types, CLI help)
- [ ] **DB schema**: Tables, columns, indexes, constraints; migrations approach
- [ ] **Team breakdown**: Map scope to teams (Backend, Frontend, Mobile, etc.) per project type; dependencies
- [ ] **Trace to FRs**: Map technical specs to functional requirements
- [ ] **Handoff to QE + Dev**: API spec, team breakdown in \`ba/technical/\`
`;

const ARCH_ADR_TEMPLATE = `# ADR-001: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-xxx]

## Scope
[backend | frontend | mobile | library | CLI | data/ML | platform/infra | cross-cutting — one or more]

## Context
[Why we need this decision]

## Decision
[What we decided]

## Consequences
- Positive: ...
- Negative: ...
`;

const ARCH_README = `# Architect

ADRs, system diagrams, tech stack decisions.
Use adr.template.md for new ADRs.

## Detailed tasks

- [ ] **Read Business BA outputs**: Functional requirements, process flows, use cases
- [ ] **Read Design (if app/web)**: design-spec.md in \`design/{epic-slug}/\` — design informs architecture
- [ ] **Context diagram**: System boundary, external actors, integrations
- [ ] **Container diagram**: Main components/services and their responsibilities
- [ ] **Tech stack decisions**: Languages, frameworks, databases; document in ADRs
- [ ] **ADR per decision**: Context, decision, consequences (scope: backend, frontend, mobile, etc.)
- [ ] **Non-functional alignment**: Performance, security, scalability, compliance — reference NFRs from Business BA
- [ ] **Security by design (Shift Left)**: Threat model (STRIDE/attack surface), auth/authz architecture, data encryption at rest/transit, secrets management approach, dependency security policy. Document in ADR
- [ ] **Handoff to Technical BA**: Architecture docs, ADRs in \`architecture/\`
`;

const QE_TC_TEMPLATE = `## TC-001: [Scenario]

**Type**: [API | UI/E2E | Unit | Contract | CLI | Data/Regression — pick one]

**Precondition**: [State before test]

**Steps**:
1. Action 1
2. Action 2
3. Action 3

**Expected**: [Expected result]

**Links to**: AC-001, Story #42

---
*API: send request, assert status/body. UI: interact, assert DOM/visibility. CLI: run command, assert stdout/exit code. Contract: consumer/provider expectations.*
`;

const QE_README = `# QE (Quality Engineering)

**One folder per epic/feature.** Do not put all epics in one file.

- Use the same epic/feature slug as PO and Business BA: \`docs/sdlc/qe/{epic-slug}/\`
- Inside that folder: \`test-plan.md\`, \`test-cases.md\` (Phase 5a), and for Phase 6: automation notes, framework decision for that epic, etc.

## Detailed tasks (Docs phase — Phase 5a)

- [ ] **Read Technical BA spec**: API, team breakdown, FRs
- [ ] **Test plan**: Scope (unit, integration, E2E), coverage goals, risks
- [ ] **Test cases**: TC-001, TC-002... — precondition, steps, expected, links to AC
- [ ] **Handoff to Dev**: Test plan + test cases in \`qe/{epic-slug}/\` → Dev runs implementation

## Detailed tasks (Testing phase — Phase 6)

- [ ] **QE Lead**: Test strategy, framework, review test code
- [ ] **Senior QE**: Write automation tests per test plan
- [ ] **UAT (User Acceptance Testing)**: Verify against original user stories and acceptance criteria from PO; confirm business requirements are met from end-user perspective. Document UAT results in \`qe/{epic-slug}/uat-results.md\`
- [ ] **Sign-off**: Regression, coverage, UAT pass, release readiness in \`qe/{epic-slug}/\`

Example:
\`\`\`
docs/sdlc/qe/
  job-scheduler-event-bus/
    test-plan.md
    test-cases.md
    automation/   (Phase 6: Senior QE output)
  user-auth/
    test-plan.md
    test-cases.md
\`\`\`

Two phases:
1. **Docs phase** — Test plan, test cases per epic in \`qe/{epic-slug}/\`. Done → **Dev runs implementation immediately**.
2. **Testing phase** — After Dev completes unit tests: QE Lead (15+ yrs automation: strategy, framework, review) + Senior QE (automation) + **UAT** (verify against user stories/AC) output to the same \`qe/{epic-slug}/\` (or subfolders there).

Use test-case.template.md for test cases.
`;

const QE_LEAD_README = `# QE Lead (15+ years exp in test automation)

**Profile**: 15+ years of experience in test automation, test strategy, and quality engineering. Owns test automation strategy, framework selection, and quality gates across the project.

**Responsibilities**:
- **Test automation strategy**: Define scope of automation (unit, integration, E2E, API, performance), pyramid and tooling alignment with tech stack.
- **Framework and tooling**: Decide and document test frameworks (e.g. Playwright, Cypress, Jest, RestAssured, K6) and CI integration; justify choices in ADRs.
- **Automation architecture**: Design test structure, layers, fixtures, reporting, and flake prevention (retries, stability, env handling).
- **Review and standards**: Review test code for coverage, maintainability, and alignment with framework; define coding and naming standards for tests.
- **Quality gates**: Define and enforce gates (e.g. coverage thresholds, required suites before merge, regression criteria).

**Output**: Test framework ADR, automation strategy doc, review checklist, and per-epic guidance in \`docs/sdlc/qe/{epic-slug}/\`.

## Detailed tasks

- [ ] **Test automation strategy**: Document scope (unit/integration/E2E/API/performance), pyramid, alignment with tech stack
- [ ] **Framework ADR**: Choose and justify frameworks (Playwright, Cypress, Jest, etc.); document in ADR
- [ ] **Automation architecture**: Design folder structure, layers, fixtures, reporting, retries, env handling
- [ ] **Review checklist**: Coverage, maintainability, naming, alignment with framework
- [ ] **Quality gates**: Define thresholds (coverage, required suites before merge), regression criteria
- [ ] **Per-epic guidance**: Output to \`qe/{epic-slug}/\` per epic
`;

const QE_SENIOR_README = `# Senior QE (10+ years exp)

**Responsibilities**:
- Write automation tests per test plan
- Implement E2E, integration, regression tests
- Follow QE Lead's framework decisions

## Detailed tasks

- [ ] **Read test plan**: Scope, coverage goals, test case IDs
- [ ] **Implement E2E tests**: UI flows, critical paths per QE Lead's framework
- [ ] **Implement API/integration tests**: Request/response, contracts
- [ ] **Implement regression suite**: Add to CI; ensure stability (retries, waits)
- [ ] **Report coverage**: Align with QE Lead's quality gates
- [ ] **Output**: Automation code and docs in \`qe/{epic-slug}/\`
`;

const DESIGN_README = `# Design (optional — app/web projects only)

**When:** After Business BA, **before** Architect and Technical BA. **Skip** for API-only, library, CLI, data/ML, platform projects without UI.

**Why before Architect:** UX drives technical decisions — design informs architecture and API specs.

**One folder per epic:** \`docs/sdlc/design/{epic-slug}/\` — same slug as PO/BA. Store design specs and wireframes there.

## Output format

- **design-spec.md** — Markdown design spec: screen inventory, component hierarchy, user flows, responsive breakpoints, interaction notes.
- **wireframes/*.html** (optional) — Static HTML/CSS wireframes; open in any browser, no external tools needed. Keep them simple (layout + structure, not pixel-perfect).

## Flow

1. **Design sub-agent**: Create UI/UX design specs based on idea + PO docs + Business BA FRS. Write \`design-spec.md\` describing every screen, component, and user flow. Optionally generate HTML wireframes for key screens.
2. **PO + Business BA review**: Both roles review the design spec against epic brief, user stories, functional requirements.
3. **Loop until approved**: If design does not match idea/docs → return to step 1 with feedback; redesign. Repeat until PO and BA approve.
4. **Handoff to Architect**: Once approved → proceed to Architect (design informs architecture and Technical BA).

## Detailed tasks

- [ ] **Gather context**: Read PO epic brief, BA FRS, user stories as input
- [ ] **Screen inventory**: List all screens/pages with purpose and key elements
- [ ] **Component hierarchy**: Define reusable components, layout structure, navigation
- [ ] **User flows**: Document step-by-step flows for each user story (include happy path + error states)
- [ ] **Responsive breakpoints**: Define mobile / tablet / desktop behavior
- [ ] **Write design-spec.md**: Full design spec in Markdown; output to \`design/{epic-slug}/\`
- [ ] **HTML wireframes** (optional): Generate static HTML/CSS wireframes for key screens in \`design/{epic-slug}/wireframes/\`
- [ ] **PO review**: Check design aligns with epic brief, user stories, acceptance criteria
- [ ] **Business BA review**: Check design matches functional requirements, process flows
- [ ] **If not approved**: Capture feedback; loop back to design step with specific changes
- [ ] **If approved**: Handoff to Architect; design in \`design/{epic-slug}/\`
`;

const DESIGN_SPEC_TEMPLATE = `# Design Spec: [Epic Name]

## Overview
[Brief description of what this design covers and the problem it solves]

## Screen Inventory

| # | Screen / Page | Purpose | Key Elements |
|---|--------------|---------|--------------|
| 1 | | | |

## User Flows

### Flow 1: [Flow Name]
1. User lands on [screen]
2. User [action] → [result]
3. ...

**Happy path:** ...
**Error states:** ...

## Component Hierarchy

\`\`\`
App
├── Layout
│   ├── Header (nav, user menu)
│   ├── Sidebar (optional)
│   └── Main Content
│       ├── [Component A]
│       └── [Component B]
└── Footer
\`\`\`

## Screen Details

### Screen: [Name]
- **URL / Route:** \`/path\`
- **Purpose:** ...
- **Layout:** [description or ASCII wireframe]
- **Components:** [list key components]
- **Interactions:** [click, hover, form submit behaviors]
- **Data:** [what data is displayed / submitted]

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| Mobile | < 768px | Single column, hamburger nav |
| Tablet | 768–1024px | ... |
| Desktop | > 1024px | Full layout |

## Design Tokens (optional)

- **Primary color:** ...
- **Typography:** ...
- **Spacing:** ...

## Notes
[Any additional context, constraints, or decisions]
`;

const DEV_TECH_LEAD_README = `# Tech Lead (15+ years exp)

**Responsibilities**:
- Decide tech stack, frameworks, libraries
- Review and merge code
- Ensure architecture alignment

## Detailed tasks

- [ ] **Read architecture and Technical BA spec**: ADRs, API spec, team breakdown
- [ ] **Tech stack decision**: Languages, frameworks, libraries; document in ADR
- [ ] **Project setup**: Repo structure, tooling, lint, format, CI baseline
- [ ] **Code review**: Architecture alignment, patterns, test coverage, security
- [ ] **Security review (Shift Left)**: OWASP Top 10 check, input validation, auth/authz, secrets not hardcoded, dependency audit (npm audit / pip audit / etc.), SAST scan in CI
- [ ] **Merge approval**: Enforce quality gates before merge (tests, coverage, security scan pass)
- [ ] **Tech guidance**: Resolve technical disputes; mentor team
- [ ] **Output**: ADRs, review checklist in \`dev/tech-lead/\`
`;

const DEV_SENIOR_README = `# Senior Developer (10+ years exp)

**Responsibilities**:
- Implement features per Technical BA spec
- Write code with Unit Test coverage **≥ 90%**
- Follow Tech Lead's tech decisions

## Detailed tasks

- [ ] **Read Technical BA spec**: API, schema, team breakdown
- [ ] **Implement feature**: Code per spec; follow Tech Lead stack
- [ ] **Security practices (Shift Left)**: Input validation, parameterized queries, no hardcoded secrets, follow Architect's security ADR
- [ ] **Unit tests**: Coverage **≥ 90%**; edge cases, error paths
- [ ] **PR**: Lint, tests, security scan passing; request Tech Lead review
- [ ] **Output**: Code + implementation notes in \`dev/senior-developer/\`
`;

const DEV_IMPLEMENTATION_ROLES_TEMPLATE = `# Implementation roles by project type

Use only the roles that apply. Remove or ignore the rest. Tech Lead is cross-cutting; add discipline roles as needed.

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

- \`tech-lead/\` — Tech Lead (15+ yrs): tech stack, review & merge (all projects)
- \`senior-developer/\` — Senior Developer: generic implementation
- \`frontend/\` — Senior Frontend: Web UI
- \`backend/\` — Senior Backend: API, services, DB
- \`mobile/\` — Senior Mobile: iOS, Android, cross-platform
- \`embedded/\` — Senior Embedded: firmware, IoT
- \`data-ml/\` — Senior Data/ML: ETL, models, analytics
- \`platform/\` — Senior Platform: CI/CD, infra, observability
`;

const DEV_FRONTEND_README = `# Senior Frontend (10+ years exp) — Web UI

**Responsibilities**:
- Implement web UI per design and API contract
- Unit Test coverage **≥ 90%**
- Follow Tech Lead's stack (e.g. React, Vue, Angular)

## Detailed tasks

- [ ] **Read Technical BA spec**: API contract, design (if any)
- [ ] **Implement components/screens**: Per spec; responsive, accessible
- [ ] **API integration**: Fetch, state, error handling
- [ ] **Unit tests**: Components, hooks, utils — coverage **≥ 90%**
- [ ] **PR**: Lint, tests; Tech Lead review
- [ ] **Output**: Code + component/integration docs in \`dev/frontend/\`
`;

const DEV_BACKEND_README = `# Senior Backend (10+ years exp) — API, services

**Responsibilities**:
- Implement API, services, DB layer per Technical BA spec
- Unit Test coverage **≥ 90%**
- Follow Tech Lead's stack

## Detailed tasks

- [ ] **Read Technical BA spec**: API spec, DB schema
- [ ] **Implement endpoints**: Per spec; validation, auth, error responses
- [ ] **Implement DB layer**: Migrations, queries, transactions
- [ ] **Unit tests**: Services, controllers, DB — coverage **≥ 90%**
- [ ] **PR**: Lint, tests; Tech Lead review
- [ ] **Output**: Code + API/DB implementation notes in \`dev/backend/\`
`;

const DEV_MOBILE_README = `# Senior Mobile (10+ years exp) — iOS / Android / cross-platform

**Responsibilities**:
- Implement app UI and API integration per spec
- Unit Test coverage **≥ 90%**
- Follow Tech Lead's stack (e.g. React Native, Flutter, native)

## Detailed tasks

- [ ] **Read Technical BA spec**: API contract, screen flows
- [ ] **Implement screens/modules**: Per spec; platform parity (iOS/Android)
- [ ] **API integration**: Auth, state, offline (if required)
- [ ] **Unit tests**: Components, logic — coverage **≥ 90%**
- [ ] **PR**: Lint, tests; Tech Lead review
- [ ] **Output**: Code + screen/module docs in \`dev/mobile/\`
`;

const DEV_EMBEDDED_README = `# Senior Embedded (10+ years exp) — firmware, IoT

**Responsibilities**:
- Implement firmware, drivers, hardware interfaces per spec
- Tests as appropriate for target (unit, HW-in-loop)
- Follow Tech Lead's stack and safety constraints

## Detailed tasks

- [ ] **Read Technical BA spec**: Interfaces, timing, constraints
- [ ] **Implement modules/drivers**: Per spec; safety-critical compliance
- [ ] **Tests**: Unit, HW-in-loop as feasible
- [ ] **PR**: Lint, tests; Tech Lead review
- [ ] **Output**: Code + module/interface docs in \`dev/embedded/\`
`;

const DEV_DATA_ML_README = `# Senior Data/ML (10+ years exp)

**Responsibilities**:
- Implement ETL, models, analytics pipelines per spec
- Tests and validation for data and model quality
- Follow Tech Lead's stack (e.g. Python, Spark, ML frameworks)

## Detailed tasks

- [ ] **Read Technical BA spec**: Data spec, API contract
- [ ] **Implement ETL/pipelines**: Ingestion, transforms, storage
- [ ] **Implement models**: Training, evaluation; model cards
- [ ] **Tests**: Data validation, model quality metrics
- [ ] **PR**: Lint, tests; Tech Lead review
- [ ] **Output**: Code + pipeline/model docs in \`dev/data-ml/\`
`;

const DEV_PLATFORM_README = `# Senior Platform (10+ years exp) — infra, CI/CD

**Responsibilities**:
- Implement CI/CD, infra as code, observability per spec
- Follow Tech Lead's stack and security requirements

## Detailed tasks

- [ ] **Read Technical BA spec**: Infra, deploy, observability requirements
- [ ] **Implement CI/CD**: Build, test, deploy pipelines
- [ ] **Infra as code**: Terraform/Pulumi/CloudFormation per spec
- [ ] **Observability**: Logging, metrics, traces, alerts
- [ ] **PR**: Lint; Tech Lead review
- [ ] **Output**: Pipelines, infra code, runbooks in \`dev/platform/\`
`;

const MAINTENANCE_README = `# Maintenance

**When:** After Deploy — ongoing throughout the product lifecycle.

**Role:** Monitor production health, fix bugs, apply patches, upgrade dependencies, and evolve features based on user feedback.

## Detailed tasks

- [ ] **Monitoring setup**: Health checks, error tracking (Sentry, Datadog, etc.), alerting, SLA dashboards
- [ ] **Bug triage**: Prioritize production bugs; severity classification (P0–P3)
- [ ] **Bug fixes**: Follow Dev workflow (branch → fix → unit test → PR → review → deploy)
- [ ] **Dependency updates**: Regular security patches, library upgrades; run audit tools
- [ ] **Performance tuning**: Monitor metrics vs NFR targets; optimize bottlenecks
- [ ] **Feature iteration**: Small enhancements from user feedback → loop back to PO for new epics if scope is significant
- [ ] **Documentation**: Keep runbooks, incident logs, and post-mortems up to date
- [ ] **Output**: Patches, updates, runbooks in \`docs/sdlc/maintenance/\`
`;

main();
