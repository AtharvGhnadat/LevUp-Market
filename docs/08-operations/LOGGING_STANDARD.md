# Logging Standard — LevUp Projects

**Status:** Foundation documented  
**Last updated:** 2026-11-17

---

## Overview

LevUp Projects uses structured JSON Lines logging with UTC timestamps and hierarchical file partitioning for local development. In production (Vercel), logs are emitted to the platform's structured log stream and optionally archived to durable object storage.

> [!WARNING]
> The production log archive pipeline is **not yet configured**. All logging below describes the target standard. The local development adapter is the only active implementation at this stage.

---

## Log Archive Structure

```
logs/
  <environment>/
    <category>/
      <YYYY>/
        <MM>/
          <DD>/
            <HH>/
              events.jsonl
```

**Example:**
```
logs/development/application/2026/11/17/19/events.jsonl
logs/development/errors/2026/11/17/19/events.jsonl
logs/development/security/2026/11/17/19/events.jsonl
```

All folder names use **UTC** time. Timestamps within log events also use UTC ISO 8601.

---

## Categories

| Category | Contents |
|---|---|
| `application` | General application events, page requests, feature usage |
| `errors` | Caught and uncaught errors, stack traces |
| `security` | Auth events, permission denials, rate limit hits, suspicious patterns |
| `payments` | Payment order creation, status updates, webhook events |
| `audit-exports` | Admin actions, data exports, sensitive operations |
| `integrations` | Third-party API calls and responses (redacted) |
| `background-jobs` | Scheduled tasks, batch operations |

---

## Log Event Schema

Each event is a single JSON object on one line (JSONL):

```jsonc
{
  "timestamp": "2026-11-17T14:00:00.000Z",    // ISO 8601 UTC
  "level": "info",                              // debug | info | warn | error | fatal
  "environment": "development",                 // development | staging | production
  "service": "levup-web",                       // service identifier
  "event_name": "catalog.view",                 // dot-namespaced event identifier
  "message": "User viewed catalog page",        // human-readable message
  "request_id": "req_abc123",                   // per-request unique ID
  "correlation_id": "corr_xyz789",              // cross-service trace ID
  "trace_id": "trace_def456",                   // distributed trace ID
  "actor_id": "user_01JFGH...",                 // Supabase user ID, if authenticated
  "resource_type": "catalog",                   // entity type affected
  "resource_id": "esp32-smart-irrigation",      // entity ID
  "duration_ms": 142,                           // operation duration
  "error_code": null,                           // application error code
  "application_version": "0.1.0",              // from package.json
  "deployment_id": "dpl_vercel_abc123"          // deployment identifier
}
```

---

## Severity Levels

| Level | When to use |
|---|---|
| `debug` | Detailed diagnostic information (dev only) |
| `info` | Normal operational events |
| `warn` | Unexpected but recoverable conditions |
| `error` | Errors that affect a specific operation |
| `fatal` | Errors that prevent the service from operating |

---

## Sensitive Data — Never Log

> [!CAUTION]
> The following must never appear in log output under any circumstances:

- Passwords, OTPs, PIN codes
- Access tokens, refresh tokens, JWT secrets
- API keys and secrets (Cashfree Client Secret, Supabase Service Role Key)
- Payment card numbers, CVV, full card data
- Full street addresses (log city/region only)
- Private uploaded project files or their content
- Raw webhook secrets
- PAN numbers or government IDs
- Unnecessary personal data beyond what is required for the event

Payment records and business audit events must be persisted in **Supabase PostgreSQL**, not only in log files.

---

## Production Logging

Vercel functions do not support persistent local filesystems. In production:

1. All `console.log` / `console.error` output is captured by Vercel's platform logger.
2. Structured events are emitted via the central logging interface.
3. For long-term retention, events are batched and archived to Supabase Storage under the same `environment/category/YYYY/MM/DD/HH/events.jsonl` hierarchy.
4. Archived files may be compressed as `events.jsonl.gz`.

> [!NOTE]
> The production archive pipeline will be configured and documented separately when the backend is set up.

---

## Git Exclusions

The `logs/` directory is excluded from version control via `.gitignore`. Do not commit log files.

A `.gitkeep` file or documented `mkdirp` step in developer setup ensures the directory hierarchy is recreatable.
