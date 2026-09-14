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
            /* The interim block, shown until portfolio.ts has entries.
               It describes the THREE SHAPES OF BUILD, not three jobs. That
               distinction is the whole point: content/work.ts is marked
               "ILLUSTRATIVE JOBS, NOT A CLIENT LIST", so recasting those
               entries as portfolio items here would turn placeholder copy
               into a claim about work that was done for someone. What a shop
               builds is a fact about the shop and needs nobody's permission;
               what it built for a named client needs theirs. */
            <SectionFrame
              surface="stock"
              id="what-we-build"
              padding="md"
              ticket={{ number: "01", label: "WEBSITES", spec: "WHAT WE BUILD" }}
            >
              <h2 className="max-w-[26ch] font-display text-2xl font-extrabold text-fg">
                Built here, launched fast, and yours.
              </h2>
              <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
                We build sites for trades, shops and studios across Mississauga and the GTA —
                designed, written and launched in-house, on the same ticket as your cards and
                signs. You own the site and the domain outright. No monthly fee to keep it online,
                and no rebuild needed the first time you want to change a price.
              </p>

              <ul className="mt-12 max-w-[58ch] space-y-6 border-t-[length:var(--hairline)] border-rule pt-8">
                <li className="text-md text-fg">
                  <span className="font-semibold">Five-page trade site.</span>{" "}
                  <span className="text-fg-muted">
                    Services, service area, gallery, about, contact — with a tap-to-call number on
                    every screen and a quote form that reaches a real inbox.
                  </span>
                </li>
                <li className="text-md text-fg">
                  <span className="font-semibold">Shopify store.</span>{" "}
                  <span className="text-fg-muted">
                    One set of stock across the till and the website, so what sells in the shop
                    stops being available online without anyone retyping it.
                  </span>
                </li>
                <li className="text-md text-fg">
                  <span className="font-semibold">One-page launch.</span>{" "}
                  <span className="text-fg-muted">
                    For a new business that needs to exist online this week: what you do, where
                    you are, and how to reach you, live in a few days.
                  </span>
                </li>
              </ul>

              <p className="mt-12 max-w-[58ch] text-sm text-fg-faint">
                Live client sites go up here as each owner confirms in writing that we can show
                theirs. We would rather this page were short than fill it with work that is not
                ours — ask on the phone and we will walk you through builds in your trade.
              </p>

              <div className="mt-12">
                <Button href="/quote?service=web-design-seo" size="lg">
                  Tell us what you need
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
