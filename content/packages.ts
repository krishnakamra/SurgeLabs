export type DeliverableGroup = {
  /** Vertical this group belongs to. Drives the job-ticket grouping. */
  group: "WEB" | "PRINT" | "APPAREL" | "SIGNAGE" | "BRAND";
  items: readonly string[];
};

export type Package = {
  slug: string;
  name: string;
  tagline: string;
  /**
   * One sentence, written for someone who has never bought print or a website
   * before. If it needs a second reading, it is wrong.
   */
  plain: string;
  /**
   * Numeric, CAD — or null where the job is genuinely quoted. A made-up
   * number on a custom build is worse than no number, because it is the one
   * figure the customer remembers and it is not the one they will be charged.
   */
  price: number | null;
  priceNote: string;
  badge?: string;
  deliverables: readonly DeliverableGroup[];
  /**
   * What this package does NOT cover, in the customer's words.
   *
   * This exists because "what's included" lists are read as "everything is
   * included". Naming the four things people assume and are wrong about costs
   * one paragraph and saves an argument at invoice time.
   */
  notIncluded?: readonly string[];
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
 *   · Local SEO          $399/mo
 *   · SEO + Social       $799/mo
 *   · Full Growth      $1,499/mo
 *   · Websites starting  $599   (now the Website package, and in ALA_CARTE)
 *
 * DRAFT — NOT SUPPLIED, WRITTEN TO THE DOCUMENTED IN-HOUSE CAPABILITIES:
 *   · the $99 Business Cards package and everything in it
 *   · the design prices quoted here and in content/services.ts
 *       $349 logo · $749 brand kit · $75 redraw · $95 layout
 *   · every `deliverables` line, and all the quantities in them
 *   · every `turnaround`, `bestFor`, `tagline`, `plain` and `notIncluded`
 *   · every price in ALA_CARTE except the $599 website
 *
 * The $99 tier is an entry offer and it is priced below the sum of its parts
 * on purpose — the design alone is normally $95 of layout. That is a decision
 * to win a first job, not an error, but it IS a decision: it has to be one
 * you are willing to honour every time someone takes it, including the ones
 * who never order anything else.
 *
 * The deliverables are a scope of work. Publishing a quantity you cannot
 * honour is a contract you did not agree to — a customer who buys the Launch
 * Kit is entitled to the 250 cards this file promises. Read every line and
 * correct the counts, sizes and stocks before this page goes live.
 *
 * REMOVED, DELIBERATELY: the Storefront Kit at $3,499 and Full Surge at
 * $6,999 no longer carry published prices. Both scopes now sit inside Custom
 * Build and are quoted per job. Nothing about the work changed; what changed
 * is that a $6,999 number on a page turns away the people it is aimed at
 * before they call. `approxValue` and the "bought separately" anchor it fed
 * are gone with them — it was a rough multiple rather than a real sum of the
 * à-la-carte rates, which is exactly the kind of claim the Competition Bureau
 * treats as a deceptive ordinary price representation.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const packages: readonly Package[] = [
  {
    slug: "business-cards",
    name: "Business Cards",
    tagline: "The cheapest way to start working with us.",
    plain: "We design your business card and print 250 of them. That is the whole thing.",
    price: 99,
    priceNote: "One-time. Paid up front.",
    badge: "Start here",
    bestFor: "Anyone who needs a card in hand next week and does not have one.",
    turnaround: "3–5 business days from the moment you approve the proof",
    ctaLabel: "Order the cards",
    deliverables: [
      {
        group: "BRAND",
        items: [
          "We lay the card out for you — two versions to pick from",
          "One round of changes after you have seen it",
          "You approve a full-size proof before it prints",
        ],
      },
      {
        group: "PRINT",
        items: [
          "250 business cards, 16pt matte, printed both sides",
          "The print-ready file, which is yours to keep and reorder from",
          "Delivered anywhere in the GTA, or collect in Mississauga",
        ],
      },
    ],
    notIncluded: [
      "A logo. If you do not have one, logo design is $349 and a redraw of an old one is $75.",
      "Foil, painted edges or spot UV. Those are quoted on top — call and we will price them.",
      "More than 250 cards. Extra cards are cheap once the file exists; ask when you order.",
    ],
    addOns: ["Logo design", "Foil or spot UV", "Matching letterhead"],
  },
  {
    slug: "website",
    name: "Website",
    tagline: "Five pages, live, and it works on a phone.",
    plain:
      "A five-page website we design, build and put online for you. You own it and you can edit it.",
    price: 599,
    priceNote: "One-time. 50% to start, the rest when it goes live.",
    bestFor: "A business with no website, or one it would rather people did not see.",
    turnaround: "2–3 weeks from the day you send us your words and photos",
    ctaLabel: "Start the website",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Five pages, designed and built here",
          "Loads fast and reads properly on a phone",
          "A contact form that lands in your real inbox",
          "Your domain connected and the padlock certificate set up",
          "Google Analytics, so you can see how many people came",
          "A short recorded walkthrough of how to change your own hours and prices",
        ],
      },
    ],
    notIncluded: [
      "Hosting past the first year. It is roughly $20 a month after that, or you can host it yourself — the account stays in your name either way.",
      "Ongoing SEO work. The monthly plans further down this page cover that.",
      "Photography. We can shoot it here and we quote it separately.",
      "Writing all of your text from scratch. We write from a half-hour conversation and you correct it.",
    ],
    addOns: ["Extra pages", "Online store", "Photography", "Local SEO plan"],
  },
  {
    slug: "launch-kit",
    name: "Launch Kit",
    tagline: "Everything you need to open the doors.",
    plain:
      "The website, plus 250 business cards, plus your logo files sorted out properly for print.",
    price: 899,
    priceNote: "One-time. 50% deposit to start.",
    badge: "Most booked",
    bestFor: "A new business that has to exist online and on paper in the same month.",
    turnaround: "2–3 weeks from artwork approval",
    ctaLabel: "Start the Launch Kit",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Everything in the Website package above",
          "Your Google listing set up and verified, so you appear on the map",
        ],
      },
      {
        group: "BRAND",
        items: [
          "Your logo packaged in every file type a printer or sign shop will ask for",
          "A one-page sheet with your colours and fonts written down",
        ],
      },
      { group: "PRINT", items: ["250 business cards, 16pt matte"] },
    ],
    notIncluded: [
      "Designing a logo from scratch. If you have no logo at all, add logo design for $349.",
      "Ongoing SEO or social posting. Those are the monthly plans below.",
      "Signage, flyers or shirts. Those start in the Momentum Kit.",
    ],
    addOns: ["Logo design", "Extra website page", "Flyers, 1,000", "Embroidery digitising"],
  },
  {
    slug: "momentum-kit",
    name: "Momentum Kit",
    tagline: "For when the doors are open and the phone needs to ring.",
    plain:
      "Everything in the Launch Kit, plus the flyers, signs and shirts that get you noticed locally.",
    price: 1899,
    priceNote: "One-time. 50% deposit to start.",
    bestFor: "A business whose website exists but is not bringing any work in.",
    turnaround: "3–4 weeks from artwork approval",
    ctaLabel: "Start the Momentum Kit",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Everything in the Launch Kit",
          "Up to ten pages instead of five",
          "Written for three areas you serve, so you turn up in searches for those towns",
          "Analytics and Search Console set up and explained to you once, in plain words",
          "A month of support after launch — you email, we fix it",
        ],
      },
      {
        group: "PRINT",
        items: [
          "500 business cards, 16pt matte",
          "1,000 flyers, letter size on 100lb gloss",
        ],
      },
      {
        group: "SIGNAGE",
        items: ["Five corrugated plastic lawn signs, with the wire stakes"],
      },
      { group: "APPAREL", items: ["Ten tees or polos with your logo on the left chest"] },
      { group: "BRAND", items: ["A brand sheet, and templates you can post to social with"] },
    ],
    notIncluded: [
      "Vehicle lettering or a wrap. Quoted per vehicle — send a photo and we will price it.",
      "Ongoing SEO after the first month. The $399 plan below picks it up.",
      "Rush production. Same-day is possible on stocked items and costs more.",
    ],
    addOns: ["Vehicle lettering", "Feather flag and hardware", "Same-day rush", "Local SEO plan"],
  },
  {
    slug: "custom-build",
    name: "Custom Build",
    tagline: "Built around what you actually need.",
    plain:
      "You tell us the job. We price exactly that and nothing you are not going to use.",
    price: null,
    priceNote: "Quoted per job. Written quote back within one business day.",
    bestFor:
      "Rebrands, second locations, online stores, franchises and trade shows — anything the four above do not fit.",
    turnaround: "Quoted with the price, so you know before you commit",
    ctaLabel: "Tell us the job",
    deliverables: [
      {
        group: "WEB",
        items: [
          "A site of any size, or an online store with your products loaded",
          "SEO, month by month, aimed at the towns you actually sell in",
        ],
      },
      {
        group: "BRAND",
        items: [
          "A new logo, or a proper tidy-up of the one you have",
          "A brand kit so every supplier gets your colours right",
        ],
      },
      {
        group: "PRINT",
        items: [
          "Any quantity, any stock — cards, flyers, menus, brochures, stationery",
          "Foil, spot UV, painted edges and die-cut shapes",
        ],
      },
      {
        group: "SIGNAGE",
        items: [
          "Storefront, window vinyl, lawn signs, banners and wayfinding",
          "Vehicle lettering and partial wraps",
          "Trade show kit: backdrop, table cover, feather flags",
        ],
      },
      {
        group: "APPAREL",
        items: ["Staff uniforms and team kit, stitched or printed, any quantity"],
      },
    ],
    addOns: ["Photography day", "Monthly plan", "Priority on rush jobs"],
  },
];

export type MonthlyPlan = {
  slug: string;
  name: string;
  price: number;
  bestFor: string;
  /** One plain sentence saying what you are buying every month. */
  plain: string;
  includes: readonly string[];
};

/** Prices confirmed by the owner. Inclusions are DRAFT — see warning above. */
export const monthlyPlans: readonly MonthlyPlan[] = [
  {
    slug: "local-seo",
    name: "Local SEO",
    price: 399,
    plain: "We work on getting you found on Google, and send you a report you can read.",
    bestFor: "One location that wants to show up on the map when someone searches nearby.",
    includes: [
      "Your Google listing looked after every week",
      "Your name, address and phone kept the same everywhere online",
      "Search work on up to five pages of your site",
      "A monthly report written in plain words, not screenshots of graphs",
    ],
  },
  {
    slug: "seo-social",
    name: "SEO + Social",
    price: 799,
    plain: "The search work above, plus we run your social accounts and make the posts.",
    bestFor: "Businesses that need to be found and to stay visible between jobs.",
    includes: [
      "Everything in Local SEO",
      "Three social accounts managed for you",
      "Twelve posts a month, shot and written here",
      "A print credit every quarter to spend on whatever you need",
    ],
  },
  {
    slug: "full-growth",
    name: "Full Growth",
    price: 1499,
    plain: "Everything, managed, with someone you can call rather than a monthly PDF.",
    bestFor: "Businesses with more than one location or more than one service to sell.",
    includes: [
      "Everything in SEO + Social",
      "Technical work to keep the site fast as it grows",
      "New landing pages built when a campaign needs one",
      "You go to the front of the queue on every rush job",
      "A call every month, not just a report",
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
 *     written to make the table real; correct them before publishing. The
 *     four design lines must stay in step with content/services.ts, which
 *     quotes the same numbers.
 */
export const alaCarte: readonly AddOn[] = [
  { name: "Website", price: "from $599", unit: "per site", confirmed: true },
  { name: "Extra website page", price: "$89", unit: "per page", confirmed: false },
  { name: "Logo design", price: "$349", unit: "one-time", confirmed: false },
  { name: "Logo redraw, JPG to vector", price: "$75", unit: "one-time", confirmed: false },
  { name: "Brand kit", price: "$749", unit: "one-time", confirmed: false },
  { name: "Print layout", price: "from $95", unit: "per piece", confirmed: false },
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
    values: {
      "business-cards": "—",
      website: "5",
      "launch-kit": "5",
      "momentum-kit": "10",
      "custom-build": "As many as you need",
    },
  },
  {
    label: "Business cards",
    values: {
      "business-cards": "250",
      website: "—",
      "launch-kit": "250",
      "momentum-kit": "500",
      "custom-build": "Any quantity",
    },
  },
  {
    label: "Design of the printed piece",
    values: {
      "business-cards": "Included",
      website: "—",
      "launch-kit": "Included",
      "momentum-kit": "Included",
      "custom-build": "Included",
    },
  },
  {
    label: "Logo files packaged for print",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "Included",
      "momentum-kit": "Included",
      "custom-build": "Included",
    },
  },
  {
    label: "A new logo drawn from scratch",
    values: {
      "business-cards": "Add $349",
      website: "Add $349",
      "launch-kit": "Add $349",
      "momentum-kit": "Add $349",
      "custom-build": "Included if you need one",
    },
  },
  {
    label: "Google listing on the map",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "Set up",
      "momentum-kit": "Set up",
      "custom-build": "Set up and managed",
    },
  },
  {
    label: "Turning up in nearby towns",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "—",
      "momentum-kit": "3 areas",
      "custom-build": "Quoted to fit",
    },
  },
  {
    label: "Flyers",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "—",
      "momentum-kit": "1,000",
      "custom-build": "Any quantity",
    },
  },
  {
    label: "Lawn signs",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "—",
      "momentum-kit": "5, with stakes",
      "custom-build": "Any quantity",
    },
  },
  {
    label: "Shirts with your logo",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "—",
      "momentum-kit": "10 pieces",
      "custom-build": "Any quantity",
    },
  },
  {
    label: "Help after it goes live",
    values: {
      "business-cards": "—",
      website: "—",
      "launch-kit": "—",
      "momentum-kit": "1 month",
      "custom-build": "Up to 3 months",
    },
  },
  {
    label: "How long it takes",
    values: {
      "business-cards": "3–5 days",
      website: "2–3 weeks",
      "launch-kit": "2–3 weeks",
      "momentum-kit": "3–4 weeks",
      "custom-build": "Quoted with the price",
    },
  },
];

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-CA")}`;
}

/**
 * What goes on the card. A package with no fixed price says so in words
 * rather than borrowing a number from the tier above it.
 */
export function priceLabel(pkg: Pick<Package, "price">): string {
  return pkg.price === null ? "Quoted" : formatPrice(pkg.price);
}

/** Terms that apply to every package. Shown near the top of /packages. */
export const pricingTerms = [
  "Prices are in Canadian dollars and include delivery across the GTA.",
  "50% deposit to start, the rest on delivery. The $99 cards are paid up front.",
  "The clock starts when you approve the proof, not when you pay the deposit.",
  "Nothing goes to print until you have seen a proof and said yes in writing.",
] as const;
