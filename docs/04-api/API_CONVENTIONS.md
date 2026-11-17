# API Conventions — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. RESTful Standards

- **Protocols**: All endpoints require HTTPS.
- **Payload Format**: Requests and responses must use `application/json; charset=utf-8`.
- **URL Naming**: Resource-oriented URLs, lowercase, hyphenated (`/api/catalog/projects`, `/api/custom-projects`).
- **HTTP Methods**:
  - `GET`: Safe, idempotent read operations.
  - `POST`: Create resource or initiate action.
  - `PATCH`: Partial update of a resource.
  - `DELETE`: Archive or soft-delete resource.

---

## 2. Standard Response Envelope

All API endpoints follow a consistent JSON response shape:

```jsonc
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Project package selection does not exist.",
    "details": [
      { "field": "package_name", "issue": "Expected one of 'Basic', 'Standard', 'Premium'" }
    ]
  },
  "request_id": "req_01JFGH83Q5..."
}
```

---

## 3. Financial Field Convention

Monetary figures must **always** end in the suffix `_paise` and represent integers.  
Never transmit floating-point currency numbers like `99.99`. Always transmit `9999`.
