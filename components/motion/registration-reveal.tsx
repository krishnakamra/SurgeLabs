"use client";

import { useRef, type ElementType } from "react";
import { RegistrationText } from "@/components/ui";
import { useMotion } from "@/lib/motion/use-motion";

export type RegistrationRevealProps = {
  children: string;
  as?: ElementType;
  /** Plate spread at rest. Any CSS length; em ties it to type size. */
  offset?: string;
  /** ScrollTrigger start, e.g. "top 80%". */
  start?: string;
  /** ScrollTrigger end. Convergence completes here. */
  end?: string;
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
  start = "top 85%",
  end = "top 38%",
  className,
}: RegistrationRevealProps) {
  const root = useRef<HTMLElement | null>(null);

  useMotion({
    scope: root,
    deps: [children, start, end],
    animate({ gsap, scope }) {
      if (!scope) return;

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
