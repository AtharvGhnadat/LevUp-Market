# Backend Architecture — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Overview

The backend architecture is designed around **Supabase (PostgreSQL, Auth, Storage, Realtime)** combined with **Next.js Serverless Route Handlers** deployed on **Vercel**.

There is **zero backend code** in the current Vite SPA repository. This document defines the authoritative architecture for the upcoming implementation stages.

---

## 2. Serverless API Structure

The API layer is organized into modular route handlers:

```
src/app/api/
├── auth/
│   ├── callback/route.ts        # Supabase OAuth and magic link callback
│   └── session/route.ts         # Server-side session verification
├── catalog/
│   ├── projects/route.ts        # Dynamic catalog queries with pagination & filtering
│   └── projects/[id]/route.ts   # Individual project details and packages
├── orders/
│   ├── create/route.ts          # Server-validated checkout order creation
│   └── [id]/route.ts            # Fetch order status & milestones
├── payments/
│   ├── cashfree/
│   │   ├── create-order/route.ts # Server-side Cashfree payment session creation
│   │   └── webhook/route.ts      # Raw body signature verification & payment ingestion
├── custom-projects/
│   ├── request/route.ts         # Submit custom build inquiry with files
│   └── quotations/[id]/route.ts # Retrieve & accept formal quotations
├── deliverables/
│   └── download/route.ts        # Verify entitlement & issue signed S3/Supabase URL
├── revisions/
│   └── submit/route.ts          # Submit revision ticket under package entitlement
└── admin/                       # Protected by staff allowlist + MFA verification
    ├── catalog/route.ts
    ├── orders/route.ts
    ├── quotations/route.ts
    ├── audit-logs/route.ts
    └── reconciliations/route.ts
```

---

## 3. Data Flow & Security Boundaries

```
[ Browser / Client ]
         │
         │ HTTPS / JSON (Bearer JWT in secure cookie)
         ▼
[ Next.js Middleware ]
         │ (Validates session token; checks /admin routes against admin allowlist)
         ▼
[ API Route Handler ]
         │ (Input validation using Zod schemas)
         ▼
┌──────────────────────────────────────────────┐
│ Business Service Layer                       │
│ - OrderService (Price calculation in paise)  │
│ - PaymentService (Cashfree order creation)   │
│ - DeliveryService (Signed URL issuance)      │
│ - AuditService (Append-only logging)         │
└──────────────────────────────────────────────┘
         │
         ├──────────────────────────┐
         ▼                          ▼
[ Supabase PostgreSQL ]    [ Cashfree Gateway ]
(Row-Level Security)       (Server-to-Server API)
```

---

## 4. Key Architectural Patterns

1. **Integer Money Representation**: All monetary figures are stored, calculated, and transmitted as **integer paise** (`1 INR = 100 paise`). Floating-point arithmetic is strictly forbidden for financial calculations.
2. **Server-Side Price Snapshots**: The client never dictates prices. When an order is placed, the server reads the current package and add-on prices from PostgreSQL, calculates the total, records immutable line items in `order_items`, and sends that exact snapshot to Cashfree.
3. **Idempotent Webhook Handling**: Cashfree webhooks must be resilient to retries. Every incoming event ID is checked in `payment_events`; if already processed, the handler acknowledges with HTTP 200 immediately without re-triggering fulfillment.
4. **Append-Only Financial & Audit Records**: Critical business transitions (`payment_events`, `audit_events`, `order_status_history`) are recorded as immutable append-only logs in PostgreSQL.
