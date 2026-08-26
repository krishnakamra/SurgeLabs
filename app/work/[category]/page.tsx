import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoesWith } from "@/components/gallery/goes-with";
import { ProductGrid } from "@/components/gallery/product-grid";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { getService, site } from "@/content";
import { galleryCategories, getGalleryCategory, itemsInCategory } from "@/content/gallery";
import { portfolio } from "@/content/portfolio";
import { buildMetadata, galleryCategorySeo } from "@/lib/seo/page-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

type Params = { category: string };

const SPEC = "font-utility text-2xs uppercase tracking-utility";

export function generateStaticParams() {
  return galleryCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = getGalleryCategory(category);
  if (!found) return {};
  return buildMetadata({
    path: `/work/${found.slug}`,
    seo: galleryCategorySeo(found),
    ogEyebrow: "Mississauga + GTA",
  });
}

export default async function GalleryCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const found = getGalleryCategory(category);
  if (!found) notFound();

  const seo = galleryCategorySeo(found);
  const path = `/work/${found.slug}`;
  const items = itemsInCategory(found.slug);
  const service = getService(found.service);
  // Websites are the one category whose products are other people's live
  // sites rather than something photographed here, so they come from the
  // portfolio. Until that is filled the page says so instead of pretending.
  const isWebsites = found.slug === "websites";

  const graph = pageGraph([
    webPage({ path, name: seo.title, description: seo.description, type: "CollectionPage" }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
      { name: found.name, path },
    ]),
  ]);

  return (
    <>
      <Schema graph={graph} />
      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="md"
          ticket={{ number: "00", label: found.name.toUpperCase(), spec: "WHAT WE MAKE" }}
          className="overflow-hidden"
        >
          <HalftoneField plate="k" pitch={9} dot={1.6} opacity={0.15} fade="radial" seed={11} />
          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
              { name: found.name, path },
            ]}
          />
          <Eyebrow spec={site.serviceArea}>{found.name}</Eyebrow>
          <h1 className="mt-10 max-w-[20ch] font-display text-3xl font-extrabold text-fg">
            {seo.h1}
          </h1>
          <p className="mt-8 max-w-[60ch] text-md text-fg-muted">{found.intro}</p>

          {service ? (
            <p className="mt-10">
              <Link
                href={`/${service.slug}`}
                className={`${SPEC} text-link underline decoration-[length:var(--hairline)] underline-offset-[6px]`}
              >
                {service.name} — specs, turnaround and FAQs
              </Link>
            </p>
          ) : null}
        </SectionFrame>

        {isWebsites ? (
          portfolio.length > 0 ? (
            <PortfolioGrid
              surface="stock"
              ticketNumber="01"
              heading="Sites we built, live right now."
              standfirst="Open any of them. The line under each says exactly what we did on it — some we designed and built, some we rebuilt, and on a few we only did the search work."
            />
          ) : (
            <SectionFrame
              surface="stock"
              id="coming"
              padding="md"
              ticket={{ number: "01", label: "WEBSITES", spec: "BEING LOADED" }}
            >
              <h2 className="max-w-[24ch] font-display text-2xl font-extrabold text-fg">
                The site list is being loaded.
              </h2>
              <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
                We are getting written permission from each client before their site goes on this
                page, which takes a few days per site. Rather than fill the gap with stock images
                of websites nobody built, it is empty until they are real.
              </p>
              <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
                In the meantime the web page has what a build includes, what it costs and how long
                it takes, and you can phone and ask for examples in your trade.
              </p>
              <div className="mt-12 flex flex-wrap gap-6">
                <Button href="/web-design-seo" size="lg">
                  What a website includes
                </Button>
                <Button href={site.phoneHref} size="lg" variant="outline">
                  Call {site.phone}
                </Button>
              </div>
            </SectionFrame>
          )
        ) : (
          <SectionFrame
            surface="stock"
            id="products"
            padding="md"
            ticket={{ number: "01", label: found.name.toUpperCase(), spec: `${items.length} ITEMS` }}
          >
            <ProductGrid items={items} />

            <p className="mt-16 max-w-[58ch] border-t-[length:var(--hairline)] border-rule pt-8 text-sm text-fg-muted">
              Prices are in Canadian dollars and include delivery across the GTA. Anything marked
              &ldquo;quoted&rdquo; is quoted because it genuinely varies with the size, the count or
              the stock — send us the details and you get a number back in writing within one
              business day.
            </p>
          </SectionFrame>
        )}

        <GoesWith category={found} surface="ink" ticketNumber="02" />

        <SectionFrame
          surface="stock"
          padding="md"
          ticket={{ number: "03", label: "START A JOB", spec: "24H QUOTE" }}
        >
          <Eyebrow number="03" spec="MON–FRI 9–6">
            Start a job
          </Eyebrow>
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
            Tell us the job and we will price it.
          </h2>
          <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
            A photo of the old one is enough to start. You get a written quote back within one
            business day, with the specs written out so you can compare it to anyone else&rsquo;s.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <Button href="/quote" size="lg">
              Get a price in 24 hours
            </Button>
            <Button href={site.phoneHref} size="lg" variant="outline">
              Call {site.phone}
            </Button>
          </div>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
