# Deployment Architecture — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Deployment Topology

```mermaid
graph TD
    subgraph Version Control
        GitHub["GitHub Repository<br>AtharvGhnadat/LevUp-Market"]
        GHA["GitHub Actions CI<br>(lint, typecheck, test, build)"]
    end

    subgraph Hosting & Edge
        VercelCI["Vercel Build & Deploy"]
        VercelEdge["Vercel Edge CDN<br>(Static HTML, CSS, JS, Images)"]
        VercelServerless["Vercel Serverless Functions<br>(Next.js API Routes)"]
    end

    subgraph Managed Cloud Services
        SupabasePostgres["Supabase PostgreSQL<br>(Database & Auth)"]
        SupabaseStorage["Supabase Storage<br>(Private Deliverables Bucket)"]
        CashfreeProd["Cashfree Production Gateway"]
    end

    GitHub -->|Push to main / PR| GHA
    GHA -->|On passing checks| VercelCI
    VercelCI -->|Deploys artifacts| VercelEdge
    VercelCI -->|Deploys functions| VercelServerless
    VercelServerless -->|Queries / Mutations| SupabasePostgres
    VercelServerless -->|Generates Signed URLs| SupabaseStorage
    VercelServerless -->|Payment Orders & Webhooks| CashfreeProd
```

---

## 2. Environments

| Environment           | Branch                           | URL Pattern                                                        | Database Instance            | Cashfree Mode                        |
| --------------------- | -------------------------------- | ------------------------------------------------------------------ | ---------------------------- | ------------------------------------ |
| **Local Development** | feature branches                 | `http://localhost:8443` (Vite) / `http://localhost:3000` (Next.js) | Supabase Local / Dev project | Sandbox                              |
| **Preview / Staging** | `chore/*`, `feat/*`, `fix/*` PRs | `https://levup-market-git-*.vercel.app`                            | Supabase Staging project     | Sandbox                              |
| **Production**        | `main` (tagged releases only)    | `https://levupprojects.com` / `https://levup-market.vercel.app`    | Supabase Production project  | Production (after merchant approval) |

---

## 3. Deployment Pipeline & Verification Steps

1. **Pull Request Gate**:
   - Push to branch triggers GitHub Actions `.github/workflows/ci.yml`.
   - Steps: `pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm build`.
   - Vercel automatically deploys an isolated Preview Deployment with ephemeral preview URL.
2. **Review & Visual Parity**:
   - Verify changes against Figma Make reference on mobile, tablet, and desktop viewports.
3. **Merge Gate**:
   - Merge to `main` permitted only with passing CI and pull request approval.
4. **Post-Deployment Smoke Test**:
   - Automatic healthcheck verifying `GET /` responds with 200 OK.
   - Catalog loads and renders projects within SLA (< 1.5s TTFB).
   - Record deployment entry in `docs/10-releases/DEPLOYMENT_HISTORY.md`.
