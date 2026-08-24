import type { Metadata } from "next";
import { ServicePage } from "@/components/services/service-page";
import { getService, site } from "@/content";

const SLUG = "printing-signage";
const service = getService(SLUG)!;

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: service.metaTitle,
    description: service.metaDescription,
    url: `${site.url}/${SLUG}`,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
  },
};

export default function Page() {
  return <ServicePage service={service} />;
}
