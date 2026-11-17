# Code Coverage Policy — LevUp Projects

**Document Status:** Baseline  
**Tooling:** Vitest v8 Coverage / c8  
**Last Updated:** 2026-11-17  

---

## 1. Minimum Coverage Thresholds

| Area | Statement Coverage | Branch Coverage | Function Coverage |
|---|---|---|---|
| **Core Utilities** (`src/lib/`) | **90%** | **85%** | **90%** |
| **Business State Logic** (`src/catalog/`, `src/state/`) | **85%** | **80%** | **85%** |
| **Financial / Payment Code** (API routes & helpers) | **100%** | **100%** | **100%** |
| **UI Components** (`src/components/`) | **60%** | **50%** | **60%** |
| **Static Data Files** (`src/data/`) | Exempt | Exempt | Exempt |

---

## 2. CI Enforcement

Pull requests that cause overall statement coverage on modified files to fall below these thresholds will be automatically blocked by GitHub Actions quality gates.
