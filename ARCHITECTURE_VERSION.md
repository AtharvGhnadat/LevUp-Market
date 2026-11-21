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

## Customer workspace revision

Architecture document revision `1.1.0` describes the unreleased workspace added on the customer authentication branch. It reuses the profile created at registration and the existing order tables. PostgreSQL ownership policies and column grants cover the new private customer records. The original baseline above remains the historical comparison point. [Current architecture](docs/01-architecture/ARCHITECTURE.md)

## Current Architectural Decisions

| ADR                                                                    | Title                                        | Status   |
| ---------------------------------------------------------------------- | -------------------------------------------- | -------- |
| [ADR-0001](docs/01-architecture/adr/ADR-0001-architecture-baseline.md) | Vite SPA retained; Next.js migration planned | Accepted |

---

## Major Changes Since Previous Baseline

_This is the initial baseline. No prior baseline exists._

---

## Architectural State Summary

The table below describes the repository starting baseline (`78b2142`), current branch stack development status, and long-term production target:

| Concern            | Baseline (`78b2142`)                     | Current Stack Status (Development/Staging)                                          | Target State                  |
| ------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- |
| Frontend framework | Vite 8 + React 19 SPA                    | Vite 8 + React 19 storefront, auth forms and customer workspace                     | Next.js App Router            |
| Routing            | Custom `window.location.pathname` switch | Custom guarded client routing with subpath `to()` support                           | Next.js file-system routing   |
| Backend            | None                                     | Vite server middleware (development only; payments gated off)                       | Supabase + Next.js API routes |
| Database           | None                                     | Existing order data, private profile, address, brief, ticket and reply migrations   | Supabase PostgreSQL           |
| Authentication     | None                                     | Verified browser sessions, PKCE confirmation and recovery, private workspace routes | Supabase Auth                 |
| File storage       | None                                     | Local prototype metadata staging (up to 5 files / 10MB)                             | Supabase Storage              |
| Payments           | None                                     | Cashfree SDK + server gateway (gated disabled; rotation pending)                    | Cashfree (server-side only)   |
| Deployment         | Not deployed                             | Figma Make static adapter / preview                                                 | Vercel                        |
| CI/CD              | None                                     | GitHub Actions CI (lint, format, typecheck, vitest, build, E2E)                     | GitHub Actions                |
| Monitoring         | None                                     | Structured hourly partitioned file logger (`src/lib/logger.ts`)                     | Sentry + Lighthouse CI        |

---

## Migration Compatibility

Baseline components and data are static TypeScript. Downstream stacked branches introduce clean module boundaries (`src/lib/supabase.ts`, `src/server/cashfree.ts`, `src/custom-project/`) designed for straightforward re-export or migration into Next.js App Router route handlers without architectural regressions. All private backend operations remain isolated from client bundles.

---

## Review Schedule

This document should be updated whenever:

- A new ADR is accepted.
- A major architectural component is added, replaced, or removed.
- The migration to Next.js begins or completes.
