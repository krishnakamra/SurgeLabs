/**
 * Renders the photo version of the price card.
 *
 *   npm run ad:photo
 *
 * Same offers, same prices and the same logo as `npm run ad` — the
 * difference is that this one puts the product photography behind the
 * numbers. Prices still come out of content/packages.ts, so the two cards
 * and the website cannot disagree.
 *
 * NEEDS THE PHOTOGRAPHY ON DISK. The plates live on Higgsfield's CDN and
 * content/media.ts records where; `node scripts/fetch-media.mjs` downloads
 * them into public/media/stills. Until that has run this script exits with
 * the list of what is missing rather than rendering four grey boxes.
 *
 *   PHOTO_DIR=/some/dir  point it at photographs somewhere else. Files are
 *                        looked up by the media id, any of .jpg/.jpeg/.png.
 *
 * Requires Playwright:  npm i -D playwright && npx playwright install chromium
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { photoAdHtml, FORMATS } from "./ad/photo-template.mjs";

const root = process.cwd();
const OUT = join(root, "ads");
const PHOTO_DIR = process.env.PHOTO_DIR || join(root, "public", "media", "stills");

const { site } = await import(join(root, "content", "site.ts"));
const { alaCarte, packages, priceLabel } = await import(join(root, "content", "packages.ts"));

function find(list, name) {
  const hit = list.find((item) => item.name === name);
  if (!hit) throw new Error(`content/packages.ts no longer has "${name}" — update scripts/make-photo-ad.mjs`);
  return hit;
}

const cards = packages.find((p) => p.slug === "business-cards");
const website = find(alaCarte, "Website");
const flyers = find(alaCarte, "Flyers, 8.5×11 on 100lb gloss text");
const tees = find(alaCarte, "Printed tees, no minimum");

const strip = (v) => v.replace(/^from\s+/i, "from ");

/* ── The four offers ──────────────────────────────────────────────────────
   `photo` is a media id from content/media.ts. The captions describe the
   stock, not a past job: these are staged plates, not photographs of work
   this shop ran, and nothing here implies otherwise. */
const offers = [
  {
    key: "cards",
    photo: "g-cards-16pt",
    name: "1,000 business cards",
    spec: "16pt matte, printed both sides. Design included.",
    price: priceLabel(cards),
  },
  {
    key: "flyers",
    photo: "g-print-flyers",
    name: "500 flyers",
    spec: "8.5 × 11 on 100lb gloss text.",
    price: strip(flyers.price),
  },
  {
    key: "tees",
    photo: "g-wear-tees",
    name: "Printed t-shirts",
    spec: "Full colour, no minimum. One shirt is a real order.",
    price: `${strip(tees.price)} ea`,
  },
  {
    key: "web",
    photo: "panel-web",
    name: "Websites",
    spec: "Built, live, works on a phone. You own it.",
    price: strip(website.price),
  },
];

/* ── Assets ───────────────────────────────────────────────────────────────
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

/* Photographs, inlined as data URIs for the same reason as the fonts. */
const EXT = [".jpg", ".jpeg", ".png", ".webp"];
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

const photos = {};
const missing = [];
for (const o of offers) {
  const hit = EXT.map((e) => [join(PHOTO_DIR, o.photo + e), e]).find(([p]) => existsSync(p));
  if (!hit) {
    missing.push(`${o.photo}(${EXT.join("|")})`);
    continue;
  }
  const [path, ext] = hit;
  photos[o.key] = `data:${MIME[ext]};base64,${readFileSync(path).toString("base64")}`;
}

if (missing.length) {
  console.error(`\n  Missing photography in ${PHOTO_DIR}:\n`);
  for (const m of missing) console.error(`    · ${m}`);
  console.error(`\n  Run  node scripts/fetch-media.mjs  from a network that can reach the CDN,`);
  console.error(`  or set PHOTO_DIR to a folder holding these files.\n`);
  process.exit(1);
}

const COPY = {
  kicker: "Mississauga · print, signs, shirts, web",
  headline: "Everything your brand gets printed on. One shop.",
};

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );

  for (const [format, size] of Object.entries(FORMATS)) {
    const html = photoAdHtml({ format, offers, site, logoSvg, fonts, photos, ...COPY });
    const page = await browser.newPage({
      viewport: { width: size.w, height: size.h },
      deviceScaleFactor: 2, // 2× so the type holds up when a platform re-encodes it
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(OUT, `surge-labs-photo-${format}.jpg`), type: "jpeg", quality: 92 });
    await page.close();
    console.log(`  ✓ ${format.padEnd(7)} ${size.w}×${size.h}  ${size.label}`);
  }

  await browser.close();
  console.log(`\n  Files in ads/. Prices came from content/packages.ts — change them there and re-run.\n`);
}

await main();
