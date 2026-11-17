# Architecture Version — LevUp Projects

## Current Architecture Baseline

| Field                           | Value                                      |
| ------------------------------- | ------------------------------------------ |
| Baseline identifier             | `arch-baseline-2026-11-17`                 |
| Architecture document revision  | `1.0.0`                                    |
| Assessment date                 | 2026-11-17                                 |
| Application version at baseline | Unreleased (pre `v0.1.0`)                  |
| Commit SHA at baseline          | `78b2142dcf02b3c905f6c93efb9fe5183762ae5c` |

---

## Current Architectural Decisions

| ADR                                                                    | Title                                        | Status   |
| ---------------------------------------------------------------------- | -------------------------------------------- | -------- |
| [ADR-0001](docs/01-architecture/adr/ADR-0001-architecture-baseline.md) | Vite SPA retained; Next.js migration planned | Accepted |

---

## Major Changes Since Previous Baseline

_This is the initial baseline. No prior baseline exists._

---

## Architectural State Summary

| Concern            | Current state                            | Target state                  |
| ------------------ | ---------------------------------------- | ----------------------------- |
| Frontend framework | Vite 8 + React 19 SPA                    | Next.js App Router            |
| Routing            | Custom `window.location.pathname` switch | Next.js file-system routing   |
| Backend            | None                                     | Supabase + Next.js API routes |
| Database           | None                                     | Supabase PostgreSQL           |
| Authentication     | None                                     | Supabase Auth                 |
| File storage       | None                                     | Supabase Storage              |
| Payments           | None                                     | Cashfree (server-side only)   |
| Deployment         | Not deployed                             | Vercel                        |
| CI/CD              | None                                     | GitHub Actions                |
| Monitoring         | None                                     | Sentry + Lighthouse CI        |

---

## Migration Compatibility

There are **no existing integrations** that could break during the Next.js migration. All data is currently static TypeScript. Component files will be preserved and reused in the new App Router structure.

---

## Review Schedule

This document should be updated whenever:

- A new ADR is accepted.
- A major architectural component is added, replaced, or removed.
- The migration to Next.js begins or completes.
