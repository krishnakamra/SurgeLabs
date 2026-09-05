import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { CutoffClock } from "@/components/landing/cutoff-clock";
import { LeadForm } from "@/components/landing/lead-form";
import { StickyCta } from "@/components/landing/sticky-cta";
import { Button } from "@/components/ui";
import { site } from "@/content";
import { galleryStills, imageSrc, packageStills } from "@/content/media";
import { formatPrice } from "@/content";
import { offer, offerDeadline } from "@/content/offer";

/**
 * The paid-traffic landing page.
 *
 * Deliberately not part of the site's navigation and deliberately out of the
 * index. It is one offer with one action on it, reached from an ad, and it
 * duplicates content that already ranks — letting Google index it would put
 * it in competition with /packages and /printing-signage for the same terms
 * while adding nothing a searcher wants.
 *
 * `noindex, follow`: the links out still pass equity, the page itself stays
 * out of the results. robots.txt deliberately does NOT block it — a crawler
 * that cannot fetch the page never sees the noindex either.
 *
 * The masthead and the job-ticket rail are suppressed here (see BARE_ROUTES
 * in lib/navigation.ts). A landing page with a full site nav leaks: the
 * visitor goes browsing, and the click you paid for is spent.
 */
export const metadata: Metadata = {
  title: `1,000 Business Cards for $99 in Mississauga | ${site.name}`,
  description:
    "Designed and printed: 1,000 business cards on 16pt matte for $99, delivered across the GTA. Leave a number and we call you back the same day.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/start" },
};

const SPEC = "font-utility text-2xs uppercase tracking-utility";

export default function StartPage() {
  const deadline = offerDeadline();
  const hero = packageStills["business-cards"]!;
  const detail = galleryStills["cards-spot-uv"]!;

  return (
    <>
      {/* A masthead, not a menu. The logo goes home, the number dials. */}
      <div data-surface="ink" className="border-b-[length:var(--hairline)] border-rule bg-surface">
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6 py-5 pr-gutter pl-5 lg:pl-6">
          <Link href="/" className="inline-flex" aria-label={`${site.name} home`}>
            <Logo variant="horizontal" className="[--logo-size:22px] sm:[--logo-size:28px]" />
          </Link>
          <a
            href={site.phoneHref}
            className="font-numeral text-md leading-none font-black tabular-nums text-accent-text sm:text-lg"
          >
            {site.phone}
          </a>
        </div>
      </div>

      {/* Room for the sticky bar so it never sits on top of the footer. */}
      <main id="main" tabIndex={-1} className="pb-24 lg:pb-0">
        {/* ── Offer and form, both above the fold on a laptop ───────────── */}
        <section data-surface="ink" className="relative isolate bg-surface text-fg">
          {/* Ordered for a phone, not for a laptop. On mobile the form sits
              directly under the headline and the price — an ad visitor who
              has to scroll past a feature list and a photograph to find the
              only control on the page is an ad visitor who left. On lg it
              moves to the right column and stays there while the page
              scrolls.

              min-w-0 on the copy column: a grid item defaults to
              min-width:auto, which let the headline's track push the
              document 40px wider than a 360px phone. */}
          <div className="mx-auto flex w-full max-w-page flex-col gap-y-12 px-gutter py-16 lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:py-24">
            <div className="order-1 min-w-0 lg:col-span-7 lg:col-start-1 lg:row-start-1">
              <p className={`${SPEC} text-accent-text`}>{offer.eyebrow}</p>

              <h1 className="mt-6 max-w-[16ch] font-display text-3xl leading-[0.95] font-extrabold text-balance text-fg">
                {offer.headline}
              </h1>

              <p className="mt-8 max-w-[48ch] text-lg text-fg-muted">{offer.sub}</p>

              <div className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-3 border-t-[length:var(--hairline)] border-rule pt-8">
                <p className="font-numeral text-3xl leading-[0.8] font-black tabular-nums text-accent-text">
                  {formatPrice(offer.price)}
                </p>
                <p className="max-w-[24ch] pb-1 text-sm text-fg-muted">{offer.priceNote}</p>
              </div>
            </div>

            <div className="order-2 min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
              <div className="lg:sticky lg:top-8">
                <LeadForm id="lead-top" />
              </div>
            </div>

            <div className="order-3 min-w-0 lg:col-span-7 lg:col-start-1 lg:row-start-2">
              <ul className="grid max-w-[52ch] gap-x-gutter gap-y-3 sm:grid-cols-2">
                {offer.gets.slice(0, 4).map((line) => (
                  <li key={line} className="flex gap-3 text-md text-fg">
                    <span
                      aria-hidden="true"
                      className="mt-[0.65em] h-[var(--hairline)] w-3.5 shrink-0 bg-accent-text"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-10 aspect-[3/2] w-full max-w-[34rem] overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken">
                <Image
                  src={imageSrc(hero)}
                  alt={hero.alt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 34rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── The one true deadline ─────────────────────────────────────── */}
        <div
          data-surface="stock"
          className="border-y-[length:var(--hairline)] border-rule bg-surface-sunken text-fg"
        >
          <div className="mx-auto w-full max-w-page px-gutter py-5">
            <CutoffClock className="text-sm" />
            {deadline ? (
              <p className="mt-2 text-sm text-fg-muted">
                This price holds until{" "}
                <span className="font-bold text-fg">
                  {deadline.toLocaleDateString("en-CA", {
                    timeZone: "America/Toronto",
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                .
              </p>
            ) : null}
          </div>
        </div>

        {/* ── Everything in it, and what is not ─────────────────────────── */}
        <section data-surface="stock" className="relative isolate bg-surface text-fg">
          <div className="mx-auto w-full max-w-page px-gutter py-20">
            <h2 className="max-w-[20ch] font-display text-2xl font-extrabold text-fg">
              What the $99 covers.
            </h2>

            <div className="mt-12 grid gap-x-gutter gap-y-12 lg:grid-cols-12">
              <ul className="min-w-0 space-y-4 lg:col-span-5">
                {offer.gets.map((line) => (
                  <li key={line} className="flex gap-4 text-md text-fg">
                    <span
                      aria-hidden="true"
                      className="mt-[0.65em] h-[var(--hairline)] w-4 shrink-0 bg-accent-text"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="min-w-0 lg:col-span-4">
                <p className={`${SPEC} text-fg-faint`}>Not included</p>
                <ul className="mt-5 space-y-4">
                  {offer.notIncluded.map((line) => (
                    <li key={line} className="flex gap-4 text-sm text-fg-muted">
                      <span aria-hidden="true" className="shrink-0 font-utility text-2xs leading-[1.9] text-rule-strong">
                        &mdash;
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-fg-muted">
                  We say this here rather than at invoice time. If you need any of it, say so on the
                  call and we price it before you commit.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken">
                  <Image
                    src={imageSrc(detail)}
                    alt={detail.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 22vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why hand a stranger your number ───────────────────────────── */}
        <section data-surface="ink" className="relative isolate bg-surface text-fg">
          <div className="mx-auto w-full max-w-page px-gutter py-20">
            <h2 className="max-w-[24ch] font-display text-2xl font-extrabold text-fg">
              <span className="text-accent-text">Five vendors</span> is five chances to be off brand.
            </h2>
            <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
              Your printer, your sign guy, your shirt guy, your designer and whoever does your
              website. Every one of them gets your logo a little bit wrong. We do all five in one
              building on Skymark Ave, so the card matches the van matches the shirt.
            </p>

            <ul className="mt-12 grid gap-x-gutter gap-y-8 border-t-[length:var(--hairline)] border-rule pt-10 sm:grid-cols-2">
              {offer.reassurance.map((line) => (
                <li key={line} className="flex gap-4 text-md text-fg-muted">
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-[var(--hairline)] w-4 shrink-0 bg-accent-text"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Objections ───────────────────────────────────────────────── */}
        <section data-surface="stock" className="relative isolate bg-surface text-fg">
          <div className="mx-auto w-full max-w-page px-gutter py-20">
            <h2 className="max-w-[20ch] font-display text-2xl font-extrabold text-fg">
              The four things people ask.
            </h2>
            <dl className="mt-12 grid gap-x-gutter gap-y-10 border-t-[length:var(--hairline)] border-rule pt-10 sm:grid-cols-2">
              {offer.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="max-w-[26ch] font-display text-lg font-bold text-fg">
                    {faq.question}
                  </dt>
                  <dd className="mt-4 max-w-[46ch] text-md text-fg-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Second ask ───────────────────────────────────────────────── */}
        <section data-surface="ink" className="relative isolate bg-surface text-fg">
          <div className="mx-auto grid w-full max-w-page gap-x-gutter gap-y-12 px-gutter py-20 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-6">
              <h2 className="max-w-[18ch] font-display text-2xl font-extrabold text-fg">
                Leave a number, or just call us.
              </h2>
              <p className="mt-6 max-w-[46ch] text-md text-fg-muted">
                Either works. The call is five minutes and there is nothing to pay at the end of it
                — you get a price and a proof before any money changes hands.
              </p>
              <div className="mt-10">
                <Button href={site.phoneHref} size="lg" variant="outline">
                  Call {site.phone}
                </Button>
              </div>
              <p className="mt-8 text-sm text-fg-muted">
                {site.address.streetAddress}, {site.address.locality}, {site.address.region}
                <br />
                {site.hours[0]!.days}, {site.hours[0]!.time}
              </p>
            </div>
            <div className="min-w-0 lg:col-span-5 lg:col-start-8">
              <LeadForm id="lead-bottom" compact />
            </div>
          </div>
        </section>
      </main>

      <StickyCta />

      {/* A footer with nothing to click but the two things that are allowed
          to take a visitor off this page. */}
      <footer data-surface="stock" className="border-t-[length:var(--hairline)] border-rule bg-surface text-fg">
        <div className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-4 px-gutter py-8">
          <p className={`${SPEC} text-fg-faint`}>
            &copy; {new Date().getFullYear()} {site.name} — {site.address.locality}, {site.address.region}
          </p>
          <Link href="/privacy" className={`${SPEC} text-fg-muted underline decoration-[length:var(--hairline)] underline-offset-4`}>
            Privacy
          </Link>
        </div>
      </footer>
    </>
  );
}
