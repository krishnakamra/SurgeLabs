import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Byline } from "@/components/blog/byline";
import { mdxComponents } from "@/components/blog/mdx";
import { PostCard } from "@/components/blog/post-card";
import { TableOfContents } from "@/components/blog/toc";
import { CallToAction, SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { site } from "@/content";
import { categories, getPost, posts, relatedPosts } from "@/content/posts";
import { extractHeadings } from "@/lib/blog/headings";
import { buildMetadata } from "@/lib/seo/page-seo";
import { article, breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

type Params = { slug: string };

/** Only the posts that exist. A slug with no file 404s rather than rendering
 *  an empty article shell on demand. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const meta = buildMetadata({
    path: `/blog/${slug}`,
    seo: {
      title: `${post.metaTitle} | ${site.name}`,
      description: post.description,
      h1: post.title,
    },
    ogEyebrow: categories[post.category].name,
  });

  // Article dates belong in the OpenGraph object too, not only in JSON-LD —
  // it is what social cards and some aggregators read.
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      section: categories[post.category].name,
      tags: post.keywords,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const category = categories[post.category];
  const headings = extractHeadings(post.body);
  const related = relatedPosts(post);
  const path = `/blog/${post.slug}`;
  const ogImage =
    post.ogImage ?? `/og?title=${encodeURIComponent(post.title)}&eyebrow=${encodeURIComponent(category.name)}`;

  const graph = pageGraph([
    webPage({ path, name: post.metaTitle, description: post.description }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/blog" },
      { name: category.name, path: `/blog/category/${category.slug}` },
      { name: post.title, path },
    ]),
    article({
      path,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated,
      authorName: post.author,
      keywords: post.keywords,
      image: ogImage,
      wordCount: post.wordCount,
      section: category.name,
    }),
  ]);

  return (
    <>
      <Schema graph={graph} />

      <main>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "01", label: category.name.toUpperCase(), spec: `${post.readingMinutes} MIN READ` }}
          className="overflow-hidden"
        >
          <HalftoneField plate="m" pitch={9} dot={1.7} opacity={0.14} seed={29} fade="radial" />

          <Breadcrumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "Guides", path: "/blog" },
              { name: category.name, path: `/blog/category/${category.slug}` },
            ]}
          />
          <div className="mt-8">
            <Eyebrow spec={category.name}>Guide</Eyebrow>
          </div>

          <h1 className="mt-10 max-w-[24ch] font-display text-3xl font-extrabold text-fg">
            {post.title}
          </h1>
          <p className="mt-6 max-w-[58ch] text-md text-fg-muted">{post.description}</p>
          <div className="mt-8">
            <Byline post={post} />
          </div>
        </SectionFrame>

        <SectionFrame surface="stock" padding="lg" id="article" ticket={{ number: "02", label: "ARTICLE", spec: `${post.wordCount} WORDS` }}>
          <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12">
            {/* Contents first in the DOM on desktop only via order, so the
                article is what a reader lands on with a narrow viewport. */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              <TableOfContents entries={headings} />
            </div>

            <article className="order-1 min-w-0 lg:order-2 lg:col-span-8 lg:col-start-5">
              <MDXRemote
                source={post.body}
                components={mdxComponents}
                options={{
                  parseFrontmatter: false,
                  mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
                }}
              />

              <div className="mt-16 border-t border-rule pt-8">
                <p className={`${SPEC} text-fg-faint`}>Next step</p>
                <p className="mt-4 max-w-[46ch] font-display text-xl font-bold text-fg">
                  Send us the job and we will price it exactly.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/quote" size="lg">
                    Get a quote in 24hrs
                  </Button>
                  <Button href="/packages" size="lg" variant="outline">
                    See the packages
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </SectionFrame>

        {related.length > 0 ? (
          <SectionFrame surface="stock" padding="lg" id="related" ticket={{ number: "03", label: "RELATED", spec: "SHARED SUBJECTS" }}>
            <Eyebrow spec="READ NEXT">Related guides</Eyebrow>
            <div className="mt-10 grid gap-x-gutter gap-y-12 md:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.slug} post={r} />
              ))}
            </div>
            <p className="mt-12">
              <Link
                href="/blog"
                className={`${SPEC} text-fg-muted underline decoration-rule underline-offset-4 transition-colors hover:text-fg hover:decoration-mark`}
              >
                All guides
              </Link>
            </p>
          </SectionFrame>
        ) : null}

        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
