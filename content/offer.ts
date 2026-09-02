/**
 * The paid-traffic offer behind /start.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: THE ONE RULE ON THIS FILE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `endsOn` is a REAL DATE OR IT IS NULL. There is no third option.
 *
 * A deadline that passes and gets quietly pushed forward is the single most
 * common thing on a landing page and it is a deceptive marketing practice
 * under the Competition Act — not a grey area, a named one. It is also
 * against Meta's own advertising policies, so the ad account is at risk
 * before the regulator is.
 *
 * The page is built so that lying is inconvenient rather than easy:
 *
 *   · `endsOn: null` → no countdown renders at all. The page still converts.
 *   · a date in the future → the countdown renders and is true.
 *   · a date in the PAST  → the countdown disappears by itself. It does not
 *     roll over, and the build does not fail at an unpredictable moment. It
 *     simply stops making the claim.
 *
 * If you want standing urgency that is true every single day and never needs
 * maintaining, you already have it and the page uses it: artwork approved
 * before 11am on a weekday goes to press that day. That deadline is real, it
 * resets every morning, and nobody has to remember to change it.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type OfferFaq = { question: string; answer: string };

export type Offer = {
  /** Small line above the headline. */
  eyebrow: string;
  headline: string;
  /** One sentence under the headline. Plain. */
  sub: string;
  price: number;
  priceNote: string;
  /** What they get, in the customer's words. Four to six lines. */
  gets: readonly string[];
  /** What it does not cover. Named up front, not at invoice time. */
  notIncluded: readonly string[];
  /** Why it is safe to hand over a phone number. */
  reassurance: readonly string[];
  faqs: readonly OfferFaq[];
  /**
   * The real last day of the offer as YYYY-MM-DD in Toronto time, or null.
   * READ THE BLOCK AT THE TOP OF THIS FILE BEFORE SETTING IT.
   */
  endsOn: string | null;
};

export const offer: Offer = {
  eyebrow: "Mississauga · one shop, one bill",
  headline: "Designed business cards, in your hand next week.",
  sub: "We lay the card out for you and print 250 of them for $99. That is the whole thing — no subscription, no design fee on top.",
  price: 99,
  priceNote: "One-time, in Canadian dollars. Delivery across the GTA included.",

  gets: [
    "We design the card — two versions to choose from",
    "One round of changes after you have seen it",
    "250 cards, 16pt matte, printed both sides",
    "A full-size proof to approve before anything prints",
    "The print-ready file, yours to keep and reorder from",
    "Delivered anywhere in the GTA, or collect in Mississauga",
  ],

  notIncluded: [
    "A logo, if you do not have one. Logo design is $349, and redrawing an old one properly is $75.",
    "Foil, painted edges or spot UV. We quote those on top — call and we will price them.",
  ],

  reassurance: [
    "Nothing prints until you approve a proof in writing.",
    "No deposit to get a price. You only pay once you have said yes to the artwork.",
    "We answer the phone ourselves. There is no queue and no menu.",
    "Made at 2800 Skymark Ave in Mississauga — you can come and look at the stock.",
  ],

  faqs: [
    {
      question: "What if I do not have a logo?",
      answer:
        "That is normal and it does not stop us. We can set a clean typographic card from your business name for the same $99, or draw you a proper logo for $349. If you have an old logo that only exists as a JPG, we redraw it as a vector file for $75 and it prints properly forever after.",
    },
    {
      question: "How fast can I have them?",
      answer:
        "Three to five business days from the moment you approve the proof. If your artwork is already print-ready and approved before 11am on a weekday, 16pt cards can go the same day.",
    },
    {
      question: "Is $99 really the whole price?",
      answer:
        "Yes, for the design, 250 cards on 16pt matte printed both sides, and delivery across the GTA. It is priced low on purpose to win a first job. Foil, painted edges and spot UV cost more and we tell you what before you commit.",
    },
    {
      question: "What happens after I send my number?",
      answer:
        "One of us calls you, usually the same day and always within one business day. We ask what your business is called, what you want on the card, and where to send them. That call is normally under five minutes.",
    },
  ],

  // Null. No campaign end date has been set, so no countdown is claimed.
  // Set a real date here when you decide one — and read the block at the top
  // of this file first.
  endsOn: null,
};

/** True while the offer's own deadline is still ahead of us. */
export function offerDeadline(now = new Date()): Date | null {
  if (!offer.endsOn) return null;
  // End of that day, Toronto. A date-only deadline that expires at midnight
  // UTC would cut the last afternoon off in Ontario.
  const end = new Date(`${offer.endsOn}T23:59:59-05:00`);
  if (Number.isNaN(end.getTime()) || end.getTime() <= now.getTime()) return null;
  return end;
}
