import { test as base, expect } from "@playwright/test";
import { mockAuth, seedSession } from "./auth-fixture";
import { workspaceFixture, customerId } from "./workspace-fixture";

const test = base.extend<{ workspace: Awaited<ReturnType<typeof workspaceFixture>> }>({
  workspace: async ({ page }, runWithWorkspace) => {
    await mockAuth(page);
    await seedSession(page);
    const fixture = await workspaceFixture(page);
    try {
      await runWithWorkspace(fixture);
    } finally {
      await fixture.close();
    }
  },
});
test("saves a student profile to PostgreSQL and protects unsaved edits", async ({
  page,
  workspace,
}) => {
  await page.goto("/account/profile");
  const main = page.getByRole("main");
  await main.getByLabel("Full name").fill("Morgan Student");
  await main.getByLabel("Display name").fill("Morgan");
  await main.getByRole("button", { name: "Save changes" }).click();
  await expect(main.getByRole("status")).toHaveText("Changes saved.");
  expect((await workspace.db.query("select full_name,display_name from profiles")).rows).toEqual([
    { full_name: "Morgan Student", display_name: "Morgan" },
  ]);
  await page.reload();
  await expect(main.getByLabel("Display name")).toHaveValue("Morgan");
  await main.getByLabel("Full name").fill("Unsaved change");
  const dialog = page.waitForEvent("dialog");
  const nav = main
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Account settings" })
    .click({ noWaitAfter: true });
  const prompt = await dialog;
  expect(prompt.type()).toBe("beforeunload");
  await prompt.dismiss();
  await nav;
  await expect(main.getByLabel("Full name")).toHaveValue("Unsaved change");
  await main.getByRole("button", { name: "Cancel changes" }).click();
  await expect(main.getByLabel("Full name")).toHaveValue("Morgan Student");
  await page.goto("/account/academic");
  await main.getByLabel("Account classification").selectOption("Student");
  await main.getByLabel("College or institution").fill("Example Institute");
  await main.getByLabel("Current year of study").fill("12");
  await main.getByRole("button", { name: "Save changes" }).click();
  await expect(main.getByLabel("Current year of study")).toBeFocused();
  await main.getByLabel("Current year of study").fill("3");
  await main.getByLabel("Expected graduation year").fill("2028");
  await main.getByLabel("Robotics", { exact: true }).check();
  workspace.failWrites(true);
  await main.getByRole("button", { name: "Save changes" }).click();
  await expect(main.getByRole("alert")).toContainText("couldn’t save");
  workspace.failWrites(false);
  await main.getByRole("button", { name: "Save changes" }).click();
  await expect(main.getByRole("status")).toHaveText("Changes saved.");
  await page.reload();
  await expect(main.getByLabel("College or institution")).toHaveValue("Example Institute");
  await expect(main.getByLabel("Robotics", { exact: true })).toBeChecked();
});
test("manages an optional hardware address and an owned default", async ({ page, workspace }) => {
  await page.goto("/account/addresses");
  const main = page.getByRole("main");
  await expect(main.getByText("No saved addresses")).toBeVisible();
  await main.getByRole("link", { name: "Add delivery address" }).click();
  for (const [label, value] of [
    ["Recipient name", "Test Student"],
    ["Mobile number", "9000000000"],
    ["Street address", "12 Example Campus Road"],
    ["City", "Pune"],
    ["State or union territory", "Maharashtra"],
    ["PIN code", "001"],
  ])
    await main.getByLabel(label, { exact: true }).fill(value);
  await main.getByRole("button", { name: "Save address" }).click();
  await expect(main.getByLabel("PIN code")).toBeFocused();
  await main.getByLabel("PIN code").fill("411001");
  await main.getByRole("button", { name: "Save address" }).click();
  await expect(main.getByText("Address saved.")).toBeVisible();
  await main.getByRole("button", { name: "Make default" }).click();
  await expect(main.getByText("Default delivery address", { exact: true })).toBeVisible();
  await main.getByRole("link", { name: "Edit address", exact: true }).click();
  await main.getByLabel("City", { exact: true }).fill("Mumbai");
  await main.getByRole("button", { name: "Save address" }).click();
  await expect(main.getByRole("status")).toHaveText("Address saved.");
  await expect(main.getByText(/Example Campus Road, Mumbai/)).toBeVisible();
  await page.reload();
  await expect(main.getByText(/Example Campus Road, Mumbai/)).toBeVisible();
  await main.getByRole("button", { name: "Remove", exact: true }).click();
  await main.getByRole("button", { name: "Confirm removal" }).click();
  await expect(main.getByText("No saved addresses")).toBeVisible();
  expect((await workspace.db.query("select default_address_id from profiles")).rows).toEqual([
    { default_address_id: null },
  ]);
});
test("all workspace routes, preferences, support intake and session security use working destinations", async ({
  page,
  workspace,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dashboard");
  const main = page.getByRole("main");
  await expect(main.getByText("Start with a project")).toBeVisible();
  const rail = main.getByRole("navigation", { name: "Workspace", exact: true });
  for (const title of [
    "My projects",
    "Custom requests",
    "Orders",
    "Messages",
    "Support",
    "Account settings",
  ]) {
    await rail.getByRole("link", { name: title, exact: true }).click();
    await expect(main.getByRole("heading", { level: 1 })).toHaveText(title);
  }
  await main.getByRole("link", { name: /Preferences Choose/ }).click();
  await main.getByLabel("Embedded Systems", { exact: true }).check();
  await main.getByRole("button", { name: "Save changes" }).click();
  await expect(main.getByRole("status")).toHaveText("Changes saved.");
  await rail.getByRole("link", { name: "Overview" }).click();
  await expect(main.getByRole("link", { name: "Embedded Systems", exact: true })).toHaveAttribute(
    "href",
    "/projects?category=embedded-systems",
  );
  await page.goto("/account/security");
  await main.getByRole("button", { name: "Sign out of other sessions" }).click();
  await expect(main.getByRole("status")).toContainText("Other sessions");
  await main.getByRole("link", { name: "Request account deletion" }).click();
  await expect(main.getByLabel("Topic")).toHaveValue("Account deletion");
  await main.getByLabel("How can we help?").fill("Please review my account deletion request.");
  await main.getByRole("button", { name: "Send request" }).click();
  await expect(main.getByText("Your request was recorded.", { exact: false })).toBeVisible();
  expect((await workspace.db.query("select topic,status from customer_tickets")).rows).toEqual([
    { topic: "Account deletion", status: "received" },
  ]);
  expect((await workspace.db.query("select id from profiles")).rows).toEqual([{ id: customerId }]);
});
base("populated orders, deliverables and staff messages use stored records", async ({ page }) => {
  await mockAuth(page);
  await seedSession(page);
  const fixture = await workspaceFixture(page, { withActivity: true });
  try {
    await page.goto("/dashboard/orders");
    const main = page.getByRole("main");
    await main.getByRole("link", { name: /ESP32 Smart Irrigation System/ }).click();
    await expect(main.getByRole("heading", { name: "Order details" })).toBeVisible();
    await expect(main.getByText("Standard", { exact: true })).toBeVisible();
    await expect(main.getByText("LU-2036", { exact: true })).toBeVisible();
    await page.goto("/dashboard/orders?order=unassigned");
    await expect(main.getByRole("heading", { name: "Order unavailable" })).toBeVisible();
    await page.goto("/dashboard/projects");
    await expect(main.getByRole("link", { name: /Circuit diagram.pdf/ })).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard/messages");
    await expect(main.getByText("Your circuit diagram is listed under My projects.")).toBeVisible();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Notifications, unread messages" }),
    ).toBeVisible();
    await main.getByRole("button", { name: "Mark messages as read" }).click();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Notifications", exact: true }),
    ).toBeVisible();
    expect((await fixture.db.query("select * from customer_reply_reads")).rows).toHaveLength(1);
  } finally {
    await fixture.close();
  }
});
base(
  "signed-in navigation reflows with a long account name, zoom-width and reduced motion",
  async ({ page }) => {
    await mockAuth(page);
    await seedSession(page);
    const fixture = await workspaceFixture(page, { name: "A".repeat(76) + " Student" });
    try {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/account/academic");
      const banner = page.getByRole("banner");
      await expect(page.getByLabel("College or institution")).toBeVisible();
      for (const [width, height] of [
        [320, 700],
        [360, 800],
        [390, 844],
        [430, 932],
        [768, 1024],
        [1024, 768],
        [1200, 800],
        [1280, 800],
        [1408, 860],
        [1440, 900],
        [1920, 1080],
        [720, 450],
        [844, 390],
        [320, 390],
      ]) {
        await page.setViewportSize({ width, height });
        const dimensions = await banner.evaluate((header) => ({
          page: document.documentElement.scrollWidth,
          header: header.scrollWidth,
        }));
        expect(dimensions).toEqual({ page: width, header: width });
        const desktop = width >= 1200;
        const control = banner.getByRole("button", {
          name: desktop ? "Account" : "Open menu",
          exact: true,
        });
        const bar = await banner.locator(".market-bar").boundingBox();
        const button = await control.boundingBox();
        expect(button!.x + button!.width).toBeLessThanOrEqual(bar!.x + bar!.width - 2);
        await control.click();
        const panel = desktop
          ? banner.locator(".nav-flyout:visible").last()
          : page.getByRole("dialog", { name: "Site navigation" });
        await expect(panel.getByRole("link", { name: "My projects", exact: true })).toBeVisible();
        const rect = await panel.boundingBox();
        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
          width,
        );
        await page.keyboard.press("Escape");
        await expect(control).toBeFocused();
      }
      const duration = await page
        .locator(".customer-enter")
        .evaluate((el) => getComputedStyle(el).animationDuration);
      expect(parseFloat(duration)).toBeLessThan(0.001);
    } finally {
      await fixture.close();
    }
  },
);
base("search and cart stay in place across session restoration", async ({ page }) => {
  let release = () => {};
  const delayUser = new Promise<void>((resolve) => {
    release = resolve;
  });
  await mockAuth(page, { delayUser });
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/projects");
  const header = page.getByRole("banner");
  const positions = () =>
    Promise.all([
      header.getByRole("button", { name: "Search projects", exact: true }).boundingBox(),
      header.getByRole("link", { name: /Cart,/ }).boundingBox(),
    ]);
  await expect(header.getByRole("link", { name: "Sign In" })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const guest = await positions();
  await seedSession(page);
  const fixture = await workspaceFixture(page, { name: "Ananya Kulkarni" });
  try {
    await page.reload();
    await expect(header.getByRole("status")).toContainText("Checking account");
    expect(await positions()).toEqual(guest);
    release();
    await expect(header.getByRole("button", { name: "Account", exact: true })).toContainText(
      "Ananya Kulkarni",
    );
    expect(await positions()).toEqual(guest);
  } finally {
    release();
    await fixture.close();
  }
});
base("every private URL sends guests to sign-in with their destination", async ({ page }) => {
  await mockAuth(page);
  for (const path of [
    "/dashboard",
    "/dashboard/projects",
    "/dashboard/orders",
    "/dashboard/orders?order=LU-08",
    "/dashboard/messages",
    "/account",
    "/account/profile",
    "/dashboard/custom-requests",
    "/dashboard/support",
    "/account/academic",
    "/account/addresses",
    "/account/security",
    "/account/preferences",
  ]) {
    await page.goto(path, { waitUntil: "commit" });
    await expect(page.getByRole("main").getByLabel("Email address", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/login\?next=/);
    expect(new URL(page.url()).searchParams.get("next")).toBe(path);
  }
});
test("submits a reviewed custom brief once and lists its stored status", async ({
  page,
  workspace,
}) => {
  await page.goto("/custom-project");
  await page.locator("#cp-title").fill("Campus irrigation controller");
  await page.selectOption("#cp-category", "iot-electronics");
  await page.getByText("Hybrid (Hardware + Software)").click();
  await page
    .locator("#cp-requirements")
    .fill("Log greenhouse moisture and control a small irrigation pump when soil becomes dry.");
  await page
    .locator("#cp-functionality")
    .fill("Capture moisture readings and export the daily log.");
  await page.selectOption("#cp-budget", "10000-25000");
  const target = new Date();
  target.setUTCMonth(target.getUTCMonth() + 3);
  await page.locator("#cp-date").fill(target.toISOString().slice(0, 10));
  await expect(page.locator("#cp-phone")).toHaveCount(0);
  await expect(page.locator("#cp-email")).toHaveCount(0);
  await page.getByRole("button", { name: "Review Requisition" }).click();
  await page.getByRole("button", { name: "Submit engineering brief" }).click();
  await expect(page).toHaveURL(/\/dashboard\/custom-requests$/);
  await expect(page.getByRole("heading", { name: "Campus irrigation controller" })).toBeVisible();
  const records = await workspace.db.query<{
    status: string;
    specification: Record<string, unknown>;
  }>("select status,specification from customer_requests");
  expect(records.rows).toHaveLength(1);
  expect(records.rows[0].status).toBe("submitted");
  expect(records.rows[0].specification).not.toHaveProperty("contact");
  expect(records.rows[0].specification).not.toHaveProperty("stagedReferenceFiles");
});
base("public Resources, About and access controls work before login", async ({ page }) => {
  await mockAuth(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects");
  const header = page.getByRole("banner");
  await header.getByRole("button", { name: "Resources", exact: true }).click();
  await header.getByRole("link", { name: "Project guide", exact: true }).click();
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(
    "Project guide",
  );
  await header.getByRole("link", { name: "About", exact: true }).click();
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(
    "About LevUp Projects",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await header.getByRole("button", { name: "Open menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Site navigation" });
  await drawer.locator("summary").filter({ hasText: "Resources" }).click();
  await drawer.getByRole("link", { name: "Customer FAQs" }).click();
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(
    "Customer FAQs",
  );
});
