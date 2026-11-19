import { defineConfig, devices } from "@playwright/test";

const testUrl = "http://localhost:8461";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: testUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: testUrl,
    reuseExistingServer: false,
    env: {
      PORT: "8461",
      VITE_SUPABASE_URL: `${testUrl}/__auth-fixture`,
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_levup_e2e_fixture",
      VITE_SUPABASE_ANON_KEY: "",
      CASHFREE_PAYMENTS_ENABLED: "false",
    },
    timeout: 120 * 1000,
  },
});
