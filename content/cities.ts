export type City = {
  slug: string;
  name: string;
  region: string;
  /** Drives "same service in nearby cities" links. Slugs, nearest first. */
  nearby: readonly string[];
};

/**
 * The full service area. A city appearing here does NOT create a page —
 * pages exist only where content/local-pages.ts carries written content for
 * that service and city. This list is the menu; that file is the order.
 */
export const cities: readonly City[] = [
  { slug: "mississauga", name: "Mississauga", region: "Peel Region", nearby: ["etobicoke", "brampton", "oakville", "toronto"] },
  { slug: "brampton", name: "Brampton", region: "Peel Region", nearby: ["mississauga", "caledon", "vaughan", "bolton"] },
  { slug: "etobicoke", name: "Etobicoke", region: "Toronto", nearby: ["mississauga", "toronto", "north-york", "woodbridge"] },
  { slug: "oakville", name: "Oakville", region: "Halton Region", nearby: ["burlington", "milton", "mississauga", "halton-hills"] },
  { slug: "milton", name: "Milton", region: "Halton Region", nearby: ["oakville", "halton-hills", "burlington", "mississauga"] },
  { slug: "toronto", name: "Toronto", region: "Toronto", nearby: ["etobicoke", "north-york", "scarborough", "mississauga"] },
  { slug: "vaughan", name: "Vaughan", region: "York Region", nearby: ["woodbridge", "north-york", "brampton", "markham"] },
  { slug: "burlington", name: "Burlington", region: "Halton Region", nearby: ["oakville", "milton", "halton-hills"] },
  { slug: "caledon", name: "Caledon", region: "Peel Region", nearby: ["brampton", "bolton", "halton-hills"] },
  { slug: "georgetown", name: "Georgetown", region: "Halton Hills", nearby: ["halton-hills", "milton", "brampton"] },
  { slug: "woodbridge", name: "Woodbridge", region: "Vaughan", nearby: ["vaughan", "etobicoke", "brampton", "north-york"] },
  { slug: "north-york", name: "North York", region: "Toronto", nearby: ["toronto", "vaughan", "etobicoke", "markham"] },
  { slug: "scarborough", name: "Scarborough", region: "Toronto", nearby: ["toronto", "markham", "north-york"] },
  { slug: "markham", name: "Markham", region: "York Region", nearby: ["scarborough", "north-york", "vaughan"] },
  { slug: "halton-hills", name: "Halton Hills", region: "Halton Region", nearby: ["georgetown", "milton", "caledon"] },
  { slug: "bolton", name: "Bolton", region: "Caledon", nearby: ["caledon", "brampton", "vaughan"] },
];

export function getCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
