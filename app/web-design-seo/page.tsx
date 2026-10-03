import type { Metadata } from "next";
import { WebOfferHero } from "@/components/landing/web-offer-hero";
import { ServicePage } from "@/components/services/service-page";
import { getService } from "@/content";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";

const PATH = "/web-design-seo";
const service = getService("web-design-seo")!;
const seo = getPageSeo(PATH)!;

export const metadata: Metadata = buildMetadata({ path: PATH, seo, ogEyebrow: "Mississauga + GTA" });

export default function Page() {
  // The Google Ads campaign points here, so the first screen is the offer
  // the ad promised plus the form, not the service description. Everything
  // below the fold is the same page that ranks organically.
  return <ServicePage service={service} path={PATH} hero={<WebOfferHero h1={seo.h1} />} />;
}
