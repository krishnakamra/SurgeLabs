"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { hasFinePointer } from "@/lib/motion/preferences";
import { useMotion } from "@/lib/motion/use-motion";

export type MagneticCTAProps = {
  children: React.ReactNode;
  /** Fraction of the pointer's offset from centre that the target follows. */
  strength?: number;
  /** Cap on travel, in px, so it stays a nudge and not a slide. */
  maxOffset?: number;
  className?: string;
};

/**
 * A primary CTA that leans very slightly toward the pointer.
 *
 * Mouse and trackpad only — gated on (hover: hover) and (pointer: fine), so a
 * touch device never arms it and a finger never drags a button around. The
 * reduced-motion check is the hook's job, not this component's.
 *
 * quickTo keeps a single interpolator per axis alive rather than spawning a
 * tween per pointermove, and transform is the only property touched, so this
 * cannot shift layout no matter how far it travels.
 */
export function MagneticCTA({
  children,
  strength = 0.28,
  maxOffset = 12,
  className,
}: MagneticCTAProps) {
  const root = useRef<HTMLSpanElement | null>(null);
  const target = useRef<HTMLSpanElement | null>(null);

  useMotion({
    scope: root,
    deps: [strength, maxOffset],
    animate({ gsap, scope, cleanup }) {
      const el = target.current;
      if (!scope || !el || !hasFinePointer()) return;

      const toX = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const toY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

      const clamp = (n: number) => Math.max(-maxOffset, Math.min(maxOffset, n));

      const onMove = (event: PointerEvent) => {
        const rect = scope.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        toX(clamp(dx * strength));
        toY(clamp(dy * strength));
      };

      const onLeave = () => {
        toX(0);
        toY(0);
      };

      scope.addEventListener("pointermove", onMove as EventListener);
      scope.addEventListener("pointerleave", onLeave);
      // A button can be blurred or disabled mid-hover; don't strand it offset.
      scope.addEventListener("pointercancel", onLeave);

      cleanup(() => {
        scope.removeEventListener("pointermove", onMove as EventListener);
        scope.removeEventListener("pointerleave", onLeave);
        scope.removeEventListener("pointercancel", onLeave);
      });
    },
  });

  return (
    <span ref={root} className={cn("inline-block", className)}>
      <span ref={target} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}
