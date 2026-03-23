# Deploy

After the pipeline completes (Security + Principle Engineer sign-off, after fix → retest → re-audit loop until 0 issues), deploy immediately with:

**After Deploy → Maintenance phase**: monitoring, bug fixes, patches, dependency updates.

- **Docker Compose** — local / staging: `docker compose up -d`
- **Kubernetes** — production: `kubectl apply -f k8s/`

## Files

- `docker-compose.yml.template` — copy to `docker-compose.yml`, adjust image/env
- `k8s/deployment.yaml.template` — Deployment
- `k8s/service.yaml.template` — Service
- `k8s/ingress.yaml.template` — Ingress (optional)
