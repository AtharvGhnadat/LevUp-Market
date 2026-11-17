import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:8443";
const OUTPUT_DIR = path.resolve("docs/02-design-system/screenshots/audit");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

const routes = [
  { name: "home", path: "/" },
  { name: "catalog", path: "/projects" },
  { name: "project-detail", path: "/projects/ai-smart-irrigation-iot" },
  { name: "custom-project", path: "/custom-project" },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`Capturing viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`  Visiting ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      const filePath = path.join(OUTPUT_DIR, `${route.name}-${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`  Saved ${filePath}`);
    }

    // Capture cart drawer on 1440
    if (vp.name === "desktop-1440") {
      await page.goto(`${BASE_URL}/projects/ai-smart-irrigation-iot`, { waitUntil: "networkidle" });
      // Click Add to Cart
      const addToCartBtn = page.getByRole("button", { name: /Add to cart/i }).first();
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForTimeout(500);
        const cartPath = path.join(OUTPUT_DIR, `cart-drawer-${vp.name}.png`);
        await page.screenshot({ path: cartPath, fullPage: false });
        console.log(`  Saved ${cartPath}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log("All audit screenshots captured successfully!");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
