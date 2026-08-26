"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from "@/lib/motion/preferences";

/**
 * Drives the foil highlight for everything inside it.
 *
 * Sets --foil-pos, which every [data-foil] descendant reads (see the FOIL
 * block in globals.css). One driver per region rather than one per element,
 * so a lockup's mark and wordmark catch the light together instead of
 * lighting independently — that difference is most of what sells it as one
 * piece of stamped metal rather than two gradients.
 *
 * Two inputs, in priority order:
 *
 *   pointer   Where the cursor is across the element, 0–100%. This is the
 *             real effect: you tilt the card and the leaf catches.
 *   scroll    For touch, where there is no cursor. The highlight drifts
 *             across as the element crosses the viewport, which is the same
 *             gesture — the sheet moving under a fixed light.
 *
 * With no JS, or under reduced motion, --foil-pos keeps its initial 50% and
 * the gradient renders as a still highlight. That is a finished state, not a
 * degraded one, and it is what the server already sent.
 */
export function FoilField({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let detach: (() => void) | null = null;

    const set = (percent: number) => {
      // Clamped a little past the edges: the highlight should be able to
      // leave the element entirely, or the gradient looks like it is stuck
      // to the near edge whenever the pointer is outside.
      node.style.setProperty("--foil-pos", `${Math.max(-20, Math.min(120, percent))}%`);
    };

    const attach = () => {
      if (prefersReducedMotion()) return;

      // A cursor beats scroll. `(pointer: fine)` is the honest test for one —
      // a touch device reports coarse and never fires a useful pointermove.
      if (window.matchMedia("(pointer: fine)").matches) {
        const onMove = (event: PointerEvent) => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            const box = node.getBoundingClientRect();
            if (box.width === 0) return;
            set(((event.clientX - box.left) / box.width) * 100);
          });
        };
        const onLeave = () => set(50);

        window.addEventListener("pointermove", onMove, { passive: true });
        node.addEventListener("pointerleave", onLeave);
        return () => {
          window.removeEventListener("pointermove", onMove);
          node.removeEventListener("pointerleave", onLeave);
        };
      }

      // Touch: the element's own travel through the viewport is the light
      // source. Read in a rAF so the scroll listener never measures.
      const onScroll = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const box = node.getBoundingClientRect();
          const travel = window.innerHeight + box.height;
          if (travel === 0) return;
          const progress = (window.innerHeight - box.top) / travel;
          set(progress * 140 - 20);
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    };

    detach = attach() ?? null;

    // Someone turning reduced motion on mid-session should see it stop.
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const onPreferenceChange = () => {
      detach?.();
      detach = null;
      node.style.removeProperty("--foil-pos");
      detach = attach() ?? null;
    };
    media.addEventListener("change", onPreferenceChange);

    return () => {
      media.removeEventListener("change", onPreferenceChange);
      detach?.();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Tag ref={ref as never} className={cn("relative", className)}>
      {children}
    </Tag>
  );
}
