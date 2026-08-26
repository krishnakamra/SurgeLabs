// Screenshots the live sites listed in content/portfolio.ts.
//
// Usage
//   npm run shots                          capture everything still missing
//   npm run shots -- --force               re-capture everything
//   npm run shots -- --only=acme-dental    one entry
//   npm run shots -- --url=https://x.ca --slug=x    capture before adding the entry
//   npm run shots -- --motion              also record a scroll capture
//
// Requires Playwright:  npm i -D playwright && npx playwright install chromium
//
// WHY THE SETTINGS ARE WHAT THEY ARE
//
//   4:3 at 1440 wide, because that is the aspect the portfolio card reserves.
//   Capturing 16:9 and letting object-fit crop it means the bottom third of
//   every screenshot is thrown away, and the bottom third is usually where
//   the thing worth showing is.
//
//   deviceScaleFactor 2, because a 1440-wide screenshot displayed at 1440 CSS
//   pixels on a retina screen is visibly soft, and text in a screenshot is
//   the whole point.
//
//   The scroll-down-and-back before the shot is not decoration: most sites
//   lazy-load images below the fold, and a screenshot taken without it has
//   grey rectangles where the photographs are.
//
//   prefers-reduced-motion is forced on, so entrance animations have settled
//   and the hero is not caught mid-fade.

import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { portfolio } from "../content/portfolio.ts";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");

const VIEWPORT = { width: 1440, height: 1080 };
const SCALE = 2;
const JPEG_QUALITY = 78;

const args = process.argv.slice(2);
const flag = (name) => args.some((a) => a === `--${name}`);
const value = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

const force = flag("force");
const withMotion = flag("motion");
const only = value("only");
const adhocUrl = value("url");
const adhocSlug = value("slug");

function targets() {
  if (adhocUrl) {
    if (!adhocSlug) {
      throw new Error("--url needs --slug too, so the file has a name: --url=https://x.ca --slug=x");
    }
    return [{ slug: adhocSlug, url: adhocUrl, shot: { src: `/portfolio/${adhocSlug}.jpg` } }];
  }
  const list = only ? portfolio.filter((item) => item.slug === only) : portfolio;
  if (only && list.length === 0) throw new Error(`no entry with slug "${only}" in content/portfolio.ts`);
  return list;
}

async function settle(page) {
  // Let anything that loads on scroll actually load.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

async function main() {
  const list = targets();
  if (list.length === 0) {
    console.log("content/portfolio.ts is empty — nothing to capture yet. See docs/PORTFOLIO.md.");
    return;
  }

  const browser = await chromium.launch();
  let captured = 0;
  let skipped = 0;
  const failures = [];

  for (const item of list) {
    const out = join(PUBLIC, item.shot.src.replace(/^\//, ""));
    if (!force && existsSync(out)) {
      skipped += 1;
      continue;
    }
    mkdirSync(dirname(out), { recursive: true });

    const motionDir = join(PUBLIC, "portfolio", "motion");
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      reducedMotion: "reduce",
      ...(withMotion ? { recordVideo: { dir: motionDir, size: VIEWPORT } } : {}),
    });
    const page = await context.newPage();

    try {
      await page.goto(item.url, { waitUntil: "networkidle", timeout: 45_000 });
      await settle(page);
      await page.screenshot({ path: out, type: "jpeg", quality: JPEG_QUALITY });
      console.log(`  ✓ ${item.slug.padEnd(28)} ${item.url}`);
      captured += 1;
    } catch (error) {
      failures.push(`${item.slug}: ${error.message.split("\n")[0]}`);
      console.log(`  ✗ ${item.slug.padEnd(28)} ${error.message.split("\n")[0]}`);
    } finally {
      await page.close();
      await context.close();
    }
  }

  await browser.close();

  console.log(`\n  captured ${captured}, already had ${skipped}, failed ${failures.length}`);
  if (withMotion) {
    console.log("  scroll captures are in public/portfolio/motion — rename them to match the slug");
    console.log("  and add a `motion` field to the entry. The still stays as the fallback.");
  }
  if (failures.length > 0) process.exitCode = 1;
}

await main();
