# Branching Strategy — LevUp Projects

**Last updated:** 2026-11-17

---

## Branch Model

```
main (protected)
  ├── feat/<feature>           New user-facing features
  ├── fix/<issue>              Bug fixes
  ├── docs/<topic>             Documentation only
  ├── refactor/<module>        Internal refactoring
  ├── test/<module>            Test additions or fixes
  ├── chore/<task>             Tooling, CI, dependencies
  └── hotfix/<issue>           Critical production fixes (branch from main)
```

---

## Rules

| Rule | Detail |
|---|---|
| `main` is protected | No direct pushes. All changes via PR. |
| One concern per branch | Do not mix feature work with refactoring. |
| Short-lived branches | Merge within days, not weeks. |
| No force pushes | Never `git push --force` to `main` or shared branches. |
| Delete after merge | Clean up merged branches from origin. |
| No commit to `main` | Even admins should merge via PR. |

---

## Naming Conventions

| Pattern | Example |
|---|---|
| `feat/<short-noun>` | `feat/auth-login-page` |
| `fix/<symptom>` | `fix/catalog-pagination-offset` |
| `docs/<topic>` | `docs/cashfree-integration` |
| `refactor/<module>` | `refactor/catalog-state` |
| `test/<scope>` | `test/homepage-unit` |
| `chore/<task>` | `chore/eslint-setup` |
| `hotfix/<issue>` | `hotfix/checkout-redirect-loop` |

Use lowercase, hyphens only, no slashes beyond the prefix.

---

## Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <imperative summary>

[optional body — explain WHY, not WHAT]

[optional footer: Closes #issue, Breaking-change: description]
```

### Types

`feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `perf` · `ci` · `revert`

---

## Pull Request Requirements

Before a PR can merge:

- [ ] All CI checks pass (lint, typecheck, build, tests)
- [ ] PR description filled in with: what changed, why, how to test
- [ ] Related documentation updated
- [ ] CHANGELOG.md `[Unreleased]` section updated (for user-facing changes)
- [ ] New design changes documented in DESIGN_CHANGELOG.md
- [ ] ADR created for significant architecture decisions
- [ ] At least one reviewer approved (when team grows)

---

## Release Tagging

Tags are applied to `main` only, after CI passes and manual verification:

```bash
git tag -a v0.1.0 -m "chore: engineering foundation complete"
git push origin v0.1.0
```

See [VERSIONING.md](../../VERSIONING.md) for version numbering rules.
