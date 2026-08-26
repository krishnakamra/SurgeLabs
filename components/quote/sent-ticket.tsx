"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JobTicket } from "@/components/quote/job-ticket";
import { Button, Eyebrow, SectionFrame } from "@/components/ui";
import { site } from "@/content";
import { isReference } from "@/lib/quote/reference";
import type { QuoteSubmission } from "@/lib/quote/types";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

type Stored = Partial<QuoteSubmission> & { emailed?: boolean };

/**
 * The completed ticket, as a spec sheet somebody can print and put in a
 * folder — not a generic thank-you.
 *
 * The submission comes from sessionStorage, written just before the redirect.
 * A direct visit or a cleared session still gets the reference from the URL
 * and the phone number, which is the part that actually matters.
 */
export function SentTicket() {
  const params = useSearchParams();
  const reference = params.get("ref") ?? "";
  const valid = isReference(reference);
  const [submission, setSubmission] = useState<Stored | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!valid) {
      setChecked(true);
      return;
    }
    try {
      const raw = sessionStorage.getItem(`surge:quote:${reference}`);
      if (raw) setSubmission(JSON.parse(raw) as Stored);
    } catch {
      // Private mode or cleared storage — the fallback below covers it.
    }
    setChecked(true);
  }, [reference, valid]);

  return (
    <>
      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="stock"
          as="header"
          padding="lg"
          ticket={{ number: "—", label: "RECEIVED", spec: reference || "NO REF" }}
        >
          <Eyebrow spec={valid ? reference : "REFERENCE MISSING"}>Received</Eyebrow>

          <h1 className="mt-8 max-w-[20ch] font-display text-3xl font-extrabold text-fg">
            {valid ? "Your ticket is on the shop floor." : "We could not find that reference."}
          </h1>

          {valid ? (
            <>
              <p className="mt-8 max-w-[56ch] text-md text-fg-muted">
                Quote your reference{" "}
                <span className="font-utility text-accent-text">{reference}</span> if you call. We
                come back with a written quote within one business day — weekdays, {site.hours[0]?.time}.
              </p>

              {submission?.emailed === false ? (
                <p className="mt-6 max-w-[56ch] border-l-2 border-accent bg-surface-raised p-5 text-sm text-fg-muted">
                  Your request is recorded, but our confirmation email did not go out. Nothing is
                  lost — we have the ticket. If you want it in writing now, call{" "}
                  <a href={site.phoneHref} className="text-link underline decoration-1 underline-offset-4">
                    {site.phone}
                  </a>{" "}
                  and quote the reference.
                </p>
              ) : null}

              <div className="mt-12 flex flex-wrap gap-5 print:hidden">
                <Button size="lg" onClick={() => window.print()}>
                  Print this spec sheet
                </Button>
                <Button size="lg" variant="outline" href="/packages">
                  See packages while you wait
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-8 max-w-[56ch]">
              <p className="text-md text-fg-muted">
                That link has no valid reference on it. If you have just submitted a request, check
                your email for the confirmation — or call{" "}
                <a href={site.phoneHref} className="text-link underline decoration-1 underline-offset-4">
                  {site.phone}
                </a>{" "}
                and we will find it.
              </p>
              <div className="mt-10 print:hidden">
                <Button href="/quote" size="lg">
                  Start a new ticket
                </Button>
              </div>
            </div>
          )}
        </SectionFrame>

        {valid && checked ? (
          <SectionFrame surface="stock" padding="md" cropMarks={false}>
            {submission ? (
              <>
                <JobTicket submission={submission} reference={reference} printable className="max-w-[46rem]" />
                {submission.contact?.notes ? (
                  <div className="mt-8 max-w-[46rem] border-[length:var(--hairline)] border-rule bg-surface-raised p-6">
                    <p className={`${SPEC} text-fg-faint`}>Notes</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-fg-muted">
                      {submission.contact.notes}
                    </p>
                  </div>
                ) : null}
                <p className={`${SPEC} mt-8 text-fg-faint print:hidden`}>
                  This sheet is held in this browser tab only. The copy we work from is in your
                  confirmation email.
                </p>
              </>
            ) : (
              <div className="max-w-[46rem] border-[length:var(--hairline)] border-rule bg-surface-raised p-8">
                <p className={`${SPEC} text-fg-faint`}>Spec sheet not available here</p>
                <p className="mt-4 text-sm text-fg-muted">
                  We have your request under <span className="font-utility text-fg">{reference}</span>,
                  but this browser no longer holds a copy of the sheet — that happens on a refresh in
                  a private window, or if you opened this link on another device. The full spec is in
                  your confirmation email.
                </p>
              </div>
            )}
          </SectionFrame>
        ) : null}

        <SectionFrame surface="ink" padding="md" cropMarks={false} className="print:hidden">
          <p className={`${SPEC} text-fg-faint`}>What happens next</p>
          <ol className="mt-6 grid gap-x-gutter gap-y-6 sm:grid-cols-3">
            {[
              ["01", "We read it", "A person, not an autoresponder. Usually within a few hours."],
              ["02", "We quote it", "Written, with the specs restated so you can compare it."],
              ["03", "You approve", "Nothing goes to production until you sign off a proof."],
            ].map(([step, title, detail]) => (
              <li key={step}>
                <p className="font-numeral text-xl leading-none font-extrabold tabular-nums text-accent-text">{step}</p>
                <p className="mt-4 font-display text-base font-bold text-fg">{title}</p>
                <p className="mt-2 text-sm text-fg-muted">{detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10">
            <Link href="/" className={`${SPEC} text-fg underline decoration-1 underline-offset-[7px] decoration-rule-strong`}>
              Back to the site
            </Link>
          </p>
        </SectionFrame>
      </main>
    </>
  );
}
