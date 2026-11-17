# Technology Stack — LevUp Projects

**Status:** Baseline documented  
**Last updated:** 2026-11-17

---

## Current Stack (Actual, as of 2026-11-17)

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Runtime | Node.js | 22 | Specified in `.mise.toml` |
| Package manager | pnpm | 10.34.3 | Lockfile: `pnpm-lock.yaml` |
| Framework | React | 19.0.0 | SPA, no SSR |
| Build tool | Vite | 8.0.5 | With Figma Make plugins |
| Language | TypeScript | 5.7.x | Strict mode; `noEmit: true` |
| Styling | Tailwind CSS v4 | 4.0.x | Via `@tailwindcss/vite` plugin |
| Icons | lucide-react | 1.71.0 | — |
| Fonts | @fontsource-variable/manrope | 5.3.x | Self-hosted |
| Fonts | @fontsource-variable/inter | 5.3.x | Self-hosted |
| Formatter | oxfmt | 0.76.0 | Replaces Prettier in Figma Make |
| Router | None — custom switch | — | `window.location.pathname` |
| State | React Context | Built-in | Cart only |
| Backend | **None** | — | ⚠️ Not implemented |
| Database | **None** | — | ⚠️ Not implemented |
| Auth | **None** | — | ⚠️ Not implemented |
| Payments | **None** | — | ⚠️ Not implemented |
| Testing | **None** | — | ⚠️ Not implemented |
| CI/CD | **None** | — | ⚠️ Not implemented |
| Deployment | **Not deployed** | — | ⚠️ Not configured |

---

## Target Stack (Planned)

| Layer | Technology | Version target | Notes |
|---|---|---|---|
| Framework | Next.js App Router | 15.x | Replaces Vite SPA |
| React | React | 19.x | Retained |
| Language | TypeScript | 5.7.x | Retained with strict mode |
| Styling | Tailwind CSS v4 | 4.x | Retained |
| Component validation | Zod | 3.x | Schema validation for forms and API |
| Forms | React Hook Form | 7.x | Controlled forms with Zod resolvers |
| ORM | Drizzle ORM | TBD | Decision pending ADR-0003 |
| Database | Supabase PostgreSQL | Managed | Via Supabase project |
| Auth | Supabase Auth | Managed | JWT + RLS |
| Storage | Supabase Storage | Managed | Signed URL delivery |
| Realtime | Supabase Realtime | Managed | Order status updates only |
| Payments | Cashfree | Current | Server-side API only |
| Deployment | Vercel | Managed | Next.js optimised |
| CI | GitHub Actions | — | Lint, typecheck, test, build |
| Error tracking | Sentry | TBD | Added at deployment phase |
| Performance | Lighthouse CI | TBD | Added at deployment phase |
| Testing: unit | Vitest + RTL | 2.x / 16.x | Added in Stage C |
| Testing: E2E | Playwright | 1.x | Added in Stage C |
| Linting | ESLint + TS ESLint | 9.x | Added in Stage C |
| Formatting | Prettier | 3.x | Replaces oxfmt post-migration |
| Git hooks | Husky + lint-staged | 9.x / 15.x | Added in Stage C |
| Commit lint | commitlint | 19.x | Added in Stage C |
| Secret management | Vercel env vars | — | No third-party vault initially |

---

## Dependency Management Policy

- Use `pnpm` exclusively. Do not mix package managers.
- Keep `pnpm-lock.yaml` committed and consistent.
- Dependabot will be configured to open dependency update PRs automatically.
- Security advisories trigger immediate patch review.
- Do not install packages without documenting the reason in the relevant PR.

---

## Runtime Environment Variables

See [`.env.example`](../../.env.example) for the full list of required environment variables.
