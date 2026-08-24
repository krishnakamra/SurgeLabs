import type { Metadata, Viewport } from "next";
import { MotionProvider } from "@/components/motion";
import { JobTicketRail } from "@/components/ui";
import { site } from "@/content";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Without this, relative OG and canonical URLs resolve against
  // localhost:3000 in the built output.
  metadataBase: new URL(site.url),
  title: "Surge Labs",
  description:
    "Full-service agency in Mississauga, Ontario. Web and digital, print and signage, custom apparel — all in-house.",
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
          <JobTicketRail />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
