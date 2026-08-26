"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from "@/lib/motion/preferences";

/**
 * A raking light that follows the cursor across the press sheet.
 *
 * The gesture it imitates is real: a pressman tilts a sheet under a lamp and
 * moves it until the light rakes across the ink, because that is the only
 * way to see whether the plates registered. So the highlight is elliptical
 * and wide rather than a round spotlight, and it is a screen blend rather
 * than an overlay — light added to the sheet, not a white circle sitting on
 * top of it.
 *
 * Two CSS variables, --light-x and --light-y, updated on one rAF per frame.
 * The gradient reads them; nothing re-renders. On touch there is no cursor,
 * so the light stays where the server put it, which is a finished state
 * rather than a broken one — same for reduced motion and for no JS at all.
 */
export function PressLight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let detach: (() => void) | null = null;

    const attach = () => {
      if (detach || prefersReducedMotion()) return;
      // No cursor, no effect. A coarse pointer would only ever fire this on
      // tap, which reads as a flicker rather than a light.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const onMove = (event: PointerEvent) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const box = node.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) return;
          const x = ((event.clientX - box.left) / box.width) * 100;
          const y = ((event.clientY - box.top) / box.height) * 100;
          // Outside the sheet: leave the light where it was rather than
          // dragging it to an edge as the pointer leaves.
          if (x < -10 || x > 110 || y < -10 || y > 110) return;
          node.style.setProperty("--light-x", `${x.toFixed(2)}%`);
          node.style.setProperty("--light-y", `${y.toFixed(2)}%`);
        });
      };

      // On the window, not the element. The light sits behind the hero copy
      // at a negative z-index, so it never receives a pointer event of its
      // own — the headline and the buttons are on top of it. The bounds
      // check inside onMove is what keeps it from tracking off-section.
      window.addEventListener("pointermove", onMove, { passive: true });
      detach = () => {
        window.removeEventListener("pointermove", onMove);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        detach = null;
      };
    };

    attach();

    // Someone can turn reduced motion on mid-session.
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onPreference = () => {
      if (prefersReducedMotion()) {
        detach?.();
        node.style.removeProperty("--light-x");
        node.style.removeProperty("--light-y");
      } else {
        attach();
      }
    };
    query.addEventListener("change", onPreference);

    return () => {
      detach?.();
      query.removeEventListener("change", onPreference);
    };
  }, []);

  return (
    <div ref={ref} data-press-light="" className={cn("relative", className)}>
      {children}
    </div>
  );
}
