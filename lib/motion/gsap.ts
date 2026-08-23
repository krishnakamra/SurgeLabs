"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One registration point for the whole app. Import gsap and ScrollTrigger from
 * here, never from "gsap" directly, so plugin registration can't be missed and
 * config stays in one place.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    // Mobile browsers fire resize when the URL bar collapses mid-scroll.
    // Refreshing on that thrashes every trigger's cached start/end.
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger };
