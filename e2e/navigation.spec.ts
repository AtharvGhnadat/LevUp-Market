import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://images.unsplash.com/**", (route) => route.abort());
});

function header(page: Page) {
  return page.getByRole("banner");
}

test("desktop Projects disclosure supports keyboard navigation and real category links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const banner = header(page);
  const nav = banner.getByRole("navigation", { name: "Primary" });
  const projects = nav.getByRole("button", { name: "Projects", exact: true });
  const allProjects = nav.getByRole("link", { name: "All projects", exact: true });
  const electronics = nav.getByRole("link", { name: "IoT & Electronics" });

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(banner.getByRole("link", { name: "LevUp Projects home" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(projects).toBeFocused();
  await expect(projects).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(projects).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(allProjects).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(projects).toBeFocused();
  await expect(projects).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Enter");
  await banner.getByRole("button", { name: "Search projects" }).focus();
  await expect(projects).toHaveAttribute("aria-expanded", "false");
  await projects.click();
  await page.mouse.click(4, 30);
  await expect(projects).toHaveAttribute("aria-expanded", "false");
  await projects.click();
  const panel = nav.locator(`[id="${await projects.getAttribute("aria-controls")}"]`);
  await expect(panel.getByRole("link")).toHaveCount(7);
  await expect(nav.getByRole("link", { name: "About", exact: true })).toBeVisible();
  await electronics.click();
  await expect(page).toHaveURL(/\/projects\?category=iot-electronics$/);
  await expect(page.getByRole("main").locator("article").first()).toBeVisible();
  await expect(projects).toHaveAttribute("aria-current", "location");
  await projects.click();
  await expect(electronics).toHaveAttribute("aria-current", "page");
});

test("public header links to working destinations, including Sign In and Create Account", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects");
  const banner = header(page);
  const nav = banner.getByRole("navigation", { name: "Primary" });
  await expect(banner.getByRole("link", { name: "Sign In", exact: true })).toHaveAttribute(
    "href",
    "/login",
  );
  await expect(banner.getByRole("link", { name: "Create Account", exact: true })).toHaveAttribute(
    "href",
    "/signup",
  );
  await nav.getByRole("link", { name: "Custom development" }).click();
  await expect(page.getByRole("heading", { name: "Request a Custom Project" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Custom development" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "How it works" }).click();
  await expect(page).toHaveURL(/\/#how-it-works$/);
  await expect(page.getByRole("heading", { name: "How LevUp Projects Works" })).toBeInViewport();
  await expect(nav.getByRole("link", { name: "How it works" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

for (const width of [390, 1440]) {
  test(`site search opens, clears, dismisses, and submits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto("/");
    const banner = header(page);
    const trigger = banner.getByRole("button", { name: "Search projects" });
    const search = page.getByRole("dialog", { name: "Search projects" });
    const input = search.getByRole("searchbox");

    await expect(trigger).toBeVisible();
    await page.keyboard.press("Control+k");
    await expect(input).toBeFocused();
    await input.fill("ESP32");
    await expect(search.getByRole("link", { name: /ESP32 Smart Irrigation System/ })).toBeVisible();
    await input.press("Escape");
    await expect(search).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await input.fill("no-match-in-the-catalog");
    await expect(search.getByText(/No listings match/)).toBeVisible();
    await search.getByRole("button", { name: "Clear search" }).click();
    await expect(input).toHaveValue("");
    await expect(input).toBeFocused();
    await expect(search.getByRole("link", { name: "IoT & Electronics" })).toHaveAttribute(
      "href",
      "/projects?category=iot-electronics",
    );
    await search.getByRole("button", { name: "Close search" }).click();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await input.fill("ESP32");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/projects\?q=ESP32$/);
    await expect(page.getByRole("main").locator("article").first()).toBeVisible();
  });
}

test("compact drawer manages focus, section links and the switch to desktop", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 600 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const banner = header(page);
  const menu = banner.getByRole("button", { name: "Open menu" });
  const drawer = page.getByRole("dialog", { name: "Site navigation" });
  const close = drawer.getByRole("button", { name: "Close menu" });
  const cart = banner.getByRole("link", { name: "Cart, 0 items" });

  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(close).toBeFocused();
  expect(
    await drawer.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration),
    ),
  ).toBeLessThan(0.001);
  await expect(drawer.getByRole("link", { name: "Sign In", exact: true })).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Create Account", exact: true })).toBeVisible();
  await expect(page.locator("#mobile-menu:modal")).toHaveCount(1);
  const projects = drawer.locator("summary").filter({ hasText: /^Projects$/ });
  await projects.focus();
  await page.keyboard.press("Space");
  await expect(drawer.getByRole("link", { name: "All projects" })).toBeVisible();
  await expect(
    drawer
      .locator("details")
      .filter({ has: page.locator("summary").filter({ hasText: /^Projects$/ }) }),
  ).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");

  await menu.click();
  await drawer.getByRole("link", { name: "How it works" }).click();
  await expect(page).toHaveURL(/\/#how-it-works$/);
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("heading", { name: "How LevUp Projects Works" })).toBeInViewport();

  await menu.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator("#mobile-menu:modal")).toHaveCount(0);
  await expect(banner.getByRole("button", { name: "Search projects" })).toBeFocused();
  await cart.click();
  await expect(page).toHaveURL(/\/cart$/);
});

test("cart indicator reflects adding and removing an actual project", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/esp32-smart-irrigation-system");
  const banner = header(page);
  await expect(banner.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  const cart = banner.getByRole("link", { name: "Cart, 1 item" });
  await expect(cart).toBeVisible();
  await cart.click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.getByRole("button", { name: /remove/i }).click();
  await expect(banner.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
});

test("header fits the requested viewports and the 200% desktop reflow width", async ({ page }) => {
  const widths = [320, 360, 390, 430, 720, 768, 1024, 1280, 1440];
  await page.goto("/");
  const banner = header(page);
  for (const width of widths) {
    await test.step(`${width}px`, async () => {
      await page.setViewportSize({ width, height: 800 });
      await expect(banner.getByRole("link", { name: "LevUp Projects home" })).toBeVisible();
      const controls = await banner.evaluate((element) =>
        Array.from(element.querySelectorAll("a, button"))
          .filter((control) => control.checkVisibility())
          .map((control) => {
            const box = control.getBoundingClientRect();
            return { left: box.left, right: box.right, height: box.height };
          }),
      );
      expect(await banner.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(width);
      expect(
        controls.every(({ left, right, height }) => left >= 0 && right <= width && height >= 34),
      ).toBe(true);
      const menu = banner.getByRole("button", { name: "Open menu" });
      if (width <= 1024) {
        await expect(menu).toBeVisible();
        expect((await menu.boundingBox())?.width).toBeGreaterThanOrEqual(44);
      } else {
        await expect(menu).toBeHidden();
        await banner.getByRole("button", { name: "Projects", exact: true }).click();
        const panel = banner.getByRole("link", { name: "All projects" });
        await expect(panel).toBeInViewport();
        await page.keyboard.press("Escape");
      }
    });
  }
});
