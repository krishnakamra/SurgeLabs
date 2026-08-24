/**
 * The 301 map.
 *
 * One list, in one file, because a redirect that only exists in someone's
 * memory of the old site is a redirect nobody can audit. Every entry here is
 * a URL that existed before the rebuild and still earns traffic or links.
 *
 * Rules for adding one:
 *   · `from` must be a path that really existed. Inventing redirects for URLs
 *     nobody ever published just adds work to every request.
 *   · `to` must be a live 200 on this site. scripts/check-redirects.mjs walks
 *     this list against a running server and fails on a 404 or a chain.
 *   · Never redirect a path to itself. /custom-apparel kept its URL in the
 *     rebuild, which is why it is deliberately absent below — an entry for it
 *     would be an infinite loop.
 *
 * 301, not Next's `permanent: true` shorthand, which emits 308. Google treats
 * the two identically, but some link checkers and older tooling report 308 as
 * a redirect of unknown kind. These URLs only ever receive GET, so 308's
 * method preservation buys nothing here.
 */
export type Redirect = { from: string; to: string; note: string };

export const redirectMap: Redirect[] = [
  {
    from: "/digital-web-services",
    to: "/web-design-seo",
    note: "Old combined web page. Split into web + SEO under a keyword-bearing slug.",
  },
  {
    from: "/print-signage",
    to: "/printing-signage",
    note: "Slug reordered so the primary term leads.",
  },
  {
    from: "/landing",
    to: "/packages",
    note: "Old single landing page; pricing now lives on /packages.",
  },
];
