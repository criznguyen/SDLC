# Team breakdown

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
