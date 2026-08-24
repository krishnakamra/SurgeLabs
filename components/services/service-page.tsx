import Link from "next/link";
import { MagneticCTA } from "@/components/motion";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, PanelMedia, SectionFrame } from "@/components/ui";
import { cities, serviceProcess, site, type Service } from "@/content";
import { loopForService } from "@/content/media";
import { getPageSeo } from "@/lib/seo/page-seo";
import { BUSINESS_ID, breadcrumbs, faqPage, pageGraph, webPage } from "@/lib/seo/schema";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * FAQPage, Service and BreadcrumbList for one service page.
 *
 * The FAQ answers here are published to Google as answers, which is exactly
 * why the production numbers in content/services.ts have to be true — a
 * turnaround quoted in schema is a turnaround the business is standing behind
 * in the results page, before anyone has even clicked.
 */
function serviceSchema(service: Service, h1: string) {
  const url = `${site.url}/${service.slug}`;
  const seo = getPageSeo(`/${service.slug}`)!;

  return pageGraph([
    webPage({ path: `/${service.slug}`, name: seo.title, description: seo.description }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: service.name, path: `/${service.slug}` },
    ]),
    faqPage(service.faqs, `${url}#faq`),
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: h1,
      description: service.summary,
      url,
      serviceType: service.name,
      provider: { "@id": BUSINESS_ID },
      areaServed: cities.map((city) => ({
        "@type": "City",
        name: city.name,
        address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.name} catalogue`,
        itemListElement: service.catalogue.flatMap((group) =>
          group.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.name, description: item.detail },
          })),
        ),
      },
    },
  ]);
}

export function ServicePage({ service, path }: { service: Service; path: string }) {
  // The H1 comes from lib/seo, which is the same string the keyword gate
  // checks — so the headline on screen and the one asserted cannot diverge.
  const seo = getPageSeo(path);
  const h1 = seo?.h1 ?? service.name;
  const plateByIndex = { "01": "c", "02": "m", "03": "k" } as const;
  const plate = plateByIndex[service.number as keyof typeof plateByIndex] ?? "k";

  return (
    <>
      <Schema graph={serviceSchema(service, h1)} />
      <main>
        {/* Hero */}
        <SectionFrame
          surface="ink"
          as="header"
          id="top"
          padding="lg"
          ticket={{ number: service.number, label: service.name.toUpperCase(), spec: "SERVICE" }}
          className="overflow-hidden"
        >
          <HalftoneField plate={plate} pitch={9} dot={1.7} opacity={0.18} seed={31} fade="radial" />

          <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Breadcrumbs
                trail={[
                  { name: "Home", path: "/" },
                  { name: service.name, path: `/${service.slug}` },
                ]}
              />
              <div className="mt-8" />
              <Eyebrow number={service.number} spec={site.serviceArea}>
                {service.name}
              </Eyebrow>

              <h1 className="mt-10 max-w-[18ch] font-display text-3xl font-extrabold text-fg">
                {h1}
              </h1>

              <div className="mt-10 max-w-[56ch] space-y-5">
                {service.intro.map((paragraph) => (
                  <p key={paragraph} className="text-md text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <MagneticCTA>
                  <Button href={`/quote?service=${service.slug}`} size="lg">
                    Get a quote in 24hrs
                  </Button>
                </MagneticCTA>
                <Button href="/packages" size="lg" variant="outline">
                  See packages and prices
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <PanelMedia
                numeral={service.number}
                plate={plate}
                asset={loopForService[service.slug]}
              />
            </div>
          </div>
        </SectionFrame>

        {/* Body copy */}
        <SectionFrame
          surface="stock"
          id="detail"
          padding="lg"
          ticket={{ number: service.number, label: "DETAIL", spec: "SPECIFICS" }}
        >
          <div className="grid gap-x-gutter gap-y-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-16">
                {service.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="max-w-[24ch] font-display text-xl font-extrabold text-fg">
                      {section.heading}
                    </h2>
                    <div className="mt-6 max-w-[62ch] space-y-5">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-fg-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Spec table, set like a job ticket. */}
            <aside className="lg:col-span-5">
              <div className="border border-rule bg-surface-raised lg:sticky lg:top-10">
                <p className={`${SPEC} border-b border-rule px-6 py-4 text-fg-faint`}>
                  Production specs
                </p>
                <dl className="divide-y divide-rule">
                  {service.specs.map((row) => (
                    <div key={row.label} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:gap-5">
                      <dt className={`${SPEC} shrink-0 text-fg-faint sm:w-[9.5rem]`}>{row.label}</dt>
                      <dd className="min-w-0 text-sm text-fg-muted">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </SectionFrame>

        {/* Catalogue */}
        <SectionFrame
          surface="ink"
          id="catalogue"
          padding="lg"
          ticket={{ number: service.number, label: "CATALOGUE", spec: "WHAT YOU CAN ORDER" }}
        >
          <Eyebrow spec="EVERYTHING BELOW IS MADE HERE">Catalogue</Eyebrow>

          <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
            What you can order
          </h2>

          <div className="mt-14 space-y-16">
            {service.catalogue.map((group) => (
              <div key={group.group}>
                <h3 className={`${SPEC} text-mark`}>{group.group}</h3>
                <ul className="mt-8 grid border-t border-rule sm:grid-cols-2 sm:gap-x-gutter lg:grid-cols-3">
                  {group.items.map((item) => (
                    <li key={item.name} className="border-b border-rule py-5">
                      <p className="font-display text-base font-bold text-fg">{item.name}</p>
                      <p className={`${SPEC} mt-2 text-fg-faint`}>{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionFrame>

        {/* How it works — numbering is a real sequence here, not decoration. */}
        <SectionFrame
          surface="stock"
          id="how-it-works"
          padding="lg"
          ticket={{ number: service.number, label: "PROCESS", spec: "4 STEPS" }}
        >
          <Eyebrow spec="QUOTE → ARTWORK → PROOF → PRODUCTION">How it works</Eyebrow>

          <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
            Four steps, and you sign off before anything runs.
          </h2>

          <ol className="mt-16 grid gap-x-gutter gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {serviceProcess.map((step) => (
              <li key={step.step} className="border-t border-rule pt-6">
                <p className="font-utility text-2xl leading-none font-normal text-mark">
                  {step.step}
                </p>
                <h3 className="mt-6 font-display text-lg font-bold text-fg">{step.title}</h3>
                <p className="mt-4 text-sm text-fg-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </SectionFrame>

        {/* FAQ */}
        <SectionFrame
          surface="ink"
          id="faq"
          padding="lg"
          ticket={{ number: service.number, label: "FAQ", spec: "ASKED OFTEN" }}
        >
          <Eyebrow spec="STRAIGHT ANSWERS">FAQ</Eyebrow>

          <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            Questions we get asked
          </h2>

          <div className="mt-14 border-t border-rule">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-rule">
                <summary className="flex cursor-pointer list-none items-start gap-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-px w-4 shrink-0 origin-left bg-rule-strong transition-transform duration-[var(--dur-snap)] ease-press group-open:scale-x-[2.2] group-hover:bg-mark"
                  />
                  <h3 className="flex-1 font-display text-lg font-bold text-fg">{faq.question}</h3>
                  <span
                    aria-hidden="true"
                    className={`${SPEC} mt-[0.3em] shrink-0 text-fg-faint transition-transform duration-[var(--dur-snap)] group-open:rotate-45`}
                  >
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
          surface="stock"
          id="where-we-work"
          padding="lg"
          ticket={{ number: service.number, label: "SERVICE AREA", spec: "GTA" }}
        >
          <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow spec="MISSISSAUGA + GTA">Where we work</Eyebrow>
              <h2 className="mt-6 max-w-[20ch] font-display text-xl font-extrabold text-fg">
                {service.name} across the Greater Toronto Area.
              </h2>
              <p className="mt-6 max-w-[46ch] text-fg-muted">
                We produce everything at {site.address.streetAddress} in {site.address.locality} and
                deliver across the GTA. Pickup is always available if it is faster.
              </p>
              <div className="mt-10">
                <Button href="/packages" variant="outline" size="md">
                  See packages and prices
                </Button>
              </div>
            </div>

            <nav aria-label="Cities we serve" className="lg:col-span-7">
              <ul className="grid border-t border-rule sm:grid-cols-2 sm:gap-x-gutter">
                {cities.map((city) => (
                  <li key={city.slug} className="border-b border-rule">
                    <Link
                      href={`/service-areas#${city.slug}`}
                      className="block py-4 text-fg-muted transition-colors hover:text-fg sm:flex sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <span className="font-display text-base font-bold">
                        {service.name} in {city.name}
                      </span>
                      <span className={`${SPEC} mt-1 block text-fg-faint sm:mt-0 sm:shrink-0`}>
                        {city.region}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SectionFrame>

        <CallToAction />
      </main>

      <SiteFooter />
    </>
  );
}
