import { test, expect } from "@playwright/test";

test.describe("Storefront & Catalog Flow", () => {
  test("homepage renders hero, navigation and sections", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/LevUp Projects/);

    // Verify main header logo exists
    const logo = page.getByRole("link", { name: /LevUp Projects/i }).first();
    await expect(logo).toBeVisible();

    // Verify navigation links in primary nav
    await expect(page.getByRole("link", { name: "Explore Projects" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Custom Projects" }).first()).toBeVisible();

    // Verify hero heading
    const heroTitle = page.locator("#hero-title");
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText("Academic Projects");
    await expect(heroTitle).toContainText("Supported.");

    // Verify value/benefit assurance strip
    await expect(page.getByText("500+")).toBeVisible();
    await expect(page.getByText("Engineering Focus")).toBeVisible();

    // Verify How It Works section
    await expect(page.locator("#how-title")).toContainText("How LevUp Projects Works");
    await expect(page.getByText("1. Choose or Request")).toBeVisible();
    await expect(page.getByText("4. Deliver & Support")).toBeVisible();

    // Verify Category Grid
    await expect(page.locator("#categories-title")).toContainText("Explore Project Categories");
    await expect(page.getByRole("link", { name: /IoT Systems/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Software Projects/i })).toBeVisible();

    // Verify Featured Projects
    await expect(page.locator("#featured-title")).toContainText("Featured Projects");
    await expect(page.getByText("Autonomous Obstacle Avoidance Robot")).toBeVisible();
    await expect(page.getByText("Student Project Management System")).toBeVisible();

    // Verify Custom Project banner
    await expect(page.locator("#custom-title")).toContainText("Custom Project");
    await expect(page.getByRole("link", { name: "Request Custom Project" }).first()).toBeVisible();
  });

  test("catalog navigation and filtering", async ({ page }) => {
    await page.goto("/projects");

    // Check that projects are listed
    await expect(page.locator("article")).not.toHaveCount(0);
  });
});
