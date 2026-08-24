export type City = {
  slug: string;
  name: string;
  /** Shown on the city page and in the footer's title attribute. */
  region: string;
};

/**
 * The service-area matrix. Kept deliberately short: eight substantive city
 * pages rank; a hundred thin ones built from a template get filtered as
 * doorway pages, which now costs rankings rather than earning them.
 */
export const cities: readonly City[] = [
  { slug: "mississauga", name: "Mississauga", region: "Peel Region" },
  { slug: "brampton", name: "Brampton", region: "Peel Region" },
  { slug: "toronto", name: "Toronto", region: "Toronto" },
  { slug: "etobicoke", name: "Etobicoke", region: "Toronto" },
  { slug: "oakville", name: "Oakville", region: "Halton Region" },
  { slug: "burlington", name: "Burlington", region: "Halton Region" },
  { slug: "milton", name: "Milton", region: "Halton Region" },
  { slug: "vaughan", name: "Vaughan", region: "York Region" },
];
