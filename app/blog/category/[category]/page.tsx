import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { site } from "@/content";
import { getCategory, liveCategories, postsInCategory, type CategorySlug } from "@/content/posts";
import { buildMetadata } from "@/lib/seo/page-seo";
import { categorySeo } from "@/lib/seo/blog-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

type Params = { category: string };

export const dynamicParams = false;

/** Only categories with posts in them. An empty category page is a thin page
 *  with a heading and nothing under it, which is worse than a 404. */
export function generateStaticParams(): Params[] {
  return liveCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) return {};
  return buildMetadata({
    path: `/blog/category/${category}`,
    seo: categorySeo(found),
    ogEyebrow: "Guides",
  });
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  const items = postsInCategory(found.slug as CategorySlug);
  const seo = categorySeo(found);
  const path = `/blog/category/${found.slug}`;

  const graph = pageGraph([
    {
      ...webPage({ path, name: seo.title, description: seo.description, type: "CollectionPage" }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: items.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: `${site.url}/blog/${post.slug}`,
        })),
      },
    },
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/blog" },
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
          padding="lg"
          ticket={{ number: "01", label: found.name.toUpperCase(), spec: `${items.length} ARTICLES` }}
          className="overflow-hidden"
        >
          <HalftoneField plate="y" pitch={9} dot={1.7} opacity={0.14} seed={53} fade="radial" />

          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Guides", path: "/blog" },
              { name: found.name, path },
            ]}
          />
          <div className="mt-8">
            <Eyebrow spec="GUIDES">{found.name}</Eyebrow>
          </div>

          <h1 className="mt-10 max-w-[22ch] font-display text-3xl font-extrabold text-fg">
            {seo.h1}
          </h1>
          <p className="mt-6 max-w-[58ch] text-md text-fg-muted">{found.blurb}</p>
        </SectionFrame>

        <SectionFrame surface="stock" padding="lg" id="articles" ticket={{ number: "02", label: "ARTICLES", spec: "NEWEST FIRST" }}>
          <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-2">
            {items.map((post, index) => (
              <PostCard key={post.slug} post={post} number={String(index + 1).padStart(2, "0")} image />
            ))}
          </div>
        </SectionFrame>

        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
