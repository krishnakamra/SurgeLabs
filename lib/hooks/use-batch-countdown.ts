"use client";

import { useEffect, useState } from "react";
import { webOfferDeadline } from "@/content/offer";
import { prefersReducedMotion } from "@/lib/motion/preferences";

export type BatchCountdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** "October" — the month whose batch is closing, in Toronto. */
  month: string;
  /** "Saturday, October 31" — the closing day, in Toronto. */
  closes: string;
  /** True under prefers-reduced-motion: the clock ticks per minute, not per second. */
  still: boolean;
};

const TZ = "America/Toronto";

/**
 * Time left in this month's free-homepage batch, computed in the browser.
 *
 * IN THE BROWSER, and that is a fix rather than a preference. The landing
 * pages are statically generated, so a deadline computed during render is
 * computed at BUILD time and frozen into the HTML. Built in October, every
 * visitor in November would have seen a clock stuck on zero until somebody
 * happened to redeploy — and an offer that reads as expired is worse than no
 * offer at all.
 *
 * It is still not a per-visitor timer. The deadline is the end of the
 * calendar month in Toronto: the same instant for everyone, unchanged by a
 * reload, a cleared cookie or a private window, and when it passes the month
 * genuinely has turned over and the next batch genuinely has opened. See
 * BatchClock for why the other kind is never acceptable here.
 *
 * Returns null until mounted, so the server markup and the first client
 * render agree. Callers reserve the space so nothing jumps when it fills in.
 */
export function useBatchCountdown(): BatchCountdown | null {
  const [state, setState] = useState<BatchCountdown | null>(null);

  useEffect(() => {
    const still = prefersReducedMotion();
    const monthFmt = new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: TZ });
    const closesFmt = new Intl.DateTimeFormat("en-CA", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: TZ,
    });

    const tick = () => {
      // Recomputed every tick rather than once on mount, so a tab left open
      // across midnight on the last day rolls into the new batch by itself.
      const deadline = webOfferDeadline(new Date());
      if (!deadline) {
        setState(null);
        return;
      }
      const ms = Math.max(0, deadline.getTime() - Date.now());
      setState({
        days: Math.floor(ms / 86_400_000),
        hours: Math.floor((ms % 86_400_000) / 3_600_000),
        minutes: Math.floor((ms % 3_600_000) / 60_000),
        seconds: Math.floor((ms % 60_000) / 1000),
        month: monthFmt.format(deadline),
        closes: closesFmt.format(deadline),
        still,
      });
    };

    tick();
    // A ticking second is what makes a countdown feel like one, and it is four
    // text nodes — cheap. Under reduced motion it drops to once a minute and
    // the seconds column is not shown.
    const id = window.setInterval(tick, still ? 60_000 : 1000);
    return () => window.clearInterval(id);
  }, []);

  return state;
}
