"use client";

import { useEffect, useState } from "react";

const EVENTS = ["pointerdown", "keydown", "touchstart", "scroll", "wheel"] as const;

/**
 * True once the visitor has done anything at all, or once `idleMs` has
 * passed — whichever comes first.
 *
 * For third-party JavaScript that has to run, but has no business running
 * while the page is still trying to become usable. The Meta Pixel and the
 * Google tag together were ~720ms of long tasks on a mobile Lighthouse run of
 * /free-homepage, and next/script's `lazyOnload` did not fix it: it only
 * moved them to just after `load`, which is still inside the window where
 * blocking time is measured and still inside the first seconds a real visitor
 * on a mid-range phone is trying to scroll.
 *
 * Nothing is lost by waiting. Both tags are queues: `gtag()` pushes onto
 * `dataLayer` and `fbq()` onto `fbq.queue` from the very first render, and
 * the library drains the queue when it arrives. The page view is recorded
 * the instant the page loads; it is only *sent* when the visitor first
 * touches the page, or after `idleMs` if they never do.
 */
export function useAfterFirstInteraction(idleMs = 5000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      cleanup();
      setReady(true);
    };
    const timer = window.setTimeout(go, idleMs);
    const opts: AddEventListenerOptions = { once: true, passive: true, capture: true };
    for (const event of EVENTS) window.addEventListener(event, go, opts);
    function cleanup() {
      window.clearTimeout(timer);
      for (const event of EVENTS) window.removeEventListener(event, go, opts);
    }
    return cleanup;
  }, [idleMs]);

  return ready;
}
