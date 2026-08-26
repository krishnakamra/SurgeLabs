export type CatalogueItem = { name: string; detail: string };
export type CatalogueGroup = { group: string; items: readonly CatalogueItem[] };
export type SpecRow = { label: string; value: string };
export type Faq = { question: string; answer: string };
export type ProcessStep = { step: string; title: string; detail: string };
export type CopySection = { heading: string; body: readonly string[] };

export type Service = {
  slug: string;
  /** Display numeral on the homepage panels. */
  number: string;
  name: string;
  /** One line, plain. Used on the homepage. */
  summary: string;
  /** Short capability list for the homepage panel. */
  capabilities: readonly string[];
  /** One honest production spec, homepage panel. */
  spec: string;

  /** Opening paragraphs, above the catalogue. */
  intro: readonly string[];
  /** The body copy. This is the part that has to be specific to rank. */
  sections: readonly CopySection[];
  /** The real catalogue — what someone can actually order. */
  catalogue: readonly CatalogueGroup[];
  /** Production specs, set as a job-ticket table. */
  specs: readonly SpecRow[];
  faqs: readonly Faq[];
  /** Higgsfield loop lands here later; the plate placeholder stands in. */
  media?: { src: string; poster: string };
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: THESE SPECS ARE PUBLISHED CLAIMS. KEEP THEM TRUE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The specificity here is deliberate — naming a 13oz scrim banner and a 4mm
 * coroplast sign is what lets these pages rank against shops that have been
 * in the GTA for twenty years. Generic copy will not.
 *
 * Every number below was reviewed and confirmed by the owner as matching the
 * real equipment and process. That confirmation is what makes them safe to
 * publish, and it is also a standing obligation: this file is the ONLY place
 * they appear, and the FAQ schema pushes them to Google as answers. A machine
 * that changes, a stock that gets discontinued or a turnaround that slips has
 * to be corrected here, not softened elsewhere.
 *
 * The rule that governs this file: anything you could not honour on a Tuesday
 * afternoon in February does not belong in it.
 *
 * Covered by that confirmation:
 *   · stock weights and finishes         (16pt C2S, soft-touch, spot UV…)
 *   · maximum print widths               (54" roll)
 *   · turnaround days and rush cut-offs  (3–5 days, same-day before 11am)
 *   · minimums                           (24 pieces for screen printing)
 *   · stitch and thread-colour limits    (15 colours, 12,000 stitches)
 *   · accepted file formats and bleeds   (PDF/X, 300dpi, 0.125")
 *
 * NOT yet covered — see the block above the gold-foil entry below.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const services: readonly Service[] = [
  {
    slug: "web-design-seo",
    number: "01",
    name: "Web & digital",
    summary: "Sites that load fast, rank locally and are built to be edited.",
    capabilities: [
      "Custom web design and development",
      "Local SEO and Google Business Profile",
      "Technical SEO and Core Web Vitals",
      "Shopify and e-commerce builds",
      "Social media management",
      "Monthly analytics reporting",
    ],
    spec: "Built in-house · Core Web Vitals scored · reported monthly",

    intro: [
      "We build websites for Mississauga businesses that need the phone to ring. Most of our work is five to fifteen pages, built to load on a phone on a weak connection, and set up so you can change your own hours and prices without booking a call.",
      "Everything is made here. The same people who build the site set the business cards and stitch the polos, which is why the blue on your homepage matches the blue on your van.",
    ],
    sections: [
      {
        heading: "What we build",
        body: [
          "Brochure sites run on Next.js or WordPress, depending on who edits them after launch. If your staff update the site weekly, WordPress with a page builder is usually the right answer. If it changes twice a year and speed matters more, we build it in Next.js and host it on Vercel.",
          "Online stores run on Shopify. We load your products, set tax and shipping for Ontario, connect payments, and record a training video against your actual store rather than a demo one. We do not build custom carts — Shopify handles PCI compliance and we would rather you paid Shopify for that than paid us to reinvent it.",
          "Every build includes an SSL certificate, a contact form that reaches a real inbox, Google Analytics 4 and Search Console, and a sitemap submitted the day you go live.",
        ],
      },
      {
        heading: "Local SEO aimed at the map pack",
        body: [
          "Most local searches never reach a website. Someone types \"printing near me\" in Mississauga, looks at the three map results, and calls one. Ranking in that block is a different job from ranking in the blue links, and it is mostly about the Google Business Profile.",
          "We set the primary and secondary categories, define the service areas, load the services list with prices where you want them public, write the description, and post to the profile so it does not go stale. We check that your name, address and phone match across the site, the profile and the main Canadian directories — inconsistent listings are one of the few things that measurably hold a business out of the pack.",
          "On the site itself we build a page per service and a page per city we serve, each with copy specific enough to be worth reading. Eight substantial city pages rank. A hundred pages generated from a template get filtered as doorway pages, which now costs rankings rather than earning them.",
        ],
      },
      {
        heading: "Technical SEO and Core Web Vitals",
        body: [
          "We build to pass Core Web Vitals on a mid-range Android phone, not on the laptop the site was designed on. That means Largest Contentful Paint under 2.5 seconds, Interaction to Next Paint under 200 milliseconds, and Cumulative Layout Shift under 0.1 — measured in the field, in Search Console, not just in a lab score.",
          "In practice that is serving images as AVIF or WebP at the size they are displayed, reserving space for anything that loads late so the page does not jump, keeping third-party scripts to the ones that earn their place, and rendering pages as static HTML wherever the content allows it.",
          "We add structured data for the business, the services and the FAQs, so the listing can carry hours, a phone number and answers rather than just a title and a description.",
        ],
      },
      {
        heading: "What we need from you",
        body: [
          "A logo as vector artwork — .ai, .eps, .svg or a PDF with live vectors. If all you have is a JPG from a business card, we redraw it, and we quote that separately rather than hiding it.",
          "Photographs at 2000 pixels or more on the long edge. Phone photos are usually fine; screenshots of photos are not. If you do not have usable images we shoot them here.",
          "Your copy, or a half-hour conversation from which we write it. Most delays on a website are waiting for text, so we start writing from the conversation and send it to you to correct.",
        ],
      },
      {
        heading: "What you own at the end",
        body: [
          "The domain stays in your name. The hosting account is yours. You get the code, the analytics access and the Google Business Profile ownership, and none of it is held as leverage to keep you on a plan.",
          "A five-page site takes two to three weeks once we have your content. Ten to fifteen pages takes three to four. A Shopify build with products loaded takes four to six.",
        ],
      },
    ],
    catalogue: [
      {
        group: "Websites",
        items: [
          { name: "Brochure sites", detail: "5–15 pages, Next.js or WordPress" },
          { name: "Shopify builds", detail: "Products loaded, Ontario tax and shipping set" },
          { name: "Landing pages", detail: "Single-purpose, built for one campaign" },
          { name: "Booking and forms", detail: "Routed to your inbox or CRM" },
          { name: "Site rescues", detail: "Speed, security and mobile fixes on an existing site" },
          { name: "Hosting and care", detail: "Updates, backups, uptime monitoring" },
        ],
      },
      {
        group: "Search",
        items: [
          { name: "Google Business Profile", detail: "Categories, service areas, services, posts" },
          { name: "Local SEO", detail: "City and service pages, citations, NAP consistency" },
          { name: "Technical SEO", detail: "Core Web Vitals, crawlability, structured data" },
          { name: "Content", detail: "Service pages written here, not spun" },
          { name: "Analytics", detail: "GA4 and Search Console, configured and explained" },
          { name: "Monthly reporting", detail: "Calls, forms and rankings in plain language" },
        ],
      },
    ],
    specs: [
      { label: "Platforms", value: "Next.js, WordPress, Shopify" },
      { label: "Performance target", value: "LCP under 2.5s, INP under 200ms, CLS under 0.1" },
      { label: "Logo formats", value: ".ai, .eps, .svg, or PDF with live vectors" },
      { label: "Image minimum", value: "2000px on the long edge" },
      { label: "Five-page site", value: "2–3 weeks from content" },
      { label: "Shopify build", value: "4–6 weeks with products loaded" },
      { label: "Ownership", value: "Domain, hosting, code and analytics stay yours" },
    ],
    faqs: [
      {
        question: "How much does a website cost in Mississauga?",
        answer:
          "A website on its own starts at $599. Our Launch Kit is $899 and adds the Google Business Profile setup, packaged logo files and 250 business cards. Larger builds and Shopify stores are quoted from the page count and the number of products.",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          "A five-page site takes two to three weeks once we have your text and photos. Ten to fifteen pages takes three to four weeks. A Shopify store with products loaded takes four to six weeks. The clock starts when content arrives, not when the deposit does.",
      },
      {
        question: "Do I own my website and domain?",
        answer:
          "Yes. The domain is registered in your name, the hosting account is yours, and you get the code and the analytics access. Nothing is held back to keep you on a plan.",
      },
      {
        question: "Can you fix my existing website instead of rebuilding it?",
        answer:
          "Often, yes. If the site is on WordPress or Shopify and the structure is sound, we fix speed, mobile layout and security for less than a rebuild. If it is a page builder with twelve plugins fighting each other, rebuilding is usually cheaper than untangling it. We tell you which before you commit.",
      },
      {
        question: "How long does local SEO take to work?",
        answer:
          "Google Business Profile changes can move within days. Ranking for competitive service terms in Mississauga usually takes three to six months of consistent work. Anyone promising page one in thirty days is either buying ads or guessing.",
      },
      {
        question: "Do you work with businesses outside Mississauga?",
        answer:
          "Yes. Most of our clients are across the GTA — Brampton, Toronto, Etobicoke, Oakville, Milton, Burlington and Vaughan. Web work happens anywhere; print and apparel we deliver across the GTA.",
      },
      {
        question: "What do you need from me to start?",
        answer:
          "A vector logo, photos at 2000 pixels or larger, and either your copy or half an hour on the phone so we can write it. If your logo only exists as a JPG we redraw it and quote that separately.",
      },
    ],
  },

  {
    slug: "printing-signage",
    number: "02",
    name: "Print & signage",
    summary: "Everything from a business card to a vehicle wrap, printed here.",
    capabilities: [
      "Business cards, flyers, brochures, postcards",
      "Banners and large format",
      "Trade show displays and feather flags",
      "Coroplast and lawn signs",
      "Vehicle graphics and lettering",
      "Same-day rush on stocked items",
    ],
    spec: "16pt–32pt stocks · spot UV · soft-touch · foil",

    intro: [
      "We print in Mississauga and deliver across the GTA. Business cards, flyers, banners, lawn signs, vehicle lettering and trade show kits, produced on site rather than brokered out to whoever is cheapest that week.",
      "That matters when the job is wrong. A broker sends your file back into a queue in another city. We reprint it here, usually the same day.",
    ],
    sections: [
      {
        heading: "Stocks and finishes we run",
        body: [
          "Business cards are 16pt coated two sides as standard. We also run 18pt uncoated for anyone who signs the back of their cards, and 32pt with a painted edge when the card is doing the work of a first impression. Rounded corners, square corners and die-cut shapes all come off the same press.",
          "Flyers run on 100lb gloss text, 80lb matte text or 100lb uncoated. Postcards go on 14pt or 16pt coated with UV on one side so a pen still works on the other. Brochures fold tri-fold, z-fold or half on 100lb gloss text. Presentation folders are 14pt with glued pockets and business card slits.",
          "Finishes include gloss, matte and soft-touch lamination, spot UV, gold and silver foil, scoring, perforation and die-cutting. Soft-touch with spot UV is the combination people notice without being able to name — the card feels like suede and the logo sits proud of it.",
          "For the office side we run NCR forms in two-part and three-part sets with sequential numbering, notepads glued at 50 sheets on 60lb offset with a chipboard back, letterhead on 70lb bond, and #10 envelopes with or without a window.",
        ],
      },
      {
        heading: "Large format and signage",
        body: [
          "Our roll printer takes material up to 54 inches wide, so a banner can run 54 inches by whatever length the job needs without a seam. Wider than that we panel it and overlap the seam where the artwork hides it.",
          "Vinyl banners are 13oz scrim, hemmed on all four sides with grommets every 60 centimetres. Fence banners go on 8oz mesh so wind passes through instead of taking the fence down. Retractable stands come in 33 by 81 inches and 47 by 81 inches, with the cartridge reusable — reprint the graphic next year and keep the base.",
          "Lawn signs are 4mm coroplast, printed one side or two, with H-stakes. A-frames take 24 by 36 inch inserts and get swapped seasonally. Feather flags come in 8, 11 and 14 foot heights, single or double sided, with ground spike or cross base.",
          "For windows we run white vinyl, clear vinyl, frosted etch for privacy, and 50/50 perforated film so staff can see out while customers see the graphic.",
        ],
      },
      {
        heading: "Vehicle graphics",
        body: [
          "Most trades do not need a full wrap. Cut vinyl lettering on the doors and tailgate with your name, number and website costs a fraction of a wrap, lasts as long, and is easier to update when the number changes.",
          "We do cut lettering, partial wraps on the rear quarters and hood, and full-colour printed panels laminated against UV. Magnetic panels at 30mil suit leased vehicles and anyone who does not want branding on weekends.",
          "Vehicles are measured here rather than worked from a template, because a 2019 Transit and a 2024 Transit are not the same panel.",
        ],
      },
      {
        heading: "Artwork we can print",
        body: [
          "Send a print-ready PDF at 300dpi in CMYK, with 0.125 inch bleed on every edge and fonts outlined or embedded. That prints exactly as you see it.",
          "We also accept packaged Illustrator, InDesign and Photoshop files, and we will work from a Canva export as long as it is a PDF for print rather than a screen JPG. If artwork arrives in RGB we convert it and tell you which colours will shift — bright RGB blues and greens are the usual casualties.",
          "No artwork at all is fine. We set it here, send a proof, and the setup is quoted before we start rather than added at the end.",
        ],
      },
      {
        heading: "Turnaround and rush",
        body: [
          "Standard turnaround is three to five business days from proof approval for press work, and two to four for large format. Vehicle graphics take a day in the shop once the panels are printed.",
          "Same-day is real on stocked items — business cards, flyers, lawn signs and banners — if artwork is approved before 11am. It is not a promise we make on foil, die-cutting or anything that has to be ordered in.",
          "Turnaround counts from proof approval, not from the deposit. A file sitting in your inbox waiting for a signature is the most common reason a job runs late.",
        ],
      },
    ],
    catalogue: [
      {
        group: "Press",
        items: [
          { name: "Business cards", detail: "16pt C2S, 18pt uncoated, 32pt painted edge" },
          { name: "Flyers", detail: "100lb gloss, 80lb matte, 100lb uncoated" },
          { name: "Postcards", detail: "14pt / 16pt C2S, UV one side" },
          { name: "Brochures", detail: "Tri-fold, z-fold, half fold on 100lb text" },
          { name: "Door hangers", detail: "14pt, die-cut with hang hole" },
          { name: "Presentation folders", detail: "14pt, glued pockets, card slits" },
          { name: "Rack cards", detail: "4×9 on 16pt, UV one side" },
          { name: "NCR forms", detail: "2-part and 3-part, sequential numbering" },
          { name: "Notepads", detail: "50 sheets, 60lb offset, chipboard back" },
          { name: "Letterhead", detail: "70lb bond, matched to your envelopes" },
          { name: "Envelopes", detail: "#10, window or plain" },
          { name: "Stickers and labels", detail: "Die-cut vinyl, roll or sheet" },
        ],
      },
      {
        group: "Large format",
        items: [
          { name: "Vinyl banners", detail: "13oz scrim, hemmed, grommets every 60cm" },
          { name: "Mesh banners", detail: "8oz, for fences and windy sites" },
          { name: "Retractable stands", detail: "33×81 and 47×81, reusable cartridge" },
          { name: "Coroplast lawn signs", detail: "4mm, one or two sides, H-stakes" },
          { name: "A-frames", detail: "24×36 inserts, swapped seasonally" },
          { name: "Feather flags", detail: "8ft, 11ft, 14ft — spike or cross base" },
          { name: "Table covers", detail: "6ft and 8ft, dye-sublimated polyester" },
          { name: "Window decals", detail: "White, clear, frosted etch, 50/50 perf" },
          { name: "Magnets", detail: "30mil vehicle panels" },
        ],
      },
      {
        group: "Vehicle",
        items: [
          { name: "Cut vinyl lettering", detail: "Doors, tailgate, rear window" },
          { name: "Partial wraps", detail: "Rear quarters, hood, printed and laminated" },
          { name: "Magnetic panels", detail: "30mil, for leased vehicles" },
        ],
      },
    ],
    specs: [
      { label: "Max print width", value: '54" roll, seamless' },
      { label: "Card stocks", value: "16pt C2S, 18pt uncoated, 32pt painted edge" },
      { label: "Finishes", value: "Gloss, matte, soft-touch, spot UV, foil, die-cut" },
      { label: "Banner material", value: "13oz scrim vinyl, 8oz mesh" },
      { label: "Lawn signs", value: "4mm coroplast, H-stakes included" },
      { label: "Artwork", value: 'PDF, 300dpi, CMYK, 0.125" bleed, fonts outlined' },
      { label: "Standard turnaround", value: "3–5 business days from proof approval" },
      { label: "Same-day rush", value: "Stocked items, artwork approved before 11am" },
    ],
    faqs: [
      {
        question: "How long do business cards take in Mississauga?",
        answer:
          "Three to five business days from proof approval as standard. If your artwork is print-ready and approved before 11am we can do 16pt business cards same day. Foil, painted edges and die-cut shapes need the full week.",
      },
      {
        question: "Do you print same day?",
        answer:
          "Yes, on stocked items — business cards, flyers, coroplast lawn signs and vinyl banners — when artwork is approved before 11am on a weekday. We do not promise same day on foil, die-cutting, or anything that has to be ordered in.",
      },
      {
        question: "What file format do you need for printing?",
        answer:
          "A print-ready PDF at 300dpi in CMYK, with 0.125 inch bleed on all edges and fonts outlined or embedded. We also take packaged Illustrator, InDesign and Photoshop files, and Canva exports as long as they are print PDFs. If you have no artwork we set it here and quote the setup up front.",
      },
      {
        question: "What is the largest banner you can print?",
        answer:
          "Our roll printer runs material up to 54 inches wide, so a banner can be 54 inches by any length with no seam. Anything wider we print in panels and place the overlap where the artwork hides it.",
      },
      {
        question: "How much do lawn signs cost?",
        answer:
          "Coroplast lawn signs start at around $210 for ten, printed one side on 4mm board with H-stakes included. Double-sided and larger runs are quoted from the count. Confirm current pricing on the packages page or by phone.",
      },
      {
        question: "Do I need a full wrap or is lettering enough?",
        answer:
          "For most trades, cut vinyl lettering on the doors and tailgate does the job for a fraction of a wrap, and it is easier to change when your number does. Full-colour partial wraps make sense when the vehicle is the main advertising. We will tell you which suits the vehicle.",
      },
      {
        question: "Can you match the colours on my existing signs?",
        answer:
          "Yes. Send the original artwork or the Pantone references and we match to those. If all you have is the physical sign, bring it in — we match to the sample rather than guessing from a photo, because a phone camera shifts colour.",
      },
      {
        question: "Do you deliver across the GTA?",
        answer:
          "Yes. Delivery across the Greater Toronto Area is included in our package prices. Pickup from Mississauga is always available if you need it sooner.",
      },
    ],
  },

  {
    slug: "custom-apparel",
    number: "03",
    name: "Custom apparel",
    summary: "One shirt or five hundred, decorated on site.",
    capabilities: [
      "Embroidery and digitising",
      "DTF heat transfer, no minimums",
      "Screen printing",
      "T-shirts, hoodies, caps, polos",
      "Corporate uniforms and staff kits",
      "Reorders from stored artwork",
    ],
    spec: "No minimum on DTF · left chest to full back · in-house digitising",

    intro: [
      "We decorate apparel in Mississauga. Embroidery, DTF heat transfer and screen printing, all done on site, which is why we can take an order for one shirt and an order for five hundred in the same week.",
      "There is no minimum on DTF. One hoodie for a new hire is a real order, not a favour, and it costs what one hoodie costs.",
    ],
    sections: [
      {
        heading: "Embroidery",
        body: [
          "Embroidery suits polos, caps, jackets and anything a customer will see for years. It does not fade, it does not crack, and it survives industrial laundry — which is why hospitality and trades kit is almost always stitched rather than printed.",
          "We digitise in house. Digitising is the step where your logo is converted into stitch paths, and it is what separates a clean left chest from a puckered mess. A typical left chest at 3.5 to 4 inches wide runs 5,000 to 12,000 stitches. A full back at 10 to 12 inches can reach 30,000. We run up to 15 thread colours in a single design.",
          "Digitising is a one-time charge per logo. Once your file exists we keep it, so a reorder in eighteen months is stitched from the same file at the same size and does not cost the setup again.",
          "Standard placements are left chest, right chest, full back, cap front, sleeve and nape. Fine detail below about a quarter of an inch does not survive being stitched, so we simplify it and show you the proof before anything is sewn.",
        ],
      },
      {
        heading: "DTF heat transfer",
        body: [
          "Direct-to-film prints your artwork onto a film, powders it with adhesive, cures it and presses it into the garment. It handles full-colour photographs and gradients that screen printing cannot reach without a colour separation for every shade.",
          "There is no minimum. One piece is a real order. Maximum print area is 13 by 19 inches, which covers a full front, a full back and most sleeve prints.",
          "DTF works on cotton, polyester and blends, and on dark garments without a separate underbase. It is the right answer for small runs, for photographic artwork, and for anything where the design changes between pieces — names and numbers on a team set, for example.",
        ],
      },
      {
        heading: "Screen printing",
        body: [
          "Screen printing is the cheapest way to decorate volume. Each colour needs its own screen, so the setup costs money once and then almost nothing per piece — the more you order, the better it gets.",
          "Our minimum is 24 pieces per design, up to 6 spot colours. We print plastisol as standard for opacity on dark garments, and water-based when the customer wants a softer hand and lighter feel.",
          "Below 24 pieces DTF is almost always cheaper, and we will say so rather than take the screen fee.",
        ],
      },
      {
        heading: "Garments we carry",
        body: [
          "We stock and order Gildan, Bella+Canvas, Next Level, ATC and Port Authority. That covers a $12 event tee and a $60 retail-weight hoodie from the same order.",
          "T-shirts, long sleeves, hoodies, crewnecks, quarter-zips, polos, work shirts, caps, beanies, tote bags, aprons and hi-vis. Sizes generally run youth small to 5XL, though the range depends on the style and colour.",
          "If you already have garments, we decorate supplied stock. We do ask that they arrive clean and unworn, and we will not guarantee against a garment that shrinks in the press.",
        ],
      },
      {
        heading: "Artwork and turnaround",
        body: [
          "Vector artwork is best — .ai, .eps, .svg or a PDF with live vectors. For DTF a 300dpi PNG at the size it will print, with a transparent background, works well.",
          "Standard turnaround is seven to ten business days from proof approval and garment arrival. Rush is available and quoted per job, because it depends on whether the blanks are in the building.",
          "We proof everything before production. On embroidery you get a stitch-out or a digital proof showing placement and size; on prints you get a mockup on the actual garment colour. Nothing goes to production until you approve it in writing.",
        ],
      },
    ],
    catalogue: [
      {
        group: "Decoration",
        items: [
          { name: "Embroidery", detail: "Up to 15 thread colours, in-house digitising" },
          { name: "DTF heat transfer", detail: 'No minimum, full colour, up to 13×19"' },
          { name: "Screen printing", detail: "24-piece minimum, up to 6 colours" },
          { name: "Names and numbers", detail: "Team sets, individually numbered" },
          { name: "Supplied garments", detail: "We decorate stock you already own" },
          { name: "Stored artwork", detail: "Reorders stitched from the same file" },
        ],
      },
      {
        group: "Garments",
        items: [
          { name: "T-shirts", detail: "Gildan, Bella+Canvas, Next Level" },
          { name: "Hoodies and crewnecks", detail: "Event weight through retail weight" },
          { name: "Polos", detail: "Cotton, performance and pique" },
          { name: "Work shirts", detail: "Button-down and hi-vis" },
          { name: "Caps and beanies", detail: "Structured, unstructured, trucker" },
          { name: "Aprons and tote bags", detail: "Hospitality and retail" },
        ],
      },
    ],
    specs: [
      { label: "DTF minimum", value: "None — one piece is an order" },
      { label: "Screen print minimum", value: "24 pieces per design, up to 6 colours" },
      { label: "Max DTF print", value: '13 × 19 inches' },
      { label: "Thread colours", value: "Up to 15 in a single embroidered design" },
      { label: "Typical stitch count", value: "5,000–12,000 left chest, up to 30,000 full back" },
      { label: "Placements", value: "Left and right chest, full back, cap front, sleeve, nape" },
      { label: "Artwork", value: "Vector preferred; 300dpi PNG at print size for DTF" },
      { label: "Turnaround", value: "7–10 business days from proof and garment arrival" },
    ],
    faqs: [
      {
        question: "What is the minimum order for embroidery?",
        answer:
          "There is no piece minimum for embroidery, but there is a one-time digitising charge per logo to convert it into stitch paths. For a single polo, that setup is usually the larger part of the cost. Once the file exists, reorders have no setup at all.",
      },
      {
        question: "Do you have a minimum for custom t-shirts?",
        answer:
          "Not for DTF — one shirt is a real order. Screen printing starts at 24 pieces per design, because each colour needs its own screen. Below 24 pieces DTF is almost always cheaper and we will tell you so.",
      },
      {
        question: "How much does it cost to embroider a logo?",
        answer:
          "Digitising is a one-time charge of about $45 per logo. Embroidered polos start around $28 a piece including the garment. Larger designs and higher stitch counts cost more; confirm current rates on the packages page.",
      },
      {
        question: "How long does custom apparel take?",
        answer:
          "Seven to ten business days from proof approval, provided the garments are in the building. Rush is possible and quoted per job, since it depends on blank availability rather than on our press time.",
      },
      {
        question: "What is the difference between DTF and screen printing?",
        answer:
          "DTF prints full colour with no minimum and no per-colour setup, so it suits small runs and photographic artwork. Screen printing costs more to set up but far less per piece, so it wins on volume. The crossover is usually around 24 pieces.",
      },
      {
        question: "Can you print on shirts I already have?",
        answer:
          "Yes. Bring or ship your own garments and we decorate them. They need to arrive clean and unworn. We cannot guarantee against a garment that shrinks or scorches in the heat press, so for large runs we suggest supplying one to test first.",
      },
      {
        question: "Do you do staff uniforms for restaurants and trades?",
        answer:
          "Yes, that is most of what we run. Embroidered polos and hi-vis for trades, aprons and tees for hospitality, scrubs and jackets for clinics. We store your artwork so new hires get matching kit without a fresh setup charge.",
      },
      {
        question: "Where are you located?",
        answer:
          "We are at 2800 Skymark Ave in Mississauga, and we deliver across the GTA. Pickup is available whenever it is faster than shipping.",
      },
    ],
  },
  /**
   * ═════════════════════════════════════════════════════════════════════════
   * ⚠️  OWNER: THE FOIL NUMBERS BELOW ARE THE ONE SET NOT YET CONFIRMED.
   * ═════════════════════════════════════════════════════════════════════════
   *
   * Everything that overlaps the print service — 16pt C2S, 18pt uncoated,
   * 32pt painted edge, 0.125" bleed, PDF/X artwork — is carried over from
   * specs you have already reviewed, so those are safe.
   *
   * These are NOT, because foil has its own equipment and they were never
   * supplied. They are written to what a shop offering hot-foil stationery
   * would normally run. Read them as a checklist:
   *
   *   · the 250-piece minimum
   *   · the one-time die charge and who keeps the die
   *   · the 5×7" maximum stamp area
   *   · the foil colours actually stocked
   *   · the 5–7 day lead time and the 10-day letterpress figure
   *
   * Correct anything wrong here before this page is indexed — the FAQ schema
   * publishes it to Google as an answer the business is standing behind.
   * ═════════════════════════════════════════════════════════════════════════
   */
  {
    slug: "gold-foil-stationery",
    number: "04",
    name: "Gold foil",
    summary: "Hot-foil stamped cards, invitations and stationery, struck in-house.",
    capabilities: [
      "Hot foil stamping in gold, rose gold, silver and copper",
      "Blind deboss and letterpress",
      "Painted and foiled edges on 32pt stock",
      "Business cards, invitations and menus",
      "Certificates, folders and presentation covers",
      "Die making and artwork preparation",
    ],
    spec: "Real metal leaf · 250 minimum · dies kept on file",

    intro: [
      "Foil is the reason most people find us. A hot-foil stamped card is the one piece of print that still gets handled — someone turns it over, tilts it to the light, and keeps it. That is not a design opinion, it is what the reorder numbers say.",
      "This is stamping, not printing. A heated magnesium die presses a sheet of real metallic leaf into the stock under pressure, which is why the finish has depth you can feel with a thumbnail and why it cannot be reproduced on a digital press. Everything is struck at Skymark Ave, on the same floor as the business cards and the banners.",
    ],
    sections: [
      {
        heading: "What foil stamping actually is",
        body: [
          "A die is engraved with your artwork, mounted, and brought up to temperature. A roll of foil — a polyester carrier holding a micro-thin layer of metal and an adhesive — passes between the die and the sheet. The press closes, the heat releases the adhesive, and the pressure transfers the metal to the paper and nowhere else.",
          "Two things follow from that. The first is that foil is opaque: unlike ink, it sits on top of the stock rather than soaking into it, so gold on a black card reads as gold rather than as a muddy yellow. The second is that the die leaves an impression. On a 32pt sheet you can feel the artwork from the back, and that impression is half of what people are responding to when they say a card feels expensive.",
          "It also means foil has a fixed setup cost and a variable one. The die is made once. After that, every reorder of the same artwork is press time only, which is why the second run of a card costs meaningfully less than the first.",
        ],
      },
      {
        heading: "Stocks that take foil well",
        body: [
          "Foil needs a surface that will hold an impression. A 16pt C2S card takes a clean strike and is the most common choice for a straightforward foiled business card. An 18pt uncoated sheet takes a deeper impression and is what most people actually picture when they think of letterpress and foil work — the tooth of the paper is visible around the metal.",
          "The 32pt painted-edge stock is two 16pt sheets bonded with a colour running through the middle, cut so that colour shows as a line around the whole card. Paired with a foil stamp on the face it is the heaviest thing we make, and it is the one that gets kept in a wallet rather than a drawer.",
          "What does not take foil well is anything already coated in a heavy varnish or laminate. If a card is going to be soft-touch laminated and foiled, the foil goes on last, over the laminate — tell us at quote stage, because it changes the die and the order of operations.",
        ],
      },
      {
        heading: "Where the minimum comes from",
        body: [
          "Foil runs from 250 pieces. That is not a policy we picked; it is where the die and the make-ready stop dominating the cost. Below 250 you are paying mostly for setup, and we would rather tell you that than take the order.",
          "If you need fewer than 250 — twenty invitations, a handful of certificates — the honest answer is usually digital print with a metallic toner, which we also run and which costs a fraction of a foil setup. It is not the same finish and we will not pretend it is, but for a short run it is the right call and we will say so on the phone.",
          "Above 250 the per-piece cost falls quickly. A thousand foiled cards is not four times the price of two hundred and fifty, because the die is already made and the press is already set.",
        ],
      },
      {
        heading: "Artwork that stamps cleanly",
        body: [
          "Foil is a solid-or-nothing process. There is no such thing as a 40% tint of gold — the metal either transfers or it does not — so gradients, drop shadows and soft edges have to be redrawn as solid shapes before a die can be cut. We do that redraw as part of the job rather than sending your file back.",
          "Fine detail is where foil jobs go wrong. Hairlines below about 0.5pt and type below roughly 6pt tend to fill in or break up, because the heated foil spreads very slightly under pressure. A Didone typeface with hairline serifs — the sort of thing that looks best in foil — is exactly the case that needs checking before the die is made, and we will proof it at size rather than guess.",
          "Send vector artwork: PDF, AI or EPS with live vectors and fonts outlined. Everything else on this floor accepts 300dpi raster as a fallback; foil does not, because a die is cut from paths and a raster file has none.",
        ],
      },
      {
        heading: "Foil, deboss and letterpress together",
        body: [
          "The three processes use the same press and the same kind of die, which is why they are usually quoted together. A blind deboss is the die without the foil — the impression only, no colour, which reads as restraint rather than absence. Letterpress is the same idea with ink instead of metal, pressed into the sheet rather than laid onto it.",
          "The combination people ask for most is a foiled logo with the rest of the card blind debossed or letterpressed in a single colour. Because it is one pass per element, each one adds press time, and a three-process card takes about twice as long on the floor as a straight foil. Worth knowing when you are working back from a launch date.",
          "Edge painting is the fourth option and is done after trimming. It works on 32pt only, and it is the finish that makes a stack of cards look like a single object.",
        ],
      },
    ],
    catalogue: [
      {
        group: "Stationery",
        items: [
          { name: "Foiled business cards", detail: "16pt C2S, 18pt uncoated or 32pt painted edge" },
          { name: "Letterhead and compliment slips", detail: "Foiled crest or wordmark, matched to the card" },
          { name: "Invitations and save-the-dates", detail: "Single or double-sided, envelope printing available" },
          { name: "Menus and table cards", detail: "Foiled headings on uncoated stock" },
        ],
      },
      {
        group: "Presentation",
        items: [
          { name: "Certificates and awards", detail: "Foiled seal or border, blind deboss available" },
          { name: "Presentation folders", detail: "Foiled cover, printed interior" },
          { name: "Packaging sleeves and belly bands", detail: "Short-run, foiled on uncoated board" },
          { name: "Gift and loyalty cards", detail: "32pt with painted edges" },
        ],
      },
      {
        group: "Finishes",
        items: [
          { name: "Foil colours", detail: "Gold, rose gold, silver, copper, matte black, holographic" },
          { name: "Blind deboss", detail: "Impression only, no foil or ink" },
          { name: "Letterpress", detail: "One or two colours, pressed into uncoated stock" },
          { name: "Painted edges", detail: "32pt only, colour matched to the artwork" },
        ],
      },
    ],
    specs: [
      { label: "Process", value: "Hot foil stamping — heated die, real metallic leaf" },
      { label: "Minimum", value: "250 pieces per design" },
      { label: "Foil colours", value: "Gold, rose gold, silver, copper, matte black, holographic" },
      { label: "Stocks", value: "16pt C2S, 18pt uncoated, 32pt painted edge" },
      { label: "Maximum stamp area", value: "5 × 7 inches in a single strike" },
      { label: "Dies", value: "One-time charge, kept on file for reorders" },
      { label: "Artwork", value: 'Vector only — PDF, AI or EPS, fonts outlined, 0.125" bleed' },
      { label: "Turnaround", value: "5–7 business days from proof approval; 10 with letterpress" },
    ],
    faqs: [
      {
        question: "What is the minimum order for foil business cards?",
        answer:
          "250 pieces per design. Below that the die and press setup dominate the cost and you are mostly paying for make-ready rather than cards. For runs under 250 we will usually suggest digital print with metallic toner instead — a different finish, honestly described, at a fraction of the setup.",
      },
      {
        question: "How much does the die cost, and do I pay for it again?",
        answer:
          "The die is a one-time charge on the first run and it is quoted as its own line so you can see it. We keep it on file, so a reorder of the same artwork is press time and materials only. If your logo changes, the die changes.",
      },
      {
        question: "Can you foil a gradient or a photograph?",
        answer:
          "No. Foil either transfers or it does not, so there is no tint or gradient — a 40% gold does not exist. Artwork with gradients, shadows or soft edges gets redrawn as solid shapes before the die is cut, and we do that redraw as part of the job rather than sending the file back to you.",
      },
      {
        question: "What is the smallest text you can foil?",
        answer:
          "Around 6pt, and hairlines below about 0.5pt are the real limit. Heated foil spreads very slightly under pressure, so fine serifs can fill in. We proof fine artwork at actual size before cutting a die rather than finding out on the press.",
      },
      {
        question: "Can I have foil and soft-touch lamination on the same card?",
        answer:
          "Yes, and the order matters — the foil goes on after the laminate, not before. Tell us at quote stage so the job is planned that way, because it affects the die and adds a pass.",
      },
      {
        question: "What is the difference between foil, deboss and letterpress?",
        answer:
          "Same press, same kind of die. Foil transfers metallic leaf onto the sheet. A blind deboss is the impression with nothing in it. Letterpress presses ink into the sheet rather than laying it on top. They are frequently combined on one card, and each one is a separate pass, so a three-process card takes roughly twice as long on the floor.",
      },
      {
        question: "How long does a foil job take?",
        answer:
          "Five to seven business days from proof approval, which includes making the die. Add about three days if the job also includes letterpress. Reorders from an existing die are faster because that step is already done.",
      },
      {
        question: "Do you do painted edges?",
        answer:
          "On 32pt stock, yes. The card is two 16pt sheets bonded with a colour through the middle, and the edge is painted after trimming so the colour runs right around the card. Paired with a foil stamp it is the heaviest and most expensive thing we make, and the one people keep.",
      },
    ],
  },
];

/** The same four steps on every service page. It is a real sequence. */
export const serviceProcess: readonly ProcessStep[] = [
  {
    step: "01",
    title: "Quote",
    detail:
      "Tell us what you need — a photo of the old sign is enough to start. You get a written quote back within 24 hours on weekdays, with the specs written out so you can compare it to anyone else's.",
  },
  {
    step: "02",
    title: "Artwork",
    detail:
      "Send print-ready files and we use them as they are. Send a logo and a rough idea and we set it here, with the setup quoted up front rather than added at the end.",
  },
  {
    step: "03",
    title: "Proof approval",
    detail:
      "Nothing goes to production until you approve a proof in writing. On print that is a PDF at size; on apparel it is a mockup on the actual garment colour. Turnaround starts from this step, not from the deposit.",
  },
  {
    step: "04",
    title: "Production and delivery",
    detail:
      "We produce it here and deliver across the GTA, or hold it for pickup in Mississauga if that is faster. Your artwork stays on file, so the reorder skips straight to production.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
