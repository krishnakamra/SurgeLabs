/**
 * Generates one press-plate image per live local page.
 *
 * ⚠️  These are DESIGNED PLACEHOLDERS, not photographs. They are genuinely
 *     unique files — different plate, screen angle, pitch and composition per
 *     page — so the build gate passes honestly rather than by pointing 25
 *     pages at one shared graphic. But a photograph of real work in that city
 *     does a job no generated graphic can, and a reused stock image across a
 *     local page cluster is one of the signals that gets it read as
 *     templated. Replace these as real photos exist; the gate will keep
 *     passing as long as the file is there.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { localPages, getLocalService } = await import(join(root, "content", "local-pages.ts"));
const { getCity } = await import(join(root, "content", "cities.ts"));

const INK = "#0C0C0E";
const STOCK = "#EDEDE8";
const PLATES = {
  c: { hex: "#009FE3", angle: 15, label: "CYAN" },
  m: { hex: "#E6007E", angle: 75, label: "MAGENTA" },
  y: { hex: "#FFED00", angle: 0, label: "YELLOW" },
  k: { hex: "#EDEDE8", angle: 45, label: "KEY" },
};
const ORDER = ["c", "m", "y", "k"];

/** Stable per-page seed, so regenerating produces identical files. */
function seedOf(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const W = 800;
const H = 600;
mkdirSync(join(root, "public", "local"), { recursive: true });

let written = 0;
for (const page of localPages) {
  const service = getLocalService(page.service);
  const city = getCity(page.city);
  const seed = seedOf(`${page.service}/${page.city}`);

  const plateKey = ORDER[seed % 4];
  const plate = PLATES[plateKey];
  const pitch = 14 + (seed % 5) * 4;
  const radius = 2.6 + ((seed >> 3) % 4) * 0.7;
  const shift = (seed >> 5) % pitch;
  const markX = 120 + ((seed >> 7) % 5) * 90;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${page.image.alt}">
  <defs>
    <pattern id="screen" width="${pitch}" height="${pitch}" patternUnits="userSpaceOnUse" patternTransform="rotate(${plate.angle}) translate(${shift} ${shift})">
      <circle cx="${pitch / 2}" cy="${pitch / 2}" r="${radius.toFixed(2)}" fill="${plate.hex}"/>
    </pattern>
    <radialGradient id="fade" cx="50%" cy="45%" r="62%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="vignette"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  </defs>

  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect width="${W}" height="${H}" fill="url(#screen)" mask="url(#vignette)" opacity="0.55"/>

  <g stroke="${STOCK}" stroke-opacity="0.5" stroke-width="1">
    <path d="M24 44 h28 M44 24 v28"/>
    <path d="M${W - 24} 44 h-28 M${W - 44} 24 v28"/>
    <path d="M24 ${H - 44} h28 M44 ${H - 24} v-28"/>
    <path d="M${W - 24} ${H - 44} h-28 M${W - 44} ${H - 24} v-28"/>
  </g>

  <g transform="translate(${markX} 300)" fill="none" stroke="${plate.hex}" stroke-width="1.5">
    <circle r="26"/><circle r="12"/>
    <path d="M0 -42 V-14 M0 14 V42 M-42 0 H-14 M14 0 H42"/>
  </g>

  <g font-family="ui-monospace, monospace" fill="${STOCK}">
    <text x="44" y="96" font-size="13" letter-spacing="3.4" opacity="0.62">${(service?.name ?? page.service).toUpperCase()}</text>
    <text x="44" y="128" font-size="30" letter-spacing="1.2">${(city?.name ?? page.city).toUpperCase()}</text>
    <text x="44" y="${H - 62}" font-size="12" letter-spacing="3" opacity="0.46">PLATE ${plate.label} · ${plate.angle}° · ${pitch}PT SCREEN</text>
    <text x="${W - 44}" y="96" font-size="12" letter-spacing="3" opacity="0.46" text-anchor="end">SURGE LABS</text>
  </g>

  <rect x="44" y="${H - 44}" width="120" height="3" fill="${PLATES.m.hex}"/>
</svg>
`;

  writeFileSync(join(root, "public", page.image.src.replace(/^\//, "")), svg, "utf8");
  written++;
}
console.log(`generated ${written} local plate images into public/local/`);
