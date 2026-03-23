# Interface / contract spec

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
### Command: `[cmd] [sub] [flags]`
**Purpose**: [One-line]
**Args**: [positional]
**Flags**: [--opt, env vars]
**Exit codes**: 0 success, non-zero errors
**Contract**: `--help` output / man page
