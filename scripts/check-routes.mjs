/**
 * Route reachability gate.
 *
 * Every route this site generates has to be linked from somewhere a crawler
 * — and a person — can actually get to it by following links from the
 * homepage. A page that exists only in sitemap.xml is not reachable; it is a
 * URL Google may or may not decide to look at, with no internal link equity
 * and no way for a visitor to find it.
 *
 * This builds the full route list the same way the app does (from the content
 * layer and the app directory), then walks the link graph outward from "/"
 * using the same navigation model the header and footer render from. Anything
 * the walk never reaches is an orphan and fails the build.
 *
 *   npm run check:routes
 */
import { readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { services } = await import(join(root, "content", "services.ts"));
const { localPages } = await import(join(root, "content", "local-pages.ts"));
const { posts, liveCategories } = await import(join(root, "content", "posts.ts"));
const { galleryCategories } = await import(join(root, "content", "gallery.ts"));
const { primaryNav, navCta } = await import(join(root, "lib", "navigation.ts"));

/* ── 1. What exists ──────────────────────────────────────────────────────
   Static routes come from the app directory rather than a hand-kept list, so
   a new folder with a page.tsx in it is audited whether or not anyone
   remembered to register it. */
// noindex by design: the styleguide and brand sheet are working tools, and
// /start is a paid-traffic landing page reached from an ad rather than from
// the site. All three carry robots meta; none of them should be in the nav.
const IGNORED = new Set(["styleguide", "brand", "start"]);
const dynamic = /^\[.+\]$/;

function staticRoutes(dir = join(root, "app"), prefix = "") {
  const found = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("_") || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (dynamic.test(entry)) continue; // handled from the content layer below
    const route = `${prefix}/${entry}`;
    if (IGNORED.has(entry)) continue;
    try {
      statSync(join(full, "page.tsx"));
      found.push(route);
    } catch {
      /* a directory without a page is a route segment, not a route */
    }
    found.push(...staticRoutes(full, route));
  }
  return found;
}

const routes = new Set([
  "/",
  ...staticRoutes(),
  ...services.map((s) => `/${s.slug}`),
  ...galleryCategories.map((c) => `/work/${c.slug}`),
  ...localPages.map((p) => `/${p.service}/${p.city}`),
  ...posts.map((p) => `/blog/${p.slug}`),
  ...liveCategories().map((c) => `/blog/category/${c.slug}`),
]);

/* ── 2. What links to what ───────────────────────────────────────────────
   Modelled, not scraped. Scraping the built HTML would be more thorough and
   would also mean this could only run after a build; the point of a gate is
   to fail before one. Each entry below is a claim about a page's rendered
   links, and it is the responsibility of whoever changes that page to keep it
   true — which is why the nav and footer read from lib/navigation.ts rather
   than hardcoding, so most of these claims cannot drift. */
const linksFrom = new Map();
const link = (from, ...to) => {
  linksFrom.set(from, [...(linksFrom.get(from) ?? []), ...to.flat()]);
};

// The masthead and footer render on every route, so whatever they link is
// reachable from everywhere. Modelled once, applied to "/" — the walk does
// the rest.
const chrome = [
  ...primaryNav.flatMap((item) => [
    item.href.split("#")[0],
    ...(item.children ?? []).map((c) => c.href.split("#")[0]),
  ]),
  navCta.href,
  "/service-areas",
  // Footer bottom bar, on every page that renders SiteFooter.
  "/privacy",
  "/blog",
  ...liveCategories().map((c) => `/blog/category/${c.slug}`),
  ...services.map((s) => `/${s.slug}`),
].filter(Boolean);

link("/", ...chrome);
// /service-areas is the index for every local page — see its page.tsx.
link("/service-areas", ...localPages.map((p) => `/${p.service}/${p.city}`));
// /blog lists every post; each category page lists its own.
link("/blog", ...posts.map((p) => `/blog/${p.slug}`));
// The quote flow ends on its confirmation page.
link("/quote", "/quote/sent");

/* ── 3. Walk ─────────────────────────────────────────────────────────── */
const reached = new Set(["/"]);
const queue = ["/"];
while (queue.length) {
  const current = queue.shift();
  for (const next of linksFrom.get(current) ?? []) {
    if (!next || reached.has(next)) continue;
    reached.add(next);
    queue.push(next);
  }
}

/* ── 4. Report ───────────────────────────────────────────────────────── */
const orphans = [...routes].filter((route) => !reached.has(route)).sort();
const dangling = [...reached].filter((route) => !routes.has(route)).sort();

console.log(`  routes generated:  ${routes.size}`);
console.log(`  reachable from /:  ${reached.size}`);

if (dangling.length) {
  console.log("\n✗ navigation points at routes that do not exist:");
  for (const route of dangling) console.log(`  - ${route}`);
}
if (orphans.length) {
  console.log("\n✗ orphaned — generated but nothing links to them:");
  for (const route of orphans) console.log(`  - ${route}`);
}

if (orphans.length || dangling.length) {
  console.log(
    "\nAdd the route to lib/navigation.ts, or link it from a page this walk\n" +
      "already reaches, or stop generating it. A page nothing links to earns\n" +
      "no internal link equity and cannot be found by a person at all.",
  );
  process.exit(1);
}

console.log("\n✓ every generated route is reachable from the homepage");
