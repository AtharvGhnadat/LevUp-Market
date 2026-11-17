# Responsive Layouts — LevUp Projects Design System

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Breakpoints Reference

The design system adheres to Tailwind CSS standard breakpoints calibrated to match the 1440px desktop reference down to compact mobile displays:

| Breakpoint | Minimum Width | Typical Target Devices              | Layout Behavior                                           |
| ---------- | ------------- | ----------------------------------- | --------------------------------------------------------- |
| `base`     | `< 640px`     | Mobile phones (375px–430px)         | Single column; mobile header drawer; bottom sheet filters |
| `sm`       | `640px`       | Large phones / phablets             | 2-column project grids; compact banner layouts            |
| `md`       | `768px`       | Tablets (portrait)                  | Expanded search bar; tablet spacing                       |
| `lg`       | `1024px`      | Tablets (landscape) / small laptops | Visible desktop header navigation; 3-column project grid  |
| `xl`       | `1280px`      | Standard desktops                   | Sidebar catalog filter panel; inline header search        |
| `2xl`      | `1536px`      | Large monitors                      | Max-width content constraint (`1348px`) centered          |

---

## 2. Key Layout Behaviors

### 2.1 Navigation & Header

- **Mobile (`< 1024px`)**: Navigation collapses into a hamburger icon. Tapping opens `MobileMenu`, an accessible slide-out drawer featuring all primary and category links, cart indicator, and login button.
- **Desktop (`>= 1024px`)**: Full horizontal primary navigation with dropdown menus for multi-level category navigation.
- **Header Search**: On screens `< 1280px`, search is represented by an icon triggering `SearchDialog`. On screens `>= 1280px`, an inline search input is rendered directly in the header.

### 2.2 Catalog Page (`/projects`)

- **Mobile (`< 1280px`)**: Full-width project grid with a "Filter" button launching `MobileFilterDrawer` modal.
- **Desktop (`>= 1280px`)**: Two-column layout: 280px sticky sidebar containing `CatalogFilterPanel` on the left, responsive multi-column project grid on the right.

### 2.3 Project Detail Page (`/projects/:slug`)

- **Mobile (`< 1024px`)**: Stacked vertical flow: Breadcrumbs → Title → Gallery → Package Selector & Purchase Configurator → Technical Tabs → Block Diagram → Related Projects.
- **Desktop (`>= 1024px`)**: Two-column layout: Left column hosts the image gallery, overview, tabs, and technical diagrams; right sticky column hosts the Package Selector, Add-on Configurator, and Price Summary.
