import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ServiceMap } from "@/components/contact/service-map";
import { SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, SectionFrame } from "@/components/ui";
import { cities, liveCities, services, site } from "@/content";
import { imageSrc, pageStills } from "@/content/media";

import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

const PATH = "/contact";
const seo = getPageSeo(PATH)!;

export const metadata: Metadata = buildMetadata({ path: PATH, seo, ogEyebrow: "Mississauga, ON" });

const SPEC = "font-utility text-2xs uppercase tracking-utility";

function graph() {
  return pageGraph([
    webPage({ path: PATH, name: seo.title, description: seo.description, type: "ContactPage" }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Contact", path: PATH },
    ]),
  ]);
}

/** What to have ready. Answers the question people phone to ask first. */
const BRING = [
  {
    title: "Printing something",
    detail:
      "A PDF is ideal. If all you have is a photo of the old one, that works to start — we will tell you what we need before anything runs.",
  },
  {
    title: "Shirts or hats",
    detail:
      "How many, what garment, and where the logo goes. A rough count is fine; we can price a range and firm it up later.",
  },
  {
    title: "A sign or a vehicle",
    detail:
      "A photo of the wall, window or van, with something in frame for scale. A tape measure across it is even better.",
  },
  {
    title: "A website",
    detail:
      "Your current address if you have one, and roughly how many pages you think you need. We will tell you if it is fewer.",
  },
];

export default function ContactPage() {
  const { address } = site;
  // Cities we have written a page for, so this list only links to real pages.
  const linked = new Set(liveCities());

  return (
    <>
      <Schema graph={graph()} />
      <main id="main" tabIndex={-1}>
        {/* ── The phone number, as big as it goes. ─────────────────────────
            This is the whole point of the page. Somebody who has reached
            /contact has already decided; the job of the first screen is to
            put the number under their thumb, not to sell to them again. */}
        <SectionFrame
          surface="ink"
          as="header"
          padding="md"
          ticket={{ number: "00", label: "CONTACT", spec: "MON–FRI 9–6" }}
        >
          <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Contact", path: PATH }]} />
          <Eyebrow spec={site.serviceArea}>Contact</Eyebrow>

          <h1 className="mt-10 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
            {seo.h1}
          </h1>

          <p className="mt-8 max-w-[52ch] text-md text-fg-muted">
            Phone is fastest. We answer it ourselves — there is no queue and no menu.
          </p>

          <p className="mt-10">
            <a
              href={site.phoneHref}
              className="inline-block font-numeral text-3xl leading-[0.9] font-black tracking-tight text-accent-text tabular-nums underline decoration-[3px] decoration-transparent underline-offset-[12px] transition-colors hover:decoration-accent-text focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-focus"
            >
              {site.phone}
            </a>
          </p>

          <p className="mt-8 text-md text-fg-muted">
            or email{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-display font-bold text-fg underline decoration-[length:var(--hairline)] underline-offset-4 transition-colors hover:decoration-mark"
            >
              {site.email}
            </a>
          </p>

          <div className="mt-12 flex flex-wrap gap-6">
            <Button href="/quote" size="lg">
              Send the details instead
            </Button>
            <Button href={site.directionsUrl} size="lg" variant="outline">
              Get directions
            </Button>
          </div>
        </SectionFrame>

        {/* ── Address and hours, at a size you can read across a desk. ───── */}
        <SectionFrame
          surface="stock"
          id="find-us"
          padding="md"
          ticket={{ number: "01", label: "FIND US", spec: "SKYMARK AVE" }}
        >
          <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className={`${SPEC} text-fg-faint`}>Where we are</p>
              <address className="mt-6 font-display text-xl leading-tight font-bold not-italic text-fg">
                {address.streetAddress}
                <br />
                {address.locality}, {address.region}
                {address.postalCode ? (
                  <>
                    <br />
                    {address.postalCode}
                  </>
                ) : null}
              </address>
              <p className="mt-6 max-w-[42ch] text-md text-fg-muted">
                Collection is always available if it is faster than waiting for a delivery. Call
                first so the job is at the front when you arrive.
              </p>
              <p className="mt-8">
                <a
                  href={site.directionsUrl}
                  className={`${SPEC} text-link underline decoration-[length:var(--hairline)] underline-offset-[6px]`}
                >
                  Open in Google Maps
                </a>
              </p>
            </div>

            <div className="lg:col-span-4">
              <p className={`${SPEC} text-fg-faint`}>When we are open</p>
              <dl className="mt-6 space-y-5">
                {site.hours.map((entry) => (
                  <div key={entry.days}>
                    <dt className="text-sm text-fg-muted">{entry.days}</dt>
                    <dd className="mt-1 font-display text-lg font-bold text-fg">{entry.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 max-w-[36ch] text-sm text-fg-muted">
                Artwork approved before 11am on a weekday can go same day on stocked items.
              </p>
            </div>

            <div className="lg:col-span-3">
              <p className={`${SPEC} text-fg-faint`}>What we make</p>
              <ul className="mt-6 space-y-3">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}`}
                      className="text-md text-fg-muted underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-4 transition-colors hover:text-fg hover:decoration-mark"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative mt-16 aspect-[3/2] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken sm:aspect-[21/9]">
            <Image
              src={imageSrc(pageStills.entrance)}
              alt={pageStills.entrance.alt}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
            />
          </div>
        </SectionFrame>

        {/* ── The map. ───────────────────────────────────────────────────── */}
        <SectionFrame
          surface="ink"
          id="service-area"
          padding="md"
          ticket={{ number: "02", label: "SERVICE AREA", spec: `${cities.length} CITIES` }}
        >
          <Eyebrow number="02" spec="DELIVERY INCLUDED">
            Where we deliver
          </Eyebrow>
          <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            One shop in Mississauga, delivering across the GTA.
          </h2>
          <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
            Delivery across the Greater Toronto Area is included in our package prices. If you are
            outside the ring below, phone anyway — we ship, and it is usually cheaper than you
            expect.
          </p>

          <div className="mt-14 grid gap-x-gutter gap-y-12 lg:grid-cols-12">
            {/* min-w-0: a grid item defaults to min-width:auto, so the map's
                own min-width escapes its overflow-x-auto wrapper and widens
                the page instead of scrolling inside it. */}
            <div className="min-w-0 lg:col-span-8">
              <ServiceMap />
              <p className={`${SPEC} mt-4 text-fg-faint`}>
                Approximate positions. Use the directions link for the exact address.
              </p>
            </div>

            <div className="lg:col-span-4">
              <p className={`${SPEC} text-fg-faint`}>Cities we cover</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-gutter gap-y-3 lg:grid-cols-1 lg:gap-y-2.5">
                {cities.map((city) => (
                  <li key={city.slug} className="text-sm">
                    {linked.has(city.slug) ? (
                      <Link
                        href={`/service-areas#${city.slug}`}
                        className="text-fg-muted underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-4 transition-colors hover:text-fg hover:decoration-mark"
                      >
                        {city.name}
                      </Link>
                    ) : (
                      <span className="text-fg-muted">{city.name}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-8">
                <Link
                  href="/service-areas"
                  className={`${SPEC} text-link underline decoration-[length:var(--hairline)] underline-offset-[6px]`}
                >
                  See every service area
                </Link>
              </p>
            </div>
          </div>
        </SectionFrame>

        {/* ── What to have ready. ────────────────────────────────────────── */}
        <SectionFrame
          surface="stock"
          id="before-you-call"
          padding="md"
          ticket={{ number: "03", label: "BEFORE YOU CALL", spec: "WHAT TO BRING" }}
        >
          <Eyebrow number="03" spec="SAVES A ROUND TRIP">
            Before you call
          </Eyebrow>
          <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            You do not need artwork to get a price.
          </h2>
          <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
            People often wait until everything is ready before phoning, and then the quote arrives
            two weeks later than it needed to. Here is all we actually need to start.
          </p>

          <dl className="mt-14 grid gap-x-gutter gap-y-12 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-2">
            {BRING.map((item) => (
              <div key={item.title}>
                <dt className="font-display text-lg font-bold text-fg">{item.title}</dt>
                <dd className="mt-4 max-w-[44ch] text-md text-fg-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 flex flex-wrap gap-6">
            <Button href={site.phoneHref} size="lg">
              Call {site.phone}
            </Button>
            <Button href="/quote" size="lg" variant="outline">
              Fill in the form instead
            </Button>
          </div>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
