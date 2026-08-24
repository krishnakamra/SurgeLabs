export type Package = {
  slug: string;
  name: string;
  /** Who it is for, in one plain line. */
  audience: string;
  price: string;
  /** "one-time" | "per month" etc. Set in the utility face beside the price. */
  cadence: string;
  includes: readonly string[];
  /** Exactly one package should carry this. */
  featured?: boolean;
};

/**
 * ⚠️  OWNER: EVERY PRICE BELOW IS A PLACEHOLDER.
 *
 *     No pricing was supplied, and pricing is the main conversion driver on
 *     this site — a wrong number here costs real money in both directions.
 *     Replace the `price`, `cadence` and `includes` values with the real
 *     sheet before launch. Nothing else in the codebase hardcodes a price;
 *     changing this file changes the packages page, this teaser and the
 *     quote form's preselect.
 *
 *     If a package should not be shown at all, delete it from this array —
 *     the grid reflows to whatever is here.
 */
export const packages: readonly Package[] = [
  {
    slug: "launch",
    name: "Launch",
    audience: "New businesses that need to exist online and on paper at once.",
    price: "$1,850", // PLACEHOLDER
    cadence: "one-time", // PLACEHOLDER
    includes: [
      "Five-page website, built and hosted",
      "Google Business Profile set up and verified",
      "Logo files packaged for print and web",
      "250 business cards, 16pt matte",
      "One round of revisions",
    ],
  },
  {
    slug: "momentum",
    name: "Momentum",
    audience: "Businesses that have a site and need it to actually bring work in.",
    price: "$950", // PLACEHOLDER
    cadence: "per month", // PLACEHOLDER
    includes: [
      "Local and technical SEO, ongoing",
      "Social media management, three channels",
      "Monthly analytics report you can read",
      "Print credit each quarter",
      "Priority on rush jobs",
    ],
    featured: true,
  },
  {
    slug: "storefront",
    name: "Storefront",
    audience: "Retail and product businesses selling online and in person.",
    price: "$4,500", // PLACEHOLDER
    cadence: "one-time", // PLACEHOLDER
    includes: [
      "Shopify build with your products loaded",
      "Product photography, up to 30 items",
      "Packaging and label print run",
      "Staff apparel, one decorated style",
      "Two hours of training, recorded",
    ],
  },
];
