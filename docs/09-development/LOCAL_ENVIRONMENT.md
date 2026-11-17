# Local Development Environment Guide — LevUp Projects

**Document Status:** Baseline  
**Host Environment:** Windows 11 / PowerShell / Node.js 22 / pnpm  
**Last Updated:** 2026-11-17

---

## 1. System Requirements

- **OS**: Windows 11 (tested), macOS, or Linux.
- **Node.js**: v22.x LTS.
- **Package Manager**: pnpm v10.34.3+ (`corepack enable pnpm` or `npm i -g pnpm`).
- **Editor**: Google Antigravity IDE or VS Code with Tailwind CSS v4 and TypeScript extensions.

---

## 2. Port Allocations

| Service                     | Port                             | Protocol |
| --------------------------- | -------------------------------- | -------- |
| Vite Development Server     | `8443` (default)                 | HTTP     |
| Next.js App Router (Target) | `3000`                           | HTTP     |
| Supabase Local API / Studio | `54321` (API) / `54323` (Studio) | HTTP     |
| PostgreSQL Database         | `54322`                          | TCP      |
