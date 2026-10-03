/**
 * The paid-traffic offers. /start sells the $99 cards; /web-design-seo
 * carries the free-homepage offer that the Google Ads campaign points at.
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

import { torontoInstant, torontoWall } from "@/lib/time/toronto";

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
  headline: "1,000 designed business cards for $99.",
  sub: "We lay the card out for you and print a thousand of them. That is the whole thing — no subscription, no design fee on top, delivered across the GTA.",
  price: 99,
  priceNote: "One-time, in Canadian dollars. Delivery across the GTA included.",

  gets: [
    "We design the card — two versions to choose from",
    "One round of changes after you have seen it",
    "1,000 cards, 16pt matte, printed both sides",
    "A full-size proof to approve before anything prints",
    "The print-ready file, yours to keep and reorder from",
    "Delivered anywhere in the GTA, or collect in Mississauga",
  ],

  notIncluded: [
    "A logo, if you do not have one. Logo design starts at $199, and redrawing an old one properly starts at $45.",
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
        "That is normal and it does not stop us. We can set a clean typographic card from your business name for the same $99, or draw you a proper logo from $199. If you have an old logo that only exists as a JPG, we redraw it as a vector file from $45 and it prints properly forever after.",
    },
    {
      question: "How fast can I have them?",
      answer:
        "Three to five business days from the moment you approve the proof. If your artwork is already print-ready and approved before 11am on a weekday, 16pt cards can go the same day.",
    },
    {
      question: "Is $99 really the whole price?",
      answer:
        "Yes, for the design, 1,000 cards on 16pt matte printed both sides, and delivery across the GTA. It is priced low on purpose to win a first job, and it is the one fixed price we publish — everything else on our site is a starting price. Foil, painted edges and spot UV cost more and we tell you what before you commit.",
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

/* ═══════════════════════════════════════════════════════════════════════════
   THE WEB OFFER — what Google Ads is pointing at.
   ═══════════════════════════════════════════════════════════════════════════

   The ad says "Free homepage design. Send us your business name and see your
   new homepage before you pay." The first screen of /web-design-seo now says
   exactly that, because a landing page that does not repeat the ad's promise
   in its first sentence is where the click gets spent and nothing happens.

   ⚠️  OWNER — THE TWO NUMBERS BELOW ARE PROMISES, NOT COPY.

   `slotsPerMonth` is a real commitment. It is the honest version of the
   urgency you asked for: there is a limit because designing a homepage for
   free costs you a morning, and a limit you actually keep is both true and
   more persuasive than a fake one. If you will in fact do twelve, set twelve.
   If you will do as many as come in, set it to null and the scarcity line
   disappears — the page still works.

   `cadence: "monthly"` means the batch GENUINELY closes at the end of each
   calendar month and the next one opens. That is what makes the countdown
   legitimate: it is the same deadline for every visitor, it is not reset per
   session, it does not restart when someone reloads, and it is a date anyone
   can check against a calendar.

   What is NOT here, deliberately: a per-visitor timer that starts at 15:00
   when the page loads, a "4 people are viewing this", and a stock counter
   that ticks down on its own. Those are the things that get a Google Ads
   account suspended under the Misrepresentation policy — which costs you the
   campaign, not just the page — and they are a deceptive practice under the
   Competition Act on top of it. The urgency below is real and it still bites.
   ═══════════════════════════════════════════════════════════════════════════ */

export type WebOffer = {
  eyebrow: string;
  /** Says what the ad says. Change the ad and change this in the same hour. */
  headline: string;
  sub: string;
  /** What they get for nothing, before any money changes hands. */
  gets: readonly string[];
  /** The catch, stated first. There is always one and hiding it loses the job. */
  theCatch: string;
  reassurance: readonly string[];
  /**
   * How many free homepage designs are done per batch, or null for no limit.
   * A REAL number you will keep. See the block above.
   */
  slotsPerMonth: number | null;
  /** "monthly" runs a real batch that closes at month end. null = no deadline. */
  cadence: "monthly" | null;
  faqs: readonly OfferFaq[];
};

export const webOffer: WebOffer = {
  eyebrow: "Mississauga · web design",
  headline: "Free homepage design.",
  sub: "Send us your business name and see your new homepage before you pay anything. If you do not like it, you walk away and it has cost you nothing.",

  gets: [
    "A real homepage designed for your business, not a template with your name dropped in",
    "Your actual colours, your logo, your services on the page",
    "Shown to you as a working page you can open on your phone",
    "A written price for the rest of the site, once you have seen it",
    "No deposit, no card, no call required to get it",
  ],

  theCatch:
    "There isn't much of one, and here is the whole of it: we design the homepage free because most people who like it ask us to build the rest. If you take the design and go elsewhere, that is genuinely fine — but we only do a limited number each month, so we ask that you are actually thinking about a new site.",

  reassurance: [
    "No deposit and no card to see the design.",
    "You own the code, the domain, the hosting and the analytics. Always.",
    "We answer the phone ourselves — there is no queue and no menu.",
    "Built at 2800 Skymark Ave in Mississauga. You can come and sit with us.",
  ],

  // ⚠️  A REAL COMMITMENT. Set it to what you will actually honour, or null.
  slotsPerMonth: 10,
  // ⚠️  Set to null the moment you stop running this as a monthly batch.
  cadence: "monthly",

  faqs: [
    {
      question: "What is the catch with a free homepage design?",
      answer:
        "That we hope you like it enough to have us build the rest of the site. You are under no obligation and there is no deposit. We do a limited number each month because each one is a real morning of design work, not a template.",
    },
    {
      question: "How long until I see it?",
      answer:
        "Two to three business days from the moment we have your business name and a rough idea of what you do. We will call you once to ask a handful of questions, and that call is normally under ten minutes.",
    },
    {
      question: "What does the full site cost?",
      answer:
        "It is quoted per job, because a five-page site for a trade and a Shopify store with 400 products are not the same piece of work. You get the real number in writing within one business day — after you have seen the homepage, not before.",
    },
    {
      question: "Do I own the site?",
      answer:
        "Yes, all of it: the domain, the hosting, the code and the analytics stay in your name. We do not hold anything hostage, and moving away from us never costs you the site.",
    },
  ],
};

/**
 * The end of the current batch, or null when no batch is running.
 *
 * End of the calendar month in Toronto. Real, identical for every visitor,
 * and it cannot silently become a lie — when the month turns over, the next
 * one genuinely has opened.
 */
export function webOfferDeadline(now = new Date()): Date | null {
  if (webOffer.cadence !== "monthly") return null;
  const wall = torontoWall(now);
  // Day 0 of next month is the last day of this one.
  const lastDay = new Date(Date.UTC(wall.year, wall.month, 0)).getUTCDate();
  return torontoInstant(wall.year, wall.month, lastDay, 23, 59);
}
