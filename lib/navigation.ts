import { services } from "@/content";

/**
 * THE NAVIGATION MODEL — one tree, three consumers.
 *
 * The header, the footer sitemap and scripts/check-routes.mjs all read this
 * file. That is the point: "no page may be orphaned" is only enforceable if
 * there is a single place that says what is linked, and a check that compares
 * it against what actually gets generated.
 *
 * Adding a route means adding it here. If you do not, the route audit fails
 * the build and tells you which page nothing points at.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Shown in the header dropdown and the mobile overlay. */
  description?: string;
};

export type NavItem = NavLink & { children?: readonly NavLink[] };

/**
 * The service dropdown, generated from the content layer rather than typed
 * out — a fourth service cannot be added to content/services.ts without
 * appearing in the nav.
 */
export const serviceLinks: readonly NavLink[] = services.map((service) => ({
  label: service.name,
  href: `/${service.slug}`,
  description: service.summary,
}));

export const primaryNav: readonly NavItem[] = [
  {
    label: "Services",
    // The parent is not itself a page — the dropdown is the destination. On
    // mobile it renders as a labelled group rather than a link, and on
    // desktop the trigger is a button, not an anchor, because a control that
    // opens a menu is a button. See SiteHeader.
    href: "/#services",
    children: serviceLinks,
  },
  { label: "Packages", href: "/packages", description: "What things cost, on the page" },
  { label: "Work", href: "/work", description: "Recent jobs, as job tickets" },
  { label: "About", href: "/about", description: "One shop, one floor" },
  { label: "Blog", href: "/blog", description: "Guides, prices and specs" },
  {
    label: "Contact",
    // Deliberately not a /contact route. The address, hours and phone live in
    // one place — the Find us block on /about — and a second page repeating
    // the NAP is a way for the two to drift out of sync, which is precisely
    // the thing content/site.ts exists to prevent.
    href: "/about#find-us",
    description: "Address, hours and phone",
  },
];

/** The one gold action. Kept out of primaryNav so it cannot be reordered into it. */
export const navCta: NavLink = { label: "Get a quote", href: "/quote" };

/** Every fixed route the nav is responsible for reaching, flattened. */
export function navRoutes(): string[] {
  const out = new Set<string>([navCta.href]);
  for (const item of primaryNav) {
    // Strip the fragment — an anchor is a position on a page, not a route.
    const base = item.href.split("#")[0];
    if (base) out.add(base);
    for (const child of item.children ?? []) out.add(child.href.split("#")[0]!);
  }
  return [...out].filter(Boolean);
}
