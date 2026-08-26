import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import {
  getCity,
  getLocalPage,
  getLocalService,
  getService,
  localPages,
  sameServiceNearby,
  serviceProcess,
  siblingServicesIn,
  site,
} from "@/content";
import { buildMetadata, localSeo } from "@/lib/seo/page-seo";
import { BUSINESS_ID, breadcrumbs, faqPage, pageGraph, webPage } from "@/lib/seo/schema";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

type Params = { service: string; city: string };

/**
 * Only the allow-list builds. `dynamicParams = false` is the routing-layer
 * half of the same rule the content layer enforces: a combination nobody has
 * written copy for 404s rather than being rendered on demand from a template.
 * 10 services × 16 cities is 160 URLs, and generating them all is textbook
 * doorway spam — the kind Google penalises across a whole domain rather than
 * page by page.
 */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return localPages.map((page) => ({ service: page.service, city: page.city }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getLocalService(serviceSlug);
  const city = getCity(citySlug);
  if (!service || !city) return {};

  return buildMetadata({
    path: `/${serviceSlug}/${citySlug}`,
    seo: localSeo(service.name, city.name, service.blurb),
    ogEyebrow: `${city.name}, ${city.region}`,
  });
}

function schema(serviceSlug: string, citySlug: string) {
  const page = getLocalPage(serviceSlug, citySlug)!;
  const service = getLocalService(serviceSlug)!;
  const city = getCity(citySlug)!;
  const url = `${site.url}/${serviceSlug}/${citySlug}`;

  const seo = localSeo(service.name, city.name, service.blurb);

  return pageGraph([
    webPage({ path: `/${serviceSlug}/${citySlug}`, name: seo.title, description: seo.description }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Service areas", path: "/service-areas" },
      { name: `${service.name} in ${city.name}`, path: `/${serviceSlug}/${citySlug}` },
    ]),
    faqPage(page.faqs, `${url}#faq`),
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: `${service.name} in ${city.name}`,
      description: page.intro[0],
      url,
      serviceType: service.name,
      provider: { "@id": BUSINESS_ID },
      areaServed: {
        "@type": "City",
        name: city.name,
        address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
      },
    },
  ]);
}

export default async function LocalServicePage({ params }: { params: Promise<Params> }) {
  const { service: serviceSlug, city: citySlug } = await params;
  const page = getLocalPage(serviceSlug, citySlug);
  const service = getLocalService(serviceSlug);
  const city = getCity(citySlug);
  if (!page || !service || !city) notFound();

  const parent = getService(service.parent);
  const siblings = siblingServicesIn(citySlug, serviceSlug);
  const nearby = sameServiceNearby(serviceSlug, citySlug);

  return (
    <>
      <Schema graph={schema(serviceSlug, citySlug)} />

      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "01", label: city.name.toUpperCase(), spec: service.name.toUpperCase() }}
          className="overflow-hidden"
        >
          <HalftoneField plate="m" pitch={9} dot={1.7} opacity={0.16} seed={13} fade="radial" />

          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Service areas", path: "/service-areas" },
              { name: `${service.name} in ${city.name}`, path: `/${serviceSlug}/${citySlug}` },
            ]}
          />

          <div className="mt-10 grid gap-x-gutter gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow spec={city.region}>{service.name}</Eyebrow>

              <h1 className="mt-8 max-w-[16ch] font-display text-3xl font-normal text-fg">
                {localSeo(service.name, city.name, service.blurb).h1}
              </h1>

              <p className="mt-10 max-w-[54ch] text-md text-fg-muted">{page.intro[0]}</p>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Button href={`/quote?service=${serviceSlug}&city=${citySlug}`} size="lg">
                  Get a quote in 24hrs
                </Button>
                <Button href="/packages" size="lg" variant="outline">
                  See prices
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              {/* Width and height are set, so the box is reserved before the
                  file loads and nothing shifts. `unoptimized` serves the SVG
                  directly — routing SVG through the image optimiser needs
                  dangerouslyAllowSVG, which is not worth switching on
                  globally for a decorative plate. */}
              <Image
                src={page.image.src}
                alt={page.image.alt}
                width={800}
                height={600}
                unoptimized
                priority
                // Set explicitly. `priority` alone did not put the hint on the
                // tag here — same gap the hero hit — and this image is the LCP
                // element on all 25 local pages.
                fetchPriority="high"
                className="w-full border-[length:var(--hairline)] border-rule"
              />
            </div>
          </div>
        </SectionFrame>

        {/* The written body. */}
        <SectionFrame
          surface="stock"
          id="detail"
          padding="lg"
          ticket={{ number: "02", label: "DETAIL", spec: city.name.toUpperCase() }}
        >
          <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="max-w-[62ch] space-y-6">
                {page.intro.slice(1).map((paragraph) => (
                  <p key={paragraph} className="text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              {parent ? (
                <p className="mt-12 border-t-[length:var(--hairline)] border-rule pt-8">
                  <Link
                    href={`/${parent.slug}`}
                    className={`${SPEC} text-fg underline decoration-1 underline-offset-[7px] decoration-rule-strong transition-colors hover:decoration-mark`}
                  >
                    Everything we do in {parent.name.toLowerCase()}
                  </Link>
                </p>
              ) : null}
            </div>

            <aside className="lg:col-span-5">
              <div className="border-[length:var(--hairline)] border-rule bg-surface-raised p-8">
                <p className={`${SPEC} text-fg-faint`}>Delivery to {city.name}</p>
                <p className="mt-5 text-sm text-fg-muted">{page.delivery}</p>
                <dl className="mt-8 space-y-4 border-t-[length:var(--hairline)] border-rule pt-6">
                  <div>
                    <dt className={`${SPEC} text-fg-faint`}>Produced at</dt>
                    <dd className="mt-2 text-sm text-fg-muted">
                      {site.address.streetAddress}, {site.address.locality}
                    </dd>
                  </div>
                  <div>
                    <dt className={`${SPEC} text-fg-faint`}>Call</dt>
                    <dd className="mt-2 text-sm">
                      <a href={site.phoneHref} className="text-link underline decoration-1 underline-offset-4">
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </SectionFrame>

        {/* Process */}
        <SectionFrame
          surface="ink"
          id="how-it-works"
          padding="lg"
          ticket={{ number: "03", label: "PROCESS", spec: "4 STEPS" }}
        >
          <Eyebrow spec="QUOTE → ARTWORK → PROOF → PRODUCTION">How it works</Eyebrow>
          <ol className="mt-14 grid gap-x-gutter gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {serviceProcess.map((step) => (
              <li key={step.step} className="border-t-[length:var(--hairline)] border-rule pt-6">
                <p className="font-utility text-xl leading-none text-accent-text">{step.step}</p>
                <h2 className="mt-5 font-display text-lg font-medium text-fg">{step.title}</h2>
                <p className="mt-4 text-sm text-fg-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </SectionFrame>

        {/* FAQ */}
        <SectionFrame
          surface="stock"
          id="faq"
          padding="lg"
          ticket={{ number: "04", label: "FAQ", spec: city.name.toUpperCase() }}
        >
          <Eyebrow spec="ASKED IN THIS CITY">FAQ</Eyebrow>
          <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
            {service.name} in {city.name}, answered
          </h2>

          <div className="mt-12 border-t-[length:var(--hairline)] border-rule">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group border-b-[length:var(--hairline)] border-rule">
                <summary className="flex cursor-pointer list-none items-start gap-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-[var(--hairline)] w-4 shrink-0 origin-left bg-rule-strong transition-transform duration-[var(--dur-snap)] ease-press group-open:scale-x-[2.2] group-hover:bg-mark"
                  />
                  <h3 className="flex-1 font-display text-lg font-medium text-fg">{faq.question}</h3>
                  <span aria-hidden="true" className={`${SPEC} mt-[0.3em] shrink-0 text-fg-faint transition-transform duration-[var(--dur-snap)] group-open:rotate-45`}>
                    +
                  </span>
                </summary>
                <p className="max-w-[64ch] pb-7 pl-10 text-fg-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </SectionFrame>

        {/* Internal links */}
        <SectionFrame
          surface="ink"
          id="nearby"
          padding="lg"
          ticket={{ number: "05", label: "NEARBY", spec: "MORE PAGES" }}
        >
          <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-2">
            {siblings.length > 0 ? (
              <nav aria-label={`Other services in ${city.name}`}>
                <h2 className={`${SPEC} text-fg-faint`}>More in {city.name}</h2>
                <ul className="mt-8 border-t-[length:var(--hairline)] border-rule">
                  {siblings.map((sibling) => {
                    const other = getLocalService(sibling.service)!;
                    return (
                      <li key={sibling.service} className="border-b-[length:var(--hairline)] border-rule">
                        <Link
                          href={`/${sibling.service}/${citySlug}`}
                          className="block py-4 text-fg-muted transition-colors hover:text-fg sm:flex sm:items-baseline sm:justify-between sm:gap-4"
                        >
                          <span className="font-display text-base font-medium">
                            {other.name} in {city.name}
                          </span>
                          {/* Stacks below sm. As a shrink-0 flex child it could
                              not compress, and a long blurb pushed the row
                              past a phone viewport. */}
                          <span className={`${SPEC} mt-1 block text-fg-faint sm:mt-0 sm:shrink-0`}>
                            {other.blurb.split(",")[0]}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}

            {nearby.length > 0 ? (
              <nav aria-label={`${service.name} in nearby cities`}>
                <h2 className={`${SPEC} text-fg-faint`}>{service.name} nearby</h2>
                <ul className="mt-8 border-t-[length:var(--hairline)] border-rule">
                  {nearby.map((other) => {
                    const otherCity = getCity(other.city)!;
                    return (
                      <li key={other.city} className="border-b-[length:var(--hairline)] border-rule">
                        <Link
                          href={`/${serviceSlug}/${other.city}`}
                          className="block py-4 text-fg-muted transition-colors hover:text-fg sm:flex sm:items-baseline sm:justify-between sm:gap-4"
                        >
                          <span className="font-display text-base font-medium">
                            {service.name} in {otherCity.name}
                          </span>
                          <span className={`${SPEC} mt-1 block text-fg-faint sm:mt-0 sm:shrink-0`}>
                            {otherCity.region}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}
          </div>

          <p className="mt-14">
            <Link
              href="/service-areas"
              className={`${SPEC} text-fg underline decoration-1 underline-offset-[7px] decoration-rule-strong transition-colors hover:decoration-mark`}
            >
              Every city we publish for
            </Link>
          </p>
        </SectionFrame>

        <CallToAction />
      </main>

      <SiteFooter />
    </>
  );
}
