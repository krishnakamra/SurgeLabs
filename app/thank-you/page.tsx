import type { Metadata } from "next";
import { Suspense } from "react";
import { SentTicket } from "@/components/quote/sent-ticket";

/**
 * The conversion page.
 *
 * Every form on the site lands here, and it exists as its own URL for one
 * reason: Google Ads counts a lead when this page loads. A success panel
 * rendered in place on the form's own page is invisible to Ads — there is no
 * second page view to attach a conversion to — so without this route you can
 * see the clicks you paid for and not which of them became enquiries.
 *
 * Set the conversion action in Google Ads to a URL that contains
 * "/thank-you". The site tag in app/layout.tsx sends an explicit page_view on
 * every client-side route change, so the conversion fires even though getting
 * here is an App Router navigation rather than a document load.
 *
 * `noindex, nofollow`: a confirmation carrying someone's reference and spec
 * has no business in a search index, and an indexed thank-you page gets
 * crawled — which fires conversions nobody paid for and poisons the numbers.
 * /quote and /web-design-seo are the pages that should rank.
 */
export const metadata: Metadata = {
  title: "Thank you — we have your request | Surge Labs",
  description:
    "We have your request and one of us will call you back, usually the same day and always within one business day.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  // useSearchParams opts a component out of prerendering unless it sits
  // behind a boundary. The fallback is the reference-less state the component
  // already handles, so a slow hydrate shows something sensible rather than
  // an empty screen — which matters more here than anywhere, because this is
  // the page someone sees immediately after trusting you with their number.
  return (
    <Suspense fallback={null}>
      <SentTicket />
    </Suspense>
  );
}
