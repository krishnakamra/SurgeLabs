"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { REDUCED_MOTION_QUERY } from "@/lib/motion/preferences";

const RESIZE_DEBOUNCE_MS = 180;

/**
 * Owns the animation clock. Renders nothing; mount once inside <body>.
 *
 * ⚠️  THE SCROLL IS THE BROWSER'S. Do not hand it to a smooth-scroll library
 *     again.
 *
 *     This used to run Lenis at `lerp: 0.12`, driven by the GSAP ticker. It
 *     was measured on 2026-09-08: a single wheel notch took 950ms to stop
 *     moving and 452ms to travel 95% of its distance, and it spent the last
 *     700ms of that crawling the final 30 pixels. Native scroll finishes in
 *     about one frame. The owner's description was "slow and hard to
 *     scroll", which is exactly what an exponential ease on every notch
 *     feels like — and no visitor has the site's aesthetic in mind while
 *     they are fighting their own trackpad.
 *
 *     The reason it looked worth having was scrub smoothness. That argument
 *     does not hold: ScrollTrigger attaches to native scroll perfectly well
 *     and every scrubbed effect in components/motion still runs. The library
 *     bought nothing that survived contact with a real input device.
 *
 * What is left here is the parts that were never about hijacking scroll: one
 * clock for every tween, a refresh when late assets change the measurements,
 * and stopping the whole thing when the tab is hidden.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Videos we paused when the tab went away — so returning doesn't start
    // playing something the visitor had deliberately stopped.
    const autoPaused = new Set<HTMLVideoElement>();
    let resizeTimer: number | undefined;
    let lastWidth = window.innerWidth;
    let asleep = false;

    // lagSmoothing(0) stops GSAP from fast-forwarding after a stalled frame,
    // which would otherwise jump a scrubbed timeline.
    gsap.ticker.lagSmoothing(0);

    // ── Refresh triggers ──────────────────────────────────────────────────
    // Fonts land after first paint and reflow every measured start/end.
    let fontsSettled = false;
    document.fonts?.ready.then(() => {
      fontsSettled = true;
      ScrollTrigger.refresh();
    });

    const onResize = () => {
      const width = window.innerWidth;
      // Height-only changes on touch are the URL bar, not a real resize.
      const heightOnly = width === lastWidth;
      if (heightOnly && !window.matchMedia("(pointer: fine)").matches) return;
      lastWidth = width;

      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Hidden tab ────────────────────────────────────────────────────────
    const sleep = () => {
      if (asleep) return;
      asleep = true;

      for (const trigger of ScrollTrigger.getAll()) trigger.disable(false, false);
      // Sleeping the ticker halts every tween at once — including looping
      // ones like MarqueeSpec that a hidden tab would otherwise keep paying
      // for.
      gsap.ticker.sleep();

      for (const video of document.querySelectorAll("video")) {
        if (!video.paused) {
          video.pause();
          autoPaused.add(video);
        }
      }
    };

    const wake = () => {
      if (!asleep) return;
      asleep = false;

      gsap.ticker.wake();
      for (const trigger of ScrollTrigger.getAll()) trigger.enable(false);
      ScrollTrigger.refresh();

      for (const video of autoPaused) void video.play().catch(() => {});
      autoPaused.clear();
    };

    const onVisibilityChange = () => (document.hidden ? sleep() : wake());
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ── Preference changes mid-session ────────────────────────────────────
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onPreferenceChange = () => {
      document.documentElement.dataset.motion = query.matches ? "reduced" : "ready";
      ScrollTrigger.refresh();
    };
    query.addEventListener("change", onPreferenceChange);

    // A late-arriving font can beat this effect; catch up if so.
    if (fontsSettled) ScrollTrigger.refresh();

    return () => {
      query.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      gsap.ticker.wake();
    };
  }, []);

  // New route: Next has already reset the scroll position itself, so there is
  // nothing to bring into agreement any more. Just re-measure once the
  // incoming DOM has been painted.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
