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
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Eyebrow, SectionFrame } from "@/components/ui";
import { cities, monthlyPlans, packages, pricingTerms, site } from "@/content";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { BUSINESS_ID, breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  path: "/packages",
  seo: getPageSeo("/packages")!,
  ogEyebrow: "2026 rates",
});

const AREA_SERVED = cities.map((city) => ({
  "@type": "City",
  name: city.name,
  address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
}));

/**
 * Each package is a Product carrying a single Offer — that is the shape that
 * actually earns a price in the result, since a fixed-price package has one
 * offer, not a range. Tiers published as a floor ("from $399") carry an
 * AggregateOffer with lowPrice instead, because Offer.price asserts an exact
 * amount and a floor is not one.
 *
 * The AggregateOffer at the top spans only the tiers that carry a number at
 * all. Quote-only tiers are deliberately outside it — see the filter below.
 */
function pricingSchema() {
  // Only the tiers that carry a published price. AggregateOffer's low/high
  // describe what is actually purchasable at a stated figure; a quote-only
  // tier has no price to span, and folding it in as 0 or as the tier below
  // would misstate the range Google prints in the result.
  const prices = packages
    .map((pkg) => pkg.price)
    .filter((price): price is number => price !== null);

  const seo = getPageSeo("/packages")!;

  return pageGraph([
    webPage({ path: "/packages", name: seo.title, description: seo.description, type: "CollectionPage" }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Packages and pricing", path: "/packages" },
    ]),
    // A Service, not a bare OfferCatalog. OfferCatalog is a subtype of
    // ItemList, which has neither `provider` nor `offers` — hanging the
    // AggregateOffer and the seller off it was invalid, and validators drop
    // properties a type does not define rather than guessing what was meant.
    // Service carries all three legitimately: who provides it, what the price
    // span is, and what is in the catalogue.
    {
      "@type": "Service",
      "@id": `${site.url}/packages#catalog`,
      name: "Surge Labs packages",
      description: "Web, print, signage and apparel packages for GTA businesses. Starting prices on the page from $99.",
      url: `${site.url}/packages`,
      serviceType: "Marketing, print and apparel packages",
      provider: { "@id": BUSINESS_ID },
      areaServed: AREA_SERVED,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "CAD",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability: "https://schema.org/InStock",
        areaServed: AREA_SERVED,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Packages",
        itemListElement: packages.map((pkg) => ({
          "@type": "Offer",
          itemOffered: { "@id": `${site.url}/packages#${pkg.slug}` },
        })),
      },
    },
    ...packages.map((pkg) => ({
      "@type": "Product",
      "@id": `${site.url}/packages#${pkg.slug}`,
      name: pkg.name,
      description: `${pkg.plain} ${pkg.bestFor}`,
      brand: { "@type": "Brand", name: site.name },
      category: "Marketing, print and apparel package",
      // Three shapes, because three things are true of these tiers and only
      // one of them is "the price is X".
      //
      //   no number      → no Offer node. An Offer whose `price` is null is
      //                    invalid, and inventing one would publish a figure
      //                    nobody is going to be charged.
      //   a floor        → AggregateOffer with lowPrice and NO highPrice.
      //                    This is the correct type for "from $399": Offer.price
      //                    asserts an exact amount, and Google prints it as one.
      //   a fixed price  → a plain Offer. Only the $99 cards.
      ...(pkg.price === null
        ? {}
        : {
            offers: pkg.priceFrom
              ? {
                  "@type": "AggregateOffer",
                  url: `${site.url}/packages#${pkg.slug}`,
                  lowPrice: pkg.price,
                  priceCurrency: "CAD",
                  availability: "https://schema.org/InStock",
                  areaServed: AREA_SERVED,
                  offerCount: 1,
                  seller: { "@id": BUSINESS_ID },
                }
              : {
                  "@type": "Offer",
                  url: `${site.url}/packages#${pkg.slug}`,
                  price: pkg.price,
                  priceCurrency: "CAD",
                  availability: "https://schema.org/InStock",
                  areaServed: AREA_SERVED,
                  seller: { "@id": BUSINESS_ID },
                },
          }),
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
        seller: { "@id": BUSINESS_ID },
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
  ]);
}

export default function PackagesPage() {
  return (
    <>
      <Schema graph={pricingSchema()} />

      {/* Space for the sticky bar so it never covers the last row of content. */}
      <main id="main" tabIndex={-1} className="pb-24 lg:pb-0">
        {/* Hero. No animation here — people came to read prices. */}
        <SectionFrame
          surface="ink"
          as="header"
          id="price-list"
          padding="lg"
          ticket={{ number: "01", label: "PRICE LIST", spec: "2026 RATES" }}
        >
          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Packages and pricing", path: "/packages" },
            ]}
          />
          <div className="mt-8">
            <Eyebrow spec="2026 INTRODUCTORY RATES">Price list</Eyebrow>
          </div>

          <h1 className="mt-10 max-w-[20ch] font-display text-3xl font-extrabold text-fg">
            {getPageSeo("/packages")!.h1}
          </h1>
          <p className="mt-6 max-w-[30ch] font-display text-xl font-bold text-fg-muted">
            Every package, every price, on this page.
          </p>

          <p className="mt-10 max-w-[58ch] text-md text-fg-muted">
            Five ways to start. The first is a hundred dollars and gets you a thousand designed
            business cards. The last is a custom quote for a whole rebrand. In between are the
            three most people take, which bundle the website, print and apparel work that tends
            to be needed at the same time.
          </p>

          <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
            Every figure on this page is a starting price except the cards, which are fixed.
            We quote each job, so what you see is the least a thing costs — send the details and
            the real number comes back in writing within one business day.
          </p>

          <ul className="mt-12 max-w-[58ch] space-y-2.5 border-t-[length:var(--hairline)] border-rule pt-8">
            {pricingTerms.map((term) => (
              <li key={term} className="flex gap-3 text-sm text-fg-muted">
                <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-3 shrink-0 bg-mark" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </SectionFrame>

        {/* Every package. Sideways on desktop, stacked everywhere else. */}
        <SectionFrame
          surface="stock"
          id="packages"
          padding="md"
          bleed
          cropMarks={false}
          ticket={{ number: "02", label: "PACKAGES", spec: `${packages.length} TICKETS` }}
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
