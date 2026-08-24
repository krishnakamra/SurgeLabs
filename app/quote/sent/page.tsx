import type { Metadata } from "next";
import { Suspense } from "react";
import { SentTicket } from "@/components/quote/sent-ticket";

export const metadata: Metadata = {
  title: "Request received | Surge Labs",
  // A confirmation carrying somebody's spec and reference has no business in
  // a search index. /quote is the page that should rank.
  robots: { index: false, follow: false, nocache: true },
};

export default function QuoteSentPage() {
  // useSearchParams opts a component out of prerendering unless it sits
  // behind a boundary. The fallback is the reference-less state the component
  // already handles, so a slow hydrate shows something sensible.
  return (
    <Suspense fallback={null}>
      <SentTicket />
    </Suspense>
  );
}
