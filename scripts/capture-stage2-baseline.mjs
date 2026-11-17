import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:8443";
const OUTPUT_DIR = path.resolve("docs/02-design-system/screenshots/stage2");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`Capturing baseline: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    const url = `${BASE_URL}/`;
    console.log(`  Visiting ${url}...`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const filePath = path.join(OUTPUT_DIR, `home-before-${vp.name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`  Saved baseline: ${filePath}`);

    await context.close();
  }

  await browser.close();
  console.log("Stage 2 baseline capture complete.");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
