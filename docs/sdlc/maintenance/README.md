# Maintenance

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
- [ ] **Output**: Patches, updates, runbooks in `docs/sdlc/maintenance/`
