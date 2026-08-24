"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useMotion } from "@/lib/motion/use-motion";

const WIDE_QUERY = "(min-width: 64rem)";

export type HorizontalPanelsProps = {
  children: React.ReactNode;
  /** Number of panels. Reserves the scroll distance in CSS, so it must match. */
  count: number;
  /** Width of one panel while running horizontally. */
  panelWidth?: string;
  className?: string;
};

/**
 * Panels that run sideways while the page scrolls down.
 *
 * Held with `position: sticky` and a height the stylesheet works out from the
 * panel count — `100svh + count × panelWidth − 100vw` — rather than
 * ScrollTrigger's `pin`, which injects a spacer after hydration and books
 * real CLS. Nothing is measured in JS to lay this out; GSAP only ever sets a
 * transform on the track.
 *
 * The horizontal layout is gated on `motion-ready` and the `lg` breakpoint, so
 * a phone, a reader with reduced motion, and anyone with JS off all get the
 * same thing: an ordinary stack of cards. Nobody meets a sideways-scrolling
 * price list they cannot operate.
 */
export function HorizontalPanels({
  children,
  count,
  panelWidth = "80vw",
  className,
}: HorizontalPanelsProps) {
  const outer = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);
  const [isWide, setIsWide] = useState(false);

  // Only the wide layout scrolls sideways; re-run setup when that changes.
  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const sync = () => setIsWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useMotion({
    scope: outer,
    deps: [isWide, count, panelWidth],
    animate({ gsap, scope }) {
      const trackEl = track.current;
      if (!scope || !trackEl || !isWide) return;

      gsap.to(trackEl, {
        // A function value plus invalidateOnRefresh so the distance is
        // recomputed on resize rather than baked in at setup.
        x: () => -(trackEl.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    },
  });

  return (
    <div
      ref={outer}
      style={{ "--hp-count": count, "--hp-w": panelWidth } as CSSProperties}
      className={cn(
        "relative motion-ready:lg:h-[calc(100svh+(var(--hp-count)*var(--hp-w))-100vw)]",
        className,
      )}
    >
      <div className="motion-ready:lg:sticky motion-ready:lg:top-0 motion-ready:lg:h-svh motion-ready:lg:overflow-hidden">
        <div
          ref={track}
          data-hp-track
          className="grid gap-gutter motion-ready:lg:flex motion-ready:lg:h-full motion-ready:lg:w-max motion-ready:lg:gap-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
