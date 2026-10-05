"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAfterFirstInteraction } from "@/lib/hooks/use-after-first-interaction";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

/**
 * Meta Pixel.
 *
 * The snippet Meta hands you fires PageView exactly once, when the page
 * loads. That is correct for a site where every navigation is a full document
 * load, and wrong for this one: the App Router moves between routes on the
 * client, so a visitor who lands on the homepage and then reads three service
 * pages would report a single PageView. The effect below re-fires on every
 * pathname change, which is what makes the numbers mean anything.
 *
 * It watches the pathname only, not the query string. `useSearchParams` in
 * the root layout would opt every page out of static rendering, and a query
 * change — /quote?package=momentum-kit — is the same page with a form
 * pre-filled, not a second view of it.
 *
 * `afterInteractive` keeps it off the critical path: the script is requested
 * once the page is usable, so it costs nothing before first paint.
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  // The init snippet fires the first PageView itself. Without this guard the
  // landing page would be counted twice.
  const initialised = useRef(false);
  const loadLibrary = useAfterFirstInteraction();

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      {/* Meta's snippet does two things in one breath: it defines `fbq` as a
          queue, and it injects fbevents.js. They are split here, because
          the second is 213KB of third-party JavaScript and a mobile
          Lighthouse run measured it at 498ms of main-thread blocking — on a
          paid landing page whose brief requires a score of 90. The library
          now waits for the visitor's first touch, scroll or keypress (or 5s
          idle); see useAfterFirstInteraction for why lazyOnload was not
          enough.

          The stub below is Meta's own, minus the script injection. It queues
          `init` and `PageView` immediately, exactly as before, and
          fbevents.js drains that queue whenever it arrives — which is how
          the snippet always worked, since it loads the library async. Nothing
          is dropped by loading it later; it is only sent later. */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window);
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
      </Script>
      {loadLibrary ? (
        <Script
          id="meta-pixel-lib"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
      ) : null}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- a tracking
            pixel is not content; next/image would rewrite it through the
            optimizer and it would never reach Meta. */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
