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
  fit,
  compose,
  rgb,
  encodePNG,
  encodeICO,
} from "./lib/raster.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const {
  MARK_SIZE,
  MARK_PATH,
  MARK_POINTS,
  BAR,
  LOCKUP_GAP,
  STACK_GAP,
  SURFACE_COLOR,
  PLATE_COLOR,
} = await import(join(root, "lib", "brand", "mark.ts"));
const {
  WORDMARK_TEXT,
  WORDMARK_TRACKING,
  WORDMARK_WORD_SPACING,
  WORDMARK_OPSZ,
  WORDMARK_SCALE,
  WORDMARK_ASPECT,
} = await import(join(root, "lib", "brand", "wordmark.ts"));

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

/** Cap height as a fraction of the em, for placing a baseline. Bodoni
    Moda runs a little shorter than the grotesque this replaced. */
const CAP_HEIGHT = 0.7;

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
 * ⚠️  The exported lockups carry the wordmark as live <text>, because there is
 *     no drawn artwork yet and this project has no font engine to convert one
 *     to outlines with. Opened somewhere without Bricolage Grotesque
 *     installed, they fall back. public/brand/README.md says so; when the real
 *     wordmark lands it goes in as a <path> and this stops being true.
 */
function wordmarkSVG({ x, y, fontSize, anchor = "start", fill }) {
  const tracking = round(WORDMARK_TRACKING * fontSize);
  // text-anchor="middle" centres the ADVANCE, and the advance carries one
  // trailing letter-space that has no letter after it. Half of it back.
  const shift = anchor === "middle" ? tracking / 2 : 0;
  return `  <text
    x="${round(x + shift)}" y="${round(y)}"
    font-family="Bodoni Moda, Bodoni MT, Didot, Georgia, serif"
    font-weight="400"
    font-size="${round(fontSize)}"
    font-variation-settings="'opsz' ${WORDMARK_OPSZ}"
    letter-spacing="${tracking}"
    word-spacing="${round(WORDMARK_WORD_SPACING * fontSize)}"
    text-anchor="${anchor}"
    fill="${fill}"
  >${WORDMARK_TEXT}</text>`;
}

/**
 * Live text cannot be measured here, so WORDMARK_ASPECT is an estimate and
 * the exported box carries a little slack. A viewBox a few percent wide is
 * invisible; a viewBox a few percent narrow clips the final S, because an
 * outermost <svg> clips to its viewport. Goes to 1 with real artwork.
 */
const SLACK = 1.05;

function lockupSVG(variant, surface) {
  const { fg, bg } = SURFACE_COLOR[surface];
  const pad = BAR * MARK_SIZE; // clear space: one bar, built in
  const label = `Surge Labs`;

  let inner;
  let artW;
  let artH;

  if (variant === "mark") {
    artW = MARK_SIZE;
    artH = MARK_SIZE;
    inner = `  <path d="${MARK_PATH}" fill="${fg}" transform="translate(${pad} ${pad})"/>`;
  } else if (variant === "horizontal") {
    const fontSize = WORDMARK_SCALE.horizontal * MARK_SIZE;
    const gap = LOCKUP_GAP * MARK_SIZE;
    const wordW = WORDMARK_ASPECT * fontSize * SLACK;
    artW = MARK_SIZE + gap + wordW;
    artH = MARK_SIZE;
    // Baseline placed so the CAPS centre on the mark, not the em box.
    const baseline = pad + MARK_SIZE / 2 + (CAP_HEIGHT * fontSize) / 2;
    inner = [
      `  <path d="${MARK_PATH}" fill="${fg}" transform="translate(${pad} ${pad})"/>`,
      wordmarkSVG({ x: pad + MARK_SIZE + gap, y: baseline, fontSize, fill: fg }),
    ].join("\n");
  } else {
    const fontSize = WORDMARK_SCALE.stacked * MARK_SIZE;
    const gap = STACK_GAP * MARK_SIZE;
    const wordW = WORDMARK_ASPECT * fontSize * SLACK;
    const capH = CAP_HEIGHT * fontSize;
    artW = Math.max(MARK_SIZE, wordW);
    artH = MARK_SIZE + gap + capH;
    inner = [
      `  <path d="${MARK_PATH}" fill="${fg}" transform="translate(${round(pad + (artW - MARK_SIZE) / 2)} ${pad})"/>`,
      wordmarkSVG({
        x: pad + artW / 2,
        y: pad + MARK_SIZE + gap + capH,
        fontSize,
        anchor: "middle",
        fill: fg,
      }),
    ].join("\n");
  }

  const w = round(artW + pad * 2);
  const h = round(artH + pad * 2);

  const note = comment(`Generated by scripts/generate-brand-assets.mjs from lib/brand/mark.ts.
       Do not edit: re-run \`npm run gen:brand\`.
       The ${round(pad)}-unit margin IS the clear space rule, one bar on every
       side. Place this file as-is and the rule is already honoured.
       ${variant === "mark" ? "" : "The wordmark is live text, not outlines. See README.md."}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <title>${label}</title>
  ${note}
  <rect width="${w}" height="${h}" fill="${bg}"/>
${inner}
</svg>
`;
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

/** The plate icon: a solid accent fill with the S knocked out of it. */
function plateIcon(size, scale = ICON_SCALE) {
  const cov = coverage(fit(MARK_POINTS, MARK_SIZE, size, scale), size, 8);
  return compose(cov, size, rgb(PLATE_COLOR.fill), rgb(PLATE_COLOR.knockout));
}

function iconSVG() {
  const inset = round((MARK_SIZE * (1 - ICON_SCALE)) / 2);
  const s = round(MARK_SIZE * ICON_SCALE);
  const note = comment(`Generated by scripts/generate-brand-assets.mjs. Do not edit.
       The tab icon is the mark KNOCKED OUT of the accent plate, not the bare
       mark: at 16px a solid fill with a hole in it survives where a figure
       made of hairlines does not, and a knockout is what this would be on a
       press anyway. The accent fill over its knockout, ${PLATE_COLOR.fill} under
       ${PLATE_COLOR.knockout}, at 4.5:1.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_SIZE}" height="${MARK_SIZE}" viewBox="0 0 ${MARK_SIZE} ${MARK_SIZE}" role="img" aria-label="Surge Labs">
  <title>Surge Labs</title>
  ${note}
  <rect width="${MARK_SIZE}" height="${MARK_SIZE}" fill="${PLATE_COLOR.fill}"/>
  <path d="${MARK_PATH}" fill="${PLATE_COLOR.knockout}" transform="translate(${inset} ${inset}) scale(${round(s / MARK_SIZE)})"/>
</svg>
`;
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
