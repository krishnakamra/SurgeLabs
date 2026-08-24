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
} as const;
