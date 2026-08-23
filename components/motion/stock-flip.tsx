"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { startsBelowFold } from "@/lib/motion/preferences";
import { useMotion } from "@/lib/motion/use-motion";

export type StockFlipProps = {
  children: React.ReactNode;
  /** ScrollTrigger start, e.g. "top 90%". */
  start?: string;
  end?: string;
  className?: string;
};

/**
 * The ink↔stock surface change: the incoming sheet enters from the bottom
 * under a clip-path, led by a 1px magenta line — the sheet edge catching the
 * light as it comes off the press.
 *
 * clip-path and transform only, so nothing reflows and the section occupies
 * its full height from first paint whether or not this ever runs.
 *
 * If the section is already on screen at setup, it is left alone: hiding
 * something the visitor is currently looking at, to then reveal it, is the
 * one thing this codebase does not do.
 */
export function StockFlip({
  children,
  start = "top 92%",
  end = "top 42%",
  className,
}: StockFlipProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const sheet = useRef<HTMLDivElement | null>(null);
  const edge = useRef<HTMLDivElement | null>(null);

  useMotion({
    scope: root,
    deps: [start, end],
    animate({ gsap, scope }) {
      const sheetEl = sheet.current;
      const edgeEl = edge.current;
      if (!scope || !sheetEl || !edgeEl) return;

      // Already in view: leave the server's finished state exactly as it is.
      if (!startsBelowFold(scope)) return;

      const state = { p: 100 };

      const paint = () => {
        // inset(P% 0 0 0) clips P% off the top, so the visible band grows
        // upward from the bottom edge — the sheet sliding in.
        gsap.set(sheetEl, { clipPath: `inset(${state.p}% 0 0 0)` });
        // The edge overlay is full height with its rule on the bottom, so
        // translating it by -(100 - p)% parks that rule exactly on the clip
        // line. Percentages of its own box: transform only, never layout.
        gsap.set(edgeEl, {
          yPercent: -(100 - state.p),
          opacity: state.p > 0.5 && state.p < 99.5 ? 1 : 0,
        });
      };

      paint();

      gsap.to(state, {
        p: 0,
        ease: "none",
        onUpdate: paint,
        scrollTrigger: { trigger: scope, start, end, scrub: true },
      });
    },
  });

  return (
    <div ref={root} className={cn("relative", className)}>
      <div ref={sheet}>{children}</div>
      <div
        ref={edge}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full border-b border-accent opacity-0"
      />
    </div>
  );
}
