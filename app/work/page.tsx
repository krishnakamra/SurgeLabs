import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { getCity, getService, site, work } from "@/content";
import { imageSrc, workStills } from "@/content/media";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

const PATH = "/work";
const seo = getPageSeo(PATH)!;

export const metadata: Metadata = buildMetadata({ path: PATH, seo, ogEyebrow: "Recent work" });

const SPEC = "font-utility text-2xs uppercase tracking-utility";

function graph() {
  return pageGraph([
    webPage({ path: PATH, name: seo.title, description: seo.description }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Work", path: PATH },
    ]),
  ]);
}

export default function WorkPage() {
  return (
    <>
      <Schema graph={graph()} />
      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "00", label: "WORK", spec: "RECENT JOBS" }}
          className="overflow-hidden"
        >
          <HalftoneField plate="k" pitch={9} dot={1.6} opacity={0.16} fade="radial" seed={7} />
          <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Work", path: PATH }]} />
          <Eyebrow spec={site.serviceArea}>Recent work</Eyebrow>
          <h1 className="mt-10 max-w-[20ch] font-display text-3xl font-extrabold text-fg">{seo.h1}</h1>
          <p className="mt-10 max-w-[60ch] text-md text-fg-muted">
            Every job below was made in our building on Skymark Ave. Each one says what was
            ordered, what it was printed or stitched on, and how long it took. We do not put a
            client&rsquo;s name on a page without asking them, so each entry gives the trade and
            the town instead.
          </p>
        </SectionFrame>

        {/* The website portfolio, if there is one. Renders nothing while
            content/portfolio.ts is empty — see docs/PORTFOLIO.md. */}
        <PortfolioGrid
          surface="stock"
          ticketNumber="01"
          heading="Websites, live right now."
          standfirst="Open any of them. The line under each says exactly what we did on it — some we designed and built, some we rebuilt, and on a few we only did the search work."
        />

        {/* One sheet per job, alternating beds so the page reads as a run of
            sheets coming off the press rather than a grid of cards. */}
        {work.map((item, index) => {
          const city = getCity(item.city);
          const surface = index % 2 === 0 ? "stock" : "ink";
          const still = workStills[item.slug];

          return (
            <SectionFrame
              key={item.slug}
              surface={surface}
              id={item.slug}
              padding="md"
              ticket={{ number: item.number, label: item.title.toUpperCase().slice(0, 22), spec: city?.name }}
            >
              {still ? (
                <div className="relative mb-14 aspect-[3/2] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken sm:aspect-[21/9]">
                  <Image
                    src={imageSrc(still)}
                    alt={still.alt}
                    fill
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className={`${SPEC} text-fg-faint`}>
                    <span className="text-accent-text">{item.number}</span>
                    <span className="mx-3 text-rule-strong">/</span>
                    {item.sector}
                    {city ? (
                      <>
                        <span className="mx-3 text-rule-strong">—</span>
                        {city.name}
                      </>
                    ) : null}
                  </p>

                  <h2 className="mt-8 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
                    {item.title}
                  </h2>

                  <p className="mt-8 max-w-[60ch] text-fg-muted">{item.brief}</p>

                  <ul className="mt-10 flex flex-wrap gap-3">
                    {item.services.map((slug) => {
                      const service = getService(slug);
                      if (!service) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/${service.slug}`}
                            className={`${SPEC} inline-flex border-[length:var(--hairline)] border-rule-strong px-4 py-2 text-fg transition-colors hover:border-fg hover:bg-fg hover:text-surface`}
                          >
                            {service.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <dl className="lg:col-span-5">
                  <dt className={`${SPEC} text-fg-faint`}>Made</dt>
                  <dd>
                    <ul className="mt-5 space-y-3">
                      {item.deliverables.map((line) => (
                        <li key={line} className="flex gap-4 text-sm text-fg-muted">
                          <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-4 shrink-0 bg-mark" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </dd>

                  <div className="mt-10 border-t-[length:var(--hairline)] border-rule pt-8">
                    <dt className={`${SPEC} text-fg-faint`}>Spec</dt>
                    <dd className="mt-3 text-sm text-fg">{item.spec}</dd>
                    <dt className={`${SPEC} mt-8 text-fg-faint`}>Turnaround</dt>
                    <dd className="mt-3 text-sm text-fg">{item.turnaround}</dd>
                  </div>
                </dl>
              </div>
            </SectionFrame>
          );
        })}

        <SectionFrame
          surface="ink"
          padding="lg"
          ticket={{ number: "09", label: "CONTACT", spec: "24H QUOTE" }}
        >
          <Eyebrow number="09" spec="MON–FRI 9–6">
            Start a job
          </Eyebrow>
          <h2 className="mt-8 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
            Yours would be next on the list.
          </h2>
          <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
            Tell us what you need — a photo of the old sign is enough to start — and you get a
            price in writing back within one business day.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <Button href="/quote" size="lg">
              Get a quote
            </Button>
            <Button href={site.phoneHref} size="lg" variant="outline">
              Call {site.phone}
            </Button>
          </div>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
