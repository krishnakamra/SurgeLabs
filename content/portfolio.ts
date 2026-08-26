/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  READ THIS BEFORE ADDING AN ENTRY.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This is the only file on the site that names real businesses. Everything
 * else — content/work.ts, the blog, the local pages — describes jobs by trade
 * and city precisely so that nothing has to be claimed about a named client.
 * That protection does not exist here, so the rules do the work instead:
 *
 *   1. ONLY SITES YOU BUILT. Not sites you advised on, not sites built from a
 *      template you sold, not a competitor's work you admire. If a court or a
 *      customer asked "did you make this", the answer has to be yes.
 *
 *   2. `role` SAYS WHAT YOU ACTUALLY DID. It is required and it is published.
 *      "Design and build" and "SEO and Core Web Vitals only" are both fine
 *      answers; what is not fine is letting a screenshot imply the first when
 *      the truth is the second. This is the single most likely thing to go
 *      wrong on a portfolio page and it is the reason the field exists.
 *
 *   3. PERMISSION, IN WRITING, BEFORE IT GOES UP. A live public website is
 *      not the same as consent to be used as a reference. One email saying
 *      "happy for you to show this" is enough, and it takes a day.
 *
 *   4. SCREENSHOTS ARE OF THE LIVE SITE, TAKEN BY THE CAPTURE SCRIPT. Do not
 *      hand-composite a mockup. If the site has changed since launch, the
 *      screenshot changes with it — run the script again.
 *
 * The validator below runs at module scope, so `next build` fails on a
 * malformed entry rather than shipping a half-filled card. See also
 * scripts/check-portfolio.mjs and docs/PORTFOLIO.md, which is the guide for
 * whoever is loading these in.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type PortfolioShot = {
  /** Path under /public. The capture script writes these. */
  src: string;
  /** Real description of the page. Not "screenshot of the website". */
  alt: string;
  width: number;
  height: number;
};

export type PortfolioItem = {
  /** Kebab-case, unique. Drives the anchor. */
  slug: string;
  /** The business, as it calls itself. */
  name: string;
  /** Live https URL. Checked for reachability by scripts/check-portfolio.mjs. */
  url: string;
  /** Trade or sector, plain: "Dental clinic", "HVAC contractor". */
  sector: string;
  /** Where they are. Free text — a portfolio is not limited to our city list. */
  city: string;
  /** Year it went live. */
  year: number;
  /**
   * EXACTLY what we did. Published on the card. See rule 2 above.
   * e.g. "Design and build", "Rebuild and Shopify migration",
   *      "Local SEO and Core Web Vitals only — site built elsewhere".
   */
  role: string;
  /** One or two plain sentences about the job. 60 characters minimum. */
  summary: string;
  /** What is on the site. Two to five short items. */
  built: readonly string[];
  /** Desktop capture of the live site. */
  shot: PortfolioShot;
  /** Optional scroll capture, if one was recorded. */
  motion?: { src: string; poster: string; width: number; height: number };
  /** Optional. What it runs on. */
  stack?: readonly string[];
};

/**
 * EMPTY ON PURPOSE, exactly like content/testimonials.ts.
 *
 * The gallery components return null while this is empty, so the /work and
 * /web-design-seo pages simply do not carry a portfolio section yet rather
 * than rendering a grid of grey rectangles. Fill it and both light up.
 */
export const portfolio: readonly PortfolioItem[] = [];

const MIN_SUMMARY = 60;
const MIN_ALT = 20;
const MIN_BUILT = 2;
const MAX_BUILT = 5;

/**
 * Runs at import. A bad entry fails the build; it does not render badly.
 *
 * The checks are deliberately about the things that make a portfolio card
 * dishonest or useless rather than about formatting: a missing `role`, an
 * alt that just repeats the business name, a summary too short to say
 * anything, a screenshot with no dimensions (which would book layout shift).
 */
function validate(items: readonly PortfolioItem[]): void {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const where = item.slug || item.name || "(unnamed entry)";

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      errors.push(`${where}: slug must be kebab-case`);
    }
    if (seen.has(item.slug)) errors.push(`${where}: duplicate slug`);
    seen.add(item.slug);

    if (!item.name?.trim()) errors.push(`${where}: name is required`);
    if (!/^https:\/\/[^\s]+$/.test(item.url ?? "")) {
      errors.push(`${where}: url must be a full https:// address`);
    }
    if (!item.sector?.trim()) errors.push(`${where}: sector is required`);
    if (!item.city?.trim()) errors.push(`${where}: city is required`);
    if (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100) {
      errors.push(`${where}: year must be a four-digit year`);
    }

    // The honesty field. See rule 2 in the block at the top of this file.
    if (!item.role?.trim()) {
      errors.push(`${where}: role is required — say exactly what we did on this site`);
    }

    if ((item.summary ?? "").trim().length < MIN_SUMMARY) {
      errors.push(`${where}: summary needs at least ${MIN_SUMMARY} characters`);
    }
    if (!Array.isArray(item.built) || item.built.length < MIN_BUILT) {
      errors.push(`${where}: built needs at least ${MIN_BUILT} items`);
    }
    if (Array.isArray(item.built) && item.built.length > MAX_BUILT) {
      errors.push(`${where}: built has ${item.built.length} items; ${MAX_BUILT} is the most a card holds`);
    }

    const shot = item.shot;
    if (!shot?.src?.startsWith("/")) {
      errors.push(`${where}: shot.src must be a path under /public, starting with /`);
    }
    if ((shot?.alt ?? "").trim().length < MIN_ALT) {
      errors.push(`${where}: shot.alt needs at least ${MIN_ALT} characters describing the page`);
    }
    if (shot?.alt && item.name && shot.alt.trim().toLowerCase() === item.name.trim().toLowerCase()) {
      errors.push(`${where}: shot.alt is just the business name — describe what is on the page`);
    }
    // Dimensions are not optional even though the card reserves its own box
    // by aspect ratio. They are the record of how the capture was taken, so
    // a re-shoot lands at the same size and the crop does not move.
    if (!(shot?.width > 0) || !(shot?.height > 0)) {
      errors.push(`${where}: shot needs real width and height`);
    }

    if (item.motion) {
      if (!item.motion.src?.startsWith("/")) errors.push(`${where}: motion.src must be under /public`);
      if (!item.motion.poster?.startsWith("/")) errors.push(`${where}: motion.poster must be under /public`);
      if (!(item.motion.width > 0) || !(item.motion.height > 0)) {
        errors.push(`${where}: motion needs real width and height`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `content/portfolio.ts is not publishable:\n  - ${errors.join("\n  - ")}\n\n` +
        "See docs/PORTFOLIO.md for the shape of an entry.\n",
    );
  }
}

validate(portfolio);

export function portfolioItem(slug: string): PortfolioItem | undefined {
  return portfolio.find((item) => item.slug === slug);
}

/** Newest first, which is the order a portfolio is read in. */
export function portfolioByYear(): readonly PortfolioItem[] {
  return [...portfolio].sort((a, b) => (b.year - a.year) || a.name.localeCompare(b.name));
}
