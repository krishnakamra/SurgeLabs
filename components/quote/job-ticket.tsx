import { cn } from "@/lib/cn";
import { ticketRows } from "@/lib/quote/ticket";
import type { QuoteSubmission } from "@/lib/quote/types";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * The spec sheet, filling in as the visitor answers.
 *
 * It is the same `ticketRows` the emails and the success page render from, so
 * what someone watches being built is literally the ticket that reaches the
 * shop floor — not a decorative summary that might disagree with it.
 */
export function JobTicket({
  submission,
  reference,
  className,
  printable = false,
}: {
  submission: Partial<QuoteSubmission>;
  reference?: string;
  className?: string;
  printable?: boolean;
}) {
  const rows = ticketRows(submission);

  return (
    <div
      className={cn("border-[length:var(--hairline)] border-rule bg-surface-raised", printable && "print:border-black", className)}
    >
      <div className="flex items-baseline justify-between gap-4 border-b-[length:var(--hairline)] border-rule px-6 py-4">
        <p className={cn(SPEC, "text-fg-faint")}>Job ticket</p>
        <p className={cn(SPEC, reference ? "text-accent-text" : "text-fg-faint")}>
          {reference ?? "REF PENDING"}
        </p>
      </div>

      <dl className="divide-y divide-rule">
        {rows.map((row) => {
          const filled = row.value.length > 0;
          return (
            <div
              key={row.label}
              data-filled={filled || undefined}
              className="flex flex-col gap-1 px-6 py-3 sm:flex-row sm:gap-4"
            >
              <dt className={cn(SPEC, "shrink-0 text-fg-faint sm:w-[11rem]")}>{row.label}</dt>
              <dd className="min-w-0 text-sm">
                {filled ? (
                  <span className="text-fg">{row.value}</span>
                ) : (
                  // A ruled blank, like an unfilled line on a paper docket,
                  // rather than an empty gap that makes the sheet look broken.
                  <span
                    aria-hidden="true"
                    className="block h-[var(--hairline)] w-24 translate-y-[0.7em] bg-rule-strong"
                  />
                )}
                {!filled ? <span className="sr-only">Not answered yet</span> : null}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
