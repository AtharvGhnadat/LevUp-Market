# Product Scope — LevUp Projects

**Document Status:** Approved Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Scope Boundaries (V1 vs. V2)

```
┌────────────────────────────────────────────────────────┐
│                        LEVUP V1                        │
│            Full Web Platform (Responsive)              │
│                                                        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────┐  │
│  │     Public     │  │    Customer    │  │  Admin   │  │
│  │   Marketplace  │  │   Dashboard    │  │  Portal  │  │
│  └────────────────┘  └────────────────┘  └──────────┘  │
│                            │                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Supabase (DB / Auth / Storage) + Cashfree   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                            │
                            ▼ Future Phase
┌────────────────────────────────────────────────────────┐
│                        LEVUP V2                        │
│        Native Android Client (Kotlin / Compose)        │
│          Consumes existing Supabase & REST APIs        │
└────────────────────────────────────────────────────────┘
```

---

## 2. V1 Module Breakdown

### 2.1 Public Marketplace Storefront
- **Home Page** (`/`): Hero CTA, benefit strip, category grid (6 domains), featured projects, custom project banner, how-it-works 4-step workflow, trust section, sticky header, full footer.
- **Catalog** (`/projects`): Filter panel (category, delivery type, project type, difficulty, tech stack, deliverables, customization, price range), sort options, view toggle (grid/list), active filter chips, pagination.
- **Project Detail** (`/projects/:slug`): Multi-image gallery, interactive package selector (Basic, Standard, Premium), add-on configurator, price calculation summary, interactive block diagram, multi-tab specifications (Overview, Components, Learning Outcomes, Tech Stack, Documentation, FAQs), revision entitlement terms.
- **Custom Project Request** (`/custom-project`): Technical requirement intake form, domain selection, deliverable requirements, deadline, hardware requirements, file attachment support.
- **Cart & Checkout** (`/cart`, `/checkout`): Server-validated cart snapshots, order price breakdown, customer details, Cashfree hosted checkout integration.
- **Authentication** (`/login`, `/register`): Supabase Auth email/password and OTP login.
- **Information & Legal Disclosures** (`/about`, `/contact`, `/faq`, `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy`, `/license`, `/academic-use`, `/pricing`).

### 2.2 Customer Dashboard (`/dashboard/*`)
- **Overview & Profile**: Active projects, recent orders, notifications.
- **Orders**: Order history, order details, milestone tracking, tracking physical shipments (courier AWB).
- **Deliverables & Downloads**: Secure signed URLs for authorized file downloads (source code, schematics, reports).
- **Revisions & Change Requests**: Formal submission for included package revisions vs. paid scope alterations.
- **Custom Requests & Quotations**: Review issued quotations, accept quotes, view payment schedules (e.g. 50% advance / 50% completion).
- **Support**: Project inquiry, delivery issues, ticket management.

### 2.3 Admin Portal (`/admin/*`)
- **Authentication**: Verified staff login + allowlist + MFA.
- **Catalog Management**: Add/edit/archive projects, configure tiers and pricing in paise.
- **Quotation Management**: Ingest custom requests, formulate milestone breakdowns, issue binding quotes.
- **Order Production & Tracking**: Assign project status (Ordered, In Progress, QA Testing, Packaged, Shipped, Delivered).
- **Deliverable QA & Staging**: Upload validated project files to private Supabase storage buckets before customer entitlement.
- **Financial Reconciliation**: Cashfree payment logs, refund processing, tax/invoice generation, out-of-sync payment resolution.
- **Audit Logs**: Immutable log view of all administrative actions.
