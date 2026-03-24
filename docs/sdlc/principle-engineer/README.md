# Principle Engineer

**When:** After implementation (Dev) and QE testing (0 open bugs). **Before** Deploy.

**Role:** Audit logic, architecture alignment, design decisions, and technical quality. Ensure correctness and consistency with specs.

**Fix → retest → re-audit loop:** If issues found → **Dev fixes** → **QE retests** (verify fix, no regression) → **PE re-audit**. Repeat until 0 issues remain; then sign-off to Deploy.

## Detailed tasks

- [ ] **Read packed inputs**: `architecture.packed.md` + `ba/technical.packed.md` + code — do NOT load individual spec files
- [ ] **Logic audit**: Business logic correctness, edge cases, error handling, data flow
- [ ] **Architecture audit**: Alignment with ADRs, patterns, scalability, maintainability
- [ ] **Report**: Findings, recommendations; output to `docs/sdlc/principle-engineer/`
- [ ] **Fix → retest → re-audit loop**: If logic/arch issues found → Dev fixes → **QE retests** (confirm fix, no regression) → PE re-audit. **Repeat until 0 issues remain**; then sign-off to Deploy.
