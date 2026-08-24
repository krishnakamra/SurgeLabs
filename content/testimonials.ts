export type Testimonial = {
  quote: string;
  name: string;
  business: string;
  /** What they actually bought. Grounds the quote. */
  work: string;
};

/**
 * ⚠️  OWNER: REAL, ATTRIBUTED REVIEWS ONLY.
 *
 *     This array is intentionally empty. The testimonials section does not
 *     render at all while it is empty — no placeholder cards, no "coming
 *     soon", no invented quotes.
 *
 *     Add entries only with the customer's knowledge and a real name and
 *     business. Copying a Google review verbatim is fine; making one up is
 *     fabricating an endorsement, which is illegal advertising in Canada
 *     under the Competition Act, not merely a style problem.
 */
export const testimonials: readonly Testimonial[] = [];
