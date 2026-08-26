export type QuoteOption = { value: string; label: string; hint?: string };

/**
 * `ticket` is the short label used on the job ticket. The question wording is
 * for the person answering it; the docket wants a spec code, and a full
 * question wraps onto two lines and stops the sheet reading like a ticket.
 */
export type QuoteField =
  | { kind: "choice"; id: string; label: string; ticket: string; options: readonly QuoteOption[]; multi?: boolean; required?: boolean }
  | { kind: "text"; id: string; label: string; ticket: string; placeholder?: string; required?: boolean }
  | { kind: "textarea"; id: string; label: string; ticket: string; placeholder?: string };

/** One selectable need, and the spec questions it opens up. */
export type QuoteBranch = {
  id: string;
  label: string;
  hint: string;
  /** Row label on the job ticket. */
  ticket: string;
  fields: readonly QuoteField[];
};

/**
 * Step 2 mirrors a real job ticket: the questions a shop actually has to
 * answer before it can quote. Someone who has ordered print before recognises
 * them, and someone who has not learns what matters by answering them.
 */
export const quoteBranches: readonly QuoteBranch[] = [
  {
    id: "website",
    label: "Website",
    hint: "New build, rebuild or a store",
    ticket: "WEB",
    fields: [
      {
        kind: "choice",
        id: "web_type", ticket: "TYPE",
        label: "What kind of site?",
        required: true,
        options: [
          { value: "New build", label: "New build", hint: "Nothing exists yet" },
          { value: "Rebuild", label: "Rebuild", hint: "Replacing what you have" },
          { value: "Online store", label: "Online store", hint: "Shopify" },
          { value: "Fixes only", label: "Fixes only", hint: "Speed, mobile, security" },
        ],
      },
      {
        kind: "choice",
        id: "web_pages", ticket: "PAGES",
        label: "Roughly how many pages?",
        options: [
          { value: "1–5", label: "1–5" },
          { value: "6–15", label: "6–15" },
          { value: "16+", label: "16+" },
          { value: "Not sure", label: "Not sure yet" },
        ],
      },
      {
        kind: "choice",
        id: "web_content", ticket: "COPY",
        label: "Who writes the copy?",
        options: [
          { value: "I have it", label: "I have it" },
          { value: "Write it for me", label: "Write it for me" },
          { value: "Mix of both", label: "Mix of both" },
        ],
      },
      { kind: "text", id: "web_url", ticket: "CURRENT SITE", label: "Current site, if any", placeholder: "surgelabs.ca" },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    hint: "Local and technical search",
    ticket: "SEO",
    fields: [
      {
        kind: "choice",
        id: "seo_locations", ticket: "LOCATIONS",
        label: "How many locations?",
        required: true,
        options: [
          { value: "One", label: "One" },
          { value: "Two or three", label: "Two or three" },
          { value: "Four or more", label: "Four or more" },
          { value: "Service area, no storefront", label: "Service area, no storefront" },
        ],
      },
      {
        kind: "choice",
        id: "seo_profile", ticket: "PROFILE",
        label: "Google Business Profile?",
        options: [
          { value: "Verified and active", label: "Verified and active" },
          { value: "Exists, neglected", label: "Exists, neglected" },
          { value: "Not set up", label: "Not set up" },
          { value: "Suspended", label: "Suspended" },
        ],
      },
      { kind: "text", id: "seo_url", ticket: "SITE", label: "Site to work on", placeholder: "surgelabs.ca" },
      { kind: "text", id: "seo_terms", ticket: "TERMS", label: "Terms you want to rank for", placeholder: "printing mississauga" },
    ],
  },
  {
    id: "print",
    label: "Print",
    hint: "Cards, flyers, brochures, forms",
    ticket: "PRINT",
    fields: [
      {
        kind: "choice",
        id: "print_item", ticket: "ITEM",
        label: "What are we printing?",
        required: true,
        options: [
          { value: "Business cards", label: "Business cards" },
          { value: "Flyers", label: "Flyers" },
          { value: "Postcards", label: "Postcards" },
          { value: "Brochures", label: "Brochures" },
          { value: "Presentation folders", label: "Folders" },
          { value: "NCR forms", label: "NCR forms" },
          { value: "Stickers or labels", label: "Stickers / labels" },
          { value: "Something else", label: "Something else" },
        ],
      },
      {
        kind: "choice",
        id: "print_size", ticket: "SIZE",
        label: "Finished size",
        options: [
          { value: '3.5 × 2"', label: '3.5 × 2"', hint: "Standard card" },
          { value: '4 × 6"', label: '4 × 6"' },
          { value: '8.5 × 11"', label: '8.5 × 11"' },
          { value: '11 × 17"', label: '11 × 17"' },
          { value: "Custom", label: "Custom" },
        ],
      },
      {
        kind: "choice",
        id: "print_stock", ticket: "STOCK",
        label: "Stock",
        options: [
          { value: "16pt coated", label: "16pt coated", hint: "The standard" },
          { value: "18pt uncoated", label: "18pt uncoated", hint: "Takes a pen" },
          { value: "32pt painted edge", label: "32pt painted edge" },
          { value: "100lb gloss text", label: "100lb gloss text" },
          { value: "80lb matte text", label: "80lb matte text" },
          { value: "Not sure", label: "Not sure — advise me" },
        ],
      },
      {
        kind: "choice",
        id: "print_sides", ticket: "SIDES",
        label: "Sides",
        options: [
          { value: "One side", label: "One side" },
          { value: "Both sides", label: "Both sides" },
        ],
      },
      {
        kind: "choice",
        id: "print_finish", ticket: "FINISH",
        label: "Finish",
        multi: true,
        options: [
          { value: "None", label: "None" },
          { value: "Gloss lamination", label: "Gloss" },
          { value: "Matte lamination", label: "Matte" },
          { value: "Soft-touch", label: "Soft-touch" },
          { value: "Spot UV", label: "Spot UV" },
          { value: "Foil", label: "Foil" },
          { value: "Rounded corners", label: "Rounded corners" },
        ],
      },
      {
        kind: "choice",
        id: "print_quantity", ticket: "QTY",
        label: "Quantity",
        required: true,
        options: [
          { value: "250", label: "250" },
          { value: "500", label: "500" },
          { value: "1,000", label: "1,000" },
          { value: "2,500", label: "2,500" },
          { value: "5,000+", label: "5,000+" },
        ],
      },
    ],
  },
  {
    id: "signage",
    label: "Signage",
    hint: "Banners, lawn signs, windows, vehicles",
    ticket: "SIGN",
    fields: [
      {
        kind: "choice",
        id: "sign_type", ticket: "TYPE",
        label: "What kind of sign?",
        required: true,
        options: [
          { value: "Vinyl banner", label: "Vinyl banner" },
          { value: "Mesh banner", label: "Mesh banner", hint: "For fences" },
          { value: "Coroplast lawn signs", label: "Lawn signs" },
          { value: "A-frame", label: "A-frame" },
          { value: "Window vinyl", label: "Window vinyl" },
          { value: "Vehicle lettering", label: "Vehicle lettering" },
          { value: "Feather flag", label: "Feather flag" },
          { value: "Trade show kit", label: "Trade show kit" },
        ],
      },
      { kind: "text", id: "sign_size", ticket: "SIZE", label: "Size", placeholder: '3 × 6 ft, or 18 × 24"', required: true },
      {
        kind: "choice",
        id: "sign_sides", ticket: "SIDES",
        label: "Sides",
        options: [
          { value: "One side", label: "One side" },
          { value: "Both sides", label: "Both sides" },
        ],
      },
      {
        kind: "choice",
        id: "sign_quantity", ticket: "QTY",
        label: "How many?",
        required: true,
        options: [
          { value: "1", label: "1" },
          { value: "2–5", label: "2–5" },
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50+", label: "50+" },
        ],
      },
      {
        kind: "choice",
        id: "sign_install", ticket: "INSTALL",
        label: "Installation?",
        options: [
          { value: "Supply only", label: "Supply only" },
          { value: "Need it installed", label: "Need it installed" },
          { value: "Not sure", label: "Not sure" },
        ],
      },
    ],
  },
  {
    id: "apparel",
    label: "Apparel",
    hint: "Embroidery, DTF, screen printing",
    ticket: "WEAR",
    fields: [
      {
        kind: "choice",
        id: "wear_garment", ticket: "GARMENT",
        label: "Garment",
        required: true,
        options: [
          { value: "T-shirts", label: "T-shirts" },
          { value: "Hoodies", label: "Hoodies" },
          { value: "Polos", label: "Polos" },
          { value: "Caps", label: "Caps" },
          { value: "Hi-vis", label: "Hi-vis" },
          { value: "Aprons", label: "Aprons" },
          { value: "Supplying my own", label: "Supplying my own" },
        ],
      },
      {
        kind: "choice",
        id: "wear_method", ticket: "METHOD",
        label: "Decoration",
        options: [
          { value: "Embroidery", label: "Embroidery", hint: "Survives hot washes" },
          { value: "DTF transfer", label: "DTF", hint: "No minimum, full colour" },
          { value: "Screen printing", label: "Screen print", hint: "From 24 pieces" },
          { value: "Not sure", label: "Not sure — advise me" },
        ],
      },
      {
        kind: "choice",
        id: "wear_placement", ticket: "PLACEMENT",
        label: "Placement",
        multi: true,
        options: [
          { value: "Left chest", label: "Left chest" },
          { value: "Full front", label: "Full front" },
          { value: "Full back", label: "Full back" },
          { value: "Sleeve", label: "Sleeve" },
          { value: "Cap front", label: "Cap front" },
        ],
      },
      {
        kind: "choice",
        id: "wear_quantity", ticket: "QTY",
        label: "How many pieces?",
        required: true,
        options: [
          { value: "1–5", label: "1–5" },
          { value: "6–23", label: "6–23" },
          { value: "24–49", label: "24–49" },
          { value: "50–99", label: "50–99" },
          { value: "100+", label: "100+" },
        ],
      },
      { kind: "text", id: "wear_sizes", ticket: "SIZES", label: "Size breakdown, if known", placeholder: "5 S, 10 M, 8 L, 2 XL" },
    ],
  },

  {
    id: "design",
    label: "Design",
    hint: "A logo, a brand kit or artwork",
    ticket: "DSGN",
    fields: [
      {
        kind: "choice",
        id: "design_type", ticket: "TYPE",
        label: "What do you need designed?",
        required: true,
        multi: true,
        options: [
          { value: "New logo", label: "A new logo", hint: "Starting from nothing" },
          { value: "Logo redraw", label: "Redraw my logo", hint: "I only have a JPG" },
          { value: "Brand kit", label: "Brand kit", hint: "Colours, fonts and rules written down" },
          { value: "Print layout", label: "Print layout", hint: "Card, flyer, menu, sign" },
          { value: "Screen artwork", label: "Screen artwork", hint: "Social, email, slides" },
        ],
      },
      {
        kind: "choice",
        id: "design_have", ticket: "HAVE",
        label: "What artwork do you already have?",
        options: [
          { value: "Vector logo", label: "A vector logo", hint: ".ai, .eps, .svg or a live-vector PDF" },
          { value: "JPG or PNG only", label: "A JPG or PNG only" },
          { value: "A photo of a sign or card", label: "A photo of an old sign or card" },
          { value: "Nothing", label: "Nothing yet" },
        ],
      },
      {
        kind: "choice",
        id: "design_use", ticket: "USE",
        label: "Where will it be used?",
        multi: true,
        options: [
          { value: "Print", label: "Print", hint: "Cards, flyers, menus" },
          { value: "Signage", label: "Signage", hint: "Banners, storefront, vehicles" },
          { value: "Apparel", label: "Apparel", hint: "Stitched or printed on garments" },
          { value: "Website and social", label: "Website and social" },
        ],
      },
      { kind: "textarea", id: "design_notes", ticket: "NOTES", label: "Anything you like or want to avoid?", placeholder: "Two competitors whose look you like is more useful than a paragraph." },
    ],
  },
];

export const deadlineOptions: readonly QuoteOption[] = [
  { value: "Rush — need it in days", label: "Rush", hint: "Days, not weeks" },
  { value: "Within two weeks", label: "Within 2 weeks" },
  { value: "Two to four weeks", label: "2–4 weeks" },
  { value: "Over a month", label: "Over a month" },
  { value: "No fixed date", label: "No fixed date" },
];

export const budgetOptions: readonly QuoteOption[] = [
  { value: "Under $500", label: "Under $500" },
  { value: "$500 – $1,500", label: "$500 – $1,500" },
  { value: "$1,500 – $3,500", label: "$1,500 – $3,500" },
  { value: "$3,500 – $7,500", label: "$3,500 – $7,500" },
  { value: "Over $7,500", label: "Over $7,500" },
  { value: "Tell me what it costs", label: "Tell me what it costs" },
];

export function getBranch(id: string): QuoteBranch | undefined {
  return quoteBranches.find((branch) => branch.id === id);
}
