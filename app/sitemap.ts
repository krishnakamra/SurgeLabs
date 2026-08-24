import type { MetadataRoute } from "next";
import { localPages, packages, services, site } from "@/content";

/**
 * Only pages that exist and carry content.
 *
 * The local entries come from content/local-pages.ts, which throws at import
 * if any of them is missing its copy — so a thin page cannot reach the
 * sitemap even by accident. Submitting URLs you would not defend individually
 * is how a local page cluster gets read as doorway spam.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/packages`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/service-areas`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const local: MetadataRoute.Sitemap = localPages.map((page) => ({
    url: `${site.url}/${page.service}/${page.city}`,
    lastModified: now,
    changeFrequency: "monthly",
    // Below the service pages they roll up to: these are the long tail, and
    // telling Google they matter more than the pages they support is a lie
    // it will notice.
    priority: 0.6,
  }));

  // packages is imported so a future package-detail route is not forgotten
  // here; the teaser links are covered by /packages above.
  void packages;

  return [...staticRoutes, ...servicePages, ...local];
}
