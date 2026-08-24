export type Service = {
  slug: string;
  number: string;
  name: string;
  /** One line, plain. What this actually is. */
  summary: string;
  /** Real capabilities, not benefits. These are what people search for. */
  capabilities: readonly string[];
  /** One honest production spec. The thing a competitor's site won't print. */
  spec: string;
  /** Panel media. Higgsfield loop lands here in a later pass. */
  media?: { src: string; poster: string };
};

export const services: readonly Service[] = [
  {
    slug: "web-digital",
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
  },
  {
    slug: "print-signage",
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
  },
];
