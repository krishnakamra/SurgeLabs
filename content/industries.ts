export type Industry = {
  name: string;
  /** What this industry actually orders. Specific beats aspirational. */
  orders: string;
};

/**
 * Deliberately not an icon grid. Naming the exact thing a restaurant orders
 * does more selling than a plate emoji, and it puts real long-tail search
 * terms on the page.
 */
export const industries: readonly Industry[] = [
  { name: "Restaurants & cafés", orders: "Menus, window decals, staff tees, loyalty cards" },
  { name: "Trades & contractors", orders: "Truck lettering, lawn signs, hi-vis embroidery, invoices" },
  { name: "Clinics & dental", orders: "Intake forms, wayfinding, scrubs, appointment cards" },
  { name: "Real estate", orders: "For-sale riders, feature sheets, open-house A-frames" },
  { name: "Gyms & studios", orders: "Class schedules, wall graphics, branded hoodies, water bottles" },
  { name: "Salons & barbers", orders: "Price boards, mirror decals, capes and aprons, referral cards" },
  { name: "Retail & boutiques", orders: "Shopify builds, hang tags, tissue and bags, window vinyl" },
  { name: "Trade shows & events", orders: "Backdrops, feather flags, table throws, lanyards, badges" },
  { name: "Schools & nonprofits", orders: "Event banners, spirit wear, programs, donor signage" },
  { name: "Landscaping & seasonal", orders: "Coroplast lawn signs, magnetic truck panels, crew jackets" },
] as const;
