# Developer Setup — LevUp Projects

**Last updated:** 2026-11-17

---

## Prerequisites

| Tool | Version | Installation |
|---|---|---|
| Git | 2.40+ | [git-scm.com](https://git-scm.com/) |
| Node.js | 22+ | Via [mise](https://mise.jdx.dev/) or [nvm](https://github.com/nvm-sh/nvm) |
| pnpm | 10.34.3+ | `npm install -g pnpm` or via mise |

> [!TIP]
> The project includes `.mise.toml` which pins Node.js 22 and pnpm 10.34.3. Install [mise](https://mise.jdx.dev/) and run `mise install` in the project root to get exact versions automatically.

---

## Clone and Install

```powershell
# Clone
git clone https://github.com/AtharvGhnadat/LevUp-Market.git
cd LevUp-Market

# Install exact dependency versions from lockfile
pnpm install
```

> [!WARNING]
> Do not use `npm install` or `yarn install`. The project uses a pnpm lockfile. Using a different package manager will produce an inconsistent `node_modules`.

---

## Environment Variables

```powershell
# Copy the template
Copy-Item .env.example .env.local

# Edit .env.local with your actual values
# Never commit .env.local
```

For the current Vite-only phase, no environment variables are required to run the dev server. The `.env.example` documents the variables that will be needed once Supabase and Cashfree are integrated.

---

## Development Server

```powershell
pnpm dev
```

Opens on [http://localhost:8443](http://localhost:8443).

Hot module replacement is active. Changes to `src/` files are reflected immediately.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server (port 8443) |
| `pnpm build` | Build for production → `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm format` | Format code with oxfmt |

> Additional scripts (lint, typecheck, test, e2e) will be added during Stage C.

---

## TypeScript Path Aliases

The `@` alias maps to `src/`:

```typescript
import { cn } from '@/lib/cn'           // → src/lib/cn.ts
import { Logo } from '@/components/brand/Logo'  // → src/components/brand/Logo.tsx
```

---

## Tailwind CSS v4

This project uses Tailwind CSS v4 via `@tailwindcss/vite`. Key differences from v3:

- No `tailwind.config.js` needed.
- Theme customisation goes in `src/index.css` inside `@theme {}`.
- Use `@layer base {}` for element defaults (body, headings, etc.).
- Design tokens defined in `@theme {}` are automatically available as Tailwind classes.

---

## Git Workflow

See [BRANCHING.md](BRANCHING.md) for the full branching strategy.

Quick summary:
1. Never commit directly to `main`.
2. Create a branch: `git checkout -b feat/your-feature`
3. Use Conventional Commits: `feat(scope): description`
4. Push and open a pull request.

---

## Troubleshooting

### "Module not found" errors
Ensure `pnpm install` completed without errors. Check that the `@` alias is working in `tsconfig.json`.

### Port 8443 already in use
Set a different port: `PORT=3000 pnpm dev`

### TypeScript errors in IDE but build passes
Ensure your editor is using the workspace TypeScript version (`typescript` from `node_modules`), not a global TypeScript installation.
