#!/usr/bin/env node
import { chromium } from "playwright-core";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const outDir = resolve(repoRoot, "screenshots");
if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const URL = process.env.URL ?? "http://127.0.0.1:5173";

const FORCE_VISIBLE = `
.reveal { opacity: 1 !important; transform: none !important; filter: none !important; }
.hero-rise, .char-rise, .toast-pop { opacity: 1 !important; transform: none !important; filter: none !important; }
`;

const SHOTS = [
  { name: "01-desktop-hero",        viewport: { w: 1440, h: 900 }, dsf: 2, settle: 2400 },
  { name: "02-desktop-offers",      viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#promocje", settle: 1400 },
  { name: "03-desktop-how",         viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#how",      settle: 1600 },
  { name: "04-desktop-trust",       viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#trust",    settle: 2000 },
  { name: "05-desktop-menu",        viewport: { w: 1440, h: 900 }, dsf: 2, action: openMenu, settle: 100 },
  { name: "06-desktop-full",        viewport: { w: 1280, h: 800 }, dsf: 1, forceVisible: true, fullPage: true, settle: 2400, scrollDance: true },
  { name: "07-mobile-hero",         viewport: { w: 390,  h: 844 }, dsf: 3, mobile: true, settle: 2400 },
  { name: "08-mobile-offers",       viewport: { w: 390,  h: 844 }, dsf: 3, mobile: true, scrollTo: "#promocje", settle: 1400 },
  { name: "09-mobile-how",          viewport: { w: 390,  h: 844 }, dsf: 3, mobile: true, scrollTo: "#how",      settle: 1600 },
  { name: "10-mobile-trust",        viewport: { w: 390,  h: 844 }, dsf: 3, mobile: true, scrollTo: "#trust",    settle: 2000 },
  { name: "11-mobile-menu",         viewport: { w: 390,  h: 844 }, dsf: 3, mobile: true, action: openMenu, settle: 100 },
];

async function openMenu(page) {
  await page.click(".hamburger");
  await page.waitForTimeout(900);
}

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const shot of SHOTS) {
  const ctx = await browser.newContext({
    viewport: { width: shot.viewport.w, height: shot.viewport.h },
    deviceScaleFactor: shot.dsf ?? 1,
    isMobile: !!shot.mobile,
    hasTouch: !!shot.mobile,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (err) => console.error(`[${shot.name}] pageerror:`, err.message));

  await page.goto(URL, { waitUntil: "domcontentloaded" });
  if (shot.forceVisible) await page.addStyleTag({ content: FORCE_VISIBLE });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(900);

  if (shot.scrollDance) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }

  if (shot.scrollTo) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, shot.scrollTo);
    await page.waitForTimeout(600);
  }

  if (shot.action) await shot.action(page);

  await page.waitForTimeout(shot.settle ?? 800);

  const file = resolve(outDir, `${shot.name}.png`);
  await page.screenshot({
    path: file,
    fullPage: !!shot.fullPage,
    type: "png",
  });
  console.log(`✓ ${shot.name}.png`);

  await ctx.close();
}

await browser.close();
console.log("done");
