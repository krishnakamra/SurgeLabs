/**
 * Walks lib/redirects.ts against a running server.
 *
 * A redirect map is only worth having if the destinations are real. This
 * fails on three things that all look fine until someone follows a link from
 * an old business card: a `from` that does not redirect at all, a `to` that
 * 404s, and a chain — a redirect whose destination is itself a redirect,
 * which costs a round trip and dilutes what the link passes on.
 *
 *   node scripts/check-redirects.mjs [baseUrl]
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { redirectMap } = await import(join(root, "lib", "redirects.ts"));

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const problems = [];

const hop = async (path) => {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  return { status: res.status, location: res.headers.get("location") };
};

console.log(`\nchecking ${redirectMap.length} redirects against ${base}\n`);

for (const { from, to, note } of redirectMap) {
  const first = await hop(from);

  if (first.status !== 301) {
    problems.push(`${from}: expected 301, got ${first.status}`);
    console.log(`  ✗ ${from} → ${first.status}`);
    continue;
  }

  const target = new URL(first.location, base);
  if (target.pathname !== to) {
    problems.push(`${from}: lands on ${target.pathname}, expected ${to}`);
    console.log(`  ✗ ${from} → ${target.pathname} (wanted ${to})`);
    continue;
  }

  // The destination has to be a real page, and not another redirect.
  const second = await hop(target.pathname);
  if (second.status >= 300 && second.status < 400) {
    problems.push(`${from} → ${to} → ${second.location}: chained redirect`);
    console.log(`  ✗ ${from} → ${to} → ${second.location}  (chain)`);
    continue;
  }
  if (second.status !== 200) {
    problems.push(`${from} → ${to}: destination returns ${second.status}`);
    console.log(`  ✗ ${from} → ${to} returns ${second.status}`);
    continue;
  }

  console.log(`  ✓ ${from} → ${to}`);
  console.log(`      ${note}`);
}

// A redirect to a path that is itself in the map is a loop waiting to happen.
for (const { from, to } of redirectMap) {
  if (redirectMap.some((r) => r.from === to)) problems.push(`${from} → ${to}, which is itself redirected`);
  if (from === to) problems.push(`${from} redirects to itself`);
}

console.log(problems.length ? `\n✗ ${problems.length} problem(s):` : "\n✓ every redirect resolves to a live page in one hop\n");
for (const p of problems) console.log(`  - ${p}`);
process.exit(problems.length ? 1 : 0);
