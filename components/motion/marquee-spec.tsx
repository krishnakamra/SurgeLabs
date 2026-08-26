"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { useMotion } from "@/lib/motion/use-motion";

export type MarqueeSpecProps = {
  items: readonly string[];
  /** Seconds for one full pass of the strip. Higher is slower. */
  duration?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
};

/**
 * The spec strip: an endless run of job-ticket data across the sheet.
 *
 * The list is rendered twice and the track is translated by exactly -50%, so
 * the loop point lands where the second copy sits under the first — seamless
 * without measuring anything, which also means it survives a font swap or a
 * resize without needing a refresh.
 *
 * Hovering eases the timeScale to 0 rather than hard-pausing, so a visitor
 * reading a spec doesn't get a jolt. Off-screen it stops entirely, and a
 * hidden tab stops it too via the ticker (see MotionProvider).
 *
 * With motion off it renders as a static strip of the same specs — legible,
 * just not moving. The duplicate copy is aria-hidden so nothing is read twice.
 */
export function MarqueeSpec({
  items,
  duration = 38,
  reverse = false,
  separator = "·",
  className,
}: MarqueeSpecProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useMotion({
    scope: root,
    deps: [items, duration, reverse],
    animate({ gsap, ScrollTrigger, scope, cleanup }) {
      const trackEl = track.current;
      if (!scope || !trackEl) return;

      const tween = gsap.to(trackEl, {
        xPercent: reverse ? 0 : -50,
        ease: "none",
        duration,
        repeat: -1,
      });

      if (reverse) gsap.set(trackEl, { xPercent: -50 });

      const ease = (timeScale: number) =>
        gsap.to(tween, { timeScale, duration: 0.4, ease: "power2.out", overwrite: true });

      const onEnter = () => ease(0);
      const onLeave = () => ease(1);

      scope.addEventListener("pointerenter", onEnter);
      scope.addEventListener("pointerleave", onLeave);
      // Keyboard users tabbing into a link inside the strip get the same stop.
      scope.addEventListener("focusin", onEnter);
      scope.addEventListener("focusout", onLeave);

      // Don't pay for a loop nobody can see.
      const trigger = ScrollTrigger.create({
        trigger: scope,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => (isActive ? tween.play() : tween.pause()),
      });

      cleanup(() => {
        scope.removeEventListener("pointerenter", onEnter);
        scope.removeEventListener("pointerleave", onLeave);
        scope.removeEventListener("focusin", onEnter);
        scope.removeEventListener("focusout", onLeave);
        trigger.kill();
      });
    },
  });

  const strip = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-[2.5ch] pr-[2.5ch]"
    >
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex shrink-0 items-center gap-[2.5ch]">
          <span>{item}</span>
          <span aria-hidden="true" className="text-mark">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={root}
      className={cn(
        "relative flex overflow-hidden border-y-[length:var(--hairline)] border-rule py-4",
        "font-utility text-2xs uppercase tracking-utility whitespace-nowrap text-fg-muted",
        className,
      )}
    >
      <div ref={track} className="flex w-max will-change-transform">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
