export type PageKeywords = {
  /** The one term this page is trying to win. Must appear in H1 and title. */
  primary: string;
  /** Three supporting terms. Not asserted — they belong in the body copy. */
  secondary: readonly [string, string, string];
  /**
   * Set only where the H1 deliberately does not carry the primary term.
   * The check reports these loudly rather than skipping them silently, so an
   * exemption stays a visible decision instead of becoming a habit.
   */
  h1Exempt?: string;
};

/**
 * One primary keyword per page, and the H1 and title have to contain it.
 * scripts/check-seo.mjs asserts that and fails the build otherwise.
 *
 * Local service × city pages are not listed here — their keyword is derived
 * from the service and city names, so a new local page cannot be added
 * without one.
 */
export const pageKeywords: Record<string, PageKeywords> = {
  "/": {
    primary: "web design and printing mississauga",
    secondary: ["custom apparel mississauga", "signage mississauga", "print shop gta"],
    h1Exempt:
      "The homepage H1 is the brand line the owner specified — \"We print, code and " +
      "stitch your brand into existence.\" Forcing a local commercial term into it " +
      "would wreck the sentence. The primary keyword is carried by the title, the " +
      "standfirst and the H2s instead. Change the H1 and this exemption goes away.",
  },
  "/packages": {
    primary: "packages and pricing mississauga",
    secondary: ["website pricing mississauga", "print packages gta", "branding package toronto"],
  },
  "/quote": {
    primary: "request a quote mississauga",
    secondary: ["printing quote mississauga", "web design quote gta", "custom apparel quote"],
  },
  "/service-areas": {
    primary: "service areas gta",
    secondary: ["printing across the gta", "signage greater toronto area", "apparel gta delivery"],
  },
  "/web-design-seo": {
    primary: "web design mississauga",
    secondary: ["local seo mississauga", "shopify developer mississauga", "website design gta"],
  },
  "/printing-signage": {
    primary: "printing mississauga",
    secondary: ["business cards mississauga", "banner printing gta", "signage mississauga"],
  },
  "/custom-apparel": {
    primary: "custom apparel mississauga",
    secondary: ["embroidery mississauga", "screen printing gta", "dtf printing mississauga"],
  },
};

/** Keyword for a local service × city page, derived so it cannot go missing. */
export function localPageKeywords(serviceName: string, cityName: string): PageKeywords {
  const primary = `${serviceName} ${cityName}`.toLowerCase();
  return {
    primary,
    secondary: [
      `${serviceName} near me`.toLowerCase(),
      `${serviceName} ${cityName} price`.toLowerCase(),
      `same day ${serviceName} ${cityName}`.toLowerCase(),
    ],
  };
}

const STOPWORDS = new Set(["a", "an", "the", "and", "or", "in", "at", "of", "for", "to"]);

export function tokenise(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOPWORDS.has(word));
}

/**
 * True when every meaningful word of the keyword appears in the text, in
 * order. Exact-phrase matching would reject "Custom web design and SEO in
 * Mississauga" for "web design mississauga", which is a headline doing its
 * job — so the rule is subsequence containment, not substring.
 */
export function containsKeyword(text: string, keyword: string): boolean {
  const haystack = tokenise(text);
  const needles = tokenise(keyword);
  let cursor = 0;
  for (const needle of needles) {
    const found = haystack.indexOf(needle, cursor);
    if (found === -1) return false;
    cursor = found + 1;
  }
  return true;
}
