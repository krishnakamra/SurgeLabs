import type { MetadataRoute } from "next";
import { site } from "@/content";

export default function robots(): MetadataRoute.Robots {
  // Crawlers that feed answer engines rather than a search index. They are
  // already covered by the `*` rule below — this block is not what lets them
  // in, it is a statement of intent, so that a future default or a copied
  // robots.txt from somewhere else does not quietly lock the business out of
  // the place a growing share of its customers now start.
  //
  // Being crawlable is a precondition, not a strategy. What actually decides
  // whether an assistant names this shop is /llms.txt, the FAQ schema on the
  // service pages, and the fact that every price on the site agrees with
  // every other copy of itself.
  const ANSWER_ENGINES = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "Claude-SearchBot",
    "Google-Extended",
    "PerplexityBot",
    "Perplexity-User",
    "Applebot-Extended",
    "Bingbot",
    "cohere-ai",
    "meta-externalagent",
  ];

  return {
    rules: [
      ...ANSWER_ENGINES.map((userAgent) => ({
        userAgent,
        allow: ["/", "/brand/"],
        disallow: ["/styleguide", "/styleguide/", "/brand$"],
      })),
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
