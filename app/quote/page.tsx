import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/quote-form";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { packages, site } from "@/content";

export const metadata: Metadata = {
  title: "Get a quote in 24 hours | Surge Labs, Mississauga",
  description:
    "Tell us the job and get a written quote back within one business day. Web, print, signage and custom apparel from one Mississauga shop, delivered across the GTA.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Get a quote in 24 hours | Surge Labs",
    description: "Build a job ticket in four steps. Written quote back within one business day.",
    url: `${site.url}/quote`,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
  },
};

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
      <main>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "01", label: "QUOTE", spec: "24HR TURNAROUND" }}
          className="overflow-hidden"
        >
          <HalftoneField plate="m" pitch={9} dot={1.7} opacity={0.18} seed={71} fade="radial" />
          <Eyebrow spec="FOUR STEPS">Get a quote</Eyebrow>
          <h1 className="mt-10 max-w-[18ch] font-display text-3xl font-extrabold text-fg">
            Build the ticket. We price it in a day.
          </h1>
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
