import { expect, test } from "@playwright/test";
import { fixtureEmail, fixtureName, fixturePassword, mockAuth, seedSession } from "./auth-fixture";

test.beforeEach(async ({ page }) => {
  await page.route("https://images.unsplash.com/**", (route) => route.abort());
});

test("sign in validates fields, reveals passwords on request and hides provider diagnostics", async ({
  page,
}) => {
  await mockAuth(page);
  await page.goto("/login?next=https%3A%2F%2Fother.example.invalid");
  const form = page.getByRole("main").locator("form");
  await form.getByRole("button", { name: "Sign In" }).click();
  const email = form.getByLabel("Email address");
  const password = form.getByLabel("Password", { exact: true });
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await email.fill(fixtureEmail);
  await password.fill("wrong password");
  await form.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await form.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
  await form.getByRole("button", { name: "Sign In" }).click();
  await expect(form.getByRole("alert")).toContainText("Check your email and password");
  await expect(page.getByText("Provider detail hidden by the UI.")).toHaveCount(0);
  await password.fill(fixturePassword);
  await password.press("Enter");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();
  await page.goto("/account");
  await expect(page.getByText("Email verified")).toBeVisible();
});

test("remembering an email requires a successful opt-in and can be cleared on this device", async ({
  page,
}) => {
  await mockAuth(page);
  await page.goto("/login");
  const main = page.getByRole("main");
  const remember = main.getByLabel("Remember my email");
  await expect(remember).not.toBeChecked();
  await remember.check();
  await main.getByLabel("Email address").fill(fixtureEmail);
  await main.getByLabel("Password", { exact: true }).fill("incorrect");
  await main.getByRole("button", { name: "Sign In" }).click();
  await expect(main.getByRole("alert")).toBeVisible();
  await page.reload();
  await expect(main.getByLabel("Email address")).toHaveValue("");
  await remember.check();
  await main.getByLabel("Email address").fill(fixtureEmail);
  await main.getByLabel("Password", { exact: true }).fill(fixturePassword);
  await main.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/account");
  await main.getByRole("button", { name: "Sign Out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/create-account");
  await expect(main.getByRole("heading", { name: "Create Account", exact: true })).toBeVisible();
  await expect(main.getByLabel("Email address")).toHaveValue("");
  await main.getByRole("link", { name: "Sign In" }).click();
  await expect(main.getByLabel("Email address")).toHaveValue(fixtureEmail);
  await expect(main.getByLabel("Password", { exact: true })).toHaveValue("");
  await remember.uncheck();
  await page.reload();
  await expect(remember).not.toBeChecked();
  await expect(main.getByLabel("Email address")).toHaveValue("");
});

test("signup confirmation, resend and callback use the provider and preserve a safe destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const calls = await mockAuth(page);
  await page.goto("/signup?next=%2Fprojects");
  const form = page.getByRole("main").locator("form");
  await form.getByRole("button", { name: "Create Account" }).click();
  await expect(form.getByLabel("Full name")).toBeFocused();
  await form.getByLabel("Full name").fill(fixtureName);
  await form.getByLabel("Email address").fill(fixtureEmail);
  await form.getByLabel("Password", { exact: true }).fill(fixturePassword);
  await form.getByLabel("Confirm password", { exact: true }).fill("different password");
  await form.getByRole("button", { name: "Create Account" }).click();
  await expect(form.getByText("The passwords do not match.")).toBeVisible();
  await form.getByLabel("Confirm password", { exact: true }).fill(fixturePassword);
  await form.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByRole("heading", { name: "Check your inbox" })).toBeFocused();
  await expect(page.getByRole("banner").getByRole("link", { name: "Sign In" })).toBeVisible();
  const signup = calls.find(({ endpoint }) => endpoint === "signup");
  expect(signup?.payload?.data).toEqual({ full_name: fixtureName });
  expect(signup?.payload?.code_challenge).toEqual(expect.any(String));
  expect(signup?.redirectTo).toMatch(/\/auth\/callback$/);
  await page.getByRole("button", { name: "Resend confirmation" }).click();
  await expect(page.getByText(/another confirmation link/)).toBeVisible();
  expect(calls.find(({ endpoint }) => endpoint === "resend")?.payload?.type).toBe("signup");
  await page.goto("/auth/callback?code=verify-email-fixture");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("banner").getByRole("button", { name: "Account", exact: true }),
  ).toBeVisible();
});

test("duplicate signup shows the same neutral inbox state", async ({ page }) => {
  await mockAuth(page, { duplicate: true });
  await page.goto("/register");
  await expect(page).toHaveURL(/\/signup$/);
  const main = page.getByRole("main");
  await main.getByLabel("Full name").fill(fixtureName);
  await main.getByLabel("Email address").fill(fixtureEmail);
  await main.getByLabel("Password", { exact: true }).fill(fixturePassword);
  await main.getByLabel("Confirm password", { exact: true }).fill(fixturePassword);
  await main.getByRole("button", { name: "Create Account" }).click();
  await expect(main.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
  await expect(main.getByText(/If this address can receive a confirmation link/)).toBeVisible();
});

test("recovery validates a verified link before changing the password", async ({ page }) => {
  const calls = await mockAuth(page);
  await page.goto("/reset-password?error_code=otp_expired");
  await expect(page.getByRole("alert")).toContainText("invalid or expired");
  await expect(page.getByLabel("New password", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Request a new link" }).click();
  await page.getByLabel("Email address").fill(fixtureEmail);
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByText(/If an account uses this address/)).toBeVisible();
  expect(calls.find(({ endpoint }) => endpoint === "recover")?.redirectTo).toMatch(
    /\/reset-password$/,
  );
  await page.goto("/reset-password?code=recover-password-fixture");
  const main = page.getByRole("main");
  await main.getByLabel("New password", { exact: true }).fill("Fresh password for fixture");
  await main.getByLabel("Confirm password", { exact: true }).fill("Fresh password for fixture");
  await main.getByRole("button", { name: "Update password" }).click();
  await expect(page).toHaveURL(/\/login\?reason=reset$/);
  await expect(page.getByText("Password updated. Sign in with your new password.")).toBeVisible();
  expect(calls.some(({ endpoint, method }) => endpoint === "user" && method === "PUT")).toBe(true);
  expect(calls.some(({ endpoint }) => endpoint === "logout")).toBe(true);
});

test("expired confirmation links provide a route back to signup", async ({ page }) => {
  await mockAuth(page);
  await page.goto("/auth/callback?error_code=otp_expired");
  await expect(page.getByRole("alert")).toContainText(
    "This confirmation link is invalid or expired.",
  );
  await expect(page).toHaveURL(/\/auth\/callback$/);
  await expect(
    page.getByRole("main").getByRole("link", { name: "Create Account" }),
  ).toHaveAttribute("href", "/signup");
});

test("an ordinary customer session cannot open password reset controls without a recovery link", async ({
  page,
}) => {
  await seedSession(page);
  const requests = await mockAuth(page);
  await page.goto("/reset-password");
  await expect(page.getByRole("alert")).toContainText("invalid or expired");
  await expect(page.getByLabel("New password", { exact: true })).toHaveCount(0);
  expect(requests.some(({ endpoint, method }) => endpoint === "user" && method === "PUT")).toBe(
    false,
  );
});

test("a protected account restores a verified session without exposing admin controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release!: () => void;
  const delayUser = new Promise<void>((resolve) => {
    release = resolve;
  });
  await seedSession(page);
  await mockAuth(page, { delayUser });
  await page.goto("/account");
  const banner = page.getByRole("banner");
  try {
    await expect(banner.getByRole("status")).toContainText("Checking account");
    await expect(banner.getByRole("link", { name: "Sign In" })).toHaveCount(0);
    await expect(page.getByText(fixtureEmail)).toHaveCount(0);
  } finally {
    release();
  }
  await expect(page.getByText(fixtureEmail)).toBeVisible();
  const account = banner.getByRole("button", { name: "Account", exact: true });
  await account.click();
  await expect(banner.getByRole("link", { name: "Account settings" })).toBeVisible();
  await expect(banner.getByRole("link", { name: /admin/i })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(account).toBeFocused();
  await page.getByRole("main").getByRole("button", { name: "Sign Out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(banner.getByRole("link", { name: "Sign In", exact: true })).toBeVisible();
});

test("a revoked session redirects to sign in and explains expiry", async ({ page }) => {
  await seedSession(page);
  await mockAuth(page, { revokeUser: true });
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login\?next=%2Faccount&reason=expired$/);
  await expect(page.getByText("Your session expired. Sign in to continue.")).toBeVisible();
});

test("mobile drawer links to account actions and reports failed sign-out", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await seedSession(page);
  await mockAuth(page, { failSignOut: true });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  const drawer = page.getByRole("dialog", { name: "Site navigation" });
  await expect(drawer.getByRole("link", { name: "Account settings" })).toBeVisible();
  await drawer.getByRole("button", { name: "Sign Out" }).click();
  await expect(drawer.getByRole("alert")).toContainText("You’re signed out on this device.");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});

test("signed-out account redirects and sign in preserves the selected cart", async ({ page }) => {
  await mockAuth(page);
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login\?next=%2Faccount$/);
  await page.goto("/projects/esp32-smart-irrigation-system");
  await page.getByRole("radio", { name: /Premium/ }).check();
  await page.getByRole("checkbox", { name: /Hardware Kit/ }).check();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.goto("/login?next=%2Fcart");
  await page.getByLabel("Email address").fill(fixtureEmail);
  await page.getByLabel("Password", { exact: true }).fill(fixturePassword);
  await page.getByRole("main").getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole("banner").getByRole("link", { name: "Cart, 1 item" })).toBeVisible();
  await expect(page.getByRole("main").getByText("Premium", { exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByText("₹10,398", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Smart Irrigation System using ESP32" }),
  ).toBeVisible();
});

test("authentication pages and header reflow from 320px through desktop", async ({ page }) => {
  await mockAuth(page);
  for (const path of ["/login", "/signup", "/forgot-password"]) {
    await page.goto(path);
    await page.getByRole("main").locator("form").waitFor();
    for (const width of [320, 360, 390, 430, 720, 768, 1024, 1200, 1280, 1440]) {
      await page.setViewportSize({ width, height: 700 });
      expect(
        await page.evaluate(() =>
          Math.max(
            document.documentElement.scrollWidth,
            document.querySelector("header")?.scrollWidth ?? 0,
          ),
        ),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("the complete credential page fits short desktop and phone screens", async ({ page }) => {
  await mockAuth(page);
  for (const path of ["/login", "/signup"]) {
    await page.goto(path);
    await page.getByRole("main").locator("form").waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const [width, height] of [
      [1280, 640],
      [1366, 650],
      [1024, 640],
      [1440, 900],
      [360, 800],
      [390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      const size = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        footerBottom: document.querySelector("footer")!.getBoundingClientRect().bottom,
      }));
      expect(size.width).toBeLessThanOrEqual(width);
      expect(size.height).toBeLessThanOrEqual(height + 1);
      expect(size.footerBottom).toBeLessThanOrEqual(height + 1);
    }
  }
});
