export type DeliverableGroup = {
  /** Vertical this group belongs to. Drives the job-ticket grouping. */
  group: "WEB" | "PRINT" | "APPAREL" | "SIGNAGE" | "BRAND";
  items: readonly string[];
};

export type Package = {
  slug: string;
  name: string;
  tagline: string;
  /** Numeric, CAD. Formatted for display by `formatPrice`. */
  price: number;
  priceNote: string;
  badge?: string;
  deliverables: readonly DeliverableGroup[];
  /** What the same scope costs bought piecemeal. See the warning below. */
  approxValue: number;
  bestFor: string;
  turnaround: string;
  addOns: readonly string[];
  ctaLabel: string;
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: WHAT IS REAL HERE AND WHAT IS NOT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CONFIRMED BY THE OWNER — safe to publish:
 *   · Launch Kit          $899
 *   · Momentum Kit      $1,899
 *   · Storefront Kit    $3,499
 *   · Full Surge        $6,999
 *   · Local SEO          $399/mo
 *   · SEO + Social       $799/mo
 *   · Full Growth      $1,499/mo
 *   · Websites starting  $599   (in ALA_CARTE below)
 *
 * DRAFT — NOT SUPPLIED, WRITTEN FROM THE DOCUMENTED IN-HOUSE CAPABILITIES:
 *   · every `deliverables` line, and all the quantities in them
 *   · every `turnaround`, `bestFor`, `tagline` and `approxValue`
 *   · every price in ALA_CARTE except the $599 website
 *
 * The deliverables are a scope of work. Publishing a quantity you cannot
 * honour is a contract you did not agree to — a customer who buys the Launch
 * Kit is entitled to the 250 cards this file promises. Read every line and
 * correct the counts, sizes and stocks before this page goes live.
 *
 * `approxValue` drives the "bought separately" comparison. It is currently a
 * rough multiple, not a real sum of the à-la-carte rates. Either set it from
 * your actual list price or delete the field — an inflated anchor is exactly
 * the kind of claim the Competition Bureau treats as a deceptive ordinary
 * price representation.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const packages: readonly Package[] = [
  {
    slug: "launch-kit",
    name: "Launch Kit",
    tagline: "Everything you need to open the doors.",
    price: 899,
    priceNote: "One-time. 50% deposit to start.",
    bestFor: "New businesses that need to exist online and on paper at once.",
    turnaround: "2–3 weeks from artwork approval",
    approxValue: 1400,
    ctaLabel: "Start the Launch Kit",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Five-page website, built and hosted",
          "Mobile-first, scored on Core Web Vitals",
          "Google Business Profile set up and verified",
          "Contact form routed to your inbox",
        ],
      },
      {
        group: "BRAND",
        items: ["Logo files packaged for print and web", "Colour and type sheet, one page"],
      },
      { group: "PRINT", items: ["250 business cards, 16pt matte"] },
    ],
    addOns: ["Extra website page", "Flyers, 1,000", "Embroidery digitising"],
  },
  {
    slug: "momentum-kit",
    name: "Momentum Kit",
    tagline: "For when the doors are open and the phone needs to ring.",
    price: 1899,
    priceNote: "One-time. 50% deposit to start.",
    badge: "Most booked",
    bestFor: "Businesses with a site that needs to actually bring work in.",
    turnaround: "3–4 weeks from artwork approval",
    approxValue: 3000,
    ctaLabel: "Start the Momentum Kit",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Everything in the Launch Kit",
          "Up to ten pages",
          "Local SEO across three service areas",
          "Analytics and Search Console, configured",
          "One month of support after launch",
        ],
      },
      {
        group: "PRINT",
        items: [
          "500 business cards, 16pt matte",
          "1,000 flyers, 8.5×11 on 100lb gloss",
          "Five coroplast lawn signs with H-stakes",
        ],
      },
      { group: "APPAREL", items: ["Ten decorated tees or polos, left chest"] },
      { group: "BRAND", items: ["Brand sheet and social templates"] },
    ],
    addOns: ["Vehicle lettering", "Feather flag and hardware", "Same-day rush"],
  },
  {
    slug: "storefront-kit",
    name: "Storefront Kit",
    tagline: "Sell online and in person without running two brands.",
    price: 3499,
    priceNote: "One-time. 50% deposit to start.",
    bestFor: "Retail and product businesses selling in both places.",
    turnaround: "4–6 weeks from artwork approval",
    approxValue: 6000,
    ctaLabel: "Start the Storefront Kit",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Shopify build with up to 50 products loaded",
          "Payments and shipping configured",
          "Product photography, up to 30 items",
          "Two hours of training, recorded",
        ],
      },
      {
        group: "PRINT",
        items: ["Packaging labels and hang tags", "1,000 postcards", "Tissue and bag stickers"],
      },
      { group: "SIGNAGE", items: ["Window vinyl, up to two square metres"] },
      { group: "APPAREL", items: ["25 decorated pieces for staff"] },
      { group: "BRAND", items: ["Full brand kit, print and digital"] },
    ],
    addOns: ["Extra product photography", "Trade show kit", "Local SEO plan"],
  },
  {
    slug: "full-surge",
    name: "Full Surge",
    tagline: "The whole shop, pointed at one launch.",
    price: 6999,
    priceNote: "One-time. 50% deposit to start.",
    bestFor: "Rebrands, new locations and franchise openings.",
    turnaround: "6–10 weeks from artwork approval",
    approxValue: 12000,
    ctaLabel: "Start Full Surge",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Custom multi-page build or Shopify",
          "Technical and local SEO",
          "Three months managed, with monthly reporting",
        ],
      },
      {
        group: "PRINT",
        items: [
          "Full stationery set",
          "2,500 flyers or brochures",
          "Trade show kit: backdrop, table throw, two feather flags",
        ],
      },
      {
        group: "SIGNAGE",
        items: ["Vehicle lettering, one vehicle", "Interior wayfinding set"],
      },
      {
        group: "APPAREL",
        items: ["50 decorated pieces across two styles", "Embroidery digitising included"],
      },
      { group: "BRAND", items: ["Identity refresh", "Brand guidelines PDF"] },
    ],
    addOns: ["Additional vehicles", "Photography day", "Full Growth plan"],
  },
];

export type MonthlyPlan = {
  slug: string;
  name: string;
  price: number;
  bestFor: string;
  includes: readonly string[];
};

/** Prices confirmed by the owner. Inclusions are DRAFT — see warning above. */
export const monthlyPlans: readonly MonthlyPlan[] = [
  {
    slug: "local-seo",
    name: "Local SEO",
    price: 399,
    bestFor: "One location that wants to show up in the map pack.",
    includes: [
      "Google Business Profile managed weekly",
      "Local citations kept consistent",
      "On-page SEO for up to five pages",
      "Monthly report you can read",
    ],
  },
  {
    slug: "seo-social",
    name: "SEO + Social",
    price: 799,
    bestFor: "Businesses that need to be found and to stay visible.",
    includes: [
      "Everything in Local SEO",
      "Three social channels managed",
      "Twelve posts a month, shot and written here",
      "Quarterly print credit",
    ],
  },
  {
    slug: "full-growth",
    name: "Full Growth",
    price: 1499,
    bestFor: "Multi-location and multi-service businesses.",
    includes: [
      "Everything in SEO + Social",
      "Technical SEO and Core Web Vitals work",
      "Landing pages built as needed",
      "Priority on every rush job",
      "Monthly call, not just a PDF",
    ],
  },
];

export type AddOn = {
  name: string;
  price: string;
  unit: string;
  /** false = the price is a draft the owner has not confirmed. */
  confirmed: boolean;
};

/**
 * ⚠️  Only the $599 website is a confirmed rate. Every other line is a DRAFT
 *     written to make the table real; correct them before publishing.
 */
export const alaCarte: readonly AddOn[] = [
  { name: "Website", price: "from $599", unit: "per site", confirmed: true },
  { name: "Extra website page", price: "$89", unit: "per page", confirmed: false },
  { name: "Business cards, 16pt matte", price: "$79", unit: "per 500", confirmed: false },
  { name: "Flyers, 8.5×11 on 100lb gloss", price: "$189", unit: "per 1,000", confirmed: false },
  { name: "Coroplast lawn signs with H-stakes", price: "$210", unit: "per 10", confirmed: false },
  { name: "Vinyl banner, 3×6 ft", price: "$145", unit: "each", confirmed: false },
  { name: "Feather flag and hardware", price: "$265", unit: "each", confirmed: false },
  { name: "Vehicle lettering", price: "from $180", unit: "per side", confirmed: false },
  { name: "DTF printed tees, no minimum", price: "from $18", unit: "per piece", confirmed: false },
  { name: "Embroidered polos", price: "from $28", unit: "per piece", confirmed: false },
  { name: "Embroidery digitising", price: "$45", unit: "one-time, per logo", confirmed: false },
  { name: "Same-day rush", price: "+35%", unit: "on stocked items", confirmed: false },
];

export type ComparisonRow = {
  label: string;
  /** Keyed by package slug. Use "—" for not included — never a "~" rating. */
  values: Record<string, string>;
};

/**
 * The matrix. Real values only: a count, a size, a stock, or "—".
 * ⚠️  DRAFT alongside the deliverables above — correct these together, they
 *     must agree line for line or the page contradicts itself.
 */
export const comparisonRows: readonly ComparisonRow[] = [
  {
    label: "Website pages",
    values: { "launch-kit": "5", "momentum-kit": "10", "storefront-kit": "Shopify, 50 products", "full-surge": "Custom or Shopify" },
  },
  {
    label: "Google Business Profile",
    values: { "launch-kit": "Set up", "momentum-kit": "Set up", "storefront-kit": "Set up", "full-surge": "Set up and managed 3 months" },
  },
  {
    label: "Local SEO",
    values: { "launch-kit": "—", "momentum-kit": "3 service areas", "storefront-kit": "3 service areas", "full-surge": "Technical and local" },
  },
  {
    label: "Product photography",
    values: { "launch-kit": "—", "momentum-kit": "—", "storefront-kit": "30 items", "full-surge": "30 items" },
  },
  {
    label: "Business cards",
    values: { "launch-kit": "250", "momentum-kit": "500", "storefront-kit": "500", "full-surge": "Full stationery" },
  },
  {
    label: "Flyers or brochures",
    values: { "launch-kit": "—", "momentum-kit": "1,000", "storefront-kit": "1,000 postcards", "full-surge": "2,500" },
  },
  {
    label: "Signage",
    values: { "launch-kit": "—", "momentum-kit": "5 lawn signs", "storefront-kit": "Window vinyl, 2 m²", "full-surge": "Vehicle and wayfinding" },
  },
  {
    label: "Decorated apparel",
    values: { "launch-kit": "—", "momentum-kit": "10 pieces", "storefront-kit": "25 pieces", "full-surge": "50 pieces, 2 styles" },
  },
  {
    label: "Brand assets",
    values: { "launch-kit": "Logo files, colour sheet", "momentum-kit": "Brand sheet, social templates", "storefront-kit": "Full brand kit", "full-surge": "Identity refresh, guidelines" },
  },
  {
    label: "Support after launch",
    values: { "launch-kit": "—", "momentum-kit": "1 month", "storefront-kit": "2 hours training", "full-surge": "3 months managed" },
  },
  {
    label: "Turnaround",
    values: { "launch-kit": "2–3 weeks", "momentum-kit": "3–4 weeks", "storefront-kit": "4–6 weeks", "full-surge": "6–10 weeks" },
  },
];

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-CA")}`;
}

/** Terms that apply to every package. Shown near the top of /packages. */
export const pricingTerms = [
  "Prices are in Canadian dollars and include delivery across the GTA.",
  "50% deposit to start, balance on delivery.",
  "Turnaround starts on artwork approval, not on the deposit.",
] as const;
