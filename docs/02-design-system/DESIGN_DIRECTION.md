# LEVUP PROJECTS — ORIGINAL DESIGN DIRECTION

**Document ID:** LDD-001  
**Author:** Principal Product Designer, Design Systems Architect  
**Framework:** Unslop Design Methodology  
**Target Repository:** `https://github.com/AtharvGhnadat/LevUp-Market.git`  
**Working Branch:** `design/unslop-foundation`

---

## 1. The Five Direction Lines

- **Product:** A precision engineering marketplace providing ready-to-deploy hardware, software, IoT, and embedded projects with complete source files, schematics, and milestone-verified custom development for engineers, innovators, and academic researchers.
- **Character:** Exact, technical, credible, and quietly industrious.
- **World:** The precision electronics workbench and hardware lab: matte PCB solder masks, machined anodized metals, technical schematics, laser-cut acrylic, and instrument night shifts.
- **Moments:**
  1. _The Project Assembly Showcase:_ High-resolution technical photography of real assembled hardware alongside an interactive, live-toggled CAD block diagram and pinout schematic.
  2. _The Interactive BOM & Deliverables Inspector:_ A crisp tabular view where buyers inspect exactly what source files, gerbers, CAD models, and code libraries are included before purchasing.
- **Signature:** **The LevUp Assembly Spine** — A continuous, hairline progression rail with numbered precision node calipers that traces every multi-step technical process (from custom project specification to milestone escrow, fabrication, and verified handover).

---

## 2. Color Balance: The 60 / 30 / 10 Alloy & Volt System

```
┌────────────────────────────────────────────────────────┐
│ 60% Mineral (#F1F2EC) — Canvas, Calm Backgrounds       │
├───────────────────────────────┬────────────────────────┤
│ 30% Alloy (#203735)           │ 10% Volt (#E56B3F)     │
│ Deep Industrial Slate, Text,  │ High-Energy Focal Point│
│ Structured Frames, Chrome     │ Key Action, Active Step│
└───────────────────────────────┴────────────────────────┘
```

1. **60% Mineral (`#F1F2EC`):** The primary calm canvas. Unlike cold, clinical stark white, Mineral carries the tactile, warm neutrality of unbleached engineering vellum and high-grade instrument panels. It provides low eyestrain for engineers reviewing technical specifications.
2. **30% Alloy (`#203735`):** The structural core. A deep slate-green with industrial gravity. Used for primary typography, structural dividers, dark technical containers, and grounded interface chrome.
3. **10% Volt (`#E56B3F`):** The catalytic accent. Reserved exclusively for primary conversion actions, active progress states on the Assembly Spine, and key numerical metrics. Never used as a decorative wash, gradient, or background flood.

---

## 3. Typography Architecture

| Role                   | Typeface Family      | Weight Range                 | Usage & Rules                                                                                                                                  |
| :--------------------- | :------------------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Display Headings**   | **Manrope Variable** | 500 (Medium), 600 (SemiBold) | Section and hero titles. No 800/900 ultra-heavy weights. Sentence case only; no tracked all-caps headings.                                     |
| **Interface & Body**   | **IBM Plex Sans**    | 400 (Regular), 500 (Medium)  | Body copy, navigation links, form controls, and table rows. Excellent legibility at 13px–15px.                                                 |
| **Technical Metadata** | **IBM Plex Mono**    | 400 (Regular), 500 (Medium)  | Project SKU/IDs, pinouts, baud rates, file extensions (`.ino`, `.py`, `.step`, `.sch`), currency figures, and Assembly Spine step coordinates. |

---

## 4. The LevUp Assembly Spine Standard

The **Assembly Spine** is LevUp’s exclusive signature design motif. It embodies the rigorous journey of an engineering artifact from initial concept to physical or digital delivery.

### Permitted Uses:

1. **Custom Project Requisition:** 01 Requirements Submission → 02 Engineering Feasibility Review → 03 Formal Quotation & BOM → 04 Milestone Escrow → 05 Fabrication & Delivery.
2. **How It Works (Homepage):** 01 Project Selection → 02 Package & Add-on Configuration → 03 Secure Escrow Payment → 04 Milestone Development → 05 Verified Deliverable Delivery.
3. **Customer Order Tracking:** Milestone progression stages for in-flight orders.

### Strict Non-Permitted Uses:

- Never use the Assembly Spine as a decorative background line.
- Never use it between unrelated static content blocks.
- Never place chevron icons or arbitrary floating bubbles outside the spine rail.

---

## 5. Unslop Improvement Passes Plan (Passes A through I)

Following Damir Sokolovsky's documented sequence:

- **Pass A — Spacing:** Enforce strict 4px grid across all margins, paddings, and component heights. Eliminate all one-off JIT pixel overrides (`pt-[26px]`, `h-[31px]`, `lg:pl-[46px]`).
- **Pass B — Color:** Apply Mineral / Alloy / Volt 60/30/10 ratio. Remove diagonal slashes, gradient text, orange background floods, and misassigned green paragraph text.
- **Pass C — Icons:** Standardize Lucide icons to 16px (inline controls) and 20px (headers/cards) at stroke 1.5. Render in muted neutral text color.
- **Pass D — Content & Copy:** Replace generic marketing buzzwords ("supercharge", "simple & transparent process") with exact engineering descriptions. Consolidate triplicated benefit lists into one authoritative guarantee.
- **Pass E — Typography:** Pair Manrope display with IBM Plex Sans body and IBM Plex Mono metadata. Convert uppercase tracked labels to sentence case.
- **Pass F — Layout:** Rebalance 1440px desktop container; remove diagonal clip-paths; establish clean 2-column detail grid; compose hero as an asymmetric technical showcase.
- **Pass G — Components:** Standardize button radii (8px), card containers (12px), and input fields (8px). Ensure nested radius formula (`inner = outer - padding`).
- **Pass H — Visuals:** Replace fragmented vector frames with authentic technical photographs, block diagrams, and real schematic previews.
- **Pass I — Motion:** Restrict animation to 150ms transitions (`transition-colors`, `transition-[transform,opacity]`). Remove bouncy hover zooms (`hover:scale-[1.04]`). Respect `prefers-reduced-motion`.
