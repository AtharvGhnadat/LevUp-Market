# End-to-End (E2E) Test Cases — LevUp Projects

**Document Status:** Baseline  
**Framework:** Playwright  
**Last Updated:** 2026-11-17  

---

## 1. Critical User Journeys (E2E)

### E2E-01: Public Catalog Discovery & Navigation
1. Navigate to `/`.
2. Verify all 7 home sections are rendered (Hero, Benefit Strip, Category Grid, Featured Projects, Custom Banner, How It Works, Trust Section).
3. Click "Explore Projects" in header.
4. Verify URL is `/projects` and catalog cards are rendered.
5. Select category "IoT & Electronics" in filter sidebar.
6. Verify URL updates to `?category=iot-electronics` and all cards match the selected category.
7. Click first project card.
8. Verify navigation to `/projects/:slug` with correct title, price, and tabs.

### E2E-02: Package Configuration & Cart Addition
1. Navigate to `/projects/esp32-smart-irrigation-system`.
2. Click "Premium" package card.
3. Verify price summary reflects Premium tier pricing.
4. Check add-on "3D Enclosure Design".
5. Verify configuration total increments correctly.
6. Click "Add to Cart".
7. Verify header cart badge updates from 0 to 1.
8. Verify announcement toast appears.

### E2E-03: Planned Route Graceful Handling
1. Navigate to `/checkout` or `/about`.
2. Verify page loads `PlannedRoutePage` with honest "not built yet" message and path display.
3. Verify page does NOT crash, throw uncaught React errors, or display an unstyled 404.
4. Click "Back to homepage" button and verify return to `/`.
