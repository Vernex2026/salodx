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

/* Lock the 3D carousel at a stable angle showing 3 cards visible.
   -18deg rotation positions mBank (0deg) just left of centre, Santander
   (72deg) further left, ING (-72deg, equivalent) on the right — gives
   a balanced 3-card view for the hero screenshot. */
const CAROUSEL_LOCK = `
.carousel-3d { animation: none !important; transform: rotateY(-18deg) !important; }
.carousel-spotlight { animation: none !important; opacity: 0.6 !important; }
`;

const SHOTS = [
  /* ── Desktop (6) ───────────────────────────────────────────── */
  { name: "01-desktop-hero",   viewport: { w: 1440, h: 900 }, dsf: 2, settle: 2200, lockCarousel: true },
  { name: "02-desktop-offers", viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#promocje", settle: 1500 },
  { name: "03-desktop-how",    viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#how",      settle: 1800 },
  { name: "04-desktop-trust",  viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#trust",    settle: 1800 },
  { name: "05-desktop-footer", viewport: { w: 1440, h: 900 }, dsf: 2, scrollTo: "#next",     settle: 1200 },
  { name: "06-desktop-menu",   viewport: { w: 1440, h: 900 }, dsf: 2, action: openMenu, settle: 800 },

  /* ── Mobile (4) ────────────────────────────────────────────── */
  { name: "07-mobile-hero",   viewport: { w: 390, h: 844 }, dsf: 3, mobile: true, settle: 2000, lockCarousel: true },
  { name: "08-mobile-offers", viewport: { w: 390, h: 844 }, dsf: 3, mobile: true, scrollTo: "#promocje", settle: 1500 },
  { name: "09-mobile-how",    viewport: { w: 390, h: 844 }, dsf: 3, mobile: true, scrollTo: "#how",      settle: 1800 },
  { name: "10-mobile-menu",   viewport: { w: 390, h: 844 }, dsf: 3, mobile: true, action: openMenu, settle: 800 },

  /* ── Bonus: full-page overview ─────────────────────────────── */
  { name: "11-desktop-full",  viewport: { w: 1280, h: 800 }, dsf: 1, forceVisible: true, fullPage: true, settle: 2400, scrollDance: true, lockCarousel: true },
];

async function openMenu(page) {
  await page.click(".hamburger");
  await page.waitForTimeout(900);
}

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=swiftshader"],
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
  if (shot.lockCarousel) await page.addStyleTag({ content: CAROUSEL_LOCK });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(900);

  if (shot.scrollDance) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  }

  if (shot.scrollTo) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, shot.scrollTo);
    await page.waitForTimeout(700);
  }

  if (shot.action) await shot.action(page);

  if (shot.waitR3F) {
    // Force two RAFs to guarantee R3F has rendered the frame buffer
    await page.evaluate(
      () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r()))
        )
    );
  }

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
