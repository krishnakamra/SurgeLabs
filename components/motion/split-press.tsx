"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { RegistrationText } from "@/components/ui";
import { startsBelowFold } from "@/lib/motion/preferences";
import { useMotion } from "@/lib/motion/use-motion";

export type SplitPressProps = {
  beforeLabel: string;
  beforeItems: readonly string[];
  afterLabel: string;
  afterItems: readonly string[];
  /**
   * Scroll distance the columns hold for while the plates come into register.
   *
   * This is dead scroll by design — the reader is paying attention to the
   * plates, not travelling. 90vh was too much of it: five staggered rows
   * finish resolving well before the hold releases, so the last third was
   * a locked screen with nothing left happening on it.
   */
  hold?: string;
  className?: string;
};

/**
 * The argument, made by the animation rather than by a tick-and-cross table.
 *
 * The "before" column is five suppliers set as five separate CMYK plates,
 * each badly out of register — the thing you are actually buying when you
 * buy from five vendors. Scrolling pulls them into register one at a time,
 * and as the last one lands the "after" column resolves beside it.
 *
 * Nothing is claimed. The misregistration *is* the claim, and the reader
 * arrives at it themselves.
 *
 * With motion off, every plate sits in register and both columns are plain,
 * legible text — the argument is weaker, but the page still makes it.
 */
export function SplitPress({
  beforeLabel,
  beforeItems,
  afterLabel,
  afterItems,
  hold = "55vh",
  className,
}: SplitPressProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const after = useRef<HTMLDivElement | null>(null);

  useMotion({
    scope: root,
    deps: [beforeItems, afterItems],
    animate({ gsap, scope }) {
      const afterEl = after.current;
      if (!scope || !afterEl) return;
      if (!startsBelowFold(scope)) return;

      const rows = scope.querySelectorAll("[data-registration]");
      if (rows.length === 0) return;

      // Tied to the held range: registration starts as the columns lock and
      // finishes as they release. Scrubbing this against the section's own
      // height instead meant the plates had resolved a third of the way in,
      // so the argument was over before anyone had read it.
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top top", end: "bottom bottom", scrub: true },
      });

      // Plates come into register in sequence, the way a pressman brings up
      // one colour at a time.
      timeline.fromTo(
        rows,
        { "--reg-p": 1 },
        { "--reg-p": 0, ease: "none", stagger: 0.35, duration: 1 },
        0,
      );

      // The answer arrives once most of the mess has resolved.
      timeline.fromTo(
        afterEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.6 },
        0.6,
      );
    },
  });

  return (
    <div
      ref={root}
      style={{ "--split-hold": hold } as React.CSSProperties}
      className={cn("relative lg:h-[calc(100svh+var(--split-hold))]", className)}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden">
        <div className="grid w-full gap-x-gutter gap-y-16 lg:grid-cols-2">
          <div>
            <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
              {beforeLabel}
            </p>
            <ul className="mt-10 space-y-6">
              {beforeItems.map((item) => (
                <li key={item}>
                  <RegistrationText
                    as="span"
                    state="scrub"
                    offset="0.22em"
                    className="font-display text-lg font-bold"
                  >
                    {item}
                  </RegistrationText>
                </li>
              ))}
            </ul>
          </div>

          <div ref={after} className="lg:border-l-[length:var(--hairline)] lg:border-rule lg:pl-gutter">
            <p className="font-utility text-2xs uppercase tracking-utility text-accent-text">
              {afterLabel}
            </p>
            <ul className="mt-10 space-y-6">
              {afterItems.map((item) => (
                <li key={item} className="flex gap-4 font-display text-lg font-bold text-fg">
                  <span aria-hidden="true" className="mt-[0.55em] h-[var(--hairline)] w-6 shrink-0 bg-mark" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
