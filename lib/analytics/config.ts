/**
 * Analytics configuration.
 *
 * The pixel id is a public identifier — it ships in the page source by
 * definition — so it lives here rather than in a secret. It is still readable
 * from the environment so a staging deploy can point at a different pixel, or
 * set the variable empty to switch tracking off without a code change.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "4738023989799471";

/**
 * Tracking is production-only.
 *
 * Every `next dev` reload and every local run of the audit scripts would
 * otherwise land in the same reporting the business makes decisions from.
 * Conversion numbers polluted by developer traffic are worse than no numbers,
 * because they look real.
 */
export const analyticsEnabled =
  process.env.NODE_ENV === "production" && META_PIXEL_ID.length > 0;
