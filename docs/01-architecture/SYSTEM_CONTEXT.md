# System Context — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. System Context Diagram (C4 Level 1)

```mermaid
graph TD
    subgraph External Users
        Student["Engineering Student / Buyer<br>(Web Browser)"]
        Admin["LevUp Staff / Engineer<br>(Web Browser)"]
    end

    subgraph LevUp System Boundary
        LevUpApp["LevUp Projects Platform<br>(Vite SPA baseline -> Next.js target)"]
    end

    subgraph External Systems & Services
        SupabaseAuth["Supabase Auth<br>(Identity & JWT tokens)"]
        SupabaseDB["Supabase PostgreSQL<br>(Relational persistence & RLS)"]
        SupabaseStorage["Supabase Storage<br>(Private deliverable storage)"]
        Cashfree["Cashfree Payment Gateway<br>(Hosted checkout, UPI/Cards, Webhooks)"]
        Courier["Logistics / Courier Partner<br>(Physical hardware kit shipping)"]
        VercelEdge["Vercel Edge & Serverless<br>(Hosting & Edge CDN)"]
    end

    Student -->|Browses catalog, configures kits, requests custom projects, buys, downloads files| LevUpApp
    Admin -->|Manages catalog, prepares quotes, tracks production, verifies QA, resolves tickets| LevUpApp

    LevUpApp -->|Authenticates sessions| SupabaseAuth
    LevUpApp -->|Stores orders, transactions, audit logs| SupabaseDB
    LevUpApp -->|Issues signed URLs for downloads| SupabaseStorage
    LevUpApp -->|Creates payment orders, receives signed webhooks| Cashfree
    LevUpApp -->|Tracks AWB shipments for physical kits| Courier
    VercelEdge -->|Serves web application & runs serverless functions| LevUpApp
```

---

## 2. External Actors and Interactions

| Actor / System | Interaction Purpose                                                                                | Protocol / Format                   |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Student**    | Catalog browsing, custom inquiry submission, order placement, download of deliverables             | HTTPS / HTML, JSON                  |
| **Admin**      | Catalog maintenance, quotation authoring, order production progression, QA approval, audit queries | HTTPS / RBAC + MFA                  |
| **Cashfree**   | Server-to-server payment order generation, asynchronous payment notification via signed webhooks   | HTTPS / REST, HMAC-SHA256 signature |
| **Supabase**   | Authoritative data store, row-level security, auth token verification, private file storage        | HTTPS / PostgreSQL, REST, S3 API    |
| **Vercel**     | Application deployment, edge caching, serverless API execution                                     | Git-driven CI/CD deployment         |
