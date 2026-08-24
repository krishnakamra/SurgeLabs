"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { startsBelowFold } from "@/lib/motion/preferences";
import { useMotion } from "@/lib/motion/use-motion";

export type PinnedPanelProps = {
  children: React.ReactNode;
  /** Extra scroll distance the panel holds for, on top of its own height. */
  hold?: string;
  /** Selector, scoped to this panel, for elements that stagger in on enter. */
  revealSelector?: string;
  className?: string;
  innerClassName?: string;
};

/**
 * A panel that holds still while the page scrolls past it.
 *
 * Deliberately `position: sticky` rather than ScrollTrigger's `pin`.
 * ScrollTrigger pins by injecting a spacer element at refresh time — after
 * hydration — which shifts everything below it and books real CLS. Sticky
 * reserves its scroll distance in the markup, mutates no DOM, costs nothing
 * to lay out, and still holds the panel with JS switched off entirely.
 *
 * `hold` is the extra distance, so the outer box is one viewport plus the
 * hold. Keep it modest: a panel that holds for longer than about 60vh reads
 * as a page that has stopped responding.
 *
 * svh, not vh: the small-viewport unit doesn't change when a mobile URL bar
 * collapses, so the panel can't grow mid-scroll.
 */
export function PinnedPanel({
  children,
  hold = "60vh",
  revealSelector,
  className,
  innerClassName,
}: PinnedPanelProps) {
  const root = useRef<HTMLDivElement | null>(null);

  useMotion({
    scope: root,
    deps: [revealSelector],
    animate({ gsap, scope }) {
      if (!scope || !revealSelector) return;
      if (!startsBelowFold(scope)) return;

      const targets = scope.querySelectorAll(revealSelector);
      if (targets.length === 0) return;

      gsap.from(targets, {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: scope, start: "top 70%", once: true },
      });
    },
  });

  return (
    <div ref={root} className={cn("relative", className)} style={{ height: `calc(100svh + ${hold})` }}>
      <div className={cn("sticky top-0 flex h-svh flex-col justify-center overflow-hidden", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
