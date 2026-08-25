import type { MetadataRoute } from "next";
import { site } from "@/content";

/**
 * Web app manifest. Next emits the <link rel="manifest"> for this file
 * automatically — there is nothing to wire up in layout.tsx.
 *
 * The icons are the plate version of the mark: the S knocked out of a solid
 * accent fill, cut from the same geometry as everything else by
 * `npm run gen:brand`. The maskable entry is a separate file rather than the
 * same one listed twice, because Android crops a maskable icon to its own
 * shape and the mark has to come in to clear the safe zone — see
 * MASKABLE_SCALE in scripts/generate-brand-assets.mjs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — web, print, signage and custom apparel`,
    short_name: site.name,
    description:
      "Full-service agency in Mississauga, Ontario. Web and digital, print and signage, custom apparel — all in-house.",
    start_url: "/",
    // Not "standalone". This is a marketing site, not an app: taking the URL
    // bar away from someone who added it to their home screen costs them the
    // back button and the address they were about to share.
    display: "minimal-ui",
    background_color: "#0C0C0E",
    theme_color: "#0C0C0E",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
