/**
 * Cuts every brand asset from lib/brand/mark.ts.
 *
 *   npm run gen:brand
 *
 * Writes the handoff SVGs in public/brand, the favicon set in app/, and the
 * PWA icons the manifest points at. Nothing here is hand-drawn and nothing
 * here should be hand-edited — change the geometry and re-run, or the .ico
 * and the .svg start disagreeing about what the logo is, which is exactly the
 * failure this script exists to make impossible.
 *
 * No image dependency. The mark is one closed polygon of straight edges, so
 * scripts/lib/raster.mjs rasterises it directly — see the note at the top of
 * that file for why that beat adding sharp.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  coverage,
  flattenPath,
  compose,
  rgb,
  encodePNG,
  encodeICO,
} from "./lib/raster.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const {
  MARK_D,
  MARK_X,
  MARK_Y,
  MARK_W,
  MARK_H,
  MARK_ASPECT,
  SURGE_D,
  LABS_D,
  LABS_DX,
  STACK_LEADING,
  STACK_VIEWBOX,
  WORDMARK_W,
  WORDMARK_H,
  CLEAR_SPACE,
  SURFACE_COLOR,
  PLATE_COLOR,
} = await import(join(root, "lib", "brand", "mark.ts"));

const brandDir = join(root, "public", "brand");
const appDir = join(root, "app");
mkdirSync(brandDir, { recursive: true });

/**
 * The mark inside an app icon, as a fraction of the tile. 0.70 leaves 15% of
 * the tile as margin on each side, which is what stops the S touching the
 * rounded corners iOS and Android draw over the top of it. One number for
 * every size on purpose: an icon that changes proportion between 16px and
 * 512px is the same defect as a wordmark that changes shape.
 */
const ICON_SCALE = 0.7;

/** Android's maskable safe zone is the middle 80%, so the mark comes in. */
const MASKABLE_SCALE = 0.52;

const round = (n) => Math.round(n * 100) / 100;

/**
 * An XML comment, with the rule that XML actually enforces.
 *
 * `--` is illegal inside a comment, and an SVG that breaks it does not fail
 * loudly: it still serves 200 with the right content type, and a browser
 * loading it through <img> parses it as XML, hits the error and renders
 * nothing at all — naturalWidth 0, a broken-image box, no console message
 * worth the name. This shipped once, in the tab icon, because the obvious way
 * to explain the colours was to name the CSS custom properties they come
 * from: `--color-accent`. Throwing here is the only way that mistake announces
 * itself.
 */
function comment(text) {
  if (text.includes("--")) {
    throw new Error(
      `SVG comment contains "--", which XML forbids inside a comment:\n  ${text.trim()}`,
    );
  }
  return `<!-- ${text} -->`;
}

/**
 * Last line of defence. Runs over every file this script writes, so a comment
 * built by string concatenation somewhere below cannot slip past `comment()`.
 */
function assertWellFormed(svg, name) {
  for (const [, body] of svg.matchAll(/<!--([\s\S]*?)-->/g)) {
    if (body.includes("--")) throw new Error(`${name}: illegal "--" inside an XML comment`);
  }
  if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(svg)) {
    throw new Error(`${name}: unescaped "&"`);
  }
  if (!svg.trimStart().startsWith("<svg") || !svg.trimEnd().endsWith("</svg>")) {
    throw new Error(`${name}: does not open and close with <svg>`);
  }
}

/* ── SVG export ─────────────────────────────────────────────────────────── */

/**
 * A handoff lockup. Clear space is built into the viewBox and filled with the
 * surface colour, so placing the file as supplied already honours the rule.
 *
 * The paths are the client's, unaltered. Only the fills are ours, and they
 * are flattened to literal hexes here because a flat file has no
 * [data-surface] to inherit from.
 */
function lockupSVG(variant, surface) {
  const { fg, accent, bg } = SURFACE_COLOR[surface];
  const label = "Surge Labs";

  let inner;
  let vb;

  if (variant === "mark") {
    vb = { x: MARK_X, y: MARK_Y, w: MARK_W, h: MARK_H };
    inner = `  <path d="${MARK_D}" fill="${fg}"/>`;
  } else if (variant === "horizontal") {
    vb = { x: 0, y: 0, w: WORDMARK_W, h: WORDMARK_H };
    inner = [
      `  <g fill="${fg}">`,
      ...SURGE_D.map((d) => `    <path d="${d}"/>`),
      `  </g>`,
      `  <g fill="${accent}">`,
      ...LABS_D.map((d) => `    <path d="${d}"/>`),
      `  </g>`,
    ].join("\n");
  } else {
    const [x, y, w, h] = STACK_VIEWBOX.split(" ").map(Number);
    vb = { x, y, w, h };
    inner = [
      `  <g fill="${fg}">`,
      ...SURGE_D.map((d) => `    <path d="${d}"/>`),
      `  </g>`,
      `  <g fill="${accent}" transform="translate(${round(LABS_DX)} ${STACK_LEADING})">`,
      ...LABS_D.map((d) => `    <path d="${d}"/>`),
      `  </g>`,
    ].join("\n");
  }

  // Clear space is a fraction of the artwork's HEIGHT on every side, so a
  // wide lockup and a tall one get the same optical margin.
  const pad = round(vb.h * CLEAR_SPACE);
  const w = round(vb.w + pad * 2);
  const h = round(vb.h + pad * 2);
  const note = comment(`Generated by scripts/generate-brand-assets.mjs from lib/brand/mark.ts.
       Do not edit: re-run \`npm run gen:brand\`.
       Artwork is the supplied logo, unaltered. Only the fills are set here.
       The ${pad}-unit margin IS the clear space rule, a quarter of the
       artwork's height on every side. Place this file as-is and the rule is
       already honoured.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${round(vb.x - pad)} ${round(vb.y - pad)} ${w} ${h}" role="img" aria-label="${label}">
  <title>${label}</title>
  ${note}
  <rect x="${round(vb.x - pad)}" y="${round(vb.y - pad)}" width="${w}" height="${h}" fill="${bg}"/>
${inner}
</svg>
`;
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

/**
 * The app icon: a solid accent plate with the S knocked out of it.
 *
 * The mark is 1.36:1, so it is fitted by WIDTH inside the square tile and
 * centred vertically. Fitting by height would run it off both sides.
 */
function iconGeometry(scale = ICON_SCALE) {
  const w = 64 * scale;
  const h = w / MARK_ASPECT;
  const k = w / MARK_W;
  return { w, h, k, dx: (64 - w) / 2, dy: (64 - h) / 2 };
}

function iconSVG(scale = ICON_SCALE) {
  const g = iconGeometry(scale);
  const note = comment(`Generated by scripts/generate-brand-assets.mjs. Do not edit.
       The tab icon is the mark KNOCKED OUT of the accent plate, not the bare
       mark: at 16px a solid fill with a hole in it survives where an outline
       does not, and a knockout is what this would be on a press anyway.
       ${PLATE_COLOR.fill} under ${PLATE_COLOR.knockout}, at 8.22:1.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="Surge Labs">
  <title>Surge Labs</title>
  ${note}
  <rect width="64" height="64" fill="${PLATE_COLOR.fill}"/>
  <g transform="translate(${round(g.dx)} ${round(g.dy)}) scale(${round(g.k)}) translate(${-MARK_X} ${-MARK_Y})">
    <path d="${MARK_D}" fill="${PLATE_COLOR.knockout}"/>
  </g>
</svg>
`;
}

/**
 * Raster icons, rendered by flattening the mark's curves to a polygon and
 * sampling it — see scripts/lib/raster.mjs. The S is a single closed contour
 * with no counter, which is the one case where a single-ring rasteriser is
 * enough and adding an image dependency would not be.
 */
function plateIcon(size, scale = ICON_SCALE) {
  const g = iconGeometry(scale);
  const poly = flattenPath(MARK_D).map(([x, y]) => [
    (x - MARK_X) * g.k * (size / 64) + g.dx * (size / 64),
    (y - MARK_Y) * g.k * (size / 64) + g.dy * (size / 64),
  ]);
  const cov = coverage(poly, size, 8);
  return compose(cov, size, rgb(PLATE_COLOR.fill), rgb(PLATE_COLOR.knockout));
}

/* ── Write ──────────────────────────────────────────────────────────────── */

const written = [];
function write(path, data) {
  if (path.endsWith(".svg")) assertWellFormed(data, path.replace(`${root}/`, ""));
  writeFileSync(path, data);
  written.push(path.replace(`${root}/`, ""));
}

for (const variant of ["horizontal", "stacked", "mark"]) {
  for (const surface of ["ink", "stock"]) {
    write(join(brandDir, `surge-labs-${variant}-${surface}.svg`), lockupSVG(variant, surface));
  }
}

const icon = iconSVG();
write(join(appDir, "icon.svg"), icon);
// The same file in the handoff pack. app/icon.svg is a Next metadata route —
// it is served, but with a content hash appended by the <link> Next emits, so
// anything that wants to reference it by a stable path uses this copy.
write(join(brandDir, "icon.svg"), icon);

// favicon.ico — 16/32/48 in one file. Browsers pick; 48 is what Windows uses
// for a pinned tile and what a retina tab strip samples down from.
write(
  join(appDir, "favicon.ico"),
  encodeICO([16, 32, 48].map((size) => ({ size, rgba: plateIcon(size) }))),
);

// iOS. No transparency, no rounded corners of our own — the OS masks it.
write(join(appDir, "apple-icon.png"), encodePNG(180, plateIcon(180)));

// The manifest set.
write(join(brandDir, "icon-192.png"), encodePNG(192, plateIcon(192)));
write(join(brandDir, "icon-512.png"), encodePNG(512, plateIcon(512)));
write(
  join(brandDir, "icon-maskable-512.png"),
  encodePNG(512, plateIcon(512, MASKABLE_SCALE)),
);

console.log(`Brand assets cut from lib/brand/mark.ts:\n${written.map((f) => `  ${f}`).join("\n")}`);
