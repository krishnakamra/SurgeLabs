export type City = {
  slug: string;
  name: string;
  region: string;
  /** Drives "same service in nearby cities" links. Slugs, nearest first. */
  nearby: readonly string[];
  /**
   * Approximate centre, in decimal degrees. Used to draw the service-area
   * map on /contact and for nothing else.
   *
   * These are public geography, not business claims — a municipal centroid
   * to two or three decimal places, which is a few hundred metres. They are
   * NOT precise enough to navigate by and nothing on the site invites anyone
   * to try: the map is a picture of where we deliver, and the directions
   * link hands Google the street address rather than a pair of numbers.
   */
  lat: number;
  lng: number;
};

/**
 * The full service area. A city appearing here does NOT create a page —
 * pages exist only where content/local-pages.ts carries written content for
 * that service and city. This list is the menu; that file is the order.
 */
export const cities: readonly City[] = [
  { slug: "mississauga", name: "Mississauga", region: "Peel Region", nearby: ["etobicoke", "brampton", "oakville", "toronto"], lat: 43.589, lng: -79.644 },
  { slug: "brampton", name: "Brampton", region: "Peel Region", nearby: ["mississauga", "caledon", "vaughan", "bolton"], lat: 43.732, lng: -79.762 },
  { slug: "etobicoke", name: "Etobicoke", region: "Toronto", nearby: ["mississauga", "toronto", "north-york", "woodbridge"], lat: 43.620, lng: -79.513 },
  { slug: "oakville", name: "Oakville", region: "Halton Region", nearby: ["burlington", "milton", "mississauga", "halton-hills"], lat: 43.468, lng: -79.688 },
  { slug: "milton", name: "Milton", region: "Halton Region", nearby: ["oakville", "halton-hills", "burlington", "mississauga"], lat: 43.518, lng: -79.877 },
  { slug: "toronto", name: "Toronto", region: "Toronto", nearby: ["etobicoke", "north-york", "scarborough", "mississauga"], lat: 43.653, lng: -79.383 },
  { slug: "vaughan", name: "Vaughan", region: "York Region", nearby: ["woodbridge", "north-york", "brampton", "markham"], lat: 43.836, lng: -79.498 },
  { slug: "burlington", name: "Burlington", region: "Halton Region", nearby: ["oakville", "milton", "halton-hills"], lat: 43.326, lng: -79.799 },
  { slug: "caledon", name: "Caledon", region: "Peel Region", nearby: ["brampton", "bolton", "halton-hills"], lat: 43.867, lng: -79.866 },
  { slug: "georgetown", name: "Georgetown", region: "Halton Hills", nearby: ["halton-hills", "milton", "brampton"], lat: 43.649, lng: -79.919 },
  { slug: "woodbridge", name: "Woodbridge", region: "Vaughan", nearby: ["vaughan", "etobicoke", "brampton", "north-york"], lat: 43.776, lng: -79.597 },
  { slug: "north-york", name: "North York", region: "Toronto", nearby: ["toronto", "vaughan", "etobicoke", "markham"], lat: 43.762, lng: -79.411 },
  { slug: "scarborough", name: "Scarborough", region: "Toronto", nearby: ["toronto", "markham", "north-york"], lat: 43.776, lng: -79.232 },
  { slug: "markham", name: "Markham", region: "York Region", nearby: ["scarborough", "north-york", "vaughan"], lat: 43.857, lng: -79.337 },
  { slug: "halton-hills", name: "Halton Hills", region: "Halton Region", nearby: ["georgetown", "milton", "caledon"], lat: 43.630, lng: -79.998 },
  { slug: "bolton", name: "Bolton", region: "Caledon", nearby: ["caledon", "brampton", "vaughan"], lat: 43.877, lng: -79.737 },
];

export function getCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
