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
import { Schema } from "@/components/seo/schema";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { pageGraph, webPage } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  path: "/",
  seo: getPageSeo("/")!,
  ogEyebrow: "Mississauga + GTA",
});

function homeGraph() {
  const seo = getPageSeo("/")!;
  return pageGraph([
    webPage({ path: "/", name: seo.title, description: seo.description }),
  ]);
}

export default function HomePage() {
  return (
    <>
      <Schema graph={homeGraph()} />
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
