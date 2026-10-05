/**
 * Every word on /free-homepage, in one file.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: NOTHING MAY BE ADDED HERE THAT IS NOT TRUE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This page carries no reviews, no ratings, no star counts, no client logos,
 * no "500+ projects" and no prices. That is deliberate and it is a standing
 * rule, not an oversight waiting to be filled in: the page is reached from a
 * paid ad by someone who has never heard of this business, and a number they
 * cannot check is worth less than a sentence they can.
 *
 * The headline, the subhead and the button label are the ad copy verbatim. If
 * the ad changes, these change with it — a landing page that says something
 * different from the ad that sold the click is the single most expensive
 * mistake available here, in bounce rate and in Google's landing-page
 * experience score, which prices every subsequent click.
 *
 * The six sites under "Real work" are real, live and ours. Each is labelled
 * with its own industry, taken from that site's own title tag — not described,
 * not praised, not given a result it did not report.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Step = { n: string; title: string; detail: string };
export type Benefit = { title: string; detail: string };
export type WorkItem = {
  slug: string;
  domain: string;
  /** The industry, as that site's own title tag states it. */
  industry: string;
  /** Alt text. Describes the screenshot, because that is what it is. */
  alt: string;
};
export type Faq = { question: string; answer: string };

export const freeHomepage = {
  /** The ad's headline, verbatim. */
  headline: "Your new homepage, designed free.",

  /** The ad's subhead, verbatim. */
  subhead:
    "Send us your business name. We'll design your new homepage — free. Love it? We build the rest. One payment, no monthly fees.",

  cta: "Get my free homepage",

  /** Sits directly under the button. Three things, all of them removals. */
  reassurance: "No card. No commitment. Usually ready in a couple of days.",

  problem: {
    eyebrow: "Why this matters",
    body: "Before anyone calls you, they look you up. If your site looks outdated or breaks on their phone, they call the next guy.",
  },

  steps: [
    {
      n: "01",
      title: "Send your business name",
      detail:
        "That is the whole first step. No brief to fill in, no deposit, no call booked before anything happens.",
    },
    {
      n: "02",
      title: "We design your new homepage, free",
      detail:
        "A real design for your business, not a template with your name dropped into it. You see it before you pay anything.",
    },
    {
      n: "03",
      title: "Love it? We build the rest",
      detail:
        "If it is not right, you walk away and it has cost you nothing. If it is, we build the rest of the site around it.",
    },
  ] satisfies Step[],

  /**
   * Live sites, screenshotted from the real thing — public/work/sites, captured
   * by scripts/capture-work.mjs. The industry on each one is lifted from that
   * site's own title tag so the label cannot drift into a claim.
   */
  work: [
    {
      slug: "solvexconstruction",
      domain: "solvexconstruction.ca",
      industry: "Waterproofing & foundation repair",
      alt: "The Solvex Construction homepage, shown on a laptop",
    },
    {
      slug: "grandarchitects",
      domain: "grandarchitects.ca",
      industry: "Architecture & builders",
      alt: "The Grand Architects & Builders homepage, shown on a laptop",
    },
    {
      slug: "areterenovation",
      domain: "areterenovation.ca",
      industry: "Home renovation",
      alt: "The Arete Renovation homepage, shown on a laptop",
    },
    {
      slug: "ccscleanings",
      domain: "ccscleanings.ca",
      industry: "Cleaning services",
      alt: "The Cunningham Cleaning Services homepage, shown on a laptop",
    },
    {
      slug: "guardianfirst",
      domain: "guardianfirst.ca",
      industry: "Damage restoration",
      alt: "The Guardian Restoration Services homepage, shown on a laptop",
    },
    {
      slug: "axellottetech",
      domain: "axellottetech.com",
      industry: "Custom 3D printing",
      alt: "The Axellotte Technology homepage, shown on a laptop",
    },
  ] satisfies WorkItem[],

  benefits: [
    {
      title: "A custom design, not a template",
      detail:
        "Drawn for your business and what it sells. Nobody else gets the same page with a different logo on it.",
    },
    {
      title: "Mobile-first and fast",
      detail:
        "Built for the phone first, because that is where almost everyone will see it, and built to load quickly on a bad connection.",
    },
    {
      title: "One payment, no monthly fees",
      detail: "You pay once for the site. There is no subscription and no plan to cancel.",
    },
    {
      title: "Business cards included",
      detail:
        "Printed in the same building as the site is built, so the card and the screen carry the same brand.",
    },
    {
      title: "A local team that answers the phone",
      detail:
        "We are in Mississauga. When you call, someone here picks up — not a ticket queue in another time zone.",
    },
    {
      title: "A quote within 24 hours",
      detail: "One business day, in writing, with what is included spelled out.",
    },
  ] satisfies Benefit[],

  faqs: [
    {
      question: "Is it really free?",
      answer:
        "Yes. We design your homepage and show it to you before you pay anything. No card, no deposit, no obligation — if you do not like it you walk away and it has cost you nothing. We do it because most people who like their homepage ask us to build the rest, and enough of them do that it pays for the ones who do not.",
    },
    {
      question: "How much is a full website?",
      answer:
        "It is quoted per job, after you have seen your homepage. A five-page site for a trade and a shop with four hundred products are not the same piece of work, and quoting them the same would mean one of you was being overcharged. You get the number in writing before anything is built, and it is one payment with no monthly fees.",
    },
    {
      question: "How long does it take?",
      answer:
        "The free homepage design is usually ready in a couple of days. The rest of the site depends on how big it is and how quickly we get your content, and we tell you the timeline with the quote rather than after you have agreed to it.",
    },
    {
      question: "Do I own my site?",
      answer:
        "Yes. You pay once and the site is yours — there is no subscription, nothing to cancel, and we are not holding it hostage to a monthly fee. If you want the specifics on the domain and the hosting for your setup, ask on the call and we will tell you straight.",
    },
    {
      question: "Do you do printing too?",
      answer:
        "Yes, in the same building. Business cards, flyers, signs, vehicle graphics and custom apparel are all produced in-house in Mississauga, which is why the cards can match the site exactly instead of approximately.",
    },
  ] satisfies Faq[],

  finalCta: {
    heading: "Send us your business name.",
    body: "We will design your new homepage and show it to you. If you do not like it, that is the end of it and it has cost you nothing.",
  },
} as const;
