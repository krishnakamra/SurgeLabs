"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitQuote } from "@/app/quote/actions";
import { Button } from "@/components/ui";
import { site } from "@/content";
import { cn } from "@/lib/cn";

const FIELD =
  "w-full border-[length:var(--hairline)] border-rule-strong bg-surface px-4 py-3.5 text-md text-fg " +
  "placeholder:text-fg-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
const LABEL = "block font-utility text-2xs uppercase tracking-utility text-fg-faint";

/**
 * `value` is `<branch>:<slug>` and not just the branch. Two of these map to
 * the same quote branch ("print"), and a <select> with two options sharing a
 * value selects the LAST of them for a given defaultValue — so the offer page
 * opened with "Other printing" preselected instead of the cards it is selling.
 * The suffix keeps them distinct here and is stripped before submitting.
 */
const NEEDS = [
  { value: "print:cards", label: "Business cards" },
  { value: "print:other", label: "Other printing" },
  { value: "signage:sign", label: "A sign, banner or vehicle" },
  { value: "apparel:wear", label: "Shirts, hats or workwear" },
  { value: "design:brand", label: "A logo or artwork" },
  { value: "website:site", label: "A website" },
];

/**
 * The lead form on /start.
 *
 * Three fields visible, one of them optional. Every field beyond a name and a
 * number costs conversions on paid traffic, and everything else about the job
 * gets asked on the phone call anyway — which is the point of the page.
 *
 * It posts through the same server action as the full quote form, so a lead
 * from an ad lands in the same table and the same inbox as one from /quote,
 * with the same spam handling and the same store-then-email ordering. There
 * is no second delivery path to keep working.
 *
 * The success state is rendered in place rather than by navigating. A
 * redirect races the Pixel: the conversion event has to fire and reach Meta
 * before the document goes away, and on a slow phone it frequently does not.
 */
export function LeadForm({ id = "lead-form", compact = false }: { id?: string; compact?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the confirmation. Without this a keyboard or screen-reader
  // user submits and is told nothing happened.
  useEffect(() => {
    if (done) panel.current?.focus();
  }, [done]);

  if (done) {
    return (
      <div
        ref={panel}
        tabIndex={-1}
        className="border-[length:var(--hairline)] border-accent bg-surface-raised p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        <p className="font-utility text-2xs uppercase tracking-utility text-accent-text">
          Reference {done}
        </p>
        <h3 className="mt-5 font-display text-xl font-extrabold text-fg">
          Got it. We&rsquo;ll call you.
        </h3>
        <p className="mt-5 max-w-[40ch] text-md text-fg-muted">
          Usually the same day, always within one business day. The call takes about five minutes:
          what the business is called, what goes on the card, and where to send them.
        </p>
        <p className="mt-6 text-md text-fg-muted">
          In a hurry?{" "}
          <a
            href={site.phoneHref}
            className="font-display font-bold text-fg underline decoration-2 underline-offset-4"
          >
            Call {site.phone}
          </a>{" "}
          and we&rsquo;ll start now.
        </p>
      </div>
    );
  }

  return (
    <form
      id={id}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        const picked = String(form.get("needs") ?? "print:cards");
        const [branch, slug] = picked.split(":");
        form.set("needs", branch ?? "print");
        form.set("started_at", String(startedAt.current));
        // The label the visitor actually chose, so the ticket says "cards"
        // rather than only "print".
        form.set("answers", JSON.stringify({ wants: NEEDS.find((n) => n.value === picked)?.label ?? slug }));
        form.set("source", "/start");

        startTransition(async () => {
          const result = await submitQuote(form);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          // Conversion, before anything can navigate away.
          window.fbq?.("track", "Lead", { content_name: "Business Cards $99" });
          setDone(result.reference);
        });
      }}
      className={cn(
        "border-[length:var(--hairline)] border-rule bg-surface-raised p-7 sm:p-8",
        compact ? "" : "shadow-[0_0_0_1px_var(--color-accent)]",
      )}
    >
      <p className="font-display text-lg font-extrabold text-fg">
        Leave a number. We&rsquo;ll call you back.
      </p>
      <p className="mt-3 text-sm text-fg-muted">
        Two fields. No deposit, no obligation — the call is where we work out what you need.
      </p>

      {/* Honeypot. Off-screen rather than display:none, which some bots skip
          filling in. `overflow-hidden` on a zero-size box means the field can
          never contribute to the document's width, whichever way it is
          pushed — the earlier version leaned on a negative offset alone. */}
      <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-company_website`}>Company website</label>
        <input id={`${id}-company_website`} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 space-y-5">
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
            className={cn(FIELD, "mt-2.5")}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor={`${id}-phone`}>
            Phone
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="905 555 0123"
            className={cn(FIELD, "mt-2.5")}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor={`${id}-needs`}>
            What do you need? <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <select id={`${id}-needs`} name="needs" defaultValue="print:cards" className={cn(FIELD, "mt-2.5")}>
            {NEEDS.map((need) => (
              <option key={need.label} value={need.value}>
                {need.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-6 border-l-2 border-accent bg-surface-sunken p-4 text-sm text-fg">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="submit" variant="solid" size="lg" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Get my $99 cards started"}
        </Button>
      </div>

      <p className="mt-5 text-2xs leading-relaxed text-fg-faint">
        We use your number to call you about this job and nothing else. No list, no newsletter, no
        passing it on.{" "}
        <Link href="/privacy" className="underline decoration-[length:var(--hairline)] underline-offset-2">
          How we handle your details
        </Link>
        .
      </p>
    </form>
  );
}
