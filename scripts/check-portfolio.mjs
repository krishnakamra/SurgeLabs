// Gate for the website portfolio.
//
// content/portfolio.ts validates its own shape at import — that part fails
// `next build` on its own. What it cannot do is look at the filesystem or the
// network, so this covers the two things that go wrong after an entry is
// otherwise correct:
//
//   1. The screenshot file named in the entry is not in public/.
//   2. The live URL is not live any more.
//
// (2) is the one that matters over time. A portfolio quietly linking to a
// domain that lapsed two years ago is worse than a shorter portfolio, and
// nobody notices because nobody clicks their own links.

import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { portfolio } from "../content/portfolio.ts";

const PUBLIC = join(process.cwd(), "public");
const CHECK_URLS = process.env.CHECK_PORTFOLIO_URLS === "1";

const problems = [];

for (const item of portfolio) {
  for (const [label, path] of [
    ["shot", item.shot.src],
    ...(item.motion ? [["motion", item.motion.src], ["poster", item.motion.poster]] : []),
  ]) {
    const file = join(PUBLIC, path.replace(/^\//, ""));
    if (!existsSync(file)) {
      problems.push(`${item.slug}: ${label} file missing — ${path}\n      run: npm run shots -- --only=${item.slug}`);
    }
  }
}

if (CHECK_URLS && portfolio.length > 0) {
  console.log(`  checking ${portfolio.length} live URL(s)…`);
  const results = await Promise.all(
    portfolio.map(async (item) => {
      try {
        // HEAD first; a fair number of sites answer 405 to it, so fall back.
        let response = await fetch(item.url, { method: "HEAD", redirect: "follow" });
        if (response.status === 405 || response.status === 501) {
          response = await fetch(item.url, { method: "GET", redirect: "follow" });
        }
        return response.ok ? null : `${item.slug}: ${item.url} returned ${response.status}`;
      } catch (error) {
        return `${item.slug}: ${item.url} — ${error.message}`;
      }
    }),
  );
  problems.push(...results.filter(Boolean));
}

if (portfolio.length === 0) {
  console.log("  portfolio is empty — the gallery sections render nothing. See docs/PORTFOLIO.md.");
} else if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
} else {
  console.log(`\n✓ ${portfolio.length} portfolio entries, every asset present${CHECK_URLS ? " and every URL live" : ""}`);
}
