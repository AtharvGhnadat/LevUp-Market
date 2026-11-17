# Error Handling & Status Codes — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Standard Error Codes

| HTTP Status | Error Code | Description | User Action |
|---|---|---|---|
| `400` | `INVALID_INPUT` | Zod schema validation failed on request body or parameters | Correct field values and retry |
| `401` | `UNAUTHENTICATED` | Missing, expired, or malformed session JWT | Log in to obtain a valid session |
| `401` | `INVALID_SIGNATURE` | Cashfree webhook signature verification failed | Security block; inspect secret config |
| `403` | `FORBIDDEN` | Authenticated user lacks permission (e.g. non-admin requesting admin route) | Contact support or use entitled account |
| `404` | `NOT_FOUND` | Project, order, quotation, or deliverable does not exist | Verify ID/slug |
| `409` | `RESOURCE_CONFLICT` | Duplicate custom project reference or state conflict | Refresh view and review state |
| `422` | `PRICE_MISMATCH` | Client-submitted price differs from authoritative server price | Cart refreshed with server values |
| `429` | `RATE_LIMIT_EXCEEDED` | Request rate exceeded threshold | Wait and retry after backoff interval |
| `500` | `INTERNAL_SERVER_ERROR` | Unhandled exception logged with correlation trace ID | Escalate to engineering on-call |

---

## 2. Server Error Sanitization

> [!CAUTION]
> Production error responses must **never** expose internal database error messages, stack traces, SQL queries, or filesystem paths to the client. Detailed diagnostic traces are logged exclusively to the structured log pipeline (`logs/errors/...`).
