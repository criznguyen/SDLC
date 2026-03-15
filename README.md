# sdlc-workflow

Scaffold SDLC workflow docs and templates into your project. Works with **Cursor**, **Claude**, **Antigravity**, and **Codex**.

## Flow

```
User Request → PO → Business BA → Architect → Technical BA → QE (docs) → Dev → QE (testing) → Deploy (Docker Compose + K8s)
```

- **Trigger:** When you send an **idea** or **feature request**, the agent should run the **full pipeline** (PO → … → Deploy) in sequence, one sub-agent/role per phase — not handle everything in one go or stop after one phase. See `docs/sdlc/ORCHESTRATION.md`.
- **Each role runs as a sub-agent** (see `docs/sdlc/agents/`).
- **After completion** → deploy immediately with **Docker Compose** (local/staging) and **Kubernetes** (production) — `docs/sdlc/deploy/`.
- **QE (docs)**: Test plan, test cases
- **Dev**: After docs phase → **run implementation immediately**. Tech Lead (review, merge) + Senior Dev (implement, Unit Test ≥90%)
- **QE (testing)**: QE Lead (test framework, review) + Senior QE (10+ yrs, write automation tests)

## Usage

In your project directory:

```bash
npx sdlc-workflow init
```

This creates:

**Project:**
- `docs/sdlc/` — SDLC docs, templates, and phase folders
- `AGENTS.md` — Antigravity, Codex (universal project guidance)
- `.agents/skills/sdlc-workflow/` — Codex repo skill
- `.cursor/rules/sdlc-workflow.mdc` — Cursor rule
- `.claude/CLAUDE.md` — Claude Code instructions

**Global (user home):**
- `~/.cursor/skills/sdlc-workflow/` — Cursor skill
- `~/.codex/AGENTS.md` — Codex global instructions
- `~/.agents/skills/sdlc-workflow/` — Codex global skill

## Generated Structure

```
docs/sdlc/
├── SDLC-WORKFLOW.md          # Main workflow (use with Claude)
├── reference.md
├── po/                       # Product Owner
│   ├── epic-brief.template.md
│   └── README.md
├── ba/
│   ├── business/             # Business BA
│   │   ├── functional-requirement.template.md
│   │   └── README.md
│   └── technical/            # Technical BA
│       ├── api-spec.template.md
│       ├── team-breakdown.template.md
│       └── README.md
├── architecture/             # Architect
│   ├── adr.template.md
│   └── README.md
├── qe/                       # QE (docs + testing)
│   ├── test-case.template.md
│   ├── README.md
│   ├── qe-lead/              # QE Lead: test framework, review test code
│   │   └── README.md
│   └── senior-qe/            # Senior QE 10+ yrs: write automation tests
│       └── README.md
├── dev/                      # Dev team (per role)
│   ├── tech-lead/            # Tech Lead 15+ yrs: tech stack, review & merge
│   │   └── README.md
│   └── senior-developer/     # Senior Dev 10+ yrs: implement, Unit Test ≥90%
│       └── README.md
├── agents/                   # Sub-agent specs (each role = sub-agent)
│   └── README.md
└── deploy/                   # After completion → Docker Compose + K8s
    ├── README.md
    ├── docker-compose.yml.template
    └── k8s/
        ├── deployment.yaml.template
        ├── service.yaml.template
        └── ingress.yaml.template

.cursor/rules/
└── sdlc-workflow.mdc         # Cursor rule

AGENTS.md                     # Antigravity, Codex (universal)
.agents/skills/sdlc-workflow/ # Codex repo skill
```

## Use with Cursor

The rule `.cursor/rules/sdlc-workflow.mdc` activates when working with `docs/sdlc/**` or `*.md`. Global skill: `~/.cursor/skills/sdlc-workflow/`.

## Use with Claude

- **Claude Code** (project): `.claude/CLAUDE.md` — Claude loads it when you open this project.
- **Claude.ai** (web): Copy `docs/sdlc/SDLC-WORKFLOW.md` into Custom Instructions or @ mention it.

## Use with Antigravity

`AGENTS.md` at project root — Antigravity reads it (priority: AGENTS.md → GEMINI.md). Universal format, works across agentic IDEs.

## Use with Codex

- **Project**: `AGENTS.md` + `.agents/skills/sdlc-workflow/`
- **Global**: `~/.codex/AGENTS.md` + `~/.agents/skills/sdlc-workflow/`

## Release

1. Add `NPM_TOKEN` (npm access token) to repo **Settings → Secrets → Actions**.
2. Push a version tag:

   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. GitHub Action publishes to npm and creates a GitHub Release.

## License

MIT
