import type { Category } from "@/content/posts";
import type { PageSeo } from "./page-seo";

/**
 * Title, description and H1 for each category page.
 *
 * Written per category rather than generated from a template. "Print guides"
 * as an H1 and "Signage guides" as an H1 are two near-identical thin pages;
 * saying what is actually in each one is what stops a category index reading
 * as scaffolding.
 */
const copy: Record<string, PageSeo> = {
  print: {
    title: "Print Guides for Mississauga | Surge Labs",
    description:
      "Card stocks, flyer sizes, bleed and CMYK setup, with real prices. Print guides written for businesses ordering in Mississauga and the GTA.",
    h1: "Print guides: stocks, sizes and setup",
  },
  signage: {
    title: "Signage Guides for the GTA | Surge Labs",
    description:
      "Vehicle graphics, vinyl film grades and trade show kit, with costs and lifespans. Signage guides for businesses across Mississauga and the GTA.",
    h1: "Signage guides: vehicles, vinyl and trade shows",
  },
  apparel: {
    title: "Custom Apparel Guides | Surge Labs",
    description:
      "Screen printing, DTF and embroidery compared on cost, durability and run size. Custom apparel guides for GTA businesses ordering decorated garments.",
    h1: "Custom apparel guides: printing and embroidery",
  },
  "web-seo": {
    title: "Web and SEO Guides for the GTA | Surge Labs",
    description:
      "What a small business website costs and how local search actually works. Web and SEO guides for trades and businesses across the GTA.",
    h1: "Web and SEO guides for GTA businesses",
  },
};

export function categorySeo(category: Category): PageSeo {
  const seo = copy[category.slug];
  if (!seo) {
    // A new category with no SEO copy would otherwise ship as an untitled
    // page. Fail the build instead — this file is two minutes of work.
    throw new Error(
      `lib/seo/blog-seo.ts has no copy for category "${category.slug}". Add it before adding posts.`,
    );
  }
  return seo;
}

export const categorySeoCopy = copy;
