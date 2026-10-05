"use client";

import { useBatchCountdown } from "@/lib/hooks/use-batch-countdown";

const LABEL = "font-utility text-2xs uppercase tracking-utility";

/**
 * The urgency on the hero: this month's batch, counting down, sitting on top
 * of the form so it is the last thing read before the first field.
 *
 * EVERY PART OF IT IS TRUE, which is the only reason it is here.
 *
 *   · There is no cap on it. "Only 10 a month" was here, and the owner never
 *     gave that number; it goes back the day they give a real one.
 *   · The deadline is the end of the calendar month in Toronto, the same for
 *     every visitor. Reloading does not restart it, and when it reaches zero
 *     the month really has turned over.
 *
 * What is deliberately NOT here: a "3 spots left" counter. Showing how many
 * remain would need the real count of this month's requests, and a number
 * that only ever goes down on a timer is the fake-scarcity pattern that gets
 * a Google Ads account suspended for misrepresentation. If that count is
 * ever wired to the database it can go here; until then it does not exist.
 *
 * Four cells are always drawn and the numerals are tabular, so nothing moves
 * as the digits change — and before mount the cells hold dashes at the same
 * size, so nothing moves when they fill in either.
 */
export function BatchTicket() {
  const left = useBatchCountdown();

  const pad = (n: number) => String(n).padStart(2, "0");
  const cells: [string, string][] = [
    [left ? pad(left.days) : "--", "Days"],
    [left ? pad(left.hours) : "--", "Hrs"],
    [left ? pad(left.minutes) : "--", "Min"],
    // Under reduced motion the clock ticks once a minute, so a seconds figure
    // would sit there wrong for up to 59 seconds. Dashes are honest.
    [left && !left.still ? pad(left.seconds) : "--", "Sec"],
  ];

  return (
    <div data-surface="ink" className="bg-surface px-4 pt-3 pb-3.5 text-fg sm:px-7 sm:pt-4 sm:pb-5">
      {/* No "only N a month" here. A cap is a number the owner has to give
          and keep; until they do, the deadline is the only claim on this
          ticket, and it is one anyone can check against a calendar. */}
      <p className={`${LABEL} text-accent-text`}>Free designs this month close in</p>

      {/* role="timer" announces as a live region in some screen readers on
          every change, which at one-second intervals is unusable. The label
          says what it is; the cells are hidden and a once-a-minute summary is
          what assistive tech gets instead. */}
      <div role="timer" aria-label="Time left in this month's free homepage batch">
        <ol aria-hidden="true" className="mt-2.5 grid grid-cols-4 gap-1.5 sm:mt-3.5 sm:gap-2">
          {cells.map(([value, unit]) => (
            <li
              key={unit}
              className="border-[length:var(--hairline)] border-rule-strong bg-surface-raised px-1 pt-1.5 pb-1 text-center sm:px-2 sm:pt-2 sm:pb-1.5"
            >
              <span className="block font-numeral text-lg leading-none font-black tabular-nums text-accent-text sm:text-xl">
                {value}
              </span>
              <span className={`${LABEL} mt-1 block text-fg-faint sm:mt-1.5`}>{unit}</span>
            </li>
          ))}
        </ol>
        <p className="sr-only">
          {left
            ? `${left.days} days, ${left.hours} hours and ${left.minutes} minutes left.`
            : "Time left this month."}
        </p>
      </div>

      <p className="mt-2.5 text-xs text-fg-muted sm:mt-3.5 sm:text-sm">
        {left ? (
          <>
            Closes <span className="text-fg">{left.closes}</span> at 11:59&nbsp;pm.
          </>
        ) : (
          // Reserves the line so the card does not change height on mount.
          <>Closes at the end of the month at 11:59&nbsp;pm.</>
        )}
      </p>
    </div>
  );
}
