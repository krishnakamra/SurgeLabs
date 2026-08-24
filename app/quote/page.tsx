import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/quote-form";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { packages, site } from "@/content";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { BUSINESS_ID, breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  path: "/quote",
  seo: getPageSeo("/quote")!,
  ogEyebrow: "24-hour turnaround",
});

/**
 * Both the service pages and the local pages link here with ?service=, using
 * their own slugs. Map those onto the form's branches so arriving from
 * "Business cards in Mississauga" pre-selects Print rather than starting cold.
 */
const SERVICE_TO_NEED: Record<string, string> = {
  "web-design": "website",
  "web-design-seo": "website",
  seo: "seo",
  "business-cards": "print",
  flyers: "print",
  "printing-signage": "print",
  banners: "signage",
  signage: "signage",
  "vehicle-graphics": "signage",
  "trade-show-displays": "signage",
  "custom-apparel": "apparel",
  embroidery: "apparel",
};

function quoteGraph() {
  const seo = getPageSeo("/quote")!;
  return pageGraph([
    {
      ...webPage({ path: "/quote", name: seo.title, description: seo.description, type: "ContactPage" }),
      // The one action this page exists for. Google surfaces it as a quote
      // entry point rather than treating the page as another content URL.
      potentialAction: {
        "@type": "CommunicateAction",
        name: "Request a quote",
        target: { "@type": "EntryPoint", urlTemplate: `${site.url}/quote`, actionPlatform: "https://schema.org/DesktopWebPlatform" },
        recipient: { "@id": BUSINESS_ID },
      },
    },
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Get a quote", path: "/quote" },
    ]),
  ]);
}

/**
 * The one route in the site that is not prerendered, and deliberately so.
 *
 * Service and local pages link here as /quote?service=business-cards&city=
 * mississauga, and reading that on the server is what lets step 1 arrive
 * already answered. The alternatives both cost more than the render does:
 * a Suspense boundary around the form leaves the prerendered HTML without a
 * form in it, and applying the preselection after hydration pops the chosen
 * package banner into the layout a frame late, which books CLS on the
 * primary conversion page.
 *
 * Every variant canonicalises to /quote (see buildMetadata), so the query
 * strings never become indexable duplicates.
 */
export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (key: string): string | null => {
    const value = params[key];
    return typeof value === "string" ? value : Array.isArray(value) ? (value[0] ?? null) : null;
  };

  const packageSlug = first("package");
  const validPackage = packages.some((p) => p.slug === packageSlug) ? packageSlug : null;

  const serviceParam = first("service");
  const preselected = serviceParam && SERVICE_TO_NEED[serviceParam] ? [SERVICE_TO_NEED[serviceParam]!] : [];
  const cityParam = first("city");
  const source = [serviceParam, cityParam].filter(Boolean).join("/") || null;

  return (
    <>
      <Schema graph={quoteGraph()} />

      <main>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "01", label: "QUOTE", spec: "24HR TURNAROUND" }}
          className="overflow-hidden"
        >
          <HalftoneField plate="m" pitch={9} dot={1.7} opacity={0.18} seed={71} fade="radial" />
          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Get a quote", path: "/quote" },
            ]}
          />
          <div className="mt-8">
            <Eyebrow spec="FOUR STEPS">Get a quote</Eyebrow>
          </div>
          <h1 className="mt-10 max-w-[18ch] font-display text-3xl font-extrabold text-fg">
            {getPageSeo("/quote")!.h1}
          </h1>
          <p className="mt-6 max-w-[26ch] font-display text-xl font-bold text-fg-muted">
            Build the ticket. We price it in a day.
          </p>
          <p className="mt-10 max-w-[56ch] text-md text-fg-muted">
            The questions below are the ones we actually have to answer before anyone can quote the
            job. Answer what you know and leave the rest — the sheet on the right fills in as you go,
            and it is the same sheet that reaches the shop floor.
          </p>
        </SectionFrame>

        <SectionFrame
          surface="stock"
          id="form"
          padding="lg"
          ticket={{ number: "02", label: "JOB TICKET", spec: "IN PROGRESS" }}
        >
          <QuoteForm initialPackage={validPackage} initialNeeds={preselected} source={source} />
        </SectionFrame>

        <CallToAction />
      </main>

      <SiteFooter />
    </>
  );
}
