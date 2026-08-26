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
 *     Keep the LABELS in plain words. "Services under one roof" was the old
 *     first line and it told a reader nothing they did not already suspect;
 *     "Things we make here" says the same thing in words people use.
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
    value: 5,
    label: "Things we make here",
    basis: "Websites, print, signs, shirts and design — same building, same people",
  },
  {
    value: 1,
    label: "Bill, however much you order",
    basis: "Nothing is sent out to another shop, so nothing arrives on a separate invoice",
  },
  {
    value: 24,
    suffix: "h",
    label: "To get a price in writing",
    basis: "Weekdays, on anything we can price from your description",
  },
  {
    value: 0,
    label: "Minimum on printed shirts",
    basis: "One shirt is a real order. Stitched shirts have no minimum either",
  },
];
