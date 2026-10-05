/**
 * Screenshots the live client sites shown on /free-homepage.
 *
 *   node scripts/capture-work.mjs            every site
 *   node scripts/capture-work.mjs solvex…    one site
 *
 * The shots are real pages, captured from the real domains, and they go to
 * public/work/sites as PNG. They are NOT converted here: next/image does that
 * at request time and `images.formats` in next.config.ts puts AVIF first and
 * WebP second, so the browser gets whichever it supports and the PNG on disk
 * stays the editable original.
 *
 * Playwright is not a dependency of this project and should not become one —
 * it is a 300MB install for a script that runs when a client redesigns. Run
 * it from a scratch directory:
 *
 *   mkdir -p /tmp/shots && cd /tmp/shots && npm i playwright
 *   NODE_PATH=/tmp/shots/node_modules node scripts/capture-work.mjs
 *
 * WHY EACH KNOB IS HERE, because every one of them was a wrong screenshot
 * first:
 *
 *   · the scroll-down-then-back pass triggers lazy images and reveal
 *     animations, which otherwise shoot as empty space
 *   · `offsetY` exists because one site's hero is a near-black video that
 *     never decodes headless — it is shot below the fold instead, and that is
 *     a per-site fact rather than a bug to fix generically
 *   · the overlay sweep removes cookie bars, chat bubbles and floating call
 *     buttons, none of which are the client's design
 *   · the `waitForGone` text is for intro sequences that cover the page; one
 *     site leaves its loader in the DOM with a class saying it is done, still
 *     painted, which no amount of waiting fixes
 */
import { mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/work/sites");

/** Keep in step with `work` in content/free-homepage.ts. */
const SITES = [
  { slug: "solvexconstruction", url: "https://solvexconstruction.ca/" },
  {
    slug: "grandarchitects",
    url: "https://grandarchitects.ca/",
    // Its hero is a dark video that does not decode in headless Chromium, so
    // the desktop shot is taken past it, on the first section with real
    // photography in it.
    offsetY: 1250,
    waitForGone: ".seq-loader",
  },
  { slug: "areterenovation", url: "https://www.areterenovation.ca/" },
  { slug: "ccscleanings", url: "https://ccscleanings.ca/" },
  { slug: "guardianfirst", url: "https://guardianfirst.ca/" },
  { slug: "axellottetech", url: "https://axellottetech.com/" },
];

const VIEWS = [
  { kind: "desktop", viewport: { width: 1440, height: 900 }, scale: 1, mobile: false },
  // scale 1, not 2. The phone frame renders at 80 CSS px, so a 390px
  // source already covers it at 4x; a 780px one was 3.6MB of repo for
  // pixels next/image throws away on every request.
  { kind: "mobile", viewport: { width: 390, height: 844 }, scale: 1, mobile: true },
];

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const only = process.argv[2];
const targets = only ? SITES.filter((s) => s.slug === only) : SITES;
if (targets.length === 0) {
  console.error(`No site named "${only}". Known: ${SITES.map((s) => s.slug).join(", ")}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

/**
 * Playwright normally finds its own browser. It cannot when the Chromium on
 * the machine was installed by something else — a CI image or a sandbox that
 * ships one build and a newer `playwright` that wants another. Rather than
 * fail with "run npx playwright install" on a machine that already has a
 * browser, look in PLAYWRIGHT_BROWSERS_PATH (Playwright's own variable) for
 * whatever Chromium is actually there.
 */
function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root) return undefined;
  try {
    const build = readdirSync(root)
      .filter((d) => d.startsWith("chromium-"))
      .sort()
      .pop();
    return build ? join(root, build, "chrome-linux", "chrome") : undefined;
  } catch {
    return undefined;
  }
}

const browser = await chromium.launch({
  executablePath: findChromium(),
  // --hide-scrollbars: a scrollbar gutter in the shot reads as a rendering
  // fault once the image is inside a laptop bezel.
  args: ["--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
  ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
});

let failures = 0;

for (const site of targets) {
  for (const view of VIEWS) {
    const context = await browser.newContext({
      viewport: view.viewport,
      deviceScaleFactor: view.scale,
      isMobile: view.mobile,
      hasTouch: view.mobile,
      userAgent: view.mobile ? IPHONE_UA : undefined,
      reducedMotion: "reduce",
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    const file = `${OUT}/${site.slug}-${view.kind}.png`;

    try {
      await page.goto(site.url, { waitUntil: "load", timeout: 90_000 });
      await page.waitForTimeout(3_000);

      if (site.waitForGone) {
        await page.evaluate((sel) => {
          document.querySelectorAll(sel).forEach((el) => el.remove());
        }, site.waitForGone);
      }

      // Lazy content and reveal-on-scroll, then back to where we want to shoot.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
      await page.waitForTimeout(2_500);
      await page.evaluate((y) => window.scrollTo(0, y), site.offsetY ?? 0);
      await page.waitForTimeout(2_500);

      // Cookie bars, chat bubbles, floating call buttons — not the design.
      await page.evaluate(() => {
        const junk = /cookie|consent|gdpr|newsletter|popup|modal|chat|whatsapp|call-?now|float/i;
        document.querySelectorAll("body *").forEach((el) => {
          if (getComputedStyle(el).position !== "fixed") return;
          if (junk.test(`${el.className} ${el.id}`)) el.remove();
        });
      });
      await page.waitForTimeout(400);

      await page.screenshot({ path: file });
      console.log(`  ✓ ${site.slug} ${view.kind}`);
    } catch (error) {
      failures++;
      console.log(`  ✗ ${site.slug} ${view.kind}: ${String(error).split("\n")[0]}`);
    }

    await context.close();
  }
}

await browser.close();

console.log(
  failures
    ? `\n✗ ${failures} capture(s) failed. The old file is still in place for each one.\n`
    : `\n✓ captured ${targets.length} site(s) into public/work/sites\n` +
      "  Open each one before shipping. A site that redesigned, broke, or put a\n" +
      "  cookie wall up since the last run will have captured cleanly and wrongly.\n",
);
process.exit(failures ? 1 : 0);
