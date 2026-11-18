import { expect, test } from "@playwright/test";

test.describe("Stage E — Custom Project Requisition Flow", () => {
  test("navigates from homepage CTA and renders 6-stage Assembly Spine workflow", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Request Custom Project" }).first().click();
    await expect(page).toHaveURL(/\/custom-project/);
    await expect(page.getByRole("heading", { name: "Request a Custom Project" })).toBeVisible();

    // Verify all 6 workflow stages on the Assembly Spine
    for (const stage of [
      "Submit Requirements",
      "Feasibility Review",
      "Quotation",
      "Acceptance",
      "Development",
      "Delivery",
    ]) {
      await expect(page.getByText(stage, { exact: true }).first()).toBeVisible();
    }

    // Verify honest prototype banner
    await expect(
      page.getByText(/Interactive frontend prototype · Backend not yet connected/i),
    ).toBeVisible();
  });

  test("validates required fields and adapts hardware specs by classification", async ({
    page,
  }) => {
    await page.goto("/custom-project");

    // Software is default: hardware spec textarea should not be visible
    await expect(page.locator("#cp-hardware-specs")).toHaveCount(0);

    // Submitting empty form shows validation alert and inline errors
    await page.getByRole("button", { name: "Review Requisition" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText(/Enter a clear project title/i).first()).toBeVisible();

    // Switching to Hybrid reveals optional hardware specifications & BOM deliverable
    await page.getByText("Hybrid (Hardware + Software)").click();
    await expect(page.locator("#cp-hardware-specs")).toBeVisible();
    await expect(page.getByText("Bill of Materials (BOM)")).toBeVisible();
  });

  test("preserves local draft across reload and completes review + prototype confirmation", async ({
    page,
  }) => {
    await page.goto("/custom-project");

    await page.fill("#cp-title", "ESP32 Greenhouse Telemetry Controller");
    await page.selectOption("#cp-category", "iot-electronics");
    await page.getByText("Hybrid (Hardware + Software)").click();
    await page.fill(
      "#cp-requirements",
      "Automated greenhouse telemetry controller reading soil moisture, humidity and temperature over MQTT.",
    );
    await page.fill(
      "#cp-functionality",
      "Live web dashboard with threshold alerts, relay actuator control and CSV logging.",
    );
    await page.fill("#cp-stack", "ESP32, C++, React, MQTT");
    await page.fill("#cp-hardware-specs", "ESP32-WROOM, DHT22, 4-channel relay board");
    await page.selectOption("#cp-budget", "10000-25000");
    await page.fill("#cp-date", "2027-03-15");
    await page.fill("#cp-name", "Atharv Ghanadat");
    await page.fill("#cp-email", "atharv@college.edu");
    await page.fill("#cp-phone", "9876543210");

    // Wait for debounced draft save, then reload and verify draft restoration
    await page.waitForTimeout(500);
    await page.reload();
    await expect(page.locator("#cp-title")).toHaveValue("ESP32 Greenhouse Telemetry Controller");
    await expect(page.getByText(/Restored your saved local draft/i)).toBeVisible();

    // Proceed to Review screen
    await page.getByRole("button", { name: "Review Requisition" }).click();
    await expect(
      page.getByRole("heading", { name: "Review Your Engineering Requisition" }),
    ).toBeVisible();
    await expect(page.getByText("ESP32 Greenhouse Telemetry Controller")).toBeVisible();
    await expect(page.getByText(/Prototype Submission Notice/i)).toBeVisible();

    // Confirm prototype preview
    await page.getByRole("button", { name: "Confirm Requisition Preview" }).click();
    await expect(
      page.getByRole("heading", { name: "Requisition Specification Prepared" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Frontend prototype confirmation · Not sent to server/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Download Specification \(\.json\)/i }),
    ).toBeVisible();
  });
});
