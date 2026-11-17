# Brand Guidelines — LevUp Projects

**Document Status:** Baseline  
**Approved Brand Name:** LevUp Projects  
**Brand Subtitle:** Engineering Projects & Development  
**Last Updated:** 2026-11-17  

---

## 1. Master Brand Identity

LevUp Projects is an engineering project marketplace and custom development laboratory. The visual identity conveys **precision engineering, industrial durability, and academic excellence**.

### 1.1 Brand Composition Rule (60 / 30 / 10)
- **60% Primary Surface**: Paper (`#F7F8F5`) — warm, calm, non-glare engineering paper background.
- **30% Structural Ink**: Deep Slate Ink (`#172D38`) — authoritative dark tone for typography, technical diagrams, and high-contrast structural sections.
- **10% Brand Accent**: Copper (`#D97736`) / Action Copper (`#B95B21`) — technical heat, copper circuit wiring, high-visibility interactive calls to action.

---

## 2. Master Logo Specification

The LevUp Projects logo is defined in `src/components/brand/Logo.tsx`.

### 2.1 Logo Geometry (Isometric Engineering Block)
The logo mark represents an **isometric technical cube** comprising 6 precise SVG paths:
- Top Facet: `#E8955A` (illuminated copper surface)
- Left Facet: `#D97736` (mid-tone copper body)
- Right Facet: `#A9531F` (deep shadowed copper side)
- Base Shadow: `#172D38` at `18%` opacity
- Inset Technical Notch: `#172D38` (structural keyway)
- Reflection Inset: `#F7F8F5` at `55%` opacity

### 2.2 Strict Logo Protection Rules
> [!CAUTION]
> - **NEVER redraw, re-render, regenerate, or replace the logo mark geometry.**
> - **NEVER apply drop shadows or glow filters to the logo mark.**
> - **NEVER substitute a generated AI logo or different font family.**
> - In dark mode or on dark surfaces, use `<Logo tone="dark" />` which adjusts the typography to pure white while preserving the exact isometric copper mark.

---

## 3. Brand Voice and Nomenclature

- **Official Name**: Always "LevUp Projects" (Title Case, two words).
- **Historical Name Note**: "ProjectForge" was an internal prototype working title used in early draft documents. It is **never** used in public-facing copy, metadata, or URLs.
- **Tone of Voice**: Rigorous, technical, supportive, authentic. Avoid marketing fluff or fake claims of "instant guaranteed degree passing". Emphasize learning outcomes, verified circuits, clean code, and engineering rigor.
