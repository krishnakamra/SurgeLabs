"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
      </Script>
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
