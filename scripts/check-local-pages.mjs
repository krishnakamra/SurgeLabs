/**
 * Build gate for the local landing pages.
 *
 * content/local-pages.ts already throws on import if an entry is missing its
 * copy, so a broken entry cannot reach a build either way. This script exists
 * to report every failure at once instead of the first one, and to run two
 * checks the module cannot: whether the image files exist on disk, and
 * whether any two intros are quietly the same text with the city swapped.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { localPages, validateLocalPages, localServices } = await import(
  join(root, "content", "local-pages.ts")
);

const problems = validateLocalPages(localPages);

// ── Image files must actually exist ──────────────────────────────────
for (const page of localPages) {
  const file = join(root, "public", page.image.src.replace(/^\//, ""));
  if (!existsSync(file)) {
    problems.push(`${page.service}/${page.city}: image not found at public${page.image.src}`);
  }
}

// ── Near-duplicate detection ─────────────────────────────────────────
// Shared 8-word runs are the fingerprint of a template with the city name
// swapped. Some overlap is normal — these are the same trades described in
// different places — so the bar is set where genuine reuse of phrasing stops
// and find-and-replace begins.
const SHINGLE = 8;
const MAX_OVERLAP = 0.25;

function shingles(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + SHINGLE <= words.length; i++) set.add(words.slice(i, i + SHINGLE).join(" "));
  return set;
}

const prints = localPages.map((page) => ({
  id: `${page.service}/${page.city}`,
  set: shingles(page.intro.join(" ")),
}));

let worst = { pair: "none", overlap: 0 };
for (let i = 0; i < prints.length; i++) {
  for (let j = i + 1; j < prints.length; j++) {
    const a = prints[i];
    const b = prints[j];
    let shared = 0;
    for (const s of a.set) if (b.set.has(s)) shared++;
    const overlap = shared / Math.min(a.set.size, b.set.size);
    if (overlap > worst.overlap) worst = { pair: `${a.id} ↔ ${b.id}`, overlap };
    if (overlap > MAX_OVERLAP) {
      problems.push(
        `${a.id} and ${b.id} share ${Math.round(overlap * 100)}% of their phrasing — that reads as a template, not two pages`,
      );
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────
const words = localPages.map((p) => p.intro.join(" ").split(/\s+/).filter(Boolean).length);
const byCity = new Map();
for (const p of localPages) byCity.set(p.city, (byCity.get(p.city) ?? 0) + 1);

console.log(`local pages: ${localPages.length} live across ${byCity.size} cities`);
console.log(`  services defined:   ${localServices.length}`);
console.log(`  intro words:        min ${Math.min(...words)}, max ${Math.max(...words)}, total ${words.reduce((a, b) => a + b, 0)}`);
console.log(`  closest two pages:  ${worst.pair} at ${Math.round(worst.overlap * 100)}% shared phrasing`);
console.log(`  per city:           ${[...byCity].map(([c, n]) => `${c} ${n}`).join(", ")}`);

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("\n✓ all local pages carry their own content");
