import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { FreeHomepageForm } from "@/components/landing/free-homepage/free-homepage-form";
import { StickyBar } from "@/components/landing/free-homepage/sticky-bar";
import { HeroPhones, WorkFrames } from "@/components/landing/free-homepage/work-frames";
import { HalftoneField } from "@/components/ui/halftone-field";
import { site } from "@/content";
import { freeHomepage } from "@/content/free-homepage";

/**
 * The paid landing page.
 *
 * Google Search ("web design Mississauga") and an Instagram video both point
 * here, and it has exactly one job: a local business owner asks for a free
 * homepage design. Everything on it either moves someone toward the form or
 * is cut.
 *
 * NO NAVIGATION. The logo and the phone number, and that is the masthead.
 * A landing page with a site menu on it leaks — the visitor goes browsing and
 * the click you paid for is spent. See BARE_ROUTES in lib/navigation.ts,
 * which is what suppresses the real masthead and the ticket rail here.
 *
 * `noindex, follow`: the page covers ground /web-design-seo is trying to rank
 * for, and two pages competing for one term helps neither. The links out
 * still pass equity. robots.txt deliberately does NOT block it — a crawler
 * that cannot fetch the page never sees the noindex either.
 *
 * The house surfaces and the house faces, unchanged. A landing page that
 * looks like a different company from the site it links to is a landing page
 * that has to earn trust twice, and the ink-and-magenta press room is already
 * the brand on the ads. Every colour here comes from the ink and stock
 * surfaces in globals.css, so nothing on this page is styled twice.
 */
export const metadata: Metadata = {
  title: `Your New Homepage, Designed Free | ${site.name}`,
  description:
    "Send us your business name and we will design your new homepage, free. Love it and we build the rest — one payment, no monthly fees. Mississauga.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/free-homepage" },
};

const FORM_ID = "free-homepage-form";
const LABEL = "font-utility text-2xs font-medium uppercase tracking-[0.14em]";
const H2 = "font-display font-extrabold text-fg";

/** Shared section shell. The generous padding IS the design. */
function Band({
  surface,
  children,
  className = "",
  id,
}: {
  surface: "ink" | "stock";
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-surface={surface}
      className={`bg-surface px-gutter py-20 text-fg sm:py-28 lg:py-36 ${className}`}
    >
      <div className="mx-auto w-full max-w-page">{children}</div>
    </section>
  );
}

export default function FreeHomepagePage() {
  return (
    <>
      {/* A masthead, not a menu. The logo goes home, the number dials. */}
      <div data-surface="ink" className="bg-surface px-gutter">
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6 py-5">
          <Link href="/" className="inline-flex" aria-label={`${site.name} home`}>
            <Logo variant="horizontal" className="[--logo-size:20px] sm:[--logo-size:26px]" />
          </Link>
          <a
            href={site.phoneHref}
            className="font-display text-base font-extrabold tabular-nums text-accent-text sm:text-lg"
          >
            {site.phone}
          </a>
        </div>
      </div>

      <main id="main" tabIndex={-1}>
        {/* ── 1. Hero. Headline, subhead, form, all on the first screen ── */}
        <Band surface="ink" className="relative isolate overflow-hidden pt-10 sm:pt-14 lg:pt-12">
          <HalftoneField plate="m" pitch={9} dot={1.5} opacity={0.12} seed={11} fade="radial" />
          <div className="relative grid grid-cols-1 items-start gap-x-16 gap-y-10 lg:grid-cols-12 lg:gap-y-0">
            <div className="lg:col-span-6 lg:pt-4">
              <p className={`${LABEL} text-accent-text`}>Web design · Mississauga</p>

              {/* The ad's headline, verbatim. If this and the ad ever differ,
                  the ad is right and this is wrong. */}
              <h1 className="mt-6 max-w-[13ch] font-display text-[clamp(2.125rem,1.15rem+4vw,4.75rem)] leading-[0.96] font-extrabold tracking-[-0.025em] text-fg">
                {freeHomepage.headline}
              </h1>

              <p className="mt-7 max-w-[44ch] text-md leading-relaxed text-fg-muted">
                {freeHomepage.subhead}
              </p>

              <div className="mt-12">
                <HeroPhones />
              </div>
            </div>

            {/* On a phone this lands directly under the subhead, which is the
                point of the whole layout. */}
            <div className="lg:col-span-6">
              <FreeHomepageForm id={FORM_ID} />
            </div>
          </div>
        </Band>

        {/* The sticky bar waits until this scrolls past. */}
        <div id="hero-end" aria-hidden="true" className="h-px" />

        {/* ── 2. The problem ──────────────────────────────────────────── */}
        <Band surface="stock">
          <p className={`${LABEL} text-accent-text`}>{freeHomepage.problem.eyebrow}</p>
          {/* One sentence, three weights: the setup quiet, the turn plain, the
              consequence in the accent. The words are the brief's exactly;
              the spans only change how they are set. */}
          <p className={`${H2} mt-8 max-w-[22ch] text-[clamp(1.75rem,1.2rem+2.6vw,3.5rem)] leading-[1.06]`}>
            <span className="text-fg-muted">{freeHomepage.problem.lead}</span>{" "}
            {freeHomepage.problem.turn}{" "}
            <span className="text-accent-text">{freeHomepage.problem.sting}</span>
          </p>
        </Band>

        {/* ── 3. How it works ─────────────────────────────────────────── */}
        <Band surface="stock" className="border-t-[length:var(--hairline)] border-rule">
          <h2 className={`${H2} text-xl`}>How it works</h2>
          <ol className="mt-14 grid grid-cols-1 gap-x-gutter gap-y-12 sm:grid-cols-3">
            {freeHomepage.steps.map((step) => (
              <li key={step.n} className="border-t-2 border-accent pt-6">
                <p className="font-numeral text-3xl leading-none font-black tabular-nums text-accent-text">
                  {step.n}
                </p>
                <h3 className={`${H2} mt-6 max-w-[18ch] text-lg leading-[1.12]`}>{step.title}</h3>
                <p className="mt-4 max-w-[38ch] text-base text-fg-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Band>

        {/* ── 4. Real work ────────────────────────────────────────────── */}
        <Band surface="stock" className="border-t-[length:var(--hairline)] border-rule">
          <h2 className={`${H2} text-xl`}>Real work</h2>
          <p className="mt-5 max-w-[46ch] text-base text-fg-muted">
            Live sites we designed and built. Every one of these started the same way yours would.
          </p>
          <div className="mt-16">
            <WorkFrames />
          </div>
        </Band>

        {/* ── 5. What you get ─────────────────────────────────────────── */}
        <Band surface="ink">
          <h2 className={`${H2} text-xl`}>What you get</h2>
          <ul className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {freeHomepage.benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="border-t-[length:var(--hairline)] border-rule-strong pt-6"
              >
                <span
                  aria-hidden="true"
                  className="mb-5 flex h-7 w-7 items-center justify-center border-[length:var(--hairline)] border-accent text-accent-text"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                  </svg>
                </span>
                <h3 className={`${H2} max-w-[20ch] text-md leading-[1.2]`}>{benefit.title}</h3>
                <p className="mt-4 max-w-[38ch] text-base text-fg-muted">{benefit.detail}</p>
              </li>
            ))}
          </ul>
        </Band>

        {/* ── 6. FAQ ──────────────────────────────────────────────────────
            <details>, not an accordion component. It opens without
            JavaScript, it is keyboard-operable and screen-reader-announced
            for free, and it ships nothing — three things a library would have
            to beat and does not. */}
        <Band surface="stock">
          <h2 className={`${H2} text-xl`}>Questions</h2>
          <div className="mt-12 max-w-[62ch]">
            {freeHomepage.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b-[length:var(--hairline)] border-rule-strong py-6"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]">
                  <span className={`${H2} text-md leading-snug`}>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent-text transition-transform duration-200 group-open:rotate-45"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M8 1v14M1 8h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-5 text-base leading-relaxed text-fg-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Band>

        {/* ── 7. Back to the form ─────────────────────────────────────── */}
        <Band surface="ink" className="relative isolate overflow-hidden pb-28 lg:pb-36">
          <HalftoneField plate="m" pitch={9} dot={1.5} opacity={0.12} seed={23} fade="radial" />
          <h2 className={`${H2} relative max-w-[16ch] text-[clamp(2rem,1.4rem+2.8vw,4rem)] leading-[1.02]`}>
            {freeHomepage.finalCta.heading}
          </h2>
          <p className="relative mt-7 max-w-[46ch] text-md text-fg-muted">{freeHomepage.finalCta.body}</p>
          <div className="relative mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={`#${FORM_ID}`}
              className="inline-flex items-center justify-center border-[length:var(--hairline)] border-accent bg-accent px-10 py-5 font-display text-base font-extrabold text-accent-fg transition-colors duration-200 hover:border-accent-hover hover:bg-accent-hover hover:text-accent-hover-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              {freeHomepage.cta}
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center border-[length:var(--hairline)] border-rule-strong px-10 py-5 font-display text-base font-bold text-fg transition-colors duration-200 hover:border-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Call {site.phone}
            </a>
          </div>
          <p className="relative mt-8 text-sm text-fg-faint">{freeHomepage.reassurance}</p>
        </Band>
      </main>

      <StickyBar formId={FORM_ID} />
    </>
  );
}
