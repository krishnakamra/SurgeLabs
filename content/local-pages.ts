import { cities } from "./cities";
import type { Faq } from "./services";

/**
 * A service as it is sold locally. These are narrower than the three service
 * pages — someone searching "business cards Mississauga" does not search
 * "print and signage Mississauga" — and each maps back to its parent page.
 */
export type LocalService = {
  slug: string;
  /** Used in the H1: "<name> in <city>". */
  name: string;
  /** Slug of the /service page this rolls up to. */
  parent: string;
  /** One line for cards and link lists. */
  blurb: string;
};

export const localServices: readonly LocalService[] = [
  { slug: "web-design", name: "Web design", parent: "web-design-seo", blurb: "Sites built to load fast and be edited by you." },
  { slug: "seo", name: "SEO", parent: "web-design-seo", blurb: "Local and technical search work, reported monthly." },
  { slug: "business-cards", name: "Business cards", parent: "printing-signage", blurb: "16pt to 32pt, soft-touch, spot UV, foil." },
  { slug: "flyers", name: "Flyer printing", parent: "printing-signage", blurb: "100lb gloss, matte and uncoated text stocks." },
  { slug: "banners", name: "Banner printing", parent: "printing-signage", blurb: "13oz scrim and 8oz mesh, hemmed and grommeted." },
  { slug: "signage", name: "Signage", parent: "printing-signage", blurb: "Coroplast, A-frames, window vinyl and wayfinding." },
  { slug: "vehicle-graphics", name: "Vehicle graphics", parent: "printing-signage", blurb: "Cut lettering, partial wraps and magnets." },
  { slug: "trade-show-displays", name: "Trade show displays", parent: "printing-signage", blurb: "Backdrops, retractables, feather flags, table covers." },
  { slug: "custom-apparel", name: "Custom apparel", parent: "custom-apparel", blurb: "DTF with no minimum, screen printing from 24." },
  { slug: "embroidery", name: "Embroidery", parent: "custom-apparel", blurb: "In-house digitising, up to 15 thread colours." },
];

export type LocalPage = {
  /** localServices slug. */
  service: string;
  /** cities slug. */
  city: string;
  /**
   * Written for this city and this service. Minimum 250 words, enforced.
   * Generic copy with the city name swapped in is the thing this whole file
   * exists to prevent — see validateLocalPages below.
   */
  intro: readonly string[];
  /**
   * Real places named in `intro`. The validator checks each one actually
   * appears there, so this cannot be filled in without the copy following.
   */
  neighbourhoods: readonly string[];
  /** How work reaches this city, and how long it takes. City-specific. */
  delivery: string;
  /** At least three, written for this city. */
  faqs: readonly Faq[];
  /** At least one image unique to this page. */
  image: { src: string; alt: string };
};

export function getLocalService(slug: string): LocalService | undefined {
  return localServices.find((service) => service.slug === slug);
}

const MIN_INTRO_WORDS = 250;
const MIN_FAQS = 3;
const MIN_NEIGHBOURHOODS = 2;

function wordCount(paragraphs: readonly string[]): number {
  return paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Every rule the brief set, enforced where it cannot be skipped.
 *
 * This runs at module scope, so it executes during `next build` the moment
 * anything imports the page list. A page missing its copy, its
 * neighbourhoods, its delivery line, three FAQs or an image does not render
 * a degraded version — the build fails and nothing ships.
 *
 * That is the point. 160 service × city combinations generated from a
 * template is textbook doorway spam, and Google penalises the whole domain
 * for it, not just the thin pages. The only safe way to hold that line over
 * time is to make "add a row to the array" impossible without also writing
 * the content, so the shortcut simply is not available to a future author in
 * a hurry.
 */
export function validateLocalPages(pages: readonly LocalPage[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const page of pages) {
    const id = `${page.service}/${page.city}`;

    if (seen.has(id)) errors.push(`${id}: duplicate entry`);
    seen.add(id);

    if (!getLocalService(page.service)) errors.push(`${id}: unknown service "${page.service}"`);
    if (!cities.some((city) => city.slug === page.city)) {
      errors.push(`${id}: unknown city "${page.city}"`);
    }

    const words = wordCount(page.intro);
    if (words < MIN_INTRO_WORDS) {
      errors.push(`${id}: intro is ${words} words, needs ${MIN_INTRO_WORDS}`);
    }

    if (page.neighbourhoods.length < MIN_NEIGHBOURHOODS) {
      errors.push(`${id}: needs ${MIN_NEIGHBOURHOODS} neighbourhoods, has ${page.neighbourhoods.length}`);
    }

    // The strongest check here: a named place must actually appear in the
    // copy. It is what stops the field being filled in to satisfy the count
    // while the prose stays generic.
    const prose = page.intro.join(" ").toLowerCase();
    for (const place of page.neighbourhoods) {
      if (!prose.includes(place.toLowerCase())) {
        errors.push(`${id}: "${place}" is listed but never appears in the intro`);
      }
    }

    if (!page.delivery.trim()) errors.push(`${id}: delivery line is empty`);

    if (page.faqs.length < MIN_FAQS) {
      errors.push(`${id}: ${page.faqs.length} FAQs, needs ${MIN_FAQS}`);
    }
    for (const [index, faq] of page.faqs.entries()) {
      if (!faq.question.trim() || !faq.answer.trim()) {
        errors.push(`${id}: FAQ ${index + 1} is incomplete`);
      }
    }

    if (!page.image.src.trim()) errors.push(`${id}: image.src is empty`);
    if (!page.image.alt.trim()) errors.push(`${id}: image.alt is empty`);
  }

  return errors;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ALLOW-LIST
 * ───────────────────────────────────────────────────────────────────────────
 * 10 services × 16 cities is 160 combinations. Publishing them all would be
 * doorway spam and would cost the whole domain, so this array is the only
 * thing that creates a page. Adding a row means writing 250 words about that
 * city, naming places that appear in the copy, a delivery line, three FAQs
 * and an image — or the build fails.
 *
 * ⚠️  OWNER: the copy below is written from public knowledge of these
 *     neighbourhoods and industrial areas. It is specific on purpose, and
 *     some of it makes claims about how you work ("fifteen minutes away",
 *     "same-day pickup"). Read each delivery line against your actual
 *     routine before launch.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const localPages: readonly LocalPage[] = [
  {
    service: "web-design",
    city: "mississauga",
    intro: [
      "Most of the web work we do in Mississauga is for businesses that have outgrown a site somebody's nephew built years ago. It still loads, it still carries the old phone number, and it falls apart on a phone. We rebuild those. Five to fifteen pages, quick on a mobile connection, and set up so your office manager can change the hours at Christmas without emailing anyone.",
      "The work splits fairly evenly by part of the city. Professional services around City Centre and Sheridan — accountants, clinics, law offices — usually want credibility and a booking form that reaches a real inbox. Manufacturers and trades out in Meadowvale Business Park and along the Winston Churchill corridor want to rank for what they actually make, and a phone number that is easy to tap from a truck. Shops on Queen Street in Streetsville and along Lakeshore in Port Credit tend to want Shopify, because they sell in person and online and refuse to run two sets of stock.",
      "Whichever it is, we build it here alongside the print and the apparel, which is what saves you time later. The blue on your homepage is the same blue as your business cards and your staff polos, because it came off the same file rather than being matched by eye at three different suppliers. You own the domain, the hosting account and the code at the end. Nothing is held back to keep you on a retainer, and if you decide to move it somewhere else in two years, you can take it with you.",
    ],
    neighbourhoods: ["City Centre", "Sheridan", "Meadowvale Business Park", "Winston Churchill", "Streetsville", "Port Credit"],
    delivery: "We work from 2800 Skymark Ave, so most of Mississauga is a fifteen-minute drive. Web work happens remotely, and anything printed alongside it can be picked up the same day it comes off the press.",
    faqs: [
      { question: "Do you meet clients in Mississauga?", answer: "Yes. We are on Skymark Ave near the Airport Corporate Centre, and most of the city is fifteen minutes away. Most projects run on two calls and email, but if you would rather sit down with the proof in front of you, come in." },
      { question: "Can you rank a Mississauga business against bigger competitors?", answer: "For local search, usually yes. A Mississauga plumber does not compete with a national chain in the map pack — they compete with the twelve other plumbers within five kilometres. That is a fight of Google Business Profile quality, review volume and page specificity, and it is winnable." },
      { question: "Do you build in French for Mississauga's bilingual businesses?", answer: "We build the structure for it and set the hreflang correctly, but we do not write French copy in house. If you supply the translation we set it properly; if you need it written, we bring in a translator and quote it separately." },
    ],
    image: { src: "/local/web-design-mississauga.svg", alt: "Web design work sheet for Mississauga, Surge Labs" },
  },
  {
    service: "seo",
    city: "mississauga",
    intro: [
      "Search in Mississauga is unusually competitive for a suburb, because the city is big enough that almost every trade has thirty established competitors and close enough to Toronto that agencies from downtown bid on the same terms. What that means in practice is that the map pack matters more than the blue links, and the map pack is mostly won on the Google Business Profile rather than on the website.",
      "We start there. Categories, service areas, the services list, photos that are actually of your work, and posts often enough that the profile does not look abandoned. Then we make the name, address and phone identical everywhere it appears — the site, the profile, the Canadian directories — because inconsistent listings are one of the few things that measurably hold a business out of the pack. A shop in Cooksville listing itself with a Dixie address on one directory and a City Centre one on another is fighting itself.",
      "On the site we build a page per service and a page per area we genuinely serve, each one written rather than generated. Somebody searching from Erin Mills has different concerns than somebody searching from Clarkson or Port Credit, and a page that acknowledges that reads as though a person wrote it, which is increasingly the whole game. We report monthly on calls, form fills and the terms actually bringing people in, not on a vanity rank for a phrase nobody types.",
      "Reviews are the other half and the part most businesses neglect. Google weighs volume, recency and whether you reply, so twenty reviews from the last year beats sixty from 2019. We set up the request flow so asking is automatic after a job rather than something you remember once a quarter, and we answer the negative ones properly instead of arguing in public.",
    ],
    neighbourhoods: ["Cooksville", "Dixie", "City Centre", "Erin Mills", "Clarkson", "Port Credit"],
    delivery: "SEO runs month to month from $399. We do not lock you into a year — if it is not working by month four, you should be able to leave, and you can.",
    faqs: [
      { question: "How long does SEO take to work in Mississauga?", answer: "Google Business Profile improvements can move within days. Ranking for competitive Mississauga service terms usually takes three to six months of consistent work. Anyone promising page one in thirty days is either buying ads or guessing." },
      { question: "Do I need a Mississauga address to rank here?", answer: "For the map pack, yes — Google ranks on proximity to the searcher, and a verified Mississauga address is what puts you in the running. Service-area businesses without a storefront can still rank, but the profile has to be set up as a service-area business properly." },
      { question: "Can you help if my Google listing is suspended?", answer: "Sometimes. Suspensions usually come from a mismatched address, a virtual office, or a name stuffed with keywords. We can tell you which within a call, and reinstatement is worth attempting before creating anything new — a new listing loses your reviews." },
    ],
    image: { src: "/local/seo-mississauga.svg", alt: "Local search work sheet for Mississauga, Surge Labs" },
  },
  {
    service: "business-cards",
    city: "mississauga",
    intro: [
      "Business cards are the job we run most often, and in Mississauga the split is easy to predict. Offices around City Centre and the Sheridan corporate blocks order 16pt coated in runs of 500 to 1,000, usually twice a year, usually because somebody joined. Independent operators — realtors, brokers, contractors working out of Cooksville and Applewood — order smaller and care much more about how the card feels, because they hand it over in person and want it kept.",
      "That is where the stock matters. 16pt coated two sides is the standard and it is fine. 18pt uncoated is what you want if you write on the back, which realtors and trades do constantly. 32pt with a painted edge is the one people notice without being able to say why — it is thick enough to feel deliberate, and the colour on the edge is visible from across a table. Soft-touch lamination with spot UV over the logo is the other combination that gets remarked on: the card feels like suede and the mark sits proud of it.",
      "We print here rather than brokering it out, which mostly matters when something is wrong. A broker sends your file back into a queue in another city and you wait again. We reprint it in the building, usually the same day. If your artwork is print-ready and approved before 11am, 16pt cards can be done that day for pickup from Skymark Ave.",
      "One practical note on artwork: keep anything you care about at least an eighth of an inch inside the trim, and give us a bleed of the same on every edge. Cards are cut in stacks and the blade drifts fractionally through the lift, so a border set tight to the edge comes back thicker on one side than the other and there is nothing anyone can do about it afterwards.",
    ],
    neighbourhoods: ["City Centre", "Sheridan", "Cooksville", "Applewood", "Skymark Ave"],
    delivery: "Standard is three to five business days from proof approval. Same-day on 16pt stock if artwork is approved before 11am, for pickup on Skymark Ave or delivery across Mississauga.",
    faqs: [
      { question: "How long do business cards take in Mississauga?", answer: "Three to five business days from proof approval as standard. If your file is print-ready and approved before 11am we can run 16pt cards the same day. Foil, painted edges and die-cut shapes need the full week." },
      { question: "Can I pick up business cards in Mississauga the same day?", answer: "Yes, on stocked 16pt cards with artwork approved before 11am. Pickup is from 2800 Skymark Ave. Anything with foil, a painted edge or a die-cut shape has to run overnight at minimum." },
      { question: "What is the minimum order for business cards?", answer: "250. Below that the setup dominates the cost and you are better off ordering 250 and keeping the rest. Most Mississauga offices order 500 or 1,000 because the per-card cost drops sharply." },
    ],
    image: { src: "/local/business-cards-mississauga.svg", alt: "Business card stock samples for Mississauga, Surge Labs" },
  },
  {
    service: "flyers",
    city: "mississauga",
    intro: [
      "Flyers still work in Mississauga, but only in the places where people actually read them. Dense residential pockets like Applewood, Rathwood and the older parts of Malton respond to a well-designed door drop far better than a townhouse development where everything goes straight into the recycling bin in the lobby. We will tell you which is which before you print 10,000 of them.",
      "The stock decides how the flyer feels in a hand. 100lb gloss text is the default and it photographs well, which matters if the flyer is also going on social. 80lb matte is easier to read at length and does not glare under fluorescent light, so it suits menus and service lists. 100lb uncoated feels closer to a letter than an advert, which is the right choice when you are writing to neighbours rather than shouting at strangers — new dentists and clinics in Malton and Meadowvale use it for exactly that reason.",
      "Most of our flyer work in the city is restaurants, clinics and trades. Restaurants order menus and reprint them every time a price moves, so we keep the file and reprint from it. Clinics order intake sheets and appointment cards on the same run to save on setup. Trades order a flyer and a coroplast lawn sign together, because the same artwork does both jobs and the sign lasts a season. We can bundle those on one ticket rather than quoting them separately.",
      "If the flyer is going out by mail rather than by hand, tell us before we set it. Canada Post has size and thickness rules that decide whether a piece is charged as a standard letter or surcharged as oversized, and the difference over ten thousand pieces dwarfs anything you might save on stock. We set to their template so it does not get caught.",
    ],
    neighbourhoods: ["Applewood", "Rathwood", "Malton", "Meadowvale"],
    delivery: "Three to five business days from proof approval, delivered across Mississauga. Same-day on stocked gloss text if artwork is approved before 11am.",
    faqs: [
      { question: "Do you do flyer distribution in Mississauga?", answer: "We print; we do not deliver door to door. Canada Post's Neighbourhood Mail covers Mississauga by postal walk and is usually the cheapest route — we set the flyer to their size and weight rules so it does not get surcharged, which is the part people get wrong." },
      { question: "How many flyers should I print?", answer: "For a door drop, one per household in the walks you are targeting, plus about 10% spare. A single Mississauga postal walk is typically 300 to 500 homes. Ordering 1,000 for a five-walk campaign leaves you short." },
      { question: "What is the cheapest flyer size?", answer: "8.5×11 on 100lb gloss text, printed both sides, is the best cost per piece because it cuts from a standard sheet with no waste. Odd sizes cost more for the trim, not the ink." },
    ],
    image: { src: "/local/flyers-mississauga.svg", alt: "Flyer stock comparison for Mississauga, Surge Labs" },
  },
  {
    service: "banners",
    city: "mississauga",
    intro: [
      "Banner work in Mississauga is seasonal and it is mostly outdoors, which decides the material before anything else. A 13oz scrim vinyl banner hemmed on all four sides with grommets every 60 centimetres is the standard and handles a summer outside without stretching. If it is going on a chain-link fence anywhere exposed — a site hoarding, a field, anything near the lake — it needs 8oz mesh instead, so wind passes through rather than turning the banner into a sail and taking the fence with it.",
      "Events around Celebration Square and the Square One precinct account for a lot of it: festival backdrops, sponsor walls, registration banners. Those get printed, checked and delivered on a deadline that does not move, so we build in a day of slack rather than promising the morning of. Retail along Lakeshore Road and Hurontario orders differently — grand openings, seasonal sales, and the same banner reprinted each year with the date changed, which is a five-minute job if we still have the file, and we do.",
      "Our roll printer runs material up to 54 inches wide, so a banner can be 54 inches by whatever length you need without a seam down the middle. Wider than that we print in panels and place the overlap where the artwork hides it rather than through the middle of your logo. If you are hanging it yourself, tell us where the fixings are before we set the artwork — the most common banner problem is a grommet punched through the one word that mattered.",
    ],
    neighbourhoods: ["Celebration Square", "Square One", "Lakeshore Road", "Hurontario"],
    delivery: "Two to four business days from proof approval for large format, delivered across Mississauga. Rush on stocked 13oz scrim if artwork is approved before 11am.",
    faqs: [
      { question: "What is the largest banner you can print?", answer: "Our roll runs up to 54 inches wide, so 54 inches by any length with no seam. Wider than that we panel it and place the overlap where the artwork hides it." },
      { question: "Do I need mesh or vinyl for an outdoor banner in Mississauga?", answer: "Vinyl for a wall or a frame. Mesh for anything on a fence or in an exposed spot — the lakeshore and open sites near the airport get enough wind that a solid vinyl banner acts as a sail and pulls its fixings out." },
      { question: "Can you print a banner for a Celebration Square event?", answer: "Yes, and we build a day of slack into the schedule for dated events, because an event deadline does not move. Send artwork at least a week out and we will have it checked and delivered with time to spare." },
    ],
    image: { src: "/local/banners-mississauga.svg", alt: "Banner material comparison for Mississauga, Surge Labs" },
  },
  {
    service: "signage",
    city: "mississauga",
    intro: [
      "Signage in Mississauga runs into the sign by-law more often than people expect, and the rules differ by what the sign is and where it stands. Ground signs, fascia signs and anything illuminated need a permit from the city. Real estate signs, election signs and temporary event signs have their own allowances and time limits. We are not a permit service, but we have set enough artwork for Dundas Street and Hurontario storefronts to know when a design is going to fail a review, and we will say so before you pay for it.",
      "The everyday work is simpler. Coroplast on 4mm board with H-stakes for anything temporary — open houses, seasonal promotions, site notices, the trades working through Dixie and the Heartland industrial blocks. A-frames with 24 by 36 inch inserts for sidewalk trade, swapped seasonally so the frame is bought once and the insert changes. Window graphics in white vinyl for solid colour, frosted etch where a clinic or a law office wants privacy at eye level, and 50/50 perforated film where staff need to see out while the street sees the graphic.",
      "Interior wayfinding is the piece people forget until an inspection. Suite numbers, washroom signs, capacity notices, directional arrows in a warehouse. It is unglamorous and it is quick, and doing it in the same visual language as the storefront is what makes a business look like it was planned rather than assembled. We cut and finish all of it here, so a replacement panel next year matches the original rather than being close enough.",
    ],
    neighbourhoods: ["Dundas Street", "Hurontario", "Dixie", "Heartland"],
    delivery: "Two to four business days from proof approval. Coroplast can run same day if artwork is approved before 11am; installed signage is scheduled once the panels are printed.",
    faqs: [
      { question: "Do I need a sign permit in Mississauga?", answer: "Usually, for anything permanent, illuminated or ground-mounted — that comes from the City of Mississauga. Temporary coroplast, real estate and election signs have their own allowances. We are not a permit service, but we will flag a design that is going to fail a review before you pay for it." },
      { question: "How fast can I get lawn signs in Mississauga?", answer: "Same day on 4mm coroplast if artwork is approved before 11am. Standard is two to four business days. H-stakes are included, and ten signs is a common first order." },
      { question: "Can you match my existing storefront signage?", answer: "Yes. Bring the original artwork or Pantone references and we match to those. If all you have is the sign itself, bring a piece of it in — we match to the physical sample, because a phone photo shifts colour enough to be useless." },
    ],
    image: { src: "/local/signage-mississauga.svg", alt: "Signage material comparison for Mississauga, Surge Labs" },
  },
  {
    service: "vehicle-graphics",
    city: "mississauga",
    intro: [
      "Vehicle work in Mississauga is mostly trades, and mostly out of the northeast — the industrial blocks around Dixie, the Airport Corporate Centre, and the units off Derry that house every HVAC, electrical and landscaping outfit in the city. Those vans are parked at a customer's house for four hours at a time, which makes them the cheapest advertising the business owns and the one most often done badly.",
      "Most of them do not need a full wrap. Cut vinyl lettering on the doors and tailgate — name, trade, phone number, website — costs a fraction of a wrap, lasts as long, and can be changed when the number changes without redoing the vehicle. The rule that matters is legibility at speed: a phone number in a script face is unreadable from a car and might as well not be there. We set vehicle type large and everything else in a plain face, because the only job is being read from two lanes over.",
      "Partial wraps make sense when the vehicle is genuinely the main advertising — printed panels on the rear quarters and hood, laminated against UV so the colour survives a few summers. Magnetic panels at 30mil suit leased vehicles and anyone who does not want their business on the van at the weekend. We measure the vehicle here rather than working from a template, because a 2019 Transit and a 2024 Transit are not the same panel and a template that is close costs you the whole print.",
    ],
    neighbourhoods: ["Dixie", "Airport Corporate Centre", "Derry"],
    delivery: "Vehicles are measured at 2800 Skymark Ave. Panels take two to four business days to print, and the vehicle is in the shop for a day once they are ready.",
    faqs: [
      { question: "How much does vehicle lettering cost in Mississauga?", answer: "Cut vinyl lettering starts from about $180 a side, depending on how much copy and how many colours. A partial wrap with printed panels costs several times that. We quote from photos of the actual vehicle rather than from a make and model." },
      { question: "Do I need a full wrap or is lettering enough?", answer: "For most trades, lettering does the job at a fraction of the cost and is far easier to update. A full or partial wrap makes sense when the vehicle is the main advertising and you want it to be seen as a brand rather than read as a phone number." },
      { question: "How long does vehicle lettering last?", answer: "Cast vinyl properly applied lasts five to seven years on a vertical panel. Horizontal surfaces like a hood take more UV and fade sooner. Laminated printed panels sit at the same end of that range; unlaminated ones do not, which is why we laminate." },
    ],
    image: { src: "/local/vehicle-graphics-mississauga.svg", alt: "Vehicle lettering layout for Mississauga trades, Surge Labs" },
  },
  {
    service: "trade-show-displays",
    city: "mississauga",
    intro: [
      "Mississauga is a trade show city whether or not anyone planned it that way. The International Centre sits on Airport Road with the Toronto Congress Centre next door, so a large share of the shows serving southern Ontario happen within a few minutes of us. That proximity is the practical argument for printing here: when a backdrop panel is damaged in transit or a last-minute sponsor needs adding, we can reprint and hand it over rather than couriering from another city overnight.",
      "A working booth kit is usually four things. A tension-fabric backdrop, dye-sublimated so it packs in a bag and comes out without a crease. Two retractable stands, 33 by 81 inches for a tight booth or 47 by 81 for a wider one, with the cartridge reusable so next year you reprint the graphic and keep the base. A fitted table cover, 6 or 8 foot, printed rather than a plain cloth with a sticker on it. And feather flags outside the booth, 8, 11 or 14 foot depending on the ceiling.",
      "The design mistake we see most is treating a backdrop like a brochure. Nobody reads a paragraph from six feet away in a crowded hall. What works is the company name legible from across the room, one line saying what you actually do, and everything else on the printed material you hand over. Businesses out of the Airport Corporate Centre and the Heartland blocks exhibit regularly enough that we keep their files and reprint the dated panel each year while the rest of the kit stays.",
    ],
    neighbourhoods: ["International Centre", "Airport Road", "Airport Corporate Centre", "Heartland"],
    delivery: "Five to seven business days for a full booth kit from proof approval, because fabric and hardware are ordered in. We are minutes from the International Centre, so reprints during a show can be collected the same day.",
    faqs: [
      { question: "Can you print for a show at the International Centre?", answer: "Yes, and we are about five minutes from it. That matters mid-show: if a panel is damaged in transit or a sponsor needs adding, we can reprint and you can collect it rather than waiting on an overnight courier." },
      { question: "How far in advance should I order a booth kit?", answer: "Two weeks is comfortable. Five to seven business days is the working minimum, because tension fabric and hardware are ordered in rather than stocked. Retractable graphics alone can move faster if the base already exists." },
      { question: "Can you reprint a graphic for a stand I already own?", answer: "Usually yes. Send a photo of the base and the cartridge, plus the graphic width, and we will confirm before printing. Most standard retractables take a replacement graphic; some older proprietary bases do not, and we would rather tell you than guess." },
    ],
    image: { src: "/local/trade-show-displays-mississauga.svg", alt: "Trade show booth kit layout for Mississauga, Surge Labs" },
  },
  {
    service: "custom-apparel",
    city: "mississauga",
    intro: [
      "Custom apparel in Mississauga divides neatly between hospitality and trades, and they want opposite things. Restaurants and cafés along Lakeshore in Port Credit and Queen Street in Streetsville order small — six to twenty pieces, front of house, replaced as staff turn over. Trades and warehouses order in blocks of fifty and want the same garment available again in eight months when the crew changes.",
      "For the small orders, DTF is the answer and there is no minimum. One shirt for a new hire is a real order at the price of one shirt, not a favour with a setup fee attached. It prints full colour, handles photographs and gradients, works on dark garments without a separate underbase, and covers a full front or back up to 13 by 19 inches. It is also the right choice when the design changes between pieces — names on a team set, for example.",
      "Screen printing takes over on volume. Our minimum is 24 pieces per design, up to six spot colours, plastisol as standard for opacity on dark garments. Each colour needs its own screen, so the setup costs once and then almost nothing per piece — the more you order the better it gets. Below 24, DTF is cheaper and we will say so rather than take the screen fee. Garments come from Gildan, Bella+Canvas, Next Level, ATC and Port Authority, which covers a twelve-dollar event tee and a retail-weight hoodie on the same order.",
      "Reorders are where working with one shop pays off. We keep your artwork and your garment specification on file, so the second order is a phone call and the tenth is the same shirt in the same colour with the print in the same place. Staff who joined last month end up matching the ones who joined three years ago, which sounds trivial until you see a team photograph where they do not.",
    ],
    neighbourhoods: ["Lakeshore", "Port Credit", "Streetsville"],
    delivery: "Seven to ten business days from proof approval, once garments are in the building. Pickup from 2800 Skymark Ave or delivery across Mississauga.",
    faqs: [
      { question: "Do you have a minimum for custom t-shirts in Mississauga?", answer: "Not for DTF — one shirt is a real order. Screen printing starts at 24 pieces per design, because each colour needs its own screen. Below 24, DTF is almost always cheaper and we will tell you so." },
      { question: "How fast can I get shirts printed in Mississauga?", answer: "Seven to ten business days is standard from proof approval, assuming the blanks are in the building. Rush is possible and quoted per job, since availability of the garment decides it rather than our press time." },
      { question: "Can you decorate shirts I already have?", answer: "Yes. Bring or ship your own garments and we decorate them. They need to arrive clean and unworn, and for a large run we suggest supplying one to test first — we cannot guarantee against a garment that shrinks or scorches in the press." },
    ],
    image: { src: "/local/custom-apparel-mississauga.svg", alt: "Custom apparel decoration methods for Mississauga, Surge Labs" },
  },
  {
    service: "embroidery",
    city: "mississauga",
    intro: [
      "Embroidery is what Mississauga's corporate and industrial employers order, and for good reason: it does not fade, it does not crack, and it survives industrial laundry. A printed logo on a work shirt washed weekly looks tired within a season. A stitched one looks the same in three years, which is why the offices along the Winston Churchill corridor, the labs and engineering firms in Sheridan Park, and the distribution operations out toward Meadowvale almost all specify it for uniforms.",
      "We digitise in house, and that step is the whole job. Digitising converts your logo into stitch paths — the order, direction and density of every stitch — and it is what separates a clean left chest from a puckered mess that gets thrown in a drawer. A typical left chest at three and a half to four inches wide runs 5,000 to 12,000 stitches. A full back at ten to twelve inches can reach 30,000. We run up to fifteen thread colours in a single design.",
      "Digitising is charged once per logo, and then we keep the file. A reorder in eighteen months is stitched from the same file at the same size with no setup again, which is the part that matters for a business hiring steadily — new staff get kit that matches the people already wearing it rather than a slightly different version. Fine detail below about a quarter of an inch does not survive being stitched, so we simplify it and show you the proof before anything is sewn.",
    ],
    neighbourhoods: ["Winston Churchill", "Sheridan Park", "Meadowvale"],
    delivery: "Seven to ten business days from proof approval and garment arrival. Digitising adds a day at the front for a logo we have not stitched before.",
    faqs: [
      { question: "What is the minimum order for embroidery in Mississauga?", answer: "There is no piece minimum, but there is a one-time digitising charge per logo. For a single polo that setup is usually the larger part of the cost. Once your file exists, reorders have no setup at all." },
      { question: "How much does it cost to embroider a logo?", answer: "Digitising is about $45 once per logo. Embroidered polos start around $28 a piece including the garment. Higher stitch counts and larger placements cost more — a full back is several times a left chest." },
      { question: "Will my logo work as embroidery?", answer: "Most do, with simplification. Thin lines, small text and fine gradients do not survive being stitched, so we redraw those for thread and send you a proof showing placement and size before anything is sewn. If it genuinely will not work stitched, we say so and suggest DTF instead." },
    ],
    image: { src: "/local/embroidery-mississauga.svg", alt: "Embroidery stitch specification for Mississauga, Surge Labs" },
  },
  {
    service: "business-cards",
    city: "brampton",
    intro: [
      "Brampton has grown faster than almost anywhere else in the country over the last decade, and the print work reflects it. A lot of our card orders here are first orders — somebody registering a business, getting a logo drawn, and needing 500 cards before a networking event on Thursday. That is a different job from reprinting an established firm's stationery, and it needs somebody willing to say the logo is not print-ready before taking the money.",
      "The trades around Steeles and Airport Road and the logistics operators out toward the Gore order the most, usually 18pt uncoated because they write on the back — a quoted price, a callback date, a unit number. Coated stock repels pen ink and the writing smears, which is a small thing that ruins a card in the moment it matters. Professional offices along the Queen Street corridor and around Bramalea order 16pt coated in larger runs, and increasingly ask for soft-touch, which costs a little more and gets remembered.",
      "We print in Mississauga, about twenty-five minutes from most of Brampton depending on how the 410 is behaving. Delivery is included across the GTA, and pickup from Skymark Ave is straightforward if you are heading down anyway. Where speed matters, artwork approved before 11am can be running the same day — the drive is usually the longest part of it, not the printing.",
      "If you are starting from nothing, order the logo work and the cards together rather than separately. A logo drawn properly as vector artwork prints sharply at any size, from a card to a van door, and you own the files afterwards. Getting a cheap logo first and discovering it cannot be printed at size is the most common and most avoidable expense we see from new Brampton businesses.",
    ],
    neighbourhoods: ["Steeles and Airport", "the Gore", "Queen Street", "Bramalea"],
    delivery: "Delivered across Brampton, included in the price. We are about twenty-five minutes away on the 410, so same-day pickup from Mississauga is realistic when artwork is approved before 11am.",
    faqs: [
      { question: "Do you deliver business cards to Brampton?", answer: "Yes, delivery across Brampton is included. We print in Mississauga, about twenty-five minutes down the 410, and most orders arrive within the standard three to five business days from proof approval." },
      { question: "Can I get business cards printed same day in Brampton?", answer: "We can print same day on stocked 16pt when artwork is approved before 11am, but delivery would be next morning. If you need them the same day, collecting from Mississauga is the realistic route." },
      { question: "My logo is only a JPG from an old business card. Can you use it?", answer: "Not well — a JPG at business card size has nowhere near the resolution to print sharply, and it will look soft. We redraw it as vector artwork and quote that separately up front. It is a one-time cost and you own the files afterwards." },
    ],
    image: { src: "/local/business-cards-brampton.svg", alt: "Business card stocks for Brampton trades and offices, Surge Labs" },
  },
  {
    service: "signage",
    city: "brampton",
    intro: [
      "Signage work in Brampton skews heavily toward the trades and toward new builds, because both are everywhere. Coroplast lawn signs are the volume item — roofing, paving, landscaping, HVAC — and the pattern is always the same: ten to fifty signs, 4mm board with H-stakes, one design, reordered every spring after a winter of them disappearing. We keep the file so the reorder is a phone call rather than a design job.",
      "The residential growth out through Mount Pleasant and Sandalwood is what drives it. A crew doing driveways on one street plants signs on that street, and the next three jobs come from neighbours who saw them. That makes legibility from a moving car the only design criterion that matters: trade, phone number, nothing else. We set them that way by default and push back on anyone wanting a paragraph on an eighteen by twenty-four inch board.",
      "Commercial signage around Bramalea and the Queen Street corridor is the other half — storefront fascia, window vinyl, interior wayfinding for the plazas. Anything permanent, illuminated or ground-mounted needs a sign permit from the City of Brampton, and the by-law is specific about size relative to frontage. We are not a permit service and we will not pretend otherwise, but we have set enough of this artwork to flag a design that is going to fail before you have paid to produce it.",
      "One thing worth planning for is theft and weather. Lawn signs disappear, especially good-looking ones on busy corners, and a winter of freeze and thaw takes the rest. Ordering twenty-five instead of ten costs proportionally much less per sign and means you are not paying a second setup in April when half of them have gone. We keep the file either way, so a reorder is a phone call.",
    ],
    neighbourhoods: ["Mount Pleasant", "Sandalwood", "Bramalea", "Queen Street"],
    delivery: "Delivered across Brampton, included. Coroplast can run the same day when artwork is approved before 11am, arriving next morning, or collect from Mississauga the same afternoon.",
    faqs: [
      { question: "How much do lawn signs cost in Brampton?", answer: "Around $210 for ten, printed one side on 4mm coroplast with H-stakes included, delivered. Double-sided and larger runs are quoted from the count — the price per sign drops sharply past twenty-five." },
      { question: "Do I need a sign permit in Brampton?", answer: "For anything permanent, illuminated or ground-mounted, yes — that comes from the City of Brampton, and the by-law sets size against your frontage. Temporary coroplast and real estate signs have separate allowances with time limits." },
      { question: "How long do coroplast signs last outside?", answer: "A season of Ontario weather comfortably, often two. The board outlasts the print; UV fades the ink first, and reds fade fastest. If a sign is staying out year-round, ask for a laminate over the print." },
    ],
    image: { src: "/local/signage-brampton.svg", alt: "Lawn sign and storefront signage specification for Brampton, Surge Labs" },
  },
  {
    service: "custom-apparel",
    city: "brampton",
    intro: [
      "Apparel orders out of Brampton are mostly workwear and mostly practical. The warehousing and distribution operators around Steeles and Airport Road order hi-vis in blocks, replaced on a schedule rather than when it wears out, and they care about two things: that the garment meets the site's visibility requirement, and that the same one is available again next quarter. Fashion is not a consideration and we do not pretend it is.",
      "Below that, there is a steady run of community work — cricket and soccer clubs around Gore Meadows and Heart Lake, temple and community group events, school spirit wear. Those orders are small, dated and often need names on individual pieces, which is exactly what DTF is for. There is no minimum, it prints full colour, and a set of twenty shirts with twenty different names on the back costs the same per piece as twenty identical ones.",
      "For volume with one design, screen printing takes over at 24 pieces and the per-piece cost falls away quickly after that. Plastisol as standard for opacity on dark garments. For workwear that goes through industrial laundry weekly, we steer people to embroidery instead — a printed logo on a shirt washed at high temperature every week looks tired by the end of a season, and stitching does not. We will tell you which applies to your kit rather than quoting whichever we would rather run.",
      "Sizing is the practical issue with large crew orders, and it is worth doing properly once. We can supply a size set to try on before committing to fifty pieces, because a run ordered from a spreadsheet always comes back with three shirts nobody can wear. It costs a few garments and a week, and it saves reordering the tail end of the run at full price.",
    ],
    neighbourhoods: ["Steeles and Airport", "Gore Meadows", "Heart Lake"],
    delivery: "Seven to ten business days from proof approval, delivered across Brampton. Blanks availability sets the pace on rush jobs, not our press time.",
    faqs: [
      { question: "Do you do hi-vis workwear for Brampton warehouses?", answer: "Yes, and it is a large part of what we run. Tell us the visibility class your site requires and we source to it — decorating a garment does not change its rating, but covering too much of the reflective area can, so placement matters." },
      { question: "Can you print team shirts with different names on each?", answer: "Yes. DTF handles that with no extra setup per name, so a set of twenty shirts with twenty names costs the same per piece as twenty identical ones. Screen printing cannot do it economically." },
      { question: "How many shirts before screen printing is cheaper?", answer: "Around 24, which is also our screen print minimum. Below that DTF wins because there is no per-colour setup. Above about fifty the gap widens quickly in screen printing's favour." },
    ],
    image: { src: "/local/custom-apparel-brampton.svg", alt: "Workwear and team apparel options for Brampton, Surge Labs" },
  },
  {
    service: "business-cards",
    city: "toronto",
    intro: [
      "Printing for Toronto clients is mostly a logistics problem rather than a printing one. The work itself is the same as anywhere; getting it to a storefront on Queen West at two in the afternoon is not. We deliver across the city, and we are honest that a downtown drop is scheduled rather than instant — anyone promising you same-day delivery into the core at rush hour is describing a courier fee they have not mentioned yet.",
      "The orders skew smaller and more design-led than the suburbs. Studios and agencies around Liberty Village and King West order 500 at a time on heavier stock, frequently with soft-touch lamination and spot UV, because the card is part of the pitch. Independent operators in Leslieville and the Junction — barbers, tattooists, small studios — order 250 and care about the edge and the finish more than the quantity, since the card gets handed over one at a time and is meant to be kept.",
      "That is where 32pt with a painted edge earns its cost. It is thick enough to register as deliberate the moment it is picked up, and the colour on the cut edge is visible across a table. If the budget will not stretch, 18pt uncoated with a heavy ink coverage does a lot of the same work for much less. We will tell you which to spend on rather than quoting the most expensive option and waiting.",
      "Worth knowing if you are ordering for a studio: dark stocks show fingerprints, and soft-touch lamination shows them most of all. It is still the right finish for most work, but if the card is going into a portfolio or being handled repeatedly at a show, a matte laminate without the soft-touch coating stays cleaner and costs less. We will say so rather than upselling the finish.",
    ],
    neighbourhoods: ["Queen West", "Liberty Village", "King West", "Leslieville", "the Junction"],
    delivery: "Delivered across Toronto on a scheduled run rather than on demand — traffic into the core decides the timing, not the press. Pickup from Mississauga is faster if you need it today.",
    faqs: [
      { question: "Do you deliver to downtown Toronto?", answer: "Yes, across the city, included in the price. Downtown drops are scheduled rather than same-day, because traffic into the core is the constraint. If you need it today, collecting from Mississauga is the honest answer." },
      { question: "What is the best business card stock for a design studio?", answer: "32pt with a painted edge if the card is part of the pitch — it is noticed immediately. Soft-touch lamination with spot UV over the mark is the other combination that gets remarked on. Both cost more than 16pt and both are worth it when the card is doing sales work." },
      { question: "Can you print small runs of 250?", answer: "Yes, 250 is our minimum. Below that the setup dominates and you would pay nearly the same for fewer cards. Most small studios order 250 and reorder rather than sitting on 1,000 with an old address." },
    ],
    image: { src: "/local/business-cards-toronto.svg", alt: "Business card finishes for Toronto studios and storefronts, Surge Labs" },
  },
  {
    service: "signage",
    city: "toronto",
    intro: [
      "Toronto signage has one constraint that decides most of the job before design begins: the storefront is usually narrow, often heritage, and frequently in a Business Improvement Area with its own guidance on top of the city's by-law. A sign that would be routine on a suburban plaza gets a much closer look on a Danforth or Roncesvalles frontage, and the review is about proportion and material as much as size.",
      "That pushes the work toward window graphics, which need no permit in most cases and do a lot. Frosted etch vinyl at eye level gives a clinic or a studio privacy while still reading as finished rather than covered up. 50/50 perforated film lets staff see the street while the street sees the graphic, which suits a small retail unit where the window is also the only source of daylight. Solid white or coloured vinyl for hours, service lists and the things people check from outside before deciding to come in.",
      "A-frames are the other Toronto staple, and the rules differ by district — sidewalk width, distance from the curb, and whether the BIA has its own view. We print 24 by 36 inch inserts so the frame is bought once and the graphic changes seasonally. Interior wayfinding rounds it out: suite numbers, capacity notices, directional signage for a walk-up. Small pieces, quick to produce, and the thing that makes a unit look planned rather than assembled.",
      "Measure the glass before designing anything. Toronto storefronts are rarely square, older frames eat more of the opening than people expect, and a graphic set to the advertised window size regularly arrives an inch too wide. Send us photographs with a tape measure in frame and we will work from the actual opening, which costs nothing and saves reprinting a full window.",
    ],
    neighbourhoods: ["Danforth", "Roncesvalles"],
    delivery: "Delivered across Toronto on a scheduled run. Window vinyl and A-frame inserts are two to four business days from proof approval; we supply cut and ready to apply with instructions.",
    faqs: [
      { question: "Do I need a permit for window signage in Toronto?", answer: "Window graphics generally do not need a sign permit, though coverage limits can apply and some Business Improvement Areas have their own guidance. Anything projecting, illuminated or fixed to the fascia does need one from the City of Toronto." },
      { question: "Can you install signage in Toronto or is it supply only?", answer: "Window vinyl and A-frame inserts we supply cut and ready to apply, with instructions — most people manage a straightforward window themselves. For fascia signage and anything at height, use a licensed installer; we will produce to their measurements." },
      { question: "What is the difference between frosted and perforated window film?", answer: "Frosted etch is opaque and gives privacy in both directions, so it suits a clinic or a treatment room. 50/50 perforated film is printed on the outside and see-through from inside, so staff keep the daylight and the view while the street sees the graphic." },
    ],
    image: { src: "/local/signage-toronto.svg", alt: "Window film and A-frame signage options for Toronto storefronts, Surge Labs" },
  },
  {
    service: "custom-apparel",
    city: "toronto",
    intro: [
      "Toronto apparel orders are smaller, more frequent and far more design-led than the suburbs, and the deciding factor is almost always the garment rather than the print. A studio in the Junction ordering thirty shirts is not going to accept a boxy 5.3oz tee because it is cheap — they want a retail-weight Bella+Canvas or Next Level blank that people will actually wear, and they are right to.",
      "So we start from the blank. Bella+Canvas and Next Level for anything that needs to look like a product rather than a giveaway. Gildan where the shirt is genuinely disposable — a one-day event, a volunteer crew. ATC and Port Authority for polos and outerwear. The print method follows from there: DTF for small runs and full-colour artwork with no minimum, screen printing from 24 pieces where the design is one or two colours and the run justifies the screens.",
      "Cafés and bars along Ossington and Dundas West order the same way — a small run of staff tees, reprinted when the design changes, plus tote bags and aprons that double as merchandise. Because there is no minimum on DTF, testing a design on ten pieces before committing to a hundred is a real option rather than a compromise, and it is what we suggest for anything being sold rather than given away.",
      "Print placement is worth more thought than most people give it. A left chest sits differently on a fitted retail blank than on a boxy unisex tee, and a full front that looks right on a medium can crowd the neckline on a small. We set placement per size rather than using one position across the run, which is a small production step that separates merchandise from event shirts.",
    ],
    neighbourhoods: ["the Junction", "Ossington", "Dundas West"],
    delivery: "Seven to ten business days from proof approval, delivered across Toronto on a scheduled run. Blank availability sets rush timing, not press time.",
    faqs: [
      { question: "What blank do you recommend for merch we are selling?", answer: "Bella+Canvas or Next Level. They fit like a retail garment and people wear them, which is the entire point of merchandise. A basic 5.3oz tee is fine for a one-day event and wrong for anything you are charging for." },
      { question: "Can we test a design before ordering a full run?", answer: "Yes, and we recommend it for anything you are selling. DTF has no minimum, so ten pieces to test fit, placement and how the print sits on the fabric costs ten pieces. Screen printing cannot do that economically." },
      { question: "Do you deliver apparel to Toronto?", answer: "Yes, across the city, on a scheduled run rather than on demand. Traffic into the core is the constraint. If a date is tight, collecting from Mississauga is faster and we will say so." },
    ],
    image: { src: "/local/custom-apparel-toronto.svg", alt: "Garment blank comparison for Toronto merchandise runs, Surge Labs" },
  },
  {
    service: "business-cards",
    city: "vaughan",
    intro: [
      "Vaughan business is concentrated in two very different places, and they order differently. The Concord industrial blocks and the units along Highway 7 house construction, millwork, stone and mechanical contractors, most of them family firms two or three generations in. They order 18pt uncoated in quantity, because the card gets written on at a site meeting and coated stock smears. Nobody there is interested in a finish that makes the card harder to use.",
      "Vaughan Metropolitan Centre is the other pole and it behaves like downtown — offices, professional services, brokerages, and a preference for 16pt coated with soft-touch lamination. Maple and the older parts of Woodbridge sit between the two: independent trades and retail, ordering 500 at a time, usually needing the logo tidied up before it can be printed properly because it was drawn once in 2009 and has been resized ever since.",
      "That tidying-up is worth doing once. A logo redrawn as vector artwork prints sharply at any size, from a business card to a truck door, and you own the files afterwards. We quote it separately and up front rather than folding it into the print price, so you can see what it costs and decide. Delivery across Vaughan is included, and we are roughly forty minutes away depending on the 427.",
      "Quantities are worth thinking about honestly. Cards are cheapest per unit at a thousand, but a firm that changes a phone number, adds a certification or moves unit within eighteen months throws away most of them. For most Vaughan trades, five hundred at a time is the better economics even though the per-card price looks worse, and it keeps the details on the card current.",
    ],
    neighbourhoods: ["Concord", "Highway 7", "Vaughan Metropolitan Centre", "Maple", "Woodbridge"],
    delivery: "Delivered across Vaughan, included. About forty minutes from us depending on the 427, so plan a day for delivery rather than expecting same-day into Concord.",
    faqs: [
      { question: "Do you deliver business cards to Vaughan?", answer: "Yes, delivery across Vaughan and Woodbridge is included. Allow a day on top of the three to five business day standard — we are around forty minutes away and the 427 decides the rest." },
      { question: "Why does my logo look blurry when printed?", answer: "Almost always because it is a JPG or PNG being scaled up. Those have a fixed number of pixels; enlarging invents the rest. Vector artwork has no resolution and prints sharp at any size, from a card to a truck door. We redraw and quote it separately." },
      { question: "What stock is best if I write on my cards?", answer: "18pt uncoated. Coated stocks repel pen ink and it smears or wipes off, which matters a lot if you note a price or a callback date on the back at a site meeting. Uncoated takes ballpoint and pencil cleanly." },
    ],
    image: { src: "/local/business-cards-vaughan.svg", alt: "Business card stocks for Vaughan contractors and offices, Surge Labs" },
  },
  {
    service: "signage",
    city: "vaughan",
    intro: [
      "Construction drives signage in Vaughan more than any other single sector. The Concord yards and the industrial strip along Highway 7 are full of contractors who need site signage, hoarding graphics, safety notices and a fresh set of lawn signs every spring. Those are practical jobs with practical constraints: legible from a road at speed, durable through an Ontario winter, and cheap enough to replace when one disappears.",
      "Site hoarding is the piece worth doing properly. A plywood hoarding around a build in Maple or Kleinburg is up for months and seen by everyone driving past, and most of them carry nothing but a faded permit notice. Printed panels turn it into the largest advertisement the company will ever run, and the cost per square foot is lower than almost anything else we print. Mesh works where the hoarding is fence rather than board, so wind passes through instead of pulling the fixings out.",
      "Retail and restaurant signage around Woodbridge and Vaughan Mills is the other half — window vinyl, A-frame inserts, interior wayfinding. Anything permanent, illuminated or ground-mounted needs a permit from the City of Vaughan, and the by-law is particular about ground signs on the arterial roads. We will flag a design likely to fail a review before you have paid to produce it, which is as far as our involvement in permitting honestly goes.",
      "For anything going up on a site for months, ask about laminate over the print. It adds a small amount to the cost and roughly doubles how long the colour holds against UV, which matters most for reds and oranges — the first pigments to fade. A hoarding that looks tired after one summer undermines the impression it was bought to create.",
    ],
    neighbourhoods: ["Concord", "Highway 7", "Maple", "Kleinburg", "Woodbridge", "Vaughan Mills"],
    delivery: "Delivered across Vaughan, included, allowing a day on top of the standard two to four business days for large format. Site hoarding panels are quoted by the square foot.",
    faqs: [
      { question: "Do you print site hoarding for Vaughan construction sites?", answer: "Yes, printed panels for board hoarding and mesh for fence hoarding. It is one of the cheapest formats per square foot we produce, and a hoarding up for six months on a busy road is usually the largest advertisement a builder will ever run." },
      { question: "Do I need a sign permit in Vaughan?", answer: "For anything permanent, illuminated or ground-mounted, yes, from the City of Vaughan. The by-law is specific about ground signs on arterial roads. Temporary construction and real estate signage has its own allowances." },
      { question: "How many lawn signs should a contractor order?", answer: "Twenty-five is the usual first order and the point where the per-sign price drops meaningfully. Crews lose them, weather takes them, and neighbours ask for them. Reordering from a stored file is a phone call rather than a new design job." },
    ],
    image: { src: "/local/signage-vaughan.svg", alt: "Site hoarding and lawn sign specification for Vaughan, Surge Labs" },
  },
  {
    service: "custom-apparel",
    city: "vaughan",
    intro: [
      "Apparel out of Vaughan is dominated by construction crews, and construction crews are hard on clothing. A shirt that goes on at six in the morning, gets worn through a full shift in a Concord yard and washed hot every night is being tested in a way a giveaway tee never is. That decides both the garment and the decoration method before any design conversation happens.",
      "For crew kit we push toward embroidery on polos and outerwear, because stitching survives industrial laundry and a printed logo does not. A printed shirt washed hot weekly looks tired by the end of a season; the same logo stitched looks unchanged in three years. The one-time digitising charge feels like an extra at the start and disappears entirely by the second reorder, which for a firm hiring steadily happens within months.",
      "Hi-vis is the other constant, and the important detail is placement rather than print. Decorating a garment does not change its visibility rating, but covering too much of the reflective banding can, so we keep logos clear of it and will tell you if a requested placement compromises the garment. For the softball teams, community events and family-firm anniversaries that fill the rest of the order book — Maple, Woodbridge, Kleinburg — DTF with no minimum handles small dated runs without a setup charge.",
      "Ordering ahead is the difference between a smooth crew kit and a scramble. Blank availability, not our press, is what usually delays an apparel order, and a specific colour in a full size range can take a week to arrive before decoration starts. For seasonal hiring, tell us the intake dates and we will hold stock rather than reordering four times at short notice.",
    ],
    neighbourhoods: ["Concord", "Maple", "Woodbridge", "Kleinburg"],
    delivery: "Seven to ten business days from proof approval, delivered across Vaughan. Add a day for the drive; digitising adds a day at the front for a new logo.",
    faqs: [
      { question: "Should crew shirts be printed or embroidered?", answer: "Embroidered, if they go through hot washes weekly. Stitching survives industrial laundry and looks the same in three years; a printed logo on a work shirt is tired by the end of a season. Printing is right for events and one-offs." },
      { question: "Can you decorate hi-vis without affecting the rating?", answer: "Yes, with care. Decoration itself does not change the rating, but covering reflective banding can. We keep logos clear of it and will tell you if a placement you have asked for compromises the garment rather than just doing it." },
      { question: "How long do we wait for a reorder of the same shirts?", answer: "Seven to ten business days, and no setup charge — we keep your digitised file and your artwork. The only variable is whether the exact garment and colour is still available, which we check before quoting rather than after." },
    ],
    image: { src: "/local/custom-apparel-vaughan.svg", alt: "Crew workwear decoration options for Vaughan, Surge Labs" },
  },
  {
    service: "business-cards",
    city: "oakville",
    intro: [
      "Oakville orders print the way Oakville does most things: fewer, better, and with the finish mattering more than the price. Professional services around downtown Oakville and Kerr Village — wealth management, law, dentistry, design — are the bulk of it, and they order 16pt coated with soft-touch lamination almost by default, frequently with spot UV over the mark and occasionally with foil.",
      "That preference is worth taking seriously rather than talking anyone out of. A card is handed over at the point where someone is deciding whether to trust you with something expensive, and a flimsy card undercuts that in a way a good one quietly supports. Soft-touch with spot UV is the combination people notice without naming: the card feels like suede and the logo sits raised and glossy against it. 32pt with a painted edge is the step beyond, and it is not subtle.",
      "The other half of the work comes from the Winston Park and Speers Road business areas — trades, marine services out toward Bronte, contractors — and behaves completely differently. Those go on 18pt uncoated because they are written on, and the priority is a phone number that can be read at arm's length rather than a finish. Both are routine here, and we would rather ask which you are than assume from the postcode.",
      "If the card is going into a portfolio or a wallet and staying there, the substrate matters more than the finish. Uncoated stocks age well and take a pen; heavily coated ones scuff at the corners and show every handling mark. For a professional practice handing over cards that are meant to be kept for months, that durability is worth more than an extra layer of gloss.",
    ],
    neighbourhoods: ["downtown Oakville", "Kerr Village", "Winston Park", "Speers Road", "Bronte"],
    delivery: "Delivered across Oakville, included, on the standard three to five business days from proof approval. We are about twenty-five minutes west on the QEW.",
    faqs: [
      { question: "Do you deliver business cards to Oakville?", answer: "Yes, included. We are about twenty-five minutes away on the QEW, and orders arrive within the standard three to five business days from proof approval." },
      { question: "What is soft-touch lamination?", answer: "A matte film that gives the card a velvety, suede-like feel. It is the finish people notice without being able to name, and it pairs well with spot UV — gloss varnish over the logo only — so the mark sits raised and shiny against the matte." },
      { question: "Is foil worth it on a business card?", answer: "On a dark stock, yes: gold or silver foil against a deep colour reads as expensive because it genuinely is a separate process. On a light stock it is much less visible and rarely worth the cost. We will show you the difference before you commit." },
    ],
    image: { src: "/local/business-cards-oakville.svg", alt: "Premium business card finishes for Oakville professional services, Surge Labs" },
  },
  {
    service: "signage",
    city: "oakville",
    intro: [
      "Oakville has a stricter view of signage than most of the GTA, particularly in the heritage areas, and that is the first thing worth knowing before designing anything. Downtown Oakville and Bronte Village both have character that the town actively protects, and a sign that would pass without comment on a suburban arterial gets a closer look on Lakeshore Road. Proportion, material and how the sign meets the building all matter more here.",
      "In practice, that pushes good work toward restraint. Window vinyl in a single colour, sized modestly. Hand-finished-looking fascia rather than a large illuminated box. Frosted etch film where a clinic or a studio in Kerr Village wants privacy without blanking the window out. We produce all of it here, and where a design is clearly going to run into the by-law, we say so before you have paid to make it rather than after.",
      "The commercial and industrial areas along Speers Road and through Winston Park are a different job entirely, and much more straightforward — unit signage, wayfinding, loading bay numbers, coroplast for temporary use, A-frames for the plazas. Anything permanent, illuminated or ground-mounted needs a permit from the Town of Oakville. We are not a permit service, but we will produce to an installer's measurements and supply artwork in the format a permit application needs.",
      "Lighting is the detail most people miss on a heritage frontage. An externally lit sign — a discreet gooseneck or a downlight — almost always sits better with an older building than an internally illuminated box, and it tends to pass review more easily. We do not do electrical work, but we will design to it and produce the face to your installer's specification.",
    ],
    neighbourhoods: ["downtown Oakville", "Bronte Village", "Lakeshore Road", "Kerr Village", "Speers Road", "Winston Park"],
    delivery: "Delivered across Oakville, included, on two to four business days for large format. About twenty-five minutes west on the QEW if you would rather collect.",
    faqs: [
      { question: "Do I need a sign permit in Oakville?", answer: "For anything permanent, illuminated or ground-mounted, yes, from the Town of Oakville — and the heritage areas downtown and in Bronte get a closer look. Window vinyl generally does not, within coverage limits." },
      { question: "Can you supply artwork for a permit application?", answer: "Yes. We supply scaled drawings and specifications in the format an application needs, and we will produce to an installer's measurements. We do not submit applications on your behalf." },
      { question: "What signage works in a heritage storefront?", answer: "Restraint. Single-colour window vinyl sized modestly, a fascia sign that suits the building rather than covering it, and frosted film where you need privacy. Large illuminated boxes tend to run into trouble in downtown Oakville and Bronte Village." },
    ],
    image: { src: "/local/signage-oakville.svg", alt: "Heritage storefront signage options for Oakville, Surge Labs" },
  },
  {
    service: "custom-apparel",
    city: "oakville",
    intro: [
      "Apparel demand in Oakville comes from three places, and none of them are volume workwear. Sports clubs first — soccer, hockey, rowing out of Bronte Harbour, and the school teams around Glen Abbey — which order dated, numbered sets on a season schedule and need names on individual pieces. Second, corporate gifting from the offices in Winston Park, which is small runs of good garments rather than large runs of cheap ones. Third, retail and hospitality along Lakeshore Road ordering staff kit and merchandise together.",
      "The common thread is that the garment matters more than the unit price. A club that charges parents for a kit cannot hand back a boxy tee that shrinks; a firm giving branded outerwear to clients is judged on the jacket, not the embroidery. So we start from blanks people will actually wear — Bella+Canvas and Next Level for tees, ATC and Port Authority for polos and outerwear — and fit the decoration to that rather than the other way round.",
      "For numbered team sets, DTF is the right method: full colour, no minimum, and a different name on every piece at no extra setup. For corporate gifts and anything going through repeated washing, embroidery, because it still looks deliberate after a winter of wear. We proof both on the actual garment colour before anything runs, which matters more than people expect — a design that looks right on white can disappear entirely on navy.",
      "For anything being resold rather than given away, order a sample first. It costs one garment, and it tells you how the print sits on the fabric, whether the blank fits the way the size chart claims, and how the colour reads in daylight rather than on a screen. Clubs charging parents for kit should never skip that step.",
    ],
    neighbourhoods: ["Bronte Harbour", "Glen Abbey", "Winston Park", "Lakeshore Road"],
    delivery: "Seven to ten business days from proof approval, delivered across Oakville. Dated team sets should be ordered three weeks out so blank availability is not the constraint.",
    faqs: [
      { question: "Can you do numbered team kits for Oakville clubs?", answer: "Yes. DTF prints a different name and number on every piece with no extra setup, so a squad of twenty costs the same per shirt as twenty identical ones. Order about three weeks before you need them so blank availability is not the limiting factor." },
      { question: "What garment do you recommend for corporate gifts?", answer: "ATC or Port Authority outerwear and polos, embroidered rather than printed. The recipient judges the garment, not the logo, and stitching still looks deliberate after a season of wear. A cheap blank with a good logo on it reads as a giveaway." },
      { question: "Will my logo show up on a dark garment?", answer: "DTF prints opaque white underneath, so yes, colours stay true on navy or black. Embroidery depends on thread contrast rather than opacity. Either way we proof on the actual garment colour before running, because a design that reads on white can vanish on navy." },
    ],
    image: { src: "/local/custom-apparel-oakville.svg", alt: "Team kit and corporate gifting apparel for Oakville, Surge Labs" },
  },
  {
    service: "business-cards",
    city: "markham",
    intro: [
      "Markham prints differently from the rest of the GTA for one specific reason: a large share of the business community operates bilingually, and cards frequently need English on one side and Traditional or Simplified Chinese on the other. That is straightforward to produce and easy to get wrong. The failure is almost never the printing — it is a font substitution at the export stage turning characters into boxes, or a translation set in a face that does not carry the full glyph range.",
      "We handle that by asking for the file with fonts outlined, or by setting the Chinese side here from supplied text in a font we know covers the characters. Then we proof both sides at size and ask a native reader to check before it runs, because a character rendered wrong is not a typo a printer can catch. Firms around Markham Centre and along the Woodbine corridor order this way constantly, and the ones who have been burned before always ask for the proof first.",
      "Otherwise the work looks like any prosperous suburb. Professional services and the tech firms out toward Buttonville order 16pt coated in runs of 500 to 1,000, often with soft-touch. Retail and restaurants in Unionville and around Milliken order smaller and more often. We deliver across Markham; it is about forty-five minutes from us, so plan a day rather than expecting an afternoon drop.",
      "If your card carries a WeChat or QR code, test it printed rather than on screen. Codes need quiet space around them and enough contrast against the stock, and a code reversed out of a dark background at small size frequently will not scan at all. We check it at final size on the actual stock before the run, which takes a minute and avoids reprinting a thousand cards.",
    ],
    neighbourhoods: ["Markham Centre", "Woodbine", "Buttonville", "Unionville", "Milliken"],
    delivery: "Delivered across Markham, included, allowing a day on top of the three to five business day standard — it is about forty-five minutes each way.",
    faqs: [
      { question: "Can you print bilingual English and Chinese business cards?", answer: "Yes, and it is common work for us. Send the file with fonts outlined, or send the text and we will set it in a face that carries the full glyph range. We proof both sides at size and ask you to have a native reader check before it runs." },
      { question: "Why did my Chinese text turn into boxes when I sent the PDF?", answer: "A font substitution at export. The characters were set in a font the exporting machine had but the PDF did not embed, so the reader swapped in something without those glyphs. Exporting with fonts embedded or outlined fixes it permanently." },
      { question: "Do you deliver business cards to Markham?", answer: "Yes, included in the price. Allow a day on top of the standard three to five business days from proof approval — Markham is about forty-five minutes from our shop in Mississauga." },
    ],
    image: { src: "/local/business-cards-markham.svg", alt: "Bilingual business card setup for Markham, Surge Labs" },
  },
  {
    service: "signage",
    city: "markham",
    intro: [
      "Signage in Markham runs into two things at once: a bilingual retail environment and a town that pays attention to how commercial frontage looks, particularly in Unionville where the heritage main street is the whole draw. A sign that works on a Woodbine corridor plaza is not the same sign that works on Main Street Unionville, and pretending otherwise wastes money.",
      "Bilingual signage has a design problem worth naming. Chinese characters and Latin type have different visual weights at the same point size, so setting them at matched sizes makes one dominate. Getting the balance right is a typesetting decision rather than a translation one, and it is what separates a sign that looks designed from one that looks like two signs stuck together. We set it here and proof it before cutting, and we ask a native reader to check the characters rather than trusting our own eyes.",
      "The everyday volume is plaza and unit signage across Markham Centre and the Milliken business areas — fascia panels, window vinyl, directory inserts, wayfinding, loading bay numbers. Anything permanent, illuminated or ground-mounted needs a permit from the City of Markham. We produce to an installer's measurements and supply artwork in the format an application needs, and we will flag a design likely to fail before you have paid to make it.",
      "Plaza directory inserts are worth checking before you order. Every landlord has a different panel size and a different rule about typeface and background colour, and the specification is usually a PDF sitting in a property manager's inbox rather than anywhere public. Ask for it before design starts and we will set to it exactly, rather than producing something the management company rejects.",
    ],
    neighbourhoods: ["Unionville", "Woodbine", "Markham Centre", "Milliken"],
    delivery: "Delivered across Markham, included, allowing a day on top of two to four business days for large format. Bilingual artwork adds a proofing round before cutting.",
    faqs: [
      { question: "Can you produce bilingual signage for Markham?", answer: "Yes. The part that needs care is not translation but typesetting — Chinese characters and Latin type carry different visual weight at the same size, so matching point sizes makes one dominate. We balance it, proof it, and ask a native reader to check the characters before cutting." },
      { question: "Do I need a sign permit in Markham?", answer: "For anything permanent, illuminated or ground-mounted, yes, from the City of Markham. Unionville's heritage area is looked at more closely than the arterial plazas. Window vinyl generally does not need one, within coverage limits." },
      { question: "Do you install signage in Markham?", answer: "We supply window vinyl and A-frame inserts ready to apply. For fascia and anything at height, use a licensed installer — we produce to their measurements and supply the artwork their application needs." },
    ],
    image: { src: "/local/signage-markham.svg", alt: "Bilingual storefront signage layout for Markham, Surge Labs" },
  },
  {
    service: "custom-apparel",
    city: "markham",
    intro: [
      "Markham apparel work is mostly corporate and mostly quiet — the technology and professional services firms around Buttonville and Markham Centre ordering staff kit, event polos and onboarding gifts. These orders are modest in quantity and particular about the garment, because the shirt is being handed to an employee on their first day rather than thrown into a swag bag at a conference.",
      "That means embroidery more often than print. A stitched left chest on a decent polo reads as a uniform rather than a giveaway, survives repeated washing, and looks the same in three years, which matters when new hires arrive continuously and need to match the people already there. We digitise once, keep the file, and every reorder after that runs with no setup charge and at exactly the same size and position as the first batch.",
      "The rest is community and school work — teams, clubs and events around Unionville and Milliken — where the requirement flips completely. Those are dated, often numbered, frequently need a different name on each piece, and are ordered three weeks before the event by someone doing it as a volunteer. DTF handles all of that with no minimum and no per-name setup, and we would rather set the expectation about blank availability early than have a set arrive after the tournament.",
      "Onboarding kits work best when they are specified once and left alone. Agree the garment, the colour, the placement and the size range, and we hold that specification on file so every new hire receives the same thing without anyone re-deciding. It removes a recurring small decision from whoever runs onboarding, and it is why the kit still matches two years later.",
    ],
    neighbourhoods: ["Buttonville", "Markham Centre", "Unionville", "Milliken"],
    delivery: "Seven to ten business days from proof approval, delivered across Markham. Digitising adds a day at the front for a new logo; dated event sets should be ordered three weeks out.",
    faqs: [
      { question: "What is best for company polos, embroidery or print?", answer: "Embroidery. A stitched left chest on a decent polo reads as a uniform, survives repeated washing and looks unchanged in three years. Printing is right for events and one-offs, not for kit somebody wears weekly." },
      { question: "Will new hires get shirts that match the existing team?", answer: "Yes. We keep your digitised file, so a reorder in eighteen months stitches at the same size and position with no setup charge. The only variable is whether the exact garment and colour is still made, which we check before quoting." },
      { question: "How long before an event should we order team shirts?", answer: "Three weeks. Production is seven to ten business days from proof approval, but blank availability is the real constraint — a specific colour in a full size range can take a week to arrive before we even start." },
    ],
    image: { src: "/local/custom-apparel-markham.svg", alt: "Corporate and team apparel options for Markham, Surge Labs" },
  },
];

const errors = validateLocalPages(localPages);
if (errors.length > 0) {
  throw new Error(
    `content/local-pages.ts failed validation:\n  - ${errors.join("\n  - ")}\n\n` +
      "Every local page needs 250+ words written for that city, its named " +
      "neighbourhoods actually present in that copy, a delivery line, three " +
      "FAQs and an image. Fix the entry or remove it — a page that cannot " +
      "clear this bar is a doorway page, and shipping it costs the whole domain.",
  );
}

/** Pages that passed validation. The only source for routes and the sitemap. */
export const livePages = localPages;

export function getLocalPage(service: string, city: string): LocalPage | undefined {
  return localPages.find((page) => page.service === service && page.city === city);
}

/** Live services in a given city, excluding the one being viewed. */
export function siblingServicesIn(city: string, exclude: string): LocalPage[] {
  return localPages.filter((page) => page.city === city && page.service !== exclude);
}

/** The same service in other cities where it is live. */
export function sameServiceNearby(service: string, exclude: string): LocalPage[] {
  return localPages.filter((page) => page.service === service && page.city !== exclude);
}

/** Cities with at least one live page, for the /service-areas hub. */
export function liveCities(): string[] {
  return [...new Set(localPages.map((page) => page.city))];
}
