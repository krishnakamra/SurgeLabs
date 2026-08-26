import type { Metadata, Viewport } from "next";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { MotionProvider } from "@/components/motion";
import { SiteHeader } from "@/components/sections";
import { JobTicketRail, SkipLink } from "@/components/ui";
import { site } from "@/content";
import { META_PIXEL_ID, analyticsEnabled } from "@/lib/analytics/config";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Without this, relative OG and canonical URLs resolve against
  // localhost:3000 in the built output.
  metadataBase: new URL(site.url),
  title: "Surge Labs",
  description:
    "Full-service agency in Mississauga, Ontario. Design, web, print and signage, custom apparel — all in-house.",
  alternates: {
    types: {
      // Discovery hint for /llms.txt. The convention says the file lives at
      // the root and that is where it is; this only means a crawler that
      // reads the head does not have to guess that it exists.
      "text/plain": [{ url: "/llms.txt", title: "Surge Labs, in plain text" }],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0E",
};

/**
 * Runs synchronously before the browser paints anything below it, so the
 * off-register and pre-reveal styles are either in force on the very first
 * frame or never applied at all. Without this, arming an above-the-fold hero
 * would mean JS hiding text the visitor had already read — the thing we are
 * not allowed to do.
 *
 * No JS, or reduced motion, and the attribute never appears: every gated
 * style stays off and the server's finished markup stands.
 */
const MOTION_BOOT = `(function(){try{document.documentElement.dataset.motion=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"ready"}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The document sits on the press bed by default; sheets override it.
    <html lang="en-CA" data-surface="ink" className={fontVariables}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
        <MotionProvider>
          <SkipLink />
          <JobTicketRail />
          {/* The masthead lives here, not in each page, so a new route cannot
              ship without the logo on it. The footer is still per-page — it
              carries the NAP and the link matrix, and /quote/sent deliberately
              does without one. */}
          <SiteHeader />
          {children}
        </MotionProvider>
        {analyticsEnabled ? <MetaPixel pixelId={META_PIXEL_ID} /> : null}
      </body>
    </html>
  );
}
