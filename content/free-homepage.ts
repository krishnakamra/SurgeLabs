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
export type Benefit = { title: string };
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

  /**
   * The problem line, word for word from the brief, split only so it can be
   * set in three weights: the setup quiet, the turn plain, the consequence in
   * the accent. Joined with spaces it is the original sentence exactly — the
   * page renders `[lead, turn, sting].join(" ")` as its accessible text.
   */
  problem: {
    eyebrow: "Why this matters",
    lead: "Before anyone calls you, they look you up.",
    turn: "If your site looks outdated or breaks on their phone,",
    sting: "they call the next guy.",
  },

  steps: [
    {
      n: "01",
      title: "Send your business name",
      detail: "That's all we need to start. No card. No commitment.",
    },
    {
      n: "02",
      title: "We design your new homepage, free",
      detail: "A custom design, not a template — and you see it before you pay.",
    },
    {
      n: "03",
      title: "Love it? We build the rest",
      detail: "One payment, no monthly fees.",
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

  /**
   * The six items exactly as the owner listed them. Titles only: the
   * supporting sentence that used to sit under each was written here, not
   * given, and several of them were claims ("almost everyone", "the same
   * building", "one business day" where the brief says 24 hours).
   */
  benefits: [
    { title: "A custom design, not a template" },
    { title: "Mobile-first and fast" },
    { title: "One payment, no monthly fees" },
    { title: "Business cards included" },
    { title: "A local Mississauga team that answers the phone" },
    { title: "A quote within 24 hours" },
  ] satisfies Benefit[],

  /**
   * Answers built only from the brief and the ad. "Do I own my site?" is the
   * one the brief asked but did not answer — it says only what the offer
   * already promises and sends the rest to a call. OWNER: replace it with
   * the real answer.
   */
  faqs: [
    {
      question: "Is it really free?",
      answer:
        "Yes. Send us your business name and we design your new homepage free — you see it before you pay anything. No card. No commitment.",
    },
    {
      question: "How much is a full website?",
      answer:
        "It's quoted per job, after you've seen your homepage. One payment, no monthly fees.",
    },
    {
      question: "How long does it take?",
      answer:
        "Your free homepage design is usually ready in a couple of days, and you get a quote within 24 hours.",
    },
    {
      question: "Do I own my site?",
      answer:
        "It's one payment with no monthly fees. Call us on 905-598-3960 and we'll go through exactly what you get.",
    },
    {
      question: "Do you do printing too?",
      answer:
        "Yes — business cards, flyers, signs and custom apparel. Business cards are included with your new website.",
    },
  ] satisfies Faq[],

  finalCta: {
    heading: "Send us your business name.",
    body: "We'll design your new homepage — free. Love it? We build the rest. One payment, no monthly fees.",
  },
} as const;
