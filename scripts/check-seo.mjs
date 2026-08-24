/**
 * Keyword gate.
 *
 * Every page declares one primary keyword, and its H1 and title have to carry
 * it. This asserts that against the same strings the pages render — lib/seo
 * owns them, the pages read from it — so the check cannot pass while the
 * visible headline says something else.
 *
 * Also enforces the length limits, because a title Google truncates and a
 * description it rewrites are both wasted work.
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { pageKeywords, localPageKeywords, containsKeyword } = await import(join(root, "content", "keywords.ts"));
const { pageSeo, localSeo } = await import(join(root, "lib", "seo", "page-seo.ts"));
const { localPages, getLocalService } = await import(join(root, "content", "local-pages.ts"));
const { getCity } = await import(join(root, "content", "cities.ts"));

const MAX_TITLE = 60;
const MAX_DESC = 155;

const problems = [];
const exemptions = [];
let checked = 0;

function check(route, seo, keywords) {
  checked++;
  if (seo.title.length > MAX_TITLE) {
    problems.push(`${route}: title is ${seo.title.length} chars, limit ${MAX_TITLE}`);
  }
  if (seo.description.length > MAX_DESC) {
    problems.push(`${route}: description is ${seo.description.length} chars, limit ${MAX_DESC}`);
  }
  if (!containsKeyword(seo.title, keywords.primary)) {
    problems.push(`${route}: title does not contain "${keywords.primary}"\n      title: ${seo.title}`);
  }
  if (keywords.h1Exempt) {
    exemptions.push(`${route}: H1 exempt — ${keywords.h1Exempt}`);
  } else if (!containsKeyword(seo.h1, keywords.primary)) {
    problems.push(`${route}: H1 does not contain "${keywords.primary}"\n      h1: ${seo.h1}`);
  }
  if (keywords.secondary.length !== 3) {
    problems.push(`${route}: needs exactly 3 secondary keywords, has ${keywords.secondary.length}`);
  }
}

// ── Fixed routes ─────────────────────────────────────────────────────
for (const [route, keywords] of Object.entries(pageKeywords)) {
  const seo = pageSeo[route];
  if (!seo) {
    problems.push(`${route}: has keywords but no entry in lib/seo/page-seo.ts`);
    continue;
  }
  check(route, seo, keywords);
}

for (const route of Object.keys(pageSeo)) {
  if (!pageKeywords[route]) problems.push(`${route}: has SEO copy but no keywords`);
}

// ── Local service × city pages ───────────────────────────────────────
for (const page of localPages) {
  const service = getLocalService(page.service);
  const city = getCity(page.city);
  if (!service || !city) continue;
  const route = `/${page.service}/${page.city}`;
  check(route, localSeo(service.name, city.name, service.blurb), localPageKeywords(service.name, city.name));
}

// ── Report ───────────────────────────────────────────────────────────
console.log(`seo: ${checked} routes checked against their primary keyword`);
if (exemptions.length > 0) {
  console.log(`\n${exemptions.length} H1 exemption(s) — these are decisions, not oversights:`);
  for (const e of exemptions) console.log(`  · ${e}`);
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("\n✓ every page's H1 and title carry its primary keyword");
