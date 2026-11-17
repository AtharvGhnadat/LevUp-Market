# Log Retention & Archival Policy — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Retention Tiers by Category

| Category          | Local Dev Retention | Vercel Live Search | Cold Storage Archive (S3 / Supabase)    |
| ----------------- | ------------------- | ------------------ | --------------------------------------- |
| `application`     | 7 days              | 7 days             | 30 days                                 |
| `errors`          | 14 days             | 30 days            | 90 days                                 |
| `security`        | 30 days             | 90 days            | 365 days (1 year)                       |
| `payments`        | 30 days             | 90 days            | 2,555 days (7 years, legal requirement) |
| `audit-exports`   | 30 days             | 90 days            | 2,555 days (7 years, legal requirement) |
| `integrations`    | 7 days              | 14 days            | 30 days                                 |
| `background-jobs` | 7 days              | 7 days             | 30 days                                 |

---

## 2. Archival Pipeline Specification

- Local development logs written to: `logs/{env}/{category}/{YYYY}/{MM}/{DD}/{HH}/events.jsonl`.
- In production, hourly cron compresses elapsed hours to `events.jsonl.gz` and pushes to cold storage bucket.
- Data older than tier limit is purged automatically via object storage lifecycle expiration rules.
