import type { Service } from "./services";

export type WorkItem = {
  slug: string;
  /** Job-ticket numeral, two digits. */
  number: string;
  /** What the job was. Reads as a title. */
  title: string;
  /** Who it was for, by sector. Never a company name — see the note below. */
  sector: string;
  /** Which city it went to. Must be a slug from content/cities.ts. */
  city: string;
  /** Service slugs involved, in production order. */
  services: readonly string[];
  /** The brief, in one or two sentences. */
  brief: string;
  /** What actually got made. */
  deliverables: readonly string[];
  /**
   * One production fact. Must be reproducible from the specs in
   * content/services.ts — never a number invented for this page.
   */
  spec: string;
  /** How long it took, in the same terms the service pages use. */
  turnaround: string;
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: THESE ARE ILLUSTRATIVE JOBS, NOT A CLIENT LIST.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * You asked for this page to be populated now and edited later, so it is
 * written to be swapped rather than to be believed. Two deliberate choices
 * make that safe:
 *
 *   1. NO CLIENT IS NAMED. Every entry is described by sector and city — "a
 *      Mississauga HVAC contractor", not an invented company. Inventing a
 *      business name risks colliding with a real one in the same trade and
 *      the same city, which is a different and much worse problem than an
 *      empty page.
 *
 *   2. NO NUMBER IS NEW. Every `spec` and `turnaround` below is drawn from
 *      the confirmed production specs in content/services.ts. If a figure is
 *      wrong here it is wrong there too, and there is exactly one place to
 *      fix it.
 *
 * What is illustrative is the JOBS THEMSELVES — the combinations, the
 * sectors, the briefs. Replace them with real ones as you have permission to
 * publish them, and add the client name to a `client` field when you do.
 * Until then this page is an honest description of the work the shop does,
 * with nothing on it presented as a named reference.
 *
 * Testimonials are a separate matter and stay gated — see
 * content/testimonials.ts. A fabricated endorsement is illegal advertising
 * in Canada; an illustrative job description is not.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const work: readonly WorkItem[] = [
  {
    slug: "hvac-fleet-and-site",
    number: "01",
    title: "Fleet lettering and a site that matched it",
    sector: "HVAC contractor",
    city: "mississauga",
    services: ["web-design-seo", "printing-signage"],
    brief:
      "Six vans lettered inconsistently by three different suppliers, and a website in a blue nobody could find the file for. The brand was rebuilt from the van outward.",
    deliverables: [
      "Cut vinyl lettering across six vans",
      "Five-page site with a service-area map",
      "Google Business Profile rebuilt and verified",
      "16pt business cards for four technicians",
    ],
    spec: "Cut lettering, colour-matched across vinyl and screen",
    turnaround: "Site in 2–3 weeks; vans in 3–5 business days",
  },
  {
    slug: "restaurant-foil-menus",
    number: "02",
    title: "Foiled menus and table cards for a relaunch",
    sector: "Independent restaurant",
    city: "oakville",
    services: ["gold-foil-stationery", "printing-signage"],
    brief:
      "A dining room refit with three weeks to opening. The menus had to look like the room, which meant foil on uncoated stock rather than laminated cards.",
    deliverables: [
      "Foiled A4 menus on 18pt uncoated",
      "Table numbers, 32pt with painted edges",
      "Foiled gift cards",
      "Window vinyl for the street frontage",
    ],
    spec: "Gold foil on 18pt uncoated; 32pt painted edge on the table cards",
    turnaround: "5–7 business days from proof approval",
  },
  {
    slug: "trades-crew-apparel",
    number: "03",
    title: "Crew apparel that survived a season",
    sector: "Landscaping company",
    city: "brampton",
    services: ["custom-apparel"],
    brief:
      "Forty seasonal staff, two intakes a year, and a logo that had previously been printed small enough to disappear at ten paces.",
    deliverables: [
      "Screen-printed tees, two colours, front and back",
      "Embroidered caps and quarter-zips",
      "Reorder file kept for the second intake",
    ],
    spec: "Screen print from 24 pieces; embroidery digitised in-house",
    turnaround: "7–10 business days from proof and garment arrival",
  },
  {
    slug: "clinic-signage-programme",
    number: "04",
    title: "Wayfinding for a three-floor clinic",
    sector: "Medical clinic",
    city: "etobicoke",
    services: ["printing-signage"],
    brief:
      "A building with three tenants and no consistent signage. Patients were arriving at the wrong floor, which the front desk was absorbing as phone time.",
    deliverables: [
      "Exterior fascia sign",
      "Directory and floor plates",
      "Frosted window vinyl for consult rooms",
      "A-frame for the street",
    ],
    spec: "Coroplast and vinyl, printed to 54\" seamless",
    turnaround: "3–5 business days from proof approval",
  },
  {
    slug: "law-firm-stationery",
    number: "05",
    title: "A stationery set that reads as old",
    sector: "Law firm",
    city: "toronto",
    services: ["gold-foil-stationery"],
    brief:
      "A four-partner firm that wanted its stationery to look like it had existed for longer than it had. Blind deboss did more of that work than the foil did.",
    deliverables: [
      "Foiled and blind-debossed business cards, 32pt",
      "Letterhead and compliment slips",
      "Presentation folders",
    ],
    spec: "Foil plus blind deboss — two passes, dies kept on file",
    turnaround: "5–7 business days; reorders faster from the existing die",
  },
  {
    slug: "retail-shopify-and-packaging",
    number: "06",
    title: "A shop that sells in the room and online",
    sector: "Home goods retailer",
    city: "milton",
    services: ["web-design-seo", "gold-foil-stationery"],
    brief:
      "Stock was being sold twice — once in the shop, once online — with no shared inventory. The packaging also had to survive a courier.",
    deliverables: [
      "Shopify build with in-store inventory sync",
      "Foiled belly bands and gift tags",
      "Product photography direction",
    ],
    spec: "Shopify with products loaded; foil on uncoated board",
    turnaround: "Shopify build in 4–6 weeks with products loaded",
  },
  {
    slug: "trade-show-package",
    number: "07",
    title: "A booth that packed into a car",
    sector: "Industrial supplier",
    city: "vaughan",
    services: ["printing-signage", "custom-apparel"],
    brief:
      "Three shows in five weeks and a two-person team. Everything had to fit in an estate car and go up without tools.",
    deliverables: [
      "Tension-fabric backdrop",
      "Two retractable banners and a printed table cover",
      "Feather flags",
      "Embroidered polos for the stand",
    ],
    spec: "13oz scrim and tension fabric; polos to 15 thread colours",
    turnaround: "3–5 business days on print; 7–10 on the polos",
  },
  {
    slug: "cafe-opening-kit",
    number: "08",
    title: "Everything a café needed to open",
    sector: "Coffee shop",
    city: "markham",
    services: ["printing-signage", "gold-foil-stationery", "custom-apparel"],
    brief:
      "One order, one invoice, six weeks out from a lease start. The point was that the sign, the cups and the aprons all matched without anyone having to chase three suppliers.",
    deliverables: [
      "Exterior sign and window vinyl",
      "Foiled loyalty cards, 32pt painted edge",
      "Menu boards and table cards",
      "Embroidered aprons and caps",
    ],
    spec: "One colour build, matched across vinyl, foil and thread",
    turnaround: "Staged across four weeks to the lease date",
  },
];

export function getWork(slug: string): WorkItem | undefined {
  return work.find((item) => item.slug === slug);
}

/** Work items that used a given service, for the service pages to link to. */
export function workForService(service: Service | string): readonly WorkItem[] {
  const slug = typeof service === "string" ? service : service.slug;
  return work.filter((item) => item.services.includes(slug));
}
