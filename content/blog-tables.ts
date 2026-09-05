/**
 * Every number the blog quotes, in one file.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: READ THE `status` FIELD ON EVERY TABLE BEFORE LAUNCH
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The posts are specific on purpose — a price guide that says "it depends"
 * ranks for nothing and helps nobody. But specificity is only an asset when
 * the numbers are true, so each table declares where its figures come from:
 *
 *   "standard"   Facts about the printing and apparel trades, not about this
 *                shop. Bleed is 0.125" at every printer in Canada; CMYK is
 *                CMYK; a 4x6 postcard is 4x6. Safe to publish as written.
 *
 *   "confirmed"  Supplied by the owner. Currently only the package and plan
 *                prices in content/packages.ts, plus websites from $399.
 *
 *   "draft"      NOT SUPPLIED. Written to what a GTA shop with this equipment
 *                list would normally run. Every one of these is a claim about
 *                YOUR pricing and YOUR minimums. Correct them here — the
 *                posts read from this file and nowhere else, so one edit
 *                fixes every article that quotes the figure.
 *
 * Any table still marked "draft" renders a visible note to the reader saying
 * the figures are indicative and a quote confirms them. That is deliberate:
 * publishing a "2026 price guide" of invented numbers as if they were firm
 * quotes is an ordinary-price representation, and the Competition Act takes
 * a dim view of those. Flip the status once the numbers are real and the
 * note disappears on its own.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type TableStatus = "standard" | "confirmed" | "draft";

export type DataTable = {
  id: string;
  caption: string;
  status: TableStatus;
  /** Short line on where the figures came from. Shown under the table. */
  source: string;
  columns: string[];
  rows: string[][];
};

const tables: DataTable[] = [
  {
    id: "business-card-prices",
    caption: "Business card prices by run and stock, Mississauga, 2026",
    status: "draft",
    source: "Indicative GTA trade ranges for offset and digital short-run work.",
    columns: ["Run", "14pt matte", "16pt soft-touch", "16pt soft-touch + spot UV"],
    rows: [
      ["100", "$45 – $65", "$70 – $95", "$110 – $145"],
      ["250", "$60 – $85", "$95 – $130", "$150 – $195"],
      ["500", "$80 – $115", "$130 – $175", "$195 – $260"],
      ["1,000", "$110 – $155", "$175 – $240", "$260 – $340"],
      ["2,500", "$190 – $265", "$300 – $410", "$430 – $565"],
      ["5,000", "$300 – $420", "$470 – $640", "$650 – $860"],
    ],
  },
  {
    id: "business-card-specs",
    caption: "What the stock actually changes",
    status: "standard",
    source: "Standard North American card stocks and finishes.",
    columns: ["Stock", "Thickness", "Feels like", "Best for"],
    rows: [
      ["14pt matte", "0.014in / 356µm", "A firm supermarket loyalty card", "High-volume handouts, tight budgets"],
      ["16pt C2S", "0.016in / 406µm", "The default 'good card'", "Most businesses, most of the time"],
      ["16pt soft-touch", "0.016in + laminate", "Suede, slightly warm", "Trades and services who hand cards over in person"],
      ["32pt duplex", "0.032in / 813µm", "A thin coaster, visible colour seam", "One-off impressions: studios, high-ticket sales"],
    ],
  },
  {
    id: "flyer-sizes",
    caption: "Flyer sizes and what each one is for",
    status: "standard",
    source: "Standard North American cut sizes and Canada Post dimensional limits.",
    columns: ["Size", "Cut from", "Reads as", "Typical use"],
    rows: [
      ["4in × 6in", "Postcard", "One offer, one image", "Mailbox drops, counter cards"],
      ["5.5in × 8.5in", "Half letter", "Headline plus a short list", "Handouts, menu inserts, door hangers"],
      ["8.5in × 11in", "Letter", "A full page of detail", "Price lists, service menus, event programmes"],
      ["8.5in × 14in", "Legal", "Long list, unusual shape", "Real estate features, tear-off sheets"],
      ["11in × 17in", "Tabloid", "A small poster", "Window bills, event posters, folded to letter"],
    ],
  },
  {
    id: "flyer-postage",
    caption: "Canada Post Neighbourhood Mail size bands",
    status: "standard",
    source: "Canada Post Neighbourhood Mail specifications. Confirm current rates before quoting a drop.",
    columns: ["Band", "Max dimensions", "Max weight", "Note"],
    rows: [
      ["Standard", "140mm × 245mm × 5mm", "50g", "Cheapest band. A 5.5in × 8.5in flyer fits."],
      ["Oversize", "300mm × 380mm × 20mm", "500g", "8.5in × 11in and 11in × 17in folded land here."],
    ],
  },
  {
    id: "vehicle-graphics",
    caption: "Vehicle graphics: coverage, cost and lifespan",
    status: "draft",
    source: "Indicative GTA installed pricing. Lifespans are the film manufacturers' published durability.",
    columns: ["Option", "Coverage", "Typical installed cost", "Expected life"],
    rows: [
      ["Cut vinyl lettering", "Name, number, website, a logo", "$350 – $900", "5 – 7 years"],
      ["Partial wrap", "Roughly 25 – 60% of the panels", "$1,200 – $2,800", "5 – 7 years"],
      ["Full wrap", "Every painted panel", "$3,000 – $6,000", "5 – 7 years"],
      ["Full wrap, cargo van", "Every panel on a larger body", "$4,500 – $8,000", "5 – 7 years"],
    ],
  },
  {
    id: "vinyl-film",
    caption: "Cast versus calendered film",
    status: "standard",
    source: "Published durability ranges from the major film manufacturers.",
    columns: ["Film", "How it is made", "Conforms to curves", "Rated life (vertical, Ontario)"],
    rows: [
      ["Cast", "Poured as a liquid, no built-in tension", "Yes — rivets, corrugations, deep recesses", "7 – 10 years"],
      ["Calendered, premium", "Rolled under heat and pressure", "Gentle curves only", "5 – 7 years"],
      ["Calendered, economy", "Rolled, thicker, more tension", "Flat panels only", "3 – 5 years"],
    ],
  },
  {
    id: "decoration-decision",
    caption: "DTF, screen printing and embroidery compared",
    status: "standard",
    source: "Process characteristics. The minimums and unit prices are this shop's — see the note.",
    columns: ["", "Screen printing", "DTF transfer", "Embroidery"],
    rows: [
      ["How it works", "Ink pushed through a mesh stencil, one screen per colour", "Design printed to film, powdered, heat-pressed", "Thread stitched into the fabric"],
      ["Colour count", "Each colour is another screen and another setup", "Unlimited — photos and gradients included", "Limited by thread colours on the machine"],
      ["Best run size", "48 pieces and up", "1 – 48 pieces", "Any, but digitising is a one-time cost"],
      ["Hand feel", "Soft on a light print, heavier on dark garments", "A thin film layer you can feel", "Raised thread, no film"],
      ["On dark garments", "Needs a white underbase", "Prints white as standard", "Unaffected — thread is opaque"],
      ["Wash durability", "50+ washes", "40 – 50 washes if pressed correctly", "Outlives the garment"],
      ["Fabric limits", "Cotton and blends", "Almost anything, including polyester", "Not for thin or stretchy knits"],
      ["Best for", "Large runs of a simple mark", "Small runs, photos, one-offs, samples", "Polos, caps, workwear, anything that must look formal"],
    ],
  },
  {
    id: "decoration-economics",
    caption: "Where each process becomes the cheap one",
    status: "draft",
    source: "Indicative unit pricing, left-chest or standard front placement, customer-supplied garments excluded.",
    columns: ["Quantity", "Screen printing", "DTF", "Embroidery"],
    rows: [
      ["1 – 11", "Not viable — setup dominates", "$14 – $22 each", "$16 – $26 each"],
      ["12 – 23", "$18 – $26 each", "$11 – $17 each", "$13 – $20 each"],
      ["24 – 47", "$12 – $17 each", "$9 – $14 each", "$11 – $17 each"],
      ["48 – 99", "$8 – $12 each", "$8 – $12 each", "$10 – $15 each"],
      ["100 – 249", "$6 – $9 each", "$7 – $11 each", "$9 – $13 each"],
      ["250+", "$4 – $7 each", "$6 – $10 each", "$8 – $12 each"],
    ],
  },
  {
    id: "print-file-specs",
    caption: "File setup, by product",
    status: "standard",
    source: "Standard prepress tolerances. Any printer in Canada will ask for these.",
    columns: ["Product", "Bleed", "Safety margin", "Resolution", "Colour"],
    rows: [
      ["Business cards", "0.125in all round", "0.125in from trim", "300 ppi at final size", "CMYK"],
      ["Flyers and postcards", "0.125in all round", "0.25in from trim", "300 ppi at final size", "CMYK"],
      ["Booklets, saddle-stitched", "0.125in all round", "0.375in from trim", "300 ppi at final size", "CMYK"],
      ["Roll-up banners", "0.5in all round", "2in top and bottom", "150 ppi at final size", "CMYK"],
      ["Large-format signage", "0.25in all round", "1in from trim", "100 – 150 ppi at final size", "CMYK"],
      ["Vehicle graphics", "1in all round", "2in from any edge or seam", "72 – 100 ppi at final size", "CMYK"],
    ],
  },
  {
    id: "rich-black",
    caption: "Blacks that print the way you meant them to",
    status: "standard",
    source: "Standard prepress build values for sheetfed CMYK.",
    columns: ["Build", "Values", "Use it for", "Do not use it for"],
    rows: [
      ["Flat black", "0 / 0 / 0 / 100", "Body text, thin rules, anything under 24pt", "Large solid areas — it looks washed out"],
      ["Rich black", "60 / 40 / 40 / 100", "Large solids, backgrounds, display type", "Small text — registration shift shows as colour fringing"],
      ["Registration black", "100 / 100 / 100 / 100", "Nothing. It is a press mark colour.", "Any artwork — 400% ink will not dry"],
    ],
  },
  {
    id: "trade-show-checklist",
    caption: "Trade show kit: what to order and when",
    status: "draft",
    source: "Lead times are this shop's production estimates and exclude shipping and approval time.",
    columns: ["Item", "Order by", "Typical quantity", "Note"],
    rows: [
      ["Backdrop, 8ft tension fabric", "4 weeks out", "1", "Fabric packs into a case and travels; vinyl creases."],
      ["Table throw, printed", "4 weeks out", "1 per table", "Order the 6ft or 8ft to match the venue's table, not yours."],
      ["Roll-up banners", "3 weeks out", "2", "One each side of the booth. Order a spare graphic, not a spare base."],
      ["Feather flags", "3 weeks out", "2", "Check the hall rules — many venues cap height at 8ft indoors."],
      ["Business cards", "3 weeks out", "300 – 500", "Double what you think. They go faster at a show."],
      ["One-page leave-behind", "2 weeks out", "250 – 400", "8.5in × 11in, printed both sides."],
      ["Branded apparel", "3 weeks out", "2 per staffer per day", "Embroidered polos read as staff; printed tees read as promo."],
      ["Lanyards and name badges", "2 weeks out", "1 per staffer", "Names large enough to read standing up."],
      ["Giveaway items", "4 weeks out", "150 – 300", "Anything imported needs longer. Ask before you plan on it."],
      ["Signage for the back wall", "2 weeks out", "1", "Confirm the hanging method with the venue first."],
    ],
  },
];

export const blogTables: Record<string, DataTable> = Object.fromEntries(
  tables.map((t) => [t.id, t]),
);

export function getTable(id: string): DataTable | undefined {
  return blogTables[id];
}

// A table nobody can find is a table nobody corrects. Duplicate ids would
// silently shadow each other, so fail the build instead.
const seen = new Set<string>();
for (const t of tables) {
  if (seen.has(t.id)) throw new Error(`content/blog-tables.ts: duplicate table id "${t.id}"`);
  seen.add(t.id);
  if (t.rows.some((r) => r.length !== t.columns.length)) {
    throw new Error(`content/blog-tables.ts: "${t.id}" has a row that does not match its columns`);
  }
}
