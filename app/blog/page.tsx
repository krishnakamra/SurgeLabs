import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { site } from "@/content";
import { liveCategories, posts, postsInCategory } from "@/content/posts";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

export const metadata: Metadata = buildMetadata({
  path: "/blog",
  seo: getPageSeo("/blog")!,
  ogEyebrow: "Notes from the shop",
});

function blogGraph() {
  const seo = getPageSeo("/blog")!;
  return pageGraph([
    {
      ...webPage({ path: "/blog", name: seo.title, description: seo.description, type: "Blog" }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
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
    ]),
  ]);
}

export default function BlogIndexPage() {
  const seo = getPageSeo("/blog")!;
  const cats = liveCategories();

  return (
    <>
      <Schema graph={blogGraph()} />

      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "01", label: "GUIDES", spec: `${posts.length} ARTICLES` }}
          className="overflow-hidden"
        >
          <HalftoneField plate="c" pitch={9} dot={1.7} opacity={0.16} seed={41} fade="radial" />

          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Guides", path: "/blog" },
            ]}
          />
          <div className="mt-8">
            <Eyebrow spec={site.serviceArea}>Guides</Eyebrow>
          </div>

          <h1 className="mt-10 max-w-[20ch] font-display text-3xl font-extrabold text-fg">
            {seo.h1}
          </h1>
          <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
            Prices, specs and file rules, written down so you can check them before you order.
            Where a figure is an indicative range rather than a quote, the page says so on the
            table it appears in.
          </p>
        </SectionFrame>

        <SectionFrame surface="stock" padding="lg" id="categories" ticket={{ number: "02", label: "CATEGORIES", spec: `${cats.length} SECTIONS` }}>
          <Eyebrow spec="BY SUBJECT">Categories</Eyebrow>
          <ul className="mt-10 grid gap-x-gutter gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((category) => (
              <li key={category.slug} className="group relative border-t border-rule pt-5">
                <p className={`${SPEC} text-fg-faint`}>
                  {postsInCategory(category.slug).length} article
                  {postsInCategory(category.slug).length === 1 ? "" : "s"}
                </p>
                <h2 className="mt-3 font-display text-lg font-bold text-fg">
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
                  >
                    {category.name}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{category.blurb}</p>
              </li>
            ))}
          </ul>
        </SectionFrame>

        <SectionFrame surface="stock" padding="lg" id="all" ticket={{ number: "03", label: "ALL GUIDES", spec: "NEWEST FIRST" }}>
          <Eyebrow spec="NEWEST FIRST">Every guide</Eyebrow>
          <div className="mt-10 grid gap-x-gutter gap-y-12 lg:grid-cols-2">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} number={String(index + 1).padStart(2, "0")} />
            ))}
          </div>
        </SectionFrame>

        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
