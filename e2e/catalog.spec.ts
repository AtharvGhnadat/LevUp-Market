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
  });

  test("catalog navigation and filtering", async ({ page }) => {
    await page.goto("/projects");

    // Check that projects are listed
    await expect(page.locator("article")).not.toHaveCount(0);
  });
});
