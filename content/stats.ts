export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  label: string;
  /** The sentence that makes the number checkable. Shown under the label. */
  basis: string;
};

/**
 * ⚠️  OWNER: READ BEFORE EDITING.
 *
 *     Every number here is TRUE BY CONSTRUCTION — it describes how the shop
 *     is set up, and anyone can verify it by reading the rest of the site or
 *     phoning the number in the footer. That is deliberate.
 *
 *     There are no client counts, review counts, "years of experience" or
 *     "projects delivered" figures, because none were supplied and inventing
 *     them is both dishonest and, for review counts specifically, a
 *     misrepresentation Google can penalise.
 *
 *     To add a real one, add an entry with a `basis` you would be comfortable
 *     being asked to prove. Good candidates once you have the records:
 *
 *       { value: 2018, label: "Serving the GTA since", basis: "Business registration date" }
 *       { value: 400,  suffix: "+", label: "Jobs run last year", basis: "Job tickets, Jan–Dec" }
 *
 *     Do NOT add a star rating or review count here. Those belong in review
 *     schema sourced from the actual Google Business Profile.
 */
export const stats: readonly Stat[] = [
  {
    value: 3,
    label: "Services under one roof",
    basis: "Web, print and apparel — all produced in-house",
  },
  {
    value: 1,
    label: "Invoice, one team",
    basis: "No subcontracting, no coordination on your side",
  },
  {
    value: 24,
    suffix: "h",
    label: "To a written quote",
    basis: "Weekdays, on anything we can spec from a brief",
  },
  {
    value: 0,
    label: "Minimum on DTF apparel",
    basis: "One shirt is a real order",
  },
];
