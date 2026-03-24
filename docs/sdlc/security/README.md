# Security Team

**When:** After implementation (Dev) and QE testing (0 open bugs). **Before** Deploy.

**Role:** Audit security risk in code, APIs, infra, and configuration. Identify vulnerabilities and recommend mitigations.

**Fix → retest → re-audit loop:** If issues/vulnerabilities found → **Dev fixes** → **QE retests** (verify fix, no regression) → **Security re-audit**. Repeat until 0 issues/vulnerabilities remain; then sign-off to Deploy.

## Detailed tasks

- [ ] **Read packed inputs**: `architecture.packed.md` + `ba/technical.packed.md` + code — do NOT load individual spec files
- [ ] **Security audit**: OWASP Top 10, auth/authz, injection, XSS, CSRF, secrets exposure, dependency vulns
- [ ] **Infra/ops security**: Network, TLS, RBAC, secrets management
- [ ] **Report**: Findings, severity, remediation; output to `docs/sdlc/security/`
- [ ] **Fix → retest → re-audit loop**: If issues found → Dev fixes → **QE retests** (confirm fix, no regression) → Security re-audit. **Repeat until 0 issues/vulnerabilities remain**; then sign-off to Deploy.
