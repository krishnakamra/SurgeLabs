"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion/preferences";

/**
 * Time left in the current free-design batch.
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
 * The deadline is computed on the server (content/offer.ts) and passed in as
 * an ISO string, so the viewer's clock cannot move it.
 *
 * Renders a reserved blank line until mounted: a countdown rendered on the
 * server is a hydration mismatch waiting to happen, and reserving the line
 * stops the layout jumping when it fills in.
 */
export function BatchClock({ deadline, className }: { deadline: string; className?: string }) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(prefersReducedMotion());
    const end = new Date(deadline).getTime();
    if (Number.isNaN(end)) return;

    const tick = () => {
      const ms = Math.max(0, end - Date.now());
      setLeft({
        d: Math.floor(ms / 86_400_000),
        h: Math.floor((ms % 86_400_000) / 3_600_000),
        m: Math.floor((ms % 3_600_000) / 60_000),
        s: Math.floor((ms % 60_000) / 1000),
      });
    };

    tick();
    // Seconds only matter on the last day. Above that a minute is plenty, and
    // it keeps a per-second repaint off a page that is mostly read.
    const id = window.setInterval(tick, still ? 60_000 : 1000);
    return () => window.clearInterval(id);
  }, [deadline, still]);

  if (!left) return <p className={className} aria-hidden="true">&nbsp;</p>;

  const pad = (n: number) => String(n).padStart(2, "0");
  const value =
    left.d > 0
      ? `${left.d}d ${pad(left.h)}h ${pad(left.m)}m`
      : still
        ? `${left.h}h ${pad(left.m)}m`
        : `${pad(left.h)}:${pad(left.m)}:${pad(left.s)}`;

  return (
    <p className={className}>
      <span className="text-fg-muted">This month&rsquo;s free designs close in </span>
      <span className="whitespace-nowrap font-numeral font-black tabular-nums text-accent-text">
        {value}
      </span>
    </p>
  );
}
