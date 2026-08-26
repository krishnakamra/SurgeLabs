import { galleryStills, panelStills, packageStills, type ImageAsset } from "./media";

/**
 * The product galleries under /work.
 *
 * /work used to be one page of case studies. That answers "are these people
 * any good", which is the second question — the first is "do you make the
 * thing I need". So the Work menu is now six categories a customer would use
 * themselves, each one a page of the actual product, and the case studies sit
 * underneath as supporting evidence rather than as the whole page.
 *
 * ⚠️  PRICES HERE MUST AGREE WITH content/packages.ts (alaCarte) AND
 *     content/services.ts. They are the same numbers written in a third
 *     place, which is a real risk — a customer who finds $79 on one page and
 *     $89 on another believes neither. Change one, change all three.
 *     Everything marked "Quoted" is quoted because it genuinely varies, not
 *     because nobody has worked it out.
 */

export type GalleryItem = {
  /** Kebab-case, unique across every category. Keys into galleryStills. */
  slug: string;
  category: string;
  /** What the thing is called. Short — this is a product name. */
  title: string;
  /** One plain sentence. What it is and who takes it. */
  blurb: string;
  /** The real production spec. Same numbers as content/services.ts. */
  spec: string;
  /** What it costs, or "Quoted per job" where it honestly varies. */
  price: string;
};

export type GalleryCategory = {
  slug: string;
  /** Nav label. */
  name: string;
  /** The small line under the label in the Work dropdown. */
  blurb: string;
  /** H1 on the category page. Carries the primary keyword. */
  h1: string;
  /** ≤47 chars — " | Surge Labs" is appended and 60 is where Google cuts. */
  metaTitle: string;
  /** 80–155 chars. */
  description: string;
  /**
   * One primary term and three supporting ones, same contract as
   * content/keywords.ts. The H1 and the title both have to carry the primary,
   * and scripts/check-seo.mjs asserts it.
   *
   * These deliberately sit beside the local service × city pages rather than
   * on top of them: /business-cards/mississauga goes after "business cards
   * mississauga", this page goes after "business card printing mississauga".
   * Close, but different intent, and both are strong pages.
   */
  keywords: { primary: string; secondary: readonly [string, string, string] };
  /** Standfirst. Two sentences at most. */
  intro: string;
  /** The service page this rolls up to. */
  service: string;
  /**
   * Categories offered at the foot of this one.
   *
   * NOT "people also bought". We have no purchase data, and a fabricated
   * aggregate is a false representation rather than a design flourish. These
   * are the shop's own pairings — what actually gets ordered on the same job
   * ticket — and the section says so in as many words.
   */
  goesWith: readonly string[];
  /**
   * Two images to represent this category in someone else's cross-sell strip.
   * Defaults to its own first two items; set it where a category has none.
   */
  crossSell?: readonly [ImageAsset, ImageAsset];
};

export const galleryCategories: readonly GalleryCategory[] = [
  {
    slug: "websites",
    name: "Websites",
    blurb: "Sites we designed and built, live right now",
    h1: "Websites we built in Mississauga and the GTA",
    intro:
      "Every site below is live and you can open it. The line under each one says exactly what we did on it, because some we designed and built and on others we only did the search work.",
    metaTitle: "Websites We Built in Mississauga",
    description:
      "Live websites we designed and built for Mississauga and GTA businesses. Each one says exactly what we did on it. Call 905-598-3960.",
    keywords: {
      primary: "websites mississauga",
      secondary: ["web design portfolio gta", "small business website mississauga", "shopify developer mississauga"],
    },
    service: "web-design-seo",
    goesWith: ["business-cards", "design", "print"],
    // No product shots of its own: a generated screenshot of a website that
    // does not exist would be a fabricated product, which is the one thing
    // this site does not do. The real captures arrive with the portfolio.
    crossSell: [packageStills.website!, panelStills["web-design-seo"]!],
  },
  {
    slug: "business-cards",
    name: "Business cards",
    blurb: "Every stock and finish we run",
    h1: "Business card printing in Mississauga",
    intro:
      "Six ways to make a card, from the everyday 16pt matte to a foil-stamped 32pt with a painted edge. All of them are cut and finished on Skymark Ave.",
    metaTitle: "Business Card Printing in Mississauga",
    description:
      "Every business card stock and finish we run in Mississauga: 16pt matte, soft-touch with spot UV, 32pt painted edge, gold foil and blind deboss.",
    keywords: {
      primary: "business card printing mississauga",
      secondary: ["spot uv business cards gta", "painted edge cards toronto", "foil business cards mississauga"],
    },
    service: "printing-signage",
    goesWith: ["print", "design", "apparel"],
  },
  {
    slug: "print",
    name: "Print material",
    blurb: "Flyers, menus, brochures, stationery",
    h1: "Commercial print material in Mississauga",
    intro:
      "The paper a business gets through in a year. Flyers and menus reprint often, so they are set up to be reprinted cheaply rather than beautifully once.",
    metaTitle: "Print Material in Mississauga",
    description:
      "Flyers, brochures, menus, letterhead, folders and NCR forms printed in Mississauga. Real stocks and real prices. Call 905-598-3960.",
    keywords: {
      primary: "print material mississauga",
      secondary: ["flyer printing mississauga", "brochure printing gta", "ncr forms toronto"],
    },
    service: "printing-signage",
    goesWith: ["business-cards", "signage", "design"],
  },
  {
    slug: "signage",
    name: "Signs and vehicles",
    blurb: "Banners, lawn signs, storefronts, vans",
    h1: "Signs and vehicle graphics in Mississauga",
    intro:
      "Everything that has to survive a Canadian winter outside. Printed on a 54-inch roll here, so a banner can be any length with no seam in it.",
    metaTitle: "Signs & Vehicle Graphics, Mississauga",
    description:
      "Vinyl banners, lawn signs, A-frames, trade show kit, vehicle lettering and window vinyl, made in Mississauga and delivered across the GTA.",
    keywords: {
      primary: "signs mississauga",
      secondary: ["vinyl banners mississauga", "lawn signs gta", "vehicle lettering toronto"],
    },
    service: "printing-signage",
    goesWith: ["print", "apparel", "business-cards"],
  },
  {
    slug: "apparel",
    name: "Apparel",
    blurb: "Stitched and printed, from one piece",
    h1: "Custom shirts, hats and workwear in Mississauga",
    intro:
      "Embroidery, DTF and screen printing, all done on site. There is no minimum on DTF — one hoodie for a new hire is a real order and it costs what one hoodie costs.",
    metaTitle: "Custom Shirts & Workwear, Mississauga",
    description:
      "Embroidered polos, printed tees, hoodies, caps, hi-vis and aprons decorated in Mississauga. No minimum on DTF. Call 905-598-3960.",
    keywords: {
      primary: "custom shirts mississauga",
      secondary: ["embroidered polos gta", "screen printing mississauga", "hi vis embroidery toronto"],
    },
    service: "custom-apparel",
    goesWith: ["signage", "business-cards", "design"],
  },
  {
    slug: "design",
    name: "Design and branding",
    blurb: "Logos, brand kits, print artwork",
    h1: "Logo and graphic design in Mississauga",
    intro:
      "Drawn here, in the building that prints it. Which is why the hairlines are thick enough to stitch and the blue does not turn purple in CMYK.",
    metaTitle: "Logo & Graphic Design, Mississauga",
    description:
      "Logo design from $349, redraws from $75 and brand kits from $749, drawn in the same building that prints them. Call 905-598-3960.",
    keywords: {
      primary: "logo design mississauga",
      secondary: ["brand kit mississauga", "vector logo redraw gta", "graphic design toronto"],
    },
    service: "graphic-design",
    goesWith: ["business-cards", "print", "websites"],
  },
];

export const galleryItems: readonly GalleryItem[] = [
  // ── Business cards ───────────────────────────────────────────────────────
  {
    slug: "cards-16pt",
    category: "business-cards",
    title: "16pt matte",
    blurb: "The everyday card. Thick enough to feel like one, cheap enough to reorder without thinking about it.",
    spec: "16pt C2S · matte lamination · printed both sides",
    price: "$79 per 500",
  },
  {
    slug: "cards-spot-uv",
    category: "business-cards",
    title: "Soft-touch with spot UV",
    blurb: "The card people notice without being able to say why. The surface feels like suede and the logo sits proud of it in gloss.",
    spec: "16pt · soft-touch film · gloss varnish on chosen areas",
    price: "Quoted on top",
  },
  {
    slug: "cards-painted-edge",
    category: "business-cards",
    title: "32pt painted edge",
    blurb: "Two 16pt sheets bonded with a colour running through the middle, so a line of it shows right around the card.",
    spec: "32pt duplex · edge painted after trimming",
    price: "Quoted per job",
  },
  {
    slug: "cards-foil",
    category: "business-cards",
    title: "Gold foil stamped",
    blurb: "Real metal leaf pressed into the stock under heat. It sits on top of the paper rather than soaking in, so gold on black reads as gold.",
    spec: "Hot foil · 250 minimum · die kept on file for reorders",
    price: "Quoted per job",
  },
  {
    slug: "cards-letterpress",
    category: "business-cards",
    title: "Blind deboss",
    blurb: "The impression with nothing in it. On a heavy sheet you can feel the artwork from the back with a thumbnail.",
    spec: "18pt uncoated or 32pt · die kept on file",
    price: "Quoted per job",
  },
  {
    slug: "cards-cut",
    category: "business-cards",
    title: "Cut and finished here",
    blurb: "Every card is guillotined in this building, which is why a stocked 16pt job approved before 11am can go the same day.",
    spec: "3–5 business days standard · same-day rush on stocked items",
    price: "Rush is +35%",
  },

  // ── Print material ───────────────────────────────────────────────────────
  {
    slug: "print-flyers",
    category: "print",
    title: "Flyers",
    blurb: "The cheapest way to say something to a whole street. Gloss for photographs, uncoated if people will write on it.",
    spec: "8.5×11 · 100lb gloss, matte or uncoated text",
    price: "$189 per 1,000",
  },
  {
    slug: "print-brochures",
    category: "print",
    title: "Brochures",
    blurb: "Scored before folding so a heavy stock does not crack along the spine — the thing that makes a cheap brochure look cheap.",
    spec: "Tri-fold, z-fold and half fold on 100lb text",
    price: "Quoted by fold and count",
  },
  {
    slug: "print-menus",
    category: "print",
    title: "Menus",
    blurb: "If your prices change more than twice a year, print on plain stock and reprint. A laminated menu with an old price on it is worse than a paper one.",
    spec: "Dine-in on laminated 14pt or 16pt · takeout on 100lb gloss",
    price: "Quoted per job",
  },
  {
    slug: "print-stationery",
    category: "print",
    title: "Letterhead and envelopes",
    blurb: "Matched as a set, so the white of the letterhead is the white of the envelope. Ordering them separately is how that goes wrong.",
    spec: "70lb bond letterhead · #10 envelopes, window or plain · 60lb notepads",
    price: "Quoted per set",
  },
  {
    slug: "print-folders",
    category: "print",
    title: "Presentation folders",
    blurb: "For anyone quoting jobs in the thousands. A folder holding the quote, the certificate and the past work beats a loose stack of paper.",
    spec: "14pt · glued pockets · diagonal card slits",
    price: "Quoted from the count",
  },
  {
    slug: "print-ncr",
    category: "print",
    title: "NCR forms and pads",
    blurb: "Still the fastest way to leave a written quote at a door. Numbered copies settle arguments later.",
    spec: "2-part and 3-part carbonless · sequential numbering",
    price: "Quoted from the count",
  },

  // ── Signs and vehicles ───────────────────────────────────────────────────
  {
    slug: "sign-banner",
    category: "signage",
    title: "Vinyl banners",
    blurb: "Hemmed on all four sides with grommets, because an unhemmed banner tears at the first grommet in the first wind.",
    spec: "13oz scrim · 8oz mesh for fences · 54\" seamless, any length",
    price: "$145 for 3×6 ft",
  },
  {
    slug: "sign-lawn",
    category: "signage",
    title: "Lawn signs",
    blurb: "The cheapest lead source a trade has. Left on a lawn for the week after a job, it is proof rather than a claim.",
    spec: "4mm coroplast · one or two sides · H-stakes included",
    price: "$210 per 10",
  },
  {
    slug: "sign-aframe",
    category: "signage",
    title: "A-frames",
    blurb: "The frame is reusable. You replace the insert when the special changes, which costs a fraction of the first order.",
    spec: "24×36 inserts · swapped seasonally",
    price: "Quoted per job",
  },
  {
    slug: "sign-display",
    category: "signage",
    title: "Trade show kit",
    blurb: "Backdrop, table cover and flags that pack into a car. The retractable cartridge is reusable — reprint the graphic and keep the base.",
    spec: "Retractables 33×81 and 47×81 · feather flags 8, 11 and 14ft · 6ft and 8ft table covers",
    price: "$265 per feather flag",
  },
  {
    slug: "sign-vehicle",
    category: "signage",
    title: "Vehicle lettering",
    blurb: "For most trades, lettering on the doors and tailgate does the job of a wrap for a fraction of it — and it is easy to change when your number does.",
    spec: "Cut vinyl on doors, tailgate and rear window · partial wraps printed and laminated · 30mil magnets",
    price: "from $180 per side",
  },
  {
    slug: "sign-window",
    category: "signage",
    title: "Window vinyl",
    blurb: "Frosted etch reads as sandblasted glass for a fraction of sandblasting glass, and it solves a real privacy problem rather than a decorative one.",
    spec: "White, clear, frosted etch and 50/50 perforated",
    price: "Quoted by area",
  },

  // ── Apparel ──────────────────────────────────────────────────────────────
  {
    slug: "wear-polos",
    category: "apparel",
    title: "Embroidered polos",
    blurb: "Stitching does not fade or crack and it survives commercial laundry, which is why hospitality and trades kit is almost always embroidered.",
    spec: "Left chest 3.5–4in · 5,000–12,000 stitches · up to 15 thread colours",
    price: "from $28 a piece",
  },
  {
    slug: "wear-hoodies",
    category: "apparel",
    title: "Hoodies and crewnecks",
    blurb: "The piece a crew will actually wear off site, which is the only kind of branded clothing that keeps advertising.",
    spec: "Event weight through retail weight · embroidered or printed",
    price: "Quoted from the count",
  },
  {
    slug: "wear-tees",
    category: "apparel",
    title: "Printed tees",
    blurb: "Under 24 pieces, DTF is almost always cheaper and we will say so. Above it, screen printing wins and keeps winning.",
    spec: "DTF no minimum, up to 13×19in · screen printing from 24 pieces, up to 6 colours",
    price: "from $18 a piece",
  },
  {
    slug: "wear-caps",
    category: "apparel",
    title: "Caps and beanies",
    blurb: "A cap front is a small, curved, seamed surface — fine detail below a quarter inch does not survive it, so we simplify and show you the proof first.",
    spec: "Structured, unstructured and trucker · front, side and back placements",
    price: "Quoted from the count",
  },
  {
    slug: "wear-hivis",
    category: "apparel",
    title: "Hi-vis and workwear",
    blurb: "Embroidered chest, printed back. Stitching goes around the reflective tape rather than through it, which is what keeps the tape working.",
    spec: "Class 2 vests and long-sleeve shirts · embroidered or printed",
    price: "Quoted from the count",
  },
  {
    slug: "wear-aprons",
    category: "apparel",
    title: "Aprons and totes",
    blurb: "The apron is in every photograph a customer takes in your room, which makes it the piece worth spending on.",
    spec: "Crossback and waist aprons · canvas totes · embroidered or printed",
    price: "Quoted from the count",
  },

  // ── Design and branding ──────────────────────────────────────────────────
  {
    slug: "design-sketches",
    category: "design",
    title: "Logo design",
    blurb: "You see three directions, not thirty. Thirty options is a way of making the client do the choosing.",
    spec: "Three directions · two rounds of changes · 5–7 business days",
    price: "$349",
  },
  {
    slug: "design-vector",
    category: "design",
    title: "Logo redraw",
    blurb: "If the only file you have is a JPG off an old card, nobody can print it properly. We redraw it once and it works everywhere after that.",
    spec: "From a photo, screenshot or old card · .ai, .eps, .svg and PDF · 1–2 days",
    price: "$75",
  },
  {
    slug: "design-brand-kit",
    category: "design",
    title: "Brand kits",
    blurb: "The short document you hand a printer, a sign shop or a new employee so they get your colours right without phoning you.",
    spec: "6–10 pages · every logo version · CMYK, HEX and Pantone · fonts and spacing · 2–3 weeks",
    price: "$749",
  },
  {
    slug: "design-pantone",
    category: "design",
    title: "Colour matching",
    blurb: "Your blue specified three ways, so the blue on your van is the blue on your website is the blue on your card.",
    spec: "CMYK for print · HEX for screen · Pantone for foil and cut vinyl",
    price: "In the brand kit",
  },
  {
    slug: "design-brand-sheet",
    category: "design",
    title: "Print and screen artwork",
    blurb: "Most of our design work is not logos. It is laying out the thing that gets printed, at the right size, with the right bleed.",
    spec: "Set at finished size · CMYK · 0.125\" bleed · fonts outlined · full-size PDF proof",
    price: "from $95 a piece",
  },
];

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export function getGalleryCategory(slug: string): GalleryCategory | undefined {
  return galleryCategories.find((category) => category.slug === slug);
}

export function itemsInCategory(slug: string): readonly GalleryItem[] {
  return galleryItems.filter((item) => item.category === slug);
}

export function galleryShot(item: GalleryItem): ImageAsset {
  return galleryStills[item.slug]!;
}

/** The two images that represent a category inside someone else's strip. */
export function crossSellShots(category: GalleryCategory): readonly ImageAsset[] {
  if (category.crossSell) return category.crossSell;
  return itemsInCategory(category.slug).slice(0, 2).map(galleryShot);
}

/* ── The gate ────────────────────────────────────────────────────────────── */

/**
 * Runs at import, so `next build` fails on a broken gallery rather than
 * rendering a card with no picture in it. Same rule as content/local-pages.ts.
 */
function validate(): void {
  const errors: string[] = [];
  const categorySlugs = new Set(galleryCategories.map((c) => c.slug));
  const seen = new Set<string>();

  for (const category of galleryCategories) {
    for (const related of category.goesWith) {
      if (!categorySlugs.has(related)) {
        errors.push(`${category.slug}: goesWith names "${related}", which is not a category`);
      }
      if (related === category.slug) {
        errors.push(`${category.slug}: goesWith includes itself`);
      }
    }
    if (crossSellShots(category).length !== 2) {
      errors.push(
        `${category.slug}: needs two cross-sell images — give it two items, or set \`crossSell\``,
      );
    }
  }

  for (const item of galleryItems) {
    if (seen.has(item.slug)) errors.push(`duplicate item slug "${item.slug}"`);
    seen.add(item.slug);
    if (!categorySlugs.has(item.category)) {
      errors.push(`${item.slug}: category "${item.category}" does not exist`);
    }
    if (!galleryStills[item.slug]) {
      errors.push(`${item.slug}: no image in content/media.ts galleryStills`);
    }
    for (const field of ["title", "blurb", "spec", "price"] as const) {
      if (!item[field]?.trim()) errors.push(`${item.slug}: ${field} is empty`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`content/gallery.ts is not publishable:\n  - ${errors.join("\n  - ")}\n`);
  }
}

validate();
