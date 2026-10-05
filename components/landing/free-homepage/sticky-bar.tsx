"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content";
import { freeHomepage } from "@/content/free-homepage";
import { cn } from "@/lib/cn";

/**
 * The phone-only action bar.
 *
 * The brief's one hard rule for it: it must never cover the form. A fixed bar
 * sitting over the submit button is the single most effective way to stop a
 * landing page converting, and it is a mistake you only see on a real handset
 * — on a desktop at a narrow width the form is short enough that nothing
 * overlaps.
 *
 * So the bar watches the form and hides itself whenever any part of it is on
 * screen. An IntersectionObserver rather than a scroll listener: no work on
 * the main thread between intersections, and no layout read per frame.
 *
 * It also stays hidden until the visitor has moved past the hero. Appearing
 * immediately would put a second, competing call to action directly beneath
 * the real one on the first screen.
 */
export function StickyBar({ formId = "free-homepage-form" }: { formId?: string }) {
  const [visible, setVisible] = useState(false);
  const formOnScreen = useRef(true);
  const pastHero = useRef(false);

  useEffect(() => {
    const form = document.getElementById(formId);
    const hero = document.getElementById("hero-end");
    if (!form) return;

    const sync = () => setVisible(pastHero.current && !formOnScreen.current);

    // A margin at the bottom so the bar is already gone by the time the form
    // is close, rather than flicking out as it arrives.
    const formWatcher = new IntersectionObserver(
      ([entry]) => {
        formOnScreen.current = entry?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: "0px 0px 140px 0px" },
    );
    formWatcher.observe(form);

    let heroWatcher: IntersectionObserver | undefined;
    if (hero) {
      heroWatcher = new IntersectionObserver(([entry]) => {
        pastHero.current = !(entry?.isIntersecting ?? true);
        sync();
      });
      heroWatcher.observe(hero);
    } else {
      pastHero.current = true;
    }

    return () => {
      formWatcher.disconnect();
      heroWatcher?.disconnect();
    };
  }, [formId]);

  return (
    <div
      data-surface="ink"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t-[length:var(--hairline)] border-rule bg-surface",
        // Clears the home indicator on an iPhone, where a bar flush to the
        // bottom edge puts the tap target under the system gesture area.
        "px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-200 ease-out lg:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="flex items-stretch gap-3">
        <a
          href={`#${formId}`}
          className={cn(
            "flex flex-1 items-center justify-center border-[length:var(--hairline)] border-accent bg-accent px-4 py-3.5",
            "font-display text-sm font-extrabold text-accent-fg",
          )}
        >
          {freeHomepage.cta}
        </a>
        <a
          href={site.phoneHref}
          aria-label={`Call ${site.phone}`}
          className={cn(
            "flex items-center justify-center border-[length:var(--hairline)] border-rule-strong px-5",
            "font-utility text-sm text-fg",
          )}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
