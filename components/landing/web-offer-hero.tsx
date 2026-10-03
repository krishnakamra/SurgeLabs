import { BatchClock } from "@/components/landing/batch-clock";
import { LeadForm } from "@/components/landing/lead-form";
import { Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { site } from "@/content";
import { webOffer, webOfferDeadline } from "@/content/offer";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * The first screen of /web-design-seo — the page the Google Ads campaign
 * points at.
 *
 * THE ONE RULE THIS PAGE HAS TO OBEY: it must say what the ad said, in the
 * first sentence, above the fold, in the same words. A visitor who clicks
 * "Free homepage design" and lands on a page headlined "Custom web design and
 * SEO in Mississauga" has to work out whether they are in the right place,
 * and most of them leave instead. That mismatch is also what Google scores as
 * poor landing-page experience, which raises the cost of every click.
 *
 * The form is HERE, not a scroll away and not behind a button. Every step
 * between the ad and the field costs leads, and the only fields are the ones
 * needed to call someone back — everything else gets asked on the phone.
 *
 * NO PRICE ON THIS SCREEN. The offer is "free", and the first number a
 * visitor sees has to be that one. $399 appearing anywhere above the fold
 * reframes a free design as a $399 website and undercuts the entire pitch —
 * the real figure is quoted per job and lives further down the page.
 */
export function WebOfferHero({ h1 }: { h1: string }) {
  const deadline = webOfferDeadline();
  const slots = webOffer.slotsPerMonth;

  return (
    <SectionFrame
      surface="ink"
      as="header"
      id="top"
      padding="md"
      ticket={{ number: "01", label: "FREE HOMEPAGE", spec: "WEB DESIGN" }}
      className="overflow-hidden"
    >
      <HalftoneField plate="c" pitch={9} dot={1.7} opacity={0.16} seed={31} fade="radial" />

      {/* grid-cols-1 is load-bearing, not tidiness.
          Without it the implicit mobile track is auto-sized, which means
          max-content — and `max-w-[17ch]` on a headline at this font size
          computes to ~445px, so the single column grew wider than its 342px
          container and the section's overflow-hidden silently clipped every
          line of copy off the right edge. Tailwind's grid-cols-1 is
          minmax(0,1fr), which is bounded by the container. */}
      <div className="grid grid-cols-1 gap-x-gutter gap-y-10 lg:grid-cols-12 lg:gap-y-12">
        {/* ── 1. The promise ─────────────────────────────────────────── */}
        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <Eyebrow spec={site.serviceArea}>{webOffer.eyebrow}</Eyebrow>

          {/* The h1 string comes from lib/seo, which is the same text
              scripts/check-seo.mjs asserts the primary keyword against — so
              the headline on screen and the one the gate checks cannot
              diverge. It leads with the ad's exact promise.

              text-2xl, not text-3xl. On a paid landing page the headline is
              not the product — the form is. At 3xl the h1 alone filled a
              900px viewport and pushed the submit button and the scarcity
              line below the fold on desktop. */}
          <h1 className="mt-8 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
            {h1}
          </h1>

          <p className="mt-6 max-w-[46ch] text-md text-fg-muted">{webOffer.sub}</p>
        </div>

        {/* ── 3. The proof, and the honest scarcity ───────────────────────
            `order-last` on a phone so the FORM sits directly under the
            promise. Most paid traffic is mobile, and five bullets between the
            headline and the only field on the page is five bullets' worth of
            people who never reach it. On lg it returns to the left column
            under the headline, where there is room for both. */}
        <div className="order-last lg:order-none lg:col-span-6 lg:col-start-1 lg:row-start-2">
          <ul className="space-y-3.5">
            {webOffer.gets.map((line) => (
              <li key={line} className="flex gap-4 text-sm text-fg">
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] h-[var(--hairline)] w-5 shrink-0 bg-mark"
                />
                <span className="max-w-[46ch]">{line}</span>
              </li>
            ))}
          </ul>

          {/* Scarcity, and all of it true. The slot count is a commitment the
              owner sets in content/offer.ts; the countdown runs to the end of
              the calendar month and cannot be reset by reloading. */}
          {(slots || deadline) ? (
            <div className="mt-10 border-t-[length:var(--hairline)] border-rule pt-7">
              {slots ? (
                <p className={`${SPEC} text-fg`}>
                  <span className="font-numeral text-[1.5em] font-black tabular-nums text-accent-text">
                    {slots}
                  </span>{" "}
                  free homepage designs a month. That is the real limit — each one is a
                  morning of work, not a template.
                </p>
              ) : null}
              {deadline ? (
                <BatchClock deadline={deadline.toISOString()} className="mt-4 text-sm" />
              ) : null}
            </div>
          ) : null}
        </div>

        {/* ── 2. The form. On the first screen, on every width — it is the
               only thing this page is for. ──────────────────────────── */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:pl-8">
          <div
            data-surface="stock"
            className="border-[length:var(--hairline)] border-rule bg-surface p-8 text-fg sm:p-10"
          >
            <h2 className="max-w-[18ch] font-display text-xl font-extrabold text-fg">
              Send us your business name.
            </h2>
            <p className="mt-4 max-w-[40ch] text-sm text-fg-muted">
              That is all we need to start. No deposit, no card, and we will not put you on a
              list — one of us calls you, usually the same day.
            </p>

            {/* `bare`, because this panel is already the card and already
                carries the heading and the reassurance. Letting the form draw
                its own as well put a card inside a card and said "no deposit,
                no card" twice in three lines. */}
            <div className="mt-8">
              <LeadForm
                id="free-homepage"
                bare
                source="/web-design-seo"
                defaultNeed="website:site"
                conversionName="Free homepage design"
                askBusiness
                submitLabel="Design my homepage free"
                // Lands on /thank-you so Google Ads has a page load to count
                // as a lead. See the note on the prop.
                redirectTo="/thank-you"
              />
            </div>

            <p className={`${SPEC} mt-8 border-t-[length:var(--hairline)] border-rule pt-6 text-fg-faint`}>
              Or call {site.phone} — we answer it ourselves
            </p>
          </div>

          <p className="mt-6 max-w-[44ch] text-sm text-fg-muted">
            <strong className="text-fg">The catch, up front:</strong> {webOffer.theCatch}
          </p>
        </div>
      </div>
    </SectionFrame>
  );
}
