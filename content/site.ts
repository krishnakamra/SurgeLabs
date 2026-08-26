/**
 * NAP — name, address, phone.
 *
 * ⚠️  OWNER: every field below must match the Google Business Profile
 *     CHARACTER FOR CHARACTER, including "Unit", "Suite", punctuation and
 *     the phone format. Inconsistent NAP across a site, GBP and directory
 *     listings is one of the few things that measurably suppresses local
 *     pack rankings. If GBP says "Unit 4" and this says "#4", fix this file.
 */
export const site = {
  name: "Surge Labs",
  legalName: "Surge Labs",
  url: "https://surgelabs.ca",
  phone: "905-598-3960",
  phoneHref: "tel:+19055983960",
  email: "hello@surgelabs.ca",

  address: {
    streetAddress: "2800 Skymark Ave",
    locality: "Mississauga",
    region: "ON",
    // ⚠️  Still needed: the postal code, and the unit/suite number if the
    //     Google Business Profile carries one. Deliberately not guessed —
    //     2800 Skymark Ave is a multi-tenant complex, so a wrong unit is
    //     worse than none. Copy both from GBP exactly.
    postalCode: "",
    country: "CA",
  },

  hours: [
    { days: "Monday to Friday", time: "9am – 6pm" },
    { days: "Saturday", time: "By appointment" },
    { days: "Sunday", time: "Closed" },
  ],

  /** Machine-readable hours for JSON-LD. Keep in sync with `hours` above. */
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
  ],

  serviceArea: "Mississauga and the Greater Toronto Area",

  /**
   * Approximate position of the shop, for drawing the service-area map on
   * /contact. Skymark Ave, to three decimal places — a few hundred metres.
   *
   * ⚠️  This is NOT the Google Business Profile pin and it is deliberately not
   *     published as one. lib/seo/schema.ts carries no `geo` node at all — a
   *     GeoCoordinates value is read as the exact position of the business,
   *     and an approximate one is a wrong answer published as a right one.
   *     Copy the real coordinates out of GBP before adding it there.
   */
  mapPin: { lat: 43.628, lng: -79.627 },

  /** Directions by street address, which is exact, rather than by a pin. */
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=2800+Skymark+Ave%2C+Mississauga%2C+ON",
} as const;
