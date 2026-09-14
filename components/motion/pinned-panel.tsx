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
 *
 * ⚠️  THE PANEL PINS BELOW THE MASTHEAD, NOT UNDER IT.
 *
 *     It used to be `top-0` and `h-svh`, which was wrong twice over on a
 *     phone. The masthead is `sticky top-0` and 65px tall, so the top 65px of
 *     every panel sat behind it — while `justify-center` went on centring the
 *     content in the full viewport height, pushing it into that dead band.
 *     Then `overflow-hidden` shaved whatever no longer fit: measured at 390px
 *     the five homepage service panels lost 13, 13, 19, 43 and 31 pixels off
 *     the bottom, which on the Gold foil panel was a whole line of copy.
 *
 *     Offsetting by --header-h puts the panel where the reader can see it,
 *     but it does not create room — it takes 65px away, and measuring again
 *     showed the clipping get worse, not better (45, 45, 52, 75, 63). That
 *     is the actual finding: an eyebrow, a heading, a paragraph, a list and
 *     a link do not fit in one phone screen, and no amount of arithmetic
 *     makes them.
 *
 *     SO THE PANEL ONLY PINS FROM lg UP. Below that it is an ordinary
 *     section at its natural height and nothing is clipped, because nothing
 *     is being forced into a box. A full-viewport pinned panel is a desktop
 *     device; on a 390px screen it was only ever hiding copy.
 *
 *     --header-h is published by SiteHeader from the bar's measured height,
 *     so the pinned offset tracks the real masthead rather than a number
 *     someone typed.
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
    <div
      ref={root}
      // `hold` rides in as a custom property because the height it feeds is
      // responsive, and an inline style cannot carry a breakpoint.
      style={{ "--panel-hold": hold } as React.CSSProperties}
      className={cn("relative h-auto lg:h-[calc(100svh+var(--panel-hold))]", className)}
    >
      <div
        className={cn(
          "flex flex-col justify-center overflow-hidden",
          // Mobile and tablet: natural height, no pinning. py-24 here was
          // doubling up with the section's own padding — 192px per panel,
          // 960px across the five of them.
          "py-12 sm:py-16",
          // Desktop: hold still below the masthead for one screen.
          "lg:sticky lg:top-[var(--header-h)] lg:h-[calc(100svh-var(--header-h))] lg:py-0",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
