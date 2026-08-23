"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { REDUCED_MOTION_QUERY, prefersReducedMotion } from "@/lib/motion/preferences";

const RESIZE_DEBOUNCE_MS = 180;

/**
 * Owns the scroll loop: Lenis driven by GSAP's ticker, so smooth scroll and
 * every ScrollTrigger read the same clock. Two rAF loops fighting each other
 * is what makes scrub animations jitter.
 *
 * Mount once, directly inside <body>. It renders nothing.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Videos we paused when the tab went away — so returning doesn't start
    // playing something the visitor had deliberately stopped.
    const autoPaused = new Set<HTMLVideoElement>();
    let resizeTimer: number | undefined;
    let lastWidth = window.innerWidth;
    let asleep = false;

    const startLenis = () => {
      if (lenisRef.current || prefersReducedMotion()) return;

      const lenis = new Lenis({
        autoRaf: false, // GSAP's ticker drives it, see below
        lerp: 0.12,
        smoothWheel: true,
        // Native momentum on touch. Hijacking it feels broken on a phone.
        syncTouch: false,
        touchMultiplier: 1.6,
        // Routes in-page hash links (the job-ticket rail) through Lenis.
        anchors: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      lenisRef.current = lenis;
    };

    const stopLenis = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    // One clock. lagSmoothing(0) stops GSAP from fast-forwarding after a
    // stalled frame, which would otherwise jump a scrubbed timeline.
    const tick = (time: number) => lenisRef.current?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    startLenis();

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
      resizeTimer = window.setTimeout(() => {
        lenisRef.current?.resize();
        ScrollTrigger.refresh();
      }, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Hidden tab ────────────────────────────────────────────────────────
    const sleep = () => {
      if (asleep) return;
      asleep = true;

      for (const trigger of ScrollTrigger.getAll()) trigger.disable(false, false);
      lenisRef.current?.stop();
      // Sleeping the ticker halts every tween at once — including looping
      // ones like MarqueeSpec that a hidden tab would otherwise keep paying
      // for. It also stops Lenis, since its rAF is a ticker callback.
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
      lenisRef.current?.start();
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
      if (query.matches) stopLenis();
      else startLenis();
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
      gsap.ticker.remove(tick);
      gsap.ticker.wake();
      stopLenis();
    };
  }, []);

  // New route: Next has already reset scroll, so bring Lenis into agreement
  // and re-measure once the incoming DOM has been painted.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
