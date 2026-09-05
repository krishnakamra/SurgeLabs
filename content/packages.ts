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
  /**
   * true → the number is published as a FLOOR ("from $499"), not a price.
   *
   * This is the model the owner chose, and it is the honest one for a shop
   * that quotes each job: a floor is a promise you can always keep, because
   * the only way to break it is to charge someone less. A fixed price is a
   * promise that a bad week in February can force you to break.
   *
   * Set it false only where the spec is completely nailed down and the number
   * cannot move — the $99 card offer is the one of those on this site.
   */
  priceFrom: boolean;
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
 * The pricing model is FLOORS, not fixed prices. You quote each job, so the
 * site publishes the least a thing can cost and quotes the rest. `priceFrom`
 * on each tier controls that, and `priceLabel()` renders it.
 *
 * CONFIRMED BY THE OWNER, 2026-08-26:
 *   · Business Cards       $99   — design + 1,000 cards. FIXED, not a floor.
 *   · Website         from $399
 *   · Local SEO            $399/mo
 *   · SEO + Social         $799/mo
 *   · Full Growth        $1,499/mo
 *
 * NOT CONFIRMED — quote-only until you give a number:
 *   · Launch Kit    — was $899. Asked; not ticked. `price: null`.
 *   · Momentum Kit  — was $1,899. Asked; not ticked. `price: null`.
 *
 *   Both still describe their scope, which is honest — a quoted package can
 *   list what is in it. Give either one a floor and it goes live: set
 *   `price` and leave `priceFrom: true`.
 *
 * REDUCED ON INSTRUCTION, STILL A PROPOSAL — the owner said the design prices
 * were too high and to reduce them, without naming figures. These are the
 * reduced ones, published as floors so they cannot bite:
 *   · Logo design    from $199   (was $349)
 *   · Logo redraw    from  $45   (was  $75)
 *   · Brand kit      from $399   (was $749)
 *   · Print layout   from  $65   (was  $95)
 *   They are quoted in content/services.ts and content/gallery.ts as well.
 *   Change one, change all three.
 *
 * STILL DRAFT — written to the documented in-house capabilities, never
 * supplied:
 *   · every `deliverables` line, and all the quantities in them
 *   · every `turnaround`, `bestFor`, `tagline`, `plain` and `notIncluded`
 *   · every price in ALA_CARTE except the $399 website and the two lines
 *     the owner priced directly: flyers from $120/500 and tees from $12
 *
 * The $99 tier is the one fixed price on the site and it is deliberately
 * below the sum of its parts. It has to be a number you are willing to honour
 * every time someone takes it, including the ones who never order anything
 * else — 1,000 cards is a real cost even when the design is quick.
 *
 * The deliverables are a scope of work. Publishing a quantity you cannot
 * honour is a contract you did not agree to. Read every line.
 *
 * REMOVED EARLIER, STILL REMOVED: the Storefront Kit at $3,499 and Full Surge
 * at $6,999. Both scopes sit inside Custom Build and are quoted per job.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const packages: readonly Package[] = [
  {
    slug: "business-cards",
    name: "Business Cards",
    tagline: "The cheapest way to start working with us.",
    plain: "We design your business card and print 1,000 of them. That is the whole thing.",
    price: 99,
    // The one fixed price on the site. The spec is completely nailed down, so
    // there is nothing for a floor to protect against.
    priceFrom: false,
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
          "1,000 business cards, 16pt matte, printed both sides",
          "The print-ready file, which is yours to keep and reorder from",
          "Delivered anywhere in the GTA, or collect in Mississauga",
        ],
      },
    ],
    notIncluded: [
      "A logo. If you do not have one, logo design starts at $199 and redrawing an old one starts at $45.",
      "Foil, painted edges or spot UV. Those are quoted on top — call and we will price them.",
      "A second design. This is one card laid out and printed — a second version for a partner or a second location is quoted on top.",
    ],
    addOns: ["Logo design", "Foil or spot UV", "Matching letterhead"],
  },
  {
    slug: "website",
    name: "Website",
    tagline: "Live, and it works on a phone.",
    plain:
      "A website we design, build and put online for you. You own it and you can edit it.",
    price: 399,
    priceFrom: true,
    priceNote: "One-time. 50% to start, the rest when it goes live. Quoted from the page count.",
    bestFor: "A business with no website, or one it would rather people did not see.",
    turnaround: "2–3 weeks from the day you send us your words and photos",
    ctaLabel: "Start the website",
    deliverables: [
      {
        group: "WEB",
        items: [
          "Designed and built here, five pages as standard",
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
      "The website, plus 1,000 business cards, plus your logo files sorted out properly for print.",
    // Quote-only: the owner was asked to confirm $899 and did not. A number
    // here goes straight onto the page, so it stays null until there is one.
    price: null,
    priceFrom: true,
    priceNote: "Quoted per job. Written quote back within one business day.",
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
      { group: "PRINT", items: ["1,000 business cards, 16pt matte"] },
    ],
    notIncluded: [
      "Designing a logo from scratch. If you have no logo at all, logo design starts at $199.",
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
    // Quote-only, same reason as the Launch Kit above.
    price: null,
    priceFrom: true,
    priceNote: "Quoted per job. Written quote back within one business day.",
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
    priceFrom: true,
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
 * ⚠️  FLOORS, NOT PRICES. Every line here is the least a thing costs, because
 *     the owner quotes each job. Only the $499 website is a confirmed rate;
 *     every other number is a DRAFT written to make the table real.
 *
 *     The four design lines were reduced on instruction and are still a
 *     proposal — see the block at the top of this file. They are quoted in
 *     content/services.ts and content/gallery.ts too. Change one, change all
 *     three.
 *
 *     CONFIRMED directly by the owner: the $399 website, flyers from $120 per
 *     500 on 100lb gloss text, and printed tees from $12 a piece.
 */
export const alaCarte: readonly AddOn[] = [
  { name: "Website", price: "from $399", unit: "per site", confirmed: true },
  { name: "Extra website page", price: "from $79", unit: "per page", confirmed: false },
  { name: "Logo design", price: "from $199", unit: "one-time", confirmed: false },
  { name: "Logo redraw, JPG to vector", price: "from $45", unit: "one-time", confirmed: false },
  { name: "Brand kit", price: "from $399", unit: "one-time", confirmed: false },
  { name: "Print layout", price: "from $65", unit: "per piece", confirmed: false },
  { name: "Business cards, 16pt matte", price: "from $79", unit: "per 500", confirmed: false },
  { name: "Flyers, 8.5×11 on 100lb gloss text", price: "from $120", unit: "per 500", confirmed: true },
  { name: "Coroplast lawn signs with H-stakes", price: "from $210", unit: "per 10", confirmed: false },
  { name: "Vinyl banner, 3×6 ft", price: "from $145", unit: "each", confirmed: false },
  { name: "Feather flag and hardware", price: "from $265", unit: "each", confirmed: false },
  { name: "Vehicle lettering", price: "from $180", unit: "per side", confirmed: false },
  { name: "Printed tees, no minimum", price: "from $12", unit: "per piece", confirmed: true },
  { name: "Embroidered polos", price: "from $28", unit: "per piece", confirmed: false },
  { name: "Embroidery digitising", price: "from $45", unit: "one-time, per logo", confirmed: false },
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
      "business-cards": "1,000",
      website: "—",
      "launch-kit": "1,000",
      "momentum-kit": "1,000",
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
      "business-cards": "From $199",
      website: "From $199",
      "launch-kit": "From $199",
      "momentum-kit": "From $199",
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
 * What goes on the card.
 *
 * Three shapes, and the difference between them is a promise:
 *   "$99"        a fixed price. We charge this.
 *   "from $499"  a floor. We never charge less; the quote says the rest.
 *   "Quoted"     no number is published, because none is decided.
 *
 * A tier with no price never borrows the number from the tier above it.
 */
export function priceLabel(pkg: Pick<Package, "price" | "priceFrom">): string {
  if (pkg.price === null) return "Quoted";
  return pkg.priceFrom ? `from ${formatPrice(pkg.price)}` : formatPrice(pkg.price);
}

/** The unit line under a price. */
export function priceUnit(pkg: Pick<Package, "price" | "priceFrom">): string {
  if (pkg.price === null) return "Per job, in CAD";
  return pkg.priceFrom ? "Starting price, CAD" : "One-time, CAD";
}

/** Terms that apply to every package. Shown near the top of /packages. */
export const pricingTerms = [
  "Every price here is a starting price, in Canadian dollars, with delivery across the GTA included. The $99 cards are the one fixed price on the page.",
  "A starting price is the least a job costs. Send us the details and you get the real number in writing within one business day.",
  "50% deposit to start, the rest on delivery. The $99 cards are paid up front.",
  "The clock starts when you approve the proof, not when you pay the deposit.",
  "Nothing goes to print until you have seen a proof and said yes in writing.",
] as const;
