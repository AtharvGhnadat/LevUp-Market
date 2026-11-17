# LevUp Projects — Architecture Overview

**Status:** Baseline documented  
**Revision:** 1.0.0  
**Last updated:** 2026-11-17  
**ADR reference:** [ADR-0001](adr/ADR-0001-architecture-baseline.md)

---

## Current State (Vite SPA — Active)

```
Browser
  └── Vite 8 + React 19 SPA
        ├── Custom path-switch router (window.location.pathname)
        ├── Tailwind CSS v4 design system
        ├── Static TypeScript data files (catalog, categories, project details)
        └── localStorage cart (no backend)
```

No server. No database. No authentication. No payments.

---

## Target Architecture (Next.js — Planned)

```
                    ┌─────────────────────────────────────┐
                    │           Vercel Edge Network        │
                    └────────────────┬────────────────────┘
                                     │
                    ┌────────────────▼────────────────────┐
                    │      Next.js App Router              │
                    │  ┌──────────────┐ ┌──────────────┐  │
                    │  │  React RSC   │ │  API Routes  │  │
                    │  │  (pages)     │ │  (server)    │  │
                    │  └──────┬───────┘ └──────┬───────┘  │
                    └─────────┼────────────────┼──────────┘
                              │                │
           ┌──────────────────┘                │
           │                                   │
  ┌────────▼──────────┐             ┌──────────▼──────────┐
  │   Supabase Auth   │             │  Cashfree Payments  │
  │   Supabase DB     │             │  (server-side only) │
  │   Supabase Storage│             └─────────────────────┘
  └───────────────────┘
```

### Component Responsibilities

| Component               | Responsibility                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| **Next.js App Router**  | Page rendering (RSC + client components), middleware, API routes               |
| **Supabase Auth**       | JWT-based authentication, session management, OAuth providers                  |
| **Supabase PostgreSQL** | Persistent data: orders, products, users, payments, audit log                  |
| **Supabase Storage**    | Secure file upload and delivery of project deliverables                        |
| **Supabase Realtime**   | Order status updates, support ticket notifications (where justified)           |
| **Cashfree**            | Payment order creation, hosted checkout, webhook processing — server-side only |
| **Vercel**              | Hosting, CDN, edge functions, preview deployments                              |
| **GitHub Actions**      | CI: lint, typecheck, test, build, security scan                                |

---

## Security Boundaries

| Boundary                  | Rule                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| Cashfree Client Secret    | Server-side environment variable only. Never in client bundle.                            |
| Supabase Service Role Key | Server-side only. Never exposed to browser.                                               |
| Webhook endpoints         | Verify signature against raw body before processing.                                      |
| Admin portal              | Server-side identity verification + MFA required. Hidden route is not security.           |
| File delivery             | Signed URLs with expiry. Direct public access is not permitted.                           |
| Row-level security        | Enabled on all Supabase tables. No table is publicly readable without an explicit policy. |

---

## Data Flow: Purchase

```
Customer selects package → Add to Cart (client-side preview)
  → Checkout (Next.js page)
    → POST /api/orders/create (server: validate, create Supabase order record)
      → POST to Cashfree API (server: create payment order)
        → Redirect to Cashfree hosted checkout
          → Cashfree webhook → POST /api/webhooks/cashfree (server: verify signature)
            → Update order status in Supabase
              → Trigger delivery workflow
```

> [!CAUTION]
> A successful browser redirect from Cashfree does NOT confirm payment. Only a verified webhook with a valid signature confirms a successful payment.

---

## Migration Plan (Vite → Next.js)

See ADR-0001 for the rationale. The migration will proceed as:

1. Scaffold a Next.js 15+ App Router project in a `feat/nextjs-migration` branch.
2. Configure Tailwind CSS v4, design tokens, and fonts to match the existing system exactly.
3. Migrate the `src/index.css` token system without alteration.
4. Port `src/components/` one directory at a time, verifying visual parity at each step.
5. Migrate pages in order: Home → Projects catalog → Project detail.
6. Add `src/lib/routes.ts` equivalent using Next.js `Link` and `usePathname`.
7. Replace the client-side cart with a server-validated cart.
8. Merge only after all 3 implemented pages pass visual regression review.

---

## Current Technology Stack

See [TECH_STACK.md](TECH_STACK.md) for the full matrix.
