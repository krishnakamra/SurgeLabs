import type { Metadata } from "next";
import { ServicePage } from "@/components/services/service-page";
import { getService } from "@/content";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";

const PATH = "/printing-signage";
const service = getService("printing-signage")!;
const seo = getPageSeo(PATH)!;

export const metadata: Metadata = buildMetadata({ path: PATH, seo, ogEyebrow: "Mississauga + GTA" });

export default function Page() {
  return <ServicePage service={service} path={PATH} />;
}
