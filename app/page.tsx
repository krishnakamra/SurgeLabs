import type { Metadata } from "next";
import {
  CallToAction,
  Hero,
  Industries,
  PackagesTeaser,
  Proof,
  RecentWork,
  Services,
  SiteFooter,
  Split,
  Testimonials,
} from "@/components/sections";
import { SectionSnap } from "@/components/motion";
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
      <SectionSnap />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Split />
        <Services />
        <Proof />
        <PackagesTeaser />
        <Industries />
        {/* Testimonials is gated on real, attributed reviews and renders
            nothing until content/testimonials.ts has them. RecentWork holds
            the slot in the meantime — see the note in that component. Both
            can run together once the reviews land. */}
        <RecentWork />
        <Testimonials />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
