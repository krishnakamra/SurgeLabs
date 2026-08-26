"use client";

import { useEffect } from "react";

/**
 * Turns on section snapping for the page that renders it.
 *
 * Snapping is CSS — `scroll-snap-type` on the root, `scroll-snap-align` on
 * each section — and it cannot coexist with Lenis, which animates scrollTop
 * frame by frame and never leaves the browser at a rest position to snap
 * from. So this sets an attribute, MotionProvider watches it, and Lenis
 * stands down for as long as it is set. One of the two owns the scroll at
 * any moment, never both.
 *
 * `proximity`, not `mandatory`. Only the hero is a full viewport tall; the
 * sections below it are taller than the screen, and mandatory snap inside a
 * section taller than the viewport traps the reader — every attempt to
 * scroll to the middle gets yanked back to an edge. Proximity snaps when you
 * end a gesture near a boundary and otherwise leaves you alone.
 */
export function SectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    // Reduced motion means no snapping at all: a scroll that finishes
    // somewhere the reader did not choose is exactly the class of movement
    // the setting asks us to stop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.dataset.snap = "on";
    return () => {
      delete root.dataset.snap;
    };
  }, []);

  return null;
}
