/**
 * Renders the shareable price card.
 *
 *   npm run ad                 all three formats into ads/
 *   npm run ad -- --open       …and print the paths
 *
 * The prices come out of content/packages.ts, so the card and the website
 * cannot disagree. Change a price there, re-run this, and the ad is correct.
 *
 * Requires Playwright:  npm i -D playwright && npx playwright install chromium
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { adHtml, FORMATS } from "./ad/template.mjs";

const root = process.cwd();
const OUT = join(root, "ads");

const { site } = await import(join(root, "content", "site.ts"));
const { alaCarte, packages, priceLabel } = await import(join(root, "content", "packages.ts"));

/* ── The four offers, pulled from the content layer ───────────────────────
   Named rather than derived by index: an ad is a specific claim and it should
   break loudly if the thing it is claiming stops existing. */
function find(list, name) {
  const hit = list.find((item) => item.name === name);
  if (!hit) throw new Error(`content/packages.ts no longer has "${name}" — update scripts/make-ad.mjs`);
  return hit;
}

const cards = packages.find((p) => p.slug === "business-cards");
const site599 = find(alaCarte, "Website");
const flyers = find(alaCarte, "Flyers, 8.5×11 on 100lb gloss text");
const tees = find(alaCarte, "Printed tees, no minimum");

const strip = (v) => v.replace(/^from\s+/i, "");

const offers = [
  {
    name: "1,000 business cards",
    spec: "Designed here. 16pt matte, printed both sides.",
    price: priceLabel(cards),
    from: false,
  },
  {
    name: "500 flyers",
    spec: `8.5 × 11 on 100lb gloss text. ${flyers.unit.replace(/^per /, "Per ")}.`,
    price: strip(flyers.price),
    from: true,
  },
  {
    name: "Printed t-shirts",
    spec: "Full colour, no minimum. One shirt is a real order.",
    price: `${strip(tees.price)} ea`,
    from: true,
  },
  {
    name: "Websites",
    spec: "Built, live, and it works on a phone. You own it.",
    price: strip(site599.price),
    from: true,
  },
];

/* ── Assets ──────────────────────────────────────────────────────────────
   The logo is the client's own vector, recoloured for the ink bed by
   scripts/generate-brand-assets.mjs. Never redrawn, never generated. */
const logoSvg = readFileSync(join(root, "public", "brand", "surge-labs-horizontal-ink.svg"), "utf8")
  .replace(/<\?xml[^>]*\?>/, "")
  .trim();

// Inlined so the render never touches the network — a missing webfont would
// silently fall back to Arial and the ad would ship in the wrong typeface.
const b64 = (p) => readFileSync(p).toString("base64");
const fonts = {
  display: b64(join(root, ".next", "static", "media", "904be59b21bd51cb-s.p.woff2")),
  body: b64(join(root, "public", "fonts", "Satoshi-Variable.woff2")),
};

const COPY = {
  kicker: "Mississauga · design, print, signs, shirts, web",
  headline: "One shop. One bill. Everything your brand gets printed on.",
};

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );

  const made = [];
  for (const [format, size] of Object.entries(FORMATS)) {
    const html = adHtml({ format, offers, site, logoSvg, fonts, ...COPY });
    const page = await browser.newPage({
      viewport: { width: size.w, height: size.h },
      deviceScaleFactor: 2, // 2× so the type holds up when a platform re-encodes it
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const file = join(OUT, `surge-labs-prices-${format}.png`);
    await page.screenshot({ path: file });
    await page.close();
    made.push([file, size]);
    console.log(`  ✓ ${format.padEnd(7)} ${size.w}×${size.h}  ${size.label}`);
  }

  await browser.close();

  // The HTML too, so a price can be corrected and re-rendered without Node.
  writeFileSync(join(OUT, "preview.html"), adHtml({ format: "square", offers, site, logoSvg, fonts, ...COPY }));

  console.log(`\n  ${made.length} file(s) in ads/`);
  console.log("  Prices came from content/packages.ts — change them there and re-run.\n");
}

await main();
