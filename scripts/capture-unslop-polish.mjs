import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 8443;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.resolve("docs/02-design-system/screenshots/stage3");

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
  { name: "projects", path: "/projects" },
  { name: "detail", path: "/projects/autonomous-obstacle-avoidance-rover" },
  { name: "checkout", path: "/checkout" },
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

      for (const route of routes) {
        const url = `${BASE_URL}${route.path}`;
        await page.goto(url, { waitUntil: "load" });
        await page.waitForTimeout(600);

        const overflowInfo = await page.evaluate(() => ({
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        if (overflowInfo.hasOverflow) {
          overflowCount += 1;
          console.warn(
            `[OVERFLOW] ${route.name} @ ${vp.name}: scrollWidth=${overflowInfo.scrollWidth} > clientWidth=${overflowInfo.clientWidth}`,
          );
        } else {
          console.log(
            `[OK] ${route.name} @ ${vp.name}: ${overflowInfo.scrollWidth}/${overflowInfo.clientWidth}`,
          );
        }

        if (route.name === "home" || vp.name === "desktop-1440" || vp.name === "mobile-390") {
          const filePath = path.join(OUTPUT_DIR, `${route.name}-${vp.name}.png`);
          await page.screenshot({ path: filePath, fullPage: true });
        }
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
  console.log("Stage 3 multi-route screenshot verification complete with 0 horizontal overflow!");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
