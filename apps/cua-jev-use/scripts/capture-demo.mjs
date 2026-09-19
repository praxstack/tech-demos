import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ARTIFACTS = "/opt/cursor/artifacts";
const BASE = "http://localhost:5173";

async function main() {
  await mkdir(path.join(ARTIFACTS, "screenshots"), { recursive: true });
  await mkdir(path.join(ARTIFACTS, "videos"), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: path.join(ARTIFACTS, "videos"),
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector(".app-header");

  // Bug ticket triage
  await page.click('button.ticket-item:has-text("Can\'t log in")');
  await page.click('button.btn.primary:has-text("Ask Jev")');
  await page.waitForSelector(".primitive-card.lit", { timeout: 5000 });
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshots", "jev_triage_bug_fanout_complete.png"),
    fullPage: true,
  });

  // Billing ticket
  await page.click('button.ticket-item:has-text("Double charge")');
  await page.click('button.btn.primary:has-text("Ask Jev")');
  await page.waitForSelector(".routing-result", { timeout: 5000 });
  await page.waitForTimeout(1200);

  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshots", "jev_triage_billing_routing.png"),
    fullPage: true,
  });

  // Abuse ticket for escalate demo
  await page.click('button.ticket-item:has-text("incompetent")');
  await page.click('button.btn.primary:has-text("Ask Jev")');
  await page.waitForSelector(".action-escalate", { timeout: 5000 });
  await page.waitForTimeout(800);

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const src = await video.path();
    const dest = path.join(ARTIFACTS, "jev_triage_flow_demo.webm");
    const { rename } = await import("node:fs/promises");
    await rename(src, dest);
    console.log("Video:", dest);
  }

  console.log("Screenshots saved to", path.join(ARTIFACTS, "screenshots"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
