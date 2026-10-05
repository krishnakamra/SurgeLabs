"use client";

import { useBatchCountdown } from "@/lib/hooks/use-batch-countdown";

/**
 * Time left in the current free-design batch, as one line of text.
 *
 * WHY THIS ONE IS ALLOWED TO EXIST. It counts down to the end of the calendar
 * month in Toronto — a date anyone can check against a calendar, identical
 * for every visitor, unchanged by reloading, clearing cookies or opening the
 * page in a private window. When it reaches zero it does not reset: the month
 * genuinely turns over and the next batch genuinely opens.
 *
 * What this deliberately is NOT: a per-visitor timer seeded at 15:00 on page
 * load. That is the usual implementation, and it is a deceptive practice
 * under the Competition Act, a Google Ads Misrepresentation violation that
 * gets the account suspended, and — on top of being both of those — it
 * converts worse than a specific true thing once anyone reloads the page and
 * watches it start over.
 *
 * The deadline used to arrive as a prop computed during server render. On a
 * statically generated page that means computed at BUILD time, so a page
 * built in October showed a clock stuck at zero all of November. It now comes
 * from useBatchCountdown, which works it out in the browser from the current
 * date. See that hook.
 *
 * Renders a reserved blank line until mounted, so the layout does not jump
 * when it fills in.
 */
export function BatchClock({ className }: { className?: string }) {
  const left = useBatchCountdown();
  if (!left) return <p className={className} aria-hidden="true">&nbsp;</p>;

  const pad = (n: number) => String(n).padStart(2, "0");
  const value =
    left.days > 0
      ? `${left.days}d ${pad(left.hours)}h ${pad(left.minutes)}m`
      : left.still
        ? `${left.hours}h ${pad(left.minutes)}m`
        : `${pad(left.hours)}:${pad(left.minutes)}:${pad(left.seconds)}`;

  return (
    <p className={className}>
      <span className="text-fg-muted">This month&rsquo;s free designs close in </span>
      <span className="whitespace-nowrap font-numeral font-black tabular-nums text-accent-text">
        {value}
      </span>
    </p>
  );
}
