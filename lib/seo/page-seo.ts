import type { Metadata } from "next";
import { site } from "@/content";

export type PageSeo = {
  /** ≤60 chars, primary keyword first, "| Surge Labs" suffix. */
  title: string;
  /** ≤155 chars, carries a CTA and the phone number where it fits. */
  description: string;
  /** The H1 the page renders. Kept here so the keyword check can see it. */
  h1: string;
};

const SUFFIX = " | Surge Labs";
const PHONE = site.phone;

/**
 * Title, description and H1 for every fixed route, in one place.
 *
 * Pages render `h1` from here rather than hardcoding it, which is what makes
 * scripts/check-seo.mjs a real gate: it asserts against the same string the
 * page puts on screen, not a copy of it that can drift.
 */
export const pageSeo: Record<string, PageSeo> = {
  "/": {
    title: `Web Design & Printing in Mississauga${SUFFIX}`,
    description: `Websites, SEO, print, signage and custom apparel from one Mississauga shop. One team, one invoice. Call ${PHONE} for a quote in 24 hours.`,
    // The brand line the owner specified. See the h1Exempt note in
    // content/keywords.ts — the primary keyword is carried by the title and
    // the standfirst instead.
    h1: "We print, code and stitch your brand into existence.",
  },
  "/packages": {
    title: `Packages & Pricing in Mississauga${SUFFIX}`,
    description: `Web, print and apparel packages from $899, priced on the page. Monthly plans from $399, GTA delivery included. Call ${PHONE}.`,
    h1: "Packages and pricing in Mississauga",
  },
  "/quote": {
    title: `Request a Quote in Mississauga${SUFFIX}`,
    description: `Tell us the job in four steps and get a written quote back within one business day. Web, print, signage and apparel. Call ${PHONE}.`,
    h1: "Request a quote in Mississauga",
  },
  "/service-areas": {
    title: `Service Areas Across the GTA${SUFFIX}`,
    description: `Web, print, signage and custom apparel delivered across the GTA from our Mississauga shop. See every city we cover, or call ${PHONE}.`,
    h1: "Service areas across the GTA",
  },
  "/web-design-seo": {
    title: `Web Design & SEO in Mississauga${SUFFIX}`,
    description: `Web design, local SEO and Shopify builds in Mississauga. Five-page sites in 2–3 weeks, you own the code. Call ${PHONE} for a quote.`,
    h1: "Custom web design and SEO in Mississauga",
  },
  "/printing-signage": {
    title: `Printing & Signage in Mississauga${SUFFIX}`,
    description: `Business cards, banners, lawn signs and vehicle lettering, printed in Mississauga. Same-day rush on stocked items. Call ${PHONE}.`,
    h1: "Commercial printing and signage in Mississauga",
  },
  "/custom-apparel": {
    title: `Custom Apparel in Mississauga${SUFFIX}`,
    description: `Embroidery, DTF and screen printing in Mississauga. No minimum on DTF, 24-piece minimum on screen printing. Call ${PHONE} for a quote.`,
    h1: "Custom apparel, embroidery and screen printing in Mississauga",
  },
};

export function getPageSeo(path: string): PageSeo | undefined {
  return pageSeo[path];
}

/** SEO for a local service × city page, derived so it cannot go missing. */
export function localSeo(serviceName: string, cityName: string, blurb: string): PageSeo {
  const title = `${serviceName} in ${cityName}${SUFFIX}`;
  return {
    title,
    description: `${serviceName} in ${cityName}, produced in Mississauga and delivered across the GTA. ${blurb} Call ${PHONE}.`.slice(0, 155),
    h1: `${serviceName} in ${cityName}`,
  };
}

export type MetadataInput = {
  /** Route path, leading slash, no trailing slash. Drives the canonical. */
  path: string;
  seo: PageSeo;
  /** Overline shown above the title on the generated OG image. */
  ogEyebrow?: string;
  /** Set false on pages that should stay out of the index. */
  index?: boolean;
};

/**
 * Every route's metadata comes through here, so canonical, Open Graph,
 * Twitter and the generated OG image can never be forgotten on one page and
 * present on the rest.
 */
export function buildMetadata({ path, seo, ogEyebrow, index = true }: MetadataInput): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const ogImage = `/og?title=${encodeURIComponent(seo.h1)}&eyebrow=${encodeURIComponent(ogEyebrow ?? site.address.locality)}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: false, nocache: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: site.name,
      locale: "en_CA",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: seo.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}
