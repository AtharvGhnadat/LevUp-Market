# Coding Standards & Engineering Practices — LevUp Projects

**Document Status:** Baseline  
**Language:** TypeScript (Strict)  
**Last Updated:** 2026-11-17  

---

## 1. TypeScript Rules

- **Strict Type Checking**: `"strict": true` enforced in `tsconfig.json`.
- **No Implicit `any`**: Explicit types required for function arguments and return types on exported APIs.
- **Path Aliases**: Always use `@/` for imports within `src/` (e.g. `import { cn } from "@/lib/cn"`).
- **Zod for External Input**: All API request bodies and query parameters must be validated with Zod schemas.

---

## 2. React & Component Conventions

- **Function Components**: Use standard functional components with hooks.
- **Accessibility by Default**: Ensure visible focus outlines, ARIA roles for custom controls, and descriptive `aria-label` or `alt` attributes.
- **Client vs Server Components**: In target Next.js architecture, keep components Server-side by default; add `"use client"` only when event listeners, browser APIs, or React state hooks are required.

---

## 3. Formatting & Linting

- Formatter: `oxfmt` (or Prettier).
- No unused variables, unhandled promises, or `console.log` left in production code. Use structured logger (`src/lib/logger.ts`).
