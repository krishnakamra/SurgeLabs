import type { Metadata } from "next";
import Link from "next/link";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import {
  cities,
  getCity,
  getLocalService,
  liveCities,
  localPages,
  site,
} from "@/content";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

export const metadata: Metadata = buildMetadata({
  path: "/service-areas",
  seo: getPageSeo("/service-areas")!,
  ogEyebrow: "Greater Toronto Area",
});

export default function ServiceAreasPage() {
  const live = liveCities();
  const covered = cities.filter((city) => !live.includes(city.slug));

  const seo = getPageSeo("/service-areas")!;
  const schema = pageGraph([
    {
      ...webPage({
        path: "/service-areas",
        name: seo.title,
        description: seo.description,
        type: "CollectionPage",
      }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: localPages.map((page, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${getLocalService(page.service)?.name} in ${getCity(page.city)?.name}`,
          url: `${site.url}/${page.service}/${page.city}`,
        })),
      },
    },
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Service areas", path: "/service-areas" },
    ]),
  ]);

  return (
    <>
      <Schema graph={schema} />

      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "01", label: "SERVICE AREAS", spec: "GTA" }}
          className="overflow-hidden"
        >
          <HalftoneField plate="c" pitch={9} dot={1.7} opacity={0.16} seed={57} fade="radial" />
          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Service areas", path: "/service-areas" },
            ]}
          />
          <div className="mt-8">
            <Eyebrow spec={`${localPages.length} PAGES · ${live.length} CITIES`}>Service areas</Eyebrow>
          </div>
          <h1 className="mt-10 max-w-[18ch] font-display text-3xl font-normal text-fg">
            {getPageSeo("/service-areas")!.h1}
          </h1>
          <p className="mt-6 max-w-[34ch] font-display text-xl font-medium text-fg-muted">
            Where we work, and what we have written about it.
          </p>
          <p className="mt-10 max-w-[58ch] text-md text-fg-muted">
            Everything is produced at {site.address.streetAddress} in {site.address.locality} and
            delivered across the Greater Toronto Area. The cities below have pages because we had
            something specific to say about working there — not because a template could fill in
            the name.
          </p>
        </SectionFrame>

        {live.map((citySlug, index) => {
          const city = getCity(citySlug)!;
          const pages = localPages.filter((page) => page.city === citySlug);

          return (
            <SectionFrame
              key={citySlug}
              surface={index % 2 === 0 ? "stock" : "ink"}
              id={citySlug}
              padding="md"
              ticket={{ number: String(index + 2).padStart(2, "0"), label: city.name.toUpperCase(), spec: `${pages.length} PAGES` }}
            >
              <div className="grid gap-x-gutter gap-y-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 className="font-display text-2xl font-normal text-fg">{city.name}</h2>
                  <p className={`${SPEC} mt-4 text-fg-faint`}>{city.region}</p>
                </div>

                <nav aria-label={`Services in ${city.name}`} className="lg:col-span-8">
                  <ul className="grid border-t-[length:var(--hairline)] border-rule sm:grid-cols-2 sm:gap-x-gutter">
                    {pages.map((page) => {
                      const service = getLocalService(page.service)!;
                      return (
                        <li key={page.service} className="border-b-[length:var(--hairline)] border-rule">
                          <Link
                            href={`/${page.service}/${page.city}`}
                            className="block py-4 text-fg-muted transition-colors hover:text-fg"
                          >
                            <span className="font-display text-base font-medium">
                              {service.name} in {city.name}
                            </span>
                            <span className={`${SPEC} mt-1 block text-fg-faint`}>{service.blurb}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </SectionFrame>
          );
        })}

        {/* Honest about the rest: we deliver there, we have not written pages. */}
        <SectionFrame
          surface="stock"
          id="also-delivering"
          padding="lg"
          ticket={{ number: "99", label: "ALSO DELIVERING", spec: "NO PAGE YET" }}
        >
          <Eyebrow spec="DELIVERED, NOT YET WRITTEN ABOUT">Also delivering to</Eyebrow>
          <h2 className="mt-6 max-w-[26ch] font-display text-xl font-normal text-fg">
            We deliver here too. There is just no page yet.
          </h2>
          <p className="mt-6 max-w-[58ch] text-fg-muted">
            These are inside our delivery area and always have been. They do not have their own
            pages because we have not written anything about them worth reading — and putting up a
            page with the city name swapped in would be worse than having none. Call and ask; the
            answer is yes.
          </p>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t-[length:var(--hairline)] border-rule pt-8">
            {covered.map((city) => (
              <li key={city.slug} className={`${SPEC} text-fg-muted`}>
                {city.name}
              </li>
            ))}
          </ul>
        </SectionFrame>

        <CallToAction />
      </main>

      <SiteFooter />
    </>
  );
}
