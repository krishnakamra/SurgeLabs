import Link from "next/link";
import { Logo } from "@/components/brand";
import { MagneticCTA } from "@/components/motion";
import { Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { getCity, liveCities, services, site } from "@/content";

const LINK =
  "text-sm text-fg-muted underline decoration-1 underline-offset-4 decoration-transparent transition-colors hover:text-fg hover:decoration-mark";
const HEADING = "font-utility text-2xs uppercase tracking-utility text-fg-faint";

export function CallToAction() {
  return (
    <SectionFrame
      surface="ink"
      id="contact"
      padding="lg"
      ticket={{ number: "08", label: "CONTACT", spec: "MON–FRI 9–6" }}
      className="overflow-hidden"
    >
      <HalftoneField plate="m" pitch={9} dot={1.9} opacity={0.14} seed={41} fade="radial" />

      <Eyebrow number="08" spec={site.serviceArea}>
        Start a job
      </Eyebrow>

      <h2 className="mt-6 max-w-[18ch] font-display text-3xl font-normal text-fg">
        Tell us what you need. We&rsquo;ll quote it in a day.
      </h2>

      <p className="mt-8 max-w-[52ch] text-md text-fg-muted">
        Send artwork if you have it, a photo of the old sign if you don&rsquo;t. Weekdays, you get a
        written quote back within 24 hours.
      </p>

      <div className="mt-14 flex flex-wrap items-center gap-6">
        <MagneticCTA>
          <Button href={site.phoneHref} size="lg">
            Call {site.phone}
          </Button>
        </MagneticCTA>
        <Button href={`mailto:${site.email}`} size="lg" variant="outline">
          Email {site.email}
        </Button>
      </div>
    </SectionFrame>
  );
}

/**
 * NAP block plus the full internal link matrix.
 *
 * ⚠️  The name, address and phone here render straight from content/site.ts,
 *     which carries the instruction that they must match the Google Business
 *     Profile character for character. Do not retype them inline anywhere.
 *
 * Service and city routes are generated from the content layer, so they light
 * up automatically as those pages land.
 */
export function SiteFooter() {
  const { address } = site;
  const hasStreet = address.streetAddress.length > 0;

  return (
    <footer data-surface="stock" className="relative isolate bg-surface text-fg">
      <div className="mx-auto w-full max-w-page px-gutter py-20">
        <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12">
          {/* NAP */}
          <div className="lg:col-span-4">
            {/* Second of the two homepage links — the masthead carries the
                other. Both are here on purpose: without one the front page is
                an orphan, reachable from nowhere while every route below it
                is, and it is the page the rest of the site should be voting
                for.

                The stacked lockup, because this column is narrow and the
                horizontal one would set the wordmark smaller than its 24px
                floor to fit. `inline-flex` keeps the box as wide as the
                wordmark, so the lockup sits flush to the column's left edge
                with the mark centred over it.

                The business name is not repeated as a heading underneath. It
                is already in the wordmark, in the copyright line at the foot
                of this footer, and in the LocalBusiness schema — three times
                is enough, and a display-weight duplicate directly under the
                logo reads as a mistake. */}
            <Link
              href="/"
              className="inline-flex rounded-[2px] outline-offset-[6px] focus-visible:outline-2 focus-visible:outline-focus"
            >
              <Logo variant="stacked" size={44} />
            </Link>

            <address className="mt-8 not-italic">
              {hasStreet ? (
                <p className="text-sm text-fg-muted">{address.streetAddress}</p>
              ) : null}
              <p className="text-sm text-fg-muted">
                {address.locality}, {address.region}
                {address.postalCode ? ` ${address.postalCode}` : ""}
              </p>
              <p className="mt-4">
                <a href={site.phoneHref} className={LINK}>
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className={LINK}>
                  {site.email}
                </a>
              </p>
            </address>

            <dl className="mt-8 space-y-2">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex gap-3 text-sm">
                  <dt className="w-[10.5rem] shrink-0 font-utility text-2xs uppercase tracking-utility text-fg-faint">
                    {entry.days}
                  </dt>
                  <dd className="text-fg-muted">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className={HEADING}>Services</h2>
            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${service.slug}`} className={LINK}>
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/packages" className={LINK}>
                  Packages and pricing
                </Link>
              </li>
              <li>
                <Link href="/quote" className={LINK}>
                  Get a quote
                </Link>
              </li>
            </ul>
          </nav>

          {/* Cities. Only those with live pages are linked — the rest of the
              delivery area is listed on /service-areas, which says plainly
              that we deliver there and have not written a page yet. */}
          <nav aria-label="Service area" className="lg:col-span-5">
            <h2 className={HEADING}>Serving {site.serviceArea}</h2>
            <ul className="mt-6 grid gap-x-gutter gap-y-3 sm:grid-cols-2">
              {liveCities().map((slug) => {
                const city = getCity(slug);
                if (!city) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/service-areas#${slug}`}
                      className={LINK}
                      title={`${city.name}, ${city.region}`}
                    >
                      {city.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="/service-areas" className={LINK}>
                  All service areas
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t-[length:var(--hairline)] border-rule pt-8">
          <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
            © {new Date().getFullYear()} {site.name} — {address.locality}, {address.region}
          </p>
          <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
            Web · Print · Apparel, all in-house
          </p>
        </div>
      </div>
    </footer>
  );
}
