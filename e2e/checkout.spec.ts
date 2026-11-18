import { test, expect } from "@playwright/test";

test.describe("Cashfree Checkout & Return Flow", () => {
  test("loads cart page with empty state and navigates to catalog", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Your Shopping Cart" })).toBeVisible();
    await expect(page.getByText("Your cart is currently empty")).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore Projects" })).toBeVisible();
  });

  test("loads checkout page and renders student billing form", async ({ page }) => {
    await page.goto("/checkout");

    // Verify title and security encryption badge
    await expect(page.getByRole("heading", { name: "Academic Project Checkout" })).toBeVisible();
    await expect(page.getByText("Cashfree 256-Bit SSL Encrypted Checkout")).toBeVisible();

    // Verify required inputs
    await expect(page.locator("#customerName")).toBeVisible();
    await expect(page.locator("#customerEmail")).toBeVisible();
    await expect(page.locator("#customerPhone")).toBeVisible();

    // Verify order summary
    await expect(page.getByRole("heading", { name: "Order Summary" })).toBeVisible();
    await expect(page.getByText("Total Amount")).toBeVisible();

    // Verify Cashfree testing badge
    await expect(page.getByText("Cashfree Sandbox")).toBeVisible();
  });

  test("return URL handler displays verified order state with deliverables", async ({ page }) => {
    // Intercept verification endpoint to simulate paid response
    await page.route("**/api/payments/cashfree/verify-order*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          order_id: "LP_test_return_12345",
          order_status: "PAID",
          order_amount: 2499.0,
          order_currency: "INR",
        }),
      });
    });

    // Navigate to return URL with simulated order id
    await page.goto("/checkout/return?order_id=LP_test_return_12345");

    // Verify verified success screen
    await expect(page.getByRole("heading", { name: "Order Confirmed" })).toBeVisible();
    await expect(page.getByText("LP_test_return_12345")).toBeVisible();
    await expect(page.getByText("Unlocked Project Assets")).toBeVisible();
    await expect(page.getByText("Full Source Code & Libraries (.zip)")).toBeVisible();
  });
});
