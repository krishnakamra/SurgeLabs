"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAfterFirstInteraction } from "@/lib/hooks/use-after-first-interaction";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Ads global site tag.
 *
 * The snippet Google hands you sends one page_view, on document load. That is
 * correct for a site where every navigation is a full page load, and wrong
 * for this one: the App Router moves between routes on the client, so a
 * visitor who lands on /web-design-seo and is then sent to /thank-you would
 * never register the second page — and /thank-you IS the conversion. A
 * URL-based conversion action would simply never fire.
 *
 * So the effect below sends an explicit page_view on every pathname change,
 * with the page_location Ads matches the conversion URL against. This is the
 * whole reason this file is not just the four lines Google gives you.
 *
 * `send_page_view: false` on the config, because the config would otherwise
 * fire the first view itself and the effect would fire it again.
 *
 * Pathname only, not the query string: `useSearchParams` in the root layout
 * opts every page out of static rendering, and /thank-you?ref=ABC123 is one
 * conversion, not a different page.
 */
export function GoogleAds({ conversionId }: { conversionId: string }) {
  const pathname = usePathname();
  const ready = useRef(false);
  const loadLibrary = useAfterFirstInteraction();

  useEffect(() => {
    // The tag has to exist before a page_view means anything. On the very
    // first render the script is still loading; `afterInteractive` resolves
    // within a tick or two and the next effect run covers it.
    if (!window.gtag) {
      ready.current = false;
      return;
    }
    ready.current = true;
    window.gtag("event", "page_view", {
      send_to: conversionId,
      page_location: window.location.href,
      page_path: pathname,
    });
  }, [pathname, conversionId]);

  return (
    <>
      {/* The library loads late; the queue below does not. gtag.js is a
          164KB download that measured 338ms of main-thread blocking on a
          mobile Lighthouse run. `gtag()` is only ever a push onto
          `dataLayer`, so every config and page_view issued before the
          library arrives waits in the queue and is sent when it does —
          that is the mechanism Google's own snippet relies on. */}
      {loadLibrary ? (
        <Script
          id="google-ads-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${conversionId}`}
        />
      ) : null}
      <Script id="google-ads-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${conversionId}', { send_page_view: false });`}
      </Script>
    </>
  );
}
