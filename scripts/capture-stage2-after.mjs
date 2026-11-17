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
    console.log(`Capturing after: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    const url = `${BASE_URL}/`;
    console.log(`  Visiting ${url}...`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    // Check for horizontal overflow
    const overflowInfo = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      return {
        hasOverflow: scrollWidth > clientWidth,
        scrollWidth,
        clientWidth,
      };
    });

    if (overflowInfo.hasOverflow) {
      console.warn(
        `  [WARNING] Horizontal overflow detected! scrollWidth=${overflowInfo.scrollWidth}, clientWidth=${overflowInfo.clientWidth}`,
      );
    } else {
      console.log(
        `  [OK] No horizontal overflow: scrollWidth=${overflowInfo.scrollWidth}, clientWidth=${overflowInfo.clientWidth}`,
      );
    }

    const filePath = path.join(OUTPUT_DIR, `home-after-${vp.name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`  Saved: ${filePath}`);

    // If mobile, check mobile menu
    if (vp.name === "mobile-390") {
      const menuBtn = page.getByRole("button", { name: /Open menu/i });
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        const menuPath = path.join(OUTPUT_DIR, `mobile-menu-open-390.png`);
        await page.screenshot({ path: menuPath, fullPage: false });
        console.log(`  Saved: ${menuPath}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log("Stage 2 after screenshot capture complete!");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
