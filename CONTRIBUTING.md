# Contributing to LevUp Projects

Thank you for contributing. This document explains the branching strategy, commit conventions, and pull request process.

---

## Branching Strategy

| Branch prefix | Purpose | Example |
|---|---|---|
| `main` | Stable, deployable baseline | — |
| `feat/<feature>` | New user-facing features | `feat/auth-login-page` |
| `fix/<issue>` | Bug fixes | `fix/catalog-pagination-offset` |
| `docs/<topic>` | Documentation only | `docs/api-conventions` |
| `refactor/<module>` | Internal refactoring, no behavior change | `refactor/catalog-state` |
| `test/<module>` | Test additions or fixes | `test/homepage-sections` |
| `chore/<task>` | Tooling, build, CI, dependencies | `chore/eslint-setup` |
| `hotfix/<issue>` | Critical production fixes branched from `main` | `hotfix/checkout-redirect` |

**Rules:**
- Never commit directly to `main`.
- Branch from `main` (or the current integration branch) for each task.
- One logical change per branch.
- Delete branches after merging.

---

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer: Closes #<issue>]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Restructuring without behavior change |
| `test` | Adding or fixing tests |
| `chore` | Build process, tooling, CI, dependencies |
| `perf` | Performance improvement |
| `ci` | CI configuration changes |
| `revert` | Revert a previous commit |

### Examples

```
feat(catalog): add price range filter with URL param sync

fix(cart): prevent duplicate slug entries on re-add

docs(architecture): add ADR-0002 Next.js migration decision

chore(ci): add GitHub Actions lint and typecheck workflow
```

---

## Pull Request Process

1. Push your branch to `origin`.
2. Open a pull request against `main` (or the designated integration branch).
3. Fill in the pull request template.
4. Ensure all CI checks pass (lint, typecheck, build, tests).
5. Request a review from a designated reviewer.
6. Address all review comments before merging.
7. Merge using **Squash and merge** for feature branches; **Merge commit** for release branches.
8. Delete the branch after merging.

---

## Development Setup

See [docs/09-development/DEVELOPER_SETUP.md](docs/09-development/DEVELOPER_SETUP.md).

---

## Code Standards

See [docs/09-development/CODING_STANDARDS.md](docs/09-development/CODING_STANDARDS.md).

---

## Design Preservation

**The existing approved Figma design must be preserved.** If a code change affects:
- Color tokens
- Typography
- Component layout or behavior
- Brand assets (logo, favicon)

…then the change must be:
1. Discussed and approved before implementation.
2. Documented in `docs/02-design-system/DESIGN_CHANGELOG.md`.
3. Validated with screenshots at matching viewport sizes.
