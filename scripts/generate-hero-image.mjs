/**
 * Generates the homepage hero plate: public/hero/press-sheet.jpg.
 *
 * Why this exists at all: the hero's largest paint has to be a real raster
 * image with `priority`, not the headline. The headline converges from four
 * off-register plates, so the browser only counts it as painted once that
 * animation has resolved — which put LCP at 1.39s and made the number a
 * measure of the animation rather than of the page. A full-bleed image is
 * larger than the H1, so it takes the LCP slot and reports the moment the
 * bytes land.
 *
 * ⚠️  OWNER: this is a DESIGNED PLATE, not a photograph. It is a real 4C
 *     rosette with a real press control strip, which is honest — it is a
 *     picture of process, not a picture of the shop. A photograph of your
 *     own press bed, a stack of just-trimmed cards or a heat press mid-run
 *     will do more for both the brand and the local signal. Swap the file,
 *     keep the name and the dimensions, and nothing else has to change.
 *
 * Run: node scripts/generate-hero-image.mjs
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "hero");
mkdirSync(OUT, { recursive: true });

/**
 * Two trims, not one crop.
 *
 * The hero box is min-h-svh, so on a phone it is roughly 0.45:1 while the
 * landscape sheet is 1.6:1. object-cover throws away 72% of the file, and
 * Chrome sizes an LCP image by the fraction of it that survives the crop —
 * which knocked the image out of the LCP slot on mobile and handed it back
 * to the headline. A portrait trim fixes the wasted bytes and the metric at
 * the same time. The page picks between them with <picture media>.
 */
const TRIMS = [
  { name: "press-sheet", W: 1920, H: 1200 },
  { name: "press-sheet-portrait", W: 1000, H: 1700 },
];

const INK = "#0C0C0E";
// Process inks at their real screen angles. Rotating each plate by these
// amounts is what produces a rosette instead of a moiré, and it is the
// reason a magnified 4C print looks the way it does.
const PLATES = [
  { key: "c", hex: "#009FE3", angle: 15 },
  { key: "m", hex: "#E6007E", angle: 75 },
  { key: "y", hex: "#FFED00", angle: 0 },
  { key: "k", hex: "#EDEDE8", angle: 45 },
];

function build({ W, H }) {
  const portrait = H > W;
/** One screened plate: dots on a pitch, rotated to its angle, faded off. */
const screen = ({ key, hex, angle }, pitch, radius, opacity, fade) => `
  <pattern id="scr-${key}" width="${pitch}" height="${pitch}" patternUnits="userSpaceOnUse"
           patternTransform="rotate(${angle})">
    <circle cx="${pitch / 2}" cy="${pitch / 2}" r="${radius}" fill="${hex}" />
  </pattern>
  <radialGradient id="fade-${key}" cx="${fade.cx}" cy="${fade.cy}" r="${fade.r}">
    <stop offset="0" stop-color="#fff" stop-opacity="${opacity}" />
    <stop offset="1" stop-color="#fff" stop-opacity="0" />
  </radialGradient>
  <mask id="mask-${key}"><rect width="${W}" height="${H}" fill="url(#fade-${key})" /></mask>`;

/** Press control strip — the patch row a printer reads density off. */
function controlStrip(y, h) {
  const patches = [
    ["#009FE3", "C"], ["#E6007E", "M"], ["#FFED00", "Y"], ["#EDEDE8", "K"],
    ["#EA5B0C", "R"], ["#00934A", "G"], ["#2D2A82", "B"],
    ["#004E71", "C75"], ["#73003F", "M75"], ["#7F7700", "Y75"], ["#767672", "K75"],
  ];
  const gap = 5;
  const left = portrait ? W * 0.08 : W * 0.44;
  const w = Math.floor((W - left - 40) / patches.length) - gap;
  return patches
    .map(([hex, label], i) => {
      const x = left + i * (w + gap);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${hex}" opacity="0.92" />
      <text x="${x + 8}" y="${y + h + 20}" font-family="monospace" font-size="13"
            letter-spacing="2" fill="#6E6E72">${label}</text>`;
    })
    .join("");
}

/** Registration target: the crosshair a pressman lines the plates up on. */
const target = (cx, cy, r, stroke) => `
  <g stroke="${stroke}" stroke-width="2" fill="none" opacity="0.75">
    <circle cx="${cx}" cy="${cy}" r="${r}" />
    <circle cx="${cx}" cy="${cy}" r="${r * 0.45}" />
    <line x1="${cx - r * 1.8}" y1="${cy}" x2="${cx + r * 1.8}" y2="${cy}" />
    <line x1="${cx}" y1="${cy - r * 1.8}" x2="${cx}" y2="${cy + r * 1.8}" />
  </g>`;

/** Corner crop marks, offset from trim the way a real imposition sets them. */
function cropMarks(inset, len, stroke) {
  const corners = [
    [inset, inset, 1, 1], [W - inset, inset, -1, 1],
    [inset, H - inset, 1, -1], [W - inset, H - inset, -1, -1],
  ];
  return corners
    .map(([x, y, sx, sy]) => `
      <line x1="${x - sx * len}" y1="${y}" x2="${x - sx * 12}" y2="${y}" stroke="${stroke}" stroke-width="1.5" />
      <line x1="${x}" y1="${y - sy * len}" x2="${x}" y2="${y - sy * 12}" stroke="${stroke}" stroke-width="1.5" />`)
    .join("");
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${screen(PLATES[0], 13, 3.8, 0.46, { cx: "0.74", cy: "0.30", r: "0.62" })}
    ${screen(PLATES[1], 11, 4.4, 0.62, { cx: "0.82", cy: "0.54", r: "0.66" })}
    ${screen(PLATES[2], 15, 3.2, 0.30, { cx: "0.92", cy: "0.20", r: "0.5" })}
    ${screen(PLATES[3], 9, 2.6, 0.26, { cx: "0.66", cy: "0.86", r: "0.58" })}
    <linearGradient id="hold" x1="0" y1="0" x2="${portrait ? 0 : 1}" y2="${portrait ? 1 : 0}">
      <stop offset="0" stop-color="${INK}" stop-opacity="0.94" />
      <stop offset="0.30" stop-color="${INK}" stop-opacity="0.78" />
      <stop offset="0.66" stop-color="${INK}" stop-opacity="0.18" />
      <stop offset="1" stop-color="${INK}" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${INK}" />

  <!-- The rosette. Four screens, four angles, overprinting. -->
  <g style="mix-blend-mode:screen">
    ${PLATES.map((p) => `<rect width="${W}" height="${H}" fill="url(#scr-${p.key})" mask="url(#mask-${p.key})" />`).join("\n    ")}
  </g>

  <!-- Sheet edge: a darker band across the lower quarter, so the plate reads
       as a printed sheet on a bed rather than as wallpaper. -->
  <rect x="0" y="${H * (portrait ? 0.80 : 0.74)}" width="${W}" height="${H}" fill="#0A0A0C" opacity="0.8" />
  <line x1="0" y1="${H * (portrait ? 0.80 : 0.74)}" x2="${W}" y2="${H * (portrait ? 0.80 : 0.74)}" stroke="#2A2A2E" stroke-width="2" />

  ${controlStrip(H * (portrait ? 0.88 : 0.79), portrait ? 30 : 44)}
  ${target(W - (portrait ? 190 : 170), H * (portrait ? 0.52 : 0.34), 40, "#E6007E")}
  ${target(portrait ? 130 : W - 300, portrait ? H * 0.36 : 150, 26, "#009FE3")}
  ${cropMarks(56, 46, "#3A3A3E")}

  <!-- The headline column, held down. A gradient rather than a panel — a
       hard vertical edge here reads as a mistake, not as a press artifact. -->
  <rect width="${W}" height="${H}" fill="url(#hold)" />
</svg>`;

return svg;
}

for (const trim of TRIMS) {
const file = join(OUT, `${trim.name}.jpg`);
await sharp(Buffer.from(build(trim)), { density: 96 })
  // A whisper of blur. Half a pixel at 2400 wide is invisible, but hard dot
  // edges are what make a halftone compress badly — this is also closer to
  // how ink actually sits in stock. Cuts the file by roughly two thirds.
  .blur(0.9)
  .jpeg({ quality: 60, progressive: true, mozjpeg: true })
  .toFile(file);

const { size } = await import("node:fs").then((fs) => fs.promises.stat(file));
console.log(`wrote public/hero/${trim.name}.jpg  ${trim.W}×${trim.H}  ${(size / 1024).toFixed(0)} KB`);
}
