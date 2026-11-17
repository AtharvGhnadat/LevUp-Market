# Scalability Architecture — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Workload Characteristics

The LevUp Projects platform exhibits distinct traffic patterns:
- **Read-heavy Catalog Browsing**: High read-to-write ratio (~95:5) across project discovery, search, and specification pages.
- **Seasonal Project Surges**: Predictable traffic spikes corresponding to academic project submission deadlines (November–December and March–May across Indian universities).
- **Asynchronous File Delivery**: Large binary deliverable downloads (code archives, PCB Gerber packages, CAD models) which should never traverse application compute containers directly.
- **Critical Low-Latency Checkouts**: High reliability required for payment session creation and webhook absorption.

---

## 2. Architectural Scaling Strategies

### 2.1 Edge Caching & Static Asset Delivery
- Next.js static site generation (SSG) / Incremental Static Regeneration (ISR) for public catalog project pages (`/projects/:slug`).
- Project detail data and media assets served via Vercel Edge Network CDN with `stale-while-revalidate` caching headers.
- Direct-to-client image optimization with Unsplash CDN parameters (`w=...`, `q=...`, `auto=format`).

### 2.2 Serverless Compute Scaling
- Vercel Serverless Functions scale automatically with inbound concurrency.
- API route handlers are stateless, enabling parallel horizontal scaling during traffic spikes.
- Connection pooling for PostgreSQL handled via Supabase Transaction Pooler (PgBouncer) or Supabase REST / Supavisor, preventing exhaustion of database connections.

### 2.3 Offloaded Deliverable Downloads
- Project deliverable files (ZIPs, PDFs, Gerber archives) are hosted in Supabase Storage (backed by S3).
- The Next.js API server never proxies file bytes. It only validates user entitlement and generates a signed URL.
- The student's browser downloads file archives directly from the object storage CDN edge.

### 2.4 Database Performance & Partitioning
- Read-heavy queries (catalog search, category lists) indexed via composite B-tree and GIN indexes (PostgreSQL full-text search).
- Structured application logs are partitioned into local hourly directories in dev, and archived to object storage in prod rather than congesting the operational relational database.
