# `[OPS]` — Infrastructure & Deployment

**When:** After `[SEC]` + `[PERF]` + `[PE]` sign-off (all Critical + High issues = 0). **Before** Maintenance.

---

## Quality Standard

> **All secrets in Vault / SSM / Secrets Manager.** No hardcoded credentials in source code or IaC. Every IaC file must pass `tfsec` or `checkov` before deployment. No exceptions.

---

## Role: `[OPS]` — Infrastructure & Deployment

**Trigger:** After Phase 8 quality gates passed (0 Critical/High from `[SEC]` + `[PERF]`).
**Output:** `docs/sdlc/deploy/` — Docker Compose, K8s, Terraform, Ansible, CI/CD.

---

## Deployment Strategy

### Local / Staging

```bash
docker compose up -d
```

### Production

```bash
kubectl apply -f k8s/
```

---

## Deliverables

### 5A: Docker Compose + Kubernetes (Core)

- `docker-compose.yml.template` — copy to `docker-compose.yml`, adjust image/env/ports
- `k8s/deployment.yaml.template` — Deployment (replicas, resource limits, readiness/liveness probes)
- `k8s/service.yaml.template` — Service (ClusterIP / LoadBalancer)
- `k8s/ingress.yaml.template` — Ingress (optional, TLS termination)

### 5B: Terraform (Enterprise — optional, use as needed)

```
deploy/terraform/
├── main.tf              # Provider, region, resources
├── variables.tf         # Input variables
├── outputs.tf          # Output values
└── modules/
    ├── vpc/
    ├── ecs-fargate/     # or EKS, EC2, Cloud Run
    ├── rds/
    ├── alb/
    └── iam/
```

**Terraform requirements:**
- Provider: AWS / GCP / Azure (use context from `[SA]`)
- VPC, subnets, security groups
- Compute: ECS/EKS/EC2/Cloud Run
- Managed database: RDS/Cloud SQL/Azure SQL
- Load balancer + SSL termination (ACM / Let's Encrypt)
- S3/GCS buckets with lifecycle policies
- IAM roles with **least-privilege principle**
- Remote state backend: S3 + DynamoDB lock (AWS) or GCS + lock
- **tfsec / checkov** must pass before `terraform apply`:
  ```bash
  tfsec . --severity-threshold=high
  # or
  checkov -d . --framework terraform --bc-ids=true
  ```

### 5C: Ansible (Configuration Management — optional)

```
deploy/ansible/
├── inventory/
│   ├── dev
│   ├── staging
│   └── prod
├── roles/
│   ├── app-deploy/
│   ├── nginx-config/
│   ├── ssl-renew/
│   └── monitoring-agent/
├── playbooks/
│   ├── site.yml
│   ├── deploy.yml
│   └── rollback.yml
└── ansible.cfg
```

**Ansible requirements:**
- Inventory structure per environment (dev/staging/prod)
- Roles: app-deploy, nginx-config, ssl-renew, monitoring-agent
- Vault-encrypted secrets handling (`ansible-vault`)
- Health check post-deploy tasks
- Zero-downtime rolling deploy strategy:
  ```bash
  ansible-playbook playbooks/deploy.yml \
    --tags rolling \
    --check  # dry-run first
  ```

### 5D: CI/CD Pipeline

```
.github/workflows/
├── ci.yml      # lint → test → build → scan → deploy → smoke-test
└── release.yml
```

**Pipeline stages (in order):**

1. **Lint** — ESLint, Prettier, Pre-commit hooks
2. **Test** — Unit tests, integration tests, **100% coverage gate**
3. **Build** — Docker build + push to registry
4. **Scan** — SAST (Semgrep/Bandit), DAST (if applicable), dependency CVE scan
5. **Deploy** — to environment (dev → staging → prod)
6. **Smoke test** — health check, basic E2E

**Branch strategy:** GitFlow or trunk-based (per `[SA]` decision).

**Gates:**
- `main` / `master`: Requires PR review + all CI stages green
- `staging`: Auto-deploy on merge to `develop`
- `prod`: Manual approval gate + `[PO]` sign-off

---

## Detailed Tasks

- [ ] **Read `[SEC]` security assessment report:** Ensure all findings resolved
- [ ] **Read `[PERF]` performance assessment report:** Ensure all findings resolved
- [ ] **Docker Compose:** Template adjusted for project (image, ports, env vars)
- [ ] **Kubernetes manifests:** Deployment with resource limits, HPA if needed, health probes
- [ ] **Terraform (optional):** Provision cloud resources per `[SA]` architecture
- [ ] **Ansible (optional):** Config management, secrets in Vault, rolling deploy
- [ ] **CI/CD pipeline:** All 6 stages implemented; coverage gate enforced; SAST/DAST in scan stage
- [ ] **IaC security scan:** `tfsec` or `checkov` — block if **HIGH** severity findings
- [ ] **Secrets management:** Verify all secrets in Vault/SSM; no hardcoded in code or IaC
- [ ] **Zero-downtime deploy:** Rolling update strategy configured; rollback playbook ready
- [ ] **Self-review:** `[OPS]` self-review + `[SEC]` IaC security scan
- [ ] **Smoke test:** Post-deploy health check documented and automated

---

## Gate

```
IF tfsec / checkov finds HIGH severity:
  → 🔴 BLOCK — fix IaC issues before deploy
ELSE IF secrets found in source:
  → 🔴 BLOCK — rotate secrets, fix IaC/code
ELSE IF [SEC] / [PERF] findings unresolved:
  → 🔴 BLOCK — return to Phase 8
ELSE:
  → ✅ DEPLOYMENT READY → Phase 10 Sign-off
```

---

## Sign-off

Only after `[OPS]` self-review + `[SEC]` IaC scan = ✅

Output: `docs/sdlc/deploy/` → hand off to `[PO]` for Phase 10 sign-off.

---

## Response Format (Mandatory)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 APEX — [PHASE NAME] | [OPS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INPUT RECEIVED
[What was received from previous phase or business]

🔄 PROCESSING
[Current role's analysis/work — detailed, professional, complete]

📤 OUTPUT ARTIFACT: [Artifact Name]
[Full artifact content — never abbreviated, never "..." placeholders]

🚦 GATE STATUS
[ ] Pending review     [✅] Approved     [🔴] Blocked — reason: ...

⏭️ NEXT ACTION
[What triggers next, which role activates, what they need]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
