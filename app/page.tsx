import type { Metadata } from "next";
import {
  CallToAction,
  Hero,
  Industries,
  PackagesTeaser,
  Proof,
  Services,
  SiteFooter,
  Split,
  Testimonials,
} from "@/components/sections";
import { cities, services, site } from "@/content";

export const metadata: Metadata = {
  title: "Surge Labs — web, print and custom apparel in Mississauga",
  description:
    "Websites, local SEO, printing, signage and custom apparel from one Mississauga shop. One team, one invoice, serving Mississauga and the GTA. Quotes in 24 hours.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Surge Labs — web, print and custom apparel in Mississauga",
    description:
      "Websites, local SEO, printing, signage and custom apparel from one Mississauga shop. One team, one invoice.",
    url: site.url,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
  },
};

/**
 * LocalBusiness schema.
 *
 * streetAddress is only emitted once content/site.ts carries one. A schema
 * block asserting a wrong or blank address is worse for local ranking than
 * one that describes a service-area business honestly.
 */
function localBusinessSchema() {
  const { address } = site;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      ...(address.streetAddress ? { streetAddress: address.streetAddress } : {}),
      addressLocality: address.locality,
      addressRegion: address.region,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: address.country,
    },
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: city.name,
      address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
    })),
    openingHoursSpecification: site.openingHours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days,
      opens: entry.opens,
      closes: entry.closes,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.summary,
          url: `${site.url}/services/${service.slug}`,
        },
      })),
    },
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <main>
        <Hero />
        <Split />
        <Services />
        <Proof />
        <PackagesTeaser />
        <Industries />
        <Testimonials />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
