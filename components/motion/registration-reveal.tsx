"use client";

import { useRef, type ElementType } from "react";
import { RegistrationText } from "@/components/ui";
import { useMotion } from "@/lib/motion/use-motion";

export type RegistrationRevealProps = {
  children: string;
  as?: ElementType;
  /** Plate spread at rest. Any CSS length; em ties it to type size. */
  offset?: string;
  /**
   * "scroll" scrubs convergence against the element's progress through the
   * viewport. "load" runs it once on mount — for a hero, which is already on
   * screen and has no scroll distance to scrub against.
   */
  trigger?: "scroll" | "load";
  /** ScrollTrigger start, e.g. "top 80%". Ignored when trigger is "load". */
  start?: string;
  /** ScrollTrigger end. Convergence completes here. Ignored on "load". */
  end?: string;
  /** trigger="load" only. */
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * The signature moment: four CMYK plates converging into register, scrubbed
 * against the element's own progress through the viewport.
 *
 * All of it rides on one inherited custom property, --reg-p (1 = fully off
 * register, 0 = registered). GSAP tweens that single value; the stylesheet
 * turns it into four plate offsets and two opacities. Nothing here restates
 * the misregistration geometry, so it cannot drift out of sync with the CSS.
 *
 * First paint: `data-reg="scrub"` ships in the SSR HTML, and the styles it
 * selects are gated behind html[data-motion="ready"], set by a synchronous
 * script before the first frame. So the plates are either off-register from
 * the very first paint, or — no JS, reduced motion — the solid headline the
 * server rendered simply stands. JS never removes text the visitor has seen,
 * and the real words are in the markup either way.
 */
export function RegistrationReveal({
  children,
  as = "span",
  offset = "0.4em",
  trigger = "scroll",
  start = "top 85%",
  end = "top 38%",
  duration = 1.6,
  delay = 0.15,
  className,
}: RegistrationRevealProps) {
  const root = useRef<HTMLElement | null>(null);

  useMotion({
    scope: root,
    deps: [children, trigger, start, end, duration, delay],
    animate({ gsap, scope }) {
      if (!scope) return;

      if (trigger === "load") {
        // The hero is already on screen, so there is no scroll distance to
        // scrub against. The plates are painted off-register on the first
        // frame by CSS; this pulls them home once.
        gsap.to(scope, { "--reg-p": 0, duration, delay, ease: "power3.inOut" });
        return;
      }

      gsap.fromTo(
        scope,
        { "--reg-p": 1 },
        {
          "--reg-p": 0,
          ease: "none",
          scrollTrigger: { trigger: scope, start, end, scrub: true },
        },
      );
    },
  });

  return (
    <RegistrationText
      ref={root}
      as={as}
      offset={offset}
      state="scrub"
      className={className}
    >
      {children}
    </RegistrationText>
  );
}
