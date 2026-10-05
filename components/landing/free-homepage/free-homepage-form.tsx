"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitQuote } from "@/app/quote/actions";
import { BatchTicket } from "@/components/landing/free-homepage/batch-ticket";
import { captureWithNetlify } from "@/lib/quote/netlify-forms";
import { generateReference } from "@/lib/quote/reference";
import type { QuoteResult } from "@/lib/quote/types";
import { freeHomepage } from "@/content/free-homepage";
import { site } from "@/content";
import { cn } from "@/lib/cn";

const LABEL =
  "block font-utility text-2xs font-medium uppercase tracking-[0.12em] text-fg-faint";
const FIELD = cn(
  "mt-2 w-full border-[length:var(--hairline)] border-rule-strong bg-surface-raised",
  "px-4 py-3 text-base text-fg placeholder:text-fg-faint",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
);

/** The same shape the server action rejects on, checked here so the visitor
 *  is told before a round trip rather than after one. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * The only thing this page is for.
 *
 * It posts through `submitQuote`, the same server action as /quote and
 * /start, so a lead from this ad lands in the same table and the same inbox
 * with the same spam handling and the same store-then-email ordering. There
 * is deliberately no second delivery path to keep working.
 *
 * ONE CONTACT FIELD, not two. Asking for a phone AND an email on a page
 * reached from an ad loses leads for no gain — the action accepts either and
 * rejects only a submission with neither, so this takes one value and routes
 * it by shape. Someone who types a number gets called; someone who types an
 * address gets emailed.
 *
 * The honeypot is named `company_website` because that is what the action
 * checks. The REAL "current website" field is `current_site`, and the two
 * must never be confused — naming the visible one `company_website` would
 * silently discard every lead that filled it in, which is the worst failure
 * this form has available.
 */
export function FreeHomepageForm({
  id = "free-homepage-form",
}: {
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  return (
    <div
      id={id}
      data-surface="stock"
      className="scroll-mt-6 border-[length:var(--hairline)] border-rule bg-surface"
    >
      <BatchTicket />
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          const form = new FormData(event.currentTarget);
          const raw = (key: string) => String(form.get(key) ?? "").trim();

          const contact = raw("contact");
          if (!contact) {
            setError(
              "Leave a phone number or an email so we can send the homepage back.",
            );
            return;
          }
          if (!raw("name")) {
            setError("We need a name to put on the ticket.");
            return;
          }

          // One reference for this lead wherever it ends up recorded.
          const reference = generateReference();
          const copy = {
            reference,
            business: raw("business"),
            name: raw("name"),
            contact,
            current_site: raw("current_site"),
            notes: raw("notes"),
            source: "/free-homepage",
          };
          const isBot = Boolean(raw("company_website"));
          form.set("reference", reference);
          // One field in, the right field out.
          form.set(looksLikeEmail(contact) ? "email" : "phone", contact);
          form.delete("contact");

          const currentSite = String(form.get("current_site") ?? "").trim();
          form.delete("current_site");
          form.set("needs", "website");
          form.set("source", "/free-homepage");
          form.set("started_at", String(startedAt.current));
          form.set(
            "answers",
            JSON.stringify({
              wants: "Free homepage design",
              ...(currentSite ? { "Current website": currentSite } : {}),
            }),
          );

          startTransition(async () => {
            // Both routes at once; the lead is safe if EITHER has it. See
            // lib/quote/netlify-forms.ts for why there are two.
            const [netlify, result] = await Promise.all([
              isBot ? Promise.resolve(false) : captureWithNetlify("free-homepage", copy),
              submitQuote(form).catch(
                (): QuoteResult => ({
                  ok: false,
                  error: `Something went wrong sending that. Please call ${site.phone}.`,
                }),
              ),
            ]);
            if (!netlify && !result.ok) {
              setError(result.error);
              return;
            }
            // The Meta Lead event is sent by /thank-you, once per reference
            // (see SentTicket). Sending it here too would count every lead
            // twice.
            // `for=homepage` tells /thank-you which confirmation to show. Google
            // Ads matches on the path, so the extra parameter costs the
            // conversion nothing.
            router.push(`/thank-you?ref=${reference}&for=homepage`);
          });
        }}
        className="p-5 sm:p-7"
      >
        {/* Off-screen rather than display:none, which some bots skip filling in.
          A zero-size box with overflow-hidden can never contribute to the
          document's width, whichever way it is pushed. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        >
          <label htmlFor={`${id}-company_website`}>Company website</label>
          <input
            id={`${id}-company_website`}
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className={LABEL} htmlFor={`${id}-business`}>
              Business name
            </label>
            <input
              id={`${id}-business`}
              name="business"
              required
              autoComplete="organization"
              placeholder="What it says on the van"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL} htmlFor={`${id}-name`}>
              Your name
            </label>
            <input
              id={`${id}-name`}
              name="name"
              required
              autoComplete="name"
              placeholder="First name is fine"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL} htmlFor={`${id}-contact`}>
              Phone or email
            </label>
            <input
              id={`${id}-contact`}
              name="contact"
              required
              // Not type="email" or type="tel": the field takes either, and
              // either type would put the wrong keyboard up on a phone half the
              // time and fail native validation on the other half.
              inputMode="text"
              autoComplete="tel"
              placeholder="Whichever you prefer"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL} htmlFor={`${id}-current_site`}>
              Current website{" "}
              <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id={`${id}-current_site`}
              name="current_site"
              inputMode="url"
              autoComplete="url"
              placeholder="If you have one"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL} htmlFor={`${id}-notes`}>
              What does your business do?
            </label>
            <textarea
              id={`${id}-notes`}
              name="notes"
              rows={2}
              required
              placeholder="A sentence is plenty"
              className={cn(FIELD, "resize-y")}
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-6 border-l-2 border-accent bg-surface-sunken p-4 text-sm text-fg"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "mt-7 flex w-full items-center justify-center",
            "border-[length:var(--hairline)] border-accent bg-accent px-6 py-5",
            // bg-accent / text-accent-fg is the house pairing: white on magenta,
            // 4.50:1, which clears AA at this size. Filled at rest rather than a
            // hairline that floods on hover, for the same reason /start's button
            // is — hover is not a thing on the phone most of this traffic is
            // holding, and a cold visitor has about a second to find the button.
            "font-display text-base font-extrabold tracking-[0.01em] text-accent-fg",
            "transition-colors duration-200",
            "hover:border-accent-hover hover:bg-accent-hover hover:text-accent-hover-fg",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {pending ? "Sending…" : freeHomepage.cta}
        </button>

        <p className="mt-4 text-center text-sm text-fg-muted">
          {freeHomepage.reassurance}
        </p>

        <p className="mt-5 text-2xs leading-relaxed text-fg-faint">
          We use your details to design your homepage and talk to you about it,
          and nothing else. No list, no newsletter, no passing it on.{" "}
          {/* New tab: the policy has to be reachable from the form, and the
              rule for this page is that nothing navigates away from it except
              the phone number. The page stays put in the original tab. */}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[length:var(--hairline)] underline-offset-2"
          >
            Privacy
          </a>
          . Or call{" "}
          <a
            href={site.phoneHref}
            className="underline decoration-[length:var(--hairline)] underline-offset-2"
          >
            {site.phone}
          </a>
          .
        </p>
      </form>
    </div>
  );
}
