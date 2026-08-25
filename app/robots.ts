import type { MetadataRoute } from "next";
import { site } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // /brand/ is explicitly allowed and it matters: the handoff SVGs and
        // the manifest's PWA icons live there. A bare `/brand` disallow would
        // take the icons with the page, and an icon a crawler cannot fetch is
        // an install prompt without a logo on it. Longest match wins, so the
        // anchored rule below still blocks the page itself.
        allow: ["/", "/brand/"],
        // The styleguide and the brand sheet are working tools, not content.
        // Both carry robots meta already; this keeps them out of crawl budget
        // too. `$` anchors to the end of the URL — /brand, never /brand/*.
        disallow: ["/styleguide", "/styleguide/", "/brand$"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
