import type { Metadata } from "next";
import { HorizontalPanels } from "@/components/motion";
import {
  AlaCarteTable,
  ComparisonMatrix,
  MobilePackageBar,
  MonthlyPlans,
  PackagePanel,
} from "@/components/packages";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Eyebrow, SectionFrame } from "@/components/ui";
import { cities, monthlyPlans, packages, pricingTerms, site } from "@/content";

export const metadata: Metadata = {
  title: "Packages and pricing — Surge Labs, Mississauga",
  description:
    "Web, print and apparel packages from $899. Launch Kit, Momentum Kit, Storefront Kit and Full Surge, plus monthly SEO and social plans from $399. Prices include GTA delivery.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Packages and pricing — Surge Labs",
    description:
      "Web, print and apparel packages from $899, priced on the page. Mississauga and the GTA.",
    url: `${site.url}/packages`,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
  },
};

const AREA_SERVED = cities.map((city) => ({
  "@type": "City",
  name: city.name,
  address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
}));

/**
 * Each package is a Product carrying a single Offer — that is the shape that
 * actually earns a price in the result, since a fixed-price package has one
 * offer, not a range. The AggregateOffer sits once at the top and describes
 * the real span of the list, $899 to $6,999, which is what an AggregateOffer
 * is for.
 */
function pricingSchema() {
  const prices = packages.map((pkg) => pkg.price);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        "@id": `${site.url}/packages#catalog`,
        name: "Surge Labs packages",
        url: `${site.url}/packages`,
        provider: { "@id": `${site.url}/#business` },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "CAD",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: packages.length,
          availability: "https://schema.org/InStock",
          areaServed: AREA_SERVED,
        },
      },
      ...packages.map((pkg) => ({
        "@type": "Product",
        "@id": `${site.url}/packages#${pkg.slug}`,
        name: pkg.name,
        description: `${pkg.tagline} ${pkg.bestFor}`,
        brand: { "@type": "Brand", name: site.name },
        category: "Marketing, print and apparel package",
        offers: {
          "@type": "Offer",
          url: `${site.url}/packages#${pkg.slug}`,
          price: pkg.price,
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          areaServed: AREA_SERVED,
          seller: { "@id": `${site.url}/#business` },
        },
      })),
      ...monthlyPlans.map((plan) => ({
        "@type": "Product",
        "@id": `${site.url}/packages#${plan.slug}`,
        name: `${plan.name} plan`,
        description: plan.bestFor,
        brand: { "@type": "Brand", name: site.name },
        offers: {
          "@type": "Offer",
          url: `${site.url}/packages#${plan.slug}`,
          price: plan.price,
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          areaServed: AREA_SERVED,
          seller: { "@id": `${site.url}/#business` },
          // A monthly plan is a subscription, not a one-off purchase.
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: plan.price,
            priceCurrency: "CAD",
            billingIncrement: 1,
            unitCode: "MON",
          },
        },
      })),
    ],
  };
}

export default function PackagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema()) }}
      />

      {/* Space for the sticky bar so it never covers the last row of content. */}
      <main className="pb-24 lg:pb-0">
        {/* Hero. No animation here — people came to read prices. */}
        <SectionFrame
          surface="ink"
          as="header"
          id="price-list"
          padding="lg"
          ticket={{ number: "01", label: "PRICE LIST", spec: "2026 RATES" }}
        >
          <Eyebrow spec="2026 INTRODUCTORY RATES">Price list</Eyebrow>

          <h1 className="mt-10 max-w-[20ch] font-display text-3xl font-extrabold text-fg">
            Every package, every price, on this page.
          </h1>

          <p className="mt-10 max-w-[58ch] text-md text-fg-muted">
            Four packages that bundle the web, print and apparel work most businesses need at the
            same time, plus monthly plans for the work that never really finishes. If you only want
            one thing, the rates for single items are at the bottom.
          </p>

          <ul className="mt-12 max-w-[58ch] space-y-2.5 border-t border-rule pt-8">
            {pricingTerms.map((term) => (
              <li key={term} className="flex gap-3 text-sm text-fg-muted">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-mark" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </SectionFrame>

        {/* The four packages. Sideways on desktop, stacked everywhere else. */}
        <SectionFrame
          surface="stock"
          id="packages"
          padding="md"
          bleed
          cropMarks={false}
          ticket={{ number: "02", label: "PACKAGES", spec: "4 TICKETS" }}
          className="bg-surface"
        >
          <div className="mx-auto w-full max-w-page px-gutter motion-ready:lg:hidden">
            <Eyebrow number="02" spec="ONE-TIME BUILDS">
              Packages
            </Eyebrow>
          </div>

          <div className="mt-10 px-gutter motion-ready:lg:mt-0 motion-ready:lg:px-0">
            <HorizontalPanels count={packages.length} panelWidth="min(80vw,46rem)">
              {packages.map((pkg, index) => (
                <PackagePanel
                  key={pkg.slug}
                  pkg={pkg}
                  index={index}
                  total={packages.length}
                />
              ))}
            </HorizontalPanels>
          </div>
        </SectionFrame>

        {/* Comparison. */}
        <SectionFrame
          surface="ink"
          id="compare"
          padding="lg"
          ticket={{ number: "03", label: "COMPARE", spec: "REAL NUMBERS" }}
        >
          <Eyebrow number="03" spec="NO STAR RATINGS">
            Side by side
          </Eyebrow>
          <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            What you actually get, counted.
          </h2>
          <div className="mt-14">
            <ComparisonMatrix />
          </div>
        </SectionFrame>

        {/* Monthly plans — quieter, on paper. */}
        <SectionFrame
          surface="stock"
          id="monthly"
          padding="lg"
          ticket={{ number: "04", label: "MONTHLY", spec: "ONGOING WORK" }}
        >
          <Eyebrow number="04" spec="CANCEL WITH 30 DAYS NOTICE">
            Monthly plans
          </Eyebrow>
          <h2 className="mt-6 max-w-[26ch] font-display text-2xl font-extrabold text-fg">
            For the work that never really finishes.
          </h2>
          <p className="mt-6 max-w-[58ch] text-fg-muted">
            SEO, social and reporting run month to month. They pair with any package above, or
            stand on their own if your site is already built.
          </p>
          <div className="mt-14">
            <MonthlyPlans />
          </div>
        </SectionFrame>

        {/* Single items. */}
        <SectionFrame
          surface="ink"
          id="a-la-carte"
          padding="lg"
          ticket={{ number: "05", label: "SINGLE ITEMS", spec: "NO BUNDLE" }}
        >
          <Eyebrow number="05" spec="ONE THING AT A TIME">
            Single items
          </Eyebrow>
          <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            Only need one thing? Buy one thing.
          </h2>
          <div className="mt-14">
            <AlaCarteTable />
          </div>
        </SectionFrame>

        <CallToAction />
      </main>

      <SiteFooter />
      <MobilePackageBar />
    </>
  );
}
