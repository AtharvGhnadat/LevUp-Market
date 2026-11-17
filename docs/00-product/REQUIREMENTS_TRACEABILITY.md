# Requirements Traceability Matrix — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Matrix Overview

This matrix maps core functional requirements from the master engineering governance specifications to architectural components, data models, and verification tests.

| Requirement ID | Requirement Summary                                    | Architectural Module               | Database / Storage Entity                      | Verification Strategy                          | Current Status             |
| -------------- | ------------------------------------------------------ | ---------------------------------- | ---------------------------------------------- | ---------------------------------------------- | -------------------------- |
| `REQ-SEC-01`   | Student-to-student data isolation                      | Next.js API + Supabase RLS         | `orders`, `revisions`, `project_files`         | RLS automated test cases                       | ⚠️ Planned (docs ready)    |
| `REQ-SEC-02`   | Admin server-side verification + allowlist + MFA       | Middleware + Auth Handler          | `admin_users`, `auth.users`                    | Unit test auth middleware with forged tokens   | ⚠️ Planned                 |
| `REQ-SEC-03`   | Secret management: zero frontend credentials           | `.env.local` + Vercel Secrets      | N/A (Server environment)                       | AST grep / CI secret scanning                  | ✅ Enforced (.env.example) |
| `REQ-PAY-01`   | Immutable checkout pricing snapshot                    | Next.js Checkout API               | `orders`, `order_items`                        | Unit test price tampering tampering attack     | ⚠️ Planned                 |
| `REQ-PAY-02`   | Cashfree webhook signature verification on raw body    | API route `/api/webhooks/cashfree` | `payment_events` (immutable)                   | Replay test with altered payload signature     | ⚠️ Planned                 |
| `REQ-PAY-03`   | Idempotent webhook processing                          | Cashfree event handler             | `payment_events.event_id` (UNIQUE)             | Duplicate webhook injection test               | ⚠️ Planned                 |
| `REQ-PAY-04`   | Milestone-based installment payment schedules          | Order & payment models             | `payment_schedules`, `installments`            | Payment schedule state machine test            | ⚠️ Planned                 |
| `REQ-DEL-01`   | Private deliverable storage with signed URLs           | Supabase Storage + Entitlement API | `project_files`, storage bucket `deliverables` | Unauthorized file fetch test (must return 403) | ⚠️ Planned                 |
| `REQ-DEL-02`   | Hardware fulfillment & shipping tracking               | Orders API                         | `shipments`, `shipment_events`                 | Courier AWB update workflow test               | ⚠️ Planned                 |
| `REQ-REV-01`   | Free package revision tracking vs paid change request  | Revision state engine              | `revisions`, `package_entitlements`            | Boundary test exceeding free revision count    | ⚠️ Planned                 |
| `REQ-LOG-01`   | Structured JSONL logging with UTC hourly partitioning  | `src/lib/logger.ts`                | Local file adapter / Vercel stream             | Logger schema unit tests                       | ⚠️ In Progress (Stage D)   |
| `REQ-DES-01`   | Strict brand preservation (60/30/10, Logo, Typography) | `src/index.css`, `Logo.tsx`        | Design tokens                                  | Playwright visual regression tests             | ✅ Implemented & Locked    |
| `REQ-CAT-01`   | Multi-dimensional project catalog filtering & sorting  | `src/catalog/catalog-state.ts`     | Static data → `projects` table                 | Catalog filter & sort unit tests               | ✅ Implemented (Client)    |
| `REQ-CAT-02`   | Package & add-on tier price calculation                | `PurchaseConfigurator.tsx`         | `packages`, `add_ons`                          | Price aggregation unit test                    | ✅ Implemented (Visual/UI) |
