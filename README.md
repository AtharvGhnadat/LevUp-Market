# LevUp Projects

> **Engineering Projects & Development** — Buy documented software, AI, IoT, embedded, robotics and simulation project kits, or request a custom build with a fixed quote, payment plan and tracked delivery.

---

## Project Status

**Current state:** Figma Make frontend prototype — Vite + React SPA with static data.  
**Active branch:** `chore/production-engineering-foundation`  
**Production readiness:** ⚠️ Not production-ready. No backend, no authentication, no payments.

---

## Quick Start (Local Development)

### Prerequisites

- **Node.js** 22+ (see `.mise.toml`)
- **pnpm** 10.34.3+ (`npm install -g pnpm` or use [mise](https://mise.jdx.dev/))

### Setup

```powershell
# Clone
git clone https://github.com/AtharvGhnadat/LevUp-Market.git
cd LevUp-Market

# Install dependencies
pnpm install

# Start development server (port 8443)
pnpm dev
```

Then open [http://localhost:8443](http://localhost:8443).

### Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite development server on port 8443 |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm format` | Format code with oxfmt |

> Additional scripts (lint, typecheck, test) will be added in `chore/production-engineering-foundation`.

---

## Architecture Overview

```
src/
├── App.tsx              # Root; custom path-switch router
├── index.css            # Design tokens + Tailwind CSS v4
├── catalog/             # Catalog filter/sort state
├── components/          # Reusable UI components
│   ├── brand/           # Logo
│   ├── catalog/         # Catalog page components
│   ├── layout/          # Header, Footer, Menu, Search
│   ├── project-detail/  # Project detail components
│   └── ui/              # Primitives (Button, Container, Eyebrow)
├── data/                # Static demonstration data (temporary)
├── lib/                 # Utilities (cn, format, image, routes)
├── pages/               # Page-level components
├── sections/home/       # Homepage sections
└── state/cart.tsx       # Client-side cart (localStorage only)
```

**Target architecture:** Next.js App Router + Supabase + Cashfree + Vercel  
See [docs/01-architecture/ARCHITECTURE.md](docs/01-architecture/ARCHITECTURE.md) for the full plan.

---

## Brand

| Token | Value |
|---|---|
| Primary background | `#F7F8F5` (paper) |
| Primary text / dark | `#172D38` (ink) |
| Brand accent | `#D97736` (copper) |
| Display font | Manrope Variable |
| Body font | Inter Variable |

See [docs/02-design-system/COLOR_TOKENS.md](docs/02-design-system/COLOR_TOKENS.md) for the full token set.

---

## Documentation

| Directory | Contents |
|---|---|
| [docs/00-product](docs/00-product/) | Product requirements, scope, feature inventory |
| [docs/01-architecture](docs/01-architecture/) | Architecture decisions, tech stack, system context |
| [docs/02-design-system](docs/02-design-system/) | Brand, tokens, typography, components |
| [docs/03-database](docs/03-database/) | Schema, data dictionary, RLS policies |
| [docs/04-api](docs/04-api/) | OpenAPI spec, conventions, error handling |
| [docs/05-security](docs/05-security/) | Threat model, auth, secret management |
| [docs/06-payments](docs/06-payments/) | Cashfree integration, payment lifecycle |
| [docs/07-testing](docs/07-testing/) | Test strategy, coverage policy |
| [docs/08-operations](docs/08-operations/) | Logging, observability, deployment runbook |
| [docs/09-development](docs/09-development/) | Developer setup, coding standards, branching |
| [docs/10-releases](docs/10-releases/) | Release checklist, rollback, deployment history |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branching strategy, commit conventions, and pull request process.

---

## Security

See [SECURITY.md](SECURITY.md) to report security vulnerabilities.

---

## License

Proprietary. All rights reserved by LevUp Projects / Atharv Ghanadat. No open-source license is granted.
