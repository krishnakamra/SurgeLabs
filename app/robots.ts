import type { MetadataRoute } from "next";
import { site } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The styleguide is a working tool, not content. It carries
        // robots meta already; this keeps it out of crawl budget too.
        disallow: ["/styleguide", "/styleguide/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
