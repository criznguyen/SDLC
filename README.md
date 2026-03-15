# sdlc-workflow

Scaffold SDLC workflow docs and templates into your project. Works with **Cursor** and **Claude**.

## Flow

```
User Request → PO → Business BA → Architect → Technical BA → QE (docs) → Dev → QE (testing) → Deploy
```

- **QE (docs)**: Test plan, test cases — before Dev implements
- **Dev**: Tech Lead (review, merge) + Senior Dev (implement, Unit Test ≥90%)
- **QE (testing)**: After Dev unit tests — automation + manual, sign-off

## Usage

In your project directory:

```bash
npx sdlc-workflow init
```

This creates:

- `docs/sdlc/` — SDLC docs, templates, and phase folders
- `.cursor/rules/sdlc-workflow.mdc` — Cursor rule for this project
- `~/.cursor/skills/sdlc-workflow/` — Cursor skill (global, applies to all projects)
- `.claude/CLAUDE.md` — Claude Code instructions (project-level)

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
│   └── README.md
└── dev/                      # Dev team (per role)
    ├── tech-lead/            # Tech Lead 15+ yrs: tech stack, review & merge
    │   └── README.md
    └── senior-developer/     # Senior Dev 10+ yrs: implement, Unit Test ≥90%
        └── README.md

.cursor/rules/
└── sdlc-workflow.mdc         # Cursor rule
```

## Use with Claude

- **Claude Code** (project): `.claude/CLAUDE.md` is created by init — Claude loads it automatically when you open this project.
- **Claude.ai** (web): Copy `docs/sdlc/SDLC-WORKFLOW.md` into Custom Instructions or @ mention it in chat.

## Use with Cursor

The rule `.cursor/rules/sdlc-workflow.mdc` activates when working with `docs/sdlc/**` or `*.md`.

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
