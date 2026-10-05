/**
 * Every environment variable the code reads has to appear in .env.example.
 *
 * An undocumented variable is a deploy that works on the machine it was
 * written on and fails everywhere else, and the failure is usually silent —
 * a missing key means a feature quietly does nothing rather than throwing.
 * This is cheap to check and it catches the drift the moment it happens.
 *
 * Two exclusions, on the same principle: a variable the ENVIRONMENT sets is
 * not configuration this project is responsible for documenting.
 *
 *   NODE_ENV     the framework sets it, not the operator
 *   HTTPS_PROXY  a standard, machine-level variable. scripts/capture-work.mjs
 *                passes it through to Playwright so the screenshot run works
 *                behind a corporate or sandbox proxy. Documenting it in
 *                .env.example would imply this app needs a proxy configured,
 *                which it does not.
 *   PLAYWRIGHT_BROWSERS_PATH
 *                Playwright's own variable, read by the same script to find a
 *                Chromium the machine already has. Same argument: the app
 *                never reads it, and only the screenshot run cares.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN = ["app", "components", "lib", "scripts", "db", "content"];
const EXCLUDE = new Set(["NODE_ENV", "HTTPS_PROXY", "PLAYWRIGHT_BROWSERS_PATH"]);
const CODE = new Set([".ts", ".tsx", ".mjs", ".js", ".sql"]);

function* files(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* files(full);
    else if (CODE.has(extname(full))) yield full;
  }
}

const used = new Set();
for (const dir of SCAN) {
  let ok = true;
  try { statSync(join(root, dir)); } catch { ok = false; }
  if (!ok) continue;
  for (const file of files(join(root, dir))) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/process\.env\.([A-Z_][A-Z0-9_]*)/g)) used.add(m[1]);
  }
}

const example = readFileSync(join(root, ".env.example"), "utf8");
const documented = new Set(
  [...example.matchAll(/^#?\s*([A-Z_][A-Z0-9_]*)\s*=/gm)].map((m) => m[1]),
);

const missing = [...used].filter((v) => !EXCLUDE.has(v) && !documented.has(v)).sort();
const stale = [...documented].filter((v) => !used.has(v)).sort();

console.log(`env: ${used.size} variable(s) read by the code, ${documented.size} documented`);
if (stale.length) console.log(`\nnote — documented but not read anywhere (may be intentional):\n  ${stale.join(", ")}`);
if (missing.length) {
  console.log(`\n✗ ${missing.length} variable(s) missing from .env.example:`);
  for (const v of missing) console.log(`  - ${v}`);
  process.exit(1);
}
console.log("\n✓ every variable the code reads is documented in .env.example");
