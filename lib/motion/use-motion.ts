"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { REDUCED_MOTION_QUERY, prefersReducedMotion } from "./preferences";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type MotionContext = {
  /** The scope element, if one was given. */
  scope: Element | null;
  /** Always false inside `animate`, always true inside `settle`. */
  reduced: boolean;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /**
   * Register teardown for anything gsap.context() can't revert on its own —
   * event listeners, observers, timers. Runs before every re-setup and on
   * unmount.
   */
  cleanup: (fn: () => void) => void;
};

export type UseMotionConfig = {
  /** Element to scope selector text and inline-style reverts to. */
  scope?: RefObject<Element | null>;
  deps?: unknown[];
  /** Runs only when motion is allowed. */
  animate?: (ctx: MotionContext) => void;
  /**
   * Runs *instead of* `animate` when reduced motion is on. Only needed when
   * the finished state isn't already what the server rendered — a CounterRoll
   * showing its final number, say. Most primitives can omit it entirely.
   */
  settle?: (ctx: MotionContext) => void;
};

/**
 * The single place this codebase asks about prefers-reduced-motion.
 *
 * No primitive calls matchMedia itself. Each one supplies `animate` and, if
 * its finished state needs setting up, `settle`; this hook picks which runs.
 * That keeps the fallback honest by construction — you cannot write a
 * primitive that forgets to check, because checking isn't yours to do.
 *
 * Everything created inside either callback lives in a gsap.context(), so a
 * route change, a dependency change, or the user flipping the OS setting
 * mid-session reverts it — tweens killed, ScrollTriggers destroyed, inline
 * styles restored to what the server sent.
 */
export function useMotion({ scope, deps = [], animate, settle }: UseMotionConfig): void {
  useIsomorphicLayoutEffect(() => {
    const element = scope?.current ?? null;
    // A ref-scoped hook whose element hasn't mounted has nothing to animate.
    if (scope && !element) return;

    let context: gsap.Context | null = null;
    const teardown: Array<() => void> = [];

    const runTeardown = () => {
      while (teardown.length > 0) {
        try {
          teardown.pop()?.();
        } catch {
          // A failing listener removal must not strand the rest of cleanup.
        }
      }
    };

    const setup = () => {
      context?.revert();
      runTeardown();

      const reduced = prefersReducedMotion();
      const run = reduced ? settle : animate;
      if (!run) return;

      context = gsap.context(() => {
        run({
          scope: element,
          reduced,
          gsap,
          ScrollTrigger,
          cleanup: (fn) => teardown.push(fn),
        });
      }, element ?? undefined);
    };

    setup();

    // Re-decide if the OS preference changes while the page is open.
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onPreferenceChange = () => setup();
    query.addEventListener("change", onPreferenceChange);

    return () => {
      query.removeEventListener("change", onPreferenceChange);
      context?.revert();
      runTeardown();
    };
  }, deps);
}
