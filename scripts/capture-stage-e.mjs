import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 8443;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.resolve("docs/02-design-system/screenshots/stage-e");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

async function isServerUp() {
  try {
    const res = await fetch(BASE_URL);
    return res.ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await isServerUp()) return null;
  const child = spawn("pnpm", ["preview", "--port", String(PORT), "--strictPort"], {
    shell: true,
    stdio: "ignore",
  });
  for (let i = 0; i < 30; i += 1) {
    if (await isServerUp()) return child;
    await new Promise((r) => setTimeout(r, 250));
  }
  child.kill();
  throw new Error(`Preview server did not start on ${BASE_URL}`);
}

async function capture() {
  const server = await ensureServer();
  const browser = await chromium.launch({ headless: true });
  let overflowCount = 0;

  try {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      await page.goto(`${BASE_URL}/custom-project`, { waitUntil: "load" });
      await page.waitForTimeout(400);

      const overflowInfo = await page.evaluate(() => ({
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      if (overflowInfo.hasOverflow) {
        overflowCount += 1;
        console.warn(
          `[OVERFLOW] custom-project @ ${vp.name}: ${overflowInfo.scrollWidth} > ${overflowInfo.clientWidth}`,
        );
      } else {
        console.log(
          `[OK] custom-project @ ${vp.name}: ${overflowInfo.scrollWidth}/${overflowInfo.clientWidth}`,
        );
      }

      const filePath = path.join(OUTPUT_DIR, `custom-project-${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });

      // Capture review screen on desktop
      if (vp.name === "desktop-1440") {
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

        await page.getByRole("button", { name: "Review Requisition" }).click();
        await page.waitForTimeout(250);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, "custom-project-review-1440.png"),
          fullPage: true,
        });
      }

      await context.close();
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }

  if (overflowCount > 0) {
    console.error(`Finished with ${overflowCount} overflow issue(s).`);
    process.exit(1);
  }
  console.log("Stage E screenshot capture complete with 0 horizontal overflow!");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
