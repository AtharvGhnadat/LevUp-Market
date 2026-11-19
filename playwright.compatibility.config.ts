import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig(config, {
  projects: [
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
