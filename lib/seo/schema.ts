import { cities, services, site } from "@/content";

type Node = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
export const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;

const areaServed = () =>
  cities.map((city) => ({
    "@type": "City",
    name: city.name,
    address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
  }));

/**
 * Sitewide identity. Emitted once, in the root layout, with stable @ids that
 * every page's Service and Offer nodes point back at — so Google resolves one
 * business across the whole site rather than treating each page as a separate
 * entity.
 *
 * ⚠️  OWNER: `sameAs` must list your real profiles. Google uses it to connect
 *     this site to the Google Business Profile, Facebook, Instagram and
 *     LinkedIn pages it already knows about, and an empty list means it has
 *     to guess. Fill these in — a wrong URL is worse than none, so they are
 *     left empty rather than invented.
 */
export const SAME_AS_TODO: string[] = [
  // "https://www.google.com/maps/place/?q=place_id:YOUR_PLACE_ID",
  // "https://www.facebook.com/YourPage",
  // "https://www.instagram.com/YourHandle",
  // "https://www.linkedin.com/company/YourCompany",
];

export function organisationGraph(): Node[] {
  const postal = {
    "@type": "PostalAddress",
    streetAddress: site.address.streetAddress,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
    addressCountry: site.address.country,
  };

  const hours = [
    ...site.openingHours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days,
      opens: entry.opens,
      closes: entry.closes,
    })),
    // Saturday is by appointment, which schema has no vocabulary for. Stating
    // fixed Saturday hours would be a claim the business does not make.
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "00:00", closes: "00:00", description: "By appointment" },
  ];

  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/og?title=Surge%20Labs`, width: 1200, height: 630 },
      email: site.email,
      telephone: "+1-905-598-3960",
      address: postal,
      ...(SAME_AS_TODO.length > 0 ? { sameAs: SAME_AS_TODO } : {}),
    },
    {
      "@type": "ProfessionalService",
      "@id": BUSINESS_ID,
      name: site.name,
      url: site.url,
      parentOrganization: { "@id": ORG_ID },
      image: `${site.url}/og?title=Surge%20Labs`,
      telephone: "+1-905-598-3960",
      email: site.email,
      address: postal,
      // Mississauga city centre, to roughly a block. Replace with the exact
      // coordinates from the Google Business Profile pin.
      geo: { "@type": "GeoCoordinates", latitude: 43.6205, longitude: -79.6376 },
      openingHoursSpecification: hours,
      areaServed: areaServed(),
      priceRange: "$$",
      currenciesAccepted: "CAD",
      knowsAbout: services.map((service) => service.name),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.summary,
            // The service pages live at the root, not under /services/ —
            // a catalogue URL that 404s is worse than no catalogue.
            url: `${site.url}/${service.slug}`,
          },
        })),
      },
      ...(SAME_AS_TODO.length > 0 ? { sameAs: SAME_AS_TODO } : {}),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.url,
      name: site.name,
      publisher: { "@id": ORG_ID },
      inLanguage: "en-CA",
      // No SearchAction. It was pointing at /service-areas?q={term}, which
      // renders that page and ignores the parameter entirely — there is no
      // search input anywhere on this site. A sitelinks searchbox that
      // silently drops the query is a worse result than no searchbox, and
      // declaring one you do not have is the kind of markup Google discounts
      // the rest of your structured data for. Add it back the day a real
      // search endpoint exists, not before.
    },
  ];
}

/**
 * The page itself, tied back to the sitewide entities. `isPartOf` and `about`
 * are what let Google treat 30-odd URLs as one business's site rather than
 * thirty unrelated documents.
 */
export function webPage({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
}): Node {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    "@type": type,
    "@id": `${url}#page`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    inLanguage: "en-CA",
  };
}

export function breadcrumbs(trail: [...Array<{ name: string; path: string }>, { name: string; path: string }]): Node {
  const last = trail[trail.length - 1]!;
  return {
    "@type": "BreadcrumbList",
    "@id": `${site.url}${last.path === "/" ? "" : last.path}#breadcrumbs`,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

export function faqPage(faqs: ReadonlyArray<{ question: string; answer: string }>, id: string): Node {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export type ArticleInput = {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  keywords: string[];
  image: string;
  wordCount: number;
  section: string;
};

/**
 * A blog post.
 *
 * `author` is a Person, not the Organization: Google's guidance on helpful
 * content leans on articles having a named human behind them, and pointing
 * the byline at the company is exactly the shape that reads as content
 * produced at scale by nobody.
 *
 * `publisher` and `isPartOf` reference the sitewide @ids so a post resolves
 * to the same business as every other page rather than floating free.
 */
export function article(input: ArticleInput): Node {
  const url = `${site.url}${input.path}`;
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    isPartOf: { "@id": `${url}#page` },
    mainEntityOfPage: { "@id": `${url}#page` },
    headline: input.headline,
    description: input.description,
    url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    // No `url` on the Person: there is no author page on this site yet, and
    // a sameAs pointing at a 404 is worse than an unlinked name.
    author: { "@type": "Person", name: input.authorName },
    publisher: { "@id": ORG_ID },
    image: [`${site.url}${input.image}`],
    keywords: input.keywords.join(", "),
    articleSection: input.section,
    wordCount: input.wordCount,
    inLanguage: "en-CA",
  };
}

export type VideoInput = {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  /** ISO 8601, e.g. PT12S. */
  duration: string;
  uploadDate: string;
};

/**
 * For the Higgsfield hero loops. Nothing calls this yet because no video
 * exists — when one lands, pass it here rather than hand-writing the node,
 * so the required fields cannot be half-filled.
 */
export function videoObject(video: VideoInput): Node {
  return {
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: [video.thumbnailUrl],
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    duration: video.duration,
    publisher: { "@id": ORG_ID },
  };
}

/** Wraps nodes into the single graph a page emits. */
export function graph(nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * What every page actually renders: one graph, sitewide identity first, then
 * the nodes specific to this URL.
 *
 * The identity nodes are repeated per page rather than mounted once in the
 * root layout, so that every page carries a self-contained graph whose
 * internal @id references all resolve. Google reads one page at a time; a
 * Service node pointing at a business defined in a different document is a
 * dangling reference.
 */
export function pageGraph(nodes: Node[]) {
  return graph([...organisationGraph(), ...nodes]);
}
