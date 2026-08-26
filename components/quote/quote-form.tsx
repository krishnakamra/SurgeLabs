"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { submitQuote } from "@/app/quote/actions";
import { JobTicket } from "@/components/quote/job-ticket";
import { ChoiceField, TextArea, TextField } from "@/components/quote/fields";
import { Button } from "@/components/ui";
import {
  budgetOptions,
  deadlineOptions,
  quoteBranches,
  type QuoteField,
} from "@/content/quote-form";
import { packages, priceLabel, site } from "@/content";
import { cn } from "@/lib/cn";
import type { QuoteAnswers, QuoteContact } from "@/lib/quote/types";

const SPEC = "font-utility text-2xs uppercase tracking-utility";
const STEPS = ["What you need", "The spec", "When and how much", "Who you are"] as const;

const EMPTY_CONTACT: QuoteContact = { name: "", business: "", email: "", phone: "", city: "", notes: "" };

export function QuoteForm({
  initialPackage,
  initialNeeds,
  source,
}: {
  initialPackage: string | null;
  initialNeeds: string[];
  source: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>(initialNeeds);
  const [answers, setAnswers] = useState<QuoteAnswers>({});
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [contact, setContact] = useState<QuoteContact>(EMPTY_CONTACT);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Honeypot + timing. Both invisible to a person filling the form in.
  const honeypot = useRef<HTMLInputElement | null>(null);
  const startedAt = useRef<number>(Date.now());

  const chosenPackage = useMemo(
    () => packages.find((p) => p.slug === initialPackage) ?? null,
    [initialPackage],
  );

  const activeBranches = useMemo(
    () => quoteBranches.filter((branch) => needs.includes(branch.id)),
    [needs],
  );

  const submission = { needs, packageSlug: initialPackage, answers, deadline, budget, contact };

  const setAnswer = (id: string, value: string | string[]) =>
    setAnswers((current) => ({ ...current, [id]: value }));

  const toggleNeed = (id: string) =>
    setNeeds((current) => (current.includes(id) ? current.filter((n) => n !== id) : [...current, id]));

  // ── Per-step gating ─────────────────────────────────────────────────
  const missingRequired = (fields: readonly QuoteField[]) =>
    fields.filter((field) => {
      if (!("required" in field) || !field.required) return false;
      const value = answers[field.id];
      return Array.isArray(value) ? value.length === 0 : !value;
    });

  const stepValid = (() => {
    if (step === 0) return needs.length > 0;
    if (step === 1) return activeBranches.every((b) => missingRequired(b.fields).length === 0);
    if (step === 2) return Boolean(deadline);
    return Boolean(contact.name.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email);
  })();

  const go = (next: number) => {
    setError(null);
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)));
    // Bring the top of the step into view without fighting Lenis.
    document.getElementById("quote-steps")?.scrollIntoView({ block: "start" });
  };

  const send = () => {
    setError(null);
    const form = new FormData();
    form.set("needs", needs.join(","));
    form.set("answers", JSON.stringify(answers));
    form.set("deadline", deadline);
    form.set("budget", budget);
    form.set("package", initialPackage ?? "");
    form.set("source", source ?? "");
    for (const [key, value] of Object.entries(contact)) form.set(key, value);
    form.set("company_website", honeypot.current?.value ?? "");
    form.set("started_at", String(startedAt.current));
    if (file) form.set("artwork", file);

    startTransition(async () => {
      const result = await submitQuote(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Hand the completed ticket to the success page. sessionStorage rather
      // than a query string: the spec is long, and it is nobody else's
      // business in a shared browser history.
      try {
        sessionStorage.setItem(
          `surge:quote:${result.reference}`,
          JSON.stringify({
            ...submission,
            reference: result.reference,
            attachment: file ? { name: file.name, size: file.size, type: file.type } : null,
            submittedAt: new Date().toISOString(),
            emailed: result.emailed,
          }),
        );
      } catch {
        // Private mode, or storage full. The success page copes without it.
      }
      router.push(`/quote/sent?ref=${result.reference}`);
    });
  };

  return (
    <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12">
      <div id="quote-steps" className="lg:col-span-7">
        {/* Progress */}
        <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b-[length:var(--hairline)] border-rule pb-5">
          {STEPS.map((label, index) => (
            <li key={label} className={cn(SPEC, index === step ? "text-accent-text" : index < step ? "text-fg" : "text-fg-faint")}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")} </span>
              {label}
              {index < step ? <span className="sr-only"> (done)</span> : null}
            </li>
          ))}
        </ol>

        <div className="mt-12">
          {/* ── Step 1: needs ───────────────────────────────────────── */}
          {step === 0 ? (
            <section aria-labelledby="step-needs">
              <h2 id="step-needs" className="font-display text-2xl font-extrabold text-fg">
                What do you need?
              </h2>
              <p className="mt-4 max-w-[52ch] text-fg-muted">
                Pick everything that applies. We will only ask spec questions for what you choose.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {quoteBranches.map((branch) => {
                  const on = needs.includes(branch.id);
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleNeed(branch.id)}
                      className={cn(
                        "border-[length:var(--hairline)] p-5 text-left transition-colors duration-[var(--dur-snap)] ease-press",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                        on ? "border-accent bg-accent text-accent-fg" : "border-rule-strong text-fg hover:border-fg",
                      )}
                    >
                      <span className="block font-display text-lg font-bold">{branch.label}</span>
                      <span className={cn("mt-1 block text-sm", on ? "text-accent-fg/80" : "text-fg-muted")}>
                        {branch.hint}
                      </span>
                    </button>
                  );
                })}
              </div>

              {chosenPackage ? (
                <div className="mt-10 border-l-2 border-accent bg-surface-raised p-6">
                  <p className={cn(SPEC, "text-fg-faint")}>From the packages page</p>
                  <p className="mt-3 font-display text-lg font-bold text-fg">
                    {chosenPackage.name} — {priceLabel(chosenPackage)}
                  </p>
                  <p className="mt-3 text-sm text-fg-muted">
                    We have attached this package to your ticket. Add anything above that it does not
                    already cover.
                  </p>
                </div>
              ) : null}
            </section>
          ) : null}

          {/* ── Step 2: the spec ────────────────────────────────────── */}
          {step === 1 ? (
            <section aria-labelledby="step-spec">
              <h2 id="step-spec" className="font-display text-2xl font-extrabold text-fg">
                The spec
              </h2>
              <p className="mt-4 max-w-[52ch] text-fg-muted">
                These are the questions we have to answer before anyone can price the job. Skip
                anything you do not know — we will ask.
              </p>

              {chosenPackage ? (
                <div className="mt-10 border-[length:var(--hairline)] border-rule bg-surface-raised p-6">
                  <p className={cn(SPEC, "text-fg-faint")}>
                    {chosenPackage.name} · included, read-only
                  </p>
                  <ul className="mt-5 space-y-4">
                    {chosenPackage.deliverables.map((group) => (
                      <li key={group.group}>
                        <p className={cn(SPEC, "text-accent-text")}>{group.group}</p>
                        <ul className="mt-2 space-y-1.5">
                          {group.items.map((item) => (
                            <li key={item} className="flex gap-3 text-sm text-fg-muted">
                              <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-3 shrink-0 bg-rule-strong" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {activeBranches.length === 0 && !chosenPackage ? (
                <p className="mt-10 text-fg-muted">Nothing to spec — go back and pick what you need.</p>
              ) : null}

              <div className="mt-12 space-y-14">
                {activeBranches.map((branch) => (
                  <div key={branch.id}>
                    <p className={cn(SPEC, "text-accent-text")}>{branch.ticket}</p>
                    <div className="mt-6 space-y-10 border-t-[length:var(--hairline)] border-rule pt-8">
                      {branch.fields.map((field) =>
                        field.kind === "choice" ? (
                          <ChoiceField
                            key={field.id}
                            field={field}
                            value={answers[field.id]}
                            onChange={(next) => setAnswer(field.id, next)}
                          />
                        ) : field.kind === "textarea" ? (
                          <TextArea
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            placeholder={field.placeholder}
                            value={String(answers[field.id] ?? "")}
                            onChange={(next) => setAnswer(field.id, next)}
                          />
                        ) : (
                          <TextField
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={String(answers[field.id] ?? "")}
                            onChange={(next) => setAnswer(field.id, next)}
                          />
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* ── Step 3: deadline + budget ───────────────────────────── */}
          {step === 2 ? (
            <section aria-labelledby="step-when">
              <h2 id="step-when" className="font-display text-2xl font-extrabold text-fg">
                When, and roughly how much?
              </h2>
              <p className="mt-4 max-w-[52ch] text-fg-muted">
                A budget band is not a commitment. It tells us which options are worth quoting
                instead of sending you three prices you were never going to pick.
              </p>

              <div className="mt-10 space-y-12">
                <ChoiceField
                  field={{ kind: "choice", id: "deadline", label: "Deadline", ticket: "DEADLINE", required: true, options: deadlineOptions }}
                  value={deadline}
                  onChange={(next) => setDeadline(Array.isArray(next) ? (next[0] ?? "") : next)}
                />
                <ChoiceField
                  field={{ kind: "choice", id: "budget", label: "Budget band", ticket: "BUDGET", options: budgetOptions }}
                  value={budget}
                  onChange={(next) => setBudget(Array.isArray(next) ? (next[0] ?? "") : next)}
                />
              </div>
            </section>
          ) : null}

          {/* ── Step 4: contact ─────────────────────────────────────── */}
          {step === 3 ? (
            <section aria-labelledby="step-who">
              <h2 id="step-who" className="font-display text-2xl font-extrabold text-fg">
                Who are we quoting?
              </h2>
              <p className="mt-4 max-w-[52ch] text-fg-muted">
                We reply within one business day with a written quote and the specs above restated,
                so you can compare it to anyone else&rsquo;s.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <TextField id="name" label="Your name" required autoComplete="name" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} />
                <TextField id="business" label="Business" autoComplete="organization" value={contact.business} onChange={(v) => setContact({ ...contact, business: v })} />
                <TextField id="email" label="Email" type="email" required autoComplete="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
                <TextField id="phone" label="Phone" type="tel" autoComplete="tel" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
                <div className="sm:col-span-2">
                  <TextField id="city" label="City" placeholder="Mississauga" autoComplete="address-level2" value={contact.city} onChange={(v) => setContact({ ...contact, city: v })} />
                </div>
                <div className="sm:col-span-2">
                  <TextArea id="notes" label="Anything else" placeholder="Deadlines, a link to the old sign, colours to match…" value={contact.notes} onChange={(v) => setContact({ ...contact, notes: v })} />
                </div>
              </div>

              <div className="mt-10">
                <label htmlFor="artwork" className={cn(SPEC, "block text-fg-faint")}>
                  Artwork, if you have it
                </label>
                <input
                  id="artwork"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.eps,.zip"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className={cn(
                    "mt-3 block w-full text-sm text-fg-muted",
                    "file:mr-4 file:file:border-[length:var(--hairline)] file:border-rule-strong file:bg-transparent",
                    "file:px-4 file:py-2.5 file:font-utility file:text-2xs file:uppercase file:tracking-utility file:text-fg",
                    "hover:file:border-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                  )}
                />
                <p className={cn(SPEC, "mt-3 text-fg-faint")}>
                  PDF, PNG, JPG, SVG, AI, EPS or ZIP · up to 10MB · it reaches us attached to the ticket
                </p>
              </div>

              {/* Honeypot. Off-screen rather than display:none, which some
                  bots skip, and hidden from assistive tech and tab order. */}
              <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-[var(--hairline)] w-[var(--hairline)] overflow-hidden">
                <label htmlFor="company_website">Company website</label>
                <input id="company_website" ref={honeypot} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
            </section>
          ) : null}
        </div>

        {/* Navigation */}
        <div className="mt-14 flex flex-wrap items-center gap-5 border-t-[length:var(--hairline)] border-rule pt-8">
          {step > 0 ? (
            <Button variant="outline" size="md" onClick={() => go(step - 1)} disabled={pending}>
              Back
            </Button>
          ) : null}

          {step < STEPS.length - 1 ? (
            <Button size="md" onClick={() => go(step + 1)} disabled={!stepValid}>
              Next
            </Button>
          ) : (
            <Button size="lg" onClick={send} disabled={!stepValid || pending}>
              {pending ? "Sending the ticket…" : "Send the ticket"}
            </Button>
          )}

          {!stepValid ? (
            <p className={cn(SPEC, "text-fg-faint")}>
              {step === 0
                ? "Pick at least one"
                : step === 3
                  ? "Name and a valid email"
                  : "Answer the starred questions"}
            </p>
          ) : null}
        </div>

        <p aria-live="polite" className="mt-6 min-h-[1.5rem]">
          {error ? <span className="text-sm text-accent-text">{error}</span> : null}
        </p>

        <p className="mt-4 text-sm text-fg-muted">
          Would rather talk?{" "}
          <a href={site.phoneHref} className="text-link underline decoration-1 underline-offset-4">
            {site.phone}
          </a>
          , weekdays 9 to 6.
        </p>
      </div>

      {/* The ticket, building as they go. */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-10">
          <JobTicket submission={submission} />
          <p className={cn(SPEC, "mt-4 text-fg-faint")}>
            This is the sheet that reaches the shop floor
          </p>
        </div>
      </aside>
    </div>
  );
}
