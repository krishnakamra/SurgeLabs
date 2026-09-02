"use client";

import { useEffect, useState } from "react";
import { cutoffDayLabel, nextCutoff } from "@/lib/time/toronto";
import { prefersReducedMotion } from "@/lib/motion/preferences";

/**
 * Time left until the same-day print cut-off.
 *
 * This is the honest urgency on this page, and it is worth being precise
 * about why it is allowed to be here at all: it is a real deadline the shop
 * genuinely keeps, it is already published as a production spec on the print
 * service page, and it resets by itself every single morning. Nobody has to
 * remember to move it, so it can never quietly become a lie — which is
 * exactly what a hand-set "offer ends midnight" countdown becomes on day two.
 *
 * There is no fake stock counter and no "3 people are viewing this" on this
 * page for the same reason. Invented scarcity is a deceptive practice under
 * the Competition Act, it violates Meta's ad policies, and it converts worse
 * than a specific true thing anyway.
 *
 * Renders nothing until mounted: the server has no viewer clock, and a
 * countdown rendered on the server is a hydration mismatch waiting to happen.
 */
export function CutoffClock({ className }: { className?: string }) {
  const [left, setLeft] = useState<{ h: number; m: number; s: number; day: string } | null>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(prefersReducedMotion());

    const tick = () => {
      const now = new Date();
      const cutoff = nextCutoff(now);
      const ms = Math.max(0, cutoff.getTime() - now.getTime());
      setLeft({
        h: Math.floor(ms / 3_600_000),
        m: Math.floor((ms % 3_600_000) / 60_000),
        s: Math.floor((ms % 60_000) / 1000),
        day: cutoffDayLabel(now, cutoff),
      });
    };

    tick();
    // A minute is enough resolution for a cut-off hours away, and it keeps a
    // per-second repaint off a page that is mostly read.
    const id = window.setInterval(tick, still ? 60_000 : 1000);
    return () => window.clearInterval(id);
  }, [still]);

  if (!left) {
    // Reserve the line so nothing moves when it fills in.
    return <p className={className} aria-hidden="true">&nbsp;</p>;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <p className={className}>
      <span className="text-fg-muted">Approve artwork before 11am {left.day} and it prints {left.day === "today" ? "today" : "that day"}. </span>
      <span className="whitespace-nowrap font-numeral font-black tabular-nums text-accent-text">
        {still ? `${left.h}h ${pad(left.m)}m left` : `${left.h}:${pad(left.m)}:${pad(left.s)} left`}
      </span>
    </p>
  );
}
